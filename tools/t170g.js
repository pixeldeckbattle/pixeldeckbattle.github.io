const {chromium}=require('playwright');(async()=>{const b=await chromium.launch({executablePath:'/opt/pw-browsers/chromium'});const p=await b.newPage({viewport:{width:900,height:420},deviceScaleFactor:2,hasTouch:true});const e=[];p.on('pageerror',x=>e.push(x.message));const w=n=>new Promise(r=>setTimeout(r,n));const D=process.argv[2]||'.';
await p.goto('file:///home/claude/pixeldeck/_t.html');await w(900);
await p.evaluate(()=>{USER={guest:true,name:'G'};S=unlock(fresh());S.me={name:'G'};S.gift=true;S.n160=S.n165=S.n167=1;const cs=Object.keys(C);const pick=r=>cs.filter(k=>C[k].r===r);
 S.cards={h06:{lv:1,exp:0,am:'tiger'}};[['C',5],['UC',3],['R',9],['L',2]].forEach(([r,cp])=>pick(r).slice(0,2).forEach((k,i)=>S.cards[k]={lv:1,exp:0,cp:i?1:cp}));S.team=['h06'];S.cleared=30;S.bc=[10,20];S.gold=400000;S.dia=0;
 S.am={tiger:106,turtle:98,rock:97,dagger:113,hawk:99,dragon:32,feather:29,ruby:26,clover:1};S.lk={rock:1};home()});await w(500);
const c=s=>p.evaluate(s=>{const t=document.querySelector(s);if(!t)throw new Error('no '+s);if(t.disabled)throw new Error('disabled '+s);t.click()},s);const st=()=>p.evaluate(()=>JSON.stringify([S.gold,S.am,S.afp||0,afGot&&[afGot.ok,afGot.bad]]));
await c('[data-act=fusehub]');await w(300);await p.screenshot({path:D+'/g_hub_c.png'});console.log('hub',await p.evaluate(()=>[...document.querySelectorAll('.futile')].map(t=>t.dataset.r+':'+t.querySelector('em').innerText)));
await c('[data-act=futo][data-r=L]');await w(300);await p.screenshot({path:D+'/g_card_L.png'});console.log('card L list',await p.evaluate(()=>[...document.querySelectorAll('.fupick')].map(t=>C[t.dataset.k].r+t.innerText.trim())));
await c('.fupick');await w(200);const g0=await p.evaluate(()=>S.gold);await c('[data-act=fugo]');await w(300);console.log('card fused',await p.evaluate(g0=>[g0-S.gold,fuGot&&C[fuGot.id].r],g0));await p.screenshot({path:D+'/g_card_done.png'});
await c('[data-act=fuback]');await w(200);await c('[data-act=futab][data-t=a]');await w(300);await p.screenshot({path:D+'/g_hub_a.png'});console.log('hub a',await p.evaluate(()=>[...document.querySelectorAll('.futile')].map(t=>t.innerText.replace(/\n/g,' | '))));
await c('[data-act=futo][data-r=L]');await w(200);await c('[data-act=afall]');await c('[data-act=afgo]');await c('[data-act=afgo]');await w(300);console.log('R->L',await st());
await c('[data-act=fuback]');await c('[data-act=futo][data-r=SL]');await w(200);await p.screenshot({path:D+'/g_sl0.png'});await c('[data-act=afall]');await c('[data-act=afto][data-k=kfang]');await w(200);await p.screenshot({path:D+'/g_sl1.png'});
await c('[data-act=afgo]');await c('[data-act=afgo]');await w(400);console.log('L->SL',await st());await p.screenshot({path:D+'/g_sl2.png'});
// forced break then pity
console.log('break',await p.evaluate(()=>{const R=Math.random;S.gold=1e6;S.am.dragon=200;S.afp=0;fuTo='SL';afTo='deye';afPick={dragon:50};Math.random=()=>.99;const a=afDo();const p1=afP('L');afPick={dragon:50};Math.random=()=>.65;const b2=afDo();const p2=afP('L');Math.random=R;return [a.ok,a.bad,p1,b2.ok,b2.bad,p2,S.am.dragon,S.am.deye]}));
await p.evaluate(()=>{afGot={got:{},ok:0,bad:1,cost:20000};S.afp=2;fuseAm()});await w(200);await p.screenshot({path:D+'/g_sl_bad.png'});
// success rate over many
console.log('rate',await p.evaluate(()=>{let ok=0,n=0;for(let i=0;i<4000;i++){S.gold=1e7;S.am.dragon=50;S.afp=0;afPick={dragon:50};const g=afDo();ok+=g.ok;n++}return ok/n}));
console.log('stale target',await p.evaluate(()=>{fuTab='c';fuTo='ST';fuse();return [fuTo,!!document.querySelector('.futiles')]}));
await p.setViewportSize({width:740,height:340});await p.evaluate(()=>{fit();fuTab='c';fuTo=null;fuse()});await w(400);await p.screenshot({path:D+'/g_hub_s.png'});await p.evaluate(()=>{S.lang='en';fuTab='a';fuTo='SL';afGot=null;fuse()});await w(300);await p.screenshot({path:D+'/g_sl_en_s.png'});
console.log(e);await b.close()})()
