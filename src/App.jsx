/* ================= Catálogo de datos del Tablero Viking =================
   Marcas/modelos (idéntico al Cotizador), listas de detección coche/camioneta
   y datos DEMO. Separado del componente para mantener el código ligero. */

// Base de vehículos — IDÉNTICA al Cotizador Viking (objeto BRANDS).
export const VEHICULOS = {
  "Acura":["MDX Base","MDX A-Spec","RDX","TLX","Integra"],
  "Aston Martin":["DBX","DBX707","DB11","DB12","DBS","Vantage"],
  "Audi":["A1","A1 S Line","A3","A3 Sedan","A4","A4 Allroad","A5 Coupé","A5 Sportback","A6","A6 Allroad","A7","A8","A8 L","S3","S4 Sedan","S5","S6 Sedan","S7","S8","RS3","RS5","RS6 Avant","RS7","RS Q3","RS Q8","SQ5","SQ7","SQ8","Q2","Q3","Q4 e-tron","Q5","Q5 Elite","Q5 Sportback","Q7","Q8","Q8 e-tron","e-tron SUV","e-tron GT","RS e-tron GT","R8 V10","R8 V10 Performance","TT","TT RS"],
  "Austin":["SP Coupe","Healey","Mini Classic"],
  "Bentley":["Bentayga","Bentayga S","Bentayga EWB","Continental GT","Continental GTC","Flying Spur"],
  "BMW":["218 Gran Coupé","220i","M2 Competition","M2 CS","M235i","M240i","320i","330i","330e","M340i","M440i xDrive","430i","520i","530i","540i","550i","M550i","730i","740i","750i","M3","M3 Competition","M4","M4 Competition","M5","M5 Competition","M8","i4","i5","i7","iX","iX xDrive50","X1","X2","X3","X3 M","X3 M40i","X4 M40i","X5 xDrive40i","X5 xDrive45e","X5 xDrive50i","X5 xDrive60i","X5 M50i","X5 M60i","X5 M Competition","X6 M50i","X6 M60i","X6 M Competition","X7","XM","Z4","Z4 M40i"],
  "Buick":["Enclave","Enclave Avenir","Encore","Envision"],
  "BYD":["Atto 3 EV","Dolphin","Dolphin Mini","Han EV","Seal","Seal U","Song Plus DM-i","Shark Pick Up","Tang EV","Yuan Plus","King DM-i"],
  "Cadillac":["ATS","CT4","CT5","CTS Coupe","Escalade","Escalade Premium Luxury","Escalade V","Escalade ESV","Escalade ESV-V","Escalade IQ","Lyriq","XT4","XT5","XT6"],
  "Chevrolet":["Aveo","Blazer","Camaro","Captiva","Cavalier","Cheyenne","Cheyenne High Country","Colorado","Corvette","Equinox","Express","Malibu","Onix","Silverado 1500","Silverado 1500 High Country","Silverado 2500","Spark","Suburban LS","Suburban LT","Suburban Premier","Suburban High Country","Suburban RST","Tahoe LS","Tahoe LT","Tahoe Premier","Tahoe High Country","Tahoe RST","Traverse","Trailblazer","Trax"],
  "Cupra":["Ateca","Formentor","León","Tavascan"],
  "Dodge":["Attitude SE","Charger","Challenger","Dart","Durango GT","Durango R/T","Durango SRT","Neon"],
  "DS":["DS3","DS7"],
  "Ferrari":["California","California T","Portofino","Portofino M","Roma","Roma Spider","296 GTB","296 GTS","F8 Tributo","F8 Spider","FF","GTC4Lusso","GTC4Lusso T","SF90 Stradale","SF90 Spider","812 Superfast","812 GTS","Purosangue","Daytona SP3"],
  "Fiat":["500","500X","Mobi","Pulse"],
  "Ford":["Bronco","Bronco Sport","Edge","Escape","Expedition XLT","Expedition Limited","Expedition Platinum","Expedition Max","Explorer XLT","Explorer Limited","Explorer ST","Explorer Platinum","F-150","F-150 Lariat","F-150 Raptor","F-150 Raptor R","F-150 Platinum","F-250","Fiesta","Focus","Fusion","Lobo","Lobo Lariat","Lobo Platinum","Lobo Raptor","Maverick Lariat","Model A","Mustang","Mustang GT","Mustang Shelby GT500","Ranger","Ranger Lariat","Ranger Raptor","Transit"],
  "Genesis":["G70","G80","G90","GV70","GV80"],
  "GMC":["Acadia","Canyon","Hummer EV SUV","Hummer EV Pickup","Savana","Sierra 1500","Sierra 1500 AT4","Sierra 1500 Denali","Sierra 2500","Sierra 2500 Denali","Terrain","Yukon SLE","Yukon SLT","Yukon AT4","Yukon Denali","Yukon Denali Ultimate","Yukon XL","Yukon XL Denali"],
  "Honda":["Accord","City","Civic","Civic Type R","CR-V","Fit","HR-V","Insight","Odyssey","Passport","Pilot EX-L","Pilot","Ridgeline"],
  "Hyundai":["Accent","Creta","Elantra","Ioniq 5","Ioniq 6","Kona","Palisade","Santa Fe","Sonata","Tucson"],
  "Ineos":["Grenadier","Grenadier Quartermaster"],
  "Infiniti":["Q50","Q50 Sport","Q60","Q60 Red Sport","QX50","QX55","QX60 Pure","QX60 Luxe","QX60 Autograph","QX60","QX80","QX80 Luxe","QX80 Sensory"],
  "Jaguar":["E-Type","E-Pace P250 S","F-Pace","F-Type SVR","I-Pace","XF","XJ"],
  "Jeep":["Cherokee","Cherokee Latitude","Cherokee Limited","Cherokee Laredo","Cherokee Trailhawk","Commander","Compass","Compass Limited","Gladiator Rubicon","Gladiator Sport","Gladiator Mojave","Grand Cherokee","Grand Cherokee Laredo","Grand Cherokee Limited","Grand Cherokee Overland","Grand Cherokee Summit","Grand Cherokee Trailhawk","Grand Cherokee L Laredo","Grand Cherokee L Limited","Grand Cherokee L Overland","Grand Cherokee L Summit","Grand Cherokee 4xe","Grand Wagoneer","Wrangler Sport","Wrangler Sahara","Wrangler Rubicon","Wrangler 4xe"],
  "Kia":["Carnival","EV6","Niro","Seltos LX","Seltos SX","Sorento","Sportage LX","Sportage SX","Stinger","Stonic","Telluride SX"],
  "Lamborghini":["Aventador LP 700-4","Aventador S","Aventador SVJ","Aventador Roadster","Countach","Diablo","Gallardo LP 560-4","Gallardo LP 570-4 Superleggera","Huracán EVO","Huracán STO","Huracán Tecnica","Huracán Sterrato","Murciélago LP 640","Murciélago LP 640 Roadster","Revuelto","Urus","Urus S","Urus Performante"],
  "Land Rover":["Defender 90","Defender 110","Defender 130","Discovery","Discovery Sport","Range Rover","Range Rover SE","Range Rover HSE","Range Rover Autobiography","Range Rover SV","Range Rover Evoque","Range Rover Sport","Range Rover Sport SE","Range Rover Sport HSE","Range Rover Sport Dynamic","Range Rover Sport SVR","Range Rover Sport SV","Range Rover Sport PHEV","Range Rover Velar"],
  "Lexus":["ES","GS","GX","IS","LC","LX","NX","RX","RX 450h","TX","UX"],
  "Lincoln":["Aviator Reserve","Aviator","Corsair","Navigator","Navigator L Reserve","Nautilus Reserve","Nautilus"],
  "Lotus":["Elise","Exige","Evora","Emira","Eletre","Emeya","Evija"],
  "Maserati":["Ghibli","Ghibli Hybrid","GranCabrio","GranTurismo","Grecale","Levante","MC20","Quattroporte"],
  "Maybach":["S 580","S 650","GLS 600"],
  "Mazda":["CX-3 i Sport","CX-30 Base","CX-30 Turbo","CX-5","CX-50","CX-60","CX-90","CX-90 PHEV","Mazda2","Mazda3","Mazda6","MX-5 Miata Sport","MX-5 Miata RF"],
  "McLaren":["540C","570S","570GT","600LT","620R","720S","750S","765LT","Artura","GT","Senna","P1","Speedtail","Elva"],
  "Mercedes-Benz":["190 SL","300 SL","A 200","A-Class","B-Class","C 200","C 300","C-Class","CLA 200","CLA 250","CLE 300 Coupé","CLE 450 4MATIC Coupé","CLS 450","E 200","E 350","E 450","E-Class","EQA","EQB","EQC","EQE","EQE SUV","EQS","EQS SUV","G 500","G 550","GLA 200","GLA 250","GLB 200","GLB 250","GLC 300","GLC 63 AMG","GLE 350","GLE 450","GLE 53 AMG","GLE 63 S","GLS 450","GLS 580","ML400 4MATIC","S 450","S 500","S 580","S-Class","SL 500","SL 550","SL 55 AMG Kompressor","SLC","Sprinter","V-Class"],
  "Mercedes-AMG":["A 35 AMG","A 45 AMG S","C 43 AMG","C 63 AMG","C 63 S E Performance","CLA 35 AMG","CLA 45 AMG","CLE 53 AMG","E 53 AMG","E 63 S AMG","G 63 AMG","GLA 35 AMG","GLA 45 AMG","GLB 35 AMG","GLC 43 AMG","GLC 63 AMG","GLE 53 AMG","GLE 63 AMG S","GLS 63 AMG","GT 43","GT 53","GT 63 S","SL 43 AMG","SL 55 AMG","SL 63 AMG"],
  "MG":["RX5","HS","ZS EV","MG5"],
  "MINI":["Cooper Classic","Cooper S Hatch","Cooper GP","Cooper JCW","Cooper JCW Coupe","Countryman","Clubman"],
  "Mitsubishi":["Outlander","Outlander PHEV GLX","Eclipse Cross","L200","Montero Sport"],
  "Nissan":["Altima","Armada","Frontier","Kicks","Leaf","Maxima","Murano","NP300","Pathfinder","Rogue","Sentra","Versa","X-Trail"],
  "Porsche":["718 Boxster","718 Boxster S","718 Boxster GTS","718 Cayman","718 Cayman S","718 Cayman GTS","718 Cayman GT4","911 Carrera","911 Carrera T","911 Carrera S","911 Carrera 4","911 Carrera 4S","911 Carrera GTS","911 Carrera S Cabriolet","911 Carrera 4 GTS","911 Targa 4","911 Targa 4S","911 Targa 4 GTS","911 Turbo","911 Turbo S","911 GT3","911 GT3 RS","911 GT3 Touring","911 GT2 RS","911 Dakar","911 S/T","356","912","930 Turbo","944","944 Turbo","968","928","Cayenne","Cayenne S","Cayenne GTS","Cayenne Turbo","Cayenne Turbo GT","Cayenne S E-Hybrid","Cayenne Turbo E-Hybrid","Cayenne Coupé","Macan","Macan S","Macan GTS","Macan Turbo","Macan Electric","Panamera","Panamera 4","Panamera 4S","Panamera GTS","Panamera Turbo","Panamera Turbo S E-Hybrid","Taycan","Taycan 4S","Taycan GTS","Taycan Turbo","Taycan Turbo S","Taycan Cross Turismo"],
  "Renault":["Captur","Clio Sport","Koleos","Kardian","Duster","Logan","Mégane","Sandero"],
  "RAM":["1500","2500","3500","TRX"],
  "Rivian":["R1S","R1T"],
  "Rolls-Royce":["Cullinan","Cullinan Black Badge","Ghost","Ghost Black Badge","Phantom","Spectre"],
  "SEAT":["Arona","Ateca","Ibiza","León","Tarraco"],
  "Shelby":["Cobra","GT350","GT500"],
  "Subaru":["Ascent","BRZ","Crosstrek","Forester","Impreza","Legacy","Outback","WRX","WRX STI"],
  "Suzuki":["Baleno","Ciaz","Grand Vitara","Jimny GLX","Swift","Vitara","S-Cross"],
  "Tesla":["Model 3 Standard Range Plus","Model 3 Long Range","Model S","Model S Long Range","Model S Plaid","Model X","Model Y Long Range","Cybertruck Single Motor RWD","Cybertruck Tri Motor AWD"],
  "Toyota":["4Runner TRD Pro","Avalon","Camry","Corolla","GR86","GR Supra","Highlander XLE","Highlander Hybrid","Hiace","Hilux","Land Cruiser","Land Cruiser Prado","Prius LE","Prius Prime","RAV4 LE","RAV4 XLE","RAV4 Hybrid","Sequoia","Sienna LE","Sienna Platinum","Tacoma SR","Tacoma Limited","Tundra","Yaris"],
  "Volkswagen":["Amarok Comfortline","Amarok Highline","Amarok Panamericana","Atlas Cross Sport Comfortline","Atlas Cross Sport Highline","Crafter","Golf GTI","Golf R","Jetta Trendline","Jetta Comfortline","Jetta Highline","Jetta GLI","Karoq","Kodiaq","Passat","Polo","T-Cross","T-Roc","Taos","Teramont Trendline","Teramont Comfortline","Teramont Highline","Tiguan Trendline","Tiguan Comfortline","Tiguan Highline","Tiguan R-Line","Touareg","Vento","Virtus"],
  "Volvo":["C40","EX30","EX90","S60","S90","V60","XC40","XC60","XC90"],
  "Otro":["Otro modelo"],
};
export const MARCAS = Object.keys(VEHICULOS);

