# b192 profile frames: tools/pf_in/pf-<id>.png (4x4 sheet, magenta, round hole in the middle) -> pf/<id>.webp, one strip of 16 cells.
# Every cell is re-centred on its own hole and scaled so the hole is exactly HOLE of the cell, so the avatar under it never moves.
import glob,os,numpy as np
from PIL import Image
from scipy import ndimage as nd
P='/home/claude/pixeldeck/';CELL=160;HOLE=.5
for f in sorted(glob.glob(P+'tools/pf_in/pf-*.png')):
    n=os.path.basename(f)[3:-4];a=np.asarray(Image.open(f).convert('RGB')).astype(int);cw=a.shape[0]//4
    mag=(a[...,0]>170)&(a[...,2]>170)&(a[...,1]<130);out=Image.new('RGBA',(CELL*16,CELL))
    for i in range(16):
        r,c=divmod(i,4);sl=(slice(r*cw,(r+1)*cw),slice(c*cw,(c+1)*cw));m=mag[sl];cell=a[sl]
        lab,_=nd.label(m);l=lab[cw//2,cw//2];ys,xs=np.where(lab==l);cx,cy=xs.mean(),ys.mean();hw=(xs.max()-xs.min()+ys.max()-ys.min())/2
        near=nd.binary_dilation(m,iterations=4)&~m;cell=cell.copy()   # de-spill: edge pixels pick up magenta, pull their blue back down
        spill=near&(cell[...,2]>cell[...,1]+40)&(cell[...,0]>cell[...,1]+40);cell[...,2]=np.where(spill,np.maximum(cell[...,1],(cell[...,0]*.35).astype(int)),cell[...,2])
        alpha=np.where(m,0,np.where(spill,200,255)).astype('uint8');im=Image.fromarray(np.dstack([cell.astype('uint8'),alpha]),'RGBA')
        k=CELL*HOLE/hw;im=im.resize((max(1,int(cw*k)),max(1,int(cw*k))),Image.LANCZOS)
        one=Image.new('RGBA',(CELL,CELL));one.paste(im,(int(CELL/2-cx*k),int(CELL/2-cy*k)),im);out.paste(one,(i*CELL,0))   # own canvas: nothing leaks into the next cell
    out.save(P+f'pf/{n}.webp',quality=80,method=6);print(n,os.path.getsize(P+f'pf/{n}.webp')//1024,'KB')
