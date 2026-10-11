import re
p='bit8-clash.html';s=open(p,encoding='utf8').read()
def rep(a,b,n=1):
    global s
    assert s.count(a)==n,(a[:70],s.count(a));s=s.replace(a,b)
JS=open('tw_js.txt',encoding='utf8').read();CSS=open('tw_css.txt',encoding='utf8').read()
rep("const BUILD='b166'","const BUILD='b167'")
rep("</style>",CSS+"</style>")
# tower monsters (never used by the 500 stages); sp = whose pictures they borrow until their own art is in
rep("b05:{n:'Obsidian Dragon',k:'ward',a:84,h:72,d:14,c:16,boss:1,m:1,st:'cast',pj:'fire'}};",
"""b05:{n:'Obsidian Dragon',k:'ward',a:84,h:72,d:14,c:16,boss:1,m:1,st:'cast',pj:'fire'},
 // b167 Endless Tower: two monsters and one boss per zone (tw:1 keeps them out of the 500 stages); gim = the boss's trick, see GIM
 t01:{n:'Rune Sentinel',k:'arm',a:50,h:52,d:14,c:8,st:'smash',tw:1,sp:'m08'},t02:{n:'Hall Acolyte',k:'ward',a:62,h:36,d:6,c:12,m:1,st:'cast',pj:'moon',tw:1,sp:'m10'},
 t03:{n:'Chained Grimoire',k:'arm',a:58,h:46,d:14,c:14,tw:1,sp:'m07'},t04:{n:'Ink Wraith',k:'ward',a:64,h:34,d:6,c:14,m:1,st:'cast',pj:'soul',tw:1,sp:'m04'},
 t05:{n:'Forge Automaton',k:'arm',a:54,h:52,d:16,c:8,st:'smash',tw:1,sp:'m05'},t06:{n:'Cinder Shaman',k:'ward',a:66,h:32,d:6,c:14,m:1,st:'cast',pj:'fire',tw:1,sp:'m01'},
 t07:{n:'Glacier Knight',k:'arm',a:56,h:50,d:16,c:10,st:'smash',tw:1,sp:'m06'},t08:{n:'Storm Siren',k:'ward',a:66,h:34,d:6,c:14,m:1,st:'cast',pj:'light',tw:1,sp:'m09'},
 t09:{n:'Seraph Guard',k:'arm',a:58,h:50,d:16,c:10,tw:1,sp:'m03'},t10:{n:'Star Oracle',k:'ward',a:68,h:32,d:6,c:14,m:1,st:'cast',pj:'light',tw:1,sp:'m10'},
 tb1:{n:'Gatekeeper Titan',k:'arm',a:62,h:88,d:22,c:8,boss:1,st:'smash',gim:'gate',tw:1,sp:'b03'},tb2:{n:'Arch-Lich Librarian',k:'ward',a:78,h:72,d:12,c:14,boss:1,m:1,st:'cast',pj:'soul',gim:'raise',tw:1,sp:'b02'},
 tb3:{n:'Forge Tyrant',k:'arm',a:74,h:80,d:18,c:12,boss:1,st:'smash',gim:'rage',tw:1,sp:'b04'},tb4:{n:'Blizzard Wyrm',k:'ward',a:80,h:74,d:14,c:14,boss:1,m:1,st:'cast',pj:'moon',gim:'breath',tw:1,sp:'b05'},
 tb5:{n:'Sky Emperor',a:82,h:76,d:16,c:16,boss:1,m:1,st:'cast',pj:'light',gim:'shift',tw:1,sp:'b01'}};""")
