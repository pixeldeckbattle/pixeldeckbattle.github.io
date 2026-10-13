// b176 diamond market: two players on one mock database (switching USER/S), sell order, partial + full fills, posted bid, cancel, payouts, limits, chart
const {chromium}=require('playwright');const fs=require('fs');(async()=>{const b=await chromium.launch({executablePath:'/opt/pw-browsers/chromium'});const e=[];const w=n=>new Promise(r=>setTimeout(r,n));
const SH='/tmp/claude-0/-home-claude/aa9c0295-536e-5154-97c3-794b140463f1/scratchpad/';
const mock=fs.readFileSync('fbmock.js','utf8');
const p=await b.newPage({viewport:{width:1000,height:466},deviceScaleFactor:2});p.on('pageerror',x=>e.push(x.message));
let n=0;await p.route('https://www.gstatic.com/**',r=>r.fulfill({status:200,contentType:'text/javascript',body:n++?'':mock}));
await p.addInitScript(()=>{window.__USER={uid:'me',email:'me@example.com'};const t=Date.now(),D=864e5;
 window.__DB={saves:{},config:{main:{}},arena:{},payouts:{},refs:{},online:{},grants:{},market:{},trades:{},dmo:{},dmpay:{},dmt:{},dmc:{}};
 // history: yesterday closed at 1,950 (sets today's band), plus a day before
 const k=ms=>new Date(ms+252e5).toISOString().slice(0,10).replace(/-/g,'');window.__DB.dmc[k(t-D)]={d:k(t-D),c:{40:[2000,2000,1900,1920,30],60:[1920,1980,1910,1950,22]}};window.__DB.dmc[k(t-2*D)]={d:k(t-2*D),c:{50:[2000,2000,1980,2000,10]}}});
await p.goto('file:///home/claude/pixeldeck/_t.html');await w(1200);
const out=await p.evaluate(async()=>{const W=ms=>new Promise(r=>setTimeout(r,ms)),R={};
  const mk=(uid,name,o)=>{USER={sub:uid,name};S=unlock(fresh());Object.assign(S,{lang:'th',me:{name},gift:true,tut:null,n176:1,n174:1,n167:1,n165:1,n160:1},o);dm.days={};dm.st='idle';dm.msg='';dm.p=0};
  await fbLoad();
  // A: seller with 100 topped-up diamonds and 20 free
  mk('a','Seller',{cleared:200,dia:120,dt:100,gold:0});save();mkTab='dm';market();await W(300);
  R.band=dmBand();R.ref=dm.ref;dm.side='s';dm.q=150;R.limErr=dmCheck();dm.q=20;dm.p=1900;await dmGo();await W(200);
  R.A1={dia:S.dia,dt:S.dt,orders:Object.keys(window.__DB.dmo).length,msg:dm.msg};
  dm.q=101;R.dtErr=dmCheck();
  // B: buyer, 100k Gold, no VIP
  mk('me','Buyer',{cleared:150,dia:0,gold:100000});mkTab='dm';market();await W(300);
  dm.side='b';dm.p=2000;dm.q=15;await dmGo();await W(200);
  R.B1={gold:S.gold,dia:S.dia,dt:S.dt,left:dmLeft('b'),msg:dm.msg,q:Object.values(window.__DB.dmo).map(o=>o.q)};
  dm.p=1950;dm.q=10;await dmGo();await W(200);
  R.B2={gold:S.gold,dia:S.dia,orders:Object.values(window.__DB.dmo).map(o=>o.s+o.q+'@'+o.p),pays:Object.keys(window.__DB.dmpay),msg:dm.msg};
  await W(100);market();await W(300);R.view=document.querySelector('.dmmain').innerText.slice(0,400);
  const my=dm.mine[0];await dmCancel(my.id);await W(200);R.B3={gold:S.gold,left:dmLeft('b'),orders:Object.keys(window.__DB.dmo).length,msg:dm.msg};
  // free diamonds cannot be sold, and they are spent first
  S.dia+=50;save();R.freeT=dmT();S.dia-=30;save();R.afterSpend={dia:S.dia,dt:S.dt};
  // low stage
  S.cleared=50;R.stageErr=dmCheck();S.cleared=150;
  // VIP doubles the limit and lowers tax
  S.vip=Date.now()+864e5;S.vt=1;R.vip={lim:dmLim(),tax:dmTax()};S.vip=0;
  // A collects
  const gB=S.gold;mk('a','Seller',{cleared:200,dia:100,dt:80,gold:0});dmPayAt=0;dmPayCheck();await W(400);R.A2={gold:S.gold,pays:Object.keys(window.__DB.dmpay).length};
  R.candles=Object.values(window.__DB.dmc).map(d=>Object.keys(d.c).length);R.trades=Object.values(window.__DB.dmt).map(t=>t.sn+'>'+t.bn+':'+t.q+'@'+t.p);
  mk('me','Buyer',{cleared:150,dia:25,dt:25,gold:gB});mkTab='dm';market();await W(400);return R});
console.log(JSON.stringify(out,null,1));
await p.mouse.move(560,330);await w(100);await p.screenshot({path:SH+'dm1.png'});
await p.evaluate(()=>{dm.tf='15m';dmView();dmFetch(1)});await w(400);await p.mouse.move(520,300);await w(100);await p.screenshot({path:SH+'dm2.png'});
await p.evaluate(()=>{S.lang='en';dm.side='s';dmView()});await w(200);await p.screenshot({path:SH+'dm_en.png'});
// popup
await p.evaluate(()=>{S.lang='th';S.n176=0;S.cleared=150;home();news176()});await w(1900);await p.screenshot({path:SH+'dm_pop.png'});
const pop=await p.evaluate(()=>{const b=document.querySelector('[data-dmgo]');if(!b)return 'no popup';b.click();return 'clicked'});await w(500);
console.log(pop,await p.evaluate(()=>!!document.querySelector('[data-dm]')&&!document.getElementById('ov').innerHTML.trim()));
// phone portrait
await p.setViewportSize({width:400,height:860});await w(400);await p.screenshot({path:SH+'dm_phone.png'});
console.log('errors',e.length,e.slice(0,5).join(' | '));await b.close()})()
