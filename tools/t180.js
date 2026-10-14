const {chromium}=require('playwright');(async()=>{const b=await chromium.launch({executablePath:'/opt/pw-browsers/chromium'});const e=[];const w=n=>new Promise(r=>setTimeout(r,n));const SH=process.argv[2];
const p=await b.newPage({viewport:{width:1000,height:466},deviceScaleFactor:2});p.on('pageerror',x=>e.push(x.message));
await p.goto('file:///home/claude/pixeldeck/_t.html');await w(1000);
const r=await p.evaluate(()=>{USER={name:'g'};S=unlock(fresh());Object.assign(S,{me:{name:'T',look:'h27'},gift:true,tut:null,cleared:800,n176:1,n174:1,n167:1,n165:1,n160:1,bc:[10,20]});
 S.cards={h27:{lv:250,exp:0,star:10,am:'lion'},h03:{lv:250,exp:0,star:10,am:'gstar'},h22:{lv:250,exp:0,star:10}};S.am={lion:1,gstar:1};S.team=['h27','h03','h22'];
 const mk=n=>{const b={n,round:1,al:S.team.map(id=>fighter(id,S.cards[id].lv)),en:[]};c3Amu(b);return b};
 const b750=mk(750),b1500=mk(1500),bpvp=Object.assign(mk(1500),{});const pv={n:1500,pvp:{},round:1,al:S.team.map(id=>fighter(id,S.cards[id].lv)),en:[]};c3Amu(pv);
 const out={base:fighter('h27',250).max,s750:b750.al[0].max,s1500:b1500.al[0].max,zeusGstar1500:b1500.al[1].max,zeusBase:fighter('h03',250).max,pvp:pv.al[0].max};
 bt=b1500;const t=bt.al[0];t.taunt=2;hitM=false;hitA=4000;const h0=t.hp;hurt(bt.al,'a',0,2000,'d');out.taunted1500=h0-t.hp;
 bt=b750;const t2=bt.al[0];t2.taunt=2;const h1=t2.hp;hurt(bt.al,'a',0,2000,'d');out.taunted750=h1-t2.hp;
 // gstar on a tank survives once at 1500
 S.cards.h27.am='gstar';const b2=mk(1500);bt=b2;const g=b2.al[0];hurt(b2.al,'a',0,99999,'d');out.ls1=g.hp;hurt(b2.al,'a',0,99999,'d');out.ls2=g.hp;
 out.fuse=afKeys('SL');return out});
console.log(JSON.stringify(r));
await p.evaluate(()=>{S.n180=0;S.cleared=800;home();news180()});await w(1900);await p.screenshot({path:SH+'/pop180.png'});
console.log('errors',e.length,e.slice(0,3).join('|'));await b.close()})()
