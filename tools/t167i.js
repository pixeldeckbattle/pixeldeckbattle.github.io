const {chromium}=require('playwright');(async()=>{const b=await chromium.launch({executablePath:'/opt/pw-browsers/chromium'});const p=await b.newPage({viewport:{width:900,height:420},deviceScaleFactor:2});const e=[];p.on('pageerror',x=>e.push(x.message));const w=n=>new Promise(r=>setTimeout(r,n));
await p.goto('file:///home/claude/pixeldeck/_t.html');await w(900);
await p.evaluate(()=>{USER={guest:true,name:'G'};S=unlock(fresh());S.me={name:'G'};S.gift=true;S.n160=S.n165=S.n167=1;['h15','h13','h26'].forEach(id=>S.cards[id]={lv:90,exp:0});S.team=['h15','h13','h26'];S.cleared=200;S.auto=true;S.spd=1;S.tw={w:twWeek(),f:0};home()});
for(const f of [50,90,70,30]){await p.evaluate(f=>{bt=null;busy=false;S.tw.f=f-1;twTok++;startTower(f).then(()=>{})},f);await w(1200);await p.evaluate(()=>{bt.en.forEach(x=>{x.hp=x.max=x.max*40;x.atk=1});});
 for(let i=0;i<120;i++){await w(60);if(await p.evaluate(()=>!!document.querySelector('.fig.boss .spr.atk')))break}await w(230);await p.screenshot({path:'d_atk'+f+'.png'})}
console.log(e);await b.close()})()
