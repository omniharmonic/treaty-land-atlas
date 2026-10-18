"""Deterministic, silent, captioned films from the site's published data.

Requires Python 3, Pillow and ffmpeg. No model-generated imagery or stock assets.
Usage: python3 scripts/videos/render.py --data /tmp/living-law-video-data.json --out <folder>
"""

import argparse
import json
import math
import os
from pathlib import Path
import re
import subprocess

from PIL import Image, ImageDraw, ImageFont

W, H = 1920, 1080
BG, PAPER, INK, MUTED = '#f5f1e8', '#fdfbf6', '#302f28', '#585a4c'
RULE, SAGE, CLAY, MOSS, OCHRE = '#dcd9cd', '#d8dfca', '#c89e88', '#485d3f', '#eee2bd'
FONTS = Path('/System/Library/Fonts/Supplemental')


def font(size, serif=False):
    override = os.environ.get('VIDEO_SERIF_FONT' if serif else 'VIDEO_SANS_FONT')
    return ImageFont.truetype(override or str(FONTS / ('Georgia.ttf' if serif else 'Arial.ttf')), size)


def ease(x):
    x = max(0, min(1, x))
    return x * x * (3 - 2 * x)


def wrapped(draw, value, xy, width, size=34, fill=INK, serif=False, leading=1.32):
    f = font(size, serif)
    x, y = xy
    for para in str(value).split('\n'):
        line = ''
        for word in para.split():
            candidate = (line + ' ' + word).strip()
            if draw.textlength(candidate, font=f) > width and line:
                draw.text((x, y), line, font=f, fill=fill)
                y += round(size * leading)
                line = word
            else:
                line = candidate
        draw.text((x, y), line, font=f, fill=fill)
        y += round(size * leading)
    return y


def contours(draw, x, y, scale=1):
    # The two original cubic contours in src/components/BrandMark.astro.
    curves = [((27, 5), [(36, 5, 39, 13, 36, 21), (33, 29, 28, 37, 18, 36),
                         (8, 35, 5, 28, 8, 19), (10, 11, 17, 5, 27, 5)]),
              ((30, 13), [(39, 14, 44, 20, 41, 29), (39, 38, 31, 44, 22, 42),
                          (13, 40, 10, 33, 14, 25), (17, 17, 22, 12, 30, 13)])]
    for start, segments in curves:
        points = []
        p = start
        for a, b, c, d, ex, ey in segments:
            for i in range(24):
                t = i / 23
                u = 1 - t
                points.append((x + scale * (u**3*p[0] + 3*u*u*t*a + 3*u*t*t*c + t**3*ex),
                               y + scale * (u**3*p[1] + 3*u*u*t*b + 3*u*t*t*d + t**3*ey)))
            p = (ex, ey)
        draw.line(points, fill=MOSS, width=max(2, round(1.5*scale)), joint='curve')


def frame(index, title, t, duration):
    im = Image.new('RGB', (W, H), BG)
    d = ImageDraw.Draw(im)
    contours(d, 72, 48, 1.25)
    d.text((148, 65), 'Living Law, Living Land', font=font(28), fill=INK)
    d.text((1450, 68), f'FIELD NOTES   /   {index:02d}', font=font(22), fill=MUTED)
    d.line((80, 142, 1840, 142), fill=RULE, width=2)
    d.text((80, 177), title, font=font(58, True), fill=INK)
    d.line((80, 1008, 1840, 1008), fill=RULE, width=2)
    d.line((80, 1008, 80 + 1760 * t / duration, 1008), fill=MOSS, width=4)
    d.text((80, 1031), 'PUBLIC RECORDS  /  EARLY RELEASE  /  OCTOBER 2026', font=font(19), fill=MUTED)
    d.text((1560, 1027), 'landback.land', font=font(27), fill=INK)
    return im


def polygons(path):
    return [[tuple(map(float, p)) for p in re.findall(r'(-?\d+) (-?\d+)', ring)]
            for ring in path.split('M') if ring]


def map_layer(data, box, fill, outline=None, paths=None):
    im = Image.new('RGBA', (W, H))
    d = ImageDraw.Draw(im)
    x, y, width, height = box
    scale = min(width / data['width'], height / data['height'])
    ox = x + (width - data['width'] * scale) / 2
    oy = y + (height - data['height'] * scale) / 2
    for path in paths if paths is not None else [data['base']]:
        for poly in polygons(path):
            if len(poly) > 2:
                pts = [(ox+a*scale, oy+b*scale) for a, b in poly]
                d.polygon(pts, fill=fill)
                if outline:
                    d.line(pts + [pts[0]], fill=outline, width=1)
    return im


