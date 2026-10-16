
// ================= b193 WORLD BOSS · Halloween "Gourdlich" (party of 2–4, one card each) =================
// Server-wide HP: Firestore wb/{event}.dmg (increment only). Leaderboard: wbr/{event}/s/{uid}.
// Party rooms ride the trade-room Realtime Database rule (rooms/$room/$uid, own node only):
//   rooms/wb_<code>/<uid>  member node {n,l,c,lv,st,f,j,rd,go,gs,bots,dd}
//   rooms/wbidx/<uid>      open-room index kept by the host {code,n,cnt,at}
//   rooms/inv_<target>/<uid> an invite {n,code,l,f,at}
// Without the Firestore rule (or offline) the Dev account plays a local copy of the boss (wbSrv.local), so the beta can be tested before the rule is pasted.
const WB={id:'hw26',from:Date.UTC(2026,9,23,17),to:Date.UTC(2026,10,7,17),shop:3*864e5,th:'ราชาฟักทอง',n:'Gourdlich'};
const WB_R=10,WB_FREE=3,WB_BUY=[30,60],WB_LV=5,WB_HP1=2400000,WB_HPK=1.5,WB_MS=[.75,.5,.25,0],WB_BOT_S=30;
const WB_MSR=[{gold:3000,cdy:50},{dia:20,cdy:50},{ss:2,cdy:80},{dia:50,am:'L',cdy:100,sl:5}];
const wbHp=L=>Math.round(WB_HP1*Math.pow(WB_HPK,L-1));
const wbOpen=()=>{const t=Date.now();return isDev()||(t>=WB.from&&t<WB.to)},wbShopOpen=()=>{const t=Date.now();return isDev()||(t>=WB.from&&t<WB.to+WB.shop)};
const wbLeft=()=>{const ms=WB.to-Date.now();if(ms<=0)return T('จบแล้ว','ended');const d=Math.floor(ms/864e5),h=Math.floor(ms%864e5/36e5);return d?T(`เหลือ ${d} วัน ${h} ชม.`,`${d}d ${h}h left`):T(`เหลือ ${h} ชม.`,`${h}h left`)};
// where the server total stands: which level is up, how much of it is left
function wbAt(dmg){let L=1,d=dmg;while(L<=WB_LV&&d>=wbHp(L)){d-=wbHp(L);L++}if(L>WB_LV)return{L:WB_LV,max:wbHp(WB_LV),left:0,done:true,pct:0};const max=wbHp(L);return{L,max,left:max-d,pct:(max-d)/max,done:false}}
const wbRage=w=>!w.done&&w.pct<.5;
// ---- player save: S.wb {e,d,u,b,n,dmg,best,ms,last,rk}; S.cdy candy; S.sl soul coins; S.wbsh shields; S.wbt title; S.pfx frames
const wbS=()=>{if(!S.wb||S.wb.e!==WB.id)S.wb={e:WB.id,n:0,dmg:0,best:0,ms:{}};const w=S.wb,d=today();if(w.d!==d){w.d=d;w.u=0;w.b=0;w.so=0}return w};
const wbFree=()=>WB_FREE+(vipOn()?1:0),wbTix=()=>{const w=wbS();return Math.max(0,wbFree()+(w.b||0)-(w.u||0))};
// ---- server
let wbSrv={dmg:0,at:0,ok:false,local:false,top:[],topAt:0};
const wbDoc=()=>firebase.firestore().collection('wb').doc(WB.id),wbCol=()=>firebase.firestore().collection('wbr/'+WB.id+'/s');
function wbLocal(){wbSrv.local=true;wbSrv.ok=true;wbSrv.dmg=+(S.wbL||0);wbSrv.at=Date.now()}
function wbFetch(force){if(!force&&wbSrv.ok&&Date.now()-wbSrv.at<15000)return Promise.resolve(wbSrv);if(!mkOn()){wbLocal();return Promise.resolve(wbSrv)}
  return fbLoad().then(fbUser).then(u=>{if(!u)throw 0;return wbDoc().get()}).then(d=>{wbSrv.dmg=d.exists?+d.data().dmg||0:0;wbSrv.ok=true;wbSrv.local=false;wbSrv.at=Date.now();return wbSrv}).catch(()=>{wbLocal();return wbSrv})}
function wbPush(d){const w=wbS();if(wbSrv.local){S.wbL=(S.wbL||0)+d;wbSrv.dmg=S.wbL;return Promise.resolve()}
  wbSrv.dmg+=d;const FV=firebase.firestore.FieldValue;
  return Promise.all([wbDoc().set({dmg:FV.increment(d)},{merge:true}),wbCol().doc(USER.sub).set({n:String(S.me.name||'?').slice(0,12),l:S.me.look,f:pfMine(),d:w.dmg,h:w.n,at:FV.serverTimestamp()})]).catch(()=>{S.wbL=(S.wbL||0)+d;wbSrv.local=true})}
function wbTop(force){if(!force&&wbSrv.topAt&&Date.now()-wbSrv.topAt<30000)return Promise.resolve(wbSrv.top);
  const mine=()=>{const w=wbS();return w.dmg?[{id:USER&&USER.sub||'me',n:S.me.name,l:S.me.look,f:pfMine(),d:w.dmg,h:w.n}]:[]};
  if(wbSrv.local||!mkOn()){wbSrv.top=mine();wbSrv.topAt=Date.now();return Promise.resolve(wbSrv.top)}
  return wbCol().orderBy('d','desc').limit(50).get().then(q=>{wbSrv.top=q.docs.map(d=>({id:d.id,...d.data()}));wbSrv.topAt=Date.now();return wbSrv.top}).catch(()=>{wbSrv.top=mine();return wbSrv.top})}
