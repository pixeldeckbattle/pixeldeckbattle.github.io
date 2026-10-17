# 16-frame remake (Oct 2026): new card models from GPT.
# Sources: tools/r16_in/<id>/{idle,walk,attack,front}.png = 4x4 sheets on magenta (side views facing RIGHT), art.png = painted card art.
# Output: spr/<id>.webp = 16 columns x 4 rows of 252x204 cells (idle, walk, attack, front), the game marks these cards f16;
# art/<id>.webp + cards/<id>.webp through cardsheet.py's faces() when art.png exists.
# GPT grids are not exact, so the cuts between frames are found from the empty gaps; spill from a neighbour frame is dropped,
# and what is left is faded at the cell edge so an effect never ends in a hard line.
import sys,os,glob,numpy as np
from PIL import Image
from scipy import ndimage as nd
P='/home/claude/r16/';U=P+'tools/r16_in/'
src=open(P+'tools/monsheet2.py').read().split("TINT={")[0];ns={};exec(src,ns);key=ns['key']
CW,CH,BASE=252,204,196
CARDS={'h29':('SL',158),'h30':('SL',176),'h31':('SL',160),'h27':('SL',170),'h03':('SL',166),'h22':('SL',160),'h07':('SL',160),'h18':('LT',178),'h28':('LT',150),'h15':('L',162),'h13':('L',164),'h14':('L',150),'h19':('L',150),'h04':('L',162),'h26':('L',168),'h34':('L',170),'h05':('R',160),'h09':('R',162),'h10':('R',140),'h08':('R',150),'h02':('UC',150),'h21':('UC',152),'h24':('UC',156),'h25':('UC',160),'h16':('UC',166),'h17':('C',140),'h12':('C',120),'h23':('C',140)}
FIX={'h30':{'idle':{1:0,3:4}}}   # 0-based frames to replace with another frame (glitched faces)
def depink(rgba):
    a=rgba.astype(int);r,g,b=a[...,0],a[...,1],a[...,2]
    pink=(r>170)&(b>g+40)&(r>g+50)&(r>=b-25)   # magenta glow left over from the background (halos, auras); indigo scales are not touched
    a[...,2]=np.where(pink,np.minimum(b,g+10),b);a[...,0]=np.where(pink,np.maximum(r,230),r);a[...,1]=np.where(pink,np.maximum(g,(r+g)//2),g)
    return a.astype('uint8')
def cuts(prof,n,L):
    sm=np.convolve(prof,np.ones(9)/9,'same');out=[0]
    for k in range(1,n):
        c=round(k*L/n);w=round(L/n*.18);lo,hi=c-w,c+w;out.append(lo+int(np.argmin(sm[lo:hi])))
    out.append(L);return out
COOL={'h28','h15','h04','h24'}
GREY={'h26'}
VIOLET={'h08','h05'}   # purple/dark characters: keep their purple, only strip pure-magenta spill   # smoke that picked up the magenta background becomes ash grey
def grey(rgba):
    a=rgba.astype(int);r,g,b=a[...,0],a[...,1],a[...,2]
    m=(b>g+12)&(r>g+5)&(b>=r-30)
    v=((r+g+b)//3*.85).astype(int);a[...,0]=np.where(m,v,r);a[...,1]=np.where(m,v,g);a[...,2]=np.where(m,v+6,b)
    return a.astype('uint8')   # ice characters: lilac mist / swirls that picked up the magenta background become icy blue
def cool(rgba):
    a=rgba.astype(int);r,g,b=a[...,0],a[...,1],a[...,2]
    m=(r>g+8)&(b>g+25)&(r+g+b>300)
    g2=np.minimum(255,g+35);a[...,0]=np.where(m,(g*.65).astype(int),r);a[...,1]=np.where(m,g2,g);a[...,2]=np.where(m,np.maximum(b,np.minimum(255,g2+30)),b)   # -> cyan ice
    return a.astype('uint8')
CUR=['']
def frames(path,mirror):
    rgba=depink(key(Image.open(path)))
    if CUR[0] in COOL:rgba=cool(rgba)
    if CUR[0] in GREY:rgba=grey(rgba)
    al=rgba[...,3]>40;H,W=al.shape
    rc=cuts(al.sum(1),4,H);out=[]
    for r in range(4):
        band=al[rc[r]:rc[r+1]];cc=cuts(band.sum(0),4,W)
        for c in range(4):
            x=rgba[rc[r]:rc[r+1],cc[c]:cc[c+1]].copy();m=x[...,3]>40;lab,n=nd.label(nd.binary_dilation(m,iterations=2)&m|m)
            if n>1:
                sz=nd.sum(m,lab,range(1,n+1));big=int(np.argmax(sz))+1;h,w=m.shape
                for i in range(1,n+1):
                    if i==big:continue
                    ys,xs=np.where(lab==i);cy,cx=ys.mean(),xs.mean()
                    edge=(xs.min()<3 and cx<w*.22) or (xs.max()>w-4 and cx>w*.78) or (ys.min()<3 and cy<h*.18) or (ys.max()>h-4 and cy>h*.85)
                    if edge and sz[i-1]<sz[big-1]*.45:x[lab==i]=0
            h,w=x.shape[:2];f=np.ones((h,w));E=10
            for k in range(E):
                v=(k+1)/(E+1);f[k,:]=np.minimum(f[k,:],v);f[h-1-k,:]=np.minimum(f[h-1-k,:],v);f[:,k]=np.minimum(f[:,k],v);f[:,w-1-k]=np.minimum(f[:,w-1-k],v)
            x[...,3]=(x[...,3]*f).astype('uint8')
            if mirror:x=x[:,::-1].copy()
            out.append((r,x))
    return out
def bbox(c):
    ys,xs=np.where(c[...,3]>40);return xs.min(),xs.max(),ys.min(),ys.max()
def torso(c):
    x0,x1,y0,y1=bbox(c);m=c[y0:y0+int((y1-y0)*.6),:,3]>40;return np.where(m)[1].mean()
def build(id,th):
    CUR[0]=id;D=U+id+'/';rows=[frames(D+'idle.png',True),frames(D+'walk.png',True),frames(D+'attack.png',True),frames(D+'front.png',False)]
    for nm,mp in FIX.get(id,{}).items():
        i={'idle':0,'walk':1,'attack':2,'front':3}[nm]
        for a,b in mp.items():rows[i][a]=rows[i][b]
    def scale(fr):
        bb=[bbox(c) for _,c in fr];return min(th/np.median([b[3]-b[2] for b in bb]),236/np.median([b[1]-b[0] for b in bb]))
    # each sheet gets its own scale so the body ends up the same height whatever size GPT drew it at:
    # idle / walk / front by their own median size, the attack by its last 4 frames (back in the ready stance)
    def scale4(fr):
        bb=[bbox(c) for _,c in fr[12:]];return min(th/np.median([b[3]-b[2] for b in bb]),236/np.median([b[1]-b[0] for b in bb]))
    SC=[scale(rows[0]),scale(rows[1]),scale4(rows[2]),scale(rows[3])];side=SC[1];fsc=SC[3]
    out=Image.new('RGBA',(CW*16,CH*4),(0,0,0,0));clip=0
    for R,fr in enumerate(rows):
        s=SC[R]
        # vertical: one offset per GPT row band (its median feet on the floor line), since GPT rows are not evenly placed.
        # horizontal: frame 1 centred on its torso; every later frame slid (within +-40px) to overlap the frame before it best,
        # on the whole body for idle / walk / front and on the feet only for the attack (so a lunge still reaches forward).
        feet={}
        for g,c in fr:feet.setdefault(g,[]).append(bbox(c)[3])
        ims=[];prev=None
        for k,(g,c) in enumerate(fr):
            im=Image.fromarray(c,'RGBA').resize((max(1,round(c.shape[1]*s)),max(1,round(c.shape[0]*s))),Image.LANCZOS)
            oy=round(BASE-(np.median(feet[g])+1)*s);ox=round(CW/2-torso(c)*s)
            def cellmask(o):
                t=Image.new('RGBA',(CW+120,CH),(0,0,0,0));t.paste(im,(o+60,oy),im);m=np.asarray(t)[...,3]>60
                return m[int(CH*.68):] if R==2 else m
            if prev is not None:
                best=None
                for d in range(-40,41,2):
                    m=cellmask(ox+d);sc=(m&prev).sum()/max(1,(m|prev).sum())
                    if best is None or sc>best[0]:best=(sc,d)
                ox+=best[1]
            prev=cellmask(ox) if R!=2 or k==0 else prev   # attack: every frame matches frame 1's stance, so it never drifts
            ims.append((im,ox,oy))
        if R!=2:   # keep the loop centred: remove the average drift
            m=round(np.mean([o+torso(c)*s for (o2,(_,o,_)),(g,c) in zip(enumerate(ims),fr) for o2 in [0]])-CW/2)
            ims=[(im,o-m,y) for im,o,y in ims] if abs(m)>2 else ims
        # a long body (tail one side, heads the other) can hang out of the cell when centred on the torso: slide the row back in
        L=min(o+bbox(c)[0]*s for (_,o,_),(g,c) in zip(ims,fr));Rr=max(o+(bbox(c)[1]+1)*s for (_,o,_),(g,c) in zip(ims,fr))
        if R!=2 and (L<2 or Rr>CW-2):
            sh=round(CW/2-(L+Rr)/2) if Rr-L<CW-4 else round(2-L);ims=[(im,o+sh,y) for im,o,y in ims]
        for k,(im,ox,oy) in enumerate(ims):
            clip=max(clip,-ox,ox+im.width-CW,-oy);t=Image.new('RGBA',(CW,CH),(0,0,0,0));t.paste(im,(ox,oy),im);out.paste(t,(k*CW,R*CH))
    out.save(P+f'spr/{id}.webp',quality=86,method=6);print(id,'scale %.2f front %.2f clipped %dpx'%(side,fsc,max(0,clip)),os.path.getsize(P+f'spr/{id}.webp')//1024,'KB')
cs=open(P+'tools/cardsheet.py').read();cs=cs[cs.index('def faces('):cs.index('for id,(rank,th,_) in CARDS.items()')]
# the art window is measured against the ORIGINAL finished cards (the live repo), never the remade ones; LT measured on Glacius Rex
cs=cs.replace("P+f'cards/{o}.webp'","'/home/claude/pixeldeck/cards/'+o+'.webp'").replace("'SL':['h03','h22','h07']}","'SL':['h03','h22','h07'],'LT':['h28','h18'],'R':['h05','h09','h10','h08']}")
assert "/home/claude/pixeldeck/cards/" in cs and "'LT'" in cs
fs={'np':np,'Image':Image,'nd':nd,'P':P,'U':'/tmp/claude-0/-home-claude/faf65de1-a492-52b3-8473-ee4e7e7dcc7a/scratchpad/r16art/','glob':glob};exec('from PIL import ImageEnhance\n'+cs,fs)
os.makedirs('/tmp/claude-0/-home-claude/faf65de1-a492-52b3-8473-ee4e7e7dcc7a/scratchpad/r16art',exist_ok=True)
for id,(rank,th) in CARDS.items():
    if len(sys.argv)>1 and id not in sys.argv[1:]:continue
    if not os.path.exists(U+id+'/idle.png'):continue
    build(id,th)
    if os.path.exists(U+id+'/art.png'):
        Image.open(U+id+'/art.png').save(f'/tmp/claude-0/-home-claude/faf65de1-a492-52b3-8473-ee4e7e7dcc7a/scratchpad/r16art/{id}-x-art.png');fs['faces'](id,rank)
    else:print(id,'no card art yet - keeps the old card face')
