const {chromium}=require('playwright');(async()=>{const b=await chromium.launch({executablePath:'/opt/pw-browsers/chromium'});const e=[];const w=n=>new Promise(r=>setTimeout(r,n));
const p=await b.newPage({viewport:{width:900,height:420},deviceScaleFactor:2});p.on('pageerror',x=>e.push(x.message));
await p.goto('file:///home/claude/pixeldeck/_t.html');await w(900);
await p.evaluate(()=>{USER={guest:true,name:'G'};S=unlock(fresh());S.me={name:'G'};S.gift=true;S.n160=S.n165=S.n167=1;S.tut=null;['h03','h22','h27'].forEach(id=>S.cards[id]={lv:250,exp:0,star:10});S.team=['h03','h22','h27'];S.cleared=700;S.auto=false;S.gold=1e6;S.rs=50;startBattle(657)});
await w(3000);
// play manually: use skill 4 whenever possible
for(let t=0;t<40;t++){const st=await p.evaluate(()=>{if(!bt)return 'end';if(busy)return 'busy';const a=actor();if(!a)return 'noact';const k=a.sk4&&!a.cds[3]?3:0;bt.sel=k;act(autoT());return k+' '+a.id});if(st==='end')break;if(st.startsWith('3'))console.log('used s4',st);if(t===4)await p.screenshot({path:'sh173/s4_bar.png'});await w(1800)}
console.log(await p.evaluate(()=>!bt?'finished':'round '+bt.round));
await p.evaluate(()=>{bt=null;ov('');zoom('h03')});await w(600);await p.evaluate(()=>{const b=document.querySelector('.stbox');b&&b.scrollIntoView({block:'center'})});await w(300);await p.screenshot({path:'sh173/s4_zoom.png'});
await p.evaluate(()=>{const c=document.querySelector('[data-s4up]');c&&c.click()});await w(300);console.log(await p.evaluate(()=>JSON.stringify({s4:S.cards.h03.s4,rs:S.rs})));
await p.evaluate(()=>{$('zoom').hidden=true;S.auto=true;startBattle(1000)});await w(60000);console.log(await p.evaluate(()=>bt?'still round '+bt.round:'auto finished, cleared '+S.cleared));
console.log(e);await b.close()})()
