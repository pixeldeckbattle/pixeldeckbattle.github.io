const {chromium}=require('/opt/npm-tools/node_modules/playwright');const fs=require('fs');
(async()=>{const html='<!doctype html><html><head><meta charset=utf-8><meta name=viewport content="width=device-width,initial-scale=1"></head><body>'+fs.readFileSync('forge.html','utf8')+'</body></html>';
fs.writeFileSync('_t.html',html);
const b=await chromium.launch({executablePath:'/opt/pw-browsers/chromium'}).catch(()=>chromium.launch());
const p=await b.newPage({viewport:{width:1200,height:900}});const errs=[];p.on('pageerror',e=>errs.push(e.message));p.on('console',m=>{if(m.type()==='error')errs.push(m.text())});
await p.route('**/jszip.min.js',r=>r.fulfill({body:fs.readFileSync('/opt/npm-tools/node_modules/jszip/dist/jszip.min.js'),contentType:'text/javascript'}));
await p.route('https://fonts.**',r=>r.abort());
await p.goto('file://'+__dirname+'/_t.html');await p.waitForTimeout(800);
const r=await p.evaluate(async()=>{const out={};
 // uniqueness check of first 3000 ids
 const seen=new Set();for(let i=1;i<=3000;i++)seen.add(encodeC(modelOf(i)));out.uniq=seen.size;
 out.inv=[1,777,99999].map(i=>idOf(modelOf(i))===i);
 // render every anim for several models
 for(let id of [1,2,3,4,5,6,7,8,9,10,11,12,500,9999])for(const [a] of ANIMS)for(let f=0;f<8;f++)renderProc(modelOf(id),a,f/8,{rank:id%5,fx:'auto'});
 // GIF encode + decode
 const fr=framesFor('attack',2);const w=fr[0].width,h=fr[0].height;const g=gifEncode(fr.map(c=>c.getContext('2d').getImageData(0,0,w,h)),w,h,10);
 out.gifOk=await new Promise(res=>{const im=new Image();im.onload=()=>res(im.width+'x'+im.height);im.onerror=()=>res('bad');im.src=URL.createObjectURL(new Blob([g],{type:'image/gif'}))});
 // zip import: anim folders from our own pack format
 const z=new JSZip();for(const a of ['idle','attack'])for(let i=0;i<3;i++){const c=framesFor(a,1)[i];z.file(a+'/'+(i+1)+'.png',await blobOf(c))}
 const bl=await z.generateAsync({type:'blob'});bl.name='t.zip';await importZip(new File([bl],'hero.zip'));out.imp1=document.getElementById('impStat').textContent;
 for(const [a] of ANIMS)for(let f=0;f<6;f++)renderImp(a,f,6,opts());
 // parts pack
 const z2=new JSZip();for(const d of ['1_body','2_head','3_weapon'])for(let i=0;i<3;i++){const c=document.createElement('canvas');c.width=40;c.height=40;const x=c.getContext('2d');x.fillStyle=['#f00','#0f0','#00f'][i];x.fillRect(10+i*3,d.includes('head')?5:15,10,10);z2.file(d+'/p'+i+'.png',await blobOf(c))}
 await importZip(new File([await z2.generateAsync({type:'blob'})],'parts.zip'));out.imp2=document.getElementById('impStat').textContent;
 for(const [a] of ANIMS)renderImp(a,2,6,opts());
 document.getElementById('backLib').click();
 return out});
console.log(JSON.stringify(r,null,1));
await p.evaluate(()=>{pick(42);st.rank=3;st.anim='attack';st.f=3;setPlay(false);refreshAll()});
await p.screenshot({path:'s1.png'});
const m=await b.newPage({viewport:{width:390,height:844}});m.on('pageerror',e=>errs.push('m:'+e.message));
await m.route('**/jszip.min.js',r=>r.fulfill({body:fs.readFileSync('/opt/npm-tools/node_modules/jszip/dist/jszip.min.js'),contentType:'text/javascript'}));
await m.goto('file://'+__dirname+'/_t.html');await m.waitForTimeout(600);
const ov=await m.evaluate(()=>document.documentElement.scrollWidth);
await m.screenshot({path:'s2.png',fullPage:false});
await m.evaluate(()=>setTab('ui'));await m.waitForTimeout(200);await m.screenshot({path:'s3.png',fullPage:true});
console.log('errs',errs,'mobileScrollW',ov);await b.close()})();