rep("const MSM=Object.keys(MON).filter(id=>!MON[id].boss),MBS=Object.keys(MON).filter(id=>MON[id].boss);","const MSM=Object.keys(MON).filter(id=>!MON[id].boss&&!MON[id].tw),MBS=Object.keys(MON).filter(id=>MON[id].boss&&!MON[id].tw);")
rep("""<img src="spr/${id}.webp${C[id]&&C[id].mon?'?2':''}" alt=""","""<img src="spr/${C[id]&&C[id].sp||id}.webp${C[id]&&C[id].mon?'?2':''}" alt=""")
rep("artSrc=id=>`art/${id}.webp`;","artSrc=id=>`art/${C[id]&&C[id].sp||id}.webp`;")
# backgrounds
rep("function bgLayers(n){const m=mapOf(n),f=FX[m]||{},u=`style=\"background-image:url(${mapImg(n)})\"`,d=k=>","function bgLayers(n){return bgCore(mapOf(n),mapImg(n))}\nfunction bgCore(m,src){const f=FX[m]||{},u=`style=\"background-image:url(${src})\"`,d=k=>")
rep("<div class=\"bgl top\" style=\"background-image:url(${mapImg(n)});${d(5.6)}\"></div>","<div class=\"bgl top\" style=\"background-image:url(${src});${d(5.6)}\"></div>")
# unit: side class, walking sprite, boss tags, shifting weakness
rep("""return `<div class="pos" style="left:calc(""","""return `<div class="pos ${side?'r':'l'}" style="left:calc(""")
rep("""${u.taunt&&u.hp>0?`<b class="tnt">TAUNT${u.taunt>1?' '+u.taunt:''}</b>`:''}${el[0]==='e'&&u.hp>0&&weakOf(u.id,bt.n)?`<b class="wkt ${weakOf(u.id,bt.n)} nt">${weakTxt(weakOf(u.id,bt.n))}</b>`:''}""",
"""${u.taunt&&u.hp>0?`<b class="tnt">TAUNT${u.taunt>1?' '+u.taunt:''}</b>`:''}${u.gate>0&&u.hp>0?`<b class="tnt gtg nt">🛡 ×${u.gate}</b>`:''}${el[0]==='e'&&u.hp>0&&wkU(u)?`<b class="wkt ${wkU(u)} nt">${weakTxt(wkU(u))}</b>`:''}""")
rep("""<span class="sw ${side?'':'flip'}">${sprite(u.id)}</span></button></div>`}""","""<span class="sw ${side?'':'flip'}">${sprite(u.id,u.walk?'walk':'')}</span></button></div>`}""")
# draw
rep("""view(`<div class="arena px">${bgLayers(bt.n)}""","""view(`<div class="arena px ${bt.tw&&bt.in?'twin':''}">${bt.tw?twBg(bt.tw):bgLayers(bt.n)}""")
rep(""":`ด่าน ${bt.n} · ${MAPS[mapOf(bt.n)-1]}`} · รอบ ${bt.round}</span>""",""":bt.tw?`<span class="nt">TOWER · ${T('ชั้น','Floor')} ${bt.tw} · ${T(TWZ[twZone(bt.tw)].th,TWZ[twZone(bt.tw)].n)}</span>`:`ด่าน ${bt.n} · ${MAPS[mapOf(bt.n)-1]}`} · รอบ ${bt.round}</span>""")
# hurt: gate, shifting aegis, rage
rep("""let wk='';if(d>0){const rm=resMul(t.id,hitM,bt.n);""","""let wk='';if(d>0&&t.gate>0){t.gate--;q(pre+i,'BLOCK','s');hits.add(pre+i);return}if(d>0){const rm=t.gim==='shift'?((bt.round%2===1)===!hitM?.5:1.3):resMul(t.id,hitM,bt.n);""")
rep("""  t.hp-=d;q(pre+i,(d<0?'+':'-')+Math.abs(d)+(cr?'!':'')+wk,k);if(d>0)hits.add(pre+i)}""","""  t.hp-=d;q(pre+i,(d<0?'+':'-')+Math.abs(d)+(cr?'!':'')+wk,k);if(d>0)hits.add(pre+i);
  if(d>0&&t.gim==='rage'&&t.hp>0){const a=Math.round(t.base*(2-Math.max(0,t.hp)/t.max));if(a>t.atk){t.atk=a;q(pre+i,'ATK ↑','g')}}}""")
