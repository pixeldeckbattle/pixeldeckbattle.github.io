const {chromium}=require('playwright');const fs=require('fs');(async()=>{const b=await chromium.launch({executablePath:'/opt/pw-browsers/chromium'});const w=n=>new Promise(r=>setTimeout(r,n));const mock=fs.readFileSync('fbmock.js','utf8');const errs=[];
const mk=async(ctx,db)=>{const p=await ctx.newPage();p.on('pageerror',x=>errs.push(x.message));let n=0;await p.route('https://www.gstatic.com/**',r=>r.fulfill({status:200,contentType:'text/javascript',body:n++?'':mock}));
 await p.addInitScript(db=>{window.__USER={uid:'me',email:'me@example.com'};window.__DB=db||{saves:{},slips:{},grants:{},online:{},config:{main:{}},adminlog:{},arena:{},market:{},payouts:{},refs:{}}},db);return p};
const URL='http://localhost:8765/_t.html';require('child_process').spawn('python3',['-m','http.server','8765','--directory','/home/claude/pixeldeck'],{stdio:'ignore',detached:true}).unref();await w(900);
const base=(o)=>Object.assign({gold:500,dia:0,cleared:5,cards:{h06:{lv:5,exp:0}},team:['h06'],auto:false,era:1,gift:true,n160:1,n165:1,me:{name:'T',look:'h06'}},o);
const sess=JSON.stringify({sub:'me',name:'T',email:'me@example.com'});
// 1) old-build tab overwrote the main key (no rv) after this build had saved: backup wins
{const ctx=await b.newContext();const p=await mk(ctx);await p.goto(URL);await w(300);
 await p.evaluate(([s,g,st])=>{localStorage.setItem('pdb_session',s);const k='pdb_save4_me';localStorage.setItem(k,JSON.stringify(st));localStorage.setItem(k+'_bk',JSON.stringify(g));localStorage.setItem(k+'_rv',g.rv)},[sess,base({cleared:260,rv:1791730050,ts:Date.now()-60000,cards:{h06:{lv:5,exp:0},h03:{lv:90,exp:0},h22:{lv:90,exp:0}}}),base({cleared:200,ts:Date.now()})]);
 await p.reload();await w(1800);console.log('1 backup wins:',await p.evaluate(()=>[S.cleared,Object.keys(S.cards).length,S.rv>1791730050-1,window.__DB.saves.me&&JSON.parse(window.__DB.saves.me.data).cleared]));await ctx.close()}
// 2) two tabs of this build: the one left behind may not save
{const ctx=await b.newContext();const A=await mk(ctx);await A.goto(URL);await w(300);await A.evaluate(([s,g])=>{localStorage.setItem('pdb_session',s);localStorage.setItem('pdb_save4_me',JSON.stringify(g))},[sess,base({cleared:50,ts:Date.now()-5000})]);
 await A.reload();await w(1500);const B=await mk(ctx);await B.goto(URL);await w(1500);
 await A.evaluate(()=>{S.cleared=77;S.gold+=1000;save();save()});await w(400);
 const r=await B.evaluate(()=>{const was=stale;S.gold=1;save();return[was,stale,!!document.getElementById('stale'),JSON.parse(localStorage.getItem('pdb_save4_me')).cleared,JSON.parse(localStorage.getItem('pdb_save4_me')).gold]});console.log('2 stale tab [stoppedByEvent,stale,overlay,storedCleared,storedGold]:',r);
 await B.evaluate(()=>document.querySelector('#stale button').click());await w(1500);console.log('2 after reload:',await B.evaluate(()=>[S.cleared,S.gold,stale]));await ctx.close()}
// 3) cloud copies
const cloud=async(local,doc,label)=>{const ctx=await b.newContext();const db={saves:{me:doc},slips:{},grants:{},online:{},config:{main:{}},adminlog:{},arena:{},market:{},payouts:{},refs:{}};const p=await mk(ctx,db);await p.goto(URL);await w(300);
 await p.evaluate(([s,g])=>{localStorage.setItem('pdb_session',s);if(g)localStorage.setItem('pdb_save4_me',JSON.stringify(g))},[sess,local]);await p.reload();await w(1900);
 console.log(label,await p.evaluate(()=>[S.cleared,JSON.parse(window.__DB.saves.me.data).cleared,stale]));return[p,ctx]};
const doc=o=>({data:JSON.stringify(o),ts:o.ts,name:'T',cleared:o.cleared});const now=Date.now();
{const [p,c]=await cloud(base({cleared:260,ts:now-600000,lg:{b:1,i:{},o:{},c:{stage:900}}}),doc(base({cleared:200,ts:now,lg:{b:1,i:{},o:{},c:{stage:500}}})),'3a old-build cloud, later but less play -> keep 260, push:');await c.close()}
{const [p,c]=await cloud(base({cleared:100,ts:now-600000,lg:{b:1,i:{},o:{},c:{stage:300}}}),doc(base({cleared:140,ts:now,lg:{b:1,i:{},o:{},c:{stage:500}}})),'3b old-build cloud, later and more play -> take 140:');await c.close()}
{const [p,c]=await cloud(null,doc(base({cleared:140,ts:now-9e6})),'3c fresh device, old-build cloud -> take 140:');await c.close()}
{const [p,c]=await cloud(base({cleared:100,ts:now,rv:500}),doc(base({cleared:150,ts:now-9e6,rv:900})),'3d cloud counter ahead -> take 150:');await c.close()}
{const [p,c]=await cloud(base({cleared:100,ts:now-9e6,rv:900}),doc(base({cleared:60,ts:now,rv:500})),'3e cloud counter behind -> keep 100, push:');await c.close()}
// 4) left-behind copy on another device tries to flush over a newer cloud copy
{const [p,c]=await cloud(base({cleared:100,ts:now,rv:900}),doc(base({cleared:100,ts:now,rv:900})),'4 start equal:');
 await p.evaluate(()=>{window.__DB.saves.me.data=JSON.stringify(Object.assign(JSON.parse(window.__DB.saves.me.data),{cleared:180,rv:2000}));cloudChk=0;S.gold+=5;save();cloudFlush()});await w(600);
 console.log('4 after flush [localCleared,cloudCleared,stale,overlay]:',await p.evaluate(()=>[S.cleared,JSON.parse(window.__DB.saves.me.data).cleared,stale,!!document.getElementById('stale')]));await c.close()}
// 5) reset and normal play still save
{const [p,c]=await cloud(base({cleared:100,ts:now,rv:900}),doc(base({cleared:100,ts:now,rv:900})),'5 start:');
 console.log('5 reset/saves:',await p.evaluate(()=>{const r0=S.rv;S.gold+=1;save();const r1=S.rv;armed=true;const t=document.createElement('button');t.dataset.act='reset';document.getElementById('view').append(t);t.click();return[r1-r0,S.cleared,S.rv>r1,stale,JSON.parse(localStorage.getItem('pdb_save4_me')).cleared]}));await c.close()}
console.log('errs',errs);await b.close();process.exit(0)})()
