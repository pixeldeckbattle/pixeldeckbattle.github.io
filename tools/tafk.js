const {chromium}=require('playwright');(async()=>{const b=await chromium.launch({executablePath:'/opt/pw-browsers/chromium'});const e=[];const w=n=>new Promise(r=>setTimeout(r,n));
const p=await b.newPage({viewport:{width:900,height:420},deviceScaleFactor:2});p.on('pageerror',x=>e.push(x.message));
await p.goto('file:///home/claude/pixeldeck/_t.html');await w(900);
await p.evaluate(()=>{USER={guest:true,name:'G'};S=unlock(fresh());S.me={name:'G'};S.gift=true;S.tut=null;S.cards={h03:{lv:220,exp:0}};S.team=['h03'];S.cleared=650;S.vip=S.vpd=Date.now()+864e5*5;S.vt=1;S.afk=Date.now()-11*36e5;home()});await w(600);
await p.evaluate(()=>{const g=afkGold(),ms=Date.now()-S.afk;S.gold+=g;const got=afkDrops(ms);afkShow(g,got);window._g=got});await w(600);
console.log(await p.evaluate(()=>JSON.stringify({rs:S.rs,got:_g.rs})));await p.screenshot({path:'sh173/afk_rs.png'});console.log(e);await b.close()})()
