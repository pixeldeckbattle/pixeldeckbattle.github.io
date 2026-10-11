const {chromium}=require('playwright');const fs=require('fs');(async()=>{const b=await chromium.launch({executablePath:'/opt/pw-browsers/chromium'});const p=await b.newPage({viewport:{width:900,height:420},deviceScaleFactor:2});const e=[];p.on('pageerror',x=>e.push(x.message));const w=n=>new Promise(r=>setTimeout(r,n));
const mock=fs.readFileSync('fbmock.js','utf8');let n=0;await p.route('https://www.gstatic.com/**',r=>r.fulfill({status:200,contentType:'text/javascript',body:n++?'':mock}));
await p.addInitScript(()=>{window.__USER={uid:'me',email:'me@example.com'};window.__DB={saves:{},slips:{},grants:{},online:{},config:{main:{}},adminlog:{},arena:{},market:{},payouts:{},refs:{}}});
await p.goto('file:///home/claude/pixeldeck/_t.html');await w(1500);
await p.evaluate(async()=>{USER={sub:'me',name:'T'};S=unlock(fresh());S.me={name:'Toey'};S.gift=true;S.tut=null;S.n160=1;S.n165=1;S.n167=1;const L=Object.keys(C).filter(id=>C[id].r==='L').slice(0,3);L.forEach(id=>S.cards[id]={lv:60,exp:0});S.team=L;S.cleared=120;S.bc=[10,20];S.afk=Date.now();S.gold=1000;
 const W=twWeek(),t=Date.now();S.tw={w:W-1,f:77,pf:77};S.pv={st:40,hi:44,w:9,l:3,d:today(),n:0,sw:W-1};
 const c=window.__DB['tower/'+(W-1)+'/s']={};[['a','Narathip',41,3],['me','Toey',77,5],['c','Getter',12,1],['e','Zed',77,9]].forEach(([u,nm,f,h])=>c[u]={name:nm,look:'h06',f,at:new Date(t-h*36e5),fd:0,sh:'',st:3});
 save();await fbLoad();await fbUser();home()});
await w(1500);console.log('roll',await p.evaluate(()=>JSON.stringify({tw:S.tw,twp:S.twp,pv:S.pv,mail:S.mail,badge:document.getElementById('mailbdg').outerHTML})));
await p.evaluate(()=>home());await w(300);await p.screenshot({path:'b167_lobby_mail.png'});
await p.evaluate(()=>{document.querySelector('[data-act=mail]').click()});await w(400);await p.screenshot({path:'b167_mail.png'});
await p.evaluate(()=>{document.querySelector('[data-act=mailall]').click()});await w(500);await p.screenshot({path:'b167_mail_got.png'});
console.log('claimed',await p.evaluate(()=>JSON.stringify({sh:S.sh,shp:S.shp,dia:S.dia,ac:S.ac,gold:S.gold,mail:S.mail,cl:S.cl.src,lg:S.lg.i,arena:window.__DB.arena.me&&window.__DB.arena.me.sh})));
await p.evaluate(()=>{home();document.querySelector('[data-act=profile]').click()});await w(500);await p.screenshot({path:'b167_profile.png'});
await p.evaluate(()=>{document.querySelector('.main').scrollTop=230});await w(200);await p.screenshot({path:'b167_profile2.png'});
await p.evaluate(()=>{document.querySelectorAll('[data-act=shpick]')[0].click()});await w(300);console.log('pick',await p.evaluate(()=>[S.shp,shMine()]));
await p.evaluate(()=>{twTab='last';tower()});await w(900);await p.screenshot({path:'b167_last.png'});
// second settle must not repeat; a week with fewer than 10 floors gives nothing; guest gets the taking-part mail
console.log(await p.evaluate(()=>{const o={};twRoll();o.again=(S.mail||[]).length;S.tw={w:twWeek()-1,f:6};twRoll();o.low=[(S.mail||[]).length,JSON.stringify(S.twp)];
 const k=JSON.parse(JSON.stringify(S));k.mail=[{id:'x',k:'tw',w:2962,r:1,f:50,it:{sh:'T1.1',dia:500}}];ERA=(S.era||1)+1;const nn=eraWipe(k);ERA=S.era||1;o.wipe=[JSON.stringify(nn.sh),nn.shp,JSON.stringify(nn.mail),nn.gold];
 o.codes=['T1.1','T4.1','P5.12','P6.1','X1.1','T1.1<b>'].map(shOk);return JSON.stringify(o)}));
await p.evaluate(()=>{pv.tab='hub';arena()});await w(600);await p.screenshot({path:'b167_arena.png'});
console.log('errs',e);await b.close()})()
