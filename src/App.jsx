import { useState, useEffect } from "react";

// ════════════════════════════════════════════════════════════════════
//  COTIZADOR VIKING BY GAV — versión producción
//  Las imágenes van en /public/img/ y se llaman por ruta local.
// ════════════════════════════════════════════════════════════════════

const IMG = {
  logo_negro:      "/img/LOGO_VIKING_NEGRO.png",
  logo_blanco:     "/img/LOGO_VIKING_BLANCO.png",
  base_lateral:    "/img/BASE_LATERAL.png",
  base_frontal:    "/img/BASE_FRONTAL.png",
  base_trasera:    "/img/BASE_TRASERA.png",
  ov_parabrisas:   "/img/OV_PARABRISAS.png",
  ov_medallon:     "/img/OV_MEDALLON.png",
  ov_ventana_del:  "/img/OV_VENTANA_DEL.png",
  ov_ventana_tra:  "/img/OV_VENTANA_TRA.png",
  ov_ventana_fija: "/img/OV_VENTANA_FIJA.png",
  ov_puerta_del:   "/img/OV_PUERTA_DEL.png",
  ov_puerta_tra:   "/img/OV_PUERTA_TRA.png",
  ov_poste_B:      "/img/OV_POSTE_B.png",
  ov_poste_C:      "/img/OV_POSTE_C.png",
  ov_poste_D:      "/img/OV_POSTE_D.png",
  ov_techo:        "/img/OV_TECHO.png",
  ov_cajuela:      "/img/OV_CAJUELA.png",
  ov_carga:        "/img/OV_CARGA.png",
};

// Logo Viking real. Si la imagen no carga, cae al escudo SVG dibujado.
function Logo({h=40,variant="negro"}){
  const [failed,setFailed]=useState(false);
  const src = variant==="blanco"?IMG.logo_blanco:IMG.logo_negro;
  if(failed) return <Shield size={h*0.9} color={variant==="blanco"?"#fff":"#0a0a0a"}/>;
  return <img src={src} alt="Viking by GAV" onError={()=>setFailed(true)} style={{height:h,width:"auto",objectFit:"contain"}}/>;
}

const BRANDS = {
  "Acura":["MDX Base","MDX A-Spec","RDX","TLX","Integra"],
  "Audi":["A1","A1 S Line","A3","A3 Sedan","A4","A4 Allroad","A5 Coupé","A5 Sportback","A6","A6 Allroad","A7","A8","A8 L","S3","S4 Sedan","S5","S6 Sedan","S7","S8","RS3","RS5","RS6 Avant","RS7","RS Q3","RS Q8","SQ5","SQ7","SQ8","Q2","Q3","Q4 e-tron","Q5","Q5 Elite","Q5 Sportback","Q7","Q8","Q8 e-tron","e-tron SUV","e-tron GT","RS e-tron GT","R8 V10","R8 V10 Performance","TT","TT RS"],
  "Austin":["SP Coupe","Healey","Mini Classic"],
  "BMW":["218 Gran Coupé","220i","M2 Competition","M2 CS","M235i","M240i","320i","330i","330e","M340i","M440i xDrive","430i","520i","530i","540i","550i","M550i","730i","740i","750i","M3","M3 Competition","M4","M4 Competition","M5","M5 Competition","M8","i4","i5","i7","iX","iX xDrive50","X1","X2","X3","X3 M","X3 M40i","X4 M40i","X5 xDrive40i","X5 xDrive45e","X5 xDrive50i","X5 xDrive60i","X5 M50i","X5 M Competition","X6 M50i","X6 M60i","X6 M Competition","X7","XM","Z4","Z4 M40i"],
  "Buick":["Enclave","Enclave Avenir","Encore","Envision"],
  "BYD":["Atto 3 EV","Dolphin","Dolphin Mini","Han EV","Seal","Seal U","Song Plus DM-i","Shark Pick Up","Tang EV","Yuan Plus","King DM-i"],
  "Cadillac":["CT4","CT5","CTS Coupe","Escalade","Escalade Premium Luxury","Escalade ESV","Escalade ESV-V","Lyriq","XT4","XT5","XT6"],
  "Chevrolet":["Blazer","Camaro","Captiva","Colorado","Equinox","Silverado 1500","Silverado 1500 High Country","Silverado 2500","Suburban LS","Suburban LT","Suburban Premier","Suburban High Country","Tahoe LS","Tahoe LT","Tahoe Premier","Tahoe High Country","Traverse","Trailblazer","Trax"],
  "Cupra":["Ateca","Formentor","León","Tavascan"],
  "Dodge":["Attitude SE","Charger","Challenger","Durango GT","Durango R/T","Durango SRT"],
  "Ferrari":["California","California T","Portofino","Portofino M","Roma","Roma Spider","296 GTB","296 GTS","F8 Tributo","F8 Spider","GTC4Lusso","GTC4Lusso T","SF90 Stradale","SF90 Spider","812 Superfast","812 GTS","Purosangue","Daytona SP3"],
  "Fiat":["500","500X","Mobi","Pulse"],
  "Ford":["Bronco","Bronco Sport","Edge","Escape","Expedition XLT","Expedition Limited","Expedition Platinum","Expedition Max","Explorer XLT","Explorer Limited","Explorer ST","Explorer Platinum","F-150","F-150 Lariat","F-150 Raptor","F-150 Platinum","F-250","Maverick Lariat","Model A","Mustang","Mustang GT","Mustang Shelby GT500","Ranger","Ranger Lariat","Ranger Raptor"],
  "Genesis":["G70","G80","GV70","GV80"],
  "GMC":["Acadia","Canyon","Hummer EV SUV","Hummer EV Pickup","Sierra 1500","Sierra 1500 AT4","Sierra 1500 Denali","Sierra 2500","Sierra 2500 Denali","Terrain","Yukon SLE","Yukon SLT","Yukon AT4","Yukon Denali","Yukon Denali Ultimate","Yukon XL","Yukon XL Denali"],
  "Honda":["Accord","Civic","Civic Type R","CR-V","HR-V","Passport","Pilot EX-L","Pilot","Ridgeline"],
  "Hyundai":["Creta","Ioniq 5","Ioniq 6","Palisade","Santa Fe","Tucson"],
  "Ineos":["Grenadier","Grenadier Quartermaster"],
  "Infiniti":["Q50","Q50 Sport","Q60","Q60 Red Sport","QX50","QX55","QX60 Pure","QX60 Luxe","QX60 Autograph","QX60","QX80","QX80 Luxe","QX80 Sensory"],
  "Jaguar":["E-Type","E-Pace P250 S","F-Pace","F-Type SVR","XF","XJ"],
  "Jeep":["Cherokee","Cherokee Latitude","Cherokee Limited","Cherokee Laredo","Cherokee Trailhawk","Commander","Compass","Compass Limited","Gladiator Rubicon","Gladiator Sport","Gladiator Mojave","Grand Cherokee","Grand Cherokee Laredo","Grand Cherokee Limited","Grand Cherokee Overland","Grand Cherokee Summit","Grand Cherokee Trailhawk","Grand Cherokee L Laredo","Grand Cherokee L Limited","Grand Cherokee L Overland","Grand Cherokee L Summit","Grand Cherokee 4xe","Grand Wagoneer","Wrangler Sport","Wrangler Sahara","Wrangler Rubicon","Wrangler 4xe"],
  "Kia":["Carnival","EV6","Seltos LX","Seltos SX","Sorento","Sportage LX","Sportage SX","Stinger","Telluride SX"],
  "Lamborghini":["Aventador LP 700-4","Aventador S","Aventador SVJ","Aventador Roadster","Countach","Diablo","Gallardo LP 560-4","Gallardo LP 570-4 Superleggera","Huracán EVO","Huracán STO","Huracán Tecnica","Huracán Sterrato","Murciélago LP 640","Murciélago LP 640 Roadster","Revuelto","Urus","Urus S","Urus Performante"],
  "Land Rover":["Defender 90","Defender 110","Defender 130","Discovery","Discovery Sport","Range Rover","Range Rover SE","Range Rover HSE","Range Rover Autobiography","Range Rover SV","Range Rover Evoque","Range Rover Sport","Range Rover Sport SE","Range Rover Sport HSE","Range Rover Sport Dynamic","Range Rover Sport SVR","Range Rover Sport PHEV","Range Rover Velar"],
  "Lexus":["ES","GX","IS","LC","LX","NX","RX","RX 450h","UX"],
  "Lincoln":["Aviator Reserve","Aviator","Corsair","Navigator","Navigator L Reserve","Nautilus Reserve","Nautilus"],
  "Lotus":["Elise","Exige","Evora","Emira","Eletre","Emeya","Evija"],
  "Maserati":["Ghibli","Ghibli Hybrid","Grecale","Levante","MC20","Quattroporte"],
  "Maybach":["S 580","S 650","GLS 600"],
  "Mazda":["CX-3 i Sport","CX-30 Base","CX-30 Turbo","CX-5","CX-50","CX-60","CX-90","CX-90 PHEV","Mazda3","MX-5 Miata Sport","MX-5 Miata RF"],
  "McLaren":["540C","570S","570GT","600LT","620R","720S","750S","765LT","Artura","GT","Senna","P1","Speedtail","Elva"],
  "Mercedes-Benz":["190 SL","300 SL","A 200","A-Class","B-Class","C 200","C 300","C-Class","CLA 200","CLA 250","CLE 300 Coupé","CLE 450 4MATIC Coupé","CLS 450","E 200","E 350","E 450","E-Class","EQA","EQB","EQC","EQE","EQE SUV","EQS","EQS SUV","G 500","G 550","GLA 200","GLA 250","GLB 200","GLB 250","GLC 300","GLC 63 AMG","GLE 350","GLE 450","GLE 53 AMG","GLE 63 S","GLS 450","GLS 580","ML400 4MATIC","S 450","S 500","S 580","S-Class","SL 500","SL 550","SL 55 AMG Kompressor","SLC","V-Class"],
  "Mercedes-AMG":["A 35 AMG","A 45 AMG S","C 43 AMG","C 63 AMG","C 63 S E Performance","CLA 35 AMG","CLA 45 AMG","CLE 53 AMG","E 53 AMG","E 63 S AMG","G 63 AMG","GLA 35 AMG","GLA 45 AMG","GLB 35 AMG","GLC 43 AMG","GLC 63 AMG","GLE 53 AMG","GLE 63 AMG S","GLS 63 AMG","GT 43","GT 53","GT 63 S","SL 43 AMG","SL 55 AMG","SL 63 AMG"],
  "MG":["RX5","HS","ZS EV","5"],
  "MINI":["Cooper Classic","Cooper S Hatch","Cooper GP","Cooper JCW","Cooper JCW Coupe","Countryman","Clubman"],
  "Mitsubishi":["Outlander","Outlander PHEV GLX","Eclipse Cross","L200","Montero Sport"],
  "Nissan":["Altima","Armada","Frontier","Kicks","Murano","NP300","Pathfinder","Rogue","Sentra","X-Trail"],
  "Porsche":["718 Boxster","718 Boxster S","718 Boxster GTS","718 Cayman","718 Cayman S","718 Cayman GTS","718 Cayman GT4","911 Carrera","911 Carrera T","911 Carrera S","911 Carrera 4","911 Carrera 4S","911 Carrera GTS","911 Carrera S Cabriolet","911 Carrera 4 GTS","911 Targa 4","911 Targa 4S","911 Targa 4 GTS","911 Turbo","911 Turbo S","911 GT3","911 GT3 RS","911 GT3 Touring","911 GT2 RS","911 Dakar","911 S/T","356","912","930 Turbo","944","944 Turbo","968","928","Cayenne","Cayenne S","Cayenne GTS","Cayenne Turbo","Cayenne Turbo GT","Cayenne S E-Hybrid","Cayenne Turbo E-Hybrid","Cayenne Coupé","Macan","Macan S","Macan GTS","Macan Turbo","Macan Electric","Panamera","Panamera 4","Panamera 4S","Panamera GTS","Panamera Turbo","Panamera Turbo S E-Hybrid","Taycan","Taycan 4S","Taycan GTS","Taycan Turbo","Taycan Turbo S","Taycan Cross Turismo"],
  "Renault":["Clio Sport","Koleos","Kardian","Duster"],
  "RAM":["1500","2500","3500","TRX"],
  "Rivian":["R1S","R1T"],
  "SEAT":["Arona","Ateca","Ibiza","León","Tarraco"],
  "Shelby":["Cobra","GT350","GT500"],
  "Subaru":["Ascent","Crosstrek","Forester","Outback","WRX"],
  "Suzuki":["Jimny GLX","Swift","Vitara","S-Cross"],
  "Tesla":["Model 3 Standard Range Plus","Model 3 Long Range","Model S","Model S Long Range","Model S Plaid","Model X","Model Y Long Range","Cybertruck Single Motor RWD","Cybertruck Tri Motor AWD"],
  "Toyota":["4Runner TRD Pro","Camry","Corolla","GR86","Highlander XLE","Highlander Hybrid","Hilux","Land Cruiser","Land Cruiser Prado","Prius LE","Prius Prime","RAV4 LE","RAV4 XLE","RAV4 Hybrid","Sequoia","Sienna LE","Sienna Platinum","Tacoma SR","Tacoma Limited","Tundra"],
  "Volkswagen":["Amarok Comfortline","Amarok Highline","Amarok Panamericana","Atlas Cross Sport Comfortline","Atlas Cross Sport Highline","Golf GTI","Golf R","Jetta Trendline","Jetta Comfortline","Jetta Highline","Jetta GLI","T-Roc","Taos","Teramont Trendline","Teramont Comfortline","Teramont Highline","Tiguan Trendline","Tiguan Comfortline","Tiguan Highline","Tiguan R-Line","Touareg"],
  "Volvo":["C40","S60","S90","V60","XC40","XC60","XC90"],
  "Otro":["Otro modelo"],
};
const YEARS = Array.from({length:14},(_,i)=>2026-i);

