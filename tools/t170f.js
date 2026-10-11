const {chromium}=require('playwright');(async()=>{const b=await chromium.launch({executablePath:'/opt/pw-browsers/chromium'});const p=await b.newPage({viewport:{width:900,height:420},deviceScaleFactor:2,hasTouch:true});const e=[];p.on('pageerror',x=>e.push(x.message));const w=n=>new Promise(r=>setTimeout(r,n));const D=process.argv[2]||'.';
await p.goto('file:///home/claude/pixeldeck/_t.html');await w(900);
await p.evaluate(()=>{USER={guest:true,name:'G'};S=unlock(fresh());S.me={name:'G'};S.gift=true;S.n160=S.n165=S.n167=1;S.cards={h06:{lv:1,exp:0,am:'tiger'},h01:{lv:1,exp:0}};S.team=['h06'];S.cleared=30;S.bc=[10,20];S.gold=200000;S.dia=0;
 S.am={tiger:106,turtle:98,rock:97,dagger:113,hawk:99,dragon:32,feather:29,ruby:26,clover:1};S.lk={rock:1};home()});await w(700);await p.screenshot({path:D+'/f_home.png'});
const c=s=>p.evaluate(s=>{const t=document.querySelector(s);if(!t)throw new Error('no '+s);t.click()},s);const st=()=>p.evaluate(()=>JSON.stringify([S.gold,S.am,afSum(),afTimes()]));
await c('[data-act=fusehub]');await w(300);console.log('tab',await p.evaluate(()=>[fuTab,fuFrom,document.querySelector('h2').innerText]));
await c('[data-act=futab][data-t=a]');await w(300);await p.screenshot({path:D+'/f_am0.png'});
// worn tiger: spare 105; rock locked -> 0
await c('[data-act=afall]');await w(200);console.log('all',await st());await p.screenshot({path:D+'/f_am1.png'});
await c('[data-act=afgo]');await w(100);console.log('armed',await p.evaluate(()=>afArm));await c('[data-act=afgo]');await w(400);console.log('R->L',await st());await p.screenshot({path:D+'/f_am2.png'});
// L -> SL
await c('[data-act=afrank][data-r=L]');await w(200);await c('[data-act=afall]');await w(200);console.log('L no target',await p.evaluate(()=>[afSum(),afTimes(),document.querySelector('[data-act=afgo]').disabled]));
await c('[data-act=afto][data-k=deye]');await w(200);await p.screenshot({path:D+'/f_am3.png'});await c('[data-act=afgo]');await c('[data-act=afgo]');await w(400);console.log('L->SL',await st());await p.screenshot({path:D+'/f_am4.png'});
// steps and clamps
await c('[data-act=afrank][data-r=R]');await w(100);for(let i=0;i<3;i++)await c('[data-act=afadd][data-k=turtle][data-n="10"]');console.log('hawk pick',await p.evaluate(()=>[afPick.turtle,afMax('turtle'),afSum(),afTimes()]));
await c('[data-act=afadd][data-k=turtle][data-n="-10"]').catch(x=>console.log('minus-disabled-ok'));console.log('minus',await p.evaluate(()=>afPick.turtle));
// poor
await p.evaluate(()=>{S.gold=500;fuseAm()});console.log('poor',await p.evaluate(()=>[afTimes(),document.querySelector('[data-act=afgo]').disabled]));
// tampering: pick more than spare, wrong target
console.log('tamper',await p.evaluate(()=>{S.gold=1e6;afR='R';afPick={turtle:99999,rock:50};const a=afSum();afR='L';afPick={dragon:999,ruby:999,feather:999};afTo='tiger';const r=afDo();return [a,r]}));
// equip SL + stats, drops never SL
console.log('equip',await p.evaluate(()=>{S.cards.h01.am='deye';const before=S.am.deye;const o={};for(let i=0;i<20000;i++){const k=amRoll();o[AM[k].r]=(o[AM[k].r]||0)+1}return [JSON.stringify(o),mkHave('deye'),mkHave('clover')]}));
await p.evaluate(()=>{collTab='am';coll()});await w(400);await p.screenshot({path:D+'/f_coll.png'});
await p.evaluate(()=>{fuFrom='home';fuTab='c';fuse()});await w(300);await p.screenshot({path:D+'/f_card.png'});await c('.rail [data-act=home]');await w(300);console.log('back',await p.evaluate(()=>!!document.querySelector('.dock')));
await p.setViewportSize({width:740,height:340});await p.evaluate(()=>{fit();home()});await w(500);await p.screenshot({path:D+'/f_home_s.png'});await p.evaluate(()=>{fuTab='a';afR='L';fuse()});await w(400);await p.screenshot({path:D+'/f_am_s.png'});
await p.evaluate(()=>{S.lang='en';fuse()});await w(300);await p.screenshot({path:D+'/f_am_en.png'});
console.log(e);await b.close()})()
