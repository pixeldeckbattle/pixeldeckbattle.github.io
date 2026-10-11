# b170 SuperLegend amulets: tools/am_in/<id>.png (one row of 6 frames on flat magenta or green) -> am/<id>_a.webp (6 frames of 164x168, the size .amu.amx expects) + am/<id>.webp (frame 1, 112 high)
import sys,numpy as np
from PIL import Image
from scipy import ndimage as nd
from scipy.signal import fftconvolve
P='/home/claude/pixeldeck/';D=P+'tools/am_in/';FW,FH=164,168
def key(im):
    a=np.asarray(im.convert('RGB')).astype(float);bg=np.median(np.concatenate([a[:8].reshape(-1,3),a[-8:].reshape(-1,3)]),0);r,g,b=a[...,0],a[...,1],a[...,2]
    green=bg[1]>bg[0]
    m=(g-np.maximum(r,b)) if green else (np.minimum(r,b)-g);mb=(bg[1]-max(bg[0],bg[2])) if green else (min(bg[0],bg[2])-bg[1])
    al=np.clip((mb-22-m)/(mb-22-70),0,1);k=np.clip(al,.08,1)[...,None];f=np.clip((a-(1-al[...,None])*bg)/k,0,255);al[al<.06]=0
    R,G,B=f[...,0],f[...,1],f[...,2]
    if green:f[...,1]=np.minimum(G,np.maximum(R,B)+8)           # leftover green fringe goes neutral
    else:
        mm=np.minimum(R,B)-G;z=(mm>10)&(al<.98);f[...,2]=np.where(z,np.minimum(B,G*.6+R*.25),B)   # soft pink edges turn warm; solid art keeps its colour
        z2=(np.minimum(R,B)-G>22)&(R>B);f[...,2]=np.where(z2,np.minimum(f[...,2],G*.85),f[...,2])   # a glow painted pink over the magenta (R above B) becomes warm gold; blue and violet art (B above R) is untouched
    return np.dstack([f,al*255]).astype('uint8')
def cut(k):
    rgba=key(Image.open(D+k+'.png'));al=rgba[...,3];H,W=al.shape;p=nd.uniform_filter1d((al>40).sum(0).astype(float),5);cuts=[0]
    for i in range(1,6):
        c=round(i*W/6);lo,hi=c-90,c+90;seg=p[lo:hi];cand=np.where(seg<=seg.min()+1)[0]+lo;cuts.append(int(cand[np.argmin(abs(cand-c))]))
    cuts.append(W);fr=[]
    for i in range(6):
        c=rgba[:,cuts[i]:cuts[i+1]].copy();m=c[...,3]>40;lab,n=nd.label(m,structure=np.ones((3,3)));sz=nd.sum(m,lab,range(1,n+1));big=sz.max()
        for j in range(1,n+1):
            xs=np.where(lab==j)[1]
            if sz[j-1]<big*.015 and (xs.min()<3 or xs.max()>c.shape[1]-4):c[lab==j]=0   # a neighbour's spike or spark poking over the cut
        fr.append(c)
    # every frame on one canvas, lined up on frame 1 by matching the solid artwork (the aura moves, the amulet does not)
    CW=max(f.shape[1] for f in fr)+160;CH=H;can=[]
    def put(f,dx=0,dy=0):
        o=np.zeros((CH,CW,4),'uint8');x=(CW-f.shape[1])//2+dx;src=f[max(0,-dy):CH-max(0,dy)];o[max(0,dy):max(0,dy)+src.shape[0],x:x+f.shape[1]]=src;return o
    def feat(o):
        g=o[...,:3].astype(float).mean(2)*(o[...,3]>200);g=nd.zoom(g,.25,order=1);return g-g.mean()
    base=put(fr[0]);fb=feat(base);can.append(base)
    for f in fr[1:]:
        o=put(f);c=fftconvolve(feat(o),fb[::-1,::-1],mode='same');y,x=np.unravel_index(np.argmax(c),c.shape);dy=(y-c.shape[0]//2)*4;dx=(x-c.shape[1]//2)*4
        best=(-1e18,0,0);ob=(base[...,:3].astype(float).mean(2)*(base[...,3]>200))
        for ey in range(-5,6):
            for ex in range(-5,6):
                t=put(f,-dx+ex,-dy+ey);s=-(np.abs(t[...,:3].astype(float).mean(2)*(t[...,3]>200)-ob)).sum()
                if s>best[0]:best=(s,-dx+ex,-dy+ey)
        can.append(put(f,best[1],best[2]));print(k,'shift',best[1:])
    A=np.max([c[...,3] for c in can],0)>40;ys,xs=np.where(A);x0,x1,y0,y1=xs.min()-2,xs.max()+3,ys.min()-2,ys.max()+3
    s=min(FW/(x1-x0),FH/(y1-y0));w,h=round((x1-x0)*s),round((y1-y0)*s);strip=Image.new('RGBA',(FW*6,FH),(0,0,0,0))
    for i,c in enumerate(can):
        im=Image.fromarray(c[y0:y1,x0:x1],'RGBA').resize((w,h),Image.LANCZOS);strip.paste(im,(i*FW+(FW-w)//2,(FH-h)//2))
    strip.save(P+'am/'+k+'_a.webp',quality=92,method=6);strip.crop((0,0,FW,FH)).resize((round(FW*112/FH),112),Image.LANCZOS).save(P+'am/'+k+'.webp',quality=92,method=6)
    bgc=Image.new('RGBA',strip.size,(26,12,8,255));bgc.alpha_composite(strip);bgc.save('/tmp/claude-0/-home-claude/388a5c6f-68e0-528b-b3e1-4ec8a2a8c150/scratchpad/sh170/am_'+k+'.png');print(k,'box',x1-x0,y1-y0,'scale',round(s,3))
for k in (sys.argv[1:] or ['kfang','dscale','deye','seraph']):cut(k)
