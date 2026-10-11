const {chromium}=require('playwright');(async()=>{const b=await chromium.launch({executablePath:'/opt/pw-browsers/chromium'});const p=await b.newPage({viewport:{width:900,height:420},deviceScaleFactor:2});const e=[];p.on('pageerror',x=>e.push(x.message));const w=n=>new Promise(r=>setTimeout(r,n));
await p.goto('file:///home/claude/pixeldeck/_t.html');await w(900);
await p.evaluate(()=>{USER={guest:true,name:'G'};S=unlock(fresh());S.me={name:'G'};S.gift=true;S.n160=S.n165=S.n167=1;S.cards={h06:{lv:1,exp:0}};S.team=['h06'];S.cleared=30;S.bc=[10,20];S.gold=273500;S.dia=5;home()});await w(700);await p.screenshot({path:'x_lobby.png'});
await p.evaluate(()=>document.querySelector('[data-act=exg]').click());await w(400);await p.screenshot({path:'x_1.png'});
const c=async(sel)=>{await p.evaluate(s=>{const x=document.querySelector(s);if(x&&!x.disabled)x.click()},sel);await w(120)};
await c('[data-act=exadj][data-d="10"]');await c('[data-act=exadj][data-d="100"]');await c('[data-act=exadj][data-d="100"]');console.log('n',await p.evaluate(()=>[exN,exMax()]));
await c('[data-act=exmax]');console.log('max',await p.evaluate(()=>exN));await c('[data-act=exadj][data-d="-10"]');await c('[data-act=exadj][data-d="-10"]');
console.log(await p.evaluate(()=>{const o=[];[11,23,35,9,0,-5,1e9,'x'].forEach(v=>{exN=v;o.push(exClamp(exN))});exN=30;exchange();return o}));await p.screenshot({path:'x_2.png'});
await p.evaluate(()=>{exN=37});await c('[data-act=exgo]');await w(200);await p.screenshot({path:'x_3.png'});console.log('after',await p.evaluate(()=>[S.gold,S.dia,JSON.stringify(S.lg.o),exN]));
await p.evaluate(()=>{S.gold=15000;exN=10;exchange()});await w(200);await c('[data-act=exgo]');console.log('poor',await p.evaluate(()=>[S.gold,S.dia,document.querySelector('.exgo').disabled]));await p.screenshot({path:'x_4.png'});
console.log(e);await b.close()})()
