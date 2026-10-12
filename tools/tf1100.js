const {chromium}=require('playwright');const fs=require('fs');(async()=>{const b=await chromium.launch({executablePath:'/opt/pw-browsers/chromium'});const p=await b.newPage({viewport:{width:900,height:420},deviceScaleFactor:2});const e=[];p.on('pageerror',x=>e.push(x.message));
const mock=fs.readFileSync('fbmock.js','utf8');let n=0;await p.route('https://www.gstatic.com/**',r=>r.fulfill({status:200,contentType:'text/javascript',body:n++?'':mock}));
await p.addInitScript(()=>{window.__DB={}});
await p.goto('file:///home/claude/pixeldeck/_t.html');await new Promise(r=>setTimeout(r,1500));
const W=n=>new Promise(r=>setTimeout(r,n));
for(let i=1;i<=5;i++){await p.evaluate(i=>{USER={sub:'uid'+(i>4?1:i),name:'P'+i};S=unlock(fresh());S.me={name:'Player'+i};S.gift=true;S.tut=null;S.cards={h03:{lv:220,exp:0}};S.team=['h03'];S.cleared=1100;S.rs=0;f1100Claim()},i);await W(700);
 console.log(i,await p.evaluate(()=>JSON.stringify({f:S.f1100,h28:!!S.cards.h28,rs:S.rs})));if(i===1)await p.screenshot({path:'sh173/f1100_win.png'});if(i===4)await p.screenshot({path:'sh173/f1100_full.png'})}
console.log(await p.evaluate(()=>firebase.firestore().collection('firsts').doc('s1100').get().then(d=>JSON.stringify(d.data()))));
console.log(e);await b.close()})()
