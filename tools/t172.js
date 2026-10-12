const {chromium}=require('playwright');(async()=>{const b=await chromium.launch({executablePath:'/opt/pw-browsers/chromium'});const p=await b.newPage({viewport:{width:900,height:420},deviceScaleFactor:2});const e=[];p.on('pageerror',x=>e.push(x.message));const w=n=>new Promise(r=>setTimeout(r,n));
await p.goto('file:///home/claude/pixeldeck/_t.html');await w(900);
await p.evaluate(()=>{USER={guest:true,name:'G'};S=unlock(fresh());S.me={name:'G'};S.gift=true;S.n160=S.n165=S.n167=1;S.tut=null;['h22','h27','h07'].forEach(id=>S.cards[id]={lv:150,exp:0});S.team=['h22','h27','h07'];S.cleared=300;S.bc=[10,20];S.gold=0;S.afk=Date.now()-8*36e5;home()});await w(600);
// offline collect: free vs VIP gold
const r1=await p.evaluate(()=>{const before=Object.values(S.am||{}).reduce((a,b)=>a+b,0),c0=Object.values(S.cards).reduce((a,c)=>a+(c.cp||0),0)+Object.keys(S.cards).length;document.querySelector('[data-act=afk]').click();return {gold:S.gold,am:Object.values(S.am||{}).reduce((a,b)=>a+b,0)-before,cards:Object.values(S.cards).reduce((a,c)=>a+(c.cp||0),0)+Object.keys(S.cards).length-c0,afkReset:Date.now()-S.afk<5000}});
await w(500);await p.screenshot({path:'sh170/afk_pop.png'});console.log('afk free',JSON.stringify(r1));
console.log('afk avg',await p.evaluate(()=>{const run=()=>{let a=0,c=0;for(let i=0;i<200;i++){const g=afkDrops(8*36e5);a+=Object.values(g.am).reduce((x,y)=>x+y,0);c+=g.cards.length}return [+(a/200).toFixed(1),+(c/200).toFixed(1)]};const free=run();S.vip=Date.now()+864e5*400;S.vipt=3;const vip=run();return {free,vipGold:vip,tier:vipTier()}}));
// battle: real game, auto on, check buff strike and lone aoe
await p.evaluate(()=>{S.vip=0;S.auto=true;S.spd=4;ov('');startBattle(301)});await w(9000);
console.log('battle',await p.evaluate(()=>[!!bt,bt&&bt.round,bt&&bt.log]));await p.screenshot({path:'sh170/b172_battle.png'});
// unit checks on cast
console.log('cast',await p.evaluate(()=>{const mk=()=>{bt={n:300,round:1,sel:0,log:'',al:['h22','h27','h07'].map(id=>fighter(id,150)),en:stageDef(300).map(e=>({...e,max:e.hp}))};};
 mk();const w=bt.al[0],e0=bt.en[0].hp;cast(w,1,0);const buffHit=e0-bt.en[0].hp,atkUp=w.atk>w.base;
 mk();const t=bt.al[1],e1=bt.en[0].hp;cast(t,1,0);const guardHit=e1-bt.en[0].hp,taunt=t.taunt;
 mk();bt.en.forEach((x,i)=>{if(i)x.hp=0});const z=bt.al[0];z.cds=[0,0,0];const e2=bt.en[0].hp;cast(z,2,0);const loneAoe=e2-bt.en[0].hp;
 mk();const h=bt.al[2];h.cds=[0,0,0];cast(h,1,0);const sh=bt.al.map(x=>x.sh);
 return JSON.stringify({buffHit,atkUp,guardHit,taunt,loneAoe,sh,cd0:fighter('h22',1).cds})}));
console.log('auto',await p.evaluate(()=>{bt={n:300,round:1,sel:0,log:'',al:['h22','h27','h07'].map(id=>fighter(id,150)),en:stageDef(300).map(e=>({...e,max:e.hp}))};const o=[];bt.al.forEach(a=>o.push(SK[a.id][autoPick(a)][0]));bt.al[1].taunt=2;o.push('taunting:'+SK['h27'][autoPick(bt.al[1])][0]);bt.al[0].hp=bt.al[0].max*.3;o.push('hurt:'+SK['h07'][autoPick(bt.al[2])][0]);return o.join(' | ')}));
console.log(e);await b.close()})()
