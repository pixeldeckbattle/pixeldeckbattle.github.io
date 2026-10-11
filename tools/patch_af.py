import re
F='bit8-tower-wip.html';s=open(F,encoding='utf8').read()
def rep(a,b,n=1):
    global s
    assert s.count(a)==n,(a[:60],s.count(a));s=s.replace(a,b)
# 1 amulets
rep(""" // b165 Limited amulet from the FOUNDER invite event""",""" // b170 SuperLegend amulets: made only at the amulet forge (afDo). They never drop and are in no pack or reward table; they can be sold and traded like the others.
 kfang:{n:'เขี้ยวราชันย์',r:'SL',k:['#ffd0a0','#c81e1e'],a:1.10,d:1,t:'ATK +10%'},
 dscale:{n:'เกราะมังกรเทพ',r:'SL',k:['#8ff0d0','#0f7a5a'],a:1,d:1.10,t:'HP/DEF +10%'},
 deye:{n:'เนตรมรณะ',r:'SL',k:['#c9a0ff','#3a1a8a'],a:1,d:1,c:.05,x:.25,t:'CRIT +5% · CRIT DMG +25%'},
 seraph:{n:'ปีกเซราฟ',r:'SL',k:['#ffffff','#5ab8ff'],a:1,d:1.05,h:1.18,t:'ฮีลและโล่ +18% · HP/DEF +5%'},
 // b165 Limited amulet from the FOUNDER invite event""")
# 2 css
rep(""".art-L{color:#ffd23a}.art-R{color:#6cbcff}""",""".art-L{color:#ffd23a}.art-R{color:#6cbcff}.art-SL{color:#ff9d1a}
.amu.ar-SL{background:radial-gradient(circle at 50% 35%,#7a3a12,#1a0c08 78%);box-shadow:inset 0 0 0 2px var(--k1),0 0 0 2px #0a0e22,0 0 0 4px #ff9d1a,0 0 0 6px #0a0e22,0 0 12px 5px rgba(255,140,30,.85);animation:slaura 1.8s ease-in-out infinite}
.amslot .amu.ar-SL{box-shadow:inset 0 0 0 .5cqw var(--k1),0 0 0 .6cqw #0a0e22,0 0 0 1.3cqw #ff9d1a,0 0 2.4cqw 1.2cqw rgba(255,140,30,.8);animation:none}
@keyframes slaura{50%{filter:brightness(1.25) saturate(1.2)}}
@media (prefers-reduced-motion:reduce){.amu.ar-SL{animation:none}}
.futabs{display:grid;grid-template-columns:1fr 1fr;gap:6px}.futabs .tab{margin:0;text-align:center}
.aflist{display:grid;gap:10px;margin-bottom:14px}
.afrow{display:grid;grid-template-columns:44px minmax(0,1fr) auto;gap:4px 12px;align-items:center;padding:8px 12px;border:3px solid #10142c;border-radius:11px;background:#243074}
.afrow.no{opacity:.55}.afrow b{font-size:14px}.afrow small{display:block;font-size:12px;color:var(--dim);line-height:1.35}
.afst{display:flex;align-items:center;gap:6px}.afst .btn{min-width:46px;padding-left:8px;padding-right:8px}.afst output{min-width:44px;text-align:center;font-family:var(--display);font-weight:700;font-size:18px;color:#ffe45c}
.afto{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:8px}.afto button{display:grid;justify-items:center;gap:4px;padding:8px 4px;border:3px solid #10142c;border-radius:11px;background:#243074;color:var(--ink);font-size:11px;line-height:1.2}.afto button.on{outline:3px solid var(--yellow);outline-offset:1px}.afto .amu{width:38px;height:38px}
.afgot{display:flex;flex-wrap:wrap;gap:10px 16px;align-items:center;margin-bottom:16px;padding:12px;animation:pop .35s steps(5) backwards}.afgot h3{flex:1 0 100%;margin:0}.afgot span{display:flex;align-items:center;gap:8px}.afgot .amu{width:44px;height:44px}
@media (max-height:480px){.afst .btn{min-width:38px}.afto .amu{width:30px;height:30px}}""")
rep(""".dock{display:grid;grid-template-columns:repeat(6,minmax(0,1fr));gap:8px}""",""".dock{display:grid;grid-template-columns:repeat(7,minmax(0,1fr));gap:6px}""")
# 3 dock icon + button
rep(""" cup:pic([""",""" fuse:pic(["............",".kk......kk.","kBBk....kPPk","kBBk....kPPk",".kkYk..kYkk.","...kYkkYk...","....kYYk....","...kYWWYk...","..kYWWWWYk..","..kYWWWWYk..","...kYYYYk...","....kkkk...."],{k:'#080b1f',B:'#4fa8ff',P:'#b48cff',Y:'#ff9d1a',W:'#fff6c0'}),
 cup:pic([""")
