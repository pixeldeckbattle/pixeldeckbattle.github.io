import json,html
GRID=("Exactly 16 frames arranged in a 4x4 grid (4 columns x 4 rows), read left to right, top to bottom. "
 "All 16 cells are the same size. Flat solid magenta background #FF00FF filling every cell, no gradient, no grid lines, no borders, "
 "no text, no numbers, no labels, no watermark, no cast shadow on the background. Nothing may cross a cell edge; keep a clear magenta margin around the subject in every cell. "
 "Do not use magenta or hot pink anywhere in the subject itself; purples must lean blue-violet. "
 "16-bit pixel art, crisp hand-placed pixels, dark 1-pixel outline, rich limited palette with clean shading, premium SNES / GBA JRPG quality, no blur, no anti-aliased smear.")
CHAR=("The character design, colours, proportions and size must be IDENTICAL in all 16 frames; only the pose changes. "
 "Side view, the character faces RIGHT. Full body visible in every cell, feet (or lowest point) on the same ground line in every cell, centred horizontally.")
def idle(name,d,mv):
    sway={'float':'gently bobbing up and down in place, a slow hover loop','fly':'hovering in place with slow wing beats'}.get(mv,'breathing idle: chest rises and falls, small weight shift, subtle secondary motion (hair, cloth, tail, flames)')
    return f"16-bit pixel art sprite sheet of {name}: {d}. {GRID} {CHAR} Animation: IDLE loop, {sway}. Movement is calm and small; frame 16 flows smoothly back into frame 1 with no jump."
def walk(name,d,mv):
    m={'float':'floating forward in place (it does not move across the cell): slow drift with a gentle bob and trailing motion, tentacles / wisps / cloth sway',
       'fly':'flying forward in place (it does not move across the cell): two full wing-beat cycles over 16 frames',
       'crawl':'crawling forward in place (it does not move across the cell): legs move in a steady alternating scuttle, two full cycles over 16 frames',
       'ooze':'oozing forward in place (it does not move across the cell): the body squashes and stretches like a slug, two cycles over 16 frames',
       'quad':'trotting forward in place (it does not move across the cell): a four-legged trot, two full stride cycles over 16 frames, head and tail follow through',
       'walk':'walking forward in place (it does not move across the cell): two full steps (left-right, left-right) over 16 frames, contact - down - pass - up, arms counter-swing'}[mv]
    return f"16-bit pixel art sprite sheet of {name}: {d}. {GRID} {CHAR} Animation: WALK cycle, {m}. Smooth seamless loop, frame 16 leads into frame 1."
def attack(name,d,st,act):
    t={'melee':f"MELEE ATTACK: frames 1-4 wind-up ({act[0]}), frames 5-6 fast lunge forward, frame 7 IMPACT at full extension ({act[1]}) with a small white-yellow hit spark at the tip, frame 8 follow-through, frames 9-16 recover smoothly back to the idle stance.",
       'smash':f"HEAVY SMASH: frames 1-4 raise up and wind back ({act[0]}), frames 5-6 swing down hard, frame 7 IMPACT ({act[1]}) with a small dust-and-rock puff at the ground in front, frame 8 follow-through, frames 9-16 recover back to the idle stance.",
       'cast':f"SPELL CAST: frames 1-4 gather energy ({act[0]}), frames 5-6 thrust forward, frame 7 RELEASE ({act[1]}) as a bright burst right at the hand or source, frame 8 afterglow, frames 9-16 recover back to the idle stance. Do NOT draw a flying projectile; the game adds it.",
       'shoot':f"SHOOT: frames 1-4 aim and charge ({act[0]}), frames 5-6 brace, frame 7 FIRE ({act[1]}) with a muzzle flash at the barrel and a small recoil, frame 8 smoke puff, frames 9-16 settle back to the idle hover. Do NOT draw the flying bullet; the game adds it."}[st]
    return f"16-bit pixel art sprite sheet of {name}: {d}. {GRID} {CHAR} The character stays in place within its cell; the attack must fit inside the cell. Animation: {t} Frame 7 must be the strongest, clearest pose."
