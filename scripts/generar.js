// Generador del catálogo base GAV.
// Uso: node scripts/generar.js  (lee src/catalogo.js + scripts/familias.js, escribe src/vehiculos_meta.js)
// Ejecutar SIEMPRE tras editar catalogo.js o familias.js: si no, metadata y catálogo quedan desincronizados.
const fs=require('fs');
const FAMILIAS=require('./familias.js');
const path=require('path');
const OUT=process.env.GAV_SRC||path.join(__dirname,'..','src');
// Política de año: se deriva del reloj, no se fija a mano. Se admite el año-modelo siguiente
// (las armadoras venden el modelo del año próximo dentro del año en curso).
const ANIO_ACTUAL=new Date().getFullYear()+1;

// ── 1. Fuente única: BRANDS ──
let src=fs.readFileSync(OUT+'/catalogo.js','utf8');
const s=src.indexOf('const BRANDS');const sl=src.slice(s);const e=sl.indexOf('};');
const BRANDS=eval('('+sl.slice(0,e+2).replace(/^const BRANDS\s*=\s*/,'').replace(/;\s*$/,'')+')');
const keys=Object.keys(BRANDS).sort((a,b)=>a==='Otro'?1:b==='Otro'?-1:a.localeCompare(b,'es'));

// ── 2. Tipo: heurística + overrides curados ──
const {detectTipo}=(()=>{
  // Sólo la parte heurística de deteccion.js (hasta "Tipo canónico"): el resto depende de esta misma metadata.
  let d=fs.readFileSync(OUT+'/deteccion.js','utf8');
  const corte=d.indexOf('// Tipo canónico');
  d=(corte>0?d.slice(0,corte):d).replace(/^import .*$/mg,'').replace(/^export /mg,'');
  const m={}; new Function('m', d+'\nm.detectTipo=detectTipo;')(m); return m;
})();
const TIPO_OVERRIDE={
 'Kia|Stinger GT Tribute Edition':'coche','Lincoln|Town Car':'coche','Rolls-Royce|Phantom Series II':'coche','Rolls-Royce|Ghost Series II':'coche',
 'Rolls-Royce|Phantom Extended Series II':'coche','Genesis|G70 Shooting Brake':'coche','Bestune|T99':'camioneta','Bestune|T77':'camioneta','Bestune|NAT':'camioneta',
 'Hyundai|Ioniq 5':'camioneta','Hyundai|Ioniq 5 N':'camioneta','Hyundai|Ioniq 5 N Line':'camioneta','Peugeot|408':'camioneta','Peugeot|408 GT':'camioneta',
 'BMW|iX M60':'camioneta','Volkswagen|ID.4 GTX':'camioneta','Omoda|C5 GT':'camioneta',
 'Automobili Pininfarina|B95':'coche','Zeekr|7GT':'coche',
};
// ── 3. Carrocería: sólo se afirma cuando hay evidencia en el nombre; si no, "por confirmar" ──
const CARROCERIA_OVERRIDE={
 'BMW|iX M60':'SUV','Zeekr|7GT':'wagon/shooting brake','Genesis|G70 Shooting Brake':'wagon/shooting brake','Mercedes-Benz|CLA 250 Shooting Brake':'wagon/shooting brake',
 'Cadillac|CTS-V Wagon':'wagon/shooting brake','Audi|RS2 Avant':'wagon/shooting brake','Audi|A4 Avant':'wagon/shooting brake','Audi|RS4 Avant':'wagon/shooting brake',
 'Audi|RS6 Avant':'wagon/shooting brake','Audi|RS6 Avant GT':'wagon/shooting brake','Audi|RS6 Avant Performance':'wagon/shooting brake',
 'BMW|M3 Touring':'wagon/shooting brake','BMW|M5 Touring':'wagon/shooting brake','Alpina|B3 Touring':'wagon/shooting brake','Alpina|B5 Touring':'wagon/shooting brake',
 'Volkswagen|Golf Variant':'wagon/shooting brake','Volkswagen|Passat Variant':'wagon/shooting brake','SEAT|León Sportstourer':'wagon/shooting brake','Cupra|León VZ Sportstourer':'wagon/shooting brake',
 'Volvo|V60':'wagon/shooting brake','Volvo|V40':'wagon/shooting brake','Volvo|V70 R':'wagon/shooting brake','Volvo|V60 Cross Country':'wagon/shooting brake','Volvo|V60 Polestar Engineered':'wagon/shooting brake',
 'Porsche|Taycan Cross Turismo':'wagon/shooting brake','Porsche|Taycan Sport Turismo':'wagon/shooting brake','Porsche|Panamera Sport Turismo':'wagon/shooting brake',
 'Rolls-Royce|Camargue':'coupé','Automobili Pininfarina|B95':'convertible','Mercedes-Benz|300 SL Gullwing':'coupé','Mercedes-Benz|300 SL':'coupé','Volkswagen|ID.4 GTX':'SUV','Omoda|C5 GT':'SUV','Chevrolet|El Camino':'pickup','Chevrolet|SSR':'pickup','Subaru|BRAT':'pickup','Subaru|Baja':'pickup',
};
for(const m of ['Continental GTC','Continental GTC Speed','Continental GTC V8','Continental GTC Mulliner','Azure','Bacalar','Batur Convertible','Continental GT Speed Convertible']) CARROCERIA_OVERRIDE['Bentley|'+m]='convertible';
for(const m of ['Corniche','Dawn','Dawn Black Badge','Silver Dawn']) CARROCERIA_OVERRIDE['Rolls-Royce|'+m]='convertible';
for(const m of ['Boxster','718 Boxster','718 Boxster S','718 Boxster GTS','718 Boxster Spyder','718 Boxster Spyder RS','911 Cabriolet']) CARROCERIA_OVERRIDE['Porsche|'+m]='convertible';
for(const m of ['SLK','SLK 200','SLK 250','SLK 350','SLC','SLC 300','190 SL','230 SL','250 SL','300 SL','280 SL Pagoda']) CARROCERIA_OVERRIDE['Mercedes-Benz|'+m]='convertible';
for(const m of ['Z1','Z3','Z4','Z4 M40i','Z4 sDrive30i','Z4 M40i Handschalter','Z8']) CARROCERIA_OVERRIDE['BMW|'+m]='convertible';
for(const m of ['Elise','Elise S','Elise Cup 250','Exige','Evija','Seven','2-Eleven','3-Eleven']) CARROCERIA_OVERRIDE['Lotus|'+m]='convertible';
for(const m of ['Plus Four','Plus Six','Plus 8','Super 3','3 Wheeler','Aero 8']) CARROCERIA_OVERRIDE['Morgan|'+m]='convertible';
for(const m of ['MGA','MGB','MGC','Midget','MG TD','MG TF','MGF','RV8','Cyberster']) CARROCERIA_OVERRIDE['MG|'+m]='convertible';
for(const m of ['TR3','TR4','TR6','TR7','TR8','Spitfire','Spitfire Mk IV','Stag']) CARROCERIA_OVERRIDE['Triumph|'+m]='convertible';
for(const m of ['Austin-Healey 3000','Austin-Healey Sprite','Austin-Healey Sprite Mk I','Healey']) CARROCERIA_OVERRIDE['Austin|'+m]='convertible';
for(const m of ['E-Type','XK120','XK140','XK150','C-Type','D-Type']) CARROCERIA_OVERRIDE['Jaguar|'+m]='convertible';
CARROCERIA_OVERRIDE['Fiat|124 Spider']='convertible'; CARROCERIA_OVERRIDE['Fiat|Barchetta']='convertible';
CARROCERIA_OVERRIDE['Alfa Romeo|Spider Duetto']='convertible'; CARROCERIA_OVERRIDE['Alfa Romeo|Spider']='convertible';
CARROCERIA_OVERRIDE['Mercedes-AMG|SL 43 AMG']='convertible'; CARROCERIA_OVERRIDE['Mercedes-AMG|SL 55 AMG']='convertible'; CARROCERIA_OVERRIDE['Mercedes-AMG|SL 63 AMG']='convertible';