rep("""    ${dk('market',UI.market,'c4','ตลาดกลาง','ซื้อขายด้วย Gold',0,1.8)}""","""    ${dk('fusehub',UI.fuse,'c4','ฟิวชั่น',T('การ์ด / เครื่องราง','Cards / amulets'),0,1.5)}
    ${dk('market',UI.market,'c4','ตลาดกลาง','ซื้อขายด้วย Gold',0,1.8)}""")
# 4 forge logic + screen
rep("""function fuse(){const L=fuList();""","""// b170 amulet forge. Spare amulets of one rank + Gold become amulets one rank higher: Rare -> a random Legend, Legend -> the SuperLegend the player picks.
// Only spare pieces are used: worn ones, locked types and Limited amulets never are. The player picks how many of each type go in; whole fusions are taken, any remainder stays.
const AFU={R:{n:10,to:'L',g:1000},L:{n:30,to:'SL',g:20000}};
let fuTab='c',fuFrom='coll',afR='R',afPick={},afTo=null,afGot=null,afArm=false;
const afKeys=r=>Object.keys(AM).filter(k=>AM[k].r===r),afMax=k=>isLock(k)?0:Math.max(0,spare(k)),afN=k=>Math.min(afPick[k]||0,afMax(k)),afSum=()=>afKeys(afR).reduce((n,k)=>n+afN(k),0),afTimes=()=>Math.floor(afSum()/AFU[afR].n);
function afDo(){const R=AFU[afR],t=afTimes(),cost=t*R.g;if(!S||t<1||S.gold<cost)return null;if(afR==='L'&&!(AM[afTo]&&AM[afTo].r==='SL'))return null;
  let need=t*R.n;const use=[];afKeys(afR).map(k=>[k,afN(k)]).sort((a,b)=>b[1]-a[1]).forEach(([k,n])=>{const u=Math.min(n,need);if(u>0){use.push([k,u]);need-=u}});if(need>0)return null;
  S.am=S.am||{};use.forEach(([k,u])=>{S.am[k]-=u;if(S.am[k]<=0)delete S.am[k]});S.gold-=cost;lg('afuse',-cost);
  const out=afKeys(R.to),got={};for(let i=0;i<t;i++){const k=afR==='L'?afTo:out[Math.floor(Math.random()*out.length)];S.am[k]=(S.am[k]||0)+1;got[k]=(got[k]||0)+1}
  S.afn=(S.afn||0)+t;afPick={};return{got,cost,t,used:t*R.n}}
const fuTabs=()=>`<div class="futabs nt"><button class="tab ${fuTab==='c'?'on':''}" data-act="futab" data-t="c">${T('การ์ด','Cards')}</button><button class="tab am ${fuTab==='a'?'on':''}" data-act="futab" data-t="a">${T('เครื่องราง','Amulets')}</button></div>`;
function fuseAm(){const R=AFU[afR],ks=afKeys(afR),sum=afSum(),t=afTimes(),cost=t*R.g,poor=S.gold<cost,left=sum-t*R.n,tos=afKeys('SL');if(afR==='L'&&!tos.includes(afTo))afTo=null;const need=afR==='L'&&!afTo,ok=t>0&&!poor&&!need;if(!ok)afArm=false;
  view(`<div class="cols wide"><div class="rail">
    <div class="row"><button class="btn alt sm" data-act="${fuFrom}">กลับ</button><h2 class="nt">${T('ฟิวชั่นเครื่องราง','Amulet Fusion')}</h2></div>
    ${fuTabs()}
    <span class="num gold nt" style="margin:0">Gold ${S.gold.toLocaleString('en')}</span>
    <div class="futabs nt">${Object.keys(AFU).map(r=>`<button class="tab ${afR===r?'on':''}" data-act="afrank" data-r="${r}"><b class="art-${r}">${RAR[r].n}</b> → <b class="art-${AFU[r].to}">${RAR[AFU[r].to].n}</b></button>`).join('')}</div>
    <div class="px dissum"><span class="sub nt">${T('เลือกแล้ว','Picked')} <b>${sum}</b> ${T('ชิ้น','pcs')} · ${T('ฟิวชั่นได้','fuses')} <b>${t}</b> ${T('ครั้ง','time(s)')}</span><span class="sub nt">${T(`ใช้ ${t*R.n} ชิ้น ได้ ${RAR[R.to].n} ${t} ชิ้น`,`Uses ${t*R.n}, gives ${t} ${RAR[R.to].n}`)}${left&&t?T(` · เศษ ${left} ชิ้นไม่ถูกใช้`,` · ${left} left over stay`):''}</span>${t?'':`<span class="sub nt" style="color:#ffb14a">${T(`ต้องเลือกอย่างน้อย ${R.n} ชิ้น (ขาดอีก ${R.n-sum})`,`Pick at least ${R.n} (${R.n-sum} short)`)}</span>`}</div>
    <button class="btn go sm" data-act="afgo" ${ok?'':'disabled'}><span class="nt">${afArm?T('แตะอีกครั้งเพื่อยืนยัน','Tap again to confirm'):T('ฟิวชั่น','Fuse')+(t?' · '+cost.toLocaleString('en')+' Gold':'')}</span></button>
    ${t&&poor?`<p class="sub nt" style="color:#ffb14a">${T('Gold ไม่พอ','Not enough Gold')}</p>`:t&&need?`<p class="sub nt" style="color:#ffb14a">${T('เลือกเครื่องราง SuperLegend ที่ต้องการก่อน','Pick the SuperLegend amulet you want first')}</p>`:''}
    <div class="px dissum">${Object.keys(AFU).map(r=>`<span class="sub nt">${RAR[r].n} ${AFU[r].n} ${T('ชิ้น','pcs')} + ${AFU[r].g.toLocaleString('en')} Gold → <b style="font-size:inherit">${RAR[AFU[r].to].n}</b> 1 ${T('ชิ้น','pc')}</span>`).join('')}</div>
    <p class="sub nt">${T('ผสมชนิดกันได้ · Rare ได้ Legend แบบสุ่มชนิด · Legend เลือก SuperLegend ที่ต้องการได้ · ใช้เฉพาะชิ้นที่ว่าง ชิ้นที่ใส่อยู่และชนิดที่ล็อคไม่ถูกใช้ · เครื่องราง SuperLegend ได้จากฟิวชั่นเท่านั้น ไม่ดรอปจากด่าน · ฟิวชั่นแล้วเอาคืนไม่ได้','Types can be mixed · Rare gives a random Legend · Legend gives the SuperLegend you pick · only spare pieces are used, never worn ones or locked types · SuperLegend amulets come from fusion only and never drop · fusion cannot be undone')}</p>
  </div><div class="main">${afGot?`<div class="px afgot nt"><h3>${T('ฟิวชั่นสำเร็จ!','Fusion complete!')}</h3>${Object.keys(afGot.got).map(k=>`<span><i style="width:44px">${amu(k)}</i><b>${AM[k].n} ×${afGot.got[k]}</b></span>`).join('')}</div>`:''}
    ${afR==='L'?`<p class="sub nt" style="margin-bottom:6px">${T('เลือกเครื่องราง SuperLegend ที่จะได้','Pick the SuperLegend amulet to make')}</p><div class="afto nt" style="margin-bottom:14px">${tos.map(k=>`<button class="${afTo===k?'on':''}" data-act="afto" data-k="${k}" aria-pressed="${afTo===k}">${amu(k)}<b>${AM[k].n}</b><span>${AM[k].t}</span></button>`).join('')}</div>`:''}
    <div class="row" style="margin-bottom:10px;gap:8px"><button class="btn sm" data-act="afall"><span class="nt">${T('ใส่ทั้งหมดที่ว่าง','Add all spare')}</span></button><button class="btn alt sm" data-act="afclr"><span class="nt">${T('ล้าง','Clear')}</span></button></div>
    <div class="aflist">${ks.map(k=>{const m=afMax(k),n=afN(k);return `<div class="afrow nt ${m?'':'no'}"><i style="width:44px">${amu(k)}</i><span><b>${isLock(k)?'🔒 ':''}${AM[k].n} ×${owned(k)}</b><small>${AM[k].t}</small><small>${isLock(k)?T('ล็อคอยู่ ไม่ถูกใช้','locked, not used'):T(`ว่าง ${spare(k)} · ใส่อยู่ ${worn(k)}`,`spare ${spare(k)} · worn ${worn(k)}`)}</small></span><span class="afst"><button class="btn alt sm" data-act="afadd" data-k="${k}" data-n="-10" ${n?'':'disabled'} aria-label="-10">−10</button><output>${n}</output><button class="btn sm" data-act="afadd" data-k="${k}" data-n="10" ${n<m?'':'disabled'} aria-label="+10">+10</button><button class="btn sm" data-act="afadd" data-k="${k}" data-n="9999" ${n<m?'':'disabled'}>${T('หมด','All')}</button></span></div>`}).join('')}</div>
  </div></div>`)}
function fuse(){if(fuTab==='a')return fuseAm();const L=fuList();""")
rep("""<div class="row"><button class="btn alt sm" data-act="coll">กลับ</button><h2 class="nt">${T('ฟิวชั่นการ์ด','Card Fusion')}</h2></div>
    <span class="num gold nt" style="margin:0">Gold""","""<div class="row"><button class="btn alt sm" data-act="${fuFrom}">กลับ</button><h2 class="nt">${T('ฟิวชั่นการ์ด','Card Fusion')}</h2></div>
    ${fuTabs()}
    <span class="num gold nt" style="margin:0">Gold""")