M=[
('m01','Ember Imp','a small mischievous fire imp with dark-red skin, curved black horns, little bat wings, a flame-tipped tail and a three-pronged iron pitchfork, glowing yellow eyes','walk','melee',('pulls the pitchfork back, wings flare','pitchfork thrust forward')),
('m02','Hellhound Pup','a young hellhound with sooty black fur split by glowing lava cracks, a burning orange tail, ember eyes and oversized paws','quad','melee',('crouches low, snarling','snapping bite lunge')),
('m03','Dire Wolf','a large grey-black dire wolf with a crimson mane, scarred muzzle, long bone-white fangs and heavy claws','quad','melee',('hunches back, hackles raised','claw-and-bite lunge')),
('m04','Sporecap Stalker','a walking mushroom creature with a wide violet-blue cap dotted with glowing teal spores, a pale stalk body, root-like legs and long fungal arms','walk','cast',('spores glow and swirl around the cap','a ghostly teal spore cloud bursts from its raised arm')),
('m05','Tar Ooze','a bubbling black tar slime with an oily blue sheen, one big glowing orange eye and old bones half-sunk in its body','ooze','smash',('the blob stretches tall','the blob slams down flat')),
('m06','Cactus Bruiser','a muscular green cactus brawler with a red desert flower on its head, spiny boxing-fist arms, an angry face and stubby root feet','walk','smash',('raises both spiky fists high','double-fist ground slam')),
('m07','Gilded Mimic','a treasure-chest mimic of red lacquered wood with gold trim, a mouth of jagged teeth, a long purple-blue tongue and four small crab legs','crawl','melee',('the lid opens wide','lunging chomp')),
('m08','Clockwork Scarab','a brass-and-copper mechanical scarab beetle with a turning wind-up key on its back, ruby eye lenses, a big pincer horn and six jointed legs','crawl','melee',('rears back, gears whirring','pincer-horn snap')),
('m09','Storm Jelly','a floating deep-indigo jellyfish with a glowing translucent bell and long tentacles crackling with small yellow lightning','float','melee',('tentacles coil back, sparks build','electric tentacle lash')),
('m10','Wraith Lantern','a haunted black-iron lantern with a cold blue ghost flame inside, a faint ghostly face in the glass and wispy spirit arms','float','cast',('the ghost flame grows inside the glass','the blue flame flares out of the lantern door')),
('t01','Rune Sentinel','a towering stone-and-steel guardian knight with glowing blue runes, a tall tower shield and a broad runic sword','walk','smash',('raises the runic sword overhead','sword slams down')),
('t02','Hall Acolyte','a hooded acolyte in dark green robes with a pale masked face, holding a small lantern of teal spirit light','walk','cast',('the lantern light swells','teal spirit light bursts from the lantern held forward')),
('t03','Chained Grimoire','a floating living spellbook bound in iron chains, with a leather cover, an eye on the cover, page-teeth and loose chain ends','float','melee',('the book snaps shut and pulls back','flies open with a chain-whip strike')),
('t04','Ink Wraith','a wraith made of dripping navy-black ink with glowing pale-blue eyes and long quill-like claws, its lower body trailing into ink drips','float','cast',('ink swirls into its claws','a burst of glowing ink magic from its claw')),
('t05','Forge Automaton','a stout bronze forge golem with a glowing furnace in its chest, riveted plates, one hand a heavy hammer and the other a tong claw','walk','smash',('lifts the hammer arm high, furnace flares','hammer smashes down')),
('t06','Cinder Shaman','a tribal fire shaman with a horned skull mask, ember-red body paint, a feather mantle and a gnarled staff topped with a burning coal','walk','cast',('the coal on the staff blazes','a flame burst from the staff tip')),
('t07','Glacier Knight','a knight in pale-blue glacier-ice armour with frost crystals on the shoulders and a jagged crystal greatsword','walk','smash',('raises the crystal greatsword overhead','greatsword slams down with ice chips')),
('t08','Storm Siren','a winged siren with silver-blue feathered wings, long white hair, a sea-blue dress and crackling storm sparks around her hands','fly','cast',('wings spread, sparks gather in her hands','a bright lightning burst from her hands')),
('t09','Seraph Guard','a golden armoured angel guard with a halo, feathered wings, a long spear and a round sun-emblem shield','walk','melee',('draws the spear back behind the shield','spear thrust')),
('t10','Star Oracle','a mystic oracle in a deep-blue robe patterned with stars, a veiled face and a floating glowing star orb in her hands','walk','cast',('the star orb brightens and spins','starlight bursts from the orb')),
('x11','Reef Crab Knight','a giant orange-red reef crab armoured with coral spikes, one huge crusher claw and a blue shell-shield on the other arm','crawl','smash',('raises the crusher claw high','claw slams down')),
('x12','Abyss Angler','a deep-sea anglerfish swimming in the air, dark blue body, huge needle-tooth jaw, a glowing cyan lure on its head and torn fins','float','cast',('the lure dims then brightens','a blinding cyan flash from the lure')),
('x13','Drowned Corsair','an undead skeleton pirate with a tattered tricorn hat, a rotting blue coat, seaweed on the bones and a rusty cutlass','walk','melee',('draws the cutlass back','cutlass slash')),
('x21','Ember Hound','a big lava hound with charcoal-black fur, a mane and tail of living flame and glowing magma paws','quad','melee',('crouches, flames flare','fiery bite lunge')),
('x22','Cinder Imp','a chubby round fire imp whose body is glowing coal with a flame hair-tuft, tiny bat wings and stubby horns, juggling a small fireball','fly','cast',('the fireball grows between its hands','fire bursts from its outstretched hands')),
('x23','Ash Wyvern','a lean ash-grey wyvern with orange-glowing wing membranes, ember cracks along its neck and a spiked tail','walk','cast',('rears its neck back, throat glows','a short burst of flame at its open mouth')),
('x31','Frost Yeti','a huge white-furred yeti with blue ice crystals growing from its shoulders, short blue horns and massive fists','walk','smash',('raises both fists overhead','double-fist smash')),
('x32','Ice Wraith','a hooded wraith of frost with a tattered pale-blue robe, no legs, icy claws and cold glowing eyes inside the hood','float','cast',('frost swirls around its claws','an icy burst from its claw')),
('x33','Mammoth Knight','a mammoth-headed warrior in steel plate armour with long curved tusks, a war banner on its back and a huge war hammer','walk','smash',('heaves the war hammer up','hammer slams down')),
('x34','Rime Witch','a tall, regal ice witch (a mini-boss, larger and more ornate) with a crystal crown, long white hair, a flowing frost gown and a snowflake staff','walk','cast',('snowflakes spiral up the staff','a frost burst from the staff')),
('x41','Storm Harpy','a harpy with golden-white feathered wings, sharp talons, a fierce face and small lightning sparks in her feathers','fly','melee',('pulls back, wings high','diving talon strike')),
('x42','Arcane Sentinel','a floating arcane armour construct, empty plate armour held together by blue-white runes with a glowing crystal core in the chest','float','cast',('runes spin around the core','arcane light bursts from its palm')),
('x43','Griffin Rider','an armoured knight riding a white-and-gold griffin, holding a lance with a blue pennant','quad','melee',('the griffin rears, lance drawn back','lance charge')),
('x44','Star Archmage','an ancient archmage (a mini-boss, larger and more ornate) with a long white beard, flowing starry blue-and-gold robes and a tall staff topped with a ringed planet orb','walk','cast',('the planet orb glows and its ring spins','starlight bursts from the staff')),
('x51','Gear Hound','a steampunk mechanical dog of brass and copper with visible gears, a small smoking chimney on its back and glowing green eye lenses','quad','melee',('crouches, steam puffs','metal-jaw bite lunge')),
('x52','Steam Knight','a steampunk knight with a boiler backpack venting steam, brass armour and a giant piston gauntlet','walk','smash',('pulls the piston gauntlet back, steam builds','piston punch slams down')),
('x53','Copter Drone','a round brass steampunk flying drone with a spinning top propeller, a big green lens eye and a small cannon underneath','float','shoot',('the cannon turns forward and glows','the cannon fires')),
('x54','Brass Juggernaut','a huge brass steam golem (a mini-boss, larger and heavier) with smoking chimneys on its back, a drill arm, a riveted body and a glowing furnace belly','walk','smash',('raises the drill arm high','drill arm smashes down')),
('x61','Void Stalker','a void panther with a deep-indigo body full of tiny stars, glowing violet eyes and wisps of shadow trailing from its paws','quad','melee',('crouches low to pounce','claw pounce')),
('x62','Rift Eye','a giant floating eyeball with a violet iris, framed by dark spikes and tentacles coming out of a small space rift behind it','float','cast',('the iris contracts, energy gathers','a violet burst from the eye')),
('x63','Mirror Knight','a slender knight in mirror-polished silver-blue crystal armour with a glass blade that catches the light','walk','melee',('raises the glass blade','fast blade slash')),
('x64','Chaos Chimera','a chimera (a mini-boss, larger and more ornate) with a lion head, a goat head on its back, a serpent tail and gold-and-blue-violet armour plates','quad','cast',('both heads roar, fire gathers in the lion mouth','a burst of fire at the lion jaws')),
('x71','Singha Cub','a young Thai temple Singha lion cub with white fur, a curly golden mane, gold temple ornaments and big round eyes','quad','melee',('crouches, tail up','pouncing swipe')),
('x81','Demon Spearman','a Thai Yaksha demon soldier with red skin, tusks, a golden pointed chada crown, gold armour bands and a long spear','walk','melee',('draws the spear back','spear thrust')),
]
CH=[];I=[]
def sec(title,note,items): CH.append({'title':title,'note':note,'items':items})
# UI first
stars=[('6','a five-point golden star badge with rounded beveled edges, turquoise gem studs at each point and a dark-brown circle in the middle holding the bold cream number 6'),
('7','a five-point golden star badge, slightly larger and more ornate than rank 6, with turquoise gem studs and a dark-brown circle in the middle holding the bold cream number 7'),
('8','a golden star badge with a second layer of short gold rays behind it, turquoise gem studs and a dark-brown circle holding the bold cream number 8'),
('9','a golden star badge with gold rays behind it, a gold laurel edge, turquoise gems and a dark-brown circle holding the bold cream number 9'),
('10','the top-rank badge: a deep ruby-red star with a thick gold frame, small gold wings, a ring of flames behind it and the bold white number 10 on the star')]
def iconp(desc,anim):
    return (f"16-bit pixel art game icon animation: {desc}. {GRID} Front view, the icon is centred and is the SAME size and position in every frame; it must not move, scale or rotate. "
            f"Only the light animates: {anim}. Smooth seamless 16-frame loop, frame 16 flows back into frame 1.")
