const {chromium}=require('playwright');const fs=require('fs');(async()=>{const b=await chromium.launch({executablePath:'/opt/pw-browsers/chromium'});const e=[];const w=n=>new Promise(r=>setTimeout(r,n));
const mock=fs.readFileSync('fbmock.js','utf8');const p=await b.newPage({viewport:{width:1000,height:466}});p.on('pageerror',x=>e.push(x.message));
let n=0;await p.route('https://www.gstatic.com/**',r=>r.fulfill({status:200,contentType:'text/javascript',body:n++?'':mock}));
await p.addInitScript(()=>{window.__USER={uid:'me',email:'me@example.com'};const t=new Date();window.__DB={saves:{},config:{main:{}},arena:{},payouts:{},refs:{},online:{},market:{},trades:{},dmo:{},dmpay:{},
 grants:{g1:{to:'me',dia:300,by:'auto',at:t},g2:{to:'me',dia:50,by:'owner',at:t}}}});
await p.goto('file:///home/claude/pixeldeck/_t.html');await w(1200);
const r=await p.evaluate(async()=>{USER={sub:'me',name:'T'};S=unlock(fresh());Object.assign(S,{me:{name:'T'},gift:true,tut:null,cleared:200,gold:500000,dia:1000,n177:1,n176:1,n174:1,n167:1,n165:1,n160:1,bc:[10,20]});save();await fbLoad();
 home();await new Promise(r=>setTimeout(r,900));
 const click=(act,ds)=>{const b=document.createElement('button');b.dataset.act=act;Object.assign(b.dataset,ds||{});(document.getElementById('view')||document.body).appendChild(b);b.click();b.remove()};
 click('exch');click('vipbuy',{i:'0'});S.dl=null;if(typeof dlCan==='function'&&dlCan())click('dlget');
 S.dia+=7;save();   // an untagged change shows up as unk
 return {dia:S.dia,ld:S.ld}});
console.log(JSON.stringify(r),'errors',e.length,e.slice(0,3).join('|'));await b.close()})()
