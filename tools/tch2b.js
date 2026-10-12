const {chromium}=require('playwright');(async()=>{const b=await chromium.launch({executablePath:'/opt/pw-browsers/chromium'});const e=[];const w=n=>new Promise(r=>setTimeout(r,n));
const p=await b.newPage({viewport:{width:900,height:420},deviceScaleFactor:2});p.on('pageerror',x=>e.push(x.message));
await p.goto('file:///home/claude/pixeldeck/_t.html');await w(900);
await p.evaluate(()=>{USER={guest:true,name:'G'};S=unlock(fresh());S.me={name:'G'};S.gift=true;S.n160=S.n165=S.n167=1;S.tut=null;['h03','h22','h27'].forEach(id=>S.cards[id]={lv:250,exp:0,star:10});S.team=['h03','h22','h27'];S.cleared=599;S.cs={};for(let n=501;n<=514;n++)S.cs[n]=3;S.spd=3;S.auto=true;startBattle(600)});
await w(30000);await p.screenshot({path:'sh173/res600.png'});
console.log(await p.evaluate(()=>JSON.stringify({cl:S.cleared,cs600:S.cs[600],rs:S.rs,dia:S.dia,chest:chestsLeft()})));
await p.evaluate(()=>{const c=document.querySelector('[data-act=schest]');if(c)c.click()});await w(400);
console.log(await p.evaluate(()=>JSON.stringify({rs:S.rs,csc:S.csc,gold:S.gold})));
// star 6 upgrade on an L card
await p.evaluate(()=>{S.cards.h15={lv:90,exp:0,star:5};S.rs=10;S.gold=1e6;zoom('h15')});await w(500);await p.screenshot({path:'sh173/zoom_star.png'});
await p.evaluate(()=>{const c=document.querySelector('[data-star2]');c&&c.click()});await w(400);
console.log(await p.evaluate(()=>JSON.stringify({star:S.cards.h15.star,rs:S.rs,gold:S.gold,cap:capOf('h15')})));await p.screenshot({path:'sh173/zoom_star6.png'});
await p.evaluate(()=>{$('zoom').hidden=true;gTab='ch2';guide()});await w(500);await p.screenshot({path:'sh173/guide_ch2.png'});
await p.evaluate(()=>{prepN=607;prep()});await w(500);await p.screenshot({path:'sh173/prep607.png'});
console.log(e);await b.close()})()
