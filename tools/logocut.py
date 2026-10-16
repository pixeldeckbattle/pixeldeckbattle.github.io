# b201 lobby logo: tools/logo_in/logo16.png (4x4, 16 frames, magenta) -> ui2/logo16.webp (one strip). Cells are used where GPT drew them (no re-alignment: the shine moves any centroid).
from PIL import Image
import numpy as np
from scipy import ndimage as nd
a=np.asarray(Image.open('/home/claude/pixeldeck/tools/logo_in/logo16.png').convert('RGB')).astype(int);c=a.shape[1]//4
mag=(a[...,0]>170)&(a[...,2]>170)&(a[...,1]<130);out=[]
for i in range(16):
    r,q=divmod(i,4);x=a[r*c:(r+1)*c,q*c:(q+1)*c].copy();m=mag[r*c:(r+1)*c,q*c:(q+1)*c]
    near=nd.binary_dilation(m,iterations=3)&~m;sp=near&(x[...,2]>x[...,1]+40)&(x[...,0]>x[...,1]+40);x[...,2]=np.where(sp,x[...,1],x[...,2])
    out.append(Image.fromarray(np.dstack([x,np.where(m,0,np.where(sp,190,255))]).astype('uint8'),'RGBA'))
u=[f.getbbox() for f in out];X0=min(b[0] for b in u);Y0=min(b[1] for b in u);X1=max(b[2] for b in u);Y1=max(b[3] for b in u)
out=[f.crop((X0,Y0,X1,Y1)) for f in out];w,h=out[0].size;k=400/w;W,H=round(w*k),round(h*k)
s=Image.new('RGBA',(W*16,H))
for i,f in enumerate(out):s.paste(f.resize((W,H),Image.LANCZOS),(i*W,0))
s.save('/home/claude/pixeldeck/ui2/logo16.webp',quality=84,method=6);print(W,H)
