const {chromium}=require('playwright');(async()=>{const b=await chromium.launch({executablePath:'/opt/pw-browsers/chromium'});const e=[];const w=n=>new Promise(r=>setTimeout(r,n));
const p=await b.newPage({viewport:{width:900,height:420},deviceScaleFactor:2});p.on('pageerror',x=>e.push(x.message));
await p.goto('file:///home/claude/pixeldeck/_t.html');await w(900);
console.log(await p.evaluate(()=>{USER={guest:true,name:'G'};S=unlock(fresh());S.me={name:'G'};S.gift=true;S.n160=S.n165=S.n167=1;S.tut=null;S.cards={h03:{lv:100,exp:0}};S.team=['h03'];S.cleared=600;S.bc=[10,20];S.vip=Date.now()+864e5*3;S.vt=1;delete S.vpd;S.afk=Date.now()-11*36e5;home();return JSON.stringify({paid:vipPaid(),spd:SPD_MAX(),afkH:afkH()})}));
await w(2200);await p.screenshot({path:'sh173/news174.png'});console.log(await p.evaluate(()=>[S.n174,!!$('ov').innerHTML.trim()]));
console.log(await p.evaluate(()=>{const g=afkDrops(11*36e5);return JSON.stringify({k:g.k,rs:g.rs,am:Object.keys(g.am).length})}));
console.log(await p.evaluate(()=>{ov('');S.rs=0;window.__DEVT=1;devGrant();return JSON.stringify({h03:S.cards.h03,h28:S.cards.h28,h15:S.cards.h15,h05:S.cards.h05,rs:S.rs})}));
console.log(e);await b.close()})()
