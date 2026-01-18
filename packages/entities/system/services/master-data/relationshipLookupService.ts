/**
 * Relationship Options Lookup
 */

export interface RelationshipOption {
    value: string;
    label: string;
}

export const RELATIONSHIP_OPTIONS: RelationshipOption[] = [
    { value: '', label: 'Select Relationship' },
    { value: 'spouse', label: 'Spouse' },
    { value: 'partner', label: 'Partner' },
    { value: 'parent', label: 'Parent' },
    { value: 'child', label: 'Child' },
    { value: 'sibling', label: 'Sibling' },
    { value: 'grandparent', label: 'Grandparent' },
    { value: 'grandchild', label: 'Grandchild' },
    { value: 'aunt-uncle', label: 'Aunt/Uncle' },
    { value: 'niece-nephew', label: 'Niece/Nephew' },
    { value: 'cousin', label: 'Cousin' },
    { value: 'friend', label: 'Friend' },
    { value: 'colleague', label: 'Colleague' },
    { value: 'neighbor', label: 'Neighbor' },
    { value: 'caregiver', label: 'Caregiver' },
    { value: 'legal-guardian', label: 'Legal Guardian' },
    { value: 'other', label: 'Other' },
];

export const relationshipLookupService = {
    getRelationshipOptions(): RelationshipOption[] {
        return RELATIONSHIP_OPTIONS;
    },
};


