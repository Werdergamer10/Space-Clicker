// ══════════════════════════════════════════════════════════════════
// COSMIC REACTOR v3.0
// ══════════════════════════════════════════════════════════════════
let energy=0, eps=0, clickPower=1, starCores=0;
let purchasedStars=[], activeBanner=1, isRolling=false;
let activeGachaMode='click';
let inventory=[], equippedPlanets=[null,null,null,null,null,null];
let totalClicks=0, totalEnergy=0, totalRolls=0;
let unlockedAch=[], achNotifQueue=[];
let rebirthCount=0, totalPlayTime=0;
let sessionStartTime=Date.now();

const BASE_BANNER_COSTS={1:120000,2:70000000,3:400000000000,4:1e15,5:6e18,6:3e24};
const BASE_BANNER_COSTS_B={1:150000,2:90000000,3:500000000000,4:1.3e15,5:8e18,6:4e24};
const bannerCosts={...BASE_BANNER_COSTS};
const bannerCostsBuilding={...BASE_BANNER_COSTS_B};

// multiplier = multiplicative bonus (×X) applied to click or EPS
const P=(id,n,r,b,m,c,t,gt='click')=>({id,name:n,rarity:r,banner:b,multiplier:m,color:c,type:t,gachaType:gt});
const Pb=(id,n,r,b,m,c,t)=>P(id,n,r,b,m,c,t,'building');

const planetPool=[
P('c01','Staubkorn',        'common',1,1.04,'#8B7355','rocky'),
P('c02','Kies-Mond',        'common',1,1.05,'#708090','rocky'),
P('c03','Sandfels',         'common',1,1.06,'#C4A882','desert'),
P('c04','Eis-Splitter',     'common',1,1.07,'#B0C4DE','ice'),
P('c05','Sumpf-Ball',       'common',1,1.05,'#4A5240','toxic'),
P('c06','Roststein',        'common',1,1.08,'#8B4040','rocky'),
P('c07','Nebelball',        'common',1,1.07,'#7090B0','gas'),
P('c08','Kohlenfels',       'common',1,1.04,'#2D2D2D','rocky'),
P('c09','Sandwüste',        'common',1,1.09,'#D4B483','desert'),
P('c10','Tonfels',          'common',1,1.08,'#A05030','rocky'),
P('c11','Grauer Zwerg',     'common',2,1.12,'#808080','rocky'),
P('c12','Eiswüste',         'common',2,1.15,'#C0D8E0','ice'),
P('c13','Salzebene',        'common',2,1.18,'#D8D8D8','ocean'),
P('c14','Steinhorn',        'common',2,1.20,'#604830','rocky'),
P('c15','Tundra-Welt',      'common',2,1.25,'#5A7080','ice'),
P('c16','Asche-Ball',       'common',3,1.30,'#505050','volcanic'),
P('c17','Schwefel-Mond',    'common',3,1.35,'#C0A020','toxic'),
P('c18','Granit-Riese',     'common',3,1.40,'#909090','rocky'),
P('c19','Moosfeld',         'common',3,1.45,'#3A5030','forest'),
P('c20','Fossil-Ball',      'common',3,1.50,'#8A7060','rocky'),
P('r01','Azur-Ozean',       'rare',1,1.80,'#0080FF','ocean'),
P('r02','Smaragd-Welt',     'rare',1,2.00,'#00A060','forest'),
P('r03','Rubin-Fels',       'rare',1,2.20,'#C02040','crystal'),
P('r04','Saphir-Mond',      'rare',1,2.50,'#2040C0','crystal'),
P('r05','Türkis-Welt',      'rare',2,3.00,'#20C0A0','ocean'),
P('r06','Amethyst-Fels',    'rare',2,3.50,'#8040C0','crystal'),
P('r07','Bernstein-Ball',   'rare',2,4.00,'#D08020','volcanic'),
P('r08','Neon-Wüste',       'rare',2,4.50,'#FF4000','desert'),
P('r09','Korallen-Welt',    'rare',2,5.00,'#FF6060','ocean'),
P('r10','Jade-Mond',        'rare',2,5.50,'#00C070','forest'),
P('r11','Kupfer-Riese',     'rare',3,7.00,'#C06030','rocky'),
P('r12','Phosphor-Ball',    'rare',3,8.50,'#40FF40','toxic'),
P('r13','Titan-Fels',       'rare',3,10.0,'#80A0C0','rocky'),
P('r14','Zirkon-Mond',      'rare',3,12.0,'#C0A0E0','crystal'),
P('r15','Opal-Kugel',       'rare',3,15.0,'#C0D0E0','prismatic'),
P('r16','Citrin-Mond',      'rare',4,20.0,'#D0C000','crystal'),
P('r17','Malachit-Welt',    'rare',4,25.0,'#20A040','crystal'),
P('r18','Turmalin-Welt',    'rare',4,32.0,'#E040A0','prismatic'),
P('r19','Fluorit-Mond',     'rare',5,42.0,'#80FF80','crystal'),
P('r20','Aquamarin-Welt',   'rare',5,55.0,'#60E0D0','ocean'),
P('r21','Onyx-Ball',        'rare',5,70.0,'#202030','void'),
P('r22','Rhodonit-Kern',    'rare',6,90.0,'#C03060','crystal'),
P('e01','Quanten-Zwilling', 'epic',2,100, '#6040FF','quantum'),
P('e02','Plasma-Koloss',    'epic',2,130, '#FF6000','stellar'),
P('e03','Dunkel-Magie',     'epic',2,160, '#200040','shadow'),
P('e04','Ionensturm',       'epic',3,220, '#0040FF','gas'),
P('e05','Neutronen-Ball',   'epic',3,280, '#102030','void'),
P('e06','Magma-Riese',      'epic',3,350, '#FF3000','volcanic'),
P('e07','Kristall-Nebel',   'epic',3,450, '#C040C0','crystal'),
P('e08','Pulsars-Echo',     'epic',3,550, '#A0C0FF','stellar'),
P('e09','Tachyon-Welt',     'epic',4,700, '#00A0FF','quantum'),
P('e10','Schattenfels',     'epic',4,900, '#100020','shadow'),
P('e11','Antigrav-Mond',    'epic',4,1200,'#6000C0','quantum'),
P('e12','Spektral-Ball',    'epic',4,1500,'#FF0080','prismatic'),
P('e13','Zeitriss-Welt',    'epic',5,2000,'#0080C0','quantum'),
P('e14','Aether-Koloss',    'epic',5,2800,'#0010A0','void'),
P('e15','Chroma-Riese',     'epic',5,3800,'#FF8040','prismatic'),
P('e16','Resonanz-Koloss',  'epic',6,5000,'#2080FF','gas'),
P('m01','Urknall-Kern',     'mythic',3,8000, '#FFFFA0','stellar'),
P('m02','Schwarzloch-Ring', 'mythic',3,12000,'#050505','void'),
P('m03','Supernova-Frag',   'mythic',3,18000,'#FF2000','stellar'),
P('m04','Wormhole-Zentr',   'mythic',4,28000,'#4000FF','quantum'),
P('m05','Neutronenstern',   'mythic',4,40000,'#80C0FF','stellar'),
P('m06','Quasar-Fragment',  'mythic',4,60000,'#FF8000','stellar'),
P('m07','Anti-Materie',     'mythic',5,90000,'#FF00FF','quantum'),
P('m08','Dimension-Riss',   'mythic',5,130000,'#8000FF','quantum'),
P('m09','Galaxis-Kern',     'mythic',5,200000,'#FFC000','stellar'),
P('m10','Anti-Kosmos',      'mythic',6,320000,'#0000FF','void'),
P('s01','Schöpfungs-Funke', 'secret',4,600000,  '#FFE040','stellar'),
P('s02','Realitäts-Kern',   'secret',4,1000000, '#0000FF','quantum'),
P('s03','Kosmos-Herz',      'secret',4,1800000, '#FF0040','stellar'),
P('s04','Ewigkeits-Mond',   'secret',5,3200000, '#FFC080','divine'),
P('s05','Manifest-Kern',    'secret',5,6000000, '#FF8040','divine'),
P('s06','Urlichts-Fragment','secret',6,1.2e7,   '#FFFF80','stellar'),
P('s07','Bewusstsein-Sph',  'secret',6,2.5e7,   '#200060','void'),
P('s08','Transzendenz',     'secret',6,5e7,     '#FF60FF','quantum'),
P('g01','Göttliches Auge',  'divine',5,1.5e8,   '#FFD700','divine'),
P('g02','Schöpfer-Hand',    'divine',5,5e8,     '#FFFFC0','divine'),
P('g03','Ewiger Wille',     'divine',6,2e9,     '#FFC000','divine'),
P('g04','Himmels-Zitad.',   'divine',6,1e10,    '#E0E8FF','divine'),
P('g05','KLICK-GOTTHEIT',   'divine',6,1e11,    '#FFFFFF','divine'),
];

const buildingPlanetPool=[
Pb('bc01','Erz-Mond',       'common',1,1.04,'#9B8355','rocky'),
Pb('bc02','Kohle-Ball',     'common',1,1.05,'#606060','rocky'),
Pb('bc03','Lehm-Welt',      'common',1,1.06,'#D4A882','desert'),
Pb('bc04','Frost-Splitter', 'common',1,1.07,'#B8D4E8','ice'),
Pb('bc05','Moos-Mond',      'common',1,1.05,'#3A5230','forest'),
Pb('bc06','Russ-Stein',     'common',1,1.08,'#7B3030','volcanic'),
Pb('bc07','Dampf-Ball',     'common',1,1.07,'#8090A0','gas'),
Pb('bc08','Anthrazit',      'common',1,1.04,'#252525','rocky'),
Pb('bc09','Ton-Wüste',      'common',1,1.09,'#C4A453','desert'),
Pb('bc10','Schiefer-Mond',  'common',1,1.08,'#A06030','rocky'),
Pb('bc11','Grauer Riese',   'common',2,1.12,'#707070','rocky'),
Pb('bc12','Permafrost',     'common',2,1.15,'#C8E0F0','ice'),
Pb('bc13','Salzebene-B',    'common',2,1.18,'#E0E0D8','ocean'),
Pb('bc14','Fels-Titan',     'common',2,1.20,'#504020','rocky'),
Pb('bc15','Tundra-Riese',   'common',2,1.25,'#4A6070','ice'),
Pb('bc16','Schwefel-Ring',  'common',3,1.30,'#C08010','toxic'),
Pb('bc17','Basalt-Riese',   'common',3,1.35,'#383838','rocky'),
Pb('bc18','Lehm-Titan',     'common',3,1.40,'#A07840','desert'),
Pb('bc19','Eis-Koloß',      'common',3,1.45,'#80B0C8','ice'),
Pb('bc20','Moos-Riese',     'common',3,1.50,'#2A4020','forest'),
Pb('rb01','Kupfer-Ozean',   'rare',1,1.80,'#0090FF','ocean'),
Pb('rb02','Malachit-Welt',  'rare',1,2.00,'#00B060','forest'),
Pb('rb03','Carneol-Fels',   'rare',1,2.20,'#C02050','crystal'),
Pb('rb04','Lapislazuli',    'rare',1,2.50,'#2050C0','crystal'),
Pb('rb05','Türkis-Ozean',   'rare',2,3.00,'#10C0A0','ocean'),
Pb('rb06','Amethyst-Riese', 'rare',2,3.50,'#9050D0','crystal'),
Pb('rb07','Gold-Ball',      'rare',2,4.00,'#D09030','volcanic'),
Pb('rb08','Lava-Wüste',     'rare',2,4.50,'#FF5000','desert'),
Pb('rb09','Korallen-Mond',  'rare',2,5.00,'#FF7070','ocean'),
Pb('rb10','Jade-Welt',      'rare',2,5.50,'#00C860','forest'),
Pb('rb11','Bronze-Riese',   'rare',3,7.00,'#C07040','rocky'),
Pb('rb12','Neon-Ball',      'rare',3,8.50,'#50FF50','toxic'),
Pb('rb13','Stahl-Fels',     'rare',3,10.0,'#90A8C8','rocky'),
Pb('rb14','Kristall-Mond',  'rare',3,12.0,'#D0B0E8','crystal'),
Pb('rb15','Goldstaub',      'rare',3,15.0,'#D0B010','void'),
Pb('rb16','Plasma-Mond',    'rare',4,20.0,'#C080FF','quantum'),
Pb('rb17','Magnet-Welt',    'rare',4,25.0,'#4080C0','rocky'),
Pb('rb18','Ionit-Riese',    'rare',4,32.0,'#20D0A0','ocean'),
Pb('rb19','Zirkon-Riese',   'rare',5,42.0,'#C0A0E0','crystal'),
Pb('rb20','Opal-Titan',     'rare',5,55.0,'#C0D0FF','prismatic'),
Pb('rb21','Nexus-Ball',     'rare',5,70.0,'#8060C0','quantum'),
Pb('rb22','Plasma-Gigant',  'rare',6,90.0,'#A050FF','quantum'),
Pb('eb01','Plasma-Zwilling','epic',2,100, '#5040FF','quantum'),
Pb('eb02','Magma-Koloss',   'epic',2,130, '#FF7000','stellar'),
Pb('eb03','Schatten-Magie', 'epic',2,160, '#300050','shadow'),
Pb('eb04','Ion-Sturm',      'epic',3,220, '#0050FF','gas'),
Pb('eb05','Neutronen-Kern', 'epic',3,280, '#182040','void'),
Pb('eb06','Vulkan-Riese',   'epic',3,350, '#FF4000','volcanic'),
Pb('eb07','Plasma-Nebel',   'epic',3,450, '#D050D0','crystal'),
Pb('eb08','Pulsar-Welle',   'epic',3,550, '#B0D0FF','stellar'),
Pb('eb09','Tachyon-Kern',   'epic',4,700, '#00B0FF','quantum'),
Pb('eb10','Dunkel-Koloss',  'epic',4,900, '#180028','shadow'),
Pb('eb11','Reaktions-Kern', 'epic',4,1200,'#8060FF','quantum'),
Pb('eb12','Resonanz-Ring',  'epic',4,1500,'#FF60A0','stellar'),
Pb('eb13','Zeitfeld-Ball',  'epic',5,2000,'#00A0C0','quantum'),
Pb('eb14','Void-Titan',     'epic',5,2800,'#040415','void'),
Pb('eb15','Spektrum-Riese', 'epic',5,3800,'#FF80C0','prismatic'),
Pb('eb16','Kausal-Koloss',  'epic',6,5000,'#4080FF','quantum'),
Pb('mb01','Urknall-Welle',  'mythic',3,8000, '#FFFFB0','stellar'),
Pb('mb02','Schwarzloch-Halo','mythic',3,12000,'#080808','void'),
Pb('mb03','Supernova-Kern', 'mythic',3,18000,'#FF3000','stellar'),
Pb('mb04','Wormhole-Ring',  'mythic',4,28000,'#5000FF','quantum'),
Pb('mb05','Neutronen-Käfig','mythic',4,40000,'#90D0FF','stellar'),
Pb('mb06','Quasar-Ring',    'mythic',4,60000,'#FF9000','stellar'),
Pb('mb07','Dunkel-Materie', 'mythic',5,90000,'#200030','shadow'),
Pb('mb08','Kosmos-Matrix',  'mythic',5,130000,'#60C0FF','quantum'),
Pb('mb09','Galaxis-Herz',   'mythic',5,200000,'#FFB000','stellar'),
Pb('mb10','Nullpunkt-Rex',  'mythic',6,320000,'#000030','void'),
Pb('sb01','Schöpfungs-Licht','secret',4,600000,  '#FFE050','stellar'),
Pb('sb02','Realitäts-Welle','secret',4,1000000, '#1000FF','quantum'),
Pb('sb03','Kosmos-Herz-B',  'secret',4,1800000, '#FF0050','stellar'),
Pb('sb04','Ewigkeits-Kern', 'secret',5,3200000, '#FFD090','divine'),
Pb('sb05','Manifest-Licht', 'secret',5,6000000, '#FF9050','divine'),
Pb('sb06','Schöpfungs-Odem','secret',6,1.2e7,   '#FFFFD0','stellar'),
Pb('sb07','Nexus-Wille',    'secret',6,2.5e7,   '#C0C0FF','quantum'),
Pb('sb08','Urkraft-Sphäre', 'secret',6,5e7,     '#FF50FF','quantum'),
Pb('gb01','Göttl. Licht',   'divine',5,1.5e8,   '#FFE700','divine'),
Pb('gb02','Schöpfer-Wille', 'divine',5,5e8,     '#FFFFD0','divine'),
Pb('gb03','Ewiger Kern',    'divine',6,2e9,     '#FFC800','divine'),
Pb('gb04','Himmels-Kern',   'divine',6,1e10,    '#E8F0FF','divine'),
Pb('gb05','GEBÄUDE-GOTT',   'divine',6,1e11,    '#FFFFFF','divine'),
];

// ── PLANET CSS RENDERING (no external images) ─────────────────
function getPlanetGradient(planet){
    const c=planet.color, t=planet.type||'rocky';
    const L=(h,v)=>_lighten(h,v), D=(h,v)=>_darken(h,v);
    const m={
        rocky:   `radial-gradient(circle at 33% 27%, ${L(c,45)}, ${c} 50%, ${D(c,55)})`,
        gas:     `radial-gradient(ellipse at 50% 25%, ${L(c,60)} 0%, ${c} 45%, ${D(c,25)} 100%)`,
        ice:     `radial-gradient(circle at 38% 24%, #ffffff, ${c} 38%, ${D(c,30)} 100%)`,
        volcanic:`radial-gradient(circle at 35% 30%, ${L(c,80)}, ${D(c,15)} 40%, ${D(c,65)})`,
        crystal: `radial-gradient(circle at 38% 33%, rgba(255,255,255,0.8), ${c} 28%, ${D(c,45)})`,
        ocean:   `radial-gradient(circle at 45% 18%, #aae0ff, ${c} 45%, ${D(c,35)})`,
        desert:  `radial-gradient(ellipse at 45% 30%, ${L(c,55)}, ${c} 55%, ${D(c,35)})`,
        forest:  `radial-gradient(ellipse at 50% 38%, ${L(c,35)}, ${c} 52%, ${D(c,45)})`,
        toxic:   `radial-gradient(circle at 38% 28%, ${L(c,90)}, ${c} 38%, ${D(c,22)})`,
        void:    `radial-gradient(circle at 33% 26%, ${L(c,35)}, ${c} 48%, #000 100%)`,
        stellar: `radial-gradient(circle at 38% 28%, #ffffff, ${L(c,55)}, ${c})`,
        shadow:  `radial-gradient(circle at 33% 26%, ${L(c,25)}, ${c} 45%, #000015)`,
        prismatic:`radial-gradient(circle at 38% 28%, #ffffff, ${c} 35%, ${D(c,22)})`,
        quantum: `radial-gradient(circle at 33% 26%, ${L(c,45)}, ${c} 42%, ${D(c,32)})`,
        divine:  `radial-gradient(circle at 35% 26%, #ffffff, ${L(c,85)}, ${c}, ${D(c,20)})`,
    };
    return m[t]||m.rocky;
}

function getPlanetExtraStyles(rarity){
    if(rarity==='divine')   return 'animation:divineShimmer 2s ease-in-out infinite;';
    if(rarity==='secret')   return 'animation:secretShimmer 3s ease-in-out infinite;';
    if(rarity==='mythic')   return 'animation:mythicGlow 2.5s ease-in-out infinite;';
    return '';
}

// ── ACHIEVEMENTS (200) ────────────────────────────────────────
const ACH_CATS={
    KLICK:     {col:'#00f0ff',icon:'⚡',label:'KLICK-MEISTER'},
    ENERGIE:   {col:'#ffb703',icon:'☀️',label:'ENERGIE-LORD'},
    GACHA:     {col:'#ffd700',icon:'🎲',label:'GACHA-JÄGER'},
    SAMMLER:   {col:'#4cc9f0',icon:'🪐',label:'PLANETEN-SAMMLER'},
    REBIRTH:   {col:'#b5179e',icon:'♻️',label:'WIEDERGEBORENER'},
    FORSCHUNG: {col:'#00ff88',icon:'🔬',label:'FORSCHUNGS-GENIE'},
    PRODUKTION:{col:'#ff6b00',icon:'⚙️',label:'PRODUKTIONS-KÖNIG'},
    GEHEIMNIS: {col:'#ff00ff',icon:'🔮',label:'GEHEIMNIS-HÜTER'},
    ZEIT:      {col:'#00e5cc',icon:'⏰',label:'ZEITLOSER'},
    KOSMOS:    {col:'#ffffff',icon:'✨',label:'KOSMISCHER MEISTER'},
};