# 5 handlers
rep("""  else if(a==='fuse'){fuSel=null;fuGot=null;fuse()}""","""  else if(a==='fuse'||a==='fusehub'){fuSel=null;fuGot=null;afGot=null;afArm=false;afPick={};fuFrom=a==='fuse'?'coll':'home';if(a==='fuse')fuTab='c';fuse()}
  else if(a==='futab'){fuTab=t.dataset.t==='a'?'a':'c';fuGot=null;afGot=null;afArm=false;fuse()}
  else if(a==='afrank'||a==='afadd'||a==='afall'||a==='afclr'||a==='afto'||a==='afgo'){const m=document.querySelector('.main'),y=m?m.scrollTop:0;let top=0;
    if(a==='afrank'){afR=AFU[t.dataset.r]?t.dataset.r:'R';afPick={};afGot=null;afArm=false;top=1}
    else if(a==='afadd'){const k=t.dataset.k;if(AM[k]&&AM[k].r===afR){afPick[k]=Math.max(0,Math.min(afMax(k),afN(k)+(+t.dataset.n||0)));afArm=false;afGot=null}}
    else if(a==='afall'){afKeys(afR).forEach(k=>afPick[k]=afMax(k));afArm=false;afGot=null}
    else if(a==='afclr'){afPick={};afArm=false}
    else if(a==='afto'){afTo=t.dataset.k;afArm=false}
    else if(!afArm){afArm=true}
    else{afArm=false;const g=afDo();if(g){afGot=g;save();cloudFlush();sfx('win');fx.push(['view','-'+g.cost.toLocaleString('en')+' Gold','g']);top=1}}
    fuseAm();const m2=document.querySelector('.main');if(m2)m2.scrollTop=top?0:y}""")