def over(im, layer, alpha=1):
    if alpha >= 1:
        im.paste(layer, (0, 0), layer)
    elif alpha > 0:
        mask = layer.getchannel('A').point(lambda a: round(a * alpha))
        im.paste(layer, (0, 0), mask)


def pill(d, xy, label, color=SAGE):
    x, y = xy
    width = d.textlength(label, font=font(22)) + 36
    d.rounded_rectangle((x, y, x+width, y+44), radius=22, fill=color)
    d.text((x+18, y+8), label, font=font(22), fill=INK)


def make_map_film(data):
    m = data['map']
    box = (470, 300, 1340, 650)
    base = map_layer(m, box, '#e4e1d6', '#f5f1e8')
    years = sorted(set(g['year'] for g in m['groups']))
    cumulative = {}
    current = Image.new('RGBA', (W, H))
    for year in years:
        layer = map_layer(m, box, CLAY, BG, [g['d'] for g in m['groups'] if g['year'] == year])
        current.alpha_composite(layer)
        cumulative[year] = current.copy()
    today = map_layer(m, box, MOSS, None, [m['lands']])

    def render(t):
        im = frame(1, 'Land changes. The record remains.', t, 34)
        over(im, base)
        d = ImageDraw.Draw(im)
        if t < 24:
            year = round(1784 + 110 * max(0, min(1, (t-4)/19)))
            eligible = [y for y in years if y <= year]
            if t >= 4 and eligible:
                over(im, cumulative[eligible[-1]], ease((t-4)*2))
            d.text((80, 325), str(year), font=font(112, True), fill=MOSS)
            pill(d, (82, 483), 'RECORDED TRANSFERS', '#eddcd3')
            wrapped(d, 'Researched cession and taking dates from the atlas.', (80, 565), 360, 30)
            wrapped(d, 'Each shape enters at its recorded transfer year.', (80, 730), 360, 28, MUTED)
            caption = '1784–1894  /  A partial record of land transfers, not a map of original homelands.'
        else:
            over(im, cumulative[years[-1]], 1-ease((t-24)/2))
            over(im, today, ease((t-24)/2))
            d.text((80, 330), 'Today', font=font(88, True), fill=MOSS)
            pill(d, (82, 483), 'PRESENT-DAY LANDS')
            wrapped(d, 'Native nations and communities are here, doing the work.', (80, 565), 365, 31)
            wrapped(d, 'Explore the history.\nConnect with the people.', (80, 755), 365, 28, MUTED)
            caption = 'Present-day federal land inventory is not the full extent of Indigenous homelands or rights.'
        wrapped(d, caption, (80, 939), 1750, 25, MUTED)
        d.text((505, 877), 'Lower 48 only • Royce record + researched dates • Census present-day land areas', font=font(21), fill=MUTED)
        return im
    return render


