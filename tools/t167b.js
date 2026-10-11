const {chromium}=require('playwright');const fs=require('fs');(async()=>{const b=await chromium.launch({executablePath:'/opt/pw-browsers/chromium'});const p=await b.newPage({viewport:{width:900,height:420},deviceScaleFactor:2});const e=[];p.on('pageerror',x=>e.push(x.message));const w=n=>new Promise(r=>setTimeout(r,n));
const mock=fs.readFileSync('fbmock.js','utf8');let n=0;await p.route('https://www.gstatic.com/**',r=>r.fulfill({status:200,contentType:'text/javascript',body:n++?'':mock}));
await p.addInitScript(()=>{window.__USER={uid:'me',email:'me@example.com'};window.__DB={saves:{},slips:{},grants:{},online:{},config:{main:{}},adminlog:{},arena:{},market:{},payouts:{},refs:{}}});
await p.goto('file:///home/claude/pixeldeck/_t.html');await w(1500);
await p.evaluate(async()=>{USER={sub:'me',name:'T'};S=unlock(fresh());S.me={name:'Toey'};S.gift=true;S.tut=null;S.n160=1;S.n165=1;S.n167=1;const L=Object.keys(C).filter(id=>C[id].r==='SL').slice(0,3);L.forEach(id=>S.cards[id]={lv:100,exp:0});S.team=L;S.cleared=120;S.bc=[10,20];S.afk=Date.now();S.auto=true;S.spd=1;S.gold=1000;S.tw={w:twWeek(),f:18};save();await fbLoad();await fbUser();home()});
await w(1200);
// warm the image cache
await p.evaluate(()=>{twEnter()});await w(2500);await p.screenshot({path:'b167_f19.png'});
let k=0;for(let i=0;i<400;i++){await w(100);const r=await p.evaluate(()=>[!!document.querySelector('.twrun'),!!document.querySelector('.twflash'),S.tw.f]);
 if(r[0]&&k===0){k=1;await w(600);await p.screenshot({path:'b167_runA.png'})}
 if(r[1]&&k<3){k=3;await w(450);await p.screenshot({path:'b167_flash.png'})}
 if(r[2]>=20&&r[0]&&k===1){k=2;await w(500);await p.screenshot({path:'b167_runB.png'})}
 if(r[2]>=20&&!r[0]&&!r[1]&&k===3){await w(1500);await p.screenshot({path:'b167_f21.png'});break}}
console.log(k,await p.evaluate(()=>JSON.stringify(S.tw)),'errs',e);await b.close()})()
