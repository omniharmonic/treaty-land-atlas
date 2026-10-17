# Provenance

One row per derived dataset: what it came from, which tool and parameters made it, and the checksum of the source.

| Output | Source | Source SHA-256 | Tool and version | Parameters | Date |
|---|---|---|---|---|---|
| data/derived/cessions.json | USFS Tribal Lands Ceded (layer 1 polygons, layer 2 table) | attributes.json 16361cc8704d; layer1-metadata.json ec43b2dbcfc8; polygons.geojson ec7afffc57a4 | mapshaper 0.7.72 | -clean allow-overlaps; -simplify visvalingam weighted percentage=60% keep-shapes; precision=0.0001 | 2026-10-17 |
| data/derived/today-aiannh.json | Census Cartographic Boundary AIANNH 1:500,000 (cb_2025_us_aiannh_500k.zip) | 79d2f62c00c9 | mapshaper 0.7.72 | -proj wgs84; -simplify visvalingam weighted percentage=20% keep-shapes; precision=0.0001 | 2026-10-17 |
