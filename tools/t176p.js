const {chromium}=require('playwright');const fs=require('fs');(async()=>{const b=await chromium.launch({executablePath:'/opt/pw-browsers/chromium'});const e=[];const w=n=>new Promise(r=>setTimeout(r,n));
const SH='/tmp/claude-0/-home-claude/aa9c0295-536e-5154-97c3-794b140463f1/scratchpad/';const mock=fs.readFileSync('fbmock.js','utf8');
const p=await b.newPage({viewport:{width:1000,height:466},deviceScaleFactor:2});p.on('pageerror',x=>e.push(x.message));
let n=0;await p.route('https://www.gstatic.com/**',r=>r.fulfill({status:200,contentType:'text/javascript',body:n++?'':mock}));
await p.addInitScript(()=>{window.__USER={uid:'me',email:'me@example.com'};window.__DB={saves:{},config:{main:{}},arena:{},payouts:{},refs:{},online:{},grants:{},market:{},trades:{},dmo:{},dmpay:{},dmt:{},dmc:{}}});
await p.goto('file:///home/claude/pixeldeck/_t.html');await w(1200);
await p.evaluate(async()=>{USER={sub:'me',name:'T'};S=unlock(fresh());Object.assign(S,{me:{name:'Toey'},gift:true,tut:null,cleared:150,n174:1,n167:1,n165:1,n160:1,bc:[10,20]});save();await fbLoad();home();news176()});await w(1900);
await p.screenshot({path:SH+'dm_pop.png'});
console.log(await p.evaluate(()=>{const b=document.querySelector('[data-dmgo]');if(!b)return 'no popup: '+document.getElementById('ov').innerText.slice(0,80);b.click();return 'clicked'}));await w(600);
console.log('market open',await p.evaluate(()=>!!document.querySelector('[data-dm]')),'ov empty',await p.evaluate(()=>!document.getElementById('ov').innerHTML.trim()));
await p.evaluate(()=>{S.n176=1;S.vip=Date.now()+864e5;S.vt=2;shopSel=0;vip()});await w(300);await p.screenshot({path:SH+'dm_vip.png'});
console.log('errors',e.length,e.slice(0,4).join(' | '));await b.close()})()
