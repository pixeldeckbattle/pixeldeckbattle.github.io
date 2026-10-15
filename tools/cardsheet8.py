# b183: Thai-literature cards. Sources in tools/cards_in3: <id>-<name>-art.png (painted card art) and three 8-frame sheets from GPT,
# -walk / -attack / -front, each a 2x4 grid on magenta, side views facing RIGHT. The game's card sheets face LEFT, so side views are mirrored.
# Makes spr/<id>.webp = 8 columns x 4 rows of 252x204 cells (idle, walk, attack, front; the game marks these cards f8),
# art/<id>.webp and cards/<id>.webp through cardsheet.py's faces(). The side idle row is the attack sheet's last frame (its ready stance) breathing.
import sys,glob,numpy as np
from PIL import Image
from scipy import ndimage as nd
P='/home/claude/pixeldeck/';U=P+'tools/cards_in3/'
src=open(P+'tools/monsheet2.py').read().split("TINT={")[0];ns={};exec(src,ns);key=ns['key']
CW,CH,BASE=252,204,196
CARDS={'h29':('SL',158),'h30':('SL',176),'h31':('SL',160),'h34':('L',170)}
def cells(path,mirror):
    rgba=key(Image.open(path));H,W=rgba.shape[:2];out=[]
    for r in range(2):
        for c in range(4):
            x=rgba[int(round(r*H/2)):int(round((r+1)*H/2)),int(round(c*W/4)):int(round((c+1)*W/4))].copy()
            m=x[...,3]>40;lab,n=nd.label(m)
            if n>1:   # keep the figure and what touches it; drop specks a neighbour cell spilled in at the edges
                sz=nd.sum(m,lab,range(1,n+1));big=int(np.argmax(sz))+1;w=x.shape[1]
                for i in range(1,n+1):
                    if i==big:continue
                    xs=np.where(lab==i)[1]
                    if sz[i-1]<sz[big-1]*.01 and (xs.min()<4 or xs.max()>w-5):x[lab==i]=0
            if mirror:x=x[:,::-1].copy()
            out.append(x)
    return out
def bbox(c):
    ys,xs=np.where(c[...,3]>40);return xs.min(),xs.max(),ys.min(),ys.max()
def build(id,th):
    walk=cells(glob.glob(U+id+'-*-walk.png')[0],True);atk=cells(glob.glob(U+id+'-*-attack.png')[0],True);front=cells(glob.glob(U+id+'-*-front.png')[0],False)
    wb=[bbox(c) for c in walk];bh=np.median([b[3]-b[2] for b in wb]);bw=np.median([b[1]-b[0] for b in wb]);sc=min(th/bh,236/bw)
    fb=[bbox(c) for c in front];fsc=min(th/np.median([b[3]-b[2] for b in fb]),236/np.median([b[1]-b[0] for b in fb]))
    out=Image.new('RGBA',(CW*8,CH*4),(0,0,0,0));clip=0
    def put(c,r,k,s,anchor,dy=0,sy=1.0):
        nonlocal clip
        x0,x1,y0,y1=bbox(c);im=Image.fromarray(c,'RGBA').resize((max(1,round(c.shape[1]*s)),max(1,round(c.shape[0]*s*sy))),Image.LANCZOS)
        ox=round(anchor-(x1+1)*s) if r==2 else round(CW/2-anchor*s);oy=round(BASE-(y1+1)*s*sy)+dy
        clip=max(clip,-ox,ox+im.width-CW,-oy);t=Image.new('RGBA',(CW,CH),(0,0,0,0));t.paste(im,(ox,oy),im);out.paste(t,(k*CW,r*CH))
    wc=np.median([(b[0]+b[1])/2 for b in wb])
    # attack frames line up on their back edge (the right side once mirrored), so the body stays put while the weapon reaches out
    ab=[bbox(c) for c in atk];right=CW/2+min(np.median([b[1]-b[0] for b in ab]),bw*1.25)*sc/2
    rest=atk[7];rb=bbox(rest)
    for k in range(8):
        put(rest,0,k,sc,(rb[0]+rb[1])/2,sy=1+.012*np.sin(k/8*2*np.pi))   # idle: the ready stance breathing
        put(walk[k],1,k,sc,wc);put(atk[k],2,k,sc,right)
        put(front[k],3,k,fsc,np.median([(b[0]+b[1])/2 for b in fb]))
    out.save(P+f'spr/{id}.webp',quality=90,method=6);print(id,'scale %.2f body %dx%d clipped %d'%(sc,bw*sc,bh*sc,max(0,clip)))
# card art and the framed card: cardsheet.py's faces(), pointed at this folder
cs=open(P+'tools/cardsheet.py').read();cs=cs[cs.index('def faces('):cs.index('for id,(rank,th,_) in CARDS.items()')]
fs={'np':np,'Image':Image,'nd':nd,'P':P,'U':U,'glob':glob};exec('from PIL import ImageEnhance\n'+cs,fs)
for id,(rank,th) in CARDS.items():
    if len(sys.argv)>1 and id not in sys.argv[1:]:continue
    build(id,th);fs['faces'](id,rank)