const wbMyRank=()=>{const i=wbSrv.top.findIndex(x=>x.id===(USER&&USER.sub));return i<0?0:i+1};
// ---- rewards: milestones of every level the server has reached, for anyone who has hit the boss at least once
function wbMilestones(){const w=wbS();if(!w.n)return 0;let got=0,all=wbSrv.dmg,acc=0;
  for(let L=1;L<=WB_LV;L++){const H=wbHp(L);WB_MS.forEach((t,i)=>{const need=acc+H*(1-t);if(all<need)return;const k=L+'_'+i;if(w.ms[k])return;w.ms[k]=1;const r={...WB_MSR[i]},half=L>1;
      if(half)Object.keys(r).forEach(x=>{if(typeof r[x]==='number')r[x]=Math.max(1,Math.round(r[x]/2))});if(half&&r.am)delete r.am;
      if(mailAdd({id:'wb'+WB.id+k,k:'wb',sub:T(`บอสโลก Lv.${L} · ${t?`เลือดเหลือ ${t*100}%`:'ถูกปราบแล้ว'}`,`World boss Lv.${L} · ${t?`down to ${t*100}%`:'defeated'}`),it:r}))got++});acc+=H}
  if(all>=acc&&!(S.pfx&&S.pfx.hallow)){S.pfx=S.pfx||{};S.pfx.hallow=1;mailAdd({id:'wb'+WB.id+'all',k:'wb',sub:T('ปราบราชาฟักทองครบทุกเลเวล! กรอบรูปฮาโลวีน','Every level of the Pumpkin King fell! Halloween frame'),it:{pfr:'hallow'}});got++}
  if(got){save();const b=$('mailbdg');if(b){b.hidden=false;b.textContent=mailN()}}return got}
// final ranking, mailed once after the event closes
const WB_RK=r=>r===1?{wbsh:1,amk:'hallow',dia:200}:r<=3?{wbsh:r,amk:'hallow',dia:r===2?150:120}:r<=10?{amk:'hallow',dia:80}:r<=50?{dia:30,cdy:300}:null;
function wbSettle(){const w=wbS();if(w.rk||Date.now()<WB.to||!w.n)return;wbTop(true).then(()=>{if(w.rk)return;const r=wbMyRank(),it=WB_RK(r)||(w.n>=10?{cdy:100}:null);w.rk=r||-1;
  if(it)mailAdd({id:'wbrk'+WB.id,k:'wb',sub:r?T(`บอสโลกฮาโลวีน · อันดับ ${r}`,`Halloween world boss · rank ${r}`):T('บอสโลกฮาโลวีน · รางวัลเข้าร่วม','Halloween world boss · taking part'),it});save();cloudFlush()})}
// ---- party room (Realtime Database)
let wbp=null,wbInvL=null;
const wbNodes=()=>wbp?Object.entries(wbp.nodes||{}).map(([u,v])=>({u,...v})).filter(x=>x.j&&Date.now()-(x.hb||x.j)<90000).sort((a,b)=>a.j-b.j):[];
const wbHost=()=>{const L=wbNodes();return L[0]||null},wbAmHost=()=>{const h=wbHost();return !!h&&h.u===wbp.me};
const wbMine=()=>wbp&&wbp.nodes&&wbp.nodes[wbp.me]||{};
function wbMe(){const w=wbS(),c=wbp&&wbp.card&&S.cards[wbp.card]?wbp.card:(S.team.find(id=>S.cards[id])||Object.keys(S.cards)[0]);return{n:String(S.me.name||'?').slice(0,12),l:S.me.look,c,lv:S.cards[c].lv,st:starOf(c),am:S.cards[c].am||'',f:pfMine()}}
function wbRef(){return rtDb().ref('rooms/wb_'+wbp.code)}
function wbWrite(o){if(!wbp)return;if(wbp.solo){wbp.nodes[wbp.me]={...(wbp.nodes[wbp.me]||{}),...o};return wbRoom()}rtDb().ref('rooms/wb_'+wbp.code+'/'+wbp.me).update(o).catch(()=>{})}
function wbIdx(){if(!wbp||wbp.solo||!wbAmHost())return;const L=wbNodes(),b=(wbMine().bots||[]).length;rtDb().ref('rooms/wbidx/'+wbp.me).set({code:wbp.code,n:wbMe().n,cnt:L.length+b,at:Date.now()}).catch(()=>{})}
function wbLeave(){if(!wbp)return;const p=wbp;wbp=null;clearInterval(p.beat);if(p.solo)return;try{p.ref.off();rtDb().ref('rooms/wb_'+p.code+'/'+p.me).remove();rtDb().ref('rooms/wbidx/'+p.me).remove()}catch(e){}}
function wbJoin(code,create){if(!mkOn()){wbp={code:'LOCAL',me:'me',nodes:{},solo:true,t0:Date.now()};wbp.nodes.me={...wbMe(),j:Date.now(),hb:Date.now()};return wbRoom()}
  code=String(code||'').replace(/\D/g,'').slice(0,4);if(code.length!==4)return toast(T('เลขห้องต้องมี 4 หลัก','A room number has 4 digits'));
  fbLoad().then(fbUser).then(u=>{if(!u)throw 0;return rtDb().ref('rooms/wb_'+code).once('value')}).then(sn=>{const v=sn.val()||{},live=Object.values(v).filter(x=>x&&x.j&&Date.now()-(x.hb||x.j)<90000);
    if(create&&live.length)return wbJoin(String(1000+Math.floor(Math.random()*9000)),true);
    if(!create&&!live.length)return toast(T('ไม่พบห้องนี้ หรือห้องปิดไปแล้ว','No such room, or it has closed'));
    if(!create&&live.length+live.reduce((n,x)=>n+((x.bots||[]).length),0)>=4)return toast(T('ห้องเต็มแล้ว (4 คน)','The room is full (4)'));
    wbLeave();wbp={code,me:USER.sub,nodes:v,t0:Date.now()};wbp.ref=wbRef();const me=rtDb().ref('rooms/wb_'+code+'/'+USER.sub);
    me.onDisconnect().remove();me.set({...wbMe(),j:Date.now(),hb:Date.now(),rd:0});rtDb().ref('rooms/wbidx/'+USER.sub).onDisconnect().remove();
    wbp.ref.on('value',s=>{if(!wbp||wbp.code!==code)return;wbp.nodes=s.val()||{};wbSync()});
    wbp.beat=setInterval(()=>{if(!wbp)return;wbWrite({hb:Date.now()});wbIdx()},20000);wbRoom()}).catch(()=>toast(T('เชื่อมต่อไม่ได้ ลองใหม่อีกครั้ง','Could not connect, try again')))}
function wbSync(){if(!wbp)return;const h=wbHost();if(h&&h.go&&h.go!==wbp.went&&Date.now()-h.go<20000&&wbMine().rd){wbp.went=h.go;return wbBegin(h)}
  if(wbp.res&&document.querySelector('.wbres'))return wbResult(wbp.res);if(document.querySelector('.wbroom'))wbRoom();wbIdx()}
