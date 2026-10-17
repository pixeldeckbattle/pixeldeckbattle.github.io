# 16-frame remake of animated UI items (chests, FOUNDER badge, star badges, tower shield, amulets).
# Source: tools/ui16_in/<name>.png = 4x4 GPT grid on magenta. Output: ui/<name>16.webp (or am/<k>_a16.webp),
# one row of 16 cells, each cell the same size as the old 6-frame strip's cell; every frame anchored on the
# median bottom-centre of the object so it does not jitter.
import sys,os,glob,numpy as np
from PIL import Image
from scipy import ndimage as nd
P='/home/claude/r16/';I=P+'tools/ui16_in/'
src=open(P+'tools/monsheet2.py').read().split("TINT={")[0];ns={};exec(src,ns);key=ns['key']
OUT={'ch_gold':('ui/ch_gold16.webp','ui/ch_gold.webp',6),'ch_pro':('ui/ch_pro16.webp','ui/ch_pro.webp',6),'ch_ltd':('ui/ch_ltd16.webp','ui/ch_ltd.webp',6),
     'ch_starter':('ui/ch_starter16.webp','ui/ch_starter.webp',6),'founder':('ui/founder16.webp','ui/founder.webp',6),'tw1':('ui/tw116.webp','ui/tw1.webp',6)}
for n in (6,7,8,9,10):OUT[f'st{n}']=(f'ui/st{n}16.webp',f'ui/st{n}.webp',6)
for k in 'clover deye dscale grove gstar hallow kfang lion seraph'.split():OUT[k]=(f'am/{k}_a16.webp',f'am/{k}_a.webp',6)
def cuts(prof,n,L):
    sm=np.convolve(prof,np.ones(9)/9,'same');out=[0]
    for k in range(1,n):
        c=round(k*L/n);w=round(L/n*.18);out.append(c-w+int(np.argmin(sm[c-w:c+w])))
    return out+[L]
def build(name):
    dst,old,nf=OUT[name];o=Image.open(P+old);CW,CH=o.width//nf,o.height
    a=key(Image.open(I+name+'.png')).copy();r,g,b=[a[...,i].astype(int) for i in range(3)]
    a[...,3]=np.where((r>g+55)&(b>g+55)&(r>120),0,a[...,3])   # dark magenta drop shadows go too
    al=a[...,3]>40;H,W=al.shape;rc=cuts(al.sum(1),4,H);fr=[]
    for i in range(4):
        cc=cuts(al[rc[i]:rc[i+1]].sum(0),4,W)
        for j in range(4):
            x=a[rc[i]:rc[i+1],cc[j]:cc[j+1]].copy();m=x[...,3]>40;lab,k=nd.label(m)
            if k>1:
                sz=nd.sum(m,lab,range(1,k+1));big=int(np.argmax(sz))+1;h,w=m.shape
                for t in range(1,k+1):
                    ys,xs=np.where(lab==t)
                    if t!=big and sz[t-1]<sz[big-1]*.3 and (xs.min()<3 or xs.max()>w-4 or ys.min()<3 or ys.max()>h-4):x[lab==t]=0
            fr.append(x)
    # anchor = the body (largest blob) bottom-centre; sparkles may move freely around it
    def body(x):
        m=x[...,3]>120;lab,k=nd.label(m);sz=nd.sum(m,lab,range(1,k+1));b=lab==int(np.argmax(sz))+1;ys,xs=np.where(b);return xs.min(),xs.max(),ys.min(),ys.max()
    bb=[body(x) for x in fr];full=[np.where(x[...,3]>40) for x in fr]
    ext_w=max(xs.max()-xs.min() for ys,xs in full);ext_h=max(ys.max()-ys.min() for ys,xs in full)
    s=min((CW-6)/ext_w,(CH-6)/ext_h)
    out=Image.new('RGBA',(CW*16,CH))
    cxm=np.median([(b[0]+b[1])/2 for b in bb]);bym=np.median([b[3] for b in bb])
    for k,x in enumerate(fr):
        b=bb[k];dx=(b[0]+b[1])/2-cxm;dy=b[3]-bym
        im=Image.fromarray(x,'RGBA');im=im.resize((max(1,round(im.width*s)),max(1,round(im.height*s))),Image.LANCZOS)
        ys,xs=full[k];ccx=(np.median([(q[0]+q[1])/2 for q in bb]));
        ox=round(CW/2-(cxm+dx*0)*s-( (b[0]+b[1])/2-cxm)*s);oy=round(CH-3-(bym)*s-((b[3]-bym))*s)+round(((ext_h-(ys.max()))*0))
        # centre the whole union box in the cell
        t=Image.new('RGBA',(CW,CH));t.paste(im,(ox,oy),im);out.paste(t,(k*CW,0))
    # recentre the strip content by its union bbox
    arr=np.asarray(out);m=arr[...,3]>40;cols=np.where(m.reshape(CH,16,CW).any(0).any(0))[0];rows=np.where(m.any(1))[0]
    sx=round(CW/2-(cols.min()+cols.max())/2);sy=round(CH/2-(rows.min()+rows.max())/2)
    out2=Image.new('RGBA',out.size)
    for k in range(16):
        c=out.crop((k*CW,0,(k+1)*CW,CH));t=Image.new('RGBA',(CW,CH));t.paste(c,(sx,sy),c);out2.paste(t,(k*CW,0))
    out2.save(P+dst,quality=88,method=6);print(name,'->',dst,(CW,CH),'scale %.2f'%s,os.path.getsize(P+dst)//1024,'KB')
for n in (sys.argv[1:] or [p[:-4] for p in map(os.path.basename,glob.glob(I+'*.png'))]):build(n)
