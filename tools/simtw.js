const {chromium}=require('playwright');(async()=>{const b=await chromium.launch({executablePath:'/opt/pw-browsers/chromium'});
const p=await b.newPage();p.on('pageerror',e=>console.log('ERR',e.message));
await p.goto('file:///home/claude/pixeldeck/_t.html');await new Promise(r=>setTimeout(r,700));
const arg=JSON.parse(process.argv[2]||'{}');
const out=await p.evaluate((arg)=>{USER={name:'g'};S=unlock(fresh());if(arg.eval)eval(arg.eval);
 const simOne=(f,team)=>{bt={n:twEq(f),tw:f,round:1,sel:0,log:'',al:team.map(id=>fighter(id,S.cards[id].lv)),en:twDef(f)};
  for(let r=1;r<=80;r++){for(const a of bt.al){if(a.hp<=0)continue;tauntTick(a);const k=autoPick(a),ti=autoT();if(ti<0)break;cast(a,k,ti);fx.length=0;hits.clear();if(bt.en.every(e=>e.hp<=0))return r}
   for(const e of bt.en){if(e.hp<=0)continue;if(e.gim==='breath'&&bt.round%3===0){hitM=!!C[e.id].m;hitA=e.atk;bt.al.forEach((x,k)=>{if(x.hp>0){const [d,cr]=roll(e,.6);hurt(bt.al,'a',k,d,'d',cr)}});fx.length=0;hits.clear();continue}
    const j=foePick();if(j<0)break;foeHit(e,j);fx.length=0;hits.clear()}if(bt.al.every(x=>x.hp<=0))return -r;bt.round++;bt.al.forEach(x=>x.done=false);twRound(bt);fx.length=0}return -99};
 const camp=(team,tries)=>{let f=1,first=0,tot=0,walls=[];for(;f<=600;f++){let ok=false,k=0;for(;k<tries;k++){if(simOne(f,team)>0){ok=true;break}}if(!ok)break;tot++;if(!k)first++;else if(k>=3)walls.push(f)}return{end:f-1,first:Math.round(100*first/Math.max(1,tot)),walls}};
 const T={ST:['h06','h20','h11'],C:['h17','h01','h23'],UC:['h02','h21','h25'],R:['h05','h09','h08'],L:['h15','h13','h26'],Lp:['h15','h19','h04'],SL:['h03','h22','h27'],SLp:['h03','h22','h07']};
 const res={};for(const k of arg.teams){const [nm,star,am]=k.split(':');const team=T[nm];S.cards={};team.forEach(id=>{S.cards[id]={lv:1,exp:0,star:+star||0};S.cards[id].lv=capOf(id);if(am)S.cards[id].am=am});S.am={};if(am)S.am[am]=3;S.team=team;
  const E=[];let fr=0,W=[];for(let i=0;i<(arg.R||5);i++){const c=camp(team,arg.tries||10);E.push(c.end);fr+=c.first;W=W.concat(c.walls)}E.sort((a,b)=>a-b);const wc={};W.forEach(x=>wc[x]=(wc[x]||0)+1);
  res[k]=E[0]+'-'+E[E.length-1]+' mid '+E[E.length>>1]+' first-try '+Math.round(fr/E.length)+'% hard floors '+Object.keys(wc).filter(x=>wc[x]>=2).join(',')}
 return JSON.stringify(res,null,1)},arg);
console.log(out);await b.close()})()
