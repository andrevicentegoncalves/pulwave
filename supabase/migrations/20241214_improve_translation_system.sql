-- =============================================================================
-- MIGRATION: Improve Translation System
-- Date: 2024-12-14
-- Objectives:
--   1. Add more translation categories to master_data
--   2. Seed initial UI translation keys
--   3. Fix enum auto-trigger to create ALL English locales (not just 20)
-- =============================================================================

-- PART 1: Add More Translation Categories
-- -----------------------------------------------------------------------------
INSERT INTO master_data_values (type_key, value_key, value_label, display_order, is_active)
VALUES
    -- Existing categories (ensure they exist)
    ('translation_categories', 'common', 'Common', 10, true),
    ('translation_categories', 'profile', 'Profile', 20, true),
    ('translation_categories', 'validation', 'Validation', 30, true),

    -- New categories
    ('translation_categories', 'navigation', 'Navigation', 40, true),
    ('translation_categories', 'dashboard', 'Dashboard', 50, true),
    ('translation_categories', 'settings', 'Settings', 60, true),
    ('translation_categories', 'auth', 'Authentication', 70, true),
    ('translation_categories', 'forms', 'Forms', 80, true),
    ('translation_categories', 'tables', 'Tables & Lists', 90, true),
    ('translation_categories', 'actions', 'Actions & Buttons', 100, true),
    ('translation_categories', 'messages', 'Messages & Notifications', 110, true),
    ('translation_categories', 'errors', 'Error Messages', 120, true),
    ('translation_categories', 'admin', 'Admin Panel', 130, true),
    ('translation_categories', 'billing', 'Billing & Subscriptions', 140, true),
    ('translation_categories', 'building', 'Building Management', 150, true)
ON CONFLICT (type_key, value_key) DO UPDATE SET
    value_label = EXCLUDED.value_label,
    display_order = EXCLUDED.display_order,
    is_active = EXCLUDED.is_active,
    updated_at = NOW();

-- PART 2: Seed Initial UI Translation Keys
-- -----------------------------------------------------------------------------
-- This includes all translation keys currently used in the app

