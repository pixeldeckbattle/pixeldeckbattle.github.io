// b175: market history tab - a purchase writes trades/, the History mode lists it; a denied trades/ never blocks a purchase
const {chromium}=require('playwright');const fs=require('fs');(async()=>{const b=await chromium.launch({executablePath:'/opt/pw-browsers/chromium'});const e=[];const w=n=>new Promise(r=>setTimeout(r,n));
const mock=fs.readFileSync('fbmock.js','utf8');
async function run(deny,lang,shot){const p=await b.newPage({viewport:{width:900,height:420},deviceScaleFactor:2});p.on('pageerror',x=>e.push(x.message));p.on('console',m=>{if(m.type()==='error')e.push('C:'+m.text().slice(0,160))});
 let n=0;await p.route('https://www.gstatic.com/**',r=>r.fulfill({status:200,contentType:'text/javascript',body:n++?'':mock}));
 await p.addInitScript(d=>{window.__USER={uid:'me',email:'me@example.com'};if(d)window.__DENY=['trades'];const t=Date.now();
  window.__DB={saves:{},config:{main:{}},arena:{},payouts:{},refs:{},online:{},grants:{},
   market:{m1:{seller:'u2',name:'Narathip',k:Object.keys(window.AM||{})[0]||'x',p:1500,at:new Date(t-6e4)}},
   trades:{o1:{k:'?',p:999,sn:'Old',bn:'Era',b:'u9',at:new Date(t-3e6)}}}},deny);
 await p.goto('file:///home/claude/pixeldeck/_t.html');await w(1200);
 const r=await p.evaluate(async lang=>{USER={sub:'me',name:'T'};S=unlock(fresh());S.lang=lang;S.me={name:'Toey'};S.gift=true;S.tut=null;S.gold=50000;save();await fbLoad();
  const ak=Object.keys(AM)[0],cd=Object.keys(C).find(id=>C[id].r==='L');const D=window.__DB;D.market.m1.k=ak;D.market.m2={seller:'u3',name:'Kanit',k:cd,p:20000,at:new Date()};D.trades.o1.k=ak;
  mkMode='buy';mkTab='am';market();mkFetch();await new Promise(r=>setTimeout(r,400));
  const g0=S.gold;mkBuy('m1');await new Promise(r=>setTimeout(r,400));const bought=g0-S.gold;
  document.querySelector('[data-act=mkmode][data-m=hist]').click();await new Promise(r=>setTimeout(r,400));
  const txt=document.getElementById('mkres').innerText,btns=[...document.querySelectorAll('.mkmode .btn')].map(x=>x.innerText);
  const sortHidden=!document.getElementById('mkfs'),rank=!!document.getElementById('mkfr');
  return {bought,trades:Object.values(D.trades).length,txt:txt.slice(0,300),btns,sortHidden,rank,sell:!!document.querySelector('[data-act=mklist]')}},lang);
 if(shot)await p.screenshot({path:shot});await p.close();return r}
console.log(JSON.stringify(await run(false,'th','/tmp/claude-0/-home-claude/aa9c0295-536e-5154-97c3-794b140463f1/scratchpad/h_th.png')));
console.log(JSON.stringify(await run(false,'en')));
console.log(JSON.stringify(await run(true,'th','/tmp/claude-0/-home-claude/aa9c0295-536e-5154-97c3-794b140463f1/scratchpad/h_deny.png')));
console.log('errors',e.length,e.slice(0,5).join(' | '));await b.close()})()
