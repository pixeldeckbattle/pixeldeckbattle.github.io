const {chromium}=require('playwright');(async()=>{const b=await chromium.launch({executablePath:'/opt/pw-browsers/chromium'});const e=[];const D='/tmp/claude-0/-home-claude/faf65de1-a492-52b3-8473-ee4e7e7dcc7a/scratchpad/wb6/';require('fs').mkdirSync(D,{recursive:true});
for(const [vw,vh,tag] of [[932,430,'phone'],[1280,720,'pc']]){const p=await b.newPage({viewport:{width:vw,height:vh}});p.on('pageerror',x=>e.push(x.message));
await p.goto('file:///home/claude/pixeldeck/_t.html');await p.waitForTimeout(900);
await p.evaluate(()=>{USER={name:'g'};S=unlock(fresh());S.tut=null;['n160','n165','n167','n174','n176','n180','n182','n183','n189'].forEach(k=>S[k]=1);S.bc=[10,20,30,40,50,60,70,80,90,100];S.cleared=1500;S.spd=3;
 S.cards={h29:{lv:190,exp:0,star:6},h30:{lv:190,exp:0,star:6},h31:{lv:190,exp:0},h03:{lv:150,exp:0},h22:{lv:150,exp:0},h27:{lv:150,exp:0},h18:{lv:150,exp:0},h28:{lv:150,exp:0},h07:{lv:120,exp:0},h34:{lv:100,exp:0}};S.team=['h30','h29','h31'];S.me={name:'Toey',look:'h29'};WB.from=0;WB.to=Date.now()+5e9;home()});
await p.waitForTimeout(2600);await p.evaluate(()=>ov(''));await p.screenshot({path:D+tag+'-lobby.png'});
await p.evaluate(()=>wbHub());await p.waitForTimeout(700);await p.screenshot({path:D+tag+'-hub.png'});
await p.evaluate(()=>{wbJoin('',true);wbp.t0=0;wbp.nodes.me.c='h30';wbp.nodes.me.bots=[{c:'h03',lv:150,st:3,l:'h03'},{c:'h18',lv:150,st:3,l:'h18'}];wbRoom()});await p.waitForTimeout(500);await p.screenshot({path:D+tag+'-room.png'});
await p.evaluate(()=>{wbp.nodes.me.rd=1;wbBegin(wbp.nodes.me)});await p.waitForTimeout(6000);await p.screenshot({path:D+tag+'-fight.png'});
for(let i=0;i<100;i++){await p.waitForTimeout(1000);if(await p.evaluate(()=>!!document.querySelector('.wbresd')))break}
await p.waitForTimeout(500);await p.screenshot({path:D+tag+'-result.png'});
await p.evaluate(()=>{ov('');wbShop('c')});await p.waitForTimeout(400);await p.screenshot({path:D+tag+'-shop.png'});
await p.evaluate(()=>{wbRank()});await p.waitForTimeout(600);await p.screenshot({path:D+tag+'-rank.png'});await p.close()}
console.log('errors',e.length,e.slice(0,3).join(' | '));await b.close()})()
