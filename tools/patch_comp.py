import sys
def game(p,build):
    s=open(p,encoding='utf8').read()
    def rep(x,y):
        nonlocal s
        assert s.count(x)==1,(p,x[:60],s.count(x));s=s.replace(x,y)
    rep("function giftTake(){","""// b169 compensation from the owner (admin page): config/main.comp[<player id>] = {id, cards:[{id,lv,star}], am:{<amulet>:n}, gold, dia, note}.
// Taken once per id (S.cpd). A card the player lacks is added at that level and stars; one they own is raised to at least that level and those stars. Everything is clamped to what the game allows.
function compTake(){const all=CFG.comp;if(!all||!mkOn()||S.tut!=null||bt)return;const c=all[USER.sub];if(!c||!c.id)return;S.cpd=S.cpd||[];if(S.cpd.includes(c.id))return;const got=[];
  (Array.isArray(c.cards)?c.cards:[]).slice(0,60).forEach(x=>{const id=x&&x.id;if(!C[id]||C[id].mon)return;const st=Math.max(0,Math.min(5,x.star|0));if(!S.cards[id]){S.cards[id]={lv:1,exp:0};clAdd(id,'comp')}const o=S.cards[id];
    if(st>starOf(id))o.star=st;const lv=Math.max(1,Math.min(capOf(id),x.lv|0));if(lv>o.lv){o.lv=lv;o.exp=0}got.push(`<span class="pvc r-${C[id].r}" style="width:34px;display:inline-block;vertical-align:middle">${art(id)}</span> <b class="r-${C[id].r}" style="color:var(--gl)">${C[id].n}</b> Lv ${o.lv}${starOf(id)?' ★'+starOf(id):''}`)});
  Object.keys(c.am&&typeof c.am==='object'?c.am:{}).forEach(k=>{const n=Math.max(0,Math.min(999,c.am[k]|0));if(!AM[k]||!n)return;S.am=S.am||{};S.am[k]=(S.am[k]||0)+n;got.push(`${T('เครื่องราง','Amulet')} <b>${AM[k].n}</b> ×${n}`)});
  const g=Math.max(0,Math.min(1e8,Math.floor(+c.gold||0))),d=Math.max(0,Math.min(1e6,Math.floor(+c.dia||0)));if(g){S.gold+=g;lg('comp',g);got.push(`<b class="gold">Gold +${g.toLocaleString('en')}</b>`)}if(d){S.dia=(S.dia||0)+d;got.push(`<b style="color:#6fd8ff">💎 +${d.toLocaleString('en')}</b>`)}
  S.cpd.push(c.id);if(S.cpd.length>30)S.cpd.shift();save();cloudFlush();if(!got.length)return;
  setTimeout(()=>{sfx('win');ov(`<div class="cd dlg nt"><div class="px cdbox swbox"><b>🎁 ${T('ของชดเชยจากทีมงาน','A gift from the team')}</b>${c.note?`<p style="margin:0">${esc(String(c.note).slice(0,200))}</p>`:''}<div class="newsl">${got.map(x=>`<span>${x}</span>`).join('')}</div><div class="row"><button class="btn go" data-lp="no">${T('รับทราบ','OK')}</button></div></div></div>`)},600)}
function giftTake(){""")
    rep("giftTake();bcLate();","giftTake();compTake();bcLate();")
    import re
    m=re.search(r"const BUILD='b\d+'",s);s=s.replace(m.group(0),"const BUILD='%s'"%build)
    open(p,'w',encoding='utf8').write(s)
