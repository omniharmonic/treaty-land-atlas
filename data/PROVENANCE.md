# Provenance

One row per derived dataset: what it came from, which tool and parameters made it, and the checksum of the source.

| Output | Source | Source SHA-256 | Tool and version | Parameters | Date |
|---|---|---|---|---|---|
| data/derived/cessions.json | USFS Tribal Lands Ceded (layer 1 polygons, layer 2 table) | attributes.json 16361cc8704d; layer1-metadata.json ec43b2dbcfc8; polygons.geojson ec7afffc57a4 | mapshaper 0.7.72 | -clean allow-overlaps; -simplify visvalingam weighted percentage=60% keep-shapes; precision=0.0001 | 2026-10-17 |
| data/derived/today-aiannh.json | Census Cartographic Boundary AIANNH 1:500,000 (cb_2025_us_aiannh_500k.zip) | 79d2f62c00c9 | mapshaper 0.7.72 | -proj wgs84; -simplify visvalingam weighted percentage=20% keep-shapes; precision=0.0001 | 2026-10-17 |
| data/derived/no-cession.json | Census Cartographic Boundary nation 1:20,000,000 (cb_2023_us_nation_20m.zip) minus data/derived/cessions.json; plus Alaska and Hawaii from data/sources/k1-geo/alaska-hawaii.geojson (Natural Earth 10m admin-1 US-AK, US-HI, public domain, source 22d0e3ad85eb; file 5b5c8900eff1) | 58c1be5aa565 | mapshaper 0.7.72 | clip bbox=-125,24,-66.5,49.5; erase cessions; filter-slivers min-area=200km2; simplify 20%; precision=0.01 | 2026-10-20 |
| data/derived/sub-areas.json | K1 sub-areas: data/sources/k1-geo/426-N.geojson (Royce 426 cut at the South Platte, Natural Earth 10m rivers 5.2.0-pre, source bb854a900ecb, clipped to Colorado; file 560a984fcd72) and 566-UP.geojson (the notch Royce draws in 566 for Uncompahgre Park; file f7589513102d) | see file column | shapely 2.2.0 / pyproj 3.8.0 (geodata agent, 2026-10-20) | copied through; properties id, n, parent, t0, t1, lt, tier | 2026-10-20 |