# enemy turn: storm breath; round start: raise dead
rep("""      const j=foePick();if(j<0)break;my.log=`${C[e.id].n} โจมตี ${C[my.al[j].id].n}`;draw();""","""      if(e.gim==='breath'&&my.round%3===0){const L=my.al.map((x,k)=>x.hp>0?k:-1).filter(k=>k>=0);if(!L.length)break;my.log=`${C[e.id].n}: ${T(GIM.breath[0],GIM.breath[1])}`;draw();FK=null;await strike('e'+i,e.id,L.map(k=>'a'+k),-1);if(bt!==my)return;
        hitM=!!C[e.id].m;hitA=e.atk;L.forEach(k=>{const [d,cr]=roll(e,.6);hurt(my.al,'a',k,d,'d',cr)});quake=true;draw();await W(440);if(bt!==my)return;continue}
      const j=foePick();if(j<0)break;my.log=`${C[e.id].n} โจมตี ${C[my.al[j].id].n}`;draw();""")
rep("my.round++;my.al.forEach(x=>{x.done=false});my.en.forEach(x=>{x.done=false});","my.round++;my.al.forEach(x=>{x.done=false});my.en.forEach(x=>{x.done=false});twRound(my);")
rep("async function finish(won){\n  const my=bt;busy=true;","async function finish(won){\n  if(bt&&bt.tw)return twFinish(won);\n  const my=bt;busy=true;")
# input
rep("  else if(a==='prep'){loop=0;if(bt&&bt.pvp)","  else if(a==='prep'){loop=0;if(bt&&bt.tw)return twLeave();if(bt&&bt.pvp)")
rep("else if(a==='spd'){S.spd=S.spd===2?1:2;save();if(!busy)draw()}","else if(a==='spd'){S.spd=S.spd===2?1:2;save();if(!busy&&bt)draw()}")
rep("  else if(a==='coll')coll();","""  else if(a==='coll')coll();
  else if(a==='tower'){twTab=twTab==='team'?'board':twTab;tower()}
  else if(a==='twtab'){twTab=t.dataset.t;tower()}
  else if(a==='twref'){twFetch(twWeek());tower()}
  else if(a==='twpick'){const k=S.team.indexOf(id);if(k>=0)S.team.splice(k,1);else if(S.team.length<3)S.team.push(id);save();const m=document.querySelector('.main'),y=m?m.scrollTop:0;tower();const n=document.querySelector('.main');if(n)n.scrollTop=y}
  else if(a==='twgo')twEnter();
  else if(a==='twstop')twLeave();
  else if(a==='twdev'){if(isDev()){const tt=twGet(),d=t.dataset.d;if(d==='week'){tt.w-=1;pvGet().sw=twWeek()-1;save();twRoll();return home()}tt.f=Math.max(0,tt.f+ +d);tt.pf=Math.min(tt.pf||0,tt.f);save()}tower()}
  else if(a==='mail')mailbox();
  else if(a==='mailget'){const g=mailTake(t.dataset.id);if(g){save();cloudFlush();sfx('win');pvpPush()}mailbox(g)}
  else if(a==='mailall'){let g=[];[...(S.mail||[])].forEach(m=>{g=g.concat(mailTake(m.id)||[])});save();cloudFlush();sfx('win');pvpPush();mailbox(g)}
  else if(a==='shpick'){const nm=$('nm');if(nm)S.me.name=(nm.value.trim()||'ผู้เล่น').slice(0,12);S.shp=S.shp===t.dataset.c?'':shOk(t.dataset.c);save();pvpPush();const m=document.querySelector('.main'),y=m?m.scrollTop:0;charMake();const n=document.querySelector('.main');if(n)n.scrollTop=y}""")
