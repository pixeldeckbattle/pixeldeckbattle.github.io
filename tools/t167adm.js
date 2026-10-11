const {chromium}=require('playwright');const fs=require('fs');(async()=>{const b=await chromium.launch({executablePath:'/opt/pw-browsers/chromium'});const p=await b.newPage({viewport:{width:412,height:900},deviceScaleFactor:2});const e=[];p.on('pageerror',x=>e.push(x.message));p.on('dialog',d=>d.accept());const w=n=>new Promise(r=>setTimeout(r,n));
const mock=fs.readFileSync('fbmock.js','utf8');let n=0;await p.route('https://www.gstatic.com/**',r=>r.fulfill({status:200,contentType:'text/javascript',body:n++?'':mock}));
await p.addInitScript(()=>{const t=Date.now(),sv={};const mk=(id,name,o)=>{const s=Object.assign({me:{name},gold:500,dia:0,cleared:5,cards:{h06:{lv:5,exp:0}},team:['h06'],ts:t},o);sv[id]={data:JSON.stringify(s),ts:t,name,cleared:s.cleared,at:t}};
 mk('A','Kanit',{cleared:60,tw:{w:2962,f:41},sh:['T1.1','P3.1'],mail:[{id:'x'}]});mk('B','BBIG',{cleared:45});
 const W=Math.max(2962,Math.floor(((t+7*36e5)/864e5-4)/7));const c={};[['A','Kanit',41,3],['B','BBIG',41,5],['C','Getter',12,1],['D','Cheat',999,1],['E','Zed',7,9]].forEach(([u,nm,f,h])=>c[u]={name:nm,look:'h06',f,at:new Date(t-h*36e5)});
 window.__DB={saves:sv,slips:{},grants:{},online:{},config:{main:{bans:{C:{r:'x'}}}},adminlog:{},refs:{},['tower/'+W+'/s']:c}});
await p.goto('file:///home/claude/pixeldeck/_adm.html');await w(500);await p.click('#gin');await w(700);await p.click('nav [data-t=pl]');await w(400);
await p.click('#twl');await w(700);await p.screenshot({path:'adm167a.png'});
await p.evaluate(()=>{document.querySelector('[data-twd=D]').click()});await w(600);
console.log(await p.evaluate(()=>[document.querySelector('#twc').innerText.replace(/\n+/g,' | ').slice(0,420),Object.keys(window.__DB[Object.keys(window.__DB).find(k=>k.startsWith('tower'))]).join(','),JSON.stringify(Object.values(window.__DB.adminlog).map(x=>x.act+':'+x.uid))]));
await p.click('#pload');await w(900);await p.evaluate(()=>{document.querySelector('tr.pl[data-id=A]').click()});await w(500);
console.log(await p.evaluate(()=>[...document.querySelectorAll('p.mu')].map(x=>x.innerText).filter(t=>/หอคอย:/.test(t))));
await p.evaluate(()=>{sel=null;pl()});await w(300);await p.click('#tww');await w(300);await p.click('#twl');await w(500);console.log(await p.evaluate(()=>document.querySelector('#twc h3').innerText),e);await b.close()})()
