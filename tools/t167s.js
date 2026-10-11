const {chromium}=require('playwright');(async()=>{const b=await chromium.launch({executablePath:'/opt/pw-browsers/chromium'});const p=await b.newPage({viewport:{width:900,height:420},deviceScaleFactor:2,hasTouch:true});const e=[];p.on('pageerror',x=>e.push(x.message));const w=n=>new Promise(r=>setTimeout(r,n));
await p.goto('file:///home/claude/pixeldeck/_t.html');await w(900);
await p.evaluate(()=>{USER={guest:true,name:'G'};S=unlock(fresh());S.me={name:'G'};S.gift=true;S.n160=S.n165=S.n167=1;S.cards={h06:{lv:1,exp:0}};S.team=['h06'];S.cleared=30;S.bc=[10,20];S.gold=60000;S.dia=900;S.dp=450;home();document.querySelector('[data-act=shop]').click()});await w(1200);await p.screenshot({path:'s_gold.png'});
for(const i of [1,2,3]){await p.evaluate(()=>document.querySelector('#chr').click());await w(700);await p.screenshot({path:'s_'+i+'.png'})}
console.log(await p.evaluate(()=>[shopSel,document.querySelector('#pkd .pkn').innerText]));
// swipe back by scrolling
await p.evaluate(()=>{const t=document.getElementById('chrow');t.scrollTo({left:0})});await w(500);console.log('after scroll',await p.evaluate(()=>[shopSel,document.querySelector('#pkd .pkn').innerText]));
await p.evaluate(()=>document.querySelector('[data-act=opengold]').click());await w(1500);await p.screenshot({path:'s_pull.png'});
console.log(await p.evaluate(()=>[S.gold,!!document.querySelector('.shres'),document.querySelectorAll('.shres .pull>div').length]));
await p.evaluate(()=>document.querySelector('[data-act=shopok]').click());await w(300);console.log(await p.evaluate(()=>[!!document.querySelector('.shres'),shopSel]));
await p.evaluate(()=>{shopPick(1);document.querySelector('[data-act=open]').click()});await w(400);console.log('starter',await p.evaluate(()=>[S.dia,document.querySelectorAll('.shres .pull>div').length]));
await p.evaluate(()=>{pull=null;shop();shopPick(3);document.querySelector('[data-act=openltd][data-c=p]').click()});await w(400);console.log('ltd',await p.evaluate(()=>[S.dp,document.querySelectorAll('.shres .pull>div').length]));await p.screenshot({path:'s_pull_ltd.png'});
await p.setViewportSize({width:740,height:340});await p.evaluate(()=>{pull=null;fit();shop();shopPick(3)});await w(700);await p.screenshot({path:'s_small.png'});
await p.evaluate(()=>{S.lang='en';shop()});await w(500);await p.screenshot({path:'s_en.png'});
console.log(e);await b.close()})()
