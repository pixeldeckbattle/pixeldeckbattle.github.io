// Test of the APK page (forge/apk/app/src/main/assets/www/index.html) with a fake Android bridge.
// Run: node forge/build_assets.js && node forge/test_forge.js <folder of test part PNGs>
const {chromium}=require('/opt/npm-tools/node_modules/playwright');const fs=require('fs'),path=require('path');
const page=path.join(__dirname,'apk/app/src/main/assets/www/index.html'),PARTS=process.argv[2],OUT=process.argv[3]||__dirname;
const bridge=()=>{window.__saved=[];window.__copied=[];let n=0;const open={};
  window.Android={begin:(name,mime)=>{const id=String(++n);open[id]={name,mime,len:0,parts:[]};return id},chunk:(id,b)=>{open[id].parts.push(b);open[id].len+=atob(b).length;return true},
    end:id=>{const o=open[id];window.__saved.push({name:o.name,mime:o.mime,len:o.len,b64:o.parts});return o.name},share:()=>{},copy:t=>{window.__copied.push(t);return true}}};
(async()=>{
  const b=await chromium.launch({executablePath:'/opt/pw-browsers/chromium'}).catch(()=>chromium.launch());
  const ctx=await b.newContext({viewport:{width:1200,height:900}});await ctx.addInitScript(bridge);
  const p=await ctx.newPage();const errs=[];p.on('pageerror',e=>errs.push(e.message));p.on('console',m=>{if(m.type()==='error')errs.push(m.text())});
  await p.goto('file://'+page);await p.waitForFunction(()=>window.forgeReady);
  const out={};
  out.prompts=await p.$$eval('#gList .pc',e=>e.length);
  await p.click('#gList .pc button');out.copied=await p.evaluate(()=>window.__copied[0].slice(0,60));
  out.promptLens=await p.evaluate(()=>GKEYS.map(k=>GP[k].list.length));
  await p.click('#tplSave');await p.waitForTimeout(300);
  await p.click('[data-tab=parts]');
  const files=fs.readdirSync(PARTS).filter(f=>f.endsWith('.png'));
  const byKey=k=>files.filter(f=>f.startsWith(k)).map(f=>path.join(PARTS,f));
  const layers=await p.$$('#layers .layer');
  for(const [i,k] of ['body','head','hair','hat','weapon'].entries()){const L=(await p.$$('#layers .layer'))[i];await (await L.$('input[type=file]')).setInputFiles(byKey(k));await p.waitForFunction(n=>PK.layers[n].items.filter(x=>x.cv).length>0,i);await p.waitForTimeout(150)}
  out.after=await p.evaluate(()=>({count:PK.count(),combos:PK.combos(),size:PK.fw,imp:IMP===PK,stat:$('impStat').textContent,
    // white detail inside the white-background body must survive the flood fill
    whiteKept:(()=>{const it=PK.layers[0].items[1];const d=it.cv.getContext('2d').getImageData(Math.round(.46*512)+20,Math.round(.51*512),1,1).data;return d[3]}) (),
    bgGone:PK.layers[0].items.slice(0,3).map(it=>it.cv.getContext('2d').getImageData(5,5,1,1).data[3])}));
  await p.click('#pkAuto');await p.waitForTimeout(200);
  out.auto=await p.evaluate(()=>PK.layers[0].items.map(i=>[i.dx,i.dy,i.sc]).concat(PK.layers[1].items.map(i=>[i.dx,i.dy,i.sc])));
  // nudge the selected hair right 3 times
  const hairL=(await p.$$('#layers .layer'))[2];for(let i=0;i<3;i++)await (await hairL.$('[data-n=r]')).click();
  out.hair=await p.evaluate(()=>{const L=PK.layers[2];return[L.items[L.sel].dx,$('pkStep').value]});
  for(const a of ['idle','attack','death','victory']){await p.evaluate(a=>{st.anim=a;refreshAll()},a)}
  await p.evaluate(()=>{st.anim='attack';st.f=3;setPlay(false);refreshAll()});
  await p.screenshot({path:path.join(OUT,'t_parts.png')});
  await p.click('[data-tab=exp]');
  for(const k of ["preview","parts","pack","gif"]){const n0=await p.evaluate(()=>window.__saved.length);await p.click(`[data-ex=${k}]`);try{await p.waitForFunction(n=>window.__saved.length>n,n0,{timeout:60000})}catch(e){console.log("FAIL",k,await p.evaluate(()=>$("exStat").textContent),errs);throw e}}
  out.saved=await p.evaluate(()=>window.__saved.map(s=>s.name+' '+s.mime+' '+s.len));
  // write the preview + parts zip to disk for a look
  const sv=await p.evaluate(()=>window.__saved.map(s=>({name:s.name,b64:s.b64})));
  for(const s of sv)if(/preview|template|_parts/.test(s.name))fs.writeFileSync(path.join(OUT,'t_'+s.name),Buffer.concat(s.b64.map(x=>Buffer.from(x,'base64'))));
  // reload: the pack must come back from the phone's storage
  await p.reload();await p.waitForFunction(()=>window.forgeReady);
  out.restored=await p.evaluate(()=>({count:PK.count(),hairDx:PK.layers[2].items[PK.layers[2].sel].dx,imp:IMP===PK}));
  // re-import the exported parts zip: offsets come back
  await p.click('[data-tab=parts]');const zipName=sv.find(s=>/_parts\.zip$/.test(s.name)).name;
  await p.setInputFiles('#inZip',path.join(OUT,'t_'+zipName));await p.waitForFunction(()=>/นำเข้าแพ็ก/.test($('impStat').textContent),null,{timeout:60000});
  out.reimport=await p.evaluate(()=>({stat:$('impStat').textContent,body0:[PK.layers[0].items[0].dx,PK.layers[0].items[0].sc],layers:PK.layers.map(L=>L.dir+':'+L.items.length)}));
  // other imports still work
  await p.setInputFiles('#inOne',path.join(PARTS,'head_01.png'));await p.waitForTimeout(400);out.one=await p.evaluate(()=>IMP.type+' pkUse:'+!$('pkUse').hidden);
  await p.click('#pkUse');out.back=await p.evaluate(()=>IMP===PK);
  // phone
  const m=await ctx.newPage();m.on('pageerror',e=>errs.push('m:'+e.message));await m.setViewportSize({width:390,height:844});
  await m.goto('file://'+page);await m.waitForFunction(()=>window.forgeReady);
  out.mobileScrollW=await m.evaluate(()=>document.documentElement.scrollWidth);
  await m.screenshot({path:path.join(OUT,'t_m1.png')});
  await m.evaluate(()=>setTab('parts'));await m.waitForTimeout(200);await m.screenshot({path:path.join(OUT,'t_m2.png'),fullPage:true});
  await m.evaluate(()=>setTab('gpt'));
  // fresh install look: empty state
  const ctx2=await b.newContext({viewport:{width:390,height:844}});await ctx2.addInitScript(bridge);const e=await ctx2.newPage();e.on('pageerror',x=>errs.push('e:'+x.message));
  await e.goto('file://'+page);await e.waitForFunction(()=>window.forgeReady);await e.screenshot({path:path.join(OUT,'t_empty.png')});
  out.emptyExportDisabled=await e.evaluate(()=>[...document.querySelectorAll('[data-ex]')].every(b=>b.disabled));
  console.log(JSON.stringify(out,null,1));console.log('errs',errs);await b.close()})();
