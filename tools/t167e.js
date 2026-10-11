const {chromium}=require('playwright');(async()=>{const b=await chromium.launch({executablePath:'/opt/pw-browsers/chromium'});const p=await b.newPage({viewport:{width:900,height:420},deviceScaleFactor:2});const e=[];p.on('pageerror',x=>e.push(x.message));const w=n=>new Promise(r=>setTimeout(r,n));
await p.goto('file:///home/claude/pixeldeck/_t.html');await w(900);
await p.evaluate(()=>{USER={guest:true,name:'Guest'};S=unlock(fresh());S.me={name:'G'};S.gift=true;S.n160=S.n165=S.n167=1;['h15','h13','h26'].forEach(id=>S.cards[id]={lv:90,exp:0});S.team=['h15','h13','h26'];S.cleared=200;S.auto=true;S.spd=2;S.tw={w:twWeek(),f:69};home();tower();twEnter()});
await w(700);await p.evaluate(()=>{bt.en.forEach(x=>{x.hp=x.max=x.max*30});bt.al.forEach(x=>{x.hp=x.max=x.max*30})});let seen='',shot=0;
for(let i=0;i<200;i++){await w(200);const r=await p.evaluate(()=>bt?[bt.log,bt.round,bt.al.map(x=>x.hp).join('/')]:null);if(!r)break;if(/ลมหายใจ|Storm Breath/.test(r[0])){seen=r.join(' | ');if(!shot){shot=1;await w(500);await p.screenshot({path:'b167_breath.png'})}}if(r[1]>=5)break}
console.log('breath:',seen);
// stop in the middle of a fight, then stop during a run
await p.evaluate(()=>{document.querySelector('[data-act=prep]').click()});await w(400);console.log('left fight ->',await p.evaluate(()=>[!!document.querySelector('.twhub'),bt,S.tw.f]));
await p.evaluate(()=>{S.tw.f=0;['h03','h22','h27'].forEach(id=>S.cards[id]={lv:100,exp:0});S.team=['h03','h22','h27'];twEnter()});for(let i=0;i<100;i++){await w(100);if(await p.evaluate(()=>!!document.querySelector('.twrun')))break}
await p.evaluate(()=>{document.querySelector('[data-act=twstop]').click()});await w(2500);console.log('stopped run ->',await p.evaluate(()=>[!!document.querySelector('.twhub'),bt,S.tw.f]));
console.log('errs',e);await b.close()})()
