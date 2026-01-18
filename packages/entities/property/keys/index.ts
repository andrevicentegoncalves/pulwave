export const propertyKeys = {
    all: ['property'] as const,
    list: (filters?: Record<string, any>) => ['property', 'list', filters] as const,
    detail: (id: string) => ['property', 'detail', id] as const,
};