function wbRandom(){if(!mkOn())return wbJoin('',true);fbLoad().then(fbUser).then(()=>rtDb().ref('rooms/wbidx').once('value')).then(s=>{const L=Object.values(s.val()||{}).filter(x=>x&&x.code&&Date.now()-x.at<45000&&x.cnt<4).sort((a,b)=>b.cnt-a.cnt);
  if(L.length)wbJoin(L[0].code);else{toast(T('ยังไม่มีห้องว่าง สร้างห้องใหม่ให้แล้ว','No open party right now, a new one was made for you'));wbJoin(String(1000+Math.floor(Math.random()*9000)),true)}}).catch(()=>wbJoin(String(1000+Math.floor(Math.random()*9000)),true))}
// invites: written into the target's inbox node; the target's game shows a small banner for 10 s
function wbInvite(uid,name){if(!wbp||wbp.solo||!uid)return;rtDb().ref('rooms/inv_'+uid+'/'+wbp.me).set({n:wbMe().n,code:wbp.code,l:S.me.look,f:pfMine(),cnt:wbNodes().length,at:Date.now()}).then(()=>toast(T(`ส่งคำชวนถึง ${name} แล้ว`,`Invite sent to ${name}`))).catch(()=>{})}
function wbInbox(){if(wbInvL||!mkOn()||!USER||!USER.sub)return;fbLoad().then(fbUser).then(u=>{if(!u||wbInvL)return;wbInvL=rtDb().ref('rooms/inv_'+USER.sub);const seen={};
  wbInvL.on('value',s=>{const v=s.val()||{};Object.entries(v).forEach(([from,x])=>{if(!x||!x.at||Date.now()-x.at>15000||seen[from+x.at])return;seen[from+x.at]=1;if(wbp&&wbp.code===x.code)return;wbPop(x)})})}).catch(()=>{})}
let wbPopQ=null;
function wbPop(x){if(bt){wbPopQ=x;return}const el=document.createElement('div');el.className='wbpop nt';el.innerHTML=`${plAv(54,false,x.l,x.f)}<span class="t"><b>${esc(x.n)}</b> ${T('ชวนตีบอสกันมั้ย? 🎃','wants you for the boss! 🎃')}<small>${WB.n} · ${T('ห้อง','room')} #${esc(x.code)} · ${x.cnt||1}/4</small></span><button class="wbb main" data-wbi="go">${T('สนใจ','Join')}</button><button class="wbb sub" data-wbi="no">${T('ไว้ทีหลัง','Later')}</button><i class="tm"></i>`;
  ($('stage')||document.body).appendChild(el);try{sfx('win')}catch(e){}const kill=()=>{el.classList.add('out');setTimeout(()=>el.remove(),300)},to=setTimeout(kill,10000);
  el.addEventListener('click',e=>{const b=e.target.closest('[data-wbi]');if(!b)return;clearTimeout(to);kill();if(b.dataset.wbi==='go'){if(!wbOpen())return;wbJoin(x.code)}})}
function wbInvList(){const box=$('wbinv');if(!box)return;box.innerHTML=`<p class="sub">${T('กำลังโหลดผู้เล่นออนไลน์…','Loading players online…')}</p>`;
  fbLoad().then(fbUser).then(()=>firebase.firestore().collection('online').where('at','>',new Date(Date.now()-120000)).get()).then(q=>{const ids=q.docs.map(d=>d.id).filter(u=>u!==USER.sub&&!wbNodes().some(n=>n.u===u)).slice(0,20);
    return Promise.all(ids.map(u=>firebase.firestore().collection('arena').doc(u).get().then(d=>({u,n:d.exists?d.data().name:'?',l:d.exists?d.data().look:'h01'})).catch(()=>({u,n:'?',l:'h01'}))))}).then(L=>{if(!$('wbinv'))return;
    $('wbinv').innerHTML=L.length?L.map(x=>`<button class="wbirow" data-act="wbinvite" data-u="${x.u}" data-n="${esc(x.n||'?')}">${plAv(40,false,C[x.l]?x.l:'h01','01')}<b>${esc(x.n||'?')}</b><span class="wbb main sm">${T('ชวน','Invite')}</span></button>`).join(''):`<p class="sub">${T('ตอนนี้ไม่มีผู้เล่นอื่นออนไลน์ · คัดลอกเลขห้องไปแชร์ใน Discord แทนได้','Nobody else is online right now · copy the room number to Discord instead')}</p>`}).catch(()=>{if($('wbinv'))$('wbinv').innerHTML=`<p class="sub">${T('โหลดรายชื่อไม่ได้','Could not load the list')}</p>`})}
