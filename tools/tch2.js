const {chromium}=require('playwright');(async()=>{const b=await chromium.launch({executablePath:'/opt/pw-browsers/chromium'});const e=[];const w=n=>new Promise(r=>setTimeout(r,n));
const p=await b.newPage({viewport:{width:900,height:420},deviceScaleFactor:2});p.on('pageerror',x=>e.push(x.message));
await p.goto('file:///home/claude/pixeldeck/_t.html');await w(900);
const L=process.argv[2]?process.argv[2].split(','):['503','615','730','846','958','1070','600','700','800','900','1000','1100','45'];
for(const n of L){await p.evaluate(n=>{bt=null;loop=0;ov('');USER={guest:true,name:'G'};S=unlock(fresh());S.me={name:'G'};S.gift=true;S.n160=S.n165=S.n167=1;S.tut=null;['h03','h22','h27'].forEach(id=>S.cards[id]={lv:220,exp:0,star:5});S.team=['h03','h22','h27'];S.cleared=1100;S.auto=false;startBattle(+n)},n);
 await w(2600);await p.screenshot({path:`sh173/st_${n}.png`})}
await p.evaluate(()=>{bt=null;ov('');prepN=846;prep()});await w(700);await p.screenshot({path:'sh173/prep846.png'});
console.log(e);await b.close()})()