# season number follows the week
rep("const PV_SEASON={n:1,name:'CBT Season'};","const PV_SEASON={get n(){return twSeason(twWeek())},name:'CBT Season'};")
# wipe keeps shields
rep("['lang','snd','sfx','spd','fd','fdg'].forEach(k=>{if(s[k]!=null)n[k]=s[k]});","['lang','snd','sfx','spd','fd','fdg','sh','shp'].forEach(k=>{if(s[k]!=null)n[k]=s[k]});{const m=(s.mail||[]).filter(x=>x&&x.it&&x.it.sh).map(x=>({...x,it:{sh:x.it.sh}}));if(m.length)n.mail=m}   // b167: season shields are Limited too, also the ones still waiting in the mailbox")
# dev account shows every shield
rep("if(!S.fd||!S.fdg){S.fd=1;S.fdg=1;ch=1}","if(!S.fd||!S.fdg){S.fd=1;S.fdg=1;ch=1}['T1.1','T2.1','T3.1','P5.1','P3.1'].forEach(c=>{if(!(S.sh||[]).includes(c)){shAdd(c);ch=1}});")
# arena doc and trade room carry the shown shield
rep("set({name:S.me.name,look:S.me.look,fd:S.fd?1:0,team:myDef(),","set({name:S.me.name,look:S.me.look,fd:S.fd?1:0,sh:shMine(),team:myDef(),")
rep("return{uid,fd:!!d.fd,name:String(d.name||'Player').slice(0,12),","return{uid,fd:!!d.fd,sh:shOk(d.sh),name:String(d.name||'Player').slice(0,12),")
rep("<td><b>${esc(o.name)}</b>${o.fd?' '+fdBadge(84):''}</td><td>${tierTag(o.st)}</td>","<td><span class=\"twn\"><b>${esc(o.name)}</b>${shBadge(o.sh,22)}${o.fd?fdBadge(84):''}</span></td><td>${tierTag(o.st)}</td>")
rep("<span>${S.fd?fdBadge():''}${esc(S.me.name)}</span><span>${bt.pvp.fd?fdBadge():''}${esc(bt.pvp.name)}</span>","<span>${shBadge(shMine(),30)}${S.fd?fdBadge():''}${esc(S.me.name)}</span><span>${shBadge(bt.pvp.sh,30)}${bt.pvp.fd?fdBadge():''}${esc(bt.pvp.name)}</span>")
rep("rt.me.update({n:S.me.name,l:S.me.look,f:S.fd?1:0,","rt.me.update({n:S.me.name,l:S.me.look,f:S.fd?1:0,s:shMine(),r:rankOf(pvGet().st).i,")
rep("if(c.fd)b.insertAdjacentHTML('beforeend',fdBadge());","if(c.fd)b.insertAdjacentHTML('beforeend',fdBadge());{const h=(c.rk!=null?`<img class=\"rkm\" src=\"rk/${c.rk}.webp\" alt=\"\">`:'')+shBadge(c.sh,19);if(h)b.insertAdjacentHTML('beforeend','<span class=\"avs nt\">'+h+'</span>')}")
rep("mk(Object.assign(R.me,{name:S.me.name,look:S.me.look,fd:!!S.fd}),'me',{tabindex:-1});","mk(Object.assign(R.me,{name:S.me.name,look:S.me.look,fd:!!S.fd,sh:shMine(),rk:rankOf(pvGet().st).i}),'me',{tabindex:-1});")
rep("ids.forEach(u=>{const o=data[u],look=C[o.l]?o.l:GIFT[0],","ids.forEach(u=>{const o=data[u],sh=shOk(o.s),rk=Number.isInteger(o.r)&&o.r>=0&&o.r<TIERS.length?o.r:null,look=C[o.l]?o.l:GIFT[0],")
rep("    if(n&&!!n.fd!==!!o.f){n.el.remove();R.npcs=R.npcs.filter(x=>x!==n);n=null}\n    if(!n){n={uid:u,name,look,fd:!!o.f,x:tx,y:ty};","    if(n&&(!!n.fd!==!!o.f||n.sh!==sh||n.rk!==rk)){n.el.remove();R.npcs=R.npcs.filter(x=>x!==n);n=null}\n    if(!n){n={uid:u,name,look,fd:!!o.f,sh,rk,x:tx,y:ty};")
# lobby
rep("giftTake();bcLate();news165();vipDaily();","giftTake();bcLate();twRoll();news167()||news165();vipDaily();")
rep("""<b class="nt">${S.me.name.replace(/</g,'&lt;')}</b><small class="nt">${isDev()?""","""<b class="nt">${S.me.name.replace(/</g,'&lt;')}${shBadge(shMine(),18)}</b><small class="nt">${isDev()?""")
rep("""    <button class="ibtn dcb" data-act="discord" title="Discord" aria-label="Discord">${DC_SVG}</button>""","""    <button class="ibtn mailb nt" data-act="mail" title="${T('กล่องจดหมาย','Mailbox')}" aria-label="Mailbox">📬<i class="badge" id="mailbdg" ${mailN()?'':'hidden'}>${mailN()}</i></button>
    <button class="ibtn dcb" data-act="discord" title="Discord" aria-label="Discord">${DC_SVG}</button>""")