// ── Detección coche vs camioneta ──────────────────────────────────────────
// Estrategia: primero descartamos SUVs/pickups/vans explícitas (gana camioneta),
// luego buscamos señales de coche por palabra. Evita falsos positivos por substring
// (ej. "Escalade" contiene "ES" pero NO es coche).

// SUVs, pickups y vans comunes — si el modelo contiene alguna, es CAMIONETA.
const TRUCK_WORDS = ["escalade","suburban","tahoe","yukon","sierra","silverado","colorado","canyon","hummer",
  "cayenne","macan","urus","bentayga","dbx","purosangue","levante","grecale",
  "range rover","defender","discovery","velar","evoque","grenadier",
  "x1","x2","x3","x4","x5","x6","x7","ix","gla","glb","glc","gle","gls","g 500","g 550","g 63","g-class","eqb","eqc","eqe suv","eqs suv",
  "q2","q3","q4","q5","q7","q8","e-tron","sq5","sq7","sq8","rs q",
  "rx","nx","gx","lx","ux","qx","mdx","rdx",
  "explorer","expedition","bronco","escape","edge","maverick","f-150","f-250","ranger","f150","f250",
  "tahoe","traverse","blazer","trax","trailblazer","equinox","captiva",
  "cr-v","crv","hr-v","hrv","pilot","passport","ridgeline",
  "tucson","santa fe","palisade","creta","kona",
  "rogue","murano","pathfinder","armada","kicks","x-trail","frontier","np300",
  "rav4","highlander","4runner","sequoia","tacoma","tundra","land cruiser","prado","sienna","hilux",
  "cx-3","cx-30","cx-5","cx-50","cx-60","cx-90","cx3","cx30","cx5","cx50","cx90",
  "tiguan","teramont","taos","touareg","atlas","t-roc","amarok","t-cross",
  "compass","cherokee","wrangler","gladiator","commander","wagoneer","grand cherokee",
  "telluride","sorento","sportage","seltos","carnival","ev6","stonic","niro",
  "xc40","xc60","xc90","c40","ex30","ex90",
  "outback","forester","ascent","crosstrek","outlander","montero","eclipse cross","l200",
  "model x","model y","cybertruck","r1s","r1t","grand wagoneer",
  "navigator","aviator","corsair","nautilus","enclave","encore","envision","lyriq","xt4","xt5","xt6","acadia","terrain",
  "ateca","tarraco","arona","formentor","tavascan","kodiaq","karoq",
  "atto","tang","song","yuan","seal u","dolphin","shark","grenadier","jimny","vitara","s-cross","bronco",
  "eletre","dbx","gv70","gv80","g70 shooting","qx50","qx55","qx60","qx80",
  "i-pace","e-pace","f-pace","ds7","ds3","duster","koleos","kardian","captur","grand vitara",
  "rx5","hs","zs ev","mg5 wagon","outlander","l200","npr","hiace","transit","sprinter","crafter","express","savana"];