// ---- screens
const wbIc=(k,h=28)=>`<img class="wbic" src="${{cdy:'wb/candy.webp',sl:'wb/soul.webp',tix:'wb/ticket.webp',dia:'ui2/i-inline-diamond.webp',gold:'ui2/i-inline-coin.webp'}[k]}" alt="" style="height:${h}px">`;
const wbTop3=()=>`<div class="wbcur nt"><span>${wbIc('cdy',24)}${(S.cdy||0).toLocaleString('en')}</span><span>${wbIc('sl',24)}${S.sl||0}</span><span>${wbIc('dia',24)}${(S.dia||0).toLocaleString('en')}</span></div>`;
const wbHead=(t,back='wbhub')=>`<div class="wbtop"><button class="wbround" data-act="${back}" aria-label="${T('กลับ','Back')}"><img src="ui2/round-2.webp" alt=""></button><div class="wbttl nt"><span>${t}</span></div><span class="wbev nt">${wbLeft()}</span>${wbTop3()}</div>`;
function wbHub(){if(!wbOpen()&&!wbShopOpen())return home();wbS();wbInbox();const draw=()=>{const s=wbAt(wbSrv.dmg),w=wbS(),rage=wbRage(s),r=wbMyRank();
  view(`<div class="wbv nt ${rage?'rage':''}"><div class="wbbg" style="background-image:url(wb/${rage?'map2':'map1'}.webp)"></div>${wbHead('🎃 '+T('บอสโลก','World Boss'),'home')}
   <div class="wbhub"><div class="wbstage"><div class="wbname"><b>${WB.n.toUpperCase()}</b><span>Lv.${s.L}${s.done?' · '+T('ถูกปราบแล้ว','defeated'):''}</span><small>${T(WB.th+'แห่งสุสาน',"the Pumpkin King")}</small></div>
     <span class="spr f16 wbboss"><i><img src="spr/${rage?'wb1r':'wb1'}.webp" alt=""></i></span><img class="wbamb" src="wb/amb.webp" alt="" style="display:none">${wbSrv.local?`<span class="wbloc">${T('โหมดทดสอบ (ยังไม่ได้ใส่กฎ Firebase)','Test mode (Firebase rule not added yet)')}</span>`:''}</div>
    <div class="wbpanel"><div class="wbsec"><div class="wbrow"><b>${T('เลือดบอสทั้งเซิร์ฟ','Server-wide boss HP')}</b><span class="wbred">${Math.round(s.pct*100)}% · ${s.left.toLocaleString('en')}</span></div>
      <div class="wbhp"><i style="width:${s.pct*100}%"></i>${WB_MS.slice(0,3).map(t=>`<em style="left:${t*100}%"></em>`).join('')}</div>
      <div class="wbms">${WB_MS.map((t,i)=>{const ok=w.ms[s.L+'_'+i]||(s.done);const r=WB_MSR[i];return `<span class="${ok?'ok':''}"><b>${t?Math.round(t*100)+'%':T('ตาย','Kill')}</b>${r.dia?r.dia+' 💎':r.gold?r.gold.toLocaleString('en')+' G':''}${r.ss?T(' หินดาว×',' Star×')+r.ss:''}</span>`}).join('')}</div></div>
     <div class="wbsec wbst"><div><small>${T('ดาเมจของฉัน','My damage')}</small><b>${(w.dmg||0).toLocaleString('en')}</b></div><div><small>${T('อันดับ','Rank')}</small><b>${r?'#'+r:'-'}</b></div><div><small>${T('ดาเมจสูงสุด','Best hit')}</small><b>${(w.best||0).toLocaleString('en')}</b></div></div>
     <div class="wbsec wbtix">${wbIc('tix',36)}<b>${T('ตั๋วตีวันนี้','Tickets today')} ${wbTix()}/${wbFree()+(w.b||0)}</b>${vipOn()?'<span class="wbvip">+1 VIP</span>':''}${(w.b||0)<WB_BUY.length?`<button class="wbb sub sm" data-act="wbbuy">${T('ซื้อเพิ่ม','Buy')} ${WB_BUY[w.b||0]} 💎</button>`:''}</div>
     ${wbOpen()&&!s.done?`<div class="wbbtns"><button class="wbb main big" data-act="wbnew">🎃 ${T('สร้างปาร์ตี้','Create party')}</button><button class="wbb sub big" data-act="wbcode">🔢 ${T('เข้าด้วยเลขห้อง','Join by number')}</button></div>
     <button class="wbb sub wide" data-act="wbrand">🔍 ${T('หาปาร์ตี้สุ่ม','Find a party')}</button>`:`<p class="sub" style="text-align:center">${s.done?T('ราชาฟักทองถูกปราบครบทุกเลเวลแล้ว! ไปแลกของที่ร้านลูกอมได้','Every level is down! Spend your candy in the shop'):T('อีเวนต์จบแล้ว ร้านลูกอมยังเปิดอีก 3 วัน','The event is over; the candy shop stays open 3 more days')}</p>`}
     <div class="wbmini"><button data-act="wbrank"><img src="ui2/i-menu-rank.webp" alt="">${T('อันดับ','Ranking')}</button><button data-act="wbshop"><span class="wbwitch"></span>${T('ร้านลูกอม','Candy shop')}</button><button data-act="wbrules"><img src="ui2/i-battle-help.webp" alt="">${T('กติกา','Rules')}</button></div></div></div></div>`)};
  draw();wbFetch().then(()=>{wbMilestones();wbSettle();return wbTop()}).then(()=>{if(document.querySelector('.wbhub'))draw()})}
