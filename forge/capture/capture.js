// PixelDeck Studio — capture the real game's screens as editable layers.
// For each screen: a background (everything that is not a layer) and one transparent PNG per element, with its box
// in stage pixels and a description (selector, data-act, text, font) so Claude can map edits back into src/game.src.html.
// Run from the repo root after building _t.html (tools/mkt_page.py):  node forge/capture/capture.js [outDir]
const {chromium}=require('/opt/npm-tools/node_modules/playwright');const fs=require('fs'),path=require('path');
const OUT=process.argv[2]||path.join(__dirname,'../apk/app/src/main/assets/www/screens');
const VW=915,VH=412;   // phone landscape (CSS px)
const SETUP=`S.me={name:'Toey',look:'h06'};S.tut=null;S.gold=125000;S.dia=880;
  S.cards={h03:{lv:60,exp:0},h22:{lv:60,exp:0},h27:{lv:60,exp:0},h10:{lv:40,exp:0},h18:{lv:70,exp:0},h29:{lv:50,exp:0}};S.team=['h03','h22','h27'];`;
const click=a=>`home();(document.querySelector('[data-act=${a}]')||{click(){}}).click()`;
const SCREENS=[
  ['lobby','ล็อบบี้','home()'],
  ['prep','เลือกด่าน + ทีม',click('prep')],
  ['teampop','ตั้งค่าก่อนสู้',click('prep')+`;setTimeout(()=>{const b=[...document.querySelectorAll('[data-act=start]')].filter(x=>x.getBoundingClientRect().width>0).pop();b&&b.click()},300)`],
  ['battle','ฉากต่อสู้',`S.auto=false;S.spd=1;ov&&ov('');startBattle(320);setTimeout(()=>ov(''),3300)`,3600],
  ['result','หน้าชนะ',`S.auto=true;S.spd=4;ov&&ov('');startBattle(12)`,6000],
  ['coll','การ์ดของฉัน',click('coll')],
  ['zoom','ดูการ์ด',`home();zoom('h29')`],
  ['shop','ร้านค้า',click('shop')],
  ['amtab','เครื่องราง',click('amtab')],
  ['fusehub','ฟิวชั่น',click('fusehub')],
  ['pvp','PvP อารีน่า',click('pvp')],
  ['tower','Tower',click('tower')],
  ['quests','ภารกิจ',click('quests')],
  ['afk','ฟาร์มออฟไลน์',click('afk')],
  ['mail','กล่องจดหมาย',click('mail')],
  ['topup','เติมเพชร',click('topup')],
  ['exg','แลกเพชร',click('exg')],
  ['profile','โปรไฟล์',click('profile')],
  ['invite','ชวนเพื่อน',click('invite')],
  ['settings','ตั้งค่า',click('settings')],
  ['guide','วิธีเล่น',click('guide')],
  ['market','ตลาดกลาง',click('market')],
  ['troom','ห้องเทรด',click('troom')],
];
const CSS=`html[data-capmode],html[data-capmode] body{background:transparent!important}
html[data-capmode] *{visibility:hidden!important}
html[data-capmode] [data-cap="k"],html[data-capmode] [data-cap="k"] *{visibility:visible!important}
html[data-capmode] [data-cap="s"]{visibility:visible!important}
html[data-capmode] [data-capon]{visibility:visible!important}
html[data-bgmode] [data-cap="k"]{visibility:hidden!important}
html[data-bgclean] #stage *{visibility:hidden!important}
html[data-bgclean] #stage [data-big]{visibility:visible!important}
html[data-bgmode] [data-cap="s"]{background:none!important;border-color:transparent!important;box-shadow:none!important;outline:none!important}
html[data-bgmode] [data-cap="s"]::before,html[data-bgmode] [data-cap="s"]::after{visibility:hidden!important}
*{animation-play-state:paused!important;transition:none!important;caret-color:transparent!important}`;
// runs in the page: pick the layers
const COLLECT=()=>{const st=document.getElementById('stage')||document.body,SR=st.getBoundingClientRect(),K=SR.width/(st.offsetWidth||SR.width),W=SR.width/K,H=SR.height/K,AREA=W*H;
  const out=[];let n=0,dom=0;
  const alpha=c=>{const m=c.match(/rgba?\(([^)]+)\)/);if(!m)return 0;const p=m[1].split(',');return p.length>3?+p[3]:1};
  const path=el=>{const a=[];for(let e=el;e&&e!==st&&e!==document.body;e=e.parentElement){let s=e.tagName.toLowerCase();if(e.id){a.unshift('#'+e.id);break}const c=[...e.classList].filter(x=>!/^(on|cur|sel)$/.test(x)).slice(0,2);if(c.length)s+='.'+c.join('.');const sib=e.parentElement?[...e.parentElement.children].filter(x=>x.tagName===e.tagName):[];if(sib.length>1)s+=`:nth-of-type(${sib.indexOf(e)+1})`;a.unshift(s)}return a.join(' > ')};
  const url=s=>{const m=s&&s.match(/url\(["']?([^"')]+)["']?\)/);return m?m[1].replace(/^.*?\/pixeldeck\//,''):''};
  const zOf=el=>{let z=0;for(let e=el;e&&e!==st;e=e.parentElement){const cs=getComputedStyle(e);if(cs.position!=='static'&&cs.zIndex!=='auto'){z=+cs.zIndex;}}return z};
  const ownText=el=>[...el.childNodes].some(t=>t.nodeType===3&&t.textContent.trim());
  const blockKids=el=>[...el.children].some(c=>{const cs=getComputedStyle(c);return cs.display!=='inline'||cs.backgroundImage!=='none'||alpha(cs.backgroundColor)>.05});
  const add=(el,kind,r,cs)=>{el.setAttribute('data-cap',kind==='panel'?'s':'k');const t=(el.innerText||'').trim().replace(/\s+/g,' ');
    out.push({i:n++,kind,dom:dom,z:zOf(el),x:(r.left-SR.left)/K,y:(r.top-SR.top)/K,w:r.width/K,h:r.height/K,
      sel:path(el),tag:el.tagName.toLowerCase(),id:el.id||'',cls:[...el.classList].join(' '),act:el.dataset.act||'',key:el.dataset.k||el.dataset.t||el.dataset.id||'',
      text:kind==='panel'?'':t.slice(0,80),font:{size:parseFloat(cs.fontSize),weight:cs.fontWeight,color:cs.color,family:cs.fontFamily.split(',')[0].replace(/["']/g,''),align:cs.textAlign},
      bgImg:url(cs.backgroundImage),src:el.tagName==='IMG'?(el.getAttribute('src')||'').replace(/^.*?\/pixeldeck\//,''):'',radius:cs.borderRadius})};
  const visit=el=>{for(const c of el.children){dom++;const cs=getComputedStyle(c);if(cs.display==='none'||cs.visibility==='hidden'||+cs.opacity===0)continue;
    const r=c.getBoundingClientRect(),w=r.width/K,h=r.height/K;
    const onStage=r.right>SR.left+2&&r.bottom>SR.top+2&&r.left<SR.right-2&&r.top<SR.bottom-2;
    if(!onStage||w<1||h<1){if(cs.overflow==='visible')visit(c);continue}
    const big=w*h>AREA*.8;
    const comp=c.matches('[data-act],button,img,canvas,input,select,textarea,svg,.spr,.fig,.card,.ic,.bar');
    const hasBg=cs.backgroundImage!=='none'||alpha(cs.backgroundColor)>.05||(parseFloat(cs.borderTopWidth)>0&&alpha(cs.borderTopColor)>.05)||cs.boxShadow!=='none';
    if(comp&&!big&&w>=6&&h>=6){add(c,'comp',r,cs);continue}
    if(ownText(c)&&!blockKids(c)&&!big&&w>=6&&h>=6){add(c,'text',r,cs);continue}
    if(big)c.setAttribute('data-big','');
    if((hasBg||ownText(c))&&!big&&w>=6&&h>=2)add(c,'panel',r,cs);
    visit(c)}};
  const o=document.getElementById('ov'),z=document.getElementById('zoom'),zs=z&&getComputedStyle(z),zon=z&&zs.display!=='none'&&zs.visibility!=='hidden'&&z.getBoundingClientRect().width>0&&z.children.length,pop=(st.classList.contains('ovon')&&o&&o.children.length)?o:zon?z:null;visit(pop||st);return{W,H,K,SR:{x:SR.left,y:SR.top},els:out,pop:!!pop}};
(async()=>{fs.mkdirSync(OUT,{recursive:true});
  const b=await chromium.launch({executablePath:'/opt/pw-browsers/chromium'});const index=[];
  for(const [id,name,nav,wait] of SCREENS){
    const p=await b.newPage({viewport:{width:VW,height:VH}});const errs=[];p.on('pageerror',e=>errs.push(e.message));
    await p.goto('file://'+path.resolve('_t.html'));await p.waitForTimeout(1200);
    try{await p.evaluate(SETUP+nav)}catch(e){console.log(id,'nav failed',e.message);await p.close();continue}
    await p.waitForTimeout(wait||900);
    // freeze the game: no more frames or timers, CSS animations paused
    await p.evaluate(()=>{window.requestAnimationFrame=()=>0;const hi=setTimeout(()=>{},0);for(let i=0;i<=hi;i++){clearTimeout(i);clearInterval(i)}});
    await p.addStyleTag({content:CSS});await p.waitForTimeout(150);
    const info=await p.evaluate(COLLECT);const dir=path.join(OUT,id);fs.rmSync(dir,{recursive:true,force:true});fs.mkdirSync(dir,{recursive:true});
    // reference shot (what the screen looks like now) and background (everything that is not a layer)
    const clipAll={x:info.SR.x,y:info.SR.y,width:info.W*info.K,height:info.H*info.K};
    await p.screenshot({path:path.join(dir,'ref.jpg'),clip:clipAll,type:'jpeg',quality:82});
    await p.evaluate(pop=>{document.documentElement.setAttribute('data-bgmode','');if(!pop)document.documentElement.setAttribute('data-bgclean','')},info.pop);
    await p.screenshot({path:path.join(dir,'bg.jpg'),clip:clipAll,type:'jpeg',quality:85});
    await p.evaluate(()=>{document.documentElement.removeAttribute('data-bgmode');document.documentElement.removeAttribute('data-bgclean')});
    const els=[];
    for(const e of info.els){const pad=4,x0=Math.max(0,e.x-pad),y0=Math.max(0,e.y-pad),x1=Math.min(info.W,e.x+e.w+pad),y1=Math.min(info.H,e.y+e.h+pad);if(x1-x0<2||y1-y0<2)continue;
      await p.evaluate(i=>{document.documentElement.setAttribute('data-capmode','');document.querySelectorAll('[data-capon]').forEach(x=>x.removeAttribute('data-capon'));const el=[...document.querySelectorAll('[data-cap]')][i];el.setAttribute('data-capon','')},e.i);
      // only this element (and, for a comp, its children) is visible
      await p.evaluate(i=>{document.querySelectorAll('[data-cap]').forEach((x,j)=>{x.dataset.capk=x.dataset.capk||x.getAttribute('data-cap');x.setAttribute('data-cap',j===i?x.dataset.capk:'off')})},e.i);
      const f=`e${e.i}.png`;await p.screenshot({path:path.join(dir,f),clip:{x:info.SR.x+x0*info.K,y:info.SR.y+y0*info.K,width:(x1-x0)*info.K,height:(y1-y0)*info.K},omitBackground:true});
      els.push({...e,img:f,ix:x0,iy:y0,iw:x1-x0,ih:y1-y0})}
    await p.evaluate(()=>{document.documentElement.removeAttribute('data-capmode');document.querySelectorAll('[data-cap]').forEach(x=>x.setAttribute('data-cap',x.dataset.capk))});
    // paint order: stacking z first, then document order
    els.sort((a,b)=>a.z-b.z||a.dom-b.dom);
    const scr={id,name,w:info.W,h:info.H,bg:'bg.jpg',ref:'ref.jpg',popup:info.pop,els};fs.writeFileSync(path.join(dir,'screen.json'),JSON.stringify(scr));
    index.push({id,name,w:info.W,h:info.H,n:els.length});console.log(id,els.length,'layers',errs.length?'errors: '+errs.slice(0,2).join(' | '):'');await p.close()}
  fs.writeFileSync(path.join(OUT,'index.json'),JSON.stringify(index));await b.close()})();