items=[{'h':f'Star badge {n}','p':iconp(d,'a soft shine sweeps across the metal, the gems twinkle one after another and the outer glow gently pulses')} for n,d in stars]
items.append({'h':'Tower rank-1 shield','p':iconp('a golden heraldic shield with a small castle tower emblem in the centre, a gold crown on top, a blue sapphire above the tower and small gold wings on both sides','crackling blue-white lightning runs around the edge of the shield, the sapphire glows and a shine sweeps across the gold')})
sec('Star badges and tower shield','6 images. One image each.',items)
AMS=[('kfang','King\'s Fang (เขี้ยวราชันย์)','a large ivory beast fang hanging from a gold chain, wrapped in a gold band with a red ruby','red-orange flames lick up around the fang and a shine runs down its edge'),
('dscale','Divine Dragon Scale (เกราะมังกรเทพ)','an emerald dragon-scale pendant set in an ornate gold frame with a small gold dragon curled on top','a green energy shine sweeps across the scales and small emerald shards orbit and sparkle'),
('deye','Eye of Death (เนตรมรณะ)','a dark iron diamond pendant with a single glowing violet slit eye in the centre and thorny black metal spikes','blue-violet lightning crackles around it and the eye slowly opens wider and narrows again'),
('seraph','Seraph Wings (ปีกเซราฟ)','a gold pendant with a glowing sky-blue sapphire heart and a pair of white feathered wings','the wings gently flap, small white feathers drift off and a holy glow pulses'),
('grove','Grove Emerald (มรกตพฤกษา)','an ornate gold leaf-and-vine pendant holding a large marquise emerald with a small ruby on top','the emerald glows from within, small golden leaves drift around it and sparkles twinkle'),
('lion','Lionheart (หัวใจราชสีห์)','a gold pendant shaped like a heart-shaped amber gem guarded by two gold lion heads and a small crown','a warm golden glow beats like a heartbeat inside the gem and sparks rise'),
('gstar','Guardian Star (ดาราพิทักษ์)','a silver-and-blue crest with a glowing blue star in the centre, crystal wings and a small crown','the blue star pulses, crystal shards twinkle and a cool light ripples outward'),
('hallow','Pumpkin Soul Lantern (โคมวิญญาณฟักทอง)','a small carved jack-o-lantern pendant in a dark iron frame with bat wings, glowing orange inside with a green spirit flame on top','the green flame flickers and the carved face glows brighter and dimmer'),
('clover','Lucky Clover','a gold medallion holding a bright four-leaf clover made of green gems, with a small gold dragon on top','a green shine sweeps across the leaves and gold sparkles pop around the edge')]
sec('Animated amulets','9 images. One image each. Same look as the current amulets, redrawn at 16 frames.',[{'h':f'{n}','p':iconp(d,a)} for k,n,d,a in AMS])
# monsters
mi=[]
for k,n,d,mv,st,act in M:
    walkmv = mv
    mi.append({'h':n,'id':k,'list':[('Idle',idle(n,d,mv)),('Walk',walk(n,d,walkmv)),('Attack',attack(n,d,st,act))]})
