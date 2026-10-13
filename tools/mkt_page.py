s=open('bit8-clash.html',encoding='utf8').read()
head='<!doctype html>\n<html lang="th">\n<head>\n<meta charset="utf-8">\n<meta name="viewport" content="width=device-width,initial-scale=1">\n</head>\n<body>\n'
open('/home/claude/pixeldeck/_t.html','w',encoding='utf8').write(head+s+'\n</body>\n</html>\n')