const ACHIEVEMENTS=[];
(function buildAch(){
    const a=(id,cat,name,desc,type,target)=>ACHIEVEMENTS.push({id,cat,name,desc,type,target,unlocked:false,ts:0});
    // KLICK (20)
    [[1,'Erster Klick'],[10,'Zehn Impulse'],[50,'Fingerübung'],[100,'Hundert Klicks'],
     [500,'Grifftraining'],[1000,'Tausend Klicks'],[5000,'5.000 Klicks'],[1e4,'10.000 Klicks'],
     [5e4,'50k Club'],[1e5,'Hunderttausend'],[5e5,'Halb-Million'],[1e6,'Million Klicks'],
     [5e6,'5 Millionen'],[1e7,'10 Millionen'],[5e7,'50 Millionen'],[1e8,'Klick-Gott'],
     [5e8,'Halb-Milliarde'],[1e9,'Milliarde'],[1e11,'100 Milliarden'],[1e13,'Billionen-Klicker']
    ].forEach(([t,n],i)=>a(`klick_${i}`,'KLICK',n,`Klicke insgesamt ${t.toLocaleString('de')} mal`,'totalClicks',t));
    // ENERGIE (20)
    [[1e4,'Energie-Funke'],[1e6,'Energie-Million'],[1e9,'Milliarden-Energie'],[1e12,'Billion Plasma'],
     [1e15,'Quadrillion'],[1e18,'Quintillion'],[1e21,'Sextillion'],[1e24,'Septillion'],
     [1e27,'Oktillion'],[1e30,'Nonillion'],[1e33,'Dezillion'],[1e36,'Undezillion'],
     [1e39,'Duodezillion'],[1e42,'Tredezillion'],[1e48,'Kosmisch'],[1e54,'Mega-Kosmisch'],
     [1e60,'Giga-Kosmisch'],[1e70,'Tera-Kosmisch'],[1e80,'Peta-Kosmisch'],[1e100,'Göttliche Energie']
    ].forEach(([t,n],i)=>a(`erg_${i}`,'ENERGIE',n,`Produziere insgesamt ${t.toExponential(0)} Energie`,'totalEnergy',t));
    // GACHA (20)
    [[1,'Erste Ziehung'],[5,'5 Ziehungen'],[10,'10 Ziehungen'],[25,'25 Ziehungen'],
     [50,'50 Ziehungen'],[100,'100 Ziehungen'],[200,'200 Ziehungen'],[500,'500 Ziehungen'],
     [1000,'1.000 Ziehungen'],[1,'Erste Rare'],[1,'Erste Epic'],[1,'Erste Mythic'],
     [1,'Erstes Secret'],[1,'Erstes Göttlich'],[10,'10 Epics'],[5,'5 Mythics'],
     [3,'3 Secrets'],[1,'Alle Banner freigeschaltet'],[50,'50 Planeten gesammelt'],[100,'100 Planeten gesammelt']
    ].forEach(([t,n],i)=>a(`gacha_${i}`,'GACHA',n,`Gacha-Ziel: ${n}`,'gacha',i));
    // SAMMLER (20)
    [[5,'5 Planeten'],[10,'10 Planeten'],[20,'20 Planeten'],[30,'30 Planeten'],
     [50,'50 Planeten'],[75,'75 Planeten'],[100,'100 Planeten'],[150,'150 Planeten'],
     [200,'200 Planeten'],[1,'Common Sammler'],[5,'5 Commons'],[1,'Rare Sammler'],
     [5,'5 Rares'],[1,'Epic Sammler'],[3,'3 Epics'],[1,'Mythic Sammler'],
     [1,'Secret Sammler'],[1,'Göttlich Sammler'],[3,'Göttlich Trio'],[10,'Göttlich Dekade']
    ].forEach(([t,n],i)=>a(`samm_${i}`,'SAMMLER',n,`Sammle Planeten: ${n}`,'sammler',i));
    // REBIRTH (20)
    [[1,'Erste Wiedergeburt'],[2,'Zwei Leben'],[3,'Drei Leben'],[5,'Fünf Leben'],
     [10,'10 Rebirths'],[20,'20 Rebirths'],[50,'50 Rebirths'],[100,'100 Rebirths'],
     [1,'Erster Kern'],[10,'10 Kerne'],[50,'50 Kerne'],[100,'100 Kerne'],
     [500,'500 Kerne'],[1000,'1.000 Kerne'],[5000,'5.000 Kerne'],[10000,'10.000 Kerne'],
     [1,'Klick-Stern'],[1,'Sonde-Stern'],[1,'Mine-Stern'],[1,'Kosmos-Stern']
    ].forEach(([t,n],i)=>a(`reb_${i}`,'REBIRTH',n,`Rebirth-Ziel: ${n}`,'rebirth',i));
    // FORSCHUNG (20)
    [[1,'Erste Forschung'],[5,'5 Techs'],[10,'10 Techs'],[25,'25 Techs'],
     [50,'50 Techs'],[100,'100 Techs'],[200,'200 Techs'],[500,'500 Techs'],
     [1000,'Alle Techs!'],[1,'EPS verdoppelt'],[1,'EPS x10'],[1,'EPS x100'],
     [1,'EPS x1.000'],[1,'EPS x1e6'],[1,'EPS x1e9'],[1,'EPS x1e12'],
     [1,'EPS x1e15'],[1,'EPS x1e18'],[1,'EPS x1e21'],[1,'EPS x1e24']
    ].forEach(([t,n],i)=>a(`fors_${i}`,'FORSCHUNG',n,`Forschungs-Ziel: ${n}`,'forschung',i));
    // PRODUKTION (20)
    [[1,'Erstes Gebäude'],[5,'5 Gebäude'],[10,'10 Gebäude'],[25,'25 Gebäude'],
     [50,'50 Gebäude'],[100,'100 Gebäude'],[200,'200 Gebäude'],[500,'500 Gebäude'],
     [1000,'1.000 Gebäude'],[1,'Alle Arten gekauft'],[1,'Kollektor-Sonde x10'],[1,'Reaktor x10'],
     [1,'Dyson x5'],[1,'Antimaterie x3'],[1,'Wurmloch x1'],[1,'Hyperraum x1'],
     [1,'Galaxie-Schmelze x1'],[1,'Vakuum x1'],[1,'Dunkle Materie x1'],[1,'Multiversum x1']
    ].forEach(([t,n],i)=>a(`prod_${i}`,'PRODUKTION',n,`Produktions-Ziel: ${n}`,'produktion',i));
    // GEHEIMNIS (20) — hidden unlocks
    [[1,'???'],[1,'???'],[1,'???'],[1,'???'],[1,'???'],
     [1,'???'],[1,'???'],[1,'???'],[1,'???'],[1,'???'],
     [1,'???'],[1,'???'],[1,'???'],[1,'???'],[1,'???'],
     [1,'???'],[1,'???'],[1,'???'],[1,'???'],[1,'???']
    ].forEach(([t,n],i)=>a(`geh_${i}`,'GEHEIMNIS',n,'Geheimnis entdeckt!','geheimnis',i));
    // ZEIT (20)
    [[60,'1 Minute gespielt'],[300,'5 Minuten'],[600,'10 Minuten'],[1800,'30 Minuten'],
     [3600,'1 Stunde'],[7200,'2 Stunden'],[18000,'5 Stunden'],[36000,'10 Stunden'],
     [86400,'1 Tag'],[172800,'2 Tage'],[432000,'5 Tage'],[864000,'10 Tage'],
     [1,'Mitternacht-Spieler'],[1,'Frühaufsteher'],[1,'Marathon-Spieler'],[1,'Wochenend-Held'],
     [1,'Monats-Veteran'],[1,'3 Monate'],[1,'Halbes Jahr'],[1,'1 Jahr']
    ].forEach(([t,n],i)=>a(`zeit_${i}`,'ZEIT',n,`Zeit-Ziel: ${n}`,'zeit',i));
    // KOSMOS (20) — ultimate achievements
    [[1,'Klick-Gott'],[1,'Energie-Gott'],[1,'Gacha-Gott'],[1,'Sammel-Gott'],
     [1,'Rebirth-Gott'],[1,'Forschungs-Gott'],[1,'Produktions-Gott'],[1,'Geheimnis-Gott'],
     [1,'Zeit-Gott'],[1,'KOSMISCHER GOTT'],[1,'Alle 9 Götter'],[1,'200 Achievements'],
     [1,'Vollendung'],[1,'Unendlichkeit'],[1,'OMEGA-STATUS'],[1,'Urprinzip'],
     [1,'Alpha & Omega'],[1,'Transzendenz'],[1,'JENSEITS DES JENSEITS'],[1,'???DU HAST GEWONNEN???']
    ].forEach(([t,n],i)=>a(`kos_${i}`,'KOSMOS',n,`Ultimate: ${n}`,'kosmos',i));
})();

// ── ACHIEVEMENT CONSTELLATION POSITIONS ──────────────────────
// 10 clusters × 20 stars. Each cluster: [centerX%, centerY%]
// Stars: [offsetX, offsetY] from cluster center (% units)
const ACH_CLUSTERS={
    KLICK:     {cx:11,cy:12,stars:[[-4,-7],[0,-9],[4,-7],[7,-3],[5,2],[1,6],[-3,3],[-6,-1],[-2,4],[3,6],[6,1],[8,-4],[4,7],[0,9],[-4,6],[-7,2],[-8,-4],[-4,-9],[3,-4],[7,-6]]},
    ENERGIE:   {cx:36,cy:9, stars:[[0,-8],[4,-6],[7,-2],[6,3],[3,7],[-1,8],[-5,5],[-7,0],[-5,-5],[-2,-8],[2,3],[5,-1],[3,5],[-2,5],[-5,1],[0,0],[4,1],[-3,-3],[6,-4],[1,-4]]},
    GACHA:     {cx:63,cy:9, stars:[[0,-8],[-4,-6],[-7,-2],[-6,3],[-3,7],[1,8],[5,5],[7,0],[5,-5],[2,-8],[-2,3],[-5,-1],[-3,5],[2,5],[5,1],[0,0],[-4,1],[3,-3],[-6,-4],[-1,-4]]},
    SAMMLER:   {cx:88,cy:13,stars:[[3,-8],[-1,-9],[-5,-6],[-7,-2],[-6,3],[-3,7],[1,8],[5,6],[7,1],[5,-4],[0,5],[4,3],[-2,4],[-5,0],[0,-3],[3,1],[7,-5],[2,-5],[-3,-1],[4,-2]]},
    REBIRTH:   {cx:12,cy:42,stars:[[0,-8],[4,-7],[7,-3],[7,2],[4,7],[0,8],[-4,7],[-7,2],[-7,-3],[-4,-7],[2,-4],[5,0],[3,5],[-1,5],[-5,1],[-4,-4],[0,-1],[3,-1],[1,3],[-2,2]]},
    FORSCHUNG: {cx:40,cy:40,stars:[[0,-8],[2,-5],[5,-3],[6,0],[5,3],[2,6],[0,7],[-2,5],[-5,3],[-6,0],[-5,-3],[-2,-5],[1,-2],[3,0],[2,3],[0,4],[-2,2],[-3,-1],[0,-4],[3,-4]]},
    PRODUKTION:{cx:72,cy:40,stars:[[-6,-6],[-2,-8],[2,-8],[6,-6],[8,-2],[7,3],[4,7],[0,8],[-4,7],[-7,3],[-8,-2],[-4,-4],[0,-5],[4,-4],[6,0],[4,4],[0,5],[-4,4],[-2,0],[2,0]]},
    GEHEIMNIS: {cx:20,cy:70,stars:[[0,-9],[3,-7],[6,-4],[8,0],[6,4],[3,7],[0,8],[-3,7],[-6,4],[-8,0],[-6,-4],[-3,-7],[1,-3],[4,-1],[4,3],[1,5],[-3,5],[-5,2],[-4,-2],[0,0]]},
    ZEIT:      {cx:52,cy:72,stars:[[0,-8],[4,-7],[7,-3],[8,1],[6,5],[3,8],[0,9],[-3,8],[-6,5],[-8,1],[-7,-3],[-4,-7],[2,-4],[5,1],[3,5],[-1,6],[-4,3],[-4,-2],[0,-1],[2,2]]},
    KOSMOS:    {cx:84,cy:72,stars:[[0,-9],[5,-7],[8,-3],[8,2],[5,7],[0,8],[-5,7],[-8,2],[-8,-3],[-5,-7],[2,-4],[6,-1],[5,4],[1,6],[-3,5],[-6,1],[-5,-4],[-2,-7],[2,-6],[0,-2]]},
};

// ── EXTENDED STAR UPGRADES (8 paths × 5 = 40) ─────────────────
const starUpgrades={};
const STAR_PATHS=[
    {name:'Klick', col:'#00f0ff',desc:level=>`Klickkraft ×${2**level}`},
    {name:'Sonde', col:'#00ff88',desc:level=>`EPS +${level*25}%`},
    {name:'Mine',  col:'#ffb703',desc:level=>`Gebäude-Output ×${1+level*.5}`},
    {name:'Kosmos',col:'#b5179e',desc:level=>`Globaler Multiplikator ×${1+level*.3}`},
    {name:'Zeit',  col:'#00e5cc',desc:level=>`Offline-Einnahmen +${level*20}%`},
    {name:'Götter',col:'#ffd700',desc:level=>`Planeten-Multiplikator ×${2**level}`,requireRebirth:2},
    {name:'Gacha', col:'#ff00ff',desc:level=>`Gacha-Kosten -${level*8}%`},
    {name:'Geist', col:'#ff0055',desc:level=>`Klick-EPS-Konversion +${level*10}%`,requireRebirth:5},
];
STAR_PATHS.forEach((path,pi)=>{
    for(let lv=1;lv<=5;lv++){
        const id=`star-${path.name}-${lv}`;
        starUpgrades[id]={
            id, name:`${path.name}-Stern ${lv}`,
            desc:path.desc(lv),
            cost:lv*(pi+1)*3+(pi>3?pi*5:0),
            path:path.name, level:lv,
            parentId:lv===1?null:`star-${path.name}-${lv-1}`,
            col:path.col,
            requireRebirth:path.requireRebirth||0,
        };
    }
});

// ── BUILDINGS DATA ────────────────────────────────────────────
const buildingsData=[
    {name:'Kollektor-Sonde',baseCost:60,baseEps:2,desc:'Mikro-Strahlensauger.'},
    {name:'Asteroiden-Bohrer',baseCost:2500,baseEps:30,desc:'Zermalmt Weltraumschrott.'},
    {name:'Fusions-Reaktor',baseCost:55000,baseEps:310,desc:'Planetares Kraftwerk.'},
    {name:'Dyson-Satellit',baseCost:950000,baseEps:2200,desc:'Fängt Sonnenstrahlen ein.'},
    {name:'Antimaterie-Kammer',baseCost:25000000,baseEps:28000,desc:'Pures Partikel-Chaos.'},
    {name:'Wurmloch-Pumpe',baseCost:950000000,baseEps:210000,desc:'Zieht Saft aus Parallelwelten.'},
    {name:'Hyperraum-Zünder',baseCost:45000000000,baseEps:2800000,desc:'Sprengt Mini-Kometen.'},
    {name:'Galaxie-Schmelze',baseCost:2.5e12,baseEps:38000000,desc:'Verflüssigt Sternenhaufen.'},
    {name:'Vakuum-Extraktor',baseCost:1.8e14,baseEps:9.5e8,desc:'Saugt leeren Raum leer.'},
    {name:'Dunkle-Materie-Kompaktor',baseCost:4.5e15,baseEps:1.8e10,desc:'Presst das Nichts zu Platten.'},
    {name:'Multiversum-Generator',baseCost:9.5e17,baseEps:9.9e11,desc:'Erntet ganze Zeitlinien.'},
    {name:'Chronos-Katalysator',baseCost:5e19,baseEps:1.5e13,desc:'Beschleunigt die lokale Zeit.'},
    {name:'Matrix-Webstuhl',baseCost:8e21,baseEps:2.2e14,desc:'Webt Realitätsebenen.'},
    {name:'Quark-Kondensator',baseCost:2e24,baseEps:4e15,desc:'Verdichtet Elementarteilchen.'},
    {name:'Void-Zivilisation',baseCost:9e26,baseEps:8.5e16,desc:'Eine künstliche Rasse arbeitet.'},
    {name:'Äther-Pipeline',baseCost:3e29,baseEps:1.8e18,desc:'Zapft den Hyperraum-Ozean an.'},
    {name:'Super-Cluster-Schmiede',baseCost:1.5e32,baseEps:4e19,desc:'Schmilzt Galaxienhaufen.'},
    {name:'Ereignishorizont-Anker',baseCost:8e34,baseEps:9e20,desc:'Erntet direkt am Schwarzen Loch.'},
    {name:'Dimensions-Spalter',baseCost:4e37,baseEps:2.5e22,desc:'Nutzt Reibungsenergie von Welten.'},
    {name:'Psi-Netzwerk-Zentrale',baseCost:2.5e40,baseEps:6e23,desc:'Bündelt Mentalkraft.'},
    {name:'Neutronen-Stern-Käfig',baseCost:1.8e43,baseEps:1.4e25,desc:'Nutzt extreme Stern-Rotationen.'},
    {name:'Gravitations-Quetsche',baseCost:9e45,baseEps:3.8e26,desc:'Presst Planeten zu Kristallen.'},
    {name:'Hyper-String-Resonator',baseCost:6e48,baseEps:9.5e27,desc:'Lässt die Grundfäden vibrieren.'},
    {name:'Quanten-Fluktuations-Netz',baseCost:4.5e51,baseEps:2.2e29,desc:'Fängt spontane Teilchenenergie.'},
    {name:'Omega-Archiv',baseCost:3e54,baseEps:5e30,desc:'Wissen vergangener Universen.'},
    {name:'Singularitäts-Zapfer',baseCost:2e57,baseEps:1.2e32,desc:'Extrahiert unendliche Dichte.'},
    {name:'Urknall-Replikator',baseCost:1.5e60,baseEps:3.5e33,desc:'Kontrollierte Mini-Urknalle.'},
    {name:'Infinity-Knoten',baseCost:9e62,baseEps:9e34,desc:'Der Punkt des Werte-Kollapses.'},
    {name:'Zeitlinien-Splicer',baseCost:5e65,baseEps:2.4e36,desc:'Verschmilzt lukrative Zeitlinien.'},
    {name:'Götter-Dämmerung-Reaktor',baseCost:4e68,baseEps:7e37,desc:'Zerfall von Göttermaterie.'},
    {name:'Kosmischer Nexus Core',baseCost:1e72,baseEps:5e39,desc:'Das finale Zentrum aller Existenz.'},
];
let buildings=buildingsData.map(b=>({amount:0,cost:b.baseCost,eps:b.baseEps}));

// ── TECHS (12 types, 1000 upgrades, ~1 month playtime) ──────────
const TECH_DEFS=[
    ['click_mult','Impuls-Verstärker',   i=>1+i*0.008,  i=>`Klick ×${(1+i*0.008).toFixed(3)}`],
    ['eps_mult',  'Reaktor-Tuning',      i=>1+i*0.015,  i=>`EPS ×${(1+i*0.015).toFixed(3)}`],
    ['click_mult','Plasma-Kanone',       i=>1+i*0.012,  i=>`Klick ×${(1+i*0.012).toFixed(3)}`],
    ['eps_mult',  'Fusions-Katalysator', i=>1+i*0.022,  i=>`EPS ×${(1+i*0.022).toFixed(3)}`],
    ['click_add', 'Quantenfeld',         i=>Math.floor(i*25+10),  i=>`+${Math.floor(i*25+10)} Klickkraft`],
    ['eps_add',   'Energie-Injektor',    i=>Math.floor(50*Math.pow(1.8,i)), i=>`EPS +Flat`],
    ['click_mult','Neutronen-Finger',    i=>1+i*0.018,  i=>`Klick ×${(1+i*0.018).toFixed(3)}`],
    ['eps_mult',  'Antimaterien-Kern',   i=>1+i*0.028,  i=>`EPS ×${(1+i*0.028).toFixed(3)}`],
    ['click_mult','Tachyon-Boost',       i=>1+i*0.025,  i=>`Klick ×${(1+i*0.025).toFixed(3)}`],
    ['eps_mult',  'Hyperraum-Schub',     i=>1+i*0.035,  i=>`EPS ×${(1+i*0.035).toFixed(3)}`],
    ['click_add', 'Psi-Amplifier',       i=>Math.floor(i*50+20),  i=>`+${Math.floor(i*50+20)} Klickkraft`],
    ['eps_add',   'Void-Zapfer',         i=>Math.floor(500*Math.pow(2.0,i)), i=>`EPS +Flat`],
];
const TECH_TIERS=['Alpha','Beta','Gamma','Delta','Epsilon','Zeta','Eta','Theta','Iota','Kappa'];
const techs=[];
for(let i=1;i<=1000;i++){
    const dIdx=(i-1)%TECH_DEFS.length;
    const lI=Math.floor((i-1)/TECH_DEFS.length)+1;
    const [type,nameBase,powerFn,descFn]=TECH_DEFS[dIdx];
    const cost=180*Math.pow(1.25,i)+i*i*120;
    const power=powerFn(lI);
    const tier=TECH_TIERS[Math.min(9,Math.floor((lI-1)/5))];
    const name=`${nameBase} [${tier}-${lI}]`;
    const desc=descFn(lI);
    techs.push({id:`tech-${i}`,name,desc,cost,type,power,purchased:false});
}

const SHORT_SUFFIXES=['','K','M','B','T','Qa','Qi','Sx','Sp','Oc','No','Dc','Ud','Dd','Td','Qad','Qid','Sxd','Spd','Ocd','Nod','Vg','UVg','DVg','TVg','QaVg','QiVg','SxVg','SpVg','OcVg','NoVg','Tg'];

function formatNumbers(n){
    if(n===null||n===undefined||isNaN(n)||!isFinite(n))return '0';
    if(n<1000)return Math.floor(n).toString();
    const tier=Math.floor(Math.log10(Math.abs(n))/3);
    if(tier<=0||tier>=SHORT_SUFFIXES.length)return n.toExponential(2);
    return (n/Math.pow(10,tier*3)).toFixed(2)+' '+SHORT_SUFFIXES[tier];
}

