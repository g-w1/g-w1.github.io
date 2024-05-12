import glob

print('Generating static site...')

tem_fs = glob.glob('*.html.tem')
tem_names = [tem[:-9] for tem in tem_fs]
tems = list(zip(tem_names, tem_fs))


plates = glob.glob('*.html.plate')
for plate_fname in plates:
    print('Generating', plate_fname[:-6])
    with open(plate_fname, 'r') as f:
        plate = f.read()
        for tem_name, tem_f in tems:
            with open(tem_f, 'r') as f:
                tem = f.read()
                print(plate)
                plate = plate.replace(tem_name, tem)
                print(plate)
        with open(plate_fname[:-6], 'w') as f:
            f.write(plate)
