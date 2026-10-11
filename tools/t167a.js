const {chromium}=require('playwright');const fs=require('fs');(async()=>{const b=await chromium.launch({executablePath:'/opt/pw-browsers/chromium'});const p=await b.newPage({viewport:{width:900,height:420},deviceScaleFactor:2});const e=[];p.on('pageerror',x=>e.push(x.message));p.on('console',m=>{if(m.type()==='error')e.push('C:'+m.text().slice(0,160))});const w=n=>new Promise(r=>setTimeout(r,n));
const mock=fs.readFileSync('fbmock.js','utf8');let n=0;await p.route('https://www.gstatic.com/**',r=>r.fulfill({status:200,contentType:'text/javascript',body:n++?'':mock}));
await p.addInitScript(()=>{window.__USER={uid:'me',email:'me@example.com'};const t=Date.now();
 window.__DB={saves:{},slips:{},grants:{},online:{},config:{main:{}},adminlog:{},arena:{},market:{},payouts:{},refs:{}}});
await p.goto('file:///home/claude/pixeldeck/_t.html');await w(1500);
await p.evaluate(async()=>{USER={sub:'me',name:'T'};S=unlock(fresh());S.me={name:'Toey'};S.gift=true;S.tut=null;S.n160=1;S.n165=1;const L=Object.keys(C).filter(id=>C[id].r==='L').slice(0,3);L.forEach(id=>S.cards[id]={lv:60,exp:0});S.cards.h06={lv:3,exp:0};S.team=L;S.cleared=120;S.bc=[10,20];S.afk=Date.now();S.auto=true;S.spd=2;S.gold=1000;
 const W=twWeek(),t=Date.now(),c=window.__DB['tower/'+W+'/s']={};[['a','Narathip',41,3],['b','Kanit',41,5],['c','Getter',12,1],['d','Ban',99,1],['e','Zed',7,9]].forEach(([u,nm,f,h],i)=>c[u]={name:nm,look:'h06',f,at:new Date(t-h*36e5),fd:i<2?1:0,sh:i===0?'T1.1':'',st:i*9});
 save();await fbLoad();await fbUser();CFG.bans={d:1};home()});
await w(2300);await p.screenshot({path:'b167_news.png'});
await p.evaluate(()=>{document.querySelector('[data-lp=no]').click()});await w(300);await p.screenshot({path:'b167_lobby.png'});
await p.evaluate(()=>{document.querySelector('[data-act=tower]').click()});await w(900);await p.screenshot({path:'b167_hub.png'});
for(const t of ['prize','team','last','board']){await p.evaluate(t=>{document.querySelector(`[data-act=twtab][data-t=${t}]`).click()},t);await w(500);await p.screenshot({path:'b167_tab_'+t+'.png'})}
await p.evaluate(()=>{document.querySelector('[data-act=twgo]').click()});await w(1700);await p.screenshot({path:'b167_fight1.png'});
let shot=0;for(let i=0;i<60;i++){await w(500);const st=await p.evaluate(()=>[!!document.querySelector('.twrun'),S.tw.f,bt&&bt.tw]);if(st[0]&&!shot){shot=1;await w(350);await p.screenshot({path:'b167_run.png'})}if(st[1]>=3)break}
console.log('after run',await p.evaluate(()=>JSON.stringify({tw:S.tw,gold:S.gold,run:twRun,lg:S.lg&&S.lg.i})));
// boss floor 10 with the gate
await p.evaluate(()=>{twLeave();S.tw.f=9;save();twEnter()});await w(2600);await p.screenshot({path:'b167_boss.png'});
for(let i=0;i<80;i++){await w(500);if(await p.evaluate(()=>S.tw.f>=10))break}
await w(1200);await p.screenshot({path:'b167_run10.png'});
console.log('boss',await p.evaluate(()=>JSON.stringify({tw:S.tw,db:window.__DB['tower/'+twWeek()+'/s'].me})));
// zone change 20 -> 21
await p.evaluate(()=>{twLeave();S.tw.f=19;save();twEnter()});for(let i=0;i<90;i++){await w(400);if(await p.evaluate(()=>S.tw.f>=20))break}
await w(1700/2+300);await p.screenshot({path:'b167_zone.png'});await w(1500);await p.screenshot({path:'b167_zone2.png'});
// defeat
await p.evaluate(()=>{twLeave();S.team=['h06'];S.tw.f=60;save();twEnter()});for(let i=0;i<60;i++){await w(500);if(await p.evaluate(()=>!bt&&!document.querySelector('.twrun')))break}
await w(600);await p.screenshot({path:'b167_lose.png'});
await p.evaluate(()=>{S.team=Object.keys(C).filter(id=>C[id].r==='L').slice(0,3);tower()});await w(900);await p.evaluate(()=>{twFetch(twWeek());});await w(700);await p.screenshot({path:'b167_board.png'});
console.log('rank',await p.evaluate(()=>[twRank(),twB[twWeek()].list.map(o=>o.name+':'+o.f).join(',')]));
console.log('errs',e);await b.close()})()
