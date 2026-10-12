// Chapter 2 balance: teams camp stages FROM..TO with retries (soft walls emulated), realm rules on
const {chromium}=require('playwright');(async()=>{const b=await chromium.launch({executablePath:'/opt/pw-browsers/chromium'});
const arg=JSON.parse(process.argv[2]||'{}');const p=await b.newPage();p.on('pageerror',e=>console.log('ERR',e.message));
await p.goto('file:///home/claude/pixeldeck/_t.html');await new Promise(r=>setTimeout(r,700));
const out=await p.evaluate((arg)=>{USER={name:'g'};S=unlock(fresh());if(arg.eval)eval(arg.eval);
 const one=(n,team,mul)=>{bt={n,round:1,sel:0,log:'',rule:ruleOf(n),surv:stKind(n)==='surv',al:team.map(id=>fighter(id,S.cards[id].lv)),en:stageDef(n).map(e=>{const hp=Math.max(1,Math.round(e.hp*mul)),atk=Math.max(1,Math.round(e.atk*mul));return{...e,atk,base:atk,hp,max:hp}})};
  for(let r=1;r<=60;r++){for(const a of bt.al){if(a.hp<=0||a.done)continue;tauntTick(a);const k=autoPick(a),ti=autoT();if(ti<0)break;cast(a,k,ti);fx.length=0;hits.clear();if(bt.en.every(e=>e.hp<=0))return [r,starsOf(bt)]}
   for(const e of bt.en){if(e.hp<=0)continue;if(e.frz){e.frz=0;continue}
     if(e.gim==='breath'&&bt.round%3===0){hitM=!!C[e.id].m;hitA=e.atk;bt.al.forEach((x,k)=>{if(x.hp>0){const [d,cr]=roll(e,.6);hurt(bt.al,'a',k,d,'d',cr)}});fx.length=0;hits.clear();continue}
     const j=foePick();if(j<0)break;foeHit(e,j);fx.length=0;hits.clear()}
   if(bt.al.every(x=>x.hp<=0))return [-r,0];bt.round++;bt.al.forEach(x=>x.done=false);bt.en.forEach(x=>x.done=false);twRound(bt);if(bt.surv&&bt.round>5)return [r,starsOf(bt)];s4Round(bt);if(bt.en.every(e=>e.hp<=0))return [r,starsOf(bt)];if(bt.al.every(x=>x.hp<=0))return [-r,0];rlmRound(bt);fx.length=0;hits.clear()}return [-99,0]};
 const camp=(team,tries,from,to)=>{let n=from,first=0,tot=0,st=0;for(;n<=to;n++){let ok=false,k=0;for(;k<tries;k++){const [r,s]=one(n,team,(1-Math.min(.12,.04*k))*(.9+.2*Math.random()));if(r>0){ok=true;st+=s;break}}if(!ok&&arg.skipLord&&n%100===0){ok=true;arg.lf=(arg.lf||'')+n+' '}if(!ok)break;tot++;if(!k)first++}return{end:n-1,first:Math.round(100*first/Math.max(1,tot)),stars:+(st/Math.max(1,tot)).toFixed(2)}};
 const T={L:['h15','h13','h26'],Ls:['h15','h04','h26'],La:['h13','h14','h26'],SL:['h03','h22','h27'],SLp:['h03','h22','h07'],LT:['h03','h22','h27']};
 const res={};for(const k of arg.teams){const [nm,star,am]=k.split(':');const team=T[nm];S.cards={};team.forEach(id=>{S.cards[id]={lv:1,exp:0,star:+star||0};S.cards[id].lv=capOf(id);if(am)S.cards[id].am=am});S.am={};if(am)S.am[am]=3;S.team=team;
  const E=[],F=[],ST=[];arg.lf='';for(let i=0;i<(arg.R||3);i++){const c=camp(team,arg.tries||10,arg.from||501,arg.to||1100);E.push(c.end);F.push(c.first);ST.push(c.stars)}E.sort((a,b)=>a-b);
  res[k]=(arg.lf?'lordfail '+arg.lf+' | ':'')+`lv ${S.cards[team[0]].lv} end ${E[0]}-${E[E.length-1]} mid ${E[E.length>>1]} · first-try ${Math.round(F.reduce((a,b)=>a+b)/F.length)}% · stars/stage ${(ST.reduce((a,b)=>a+b)/ST.length).toFixed(2)}`}
 return JSON.stringify(res,null,1)},arg);
console.log(out);await b.close()})()