// Detección coche/camioneta — misma lógica y listas que el Cotizador.
export const TRUCK_WORDS = ["escalade","suburban","tahoe","yukon","sierra","silverado","colorado","canyon","hummer","cayenne","macan","urus","bentayga","dbx","purosangue","levante","grecale","range rover","defender","discovery","velar","evoque","grenadier","x1","x2","x3","x4","x5","x6","x7","ix","gla","glb","glc","gle","gls","g 500","g 550","g 63","g-class","eqb","eqc","eqe suv","eqs suv","q2","q3","q4","q5","q7","q8","e-tron","sq5","sq7","sq8","rs q","rx","nx","gx","lx","ux","qx","mdx","rdx","explorer","expedition","bronco","escape","edge","maverick","f-150","f-250","ranger","f150","f250","tahoe","traverse","blazer","trax","trailblazer","equinox","captiva","cr-v","crv","hr-v","hrv","pilot","passport","ridgeline","tucson","santa fe","palisade","creta","kona","rogue","murano","pathfinder","armada","kicks","x-trail","frontier","np300","rav4","highlander","4runner","sequoia","tacoma","tundra","land cruiser","prado","sienna","hilux","odyssey","cx-3","cx-30","cx-5","cx-50","cx-60","cx-90","cx3","cx30","cx5","cx50","cx90","tiguan","teramont","taos","touareg","atlas","t-roc","amarok","t-cross","compass","cherokee","wrangler","gladiator","commander","wagoneer","grand cherokee","telluride","sorento","sportage","seltos","carnival","ev6","stonic","niro","xc40","xc60","xc90","c40","ex30","ex90","outback","forester","ascent","crosstrek","outlander","montero","eclipse cross","l200","model x","model y","cybertruck","r1s","r1t","grand wagoneer","navigator","aviator","corsair","nautilus","enclave","encore","envision","lyriq","xt4","xt5","xt6","acadia","terrain","ateca","tarraco","arona","formentor","tavascan","kodiaq","karoq","atto","tang","song","yuan","seal u","dolphin","shark","grenadier","jimny","vitara","s-cross","bronco","eletre","dbx","gv70","gv80","g70 shooting","qx50","qx55","qx60","qx80","i-pace","e-pace","f-pace","ds7","ds3","duster","koleos","kardian","captur","grand vitara","rx5","hs","zs ev","mg5 wagon","outlander","l200","npr","hiace","transit","sprinter","crafter","express","savana","cheyenne","lobo","cullinan","escalade v","escalade iq","tx "];
export const CAR_WORDS = ["sedan","sedán","coupe","coupé","cabrio","cabriolet","spider","spyder","roadster","convertible","hatch","liftback","a1","a3","a4","a5","a6","a7","a8","s3","s4","s5","s6","s7","s8","rs3","rs5","rs6","rs7","r8","tt","218","220","228","230","235","240","320","330","340","430","440","520","530","540","550","730","740","750","m2","m3","m4","m5","m8","m235","m240","m340","m440","m550","i4","i5","i7","z4","serie","ct4","ct5","cts","ats","camaro","corvette","malibu","onix","aveo","spark","cavalier","attitude","charger","challenger","dart","neon","california","portofino","roma","296","f8","812","gtc4","sf90","daytona","ff","500","mustang","model a","fiesta","focus","fusion","gt350","gt500","cobra","g70","g80","g90","stinger","accord","civic","city","fit","insight","integra","tlx","elantra","sonata","accent","ioniq 5","ioniq 6","verna","q50","q60","e-type","f-type","xf","xj","xe","i-pace","diablo","aventador","gallardo","murciélago","murcielago","huracán","huracan","countach","revuelto","is ","es ","lc ","ls ","rc ","gs ","is3","is2","es3","es2","ghibli","quattroporte","mc20","granturismo","grancabrio","190 sl","300 sl","clase a","clase c","clase e","clase s","a 35","a 45","a 200","a 250","c 200","c 300","c 43","c 63","cla","cle","cls","e 200","e 350","e 450","e 53","e 63","s 450","s 500","s 580","sl 43","sl 55","sl 63","sl 500","sl 550","slc","amg gt","gt 43","gt 53","gt 63","mazda2","mazda3","mazda6","mx-5","miata","540c","570s","570gt","600lt","620r","720s","750s","765lt","artura","senna","speedtail","elva","p1","cooper","clubman","mini classic","elise","exige","evora","emira","emeya","evija","altima","sentra","versa","maxima","leaf","718","911","356","912","930","944","968","928","panamera","taycan","clio","mégane","megane","logan","sandero","wrx","brz","impreza","legacy","wrx sti","swift","ciaz","baleno","model 3","model s","fiat 500","sp coupe","healey","camry","corolla","gr86","gr supra","prius","yaris","avalon","86","golf","jetta","passat","polo","virtus","vento","s60","s90","v60","mg5","continental","flying spur","phantom","ghost","spectre","db11","db12","dbs","vantage"];

