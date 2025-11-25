-- Modified migration - skips existing type
-- Run this in Supabase SQL Editor

-- Create legal_documents table (skip if exists)
CREATE TABLE IF NOT EXISTS public.legal_documents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    document_type public.legal_document_type NOT NULL,
    version TEXT NOT NULL,
    content TEXT NOT NULL,
    effective_date DATE NOT NULL DEFAULT CURRENT_DATE,
    is_current BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE(document_type, version)
);

-- Add columns to profiles table (skip if exists)
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name='profiles' AND column_name='terms_accepted_version') THEN
        ALTER TABLE public.profiles
        ADD COLUMN terms_accepted_version TEXT,
        ADD COLUMN terms_accepted_at TIMESTAMPTZ,
        ADD COLUMN privacy_accepted_version TEXT,
        ADD COLUMN privacy_accepted_at TIMESTAMPTZ;
    END IF;
END $$;

-- Enable RLS
ALTER TABLE public.legal_documents ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Anyone can read current legal documents" ON public.legal_documents;
DROP POLICY IF EXISTS "Service role can manage legal documents" ON public.legal_documents;

-- Create RLS policies
CREATE POLICY "Anyone can read current legal documents"
    ON public.legal_documents
    FOR SELECT
    USING (is_current = true);

CREATE POLICY "Service role can manage legal documents"
    ON public.legal_documents
    FOR ALL
    USING (auth.role() = 'service_role');

-- Create or replace function to ensure only one current version
CREATE OR REPLACE FUNCTION public.ensure_single_current_legal_document()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.is_current = true THEN
        UPDATE public.legal_documents
        SET is_current = false
        WHERE document_type = NEW.document_type
          AND id != NEW.id
          AND is_current = true;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Drop trigger if exists and recreate
DROP TRIGGER IF EXISTS ensure_single_current_legal_document_trigger ON public.legal_documents;
CREATE TRIGGER ensure_single_current_legal_document_trigger
    BEFORE INSERT OR UPDATE ON public.legal_documents
    FOR EACH ROW
    EXECUTE FUNCTION public.ensure_single_current_legal_document();

-- Create or replace updated_at trigger
CREATE OR REPLACE FUNCTION public.update_legal_documents_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS update_legal_documents_updated_at_trigger ON public.legal_documents;
CREATE TRIGGER update_legal_documents_updated_at_trigger
    BEFORE UPDATE ON public.legal_documents
    FOR EACH ROW
    EXECUTE FUNCTION public.update_legal_documents_updated_at();

-- Insert initial data (only if table is empty)
INSERT INTO public.legal_documents (document_type, version, content, effective_date, is_current)
SELECT 'terms', '1.0', 
    E'# Terms and Conditions\n\nLast updated: ' || CURRENT_DATE || E'\n\n## 1. Introduction\nWelcome to Pulwave. By accessing our website, you agree to be bound by these Terms and Conditions.\n\n## 2. Use of Service\nYou agree to use our service for lawful purposes only and in a way that does not infringe the rights of, restrict or inhibit anyone else''s use and enjoyment of the website.\n\n## 3. User Accounts\nTo access certain features of the website, you may be required to create an account. You are responsible for maintaining the confidentiality of your account and password.\n\n## 4. Intellectual Property\nThe content, organization, graphics, design, compilation, and other matters related to the Site are protected under applicable copyrights and other proprietary laws.\n\n## 5. Termination\nWe may terminate or suspend access to our Service immediately, without prior notice or liability, for any reason whatsoever, including without limitation if you breach the Terms.\n\n## 6. Changes to Terms\nWe reserve the right, at our sole discretion, to modify or replace these Terms at any time.\n\n## 7. Contact Us\nIf you have any questions about these Terms, please contact us.',
    CURRENT_DATE, true
WHERE NOT EXISTS (SELECT 1 FROM public.legal_documents WHERE document_type = 'terms');

INSERT INTO public.legal_documents (document_type, version, content, effective_date, is_current)
SELECT 'privacy_policy', '1.0',
    E'# Privacy Policy\n\nLast updated: ' || CURRENT_DATE || E'\n\n## 1. Information We Collect\nWe collect information you provide directly to us, such as when you create an account, update your profile, or communicate with us.\n\n## 2. How We Use Your Information\nWe use the information we collect to provide, maintain, and improve our services, to develop new ones, and to protect our users.\n\n## 3. Sharing of Information\nWe do not share your personal information with third parties except as described in this policy.\n\n## 4. Data Security\nWe take reasonable measures to help protect information about you from loss, theft, misuse and unauthorized access, disclosure, alteration and destruction.\n\n## 5. Your Choices\nYou may update, correct or delete information about you at any time by logging into your online account.\n\n## 6. Changes to this Policy\nWe may change this Privacy Policy from time to time. If we make changes, we will notify you by revising the date at the top of the policy.\n\n## 7. Contact Us\nIf you have any questions about this Privacy Policy, please contact us.',
    CURRENT_DATE, true
WHERE NOT EXISTS (SELECT 1 FROM public.legal_documents WHERE document_type = 'privacy_policy');
