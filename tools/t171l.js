const {chromium}=require('playwright');const fs=require('fs');(async()=>{const b=await chromium.launch({executablePath:'/opt/pw-browsers/chromium'});const w=n=>new Promise(r=>setTimeout(r,n));const mock=fs.readFileSync('fbmock.js','utf8');
async function run(name,pre){const ctx=await b.newContext({viewport:{width:900,height:420},deviceScaleFactor:2});const p=await ctx.newPage();const e=[];p.on('pageerror',x=>e.push(x.message));
 await p.route('https://www.gstatic.com/**',r=>r.fulfill({status:200,contentType:'text/javascript',body:mock}));
 await p.addInitScript(pre);
 await p.goto('file:///home/claude/pixeldeck/_t.html');await w(1200);
 await p.evaluate(()=>{signIn({guest:true,name:'Guest'})});await w(1500);
 await p.evaluate(()=>{S.gift=true;S.n160=S.n165=S.n167=1;S.tut=null;S.gold=777777;S.dia=55;S.cleared=42;S.am={tiger:9};save();settings()});await w(400);
 const has=await p.evaluate(()=>!!document.querySelector('[data-act=glink]'));
 await p.evaluate(()=>document.querySelector('[data-act=glink]').click());await w(500);await p.screenshot({path:'sh170/link_'+name+'1.png'});
 await p.evaluate(()=>document.querySelector('[data-gl=go]').click());await w(2500);await p.screenshot({path:'sh170/link_'+name+'2.png'});
 const r=await p.evaluate(()=>({user:USER&&(USER.sub||'guest'),gold:S.gold,cleared:S.cleared,lnk:!!S.lnk,guestKey:!!localStorage.getItem(KEY),cloud:!!(window.__DB.saves&&window.__DB.saves.new1),cloudGold:window.__DB.saves&&window.__DB.saves.new1?JSON.parse(window.__DB.saves.new1.data).gold:null,ov:document.getElementById('ov').innerText.slice(0,90)}));
 return {p,ctx,e,has,r}}
let A=await run('a',()=>{window.__USER=null;window.__USER2={uid:'new1',email:'new@example.com',displayName:'Newbie Test'}});
await new Promise(r=>setTimeout(r,2500));A.r.after=await A.p.evaluate(()=>({user:USER.sub,gold:S.gold,lnk:!!S.lnk,cloud:!!window.__DB.saves.new1,cloudGold:window.__DB.saves.new1?JSON.parse(window.__DB.saves.new1.data).gold:null,name:S.me&&S.me.name}));
console.log('A',A.has,JSON.stringify(A.r),A.e);await A.ctx.close();
let B=await run('b',()=>{window.__USER=null;window.__USER2={uid:'old1',email:'old@example.com',displayName:'Old'};window.__DB={saves:{old1:{data:JSON.stringify({cards:{h06:{lv:5,exp:0}},gold:123,ts:1,rv:3,team:['h06'],cleared:7,gift:true}),ts:1,rv:3}},online:{},config:{main:{}},arena:{},market:{},payouts:{},refs:{},grants:{}}});
console.log('B',JSON.stringify(B.r),B.e);
await B.p.evaluate(()=>document.querySelector('[data-gl=stay]').click());await w(400);console.log('B stay',await B.p.evaluate(()=>[USER&&USER.guest,S.gold,!!localStorage.getItem(KEY)]));
await B.p.evaluate(()=>{settings();document.querySelector('[data-act=glink]').click()});await w(300);await B.p.evaluate(()=>document.querySelector('[data-gl=go]').click());await w(1500);
await B.p.evaluate(()=>document.querySelector('[data-gl=use]').click());await w(3000);console.log('B use',await B.p.evaluate(()=>[USER.sub,S.gold,S.cleared,!!localStorage.getItem(KEY)]),B.e);await B.p.screenshot({path:'sh170/link_b3.png'});
await b.close()})()