function wbRoom(){if(!wbp)return wbHub();const L=wbNodes(),me=wbMine(),host=wbHost(),amH=wbAmHost(),bots=(host&&host.bots)||[],seats=[...L,...bots.map((b,i)=>({u:'bot'+i,bot:1,...b}))].slice(0,4),
  alone=Date.now()-wbp.t0>WB_BOT_S*1000,canGo=amH&&seats.length>=2&&L.every(x=>x.rd),cls=id=>clsOf(id),hasT=seats.some(x=>C[x.c]&&C[x.c].role==='tank'),hasM=seats.some(x=>C[x.c]&&C[x.c].m);
  const seat=x=>{const c=C[x.c]?x.c:'h01',k=CLS[cls(c)]||['?','',''];return `<div class="wbseat" style="--c:${k[3]||'#888'}"><div class="who">${x.bot?'<span class="wbbot">BOT</span>':plAv(52,x.u===wbp.me,x.l,x.f)}<span><b>${x.u===(host&&host.u)?'👑 ':''}${esc(x.bot?T('บอทช่วยตี','Helper bot'):x.n)}</b><small>${C[c].n} · Lv.${x.lv||1}</small></span></div>
    <div class="hero">${sprite(c,'',`height:100%`)}</div><div class="ring"></div><div class="plate"><i>${k[0]} ${T(k[1],k[2])}</i>${C[c].n.toUpperCase()}</div><span class="st ${x.bot||x.rd?'ok':'wait'}">${x.bot||x.rd?'✓ '+T('พร้อม','Ready'):T('กำลังเลือก…','Choosing…')}</span></div>`};
  view(`<div class="wbv nt"><div class="wbbg" style="background-image:url(wb/map1.webp)"></div>${wbHead('🎃 '+T('ปาร์ตี้','Party')+' #'+wbp.code,'wbquit')}
   <div class="wbroom"><div class="wbinfo"><span>${T('ห้อง','Room')} <b>#${wbp.code}</b> · <b>${seats.length}/4</b> · ${T('เริ่มได้ตั้งแต่ 2 คน','2 or more to start')}</span><button class="wbb sub sm" data-act="wbcopy">📋 ${T('คัดลอกเลขห้อง','Copy number')}</button>
     <span class="wbchk">${hasT?'✓':'✗'} ${T('แท้งค์','Tank')} · ${hasM?'✓':'✗'} ${T('เมจ','Mage')} · ${T('จุดอ่อนบอส: เวท','Weak to magic')}</span></div>
    <div class="wbseats">${seats.map(seat).join('')}${Array.from({length:4-seats.length},()=>`<div class="wbseat empty"><div class="plus">+</div><b>${T('ว่าง','Free')}</b>${wbp.solo?'':`<button class="wbb sub sm" data-act="wbinvopen">📨 ${T('ชวนเพื่อน','Invite')}</button>`}${amH&&(alone||wbp.solo)?`<button class="wbb sub sm" data-act="wbbot">🤖 ${T('เติมบอท','Add bot')}</button>`:''}</div>`).join('')}</div>
    <div class="wbpick"><div class="lab">${T('การ์ดของคุณ','Your card')}<small>${T('คนละ 1 ใบ','one card each')}</small></div><div class="wbcards">${byRank(Object.keys(S.cards).filter(id=>C[id]&&C[id].r!=='ST')).slice(0,40).map(id=>`<button class="wbc ${id===me.c?'on':''}" data-act="wbcard" data-id="${id}" ${me.rd?'disabled':''}>${mkIcon(id)}<small>${C[id].n}</small></button>`).join('')}</div></div>
    <div class="wbfoot"><span class="sub">${wbIc('tix',22)} ${T('ตั๋ววันนี้','Tickets')} ${wbTix()} · ${T('ยิ่งคนเยอะ ลูกอมยิ่งเยอะ +10%/คน','more players, more candy +10% each')}</span>
     ${me.rd?`<button class="wbb sub" data-act="wbready">${T('ยกเลิกพร้อม','Not ready')}</button>`:`<button class="wbb main" data-act="wbready" ${wbTix()?'':'disabled'}>${wbTix()?'✓ '+T('พร้อม','Ready'):T('ตั๋วหมด','No tickets')}</button>`}
     ${amH?`<button class="wbb main big" data-act="wbgo" ${canGo?'':'disabled'}>⚔ ${T('เริ่มตีบอส','Start')} (${seats.length}/4)</button>`:`<span class="sub">${T('รอหัวห้องกดเริ่ม','Waiting for the host')}</span>`}</div>
    <div id="wbinvbox" class="wbinvbox" hidden><div class="wbinvh"><b>📨 ${T('ชวนผู้เล่นที่ออนไลน์','Invite a player online')}</b><button class="wbb sub sm" data-act="wbinvclose">✕</button></div><div id="wbinv"></div></div></div></div>`)}
function wbCodeAsk(){ov(`<div class="cd dlg nt"><div class="wbdlg"><b class="wbdt">🔢 ${T('เข้าห้องด้วยเลขห้อง','Join by room number')}</b><input id="wbcd" inputmode="numeric" maxlength="4" placeholder="0000" class="wbcode"><p class="sub">${T('ได้เลขห้องจากเพื่อน แชต หรือ Discord · ห้องเต็ม 4 คน','Get the number from a friend or Discord · rooms hold 4')}</p>
  <div class="row" style="justify-content:center;gap:10px"><button class="wbb sub" data-wbc="no">${T('ยกเลิก','Cancel')}</button><button class="wbb main" data-wbc="go">${T('เข้าห้อง','Join')}</button></div></div></div>`);setTimeout(()=>{const i=$('wbcd');if(i)i.focus()},50)}
$('ov').addEventListener('click',e=>{const b=e.target.closest('[data-wbc]');if(!b)return;const v=($('wbcd')||{}).value;ov('');if(b.dataset.wbc==='go')wbJoin(v)});
// ---- the fight
const WB_BOSS=()=>{const L=stageDef(1500).find(e=>e.lord)||stageDef(1500)[0];return{atk:Math.round(L.atk*1.15),def:24}};
async function wbBegin(h){if(!wbp||bt)return;const w=wbS();if(!wbTix()){toast(T('ตั๋วหมดแล้ววันนี้','No tickets left today'));return}
  await wbFetch(true);const s=wbAt(wbSrv.dmg);if(s.done){toast(T('บอสถูกปราบครบแล้ว','The boss is already down'));return wbHub()}
  w.u=(w.u||0)+1;save();const seats=[...wbNodes(),...((h&&h.bots)||[]).map(b=>({...b,bot:1}))].slice(0,4);
  const rage=wbRage(s),B=WB_BOSS(),atk=Math.round(B.atk*(rage?1.3:1));
  bt={n:1500,wb:1,round:1,sel:0,log:'',pvp:null,farm:false,first:false,party:seats.map(x=>({u:x.u,n:x.n,bot:!!x.bot})),
    al:seats.map(x=>{const c=C[x.c]?x.c:'h01';return x.u===wbp.me?fighter(c,S.cards[c]?S.cards[c].lv:x.lv):fighter(c,x.lv||1,{star:x.st||0,am:x.am||''})}),
    en:[{id:rage?'wb1r':'wb1',boss:true,lord:1,atk,base:atk,hp:s.left,max:s.max,def:B.def,crit:.08,cx:1.5,sh:0,gim:'breath'}],wbd:seats.map(()=>0),wbA:0,wbMe:seats.findIndex(x=>x.u===wbp.me),wbL:s.L,wbRage:rage,wbStart:wbSrv.dmg};
  c3Amu(bt);plBuff(bt);if(S.auto===false)bt.wbAuto=1;S.auto=true;const my=bt;busy=true;draw();await wbVs();if(bt!==my)return;busy=false;draw();go()}
async function wbVs(){const P=f=>`<div class="vp">${sprite(f.id,'',`height:100%`)}</div>`;
  ov(`<div class="vs wbvs"><div class="vl">${bt.al.map(P).join('')}</div><b>VS</b><div class="vr"><span class="spr f16 wbvsb"><i><img src="spr/${bt.en[0].id}.webp" alt=""></i></span></div><div class="wbvsn"><b>${WB.n.toUpperCase()}</b><small>${T(WB.th+'แห่งสุสาน','the Pumpkin King')} · Lv.${bt.wbL}</small></div><div class="wbvsp">PARTY #${wbp?wbp.code:''} ${bt.al.length}/4</div></div>`);
  sfx('ult');await W(RM?600:1700);ov('')}