-- Common translations
INSERT INTO ui_translations (translation_key, locale_code, translated_text, category, source_type, status, is_active)
VALUES
    -- Common - General
    ('common.save', 'en-US', 'Save', 'common', 'ui', 'published', true),
    ('common.cancel', 'en-US', 'Cancel', 'common', 'ui', 'published', true),
    ('common.edit', 'en-US', 'Edit', 'common', 'ui', 'published', true),
    ('common.delete', 'en-US', 'Delete', 'common', 'ui', 'published', true),
    ('common.add', 'en-US', 'Add', 'common', 'ui', 'published', true),
    ('common.close', 'en-US', 'Close', 'common', 'ui', 'published', true),
    ('common.confirm', 'en-US', 'Confirm', 'common', 'ui', 'published', true),
    ('common.submit', 'en-US', 'Submit', 'common', 'ui', 'published', true),
    ('common.search', 'en-US', 'Search', 'common', 'ui', 'published', true),
    ('common.filter', 'en-US', 'Filter', 'common', 'ui', 'published', true),
    ('common.reset', 'en-US', 'Reset', 'common', 'ui', 'published', true),
    ('common.clear', 'en-US', 'Clear', 'common', 'ui', 'published', true),
    ('common.back', 'en-US', 'Back', 'common', 'ui', 'published', true),
    ('common.next', 'en-US', 'Next', 'common', 'ui', 'published', true),
    ('common.previous', 'en-US', 'Previous', 'common', 'ui', 'published', true),
    ('common.loading', 'en-US', 'Loading...', 'common', 'ui', 'published', true),
    ('common.yes', 'en-US', 'Yes', 'common', 'ui', 'published', true),
    ('common.no', 'en-US', 'No', 'common', 'ui', 'published', true),

    -- Common - Sections
    ('common.personal_information', 'en-US', 'Personal Information', 'common', 'ui', 'published', true),
    ('common.contact_information', 'en-US', 'Contact Information', 'common', 'ui', 'published', true),
    ('common.general', 'en-US', 'General', 'common', 'ui', 'published', true),
    ('common.details', 'en-US', 'Details', 'common', 'ui', 'published', true),
    ('common.overview', 'en-US', 'Overview', 'common', 'ui', 'published', true),

    -- Profile translations
    ('profile.first_name', 'en-US', 'First Name', 'profile', 'ui', 'published', true),
    ('profile.middle_name', 'en-US', 'Middle Name', 'profile', 'ui', 'published', true),
    ('profile.last_name', 'en-US', 'Last Name', 'profile', 'ui', 'published', true),
    ('profile.display_name', 'en-US', 'Display Name', 'profile', 'ui', 'published', true),
    ('profile.email', 'en-US', 'Email', 'profile', 'ui', 'published', true),
    ('profile.phone', 'en-US', 'Phone', 'profile', 'ui', 'published', true),
    ('profile.date_of_birth', 'en-US', 'Date of Birth', 'profile', 'ui', 'published', true),
    ('profile.gender', 'en-US', 'Gender', 'profile', 'ui', 'published', true),
    ('profile.timezone', 'en-US', 'Timezone', 'profile', 'ui', 'published', true),
    ('profile.bio', 'en-US', 'Bio', 'profile', 'ui', 'published', true),
    ('profile.avatar', 'en-US', 'Avatar', 'profile', 'ui', 'published', true),

    -- Validation messages
    ('validation.required', 'en-US', 'This field is required', 'validation', 'ui', 'published', true),
    ('validation.invalid_email', 'en-US', 'Invalid email address', 'validation', 'ui', 'published', true),
    ('validation.invalid_phone', 'en-US', 'Invalid phone number', 'validation', 'ui', 'published', true),
    ('validation.min_length', 'en-US', 'Minimum length is {min} characters', 'validation', 'ui', 'published', true),
    ('validation.max_length', 'en-US', 'Maximum length is {max} characters', 'validation', 'ui', 'published', true),

    -- Navigation
    ('navigation.dashboard', 'en-US', 'Dashboard', 'navigation', 'ui', 'published', true),
    ('navigation.profile', 'en-US', 'Profile', 'navigation', 'ui', 'published', true),
    ('navigation.settings', 'en-US', 'Settings', 'navigation', 'ui', 'published', true),
    ('navigation.logout', 'en-US', 'Logout', 'navigation', 'ui', 'published', true),
    ('navigation.admin', 'en-US', 'Admin', 'navigation', 'ui', 'published', true),

    -- Dashboard
    ('dashboard.welcome', 'en-US', 'Welcome', 'dashboard', 'ui', 'published', true),
    ('dashboard.quick_stats', 'en-US', 'Quick Stats', 'dashboard', 'ui', 'published', true),

    -- Settings
    ('settings.language', 'en-US', 'Language', 'settings', 'ui', 'published', true),
    ('settings.preferences', 'en-US', 'Preferences', 'settings', 'ui', 'published', true),
    ('settings.account', 'en-US', 'Account', 'settings', 'ui', 'published', true),
    ('settings.security', 'en-US', 'Security', 'settings', 'ui', 'published', true),

    -- Actions
    ('actions.create', 'en-US', 'Create', 'actions', 'ui', 'published', true),
    ('actions.update', 'en-US', 'Update', 'actions', 'ui', 'published', true),
    ('actions.remove', 'en-US', 'Remove', 'actions', 'ui', 'published', true),
    ('actions.view', 'en-US', 'View', 'actions', 'ui', 'published', true),
    ('actions.export', 'en-US', 'Export', 'actions', 'ui', 'published', true),
    ('actions.import', 'en-US', 'Import', 'actions', 'ui', 'published', true),

    -- Messages
    ('messages.success', 'en-US', 'Success!', 'messages', 'ui', 'published', true),
    ('messages.error', 'en-US', 'Error occurred', 'messages', 'ui', 'published', true),
    ('messages.saved', 'en-US', 'Changes saved successfully', 'messages', 'ui', 'published', true),
    ('messages.deleted', 'en-US', 'Deleted successfully', 'messages', 'ui', 'published', true),

    -- Forms
    ('forms.required_fields', 'en-US', 'Required fields', 'forms', 'ui', 'published', true),
    ('forms.optional', 'en-US', 'Optional', 'forms', 'ui', 'published', true),
    ('forms.placeholder', 'en-US', 'Enter value...', 'forms', 'ui', 'published', true),

    -- Tables
    ('tables.no_data', 'en-US', 'No data available', 'tables', 'ui', 'published', true),
    ('tables.showing_results', 'en-US', 'Showing {from} to {to} of {total} results', 'tables', 'ui', 'published', true),
    ('tables.per_page', 'en-US', 'Per page', 'tables', 'ui', 'published', true)

ON CONFLICT (translation_key, locale_code) DO NOTHING;

