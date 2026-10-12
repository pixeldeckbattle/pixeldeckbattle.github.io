# Chapter 2 (stages 501-1100) monsters: tools/ch2_in/cRN-name-[BOSS-]M|G.png (6 idle over 6 attack frames, facing left, magenta or green key)
# -> spr/xRN.webp + art/xRN.webp with towermon's cutter. R = realm 1-6, N = 1-3 monsters, 4 boss, 5 realm lord.
import sys,os,numpy as np
from PIL import Image
from scipy import ndimage as nd
s=open('/home/claude/pixeldeck/tools/towermon.py').read();s=s[:s.index("if 'v3' in sys.argv")]
s=s.replace("U='/home/claude/pixeldeck/tools/tower_in/'","U='/home/claude/pixeldeck/tools/ch2_in/'").replace("only=[a for a in sys.argv[1:] if a!='v3']","only=[]")
exec(s)
keyM=key
def keyG(im):
    a=np.asarray(im.convert('RGB')).astype(float);r,g,b=a[...,0],a[...,1],a[...,2];mx=np.maximum(r,b)
    m=g-mx;al=np.clip((140-m)/50,0,1);al[g<150]=1
    solid=nd.binary_opening(al>.5,iterations=1);lab,n=nd.label(solid);sz=nd.sum(solid,lab,range(1,n+1));keep=np.isin(lab,[i+1 for i,v in enumerate(sz) if v>=30]);al=np.where(keep,al,0)
    near=nd.binary_dilation(al<.5,iterations=2);spill=(m>15)&(al>0)&near;a[...,1]=np.where(spill,mx+(g-mx)*.3,g)
    return np.dstack([a,al*255]).astype('uint8')
# white steam painted against magenta keeps a pink cast: turn light pink-ish pixels grey (sheets with steam only)
STEAM={'x51','x52','x54'}
def desteam(rgba):
    a=rgba.astype(float);r,g,b=a[...,0],a[...,1],a[...,2];l=(r+g+b)/3;z=(np.minimum(r,b)-g>8)&(l>120)&(a[...,3]>0)
    for c in range(3):a[...,c]=np.where(z,l+ (a[...,c]-l)*.15,a[...,c])
    return a.astype('uint8')
STEAL.update({'x52':{3:[(765,849,730,905)]}})
TINT.update({'x1':(20,60,110),'x2':(120,40,14),'x3':(40,80,130),'x4':(110,90,140),'x5':(110,80,30),'x6':(70,30,110)})
SIZE={'':136,'BOSS':176}
for f in sorted(os.listdir(U)):
    if not f.endswith('.png'):continue
    name='x'+f[1:3];TINT[name]=TINT['x'+f[1]];boss='BOSS' in f;lord=f[2]=='5'
    key=(keyM if f.endswith('-M.png') else keyG)
    if name in STEAM:
        k0=key;key=lambda im,k0=k0:desteam(k0(im))
    globals()['key']=key
    try:build3(f,name,188 if lord else 176 if boss else 136,maxw=210 if boss else 236)
    except Exception as e:print(name,'FAILED',type(e).__name__,e)