async function wbFinish(won){const my=bt;busy=true;const kill=my.en[0].hp<=0;sfx(kill?'win':'start');await banner(kill?T('ปราบสำเร็จ!','DEFEATED!'):'FINISH',kill?'':'');if(bt!==my)return;
  if(my.wbAuto)S.auto=false;const w=wbS(),i=my.wbMe,d=Math.max(0,Math.round(my.wbd[i]||0)),s0=wbAt(my.wbStart),share=d/s0.max,id=my.al[i]?my.al[i].id:null,n=my.party.length;
  let cdy=share<.01?10:share<.03?20:share<.05?30:40;cdy=Math.round(cdy*(1+.1*n)*(my.wbRage?1.5:1)*(vipOn()?1.5:1)*(id&&S.cards[id]&&S.cards[id].am==='hallow'?1.2:1));
  const g=rollGold(1500).g*VX(),x=Math.round(expOf(1500)*VX()*.6);let up=0,am=null,soul=0;
  S.cdy=(S.cdy||0)+cdy;S.gold+=g;lg('wb',g);if(id&&S.cards[id])up=addExp(id,x);if(Math.random()<.08){am=amRoll();S.am=S.am||{};S.am[am]=(S.am[am]||0)+1}
  w.n++;w.dmg+=d;const best=d>(w.best||0);if(best)w.best=d;if((w.u||0)>=3&&!w.so){w.so=1;soul++}plGain('wb');
  const was=wbMyRank()||0;await wbPush(d);const s1=wbAt(wbSrv.dmg),last=s1.L>s0.L||s1.done&&!s0.done;if(kill&&last){soul+=5;S.cdy+=100;S.wbt=1}
  S.sl=(S.sl||0)+soul;bt=null;busy=false;save();cloudFlush();wbMilestones();if(wbp)wbWrite({dd:d,rd:0,go:0});
  wbp&&(wbp.res={d,share,cdy,g,x,up,am,soul,best,kill:kill&&last,s0,s1,was,id});wbTop(true).then(()=>{if(document.querySelector('.wbres'))wbResult(wbp?wbp.res:null)});wbResult(wbp?wbp.res:{d,share,cdy,g,x,up,am,soul,best,kill,s0,s1,was,id})}
function wbResult(r){if(!r)return wbHub();const now=wbMyRank(),party=wbNodes();
  view(`<div class="wbv nt"><div class="wbbg dim" style="background-image:url(wb/map1.webp)"></div><div class="wbres"><div class="wbttl big nt"><span>${r.kill?T('ปราบราชาฟักทองสำเร็จ!','You felled the Pumpkin King!'):T('จบการตีบอส','Boss fight over')}</span></div>
   <div class="wbr1"><span class="spr f16 wbrb"><i><img src="spr/wb1.webp" alt=""></i></span><div><small>${T('ดาเมจของฉัน','My damage')}</small><b class="wbbig">${r.d.toLocaleString('en')}</b><small>= ${(r.share*100).toFixed(1)}% ${T('ของเลือดบอส','of the boss')}${r.best?` · <b style="color:#7dff8a">${T('ดาเมจสูงสุดใหม่!','New best!')}</b>`:''}</small></div>
    <div class="wbrk">${now&&now<=3?`<img src="wb/sh${now===1?'2':now}.webp" alt="">`:''}<small>${T('อันดับ','Rank')}</small><b>${now?'#'+now:'-'}</b>${r.was&&now&&now<r.was?`<i>▲${r.was-now}</i>`:''}</div></div>
   ${party.length>1?`<div class="wbparty">${party.map(x=>`<span>${plAv(36,x.u===(wbp&&wbp.me),x.l,x.f)}<b>${esc(x.n)}</b><i>${x.dd!=null?(+x.dd).toLocaleString('en'):'…'}</i></span>`).join('')}</div>`:''}
   <div class="wbhp sm"><i style="width:${r.s1.pct*100}%"></i><i class="cut" style="left:${r.s1.pct*100}%;width:${Math.max(0,Math.min(100-r.s1.pct*100,(r.s0.L===r.s1.L?r.s0.pct-r.s1.pct:r.s0.pct)*100))}%"></i></div><p class="sub" style="text-align:center">${T('เลือดบอสทั้งเซิร์ฟ','Server boss HP')} ${Math.round(r.s0.pct*100)}% → ${Math.round(r.s1.pct*100)}%${r.s1.L>r.s0.L?` · ${T('ขึ้นเลเวล','now Lv.')}${r.s1.L}`:''}</p>
   <div class="wbgot"><span>${wbIc('cdy',40)}<b>+${r.cdy}</b><small>${T('ลูกอม','Candy')}</small></span><span>${wbIc('gold',40)}<b>+${r.g.toLocaleString('en')}</b><small>Gold</small></span><span><img src="ui2/i-battle-levelup.webp" alt="" style="height:40px"><b>+${r.x.toLocaleString('en')}</b><small>Exp${r.up?' · Lv↑':''}</small></span>
    ${r.soul?`<span>${wbIc('sl',40)}<b>+${r.soul}</b><small>${T('เหรียญวิญญาณ','Soul coin')}</small></span>`:''}${r.am?`<span><span style="display:inline-block;width:40px">${amu(r.am)}</span><b>${AM[r.am].n}</b><small>${T('เครื่องราง','Amulet')}</small></span>`:''}</div>
   ${r.kill?`<div class="wbkill"><span class="wbtitle"></span><b>${T('คุณคือคนปิดฉาก! ได้ฉายา PUMPKIN SLAYER + เหรียญวิญญาณ 5 + ลูกอม 100','You landed the last hit! PUMPKIN SLAYER title + 5 soul coins + 100 candy')}</b></div>`:''}
   <div class="wbbtns"><button class="wbb sub big" data-act="wbquit">${T('กลับหน้าบอส','Back to the boss')}</button>${wbp&&!wbp.solo?`<button class="wbb main big" data-act="wbagain">🎃 ${T('ตีต่อกับทีมเดิม','Again with this party')}</button>`:`<button class="wbb main big" data-act="wbagain">🎃 ${T('ตีอีกครั้ง','Fight again')}</button>`}</div></div></div>`)}
