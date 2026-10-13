const {chromium}=require('playwright');(async()=>{const b=await chromium.launch({executablePath:'/opt/pw-browsers/chromium'});const p=await b.newPage({viewport:{width:780,height:360},deviceScaleFactor:2});const e=[];p.on('pageerror',x=>e.push(x.message));
await p.goto('file:///home/claude/pixeldeck/_t.html');await p.waitForTimeout(800);
await p.evaluate(()=>{USER={name:'g'};S=unlock(fresh());S.me={name:'Toey'};S.spd=3;welcome()});await p.waitForTimeout(500);
await p.evaluate(()=>document.querySelector('[data-act=claim]').click());await p.waitForTimeout(700);
const st=async(tag)=>{const r=await p.evaluate(()=>{const o=document.getElementById('tut'),h=o.querySelector('.th'),t=o.querySelector('.tb');if(!h)return {tut:S.tut,none:1};const a=h.getBoundingClientRect(),c=t.getBoundingClientRect();return {tut:S.tut,scr:tutScr(),hole:[a.x,a.y,a.width,a.height].map(Math.round),bub:[c.x,c.y,c.width,c.height].map(Math.round),inside:c.x>=0&&c.y>=0&&c.right<=innerWidth&&c.bottom<=innerHeight,txt:t.innerText.slice(0,40).replace(/\n/g,' ')}});console.log(tag,JSON.stringify(r));await p.screenshot({path:'tut_'+tag+'.png'})};
const nx=()=>p.evaluate(()=>document.querySelector('#tut [data-t=n]').click());
await st('0');await nx();await p.waitForTimeout(450);await st('1');
await p.click('.play');await p.waitForTimeout(700);await st('2');await nx();await p.waitForTimeout(450);await st('3');
await p.click('[data-act=start]');await p.waitForTimeout(2500);await st('4');await nx();await p.waitForTimeout(450);await st('5');await nx();await p.waitForTimeout(450);await st('6');
for(let i=0;i<40;i++){const ok=await p.evaluate(()=>{const t=document.querySelector('.fig[data-act=tgt]:not([disabled])');if(t){t.click();return 1}return 0});if(ok)break;await p.waitForTimeout(300)}
await p.waitForTimeout(600);await st('7');await nx();
await p.evaluate(()=>{const a=document.querySelector('[data-act=auto]');if(a&&!a.classList.contains('on'))a.click()});
for(let i=0;i<120;i++){if(await p.evaluate(()=>!!document.querySelector('.rail [data-act=go]')))break;await p.waitForTimeout(500)}
await p.waitForTimeout(500);await st('8');await nx();await p.waitForTimeout(450);await st('9');
await p.click('.rail [data-act=home]');await p.waitForTimeout(700);await st('10');await nx();await p.waitForTimeout(450);await st('11');await nx();await p.waitForTimeout(450);await st('12');await nx();await p.waitForTimeout(450);await st('end');
// portrait
await p.setViewportSize({width:360,height:780});await p.evaluate(()=>{S.tut=1;fit();home()});await p.waitForTimeout(700);
console.log('portrait',await p.evaluate(()=>{const h=document.querySelector('#tut .th').getBoundingClientRect(),t=document.querySelector('.play').getBoundingClientRect();return [h.x,h.y,h.width,h.height,t.x,t.y,t.width,t.height].map(Math.round).join(',')}));await p.screenshot({path:'tut_port.png'});
console.log('errs',e);await b.close()})()
