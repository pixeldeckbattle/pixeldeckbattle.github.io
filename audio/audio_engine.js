/* PixelDeck Battle audio engine (b239). Loaded after the core game script; touches no save data except S.bgm (music on/off).
   Music: one CC0 track per mode, loudness-normalised to -16 LUFS by .github/workflows/pd-audio-b239.yml, crossfaded with HTMLAudio.
     lobby (menus) = Battle Theme A · stages = Battle Theme B · elite/survival = Hard Battle 1 · boss/lord = Epic Boss Battle
     PvP = Determined Pursuit · world boss = The Final Battle · market/trade room = The Old Tower Inn · portal minigame = Chiptune Adventures Stage 1
     victory = Victory Theme. Credits: audio/MUSIC_CREDITS.md.
   Sound effects: Kenney CC0 packs (Interface, RPG, Casino, Music Jingles), peak-normalised, played through WebAudio buffers.
   The game's own combat sounds (slash, smash, hit, magic, arrow, heal, ult) are kept; tap / win / lose / start use the new files. */
(()=>{'use strict';
const MUSIC={lobby:'lobby',stage:'stage',hard:'hard',boss:'boss',pvp:'pvp',wboss:'wboss',tavern:'tavern',portal:'portal',victory:'victory'};
const SFX_GAIN={tap:.35,nav:.45,back:.4,confirm:.5,error:.4,tick:.45,coins:.6,pack:.7,fan:.55,latch:.55,door:.5,portal:.5,reward:.55,rare:.7,defeat:.55,start:.5};
const V='?v=b239',bad={};
let unlocked=false,want='lobby',current=null,fade=0,seq=0,ctx=null,bus=null,lastCue=0;
const enabled=()=>typeof S!=='undefined'&&S&&S.bgm!==false;
const sfxOn=()=>typeof S!=='undefined'&&S&&S.sfx!==false&&S.snd!==false;
function level(){let n=55;try{const v=localStorage.getItem('pdb_bgm_volume');if(v!==null)n=Number(v)}catch(e){}return Math.max(0,Math.min(100,Number.isFinite(n)?n:55))}
const musicVolume=()=>level()/100*.5;

/* ---------- sound effects ---------- */
const buf={};
function AC(){if(ctx)return ctx;const K=window.AudioContext||window.webkitAudioContext;if(!K)return null;ctx=new K();bus=ctx.createGain();bus.gain.value=.9;
 const c=ctx.createDynamicsCompressor();c.threshold.value=-14;c.knee.value=10;c.ratio.value=4;c.attack.value=.003;c.release.value=.15;bus.connect(c).connect(ctx.destination);return ctx}
function loadSfx(){const A=AC();if(!A)return;Object.keys(SFX_GAIN).forEach(k=>{if(buf[k])return;buf[k]='loading';
 fetch('audio/sfx/'+k+'.mp3'+V).then(r=>{if(!r.ok)throw 0;return r.arrayBuffer()}).then(a=>new Promise((ok,no)=>A.decodeAudioData(a,ok,no))).then(b=>{buf[k]=b}).catch(()=>{buf[k]=null})})}
function play(k,delay=0,gain=1){if(!unlocked||!sfxOn())return false;const A=AC(),b=buf[k];if(!A||!b||b==='loading')return false;if(A.state==='suspended')A.resume().catch(()=>{});
 try{const s=A.createBufferSource(),g=A.createGain();s.buffer=b;g.gain.value=(SFX_GAIN[k]||.5)*gain;s.connect(g).connect(bus);s.start(A.currentTime+delay)}catch(e){return false}return true}

/* ---------- music ---------- */
function retire(a){if(!a)return;try{a.pause();a.removeAttribute('src');a.load()}catch(e){}}
function quiet(a){if(!a)return;const v0=a.volume;let k=0;const t=setInterval(()=>{if(++k>=10){clearInterval(t);retire(a);return}a.volume=Math.max(0,v0*(1-k/10))},50)}
function stopAll(){clearInterval(fade);if(current){quiet(current);current=null}}
function choose(k){if(!MUSIC[k])k='lobby';want=k;if(!unlocked||!enabled()){stopAll();return}
 if(current&&current._kind===k){if(current.paused&&!document.hidden)current.play().catch(()=>{});return}
 if(bad[k]){stopAll();return}
 const token=++seq,previous=current,a=new Audio();current=a;a._kind=k;a.preload='auto';a.loop=k!=='victory';a.volume=0;
 const fadeIn=()=>{if(token!==seq||current!==a)return;clearInterval(fade);let i=0;const ov=previous?previous.volume:0;
  fade=setInterval(()=>{if(token!==seq){clearInterval(fade);return}i++;const p=Math.min(1,i/14);a.volume=musicVolume()*p;if(previous)previous.volume=Math.max(0,ov*(1-p));if(p===1){clearInterval(fade);retire(previous)}},55)};
 a.onerror=()=>{bad[k]=1;if(token!==seq)return;retire(a);if(current===a)current=null;quiet(previous)};
 a.onended=()=>{if(k==='victory'&&current===a){current=null;choose(want==='victory'?'lobby':want)}};
 a.src='audio/music/'+MUSIC[k]+'.mp3'+V;
 if(!document.hidden){const p=a.play();if(p&&p.then)p.then(fadeIn).catch(()=>{});else fadeIn()}
}
function changeVolume(n){const v=Math.round(Math.max(0,Math.min(100,Number(n)||0)));try{localStorage.setItem('pdb_bgm_volume',String(v))}catch(e){}if(current)current.volume=musicVolume();const p=document.getElementById('pd-music-pct');if(p)p.textContent=v+'%'}
function unlock(){if(unlocked)return;unlocked=true;AC();loadSfx();if(enabled())choose(want)}

/* ---------- settings row ---------- */
function injectSettings(){const host=document.querySelector('#view .main');if(!host||document.getElementById('pd-music-row'))return;
 const en=S&&S.lang==='en',r=document.createElement('div');r.id='pd-music-row';r.className='row nt';r.style.cssText='display:flex;gap:10px;align-items:center;flex-wrap:wrap';
 r.innerHTML='<span style="flex:1;min-width:100px">'+(en?'Background music':'เพลงประกอบ')+'</span><button class="btn sm '+(enabled()?'on':'alt')+'" type="button" id="pd-music-toggle">'+(enabled()?(en?'On':'เปิด'):(en?'Off':'ปิด'))+'</button><label style="display:flex;align-items:center;gap:6px;width:100%" for="pd-music-volume"><span style="min-width:58px">'+(en?'Volume':'ความดัง')+'</span><input id="pd-music-volume" type="range" min="0" max="100" step="5" value="'+level()+'" style="flex:1;min-width:80px;accent-color:#ffdc6b"><b id="pd-music-pct" style="min-width:38px;text-align:right">'+level()+'%</b></label>';
 host.insertBefore(r,host.firstChild);
 r.querySelector('#pd-music-toggle').onclick=()=>{S.bgm=S.bgm===false;save();if(enabled())choose(want);else stopAll();settings()};
 r.querySelector('#pd-music-volume').oninput=e=>changeVolume(e.target.value)}

/* ---------- button cues ---------- */
function cue(act){if(/^(home|back|close|wbclose|disno|dressdone)$/.test(act))return 'back';
 if(/^(go|pvstart|claim|fugo|buy|confirm|tpgo|lselgo|schest|disgo|exgo|mkbuy|mksell)$/.test(act))return 'confirm';
 if(/^(cancel|no|dismiss)$/.test(act))return 'error';
 if(/^(settings|guide|shop|market|pvp|pvtab|coll|profile|troom|vault|vip|quests|amulet|fuse|bag)$/.test(act))return 'nav';
 if(/^(open|openpro|opengold|openltd|asbuy)$/.test(act))return '';   // these get their own sounds below
 return 'tap'}
document.addEventListener('pointerdown',e=>{const t=e.target.closest&&e.target.closest('button:not(:disabled),[role=button],[data-act]');unlock();if(!t)return;
 const c=cue(t.dataset.act||'');if(c&&play(c))lastCue=performance.now();if(enabled()&&!current&&!bad[want])choose(want)},true);
document.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' ')unlock()},true);
document.addEventListener('visibilitychange',()=>{if(document.hidden){if(current)current.pause()}else if(unlocked&&enabled()){if(current)current.play().catch(()=>{});else choose(want)}});
window.addEventListener('pagehide',()=>{if(current)current.pause()});

