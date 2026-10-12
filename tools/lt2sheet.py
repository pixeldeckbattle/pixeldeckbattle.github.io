# b172 Glacius Rex (h28, Limited): three 3x2 grids on magenta from GPT (front idle, walk, attack, all facing RIGHT) -> one 6x4 sheet facing LEFT
# like every card sheet (rows: idle, walk, attack, front), written to cards_in/h28-glacius-rex-LT-sheet.png for cardsheet.py. The side idle is made from walk frame 1
# with a small breathing bob, so it matches the walk exactly.
import numpy as np
from PIL import Image
U='/home/claude/pixeldeck/tools/cards_in/lt2/'
from scipy import ndimage as nd
def cells(f):
    # each cell keeps every blob whose centre lies in it, even the part that spills over the cell line (a breath cone), and loses what spills in from a neighbour
    im=Image.open(U+f).convert('RGB');a=np.asarray(im).astype(int);W,H=im.size;m=~((a[...,0]>180)&(a[...,2]>180)&(a[...,1]<110))
    m=nd.binary_opening(m,iterations=1);lab,n=nd.label(m,structure=np.ones((3,3)));cen=nd.center_of_mass(m,lab,range(1,n+1));out=[]
    for r in range(2):
        for c in range(3):
            x0,x1,y0,y1=c*W/3,(c+1)*W/3,r*H/2,(r+1)*H/2;keep=[i+1 for i,(cy,cx) in enumerate(cen) if x0<=cx<x1 and y0<=cy<y1]
            sel=np.isin(lab,keep);pad=110;X0,X1,Y0,Y1=int(max(0,x0-pad)),int(min(W,x1+pad)),int(max(0,y0-pad)),int(min(H,y1+pad))
            t=a[Y0:Y1,X0:X1].copy();t[~sel[Y0:Y1,X0:X1]]=(255,0,255);out.append(Image.fromarray(t.astype('uint8')))
    return out
walk,atk,front=cells('walk.png'),cells('attack.png'),cells('front.png')
CW,CH=760,760;MAG=(255,0,255)
def fit(c,flip=True,dy=0):
    c=c.transpose(Image.FLIP_LEFT_RIGHT) if flip else c;o=Image.new('RGB',(CW,CH),MAG);o.paste(c,((CW-c.width)//2,(CH-c.height)//2+dy));return o
idle=[fit(walk[0],dy=d) for d in (0,1,2,3,2,1)]
rows=[idle,[fit(x) for x in walk],[fit(x) for x in atk],[fit(x,flip=False) for x in front]]
gap=60;sheet=Image.new('RGB',(CW*6,CH*4+gap*3),MAG)
for r,row in enumerate(rows):
    for c,x in enumerate(row):sheet.paste(x,(c*CW,r*(CH+gap)))
sheet.save('/home/claude/pixeldeck/tools/cards_in/h28-glacius-rex-LT-sheet.png');print(sheet.size)
