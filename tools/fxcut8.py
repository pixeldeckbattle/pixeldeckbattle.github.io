# b183 prep: the 8-frame effect sheets (2 rows x 4 cells on magenta, from GPT) in tools/fx8_in/<name>.png -> fx/<name>.webp, one strip of 8 cells.
# Magenta is un-mixed like fxcut.py, so glow becomes real transparency. All 8 frames share one box (the union of what is drawn in every cell),
# so a ground effect stays on the ground and nothing wanders between frames. Size = the strip cell's longer side in px.
import sys,glob,os,numpy as np
from PIL import Image
P='/home/claude/pixeldeck/';D=P+'tools/fx8_in/';OUT=P+'fx/'
def key(im):
    a=np.asarray(im.convert('RGB')).astype(float);bg=np.median(np.concatenate([a[:12].reshape(-1,3),a[-12:].reshape(-1,3)]),0);r,g,b=a[...,0],a[...,1],a[...,2]
    m=np.minimum(r,b)-g;mb=min(bg[0],bg[2])-bg[1];al=np.clip((mb-22-m)/(mb-22-70),0,1)
    k=np.clip(al,.08,1)[...,None];f=np.clip((a-(1-al[...,None])*bg)/k,0,255)
    al[al<.06]=0;rgba=np.dstack([f,al*255]).astype('uint8')
    # a pink fringe left where glow met magenta: pull its red and blue back towards green
    f=rgba[...,:3].astype(float);g=f[...,1];mm=np.minimum(f[...,0],f[...,2])-g;z=(mm>12)&(rgba[...,3]<230)
    f[...,0]=np.where(z,g+(f[...,0]-g)*.55,f[...,0]);f[...,2]=np.where(z,g+(f[...,2]-g)*.35,f[...,2]);rgba[...,:3]=f.astype('uint8');return rgba
SIZE={'fx-crit':170,'fx-ko':170}
def cut(name):
    rgba=key(Image.open(D+name+'.png'));H,W=rgba.shape[:2];cw,ch=W/4,H/2
    cells=[rgba[int(round(r*ch)):int(round((r+1)*ch)),int(round(c*cw)):int(round((c+1)*cw))] for r in range(2) for c in range(4)]
    h=min(x.shape[0] for x in cells);w=min(x.shape[1] for x in cells);cells=[x[:h,:w] for x in cells]
    m=np.zeros((h,w),bool)
    for x in cells:m|=x[...,3]>40
    ys,xs=np.where(m);y0,y1,x0,x1=max(0,ys.min()-2),min(h,ys.max()+3),max(0,xs.min()-2),min(w,xs.max()+3)
    bw,bh=x1-x0,y1-y0;s=SIZE.get(name,220)/max(bw,bh);ow,oh=max(1,round(bw*s)),max(1,round(bh*s))
    strip=Image.new('RGBA',(ow*8,oh),(0,0,0,0))
    for i,x in enumerate(cells):strip.paste(Image.fromarray(x[y0:y1,x0:x1],'RGBA').resize((ow,oh),Image.LANCZOS),(i*ow,0))
    strip.save(OUT+name+'.webp',quality=88,method=6);print(name,ow,'x',oh,'anchor-bottom-frac',round(1-(y1/h),3))
only=sys.argv[1:]
for f in sorted(glob.glob(D+'*.png')):
    n=os.path.basename(f)[:-4]
    if not only or n in only:cut(n)
