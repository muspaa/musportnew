"""Membuat public/cv/CV-MUSFA.pdf dari data portofolio (shared/*.json).
Jalankan: python3 scripts/build-cv.py   (butuh: pip install reportlab pillow)
Ingin pakai CV buatan sendiri? Cukup timpa public/cv/CV-MUSFA.pdf dengan file kamu (nama sama)."""
import json
from pathlib import Path
from PIL import Image, ImageDraw
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import ParagraphStyle
from reportlab.lib.units import mm
from reportlab.lib import colors
from reportlab.platypus import CondPageBreak, BaseDocTemplate, Frame, PageTemplate, Paragraph, Spacer, KeepTogether, HRFlowable

root = Path(__file__).resolve().parent.parent
content = json.loads((root / 'shared/content.json').read_text(encoding='utf8'))
profile = json.loads((root / 'shared/profile.json').read_text(encoding='utf8'))
out = root / 'public/cv/CV-MUSFA.pdf'
W, H = A4
FULL_NAME, ALIAS = 'A. Mustofa Yusuf', profile['name']  # profile.json menyimpan nama panggung (MUSFA)
NAVY, VIOLET, CYAN, INK, MUTED = colors.HexColor('#0b0e24'), colors.HexColor('#4f3fd6'), colors.HexColor('#1fb6d6'), colors.HexColor('#161a3a'), colors.HexColor('#5a608c')

# avatar bulat dari foto PKL
av = Image.open(root / 'public/images/pp-avatar.webp').convert('RGB').resize((600, 600))
mask = Image.new('L', (600, 600), 0); ImageDraw.Draw(mask).ellipse((0, 0, 599, 599), fill=255)
av.putalpha(mask); av.save('/tmp/cv-avatar.png')

def style(name, **kw):
    base = dict(fontName='Helvetica', fontSize=9.4, leading=13.4, textColor=INK)
    base.update(kw); return ParagraphStyle(name, **base)
body, small = style('body'), style('small', fontSize=8.4, leading=11.6, textColor=MUTED)
h = style('h', fontName='Helvetica-Bold', fontSize=10.5, leading=14, textColor=VIOLET, spaceBefore=12, spaceAfter=3, keepWithNext=1)
item = style('item', fontName='Helvetica-Bold', fontSize=9.8, leading=13)
link = '<a href="%s" color="#1a7fa8">%s</a>'

def section(title):
    rule = HRFlowable(width='100%', thickness=0.6, color=colors.HexColor('#cfd3f2'), spaceAfter=5); rule.keepWithNext = 1
    return [CondPageBreak(42 * mm), Paragraph(title.upper(), h), rule]

def header(c, doc):
    c.saveState()
    if doc.page == 1:
        c.setFillColor(NAVY); c.rect(0, H - 52 * mm, W, 52 * mm, stroke=0, fill=1)
        c.setFillColor(VIOLET); c.rect(0, H - 52 * mm, W * 0.5, 1.4 * mm, stroke=0, fill=1)
        c.setFillColor(CYAN); c.rect(W * 0.5, H - 52 * mm, W * 0.5, 1.4 * mm, stroke=0, fill=1)
        c.drawImage('/tmp/cv-avatar.png', 18 * mm, H - 44 * mm, 34 * mm, 34 * mm, mask='auto')
        c.setFillColor(colors.white); c.setFont('Helvetica-Bold', 22); c.drawString(60 * mm, H - 24 * mm, FULL_NAME)
        c.setFont('Helvetica', 11); c.setFillColor(colors.HexColor('#9fe3f5')); c.drawString(60 * mm, H - 31 * mm, profile['role'])
        c.setFont('Helvetica', 8.6); c.setFillColor(colors.HexColor('#c4c9ee'))
        c.drawString(60 * mm, H - 38.5 * mm, 'Alias: %s   |   Indonesia' % ALIAS)
        c.drawString(60 * mm, H - 44 * mm, 'GitHub: %s   |   Telegram: %s' % (profile['socials'][0]['url'].replace('https://', ''), profile['socials'][1]['url'].replace('https://', '')))
    c.setFont('Helvetica', 7.6); c.setFillColor(MUTED)
    c.drawString(18 * mm, 10 * mm, '%s (%s) - Curriculum Vitae' % (FULL_NAME, ALIAS)); c.drawRightString(W - 18 * mm, 10 * mm, 'Halaman %d' % doc.page)
    c.restoreState()

doc = BaseDocTemplate(str(out), pagesize=A4, leftMargin=18 * mm, rightMargin=18 * mm, topMargin=16 * mm, bottomMargin=18 * mm,
                      title='CV - %s' % FULL_NAME, author=FULL_NAME, subject='Curriculum Vitae')
first = Frame(18 * mm, 18 * mm, W - 36 * mm, H - 18 * mm - 58 * mm, id='f1', leftPadding=0, rightPadding=0, topPadding=0, bottomPadding=0)
later = Frame(18 * mm, 18 * mm, W - 36 * mm, H - 34 * mm, id='f2', leftPadding=0, rightPadding=0, topPadding=0, bottomPadding=0)
doc.addPageTemplates([PageTemplate(id='first', frames=[first], onPage=header, autoNextPageTemplate='later'), PageTemplate(id='later', frames=[later], onPage=header)])

s = []
s += section('Profil')
s += [Paragraph(profile['about'], body), Spacer(1, 4), Paragraph(profile['approach'], body)]
kw = []
for j in content['JOURNEY_STEPS']:
    for k in j['techKeywords']:
        if k not in kw: kw.append(k)
s += section('Fokus dan teknologi yang dipelajari')
s += [Paragraph(' &middot; '.join(kw), body)]
s += section('Proyek (%d web live)' % len(content['PROJECTS']))
for p in content['PROJECTS']:
    s.append(KeepTogether([Paragraph('%s <font size="8" color="#5a608c">&nbsp;%s</font>' % (p['name'], p['category']), item), Paragraph(link % (p['url'], p['url']), small), Paragraph(p['summary'], body), Spacer(1, 5)]))
s += section('Perjalanan belajar')
for i, j in enumerate(content['JOURNEY_STEPS'], 1):
    s.append(KeepTogether([Paragraph('%02d &nbsp;%s' % (i, j['title']), item), Paragraph(j['subtitle'], small), Spacer(1, 4)]))
s += section('Tools yang dieksplorasi')
for g in content['ECOSYSTEM']:
    s.append(Paragraph('<b>%s:</b> %s' % (g['category'], ', '.join(t['name'] for t in g['items'])), body)); s.append(Spacer(1, 2))
s += section('Kontak')
for so in profile['socials']:
    s.append(Paragraph('<b>%s</b> &nbsp;%s' % (so['name'], link % (so['url'], so['handle'])), body))
doc.build(s)
print('CV ->', out, out.stat().st_size // 1024, 'KB')
