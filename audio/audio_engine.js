/* PixelDeck Battle b237/b238 - adaptive music + tactile UI audio (CC0 tracks).
   b238 (Claude, owner 23 Oct): lobby uses a real track (audio/music/lobby.mp3) instead of the synth arpeggio, silent until that file exists;
   no hotlinked fallbacks (the boss source is a 21.8 MB wav); farm loops keep the battle music; UI cues on real buttons; cues follow the SFX switch.
   Loaded after the core game script; compatible with existing save files. */
(()=>{'use strict';
const TRACKS={lobby:['audio/music/lobby.mp3'],battle:['audio/music/battle.mp3'],hard:['audio/music/hard.mp3'],boss:['audio/music/boss.mp3'],victory:['audio/music/victory.mp3']};
let unlocked=false,want='lobby',current=null,old=null,fade=0,seq=0,ambTimer=0,step=0,ctx=null,fxbus=null,lastAct='tap';
const enabled=()=>typeof S!=='undefined' && S && S.bgm!==false;
function level(){let n=55;try{let v=localStorage.getItem('pdb_bgm_volume');if(v!==null)n=Number(v)}catch(e){}return Math.max(0,Math.min(100,Number.isFinite(n)?n:55))}
const musicVolume=()=>level()/100*.27;
const AC=()=>{if(ctx)return ctx;let K=window.AudioContext||window.webkitAudioContext;return K?(ctx=new K()):null};
function node(){const A=AC();if(!A)return null;if(A.state==='suspended')A.resume().catch(()=>{});if(fxbus)return fxbus;
 const g=A.createGain(),c=A.createDynamicsCompressor();g.gain.value=.30;c.threshold.value=-20;c.knee.value=15;c.ratio.value=5;c.attack.value=.003;c.release.value=.14;g.connect(c).connect(A.destination);fxbus=g;return g}
function tone(f,to,d,v,delay=0,type='triangle'){const A=AC(),dest=node();if(!A||!dest)return;const at=A.currentTime+delay,o=A.createOscillator(),g=A.createGain(),lp=A.createBiquadFilter();o.type=type;o.frequency.setValueAtTime(Math.max(40,f),at);o.frequency.exponentialRampToValueAtTime(Math.max(40,to),at+d);lp.type='lowpass';lp.frequency.value=2500;g.gain.setValueAtTime(.001,at);g.gain.linearRampToValueAtTime(v,at+.008);g.gain.exponentialRampToValueAtTime(.001,at+d);o.connect(lp).connect(g).connect(dest);o.start(at);o.stop(at+d+.015)}
function ui(kind){if(!unlocked||!S||S.snd===false||S.sfx===false)return;try{
 if(kind==='nav'){tone(480,700,.1,.21);tone(720,850,.12,.14,.08)}
 else if(kind==='back'){tone(610,370,.12,.22)}
 else if(kind==='open'){tone(360,760,.18,.27);tone(820,1100,.15,.18,.10)}
 else if(kind==='confirm'){tone(520,675,.11,.26);tone(780,1020,.14,.21,.09)}
 else if(kind==='cancel'){tone(400,220,.14,.20)}
 else if(kind==='rare'){tone(560,1120,.28,.32);tone(830,1660,.32,.26,.12)}
 else tone(590,720,.060,.16);
 }catch(e){}
}
function stopAmbient(){if(ambTimer){clearInterval(ambTimer);ambTimer=0}}
function ambientStep(){if(!unlocked||!enabled()||document.hidden||want!=='lobby')return;try{const notes=[293.66,369.99,440,587.33,440,369.99,329.63,440,293.66,369.99,493.88,587.33,493.88,440,369.99,329.63];if(step%2===0){const A=AC(),dest=node();if(A&&dest){const at=A.currentTime,o=A.createOscillator(),g=A.createGain();o.type='sine';o.frequency.setValueAtTime(notes[step%16],at);g.gain.setValueAtTime(.001,at);g.gain.linearRampToValueAtTime(.14*level()/100,at+.025);g.gain.exponentialRampToValueAtTime(.001,at+.65);o.connect(g).connect(dest);o.start(at);o.stop(at+.67)}}step++}catch(e){}}
function startAmbient(){}   // b238: the synth arpeggio is retired; the lobby plays audio/music/lobby.mp3
function retire(a){if(!a)return;try{a.pause();a.removeAttribute('src');a.load()}catch(e){}}
function quiet(a){if(!a)return;clearInterval(fade);const initial=a.volume;let k=0;fade=setInterval(()=>{if(++k>=9){clearInterval(fade);retire(a);return}a.volume=Math.max(0,initial*(1-k/9))},45)}
function stopAll(){stopAmbient();clearInterval(fade);if(old){retire(old);old=null}if(current){quiet(current);current=null}}
function choose(k){if(!TRACKS[k])k='lobby';want=k;if(!unlocked||!enabled()){stopAll();return}
 stopAmbient();if(current&&current._kind===k)return;if(TRACKS[k].bad){stopAll();return}   // a missing file is not asked for again
 const token=++seq,previous=current,a=new Audio();current=a;a._kind=k;a.preload='none';a.loop=k!=='victory';a.volume=0;let source=0;
 function fadeIn(){if(token!==seq||current!==a)return;clearInterval(fade);let i=0;const ov=previous?previous.volume:0;fade=setInterval(()=>{if(token!==seq){clearInterval(fade);retire(a);return}i++;const pct=Math.min(1,i/12);a.volume=musicVolume()*pct;if(previous)previous.volume=Math.max(0,ov*(1-pct));if(pct===1){clearInterval(fade);retire(previous)}},55)}
 function play(){if(token!==seq||document.hidden)return;const p=a.play();if(p&&p.then)p.then(fadeIn).catch(()=>{ /* browser autoplay waits for another touch */ });else fadeIn()}
 a.onerror=()=>{TRACKS[k].bad=1;if(token!==seq)return;retire(a);if(current===a)current=null;quiet(previous)};   // b238: no hotlinked fallback
 a.onended=()=>{if(k==='victory'&&current===a)choose('lobby')};
 a.src=TRACKS[k][0];play();
}
function changeVolume(n){const v=Math.round(Math.max(0,Math.min(100,Number(n)||0)));try{localStorage.setItem('pdb_bgm_volume',String(v))}catch(e){}if(current)current.volume=musicVolume();const pct=document.getElementById('pd-music-pct');if(pct)pct.textContent=v+'%'}
function injectSettings(){const host=document.querySelector('#view .main');if(!host||document.getElementById('pd-music-row'))return;
 const r=document.createElement('div');r.id='pd-music-row';r.className='row nt';r.style.cssText='display:flex;gap:10px;align-items:center;flex-wrap:wrap';
 const text=S&&S.lang==='en',label=text?'Background music':'เพลงประกอบ',on=text?'On':'เปิด',off=text?'Off':'ปิด';
 r.innerHTML='<span style="flex:1;min-width:100px">'+label+'</span><button class="btn sm '+(enabled()?'on':'alt')+'" type="button" id="pd-music-toggle">'+(enabled()?on:off)+'</button><label style="display:flex;align-items:center;gap:6px;width:100%" for="pd-music-volume"><span style="min-width:58px">'+(text?'Volume':'ความดัง')+'</span><input id="pd-music-volume" type="range" min="0" max="100" step="5" value="'+level()+'" style="flex:1;min-width:80px;accent-color:#ffdc6b"><b id="pd-music-pct" style="min-width:38px;text-align:right">'+level()+'%</b></label>';
 host.insertBefore(r,host.firstChild);
 r.querySelector('#pd-music-toggle').onclick=()=>{S.bgm=S.bgm===false;save();if(enabled())choose(want);else stopAll();settings()};
 r.querySelector('#pd-music-volume').oninput=e=>changeVolume(e.target.value);
}
function classify(act){if(/^(home|prep|dressdone|logout|troom|close|back|wbclose)$/.test(act))return 'back';
 if(/^(go|pvstart|claim|fugo|asbuy|schest|lselgo|buy|confirm|guest|glogin|tpgo)$/.test(act))return 'confirm';
 if(/^(open|openpro|opengold|openltd|lselopen|pack|box|chest)$/.test(act))return 'open';
 if(/^(settings|guide|shop|market|pvp|pvtab|coll|charedit|profile|arena|tutre|troom|vault|dev|vip)$/.test(act))return 'nav';
 if(/^(cancel|no|dismiss|reset)$/.test(act))return 'cancel';
 return 'tap'}
document.addEventListener('pointerdown',e=>{const t=e.target.closest?.('button:not(:disabled),[role=button],[data-act]');if(t){lastAct=t.dataset.act||'tap';{const c=classify(lastAct);if(c!=='tap'&&unlocked){ui(c);lastAct='tap'}}if(!unlocked){unlocked=true;if(enabled())choose(want)}else if(enabled()&&!current&&!ambTimer)choose(want)}},true);
document.addEventListener('keydown',e=>{if((e.key==='Enter'||e.key===' ')&&!unlocked){unlocked=true;if(enabled())choose(want)}},true);
document.addEventListener('visibilitychange',()=>{if(document.hidden){stopAmbient();if(current)current.pause()}else if(unlocked&&enabled()){if(want==='lobby')startAmbient();else if(current)current.play().catch(()=>{});else choose(want)}});
window.addEventListener('pagehide',()=>{stopAmbient();if(current)current.pause()});
try{
 const oldBeep=beep;beep=function(){if(!unlocked){unlocked=true;if(enabled())choose(want)}ui(classify(lastAct));lastAct='tap'};
 const oldHome=home;home=function(...a){const r=oldHome.apply(this,a);choose('lobby');return r};
 const oldTitle=titleScreen;titleScreen=function(...a){const r=oldTitle.apply(this,a);choose('lobby');return r};
 const oldSettings=settings;settings=function(...a){const r=oldSettings.apply(this,a);injectSettings();return r};
 const oldStart=startBattle;startBattle=function(n,opp,...rest){let kind='battle';if(opp)kind='hard';else{const t=typeof stKind==='function'?stKind(n):'';if(t==='lord'||t==='boss'||(n%10===0&&n>=10))kind='boss';else if(n%10===5)kind='hard'}choose(kind);return oldStart.call(this,n,opp,...rest)};
 const oldFinish=finish;finish=function(won,...a){const farm=won&&typeof loop!=='undefined'&&loop===2;if(!farm)choose(won?'victory':'lobby');if(!won)ui('cancel');return oldFinish.call(this,won,...a)};
}catch(e){console.warn('PixelDeck audio hook:',e)}
window.PDAudio={choose,level,changeVolume,mute:()=>{S.bgm=false;save();stopAll()}};
})();