// ── GAME LOGIC ─────────────────────────────────────────────────
function buildGameUI(){
    const sl=getEl('dynamic-shop-list'); if(!sl)return; sl.innerHTML='';
    buildingsData.forEach((b,i)=>{
        const btn=document.createElement('button'); btn.className='shop-item'; btn.id=`b-btn-${i}`;
        btn.innerHTML=`<div class="item-info"><span class="item-name">${b.name} (<span id="b-amt-${i}">0</span>)</span><span class="item-description">${b.desc} (+${formatNumbers(b.baseEps)} EPS)</span><span class="item-cost" id="b-cost-${i}">Kosten: ${formatNumbers(b.cost)}</span></div>`;
        btn.onclick=()=>buyBuilding(i); sl.appendChild(btn);
    });
    renderTechs();
}
function updateDisplay(){
    if(getEl('energy-count'))getEl('energy-count').textContent=formatNumbers(energy);
    if(getEl('eps-count'))getEl('eps-count').textContent=formatNumbers(eps);
    if(getEl('click-power-count'))getEl('click-power-count').textContent=formatNumbers(calculateTotalClickPower());
    buildings.forEach((b,i)=>{
        const btn=getEl(`b-btn-${i}`); if(!btn)return;
        const amtEl=getEl(`b-amt-${i}`),costEl=getEl(`b-cost-${i}`);
        if(amtEl)amtEl.textContent=b.amount;
        if(costEl)costEl.textContent=`Kosten: ${formatNumbers(b.cost)}`;
        btn.style.display=(i===0||(buildings[i-1]&&buildings[i-1].amount>0)||energy>=b.cost*.2)?'flex':'none';
    });
    renderTechs();
    if(getEl('star-cores-count'))getEl('star-cores-count').textContent=starCores;
    if(getEl('pending-cores'))getEl('pending-cores').textContent=formatNumbers(calculatePendingCores());

    if(getEl('inventory-count'))getEl('inventory-count').textContent=inventory.length;
    if(getEl('ach-count'))getEl('ach-count').textContent=unlockedAch.length+'/200';
}
function buyBuilding(i){
    const b=buildings[i];
    if(b&&energy>=b.cost){energy-=b.cost;b.amount++;b.cost=Math.round(b.cost*1.48);recalculateEps();updateDisplay();}
}
function buyTechById(id){
    const t=techs.find(x=>x.id===id);
    if(t&&!t.purchased&&energy>=t.cost){energy-=t.cost;t.purchased=true;recalculateEps();updateDisplay();}
}
function calculatePendingCores(){return energy<9e7?0:Math.floor(Math.sqrt(energy/9e7));}
function switchBanner(bId){
    if(isRolling)return;
    activeBanner=parseInt(bId);
    document.querySelectorAll('.banner-tab').forEach(t=>t.classList.remove('tab-active'));
    const at=document.querySelector(`[data-banner='${bId}']`); if(at)at.classList.add('tab-active');
    const titles={1:'Ur-Nebel Banner',2:'Supernova-Cluster',3:'Ereignishorizont',4:'Quanten-Spalt',5:'Die Singularität',6:'Göttlicher Abgrund'};
    const descs={1:'Common bis Rare.',2:'Common bis Epic.',3:'Rare bis Mythic.',4:'Epic bis Secret.',5:'Mythic bis Göttlich.',6:'Secret bis Göttlich.'};
    if(getEl('current-banner-title'))getEl('current-banner-title').textContent=titles[activeBanner]||'';
    if(getEl('current-banner-desc'))getEl('current-banner-desc').textContent=descs[activeBanner]||'';
    if(getEl('gacha-reveal-text'))getEl('gacha-reveal-text').textContent='';
    if(getEl('gacha-rarity-badge')){getEl('gacha-rarity-badge').textContent='';getEl('gacha-rarity-badge').style.background='transparent';}
    if(getEl('gacha-orb'))getEl('gacha-orb').style.transform='scale(0)';
    updateDisplay();
}
function createClickParticle(e){
    const cont=document.querySelector('.planet-container'); if(!cont)return;
    const part=document.createElement('div'); part.className='click-particle';
    part.textContent=`+${formatNumbers(calculateTotalClickPower())}`;
    let cx=e.clientX,cy=e.clientY;
    if(e.changedTouches&&e.changedTouches.length>0){cx=e.changedTouches[0].clientX;cy=e.changedTouches[0].clientY;}
    const rect=cont.getBoundingClientRect();
    part.style.left=`${(cx||rect.left+rect.width/2)-rect.left}px`;
    part.style.top= `${(cy||rect.top+rect.height/2)-rect.top}px`;
    cont.appendChild(part);
    part.addEventListener('animationend',()=>part.remove());
}
// Achievement check

function getEl(id){return document.getElementById(id);}

function calculateTotalClickPower(){
    let base=clickPower, addBonus=0, multBonus=1;
    techs.forEach(t=>{
        if(!t||!t.purchased)return;
        if(t.type==='click_mult')multBonus*=t.power;
        if(t.type==='click_add')addBonus+=t.power;
    });
    base=(base+addBonus)*multBonus;
    equippedPlanets.forEach((ep,idx)=>{
        if(ep&&ep.multiplier&&(ep.gachaType==='click'||(ep.gachaType==null&&idx<3)))base*=ep.multiplier;
    });
    purchasedStars.forEach(id=>{if(typeof id==='string'&&id.includes('Klick'))base*=2;});
    return Math.max(1,base);
}
function recalculateEps(){
    let base=0;
    buildings.forEach(b=>{if(b)base+=b.amount*b.eps;});
    let epsMult=1, epsAdd=0;
    techs.forEach(t=>{
        if(!t||!t.purchased)return;
        if(t.type==='eps_mult')epsMult*=t.power;
        if(t.type==='eps_add')epsAdd+=t.power;
    });
    base=(base+epsAdd)*epsMult;
    equippedPlanets.forEach((ep,idx)=>{
        if(ep&&ep.multiplier&&(ep.gachaType==='building'||(ep.gachaType==null&&idx>=3)))base*=ep.multiplier;
    });
    purchasedStars.forEach(id=>{if(typeof id==='string'&&!id.includes('Klick'))base*=1.5;});
    eps=base;
}

// Achievement check
function checkAchievements(){
    ACHIEVEMENTS.forEach(ach=>{
        if(ach.unlocked||unlockedAch.includes(ach.id))return;
        let unlocked=false;
        const i=parseInt(ach.id.split('_')[1]||0);
        if(ach.type==='totalClicks'   &&totalClicks>=ach.target)unlocked=true;
        if(ach.type==='totalEnergy'   &&totalEnergy>=ach.target)unlocked=true;
        if(ach.type==='gacha'){
            if(i===0)unlocked=totalRolls>=1;
            if(i===1)unlocked=totalRolls>=5;
            if(i===2)unlocked=totalRolls>=10;
            if(i===3)unlocked=totalRolls>=25;
            if(i===4)unlocked=totalRolls>=50;
            if(i===5)unlocked=totalRolls>=100;
            if(i===9)unlocked=inventory.some(p=>p.rarity==='rare');
            if(i===10)unlocked=inventory.some(p=>p.rarity==='epic');
            if(i===11)unlocked=inventory.some(p=>p.rarity==='mythic');
            if(i===12)unlocked=inventory.some(p=>p.rarity==='secret');
            if(i===13)unlocked=inventory.some(p=>p.rarity==='divine');
            if(i===18)unlocked=inventory.length>=50;
            if(i===19)unlocked=inventory.length>=100;
        }
        if(ach.type==='sammler'){
            const thresholds=[5,10,20,30,50,75,100,150,200];
            if(i<thresholds.length)unlocked=inventory.length>=thresholds[i];
        }
        if(ach.type==='rebirth'){
            if(i===0)unlocked=rebirthCount>=1;
            if(i===1)unlocked=rebirthCount>=2;
            if(i===2)unlocked=rebirthCount>=3;
            if(i===3)unlocked=rebirthCount>=5;
            if(i===8)unlocked=starCores>=1;
            if(i===9)unlocked=starCores>=10;
        }
        if(ach.type==='forschung'){
            const bought=techs.filter(t=>t.purchased).length;
            const thresholds=[1,5,10,25,50,100,200,500,1000];
            if(i<thresholds.length)unlocked=bought>=thresholds[i];
        }
        if(ach.type==='produktion'){
            const total=buildings.reduce((s,b)=>s+b.amount,0);
            const thresholds=[1,5,10,25,50,100,200,500,1000];
            if(i<thresholds.length)unlocked=total>=thresholds[i];
        }
        if(unlocked){
            ach.unlocked=true; unlockedAch.push(ach.id);
            showAchNotif(ach);
        }
    });
}
function showAchNotif(ach){
    const cat=ACH_CATS[ach.cat]; if(!cat)return;
    const el=document.createElement('div'); el.className='ach-toast';
    el.style.cssText=`border-left:4px solid ${cat.col};`;
    el.innerHTML=`<span style="color:${cat.col};font-size:.9rem;">${cat.icon}</span>
        <div style="display:flex;flex-direction:column;gap:1px;">
            <span style="font-family:Orbitron;font-size:.7rem;color:${cat.col};font-weight:900;">ACHIEVEMENT!</span>
            <span style="font-size:.75rem;color:#fff;">${ach.name}</span>
        </div>`;
    document.body.appendChild(el);
    setTimeout(()=>el.classList.add('ach-toast-show'),50);
    setTimeout(()=>{el.classList.remove('ach-toast-show');setTimeout(()=>el.remove(),500);},3500);
}
// ══════════════════════════════════════════════════════════════════
// COSMIC GACHA ENGINE v4.0 — ULTIMATE — Bug-free, Canvas-powered
// ══════════════════════════════════════════════════════════════════

const RARITY_CFG = {
    common: { primary:'#81b29a', secondary:'#c8f0d8', duration:2500,
              flashClass:'flash-common', label:'GEWÖHNLICH', screenBg:'#030c07' },
    rare:   { primary:'#4cc9f0', secondary:'#a8f4ff', duration:3200,
              flashClass:'flash-rare',   label:'✦ SELTEN ✦', screenBg:'#01090f' },
    epic:   { primary:'#c020c0', secondary:'#ff00ff', duration:4000,
              flashClass:'flash-epic',   label:'⚡ EPISCH ⚡', screenBg:'#0a0015' },
    mythic: { primary:'#ff0055', secondary:'#ff8800', duration:20800,
              flashClass:'flash-mega',   label:'🔥 MYTHISCH 🔥', screenBg:'#0f0005' },
    secret: { primary:'#ffffff', secondary:'#ffff00', duration:20800,
              flashClass:'flash-secret', label:'✦✦ GEHEIMNIS ✦✦', screenBg:'#080800' }
};

// ── CANVAS ENGINE ────────────────────────────────────────────────
let _cv=null, _cx=null, _raf=null, _alive=false;
let _pts=[], _bolts=[], _bgStars=[], _nebulas=[];
let _activeCountdownId=null; // Global cleared at climax

function _hex2rgba(hex, a) {
    if(!hex||hex.length<7) return `rgba(128,128,128,${a})`;
    return `rgba(${parseInt(hex.slice(1,3),16)},${parseInt(hex.slice(3,5),16)},${parseInt(hex.slice(5,7),16)},${a})`;
}
function _lighten(hex,v){
    return `rgb(${Math.min(255,parseInt(hex.slice(1,3)||'88',16)+v)},${Math.min(255,parseInt(hex.slice(3,5)||'88',16)+v)},${Math.min(255,parseInt(hex.slice(5,7)||'88',16)+v)})`;
}
function _darken(hex,v){
    return `rgb(${Math.max(0,parseInt(hex.slice(1,3)||'88',16)-v)},${Math.max(0,parseInt(hex.slice(3,5)||'88',16)-v)},${Math.max(0,parseInt(hex.slice(5,7)||'88',16)-v)})`;
}

function initCanvas(p,s) {
    stopCanvas();
    _cv=document.createElement('canvas');
    _cv.style.cssText='position:absolute;top:0;left:0;width:100%;height:100%;pointer-events:none;z-index:20;';
    const bl=getEl('cinematic-blackout'); if(bl) bl.appendChild(_cv);
    _cv.width=window.innerWidth; _cv.height=window.innerHeight;
    _cx=_cv.getContext('2d');
    _pts=[]; _bolts=[];
    const W=_cv.width, H=_cv.height;
    _bgStars=[];
    for(let i=0;i<300;i++) _bgStars.push({
        x:Math.random()*W, y:Math.random()*H,
        sz:0.3+Math.random()*1.6, base:0.1+Math.random()*.8,
        ph:Math.random()*Math.PI*2, sp:0.006+Math.random()*.03,
        vx:(Math.random()-.5)*.07, vy:(Math.random()-.5)*.07,
        col:Math.random()>.85?(Math.random()>.5?p:s):'#ffffff'
    });
    _nebulas=[];
    for(let i=0;i<5;i++) _nebulas.push({
        x:(.1+Math.random()*.8)*W, y:(.1+Math.random()*.8)*H,
        r:90+Math.random()*200, col:i%2===0?p:s,
        ph:Math.random()*Math.PI*2, sp:0.003+Math.random()*.006,
        vx:(Math.random()-.5)*.04, vy:(Math.random()-.5)*.04
    });
    _alive=true;
}

function stopCanvas() {
    _alive=false;
    if(_raf){cancelAnimationFrame(_raf);_raf=null;}
    if(_cv){_cv.remove();_cv=null;} _cx=null;
    _pts=[]; _bolts=[]; _bgStars=[]; _nebulas=[];
}

function _loop() {
    if(!_alive||!_cx||!_cv) return;
    const W=_cv.width, H=_cv.height;
    _cx.clearRect(0,0,W,H);
    const t=performance.now()*.001;
    // nebulas
    _nebulas.forEach(n=>{
        n.x+=n.vx; n.y+=n.vy;
        if(n.x<-n.r)n.x=W+n.r; if(n.x>W+n.r)n.x=-n.r;
        if(n.y<-n.r)n.y=H+n.r; if(n.y>H+n.r)n.y=-n.r;
        const pulse=0.02+0.015*Math.sin(t*n.sp*8+n.ph);
        try{
            const g=_cx.createRadialGradient(n.x,n.y,0,n.x,n.y,n.r);
            g.addColorStop(0,_hex2rgba(n.col,pulse)); g.addColorStop(1,_hex2rgba(n.col,0));
            _cx.globalAlpha=1; _cx.fillStyle=g;
            _cx.beginPath(); _cx.arc(n.x,n.y,n.r,0,Math.PI*2); _cx.fill();
        }catch(e){}
    });
    // bg stars
    _bgStars.forEach(s=>{
        s.x+=s.vx; s.y+=s.vy;
        if(s.x<0)s.x=W; if(s.x>W)s.x=0; if(s.y<0)s.y=H; if(s.y>H)s.y=0;
        const tw=0.25+0.75*Math.abs(Math.sin(t*s.sp*5+s.ph));
        _cx.globalAlpha=s.base*tw;
        _cx.fillStyle=s.col;
        if(s.sz>1){_cx.shadowBlur=s.sz*3;_cx.shadowColor=s.col;}
        _cx.beginPath();_cx.arc(s.x,s.y,s.sz,0,Math.PI*2);_cx.fill();
        _cx.shadowBlur=0;
    });
    _cx.globalAlpha=1;
    // bolts
    _bolts=_bolts.filter(b=>b.update()); _bolts.forEach(b=>b.draw(_cx));
    // particles
    _pts=_pts.filter(p=>p.update()); _pts.forEach(p=>p.draw(_cx));
    _cx.globalAlpha=1;
    _raf=requestAnimationFrame(_loop);
}

// ── LIGHTNING ────────────────────────────────────────────────────
class Bolt {
    constructor(c){
        this.col=c.color||'#fff'; this.alpha=1; this.decay=c.decay||.1; this.w=c.w||2;
        this.pts=this._gen(c.x1||0,c.y1||0,c.x2||200,c.y2||200);
        this.branch=null;
        if(c.branch&&this.pts.length>3){
            const m=this.pts[Math.floor(this.pts.length/2)];
            const a=Math.random()*Math.PI*2, l=50+Math.random()*90;
            this.branch=this._gen(m[0],m[1],m[0]+Math.cos(a)*l,m[1]+Math.sin(a)*l);
        }
    }
    _gen(x1,y1,x2,y2){
        const n=9+Math.floor(Math.random()*8), pts=[[x1,y1]];
        for(let i=1;i<n;i++){
            const t=i/n, bx=x1+(x2-x1)*t, by=y1+(y2-y1)*t;
            const j=Math.min(window.innerWidth,window.innerHeight)*.13*(1-t);
            pts.push([bx+(Math.random()-.5)*j*2, by+(Math.random()-.5)*j*2]);
        }
        pts.push([x2,y2]); return pts;
    }
    _stroke(cx,pts,w,a){
        if(pts.length<2)return;
        cx.beginPath(); cx.moveTo(pts[0][0],pts[0][1]);
        for(let i=1;i<pts.length;i++) cx.lineTo(pts[i][0],pts[i][1]);
        cx.lineWidth=w; cx.globalAlpha=Math.max(0,a); cx.stroke();
    }
    update(){this.alpha-=this.decay;return this.alpha>0;}
    draw(cx){
        cx.save(); cx.lineCap='round'; cx.lineJoin='round';
        // glow pass
        cx.strokeStyle=this.col; cx.shadowBlur=30; cx.shadowColor=this.col;
        this._stroke(cx,this.pts,this.w+5,this.alpha*.3);
        if(this.branch) this._stroke(cx,this.branch,this.w+3,this.alpha*.2);
        // core pass
        cx.strokeStyle='#fff'; cx.shadowBlur=12; cx.shadowColor='#fff';
        this._stroke(cx,this.pts,this.w,this.alpha);
        if(this.branch) this._stroke(cx,this.branch,this.w*.6,this.alpha*.85);
        cx.restore();
    }
}

// ── PARTICLE ─────────────────────────────────────────────────────
class Pt {
    constructor(c){
        this.x=c.x||0;this.y=c.y||0;this.vx=c.vx||0;this.vy=c.vy||0;
        this.sz=c.sz||3;this.initSz=this.sz;this.col=c.col||'#fff';
        this.alpha=1;this.decay=c.decay||.015;this.grav=c.grav||.07;
        this.spin=(Math.random()-.5)*.4;this.rot=0;
        this.type=c.type||'circle';this.trail=c.trail||false;this.shrink=c.shrink||false;
        this.hist=[];
    }
    update(){
        if(this.trail){this.hist.push({x:this.x,y:this.y});if(this.hist.length>7)this.hist.shift();}
        this.x+=this.vx;this.y+=this.vy;this.vy+=this.grav;this.vx*=.995;
        this.alpha-=this.decay;this.rot+=this.spin;
        if(this.shrink)this.sz=this.initSz*Math.max(0,this.alpha);
        return this.alpha>0;
    }
    draw(cx){
        if(this.alpha<=0)return;
        cx.save();
        if(this.trail&&this.hist.length>1){
            for(let i=0;i<this.hist.length-1;i++){
                cx.globalAlpha=Math.max(0,(i/this.hist.length)*this.alpha*.4);
                cx.fillStyle=this.col;
                cx.beginPath();cx.arc(this.hist[i].x,this.hist[i].y,this.sz*.35,0,Math.PI*2);cx.fill();
            }
        }
        cx.translate(this.x,this.y);cx.rotate(this.rot);
        cx.globalAlpha=Math.max(0,this.alpha);
        cx.shadowBlur=this.sz*5;cx.shadowColor=this.col;
        cx.fillStyle=this.col;
        if(this.type==='circle'){cx.beginPath();cx.arc(0,0,this.sz,0,Math.PI*2);cx.fill();}
        else if(this.type==='star'){_star(cx,5,this.sz,this.sz*.4);}
        else if(this.type==='sq'){cx.fillRect(-this.sz/2,-this.sz/2,this.sz,this.sz);}
        else if(this.type==='sp'){
            for(let i=0;i<4;i++){
                const a=(i/4)*Math.PI*2,r=i%2===0?this.sz:this.sz*.3;
                cx.strokeStyle=this.col;cx.lineWidth=1.5;
                cx.globalAlpha=Math.max(0,this.alpha);
                cx.beginPath();cx.moveTo(0,0);cx.lineTo(Math.cos(a)*r,Math.sin(a)*r);cx.stroke();
            }
        }
        cx.restore();
    }
}
function _star(cx,n,outer,inner){
    let r=(Math.PI/2)*3,step=Math.PI/n;
    cx.beginPath();cx.moveTo(0,-outer);
    for(let i=0;i<n;i++){
        cx.lineTo(Math.cos(r)*outer,Math.sin(r)*outer);r+=step;
        cx.lineTo(Math.cos(r)*inner,Math.sin(r)*inner);r+=step;
    }
    cx.closePath();cx.fill();
}

// ── EMITTERS ─────────────────────────────────────────────────────
function burst(o){
    const cx=o.x??window.innerWidth/2, cy=o.y??window.innerHeight/2;
    const cnt=o.count??50, spd=o.speed??10;
    const cols=o.colors??['#fff'], types=o.types??['circle'];
    for(let i=0;i<cnt;i++){
        const a=(i/cnt)*Math.PI*2+(Math.random()-.5)*.7;
        const v=spd*(.4+Math.random()*.9);
        _pts.push(new Pt({x:cx,y:cy,vx:Math.cos(a)*v,vy:Math.sin(a)*v,
            sz:(o.sz??3)*(.5+Math.random()),
            col:cols[Math.floor(Math.random()*cols.length)],
            decay:.006+Math.random()*.018, grav:o.grav??0.07,
            type:types[Math.floor(Math.random()*types.length)],
            trail:o.trail??false, shrink:o.shrink??false}));
    }
}

function vortex(o){
    const cx=window.innerWidth/2,cy=window.innerHeight/2;
    const dur=o.duration??6000, cols=o.colors??['#fff'];
    let angle=0,elapsed=0;
    const id=setInterval(()=>{
        elapsed+=16; if(!_alive||elapsed>dur){clearInterval(id);return;}
        const prog=elapsed/dur;
        const r=(1-prog)*Math.min(window.innerWidth,window.innerHeight)*.43;
        const x=cx+Math.cos(angle)*r, y=cy+Math.sin(angle)*r;
        const spd=3+prog*11;
        const ta=Math.atan2(cy-y,cx-x);
        _pts.push(new Pt({x,y,vx:Math.cos(ta)*spd,vy:Math.sin(ta)*spd,
            sz:1.5+Math.random()*3,col:cols[Math.floor(Math.random()*cols.length)],
            decay:.011,grav:0,trail:true}));
        angle+=.2;
    },16);
    return id;
}

function rain(o){
    const cols=o.colors??['#fff'],dur=o.duration??5000,ppt=o.perTick??3;
    let elapsed=0;
    const id=setInterval(()=>{
        elapsed+=22; if(!_alive||elapsed>dur){clearInterval(id);return;}
        for(let i=0;i<ppt;i++) _pts.push(new Pt({
            x:Math.random()*window.innerWidth, y:-10,
            vx:(Math.random()-.5)*1.5,vy:2+Math.random()*5,
            sz:.7+Math.random()*2.5,col:cols[Math.floor(Math.random()*cols.length)],
            decay:.003+Math.random()*.008,grav:0}));
    },22);
    return id;
}

