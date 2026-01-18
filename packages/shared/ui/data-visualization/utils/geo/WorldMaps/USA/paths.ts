/**
 * USA State Paths
 * 
 * SVG path data for all 50 US states + DC.
 * Simplified paths for web rendering.
 * 
 * ViewBox: 0 0 959 593 (Albers USA projection)
 */

export interface StateData {
    name: string;
    abbr: string;
    path: string;
    coords?: [number, number];
}

export const USA_MAP_VIEWBOX = '0 0 959 593';

// Self-hosted TopoJSON path (download from cdn.jsdelivr.net/npm/us-atlas@3/states-10m.json)
export const USA_TOPOJSON_PATH = '/geo/usa/states-10m.json';

export const USA_STATES_PATHS: Record<string, StateData> = {
    AL: { name: 'Alabama', abbr: 'AL', path: 'M 580 340 L 605 335 L 610 385 L 585 390 Z', coords: [-86.9, 32.8] },
    AK: { name: 'Alaska', abbr: 'AK', path: 'M 120 420 L 200 410 L 210 460 L 130 470 Z', coords: [-153, 64] },
    AZ: { name: 'Arizona', abbr: 'AZ', path: 'M 240 320 L 290 310 L 300 375 L 250 385 Z', coords: [-111.4, 34.0] },
    AR: { name: 'Arkansas', abbr: 'AR', path: 'M 505 320 L 550 315 L 555 355 L 510 360 Z', coords: [-92.3, 34.8] },
    CA: { name: 'California', abbr: 'CA', path: 'M 150 240 L 200 220 L 230 340 L 175 380 L 140 300 Z', coords: [-119.4, 36.8] },
    CO: { name: 'Colorado', abbr: 'CO', path: 'M 305 260 L 380 255 L 385 315 L 310 320 Z', coords: [-105.5, 39.0] },
    CT: { name: 'Connecticut', abbr: 'CT', path: 'M 720 220 L 745 215 L 748 235 L 723 240 Z', coords: [-72.7, 41.6] },
    DE: { name: 'Delaware', abbr: 'DE', path: 'M 705 260 L 720 258 L 722 280 L 707 282 Z', coords: [-75.5, 39.0] },
    FL: { name: 'Florida', abbr: 'FL', path: 'M 620 400 L 680 390 L 700 460 L 650 480 L 610 430 Z', coords: [-81.5, 27.8] },
    GA: { name: 'Georgia', abbr: 'GA', path: 'M 615 340 L 660 335 L 670 400 L 625 405 Z', coords: [-83.4, 32.6] },
    HI: { name: 'Hawaii', abbr: 'HI', path: 'M 280 450 L 340 445 L 345 480 L 285 485 Z', coords: [-155.5, 19.9] },
    ID: { name: 'Idaho', abbr: 'ID', path: 'M 220 140 L 270 130 L 280 220 L 235 235 L 215 180 Z', coords: [-114.5, 44.1] },
    IL: { name: 'Illinois', abbr: 'IL', path: 'M 540 230 L 575 225 L 585 305 L 550 315 L 535 270 Z', coords: [-89.0, 40.0] },
    IN: { name: 'Indiana', abbr: 'IN', path: 'M 580 235 L 610 230 L 615 295 L 585 300 Z', coords: [-86.1, 39.8] },
    IA: { name: 'Iowa', abbr: 'IA', path: 'M 470 220 L 535 215 L 540 265 L 475 270 Z', coords: [-93.2, 41.9] },
    KS: { name: 'Kansas', abbr: 'KS', path: 'M 385 280 L 470 275 L 475 320 L 390 325 Z', coords: [-98.4, 38.5] },
    KY: { name: 'Kentucky', abbr: 'KY', path: 'M 570 295 L 645 290 L 650 325 L 575 330 Z', coords: [-84.9, 37.8] },
    LA: { name: 'Louisiana', abbr: 'LA', path: 'M 505 380 L 560 375 L 570 425 L 515 430 Z', coords: [-91.5, 30.5] },
    ME: { name: 'Maine', abbr: 'ME', path: 'M 745 140 L 775 130 L 785 190 L 755 200 Z', coords: [-69.0, 45.4] },
    MD: { name: 'Maryland', abbr: 'MD', path: 'M 680 265 L 720 260 L 725 285 L 685 290 Z', coords: [-76.6, 39.0] },
    MA: { name: 'Massachusetts', abbr: 'MA', path: 'M 730 200 L 765 195 L 768 215 L 733 220 Z', coords: [-71.5, 42.2] },
    MI: { name: 'Michigan', abbr: 'MI', path: 'M 560 160 L 600 155 L 610 220 L 575 230 L 555 190 Z', coords: [-84.5, 44.3] },
    MN: { name: 'Minnesota', abbr: 'MN', path: 'M 460 140 L 520 135 L 530 205 L 470 210 Z', coords: [-94.6, 46.4] },
    MS: { name: 'Mississippi', abbr: 'MS', path: 'M 550 350 L 580 345 L 590 410 L 560 415 Z', coords: [-89.4, 32.7] },
    MO: { name: 'Missouri', abbr: 'MO', path: 'M 480 275 L 545 270 L 555 340 L 490 345 Z', coords: [-92.4, 38.4] },
    MT: { name: 'Montana', abbr: 'MT', path: 'M 250 120 L 360 110 L 370 175 L 260 185 Z', coords: [-110.4, 47.0] },
    NE: { name: 'Nebraska', abbr: 'NE', path: 'M 360 230 L 455 225 L 460 270 L 365 275 Z', coords: [-99.9, 41.5] },
    NV: { name: 'Nevada', abbr: 'NV', path: 'M 190 220 L 245 210 L 260 310 L 205 325 Z', coords: [-116.8, 39.0] },
    NH: { name: 'New Hampshire', abbr: 'NH', path: 'M 745 175 L 760 172 L 763 200 L 748 203 Z', coords: [-71.6, 43.2] },
    NJ: { name: 'New Jersey', abbr: 'NJ', path: 'M 710 235 L 728 232 L 732 270 L 714 273 Z', coords: [-74.4, 40.0] },
    NM: { name: 'New Mexico', abbr: 'NM', path: 'M 290 320 L 365 315 L 375 395 L 300 400 Z', coords: [-106.2, 34.5] },
    NY: { name: 'New York', abbr: 'NY', path: 'M 680 180 L 745 170 L 755 230 L 690 240 Z', coords: [-75.5, 42.9] },
    NC: { name: 'North Carolina', abbr: 'NC', path: 'M 620 300 L 720 295 L 725 330 L 625 335 Z', coords: [-79.4, 35.5] },
    ND: { name: 'North Dakota', abbr: 'ND', path: 'M 375 130 L 455 125 L 460 175 L 380 180 Z', coords: [-100.5, 47.5] },
    OH: { name: 'Ohio', abbr: 'OH', path: 'M 615 235 L 660 230 L 668 290 L 623 295 Z', coords: [-82.8, 40.1] },
    OK: { name: 'Oklahoma', abbr: 'OK', path: 'M 385 325 L 495 320 L 500 370 L 390 375 Z', coords: [-97.5, 35.5] },
    OR: { name: 'Oregon', abbr: 'OR', path: 'M 150 150 L 230 140 L 240 200 L 160 210 Z', coords: [-120.5, 44.0] },
    PA: { name: 'Pennsylvania', abbr: 'PA', path: 'M 660 225 L 720 220 L 725 260 L 665 265 Z', coords: [-77.4, 41.0] },
    RI: { name: 'Rhode Island', abbr: 'RI', path: 'M 750 215 L 760 213 L 762 228 L 752 230 Z', coords: [-71.5, 41.6] },
    SC: { name: 'South Carolina', abbr: 'SC', path: 'M 640 330 L 695 325 L 700 365 L 645 370 Z', coords: [-80.9, 33.8] },
    SD: { name: 'South Dakota', abbr: 'SD', path: 'M 375 180 L 455 175 L 460 225 L 380 230 Z', coords: [-100.2, 44.4] },
    TN: { name: 'Tennessee', abbr: 'TN', path: 'M 545 310 L 650 305 L 655 340 L 550 345 Z', coords: [-86.3, 35.8] },
    TX: { name: 'Texas', abbr: 'TX', path: 'M 340 340 L 470 330 L 490 440 L 370 470 L 320 400 Z', coords: [-99.3, 31.1] },
    UT: { name: 'Utah', abbr: 'UT', path: 'M 260 220 L 310 215 L 320 305 L 270 310 Z', coords: [-111.5, 39.3] },
    VT: { name: 'Vermont', abbr: 'VT', path: 'M 730 165 L 748 162 L 751 195 L 733 198 Z', coords: [-72.6, 44.0] },
    VA: { name: 'Virginia', abbr: 'VA', path: 'M 650 275 L 720 270 L 725 310 L 655 315 Z', coords: [-78.6, 37.5] },
    WA: { name: 'Washington', abbr: 'WA', path: 'M 165 100 L 255 95 L 260 150 L 170 155 Z', coords: [-120.5, 47.4] },
    WV: { name: 'West Virginia', abbr: 'WV', path: 'M 645 260 L 680 255 L 688 295 L 653 300 Z', coords: [-80.5, 38.9] },
    WI: { name: 'Wisconsin', abbr: 'WI', path: 'M 520 160 L 565 155 L 575 220 L 530 225 Z', coords: [-90.0, 44.5] },
    WY: { name: 'Wyoming', abbr: 'WY', path: 'M 290 180 L 370 175 L 380 240 L 300 245 Z', coords: [-107.6, 43.0] },
    DC: { name: 'Washington DC', abbr: 'DC', path: 'M 698 270 L 708 268 L 710 278 L 700 280 Z', coords: [-77.0, 38.9] },
};

// State name lookup
export const USA_NAME_TO_ABBR: Record<string, string> = Object.fromEntries(
    Object.entries(USA_STATES_PATHS).map(([abbr, data]) => [data.name, abbr])
);
