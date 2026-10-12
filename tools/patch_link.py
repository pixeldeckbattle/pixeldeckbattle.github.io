F='bit8-clash.html';s=open(F,encoding='utf8').read()
def rep(a,b,n=1):
    global s
    assert s.count(a)==n,(a[:70],s.count(a));s=s.replace(a,b)
rep("BUILD='b170'","BUILD='b171'")
# settings: link button for guests
rep("""    <p class="sub">${USER&&USER.sub?'เซฟเก็บบนคลาวด์ตามบัญชี Google เปลี่ยนเครื่องแล้วเล่นต่อได้':'Guest เก็บเซฟในเครื่องนี้เท่านั้น ล็อกอิน Google เพื่อเก็บเซฟบนคลาวด์'}</p>""","""    <p class="sub">${USER&&USER.sub?'เซฟเก็บบนคลาวด์ตามบัญชี Google เปลี่ยนเครื่องแล้วเล่นต่อได้':'Guest เก็บเซฟในเครื่องนี้เท่านั้น ล็อกอิน Google เพื่อเก็บเซฟบนคลาวด์'}</p>
    ${USER&&!USER.sub?`<div class="row"><span style="flex:1" class="nt">${T('ผูกตัวนี้กับบัญชี Google','Link this player to Google')}<br><small class="sub">${T('ย้ายตัว Guest นี้ขึ้นคลาวด์ เล่นข้ามเครื่องได้ ขึ้นอันดับและเจอผู้เล่นจริง','Move this guest player to the cloud: play on any device, join the rankings, meet real players')}</small></span><button class="btn go sm nt" data-act="glink" ${FB_CFG?'':'disabled'}>${T('ผูกบัญชี','Link')}</button></div>`:''}""")