CH.append({'title':'Monsters','note':'44 monsters, 3 images each (132 images). New design, same name. Singha Alpha, Demon Captain, Reef Raider and Reef Warlord reuse Singha Cub, Demon Spearman and Reef Crab Knight, so they need no images of their own.','chars':mi})
FXG=("Exactly 16 frames arranged in a 4x4 grid (4 columns x 4 rows), read left to right, top to bottom, all cells the same size. "
 "Flat solid magenta background #FF00FF in every cell, no gradient, no grid lines, no text, no watermark. The effect is centred in each cell and never crosses a cell edge. "
 "Do not use magenta or hot pink in the effect; purples lean blue-violet, pinks lean rose-gold or coral. 16-bit pixel art, crisp pixels, bright readable colours, dark-to-light shading, premium SNES / GBA JRPG quality, no blur.")
def fxp(d,kind):
    t={'one':'ONE-SHOT: frame 1 is a tiny spark, it grows to full size by frames 5-7, holds, then breaks up and fades so frames 14-16 are only a few fading particles.',
       'proj':'LOOP: the projectile flies to the RIGHT but stays in the same place in its cell; only its flicker, glow and trail animate. Smooth seamless loop.',
       'ult':'ONE-SHOT ULTIMATE: frames 1-4 build up, frames 5-10 the big moment at full size and brightness, frames 11-16 dissolve and fade to a few particles.'}[kind]
    return f"16-bit pixel art visual effect animation: {d}. {FXG} {t}"
