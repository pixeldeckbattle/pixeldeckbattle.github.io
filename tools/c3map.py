# b183 Chapter 3 maps (tools/c3_maps/<realm>-<1|2>.png, 16:9) -> bg/r<7|8|9><1|2>.webp, 1280x512, remapped like ch2map.py (YB foot of the back scenery, YF front of the open floor, CW centred crop width)
from PIL import Image
exec(open('/home/claude/pixeldeck/tools/ch2map.py').read().split("D='")[0])
D='/home/claude/pixeldeck/tools/c3_maps/';P='/home/claude/pixeldeck/bg/';G0,G1=240,425
J={'himmaphan-1':(560,850,1),'himmaphan-2':(525,830,1),'lanka-1':(505,870,1),'lanka-2':(495,860,1),'ocean-2':(490,690,.8)}
OUT={'himmaphan':7,'lanka':8,'ocean':9}
for k,(yb,yf,cw) in J.items():
    im=Image.open(D+k+'.png').convert('RGB');W,H=im.size;w=round(W*cw);x0=(W-w)//2;sx=1280/w;km=(G1-G0)/(yf-yb)
    top=max(0,round(yb-G0/(sx*.8)));bot=min(H,round(yf+(512-G1)/km));out=Image.new('RGB',(1280,512))
    for (a,b,c,d) in ((top,yb,0,G0),(yb,yf,G0,G1),(yf,bot,G1,512)):out.paste(im.crop((x0,a,x0+w,b)).resize((1280,d-c),Image.LANCZOS),(0,c))
    n=f"r{OUT[k.split('-')[0]]}{k[-1]}";out.save(P+n+'.webp',quality=84,method=6);print(n,k)
