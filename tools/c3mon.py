# b183 Chapter 3 monsters: tools/c3_in/cRN-name-[BOSS-]M.png (6 idle over 6 attack, facing LEFT, magenta) -> spr/xRN.webp + art/xRN.webp, like ch2mon.py
import sys,os,numpy as np
from PIL import Image
from scipy import ndimage as nd
s=open('/home/claude/pixeldeck/tools/towermon.py').read();s=s[:s.index("if 'v3' in sys.argv")]
s=s.replace("U='/home/claude/pixeldeck/tools/tower_in/'","U='/home/claude/pixeldeck/tools/c3_in/'").replace("only=[a for a in sys.argv[1:] if a!='v3']","only=[]")
exec(s)
TINT.update({'x7':(90,80,30),'x8':(120,30,20),'x9':(20,50,110)})
for f in sorted(os.listdir(U)):
    if not f.endswith('.png'):continue
    name='x'+f[1:3];TINT[name]=TINT['x'+f[1]];boss='BOSS' in f;lord=f[2]=='5'
    try:build3(f,name,188 if lord else 176 if boss else 136,maxw=210 if boss else 236)
    except Exception as e:print(name,'FAILED',type(e).__name__,e)
