# b167 tower art. Shields: 01 gold (3x2 frames on magenta) -> ui/tw1.webp 6-frame strip; 02 silver / 03 bronze single images -> ui/tw2.webp, ui/tw3.webp.
# Until 02/03 exist they are made from the gold one by recolouring (kept as a fallback).
import numpy as np,os,colorsys
from PIL import Image
from scipy import ndimage as nd
P='/home/claude/pixeldeck/';D=P+'tools/tower_in/';H=200
def key(im):
    a=np.asarray(im.convert('RGB')).astype(float);bg=np.median(np.concatenate([a[:10].reshape(-1,3),a[-10:].reshape(-1,3)]),0);r,g,b=a[...,0],a[...,1],a[...,2]
    m=np.minimum(r,b)-g;mb=min(bg[0],bg[2])-bg[1];al=np.clip((mb-22-m)/(mb-22-70),0,1);k=np.clip(al,.08,1)[...,None];f=np.clip((a-(1-al[...,None])*bg)/k,0,255);al[al<.06]=0
    R,G,B=f[...,0],f[...,1],f[...,2];mm=np.minimum(R,B)-G;z=mm>10;f[...,0]=np.where(z,G+(R-G)*.5,R);f[...,2]=np.where(z,G+(B-G)*.5,B)
    return np.dstack([f,al*255]).astype('uint8')
def strip(src,cols,rows,out,pad=3):
    rgba=key(Image.open(D+src));Hh,W=rgba.shape[:2];cw,ch=W/cols,Hh/rows;cells=[]
    for i in range(cols*rows):
        r,c=divmod(i,cols);cell=rgba[int(round(r*ch)):int(round((r+1)*ch)),int(round(c*cw)):int(round((c+1)*cw))].copy()
        m=cell[...,3]>60;lab,n=nd.label(m);sz=nd.sum(m,lab,range(1,n+1));big=int(np.argmax(sz))+1;ys,xs=np.where(lab==big);cells.append((cell,(xs.min(),xs.max(),ys.min(),ys.max())))
    S=[]
    for cell,b in cells:
        ys,xs=np.where(cell[...,3]>40);S.append((xs.min()-(b[0]+b[1])/2,xs.max()-(b[0]+b[1])/2,ys.min()-b[3],ys.max()-b[3]))
    x0=int(np.floor(min(s[0] for s in S)))-pad;x1=int(np.ceil(max(s[1] for s in S)))+pad;y0=int(np.floor(min(s[2] for s in S)))-pad;y1=int(np.ceil(max(s[3] for s in S)))+pad
    fw,fh=x1-x0,y1-y0;k=H/fh;w=round(fw*k);st=Image.new('RGBA',(w*len(cells),H),(0,0,0,0));fr0=None
    for i,(cell,b) in enumerate(cells):
        cx=(b[0]+b[1])/2;by=b[3];fr=Image.new('RGBA',(fw,fh),(0,0,0,0));fr.paste(Image.fromarray(cell,'RGBA'),(int(round(-x0-cx)),int(round(-y0-by))))
        fr=fr.resize((w,H),Image.LANCZOS);st.paste(fr,(i*w,0));fr0=fr0 or fr
    st.save(P+out,quality=90,method=6);print(out,'frame',w,'x',H,'aspect',round(w/H,4));return fr0
def single(src,out):
    rgba=key(Image.open(D+src));m=rgba[...,3]>60;lab,n=nd.label(m);sz=nd.sum(m,lab,range(1,n+1));rgba[lab!=int(np.argmax(sz))+1]=0;ys,xs=np.where(rgba[...,3]>40);im=Image.fromarray(rgba[max(0,ys.min()-3):ys.max()+4,max(0,xs.min()-3):xs.max()+4],'RGBA');w=round(im.width*H/im.height);im.resize((w,H),Image.LANCZOS).save(P+out,quality=90,method=6);print(out,w,H)
