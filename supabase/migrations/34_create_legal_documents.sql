-- Migration: Create Legal Documents Versioning System
-- Description: Creates tables to store Terms & Conditions and Privacy Policy versions

-- Create enum for document types
CREATE TYPE public.legal_document_type AS ENUM ('terms', 'privacy_policy');

-- Create legal_documents table
CREATE TABLE public.legal_documents (
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

-- Create index for faster lookups
CREATE INDEX idx_legal_documents_type_current ON public.legal_documents(document_type, is_current) WHERE is_current = true;

-- Add columns to profiles table for tracking acceptance
ALTER TABLE public.profiles
ADD COLUMN IF NOT EXISTS terms_accepted_version TEXT,
ADD COLUMN IF NOT EXISTS terms_accepted_at TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS privacy_accepted_version TEXT,
ADD COLUMN IF NOT EXISTS privacy_accepted_at TIMESTAMPTZ;

-- Drop old columns if they exist (migration from boolean to versioned)
ALTER TABLE public.profiles
DROP COLUMN IF EXISTS terms_accepted,
DROP COLUMN IF EXISTS privacy_accepted,
DROP COLUMN IF EXISTS terms_version,
DROP COLUMN IF EXISTS privacy_version;

-- Enable RLS
ALTER TABLE public.legal_documents ENABLE ROW LEVEL SECURITY;

-- Policy: Everyone can read current legal documents
CREATE POLICY "Anyone can read current legal documents"
ON public.legal_documents
FOR SELECT
USING (is_current = true);

-- Policy: Only admins can insert/update legal documents (placeholder - adjust based on your admin logic)
-- For now, we'll allow service role only
CREATE POLICY "Service role can manage legal documents"
ON public.legal_documents
FOR ALL
USING (auth.role() = 'service_role');

-- Insert initial versions
INSERT INTO public.legal_documents (document_type, version, content, effective_date, is_current)
VALUES 
(
    'terms',
    '1.0',
    E'# Terms and Conditions\n\nLast updated: ' || CURRENT_DATE || E'\n\n## 1. Introduction\nWelcome to Pulwave. By accessing our website, you agree to be bound by these Terms and Conditions.\n\n## 2. Use of Service\nYou agree to use our service for lawful purposes only and in a way that does not infringe the rights of, restrict or inhibit anyone else''s use and enjoyment of the website.\n\n## 3. User Accounts\nTo access certain features of the website, you may be required to create an account. You are responsible for maintaining the confidentiality of your account and password.\n\n## 4. Intellectual Property\nThe content, organization, graphics, design, compilation, and other matters related to the Site are protected under applicable copyrights and other proprietary laws.\n\n## 5. Termination\nWe may terminate or suspend access to our Service immediately, without prior notice or liability, for any reason whatsoever, including without limitation if you breach the Terms.\n\n## 6. Changes to Terms\nWe reserve the right, at our sole discretion, to modify or replace these Terms at any time.\n\n## 7. Contact Us\nIf you have any questions about these Terms, please contact us.',
    CURRENT_DATE,
    true
),
(
    'privacy_policy',
    '1.0',
    E'# Privacy Policy\n\nLast updated: ' || CURRENT_DATE || E'\n\n## 1. Information We Collect\nWe collect information you provide directly to us, such as when you create an account, update your profile, or communicate with us.\n\n## 2. How We Use Your Information\nWe use the information we collect to provide, maintain, and improve our services, to develop new ones, and to protect our users.\n\n## 3. Sharing of Information\nWe do not share your personal information with third parties except as described in this policy.\n\n## 4. Data Security\nWe take reasonable measures to help protect information about you from loss, theft, misuse and unauthorized access, disclosure, alteration and destruction.\n\n## 5. Your Choices\nYou may update, correct or delete information about you at any time by logging into your online account.\n\n## 6. Changes to this Policy\nWe may change this Privacy Policy from time to time. If we make changes, we will notify you by revising the date at the top of the policy.\n\n## 7. Contact Us\nIf you have any questions about this Privacy Policy, please contact us.',
    CURRENT_DATE,
    true
);

-- Create function to ensure only one current version per document type
CREATE OR REPLACE FUNCTION public.ensure_single_current_legal_document()
RETURNS TRIGGER
SECURITY DEFINER
SET search_path = public
LANGUAGE plpgsql
AS $$
BEGIN
    IF NEW.is_current = true THEN
        -- Set all other versions of this document type to not current
        UPDATE public.legal_documents
        SET is_current = false
        WHERE document_type = NEW.document_type
        AND id != NEW.id;
    END IF;
    RETURN NEW;
END;
$$;

-- Create trigger
CREATE TRIGGER trigger_ensure_single_current_legal_document
BEFORE INSERT OR UPDATE ON public.legal_documents
FOR EACH ROW
EXECUTE FUNCTION public.ensure_single_current_legal_document();

-- Add updated_at trigger
CREATE OR REPLACE FUNCTION public.update_legal_documents_updated_at()
RETURNS TRIGGER
SECURITY DEFINER
SET search_path = public
LANGUAGE plpgsql
AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$;

CREATE TRIGGER trigger_update_legal_documents_updated_at
BEFORE UPDATE ON public.legal_documents
FOR EACH ROW
EXECUTE FUNCTION public.update_legal_documents_updated_at();

COMMENT ON TABLE public.legal_documents IS 'Stores versions of legal documents (Terms & Conditions, Privacy Policy)';
COMMENT ON COLUMN public.legal_documents.document_type IS 'Type of legal document';
COMMENT ON COLUMN public.legal_documents.version IS 'Version number (e.g., 1.0, 1.1, 2.0)';
COMMENT ON COLUMN public.legal_documents.content IS 'Full content of the document in markdown format';
COMMENT ON COLUMN public.legal_documents.effective_date IS 'Date when this version became effective';
COMMENT ON COLUMN public.legal_documents.is_current IS 'Whether this is the current active version';
