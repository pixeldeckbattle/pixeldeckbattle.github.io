const {chromium}=require('playwright');const fs=require('fs');(async()=>{const b=await chromium.launch({executablePath:'/opt/pw-browsers/chromium'});const e=[];const w=n=>new Promise(r=>setTimeout(r,n));const mock=fs.readFileSync('fbmock.js','utf8');
// admin
const p=await b.newPage({viewport:{width:412,height:900},deviceScaleFactor:2});p.on('pageerror',x=>e.push('A:'+x.message));p.on('dialog',d=>d.accept());let n=0;await p.route('https://www.gstatic.com/**',r=>r.fulfill({status:200,contentType:'text/javascript',body:n++?'':mock}));
await p.addInitScript(()=>{const t=Date.now(),sv={};const s={me:{name:'Y3Dz'},gold:500,dia:0,cleared:150,cards:{h06:{lv:5,exp:0},h03:{lv:40,exp:0,star:1}},am:{},team:['h06'],ts:t};sv.P={data:JSON.stringify(s),ts:t,name:'Y3Dz',cleared:150,at:t};
 window.__DB={saves:sv,slips:{},grants:{},online:{},config:{main:{bans:{}}},adminlog:{},refs:{}}});
await p.goto('file:///home/claude/pixeldeck/_adm.html');await w(500);await p.click('#gin');await w(700);await p.click('nav [data-t=pl]');await w(400);await p.click('#pload');await w(900);await p.evaluate(()=>document.querySelector('tr.pl[data-id=P]').click());await w(500);
const info=await p.evaluate(()=>{const ids=[...document.querySelectorAll('.cpc')].map(x=>x.dataset.c);const nm=c=>CARDS[c][0];const pick=(name,lv,st)=>{const c=ids.find(i=>nm(i)===name);document.querySelector(`.cpc[data-c="${c}"]`).checked=true;document.querySelector(`.cpl[data-c="${c}"]`).value=lv;document.querySelector(`.cps[data-c="${c}"]`).value=st;return c};
 const a=pick('Wukong',999,3),z=pick('Zeus',120,0);const ak=[...document.querySelectorAll('.cpa')];ak[0].value=25;ak[1].value=3.7;document.getElementById('cpg').value=50000;document.getElementById('cpn').value='ชดเชยกรณีเซฟถูกทับ';return[ids.length,a,z,ak.length]});
await p.screenshot({path:'cp_admin.png',fullPage:true});await p.click('#cpgo');await w(700);
const comp=await p.evaluate(()=>window.__DB.config.main.comp.P);console.log('admin wrote',info,JSON.stringify(comp).slice(0,330));
console.log('status',await p.evaluate(()=>document.querySelector('.card h3')&&[...document.querySelectorAll('.chip')].map(x=>x.innerText).filter(t=>/รอ|รับ/.test(t)),),await p.evaluate(()=>JSON.stringify(Object.values(window.__DB.adminlog).map(x=>x.t))));
// send again with only an amulet: the first parcel must be replaced, not merged
await p.evaluate(()=>{document.querySelectorAll('.cpa')[2].value=4});await p.click('#cpgo');await w(600);const comp2=await p.evaluate(()=>window.__DB.config.main.comp.P);console.log('resend replaces:',JSON.stringify(comp2.am),comp2.cards.length,comp2.gold);
// game
const g=await b.newPage({viewport:{width:900,height:420},deviceScaleFactor:2});g.on('pageerror',x=>e.push('G:'+x.message));let m=0;await g.route('https://www.gstatic.com/**',r=>r.fulfill({status:200,contentType:'text/javascript',body:m++?'':mock}));
await g.addInitScript(c=>{window.__USER={uid:'P',email:'p@example.com'};window.__DB={saves:{},slips:{},grants:{},online:{},config:{main:{comp:{P:c,other:{id:'zz',gold:9e6}}}},adminlog:{},arena:{},market:{},payouts:{},refs:{}}},comp);
await g.goto('file:///home/claude/pixeldeck/_t.html');await w(1500);
await g.evaluate(async()=>{USER={sub:'P',name:'T'};S=unlock(fresh());S.me={name:'Y3Dz'};S.gift=true;S.tut=null;S.n160=S.n165=1;S.cards={h06:{lv:5,exp:0},h03:{lv:40,exp:0,star:1}};S.team=['h06'];S.cleared=150;S.bc=[10,20];S.gold=500;await fbLoad();await fbUser();CFG=window.__DB.config.main;home()});
await w(1600);await g.screenshot({path:'cp_game.png'});
console.log('game got',await g.evaluate(()=>JSON.stringify({wk:Object.keys(S.cards).filter(i=>['Wukong','Zeus'].includes(C[i].n)).map(i=>[C[i].n,S.cards[i].lv,S.cards[i].star||0,capOf(i)]),am:S.am,gold:S.gold,cpd:S.cpd,lg:S.lg.i,cl:S.cl.src})));
await g.evaluate(()=>{document.querySelector('[data-lp=no]').click();home();home()});await w(900);console.log('again',await g.evaluate(()=>[S.gold,S.cpd.length,!!document.getElementById('ov').innerHTML.trim()]));
console.log('errs',e);await b.close()})()
