#!/usr/bin/env python3
import glob
import sys

print('Generating static site...')

templates = {}
for tem_f in sorted(glob.glob('*.html.tem')):
    name = tem_f[:-len('.html.tem')]
    with open(tem_f, encoding='utf-8') as f:
        templates[name] = f.read()

plates = sorted(glob.glob('*.html.plate'))
if not plates:
    sys.exit('error: no *.html.plate files found (run this from the repo root)')

for plate_fname in plates:
    out_fname = plate_fname[:-len('.plate')]
    print('Generating', out_fname)
    with open(plate_fname, encoding='utf-8') as f:
        page = f.read()
    for name, content in templates.items():
        page = page.replace('{{' + name + '}}', content)
    with open(out_fname, 'w', encoding='utf-8') as f:
        f.write(page)
