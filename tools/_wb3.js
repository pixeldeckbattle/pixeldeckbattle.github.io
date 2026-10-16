const {chromium}=require('playwright');(async()=>{const b=await chromium.launch({executablePath:'/opt/pw-browsers/chromium'});const p=await b.newPage({viewport:{width:1000,height:466}});const e=[];p.on('pageerror',x=>e.push(x.message));
await p.goto('file:///home/claude/pixeldeck/_t.html');await p.waitForTimeout(900);
await p.evaluate(()=>{USER={name:'g'};S=unlock(fresh());S.tut=null;S.cleared=1500;S.spd=3;S.cards={h30:{lv:190,exp:0,star:6}};S.team=['h30'];S.me={name:'Toey',look:'h30'};WB.from=0;WB.to=Date.now()+5e9;home();ov('')});
await p.waitForTimeout(2000);await p.evaluate(()=>{ov('');wbHub()});await p.waitForTimeout(400);await p.evaluate(()=>ov(''));await p.click('[data-act=wbnew]');await p.waitForTimeout(400);
await p.evaluate(()=>{wbp.nodes.fake={n:'Friend',c:'h29',lv:150,j:Date.now()+1,hb:Date.now(),rd:1};wbWrite({card:'h30'});wbBegin({})});await p.waitForTimeout(4000);
const r=await p.evaluate(()=>({spd:S.spd,lock:!!(bt&&bt.wbLock),btn:!!document.querySelector('[data-act=spd]')}));
await p.evaluate(()=>{bt=null;busy=false;wbHub()});const r2=await p.evaluate(()=>S.spd);
console.log(JSON.stringify(r),'after',r2,'errors',e.length,e.slice(0,3).join('|'));await b.close()})()
