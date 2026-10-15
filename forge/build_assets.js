// Builds the APK's web folder (forge/apk/app/src/main/assets/www):
//   index.html      <- forge/studio.html
//   screens/data.js <- every screens/<id>/screen.json (captured by forge/capture/capture.js)
//   game/<dir>/...  <- the game's real art (repo folders), game/manifest.js lists them
// Run from anywhere: node forge/build_assets.js
const fs=require('fs'),path=require('path');
const R=path.join(__dirname,'..'),W=path.join(__dirname,'apk/app/src/main/assets/www');
fs.copyFileSync(path.join(__dirname,'studio.html'),path.join(W,'index.html'));
// captured screens -> one script (file:// and the in-app origin both load scripts fine)
const SD=path.join(W,'screens'),idx=JSON.parse(fs.readFileSync(path.join(SD,'index.json'),'utf8'));
const scr=idx.map(s=>JSON.parse(fs.readFileSync(path.join(SD,s.id,'screen.json'),'utf8')));
fs.writeFileSync(path.join(SD,'data.js'),'window.SCREENS='+JSON.stringify(scr)+';');
// the game's own art
const DIRS=['ic','ic2','ui','am','rk','art','cards','spr','fx','bg','fnt'],man={};const G=path.join(W,'game');fs.rmSync(G,{recursive:true,force:true});
for(const d of DIRS){const src=path.join(R,d);if(!fs.existsSync(src))continue;fs.mkdirSync(path.join(G,d),{recursive:true});
  man[d]=fs.readdirSync(src).filter(f=>/\.(webp|png|jpe?g|gif|woff2?)$/i.test(f)).sort();for(const f of man[d])fs.copyFileSync(path.join(src,f),path.join(G,d,f))}
fs.writeFileSync(path.join(G,'manifest.js'),'window.ASSETS='+JSON.stringify(man)+';');
console.log('studio built:',scr.length,'screens,',Object.values(man).reduce((a,l)=>a+l.length,0),'game files');