function fireworks(cols,cnt=4){
    const cx=window.innerWidth/2,cy=window.innerHeight/2;
    for(let k=0;k<cnt;k++) setTimeout(()=>{
        if(!_alive)return;
        const fx=cx+(Math.random()-.5)*window.innerWidth*.5;
        const fy=cy+(Math.random()-.5)*window.innerHeight*.5;
        burst({x:fx,y:fy,count:90,colors:cols,speed:11,grav:.09,
            types:['circle','star','sp'],trail:true,shrink:true,sz:4});
        shockwave(fx,fy,cols[Math.floor(Math.random()*cols.length)],.95);
    },k*260);
}

function lightning(col,cnt=4){
    if(!_cv)return;
    const W=_cv.width,H=_cv.height,cx=W/2,cy=H/2;
    for(let i=0;i<cnt;i++){
        const a=(i/cnt)*Math.PI*2+Math.random()*.9;
        const d=.45+Math.random()*.55;
        _bolts.push(new Bolt({x1:cx+(Math.random()-.5)*80,y1:cy+(Math.random()-.5)*80,
            x2:cx+Math.cos(a)*W*d,y2:cy+Math.sin(a)*H*d,
            color:col,decay:.07+Math.random()*.08,w:1.5+Math.random()*2,branch:true}));
    }
    burst({count:15,colors:[col,'#ffffff'],speed:14,grav:.03,types:['sp','circle']});
}

// ── DOM HELPERS ───────────────────────────────────────────────────
function shockwave(x,y,col,dur=1.2){
    const bl=getEl('cinematic-blackout'); if(!bl)return;
    const el=document.createElement('div');
    el.style.cssText=`position:absolute;border-radius:50%;border:3px solid ${col};
        left:${x}px;top:${y}px;width:0;height:0;transform:translate(-50%,-50%);
        pointer-events:none;z-index:25;
        box-shadow:0 0 18px ${col},inset 0 0 10px ${col}55;
        animation:_sw ${dur}s ease-out forwards;`;
    bl.appendChild(el);
    el.addEventListener('animationend',()=>el.remove());
}


