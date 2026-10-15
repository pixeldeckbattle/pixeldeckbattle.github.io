// b182: tank HP growth, custom auto skills, arena storm, card fuse-all, PC fullscreen default, VIP retry switch, card panel + fusion screens render
const {chromium}=require('playwright');(async()=>{const b=await chromium.launch({executablePath:'/opt/pw-browsers/chromium'});const e=[];const p=await b.newPage({viewport:{width:1280,height:720}});p.on('pageerror',x=>e.push(x.message));
await p.goto('file:///home/claude/pixeldeck/_t.html');await p.waitForTimeout(900);
const r=await p.evaluate(()=>{USER={name:'g'};S=unlock(fresh());const out={};
 // tank HP: same at Lv1, about +30% growth later; non-tanks unchanged
 const t1=stat('h27',1),tN=stat('h27',190),z=stat('h03',190);out.tank={lv1:t1.hp===Math.round(C.h27.h*starMul(starOf('h27'))),lv190:tN.hp,base190:Math.round(C.h27.h*(1+RAR.SL.g*189)*starMul(starOf('h27'))),zeusSame:z.hp===Math.round(C.h03.h*(1+RAR.SL.g*189)*starMul(starOf('h03')))};
 // custom auto: first ready skill in order, off skills skipped, fallback 0
 S.cards={h03:{lv:50,exp:0},h22:{lv:50,exp:0},h27:{lv:50,exp:0}};S.team=['h03','h22','h27'];
 bt={n:600,round:1,sel:0,log:'',al:S.team.map(id=>fighter(id,50)),en:stageDef(600).map(x=>({...x,base:x.atk,max:x.hp}))};const a=bt.al[0];
 S.ask={h03:{o:[2,1,0],f:[]}};a.cds=[0,0,0];const p1=autoPick(a);a.cds=[0,0,3];const p2=autoPick(a);S.ask.h03.f=[1];const p3=autoPick(a);S.ask={};const p4=autoPick(a);
 out.ask={first:p1,skipCd:p2,skipOff:p3,smartIsNum:typeof p4==='number'};
 // arena storm
 const B={pvp:{name:'x'},round:9,al:[{hp:1000,max:1000}],en:[{hp:1000,max:1000}]};bt=B;const did=pvRound(B);out.storm={did,hp:B.al[0].hp,off:pvRound({pvp:1,round:7,al:[],en:[]})};
 // fuse all: 7 Common copies of one card at 3 each = 2 fusions
 S.gold=50000;S.cards={h11:{lv:1,exp:0},h01:{lv:1,exp:0,cp:7}};const plan=fuAllPlan('C');const res=fuAllDo('C');out.fuse={plan:plan.n,cost:plan.cost,done:res&&res.got.length,left:S.cards.h01.cp,gold:S.gold};
 // PC default: windowed
 try{localStorage.removeItem('pdb_fs')}catch(x){}out.pc={isPC:isPC(),pref:fsPref()};
 // VIP retry switch
 S.vip=0;out.lpr={lockedOff:lprOn(),btn:/🔒/.test(lprBtn())};S.vip=Date.now()+864e5;S.lpr=true;out.lpr.vipOn=lprOn();
 return out});
// renders: card panel with the custom list, and the card fusion screen with Fuse all
await p.evaluate(()=>{S.cards.h03={lv:50,exp:0};S.ask={h03:{o:[3,2,1,0],f:[1]}};askOpen('h03')});await p.waitForTimeout(300);
const zp=await p.evaluate(()=>({rows:document.querySelectorAll('#ov .askr').length,off:document.querySelectorAll('#ov .askr.off').length}));
await p.click('#ov [data-ask="dn"][data-k="3"]');await p.waitForTimeout(200);const ord=await p.evaluate(()=>S.ask.h03.o.join(''));
await p.click('#ov [data-ask="smart"]');await p.waitForTimeout(200);const reset=await p.evaluate(()=>!S.ask.h03);
await p.evaluate(()=>{ov('');askId=null;S.gold=50000;S.cards.h01={lv:1,exp:0,cp:6};fuTab='c';fuTo='UC';fuse()});await p.waitForTimeout(300);
const fb=await p.evaluate(()=>{const x=document.querySelector('[data-act=fuall]');return x&&x.textContent.trim()});
console.log(JSON.stringify({...r,panel:zp,orderAfterDown:ord,reset,fuseAllBtn:fb},null,1),'errors',e.length,e.slice(0,3).join('|'));await b.close()})()