# 6 guide + news
rep("""+ul([T('การ์ดใส่เครื่องรางได้ใบละ 1 ชิ้น ใส่และถอดได้ฟรีที่หน้า "เครื่องราง"','One amulet per card; equip and remove freely on the Amulets screen'),""","""+ul([T('การ์ดใส่เครื่องรางได้ใบละ 1 ชิ้น ใส่และถอดได้ฟรีที่หน้า "เครื่องราง"','One amulet per card; equip and remove freely on the Amulets screen'),
      T(`<b>ฟิวชั่นเครื่องราง</b> (ปุ่ม "ฟิวชั่น" ที่ล็อบบี้ แท็บเครื่องราง): Rare ${AFU.R.n} ชิ้น + ${N(AFU.R.g)} Gold ได้ Legend 1 ชิ้น (สุ่มชนิด) · Legend ${AFU.L.n} ชิ้น + ${N(AFU.L.g)} Gold ได้ SuperLegend 1 ชิ้น (เลือกชนิดได้) · ผสมชนิดกันได้ ใช้เฉพาะชิ้นที่ว่าง ชิ้นที่ใส่อยู่ ชนิดที่ล็อค และ Lucky Clover ไม่ถูกใช้ · ฟิวชั่นแล้วเอาคืนไม่ได้`,`<b>Amulet fusion</b> (the Fusion button in the lobby, Amulets tab): ${AFU.R.n} Rare + ${N(AFU.R.g)} Gold make 1 Legend (random type) · ${AFU.L.n} Legend + ${N(AFU.L.g)} Gold make 1 SuperLegend (your pick) · types can be mixed; only spare pieces are used, never worn ones, locked types or Lucky Clover · fusion cannot be undone`),
      T('<b>เครื่องราง SuperLegend</b> ได้จากฟิวชั่นเท่านั้น ไม่ดรอปจากด่าน ไม่อยู่ในแพ็คหรือรางวัลใดๆ · ขายในตลาดกลางและเทรดได้','<b>SuperLegend amulets</b> come from fusion only: they never drop and are in no pack or reward · they can be sold on the market and traded'),""")
