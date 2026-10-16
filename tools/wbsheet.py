# b193 world boss sprite: tools/wb_in/wb1-*.png (4x4 sheets, 16 frames, magenta, facing LEFT) -> spr/wb1.webp and spr/wb1r.webp (rage),
# 16 columns x 4 rows (idle, idle, attack, skill) in the monster cell shape (252x204 at 1.5x), played at 16 fps by .spr.f16.
# Every frame of a source sheet keeps its place in the GPT cell, so the boss never jumps; the lowest pixel of all frames sits on the floor line.
import numpy as np
from PIL import Image
from scipy import ndimage as nd
P='/home/claude/pixeldeck/';W='tools/wb_in/';CW,CH=315,255;BASE=245
def frames(f):
    a=np.asarray(Image.open(P+W+f).convert('RGB')).astype(int);c=a.shape[0]//4;out=[]
    for i in range(16):
        r,q=divmod(i,4);x=a[r*c:(r+1)*c,q*c:(q+1)*c];m=(x[...,0]>170)&(x[...,2]>170)&(x[...,1]<130)
        near=nd.binary_dilation(m,iterations=3)&~m;x=x.copy();sp=near&(x[...,2]>x[...,1]+40)&(x[...,0]>x[...,1]+40);x[...,2]=np.where(sp,x[...,1],x[...,2])
        out.append(Image.fromarray(np.dstack([x,np.where(m,0,255)]).astype('uint8'),'RGBA'))
    return out
def place(fr,s,bottom):
    out=[]
    for im in fr:
        k=im.resize((round(im.width*s),round(im.height*s)),Image.LANCZOS);cell=Image.new('RGBA',(CW,CH));cell.paste(k,((CW-k.width)//2+20,BASE-round(bottom*s)),k);out.append(cell)
    return out
atk=frames('wb1-attack.png');skl=frames('wb1-skill.png');rag=frames('wb1-rage.png');dth=frames('wb1-death.png')
low=lambda fr:max(np.where(np.asarray(f)[...,3]>0)[0].max() for f in fr)
idle_i=[12,12,13,13,14,14,15,15,15,15,14,14,13,13,12,12]
sc=lambda fr:(BASE-6)/low(fr)   # one scale per source sheet, so idle and attack (same sheet) are the same size
for name,rows in [('wb1',[(atk,[atk[i] for i in idle_i]),(atk,[atk[i] for i in idle_i]),(atk,atk),(skl,skl)]),('wb1r',[(rag,rag),(rag,rag),(atk,atk),(rag,rag)]),('wb1d',[(dth,dth)])]:
    sheet=Image.new('RGBA',(CW*16,CH*len(rows)))
    for r,(src,fr) in enumerate(rows):
        for c,cell in enumerate(place(fr,sc(src),low(src))):sheet.paste(cell,(c*CW,r*CH))
    sheet.save(P+f'spr/{name}.webp',quality=78,method=6);import os;print(name,sheet.size,os.path.getsize(P+f'spr/{name}.webp')//1024,'KB')