// Señales de COCHE — sedán, coupé, hatch, deportivo, convertible.
const CAR_WORDS = ["sedan","sedán","coupe","coupé","cabrio","cabriolet","spider","spyder","roadster","convertible","hatch","liftback",
  "a1","a3","a4","a5","a6","a7","a8","s3","s4","s5","s6","s7","s8","rs3","rs5","rs6","rs7","r8","tt",
  "218","220","228","230","235","240","320","330","340","430","440","520","530","540","550","730","740","750",
  "m2","m3","m4","m5","m8","m235","m240","m340","m440","m550","i4","i5","i7","z4","serie",
  "ct4","ct5","cts","ats",
  "camaro","corvette","malibu","onix","aveo","spark","cavalier",
  "attitude","charger","challenger","dart","neon",
  "california","portofino","roma","296","f8","812","gtc4","sf90","daytona","ff",
  "500","mustang","model a","fiesta","focus","fusion","gt350","gt500","cobra",
  "g70","g80","g90","stinger",
  "accord","civic","city","fit","insight","integra","tlx",
  "elantra","sonata","accent","ioniq 5","ioniq 6","verna",
  "q50","q60",
  "e-type","f-type","xf","xj","xe","i-pace",
  "diablo","aventador","gallardo","murciélago","murcielago","huracán","huracan","countach","revuelto",
  "is ","es ","lc ","ls ","rc ","gs ","is3","is2","es3","es2",
  "ghibli","quattroporte","mc20","granturismo","grancabrio",
  "190 sl","300 sl","clase a","clase c","clase e","clase s","a 35","a 45","a 200","a 250",
  "c 200","c 300","c 43","c 63","cla","cle","cls","e 200","e 350","e 450","e 53","e 63",
  "s 450","s 500","s 580","sl 43","sl 55","sl 63","sl 500","sl 550","slc","amg gt","gt 43","gt 53","gt 63",
  "mazda2","mazda3","mazda6","mx-5","miata",
  "540c","570s","570gt","600lt","620r","720s","750s","765lt","artura","senna","speedtail","elva","p1",
  "cooper","clubman","mini classic",
  "elise","exige","evora","emira","emeya","evija",
  "altima","sentra","versa","maxima","leaf",
  "718","911","356","912","930","944","968","928","panamera","taycan",
  "clio","mégane","megane","logan","sandero",
  "wrx","brz","impreza","legacy","wrx sti",
  "swift","ciaz","baleno",
  "model 3","model s","fiat 500","sp coupe","healey",
  "camry","corolla","gr86","gr supra","prius","yaris","avalon","86",
  "golf","jetta","passat","polo","virtus","vento",
  "s60","s90","v60","mg5"];

function detectTipo(model){
  if(!model) return null;
  const m=" "+model.toLowerCase()+" ";
  // 1) Camioneta explícita gana (evita falsos positivos como Escalade→ES)
  for(const w of TRUCK_WORDS){ if(m.includes(" "+w) || m.includes(w+" ") || m.includes(" "+w+" ")) return "camioneta"; }
  // 2) Señal de coche
  for(const w of CAR_WORDS){ if(m.includes(" "+w) || m.includes(w+" ") || m.includes(" "+w+" ")) return "coche"; }
  // 3) Por defecto, camioneta (la mayoría del catálogo Viking)
  return "camioneta";
}

const P = {
  lat:{2:{v:54000,p:66000},4:{v:89000,p:99000},6:{v:109000,p:119000}},
  med:{v:25000,p:28000},para:38000,puerta:25000,
  cajuela:{coche:16000,camioneta:20000},poste:{coche:9000,camioneta:10000},
  carga:22000,techo:{coche:12000,camioneta:15000},
};
const C={
  lat:{2:{v:"VK101",p:"VK102"},4:{v:"VK103",p:"VK104"},6:{v:"VK105",p:"VK106"}},
  med:{v:"VK107",p:"VK108"},para:"VK110",puerta:"VK130",
  cajuela:{coche:"VK131",camioneta:"VK132"},poste:{coche:"VK133",camioneta:"VK134"},
  carga:"VK135",techo:{coche:"VK136",camioneta:"VK137"},
};
const mxn=n=>"$"+Math.round(n).toLocaleString("es-MX");
const today=new Date().toLocaleDateString("es-MX",{day:"numeric",month:"long",year:"numeric"});

// Datos de contacto de Viking (editar con los reales)
const VIKING_INFO = {
  tel: "55 0000 0000",
  correo: "contacto@gav.mx",
  direccion: "Dirección del taller, Ciudad",
  web: "gav.mx · @viking.gav",
};

// URL del Web App de Google Sheets (pegar la que termina en /exec)
const SHEETS_URL = "PEGAR_AQUI_TU_URL_DE_APPS_SCRIPT";

// Guarda una cotización en Google Sheets
async function guardarEnSheets(payload){
  if(!SHEETS_URL || SHEETS_URL.startsWith("PEGAR")) throw new Error("URL de Sheets no configurada");
  const res = await fetch(SHEETS_URL, {
    method:"POST",
    body: JSON.stringify(payload),
  });
  return res.json().catch(()=>({ok:true})); // Apps Script a veces no devuelve JSON limpio
}

// Folio único basado en fecha + aleatorio (ej. VK-260623-4821)
function makeFolio(){
  const d=new Date();
  const yy=String(d.getFullYear()).slice(2);
  const mm=String(d.getMonth()+1).padStart(2,"0");
  const dd=String(d.getDate()).padStart(2,"0");
  const rnd=Math.floor(1000+Math.random()*9000);
  return `VK-${yy}${mm}${dd}-${rnd}`;
}

const INK="#0a0a0a"; const MUTED="#86868b"; const SEP="rgba(0,0,0,0.07)";
const OPT_NAMES=["Opción A","Opción B","Opción C"];
const ATIENDE = ["Ángel Álvarez","Carlos García","Javier Fernández","Jesús Landeros"];
const ADMIN_PASS = "viking2026"; // cambia esto por tu contraseña de admin
const blankOpt=()=>({tipo:"camioneta",lat:null,latT:"p",med:false,medT:"p",para:false,puertas:0,cajuela:false,posteB:false,posteC:false,posteD:false,carga:false,techo:false});

function Shield({size=34,color="currentColor"}){
  return(
    <svg width={size} height={size*1.18} viewBox="0 0 44 52" fill="none">
      <path d="M22 2L4 9.5v14c0 13 8.5 23 18 26.5 9.5-3.5 18-13.5 18-26.5V9.5L22 2z" stroke={color} strokeWidth="2.2" strokeLinejoin="round"/>
      <path d="M22 6L8 12.5v11.5c0 10 6.5 18.5 14 21.5 7.5-3 14-11.5 14-21.5V12.5L22 6z" stroke={color} strokeWidth="1.4" strokeLinejoin="round"/>
      <path d="M22 11L14 15.5v7.5c0 6.5 4 11.5 8 13.5 4-2 8-7 8-13.5V15.5L22 11z" stroke={color} strokeWidth="1" strokeLinejoin="round"/>
    </svg>
  );
}

function pickView(o){
  if(o.lat||o.puertas>0||o.postes>0||o.carga||o.techo) return "lateral";
  if(o.med||o.cajuela) return "trasera";
  if(o.para) return "frontal";
  return "lateral";
}

function viewsWithContent(o){
  const v=[];
  const anyPoste=o.posteB||o.posteC||o.posteD;
  if(o.lat||o.puertas>0||anyPoste||o.carga||o.techo) v.push("lateral");
  if(o.para) v.push("frontal");
  if(o.med||o.cajuela) v.push("trasera");
  return v;
}
const VIEW_LABEL={lateral:"Lateral",frontal:"Frente",trasera:"Atrás"};

