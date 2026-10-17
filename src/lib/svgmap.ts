// Build-time SVG drawing of the cession outlines and today's lands (lower 48 only), for the home
// page. Albers equal-area conic (USGS standard parallels), coordinates thinned to keep the page light.
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

const rad = Math.PI / 180;
const [phi1, phi2, phi0, lam0] = [29.5 * rad, 45.5 * rad, 23 * rad, -96 * rad];
const n = (Math.sin(phi1) + Math.sin(phi2)) / 2;
const C = Math.cos(phi1) ** 2 + 2 * n * Math.sin(phi1);
const rho0 = Math.sqrt(C - 2 * n * Math.sin(phi0)) / n;

export function albers(lon: number, lat: number): [number, number] {
  const rho = Math.sqrt(C - 2 * n * Math.sin(lat * rad)) / n;
  const theta = n * (lon * rad - lam0);
  return [rho * Math.sin(theta), -(rho0 - rho * Math.cos(theta))];
}

type Geometry = { type: string; coordinates: unknown };
interface FC {
  features: { properties: Record<string, unknown>; geometry: Geometry }[];
}

const W = 1000;
// Bounds of the lower 48 in projected units (computed from the corners).
const corners = [
  albers(-124.8, 49.4),
  albers(-66.9, 47.5),
  albers(-117, 32.5),
  albers(-80, 25),
  albers(-97, 49.4),
  albers(-97, 25.8),
];
const minX = Math.min(...corners.map((c) => c[0]));
const maxX = Math.max(...corners.map((c) => c[0]));
const minY = Math.min(...corners.map((c) => c[1]));
const maxY = Math.max(...corners.map((c) => c[1]));
const scale = W / (maxX - minX);
export const VIEW_H = Math.round((maxY - minY) * scale);

function ringPath(ring: [number, number][], minStep: number): string {
  let d = '';
  let count = 0;
  let last: [number, number] | null = null;
  for (const [lon, lat] of ring) {
    const [x, y] = albers(lon, lat);
    const px = (x - minX) * scale;
    const py = (y - minY) * scale;
    if (last && Math.hypot(px - last[0], py - last[1]) < minStep) continue;
    d += `${last ? 'L' : 'M'}${Math.round(px)} ${Math.round(py)}`;
    last = [px, py];
    count++;
  }
  return count >= 3 ? d + 'Z' : '';
}

function geomPath(g: Geometry, minStep: number): string {
  const polys =
    g.type === 'Polygon'
      ? [g.coordinates]
      : g.type === 'MultiPolygon'
        ? (g.coordinates as unknown[])
        : [];
  return (polys as [number, number][][][])
    .map((p) => p.map((r) => ringPath(r, minStep)).join(''))
    .join('');
}

const inLower48 = (g: Geometry) => {
  const first = JSON.stringify(g.coordinates)
    .match(/-?\d+\.?\d*,-?\d+\.?\d*/)?.[0]
    ?.split(',')
    .map(Number);
  return !!first && first[0]! > -125 && first[0]! < -66 && first[1]! > 24 && first[1]! < 50;
};

export function homeMap() {
  const root = process.cwd();
  const cessions = JSON.parse(readFileSync(join(root, 'data/derived/cessions.json'), 'utf8')) as FC;
  const today = JSON.parse(
    readFileSync(join(root, 'data/derived/today-aiannh.json'), 'utf8'),
  ) as FC;
  const ceded = cessions.features
    .filter((f) => inLower48(f.geometry))
    .map((f) => geomPath(f.geometry, 4))
    .join('');
  const lands = today.features
    .filter((f) => f.properties['k'] === 'land' && inLower48(f.geometry))
    .map((f) => geomPath(f.geometry, 2.2))
    .join('');
  return { width: W, height: VIEW_H, ceded, lands };
}
