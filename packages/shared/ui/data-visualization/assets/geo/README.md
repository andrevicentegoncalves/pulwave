# Geographic Data Assets

This folder contains TopoJSON files for map visualizations, shared across all apps.

## Structure

```
assets/geo/
├── world/
│   └── countries-110m.json    # World countries
└── usa/
    └── states-10m.json        # US states
```

## Download Commands

```bash
# From packages/ui/data-visualization:
curl -o assets/geo/world/countries-110m.json https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json
curl -o assets/geo/usa/states-10m.json https://cdn.jsdelivr.net/npm/us-atlas@3/states-10m.json
```

## Usage

Apps consuming this package should copy these assets to their public folder during build, or import the paths directly.