rep("""   <span>📬 <b>${T('กล่องจดหมาย','Mailbox')}</b>""","""   <span>⚗️ <b>${T('ฟิวชั่นเครื่องราง','Amulet fusion')}</b> · ${T('ปุ่มฟิวชั่นใหม่ที่ล็อบบี้ รวมเครื่องรางที่ไม่ใช้เป็นระดับสูงขึ้น พร้อมเครื่องราง SuperLegend 4 ชนิดที่ได้จากฟิวชั่นเท่านั้น','a new Fusion button in the lobby turns unused amulets into higher ranks, with 4 SuperLegend amulets made only by fusion')}</span>
   <span>📬 <b>${T('กล่องจดหมาย','Mailbox')}</b>""")
open(F,'w',encoding='utf8').write(s)
# admin
A='admin-wip.src.html';a=open(A,encoding='utf8').read()
x="fuse:'ฟิวชั่นการ์ด',";assert a.count(x)==1;a=a.replace(x,x+"afuse:'ฟิวชั่นเครื่องราง',")
x="(AMS[k]||[])[1]==='L'?'g2':'b2'";assert a.count(x)==1;a=a.replace(x,"(AMS[k]||[])[1]==='SL'?'o2':(AMS[k]||[])[1]==='L'?'g2':'b2'")
x=".g2{background:#4a3d0f;color:#ffe9a0}";assert a.count(x)==1;a=a.replace(x,x+".o2{background:#5a2a0a;color:#ffc48a}")
open(A,'w',encoding='utf8').write(a);print('ok')
