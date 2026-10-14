const {chromium}=require('playwright');(async()=>{const b=await chromium.launch({executablePath:'/opt/pw-browsers/chromium'});const e=[];const p=await b.newPage();p.on('pageerror',x=>e.push(x.message));
await p.goto('file:///home/claude/pixeldeck/_t.html');await p.waitForTimeout(900);
console.log(JSON.stringify(await p.evaluate(()=>{USER={name:'g'};S=unlock(fresh());S.cards={h06:{lv:1,exp:0}};const res=[];
 for(const roll of [0.1,0.9]){S.gold=100000;S.am={dragon:50};fuTo='SL';afTo='lion';afPick={dragon:50};const R0=Math.random;Math.random=()=>roll;const r=afDo();Math.random=R0;
  res.push({roll,ok:r&&r.ok,bad:r&&r.bad,cost:r&&r.cost,gold:S.gold,lion:S.am.lion||0,dragon:S.am.dragon||0})}
 return res})),'errors',e.length,e.slice(0,2).join('|'));await b.close()})()