def make_treaty_film(data):
    rec = data['treaty']['records']
    m = data['treaty']['map']
    base = map_layer(m, (1220, 430, 590, 410), '#e4e1d6')
    hi = map_layer(m, (1220, 430, 590, 410), CLAY, None, [p['d'] for p in m['hi']])
    signed = rec[0]['date_signed'][:4]
    consent = rec[0]['date_ratified'][:4]
    span = rec[1]['year_text'].replace('-', '–')
    stages = [
        (signed, 'An agreement', rec[0]['overlay']['headline'], 'Treaty text • Articles 2 and 12'),
        (consent, 'Senate consent', 'The treaty record distinguishes signing from Senate consent. Different dates describe different legal steps.', 'February 16, 1869 • basis: Senate consent'),
        (span, 'The promise was broken', rec[1]['overlay']['headline'], 'Record spans 1874–1877 • the taking statute dates to 1877'),
        (str(rec[2]['year']), 'A court ruling', rec[2]['overlay']['headline'], 'United States v. Sioux Nation of Indians • 448 U.S. 371'),
    ]

    def render(t):
        im = frame(2, 'A treaty is more than a date.', t, 40)
        d = ImageDraw.Draw(im)
        d.text((80, 270), 'FORT LARAMIE  /  1868', font=font(26), fill=MOSS)
        active = min(3, int(t/8))
        # Evenly spaced record cards: this diagram does not encode elapsed time.
        d.line((150, 384, 1760, 384), fill=RULE, width=3)
        for i, (year, _, _, _) in enumerate(stages):
            x = 150 + i*530
            if i < 3:
                end = x + 530 * ease((t-i*8)/2)
                if t > i*8:
                    d.line((x, 384, end, 384), fill=MOSS, width=3)
            d.ellipse((x-10, 374, x+10, 394), fill=MOSS if i <= active else BG, outline=MOSS, width=2)
            d.text((x-58, 323), year, font=font(30), fill=INK if i <= active else MUTED)
        if t < 32:
            year, title, text, source = stages[active]
            over(im, base)
            over(im, hi, .65 + .25*math.sin(t*.5)**2)
            d = ImageDraw.Draw(im)
            pill(d, (80, 469), ['INSTRUMENT', 'LEGAL STEP', 'VIOLATION RECORD', 'CASE'][active], OCHRE if active == 1 else SAGE)
            d.text((80, 549), title, font=font(59, True), fill=INK)
            wrapped(d, text, (80, 646), 1060, 36)
            wrapped(d, source, (80, 888), 1080, 24, MUTED)
            wrapped(d, 'Linked Royce geometry\nLocator only; not a changing treaty boundary.', (1220, 855), 570, 23, MUTED)
        else:
            d.text((80, 482), 'Read the promise. Follow the evidence.', font=font(62, True), fill=INK)
            wrapped(d, 'The 1980 remedy was compensation. A court ruling is not the same thing as land return.', (80, 600), 1460, 39)
            wrapped(d, 'Treaty text: Oklahoma State University  •  Court opinion: U.S. Reports / Library of Congress', (80, 779), 1710, 26, MUTED)
            d.text((80, 865), data['treaty']['url'].replace('https://', ''), font=font(36), fill=MOSS)
        d.text((80, 955), 'Schematic sequence, not a time scale • Public-record account; tribal review remains open.', font=font(23), fill=MUTED)
        return im
    def transition(t):
        phase = t % 8
        if 0 < t < 32 and t >= 8 and phase < .65:
            return Image.blend(render(t-phase-.01), render(t), ease(phase/.65))
        if 32 <= t < 32.65:
            return Image.blend(render(31.99), render(t), ease((t-32)/.65))
        return render(t)
    return transition


def dashed(d, start, end, progress=1):
    x, y = start
    ex, ey = end
    for i in range(0, int(40*progress), 2):
        a, b = i/40, min((i+1)/40, progress)
        d.line((x+(ex-x)*a, y+(ey-y)*a, x+(ex-x)*b, y+(ey-y)*b), fill=MOSS, width=3)