const tok=m=>m.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').split(/[\s\/\-\(\)]+/).filter(Boolean);
const has=(t,a)=>a.some(w=>t.includes(w));
const ph=(m,a)=>{const l=' '+m.toLowerCase()+' ';return a.some(p=>l.includes(' '+p+' '));};
const CONV=['cabrio','cabriolet','convertible','spyder','spider','roadster','volante','targa','speedster','aperta','cielo','drophead','droptail','barchetta'];
const PICKUP=['pickup','silverado','sierra','f-150','f150','f-250','f-350','f-100','lobo','ranger','maverick','tacoma','tundra','hilux','frontier','np300','colorado','canyon','amarok','saveiro','montana','tornado','s10','rampage','trx','gladiator','ridgeline','cybertruck','r1t','shark','poer','wingle','tunland','d-max','vigus','landtrek','oroch','alaskan','titan','estacas','luv','cheyenne','avalanche','courier','l200','bt-50','strada','toro','titano','hunter','frison','comanche','j10','blackwood','dakota','h100','quartermaster','velociraptor','mammoth'];
const PICKUP_PH=['pick up','santa cruz','hummer ev pickup','rich 6','rich 7','mark lt','raptor baja','f-150 super snake','ram 1500','ram 2500','ram 3500','ram 700','ram 1200'];
const VAN=['van','sprinter','transit','crafter','ducato','combi','urvan','hiace','express','savana','econoline','metris','vito','viano','staria','starex','trafic','kangoo','master','boxer','manager','expert','traveller','partner','rifter','caddy','transporter','eurovan','routan','touran','sharan','odyssey','sienna','carnival','sedona','pacifica','voyager','caravan','windstar','freestar','uplander','astro','nv350','apv','carry','fiorino','doblo','gratour','view','toano','villager','tm3','xpander','avanza','innova','ertiga','stargazer','carens','grandis','zafira','meriva','alhambra','mpv','sportvan','ichi','buzz'];
const VAN_PH=['town & country','grand avenue','id. buzz','active tourer','clase v','clase b','m3 van','hi-van','h-1','lm 350h'];
const COUPE_PH=['gran coupé','gran coupe'];
const HATCH=['hatch','hatchback','golf','polo','fiesta','yaris','march','swift','mazda2','onix','aveo','spark','beat','kwid','stepway','sandero','mobi','argo','uno','palio','ignis','baleno','i10','i20','i30','micra','note','tiida','versa','city','fit','rio','soul','sonic','matiz','dolphin','mg3','mg4','e10x','leaf','zoe','mini','cooper','caribe','pointer','derby','lupo','gol','fox','clio','206','207','208','205','307','308','306','a1','a3','118i','120i','135i','m135i','born','leon','ka','figo','focus','escort','vocho','beetle','chevy','astra','corsa','optra','integra','veloster','tiburon','celica','prelude','crx','rsx','impreza','wrx','brz','gr86','mx-3','323','protege','tercel','2cv','twingo','t03','02','03','2002','isetta','ypsilon','delta','a290','punto','bravo','panda','a35','geometry','box','nammi','ora','aion'];
const HATCH_PH=['serie 1','grand i10','k3 cross','civic hatchback','mini classic','renault 5','bolt ev','mazda3 hatch','yaris hatch','accent hatch','rio hatch','aveo hatch','onix hatch','fiesta hatch','figo hatch','up! gti','e-208'];
function carroceria(brand,m,tipo){
  const k=brand+'|'+m; if(CARROCERIA_OVERRIDE[k]) return CARROCERIA_OVERRIDE[k];
  const t=tok(m);
  if(has(t,CONV)||ph(m,['del sol','wind roadster'])) return 'convertible';
  if(t.includes('barchetta')) return 'convertible';
  if(tipo==='camioneta'){
    if(brand==='Chevrolet'&&t.includes('c10')) return 'pickup';
    if(has(t,PICKUP)||ph(m,PICKUP_PH)) return 'pickup';
    if(has(t,VAN)||ph(m,VAN_PH)) return 'van';
    return 'SUV';
  }
  if(t.includes('sedan')||t.includes('sedán')) return 'sedán';
  if(t.includes('coupe')||t.includes('coupé')||ph(m,COUPE_PH)) return 'coupé';
  if(has(t,HATCH)||ph(m,HATCH_PH)) return 'hatch/compacto';
  if(brand==='Fiat'&&(t.includes('500')||t.includes('500c')||t.includes('500e'))) return 'hatch/compacto';
  return 'por confirmar';
}
const VEHICLE_META={};
for(const b of keys) for(const m of BRANDS[b]){ if(b==='Otro') continue; const k=b+'|'+m; const tipo=TIPO_OVERRIDE[k]||detectTipo(m); VEHICLE_META[k]={tipo,carroceria:carroceria(b,m,tipo)}; }

