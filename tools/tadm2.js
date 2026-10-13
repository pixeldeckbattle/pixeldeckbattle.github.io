const {chromium}=require('playwright');const fs=require('fs');(async()=>{const b=await chromium.launch({executablePath:'/opt/pw-browsers/chromium'});const p=await b.newPage({viewport:{width:412,height:900},deviceScaleFactor:2});const e=[];p.on('pageerror',x=>e.push(x.message));const w=n=>new Promise(r=>setTimeout(r,n));
const mock=fs.readFileSync('fbmock.js','utf8');let n=0;await p.route('https://www.gstatic.com/**',r=>r.fulfill({status:200,contentType:'text/javascript',body:n++?'':mock}));
await p.addInitScript(()=>{const t=Date.now(),D=864e5,sv={};const mk=(id,name,o,ago)=>{const s=Object.assign({me:{name},gold:500,dia:0,cleared:5,cards:{h06:{lv:5,exp:0}},team:['h06'],ts:t-ago*D},o);sv[id]={data:JSON.stringify(s),ts:t,name,cleared:s.cleared,at:new Date(t-ago*D)}};
 mk('A','Tanam',{gold:957094,dia:330,cleared:566,pay:[{d:330}],lg:{t0:t-6*D,g0:0,i:{stage:5e6,afk:1e6},o:{fuse:4e6,star:1.5e6},c:{}},ld:{t0:t-2*D,d0:0,b:330,i:{topup:330,daily:40,vip:16},o:{vipbuy:56},c:{}}},0);
 mk('B','Attackel2',{gold:741498,dia:120,cleared:582,lg:{t0:t-6*D,g0:0,i:{stage:4e6},o:{fuse:3.2e6},c:{}},ld:{t0:t-2*D,d0:0,b:120,i:{daily:60,lord:100},o:{pro:40},c:{}}},1);
 for(let i=0;i<10;i++)mk('P'+i,'P'+i,{gold:3000+i*900,dia:i*4,cleared:20+i*5},i%5);
 window.__DB={saves:sv,slips:{},grants:{},online:{},config:{main:{}},adminlog:{},refs:{}}});
await p.goto('file:///home/claude/pixeldeck/_adm.html');await w(500);await p.click('#gin');await w(700);await p.click('nav [data-t=fi]');await w(600);
await p.click('[data-a=ecold]');await w(900);
const t=await p.evaluate(()=>document.querySelector('.card').innerText);console.log(t.slice(t.indexOf('สถานะ Gold')-10,t.indexOf('สถานะ Gold')+1500));
await p.screenshot({path:'/tmp/claude-0/-home-claude/aa9c0295-536e-5154-97c3-794b140463f1/scratchpad/adm_dia.png',fullPage:true});
console.log('errors',e);await b.close()})()
