const {chromium}=require('playwright');(async()=>{const b=await chromium.launch({executablePath:'/opt/pw-browsers/chromium'});const e=[];const w=n=>new Promise(r=>setTimeout(r,n));
for(const [vw,vh] of [[900,420],[390,800]]){const p=await b.newPage({viewport:{width:vw,height:vh},deviceScaleFactor:2});p.on('pageerror',x=>e.push(x.message));
await p.goto('file:///home/claude/pixeldeck/_t.html');await w(900);
await p.evaluate(()=>{USER={guest:true,name:'G'};S=unlock(fresh());S.me={name:'G'};S.gift=true;S.n160=S.n165=S.n167=1;S.tut=null;S.gold=50000;S.ss=4;S.rs=3;
 S.cards={h05:{lv:30,exp:0,star:2,cp:1},h03:{lv:220,exp:0,star:5},h22:{lv:250,exp:0,star:10}};home()});
for(const id of ['h05','h03','h22']){await p.evaluate(id=>zoom(id),id);await w(600);
 await p.evaluate(()=>{const b=document.querySelector('.stbox');b&&b.scrollIntoView({block:'center'})});await w(300);await p.screenshot({path:`sh173/stp_${id}_${vw}.png`})}
await p.close()}
console.log(e);await b.close()})()
