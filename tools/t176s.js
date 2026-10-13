const {chromium}=require('playwright');const fs=require('fs');(async()=>{const b=await chromium.launch({executablePath:'/opt/pw-browsers/chromium'});const e=[];const w=n=>new Promise(r=>setTimeout(r,n));
const SH='/tmp/claude-0/-home-claude/aa9c0295-536e-5154-97c3-794b140463f1/scratchpad/';const mock=fs.readFileSync('fbmock.js','utf8');
const p=await b.newPage({viewport:{width:1000,height:466},deviceScaleFactor:2});p.on('pageerror',x=>e.push(x.message));
let n=0;await p.route('https://www.gstatic.com/**',r=>r.fulfill({status:200,contentType:'text/javascript',body:n++?'':mock}));
await p.addInitScript(()=>{window.__USER={uid:'me',email:'me@example.com'};const t=Date.now(),D=864e5,DB=window.__DB={saves:{},config:{main:{}},arena:{},payouts:{},refs:{},online:{},grants:{},market:{},trades:{},dmo:{},dmpay:{},dmt:{},dmc:{}};
 const k=ms=>new Date(ms+252e5).toISOString().slice(0,10).replace(/-/g,''),sl=ms=>Math.floor(((ms+252e5)%D)/9e5);let p=1980,seed=11;const rnd=()=>(seed=(seed*16807)%2147483647)/2147483647;
 for(let ms=t-3*D;ms<t;ms+=9e5){if(rnd()<.3)continue;const o=p,c=Math.max(1500,Math.min(2000,Math.round(p+(rnd()-.53)*22))),h=Math.min(2000,Math.max(o,c)+Math.round(rnd()*9)),l=Math.max(1450,Math.min(o,c)-Math.round(rnd()*9));p=c;const d=k(ms);DB.dmc[d]=DB.dmc[d]||{d,c:{}};DB.dmc[d].c[sl(ms)]=[o,h,l,c,1+Math.round(rnd()*25)]}
 const nm=['Tanam','Attackel2','onlyone','RoTwTeN','Natcha','King_Shower','Narathip','GrienZa'];let i=0;
 [[p+6,12],[p+14,25],[p+20,8],[p+35,40],[p+50,15]].forEach(([pp,q])=>DB.dmo['a'+i]={u:'u'+i,nm:nm[i++%8],s:'a',p:Math.min(2000,pp),q,t:5,at:new Date(t-6e5)});
 [[p-4,18],[p-10,40],[p-22,10],[p-30,26],[p-45,9]].forEach(([pp,q])=>DB.dmo['b'+i]={u:'u'+i,nm:nm[i++%8],s:'b',p:pp,q,t:5,at:new Date(t-6e5)});
 DB.dmo.mine={u:'me',nm:'Toey',s:'b',p:p-60,q:10,t:3,at:new Date(t-3e5)};
 for(let j=0;j<8;j++)DB.dmt['t'+j]={p:p-j*3+(j%2?4:0),q:5+j*3%17,s:j%3?'b':'a',sn:nm[j%8],bn:nm[(j+3)%8],b:'u',at:new Date(t-j*7e5)}});
await p.goto('file:///home/claude/pixeldeck/_t.html');await w(1200);
await p.evaluate(async()=>{USER={sub:'me',name:'T'};S=unlock(fresh());Object.assign(S,{me:{name:'Toey'},gift:true,tut:null,cleared:420,gold:184500,dia:260,n176:1,n174:1,n167:1,n165:1,n160:1,bc:[10,20],vip:Date.now()+864e5*20,vt:2});save();await fbLoad();mkTab='dm';market()});await w(800);
await p.mouse.move(700,330);await w(150);await p.screenshot({path:SH+'dm1.png'});
await p.evaluate(()=>{dm.tf='15m';dmView();dmFetch(1)});await w(500);await p.mouse.move(640,320);await w(100);await p.screenshot({path:SH+'dm2.png'});
await p.evaluate(()=>{dm.tf='1D';dmView();dmFetch(1)});await w(500);await p.screenshot({path:SH+'dm3.png'});
await p.evaluate(()=>{dm.tf='1h';dm.side='s';dm.q=20;dmView();dmFetch(1)});await w(500);await p.screenshot({path:SH+'dm_sell.png'});
await p.evaluate(()=>{S.n176=0;home();news176()});await w(1900);await p.screenshot({path:SH+'dm_pop.png'});
await p.evaluate(()=>{$('ov').innerHTML='';vip()});await w(300);await p.screenshot({path:SH+'dm_vip.png'});
await p.evaluate(()=>{S.lang='en';mkTab='dm';dm.side='b';market()});await w(500);await p.screenshot({path:SH+'dm_en.png'});
await p.setViewportSize({width:400,height:860});await w(500);await p.screenshot({path:SH+'dm_phone.png'});
console.log('errors',e.length,e.slice(0,4).join(' | '));await b.close()})()
