# Chapter 2 realm maps: 16:9 paintings (tools/ch2_maps/<realm>-<1|2>.png) -> bg/r<realm><1|2>.webp, 1280x512.
# The game puts the back row's feet 240px down the map and the front row's at ~420 (see SPOT), so every picture is remapped piecewise:
#   scenery above YB (the foot of the back fence/rail) -> rows 0..240, squeezed a little like mapcut;
#   the open floor YB..YF -> rows 240..425, so the back row stands just in front of the rail and the front row before any front fence/rubble;
#   the rest under YF -> rows 425..512 at the floor's own scale.
# When the open floor is short the picture is cropped to a centred width CW (zoom) so the floor does not get stretched tall.
from PIL import Image
D='/home/claude/pixeldeck/tools/ch2_maps/';P='/home/claude/pixeldeck/bg/'
G0,G1=240,425
J={'sea-1':(585,725,.74),'sea-2':(548,850,1),'volcano-1':(600,738,.72),'volcano-2':(585,752,.8),'glacier-1':(600,800,.92),'glacier-2':(585,880,1),
   'sky-1':(608,830,.95),'sky-2':(605,880,1),'clock-1':(615,900,1),'clock-2':(600,880,1),'void-1':(570,790,.92),'void-2':(588,900,1)}
OUT={'sea':1,'volcano':2,'glacier':3,'sky':4,'clock':5,'void':6}
for k,(yb,yf,cw) in J.items():
    im=Image.open(D+k+'.png').convert('RGB');W,H=im.size;w=round(W*cw);x0=(W-w)//2;sx=1280/w;km=(G1-G0)/(yf-yb)
    top=max(0,round(yb-G0/(sx*.8)));bot=min(H,round(yf+(512-G1)/km))
    out=Image.new('RGB',(1280,512))
    for (a,b,c,d) in ((top,yb,0,G0),(yb,yf,G0,G1),(yf,bot,G1,512)):out.paste(im.crop((x0,a,x0+w,b)).resize((1280,d-c),Image.LANCZOS),(0,c))
    n=f"r{OUT[k.split('-')[0]]}{k[-1]}";out.save(P+n+'.webp',quality=84,method=6)
    print(n,k,'zoom %.2f'%(1/cw),'floor stretch %.2f'%(km/sx),'sky rows',top,'bottom',bot)
