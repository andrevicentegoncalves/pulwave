/**
 * Contact Service
 */
import { profileRepository } from '../repositories/profileRepository';
import { Contact } from '../interfaces/types/Contact';

export interface ContactFormData {
    phone?: string;
    email?: string;
    contact_name?: string;
    phone_country_code?: string;
    relationship?: string;
}

export interface ContactFormMappedData {
    phone_code: string;
    phone_number: string;
    phone_secondary_code: string;
    phone_secondary_number: string;
    emergency_contact_name: string;
    emergency_contact_phone: string;
    emergency_contact_relationship: string;
}

export type { Contact };

export const contactService = {
    async getByProfileId(profileId: string): Promise<Contact[]> {
        const contacts = await profileRepository.findContacts(profileId);
        // Filter active and sort by primary if needed, similar to original query
        // Original: .eq('is_active', true).order('is_primary', { ascending: false })
        // Repository currently returns all. We should filter here or repo should filter.
        // Assuming repo returns raw, service applies business logic (active check).
        return contacts
            .filter(c => c.is_active)
            .sort((a, b) => (Number(b.is_primary) - Number(a.is_primary)));
    },

    async getByType(profileId: string, contactType: string): Promise<Contact | null> {
        const contacts = await profileRepository.findContacts(profileId);
        return contacts.find(c => c.contact_type === contactType && c.is_active) || null;
    },

    async upsertContact(
        profileId: string,
        organizationId: string | undefined | null,
        contactType: string,
        data: ContactFormData
    ): Promise<Contact | null> {
        if (!data.phone && !data.email && !data.contact_name) {
            return null;
        }

        const payload: Partial<Contact> = {
            profile_id: profileId,
            contact_type: contactType,
            organization_id: organizationId || undefined,
            contact_value: data.phone || data.email || '',
            country_code: data.phone_country_code || undefined,
            name: data.contact_name || undefined,
            relationship: data.relationship || undefined,
            is_primary: contactType === 'phone-primary',
            is_active: true,
        };

        return profileRepository.upsertContact(payload);
    },

    async deleteContact(id: string): Promise<void> {
        return profileRepository.deleteContact(id);
    },

    extractByType(contacts: Contact[] | undefined | null, type: string): Contact | null {
        return contacts?.find(c => c.contact_type === type) || null;
    },

    mapToFormData(contacts: Contact[] | undefined | null): ContactFormMappedData {
        const primaryPhone = this.extractByType(contacts, 'phone-primary');
        const secondaryPhone = this.extractByType(contacts, 'phone-secondary');
        const emergencyContact = this.extractByType(contacts, 'phone-emergency');

        return {
            phone_code: primaryPhone?.country_code || '',
            phone_number: primaryPhone?.contact_value || '',
            phone_secondary_code: secondaryPhone?.country_code || '',
            phone_secondary_number: secondaryPhone?.contact_value || '',
            emergency_contact_name: emergencyContact?.name || '',
            emergency_contact_phone: emergencyContact?.contact_value || '',
            emergency_contact_relationship: emergencyContact?.relationship || '',
        };
    },
};

export default contactService;


