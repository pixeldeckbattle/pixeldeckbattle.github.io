const {chromium}=require('playwright');(async()=>{const b=await chromium.launch({executablePath:'/opt/pw-browsers/chromium'});const e=[];const w=n=>new Promise(r=>setTimeout(r,n));
const p=await b.newPage({viewport:{width:1100,height:420},deviceScaleFactor:2});p.on('pageerror',x=>e.push(x.message));
await p.goto('file:///home/claude/pixeldeck/_t.html');await w(900);
await p.evaluate(()=>{USER={guest:true,name:'G'};S=unlock(fresh());S.me={name:'G'};S.gift=true;S.tut=null;
 S.cards={h15:{lv:90,exp:0,star:5},h13:{lv:90,exp:0,star:6},h03:{lv:220,exp:0,star:8},h22:{lv:220,exp:0,star:9},h27:{lv:220,exp:0,star:10}};
 view(`<div style="display:flex;gap:24px;padding:30px;background:#0f172b;height:100%">${['h15','h13','h03','h22','h27'].map(id=>`<div style="width:180px">${full(id)}</div>`).join('')}</div>`)});
await w(1200);await p.screenshot({path:'sh173/stb.png'});
await p.evaluate(()=>{S.team=['h03','h22','h27'];['h03','h22','h27'].forEach(i=>S.cards[i].star=10);S.cleared=700;S.auto=false;startBattle(651)});await w(3500);await p.screenshot({path:'sh173/stb_bar.png'});
await p.evaluate(()=>{bt=null;ov('');view('<div></div>');zoom('h27')});await w(700);await p.screenshot({path:'sh173/stb_zoom.png'});
console.log(e);await b.close()})()
