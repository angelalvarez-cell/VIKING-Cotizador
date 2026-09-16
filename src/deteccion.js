import { VEHICLE_META } from "./vehiculos_meta.js";
// Autodetección coche vs camioneta para el catálogo base GAV.
// Regla: TRUCK_WORDS se evalúa primero (gana camioneta), luego CAR_WORDS; sin coincidencia → camioneta.
// Las palabras con espacio final ("x5 ", "q5 ", "gx ") sólo casan como palabra completa; las con espacio inicial (" urus") sólo al inicio de palabra.

const TRUCK_WORDS = [
  "escalade","suburban","tahoe","yukon","sierra","silverado","colorado","canyon","hummer","cayenne","macan"," urus","bentayga","dbx",
  "purosangue","levante","grecale","range rover","defender","discovery","velar","evoque","grenadier","gla","glb","glc","gle","gls",
  "g 500","g 550","g 63","g-class","eqb","eqc","eqe suv","eqs suv","sq5","sq7","sq8","rs q","mdx","rdx",
  "explorer","expedition","bronco","escape","edge","maverick","f-150","f-250","ranger","f150","f250","tahoe","traverse","blazer",
  "trax","trailblazer","equinox","captiva","cr-v","crv","hr-v","hrv","pilot","passport","ridgeline","tucson","santa fe","palisade",
  "creta","kona","rogue","murano","pathfinder","armada","kicks","x-trail","frontier","np300","rav4","highlander","4runner","sequoia",
  "tacoma","tundra","land cruiser","prado","sienna","hilux","cx-3","cx-30","cx-5","cx-50","cx-60","cx-90","cx3","cx30",
  "cx5","cx50","cx90","tiguan","teramont","taos","touareg","atlas","t-roc","amarok","t-cross","compass","cherokee","wrangler",
  "gladiator","commander","wagoneer","grand cherokee","telluride","sorento","sportage","seltos","carnival","ev6","stonic","niro","xc40","xc60",
  "xc90","c40","ex30","ex90","outback","forester","ascent","crosstrek","outlander","montero","eclipse cross","l200","model x","model y",
  "cybertruck","r1s","r1t","grand wagoneer","navigator","aviator","corsair","nautilus","enclave","envision","lyriq","xt4","xt5","xt6",
  "acadia","terrain","ateca","tarraco","arona","formentor","tavascan","kodiaq","karoq","atto","tang ev","song","yuan","seal u",
  "shark","grenadier","jimny","vitara","s-cross","bronco","eletre","dbx","gv70","gv80","g70 shooting","qx50","qx55","qx60",
  "qx80","i-pace","e-pace","f-pace","ds7","ds3","duster","koleos","kardian","captur","grand vitara","rx5","hs","zs ev",
  "mg5 wagon","outlander","l200","npr","hiace","transit","sprinter","crafter","express","savana","jetour","g700","t2 i-dm","soueast",
  "s06 i-dm","s07","s08 i-dm","s09","cityray","corolla cross","5008","gv60","gs3","gs8","emkoo","emzoom","500x","500l",
  "tank","mach-e","s10","s05","cs15","cs35","cs55","cs75","cs85","cs95","cx-70","cx70","cx-80","cx-9",
  "cx9","bt-50","tribute","mpv","tiggo","haval","poer","aion y","aion v","hyptec","cullinan","ex40","ec40","xc70",
  "countryman","paceman","aceman","zr-v","br-v","odyssey","avanza","raize","c-hr","venza","rush","innova","fortuner","fj",
  "juke","xterra","terrano","patrol","titan","urvan","estacas","d21","d22","pickup","sei","frison","bj40","bj60",
  "x55","x35","mage","huge","rich","d-max","mu-x","trooper","rodeo","amigo","tunland","gratour","view","toano",
  "vigus","grand avenue","#1","#3","#5","h1","h2","h3","ds 3","ds 7","crossback","a390","lm002","srx",
  "mark lt","mkx","mkc","mkt","blackwood","aztek","torrent","zdx","slx","sedona","mohave","borrego","veracruz","terracan",
  "h-1","starex","ix35","santa cruz","fx","ex35","ex37","jx35","qx70","crosstour","brat","baja","tribeca","pajero",
  "endeavor","nativa","raider","samurai","sidekick","apv","xl7","carry","cj-5","cj-7","cj-8","comanche","liberty","patriot",
  "j10","willys","series i","freelander","lr3","lr4","lwb","combi","touran","sharan","transporter","caddy","crossfox","routan",
  "eurovan","alhambra","ducato","doblò","doblo","fiorino","pulse","fastback","expert","traveller","boxer","trafic","kangoo","master",
  "alaskan","voyager","town","aspen","journey","nitro","dakota","ramcharger","durango","avalanche","cheyenne","luv","c10","tornado",
  "astro","syclone","typhoon","jimmy","envoy","lobo","f-100","f100","courier","ecosport","windstar","freestar","excursion","econoline",
  "ml","r 500","vito","viano","gl 450","gl 500","gl 550","glk","g 300","g 55","6x6","g-wagen","promaster","power wagon",
  "rebel","e-tron suv","sq6","v-class","clase v","clase g","glory","b10","c10","3 suv","ram 1500","ram 2500","ram 3500","strada ","toro ","element ","x1 ","x2 ","x3 ","x4 ",
  "x5 ","x6 ","x7 ","q2 ","q3 ","q4 ","q5 ","q6 ","q7 ","q8 ","gx ","ux","nx 250","nx 300",
  "nx 350","nx 450","rx 300","rx 350","rx 450","rx 500","lx 570","lx 600","gx 460","gx 550","tx 350","tx 500","tx 550","mx-30",
  "mx30","ariya","nv350","ichi","meriva","zafira","hhr","uplander","bolt euv","f-350","f350","lightning","sport trac","kuga",
  "prologue","staria","h100","ioniq 9","ev3","ev5","sonet","k3 cross","buzz","sportvan","allspace","boreal","arkana","scénic",
  "scenic","manager","grandis","solterra","ix1","ix2","ix3","active tourer","metris","g 580","optiq","vistiq","escalade iq","marvel",
  "rx9","es5","zs","sealion","wingle","okavango","galaxy","ex5","uni-t","uni-s","uni-k","e07","gs4","box 007",
  "7gt","e30x","recon","avenger (ev)","junior","promaster city","mountaineer","villager","encore gx","buick encore","eqa","suv","clase x","x 250",
  "x 350","lm ","gravity","polestar 3","polestar 4","xb7","widestar","rocket edition","(g 63)","r2 ","r3 ","iql","hummer ev","3x",
  "wagoneer s","mammoth","velociraptor","pacifica","trackhawk","gladiator mojave","ev9","2008","3008","4008","ram 1200","ram 700"];