// candy shop + soul shop (soul coins never expire; candy shop closes 3 days after the event)
const WB_SHOP=[['ss','หินดาว','Star stone',30,0,{ss:1}],['rs','ผลึกอาณาจักร','Realm crystal',40,0,{rs:1}],['am','เครื่องราง Legend สุ่ม','Random Legend amulet',150,0,{am:'L'}],['card','การ์ด Legend สุ่ม','Random Legend card',400,2,{card:'L'}],['hal','เครื่องราง Limited โคมวิญญาณฟักทอง','Limited amulet: Pumpkin Soul Lantern',1000,1,{amk:'hallow'}],['pf','กรอบรูปฮาโลวีน','Halloween profile frame',500,1,{pfr:'hallow'}]];
const WB_SOUL=[['tk','ตั๋วสลับการ์ด','Card swap ticket',15,0,{swap:1}],['pf2','กรอบรูปฮาโลวีน','Halloween profile frame',30,1,{pfr:'hallow'}],['dia','เพชร 30','30 diamonds',10,5,{dia:30}]];
function wbShop(tab){tab=tab||'c';S.wbb=S.wbb||{};const L=tab==='c'?WB_SHOP:WB_SOUL,cur=tab==='c'?(S.cdy||0):(S.sl||0),open=tab!=='c'||wbShopOpen();
  view(`<div class="wbv nt"><div class="wbbg dim" style="background-image:url(wb/map1.webp)"></div>${wbHead('🍬 '+T('ร้านลูกอม','Candy shop'))}<div class="wbshop"><div class="wbwitchbig"></div><div class="wbsl"><div class="wbtabs"><button class="${tab==='c'?'on':''}" data-act="wbshop" data-t="c">🍬 ${T('ลูกอม','Candy')}</button><button class="${tab==='s'?'on':''}" data-act="wbshop" data-t="s">👻 ${T('เหรียญวิญญาณ','Soul coins')}</button></div>
   <p class="sub">${tab==='c'?T('ลูกอมใช้ได้ถึงร้านปิด (หลังจบอีเวนต์ 3 วัน) แล้วจะหายไป','Candy can be spent until the shop closes, 3 days after the event; then it is gone'):T('เหรียญวิญญาณไม่หาย สะสมข้ามบอสทุกฤดูกาล','Soul coins never expire; they carry over to every future boss')}</p>
   <div class="wbitems">${L.map(([k,th,en,p,lim,it])=>{const used=S.wbb[tab+k]||0,out=lim&&used>=lim,ok=open&&!out&&cur>=p&&!(it.pfr&&pfHave('hallow'));return `<div class="wbitem"><span class="ic">${it.amk?amu(it.amk):it.pfr?plAv(60,true,null,'hallow'):it.card?`<img src="ui2/i-menu-chest.webp" alt="">`:it.am?`<img src="ui2/i-menu-amulet.webp" alt="">`:it.ss?`<img src="ui2/i-inline-starstone.webp" alt="">`:it.rs?`<img src="ui2/i-inline-crystal.webp" alt="">`:it.swap?`<img src="ui2/i-inline-ticket.webp" alt="">`:`<img src="ui2/i-inline-diamond.webp" alt="">`}</span>
     <span class="nm"><b>${T(th,en)}</b><small>${lim?T(`จำกัด ${lim} ครั้ง · ใช้ไป ${used}`,`limit ${lim} · bought ${used}`):T('ไม่จำกัด','no limit')}</small></span><button class="wbb main sm" data-act="wbbuyit" data-t="${tab}" data-k="${k}" ${ok?'':'disabled'}>${wbIc(tab==='c'?'cdy':'sl',20)} ${p}</button></div>`}).join('')}</div></div></div></div>`)}
function wbBuyIt(tab,k){const L=tab==='c'?WB_SHOP:WB_SOUL,x=L.find(r=>r[0]===k);if(!x)return;const [,,,p,lim,it]=x,key=tab==='c'?'cdy':'sl';S.wbb=S.wbb||{};if((S[key]||0)<p||(lim&&(S.wbb[tab+k]||0)>=lim))return;if(tab==='c'&&!wbShopOpen())return;
  S[key]-=p;S.wbb[tab+k]=(S.wbb[tab+k]||0)+1;const out=itGive(it,'wbshop');save();sfx('win');ov(`<div class="cd dlg nt"><div class="wbdlg"><b class="wbdt">${T('ได้รับแล้ว!','Got it!')}</b><div class="itgot">${out.map(itChip).join('')}</div><button class="wbb main" data-wbc="no">${T('ตกลง','OK')}</button></div></div>`);wbShop(tab)}
function wbRank(){wbTop(true).then(L=>{const me=USER&&USER.sub;
  view(`<div class="wbv nt"><div class="wbbg dim" style="background-image:url(wb/map1.webp)"></div>${wbHead('🏆 '+T('อันดับดาเมจ','Damage ranking'))}<div class="wbrank"><div class="wbprize">
   <div><img src="wb/sh1.webp" class="wbsh1" alt=""><b>#1</b><small>${T('โล่ราชาฟักทอง (ขยับได้) + เครื่องราง Limited + 200 💎','Animated shield + Limited amulet + 200 💎')}</small></div><div><img src="wb/sh2.webp" alt=""><b>#2</b><small>${T('โล่เงิน + Limited + 150 💎','Silver shield + Limited + 150 💎')}</small></div><div><img src="wb/sh3.webp" alt=""><b>#3</b><small>${T('โล่ทองแดง + Limited + 120 💎','Bronze shield + Limited + 120 💎')}</small></div>
   <div><b>#4–10</b><small>Limited + 80 💎</small></div><div><b>#11–50</b><small>30 💎 + 🍬300</small></div></div>
   <div class="wblist">${L.length?L.map((x,i)=>`<div class="wbli ${x.id===me?'me':''}"><b class="no">${i+1}</b>${plAv(40,x.id===me,C[x.l]?x.l:'h01',x.f)}<span>${esc(x.n||'?')}<small>${T('ตี','hits')} ${x.h||0}</small></span><b class="d">${(+x.d||0).toLocaleString('en')}</b></div>`).join(''):`<p class="sub">${T('ยังไม่มีใครตีบอส','Nobody has hit the boss yet')}</p>`}</div></div></div>`)})}
