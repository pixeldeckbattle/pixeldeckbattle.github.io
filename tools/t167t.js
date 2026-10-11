const {chromium}=require('playwright');const fs=require('fs');(async()=>{const b=await chromium.launch({executablePath:'/opt/pw-browsers/chromium'});const p=await b.newPage({viewport:{width:900,height:420},deviceScaleFactor:2});const e=[];p.on('pageerror',x=>e.push(x.message));const w=n=>new Promise(r=>setTimeout(r,n));
const mock=fs.readFileSync('fbmock.js','utf8');let n=0;await p.route('https://www.gstatic.com/**',r=>r.fulfill({status:200,contentType:'text/javascript',body:n++?'':mock}));
await p.addInitScript(()=>{window.__USER={uid:'me',email:'me@example.com'};window.__DB={saves:{},slips:{},grants:{},online:{},config:{main:{}},adminlog:{},arena:{},market:{},payouts:{},refs:{}}});
await p.goto('file:///home/claude/pixeldeck/_t.html');await w(1500);
await p.evaluate(async()=>{USER={sub:'me',name:'T'};S=unlock(fresh());S.me={name:'G'};S.gift=true;S.n160=S.n165=S.n167=1;S.cards={h06:{lv:1,exp:0}};S.team=['h06'];S.cleared=30;S.bc=[10,20];S.gold=60000;S.dia=900;await fbLoad();await fbUser();home();topup()});await w(1200);await p.screenshot({path:'u_top.png'});
console.log(await p.evaluate(()=>[typeof PAYINFO,JSON.stringify(PAYINFO).slice(0,120),[...document.querySelectorAll('.tg')].map(x=>x.parentNode.dataset.i+':'+x.innerText).join(',')]));
await p.evaluate(()=>document.querySelectorAll('[data-act=tpick]')[3].click());await w(400);await p.screenshot({path:'u_top2.png'});
console.log(await p.evaluate(()=>[dSel,document.querySelector('.tustep').innerText.slice(0,160).replace(/\n/g,' | ')]));
await p.evaluate(()=>document.querySelector('[data-act=exch]').click());await w(300);console.log('exch',await p.evaluate(()=>[S.gold,S.dia,!!document.querySelector('[data-tu]')]));
await p.evaluate(()=>document.querySelector('[data-act=vip]').click());await w(700);await p.screenshot({path:'u_vip.png'});
await p.evaluate(()=>document.querySelector('[data-act=vipbuy]').click());await w(400);await p.screenshot({path:'u_vip2.png'});console.log('vip',await p.evaluate(()=>[S.dia,vipOwn()]));
await p.setViewportSize({width:740,height:340});await p.evaluate(()=>{fit();topup()});await w(600);await p.screenshot({path:'u_small.png'});
console.log(e);await b.close()})()