def tint(fr,out,sat,val,hue=None):
    a=np.asarray(fr).astype(float)/255;r,g,b,al=a[...,0],a[...,1],a[...,2],a[...,3];mx=a[...,:3].max(-1);mn=a[...,:3].min(-1);gold=(r>b+.08)&(g>b)   # the warm metal only; the blue enamel and gem stay
    lum=.3*r+.59*g+.11*b;o=a.copy()
    if hue is None:t=np.stack([lum*val*.96,lum*val,lum*val*1.07],-1)
    else:
        hr,hg,hb=colorsys.hsv_to_rgb(hue,sat,1);t=np.stack([lum*val*hr*1.25,lum*val*hg*1.25,lum*val*hb*1.25],-1)
    o[...,:3]=np.where(gold[...,None],np.clip(t,0,1),a[...,:3]);Image.fromarray((o*255).astype('uint8'),'RGBA').save(P+out,quality=90,method=6);print(out,'(recoloured)')
# rank 1 with its storm effects (v1): every frame is a square cut around the shield, centred on the navy enamel so the shield itself never moves; the shield fills FX_BODY of the frame's height
FX=500;FX_OUT=260
def fxstrip(src,out):
    im=Image.open(D+src).convert('RGB');a=np.asarray(im);Hh,W=a.shape[:2];rgba=key(im);fr=[]
    for i in range(6):
        r,c=divmod(i,3);x0,y0=c*W//3,r*Hh//2;cell=a[y0:y0+Hh//2,x0:x0+W//3].astype(int);m=(cell[...,2]>cell[...,0]+25)&(cell[...,2]>cell[...,1]+10)&(cell[...,2]<150)&(cell[...,0]<70);ys,xs=np.where(m)
        cx,cy=x0+xs.mean(),y0+ys.mean()+28;L,T=int(round(cx-FX/2)),int(round(cy-FX/2));f=Image.new('RGBA',(FX,FX),(0,0,0,0));src_im=Image.fromarray(rgba,'RGBA')
        # only this cell's own pixels: a bolt from the neighbour must not show up
        box=(max(L,x0),max(T,y0),min(L+FX,x0+W//3),min(T+FX,y0+Hh//2));f.paste(src_im.crop(box),(box[0]-L,box[1]-T));fr.append(f.resize((FX_OUT,FX_OUT),Image.LANCZOS))
    st=Image.new('RGBA',(FX_OUT*6,FX_OUT),(0,0,0,0))
    for i,f in enumerate(fr):st.paste(f,(i*FX_OUT,0))
    st.save(P+out,quality=90,method=6);print(out,'fx strip',st.size)
G=[f for f in sorted(os.listdir(D)) if f.startswith('01')];fr=strip('01-shield-gold-v0.png',3,2,'ui/tw1s.webp')
fxstrip(G[-1],'ui/tw1.webp')
s=[f for f in sorted(os.listdir(D)) if f.startswith('02')];b=[f for f in sorted(os.listdir(D)) if f.startswith('03')]
single(s[-1],'ui/tw2.webp') if s else tint(fr,'ui/tw2.webp',0,1.18)
single(b[-1],'ui/tw3.webp') if b else tint(fr,'ui/tw3.webp',.62,.92,.065)
# maps 04-08 -> bg/t1..t5.webp, same recipe as mapcut.py (ground line 46% from the top)
HZ,SQ=236,.8
for f in sorted(os.listdir(D)):
    if f[:2] not in('04','05','06','07','08'):continue
    im=Image.open(D+f).convert('RGB');W,Hh=im.size;hz=round(Hh*.561);sx=1280/W;g=min(Hh-hz,round((512-HZ)/sx));top=max(0,round(hz-HZ/(sx*SQ)))
    o=Image.new('RGB',(1280,512));o.paste(im.crop((0,top,W,hz)).resize((1280,HZ),Image.LANCZOS),(0,0));o.paste(im.crop((0,hz,W,hz+g)).resize((1280,512-HZ),Image.LANCZOS),(0,HZ));o.save(P+'bg/t%d.webp'%(int(f[:2])-3),quality=84,method=6);print('bg/t%d'%(int(f[:2])-3),f)
