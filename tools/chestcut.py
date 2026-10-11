# shop chests: tools/chest_in/<pack>.png (3x2 frames on magenta) -> ui/ch_<pack>.webp, a 6-frame strip of square frames. Frames are aligned on the chest itself
# (best match of frame 1's chest against every other cell), so the chest stays still while its effects play.
import numpy as np
from PIL import Image
from scipy import ndimage as nd
P='/home/claude/pixeldeck/';D=P+'tools/chest_in/';OUT=280
def key(im):
    a=np.asarray(im.convert('RGB')).astype(float);bg=np.median(np.concatenate([a[:10].reshape(-1,3),a[-10:].reshape(-1,3)]),0);r,g,b=a[...,0],a[...,1],a[...,2]
    m=np.minimum(r,b)-g;mb=min(bg[0],bg[2])-bg[1];al=np.clip((mb-22-m)/(mb-22-70),0,1);k=np.clip(al,.08,1)[...,None];f=np.clip((a-(1-al[...,None])*bg)/k,0,255);al[al<.06]=0
    R,G,B=f[...,0],f[...,1],f[...,2];mm=np.minimum(R,B)-G;z=mm>10;f[...,0]=np.where(z,G+(R-G)*.5,R);f[...,2]=np.where(z,G+(B-G)*.5,B)
    return np.dstack([f,al*255]).astype('uint8')
def cut(name):
    rgba=key(Image.open(D+name+'.png'));H,W=rgba.shape[:2];ch,cw=H//2,W//3;cells=[rgba[r*ch:(r+1)*ch,c*cw:(c+1)*cw].copy() for r in range(2) for c in range(3)]
    for c in cells:   # bits of the neighbouring row's effects that poke over the cell edge
        m=c[...,3]>40;lab,n=nd.label(m,structure=np.ones((3,3)));sz=nd.sum(m,lab,range(1,n+1));big=int(np.argmax(sz))+1
        for j in set(lab[:3].ravel())|set(lab[-3:].ravel())|set(lab[:,:3].ravel())|set(lab[:,-3:].ravel()):
            if j and j!=big:c[lab==j]=0
    c0=cells[0];m=c0[...,3]>80;lab,n=nd.label(m);sz=nd.sum(m,lab,range(1,n+1));big=lab==int(np.argmax(sz))+1;ys,xs=np.where(big);x0,x1,y0,y1=xs.min(),xs.max(),ys.min(),ys.max()
    # the lower 60% of the chest is where effects are rarest: match on that
    ty=int(y0+(y1-y0)*.4);tpl=c0[ty:y1+1:3,x0:x1+1:3,:3].astype(float);tm=big[ty:y1+1:3,x0:x1+1:3];sh=[(0,0)]
    for c in cells[1:]:
        best=(1e18,0,0)
        for dy in range(-66,67,3):
            for dx in range(-45,46,3):
                ya,xa=ty+dy,x0+dx
                if ya<0 or xa<0 or ya+(y1+1-ty)>ch or xa+(x1+1-x0)>cw:continue
                w=c[ya:ya+(y1+1-ty):3,xa:xa+(x1+1-x0):3,:3].astype(float);e=(np.abs(w-tpl).sum(-1)*tm).sum()
                if e<best[0]:best=(e,dx,dy)
        sh.append(best[1:])
    # shared box: frame 1's chest box grown to hold every frame's effects
    L=T=10**9;R=B=-10**9
    for c,(dx,dy) in zip(cells,sh):
        ys,xs=np.where(c[...,3]>40);L=min(L,xs.min()-dx);R=max(R,xs.max()-dx);T=min(T,ys.min()-dy);B=max(B,ys.max()-dy)
    cx=(x0+x1)/2;half=max(cx-L,R-cx)+4;side=int(np.ceil(max(2*half,B-T+8)));left=int(round(cx-side/2));top=int(round(B+4-side))
    st=Image.new('RGBA',(OUT*6,OUT),(0,0,0,0))
    for i,(c,(dx,dy)) in enumerate(zip(cells,sh)):
        f=Image.new('RGBA',(side,side),(0,0,0,0));f.paste(Image.fromarray(c,'RGBA'),(-(left+dx),-(top+dy)));st.paste(f.resize((OUT,OUT),Image.LANCZOS),(i*OUT,0))
    st.save(P+'ui/ch_'+name+'.webp',quality=90,method=6);print(name,'side',side,'shifts',sh)
for n in('gold','starter','pro','ltd'):cut(n)
# diamond piles for the top-up page: 6 icons in one sheet -> ui/dp1..6.webp, all at ONE scale and standing on the bottom edge, so the piles really grow
def piles():
    rgba=key(Image.open(D+'diamonds.png'));H,W=rgba.shape[:2];ch,cw=H//2,W//3;out=[]
    for i in range(6):
        r,c=divmod(i,3);cell=rgba[r*ch:(r+1)*ch,c*cw:(c+1)*cw];ys,xs=np.where(cell[...,3]>40);out.append(Image.fromarray(cell[ys.min():ys.max()+1,xs.min():xs.max()+1],'RGBA'))
    S=max(max(o.size) for o in out);k=240/S
    for i,o in enumerate(out):
        o=o.resize((round(o.width*k),round(o.height*k)),Image.LANCZOS);f=Image.new('RGBA',(240,240),(0,0,0,0));f.paste(o,((240-o.width)//2,240-o.height));f.save(P+'ui/dp%d.webp'%(i+1),quality=90,method=6)
    print('piles',[o.size for o in out])
piles()
