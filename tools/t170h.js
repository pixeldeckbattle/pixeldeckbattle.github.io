const {chromium}=require('playwright');(async()=>{const b=await chromium.launch({executablePath:'/opt/pw-browsers/chromium'});const p=await b.newPage({viewport:{width:900,height:420},deviceScaleFactor:2});const e=[];p.on('pageerror',x=>e.push(x.message));const w=n=>new Promise(r=>setTimeout(r,n));
await p.goto('file:///home/claude/pixeldeck/_t.html');await w(900);
console.log(await p.evaluate(()=>{USER={guest:true,name:'G'};S=unlock(fresh());S.me={name:'G'};S.gift=true;S.n160=S.n165=S.n167=1;const by=r=>Object.keys(C).find(k=>C[k].r===r);const ids={R:by('R'),L:by('L'),SL:by('SL'),LT:by('LT')};Object.values(ids).forEach(id=>S.cards[id]={lv:50,exp:0});S.team=[ids.SL];S.cleared=30;S.bc=[10,20];S.gold=1e6;S.am={kfang:4,dragon:120};
 collTab='am';amSel='kfang';coll();const out={};
 for(const r of ['R','L','SL','LT']){document.querySelector(`[data-act=amput][data-id=${ids[r]}]`).click();out[r]=S.cards[ids[r]].am||null}
 // tampered save: an SL amulet on a Legend card gives nothing
 const base=stat(ids.L,50).atk;S.cards[ids.L].am='kfang';const tam=stat(ids.L,50).atk;S.cards[ids.L].am='dragon';const leg=stat(ids.L,50).atk;
 const sb=(()=>{delete S.cards[ids.SL].am;const a=stat(ids.SL,50).atk;S.cards[ids.SL].am='kfang';return [a,stat(ids.SL,50).atk]})();
 fuTab='a';fuTo='SL';afTo='deye';afPick={dragon:120};return JSON.stringify({out,base,tam,leg,sb,times:afTimes(),p:afP('L'),cost:AFU.L})}));
await p.evaluate(()=>{collTab='am';amSel='kfang';coll()});await w(500);await p.screenshot({path:'sh170/h_equip.png'});
await p.evaluate(()=>{fuTo=null;fuTab='a';fuse()});await w(300);await p.screenshot({path:'sh170/h_hub.png'});
console.log(e);await b.close()})()