def make_path_film(data):
    p = data['pathway']
    m = p['map']
    base = map_layer(m, (95, 420, 620, 390), '#e4e1d6')
    hi = map_layer(m, (95, 420, 620, 390), CLAY, None, [s['d'] for s in m['hi']])
    orgs = p['orgs']

    def render(t):
        im = frame(3, 'From a place to participation.', t, 36)
        over(im, base)
        over(im, hi, .6 + .4*ease(t/3))
        d = ImageDraw.Draw(im)
        pill(d, (80, 285), 'LAKE SUPERIOR  /  AN EXAMPLE')
        d.text((80, 818), 'Treaty of La Pointe (1842)', font=font(36, True), fill=INK)
        wrapped(d, 'Royce area 261 • map reference', (80, 880), 650, 25, MUTED)
        if t < 12:
            dashed(d, (720, 610), (905, 610), ease((t-3)/3))
            d.rounded_rectangle((930, 425, 1815, 810), radius=22, fill=PAPER, outline=RULE, width=2)
            pill(d, (970, 466), 'SUGGESTED ATLAS LINK', OCHRE)
            wrapped(d, 'Open the treaty record.', (970, 554), 780, 52, serif=True)
            wrapped(d, 'Read its promises, dates, sources and linked history. A map association is a starting point for research.', (970, 650), 780, 31)
            caption = 'Dashed lines mean suggested links in the graph. They do not establish legal boundaries or representation.'
        elif t < 27:
            dashed(d, (720, 610), (905, 610))
            d.text((950, 293), 'FOLLOW THE WORK TODAY', font=font(25), fill=MOSS)
            for i, org in enumerate(orgs):
                reveal = ease((t-12-i*3)/1.2)
                if reveal == 0:
                    continue
                card = Image.new('RGBA', (W, H))
                card_draw = ImageDraw.Draw(card)
                y = 364 + i*188
                y += round(28*(1-reveal))
                card_draw.rounded_rectangle((930, y, 1815, y+165), radius=18, fill=PAPER, outline=RULE, width=2)
                name = ['Honor the Earth', 'Great Lakes Indian Fish and\nWildlife Commission', 'White Earth Land Recovery Project'][i]
                wrapped(card_draw, name, (962, y+18), 800, 32, serif=True)
                descriptions = ['Sovereignty, energy justice and pipeline resistance',
                                'Ojibwe treaty rights and natural resource stewardship',
                                'Land recovery and food sovereignty']
                wrapped(card_draw, descriptions[i], (962, y+108), 800, 24, MUTED)
                over(im, card, reveal)
            caption = 'Organizations surfaced by the atlas’s Ojibwe support index • Different missions; not an exhaustive list.'
        else:
            d.rounded_rectangle((930, 390, 1815, 886), radius=22, fill=SAGE)
            wrapped(d, 'Learning can lead\nto participation.', (970, 440), 790, 58, serif=True)
            wrapped(d, 'Learn about each organization. Follow its priorities. Support the work it asks people to support.', (970, 630), 760, 34)
            d.text((970, 818), 'landback.land/organizations/', font=font(30), fill=MOSS)
            caption = 'Visit the organization’s own site for its current priorities and ways to contribute.'
        wrapped(d, caption, (80, 948), 1760, 23, MUTED)
        return im
    return render


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument('--data', default='/tmp/living-law-video-data.json')
    parser.add_argument('--out', required=True)
    parser.add_argument('--fps', type=int, default=24)
    parser.add_argument('--film', type=int, choices=[1, 2, 3])
    parser.add_argument('--stills-only', action='store_true')
    args = parser.parse_args()
    data = json.loads(Path(args.data).read_text())
    out = Path(args.out)
    out.mkdir(parents=True, exist_ok=True)
    films = [('01-land-and-the-record', 34, make_map_film(data), [2, 12, 21, 29]),
             ('02-the-life-of-a-treaty', 40, make_treaty_film(data), [3, 11, 20, 28, 36]),
             ('03-from-place-to-participation', 36, make_path_film(data), [5, 17, 24, 31])]
    for index, (name, duration, render, samples) in enumerate(films, 1):
        if args.film and index != args.film:
            continue
        sheet = Image.new('RGB', (960, 540*len(samples)), BG)
        for i, t in enumerate(samples):
            still = render(t)
            sheet.paste(still.resize((960, 540), Image.Resampling.LANCZOS), (0, 540*i))
            if i == 0:
                still.save(out / f'{name}-poster.png')
        sheet.save(out / f'{name}-contact-sheet.jpg', quality=90)
        if args.stills_only:
            continue
        path = out / f'{name}.mp4'
        command = ['ffmpeg', '-hide_banner', '-loglevel', 'error', '-y', '-f', 'rawvideo',
                   '-vcodec', 'rawvideo', '-pix_fmt', 'rgb24', '-s', f'{W}x{H}',
                   '-r', str(args.fps), '-i', '-', '-an', '-c:v', 'libx264', '-preset', 'fast',
                   '-crf', '19', '-pix_fmt', 'yuv420p', '-movflags', '+faststart',
                   '-metadata', f'title={name}', '-metadata', 'artist=Living Law, Living Land', str(path)]
        proc = subprocess.Popen(command, stdin=subprocess.PIPE)
        for n in range(duration*args.fps):
            proc.stdin.write(render(n/args.fps).tobytes())
        proc.stdin.close()
        if proc.wait() != 0:
            raise RuntimeError(f'Encoding failed: {path}')
        print(f'Rendered {path}', flush=True)
    sources = {
        'provenance': data.get('provenance'),
        'map': ['data/derived/cessions.json', 'public/data/tables/cession-stories.json',
                'data/derived/today-aiannh.json', 'src/lib/svgmap.ts'],
        'map_scope': f"{len(data['map']['groups'])} lower-48 shapes with researched ceded/taken dates. Areas kept or unchecked are not animated as transfers. Overlapping shapes are not an acreage total. Current inventory is not all Indigenous homelands or rights.",
        'treaty': [{'id': r['id'], 'headline': r['overlay']['headline'],
                    'sources': r['overlay']['sources'], 'cautions': r['overlay'].get('cautions')}
                   for r in data['treaty']['records']],
        'pathway': {'suggested_edge': data['pathway']['edge'],
                    'organizations': data['pathway']['orgs'],
                    'index': 'public/data/tables/support.json'},
    }
    (out / 'sources.json').write_text(json.dumps(sources, indent=2, ensure_ascii=False)+'\n')
    (out / 'README.md').write_text(Path('scripts/videos/README.md').read_text())


if __name__ == '__main__':
    main()
