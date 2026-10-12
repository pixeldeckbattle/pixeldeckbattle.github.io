const {chromium}=require('playwright');(async()=>{const b=await chromium.launch({executablePath:'/opt/pw-browsers/chromium'});const p=await b.newPage({viewport:{width:900,height:420},deviceScaleFactor:2});const e=[];p.on('pageerror',x=>e.push(x.message));const w=n=>new Promise(r=>setTimeout(r,n));
await p.goto('file:///home/claude/pixeldeck/_t.html');await w(900);
await p.evaluate(()=>{USER={guest:true,name:'G'};S=unlock(fresh());S.me={name:'G'};S.gift=true;S.n160=S.n165=S.n167=1;S.tut=null;['h22','h27','h07'].forEach(id=>S.cards[id]={lv:190,exp:0});S.team=['h22','h27','h07'];S.cleared=60;S.bc=[10,20];S.gold=1000;S.spd=2;
 S.auto=true;startBattle(40)});
await w(12000);await p.evaluate(()=>{const x=document.querySelector('[data-act=lprep]');if(x)x.click()});
await w(45000);
console.log('live',await p.evaluate(()=>[loop,fs&&[fs.w,fs.l,fs.g,Object.keys(fs.am).length,Object.keys(fs.cards).length],!!document.querySelector('.fsch'),document.querySelector('.fsch')&&document.querySelector('.fsch').innerText]));
await p.evaluate(()=>{const c=document.querySelector('[data-act=fsview]');if(c)c.click()});await w(400);await p.screenshot({path:'sh170/fs_live.png'});
await p.evaluate(()=>{const c=document.querySelector('[data-fs=close]');if(c)c.click();const s=document.querySelector('[data-act=lpstop]');if(s)s.click();else loopStop()});await w(600);await p.screenshot({path:'sh170/fs_end.png'});
console.log('end',await p.evaluate(()=>[loop,fs,!$('fsb').hidden,$('fsb').innerText.slice(0,200)]));
console.log(e);await b.close()})()
