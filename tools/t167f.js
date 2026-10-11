const {chromium}=require('playwright');const fs=require('fs');(async()=>{const b=await chromium.launch({executablePath:'/opt/pw-browsers/chromium'});const p=await b.newPage({viewport:{width:900,height:420}});const e=[];p.on('pageerror',x=>e.push(x.message));const w=n=>new Promise(r=>setTimeout(r,n));
const mock=fs.readFileSync('fbmock.js','utf8');let n=0;await p.route('https://www.gstatic.com/**',r=>r.fulfill({status:200,contentType:'text/javascript',body:n++?'':mock}));
await p.addInitScript(()=>{window.__USER={uid:'me',email:'me@example.com'};window.__DB={saves:{},slips:{},grants:{},online:{},config:{main:{}},adminlog:{},arena:{},market:{},payouts:{},refs:{}};
 const real=Date.now.bind(Date);window.__skew=8*864e5;Date.now=()=>real()+window.__skew});   // the device clock runs 8 days ahead; the mock's server stamp (new Date()) stays honest
await p.goto('file:///home/claude/pixeldeck/_t.html');await w(1200);
console.log(await p.evaluate(async()=>{USER={sub:'me',name:'T'};S=unlock(fresh());S.me={name:'Toey'};S.gift=true;S.tut=null;S.n160=S.n165=S.n167=1;S.cards={h15:{lv:60,exp:0}};S.team=['h15'];S.cleared=120;await fbLoad();await fbUser();
 const W=Math.max(2962,Math.floor(((Date.now()-window.__skew+7*36e5)/864e5-4)/7));S.tw={w:W,f:55,pf:55};S.pv={st:10,hi:10,w:2,l:1,d:today(),n:0,sw:W};save();
 const before=[twWeek(),W];home();return JSON.stringify({before,tw:S.tw,mail:(S.mail||[]).length,tSync})}));
await w(1500);console.log(await p.evaluate(()=>JSON.stringify({TOFFdays:Math.round(TOFF/864e5*10)/10,tSync,week:twWeek(),tw:S.tw,mail:(S.mail||[]).length,pvsw:S.pv.sw,lobby:document.querySelector('.twb small').innerText})),e);await b.close()})()
