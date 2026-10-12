// b172 stage balance: max-level teams camp stages 1..500 with retries (soft walls emulated), on a given build (_old.html / _new.html)
const {chromium}=require('playwright');(async()=>{const b=await chromium.launch({executablePath:'/opt/pw-browsers/chromium'});
const arg=JSON.parse(process.argv[2]||'{}');const p=await b.newPage();p.on('pageerror',e=>console.log('ERR',e.message));
await p.goto('file:///home/claude/pixeldeck/_'+(arg.build||'new')+'.html');await new Promise(r=>setTimeout(r,700));
const out=await p.evaluate((arg)=>{USER={name:'g'};S=unlock(fresh());if(arg.eval)eval(arg.eval);
 const one=(n,team,mul)=>{bt={n,round:1,sel:0,log:'',al:team.map(id=>fighter(id,S.cards[id].lv)),en:stageDef(n).map(e=>{const hp=Math.max(1,Math.round(e.hp*mul));return{...e,atk:Math.max(1,Math.round(e.atk*mul)),hp,max:hp}})};
  for(let r=1;r<=60;r++){for(const a of bt.al){if(a.hp<=0)continue;tauntTick(a);const k=autoPick(a),ti=autoT();if(ti<0)break;cast(a,k,ti);fx.length=0;hits.clear();if(bt.en.every(e=>e.hp<=0))return r}
   for(const e of bt.en){if(e.hp<=0)continue;const j=foePick();if(j<0)break;foeHit(e,j);fx.length=0;hits.clear()}if(bt.al.every(x=>x.hp<=0))return -r;bt.round++;bt.al.forEach(x=>x.done=false)}return -99};
 const camp=(team,tries)=>{let n=1,first=0,tot=0,rounds=0;for(;n<=500;n++){let ok=false,k=0;for(;k<tries;k++){const r=one(n,team,(1-Math.min(.12,.04*k))*(.9+.2*Math.random()));if(r>0){ok=true;rounds+=r;break}}if(!ok)break;tot++;if(!k)first++}return{end:n-1,first:Math.round(100*first/Math.max(1,tot)),rounds:+(rounds/Math.max(1,tot)).toFixed(2)}};
 const T={C:['h17','h01','h23'],UC:['h02','h21','h25'],R:['h05','h09','h08'],L:['h15','h13','h26'],Lp:['h15','h19','h04'],SL:['h03','h22','h27'],SLp:['h03','h22','h07']};
 const res={};for(const k of arg.teams){const [nm,star,am]=k.split(':');const team=T[nm];S.cards={};team.forEach(id=>{S.cards[id]={lv:1,exp:0,star:+star||0};S.cards[id].lv=capOf(id);if(am)S.cards[id].am=am});S.am={};if(am)S.am[am]=3;S.team=team;
  const E=[],F=[],R=[];for(let i=0;i<(arg.R||3);i++){const c=camp(team,arg.tries||10);E.push(c.end);F.push(c.first);R.push(c.rounds)}E.sort((a,b)=>a-b);
  res[k]=`end ${E[0]}-${E[E.length-1]} mid ${E[E.length>>1]} · first-try ${Math.round(F.reduce((a,b)=>a+b)/F.length)}% · rounds/win ${(R.reduce((a,b)=>a+b)/R.length).toFixed(2)}`}
 return JSON.stringify(res,null,1)},arg);
console.log(out);await b.close()})()
