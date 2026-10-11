F='bit8-tower-wip.html';s=open(F,encoding='utf8').read()
def rep(a,b,n=1):
    global s
    assert s.count(a)==n,(a[:70],s.count(a));s=s.replace(a,b)
def cut(a,b,new):
    global s
    i=s.index(a);j=s.index(b,i);assert s.count(a)==1;s=s[:i]+new+s[j:]
# --- logic: target-first flow, SL amulet can break
cut("const AFU={R:","function fuse(){","""const AFU={R:{n:10,to:'L',g:1000},L:{n:30,to:'SL',g:20000,p:.6,pity:.1}};
// The fusion hub is target-first: the player picks the rank they want (fuTo), then the screen for that rank asks for the materials. fuTab: 'c' cards, 'a' amulets.
// A SuperLegend amulet fusion can break: chance p, +pity for every break in a row (S.afp) until the next success. A break loses the materials and the Gold.
let fuTab='c',fuFrom='coll',fuTo=null,afPick={},afTo=null,afGot=null,afArm=false;
const afFrom=to=>Object.keys(AFU).find(r=>AFU[r].to===to)||'R',afRk=()=>afFrom(fuTo),afP=r=>{const R=AFU[r];return R.p?Math.min(1,R.p+(R.pity||0)*((S&&S.afp)||0)):1},fuFromR=to=>Object.keys(FUSE.up).find(r=>FUSE.up[r]===to);
const afKeys=r=>Object.keys(AM).filter(k=>AM[k].r===r),afMax=k=>isLock(k)?0:Math.max(0,spare(k)),afN=k=>Math.min(afPick[k]||0,afMax(k)),afSum=()=>afKeys(afRk()).reduce((n,k)=>n+afN(k),0),afTimes=()=>Math.floor(afSum()/AFU[afRk()].n);
function afDo(){const r=afRk(),R=AFU[r],t=afTimes(),cost=t*R.g;if(!S||t<1||S.gold<cost)return null;if(r==='L'&&!(AM[afTo]&&AM[afTo].r==='SL'))return null;
  let need=t*R.n;const use=[];afKeys(r).map(k=>[k,afN(k)]).sort((a,b)=>b[1]-a[1]).forEach(([k,n])=>{const u=Math.min(n,need);if(u>0){use.push([k,u]);need-=u}});if(need>0)return null;
  S.am=S.am||{};use.forEach(([k,u])=>{S.am[k]-=u;if(S.am[k]<=0)delete S.am[k]});S.gold-=cost;lg('afuse',-cost);
  const out=afKeys(R.to),got={};let ok=0,bad=0;for(let i=0;i<t;i++){if(Math.random()<afP(r)){const k=r==='L'?afTo:out[Math.floor(Math.random()*out.length)];S.am[k]=(S.am[k]||0)+1;got[k]=(got[k]||0)+1;ok++;if(R.p)S.afp=0}else{bad++;S.afp=(S.afp||0)+1}}
  S.afn=(S.afn||0)+ok;afPick={};return{got,cost,t,ok,bad,used:t*R.n}}
const fuTabs=()=>`<div class="futabs nt"><button class="tab ${fuTab==='c'?'on':''}" data-act="futab" data-t="c">${T('การ์ด','Cards')}</button><button class="tab am ${fuTab==='a'?'on':''}" data-act="futab" data-t="a">${T('เครื่องราง','Amulets')}</button></div>`;
const fuCnt=r=>Object.keys(S.cards).filter(id=>C[id]&&C[id].r===r&&fuCan(id)).reduce((n,id)=>n+Math.floor((S.cards[id].cp||0)/fuN(id)),0),afCnt=r=>Math.floor(afKeys(r).reduce((n,k)=>n+afMax(k),0)/AFU[r].n);
// step 1: what do you want to make?
function fuHub(){const isA=fuTab==='a',P=p=>Math.round(p*100)+'%';
  const tile=(to,cls,from,n,g,p,can,unit)=>`<button class="futile ${can?'':'no'}" data-act="futo" data-r="${to}"><small>${T('อยากได้','Make')}</small><b class="nt ${cls}">${RAR[to].n}</b><span>${T('ใช้','Uses')} <b>${RAR[from].n}</b> ${n} ${unit}</span><span>+ ${g.toLocaleString('en')} Gold</span><span class="${p<1?'risk':''}">${T('โอกาสสำเร็จ','Success')} <b>${P(p)}</b></span><em class="${can?'ok':''}">${can?T(`ทำได้ตอนนี้ ${can} ครั้ง`,`${can} possible now`):T('วัตถุดิบยังไม่พอ','Not enough materials')}</em></button>`;
  view(`<div class="cols wide"><div class="rail">
    <div class="row"><button class="btn alt sm" data-act="${fuFrom}">กลับ</button><h2 class="nt">${T('ฟิวชั่น','Fusion')}</h2></div>
    ${fuTabs()}
    <span class="num gold nt" style="margin:0">Gold ${S.gold.toLocaleString('en')}</span>
    <div class="px dissum nt"><span class="sub"><b>1</b> ${T('เลือกระดับที่อยากได้','Pick the rank you want')}</span><span class="sub"><b>2</b> ${T('ใส่วัตถุดิบ','Add the materials')}</span><span class="sub"><b>3</b> ${T('กดฟิวชั่น','Press Fuse')}</span></div>
    <p class="sub nt">${isA?T('เครื่องรางผสมชนิดกันได้ · ชิ้นที่ใส่อยู่และชนิดที่ล็อคไม่ถูกใช้ · เครื่องราง SuperLegend ได้จากฟิวชั่นเท่านั้น','Amulet types can be mixed · worn pieces and locked types are never used · SuperLegend amulets come from fusion only'):T('ใช้ใบซ้ำของการ์ดตัวเดียวกัน ได้การ์ดระดับสูงขึ้น 1 ใบแบบสุ่มตัว · การ์ดตัวจริง เลเวล และดาวไม่หาย','Spare copies of one card give 1 random card of the next rank · your card, its level and stars stay')}</p>
  </div><div class="main"><p class="sub nt" style="margin-bottom:8px">${isA?T('อยากได้เครื่องรางระดับไหน','Which amulet rank do you want?'):T('อยากได้การ์ดระดับไหน','Which card rank do you want?')}</p>
    <div class="futiles ${isA?'two':''}">${isA?Object.keys(AFU).map(r=>tile(AFU[r].to,'art-'+AFU[r].to,r,AFU[r].n,AFU[r].g,afP(r),afCnt(r),T('ชิ้น','pcs'))).join(''):Object.keys(FUSE.up).map(r=>tile(FUSE.up[r],'r-'+FUSE.up[r]+' glc',r,FUSE.n[r],FUSE.gold[r],1,fuCnt(r),T('ใบซ้ำ','copies'))).join('')}</div>
  </div></div>`)}
// step 2 (amulets): put the materials in
function fuseAm(){const r=afRk(),R=AFU[r],ks=afKeys(r),sum=afSum(),t=afTimes(),cost=t*R.g,poor=S.gold<cost,left=sum-t*R.n,tos=afKeys('SL'),p=afP(r),P=x=>Math.round(x*100)+'%';if(r==='L'&&!tos.includes(afTo))afTo=null;const need=r==='L'&&!afTo,ok=t>0&&!poor&&!need;if(!ok)afArm=false;
  view(`<div class="cols wide"><div class="rail">
    <div class="row"><button class="btn alt sm" data-act="fuback">กลับ</button><h2 class="nt">${T('ฟิวชั่นเครื่องราง','Amulet Fusion')}</h2></div>
    <span class="num gold nt" style="margin:0">Gold ${S.gold.toLocaleString('en')}</span>
    <div class="px dissum nt"><span class="sub">${T('อยากได้','Making')} <b class="art-${R.to}" style="font-size:inherit">${RAR[R.to].n}</b></span><span class="sub">${T('ต่อ 1 ครั้ง','Each fusion')}: <b>${RAR[r].n}</b> ${R.n} ${T('ชิ้น','pcs')} + ${R.g.toLocaleString('en')} Gold</span><span class="sub ${p<1?'risk':''}">${T('โอกาสสำเร็จ','Success')} <b>${P(p)}</b>${R.p&&S.afp?T(` (แตกติดกัน ${S.afp} ครั้ง +${P(R.pity*S.afp)})`,` (${S.afp} break(s) in a row, +${P(R.pity*S.afp)})`):''}</span></div>
    ${R.p?`<p class="sub nt risk">⚠ ${T(`ถ้าแตก เครื่องรางที่ใส่และ Gold ของครั้งนั้นหายทั้งหมด · ทุกครั้งที่แตก โอกาสครั้งถัดไป +${P(R.pity)} จนกว่าจะสำเร็จ`,`If it breaks, that fusion's amulets and Gold are lost · every break adds +${P(R.pity)} to the next try until one succeeds`)}</p>`:''}
    <div class="px dissum nt"><span class="sub">${T('ใส่แล้ว','Added')} <b>${sum}</b> ${T('ชิ้น','pcs')} · ${T('ฟิวชั่นได้','fuses')} <b>${t}</b> ${T('ครั้ง','time(s)')}</span>${t?`<span class="sub">${T(`ใช้ ${t*R.n} ชิ้น`,`Uses ${t*R.n}`)}${left?T(` · เศษ ${left} ชิ้นไม่ถูกใช้`,` · ${left} left over stay`):''}</span>`:`<span class="sub" style="color:#ffb14a">${T(`ใส่อีก ${R.n-sum} ชิ้นจึงจะฟิวชั่นได้`,`Add ${R.n-sum} more to fuse`)}</span>`}</div>
    <button class="btn go sm" data-act="afgo" ${ok?'':'disabled'}><span class="nt">${afArm?T('แตะอีกครั้งเพื่อยืนยัน','Tap again to confirm'):T('ฟิวชั่น','Fuse')+(t?` ×${t} · ${cost.toLocaleString('en')} Gold`:'')}</span></button>
    ${t&&poor?`<p class="sub nt" style="color:#ffb14a">${T('Gold ไม่พอ','Not enough Gold')}</p>`:t&&need?`<p class="sub nt" style="color:#ffb14a">${T('เลือกเครื่องราง SuperLegend ที่ต้องการก่อน','Pick the SuperLegend amulet you want first')}</p>`:''}
    <p class="sub nt">${T('ผสมชนิดกันได้ · ใช้เฉพาะชิ้นที่ว่าง ชิ้นที่ใส่อยู่และชนิดที่ล็อคไม่ถูกใช้ · ฟิวชั่นแล้วเอาคืนไม่ได้','Types can be mixed · only spare pieces are used, never worn ones or locked types · fusion cannot be undone')}${r==='R'?T(' · ได้ Legend แบบสุ่มชนิด',' · the Legend type is random'):''}</p>
  </div><div class="main">${afGot?`<div class="px afgot nt ${afGot.ok?'':'bad'}"><h3>${afGot.ok?T('ฟิวชั่นสำเร็จ!','Fusion complete!'):T('ฟิวชั่นแตก…','The fusion broke…')}</h3>${R.p||afGot.bad?`<p class="sub" style="flex:1 0 100%;margin:0">${T(`สำเร็จ ${afGot.ok} ครั้ง · แตก ${afGot.bad} ครั้ง`,`${afGot.ok} succeeded · ${afGot.bad} broke`)}</p>`:''}${Object.keys(afGot.got).map(k=>`<span><i style="width:44px">${amu(k)}</i><b>${AM[k].n} ×${afGot.got[k]}</b></span>`).join('')}</div>`:''}
    ${r==='L'?`<p class="sub nt" style="margin-bottom:6px"><b>1</b> ${T('เลือกเครื่องราง SuperLegend ที่จะได้','Pick the SuperLegend amulet to make')}</p><div class="afto nt" style="margin-bottom:14px">${tos.map(k=>`<button class="${afTo===k?'on':''}" data-act="afto" data-k="${k}" aria-pressed="${afTo===k}">${amu(k)}<b>${AM[k].n}</b><span>${AM[k].t}</span></button>`).join('')}</div>`:''}
    <p class="sub nt" style="margin-bottom:6px">${r==='L'?'<b>2</b> ':''}${T(`ใส่เครื่องราง ${RAR[r].n} ที่จะใช้เป็นวัตถุดิบ`,`Add the ${RAR[r].n} amulets to use as materials`)}</p>
    <div class="row" style="margin-bottom:10px;gap:8px"><button class="btn sm" data-act="afall"><span class="nt">${T('ใส่ทั้งหมดที่ว่าง','Add all spare')}</span></button><button class="btn alt sm" data-act="afclr"><span class="nt">${T('ล้าง','Clear')}</span></button></div>
    <div class="aflist">${ks.map(k=>{const m=afMax(k),n=afN(k);return `<div class="afrow nt ${m?'':'no'}"><i style="width:44px">${amu(k)}</i><span><b>${isLock(k)?'🔒 ':''}${AM[k].n} ×${owned(k)}</b><small>${AM[k].t}</small><small>${isLock(k)?T('ล็อคอยู่ ไม่ถูกใช้','locked, not used'):T(`ว่าง ${spare(k)} · ใส่อยู่ ${worn(k)}`,`spare ${spare(k)} · worn ${worn(k)}`)}</small></span><span class="afst"><button class="btn alt sm" data-act="afadd" data-k="${k}" data-n="-10" ${n?'':'disabled'} aria-label="-10">−10</button><output>${n}</output><button class="btn sm" data-act="afadd" data-k="${k}" data-n="10" ${n<m?'':'disabled'} aria-label="+10">+10</button><button class="btn sm" data-act="afadd" data-k="${k}" data-n="9999" ${n<m?'':'disabled'}>${T('หมด','All')}</button></span></div>`}).join('')}</div>
  </div></div>`)}
""")
# step 2 (cards): the old screen, narrowed to the rank below the target
rep("function fuse(){if(fuTab==='a')return fuseAm();const L=fuList();","function fuse(){if(!fuTo||(fuTab==='a'?!AFU[afFrom(fuTo)]||AFU[afFrom(fuTo)].to!==fuTo:!fuFromR(fuTo))){fuTo=null;return fuHub()}if(fuTab==='a')return fuseAm();const fromR=fuFromR(fuTo),L=fuList().filter(id=>C[id].r===fromR);")
rep("""<div class="row"><button class="btn alt sm" data-act="${fuFrom}">กลับ</button><h2 class="nt">${T('ฟิวชั่นการ์ด','Card Fusion')}</h2></div>
    ${fuTabs()}
""","""<div class="row"><button class="btn alt sm" data-act="fuback">กลับ</button><h2 class="nt">${T('ฟิวชั่นการ์ด','Card Fusion')}</h2></div>
    <div class="px dissum nt"><span class="sub">${T('อยากได้','Making')} <b class="r-${fuTo}" style="font-size:inherit;color:var(--gl)">${RAR[fuTo].n}</b></span><span class="sub">${T('ต่อ 1 ครั้ง','Each fusion')}: <b>${RAR[fromR].n}</b> ${T('ตัวเดียวกัน','(same card)')} ${FUSE.n[fromR]} ${T('ใบซ้ำ','copies')} + ${FUSE.gold[fromR].toLocaleString('en')} Gold</span></div>
""")
rep("""<div class="px dissum">${id?`<b class="nt">${C[id].n}</b>""","""<div class="px dissum">${id?`<b class="nt">${C[id].n}</b>""")
rep(""":`<span class="sub">แตะการ์ดทางขวาเพื่อเลือก</span>`}</div>""",""":`<span class="sub nt">${T(`แตะการ์ด ${RAR[fromR].n} ทางขวาที่จะใช้เป็นวัตถุดิบ`,`Tap the ${RAR[fromR].n} card on the right to use as material`)}</span>`}</div>""")
rep("""ใช้ใบซ้ำของการ์ดตัวเดียวกัน + Gold ได้การ์ดระดับสูงขึ้น 1 ขั้น 1 ใบ (สุ่มตัว โดยออกใบที่ยังไม่มีก่อน) · ยิ่งระดับสูงยิ่งใช้มาก','Spare copies of the same card + Gold give 1 random card one rank higher (cards you do not own come first) · higher ranks cost more')}</span>${fuTxt(T)}</div>""","""ใช้ใบซ้ำของการ์ดตัวเดียวกัน + Gold ได้การ์ดระดับสูงขึ้น 1 ขั้น 1 ใบ (สุ่มตัว โดยออกใบที่ยังไม่มีก่อน)','Spare copies of the same card + Gold give 1 random card one rank higher (cards you do not own come first)')}</span></div>""")
rep("""`<span class="sub nt">${T(`ยังไม่มีใบซ้ำให้ฟิวชั่น · ได้การ์ดซ้ำจากแพ็คจะถูกเก็บไว้ที่นี่ ครบจำนวนก็ฟิวชั่นได้`,`No spare copies yet · duplicate pulls are kept here until there are enough to fuse`)}</span>`""","""`<span class="sub nt">${T(`ยังไม่มีใบซ้ำระดับ ${RAR[fromR].n} ให้ฟิวชั่น · ได้การ์ดซ้ำจากแพ็คจะถูกเก็บไว้ที่นี่ ครบจำนวนก็ฟิวชั่นได้`,`No spare ${RAR[fromR].n} copies yet · duplicate pulls are kept here until there are enough to fuse`)}</span>`""")
# handlers
cut("  else if(a==='fuse'||a==='fusehub'){","  else if(a==='fusel')","""  else if(a==='fuse'||a==='fusehub'){fuSel=null;fuGot=null;afGot=null;afArm=false;afPick={};fuTo=null;fuFrom=a==='fuse'?'coll':'home';if(a==='fuse')fuTab='c';fuse()}
  else if(a==='futab'){fuTab=t.dataset.t==='a'?'a':'c';fuTo=null;fuSel=null;fuGot=null;afGot=null;afArm=false;afPick={};fuse()}
  else if(a==='futo'){fuTo=t.dataset.r;fuSel=null;fuGot=null;afGot=null;afArm=false;afPick={};fuse()}
  else if(a==='fuback'){fuTo=null;fuSel=null;fuGot=null;afGot=null;afArm=false;afPick={};fuse()}
  else if(a==='afadd'||a==='afall'||a==='afclr'||a==='afto'||a==='afgo'){const m=document.querySelector('.main'),y=m?m.scrollTop:0;let top=0;const r=afRk();
    if(a==='afadd'){const k=t.dataset.k;if(AM[k]&&AM[k].r===r){afPick[k]=Math.max(0,Math.min(afMax(k),afN(k)+(+t.dataset.n||0)));afArm=false;afGot=null}}
    else if(a==='afall'){afKeys(r).forEach(k=>afPick[k]=afMax(k));afArm=false;afGot=null}
    else if(a==='afclr'){afPick={};afArm=false}
    else if(a==='afto'){afTo=t.dataset.k;afArm=false}
    else if(!afArm){afArm=true}
    else{afArm=false;const g=afDo();if(g){afGot=g;save();cloudFlush();sfx(g.ok?'win':'lose');fx.push(['view','-'+g.cost.toLocaleString('en')+' Gold','g']);top=1}}
    fuseAm();const m2=document.querySelector('.main');if(m2)m2.scrollTop=top?0:y}
""")
# css
rep(".aflist{display:grid;gap:10px;margin-bottom:14px}",""".futiles{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:12px}.futiles.two{grid-template-columns:repeat(2,minmax(0,1fr))}
.futile{display:grid;justify-items:center;align-content:start;gap:4px;padding:12px 8px 10px;border:3px solid #10142c;border-radius:12px;background:#243074;color:var(--ink);box-shadow:inset 0 2px 0 rgba(255,255,255,.12),0 4px 0 #10142c;font-size:12px;line-height:1.3;text-align:center}
.futile:active{transform:translateY(2px)}.futile>small{color:var(--dim);font-size:11px}.futile>b{font-family:var(--display);font-size:20px;line-height:1.1}.futile>b.glc{color:var(--gl)}.futile span b{color:#fff}
.futile em{font-style:normal;margin-top:4px;padding:2px 8px;border-radius:8px;background:#161c44;color:var(--dim);font-size:11px}.futile em.ok{background:#1f6a34;color:#d8ffd8}.futile.no{filter:saturate(.6) brightness(.9)}
.risk,.risk b{color:#ff8492 !important}.afgot.bad{filter:saturate(.5)}
.aflist{display:grid;gap:10px;margin-bottom:14px}""")
# guide + news
rep("Legend ${AFU.L.n} ชิ้น + ${N(AFU.L.g)} Gold ได้ SuperLegend 1 ชิ้น (เลือกชนิดได้)","Legend ${AFU.L.n} ชิ้น + ${N(AFU.L.g)} Gold ได้ SuperLegend 1 ชิ้น (เลือกชนิดได้) โอกาสสำเร็จ ${P(AFU.L.p)} ถ้าแตกเครื่องรางและ Gold ของครั้งนั้นหาย และครั้งถัดไปโอกาส +${P(AFU.L.pity)} ทุกครั้งที่แตกจนกว่าจะสำเร็จ")
rep("${AFU.L.n} Legend + ${N(AFU.L.g)} Gold make 1 SuperLegend (your pick)","${AFU.L.n} Legend + ${N(AFU.L.g)} Gold make 1 SuperLegend (your pick) with a ${P(AFU.L.p)} chance; a break loses that fusion's amulets and Gold and adds +${P(AFU.L.pity)} to the next try until one succeeds")
rep('(ปุ่ม "ฟิวชั่น" ที่ล็อบบี้ แท็บเครื่องราง)','(ปุ่ม "ฟิวชั่น" ที่ล็อบบี้ แท็บเครื่องราง เลือกระดับที่อยากได้ก่อน แล้วใส่วัตถุดิบ)')
rep("รวมเครื่องรางที่ไม่ใช้เป็นระดับสูงขึ้น พร้อมเครื่องราง SuperLegend 4 ชนิดที่ได้จากฟิวชั่นเท่านั้น","เลือกระดับที่อยากได้แล้วใส่วัตถุดิบ รวมเครื่องรางที่ไม่ใช้เป็นระดับสูงขึ้น พร้อมเครื่องราง SuperLegend 4 ชนิดที่ได้จากฟิวชั่นเท่านั้น (มีโอกาสแตก)")
open(F,'w',encoding='utf8').write(s);print('ok')