rep("""     <button class="play" data-act="prep">""","""     <button class="twb nt" data-act="tower">${shBadge('T1.'+twSeason(twWeek()),34)}<span><b>TOWER</b><small>SEASON ${twSeason(twWeek())} · ${T('ชั้น','floor')} ${twGet().f}${twRank()?' · #'+twRank():''} · ${T('เหลือ','ends in')} ${twLeft()}</small></span></button>
     <button class="play" data-act="prep">""")
# profile: shown shield on the card, the shield cabinet under it
rep("""<div class="rk">${r.t[0]} ${DIVS[r.d]}</div>${starRow(me.st)}</div>""","""<div class="rk">${r.t[0]} ${DIVS[r.d]}</div>${starRow(me.st)}${shMine()?`<div class="pcsh">${shBadge(shMine(),46)}<small>${shName(shMine())}</small></div>`:''}</div>""")
rep("""<div class="main">${pcard()}<div class="chgrid">""","""<div class="main">${pcard()}<div class="shbox nt"><h3>🛡 ${T('ตู้โล่','Shield cabinet')} (${(S.sh||[]).length})</h3><p class="sub">${T('โล่ Limited จากอันดับหอคอยและแร้งค์ PvP ประจำซีซั่น · แตะเพื่อเลือกใบที่โชว์ข้างชื่อ (แตะซ้ำเพื่อไม่โชว์) · ผูกบัญชี เทรดไม่ได้ ไม่ถูกล้างเมื่อจบ CBT','Limited shields from tower ranks and PvP seasons · tap one to show it beside your name (tap again to hide it) · account-bound, cannot be traded, not wiped when the CBT ends')}</p>
      ${(S.sh||[]).length?`<div class="shgrid">${[...S.sh].reverse().map(c=>shOk(c)?`<button class="shb ${shMine()===c?'on':''}" data-act="shpick" data-c="${c}">${shBadge(c,56)}<small>${shName(c)}</small></button>`:'').join('')}</div>`:`<p class="sub" style="opacity:.8">${T('ยังไม่มีโล่ · ติดอันดับ 1–3 ของหอคอย หรือลงแข่ง PvP ให้จบซีซั่น','No shields yet · reach the tower top 3 or play PvP through a season')}</p>`}</div><div class="chgrid">""")
# main block
rep("/* ---------- how to play: every number here is read from the game's own tables",JS+"\n/* ---------- how to play: every number here is read from the game's own tables")
open(p,'w',encoding='utf8').write(s);print('ok',len(s))
