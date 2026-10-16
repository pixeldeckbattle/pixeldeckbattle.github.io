# Owner-only test page: writes beta.html (Dev account only, see BETA in the game). Never touches index.html, version.json or admin.html.
import re
s=open('bit8-clash.html',encoding='utf8').read()
head='<!doctype html>\n<html lang="th">\n<head>\n<meta charset="utf-8">\n<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover,user-scalable=no">\n<meta name="theme-color" content="#0c1030">\n<meta name="robots" content="noindex">\n<title>Pixeldeck Battle BETA</title>\n<link rel="icon" href="icon-192.png">\n</head>\n<body>\n'
cfg=open('FB_CFG.json').read().strip()
assert "const FB_CFG=null;" in s and 'const BETA=' in s
w=s.replace("const FB_CFG=null;","const FB_CFG=%s;"%cfg)
open('/home/claude/pixeldeck/beta.html','w',encoding='utf8').write(head+w+'\n</body>\n</html>\n')
print('beta',re.search(r"const BUILD='(b\d+)'",s).group(1))
