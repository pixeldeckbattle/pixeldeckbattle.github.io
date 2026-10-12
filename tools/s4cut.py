# b173: skill-4 icons (tools/s4_in/s4*-M|G.png, square on magenta/green) -> ic/s4*.webp 128x128;
# star badges 6-10 (st*-M|G.png, 3x2 frames) -> ui/st6..st10.webp, 6-frame horizontal strips of 96x96, every frame centred on the star body
import os,numpy as np
from PIL import Image
from scipy import ndimage as nd
P='/home/claude/pixeldeck/';D=P+'tools/s4_in/'
def key(path):
    a=np.asarray(Image.open(path).convert('RGB')).astype(float);r,g,b=a[...,0],a[...,1],a[...,2]
    if path.endswith('-M.png'):
        m=np.minimum(r,b)-g;al=np.clip((150-m)/60,0,1);al[(r<140)|(b<140)]=1
        z=(m>15)&(al<1);a[...,0]=np.where(z,g+(r-g)*.35,r);a[...,2]=np.where(z,g+(b-g)*.35,b)
    else:
        mx=np.maximum(r,b);m=g-mx;al=np.clip((140-m)/60,0,1);al[g<140]=1
        z=(m>10)&(al<1);a[...,1]=np.where(z,mx+(g-mx)*.3,g)
    al=np.where(nd.binary_opening(al>.5,iterations=1)|(al>.95),al,0)
    return np.dstack([a,al*255]).astype('uint8')
for f in sorted(os.listdir(D)):
    rgba=key(D+f);n=f.split('-')[0]
    if n.startswith('s4'):
        ys,xs=np.where(rgba[...,3]>30);im=Image.fromarray(rgba[ys.min():ys.max()+1,xs.min():xs.max()+1],'RGBA');s=max(im.size)
        sq=Image.new('RGBA',(s,s));sq.paste(im,((s-im.width)//2,(s-im.height)//2));sq.resize((128,128),Image.LANCZOS).save(P+f'ic/{n}.webp',quality=90,method=6);print(n)
    else:
        H,W=rgba.shape[:2];cw,ch=W//3,H//2;cells=[rgba[r*ch:(r+1)*ch,c*cw:(c+1)*cw] for r in range(2) for c in range(3)]
        # centre on the star body (opaque core), shared crop size
        cen=[];ext=0
        for c in cells:
            m=c[...,3]>200;lab,k=nd.label(m);sz=nd.sum(m,lab,range(1,k+1));ys,xs=np.where(lab==int(np.argmax(sz))+1);cy,cx=(ys.min()+ys.max())/2,(xs.min()+xs.max())/2;cen.append((cy,cx))
            ya,xa=np.where(c[...,3]>30);ext=max(ext,abs(ya-cy).max(),abs(xa-cx).max())
        e=int(ext)+4;st=Image.new('RGBA',(96*6,96))
        for i,(c,(cy,cx)) in enumerate(zip(cells,cen)):
            fr=Image.new('RGBA',(2*e,2*e));fr.paste(Image.fromarray(c,'RGBA'),(int(e-cx),int(e-cy)));st.paste(fr.resize((96,96),Image.LANCZOS),(i*96,0))
        st.save(P+f'ui/{n}.webp',quality=90,method=6);print(n,'half-size',e)