def admin(p):
    s=open(p,encoding='utf8').read()
    def rep(x,y):
        nonlocal s
        assert s.count(x)==1,(p,x[:60],s.count(x));s=s.replace(x,y)
    rep("pv:s.pv||{},","cpd:Array.isArray(s.cpd)?s.cpd:[],pv:s.pv||{},")
    rep("""  <div class="card" style="border-color:${ban?'var(--gr)':'var(--rd)'}"><h3>${ban?'ปลดระงับบัญชี':'ระงับบัญชี'}</h3>""","""  ${compCard(p)}
  <div class="card" style="border-color:${ban?'var(--gr)':'var(--rd)'}"><h3>${ban?'ปลดระงับบัญชี':'ระงับบัญชี'}</h3>""")
    rep("  if($('ban'))$('ban').onclick=","  compWire(p);\n  if($('ban'))$('ban').onclick=")
    rep("function plOne(id){","""// Compensation (b169): the owner ticks cards (level, stars), amulets (amount), Gold and diamonds for ONE player and sends them in one go.
// It is stored at config/main.comp[<player id>]; that player's game takes it once on the lobby screen. One waiting parcel per player: sending again replaces a parcel not yet taken.
const CAPS={ST:8,C:15,UC:25,R:38,L:90,SL:190,LT:190},capOf=(c,st)=>{const cap=CAPS[(CARDS[c]||[])[1]]||1;return cap+Math.max(1,Math.round(cap*.03))*st};
function compCard(p){const cur=(cfg.comp||{})[p.id],done=cur&&p.cpd.includes(cur.id),ids=Object.keys(CARDS).sort((a,b)=>RK.indexOf(CARDS[a][1])-RK.indexOf(CARDS[b][1])||CARDS[a][0].localeCompare(CARDS[b][0]));
  const sum=c=>[(c.cards||[]).map(x=>`${esc((CARDS[x.id]||[x.id])[0])} Lv${x.lv} ★${x.star}`).join(', '),Object.keys(c.am||{}).map(k=>`${esc((AMS[k]||[k])[0])} ×${c.am[k]}`).join(', '),c.gold?'Gold '+N(c.gold):'',c.dia?'เพชร '+N(c.dia):''].filter(Boolean).join(' · ');
  return `<div class="card" style="border-color:var(--gd)"><h3>🎁 ส่งของชดเชยให้ ${esc(p.name)}</h3>
   ${cur?`<p style="margin:0 0 8px"><span class="chip ${done?'g2':''}">${done?'ผู้เล่นรับแล้ว':'รอผู้เล่นเข้าเกมมารับ'}</span> ส่งเมื่อ ${dt(cur.at)}: ${sum(cur)}${cur.note?' · ข้อความ: '+esc(cur.note):''} <button class="b s" id="cpdel" style="margin-left:6px">${done?'ล้างรายการ':'ยกเลิกการส่ง'}</button></p>${done?'':'<p class="mu" style="font-size:12.5px;margin:0 0 8px">ถ้าส่งใหม่ตอนนี้ ของชุดที่ยังไม่ได้รับจะถูกแทนที่ด้วยชุดใหม่</p>'}`:''}
   <label>การ์ด (ติ๊กใบที่จะส่ง · ถ้าผู้เล่นมีใบนั้นอยู่แล้ว จะถูกยกเลเวลและดาวขึ้นให้ไม่ต่ำกว่าที่ใส่)</label>
   <div class="tw" style="max-height:340px;overflow:auto"><table><tr><th></th><th>การ์ด</th><th>ระดับ</th><th>เลเวล</th><th>ดาว</th><th>ที่มีอยู่</th></tr>${ids.map(c=>{const o=p.cards[c],cap=capOf(c,0);return `<tr><td><input type="checkbox" class="cpc" data-c="${c}" style="width:22px;height:22px"></td><td><b>${esc(CARDS[c][0])}</b></td><td>${CARDS[c][1]}</td><td><input type="number" class="cpl" data-c="${c}" min="1" max="${capOf(c,5)}" value="${cap}" style="width:74px"></td><td><select class="cps" data-c="${c}">${[0,1,2,3,4,5].map(n=>`<option>${n}</option>`).join('')}</select></td><td class="mu">${o?'Lv '+(o.lv||1)+' ★'+(o.star||0):'-'}</td></tr>`}).join('')}</table></div>
   <label style="margin-top:10px">เครื่องราง (ใส่จำนวน · 0 คือไม่ส่ง)</label>
   <div class="tw"><table><tr><th>เครื่องราง</th><th>ระดับ</th><th>จำนวน</th><th>ที่มีอยู่</th></tr>${Object.keys(AMS).map(k=>`<tr><td><b>${esc(AMS[k][0])}</b></td><td>${AMS[k][1]}</td><td><input type="number" class="cpa" data-k="${k}" min="0" max="999" value="0" style="width:84px"></td><td class="mu">${N(p.am[k]||0)}</td></tr>`).join('')}</table></div>
   <div class="fl" style="margin-top:10px;align-items:end"><span><label>Gold</label><input type="number" id="cpg" min="0" value="0" style="width:140px"></span><span><label>เพชร</label><input type="number" id="cpd" min="0" value="0" style="width:120px"></span></div>
   <label>ข้อความถึงผู้เล่น (ไม่บังคับ)</label><input id="cpn" maxlength="200" placeholder="เช่น ชดเชยกรณีเซฟถูกทับ ขออภัยในความไม่สะดวก">
   <button class="b g" id="cpgo" style="margin-top:10px">ส่งของชดเชย</button>
   <p class="mu" style="font-size:12.5px;margin:8px 0 0">ผู้เล่นได้รับเมื่อเปิดหน้าล็อบบี้ (เกมเช็กการตั้งค่าใหม่ทุกราว 10 นาที หรือทันทีเมื่อเข้าเกมใหม่) รับได้ครั้งเดียวต่อการส่ง 1 ครั้ง · เลเวลที่เกินเพดานของดาวที่เลือกจะถูกปรับลงเอง · ใช้ได้กับเกม b169 ขึ้นไป · ทุกการส่งถูกบันทึกในประวัติแอดมิน</p></div>`}
function compWire(p){const id=p.id;if($('cpdel'))$('cpdel').onclick=()=>{if(!confirm('ลบรายการของชดเชยนี้ ?'))return;db.collection('config').doc('main').update({['comp.'+id]:FV.delete()}).then(()=>{logIt({t:'compdel',to:id});return loadCfg()}).then(()=>{plOne(id);say('ลบแล้ว')}).catch(fail)};
  if(!$('cpgo'))return;$('cpgo').onclick=()=>{const cards=[...document.querySelectorAll('.cpc')].filter(x=>x.checked).map(x=>{const c=x.dataset.c,star=Math.max(0,Math.min(5,+document.querySelector(`.cps[data-c="${c}"]`).value||0)),lv=Math.max(1,Math.min(capOf(c,star),Math.floor(+document.querySelector(`.cpl[data-c="${c}"]`).value||1)));return{id:c,lv,star}});
   const am={};document.querySelectorAll('.cpa').forEach(x=>{const n=Math.max(0,Math.min(999,Math.floor(+x.value||0)));if(n)am[x.dataset.k]=n});const gold=Math.max(0,Math.min(1e8,Math.floor(+$('cpg').value||0))),dia=Math.max(0,Math.min(1e6,Math.floor(+$('cpd').value||0))),note=$('cpn').value.trim().slice(0,200);
   if(!cards.length&&!Object.keys(am).length&&!gold&&!dia)return say('ยังไม่ได้เลือกของที่จะส่ง','er');
   const txt=[cards.map(x=>CARDS[x.id][0]+' Lv'+x.lv+' ★'+x.star).join('\\n'),Object.keys(am).map(k=>AMS[k][0]+' ×'+am[k]).join('\\n'),gold?'Gold '+N(gold):'',dia?'เพชร '+N(dia):''].filter(Boolean).join('\\n');
   if(!confirm('ส่งให้ '+p.name+' ?\\n\\n'+txt))return;const c={id:Date.now().toString(36)+Math.random().toString(36).slice(2,6),at:Date.now(),cards,am,gold,dia,note};
   db.collection('config').doc('main').set({comp:{[id]:c}},{merge:true}).then(()=>{logIt({t:'comp',to:id,name:p.name,note:txt.replace(/\\n/g,', ')});return loadCfg()}).then(()=>{plOne(id);say('ส่งแล้ว ผู้เล่นจะได้รับเมื่อเข้าล็อบบี้')}).catch(fail)}}
function plOne(id){""")
    rep("const LGI={","const LGI={comp:'ของชดเชยจากแอดมิน',")
    rep("const SRN={","const SRN={comp:'ของชดเชยจากแอดมิน',")
    open(p,'w',encoding='utf8').write(s)
game('bit8-clash.html','b169');admin('admin.src.html')
game('bit8-tower-wip.html','b170');admin('admin-wip.src.html')
print('ok')
