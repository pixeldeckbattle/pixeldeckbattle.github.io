const {chromium}=require('playwright');const fs=require('fs');(async()=>{const b=await chromium.launch({executablePath:'/opt/pw-browsers/chromium'});const p=await b.newPage({viewport:{width:900,height:420},deviceScaleFactor:2});const e=[];p.on('pageerror',x=>e.push(x.message));const w=n=>new Promise(r=>setTimeout(r,n));
const mock=fs.readFileSync('fbmock.js','utf8');let n=0;await p.route('https://www.gstatic.com/**',r=>r.fulfill({status:200,contentType:'text/javascript',body:n++?'':mock}));
await p.addInitScript(()=>{window.__USER={uid:'me',email:'me@example.com'};const t=Date.now();window.__DB={saves:{},slips:{},grants:{},online:{},config:{main:{}},adminlog:{},arena:{},market:{},payouts:{},refs:{}}});
await p.goto('file:///home/claude/pixeldeck/_t.html');await w(1500);
await p.evaluate(async()=>{USER={sub:'me',name:'T'};S=unlock(fresh());S.me={name:'Toey'};S.gift=true;S.tut=null;S.n160=S.n165=S.n167=1;['h15','h13','h26'].forEach(id=>S.cards[id]={lv:90,exp:0});S.team=['h15','h13','h26'];S.cleared=200;S.auto=false;S.spd=1;S.sh=['T1.1','T2.1','T3.1','P5.1'];S.shp='T1.1';
 const W=twWeek(),t=Date.now(),c=window.__DB['tower/'+W+'/s']={};[['a','Narathip',141,3],['b','Kanit',141,5],['c','Getter',112,1],['e','Zed',70,9]].forEach(([u,nm,f,h],i)=>c[u]={name:nm,look:'h06',f,at:new Date(t-h*36e5),fd:i<2?1:0,sh:i===0?'T1.1':'',st:i*9});save();await fbLoad();await fbUser();home()});
await w(1800);await p.screenshot({path:'c_lobby.png'});
await p.evaluate(()=>tower());await w(1200);await p.screenshot({path:'c_hub.png'});
let k=0;for(const f of [10,30,50,70,90,5,25,45,65,85]){await p.evaluate(f=>{bt=null;busy=false;S.tw.f=f-1;twTok++;startTower(f)},f);await w(f%10?2600:3600);await p.screenshot({path:'c_f'+f+'.png'})}
await p.evaluate(()=>{bt=null;busy=false;charMake();document.querySelector('.main').scrollTop=235});await w(700);await p.screenshot({path:'c_cab.png'});
console.log('errs',e);await b.close()})()
