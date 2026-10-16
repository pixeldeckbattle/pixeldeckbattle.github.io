const {chromium}=require('playwright');(async()=>{const b=await chromium.launch({executablePath:'/opt/pw-browsers/chromium'});const p=await b.newPage({viewport:{width:1280,height:720}});const e=[];p.on('pageerror',x=>e.push(x.message));
await p.goto('file:///home/claude/pixeldeck/_t.html');await p.waitForTimeout(900);const D='/tmp/claude-0/-home-claude/faf65de1-a492-52b3-8473-ee4e7e7dcc7a/scratchpad/wbt/';require('fs').mkdirSync(D,{recursive:true});
await p.evaluate(()=>{USER={name:'g'};S=unlock(fresh());S.tut=null;['n160','n165','n167','n174','n176','n180','n182','n183','n189'].forEach(k=>S[k]=1);S.cleared=1500;S.spd=3;
 S.cards={h29:{lv:190,exp:0,star:6},h30:{lv:190,exp:0,star:6,am:'grove'},h31:{lv:190,exp:0,star:6},h03:{lv:190,exp:0},h34:{lv:180,exp:0}};S.team=['h30','h29','h31'];S.me={name:'Toey',look:'h29'};
 WB.from=0;WB.to=Date.now()+5e9;home();ov('')});
await p.waitForTimeout(700);await p.screenshot({path:D+'0-lobby.png'});
await p.waitForTimeout(2500);await p.evaluate(()=>{ov('');wbHub()});await p.waitForTimeout(900);await p.screenshot({path:D+'1-hub.png'});
await p.evaluate(()=>ov(''));await p.click('[data-act=wbnew]');await p.waitForTimeout(600);
await p.evaluate(()=>{wbp.t0=0;wbRoom()});await p.click('.wbseat.empty [data-act=wbbot]');await p.waitForTimeout(200);await p.click('.wbseat.empty [data-act=wbbot]');await p.waitForTimeout(200);
await p.click('[data-act=wbcard][data-id=h30]');await p.waitForTimeout(200);await p.click('[data-act=wbready]');await p.waitForTimeout(300);await p.screenshot({path:D+'2-room.png'});
await p.click('[data-act=wbgo]');await p.waitForTimeout(1300);await p.screenshot({path:D+'3-vs.png'});
await p.waitForTimeout(4000);await p.screenshot({path:D+'4-fight.png'});
for(let i=0;i<120;i++){await p.waitForTimeout(1000);const r=await p.evaluate(()=>!!document.querySelector('.wbres'));if(r)break}
await p.waitForTimeout(800);await p.screenshot({path:D+'5-result.png'});
const st=await p.evaluate(()=>({wb:S.wb,cdy:S.cdy,sl:S.sl,L:S.wbL,mail:(S.mail||[]).length}));
await p.evaluate(()=>{wbShop('c')});await p.waitForTimeout(600);await p.screenshot({path:D+'6-shop.png'});
await p.evaluate(()=>{wbRank()});await p.waitForTimeout(800);await p.screenshot({path:D+'7-rank.png'});
await p.evaluate(()=>{wbPop({n:'Narathip',code:'4821',l:'h03',f:'40',cnt:3,at:Date.now()})});await p.waitForTimeout(600);await p.screenshot({path:D+'8-invite.png'});
console.log(JSON.stringify(st),'errors',e.length,e.slice(0,4).join(' | '));await b.close()})()
