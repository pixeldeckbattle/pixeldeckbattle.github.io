// b193 world boss balance: party of 4 one-card players vs Gourdlich for WB_R rounds (engine functions, no animation). arg: {atkK, teams:[[ids]], R}
const {chromium}=require('playwright');(async()=>{const b=await chromium.launch({executablePath:'/opt/pw-browsers/chromium'});
const arg=JSON.parse(process.argv[2]||'{}');const p=await b.newPage();p.on('pageerror',e=>console.log('ERR',e.message));
await p.goto('file:///home/claude/pixeldeck/_t.html');await new Promise(r=>setTimeout(r,700));
const out=await p.evaluate((arg)=>{USER={name:'g'};S=unlock(fresh());
 const one=(team,am,rage)=>{S.cards={};team.forEach(id=>{S.cards[id]={lv:1,exp:0,star:arg.star||6};S.cards[id].lv=capOf(id);if(am&&C[id].role==='tank')S.cards[id].am=am});
  const B=WB_BOSS(),atk=Math.round(B.atk*(arg.atkK||1)*(rage?1.3:1));
  bt={n:1500,wb:1,round:1,sel:0,log:'',al:team.map(id=>fighter(id,S.cards[id].lv)),en:[{id:'wb1',boss:true,lord:1,atk,base:atk,hp:1e12,max:1e12,def:B.def,crit:.08,cx:1.5,sh:0,gim:'breath'}],wbd:team.map(()=>0),wbA:0};
  c3Amu(bt);let alive=0;
  for(let r=1;r<=WB_R;r++){for(const a of bt.al){if(a.hp<=0||a.done)continue;bt.wbA=bt.al.indexOf(a);tauntTick(a);const k=autoPick(a),ti=autoT();if(ti<0)break;cast(a,k,ti);fx.length=0;hits.clear()}
   for(const e of bt.en){if(e.frz){e.frz=0;continue}
     if(e.gim==='breath'&&bt.round%3===0){hitM=!!C[e.id].m;hitA=e.atk;bt.al.forEach((x,k)=>{if(x.hp>0){const [d,cr]=roll(e,.6);hurt(bt.al,'a',k,d,'d',cr)}});fx.length=0;hits.clear();continue}
     const j=foePick();if(j<0)break;foeHit(e,j);fx.length=0;hits.clear()}
   if(bt.al.every(x=>x.hp<=0))break;alive=r;bt.round++;bt.al.forEach(x=>x.done=false);bt.en.forEach(x=>x.done=false);s4Round(bt)}
  return {tot:bt.wbd.reduce((a,b)=>a+b,0),per:bt.wbd.map(Math.round),rounds:alive,left:bt.al.filter(x=>x.hp>0).length}};
 const res={};for(const [nm,team,am] of arg.teams){for(const rg of [0,1]){const R=[];for(let i=0;i<(arg.R||20);i++)R.push(one(team,am,rg));const avg=k=>Math.round(R.reduce((a,x)=>a+x[k],0)/R.length);
   res[nm+(rg?' RAGE':'')]=`dmg ${avg('tot')} (per card ${team.map((_,i)=>Math.round(R.reduce((a,x)=>a+x.per[i],0)/R.length)).join('/')}) rounds ${(R.reduce((a,x)=>a+x.rounds,0)/R.length).toFixed(1)} alive ${(R.reduce((a,x)=>a+x.left,0)/R.length).toFixed(1)}`}}
 return JSON.stringify({boss:WB_BOSS(),res},null,1)},arg);
console.log(out);await b.close()})()
