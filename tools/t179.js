const {chromium}=require('playwright');const fs=require('fs');(async()=>{const b=await chromium.launch({executablePath:'/opt/pw-browsers/chromium'});const e=[];const w=n=>new Promise(r=>setTimeout(r,n));const SH=process.argv[2];
const mock=fs.readFileSync('fbmock.js','utf8');const p=await b.newPage({viewport:{width:1000,height:466},deviceScaleFactor:2});p.on('pageerror',x=>e.push(x.message));
let n=0;await p.route('https://www.gstatic.com/**',r=>r.fulfill({status:200,contentType:'text/javascript',body:n++?'':mock}));
await p.addInitScript(()=>{window.__USER={uid:'me',email:'me@example.com'};window.__DB={saves:{},config:{main:{}},arena:{},payouts:{},refs:{},online:{},market:{},trades:{},grants:{},dmo:{},dmpay:{}}});
await p.goto('file:///home/claude/pixeldeck/_t.html');await w(1200);
const k=async(c,keys)=>{for(const x of keys){await p.click(`[data-act=kp][data-c=${c}][data-k="${x}"]`);await w(40)}};
await p.evaluate(async()=>{USER={sub:'me',name:'T'};S=unlock(fresh());Object.assign(S,{me:{name:'T'},gift:true,tut:null,cleared:200,gold:2500000,dia:5,am:{tiger:2},n177:1,n176:1,n174:1,n167:1,n165:1,n160:1,bc:[10,20]});save();await fbLoad();exN=10;exRaw='10';exDone=0;exchange()});await w(300);
await k('ex',['cl','2','5','5']);const a=await p.evaluate(()=>({raw:exRaw,n:exN,txt:document.querySelector('.exbox').innerText.slice(0,200)}));await p.screenshot({path:SH+'/kp_ex.png'});
await p.click('[data-act=exgo]');await w(200);const a2=await p.evaluate(()=>({dia:S.dia,gold:S.gold}));
await k('ex',['cl','9','9','9','9','9','9']);const a3=await p.evaluate(()=>({raw:exRaw,n:exN,ok:!document.querySelector('[data-act=exgo]').disabled}));
await p.evaluate(()=>{mkMode='sell';mkTab='am';mkRaw='';market()});await w(200);await p.click('[data-act=mksel][data-k=tiger]');await w(200);
await k('mk',['cl','5','0']);const b1=await p.evaluate(()=>({p:mkPrice,dis:document.querySelector('[data-act=mklist]').disabled}));await p.screenshot({path:SH+'/kp_mk_low.png'});
await k('mk',['0','0','bs','0']);const b2=await p.evaluate(()=>({p:mkPrice,dis:document.querySelector('[data-act=mklist]').disabled}));await p.screenshot({path:SH+'/kp_mk.png'});
console.log(JSON.stringify({a,a2,a3,b1,b2}),'errors',e.length,e.slice(0,3).join('|'));await b.close()})()