function CarStage({o}){
  const available=viewsWithContent(o);
  const [manual,setManual]=useState(null);
  const view = (manual && available.includes(manual)) ? manual : (available[0] || "lateral");

  const base = view==="frontal"?IMG.base_frontal : view==="trasera"?IMG.base_trasera : IMG.base_lateral;
  const layers=[];
  if(view==="lateral"){
    if(o.lat>=2) layers.push(IMG.ov_ventana_del);
    if(o.lat>=4) layers.push(IMG.ov_ventana_tra);
    if(o.lat>=6) layers.push(IMG.ov_ventana_fija);
    if(o.puertas>=1) layers.push(IMG.ov_puerta_del);
    if(o.puertas>=3) layers.push(IMG.ov_puerta_tra);
    if(o.posteB) layers.push(IMG.ov_poste_B);
    if(o.posteC) layers.push(IMG.ov_poste_C);
    if(o.posteD) layers.push(IMG.ov_poste_D);
    if(o.techo) layers.push(IMG.ov_techo);
    if(o.carga) layers.push(IMG.ov_carga);
  } else if(view==="frontal"){
    if(o.para) layers.push(IMG.ov_parabrisas);
  } else if(view==="trasera"){
    if(o.med) layers.push(IMG.ov_medallon);
    if(o.cajuela) layers.push(IMG.ov_cajuela);
  }

  // Zoom del vehículo en pantalla (las imágenes traen algo de aire; esto lo compensa). Súbelo o bájalo a tu gusto.
  const STAGE_ZOOM = 1.4;
  const layerStyle={position:"absolute",inset:0,width:"100%",height:"100%",objectFit:"contain",transform:`scale(${STAGE_ZOOM})`};

  return(
    <div style={{borderRadius:18,background:"linear-gradient(160deg,#fbfbfd,#f2f2f4)",marginBottom:"2rem",padding:"0.75rem"}}>
      <div style={{position:"relative",width:"100%",aspectRatio:"16 / 7",maxHeight:300,margin:"0 auto",overflow:"hidden",borderRadius:12}}>
        <img src={base} alt="" style={{...layerStyle,zIndex:1}}/>
        {layers.map((s,i)=><img key={s} src={s} alt="" style={{...layerStyle,zIndex:10+i}}/>)}
      </div>
      {available.length>1 && (
        <div style={{display:"flex",gap:6,justifyContent:"center",marginTop:10}}>
          {available.map(v=>{
            const on=view===v;
            return(
              <button key={v} onClick={()=>setManual(v)} style={{
                padding:"5px 16px",borderRadius:100,fontSize:13,cursor:"pointer",fontFamily:"inherit",
                background:on?INK:"transparent",color:on?"#fff":MUTED,
                border:`1.5px solid ${on?INK:"#d2d2d7"}`,
              }}>{VIEW_LABEL[v]}</button>
            );
          })}
        </div>
      )}
    </div>
  );
}

function buildItems(o){
  const l=[];
  if(o.lat)l.push({code:C.lat[o.lat][o.latT],label:`${o.latT==="p"?"Viking Plus":"Viking"} · ${o.lat} laterales`,price:P.lat[o.lat][o.latT]});
  if(o.med)l.push({code:C.med[o.medT],label:`${o.medT==="p"?"Viking Plus":"Viking"} · Medallón`,price:P.med[o.medT]});
  if(o.para)l.push({code:C.para,label:"Viking · Parabrisas",price:P.para});
  if(o.puertas>0)l.push({code:C.puerta,label:`Kevlar puertas ×${o.puertas}`,price:P.puerta*o.puertas});
  if(o.cajuela)l.push({code:C.cajuela[o.tipo],label:"Kevlar cajuela",price:P.cajuela[o.tipo]});
  const postesList=[o.posteB&&"B",o.posteC&&"C",o.posteD&&"D"].filter(Boolean);
  if(postesList.length>0)l.push({code:C.poste[o.tipo],label:`Kevlar postes ${postesList.join(", ")} (×2 c/u)`,price:P.poste[o.tipo]*postesList.length*2});
  if(o.carga&&o.tipo==="camioneta")l.push({code:C.carga,label:"Kevlar área de carga",price:P.carga});
  if(o.techo)l.push({code:C.techo[o.tipo],label:"Kevlar techo",price:P.techo[o.tipo]});
  return l;
}
function totals(o){const items=buildItems(o);const sub=items.reduce((s,i)=>s+i.price,0);const iva=Math.round(sub*.16);return{items,sub,iva,total:sub+iva};}

// Devuelve las capas (base + overlays) de una vista específica para una opción
function viewLayers(o,view){
  const base = view==="frontal"?IMG.base_frontal : view==="trasera"?IMG.base_trasera : IMG.base_lateral;
  const layers=[];
  if(view==="lateral"){
    if(o.lat>=2) layers.push(IMG.ov_ventana_del);
    if(o.lat>=4) layers.push(IMG.ov_ventana_tra);
    if(o.lat>=6) layers.push(IMG.ov_ventana_fija);
    if(o.puertas>=1) layers.push(IMG.ov_puerta_del);
    if(o.puertas>=3) layers.push(IMG.ov_puerta_tra);
    if(o.posteB) layers.push(IMG.ov_poste_B);
    if(o.posteC) layers.push(IMG.ov_poste_C);
    if(o.posteD) layers.push(IMG.ov_poste_D);
    if(o.techo) layers.push(IMG.ov_techo);
    if(o.carga) layers.push(IMG.ov_carga);
  } else if(view==="frontal"){
    if(o.para) layers.push(IMG.ov_parabrisas);
  } else if(view==="trasera"){
    if(o.med) layers.push(IMG.ov_medallon);
    if(o.cajuela) layers.push(IMG.ov_cajuela);
  }
  return {base,layers};
}

// Ilustración para el PDF: todas las vistas con contenido, en columna
function QuoteIllustration({o}){
  const views=viewsWithContent(o);
  if(views.length===0) return null;
  // Tamaño y zoom de las ilustraciones en la cotización/PDF. Súbelos o bájalos a tu gusto.
  const W_LATERAL = 460;  // ancho de la vista lateral
  const W_OTRA    = 230;  // ancho de frente / atrás
  const PDF_ZOOM  = 1.4;  // zoom (compensa el aire de las imágenes)
  const imgStyle={position:"absolute",inset:0,width:"100%",height:"100%",objectFit:"contain",transform:`scale(${PDF_ZOOM})`};
  return(
    <div style={{display:"flex",flexDirection:"column",gap:8,alignItems:"center",marginTop:16}}>
      {views.map(v=>{
        const {base,layers}=viewLayers(o,v);
        const w = v==="lateral" ? W_LATERAL : W_OTRA;
        // La lateral es ancha y baja; el frente/atrás es más cuadrado.
        const ar = v==="lateral" ? "16 / 7" : "10 / 11";
        return(
          <div key={v} style={{position:"relative",width:w,aspectRatio:ar,overflow:"hidden"}}>
            <img src={base} alt="" style={imgStyle}/>
            {layers.map((s,i)=><img key={s} src={s} alt="" style={imgStyle}/>)}
          </div>
        );
      })}
    </div>
  );
}

