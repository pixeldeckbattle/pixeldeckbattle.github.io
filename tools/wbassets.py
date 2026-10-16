# b193 Halloween world boss assets: tools/wb_in -> wb/*.webp, fx/wb-*.webp, am/hallow*.webp (all magenta keyed, de-spilled)
import numpy as np,os
from PIL import Image
from scipy import ndimage as nd
P='/home/claude/pixeldeck/';I=P+'tools/wb_in/'
def key(im):
    a=np.asarray(im.convert('RGB')).astype(int);m=(a[...,0]>170)&(a[...,2]>170)&(a[...,1]<130)
    near=nd.binary_dilation(m,iterations=3)&~m;sp=near&(a[...,2]>a[...,1]+40)&(a[...,0]>a[...,1]+40);a=a.copy();a[...,2]=np.where(sp,a[...,1],a[...,2])
    return Image.fromarray(np.dstack([a,np.where(m,0,np.where(sp,190,255))]).astype('uint8'),'RGBA')
def cells(f,n=4):
    im=Image.open(I+f);c=im.width//n;return [key(im.crop((q*c,r*c,q*c+c,r*c+c))) for r in range(n) for q in range(n)]
def strip(fr,size,out,keep=None,q=82):
    # one box for every frame (the union), so nothing jumps; scaled so the longer side is `size`
    bb=[f.getbbox() for f in fr];x0=min(b[0] for b in bb);y0=min(b[1] for b in bb);x1=max(b[2] for b in bb);y1=max(b[3] for b in bb)
    fr=[f.crop((x0,y0,x1,y1)) for f in fr];w,h=x1-x0,y1-y0;k=size/max(w,h);W,H=round(w*k),round(h*k)
    s=Image.new('RGBA',(W*len(fr),H))
    for i,f in enumerate(fr):s.paste(f.resize((W,H),Image.LANCZOS),(i*W,0))
    s.save(P+out,quality=q,method=6);print(out,s.size,os.path.getsize(P+out)//1024,'KB');return W,H
def one(f,size,out):
    im=key(Image.open(I+f));im=im.crop(im.getbbox());k=size/max(im.size);im=im.resize((round(im.width*k),round(im.height*k)),Image.LANCZOS);im.save(P+out,quality=86);print(out,im.size)
for f,o in [('wb-map-1.png','wb/map1.webp'),('wb-map-2.png','wb/map2.webp')]:
    im=Image.open(I+f).convert('RGB');W=1280;H=round(im.height*W/im.width);im=im.resize((W,H),Image.LANCZOS);im.save(P+o,quality=82);print(o,im.size)
im=Image.open(I+'wb-banner.png').convert('RGB');im.resize((1200,round(im.height*1200/im.width)),Image.LANCZOS).save(P+'wb/banner.webp',quality=82)
im=Image.open(I+'wb1-art.png').convert('RGB');im.resize((512,768),Image.LANCZOS).save(P+'wb/art.webp',quality=82)
one('ic-candy.png',96,'wb/candy.webp');one('ic-soul.png',96,'wb/soul.webp');one('ic-wbticket.png',96,'wb/ticket.webp')
one('wb-shield-2.png',200,'wb/sh2.webp');one('wb-shield-3.png',200,'wb/sh3.webp')
print('dims',{
 'sh1':strip(cells('wb-shield-1.png'),220,'wb/sh1.webp'),
 'title':strip(cells('wb-title.png'),320,'wb/title.webp'),
 'chest':strip(cells('wb-chest.png'),220,'wb/chest.webp'),
 'witch':strip(cells('wb-witch-b.png'),240,'wb/witch.webp'),
 'btn':strip(cells('wb-lobbybtn.png'),150,'wb/btn.webp'),
 'amb':strip(cells('wb-amb.png'),160,'wb/amb.webp'),
 'pump':strip(cells('fx-pumpkin.png'),220,'fx/wb-pumpkin.webp'),
 'curse':strip(cells('fx-curse.png'),220,'fx/wb-curse.webp')})
# Limited amulet: a still (first frame) and the 6-frame animated strip used by amu() (164x168 cells)
am=cells('am-hallow.png');b=am[0].getbbox();f0=am[0].crop(b);k=min(109/f0.width,112/f0.height);f0.resize((round(f0.width*k),round(f0.height*k)),Image.LANCZOS).save(P+'am/hallow.webp',quality=86)
pick=[am[i] for i in (0,3,6,9,12,15)];bb=[f.getbbox() for f in pick];x0=min(b[0] for b in bb);y0=min(b[1] for b in bb);x1=max(b[2] for b in bb);y1=max(b[3] for b in bb)
s=Image.new('RGBA',(164*6,168))
for i,f in enumerate(pick):
    c=f.crop((x0,y0,x1,y1));k=min(150/c.width,156/c.height);c=c.resize((round(c.width*k),round(c.height*k)),Image.LANCZOS);s.paste(c,(i*164+(164-c.width)//2,(168-c.height)//2),c)
s.save(P+'am/hallow_a.webp',quality=86);print('am/hallow_a.webp')