const CAR_WORDS = [
  "t03","595",
  "sedan","sedán","coupe","coupé","cabrio","cabriolet","spider","spyder","roadster","convertible","hatch","liftback","a1","a3",
  "a4","a5","a6","a7","a8","s3","s4","s5","s6","s7","s8","rs3","rs5","rs6",
  "rs7","r8","tt","218","220","228","230","235","240","320","330","340","430","440",
  "520","530","540","550","730","740","750","m2","m3","m4","m5","m8","m235","m240",
  "m340","m440","m550","i4","i5","i7","z4","serie","ct4","ct5","cts","ats","camaro","corvette",
  "malibu","onix","aveo","spark","cavalier","attitude","charger","challenger","dart","neon","california","portofino","roma","296",
  "f8","812","gtc4","sf90","daytona","ff","500","mustang","model a","fiesta","focus","fusion","gt350","gt500",
  "cobra","g70","g80","g90","stinger","accord","civic","city","fit","insight","integra","tlx","elantra","sonata",
  "accent","ioniq 5","ioniq 6","verna","q50","q60","e-type","f-type","xf","xj","xe","i-pace","diablo","aventador",
  "gallardo","murciélago","murcielago","huracán","huracan","countach","revuelto","is ","es ","lc ","ls ","rc ","gs ","is3",
  "is2","es3","es2","ghibli","quattroporte","mc20","granturismo","grancabrio","190 sl","300 sl","clase a","clase c","clase e","clase s",
  "a 35","a 45","a 200","a 250","c 200","c 300","c 43","c 63","cla","cle","cls","e 200","e 350","e 450",
  "e 53","e 63","s 450","s 500","s 580","sl 43","sl 55","sl 63","sl 500","sl 550","slc","amg gt","gt 43","gt 53",
  "gt 63","mazda2","mazda3","mazda6","mx-5","miata","540c","570s","570gt","600lt","620r","720s","750s","765lt",
  "artura","senna","speedtail","elva","p1","cooper","clubman","mini classic","elise","exige","evora","emira","emeya","evija",
  "altima","sentra","versa","maxima","leaf","718","911","356","912","930","944","968","928","panamera",
  "taycan","clio","mégane","megane","logan","sandero","wrx","brz","impreza","legacy","wrx sti","swift","ciaz","baleno",
  "model 3","model s","fiat 500","sp coupe","healey","camry","corolla","gr86","gr supra","prius","yaris","avalon","86","golf",
  "jetta","passat","polo","virtus","vento","alsvin","eado","s60","s90","v60","mg5","march","rio","forte",
  "k3","k5","k4","argo","emgrand","o5","grand i10","208","408","gt-r","giulia","db11","db12","dbs",
  "vantage","vanquish","continental gt","flying spur","ghost","phantom","wraith","dawn","spectre","mg3","mg4","mg7","cyberster","kwid",
  "stepway","g90","temerario","empow","dolphin","han","seal","king","león","leon","ibiza","cordoba","toledo","exeo",
  "mii","born","ignis","mobi","ora","001","nsx","rsx","tsx","legend","tl","rl","gtv","giulietta",
  "4c","8c","montreal","alfetta","duetto","sprint","156","159","brera","mito","db4","db5","db6","db7",
  "db9","virage","rapide","one-77","vulcan","valkyrie","valhalla","valour","lagonda","quattro","rs2","rs4","s2","a2",
  "100 coup","v8","sprite","1275","a35","a40","princess","allegro","3000","continental","turbo r","brooklands","arnage","azure",
  "mulsanne","bacalar","batur","s1","r type","mark vi","2002","csl","cs","e30","e36","e46","e39","e60",
  "e92","635","850","z1","z3","z8","m1","i8","1m","135","m6","isetta","riviera","grand national",
  "gnx","regal","lacrosse","skylark","electra","park avenue","century","verano","reatta","eldorado","deville","fleetwood","seville","brougham",
  "allant","blackwing","ct6","xlr","sts","dts","celestiq","chevy","monza","sonic","beat","astra","cruze","vectra",
  "corsa","optra","cutlass","bel air","impala","chevelle","el camino","nova","caprice","monte carlo","300c","300m","300","crossfire",
  "pt cruiser","cirrus","sebring","shadow","spirit","lebaron","new yorker","imperial","viper","super bee","coronet","valiant","polara","monaco",
  "magnum","stealth","stratus","avenger","caliber","intrepid","250","275","330 gtc","365","dino","308","328","348",
  "mondial","400i","412","testarossa","512","f40","f50","f355","355","360","f430","458","488","enzo",
  "laferrari","599","612","456","575","f12","competizione","speciale","pista","scuderia","124","abarth","695","uno",
  "palio","panda","punto","bravo","linea","siena","x1/9","boss","mach 1","thunderbird","gt40","gt (","falcon","fairlane",
  "galaxie","torino","ltd","grand marquis","crown victoria","taurus","fairmont","topaz","ghia","ikon","ka hatch","escort","cortina","mondeo",
  "contour","probe","festiva","aion es","shooting brake","s2000","prelude","crx","del sol","genesis coupe","veloster","tiburon","azera","equus",
  "i20","i30","atos","getz","g35","g37","m35","m45","j30","i35","q70","q45","q40","q30",
  "xk","xjs","xj220","d-type","c-type","mark 2","s-type","x-type","optima","k900","cadenza","amanti","spectra","cerato",
  "350 gt","400 gt","miura","espada","islero","jarama","urraco","silhouette","jalpa","reventón","reventon","sesto","veneno","centenario",
  "sián","sian","essenza","lfa","sc ","is f","rc f","gs f","mark ii","mark v","town car","zephyr","mkz","mks",
  "esprit","elan","europa","seven","carlton","eleven","3500 gt","bora","merak","khamsin","indy","biturbo","shamal","mc12",
  "57","62","s 680","rx-7","rx-8","cosmo","mx-3","mx-6","323","626","929","proteg","millenia","f1",
  "mp4","12c","650s","675lt","solus","w1","sls","slr","clk","black series","amg one","e 55","c 32","c 36",
  "sl 65","280 sl","230 sl","250 sl","560","500 e","190 e","300 sel","slk","s 65","mgb","mga","mgc","midget",
  "mg td","mg tf","mgf","rv8","lancer","evolution","3000gt","eclipse","starion","mirage","galant","tsuru","tsubame","b13",
  "skyline","silvia","300zx","350z","370z","z nismo","note","micra","platina","tiida","aprio","205","206","207",
  "306","307","405","406","504","505","508","rcz","301","959","carrera","918","914","924",
  "boxster","cayman","r5","renault 5","r12","twingo","fluence","r.s.","laguna","safrane","scala","symbol","silver","corniche",
  "camargue","super snake","series 1","svx","22b","xt","kizashi","sx4","cappuccino","supra","celica","ae86","mr2","2000gt",
  "tercel","crown","mirai","vocho","karmann","safari","brasilia","caribe","atlantic","corsar","pointer","derby","beetle","scirocco",
  "corrado","phaeton","eos","gol","lupo","fox","clásico","clasico","p1800","amazon","pv544","940","960","c70",
  "v70","s40","v40","s80","c30","c8","c12","laviolette","aileron","preliator","zagato","zonda","huayra","utopia",
  "imola","eb110","veyron","chiron","divo","centodieci","voiture","mistral","bolide","tourbillon","type 57","cc8s","ccr","ccx",
  "agera","one:1","regera","jesko","gemera","cc850","plus four","plus six","plus 8","super 3","3 wheeler","aero 8","aero gt","pantera",
  "mangusta","longchamp","deauville","p72","p900","a110","a290","delta","stratos","037","fulvia","beta","thema","aurelia",
  "flaminia","ypsilon","dmc","2cv","ds 21","ds 23","sm","traction","cx","méhari","mehari","ds 4","ds 9","tr3",
  "tr4","tr6","tr7","tr8","spitfire","stag","gt6","herald","dolomite","240z","260z","280z","280zx","510",
  "bluebird","fairlady","1600","b210","sunny","firebird","trans am","gto","fiero","solstice","grand prix","grand am","bonneville","catalina",
  "sunfire","g8","matiz","442","toronado","delta 88","aurora","98","alero","barracuda","cuda","road runner","superbird","fury",
  "gtx","prowler","satellite","belvedere","laser","volare","rambler","javelin","amx","pacer","gremlin","lerma","matador","isabella",
  "p100","900","9-3","9-5","96","99","fortwo","forfour","mxt","05","mx2","mx3","e10x","ej7",
  "j7","u5","d50","box","shine","e70","gt","-class","eqe","eqs","e-tron gt","volante","speedster","aperta",
  "cielo","cascada","wind","superamerica","targa","barchetta","floride","caravelle","s660","sunliner","skyliner","ssr","vitesse","drophead",
  "v-drive","200sx","lucino","bolt ev","epica","figo","cougar","mustang ii","prius c","gr corolla","gr yaris","i10","vision","concorde",
  "le baron","200","zoe","r18","alliance","e-208","500e","i3","118i","120i","m135i","228i","serie 1","a 35 sedan",
  "a6 e-tron","arrizo","preface","geometry","uni-v","lamore","l07","aion ut","nammi","sable","mystique","marauder","leon vz","león vz",
  "cronos","encore (renault)","pullman","avant","sportstourer","air","polestar 1","polestar 2","polestar 5","nevera","concept one","battista","t.50","t.33",
  "b3","b4","b5","b7","b8","(gt 63)","(c 43)","droptail","boat tail","12cilindri","f80","monza sp","gullwing","w123",
  "280e","280 se","sl 73","m635","e28","e34","chaser","jzx","mcpura","sl 680","gtd","sixpack","hellcat","demon",
  "stradale","33 stradale","sl ","760","m760","02","03","venom","exorcist","ctr","scr","rt12","yellowbird","gti",
  "gts","up!","project 7","project 8","gta","gtam","bullitt","stirling","dtm","1le","grand sport","wrx ts","brz ts","s209",
  "type ra","300s","gxp","ws6","code red","profilée","profilee","air ","s 63","s 55"];