function wbRules(){ov(`<div class="cd dlg nt"><div class="wbdlg wide"><b class="wbdt">📜 ${T('กติกาบอสโลก','World boss rules')}</b><ul class="wbul">
  <li>${T('บอสตัวเดียวทั้งเซิร์ฟ เลือดใช้ร่วมกัน ทุกคนช่วยกันตัด · ปราบได้แล้วฟื้นเป็นเลเวลถัดไป เลือด ×1.5 (สูงสุด Lv.5)','One boss for the whole server with shared HP · when it falls it returns one level up with ×1.5 HP (up to Lv.5)')}</li>
  <li>${T('ปาร์ตี้ 2–4 คน คนละ 1 การ์ด · ห้องมีเลข 4 หลัก แชร์ให้เพื่อนได้ · รอเกิน 30 วินาที หัวห้องเติมบอทได้ (บอทไม่ได้ของ)','Parties of 2–4, one card each · every room has a 4-digit number to share · after 30 s the host may add a bot (bots earn nothing)')}</li>
  <li>${T(`สู้ ${WB_R} รอบ ไม่มีแพ้ ดาเมจเท่าไหร่ได้ของเท่านั้น · ตีได้วันละ ${WB_FREE} ครั้ง (+1 VIP) ซื้อเพิ่มได้วันละ 2 ครั้ง`,`${WB_R} rounds, no losing: you earn by damage · ${WB_FREE} tickets a day (+1 VIP), up to 2 more for diamonds`)}</li>
  <li>${T('คำสาปเล็งตัวเลือดน้อยสุด แท้งค์ที่ล่อได้จะรับแทน · ทุก 3 รอบบอสฟันกวาดทั้งทีม · เลือดทั้งเซิร์ฟต่ำกว่า 50% บอสคลั่ง ตีแรงขึ้น แต่ลูกอม ×1.5','Its curse hunts the lowest HP unless a tank taunts · every 3 rounds it sweeps the whole party · under 50% server HP it rages: harder hits, candy ×1.5')}</li>
  <li>${T('เครื่องรางแท้งค์ SL มีผลในบอสโลก · ลูกอม +10% ต่อคนในปาร์ตี้ · VIP ลูกอม ×1.5 · ตีครบ 3 ครั้งในวันได้เหรียญวิญญาณ 1','Tank SL amulets work here · candy +10% per party member · VIP candy ×1.5 · your 3rd hit of the day gives a soul coin')}</li>
  <li>${T('รางวัลทั้งเซิร์ฟ (เลือด 75/50/25% และตอนตาย) ส่งเข้ากล่องจดหมายทุกคนที่เคยตี · คนตีดาบสุดท้ายได้ฉายา PUMPKIN SLAYER · ปราบครบ 5 เลเวล ทุกคนได้กรอบรูปฮาโลวีน','Server rewards (75/50/25% and each kill) go to the mailbox of everyone who hit · the last hit earns the PUMPKIN SLAYER title · all 5 levels down: everyone gets the Halloween frame')}</li></ul>
  <button class="wbb main" data-wbc="no">${T('เข้าใจแล้ว','Got it')}</button></div></div>`)}
function wbClick(a,t){
  if(a==='wbhub'){wbLeave();wbHub();return 1}
  if(a==='wbquit'){wbLeave();wbHub();return 1}
  if(a==='wbnew'){if(!wbTix())return toast(T('ตั๋ววันนี้หมดแล้ว','No tickets left today')),1;wbJoin(String(1000+Math.floor(Math.random()*9000)),true);return 1}
  if(a==='wbcode'){wbCodeAsk();return 1}
  if(a==='wbrand'){wbRandom();return 1}
  if(a==='wbbuy'){const w=wbS(),c=WB_BUY[w.b||0];if(c&&(S.dia||0)>=c){S.dia-=c;ld('wbtix',-c);w.b=(w.b||0)+1;save();sfx('win')}else if(c)toast(T('เพชรไม่พอ','Not enough diamonds'));wbHub();return 1}
  if(a==='wbcard'){if(wbp){wbp.card=t.dataset.id;wbWrite({...wbMe()})}return 1}
  if(a==='wbready'){const m=wbMine();if(!m.rd&&!wbTix())return 1;wbWrite({...wbMe(),rd:m.rd?0:1});return 1}
  if(a==='wbbot'){const m=wbMine(),b=m.bots||[],pool=Object.keys(C).filter(id=>!C[id].mon&&['SL','L'].includes(C[id].r)),c=pool[Math.floor(Math.random()*pool.length)],lv=Math.max(1,Math.round((S.cards[wbMe().c]||{lv:100}).lv*.85));
    wbWrite({bots:[...b,{c,lv,st:3,n:'BOT',l:c}].slice(0,3)});return 1}
  if(a==='wbgo'){const L=wbNodes();if(!wbAmHost()||L.length+((wbMine().bots||[]).length)<2||!L.every(x=>x.rd))return 1;wbWrite({go:Date.now()});if(wbp.solo){wbp.went=wbMine().go;wbBegin(wbMine())}return 1}
  if(a==='wbagain'){if(!wbp){wbJoin('',true);return 1}wbp.res=null;wbp.t0=Date.now();wbWrite({rd:0,dd:null,go:0});wbRoom();return 1}
  if(a==='wbcopy'){const s=T(`มาตีบอสฟักทองกัน! ห้อง #${wbp.code} ขาดอีก ${4-wbNodes().length} คน 🎃`,`Pumpkin King raid! Room #${wbp.code}, ${4-wbNodes().length} seats left 🎃`);try{navigator.clipboard.writeText(s)}catch(e){}toast(T('คัดลอกแล้ว: ','Copied: ')+s);return 1}
  if(a==='wbinvopen'){const b=$('wbinvbox');if(b){b.hidden=false;wbInvList()}return 1}
  if(a==='wbinvclose'){const b=$('wbinvbox');if(b)b.hidden=true;return 1}
  if(a==='wbinvite'){wbInvite(t.dataset.u,t.dataset.n);return 1}
  if(a==='wbshop'){wbShop(t.dataset.t);return 1}
  if(a==='wbbuyit'){wbBuyIt(t.dataset.t,t.dataset.k);return 1}
  if(a==='wbrank'){wbRank();return 1}
  if(a==='wbrules'){wbRules();return 1}
  return 0}