// ── 4. GENERATIONS: familias materializadas a lista explícita de modelos del catálogo ──
const GENERATIONS=[]; const sinModelos=[]; const asignado={}; const colisiones=[];
for(const f of FAMILIAS){
  const cat=BRANDS[f.brand]||[];
  const modelos=cat.filter(m=>{
    const inc=f.incluye.some(p=>m===p||m.startsWith(p+' '));
    if(!inc) return false;
    if(f.excluye&&f.excluye.some(x=>m===x||m.includes(x))) return false;
    return true;
  });
  if(!modelos.length){ sinModelos.push(f.brand+' '+f.familia); continue; }
  for(const mo of modelos){ const k=f.brand+'|'+mo; if(asignado[k]) colisiones.push(k+' -> '+asignado[k]+' y '+f.familia); asignado[k]=f.familia; }
  const entry={brand:f.brand,familia:f.familia,modelos,rangos:f.rangos.map(([desde,hasta,gen])=>({desde,hasta,gen}))};
  if(f.limites){ const l={}; for(const k in f.limites) if(modelos.includes(k)) l[k]=f.limites[k]; if(Object.keys(l).length) entry.limites=l; }
  if(f.alias){ const a={}; for(const k in f.alias) if(modelos.includes(k)) a[k]=f.alias[k]; if(Object.keys(a).length) entry.alias=a; }
  GENERATIONS.push(entry);
}
// Traslapes: se conservan (son legítimos), pero la búsqueda los reporta como ambiguos
let traslapes=0;
for(const g of GENERATIONS) for(let i=0;i<g.rangos.length;i++) for(let j=i+1;j<g.rangos.length;j++){
  const a=g.rangos[i],b=g.rangos[j]; const aH=a.hasta??9999,bH=b.hasta??9999;
  if(a.desde<=bH&&b.desde<=aH) traslapes++;
}