function Pill({active,onClick,children,sm}){
  return <button onClick={onClick} style={{padding:sm?"6px 14px":"8px 18px",borderRadius:100,fontSize:sm?13:14,cursor:"pointer",fontFamily:"inherit",background:active?INK:"transparent",color:active?"#fff":"#555",border:`1.5px solid ${active?INK:"#ccc"}`,whiteSpace:"nowrap"}}>{children}</button>;
}
function Toggle({active,onToggle}){
  return <button onClick={onToggle} style={{width:48,height:28,borderRadius:14,border:"none",cursor:"pointer",background:active?"#1c1c1e":"#d1d1d6",position:"relative",flexShrink:0}}><div style={{width:24,height:24,borderRadius:12,background:"#fff",position:"absolute",top:2,left:active?22:2,transition:"left .18s",boxShadow:"0 1px 4px rgba(0,0,0,.25)"}}/></button>;
}
function Counter({value,onChange,max}){
  const b=(en)=>({width:32,height:32,borderRadius:16,border:`1.5px solid ${en?INK:"#ccc"}`,background:en?INK:"transparent",cursor:en?"pointer":"default",opacity:en?1:.25,fontSize:18,color:en?"#fff":"#0a0a0a",display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"inherit"});
  return <div style={{display:"flex",alignItems:"center",gap:14}}><button style={b(value>0)} onClick={()=>onChange(Math.max(0,value-1))}>−</button><span style={{fontSize:17,fontWeight:500,minWidth:20,textAlign:"center"}}>{value}</span><button style={b(value<max)} onClick={()=>onChange(Math.min(max,value+1))}>+</button></div>;
}
function Row({label,sub,right,first}){
  return <div style={{display:"flex",alignItems:"flex-start",justifyContent:"space-between",padding:"16px 0",borderTop:first?"none":`1px solid ${SEP}`,gap:12}}><div style={{paddingTop:2}}><div style={{fontSize:15,color:"#0a0a0a"}}>{label}</div>{sub&&<div style={{fontSize:13,color:MUTED,marginTop:3}}>{sub}</div>}</div><div style={{flexShrink:0}}>{right}</div></div>;
}
function SHead({children}){
  return <div style={{fontSize:11,fontWeight:500,color:MUTED,textTransform:"uppercase",letterSpacing:"0.09em",paddingBottom:6,borderBottom:`1px solid ${SEP}`}}>{children}</div>;
}
function Sel({value,onChange,disabled,children,w}){
  return <div style={{position:"relative",width:w}}><select value={value} onChange={e=>onChange(e.target.value)} disabled={disabled} style={{appearance:"none",WebkitAppearance:"none",width:"100%",padding:"9px 30px 9px 12px",border:`1px solid rgba(0,0,0,${disabled?.07:.14})`,borderRadius:10,fontSize:14,background:"#f5f5f7",color:disabled?MUTED:"#0a0a0a",fontFamily:"inherit",cursor:disabled?"default":"pointer"}}>{children}</select><svg style={{position:"absolute",right:10,top:"50%",transform:"translateY(-50%)",pointerEvents:"none",opacity:disabled?.3:.5}} width="12" height="8" viewBox="0 0 12 8"><path d="M1 1l5 5 5-5" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round"/></svg></div>;
}

function OptionEditor({o,set}){
  const u=(k,v)=>set({...o,[k]:v});
  function changeTipo(t){set({...o,tipo:t,carga:false,lat:(t==="coche"&&o.lat===6)?null:o.lat});}
  return(
    <div>
      <CarStage o={o}/>
      <div style={{marginBottom:"2rem"}}>
        <SHead>Tipo de vehículo</SHead>
        <Row first label="¿Coche o camioneta / SUV?" sub="Se ajusta solo según el modelo · puedes corregirlo" right={<div style={{display:"flex",gap:8}}><Pill active={o.tipo==="coche"} onClick={()=>changeTipo("coche")}>Coche</Pill><Pill active={o.tipo==="camioneta"} onClick={()=>changeTipo("camioneta")}>Camioneta</Pill></div>}/>
      </div>
      <div style={{marginBottom:"2rem"}}>
        <SHead>Vidrios reforzados</SHead>
        <Row first label="Laterales" sub={o.lat?`${mxn(P.lat[o.lat][o.latT])} + IVA`:"Elige cobertura"} right={
          <div style={{display:"flex",flexDirection:"column",gap:8,alignItems:"flex-end"}}>
            <div style={{display:"flex",gap:6}}>
              <Pill sm active={o.lat===null} onClick={()=>u("lat",null)}>—</Pill>
              <Pill sm active={o.lat===2} onClick={()=>u("lat",2)}>2</Pill>
              <Pill sm active={o.lat===4} onClick={()=>u("lat",4)}>4</Pill>
              {o.tipo==="camioneta"&&<Pill sm active={o.lat===6} onClick={()=>u("lat",6)}>6</Pill>}
            </div>
            {o.lat&&<div style={{display:"flex",gap:6}}><Pill sm active={o.latT==="v"} onClick={()=>u("latT","v")}>Viking</Pill><Pill sm active={o.latT==="p"} onClick={()=>u("latT","p")}>Plus</Pill></div>}
          </div>
        }/>
        <Row label="Medallón" sub={o.med?`${mxn(P.med[o.medT])} + IVA`:"Cristal trasero"} right={
          <div style={{display:"flex",flexDirection:"column",gap:8,alignItems:"flex-end"}}>
            <Toggle active={o.med} onToggle={()=>u("med",!o.med)}/>
            {o.med&&<div style={{display:"flex",gap:6}}><Pill sm active={o.medT==="v"} onClick={()=>u("medT","v")}>Viking</Pill><Pill sm active={o.medT==="p"} onClick={()=>u("medT","p")}>Plus</Pill></div>}
          </div>
        }/>
        <Row label="Parabrisas" sub="Requiere evaluación previa" right={<Toggle active={o.para} onToggle={()=>u("para",!o.para)}/>}/>
      </div>
      <div>
        <SHead>Kevlar 9 capas</SHead>
        <Row first label="Puertas" sub={`${mxn(P.puerta)} por puerta`} right={<Counter value={o.puertas} onChange={v=>u("puertas",v)} max={4}/>}/>
        <Row label="Cajuela" sub={mxn(P.cajuela[o.tipo])} right={<Toggle active={o.cajuela} onToggle={()=>u("cajuela",!o.cajuela)}/>}/>
        <Row label="Postes" sub={`${mxn(P.poste[o.tipo])} por poste`} right={
          <div style={{display:"flex",gap:6}}>
            <Pill sm active={o.posteB} onClick={()=>u("posteB",!o.posteB)}>B</Pill>
            <Pill sm active={o.posteC} onClick={()=>u("posteC",!o.posteC)}>C</Pill>
            <Pill sm active={o.posteD} onClick={()=>u("posteD",!o.posteD)}>D</Pill>
          </div>
        }/>
        {o.tipo==="camioneta"&&<Row label="Área de carga" sub={`${mxn(P.carga)} · ambos lados`} right={<Toggle active={o.carga} onToggle={()=>u("carga",!o.carga)}/>}/>}
        <Row label="Techo" sub={mxn(P.techo[o.tipo])} right={<Toggle active={o.techo} onToggle={()=>u("techo",!o.techo)}/>}/>
      </div>
    </div>
  );
}