/* ---------- hooks into the game ---------- */
const wrap=(name,before,after)=>{try{const f=window[name];if(typeof f!=='function')return;window[name]=function(...a){if(before)before.apply(this,a);const r=f.apply(this,a);if(after)after.call(this,r,...a);return r}}catch(e){console.warn('PixelDeck audio hook',name,e)}};
const best=()=>{try{const L=Array.isArray(pull)?pull:[];return L.some(x=>x&&C[x.id]&&['L','SL','LT'].includes(C[x.id].r))}catch(e){return false}};
try{
 const oldSfx=sfx;window.sfx=sfx=function(kind){
  if(kind==='tap'){if(performance.now()-lastCue<200)return;if(play('tap'))return}
  else if(kind==='win'){if(play('reward'))return}
  else if(kind==='lose'){if(play('defeat'))return}
  else if(kind==='start'){if(play('start'))return}
  return oldSfx(kind)};
 const oldBeep=beep;window.beep=beep=function(){unlock();if(!play('tick'))oldBeep()};
}catch(e){console.warn('PixelDeck audio sfx hook',e)}
['home','titleScreen','coll','shop','prep'].forEach(n=>wrap(n,null,()=>choose('lobby')));
wrap('settings',null,()=>injectSettings());
['market','roomList'].forEach(n=>wrap(n,null,()=>choose('tavern')));
wrap('enterRoom',()=>{play('door')},()=>choose('tavern'));
['arena','pvPick'].forEach(n=>wrap(n,null,()=>choose('pvp')));
['wbHub','wbJoin'].forEach(n=>wrap(n,null,()=>choose('wboss')));
wrap('vltEnter',()=>{play('portal')},()=>choose('portal'));
['openPack','openGold','openPro','openLtd'].forEach(n=>wrap(n,()=>{play('pack');play('fan',.28)},()=>{if(best())play('rare',.7)}));
wrap('asBuy',function(k){this.__ac=typeof S!=='undefined'?S.ac:0},function(r,k){if(typeof S==='undefined'||S.ac===this.__ac)return;
 if(k==='gold')play('coins');else if(k==='pack'){play('pack');play('fan',.28)}else{play('latch');play('reward',.25)}});
wrap('startBattle',(n,opp)=>{let k='stage';if(opp)k='pvp';else{const t=typeof stKind==='function'?stKind(n):'';if(t==='lord'||t==='boss'||(typeof ST1!=='undefined'&&n<=ST1&&n%10===0))k='boss';else if(t==='elite'||t==='surv')k='hard'}choose(k)});
try{const oldFinish=finish;window.finish=finish=function(won,...a){const farm=won&&typeof loop!=='undefined'&&loop===2;
 if(won&&!farm)choose('victory');else if(!won){stopAll();want='lobby'}return oldFinish.call(this,won,...a)}}catch(e){console.warn('PixelDeck audio finish hook',e)}
window.PDAudio={choose,play,level,changeVolume,mute:()=>{S.bgm=false;save();stopAll()}};
})();