// ── 5. Archivo generado ──
const fn=`
// Estado de identificación de la generación para marca/modelo/año.
// "identificado": una sola generación compatible con el rango de la familia Y los límites de esa versión.
// "ambiguo": varias candidatas (traslape real) -> el asesor confirma.
// "sin_informacion": familia no cubierta, año fuera de rango, o año anterior a la aparición de esa versión.
// limites[modelo] = [desde, hasta|null] acota la versión dentro de la familia (p. ej. Corvette E-Ray desde 2024).
// alias[modelo] renombra el código para una carrocería distinta (p. ej. M4 Cabrio: F82 -> F83).
// hasta:null = en producción; nunca se asigna a años posteriores a ANIO_ACTUAL.
// ANIO_ACTUAL se calcula al generar (año en curso + 1, para admitir el año-modelo siguiente).
// Regenerar cada año, o las generaciones abiertas dejan de cubrir los modelos nuevos.
export const ANIO_ACTUAL = ${ANIO_ACTUAL};

export function generacionDe(brand, model, year) {
  const vacio = (motivo, familia) => ({ estado: "sin_informacion", generacion: null, candidatos: [], familia: familia || null, motivo: motivo || null });
  const y = Number(year);
  if (!brand || !model || !Number.isInteger(y)) return vacio("año inválido: debe ser un año entero");
  const fam = GENERATIONS.find(g => g.brand === brand && g.modelos.includes(model));
  if (!fam) return vacio("familia no cubierta");
  const lim = fam.limites && fam.limites[model];
  if (lim) {
    const [ld, lh] = lim;
    if (y < ld || y > (lh ?? ANIO_ACTUAL)) return vacio("esa versión no existía en ese año", fam.familia);
  }
  const alias = (fam.alias && fam.alias[model]) || null;
  const candidatos = fam.rangos
    .filter(r => y >= r.desde && y <= (r.hasta ?? ANIO_ACTUAL))
    .map(r => (alias && alias[r.gen]) || r.gen);
  if (candidatos.length === 1) return { estado: "identificado", generacion: candidatos[0], candidatos, familia: fam.familia };
  if (candidatos.length > 1) return { estado: "ambiguo", generacion: null, candidatos, familia: fam.familia };
  return vacio("año fuera de los rangos conocidos", fam.familia);
}
`;
let out='// Metadata interna del catálogo base GAV. GENERADO por scripts/generar.js junto con catalogo.js.\n';
out+='// No editar a mano: si cambia catalogo.js hay que regenerar este archivo o quedan desincronizados.\n';
out+='// VEHICLE_META: "Marca|Modelo" -> { tipo: coche|camioneta, carroceria }.\n';
out+='//   carroceria: SUV | pickup | van | convertible | coupé | sedán | hatch/compacto | wagon/shooting brake | "por confirmar".\n';
out+='//   "por confirmar" = el nombre no da evidencia suficiente; NO asumir sedán al cotizar.\n';
out+='//   "Otro|Otro modelo" no lleva metadata: el asesor define tipo manualmente.\n';
out+='// GENERATIONS: familia con lista EXPLÍCITA de modelos (evita que una versión herede la tabla de otra familia).\n\n';
out+='export const VEHICLE_META = '+JSON.stringify(VEHICLE_META,null,0)+';\n\n';
out+='export const GENERATIONS = '+JSON.stringify(GENERATIONS,null,0)+';\n'+fn;
fs.writeFileSync(OUT+'/vehiculos_meta.js',out);

const cnt={};for(const k in VEHICLE_META)cnt[VEHICLE_META[k].carroceria]=(cnt[VEHICLE_META[k].carroceria]||0)+1;
console.log('Marcas',keys.length,'· Modelos',keys.reduce((n,k)=>n+BRANDS[k].length,0),'· META',Object.keys(VEHICLE_META).length);
console.log('Carrocería:',JSON.stringify(cnt));
console.log('Familias con modelos:',GENERATIONS.length,'· sin modelos en catálogo:',sinModelos.length?sinModelos.join(', '):'ninguna');
console.log('Modelos en dos familias:',colisiones.length?colisiones.join(' | '):'ninguno');
console.log('Rangos con traslape (se reportan como ambiguos):',traslapes);
