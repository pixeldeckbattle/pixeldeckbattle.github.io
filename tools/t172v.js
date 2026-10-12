const {chromium}=require('playwright');(async()=>{const b=await chromium.launch({executablePath:'/opt/pw-browsers/chromium'});const p=await b.newPage({viewport:{width:900,height:420}});const e=[];p.on('pageerror',x=>e.push(x.message));const w=n=>new Promise(r=>setTimeout(r,n));
await p.goto('file:///home/claude/pixeldeck/_t.html');await w(900);
console.log(await p.evaluate(()=>{USER={guest:true,name:'G'};S=unlock(fresh());S.cleared=300;const o={};
 const run=()=>{let a=0,c=0;for(let i=0;i<100;i++){const g=afkDrops(8*36e5);a+=Object.values(g.am).reduce((x,y)=>x+y,0);c+=g.cards.length}return [a/100,c/100]};
 o.none=run();vipAdd(30,2);o.gift=[run(),vipPaid(),SPD_MAX()];
 S.dia=500;const v=VIPS[1];S.dia-=v[1];vipAdd(v[0],2);S.vpd=S.vip;o.paid=[run(),vipPaid(),SPD_MAX()];
 S.spd=1;const sp=[];for(let i=0;i<4;i++){S.spd=(S.spd||1)>=SPD_MAX()?1:(S.spd||1)+1;sp.push(S.spd)}o.cycle=sp;
 const t=JSON.parse(JSON.stringify(fresh()));t.vip=Date.now()+5*864e5;t.pay=[{d:100}];o.mig=!!unlock(t).vpd;const t2=JSON.parse(JSON.stringify(fresh()));t2.vip=Date.now()+5*864e5;o.mig2=!!unlock(t2).vpd;
 return JSON.stringify(o)}));
// real button
await p.evaluate(()=>{S=unlock(fresh());S.gift=true;S.n160=S.n165=S.n167=1;S.tut=null;S.dia=1000;S.cleared=10;vip()});await w(400);
console.log(await p.evaluate(()=>{const bb=document.querySelector('[data-act=vipbuy]');bb.click();return [vipPaid(),S.vpd===S.vip]}));
console.log(e);await b.close()})()
