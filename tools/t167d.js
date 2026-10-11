const {chromium}=require('playwright');(async()=>{const b=await chromium.launch({executablePath:'/opt/pw-browsers/chromium'});const p=await b.newPage({viewport:{width:900,height:420},deviceScaleFactor:2});const e=[];p.on('pageerror',x=>e.push(x.message));const w=n=>new Promise(r=>setTimeout(r,n));
await p.goto('file:///home/claude/pixeldeck/_t.html');await w(900);
console.log(await p.evaluate(()=>{USER={guest:true,name:'Guest'};S=unlock(fresh());S.me={name:'G'};S.gift=true;S.n160=S.n165=S.n167=1;['h15','h13','h26'].forEach(id=>S.cards[id]={lv:90,exp:0});S.team=['h15','h13','h26'];S.cleared=200;const o={};
 const mk=f=>{bt={n:twEq(f),tw:f,round:1,sel:0,log:'',al:S.team.map(id=>fighter(id,90)),en:twDef(f)};return bt.en.find(x=>x.boss)};
 let B=mk(10);hitM=false;hitA=500;const h0=B.hp;[1,2,3].forEach(()=>hurt(bt.en,'e',bt.en.indexOf(B),300));o.gate=[h0-B.hp,B.gate];hurt(bt.en,'e',bt.en.indexOf(B),300);o.gate.push(h0-B.hp);
 B=mk(100);o.shiftBoss=C[B.id].n;const i=bt.en.indexOf(B);let a=B.hp;hitM=false;hurt(bt.en,'e',i,1000);o.shift=[a-B.hp];a=B.hp;hitM=true;hurt(bt.en,'e',i,1000);o.shift.push(a-B.hp);bt.round=2;a=B.hp;hitM=false;hurt(bt.en,'e',i,1000);o.shift.push(a-B.hp,wkU(B));
 B=mk(50);o.rage=[C[B.id].n,B.atk];hitM=true;hurt(bt.en,'e',bt.en.indexOf(B),Math.round(B.max*.6));o.rage.push(B.atk);
 B=mk(30);o.raiseBoss=C[B.id].n;bt.en.forEach(x=>{if(x!==B)x.hp=0});bt.round=2;twRound(bt);o.raise=[bt.en.map(x=>x.hp>0?1:0).join('')];bt.round=3;twRound(bt);o.raise.push(bt.en.map(x=>x.hp>0?1:0).join(''),B.used);bt.en.forEach(x=>{if(x!==B)x.hp=0});bt.round=4;twRound(bt);o.raise.push(bt.en.map(x=>x.hp>0?1:0).join(''));
 o.defs=[1,3,6,10,20,60,200,250,300].map(f=>f+':'+twDef(f).map(x=>x.id+'/'+x.atk+'/'+x.hp).join(' '));o.main=[...new Set(Array.from({length:500},(_,k)=>stageDef(k+1).map(x=>x.id)).flat())].sort().join(',');
 fx.length=0;hits.clear();bt=null;return JSON.stringify(o,null,1)}));
// real fight against the Blizzard Wyrm (floor 70): watch for the breath
await p.evaluate(()=>{S.auto=true;S.spd=2;S.tw={w:twWeek(),f:69};home();tower();twEnter()});let seen='',rounds=0;
for(let i=0;i<240;i++){await w(250);const r=await p.evaluate(()=>bt?[bt.log,bt.round,bt.al.map(x=>x.hp).join('/')]:null);if(!r)break;rounds=r[1];if(/ลมหายใจ|Storm Breath/.test(r[0])){seen=r.join(' | ');}}
console.log('breath:',seen,'rounds',rounds,await p.evaluate(()=>JSON.stringify(S.tw)));
// guest hub + english
await p.evaluate(()=>{bt=null;busy=false;S.lang='en';twTab='board';tower()});await w(500);await p.screenshot({path:'b167_hub_en.png'});
await p.evaluate(()=>{twTab='prize';tower()});await w(300);await p.screenshot({path:'b167_prize_en.png'});
await p.evaluate(()=>{S.lang='th';gTab='tower';guide()});await w(300);await p.screenshot({path:'b167_guide.png'});
await p.evaluate(()=>{S.sh=['T1.1','P4.1'];S.shp='T1.1';S.fd=1;roomNo=0;room=null;enterRoom()});await w(1200);await p.screenshot({path:'b167_room.png'});
console.log('errs',e);await b.close()})()
