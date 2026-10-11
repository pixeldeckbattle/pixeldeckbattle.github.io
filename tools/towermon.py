# b167 tower monsters: tools/tower_in/NN-name.png (6 idle frames over 6 attack frames on magenta, facing left) -> spr/<id>.webp + art/<id>.webp, using monsheet2's cutter
import sys,re,numpy as np
from PIL import Image
src=open('/home/claude/pixeldeck/tools/monsheet2.py',encoding='utf8').read();src=src[:src.index("\nJ=[")]
exec(src);U='/home/claude/pixeldeck/tools/tower_in/'
TINT.update({'t01':(40,52,96),'t02':(20,70,76),'t03':(80,50,24),'t04':(20,40,70),'t05':(110,52,20),'t06':(120,40,14),'t07':(40,70,110),'t08':(50,60,110),'t09':(120,100,40),'t10':(40,40,100),
 'tb1':(50,60,100),'tb2':(20,80,50),'tb3':(120,40,10),'tb4':(40,80,130),'tb5':(130,100,30)})
# file, id, body height in the 252x204 cell, hand cuts in the attack row (x in the source picture) where two frames touch
J={'09':('t01',132,()),'10':('t02',136,()),'11':('t03',118,()),'12':('t04',136,()),'13':('t05',132,()),'14':('t06',120,()),'15':('t07',138,()),'16':('t08',134,()),'17':('t09',138,()),'18':('t10',136,()),
   '19':('tb1',184,()),'20':('tb2',182,()),'21':('tb3',184,()),'22':('tb4',180,()),'23':('tb5',184,())}
import os
only=[a for a in sys.argv[1:] if a!='v3']
# ---- second cutter, for sheets whose frames touch or whose painted effects reach into the next frame: each row is cut at the emptiest column near every sixth of the width;
# inside a slice the biggest part is the body (with whatever effect is joined to it), loose bits near it stay, and anything that only pokes in over a cut from the neighbour is dropped
def rows2(rgba):
    al=rgba[...,3];rb=bands(al,1)
    if len(rb)==2:return rb
    p=(al>40).sum(1).astype(float);H=len(p);lo,hi=int(H*.4),int(H*.6);y=lo+int(np.argmin(nd.uniform_filter1d(p,9)[lo:hi]));ys=np.where(p>3)[0];return[(ys.min(),y),(y,ys.max()+1)]
def slices(rgba,y0,y1,atk):
    y0=max(0,y0-4);y1=min(rgba.shape[0],y1+4);band=rgba[y0:y1].copy();W=band.shape[1];p=nd.uniform_filter1d((band[...,3]>40).sum(0).astype(float),7);cuts=[0]
    for k in range(1,6):
        c=round(k*W/6);lo,hi=c-110,c+110;seg=p[lo:hi];m=seg.min();cand=np.where(seg<=m+2)[0]+lo;cuts.append(int(cand[np.argmin(abs(cand-c))]))
    cuts.append(W);out=[]
    for i in range(6):
        c=band[:,cuts[i]:cuts[i+1]].copy();m=c[...,3]>40;lab,n=nd.label(m,structure=np.ones((3,3)));sz=nd.sum(m,lab,range(1,n+1));big=int(np.argmax(sz))+1;ys,xs=np.where(lab==big);bb=(xs.min(),xs.max(),ys.min(),ys.max());w=c.shape[1]
        for j in range(1,n+1):
            if j==big:continue
            yy,xx=np.where(lab==j);edge=xx.min()<=1 or xx.max()>=w-2
            dx=max(bb[0]-xx.max(),xx.min()-bb[1],0);dy=max(bb[2]-yy.max(),yy.min()-bb[3],0)
            if sz[j-1]<4 or (edge and i not in(0,5)) or (edge and (xx.min()<=1 and i>0 or xx.max()>=w-2 and i<5)) or np.hypot(dx,dy)>60:c[lab==j]=0
        ys,xs=np.where(c[...,3]>40);X0,X1,Y0,Y1=xs.min(),xs.max(),ys.min(),ys.max();out.append((c[Y0:Y1+1,X0:X1+1],(bb[0]-X0,bb[1]-X0,bb[2]-Y0,bb[3]-Y0)))
    return out,cuts
# sheets whose attack row cannot be cut cleanly (a beam or blast painted across two frames): the attack row repeats the idle frames until a redrawn sheet arrives; the game still lunges and plays its own hit effect
ATK_IDLE={'t06','t08','tb2','tb3','tb4','tb5'}
def build3(src,name,target_h,maxw=236):
    rgba=key(Image.open(U+src));rb=rows2(rgba);idle,c1=slices(rgba,*rb[0],0);atk,c2=slices(rgba,*rb[1],1)
    if name in ATK_IDLE:atk=idle
    bh=np.median([b[3]-b[2] for _,b in idle]);bw=np.median([b[1]-b[0] for _,b in idle]);sc=min(target_h/bh,maxw/bw);right=CW/2+bw*sc/2
    def place(fr,by_right):
        c,(x0,x1,y0,y1)=fr;im=Image.fromarray(c,'RGBA');im=im.resize((max(1,round(c.shape[1]*sc)),max(1,round(c.shape[0]*sc))),Image.LANCZOS)
        ox=round(right-(x1+1)*sc) if by_right else round(CW/2-(x0+x1+1)/2*sc);oy=round(BASE-(y1+1)*sc);tmp=Image.new('RGBA',(CW,CH),(0,0,0,0));tmp.paste(im,(ox,oy),im);return tmp,ox,im.width
    sheet=Image.new('RGBA',(CW*6,CH*4),(0,0,0,0));clip=0
    for c in range(6):
        fi,_,_=place(idle[c],False);fa,ox,w=place(atk[c],name not in ATK_IDLE);clip=max(clip,-ox,ox+w-CW)
        for r in (0,1,3):sheet.paste(fi,(c*CW,r*CH))
        sheet.paste(fa,(c*CW,2*CH))
    sheet.save(f'/home/claude/pixeldeck/spr/{name}.webp',quality=90,method=6)
    f0=Image.fromarray(idle[0][0],'RGBA');k=min(360/f0.width,216/f0.height);f0=f0.resize((round(f0.width*k),round(f0.height*k)),Image.LANCZOS)
    bg=np.zeros((240,400,3),float);yy,xx=np.mgrid[0:240,0:400];d=np.hypot((xx-200)/260,(yy-130)/170);col=np.array(TINT[name]);bg[:]=col*np.clip(1.15-d,0.18,1)[...,None]
    art=Image.fromarray(bg.astype('uint8')).convert('RGBA');art.alpha_composite(f0,((400-f0.width)//2,240-f0.height-8));art.convert('RGB').save(f'/home/claude/pixeldeck/art/{name}.webp',quality=86)
    print(name,'v3 scale %.2f body %dx%d clipped %d'%(sc,bw*sc,bh*sc,max(0,clip)),'cuts',c2[1:-1])
if 'v3' in sys.argv or True:
    for f in sorted(os.listdir(U)):
        k=f[:2]
        if k in J and (not only or k in only):
            try:build3(f,J[k][0],J[k][1],maxw=200 if 'BOSS' in f else 236)
            except Exception as e:print(J[k][0],'v3 FAILED',type(e).__name__,e)