/* ================= Datos DEMO (solo sin backend) ================= */
export const AUTOS_DEMO = [
  {
    id: 1, tipo: "Nuevo", marca: "Toyota", modelo: "Land Cruiser", tipoVeh: "SUV", anio: 2025, placa: "LZR-77-40", orden: "VK-1042",
    cliente: "A. Fuentes", bahia: "B1", entregaFecha: "2026-07-10", entregaHora: "18:00", nivel: "Viking Plus",
    paquete: { label: "Protección integral", codigos: ["VK106", "VK108", "VK110", "VK130×4", "VK132"] },
    glass: { "Parabrisas": "Viking Plus", "Lateral del. izq.": "Viking Plus", "Lateral del. der.": "Viking Plus", "Lateral tras. izq.": "Viking Plus", "Lateral tras. der.": "Viking Plus", "Aleta tras. izq.": "Viking Plus", "Aleta tras. der.": "Viking Plus", "Medallón": "Viking Plus" },
    ahumado: { "Lateral tras. izq.": true, "Lateral tras. der.": true, "Aleta tras. izq.": true, "Aleta tras. der.": true, "Medallón": true },
    kevlar: ["Puertas del.", "Puertas tras.", "Poste B", "Poste C", "Cajuela / 5ª puerta"], kevlarHito: 2, vidriosNuevo: true, kevlarNuevo: false,
    hito: 5, crew: ["Vidrios 1", "Vidrios 2"], motivo: "", notas: "Faltan 2 laterales por montar.",
  },
  {
    id: 2, tipo: "Nuevo", marca: "Tesla", modelo: "Model X", tipoVeh: "SUV", anio: 2024, placa: "MPT-08-93", orden: "VK-1043",
    cliente: "Const. Vega", bahia: "B2", entregaFecha: "2026-07-10", entregaHora: "16:00", nivel: "Viking Plus",
    paquete: { label: "4 laterales", codigos: ["VK104"] },
    glass: { "Lateral del. izq.": "Viking Plus", "Lateral del. der.": "Viking Plus", "Lateral tras. izq.": "Viking Plus", "Lateral tras. der.": "Viking Plus" },
    ahumado: { "Lateral del. izq.": true, "Lateral del. der.": true },
    kevlar: [], kevlarHito: 0, vidriosNuevo: true, kevlarNuevo: false, hito: 4, crew: ["Líder de Taller"], motivo: "", notas: "Sin marco — cuidado con sensores.",
  },
  {
    id: 3, tipo: "Garantía", marca: "Land Rover", modelo: "Range Rover Sport", tipoVeh: "SUV", anio: 2023, placa: "KTM-55-08", orden: "VK-0977",
    cliente: "M. Ibarra", bahia: "B3", entregaFecha: "2026-07-09", entregaHora: "18:00", nivel: "Viking Plus",
    paquete: { label: "Garantía", codigos: [] },
    glass: { "Lateral tras. izq.": "Viking Plus" }, ahumado: {},
    kevlar: [], kevlarHito: 0, vidriosNuevo: false, kevlarNuevo: false, hito: 1, crew: ["Kevlar", "Asistente"],
    motivo: "Delaminación en lateral tras. izq. — deslaminar y rehacer", notas: "Vidrio en base de datos, sin escaneo.",
  },
  {
    id: 4, tipo: "Nuevo", marca: "Chevrolet", modelo: "Suburban", tipoVeh: "SUV", anio: 2023, placa: "JGH-42-15", orden: "VK-1045",
    cliente: "R. Delgado", bahia: "B4", entregaFecha: "2026-07-16", entregaHora: "18:00", nivel: "Viking Plus",
    paquete: { label: "Cristales completos + Kevlar", codigos: ["VK106", "VK108", "VK110", "VK130×4"] },
    glass: { "Parabrisas": "Viking Plus", "Lateral del. izq.": "Viking Plus", "Lateral del. der.": "Viking Plus", "Lateral tras. izq.": "Viking Plus", "Lateral tras. der.": "Viking Plus", "Aleta tras. izq.": "Viking Plus", "Aleta tras. der.": "Viking Plus", "Medallón": "Viking Plus" },
    ahumado: {}, kevlar: ["Puertas del.", "Puertas tras."], kevlarHito: 1, vidriosNuevo: false, kevlarNuevo: true,
    hito: 2, crew: ["Técnico Digital"], motivo: "", notas: "Moldes de Kevlar en base — corte directo CNC.",
  },
];
