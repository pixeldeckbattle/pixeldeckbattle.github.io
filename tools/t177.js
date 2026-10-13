const {chromium}=require('playwright');const fs=require('fs');(async()=>{const b=await chromium.launch({executablePath:'/opt/pw-browsers/chromium'});const e=[];const w=n=>new Promise(r=>setTimeout(r,n));
const mock=fs.readFileSync('fbmock.js','utf8');const p=await b.newPage({viewport:{width:1000,height:466}});p.on('pageerror',x=>e.push(x.message));
let n=0;await p.route('https://www.gstatic.com/**',r=>r.fulfill({status:200,contentType:'text/javascript',body:n++?'':mock}));
await p.addInitScript(()=>{window.__USER={uid:'me',email:'me@example.com'};const t=new Date();window.__DB={saves:{},config:{main:{}},arena:{},payouts:{},refs:{},online:{},grants:{},market:{},trades:{},
 dmo:{o1:{u:'me',nm:'T',s:'a',p:1900,q:7,t:5,at:t},o2:{u:'me',nm:'T',s:'b',p:1500,q:4,t:5,at:t},o3:{u:'x',nm:'X',s:'a',p:1800,q:9,t:5,at:t}},dmpay:{z_0:{to:'me',o:'z',g:1000,d:0,at:t}},dmt:{},dmc:{}}});
await p.goto('file:///home/claude/pixeldeck/_t.html');await w(1200);
const r=await p.evaluate(async()=>{USER={sub:'me',name:'T'};S=unlock(fresh());Object.assign(S,{me:{name:'T'},gift:true,tut:null,cleared:200,gold:100,dia:5,n176:0,n174:1,n167:1,n165:1,n160:1,bc:[10,20]});save();await fbLoad();
 dmRefundAll();await new Promise(r=>setTimeout(r,800));const a={gold:S.gold,dia:S.dia,left:Object.keys(window.__DB.dmo),pays:Object.keys(window.__DB.dmpay).length};
 dmRefundAll();await new Promise(r=>setTimeout(r,300));a.again={gold:S.gold,dia:S.dia};
 mkTab='dm';market();a.tab=mkTab;a.dmBtn=!!document.querySelector('[data-t=dm]');a.pop=news176();return a});
console.log(JSON.stringify(r),'errors',e.length,e.slice(0,3).join('|'));await b.close()})()