FX=[('arrow','Arrow','a wooden arrow with a steel head and white fletching, with thin white speed lines behind','proj'),
('farrow','Fire arrow','a wooden arrow wrapped in orange-yellow flame with a trail of embers','proj'),
('fball','Fireball','a blazing orange-yellow fireball with a swirling flame tail','proj'),
('orb','Holy orb','a glowing golden light orb with a sparkling gold trail','proj'),
('shard','Ice shard','a sharp blue ice-crystal spear with frosty mist trailing behind','proj'),
('bolt','Lightning strike','a jagged white-yellow lightning bolt striking down from the top of the cell to the ground, with a spark splash at the bottom','one'),
('boom','Explosion','a fiery explosion: white flash, orange fireball, dark smoke ring and flying debris','one'),
('buff','Power-up','a golden power-up aura rising from a glowing ring on the ground, with upward light streaks and small cross sparks','one'),
('claw','Claw slash','three red-orange diagonal claw slash marks tearing through the air with sparks','one'),
('drain','Life drain','a crimson vortex spiral pulling small red life orbs into its centre','one'),
('fx-crit','Critical hit','a big golden-orange starburst with a shock ring, for a critical hit','one'),
('fx-ko','Knock-out','a white-lavender star burst that breaks into sparkles, then a small blue soul wisp floats up','one'),
('heal','Heal','a soft green healing pillar rising from a glowing ground ring with spiralling leaves and sparkles','one'),
('hit','Hit spark','a sharp orange-yellow impact spark burst','one'),
('holy','Holy light','a golden beam of holy light falling from above onto a halo ring on the ground, with small feathers','one'),
('ice','Ice burst','a blue ice crystal burst: crystals explode outward then shatter into frost','one'),
('shield','Shield','a blue hexagon-pattern energy shield bubble that forms from a spark, holds and then fades','one'),
('slash','Sword slash','a blue-white crescent sword slash arc with a sparkle edge','one'),
('smash','Ground smash','a heavy ground smash with a bright impact, flying rocks and a brown dust cloud','one'),
('wind','Whirlwind','a teal-green tornado whirlwind with spinning leaves','one'),
('ult-blood','Ultimate: Blood','a crimson blood vortex that spins up and explodes into a red star-shaped cross slash','ult'),
('ult-chain','Ultimate: Chain lightning','a dark blue-violet storm cloud that drops chains of yellow lightning onto the ground','ult'),
('ult-dive','Ultimate: Dive','a flaming meteor diving diagonally down to the right and exploding into fire on the ground','ult'),
('ult-forms','Ultimate: Golden clouds','swirling golden auspicious Thai-style clouds that form a golden pillar, then spin into a golden ring','ult'),
('ult-fort','Ultimate: Fortress','a frost ring on the ground from which a wall of blue ice-crystal spires rises like a fortress','ult'),
('ult-halo','Ultimate: Halo','rose-gold and white light pillars rising from a halo ring, with drifting white feathers','ult'),
('ult-hydra','Ultimate: Hydra','several fire serpent heads twisting forward to the right, then exploding into flame','ult'),
('ult-rebirth','Ultimate: Rebirth','a blue-white phoenix of light rising from a rune circle, ending in a tall pillar of light','ult'),
('ult-reflect','Ultimate: Reflect','a wall of dark obsidian crystal with glowing lava cracks rising up and reflecting a red beam back to the right','ult'),
('ult-scorch','Ultimate: Scorch','a wave of fire sweeping to the right like a flamethrower, leaving burning ground and dark smoke','ult'),
('ult-stand','Ultimate: Last stand','a golden shield emblem rising with angel wings, then a holy glass-blue dome barrier closes over it','ult'),
('ult-zero','Ultimate: Absolute zero','a frost circle on the ground from which giant ice spikes erupt, then shatter into cold mist','ult')]
sec('Effects','32 images. One image each.',[{'h':n,'p':fxp(d,kd)} for k,n,d,kd in FX])
json.dump(CH,open('/tmp/claude-0/-home-claude/faf65de1-a492-52b3-8473-ee4e7e7dcc7a/scratchpad/prompts/data.json','w'),ensure_ascii=False)
n=sum(len(s.get('items',[])) for s in CH)+sum(3 for c in mi);print('images',n)
