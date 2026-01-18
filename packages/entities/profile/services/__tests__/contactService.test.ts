/**
 * Contact Service Tests
 */
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { contactService } from '../contactService';
import { profileRepository } from '../../repositories/profileRepository';
import type { Contact } from '../../interfaces/types/Contact';

// Mock repository
vi.mock('../../repositories/profileRepository', () => ({
    profileRepository: {
        findContacts: vi.fn(),
        upsertContact: vi.fn(),
        deleteContact: vi.fn(),
    }
}));

describe('ContactService', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('should get active contacts ordered by primary', async () => {
        const mockContacts: Partial<Contact>[] = [
            { id: 'c1', profile_id: 'p1', contact_type: 'email', contact_value: 'a@test.com', is_active: true, is_primary: false },
            { id: 'c2', profile_id: 'p1', contact_type: 'email', contact_value: 'b@test.com', is_active: true, is_primary: true },
            { id: 'c3', profile_id: 'p1', contact_type: 'email', contact_value: 'c@test.com', is_active: false, is_primary: false },
        ];
        vi.mocked(profileRepository.findContacts).mockResolvedValue(mockContacts as Contact[]);

        const result = await contactService.getByProfileId('p1');
        expect(result).toHaveLength(2);
        expect(result[0].id).toBe('c2'); // Primary first
        expect(result[1].id).toBe('c1');
    });

    it('should get contact by type', async () => {
        const mockContacts: Partial<Contact>[] = [
            { id: 'c1', profile_id: 'p1', contact_type: 'email', contact_value: 'test@test.com', is_active: true, is_primary: true },
        ];
        vi.mocked(profileRepository.findContacts).mockResolvedValue(mockContacts as Contact[]);

        const result = await contactService.getByType('p1', 'email');
        expect(result?.id).toBe('c1');
    });

    it('should upsert contact with correct payload', async () => {
        const data = { phone: '123456789', phone_country_code: '+1' };
        vi.mocked(profileRepository.upsertContact).mockImplementation(async (payload) => payload as Contact);

        const result = await contactService.upsertContact('p1', 'org1', 'phone-primary', data);
        expect(result?.contact_value).toBe('123456789');
        expect(result?.country_code).toBe('+1');
        expect(result?.is_primary).toBe(true);
    });

    it('should map contacts to form data', () => {
        const contacts: Partial<Contact>[] = [
            { id: 'c1', profile_id: 'p1', contact_type: 'phone-primary', contact_value: '123', country_code: '+1', is_primary: true, is_active: true },
            { id: 'c2', profile_id: 'p1', contact_type: 'phone-emergency', name: 'Jane', contact_value: '999', relationship: 'Sister', is_primary: false, is_active: true }
        ];

        const result = contactService.mapToFormData(contacts as Contact[]);
        expect(result.phone_number).toBe('123');
        expect(result.phone_code).toBe('+1');
        expect(result.emergency_contact_name).toBe('Jane');
        expect(result.emergency_contact_relationship).toBe('Sister');
    });
});

