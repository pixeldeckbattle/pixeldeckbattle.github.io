const {chromium}=require('playwright');(async()=>{const b=await chromium.launch({executablePath:'/opt/pw-browsers/chromium'});const e=[];const w=n=>new Promise(r=>setTimeout(r,n));
for(const [vw,vh,tag] of [[900,420,'w'],[390,780,'m']]){const p=await b.newPage({viewport:{width:vw,height:vh},deviceScaleFactor:2});p.on('pageerror',x=>e.push(x.message));
await p.goto('file:///home/claude/pixeldeck/_t.html');await w(900);
await p.evaluate(()=>{USER={guest:true,name:'G'};S=unlock(fresh());S.me={name:'G'};S.gift=true;S.n160=S.n165=S.n167=1;S.tut=null;['h22','h27','h07'].forEach(id=>S.cards[id]={lv:190,exp:0});S.team=['h22','h27','h07'];S.cleared=60;S.gold=48210;S.auto=true;startBattle(40)});
await w(2500);
await p.evaluate(()=>{const ids=Object.keys(C);const pick=r=>ids.filter(i=>C[i].r===r);const ak=Object.keys(AM);const pa=r=>ak.filter(k=>AM[k].r===r);
 fs={t0:Date.now()-37*6e4,w:42,l:3,g:12840,am:{},cards:{},up:5};
 [pa('R')[0],pa('R')[1],pa('R')[2],pa('L')[0],pa('L')[1]].filter(Boolean).forEach((k,i)=>fs.am[k]=[4,2,3,1,1][i]);
 [pick('C')[0],pick('C')[1],pick('UC')[0],pick('R')[0],pick('L')[0]].filter(Boolean).forEach((k,i)=>fs.cards[k]=[3,1,2,1,1][i]);
 fsPanel(true)});
await w(800);await p.screenshot({path:`sh170/fsui_${tag}.png`});
await p.evaluate(()=>{$('fsb').hidden=true;bt=null;loop=0;home()});await w(700);await p.evaluate(()=>{ov('');$('fsb').hidden=true;const ak=Object.keys(AM);afkShow(5320,{am:{[ak[0]]:3,dragon:1,kfang:1},cards:[{id:Object.keys(C).find(i=>C[i].r==='UC')},{id:Object.keys(C).find(i=>C[i].r==='R')}]})});
await w(800);await p.screenshot({path:`sh170/afkui_${tag}.png`});await p.close()}
console.log(e);await b.close()})()