function PrintView({opts,name,tel,vehicleStr,asesor,folio,onBack}){
  const active=opts.filter(o=>buildItems(o).length>0);
  const multi=active.length>1;
  const [saving,setSaving]=useState(false);
  const [saved,setSaved]=useState(false);
  const [saveErr,setSaveErr]=useState("");

  // Guarda en el historial (se llama solo al imprimir). No reintenta si ya se guardó.
  async function guardar(){
    if(saved || saving) return;
    if(!SHEETS_URL || SHEETS_URL.startsWith("PEGAR")) return; // sin URL configurada, no intenta
    setSaving(true); setSaveErr("");
    try{
      // Arma resumen de zonas y montos de todas las opciones
      const zonasTxt = active.map((o,i)=>{
        const labels=buildItems(o).map(it=>it.label).join("; ");
        return (multi?`${OPT_NAMES[i]}: `:"")+labels;
      }).join(" || ");
      const totalGral = active.reduce((s,o)=>s+totals(o).total,0);
      const subGral = active.reduce((s,o)=>s+totals(o).sub,0);
      await guardarEnSheets({
        fecha: new Date().toLocaleString("es-MX"),
        folio, atendio: asesor||"", cliente: name||"", telefono: tel||"", vehiculo: vehicleStr||"",
        tipo: active[0]?.tipo||"", opciones: active.length,
        zonas: zonasTxt, subtotal: subGral, total: totalGral, estado:"Pendiente",
      });
      setSaved(true);
    }catch(e){ setSaveErr(e.message||"Error al guardar"); }
    setSaving(false);
  }

  // Al imprimir: guarda automáticamente en segundo plano y abre el diálogo de impresión.
  function imprimirYGuardar(){
    guardar();        // se dispara solo, no bloquea la impresión
    window.print();
  }

  return(
    <div>
      <style>{`@media print{.np{display:none!important}.opt-sec{break-inside:avoid}.sec{break-inside:avoid}}`}</style>
      <div className="np" style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:"1.5rem",paddingBottom:"1rem",borderBottom:`1px solid ${SEP}`,gap:10}}>
        <button onClick={onBack} style={{background:"none",border:"none",fontSize:15,color:MUTED,cursor:"pointer",fontFamily:"inherit",padding:0}}>← Editar</button>
        <div style={{display:"flex",gap:10,alignItems:"center"}}>
          {saving && <span style={{fontSize:13,color:MUTED}}>Guardando…</span>}
          {saved && <span style={{fontSize:14,color:"#4d7c0f",fontWeight:500}}>✓ Guardada</span>}
          <button onClick={imprimirYGuardar} style={{padding:"10px 24px",borderRadius:100,background:INK,color:"#fff",border:"none",fontSize:14,cursor:"pointer",fontFamily:"inherit"}}>Imprimir / Guardar PDF</button>
        </div>
      </div>
      {saveErr && <div className="np" style={{fontSize:12,color:"#b91c1c",marginBottom:"1rem",textAlign:"right"}}>No se pudo guardar: {saveErr}</div>}
      <div style={{background:"#fff",color:"#111",maxWidth:580}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:22,paddingBottom:18,borderBottom:"1.5px solid #111"}}>
          <Logo h={92} variant="negro"/>
          <div style={{textAlign:"right"}}><div style={{fontSize:20,fontWeight:500}}>Cotización</div><div style={{fontSize:12,color:"#888",marginTop:3}}>{today}</div><div style={{fontSize:12,color:"#aaa",marginTop:2,fontFamily:"monospace"}}>{folio}</div></div>
        </div>
        <div style={{marginBottom:24,padding:"14px 16px",background:"#f7f7f5",borderRadius:10,display:"grid",gridTemplateColumns:"1fr 1fr",gap:"10px 24px"}}>
          {[["Cliente",name||"—"],["Teléfono",tel||"—"],["Vehículo",vehicleStr||"—"],["Atendido por",asesor||"—"],["Vigencia","30 días"]].map(([l,v])=>(
            <div key={l}><div style={{fontSize:10,color:"#888",textTransform:"uppercase",letterSpacing:"0.08em",marginBottom:3}}>{l}</div><div style={{fontSize:14,fontWeight:500}}>{v}</div></div>
          ))}
        </div>
        {multi&&<div style={{fontSize:13,color:"#666",marginBottom:18}}>Esta cotización incluye {active.length} opciones de protección para que elijas la que mejor se ajuste a tus necesidades.</div>}

        <div className="sec" style={{marginBottom:24}}>
          <div style={{fontSize:11,fontWeight:600,color:"#111",textTransform:"uppercase",letterSpacing:"0.08em",marginBottom:8}}>¿Qué es Viking?</div>
          <div style={{fontSize:12.5,color:"#444",lineHeight:1.65}}>
            Viking by GAV refuerza los puntos más vulnerables del vehículo en dos frentes: el refuerzo de los vidrios, para dificultar que se rompan en un asalto, y el refuerzo de la carrocería con Kevlar de 9 capas. Todo con una instalación discreta que conserva la apariencia, el ajuste y la funcionalidad originales del vehículo.
          </div>
        </div>

        <div className="sec" style={{marginBottom:26}}>
          <div style={{fontSize:11,fontWeight:600,color:"#111",textTransform:"uppercase",letterSpacing:"0.08em",marginBottom:10}}>Viking vs Viking Plus</div>
          <table style={{width:"100%",borderCollapse:"collapse",fontSize:12.5}}>
            <thead><tr>
              <th style={{textAlign:"left",padding:"6px 8px",fontWeight:500,color:"#999",fontSize:10,textTransform:"uppercase",letterSpacing:"0.06em",borderBottom:"1px solid #ccc"}}>Característica</th>
              <th style={{textAlign:"left",padding:"6px 8px",fontWeight:600,fontSize:11,borderBottom:"1px solid #ccc",background:"#f7f7f5"}}>Viking</th>
              <th style={{textAlign:"left",padding:"6px 8px",fontWeight:600,fontSize:11,borderBottom:"1px solid #ccc",background:"#eef2f5"}}>Viking Plus</th>
            </tr></thead>
            <tbody>
              {[
                ["Grosor agregado","+3.5 mm (≈10 mm total)","+6.0 mm (≈13.5 mm total)"],
                ["Ceja de acero","No","Sí"],
                ["Acabado","Transparente","Transparente o ahumado 50%"],
                ["Resistencia a impactos","Alta · vandalismo y golpes moderados","Muy alta · golpes fuertes y repetidos"],
                ["Uso recomendado","Uso diario y prevención de robos","Máxima protección · autos de alto valor o rutas de riesgo"],
              ].map((r,i)=>(
                <tr key={i} style={{borderBottom:"1px solid #f0f0f0"}}>
                  <td style={{padding:"7px 8px",fontWeight:500,color:"#333"}}>{r[0]}</td>
                  <td style={{padding:"7px 8px",color:"#444"}}>{r[1]}</td>
                  <td style={{padding:"7px 8px",color:"#444",background:"#fbfcfd"}}>{r[2]}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <div style={{fontSize:10,color:"#aaa",fontStyle:"italic",marginTop:8,lineHeight:1.5}}>
            Viking aumenta la resistencia del vidrio original y da más tiempo de reacción. No es un blindaje certificado ni lo sustituye. Resultados basados en pruebas internas no certificadas.
          </div>
        </div>

        {active.map((o,idx)=>{
          const {items,sub,iva,total}=totals(o);
          return(
            <div key={idx} className="opt-sec" style={{marginBottom:28}}>
              {multi&&<div style={{display:"flex",alignItems:"center",gap:10,marginBottom:12}}>
                <div style={{background:INK,color:"#fff",fontSize:13,fontWeight:500,padding:"4px 14px",borderRadius:100}}>{OPT_NAMES[idx]}</div>
                <div style={{flex:1,height:1,background:"#e5e5e3"}}/>
                <div style={{fontSize:13,color:"#888",textTransform:"capitalize"}}>{o.tipo}</div>
              </div>}
              <table style={{width:"100%",borderCollapse:"collapse",fontSize:14}}>
                <thead><tr style={{borderBottom:"1px solid #ccc"}}>
                  {["Código","Descripción","Precio"].map((h,i)=><th key={h} style={{textAlign:i===2?"right":"left",padding:"5px 0",fontWeight:500,color:"#999",fontSize:10,textTransform:"uppercase",letterSpacing:"0.06em",...(i===0?{width:64}:{}),...(i===1?{paddingLeft:8}:{})}}>{h}</th>)}
                </tr></thead>
                <tbody>
                  {items.map((it,i)=>(
                    <tr key={i} style={{borderBottom:"1px solid #f0f0f0"}}>
                      <td style={{padding:"9px 0",color:"#aaa",fontSize:12}}>{it.code}</td>
                      <td style={{padding:"9px 8px"}}>{it.label}</td>
                      <td style={{padding:"9px 0",textAlign:"right",whiteSpace:"nowrap"}}>{mxn(it.price)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div style={{display:"flex",justifyContent:"flex-end",marginTop:10}}>
                <div style={{minWidth:220}}>
                  <div style={{display:"flex",justifyContent:"space-between",fontSize:13,color:"#888",marginBottom:5}}><span>Subtotal</span><span>{mxn(sub)}</span></div>
                  <div style={{display:"flex",justifyContent:"space-between",fontSize:13,color:"#888",marginBottom:8}}><span>IVA 16%</span><span>{mxn(iva)}</span></div>
                  <div style={{display:"flex",justifyContent:"space-between",alignItems:"baseline",borderTop:"1.5px solid #111",paddingTop:8}}>
                    <span style={{fontSize:14,fontWeight:500}}>{multi?`Total ${OPT_NAMES[idx]}`:"Total con IVA"}</span>
                    <span style={{fontSize:22,fontWeight:500,letterSpacing:"-0.5px"}}>{mxn(total)}</span>
                  </div>
                </div>
              </div>
              <QuoteIllustration o={o}/>
            </div>
          );
        })}

        <div className="sec" style={{marginTop:24,paddingTop:18,borderTop:"1px solid #e5e5e3"}}>
          <div style={{fontSize:11,fontWeight:600,color:"#111",textTransform:"uppercase",letterSpacing:"0.08em",marginBottom:10}}>Notas y condiciones</div>
          <ol style={{margin:0,paddingLeft:18,fontSize:11.5,color:"#555",lineHeight:1.7}}>
            <li>Anticipo del 50% del total para iniciar el trabajo; el saldo restante deberá estar cubierto antes de la entrega del vehículo.</li>
            <li>Tiempo estimado en taller: 2 a 3 semanas hábiles.</li>
            <li>Inspección previa documentada del vehículo antes de iniciar. Cualquier ajuste al alcance se comunica y reconfirma con el cliente.</li>
            <li>El parabrisas (VK110) no está incluido: requiere evaluación previa y se cotiza por separado.</li>
            <li>El polarizado no está incluido y se cotiza por separado.</li>
            <li>Acabado Viking Plus disponible en transparente o ahumado 50%, a definir con el cliente antes de la instalación.</li>
            <li>Se utilizan los vidrios originales del vehículo: se desmontan, se procesan en autoclave y se reinstalan en el mismo marco. No se modifica la estructura ni se alteran puertas o mecanismos.</li>
            <li>Peso agregado mínimo (menos del 2% del peso del vehículo); los elevadores siguen funcionando con normalidad.</li>
            <li>Vigencia de la cotización: 30 días a partir de la fecha de emisión.</li>
          </ol>
        </div>

        <div style={{marginTop:24,paddingTop:16,borderTop:"1.5px solid #111",display:"flex",justifyContent:"space-between",flexWrap:"wrap",gap:20}}>
          <div>
            <div style={{fontSize:10,color:"#888",textTransform:"uppercase",letterSpacing:"0.08em",marginBottom:5}}>Contacto</div>
            <div style={{fontSize:12,color:"#444",lineHeight:1.7}}>
              {VIKING_INFO.tel}<br/>
              {VIKING_INFO.correo}<br/>
              {VIKING_INFO.direccion}<br/>
              {VIKING_INFO.web}
            </div>
          </div>
          <div style={{flex:"0 0 auto"}}>
            <div style={{fontSize:10,color:"#888",textTransform:"uppercase",letterSpacing:"0.08em",marginBottom:5}}>Datos para depósito</div>
            <div style={{fontSize:12,color:"#444",lineHeight:1.7}}>
              <span style={{color:"#888"}}>Banco</span> BBVA Bancomer<br/>
              <span style={{color:"#888"}}>Beneficiario</span> GAV Detailing SA de CV<br/>
              <span style={{color:"#888"}}>Cuenta</span> 0110645915<br/>
              <span style={{color:"#888"}}>CLABE</span> 012180001106459158
            </div>
          </div>
        </div>
        <div style={{marginTop:16,display:"flex",justifyContent:"flex-end"}}>
          <div style={{opacity:.4}}><Logo h={24} variant="negro"/></div>
        </div>
        <div style={{marginTop:16,paddingTop:14,borderTop:"1px solid #e5e5e3",fontSize:11,color:"#bbb",lineHeight:1.6}}>
          Precios en pesos mexicanos antes de IVA (16%). Vigencia 30 días. Garantía 5 años propietario original: cubre delaminación, burbujeo y defectos de instalación. No cubre accidentes, golpes ni vandalismo. No transferible. Viking by GAV no es blindaje balístico certificado.
        </div>
      </div>
    </div>
  );
}

// ── Acceso admin (disparador discreto al pie) ──────────────────────
function AdminGate({onEnter}){
  const [open,setOpen]=useState(false);
  const [pass,setPass]=useState("");
  const [err,setErr]=useState(false);
  const intentar=()=>{ if(pass===ADMIN_PASS) onEnter(); else setErr(true); };
  if(!open) return (
    <div style={{textAlign:"center",marginTop:"3rem",paddingTop:"1.5rem",borderTop:`1px solid ${SEP}`}}>
      <button onClick={()=>setOpen(true)} style={{background:"none",border:"none",fontSize:11,color:"#c7c7cc",cursor:"pointer",fontFamily:"inherit",letterSpacing:"0.08em",textTransform:"uppercase"}}>Admin</button>
    </div>
  );
  return (
    <div style={{display:"flex",gap:8,justifyContent:"center",alignItems:"center",marginTop:"3rem",paddingTop:"1.5rem",borderTop:`1px solid ${SEP}`}}>
      <input type="password" value={pass} autoFocus placeholder="Contraseña"
        onChange={e=>{setPass(e.target.value);setErr(false);}}
        onKeyDown={e=>{if(e.key==="Enter")intentar();}}
        style={{padding:"8px 12px",border:`1px solid ${err?"#b91c1c":"rgba(0,0,0,.14)"}`,borderRadius:10,fontSize:14,background:"#f5f5f7",fontFamily:"inherit",width:160}}/>
      <button onClick={intentar} style={{padding:"8px 16px",borderRadius:100,background:INK,color:"#fff",border:"none",fontSize:13,cursor:"pointer",fontFamily:"inherit"}}>Entrar</button>
      <button onClick={()=>{setOpen(false);setPass("");setErr(false);}} style={{background:"none",border:"none",fontSize:13,color:MUTED,cursor:"pointer",fontFamily:"inherit"}}>Cancelar</button>
    </div>
  );
}

// ── Vista admin: historial de cotizaciones (lee de Google Sheets) ──
function AdminView({onBack}){
  const [rows,setRows]=useState(null);
  const [err,setErr]=useState("");
  const [loading,setLoading]=useState(true);
  useEffect(()=>{
    let alive=true;
    (async()=>{
      if(!SHEETS_URL || SHEETS_URL.startsWith("PEGAR")){
        setErr("La URL de Google Sheets aún no está configurada (constante SHEETS_URL).");
        setLoading(false); return;
      }
      try{
        const res=await fetch(SHEETS_URL);
        const data=await res.json();
        const list=Array.isArray(data)?data:(data.rows||data.data||[]);
        if(alive){ setRows(list); setLoading(false); }
      }catch(e){ if(alive){ setErr("No se pudo cargar el historial desde Sheets."); setLoading(false); } }
    })();
    return ()=>{alive=false;};
  },[]);
  return(
    <div style={{fontFamily:"-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif",maxWidth:760,margin:"0 auto",padding:"2rem 1rem"}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:"1.5rem",paddingBottom:"1rem",borderBottom:`1px solid ${SEP}`}}>
        <button onClick={onBack} style={{background:"none",border:"none",fontSize:15,color:MUTED,cursor:"pointer",fontFamily:"inherit",padding:0}}>← Volver al cotizador</button>
        <Logo h={40} variant="negro"/>
      </div>
      <div style={{fontSize:20,fontWeight:500,marginBottom:"1.25rem"}}>Historial de cotizaciones</div>
      {loading && <div style={{color:MUTED,fontSize:14}}>Cargando…</div>}
      {err && <div style={{color:"#b91c1c",fontSize:14}}>{err}</div>}
      {!loading && !err && rows && rows.length===0 && <div style={{color:MUTED,fontSize:14}}>Aún no hay cotizaciones guardadas.</div>}
      {!loading && !err && rows && rows.length>0 && (
        <table style={{width:"100%",borderCollapse:"collapse",fontSize:13}}>
          <thead><tr style={{borderBottom:"1px solid #ccc",textAlign:"left",color:MUTED}}>
            {["Fecha","Folio","Cliente","Vehículo","Total","Estado"].map(h=><th key={h} style={{padding:"8px 6px",fontWeight:500,fontSize:11,textTransform:"uppercase",letterSpacing:"0.06em"}}>{h}</th>)}
          </tr></thead>
          <tbody>
            {rows.map((r,i)=>(
              <tr key={i} style={{borderBottom:`1px solid ${SEP}`}}>
                <td style={{padding:"8px 6px"}}>{r.fecha||"—"}</td>
                <td style={{padding:"8px 6px",fontFamily:"monospace"}}>{r.folio||"—"}</td>
                <td style={{padding:"8px 6px"}}>{r.cliente||"—"}</td>
                <td style={{padding:"8px 6px"}}>{r.vehiculo||"—"}</td>
                <td style={{padding:"8px 6px",whiteSpace:"nowrap"}}>{r.total?mxn(Number(r.total)):"—"}</td>
                <td style={{padding:"8px 6px"}}>{r.estado||"—"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default function App(){
  const [view,setView]=useState("config");
  const [admin,setAdmin]=useState(false);
  const [name,setName]=useState(""); const [tel,setTel]=useState(""); const [brand,setBrand]=useState(""); const [model,setModel]=useState(""); const [year,setYear]=useState("");
  const [asesor,setAsesor]=useState("");
  const [folio]=useState(makeFolio);
  const [opts,setOpts]=useState([blankOpt()]);
  const [active,setActive]=useState(0);

  if(admin) return <AdminView onBack={()=>setAdmin(false)}/>;

  const models=brand&&BRANDS[brand]?BRANDS[brand]:[];
  const vehicleStr=[brand,model,year].filter(Boolean).join(" ");
  const anyFilled=opts.some(o=>buildItems(o).length>0);
  const multi=opts.length>1;
  const curTotal=totals(opts[active]);

  // Campos obligatorios para poder ver la cotización
  const faltantes=[];
  if(!asesor) faltantes.push("Atendido por");
  if(!name.trim()) faltantes.push("Nombre");
  if(!tel.trim()) faltantes.push("Teléfono");
  if(!brand) faltantes.push("Marca");
  if(!model) faltantes.push("Modelo");
  if(!year) faltantes.push("Año");
  if(!anyFilled) faltantes.push("Al menos un servicio");
  const puedeVer = faltantes.length===0;

  function setOpt(i,next){setOpts(p=>p.map((o,idx)=>idx===i?next:o));}
  function chooseModel(m){
    setModel(m);
    const t=detectTipo(m);
    if(t) setOpts(p=>p.map(o=>({...o,tipo:t,carga:t==="coche"?false:o.carga,lat:(t==="coche"&&o.lat===6)?null:o.lat})));
  }
  function compareNew(){
    if(opts.length>=3)return;
    setOpts(p=>{const fresh={...blankOpt(),tipo:p[active].tipo};return[...p,fresh];});
    setActive(opts.length);
  }
  function removeOpt(i){
    if(opts.length===1)return;
    setOpts(p=>p.filter((_,idx)=>idx!==i));
    setActive(a=>Math.max(0,a>=i?a-1:a));
  }

  if(view==="preview") return <div style={{fontFamily:"-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif",maxWidth:600,margin:"0 auto",padding:"2rem 1rem"}}><PrintView opts={opts} name={name} tel={tel} vehicleStr={vehicleStr} asesor={asesor} folio={folio} onBack={()=>setView("config")}/></div>;

  return(
    <div style={{fontFamily:"-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif",maxWidth:600,margin:"0 auto",padding:"0 1rem 6rem",position:"relative"}}>
      <div style={{padding:"2rem 0 0"}}>
        <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:"1.75rem"}}>
          <Logo h={88} variant="negro"/>
          <div style={{fontSize:11,color:MUTED,letterSpacing:"0.06em",borderLeft:`1px solid ${SEP}`,paddingLeft:12}}>{today}</div>
        </div>

        <div style={{marginBottom:"1.5rem"}}>
          <Row first label="Atendido por *" right={<Sel value={asesor} onChange={setAsesor} w={200}><option value="">Seleccionar</option>{ATIENDE.map(a=><option key={a} value={a}>{a}</option>)}</Sel>}/>
        </div>

        <div style={{marginBottom:"1.5rem"}}>
          <SHead>Cliente</SHead>
          <Row first label="Nombre del cliente *" right={<input type="text" value={name} onChange={e=>setName(e.target.value)} placeholder="Nombre completo" style={{padding:"9px 12px",border:"1px solid rgba(0,0,0,.12)",borderRadius:10,fontSize:14,background:"#f5f5f7",fontFamily:"inherit",width:200}}/>}/>
          <Row label="Teléfono *" right={<input type="tel" value={tel} onChange={e=>setTel(e.target.value)} placeholder="55 1234 5678" style={{padding:"9px 12px",border:"1px solid rgba(0,0,0,.12)",borderRadius:10,fontSize:14,background:"#f5f5f7",fontFamily:"inherit",width:200}}/>}/>
          <Row label="Marca *" right={<Sel value={brand} onChange={v=>{setBrand(v);setModel("");}} w={165}><option value="">Seleccionar</option>{Object.keys(BRANDS).sort().map(b=><option key={b} value={b}>{b}</option>)}</Sel>}/>
          <Row label="Modelo *" right={<Sel value={model} onChange={chooseModel} disabled={!brand} w={165}><option value="">Seleccionar</option>{models.map(m=><option key={m} value={m}>{m}</option>)}</Sel>}/>
          <Row label="Año *" right={<Sel value={year} onChange={setYear} w={110}><option value="">Año</option>{YEARS.map(y=><option key={y} value={y}>{y}</option>)}</Sel>}/>
        </div>

        {multi&&(
          <div style={{display:"flex",gap:6,marginBottom:"2rem",background:"#f5f5f7",padding:5,borderRadius:14}}>
            {opts.map((o,i)=>{
              const t=totals(o); const on=active===i;
              return(
                <button key={i} onClick={()=>setActive(i)} style={{flex:1,padding:"9px 8px",borderRadius:10,border:"none",cursor:"pointer",fontFamily:"inherit",background:on?"#fff":"transparent",boxShadow:on?"0 1px 3px rgba(0,0,0,.1)":"none"}}>
                  <div style={{fontSize:13,fontWeight:500,color:on?INK:MUTED}}>{OPT_NAMES[i]}</div>
                  <div style={{fontSize:11,color:MUTED,marginTop:1}}>{t.total>0?mxn(t.total):"—"}</div>
                </button>
              );
            })}
          </div>
        )}

        <OptionEditor o={opts[active]} set={n=>setOpt(active,n)}/>

        <div style={{marginTop:"2rem",display:"flex",justifyContent:"center",gap:20}}>
          {opts.length<3&&<button onClick={compareNew} style={{background:"none",border:"none",fontSize:14,color:INK,cursor:"pointer",fontFamily:"inherit",fontWeight:500}}>+ Comparar otra opción</button>}
          {multi&&<button onClick={()=>removeOpt(active)} style={{background:"none",border:"none",fontSize:14,color:"#b91c1c",cursor:"pointer",fontFamily:"inherit"}}>Quitar {OPT_NAMES[active]}</button>}
        </div>
      </div>

      {anyFilled&&(
        <div style={{position:"sticky",bottom:0,marginTop:"2rem",background:"rgba(255,255,255,0.85)",backdropFilter:"blur(20px)",WebkitBackdropFilter:"blur(20px)",borderTop:`1px solid ${SEP}`,paddingTop:"0.85rem",paddingBottom:"0.85rem"}}>
          {curTotal.items.length>0 && (
            <div style={{marginBottom:10}}>
              {curTotal.items.map((it,i)=>(
                <div key={i} style={{display:"flex",justifyContent:"space-between",fontSize:12.5,color:"#555",padding:"2px 0",gap:10}}>
                  <span style={{overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{it.label}</span>
                  <span style={{whiteSpace:"nowrap"}}>{mxn(it.price)}</span>
                </div>
              ))}
              <div style={{display:"flex",justifyContent:"space-between",fontSize:12.5,color:MUTED,padding:"4px 0 2px",borderTop:`1px solid ${SEP}`,marginTop:4}}>
                <span>Subtotal (sin IVA)</span><span>{mxn(curTotal.sub)}</span>
              </div>
              <div style={{display:"flex",justifyContent:"space-between",fontSize:12.5,color:MUTED,padding:"2px 0"}}>
                <span>IVA 16%</span><span>{mxn(curTotal.iva)}</span>
              </div>
            </div>
          )}
          {!puedeVer && (
            <div style={{fontSize:12,color:"#b91c1c",marginBottom:8,lineHeight:1.5}}>
              Para continuar, completa: {faltantes.join(" · ")}
            </div>
          )}
          <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",gap:16}}>
            <div>
              <div style={{fontSize:11,color:MUTED,textTransform:"uppercase",letterSpacing:"0.08em"}}>{multi?`${OPT_NAMES[active]} · total c/IVA`:"Total con IVA"}</div>
              <div style={{fontSize:26,fontWeight:500,color:INK,letterSpacing:"-0.5px",lineHeight:1.15}}>{mxn(curTotal.total)}</div>
            </div>
            <button onClick={()=>{if(puedeVer)setView("preview");}} disabled={!puedeVer} style={{padding:"13px 26px",borderRadius:100,border:"none",background:puedeVer?INK:"#c7c7cc",color:"#fff",fontSize:15,cursor:puedeVer?"pointer":"not-allowed",fontFamily:"inherit",whiteSpace:"nowrap"}}>
              Ver cotización →
            </button>
          </div>
        </div>
      )}

      <AdminGate onEnter={()=>setAdmin(true)}/>
    </div>
  );
}
