F='bit8-clash.html';s=open(F,encoding='utf8').read()
def rep(a,b,n=1):
    global s
    assert s.count(a)==n,(a[:80],s.count(a));s=s.replace(a,b)
rep("BUILD='b171'","BUILD='b172'")
# --- skills: nothing wastes a turn ---
rep("needT=sk=>['hit','exec','drain','sure'].includes(sk[2]),isAtk=sk=>['hit','exec','drain','sure','aoe'].includes(sk[2]);",
    "needT=sk=>['hit','exec','drain','sure','buff','rally','guard'].includes(sk[2]),isAtk=sk=>['hit','exec','drain','sure','aoe','buff','rally','guard'].includes(sk[2]);\n// b172 support skills also strike in the same turn (buff 100%, rally 80%, guard 60% of ATK), so no skill costs a turn of damage; an area attack on a lone foe hits 1.5x\nconst SK_HIT={buff:1,rally:.8,guard:.6},AOE_LONE=1.5,ULT_CD0=1;")
rep("guard:`สร้างโล่ให้ตัวเอง ${pc(v)} ของ HP สูงสุด ล่อศัตรูให้ตีตัวเอง 2 รอบ และรับดาเมจลดลง 40%`,shieldall:`สร้างโล่ให้ทั้งทีม ${pc(v)} ของ HP สูงสุดของผู้ใช้`,buff:`พลังโจมตีของตัวเองเพิ่มเป็น ${pc(v)} จนจบด่าน`,rally:`พลังโจมตีของทั้งทีมเพิ่มเป็น ${pc(v)} จนจบด่าน`})[t];",
    "guard:`สร้างโล่ให้ตัวเอง ${pc(v)} ของ HP สูงสุด ล่อศัตรูให้ตีตัวเอง 2 รอบ และรับดาเมจลดลง 40% แล้วโจมตี ${pc(SK_HIT.guard)} ของ ATK`,shieldall:`สร้างโล่ให้ทั้งทีม ${pc(v)} ของ HP สูงสุดของผู้ใช้`,buff:`พลังโจมตีของตัวเองเพิ่มเป็น ${pc(v)} จนจบด่าน แล้วโจมตีทันที ${pc(SK_HIT.buff)} ของ ATK`,rally:`พลังโจมตีของทั้งทีมเพิ่มเป็น ${pc(v)} จนจบด่าน แล้วโจมตี ${pc(SK_HIT.rally)} ของ ATK`})[t]+(t==='aoe'?` (เหลือศัตรูตัวเดียว แรง ${AOE_LONE} เท่า)`:t==='heal'||t==='healall'?' (ส่วนที่เกิน HP เต็มกลายเป็นโล่)':'');")
rep("hb:v.hb,sh:0,done:false,cds:[0,0,2]}};","hb:v.hb,sh:0,done:false,cds:[0,0,ULT_CD0]}};")
rep("function mend(j,amt){const x=SD.A[j],h=Math.min(Math.round(amt),x.max-x.hp);if(h>0)hurt(SD.A,SD.ap,j,-h,'g')}",
    "function mend(j,amt,over){const x=SD.A[j],h=Math.min(Math.round(amt),x.max-x.hp);if(h>0)hurt(SD.A,SD.ap,j,-h,'g');if(over&&Math.round(amt)-Math.max(0,h)>0)ward(j,Math.round(amt)-Math.max(0,h))}   // over: healing past full HP becomes shield (heal skills only)")
rep("  else if(type==='aoe'){let sum=0;SD.F.forEach((e,j)=>{if(e.hp>0){const [d,cr]=roll(a,v);sum+=d;hurt(SD.F,SD.fp,j,d,'d',cr)}});if(C[a.id].ls&&a.hp>0)mend(ai,sum*C[a.id].ls)}",
    "  else if(type==='aoe'){let sum=0;const lone=SD.F.filter(e=>e.hp>0).length===1?AOE_LONE:1;SD.F.forEach((e,j)=>{if(e.hp>0){const [d,cr]=roll(a,v*lone);sum+=d;hurt(SD.F,SD.fp,j,d,'d',cr)}});if(C[a.id].ls&&a.hp>0)mend(ai,sum*C[a.id].ls)}")
rep("mend(b,a.atk*v*a.hb)}\n  else if(type==='healall')SD.A.forEach((x,j)=>{if(x.hp>0)mend(j,a.atk*v*a.hb)});",
    "mend(b,a.atk*v*a.hb,1)}\n  else if(type==='healall')SD.A.forEach((x,j)=>{if(x.hp>0)mend(j,a.atk*v*a.hb,1)});")
rep("  else if(type==='buff')pump(a,ai,v);\n  else if(type==='rally')SD.A.forEach((x,j)=>{if(x.hp>0)pump(x,j,v)});",
    "  else if(type==='buff')pump(a,ai,v);\n  else if(type==='rally')SD.A.forEach((x,j)=>{if(x.hp>0)pump(x,j,v)});\n  if(SK_HIT[type]&&t&&t.hp>0&&a.hp>0){hitA=a.atk;const [d,cr]=roll(a,SK_HIT[type]);hurt(SD.F,SD.fp,ti,d,'d',cr);if(C[a.id].ls)mend(ai,d*C[a.id].ls)}")
# needT path for buff etc: the first branch handles hit types only; make sure buff/guard/rally skip it
rep("  if(needT(sk)){\n    const [d,cr]=roll(a,","  if(['hit','exec','drain','sure'].includes(type)){\n    const [d,cr]=roll(a,")
# --- auto: think before pressing ---
i=s.index("function autoPick(a,mine=true){");j=s.index("function autoAct(){",i)
s=s[:i]+"""// b172 auto: a skill is used only when it does something now. Basic attack when it finishes the target and nothing better is ready; area attacks on 2+ foes;
// finishers on a wounded target; heals when an ally is under half (the tank under 60%); a taunt only when nobody is taunting; buffs while the fight still has turns left.
function autoPick(a,mine=true){const A=mine?bt.al:bt.en,F=mine?bt.en:bt.al,nF=F.filter(x=>x.hp>0).length;if(!nF)return 0;
  const ti=mine?autoT():foePick(),t=F[ti];if(!t)return 0;const dmg=v=>a.atk*v*a.atk/(a.atk+(t.def||0)),kills=v=>dmg(v)>=t.hp+(t.sh||0),long=nF>=2||!kills(2.2);
  const low=A.some(x=>x.hp>0&&(x.hp<x.max*.5||(x.taunt&&x.hp<x.max*.6)));
  for(const j of[2,1]){if(a.cds[j])continue;const [, ,ty,v]=SK[a.id][j];
    if(ty==='heal'||ty==='healall'){if(low)return j}
    else if(ty==='shieldall'){if(A.filter(x=>x.hp>0&&!(x.sh>x.max*.1)).length>=2&&(bt.round<=2||low))return j}
    else if(ty==='guard'){if(!A.some(x=>x.hp>0&&x.taunt))return j}
    else if(ty==='buff'){if(a.atk<a.base*1.99&&long)return j}
    else if(ty==='rally'){if(A.some(x=>x.hp>0&&x.atk<x.base*1.99)&&long)return j}
    else if(ty==='aoe'){if(nF>=2||!kills(1))return j}
    else if(ty==='exec'){if(t.hp<=t.max/2||!kills(1))return j}
    else if(!kills(1))return j}
  return 0}
"""+s[j:]
open(F,'w',encoding='utf8').write(s);print('ok')
