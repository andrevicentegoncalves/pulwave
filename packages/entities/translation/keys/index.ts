export const translationKeys = {
    all: ['translation'] as const,
    locales: ['translation', 'locales'] as const,
    entity: (type: string, id: string, locale: string) => ['translation', 'entity', type, id, locale] as const,
};
