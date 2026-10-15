// Makes the APK's offline page from forge.html: local font + local JSZip instead of the web ones.
// Run from anywhere: node forge/build_assets.js
const fs=require('fs'),path=require('path');
const src=path.join(__dirname,'forge.html'),out=path.join(__dirname,'apk/app/src/main/assets/www/index.html');
let h=fs.readFileSync(src,'utf8');
const rep=(tag,to)=>{const re=new RegExp(`<!--${tag}-->[\\s\\S]*?<!--/${tag}-->`);if(!re.test(h))throw new Error('marker missing: '+tag);h=h.replace(re,to)};
rep('FONTS',"<style>@font-face{font-family:'Silkscreen';src:url(silkscreen.ttf) format('truetype');font-display:swap}</style>");
rep('JSZIP','<script src="jszip.min.js"></script>');
fs.writeFileSync(out,h);console.log('wrote',path.relative(process.cwd(),out),h.length,'bytes');
