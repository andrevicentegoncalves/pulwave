/**
 * Address Utilities
 * Helper functions for address logic.
 */

export const addressUtils = {
    getRegionFromDistrict(districtName: string): string | null {
        if (!districtName) return null;

        const districtToRegion: Record<string, string> = {
            'Viana do Castelo': 'Norte', 'Braga': 'Norte', 'Porto': 'Norte', 'Vila Real': 'Norte', 'Bragança': 'Norte',
            'Aveiro': 'Centro', 'Viseu': 'Centro', 'Guarda': 'Centro', 'Coimbra': 'Centro', 'Castelo Branco': 'Centro', 'Leiria': 'Centro',
            'Lisboa': 'Lisboa', 'Santarém': 'Lisboa', 'Setúbal': 'Lisboa',
            'Portalegre': 'Alentejo', 'Évora': 'Alentejo', 'Beja': 'Alentejo',
            'Faro': 'Algarve',
            'Açores': 'Açores',
            'Madeira': 'Madeira',
            'Lisbon': 'Lisboa'
        };

        const displayDistrict = districtName === 'Lisbon' ? 'Lisboa' : districtName;
        const region = districtToRegion[displayDistrict] || districtToRegion[districtName];

        return region || null;
    }
};