const spawnShockwave=shockwave;
function screenShake(intensity=7,dur=400){
    const bl=getEl('cinematic-blackout'); if(!bl)return;
    let start=null;
    const step=(ts)=>{
        if(!start)start=ts; const el=ts-start;
        if(el>=dur){bl.style.transform='';return;}
        const d=1-(el/dur);
        bl.style.transform=`translate(${(Math.random()-.5)*intensity*2*d}px,${(Math.random()-.5)*intensity*2*d}px)`;
        requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
}

function injectKF(){
    if(document.getElementById('ckf'))return;
    const s=document.createElement('style');s.id='ckf';
    s.textContent=`
        @keyframes _sw{0%{width:0;height:0;opacity:1;}70%{opacity:.5;}100%{width:min(130vw,130vh);height:min(130vw,130vh);opacity:0;}}
        @keyframes _pRev{0%{transform:rotateY(-90deg) scale(0);opacity:0;filter:blur(18px);}55%{transform:rotateY(12deg) scale(1.12);opacity:1;filter:blur(0);}75%{transform:rotateY(-4deg) scale(.97);}100%{transform:rotateY(0deg) scale(1);opacity:1;}}
        @keyframes _orb{0%{transform:translate(-50%,-50%) rotateX(72deg) rotateZ(0deg);}100%{transform:translate(-50%,-50%) rotateX(72deg) rotateZ(360deg);}}
        @keyframes _orb2{0%{transform:translate(-50%,-50%) rotateX(55deg) rotateZ(0deg);}100%{transform:translate(-50%,-50%) rotateX(55deg) rotateZ(-360deg);}}
        @keyframes _nameIn{0%{opacity:0;transform:scale(1.6) translateY(8px);filter:blur(10px);}40%{opacity:1;transform:scale(.97) translateY(-2px);filter:blur(0);}60%{transform:scale(1.02);}100%{transform:scale(1) translateY(0);opacity:1;}}
        @keyframes _badgePop{0%{opacity:0;transform:scale(0) rotate(-20deg);}55%{transform:scale(1.2) rotate(4deg);opacity:1;}75%{transform:scale(.95) rotate(-1deg);}100%{transform:scale(1) rotate(0);opacity:1;}}
        @keyframes _rainbow{0%{filter:hue-rotate(0deg) brightness(1.5);}50%{filter:hue-rotate(180deg) brightness(2);}100%{filter:hue-rotate(360deg) brightness(1.5);}}
        @keyframes _cdPulse{0%{transform:scale(1.5);opacity:.5;}100%{transform:scale(1);opacity:1;}}
        @keyframes _stageFlash{0%,100%{box-shadow:none;}50%{box-shadow:0 0 60px var(--gc),inset 0 0 40px var(--gc-t);}}
        @keyframes _glitchScan{0%{opacity:0;transform:scaleX(.7) translateX(-5%);}40%{opacity:.9;}100%{opacity:0;transform:scaleX(1.06) translateX(2%);}}
        @keyframes _twink{0%,100%{opacity:var(--op);}50%{opacity:calc(var(--op)*.15);}}
        @keyframes _secretBg{
            0%{background:radial-gradient(ellipse at 30% 40%,#150500,#000);}
            25%{background:radial-gradient(ellipse at 70% 30%,#001510,#000);}
            50%{background:radial-gradient(ellipse at 50% 70%,#100015,#000);}
            75%{background:radial-gradient(ellipse at 20% 60%,#001515,#000);}
            100%{background:radial-gradient(ellipse at 30% 40%,#150500,#000);}
        }
    `;
    document.head.appendChild(s);
}

// ── COUNTDOWN HUD ─────────────────────────────────────────────────
function startCountdown(el,totalSec,col){
    if(!el)return null;
    let t=totalSec;
    el.style.color=col; el.style.textShadow=`0 0 20px ${col},0 0 40px ${col}88`;
    const id=setInterval(()=>{
        if(!_alive){clearInterval(id);return;}
        t--;
        if(t<=0){clearInterval(id);return;}
        el.textContent=t<=4?`⚡ ${t} ⚡`:`ANOMALIE IN: ${t}s`;
        el.style.animation='_cdPulse .3s ease-out'; 
        setTimeout(()=>{if(el)el.style.animation='';},300);
        if(t<=4){el.style.fontSize='1.8rem';screenShake(9+(4-t)*3,300);}
    },1000);
    return id;
}

// ── RARITY CINEMATICS ─────────────────────────────────────────────
function cin_common(cfg,cd){
    const cx=window.innerWidth/2,cy=window.innerHeight/2;
    if(cd){cd.textContent='ENERGIE BÜNDELT SICH';cd.style.color=cfg.primary;}
    burst({count:45,colors:[cfg.primary,cfg.secondary,'#fff'],speed:7,grav:.12,types:['circle']});
    shockwave(cx,cy,cfg.primary,.7);
    setTimeout(()=>{
        if(!_alive)return;
        if(cd){cd.textContent='IMPULS!';cd.style.fontSize='1.4rem';}
        burst({count:35,colors:[cfg.primary,'#fff'],speed:6,grav:.1});
        screenShake(5,250);
    },700);
}

function cin_rare(cfg,cd){
    const cx=window.innerWidth/2,cy=window.innerHeight/2;
    if(cd){cd.textContent='SELTENE SIGNATUR ERKANNT';cd.style.color=cfg.primary;}
    vortex({colors:[cfg.primary,cfg.secondary,'#fff'],duration:2000});
    rain({colors:[cfg.primary,cfg.secondary],duration:2600,perTick:5});
    setTimeout(()=>{
        if(!_alive)return;
        burst({count:100,colors:[cfg.primary,cfg.secondary,'#fff'],speed:13,grav:.07,
            types:['circle','star'],trail:true});
        shockwave(cx,cy,cfg.primary,1); shockwave(cx,cy,cfg.secondary,1.4);
        screenShake(8,450);
        if(cd){cd.textContent='✦ SELTENE ENTLADUNG ✦';cd.style.fontSize='1.4rem';}
    },1600);
}

function cin_epic(cfg,cd){
    const cx=window.innerWidth/2,cy=window.innerHeight/2;
    if(cd){cd.textContent='EPISCHE RESONANZ STEIGT';cd.style.color=cfg.primary;}
    vortex({colors:[cfg.primary,cfg.secondary,'#fff'],duration:3000});
    rain({colors:[cfg.primary,cfg.secondary,'#fff'],duration:3500,perTick:7});
    [0,550,1200,2100].forEach((t,i)=>{
        setTimeout(()=>{
            if(!_alive)return;
            burst({count:70+i*35,colors:[cfg.primary,cfg.secondary,'#fff'],speed:12+i*2,grav:.06,
                types:['circle','star','sp'],trail:i>1});
            shockwave(cx,cy,cfg.primary,1.1); screenShake(8+i*2,350);
        },t);
    });
    setTimeout(()=>{
        if(!_alive)return;
        lightning(cfg.primary,5); fireworks([cfg.primary,cfg.secondary,'#fff'],3);
        if(cd){cd.textContent='⚡ EPISCHE DETONATION ⚡';cd.style.fontSize='1.5rem';}
        screenShake(14,700);
    },2800);
}

function cin_mythic(cfg,cd){
    const cx=window.innerWidth/2,cy=window.innerHeight/2;
    vortex({colors:[cfg.primary,cfg.secondary],duration:18500});
    rain({colors:[cfg.primary,cfg.secondary,'#ff4400'],duration:18500,perTick:4});
    let phase=0;
    const bId=setInterval(()=>{
        if(!_alive){clearInterval(bId);return;}
        phase++;
        burst({count:55+phase*20,colors:[cfg.primary,cfg.secondary,'#fff'],speed:8+phase,grav:.07,
            types:['circle','star','sp'],trail:phase>2});
        shockwave(cx+(Math.random()-.5)*150,cy+(Math.random()-.5)*150,cfg.primary,1.3+phase*.1);
        if(phase%2===0) lightning(cfg.primary,4);
        screenShake(5+phase*1.8,300);
    },2800);
    setTimeout(()=>clearInterval(bId),17900);
    _activeCountdownId=startCountdown(cd,20,cfg.primary);
    // CLIMAX at 18s
    setTimeout(()=>{
        if(_activeCountdownId!==null){clearInterval(_activeCountdownId);_activeCountdownId=null;}
        if(cd){cd.textContent='💥 MYTHISCHE EXPLOSION 💥';cd.style.fontSize='1.8rem';
            cd.style.color='#fff';cd.style.textShadow=`0 0 40px ${cfg.primary},0 0 80px ${cfg.secondary}`;}
        fireworks([cfg.primary,cfg.secondary,'#ff4400','#fff'],9);
        for(let i=0;i<7;i++) setTimeout(()=>{
            if(!_alive)return;
            lightning(cfg.primary,6);
            shockwave(cx+(Math.random()-.5)*100,cy+(Math.random()-.5)*100,i%2===0?cfg.primary:cfg.secondary,1.6);
        },i*180);
        screenShake(22,1300);
    },18000);
}

function cin_secret(cfg,cd){
    const cx=window.innerWidth/2,cy=window.innerHeight/2;
    const AC=[cfg.primary,cfg.secondary,'#ff00ff','#00ffff','#ff0055','#ffb703','#00ff88'];
    // 3 vortexes staggered
    vortex({colors:AC,duration:18500});
    setTimeout(()=>vortex({colors:AC,duration:12000}),5000);
    setTimeout(()=>vortex({colors:AC,duration:7000}),11000);
    rain({colors:AC,duration:18500,perTick:11});
    // lightning storm
    const lId=setInterval(()=>{
        if(!_alive){clearInterval(lId);return;}
        lightning(AC[Math.floor(Math.random()*AC.length)],7); screenShake(9,280);
    },1100);
    setTimeout(()=>clearInterval(lId),17900);
    // escalating bursts
    let phase=0;
    const bId=setInterval(()=>{
        if(!_alive){clearInterval(bId);return;}
        phase++;
        burst({count:90+phase*35,colors:AC,speed:15+phase,grav:.04,
            types:['circle','star','sp'],trail:true,sz:4});
        shockwave(cx+(Math.random()-.5)*200,cy+(Math.random()-.5)*200,AC[phase%AC.length],1.6+phase*.12);
    },1700);
    setTimeout(()=>clearInterval(bId),17900);
    // glitch lines
    const gEl=getEl('cinematic-glitch-lines');
    if(!document.getElementById('glitch-kf')){
        const s=document.createElement('style');s.id='glitch-kf';
        s.textContent=`@keyframes _glitch{0%{opacity:0;transform:scaleX(.6) translateX(-5%);}40%{opacity:.9;}100%{opacity:0;transform:scaleX(1.08) translateX(3%);}}`;
        document.head.appendChild(s);
    }
    const gId=setInterval(()=>{
        if(!_alive||!gEl){clearInterval(gId);return;}
        gEl.innerHTML='';gEl.style.opacity='1';
        for(let i=0;i<12;i++){
            const line=document.createElement('div');
            const c=AC[Math.floor(Math.random()*AC.length)];
            line.style.cssText=`position:absolute;left:0;width:100%;height:${1+Math.random()*5}px;
                top:${Math.random()*100}%;background:${c};opacity:.8;
                animation:_glitch ${.1+Math.random()*.25}s ${Math.random()*.3}s ease forwards;`;
            gEl.appendChild(line);
        }
        setTimeout(()=>{if(gEl)gEl.style.opacity='0';},500);
    },1300);
    const bl=getEl('cinematic-blackout');
    if(bl)bl.style.animation='_secretBg 2s ease-in-out infinite';
    _activeCountdownId=startCountdown(cd,20,'#ffffff');
    // CLIMAX
    setTimeout(()=>{
        clearInterval(gId);
        if(_activeCountdownId!==null){clearInterval(_activeCountdownId);_activeCountdownId=null;}
        if(bl)bl.style.animation='';
        if(gEl){gEl.style.opacity='0';gEl.innerHTML='';}
        if(cd){cd.textContent='✦✦✦ SINGULARITÄT ✦✦✦';cd.style.fontSize='1.6rem';
            cd.style.animation='_rainbow .4s ease infinite';cd.style.letterSpacing='5px';}
        burst({count:700,colors:AC,speed:22,grav:.02,types:['circle','star','sp'],trail:true,sz:5});
        for(let i=0;i<14;i++) setTimeout(()=>{
            if(!_alive)return;
            lightning(AC[i%AC.length],9); fireworks(AC,5);
            shockwave(cx+(Math.random()-.5)*150,cy+(Math.random()-.5)*150,AC[i%AC.length],1.9);
            screenShake(22-i,400);
        },i*140);
    },18000);
}

// ── PLANET REVEAL (Bug-fixed: rings on portal, not orb) ───────────
function revealPlanet(drawn){
    const orb=getEl('gacha-orb');
    const portal=getEl('gacha-portal');
    if(!orb)return;
    // Remove old rings
    if(portal) portal.querySelectorAll('.orb-ring').forEach(r=>r.remove());
    // Style planet
    orb.innerHTML='';
    orb.style.cssText=`
        width:90px;height:90px;border-radius:50%;flex-shrink:0;
        position:relative;z-index:5;overflow:visible;
        background:radial-gradient(circle at 32% 28%,${_lighten(drawn.color,55)} 0%,${drawn.color} 50%,${_darken(drawn.color,55)} 100%);
        box-shadow:0 0 25px ${drawn.color},0 0 55px ${drawn.color}66,0 0 100px ${drawn.color}22,
            inset -10px -10px 25px rgba(0,0,0,0.85),inset 4px 4px 12px rgba(255,255,255,0.2);
        animation:_pRev .9s cubic-bezier(.175,.885,.32,1.5) forwards;
    `;
    // Orbit rings added to PORTAL (160×160 container) — so they center correctly
    if(portal&&(drawn.rarity==='mythic'||drawn.rarity==='secret')){
        const r1=document.createElement('div'); r1.className='orb-ring';
        r1.style.cssText=`
            position:absolute;top:50%;left:50%;
            width:124px;height:124px;border-radius:50%;
            border:2px solid ${drawn.color}99;box-shadow:0 0 12px ${drawn.color}66;
            transform:translate(-50%,-50%) rotateX(72deg);
            animation:_orb 3s linear infinite;pointer-events:none;
        `;
        portal.appendChild(r1);
        if(drawn.rarity==='secret'){
            const r2=document.createElement('div'); r2.className='orb-ring';
            r2.style.cssText=`
                position:absolute;top:50%;left:50%;
                width:148px;height:148px;border-radius:50%;
                border:1.5px solid ${drawn.color}55;
                transform:translate(-50%,-50%) rotateX(55deg) rotateZ(60deg);
                animation:_orb2 5s linear infinite;pointer-events:none;
            `;
            portal.appendChild(r2);
        }
    }
}

function revealText(drawn,cfg){
    const rt=getEl('gacha-reveal-text'), badge=getEl('gacha-rarity-badge');
    if(rt){
        rt.style.opacity='0';
        setTimeout(()=>{
            rt.textContent=drawn.name;
            rt.style.color=drawn.color;rt.style.opacity='1';
            rt.style.fontSize=drawn.rarity==='secret'?'1.4rem':'1.2rem';
            rt.style.textShadow=`0 0 15px ${drawn.color},0 0 30px ${drawn.color}88`;
            rt.style.animation='_nameIn .55s cubic-bezier(.175,.885,.32,1.5) forwards';
            if(drawn.rarity==='secret') setTimeout(()=>{if(rt)rt.style.animation='_rainbow 1.5s ease infinite';},700);
        },80);
    }
    if(badge){
        badge.style.opacity='0';
        setTimeout(()=>{
            badge.textContent=cfg.label;
            badge.style.cssText=`
                display:inline-block;padding:5px 18px;border-radius:20px;
                font-family:Orbitron;font-weight:900;font-size:.8rem;letter-spacing:2px;
                background:${drawn.color};color:${drawn.rarity==='secret'?'#000':'#fff'};
                box-shadow:0 0 20px ${drawn.color},0 0 40px ${drawn.color}55;opacity:1;
                animation:_badgePop .6s cubic-bezier(.175,.885,.32,1.5) forwards;
            `;
            if(drawn.rarity==='secret') setTimeout(()=>{
                if(badge)badge.style.animation='_badgePop .6s cubic-bezier(.175,.885,.32,1.5) forwards,_rainbow 1s ease infinite';
            },750);
        },280);
    }
}

// ── MAIN ROLL ────────────────────────────────────────────────────
_rollBase_unused=function(){
    const cost=bannerCosts[activeBanner];
    if(isRolling||energy<cost)return;
    isRolling=true;
    const btn=getEl('roll-gacha-btn'); if(btn)btn.disabled=true;
    energy-=cost; updateDisplay();
    injectKF();
    // Roll
    const r=Math.random()*100;
    let rarity='common';
    if(activeBanner===1)      rarity=r<25?'rare':'common';
    else if(activeBanner===2) rarity=r<15?'epic':(r<55?'rare':'common');
    else if(activeBanner===3) rarity=r<15?'mythic':(r<50?'epic':'rare');
    else if(activeBanner===4) rarity=r<10?'secret':(r<40?'mythic':'epic');
    else if(activeBanner===5) rarity=r<25?'secret':'mythic';
    const cfg=RARITY_CFG[rarity];
    const delay=cfg.duration;
    // Setup screen
    const bl=getEl('cinematic-blackout');
    if(bl){bl.style.display='flex';bl.style.background=cfg.screenBg;bl.style.animation='';bl.style.transform='';}
    // Reset legacy elements
    ['cinematic-beam','cinematic-blast'].forEach(id=>{const e=getEl(id);if(e){e.style.height='0';e.style.width='0';e.style.opacity='0';}});
    const gEl=getEl('cinematic-glitch-lines'); if(gEl){gEl.style.opacity='0';gEl.innerHTML='';}
    // Reset orb + portal rings
    const orb=getEl('gacha-orb');
    if(orb){orb.innerHTML='';orb.style.cssText='width:80px;height:80px;border-radius:50%;transform:scale(0);';}
    const portal=getEl('gacha-portal');
    if(portal)portal.querySelectorAll('.orb-ring').forEach(r=>r.remove());
    // Reset text
    const rt=getEl('gacha-reveal-text');
    if(rt){rt.textContent='';rt.style.opacity='0';rt.style.animation='';}
    const badge=getEl('gacha-rarity-badge');
    if(badge){badge.textContent='';badge.style.opacity='0';badge.style.animation='';}
    // Init canvas
    initCanvas(cfg.primary,cfg.secondary); _loop();
    // Setup countdown label
    const cd=getEl('cinematic-countdown');
    if(cd){
        cd.style.cssText=`font-family:'Orbitron',sans-serif;font-size:1rem;font-weight:bold;
            letter-spacing:2px;position:relative;z-index:30;
            color:${cfg.primary};text-shadow:0 0 20px ${cfg.primary};
            max-width:90%;text-align:center;`;
        cd.textContent='INITIALISIERE...';
    }
    // Entry burst
    setTimeout(()=>burst({count:30,colors:[cfg.primary,cfg.secondary],speed:5,grav:.05,types:['sp','circle']}),100);
    // Dispatch cinematic
    setTimeout(()=>{
        if(rarity==='common')     cin_common(cfg,cd);
        else if(rarity==='rare')  cin_rare(cfg,cd);
        else if(rarity==='epic')  cin_epic(cfg,cd);
        else if(rarity==='mythic')cin_mythic(cfg,cd);
        else if(rarity==='secret')cin_secret(cfg,cd);
    },200);
    // Flash
    setTimeout(()=>{
        const f=getEl('gacha-flash-overlay');
        if(f){f.className='';void f.offsetWidth;f.className=cfg.flashClass;}
    },delay-400);
    // REVEAL
    setTimeout(()=>{
        stopCanvas();
        if(bl){bl.style.display='none';bl.style.animation='';}
        if(getEl('gacha-main-stage'))getEl('gacha-main-stage').className='';
        const f=getEl('gacha-flash-overlay');if(f)f.className='';
        if(gEl){gEl.style.opacity='0';gEl.innerHTML='';}
        if(_activeCountdownId!==null){clearInterval(_activeCountdownId);_activeCountdownId=null;}
        // Draw planet
        let pool=planetPool.filter(p=>p.banner===activeBanner&&p.rarity===rarity);
        if(!pool.length)pool=planetPool.filter(p=>p.banner===activeBanner);
        const drawn={...pool[Math.floor(Math.random()*pool.length)],
            instanceId:'inst-'+Date.now()+'-'+Math.floor(Math.random()*1000)};
        // Portal glow
        if(portal){
            portal.className='portal-idle';
            portal.style.borderColor=drawn.color;
            portal.style.boxShadow=`0 0 40px ${drawn.color},0 0 80px ${drawn.color}44`;
        }
        revealPlanet(drawn); revealText(drawn,cfg);
        // Stage flash
        const stage=getEl('gacha-main-stage');
        if(stage){
            stage.style.setProperty('--gc',drawn.color);
            stage.style.setProperty('--gc-t',drawn.color+'33');
            stage.style.animation='_stageFlash 1.5s ease-out';
            setTimeout(()=>{if(stage)stage.style.animation='';},1500);
        }
        inventory.push(drawn);
        bannerCosts[activeBanner]=Math.round(bannerCosts[activeBanner]*1.75);
        if(getEl('system-log'))getEl('system-log').textContent=`> ${cfg.label}: ${drawn.name} gefunden!`;
        updateInventoryUI();updateEquipUI();updateDisplay();
        isRolling=false; if(btn)btn.disabled=false;
    },delay);
}

// ── DIVINE RARITY CONFIG UPDATE ───────────────────────────────
// Add divine to RARITY_CFG
RARITY_CFG['divine'] = {
    primary:'#FFD700', secondary:'#FFFFFF', duration:61500,
    flashClass:'flash-divine', label:'⭐ GÖTTLICH ⭐', screenBg:'#030200'
};

// ── DIVINE CINEMATIC (60 seconds) ────────────────────────────
function cin_divine(cfg, cd) {
    const cx=window.innerWidth/2, cy=window.innerHeight/2;
    const GOLD='#FFD700', WHITE='#FFFFFF', ORANGE='#FF9500';
    const DIVINE_COLS=[GOLD,WHITE,ORANGE,'#FFF0A0','#FFE060','#FFFACD','#FF6000'];

    // Inject divine-specific keyframes once
    if(!document.getElementById('divine-kf')){
        const s=document.createElement('style'); s.id='divine-kf';
        s.textContent=`
            @keyframes _divBg1{0%{background:radial-gradient(ellipse at 50% 50%,#0a0800,#000);}50%{background:radial-gradient(ellipse at 50% 50%,#150f00,#020100);}100%{background:radial-gradient(ellipse at 50% 50%,#0a0800,#000);}}
            @keyframes _divBg2{0%{background:radial-gradient(ellipse at 30% 70%,#1a0f00,#000);}33%{background:radial-gradient(ellipse at 70% 30%,#0f1a00,#000);}66%{background:radial-gradient(ellipse at 50% 50%,#1a1000,#000);}100%{background:radial-gradient(ellipse at 30% 70%,#1a0f00,#000);}}
            @keyframes _divBg3{0%{filter:hue-rotate(0deg) brightness(1);}50%{filter:hue-rotate(30deg) brightness(1.4);}100%{filter:hue-rotate(0deg) brightness(1);}}
            @keyframes _divBg4{0%{background:radial-gradient(circle at 50% 50%,#201800,#000);}100%{background:radial-gradient(circle at 50% 50%,#fff8e0,#201800);}}
            @keyframes _divPulse{0%,100%{opacity:0.6;transform:scale(0.95);}50%{opacity:1;transform:scale(1.08);}}
        `;
        document.head.appendChild(s);
    }

    const bl=getEl('cinematic-blackout');

    // ── PHASE 1 (0-12s): Reality begins to fracture ──────────
    if(cd){ cd.textContent='GÖTTLICHE PRÄSENZ MANIFESTIERT...'; cd.style.color=GOLD; cd.style.fontSize='0.9rem'; cd.style.letterSpacing='3px'; }

    // Slow golden nebula particles
    rain({colors:[GOLD+'44',WHITE+'22'],duration:12000,perTick:2});
    if(bl) bl.style.animation='_divBg1 3s ease-in-out infinite';

    // Gentle shockwaves every 2s
    [0,2000,4000,6000,8000,10000].forEach(t=>setTimeout(()=>{
        if(!_alive)return;
        spawnShockwave(cx+(Math.random()-.5)*300, cy+(Math.random()-.5)*200, GOLD, 2.5);
    },t));

    // ── PHASE 2 (12-25s): Time itself begins to bend ──────────
    setTimeout(()=>{
        if(!_alive)return;
        if(cd){ cd.textContent='ZEITSTRUKTUR KOLLABIERT...'; cd.style.color=WHITE; cd.style.letterSpacing='4px'; }
        if(bl) bl.style.animation='_divBg2 2s ease-in-out infinite';

        // Reverse vortex (particles spiral OUTWARD from center)
        const cx2=window.innerWidth/2, cy2=window.innerHeight/2;
        let rAngle=0, rElapsed=0;
        const rId=setInterval(()=>{
            rElapsed+=16; if(!_alive||rElapsed>13000){clearInterval(rId);return;}
            const prog=rElapsed/13000;
            const r=prog*Math.min(window.innerWidth,window.innerHeight)*.5;
            const x=cx2+Math.cos(rAngle)*r, y=cy2+Math.sin(rAngle)*r;
            _pts.push(new Pt({x:cx2,y:cy2,
                vx:Math.cos(rAngle)*(8+prog*12),vy:Math.sin(rAngle)*(8+prog*12),
                sz:2+Math.random()*3,col:DIVINE_COLS[Math.floor(Math.random()*DIVINE_COLS.length)],
                decay:.008,grav:0,trail:true}));
            rAngle+=.18;
        },16);

        // First lightning strikes
        [0,1500,3000,4500,6000,7500,9000,10500,12000].forEach((t,i)=>setTimeout(()=>{
            if(!_alive)return;
            lightning(i%2===0?GOLD:WHITE, 3+Math.floor(i/3));
            if(i>4) screenShake(6+i,300);
        },t));

    },12000);

    // ── PHASE 3 (25-42s): The cosmos screams ──────────────────
    setTimeout(()=>{
        if(!_alive)return;
        if(cd){ cd.textContent='KOSMISCHE BARRIERE BRICHT...'; cd.style.color=ORANGE; cd.style.fontSize='1.1rem'; }
        if(bl) bl.style.animation='_divBg3 1.5s ease-in-out infinite';

        vortex({colors:DIVINE_COLS,duration:17000});
        setTimeout(()=>vortex({colors:DIVINE_COLS,duration:12000}),3000);
        setTimeout(()=>vortex({colors:DIVINE_COLS,duration:8000}),8000);
        rain({colors:DIVINE_COLS,duration:17000,perTick:12});

        let phase3=0;
        const p3Id=setInterval(()=>{
            if(!_alive){clearInterval(p3Id);return;}
            phase3++;
            burst({count:100+phase3*25,colors:DIVINE_COLS,speed:15+phase3*2,grav:.04,
                types:['circle','star','sp'],trail:true,sz:4});
            lightning(DIVINE_COLS[phase3%DIVINE_COLS.length],6+phase3);
            spawnShockwave(cx+(Math.random()-.5)*200,cy+(Math.random()-.5)*200,GOLD,1.8);
            screenShake(10+phase3*2,350);
        },1800);
        setTimeout(()=>clearInterval(p3Id),16800);

    },25000);

    // ── PHASE 4 (42-58s): Singularity approaches ──────────────
    setTimeout(()=>{
        if(!_alive)return;
        if(cd){ cd.textContent='UNENDLICHKEIT ÖFFNET SICH...'; cd.style.color='#fff'; cd.style.fontSize='1.3rem'; cd.style.textShadow=`0 0 30px ${GOLD},0 0 60px ${WHITE}`; }
        if(bl) bl.style.animation='_divBg4 .8s ease-in-out forwards';

        // Everything converges to center — massive inward vortex
        vortex({colors:[GOLD,WHITE],duration:16000});
        setTimeout(()=>vortex({colors:DIVINE_COLS,duration:12000}),2000);
        setTimeout(()=>vortex({colors:DIVINE_COLS,duration:8000}),6000);
        setTimeout(()=>vortex({colors:DIVINE_COLS,duration:4000}),10000);

        rain({colors:DIVINE_COLS,duration:16000,perTick:18});

        // Escalating continuous screen shake
        let shakeI=0;
        const shId=setInterval(()=>{
            if(!_alive){clearInterval(shId);return;}
            shakeI++;
            screenShake(12+shakeI*1.5,200);
            lightning(DIVINE_COLS[shakeI%DIVINE_COLS.length],8);
            spawnShockwave(cx,cy,GOLD,1.2);
        },700);
        setTimeout(()=>clearInterval(shId),15800);

        // Countdown with divine style
        _activeCountdownId=startCountdown(cd,16,GOLD);

    },42000);

    // ── PHASE 5 (58s): DIVINE REVELATION ──────────────────────
    setTimeout(()=>{
        if(_activeCountdownId!==null){clearInterval(_activeCountdownId);_activeCountdownId=null;}
        if(!_alive)return;

        if(bl){ bl.style.animation=''; bl.style.background='#fffbe0'; }
        if(cd){ cd.textContent='⭐ GÖTTLICHE ERSCHEINUNG ⭐'; cd.style.fontSize='1.6rem';
            cd.style.color='#000'; cd.style.textShadow='none'; cd.style.letterSpacing='4px'; }

        // Mega burst: 2000 particles
        burst({count:2000,colors:DIVINE_COLS,speed:28,grav:.01,types:['circle','star','sp'],trail:true,sz:5});
        burst({count:500,colors:[WHITE,'#fffff0'],speed:35,grav:0,types:['star','sp'],trail:true,sz:8});

        // 20 shockwaves in rapid succession
        for(let i=0;i<20;i++) setTimeout(()=>{
            if(!_alive)return;
            const d=i/20;
            spawnShockwave(cx,cy,d<.5?GOLD:WHITE,2.0+i*.1);
            if(i%3===0) spawnShockwave(cx+(Math.random()-.5)*150,cy+(Math.random()-.5)*150,ORANGE,1.5);
        },i*80);

        // Lightning apocalypse
        for(let i=0;i<15;i++) setTimeout(()=>{
            if(!_alive)return;
            lightning(DIVINE_COLS[i%DIVINE_COLS.length],12);
        },i*100);

        screenShake(30,2000);

        // Restore bg
        setTimeout(()=>{ if(bl)bl.style.background='#030200'; },800);

    },58000);
}

// ── UPDATE rollPlanet to handle divine & B6 ───────────────────

// Override roll planet rarity logic for B6
const _rollWithDivine=function(){
    const cost=bannerCosts[activeBanner];
    if(isRolling||energy<cost)return;
    isRolling=true;
    const btn=getEl('roll-gacha-btn'); if(btn)btn.disabled=true;
    energy-=cost; totalRolls++; updateDisplay();
    injectKF();
    const r=Math.random()*100;
    let rarity='common';
    if(activeBanner===1)      rarity=r<25?'rare':'common';
    else if(activeBanner===2) rarity=r<15?'epic':(r<55?'rare':'common');
    else if(activeBanner===3) rarity=r<15?'mythic':(r<50?'epic':'rare');
    else if(activeBanner===4) rarity=r<10?'secret':(r<40?'mythic':'epic');
    else if(activeBanner===5) rarity=r<5?'divine':(r<30?'secret':'mythic');
    else if(activeBanner===6) rarity=r<40?'divine':(r<80?'secret':'mythic');
    const cfg=RARITY_CFG[rarity];
    const delay=cfg.duration;
    const bl=getEl('cinematic-blackout');
    if(bl){bl.style.display='flex';bl.style.background=cfg.screenBg;bl.style.animation='';bl.style.transform='';}
    ['cinematic-beam','cinematic-blast'].forEach(id=>{const e=getEl(id);if(e){e.style.height='0';e.style.width='0';e.style.opacity='0';}});
    const gEl=getEl('cinematic-glitch-lines'); if(gEl){gEl.style.opacity='0';gEl.innerHTML='';}
    const orb=getEl('gacha-orb');
    if(orb){orb.innerHTML='';orb.style.cssText='width:80px;height:80px;border-radius:50%;transform:scale(0);';}
    const portal=getEl('gacha-portal');
    if(portal)portal.querySelectorAll('.orb-ring').forEach(r2=>r2.remove());
    const rt=getEl('gacha-reveal-text'); if(rt){rt.textContent='';rt.style.opacity='0';rt.style.animation='';}
    const badge=getEl('gacha-rarity-badge'); if(badge){badge.textContent='';badge.style.opacity='0';badge.style.animation='';}
    initCanvas(cfg.primary,cfg.secondary); _loop();
    const cd=getEl('cinematic-countdown');
    if(cd){cd.style.cssText=`font-family:'Orbitron',sans-serif;font-size:1rem;font-weight:bold;letter-spacing:2px;position:relative;z-index:30;color:${cfg.primary};text-shadow:0 0 20px ${cfg.primary};max-width:90%;text-align:center;`;cd.textContent='INITIALISIERE...';}
    setTimeout(()=>burst({count:30,colors:[cfg.primary,cfg.secondary],speed:5,grav:.05,types:['sp','circle']}),100);
    setTimeout(()=>{
        if(rarity==='common')     cin_common(cfg,cd);
        else if(rarity==='rare')  cin_rare(cfg,cd);
        else if(rarity==='epic')  cin_epic(cfg,cd);
        else if(rarity==='mythic')cin_mythic(cfg,cd);
        else if(rarity==='secret')cin_secret(cfg,cd);
        else if(rarity==='divine')cin_divine(cfg,cd);
    },200);
    setTimeout(()=>{
        const f=getEl('gacha-flash-overlay');
        if(f){f.className='';void f.offsetWidth;f.className=cfg.flashClass;}
    },delay-500);
    setTimeout(()=>{
        stopCanvas();
        if(bl){bl.style.display='none';bl.style.animation='';}
        if(getEl('gacha-main-stage'))getEl('gacha-main-stage').className='';
        const f=getEl('gacha-flash-overlay');if(f)f.className='';
        if(gEl){gEl.style.opacity='0';gEl.innerHTML='';}
        if(_activeCountdownId!==null){clearInterval(_activeCountdownId);_activeCountdownId=null;}
        let pool=planetPool.filter(p=>p.banner===activeBanner&&p.rarity===rarity);
        if(!pool.length)pool=planetPool.filter(p=>p.banner===activeBanner);
        if(!pool.length)pool=planetPool;
        const drawn={...pool[Math.floor(Math.random()*pool.length)],instanceId:'inst-'+Date.now()+'-'+Math.floor(Math.random()*1000)};
        if(portal){portal.className='portal-idle';portal.style.borderColor=drawn.color;portal.style.boxShadow=`0 0 40px ${drawn.color},0 0 80px ${drawn.color}44`;}
        revealPlanet(drawn); revealText(drawn,cfg);
        const stage=getEl('gacha-main-stage');
        if(stage){stage.style.setProperty('--gc',drawn.color);stage.style.setProperty('--gc-t',drawn.color+'33');stage.style.animation='_stageFlash 1.5s ease-out';setTimeout(()=>{if(stage)stage.style.animation='';},1500);}
        inventory.push(drawn);
        bannerCosts[activeBanner]=Math.round(bannerCosts[activeBanner]*1.75);
        if(getEl('system-log'))getEl('system-log').textContent=`> ${cfg.label}: ${drawn.name} gefunden!`;
        updateInventoryUI();updateEquipUI();updateDisplay();
        checkAchievements();
        isRolling=false; if(btn)btn.disabled=false;
    },delay);
};
// ── RARITY TABLE: every rarity in every banner ─────────────────
function getRarityForBanner(banner){
    const r=Math.random()*100;
    const tables={
        1:{divine:0,  secret:0,   mythic:0,  epic:1,  rare:24, common:75},
        2:{divine:0,  secret:0.5, mythic:2,  epic:15, rare:40, common:42.5},
        3:{divine:0.1,secret:2,   mythic:12, epic:35, rare:35, common:15.9},
        4:{divine:0.5,secret:8,   mythic:30, epic:40, rare:18, common:3.5},
        5:{divine:3,  secret:22,  mythic:40, epic:28, rare:6,  common:1},
        6:{divine:20, secret:40,  mythic:28, epic:9,  rare:2,  common:1},
    };
    const t=tables[banner]||tables[1];
    let acc=0;
    for(const [rarity,pct] of Object.entries({divine:t.divine,secret:t.secret,mythic:t.mythic,epic:t.epic,rare:t.rare,common:t.common})){
        acc+=pct; if(r<acc)return rarity;
    }
    return 'common';
}

// ── UNIFIED ROLL ───────────────────────────────────────────────
function rollPlanet(){
    const costs=activeGachaMode==='building'?bannerCostsBuilding:bannerCosts;
    const cost=costs[activeBanner];
    if(isRolling||energy<cost)return;
    isRolling=true;
    const btn=getEl('roll-gacha-btn'); if(btn)btn.disabled=true;
    energy-=cost; totalRolls++; updateDisplay();
    injectKF();
    const rarity=getRarityForBanner(activeBanner);
    const cfg=RARITY_CFG[rarity]||RARITY_CFG.common;
    const delay=cfg.duration;
    const bl=getEl('cinematic-blackout');
    if(bl){bl.style.display='flex';bl.style.background=cfg.screenBg;bl.style.animation='';bl.style.transform='';}
    ['cinematic-beam','cinematic-blast'].forEach(id=>{const e=getEl(id);if(e){e.style.height='0';e.style.width='0';e.style.opacity='0';}});
    const gEl=getEl('cinematic-glitch-lines'); if(gEl){gEl.style.opacity='0';gEl.innerHTML='';}
    const orb=getEl('gacha-orb');
    if(orb){orb.innerHTML='';orb.style.cssText='width:80px;height:80px;border-radius:50%;transform:scale(0);';}
    const portal=getEl('gacha-portal');
    if(portal)portal.querySelectorAll('.orb-ring').forEach(r2=>r2.remove());
    const rt=getEl('gacha-reveal-text'); if(rt){rt.textContent='';rt.style.opacity='0';rt.style.animation='';}
    const badge=getEl('gacha-rarity-badge'); if(badge){badge.textContent='';badge.style.opacity='0';badge.style.animation='';}
    initCanvas(cfg.primary,cfg.secondary); _loop();
    const cd=getEl('cinematic-countdown');
    if(cd){cd.style.cssText=`font-family:'Orbitron',sans-serif;font-size:1rem;font-weight:bold;letter-spacing:2px;position:relative;z-index:30;color:${cfg.primary};text-shadow:0 0 20px ${cfg.primary};max-width:90%;text-align:center;`;cd.textContent='INITIALISIERE...';}
    setTimeout(()=>burst({count:30,colors:[cfg.primary,cfg.secondary],speed:5,grav:.05,types:['sp','circle']}),100);
    setTimeout(()=>{
        if(rarity==='common')     cin_common(cfg,cd);
        else if(rarity==='rare')  cin_rare(cfg,cd);
        else if(rarity==='epic')  cin_epic(cfg,cd);
        else if(rarity==='mythic')cin_mythic(cfg,cd);
        else if(rarity==='secret')cin_secret(cfg,cd);
        else if(rarity==='divine')cin_divine(cfg,cd);
    },200);
    setTimeout(()=>{
        const f=getEl('gacha-flash-overlay');
        if(f){f.className='';void f.offsetWidth;f.className=cfg.flashClass;}
    },delay-500);
    setTimeout(()=>{
        stopCanvas();
        if(bl){bl.style.display='none';bl.style.animation='';}
        if(getEl('gacha-main-stage'))getEl('gacha-main-stage').className='';
        const f2=getEl('gacha-flash-overlay');if(f2)f2.className='';
        if(gEl){gEl.style.opacity='0';gEl.innerHTML='';}
        if(_activeCountdownId!==null){clearInterval(_activeCountdownId);_activeCountdownId=null;}
        const pool=(activeGachaMode==='building'?buildingPlanetPool:planetPool)
            .filter(p=>p.rarity===rarity&&p.banner===activeBanner);
        const fallback=(activeGachaMode==='building'?buildingPlanetPool:planetPool)
            .filter(p=>p.rarity===rarity);
        const allPool=activeGachaMode==='building'?buildingPlanetPool:planetPool;
        const usePool=pool.length?pool:(fallback.length?fallback:allPool);
        const drawn={...usePool[Math.floor(Math.random()*usePool.length)],instanceId:'inst-'+Date.now()+'-'+Math.floor(Math.random()*1e6)};
        if(portal){portal.className='portal-idle';portal.style.borderColor=drawn.color;portal.style.boxShadow=`0 0 40px ${drawn.color},0 0 80px ${drawn.color}44`;}
        revealPlanet(drawn); revealText(drawn,cfg);
        const stage=getEl('gacha-main-stage');
        if(stage){stage.style.setProperty('--gc',drawn.color);stage.style.setProperty('--gc-t',drawn.color+'33');stage.style.animation='_stageFlash 1.5s ease-out';setTimeout(()=>{if(stage)stage.style.animation='';},1500);}
        inventory.push(drawn);
        if(activeGachaMode==='building')bannerCostsBuilding[activeBanner]=Math.round(bannerCostsBuilding[activeBanner]*1.6);
        else bannerCosts[activeBanner]=Math.round(bannerCosts[activeBanner]*1.6);
        const multStr=drawn.multiplier>=1000?'×'+formatNumbers(drawn.multiplier):'×'+drawn.multiplier.toFixed(2);
        if(getEl('system-log'))getEl('system-log').textContent=`> ${cfg.label}: ${drawn.name} (${multStr})`;
        updateInventoryUI();updateEquipUI();updateDisplay();checkAchievements();
        isRolling=false; if(btn)btn.disabled=false;
    },delay);
}

// ══════════════════════════════════════════════════════════════════
// FUSION SYSTEM
// Gold = fusion of 5 any planets (same gachaType)
// Rainbow = fusion of 5 Gold planets
// Dark Matter = fusion of 5 Rainbow planets
// ══════════════════════════════════════════════════════════════════
let fusionMode=false;
let fusionSelected=[];
let inventorySort='rarity';
let activeQuests=[], completedQuestIds=[], lastSaveTimestamp=Date.now();
let offlinePopupShown=false; // 'rarity' | 'mult' | 'name'

const FUSION_TIERS=[
    {id:'gold',    name:'Gold-Planet',       color:'#FFD700', multiplier:null, requires:5, requiresId:null,     glyph:'🌟'},
    {id:'rainbow', name:'Regenbogen-Planet',  color:'#FF00FF', multiplier:null, requires:5, requiresId:'gold',   glyph:'🌈'},
    {id:'darkmatter',name:'Dunkle Materie',   color:'#1a0040', multiplier:null, requires:5, requiresId:'rainbow',glyph:'🌑'},
];
// Multipliers: Gold = avg of 5 inputs ×3, Rainbow = avg of 5 golds ×4, Dark Matter = avg of 5 rainbows ×5
function getFusionMultiplier(planets){
    const avg=planets.reduce((s,p)=>s+p.multiplier,0)/planets.length;
    return avg;
}

function toggleFusionMode(){
    fusionMode=!fusionMode;
    fusionSelected=[];
    const btn=getEl('fusion-mode-btn');
    const hint=getEl('fusion-hint');
    if(btn){btn.classList.toggle('active',fusionMode);btn.textContent=fusionMode?'❌ ABBRECHEN':'🔥 FUSION';}
    if(hint){hint.style.display=fusionMode?'block':'none';hint.textContent='Wähle 5 Planeten zum Fusionieren (gleicher Typ).';}
    updateInventoryUI();
}

function toggleFusionSelect(p){
    if(!fusionMode)return;
    // Only allow same gachaType in one fusion batch
    if(fusionSelected.length>0){
        const firstType=inventory.find(x=>x.instanceId===fusionSelected[0]);
        if(firstType&&(firstType.gachaType||'click')!==(p.gachaType||'click')){
            showFusionHint('Nur gleicher Typ (Klick oder Gebäude) mischbar!','#ef4444'); return;
        }
        // Also require same fusion base: can't mix gold with normal for rainbow
        const firstFusId=firstType?firstType.fusionId:null;
        const pFusId=p.fusionId||null;
        if(firstFusId!==pFusId){
            showFusionHint('Nur gleiche Planeten-Kategorie mischbar!','#ef4444'); return;
        }
    }
    const idx=fusionSelected.indexOf(p.instanceId);
    if(idx>=0)fusionSelected.splice(idx,1);
    else if(fusionSelected.length<5)fusionSelected.push(p.instanceId);

    const hint=getEl('fusion-hint');
    if(fusionSelected.length===5){
        if(hint)hint.textContent='5 gewählt! Klicke nochmal auf einen um die Fusion zu starten.';
        // Auto-fuse after short delay
        setTimeout(()=>attemptFusion(),300);
    } else {
        if(hint)hint.textContent=`${fusionSelected.length}/5 Planeten gewählt.`;
    }
    updateInventoryUI();
}

function showFusionHint(msg,col='#ffb703'){
    const hint=getEl('fusion-hint');
    if(hint){hint.textContent=msg;hint.style.color=col;hint.style.display='block';}
}

function attemptFusion(){
    if(fusionSelected.length<5){showFusionHint('Brauche 5 Planeten!','#ef4444');return;}
    const planets=fusionSelected.map(id=>inventory.find(p=>p.instanceId===id)).filter(Boolean);
    if(planets.length<5){showFusionHint('Fehler: Planeten nicht gefunden.','#ef4444');fusionSelected=[];updateInventoryUI();return;}

    // Determine what we're fusing into
    const firstFusId=planets[0].fusionId||null;
    let nextTier;
    if(firstFusId===null)         nextTier=FUSION_TIERS[0]; // → Gold
    else if(firstFusId==='gold')  nextTier=FUSION_TIERS[1]; // → Rainbow
    else if(firstFusId==='rainbow')nextTier=FUSION_TIERS[2]; // → Dark Matter
    else{showFusionHint('Diese Planeten können nicht weiter fusioniert werden!','#ef4444');fusionSelected=[];updateInventoryUI();return;}

    const boost=nextTier.id==='gold'?3:nextTier.id==='rainbow'?5:10;
    const newMult=getFusionMultiplier(planets)*boost;
    const gType=planets[0].gachaType||'click';

    // Remove old planets
    const removedIds=new Set(fusionSelected);
    // Unequip any equipped ones
    equippedPlanets.forEach((ep,i)=>{if(ep&&removedIds.has(ep.instanceId))equippedPlanets[i]=null;});
    inventory=inventory.filter(p=>!removedIds.has(p.instanceId));

    // Create fusion planet
    const newPlanet={
        id:nextTier.id+'_'+Date.now(),
        name:nextTier.name,
        rarity:nextTier.id==='darkmatter'?'secret':nextTier.id==='rainbow'?'epic':'rare',
        banner:3,
        multiplier:newMult,
        color:nextTier.color,
        type:'fusion',
        gachaType:gType,
        fusionId:nextTier.id,
        isFusion:true,
        instanceId:'fusion-'+Date.now()+'-'+Math.floor(Math.random()*1e6),
        isNew:true,
    };
    inventory.push(newPlanet);
    fusionSelected=[];
    fusionMode=false;
    const btn=getEl('fusion-mode-btn');
    if(btn){btn.classList.remove('active');btn.textContent='🔥 FUSION';}
    const hint=getEl('fusion-hint');
    if(hint){
        hint.style.color='#00ff88';
        const ms=newMult>=1000?`×${formatNumbers(newMult)}`:`×${newMult.toFixed(2)}`;
        hint.textContent=`${nextTier.glyph} ${nextTier.name} erstellt! (${ms})`;
        setTimeout(()=>{if(hint)hint.style.display='none';},3000);
    }
    recalculateEps(); updateEquipUI(); updateInventoryUI(); updateDisplay(); saveGame();
    if(getEl('system-log'))getEl('system-log').textContent=`> FUSION: ${nextTier.glyph} ${nextTier.name} (×${newMult>=1000?formatNumbers(newMult):newMult.toFixed(2)}) entstanden!`;
}

// ══════════════════════════════════════════════════════════════════
// INVENTORY & EQUIP UI
// ══════════════════════════════════════════════════════════════════
const RARITY_ORDER={common:0,rare:1,epic:2,mythic:3,secret:4,divine:5};
function getSortedInventory(list){
    const copy=[...list];
    if(inventorySort==='mult')return copy.sort((a,b)=>b.multiplier-a.multiplier);
    if(inventorySort==='name')return copy.sort((a,b)=>a.name.localeCompare(b.name));
    // default: rarity desc, then mult desc
    return copy.sort((a,b)=>{
        const rd=(RARITY_ORDER[b.rarity]||0)-(RARITY_ORDER[a.rarity]||0);
        return rd!==0?rd:b.multiplier-a.multiplier;
    });
}

function updateInventoryUI(){
    const c=getEl('gacha-inventory'); if(!c)return; c.innerHTML='';
    if(getEl('inventory-count'))getEl('inventory-count').textContent=inventory.length;

    const visible=getSortedInventory(inventory.filter(p=>{
        if(equippedPlanets.some(ep=>ep&&ep.instanceId===p.instanceId))return false;
        return (p.gachaType||'click')===activeGachaMode;
    }));

    // In fusion mode: determine eligible fusionId
    let eligibleFusionId=undefined;
    if(fusionMode&&fusionSelected.length>0){
        const first=inventory.find(x=>x.instanceId===fusionSelected[0]);
        eligibleFusionId=first?(first.fusionId||null):null;
    }

    visible.forEach(p=>{
        const card=document.createElement('div');
        const isSel=fusionSelected.includes(p.instanceId);
        const isNew=p.isNew;
        if(isNew)p.isNew=false;

        // Fusion eligibility
        let fusionClass='';
        if(fusionMode){
            if(isSel) fusionClass=' fusion-selected';
            else if(fusionSelected.length>0){
                const first=inventory.find(x=>x.instanceId===fusionSelected[0]);
                const sameType=(first?(first.gachaType||'click'):null)===(p.gachaType||'click');
                const sameFusId=(first?(first.fusionId||null):null)===(p.fusionId||null);
                fusionClass=sameType&&sameFusId?' fusion-candidate':' fusion-ineligible';
            } else fusionClass=' fusion-candidate';
        }

        card.className=`planet-card rarity-${p.rarity}${fusionClass}${isNew?' fusion-new':''}`;
        const grad=p.isFusion?`radial-gradient(circle,${p.color},#000)`:getPlanetGradient(p);
        const extra=p.isFusion?`animation:_divPulse 2s ease-in-out infinite;`:getPlanetExtraStyles(p.rarity);
        const icon=p.gachaType==='building'?'⚙️':'⚡';
        const fusGlyph=p.isFusion?(FUSION_TIERS.find(t=>t.id===p.fusionId)||{glyph:'✨'}).glyph:'';
        const ms=p.multiplier>=1000?`×${formatNumbers(p.multiplier)}`:`×${p.multiplier.toFixed(2)}`;

        card.innerHTML=`<div style="width:28px;height:28px;border-radius:50%;background:${grad};box-shadow:0 0 8px ${p.color}88;margin-bottom:3px;flex-shrink:0;${extra}"></div>
            <div style="font-size:.52rem;font-weight:bold;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;width:100%;text-align:center;">${fusGlyph||icon}${p.name}</div>
            <div style="font-size:.65rem;color:#00ff66;font-weight:bold;">${ms}</div>`;

        card.onclick=()=>{
            if(fusionMode)toggleFusionSelect(p);
            else equipPlanet(p);
        };
        c.appendChild(card);
    });

    // Sort button cycle label
    const sortBtn=getEl('sort-inv-btn');
    if(sortBtn){
        const labels={rarity:'⬇️ SELTENHEIT',mult:'⬇️ MULTIPLIK.',name:'⬇️ NAME'};
        sortBtn.textContent=labels[inventorySort]||'⬇️ SORTIEREN';
    }
}

function updateEquipUI(){
    const c=getEl('equip-slots-container'); if(!c)return; c.innerHTML='';
    const lbl=getEl('equip-bar-label');
    if(lbl)lbl.textContent=activeGachaMode==='click'?'AKTIVE ORBITS — KLICK (MAX 3, ×MULT.)':'AKTIVE ORBITS — GEBÄUDE (MAX 3, ×MULT.)';
    const slotStart=activeGachaMode==='click'?0:3;
    for(let i=slotStart;i<slotStart+3;i++){
        const box=document.createElement('div'); const p=equippedPlanets[i];
        if(p){
            box.className='slot-box slot-filled'; box.style.borderColor=p.color; box.style.boxShadow=`0 0 12px ${p.color}66`;
            const grad=getPlanetGradient(p);
            const ms=p.multiplier>=1000?`×${formatNumbers(p.multiplier)}`:`×${p.multiplier.toFixed(2)}`;
            box.innerHTML=`<div style="width:20px;height:20px;border-radius:50%;background:${grad};box-shadow:0 0 6px ${p.color};"></div>
                <div style="overflow:hidden;width:100%;white-space:nowrap;font-size:.48rem;font-weight:bold;text-align:center;">${p.name}</div>
                <div style="font-size:.6rem;color:#00ff88;font-weight:bold;">${ms}</div>`;
            box.onclick=()=>unequipPlanet(i);
        }else{
            box.className='slot-box';
            box.innerHTML=`<span style="color:#334155;font-size:.7rem;">${activeGachaMode==='click'?'⚡':'⚙️'}</span>`;
        }
        c.appendChild(box);
    }
}
function equipPlanet(p){
    const slotStart=(p.gachaType==='building')?3:0;
    let f=-1;
    for(let i=slotStart;i<slotStart+3;i++){if(!equippedPlanets[i]){f=i;break;}}
    if(f!==-1){equippedPlanets[f]=p;updateInventoryUI();updateEquipUI();recalculateEps();updateDisplay();}
}
function unequipPlanet(i){equippedPlanets[i]=null;updateInventoryUI();updateEquipUI();recalculateEps();updateDisplay();}

function drawConstellation() {
    const container=document.querySelector('.constellation-container'); if(!container)return; container.innerHTML='';
    // 8 paths, 5 stars each — positions [x%, y%]
    const POS={
        'Klick': [[12,22],[24,10],[36,20],[50,10],[63,22]],
        'Zeit':  [[37,35],[50,28],[63,35],[72,25],[80,38]],
        'Gacha': [[68,14],[80,8],[88,18],[82,28],[72,22]],
        'Sonde': [[10,50],[22,42],[34,52],[22,62],[12,58]],
        'Götter':[[44,48],[56,42],[65,50],[58,60],[46,58]],
        'Geist': [[78,48],[88,42],[92,52],[86,62],[76,56]],
        'Mine':  [[14,75],[26,68],[38,76],[28,84],[16,82]],
        'Kosmos':[[50,72],[62,65],[74,72],[68,82],[56,80]],
    };
    const COLS={'Klick':'#00f0ff','Zeit':'#00e5cc','Gacha':'#ff00ff','Sonde':'#00ff88','Götter':'#ffd700','Geist':'#ff0055','Mine':'#ffb703','Kosmos':'#b5179e'};
    const ICONS={'Klick':'⚡','Zeit':'⏰','Gacha':'🎲','Sonde':'🛸','Götter':'✨','Geist':'👁','Mine':'⛏','Kosmos':'🌌'};

    container.style.minHeight='480px'; container.style.position='relative';
    if(!document.getElementById('twkf2')){const s=document.createElement('style');s.id='twkf2';s.textContent=`@keyframes _twink{0%,100%{opacity:var(--op);}50%{opacity:calc(var(--op)*0.1);}}`;document.head.appendChild(s);}

    const NS='http://www.w3.org/2000/svg';
    const svg=document.createElementNS(NS,'svg'); svg.setAttribute('width','100%'); svg.setAttribute('height','100%');
    svg.style.cssText='position:absolute;top:0;left:0;pointer-events:none;z-index:1;overflow:visible;';
    const defs=document.createElementNS(NS,'defs');
    defs.innerHTML=`<filter id="sg2"><feGaussianBlur stdDeviation="2.5" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
        <filter id="sgl2"><feGaussianBlur stdDeviation="6" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>`;
    svg.appendChild(defs);
    // bg stars
    for(let i=0;i<90;i++){const c=document.createElementNS(NS,'circle');const op=0.08+Math.random()*.5;c.setAttribute('cx',(2+Math.random()*96)+'%');c.setAttribute('cy',(2+Math.random()*96)+'%');c.setAttribute('r',0.3+Math.random()*1.3);c.setAttribute('fill','white');c.style.setProperty('--op',op);c.style.animation=`_twink ${1.2+Math.random()*3.5}s ease-in-out ${Math.random()*2.5}s infinite`;svg.appendChild(c);}
    // connections
    Object.entries(POS).forEach(([path,positions])=>{
        const col=COLS[path];
        for(let i=0;i<positions.length-1;i++){
            const [x1,y1]=positions[i],[x2,y2]=positions[i+1];
            const fB=purchasedStars.includes(`star-${path}-${i+1}`), tB=purchasedStars.includes(`star-${path}-${i+2}`),both=fB&&tB;
            if(both){const g=document.createElementNS(NS,'line');g.setAttribute('x1',x1+'%');g.setAttribute('y1',y1+'%');g.setAttribute('x2',x2+'%');g.setAttribute('y2',y2+'%');g.setAttribute('stroke',col);g.setAttribute('stroke-width','8');g.setAttribute('opacity','0.15');g.setAttribute('filter','url(#sgl2)');svg.appendChild(g);}
            const line=document.createElementNS(NS,'line');line.setAttribute('x1',x1+'%');line.setAttribute('y1',y1+'%');line.setAttribute('x2',x2+'%');line.setAttribute('y2',y2+'%');
            line.setAttribute('stroke',both?col:fB?col:'#1e2d4a');line.setAttribute('stroke-width',both?'2':'1');line.setAttribute('opacity',both?'0.9':fB?'0.45':'0.35');if(!both&&!fB)line.setAttribute('stroke-dasharray','2,8');else if(!both)line.setAttribute('stroke-dasharray','6,5');if(both)line.setAttribute('filter','url(#sg2)');svg.appendChild(line);
        }
    });
    container.appendChild(svg);
    // labels & nodes
    Object.entries(POS).forEach(([path,positions])=>{
        const col=COLS[path],[lx,ly]=positions[0];
        const lbl=document.createElement('div');lbl.style.cssText=`position:absolute;left:${lx}%;top:${ly}%;transform:translate(-50%,-260%);font-family:'Orbitron';font-size:.5rem;color:${col};text-shadow:0 0 8px ${col};white-space:nowrap;pointer-events:none;z-index:8;font-weight:700;letter-spacing:1px;`;lbl.textContent=`${ICONS[path]} ${path.toUpperCase()}`;container.appendChild(lbl);
        positions.forEach(([xp,yp],lvl)=>{
            const id=`star-${path}-${lvl+1}`;
            const isBought=purchasedStars.includes(id);
            const parentId=lvl===0?null:`star-${path}-${lvl}`;
            const isUnlocked=parentId===null||purchasedStars.includes(parentId);
            const su=starUpgrades[id]; if(!su)return;
            // Check rebirth requirement
            const reqRebirth=su.requireRebirth||0;
            const canAccess=rebirthCount>=reqRebirth;
            const sz=isBought?22:(isUnlocked&&canAccess?17:12);
            const node=document.createElement('div');
            node.style.cssText=`position:absolute;left:${xp}%;top:${yp}%;width:${sz}px;height:${sz}px;border-radius:50%;transform:translate(-50%,-50%);cursor:pointer;z-index:5;transition:transform .2s,box-shadow .2s;display:flex;align-items:center;justify-content:center;`;
            if(isBought){node.style.background=col;node.style.border='2px solid #fff';node.style.boxShadow=`0 0 14px ${col},0 0 28px ${col}66`;node.style.setProperty('--op','1');node.style.animation=`_twink ${1.5+Math.random()*2}s ease-in-out ${Math.random()}s infinite`;node.innerHTML=`<span style="font-size:${7+lvl}px;color:#fff;pointer-events:none;text-shadow:0 0 6px #fff;">★</span>`;}
            else if(isUnlocked&&canAccess){node.style.background=col+'28';node.style.border=`2px solid ${col}`;node.style.boxShadow=`0 0 10px ${col}88`;node.innerHTML=`<span style="font-size:9px;color:${col};pointer-events:none;">✦</span>`;}
            else{node.style.background='#080e1f';node.style.border=`2px solid ${canAccess?'#1e2d4a':'#0a1020'}`;node.innerHTML=`<span style="font-size:7px;color:#1e2d4a;pointer-events:none;">${canAccess?'·':'🔒'}</span>`;}
            node.onmouseenter=()=>{if(!isBought)node.style.transform='translate(-50%,-50%) scale(1.4)';const s=isBought?'[AKTIV]':(isUnlocked&&canAccess?`[${su.cost} Kerne]`:canAccess?'[GESPERRT]':'[Benötigt '+reqRebirth+' Rebirths]');if(getEl('star-info-text'))getEl('star-info-text').innerHTML=`<strong style="color:${col}">${su.name} ${s}</strong> — ${su.desc}`;};
            node.onmouseleave=()=>node.style.transform='translate(-50%,-50%) scale(1)';
            node.onclick=()=>{if(isUnlocked&&canAccess&&!isBought&&starCores>=su.cost){starCores-=su.cost;purchasedStars.push(id);recalculateEps();drawConstellation();updateDisplay();}};
            container.appendChild(node);
        });
    });
}

// ══════════════════════════════════════════════════════════════
// ACHIEVEMENT CONSTELLATION  (10 clusters × 20 stars = 200)
// ══════════════════════════════════════════════════════════════
function drawAchievementConstellation() {
    const container=getEl('ach-constellation'); if(!container)return; container.innerHTML='';
    container.style.cssText='position:relative;width:100%;min-height:700px;background:radial-gradient(ellipse at 50% 50%,#030512,#00000f);border-radius:10px;overflow:hidden;';
    if(!document.getElementById('achkf')){const s=document.createElement('style');s.id='achkf';s.textContent=`@keyframes _achTw{0%,100%{opacity:var(--op);}50%{opacity:calc(var(--op)*0.08);}}@keyframes _achPulse{0%,100%{box-shadow:0 0 10px var(--ac),0 0 20px var(--ac)66;}50%{box-shadow:0 0 20px var(--ac),0 0 40px var(--ac);}}`;document.head.appendChild(s);}
    const NS='http://www.w3.org/2000/svg';
    const svg=document.createElementNS(NS,'svg');svg.setAttribute('width','100%');svg.setAttribute('height','100%');svg.style.cssText='position:absolute;top:0;left:0;pointer-events:none;z-index:1;overflow:visible;';
    const defs=document.createElementNS(NS,'defs');defs.innerHTML=`<filter id="ag"><feGaussianBlur stdDeviation="2" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter><filter id="agl"><feGaussianBlur stdDeviation="5" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>`;svg.appendChild(defs);
    // 120 bg stars
    for(let i=0;i<120;i++){const c=document.createElementNS(NS,'circle');const op=0.06+Math.random()*.4;c.setAttribute('cx',(1+Math.random()*98)+'%');c.setAttribute('cy',(1+Math.random()*98)+'%');c.setAttribute('r',0.2+Math.random()*1.1);c.setAttribute('fill','white');c.style.setProperty('--op',op);c.style.animation=`_achTw ${1+Math.random()*4}s ease-in-out ${Math.random()*3}s infinite`;svg.appendChild(c);}
    
    // Draw connections for each cluster
    Object.entries(ACH_CLUSTERS).forEach(([cat,cluster])=>{
        const catData=ACH_CATS[cat]; if(!catData)return;
        const col=catData.col;
        const achInCat=ACHIEVEMENTS.filter(a=>a.cat===cat);
        // Connect stars in order within cluster
        for(let i=0;i<cluster.stars.length-1;i++){
            const [ox1,oy1]=cluster.stars[i],[ox2,oy2]=cluster.stars[i+1];
            const x1=cluster.cx+ox1, y1=cluster.cy+oy1;
            const x2=cluster.cx+ox2, y2=cluster.cy+oy2;
            const a1=achInCat[i], a2=achInCat[i+1];
            const u1=a1&&unlockedAch.includes(a1.id), u2=a2&&unlockedAch.includes(a2.id), both=u1&&u2;
            if(both){const g=document.createElementNS(NS,'line');g.setAttribute('x1',x1+'%');g.setAttribute('y1',y1+'%');g.setAttribute('x2',x2+'%');g.setAttribute('y2',y2+'%');g.setAttribute('stroke',col);g.setAttribute('stroke-width','6');g.setAttribute('opacity','0.15');g.setAttribute('filter','url(#agl)');svg.appendChild(g);}
            const line=document.createElementNS(NS,'line');line.setAttribute('x1',x1+'%');line.setAttribute('y1',y1+'%');line.setAttribute('x2',x2+'%');line.setAttribute('y2',y2+'%');
            line.setAttribute('stroke',both?col:u1?col:'#0f1830');line.setAttribute('stroke-width',both?'1.5':'1');line.setAttribute('opacity',both?'0.8':u1?'0.4':'0.25');if(!both)line.setAttribute('stroke-dasharray','3,6');if(both)line.setAttribute('filter','url(#ag)');svg.appendChild(line);
        }
    });
    container.appendChild(svg);

    // Category labels
    Object.entries(ACH_CLUSTERS).forEach(([cat,cluster])=>{
        const catData=ACH_CATS[cat]; if(!catData)return;
        const col=catData.col;
        const lbl=document.createElement('div');
        const unlocked=ACHIEVEMENTS.filter(a=>a.cat===cat&&unlockedAch.includes(a.id)).length;
        lbl.style.cssText=`position:absolute;left:${cluster.cx}%;top:${cluster.cy}%;transform:translate(-50%,-340%);font-family:'Orbitron';font-size:.48rem;color:${col};text-shadow:0 0 8px ${col};white-space:nowrap;pointer-events:none;z-index:8;font-weight:700;letter-spacing:1px;text-align:center;`;
        lbl.innerHTML=`${catData.icon} ${catData.label}<br><span style="color:rgba(255,255,255,0.5)">${unlocked}/20</span>`;
        container.appendChild(lbl);
    });

    // Star nodes
    Object.entries(ACH_CLUSTERS).forEach(([cat,cluster])=>{
        const catData=ACH_CATS[cat]; if(!catData)return;
        const col=catData.col;
        const achInCat=ACHIEVEMENTS.filter(a=>a.cat===cat);
        cluster.stars.forEach(([ox,oy],i)=>{
            const ach=achInCat[i]; if(!ach)return;
            const x=cluster.cx+ox, y=cluster.cy+oy;
            const isUnlocked=unlockedAch.includes(ach.id)||ach.unlocked;
            const sz=isUnlocked?18:10;
            const node=document.createElement('div');
            node.style.cssText=`position:absolute;left:${x}%;top:${y}%;width:${sz}px;height:${sz}px;border-radius:50%;transform:translate(-50%,-50%);cursor:pointer;z-index:5;transition:transform .15s;display:flex;align-items:center;justify-content:center;`;
            if(isUnlocked){node.style.background=col;node.style.border='1.5px solid rgba(255,255,255,0.8)';node.style.setProperty('--ac',col);node.style.setProperty('--op','1');node.style.animation=`_achPulse ${1.5+Math.random()}s ease-in-out infinite`;node.innerHTML=`<span style="font-size:${5+Math.min(i,3)}px;color:#fff;pointer-events:none;">★</span>`;}
            else{node.style.background='#050a1a';node.style.border=`1px solid ${col}33`;}
            node.onmouseenter=()=>{node.style.transform='translate(-50%,-50%) scale(1.5)';if(getEl('ach-info-text'))getEl('ach-info-text').innerHTML=`<strong style="color:${col}">${ach.name}</strong>${isUnlocked?' ✓':''} — ${ach.desc}`;};
            node.onmouseleave=()=>node.style.transform='translate(-50%,-50%) scale(1)';
            container.appendChild(node);
        });
    });

    // Progress bar
    const total=unlockedAch.length;
    const prog=document.createElement('div');
    prog.style.cssText=`position:absolute;bottom:8px;left:50%;transform:translateX(-50%);width:60%;text-align:center;font-family:'Orbitron';font-size:.6rem;color:#64748b;z-index:10;`;
    prog.innerHTML=`<div style="height:3px;background:#0f1830;border-radius:2px;margin-bottom:4px;"><div style="height:100%;width:${(total/200*100).toFixed(1)}%;background:linear-gradient(90deg,#00f0ff,#b5179e);border-radius:2px;transition:width 1s;"></div></div>${total} / 200 Achievements`;
    container.appendChild(prog);
}

// ══════════════════════════════════════════════════════════════
// ANIMATED MAIN STARFIELD
// ══════════════════════════════════════════════════════════════
function initMainStarfield(){
    const cv=document.createElement('canvas'); cv.id='bg-sf';
    cv.style.cssText='position:fixed;top:0;left:0;width:100vw;height:100vh;pointer-events:none;z-index:0;opacity:0.55;';
    document.body.insertBefore(cv,document.body.firstChild);
    function resize(){cv.width=window.innerWidth;cv.height=window.innerHeight;} resize();
    window.addEventListener('resize',resize);
    const cx=cv.getContext('2d');
    const stars=Array.from({length:240},()=>({x:Math.random()*cv.width,y:Math.random()*cv.height,sz:0.2+Math.random()*1.5,base:0.08+Math.random()*.8,ph:Math.random()*Math.PI*2,sp:0.005+Math.random()*.025,vx:(Math.random()-.5)*.035,vy:(Math.random()-.5)*.035,col:Math.random()>.9?(Math.random()>.5?'#4cc9f0':'#ffb703'):'#ffffff'}));
    const shoots=[];let frame=0;
    function draw(){
        cx.clearRect(0,0,cv.width,cv.height);const t=performance.now()*.001;
        stars.forEach(s=>{s.x+=s.vx;s.y+=s.vy;if(s.x<0)s.x=cv.width;if(s.x>cv.width)s.x=0;if(s.y<0)s.y=cv.height;if(s.y>cv.height)s.y=0;const tw=0.2+0.8*Math.abs(Math.sin(t*s.sp*5+s.ph));cx.globalAlpha=s.base*tw;cx.fillStyle=s.col;if(s.sz>1){cx.shadowBlur=s.sz*2.5;cx.shadowColor=s.col;}cx.beginPath();cx.arc(s.x,s.y,s.sz,0,Math.PI*2);cx.fill();cx.shadowBlur=0;});
        frame++;if(frame%280===0&&Math.random()>.4)shoots.push({x:Math.random()*cv.width,y:Math.random()*cv.height*.4,vx:5+Math.random()*7,vy:2+Math.random()*4,alpha:1});
        shoots.forEach(s=>{cx.save();const g=cx.createLinearGradient(s.x-s.vx*12,s.y-s.vy*12,s.x,s.y);g.addColorStop(0,'transparent');g.addColorStop(1,'rgba(255,255,255,0.9)');cx.globalAlpha=s.alpha*.65;cx.strokeStyle=g;cx.lineWidth=1.5;cx.shadowBlur=10;cx.shadowColor='#fff';cx.beginPath();cx.moveTo(s.x-s.vx*12,s.y-s.vy*12);cx.lineTo(s.x,s.y);cx.stroke();cx.restore();s.x+=s.vx;s.y+=s.vy;s.alpha-=.012;});
        for(let i=shoots.length-1;i>=0;i--)if(shoots[i].alpha<=0)shoots.splice(i,1);
        cx.globalAlpha=1; requestAnimationFrame(draw);
    }
    draw();
}

// ══════════════════════════════════════════════════════════════
// SAVE / LOAD / RESET
// ══════════════════════════════════════════════════════════════

// ══════════════════════════════════════════════════════════════════
// TECH RENDER (type-colored badges)
// ══════════════════════════════════════════════════════════════════
function renderTechs(){
    const tl=getEl('dynamic-tech-list'); if(!tl)return; tl.innerHTML='';
    const typeColors={click_mult:'#00f0ff',eps_mult:'#ffb703',click_add:'#00ff88',eps_add:'#ff6b00'};
    const typeLabels={click_mult:'KLICK×',eps_mult:'EPS×',click_add:'KLICK+',eps_add:'EPS+flat'};
    let shown=0;
    for(let i=0;i<techs.length;i++){
        const t=techs[i]; if(t.purchased)continue;
        if(energy>=t.cost*0.05||shown<8){
            const col=typeColors[t.type]||'#94a3b8';
            const lbl=typeLabels[t.type]||t.type;
            const btn=document.createElement('button'); btn.className='tech-item'; btn.id=t.id;
            btn.innerHTML=`<div class="item-info">
                <span class="item-name">${t.name} <span style="font-size:.56rem;padding:1px 4px;border-radius:3px;background:${col}20;color:${col};border:1px solid ${col}40;">${lbl}</span></span>
                <span class="item-description">${t.desc}</span>
                <span class="item-cost">Kosten: ${formatNumbers(t.cost)}</span>
            </div>`;
            btn.onclick=()=>buyTechById(t.id); tl.appendChild(btn); shown++;
        }
        if(shown>=12)break;
    }
}

// ══════════════════════════════════════════════════════════════════
// STATS SCREEN
// ══════════════════════════════════════════════════════════════════
function updateStatsScreen(){
    const g=getEl('stats-grid'); if(!g)return; g.innerHTML='';
    const elapsed=totalPlayTime+Math.floor((Date.now()-sessionStartTime)/1000);
    const fmtTime=s=>{const d=Math.floor(s/86400),h=Math.floor((s%86400)/3600),m=Math.floor((s%3600)/60),sc=s%60;
        return d>0?`${d}T ${h}h ${m}m`:`${h}h ${m}m ${sc}s`;};
    const stats=[
        ['⚡ Gesamt-Klicks',    totalClicks.toLocaleString('de')],
        ['☀️ Gesamt-Energie',   formatNumbers(totalEnergy)],
        ['🎲 Gacha-Rolls',      totalRolls.toLocaleString('de')],
        ['♻️ Rebirths',         rebirthCount],
        ['🌍 Planeten gesamt',  inventory.length],
        ['⭐ Sternen-Kerne',    starCores],
        ['✨ Achievements',     `${unlockedAch.length}/200`],
        ['🔬 Techs gekauft',    `${techs.filter(t=>t.purchased).length}/1000`],
        ['🏗️ Gebäude gesamt',   buildings.reduce((s,b)=>s+b.amount,0)],
        ['💡 Klickkraft',       '×'+formatNumbers(calculateTotalClickPower())],
        ['⚙️ EPS',             formatNumbers(eps)+'/s'],
        ['⏰ Spielzeit',        fmtTime(elapsed)],
        ['🎯 Ziel',            '~30 Tage bis Omega-Status'],
    ];
    stats.forEach(([label,value])=>{
        const card=document.createElement('div'); card.className='stat-card';
        card.innerHTML=`<div class="stat-card-label">${label}</div><div class="stat-card-value">${value}</div>`;
        g.appendChild(card);
    });
}

// ══════════════════════════════════════════════════════════════════
// REBIRTH PLANET KEEPER (2 click + 2 building to keep)
// ══════════════════════════════════════════════════════════════════
let _keeperSel={click:[],building:[]};
function openKeeperScreen(){
    _keeperSel={click:[],building:[]};
    const ks=getEl('keeper-screen'); if(ks)ks.style.display='block';
    renderKeeperLists();
}
function renderKeeperLists(){
    ['click','building'].forEach(mode=>{
        const el=getEl(`keeper-${mode}-list`); if(!el)return; el.innerHTML='';
        const planets=[...inventory].filter(p=>(p.gachaType||'click')===mode)
            .sort((a,b)=>b.multiplier-a.multiplier);
        if(!planets.length){el.innerHTML=`<div style="color:#64748b;font-size:.7rem;padding:8px;">Keine Planeten</div>`;return;}
        planets.forEach(p=>{
            const card=document.createElement('div');
            const isSel=_keeperSel[mode].includes(p.instanceId);
            card.className='keeper-card'+(isSel?' keeper-selected':'');
            card.style.borderColor=isSel?'#00ff88':p.color;
            const grad=getPlanetGradient(p);
            const ms=p.multiplier>=1000?`×${formatNumbers(p.multiplier)}`:`×${p.multiplier.toFixed(2)}`;
            card.innerHTML=`<div style="width:22px;height:22px;border-radius:50%;background:${grad};box-shadow:0 0 5px ${p.color};"></div>
                <div style="font-size:.48rem;font-weight:bold;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;max-width:54px;">${p.name}</div>
                <div style="font-size:.58rem;color:${isSel?'#00ff88':'#94a3b8'};">${ms}</div>`;
            card.onclick=()=>{
                const sel=_keeperSel[mode];
                const idx=sel.indexOf(p.instanceId);
                if(idx>=0)sel.splice(idx,1);
                else if(sel.length<2)sel.push(p.instanceId);
                renderKeeperLists();
            };
            el.appendChild(card);
        });
    });
    if(getEl('keeper-count-click'))getEl('keeper-count-click').textContent=_keeperSel.click.length;
    if(getEl('keeper-count-building'))getEl('keeper-count-building').textContent=_keeperSel.building.length;
}
function confirmRebirth(){
    const gain=calculatePendingCores(); if(gain<=0)return;
    const keptIds=[..._keeperSel.click,..._keeperSel.building];
    const keptPlanets=inventory.filter(p=>keptIds.includes(p.instanceId));
    // Rebirth
    starCores+=gain; energy=0; eps=0; rebirthCount++;
    buildings.forEach((b,i)=>{b.amount=0;b.cost=buildingsData[i].baseCost;});
    techs.forEach(t=>t.purchased=false);
    // Reset costs
    Object.keys(bannerCosts).forEach(k=>bannerCosts[k]=BASE_BANNER_COSTS[k]);
    Object.keys(bannerCostsBuilding).forEach(k=>bannerCostsBuilding[k]=BASE_BANNER_COSTS_B[k]);
    inventory=keptPlanets;
    equippedPlanets=[null,null,null,null,null,null];
    // Auto-equip best kept
    ['click','building'].forEach((mode,mi)=>{
        const sl=mi===0?0:3;
        keptPlanets.filter(p=>(p.gachaType||'click')===mode)
            .sort((a,b)=>b.multiplier-a.multiplier)
            .slice(0,3).forEach((p,i)=>equippedPlanets[sl+i]=p);
    });
    if(getEl('keeper-screen'))getEl('keeper-screen').style.display='none';
    if(getEl('rebirth-screen'))getEl('rebirth-screen').style.display='none';
    recalculateEps(); saveGame(); updateInventoryUI(); updateEquipUI();
    buildGameUI(); updateDisplay(); checkAchievements();
    if(getEl('system-log'))getEl('system-log').textContent=`> Rebirth #${rebirthCount} | +${gain} Kerne | ${keptPlanets.length} Planeten behalten.`;
}

// ══════════════════════════════════════════════════════════════════
// GACHA MODE + BANNER DISPLAY EXTRAS
// ══════════════════════════════════════════════════════════════════
function updateDisplayExtras(){
    const costs=activeGachaMode==='building'?bannerCostsBuilding:bannerCosts;
    if(getEl('gacha-cost-display'))getEl('gacha-cost-display').textContent=formatNumbers(costs[activeBanner]);
    if(getEl('click-power-count'))getEl('click-power-count').textContent=formatNumbers(calculateTotalClickPower());
    if(getEl('star-cores-count'))getEl('star-cores-count').textContent=starCores;
    if(getEl('pending-cores'))getEl('pending-cores').textContent=calculatePendingCores();
    if(getEl('ach-count'))getEl('ach-count').textContent=`${unlockedAch.length}/200`;
    if(getEl('inventory-count'))getEl('inventory-count').textContent=inventory.length;
}

// ══════════════════════════════════════════════════════════════════
// SAVE / LOAD / RESET
// ══════════════════════════════════════════════════════════════════
// ══════════════════════════════════════════════════════════════════
// QUEST SYSTEM
// ══════════════════════════════════════════════════════════════════
const QUEST_TEMPLATES=[
    // Clicker quests
    {id:'q_click_100',  cat:'click', name:'Fingerwärmer',     desc:'Klicke 100 Mal.',          goal:()=>totalClicks>=100,       reward:{type:'energy',amount:()=>Math.max(5000,eps*30)},     icon:'👆'},
    {id:'q_click_500',  cat:'click', name:'Klick-Maschine',   desc:'Klicke 500 Mal.',          goal:()=>totalClicks>=500,       reward:{type:'energy',amount:()=>Math.max(50000,eps*60)},    icon:'👆'},
    {id:'q_click_2000', cat:'click', name:'Tausend-Finger',   desc:'Klicke 2.000 Mal.',        goal:()=>totalClicks>=2000,      reward:{type:'starcore',amount:()=>1},                       icon:'⚡'},
    {id:'q_click_10000',cat:'click', name:'Unendlicher Tap',  desc:'Klicke 10.000 Mal.',       goal:()=>totalClicks>=10000,     reward:{type:'starcore',amount:()=>3},                       icon:'⚡'},
    // Energy quests
    {id:'q_e_1m',   cat:'energy', name:'Erste Million',       desc:'Verdiene 1 Mio Energie.',  goal:()=>totalEnergy>=1e6,       reward:{type:'energy',amount:()=>Math.max(1e5,eps*60)},     icon:'☀️'},
    {id:'q_e_1b',   cat:'energy', name:'Milliardär',          desc:'Verdiene 1 Mrd Energie.',  goal:()=>totalEnergy>=1e9,       reward:{type:'energy',amount:()=>Math.max(1e7,eps*120)},    icon:'☀️'},
    {id:'q_e_1t',   cat:'energy', name:'Billionen-Reaktor',   desc:'Verdiene 1 Bio Energie.',  goal:()=>totalEnergy>=1e12,      reward:{type:'starcore',amount:()=>2},                      icon:'🌟'},
    {id:'q_e_1q',   cat:'energy', name:'Quadrillionär',       desc:'Verdiene 1 Qa Energie.',   goal:()=>totalEnergy>=1e15,      reward:{type:'starcore',amount:()=>5},                      icon:'🌟'},
    // Building quests
    {id:'q_b_10',   cat:'build',  name:'Bauleiter',           desc:'Kaufe 10 Gebäude.',         goal:()=>buildings.reduce((s,b)=>s+b.amount,0)>=10,   reward:{type:'energy',amount:()=>Math.max(1e4,eps*30)},  icon:'🏗️'},
    {id:'q_b_50',   cat:'build',  name:'Stadtplaner',         desc:'Kaufe 50 Gebäude.',         goal:()=>buildings.reduce((s,b)=>s+b.amount,0)>=50,   reward:{type:'energy',amount:()=>Math.max(5e5,eps*60)},  icon:'🏗️'},
    {id:'q_b_200',  cat:'build',  name:'Megakonzern',         desc:'Kaufe 200 Gebäude.',        goal:()=>buildings.reduce((s,b)=>s+b.amount,0)>=200,  reward:{type:'starcore',amount:()=>2},                   icon:'🏙️'},
    {id:'q_b_500',  cat:'build',  name:'Galaktischer Konzern',desc:'Kaufe 500 Gebäude.',        goal:()=>buildings.reduce((s,b)=>s+b.amount,0)>=500,  reward:{type:'starcore',amount:()=>5},                   icon:'🏙️'},
    // Tech quests
    {id:'q_t_5',    cat:'tech',   name:'Forscher',            desc:'Kaufe 5 Upgrades.',         goal:()=>techs.filter(t=>t.purchased).length>=5,      reward:{type:'energy',amount:()=>Math.max(2e4,eps*30)},  icon:'🔬'},
    {id:'q_t_20',   cat:'tech',   name:'Wissenschaftler',     desc:'Kaufe 20 Upgrades.',        goal:()=>techs.filter(t=>t.purchased).length>=20,     reward:{type:'energy',amount:()=>Math.max(5e6,eps*60)},  icon:'🔬'},
    {id:'q_t_100',  cat:'tech',   name:'Genie',               desc:'Kaufe 100 Upgrades.',       goal:()=>techs.filter(t=>t.purchased).length>=100,    reward:{type:'starcore',amount:()=>3},                   icon:'🧠'},
    {id:'q_t_500',  cat:'tech',   name:'Omniszient',          desc:'Kaufe 500 Upgrades.',       goal:()=>techs.filter(t=>t.purchased).length>=500,    reward:{type:'starcore',amount:()=>10},                  icon:'🧠'},
    // Gacha quests
    {id:'q_g_1',    cat:'gacha',  name:'Erster Kontakt',      desc:'Mache 1 Gacha-Roll.',       goal:()=>totalRolls>=1,          reward:{type:'energy',amount:()=>Math.max(5e4,eps*30)},     icon:'🎲'},
    {id:'q_g_10',   cat:'gacha',  name:'Planetenjäger',       desc:'Mache 10 Gacha-Rolls.',     goal:()=>totalRolls>=10,         reward:{type:'energy',amount:()=>Math.max(1e6,eps*60)},     icon:'🎲'},
    {id:'q_g_50',   cat:'gacha',  name:'Galaxissammler',      desc:'Mache 50 Gacha-Rolls.',     goal:()=>totalRolls>=50,         reward:{type:'starcore',amount:()=>2},                      icon:'🌌'},
    {id:'q_g_200',  cat:'gacha',  name:'Singularitätsjäger',  desc:'Mache 200 Gacha-Rolls.',    goal:()=>totalRolls>=200,        reward:{type:'starcore',amount:()=>8},                      icon:'🌌'},
    // Rebirth quests
    {id:'q_r_1',    cat:'rebirth',name:'Neugeboren',           desc:'Führe 1 Rebirth durch.',    goal:()=>rebirthCount>=1,        reward:{type:'starcore',amount:()=>5},                      icon:'♻️'},
    {id:'q_r_3',    cat:'rebirth',name:'Phönix',               desc:'Führe 3 Rebirths durch.',   goal:()=>rebirthCount>=3,        reward:{type:'starcore',amount:()=>15},                     icon:'🔥'},
    {id:'q_r_10',   cat:'rebirth',name:'Kosmischer Zyklus',    desc:'Führe 10 Rebirths durch.',  goal:()=>rebirthCount>=10,       reward:{type:'starcore',amount:()=>50},                     icon:'♾️'},
    // EPS quests
    {id:'q_eps_1k', cat:'eps',    name:'Reaktor online',       desc:'Erreiche 1.000 EPS.',       goal:()=>eps>=1000,              reward:{type:'energy',amount:()=>Math.max(5e4,eps*30)},     icon:'⚙️'},
    {id:'q_eps_1m', cat:'eps',    name:'Energiefabrik',        desc:'Erreiche 1 Mio EPS.',       goal:()=>eps>=1e6,               reward:{type:'energy',amount:()=>Math.max(1e7,eps*60)},     icon:'⚙️'},
    {id:'q_eps_1b', cat:'eps',    name:'Planeten-Reaktor',     desc:'Erreiche 1 Mrd EPS.',       goal:()=>eps>=1e9,               reward:{type:'starcore',amount:()=>3},                      icon:'⚡'},
    {id:'q_eps_1t', cat:'eps',    name:'Galaktischer Reaktor', desc:'Erreiche 1 Bio EPS.',       goal:()=>eps>=1e12,              reward:{type:'starcore',amount:()=>10},                     icon:'⚡'},
    // Fusion quests
    {id:'q_f_gold', cat:'fusion', name:'Goldschmied',          desc:'Erstelle einen Gold-Planeten.',   goal:()=>inventory.some(p=>p.fusionId==='gold'),    reward:{type:'starcore',amount:()=>2}, icon:'🌟'},
    {id:'q_f_rain', cat:'fusion', name:'Regenbogenjäger',      desc:'Erstelle einen Regenbogen-Planeten.', goal:()=>inventory.some(p=>p.fusionId==='rainbow'), reward:{type:'starcore',amount:()=>8}, icon:'🌈'},
    {id:'q_f_dark', cat:'fusion', name:'Dunkle Kunst',         desc:'Erstelle einen Dunkle-Materie-Planeten.', goal:()=>inventory.some(p=>p.fusionId==='darkmatter'), reward:{type:'starcore',amount:()=>25},icon:'🌑'},
];

const QUEST_CAT_COLS={click:'#00f0ff',energy:'#ffb703',build:'#ff6b00',tech:'#00ff88',gacha:'#ff00ff',rebirth:'#ff4444',eps:'#ff9500',fusion:'#ffd700'};

function generateDailyQuests(){
    // Pick 5 quests that haven't been permanently completed, weighted toward early ones
    const available=QUEST_TEMPLATES.filter(q=>!completedQuestIds.includes(q.id));
    const shuffled=[...available].sort(()=>Math.random()-.5);
    activeQuests=shuffled.slice(0,5).map(q=>({
        ...q,
        claimed:false,
        completed:false,
    }));
}

function checkQuests(){
    let anyNew=false;
    activeQuests.forEach(q=>{
        if(!q.completed&&q.goal()){q.completed=true;anyNew=true;}
    });
    if(anyNew){
        updateQuestUI();
        if(getEl('quest-notif'))getEl('quest-notif').style.display='block';
    }
}

function claimQuestReward(q){
    if(!q.completed||q.claimed)return;
    q.claimed=true;
    completedQuestIds.push(q.id);
    const amt=q.reward.amount();
    if(q.reward.type==='energy'){energy+=amt;totalEnergy+=amt;}
    else if(q.reward.type==='starcore')starCores+=amt;
    // Flash log
    if(getEl('system-log'))getEl('system-log').textContent=`> Quest "${q.name}" abgeschlossen! +${q.reward.type==='energy'?formatNumbers(amt)+' Energie':amt+' Sternen-Kern'+(amt!==1?'e':'')}`;
    // Check if all current quests done → refresh
    if(activeQuests.every(q2=>q2.claimed)){
        setTimeout(()=>{generateDailyQuests();updateQuestUI();},1500);
    }
    updateQuestUI(); updateDisplay(); updateDisplayExtras(); saveGame();
}

function updateQuestUI(){
    const c=getEl('quest-list'); if(!c)return;
    c.innerHTML='';
    // Hide notification dot if all visible
    const anyDone=activeQuests.some(q=>q.completed&&!q.claimed);
    if(getEl('quest-notif'))getEl('quest-notif').style.display=anyDone?'block':'none';

    activeQuests.forEach(q=>{
        const card=document.createElement('div'); card.className='quest-card'+(q.completed?' quest-done':'')+(q.claimed?' quest-claimed':'');
        const col=QUEST_CAT_COLS[q.cat]||'#94a3b8';
        const rwdStr=q.reward.type==='energy'?`+${formatNumbers(q.reward.amount())} Energie`:`+${q.reward.amount()} Sternen-Kern${q.reward.amount()!==1?'e':''}`;
        card.innerHTML=`
            <div class="quest-icon">${q.icon}</div>
            <div class="quest-info">
                <div class="quest-name" style="color:${col}">${q.name}</div>
                <div class="quest-desc">${q.desc}</div>
                <div class="quest-reward">🎁 ${rwdStr}</div>
            </div>
            <button class="quest-claim-btn" ${!q.completed||q.claimed?'disabled':''} onclick="claimQuestReward(window._quests[${activeQuests.indexOf(q)}])">
                ${q.claimed?'✅':q.completed?'ABHOLEN!':'...'}
            </button>`;
        c.appendChild(card);
    });
    // expose for onclick
    window._quests=activeQuests;
}

// ══════════════════════════════════════════════════════════════════
// OFFLINE PROGRESS
// ══════════════════════════════════════════════════════════════════
const MAX_OFFLINE_HOURS=12;

function calcOfflineGain(secondsAway){
    const capped=Math.min(secondsAway, MAX_OFFLINE_HOURS*3600);
    return eps*capped; // full EPS rate, capped at 12h
}

function showOfflineModal(secondsAway, gained){
    const h=Math.floor(secondsAway/3600), m=Math.floor((secondsAway%3600)/60), s=secondsAway%60;
    const timeStr=h>0?`${h}h ${m}m`:m>0?`${m}m ${s}s`:`${s}s`;
    const modal=document.createElement('div');
    modal.id='offline-modal';
    modal.style.cssText='position:fixed;inset:0;background:rgba(0,0,0,0.85);z-index:99999;display:flex;align-items:center;justify-content:center;';
    modal.innerHTML=`<div style="background:#0a0f1e;border:1px solid rgba(0,240,255,0.3);border-radius:16px;padding:28px 32px;max-width:380px;text-align:center;font-family:Orbitron,sans-serif;">
        <div style="font-size:2rem;margin-bottom:8px;">🌙</div>
        <div style="font-size:1rem;font-weight:900;color:#00f0ff;margin-bottom:6px;">WILLKOMMEN ZURÜCK!</div>
        <div style="font-size:.75rem;color:#94a3b8;margin-bottom:14px;">Du warst <b style="color:#e2e8f0">${timeStr}</b> weg.</div>
        <div style="background:rgba(0,240,255,0.06);border:1px solid rgba(0,240,255,0.2);border-radius:10px;padding:12px;margin-bottom:16px;">
            <div style="font-size:.7rem;color:#64748b;margin-bottom:4px;">OFFLINE-ERTRAG</div>
            <div style="font-size:1.4rem;font-weight:900;color:#ffb703;">+${formatNumbers(gained)}</div>
            <div style="font-size:.65rem;color:#64748b;">Energie (${MAX_OFFLINE_HOURS}h max)</div>
        </div>
        <button onclick="document.getElementById('offline-modal').remove()" style="font-family:Orbitron,sans-serif;font-weight:700;font-size:.75rem;padding:10px 24px;border-radius:8px;border:1px solid #00f0ff;background:rgba(0,240,255,0.1);color:#00f0ff;cursor:pointer;">EINSAMMELN ✨</button>
    </div>`;
    document.body.appendChild(modal);
}

function processOfflineProgress(){
    if(offlinePopupShown)return;
    offlinePopupShown=true;
    if(!lastSaveTimestamp||eps<=0)return;
    const secondsAway=Math.floor((Date.now()-lastSaveTimestamp)/1000);
    if(secondsAway<30)return; // less than 30s → skip
    const gained=calcOfflineGain(secondsAway);
    if(gained<=0)return;
    energy+=gained; totalEnergy+=gained;
    updateDisplay(); updateDisplayExtras();
    showOfflineModal(secondsAway, gained);
}

function saveGame(){
    totalPlayTime+=Math.floor((Date.now()-sessionStartTime)/1000);
    sessionStartTime=Date.now();
    lastSaveTimestamp=Date.now();
    try{localStorage.setItem('cosmic_v6',JSON.stringify({
        energy,starCores,purchasedStars,bannerCosts,bannerCostsBuilding,activeGachaMode,
        inventory,rebirthCount,totalClicks,totalEnergy,totalRolls,unlockedAch,totalPlayTime,
        lastSaveTimestamp,completedQuestIds,
        equippedPlanetsIds:equippedPlanets.map(p=>p?p.instanceId:null),
        buildingsAmounts:buildings.map(b=>b.amount),
        purchasedTechsIds:techs.filter(t=>t.purchased).map(t=>t.id)
    }));}catch(e){console.warn('Save failed',e);}
}
function loadGame(){
    // Wipe ALL old incompatible saves first
    ['cosmic_v4','cosmic_v5'].forEach(k=>localStorage.removeItem(k));
    const sd=localStorage.getItem('cosmic_v6');
    if(!sd)return;
    try{
        const s=JSON.parse(sd);
        if(!s||typeof s!=='object')throw new Error('bad save');
        // Only load simple numeric/string fields — never trust arrays blindly
        if(typeof s.energy==='number'&&isFinite(s.energy))energy=s.energy;
        if(typeof s.starCores==='number'&&isFinite(s.starCores))starCores=s.starCores;
        if(typeof s.rebirthCount==='number')rebirthCount=s.rebirthCount;
        if(typeof s.totalClicks==='number')totalClicks=s.totalClicks;
        if(typeof s.totalEnergy==='number')totalEnergy=s.totalEnergy;
        if(typeof s.totalRolls==='number')totalRolls=s.totalRolls;
        if(typeof s.totalPlayTime==='number')totalPlayTime=s.totalPlayTime;
        if(typeof s.lastSaveTimestamp==='number')lastSaveTimestamp=s.lastSaveTimestamp;
        if(Array.isArray(s.completedQuestIds))completedQuestIds=s.completedQuestIds.filter(x=>typeof x==='string');
        if(s.activeGachaMode==='click'||s.activeGachaMode==='building')activeGachaMode=s.activeGachaMode;
        if(Array.isArray(s.purchasedStars))purchasedStars=s.purchasedStars.filter(x=>typeof x==='string');
        if(Array.isArray(s.unlockedAch)){
            unlockedAch=s.unlockedAch.filter(x=>typeof x==='string');
            unlockedAch.forEach(id=>{const a=ACHIEVEMENTS.find(x=>x.id===id);if(a)a.unlocked=true;});
        }
        if(s.bannerCosts&&typeof s.bannerCosts==='object')
            [1,2,3,4,5,6].forEach(k=>{if(typeof s.bannerCosts[k]==='number')bannerCosts[k]=s.bannerCosts[k];});
        if(s.bannerCostsBuilding&&typeof s.bannerCostsBuilding==='object')
            [1,2,3,4,5,6].forEach(k=>{if(typeof s.bannerCostsBuilding[k]==='number')bannerCostsBuilding[k]=s.bannerCostsBuilding[k];});
        if(Array.isArray(s.inventory))
            inventory=s.inventory.filter(p=>p&&typeof p==='object'&&p.id&&p.multiplier)
                .map(p=>({...p,gachaType:p.gachaType==='building'?'building':'click',isFusion:!!p.isFusion,fusionId:p.fusionId||null}));
        if(Array.isArray(s.buildingsAmounts))
            s.buildingsAmounts.forEach((a,i)=>{if(buildings[i]&&typeof a==='number'&&a>=0){buildings[i].amount=a;buildings[i].cost=Math.round(buildingsData[i].baseCost*Math.pow(1.48,a));}});
        if(Array.isArray(s.purchasedTechsIds))
            techs.forEach(t=>{t.purchased=Array.isArray(s.purchasedTechsIds)&&s.purchasedTechsIds.includes(t.id);});
        if(Array.isArray(s.equippedPlanetsIds))
            s.equippedPlanetsIds.forEach((id,i)=>{
                if(id&&i<6){const f=inventory.find(p=>p&&p.instanceId===id);if(f)equippedPlanets[i]=f;}
            });
        recalculateEps();
    }catch(e){
        console.warn('Savefile corrupt, resetting:',e);
        localStorage.removeItem('cosmic_v6');
    }
}
function hardReset(){
    if(confirm('WIRKLICH ALLES LÖSCHEN?\n\nDies löscht deinen gesamten Spielfortschritt unwiderruflich!')){
        ['cosmic_v6','cosmic_v5','cosmic_v4'].forEach(k=>localStorage.removeItem(k));
        location.reload();
    }
}

// ══════════════════════════════════════════════════════════════════
// INIT
// ══════════════════════════════════════════════════════════════════
document.addEventListener('DOMContentLoaded',()=>{
    initMainStarfield();
    loadGame(); buildGameUI(); switchBanner(1); updateDisplay(); updateDisplayExtras();

    // Generate quests (after load so completedQuestIds is known)
    generateDailyQuests(); updateQuestUI();

    // Offline progress (after load so eps and lastSaveTimestamp are set)
    setTimeout(()=>processOfflineProgress(), 500);

    // Quest modal
    if(getEl('open-quest-btn'))getEl('open-quest-btn').onclick=()=>{
        if(getEl('quest-screen'))getEl('quest-screen').style.display='block';
        updateQuestUI();
    };
    if(getEl('close-quest-btn'))getEl('close-quest-btn').onclick=()=>{if(getEl('quest-screen'))getEl('quest-screen').style.display='none';};

    // Planet click — with anti-autoclicker protection
    const pb=getEl('planet-btn');
    if(pb){
        // Track click timing for cheat detection
        let _clickTimes=[];
        let _blockedUntil=0;
        let _warnCount=0;

        pb.addEventListener('click',(e)=>{
            const now=Date.now();

            // If currently blocked, ignore
            if(now<_blockedUntil){
                if(getEl('system-log'))getEl('system-log').textContent='> ⚠️ Anomalie erkannt. Reaktor kühlt ab...';
                return;
            }

            // Record click
            _clickTimes.push(now);
            // Keep only last 20 clicks
            if(_clickTimes.length>20)_clickTimes.shift();

            // Check 1: Too many clicks too fast (>15 per second = suspicious)
            const windowMs=1000;
            const recent=_clickTimes.filter(t=>now-t<windowMs);
            if(recent.length>15){
                _warnCount++;
                _blockedUntil=now+(_warnCount*3000); // block longer each time
                if(getEl('system-log'))getEl('system-log').textContent=`> ⚠️ Reaktor-Überhitzung! Abkühlung: ${_warnCount*3}s`;
                return;
            }

            // Check 2: Suspiciously regular interval (bot-like precision)
            if(_clickTimes.length>=8){
                const intervals=[];
                for(let i=1;i<_clickTimes.length;i++)intervals.push(_clickTimes[i]-_clickTimes[i-1]);
                const avg=intervals.reduce((a,b)=>a+b,0)/intervals.length;
                const variance=intervals.reduce((s,v)=>s+Math.pow(v-avg,2),0)/intervals.length;
                // Real humans have variance >500ms², bots are often <100ms²
                if(avg<80&&variance<200){
                    _warnCount++;
                    _blockedUntil=now+(_warnCount*5000);
                    if(getEl('system-log'))getEl('system-log').textContent=`> ⚠️ Mechanisches Muster erkannt! Cooldown: ${_warnCount*5}s`;
                    return;
                }
            }

            // Check 3: Click must come from real pointer event (isTrusted)
            if(!e.isTrusted){
                if(getEl('system-log'))getEl('system-log').textContent='> ⚠️ Simulierter Klick blockiert.';
                return;
            }

            // Legit click — process normally
            const cp=calculateTotalClickPower();
            energy+=cp; totalClicks++; totalEnergy+=cp;
            createClickParticle(e); updateDisplay(); updateDisplayExtras();
            if(totalClicks%200===0)checkAchievements();
            checkQuests();
        });
    }

    // Stats screen
    if(getEl('open-stats-btn'))getEl('open-stats-btn').onclick=()=>{
        if(getEl('stats-screen'))getEl('stats-screen').style.display='block';
        updateStatsScreen();
    };
    if(getEl('close-stats-btn'))getEl('close-stats-btn').onclick=()=>{if(getEl('stats-screen'))getEl('stats-screen').style.display='none';};
    if(getEl('hard-reset-btn'))getEl('hard-reset-btn').onclick=hardReset;

    // Rebirth
    if(getEl('open-rebirth-btn'))getEl('open-rebirth-btn').onclick=()=>{
        if(getEl('rebirth-screen'))getEl('rebirth-screen').style.display='block';
        drawConstellation(); updateDisplayExtras();
    };
    if(getEl('close-rebirth-btn'))getEl('close-rebirth-btn').onclick=()=>{if(getEl('rebirth-screen'))getEl('rebirth-screen').style.display='none';};
    if(getEl('trigger-rebirth-btn'))getEl('trigger-rebirth-btn').onclick=()=>{
        if(calculatePendingCores()<=0){
            if(getEl('system-log'))getEl('system-log').textContent='> Nicht genug Energie für Rebirth!';
            return;
        }
        openKeeperScreen();
    };
    if(getEl('keeper-confirm-btn'))getEl('keeper-confirm-btn').onclick=confirmRebirth;

    // Gacha
    if(getEl('open-gacha-btn'))getEl('open-gacha-btn').onclick=()=>{
        if(getEl('gacha-screen'))getEl('gacha-screen').style.display='block';
        updateInventoryUI(); updateEquipUI(); updateDisplayExtras();
    };
    if(getEl('close-gacha-btn'))getEl('close-gacha-btn').onclick=()=>{if(getEl('gacha-screen'))getEl('gacha-screen').style.display='none';};
    if(getEl('roll-gacha-btn'))getEl('roll-gacha-btn').onclick=rollPlanet;

    // Sort button: cycle through sort modes
    if(getEl('sort-inv-btn'))getEl('sort-inv-btn').onclick=()=>{
        const modes=['rarity','mult','name'];
        inventorySort=modes[(modes.indexOf(inventorySort)+1)%modes.length];
        updateInventoryUI();
    };
    // Fusion mode toggle
    if(getEl('fusion-mode-btn'))getEl('fusion-mode-btn').onclick=toggleFusionMode;

    // Gacha mode tabs
    document.querySelectorAll('.gacha-mode-tab').forEach(tab=>{
        tab.onclick=()=>{
            activeGachaMode=tab.getAttribute('data-mode');
            document.querySelectorAll('.gacha-mode-tab').forEach(t=>t.classList.remove('mode-active'));
            tab.classList.add('mode-active');
            updateInventoryUI(); updateEquipUI(); updateDisplayExtras();
        };
    });

    // Achievements
    if(getEl('open-ach-btn'))getEl('open-ach-btn').onclick=()=>{
        if(getEl('ach-screen'))getEl('ach-screen').style.display='block';
        drawAchievementConstellation();
    };
    if(getEl('close-ach-btn'))getEl('close-ach-btn').onclick=()=>{if(getEl('ach-screen'))getEl('ach-screen').style.display='none';};

    // Banner tabs
    document.querySelectorAll('.banner-tab').forEach(tab=>{
        tab.onclick=e=>switchBanner(e.target.getAttribute('data-banner'));
    });

    // Star upgrades (rebirth constellation)
    document.addEventListener('click',e=>{
        if(e.target.classList.contains('star-node')){
            const id=e.target.getAttribute('data-id');
            const su=starUpgrades[id]; if(!su)return;
            if(purchasedStars.includes(id))return;
            if(su.parentId&&!purchasedStars.includes(su.parentId))return;
            if(su.requireRebirth&&rebirthCount<su.requireRebirth)return;
            if(starCores>=su.cost){
                starCores-=su.cost; purchasedStars.push(id);
                recalculateEps(); updateDisplay(); updateDisplayExtras();
                drawConstellation(); saveGame();
            }
        }
    });

    // Tooltip for stars
    document.addEventListener('mouseover',e=>{
        if(e.target.classList.contains('star-node')){
            const id=e.target.getAttribute('data-id'); const su=starUpgrades[id]; if(!su)return;
            const locked=su.requireRebirth&&rebirthCount<su.requireRebirth;
            const box=getEl('star-info-box');
            if(box){const t=getEl('star-info-text');
                if(t)t.innerHTML=`<b style="color:${su.col}">${su.name}</b> — ${su.desc}<br>Kosten: ${su.cost} Kern${su.cost!==1?'e':''}`+(locked?` <span style="color:#ef4444">(Braucht ${su.requireRebirth} Rebirths)</span>`:'')+(purchasedStars.includes(id)?` <span style="color:#00ff88">✅ Gekauft</span>`:'');
            }
        }
    });
    document.addEventListener('mouseover',e=>{
        if(e.target.classList.contains('ach-star')){
            const id=e.target.getAttribute('data-id');
            const ach=ACHIEVEMENTS.find(a=>a.id===id); if(!ach)return;
            const box=getEl('ach-info-box');
            if(box){const t=getEl('ach-info-text');
                if(t)t.innerHTML=`<b style="color:${ACH_CATS[ach.cat]?.col||'#fff'}">${ach.name}</b><br>${ach.desc}`+(ach.unlocked?` <span style="color:#00ff88">✅</span>`:'');
            }
        }
    });

    // Game loop (1s EPS tick)
    setInterval(()=>{
        if(eps>0){energy+=eps; totalEnergy+=eps;}
        updateDisplay(); updateDisplayExtras();
    },1000);

    // Save + achievement + quest check (every 4s)
    setInterval(()=>{
        saveGame(); checkAchievements(); checkQuests();
    },4000);
});
