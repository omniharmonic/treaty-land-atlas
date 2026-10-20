// Map state in the URL hash (I2 s.3.2): y year, m mode, w window, v view, cut honored-through
// year, p preset (docs/design/K1-map-visual-encoding.md s.7), l layers, c center, sel selection. Parsing never throws; bad values fall back to defaults.

export const YEAR_MIN = 1784;
export const YEAR_MAX = 1894;
export const WINDOWS = [1, 5, 10, 25] as const;
export const CUT_POINTS = [1783, 1830, 1851, 1868, 1871, 1887] as const;
export const LAYERS = ['cessions', 'today', 'massacres'] as const;
export const PRESETS = ['recorded', 'how', 'promised', 'broken', 'never', 'today'] as const;
export type Preset = (typeof PRESETS)[number];

export interface MapState {
  year: number;
  mode: 'cum' | 'win';
  win: (typeof WINDOWS)[number];
  view: 'record' | 'honored';
  preset: Preset;
  cut: (typeof CUT_POINTS)[number];
  layers: Set<(typeof LAYERS)[number]>;
  center: [number, number, number] | null;
  sel: string | null;
}

export const DEFAULT_STATE: MapState = {
  year: 1868,
  mode: 'cum',
  win: 10,
  view: 'record',
  preset: 'recorded',
  cut: 1851,
  layers: new Set(['cessions']),
  center: null,
  sel: null,
};

const int = (v: string | null, min: number, max: number) => {
  const n = Number(v);
  return Number.isInteger(n) && n >= min && n <= max ? n : null;
};

export function parseHash(hash: string): MapState {
  const p = new URLSearchParams(hash.replace(/^#/, ''));
  const s: MapState = { ...DEFAULT_STATE, layers: new Set(DEFAULT_STATE.layers) };
  s.year = int(p.get('y'), YEAR_MIN, 2026) ?? s.year;
  if (p.get('m') === 'win' || p.get('m') === 'cum') s.mode = p.get('m') as MapState['mode'];
  const w = int(p.get('w'), 1, 25);
  if (w && (WINDOWS as readonly number[]).includes(w)) s.win = w as MapState['win'];
  if (p.get('v') === 'honored') s.view = 'honored';
  const preset = p.get('p');
  if (preset && (PRESETS as readonly string[]).includes(preset)) s.preset = preset as Preset;
  const cut = int(p.get('cut'), 1700, 1900);
  if (cut && (CUT_POINTS as readonly number[]).includes(cut)) s.cut = cut as MapState['cut'];
  if (p.has('l')) {
    s.layers = new Set(
      (p.get('l') ?? '')
        .split(',')
        .filter((x): x is (typeof LAYERS)[number] => (LAYERS as readonly string[]).includes(x)),
    );
  }
  const c = (p.get('c') ?? '').split(',').map(Number);
  if (
    c.length === 3 &&
    c.every(Number.isFinite) &&
    Math.abs(c[0]!) <= 90 &&
    Math.abs(c[1]!) <= 180 &&
    c[2]! >= 0 &&
    c[2]! <= 9
  )
    s.center = [c[0]!, c[1]!, c[2]!];
  const sel = p.get('sel');
  if (sel && /^[A-Za-z0-9-]{1,80}$/.test(sel)) s.sel = sel;
  return s;
}

export function toHash(s: MapState): string {
  const p = new URLSearchParams();
  p.set('y', String(s.year));
  if (s.mode !== 'cum') p.set('m', s.mode);
  if (s.mode === 'win') p.set('w', String(s.win));
  if (s.preset !== 'recorded') p.set('p', s.preset);
  if (s.view === 'honored') {
    p.set('v', 'honored');
    p.set('cut', String(s.cut));
  }
  const layers = [...s.layers].sort().join(',');
  if (layers !== 'cessions') p.set('l', layers);
  if (s.center)
    p.set('c', s.center.map((x, i) => (i === 2 ? x.toFixed(1) : x.toFixed(2))).join(','));
  if (s.sel) p.set('sel', s.sel);
  return `#${p.toString().replace(/%2C/g, ',')}`;
}

/** Which cessions are in view for a state (pure, also used by the table and tests). */
export function inView(t0: number | null, s: Pick<MapState, 'year' | 'mode' | 'win'>): boolean {
  if (t0 === null) return false;
  if (t0 >= s.year + 1) return false; // t0 is a decimal year; the whole of `year` counts
  return s.mode === 'cum' ? true : t0 >= s.year - s.win + 1;
}
