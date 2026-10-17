// The quiet base map behind every locator map: all Royce cessions in the lower 48, as hairlines.
// Served once and cached, so record pages only carry their own highlighted shapes.
import { locatorMap } from '../../lib/svgmap';

export function GET() {
  const { width, height, base } = locatorMap([]);
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}"><path d="${base}" fill="none" stroke="#8f9c88" stroke-width="0.6" stroke-linejoin="round"/></svg>`;
  return new Response(svg, { headers: { 'content-type': 'image/svg+xml' } });
}