rep("  else if(a==='glogin')gLogin()","  else if(a==='glogin')gLogin()\n  else if(a==='glink')gLinkAsk()")
# the link flow
rep("function signIn(u){","""// b171 link a guest player to a Google account. Only into an account that has never played (no save in the cloud or on this device), so nothing is ever overwritten.
// The guest save on this device is then removed, so one guest player cannot be copied into several accounts. A linked save carries lnk (shown on the admin page).
let glPend=null;
const glBox=(h,btns)=>ov(`<div class="cd dlg nt"><div class="px cdbox"><b>🔗 ${T('ผูกบัญชี Google','Link a Google account')}</b><p>${h}</p>${btns?`<div class="row">${btns}</div>`:''}</div></div>`);
function gLinkAsk(){if(!FB_CFG||!USER||USER.sub)return;try{fbLoad().catch(()=>{})}catch(e){}
  glBox(T('ย้ายตัวที่เล่นแบบ Guest อยู่ตอนนี้ (การ์ด เครื่องราง Gold เพชร ด่านที่ผ่าน) เข้าบัญชี Google เซฟจะเก็บบนคลาวด์ เปลี่ยนเครื่องก็เล่นต่อได้<br><small>ใช้ได้กับบัญชี Google ที่ยังไม่เคยเล่นเกมนี้เท่านั้น ถ้าบัญชีนั้นมีเซฟอยู่แล้ว ระบบจะไม่ทับ · ผูกแล้วตัว Guest ในเครื่องนี้จะย้ายเข้าบัญชีไปเลย</small>','Move the player you are using as a guest (cards, amulets, Gold, diamonds, stages) into a Google account. The save then lives in the cloud and follows you to any device.<br><small>Only for a Google account that has never played this game; an account that already has a save is never overwritten · after linking, the guest player on this device moves into the account</small>'),
   `<button class="btn go" data-gl="go">${T('เลือกบัญชี Google','Choose a Google account')}</button><button class="btn alt" data-gl="no">${T('ยกเลิก','Cancel')}</button>`)}
function gLinkGo(){glBox(T('กำลังเชื่อมต่อ…','Connecting…'));
  fbLoad().then(()=>firebase.auth().signInWithPopup(new firebase.auth.GoogleAuthProvider())).then(r=>{const u=r.user,nu={sub:u.uid,name:(u.displayName||'Player').split(' ')[0],email:u.email,pic:u.photoURL};
    return firebase.firestore().collection('saves').doc(u.uid).get().then(d=>{let has=!!d.exists;try{const c=d.exists&&JSON.parse(d.data().data);if(d.exists)has=!!(c&&c.cards)}catch(e){}
      try{const l=JSON.parse(localStorage.getItem(KEY+'_'+u.uid));if(l&&l.cards)has=true}catch(e){}
      if(has){glPend=nu;return glBox(T(`บัญชี <b>${esc(u.email||'')}</b> มีเซฟของเกมนี้อยู่แล้ว จึงผูกไม่ได้ (ระบบไม่ทับข้อมูลเดิม)<br><small>เลือกได้ว่าจะเข้าเล่นบัญชีนั้น หรือกลับไปเล่นตัว Guest ต่อ ตัว Guest ยังอยู่ในเครื่องนี้ครบ</small>`,`The account <b>${esc(u.email||'')}</b> already has a save in this game, so it cannot be linked (nothing is overwritten)<br><small>Play that account instead, or go back to your guest player, which is still on this device</small>`),
        `<button class="btn go" data-gl="use">${T('เข้าเล่นบัญชีนั้น','Play that account')}</button><button class="btn alt" data-gl="stay">${T('กลับไปเล่น Guest','Back to guest')}</button>`)}
      save();S.lnk={at:Date.now()};USER=nu;try{localStorage.setItem(SESSION,JSON.stringify(nu))}catch(e){}save();
      [KEY,KEY+'_bk',KEY+'_rv'].forEach(k=>{try{localStorage.removeItem(k)}catch(e){}});
      ov('');fx.push(['view',T('ผูกบัญชี Google สำเร็จ เซฟขึ้นคลาวด์แล้ว','Linked to Google: your save is now in the cloud'),'g']);signIn(nu)})})
   .catch(e=>{try{firebase.auth().signOut()}catch(x){}glBox(T('ผูกบัญชีไม่สำเร็จ ','Linking failed ')+'<small>'+esc(String(e&&e.code||e&&e.message||''))+'</small>',`<button class="btn alt" data-gl="no">${T('ปิด','Close')}</button>`)})}
$('ov').addEventListener('click',e=>{const t=e.target.closest('[data-gl]');if(!t)return;const a=t.dataset.gl;
  if(a==='go')gLinkGo();else if(a==='use'&&glPend){const u=glPend;glPend=null;ov('');signIn(u)}else{if(a==='stay'){glPend=null;try{firebase.auth().signOut()}catch(x){}}ov('')}});
function signIn(u){""")
rep("T('Guest: เซฟอยู่ในเครื่องนี้เท่านั้น ล้างข้อมูลเบราว์เซอร์แล้วเซฟหาย','Guest: the save stays on this device only and is lost if browser data is cleared')","T('Guest: เซฟอยู่ในเครื่องนี้เท่านั้น ล้างข้อมูลเบราว์เซอร์แล้วเซฟหาย · ย้ายตัว Guest เข้าบัญชี Google ได้ที่ ตั้งค่า → ผูกบัญชี (เฉพาะบัญชี Google ที่ยังไม่เคยเล่น ไม่ทับเซฟเดิม)','Guest: the save stays on this device only and is lost if browser data is cleared · move a guest player into a Google account from Settings → Link (only an account that has never played; no save is overwritten)')")
open(F,'w',encoding='utf8').write(s)
A='admin.src.html';a=open(A,encoding='utf8').read()
x="fd:!!s.fd,";assert a.count(x)==1;a=a.replace(x,"fd:!!s.fd,lnk:!!s.lnk,")
x="${p.fd?' <span class=\"chip g2\">FOUNDER</span>':''}";assert a.count(x)==1,a.count(x);a=a.replace(x,x+"${p.lnk?' <span class=\"chip b2\">ย้ายจาก Guest</span>':''}")
open(A,'w',encoding='utf8').write(a);print('ok')