export function detectTipo(model){
  if(!model) return null;
  const m=" "+model.toLowerCase()+" ";
  // 1) Camioneta explícita gana (evita falsos positivos como Escalade→ES)
  for(const w of TRUCK_WORDS){ if(m.includes(" "+w) || m.includes(w+" ") || m.includes(" "+w+" ")) return "camioneta"; }
  // 2) Señal de coche
  for(const w of CAR_WORDS){ if(m.includes(" "+w) || m.includes(w+" ") || m.includes(" "+w+" ")) return "coche"; }
  // 3) Por defecto, camioneta (la mayoría del catálogo Viking)
  return "camioneta";
}

export { TRUCK_WORDS, CAR_WORDS };

// Tipo canónico. Consulta VEHICLE_META (curada) y sólo cae a la heurística para nombres nuevos.
// La búsqueda normaliza espacios, mayúsculas y acentos, para que un espacio de más no pierda la corrección.
// Devuelve null cuando el tipo debe elegirlo el asesor (marca/modelo "Otro"): NO asumir camioneta.
const _norm = s => String(s ?? "").normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/\s+/g, " ").trim().toLowerCase();
const _INDICE = (() => {
  const ix = new Map();
  for (const k in VEHICLE_META) {
    const [b, ...rest] = k.split("|");
    ix.set(_norm(b) + "|" + _norm(rest.join("|")), VEHICLE_META[k]);
  }
  return ix;
})();

export function metaDe(brand, model) {
  return _INDICE.get(_norm(brand) + "|" + _norm(model)) || null;
}

export function tipoDe(brand, model) {
  if (_norm(brand) === "otro" || _norm(model) === "otro modelo") return null;
  const meta = metaDe(brand, model);
  if (meta) return meta.tipo;
  if (!model) return null;
  return detectTipo(model);
}

export function carroceriaDe(brand, model) {
  const meta = metaDe(brand, model);
  return meta ? meta.carroceria : null;
}
