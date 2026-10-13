const {chromium}=require('playwright');(async()=>{const b=await chromium.launch({executablePath:'/opt/pw-browsers/chromium'});const p=await b.newPage({viewport:{width:1000,height:466}});const e=[];p.on('pageerror',x=>e.push(x.message));
await p.goto('file:///home/claude/pixeldeck/_t.html');await p.waitForTimeout(800);
for(const lang of ['th','en']){await p.evaluate(l=>{S.me={name:'T',look:'h06'};S.lang=l;home();document.querySelector('[data-act=guide]').click()},lang);await p.waitForTimeout(300);
const tabs=await p.evaluate(()=>[...document.querySelectorAll('.rail [data-act]')].map(x=>x.dataset.act+'|'+(x.dataset.k||x.dataset.t||'')+'|'+x.innerText));
for(let i=0;i<tabs.length;i++){const n0=e.length;const r=await p.evaluate(i=>{const x=[...document.querySelectorAll('.rail [data-act]')][i];if(x.dataset.act==='home')return 'skip';x.click();return document.querySelector('.main').innerText.length},i);await p.waitForTimeout(80);console.log(lang,tabs[i],r,e.slice(n0).join(';'))}}
await b.close()})()
