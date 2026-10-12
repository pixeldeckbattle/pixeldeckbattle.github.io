const {chromium}=require('playwright');(async()=>{const b=await chromium.launch({executablePath:'/opt/pw-browsers/chromium'});const p=await b.newPage();const e=[];p.on('pageerror',x=>e.push(x.message));
await p.goto('file:///home/claude/pixeldeck/_t.html');await new Promise(r=>setTimeout(r,900));
console.log(await p.evaluate(()=>{USER={guest:true,name:'G'};const out={};
 for(const [tier,cl] of [[1,300],[2,300],[3,300],[2,480]]){S=unlock(fresh());S.cleared=cl;vipAdd(30,tier);S.vpd=S.vip;const am={R:0,L:0},cr={};let N=1500;
  for(let i=0;i<N;i++){const g=afkDrops(10*36e5);Object.keys(g.am).forEach(k=>am[AM[k].r]+=g.am[k]);g.cards.forEach(c=>{const r=C[c.id].r;cr[r]=(cr[r]||0)+1})}
  const f=o=>Object.fromEntries(Object.entries(o).map(([k,v])=>[k,+(v/N).toFixed(2)]));out['tier'+tier+'@'+cl]={am:f(am),cards:f(cr)}}
 // online reference: replay wins per 8h at ~120 wins/hour, no VIP
 S=unlock(fresh());S.cleared=300;const n=299;const W=960;out.online8h={am:+(W*dropP(n,DROP,DROP_BOSS,false)).toFixed(1),cards:+(W*dropP(n,CDROP,CDROP_BOSS,false)).toFixed(1)};
 return JSON.stringify(out,null,1)}));console.log(e);await b.close()})()
