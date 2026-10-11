# b165: FOUNDER title badge (2x3 frames) and the Lucky Clover amulet (3x2 frames) -> 6-frame horizontal strips. Both are drawn on magenta.
import numpy as np
from PIL import Image
from scipy import ndimage as nd
P='/home/claude/pixeldeck/';D=P+'tools/event_in/'
def key(im):
    a=np.asarray(im.convert('RGB')).astype(float);bg=np.median(np.concatenate([a[:10].reshape(-1,3),a[-10:].reshape(-1,3)]),0);r,g,b=a[...,0],a[...,1],a[...,2]
    m=np.minimum(r,b)-g;mb=min(bg[0],bg[2])-bg[1];al=np.clip((mb-22-m)/(mb-22-70),0,1);k=np.clip(al,.08,1)[...,None];f=np.clip((a-(1-al[...,None])*bg)/k,0,255);al[al<.06]=0
    # what is left of the magenta inside the art (mouths, soft edges) turns warm instead of pink
    R,G,B=f[...,0],f[...,1],f[...,2];mm=np.minimum(R,B)-G;z=mm>10;f[...,2]=np.where(z,G*.6,B)
    return np.dstack([f,al*255]).astype('uint8')
def cut(src,cols,rows,out,h,pad=2):
    rgba=key(Image.open(D+src));H,W=rgba.shape[:2];cw,ch=W/cols,H/rows;cells=[]
    for i in range(cols*rows):
        r,c=divmod(i,cols);cell=rgba[int(round(r*ch)):int(round((r+1)*ch)),int(round(c*cw)):int(round((c+1)*cw))].copy()
        m=cell[...,3]>60;lab,n=nd.label(m);sz=nd.sum(m,lab,range(1,n+1));big=int(np.argmax(sz))+1;ys,xs=np.where(lab==big)
        cells.append((cell,(xs.min(),xs.max(),ys.min(),ys.max())))
    # align every frame on its main body's centre and bottom, then crop all to one shared box
    bw=max(b[1]-b[0] for _,b in cells);S=[]
    for cell,b in cells:
        ys,xs=np.where(cell[...,3]>40);S.append((xs.min()-(b[0]+b[1])/2,xs.max()-(b[0]+b[1])/2,ys.min()-b[3],ys.max()-b[3]))
    x0=int(np.floor(min(s[0] for s in S)))-pad;x1=int(np.ceil(max(s[1] for s in S)))+pad;y0=int(np.floor(min(s[2] for s in S)))-pad;y1=int(np.ceil(max(s[3] for s in S)))+pad
    fw,fh=x1-x0,y1-y0;k=h/fh;w=round(fw*k);strip=Image.new('RGBA',(w*len(cells),h),(0,0,0,0))
    for i,(cell,b) in enumerate(cells):
        cx=(b[0]+b[1])/2;by=b[3];fr=Image.new('RGBA',(fw,fh),(0,0,0,0));im=Image.fromarray(cell,'RGBA');fr.paste(im,(int(round(-x0-cx)),int(round(-y0-by))))
        strip.paste(fr.resize((w,h),Image.LANCZOS),(i*w,0))
    strip.save(P+out,quality=90,method=6);print(out,w,'x',h,'frame box',fw,fh);return strip,w
s,w=cut('founder-badge.png',2,3,'ui/founder.webp',168)
s,w=cut('lucky-clover.png',3,2,'am/clover_a.webp',168)
s.crop((0,0,w,168)).resize((round(w*112/168),112),Image.LANCZOS).save(P+'am/clover.webp',quality=90,method=6)