-- PART 3: Portuguese Translations (Sample)
-- -----------------------------------------------------------------------------
INSERT INTO ui_translations (translation_key, locale_code, translated_text, category, source_type, status, is_active)
VALUES
    -- Common - Portuguese
    ('common.save', 'pt-PT', 'Guardar', 'common', 'ui', 'published', true),
    ('common.cancel', 'pt-PT', 'Cancelar', 'common', 'ui', 'published', true),
    ('common.edit', 'pt-PT', 'Editar', 'common', 'ui', 'published', true),
    ('common.delete', 'pt-PT', 'Eliminar', 'common', 'ui', 'published', true),
    ('common.add', 'pt-PT', 'Adicionar', 'common', 'ui', 'published', true),
    ('common.close', 'pt-PT', 'Fechar', 'common', 'ui', 'published', true),
    ('common.confirm', 'pt-PT', 'Confirmar', 'common', 'ui', 'published', true),
    ('common.submit', 'pt-PT', 'Enviar', 'common', 'ui', 'published', true),
    ('common.search', 'pt-PT', 'Pesquisar', 'common', 'ui', 'published', true),
    ('common.loading', 'pt-PT', 'A carregar...', 'common', 'ui', 'published', true),
    ('common.yes', 'pt-PT', 'Sim', 'common', 'ui', 'published', true),
    ('common.no', 'pt-PT', 'Não', 'common', 'ui', 'published', true),

    -- Common sections - Portuguese
    ('common.personal_information', 'pt-PT', 'Informação Pessoal', 'common', 'ui', 'published', true),
    ('common.contact_information', 'pt-PT', 'Informação de Contacto', 'common', 'ui', 'published', true),

    -- Profile - Portuguese
    ('profile.first_name', 'pt-PT', 'Primeiro Nome', 'profile', 'ui', 'published', true),
    ('profile.middle_name', 'pt-PT', 'Nome do Meio', 'profile', 'ui', 'published', true),
    ('profile.last_name', 'pt-PT', 'Sobrenome', 'profile', 'ui', 'published', true),
    ('profile.display_name', 'pt-PT', 'Nome de Exibição', 'profile', 'ui', 'published', true),
    ('profile.email', 'pt-PT', 'E-mail', 'profile', 'ui', 'published', true),
    ('profile.phone', 'pt-PT', 'Telefone', 'profile', 'ui', 'published', true),
    ('profile.date_of_birth', 'pt-PT', 'Data de Nascimento', 'profile', 'ui', 'published', true),
    ('profile.gender', 'pt-PT', 'Género', 'profile', 'ui', 'published', true),
    ('profile.timezone', 'pt-PT', 'Fuso Horário', 'profile', 'ui', 'published', true),
    ('profile.bio', 'pt-PT', 'Biografia', 'profile', 'ui', 'published', true),

    -- Dashboard - Portuguese
    ('dashboard.welcome', 'pt-PT', 'Bem-vindo', 'dashboard', 'ui', 'published', true),

    -- Settings - Portuguese
    ('settings.language', 'pt-PT', 'Idioma', 'settings', 'ui', 'published', true),
    ('settings.preferences', 'pt-PT', 'Preferências', 'settings', 'ui', 'published', true)

ON CONFLICT (translation_key, locale_code) DO NOTHING;

-- PART 4: Fix Enum Auto-Trigger - Get ALL English Locales
-- -----------------------------------------------------------------------------
-- Update the function to get ALL English locales from database (not limited to 20)
CREATE OR REPLACE FUNCTION get_english_locales()
RETURNS TEXT[] AS $$
BEGIN
    RETURN ARRAY(
        SELECT code
        FROM locales
        WHERE language_code = 'en'  -- All locales where language is English
          AND is_active = TRUE
        ORDER BY code
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- PART 5: Re-run Enum Population to Fix Missing Locales
-- -----------------------------------------------------------------------------
-- This will populate enum translations for all English locales
SELECT populate_all_enum_translations();

-- PART 6: Add Helper Comments
-- -----------------------------------------------------------------------------
COMMENT ON FUNCTION get_english_locales() IS 'Returns array of ALL active English locale codes (e.g., en-US, en-GB, en-CA, etc.)';
COMMENT ON TABLE ui_translations IS 'Static UI strings for buttons, labels, and messages. Use dot notation for keys (e.g., common.save)';
COMMENT ON TABLE master_data_values IS 'Master data including translation_categories. Always use dot notation for translation keys.';
