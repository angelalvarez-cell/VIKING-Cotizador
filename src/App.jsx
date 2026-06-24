import { useState, useMemo } from "react";

// ════════════════════════════════════════════════════════════════════
//  COTIZADOR VIKING BY GAV — versión producción
//  Las imágenes van en /public/img/ y se llaman por ruta local.
// ════════════════════════════════════════════════════════════════════

const IMG = {
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

const CAR_KEYWORDS = ["A1","A3","A4","A5","A6","A7","A8","S3","S4","S5","S6","S7","S8","RS3","RS5","RS6","RS7","R8","TT","Series","218","220","230","235","240","320","330","340","430","440","520","530","540","550","730","740","750","M2","M3","M4","M5","M8","M340","M440","M550","i4","i5","i7","Z4","CT4","CT5","CTS","Camaro","Corvette","Malibu","Onix","Aveo","Spark","Attitude","Charger","Challenger","Dart","California","Portofino","Roma","296","F8","812","GTC4Lusso","SF90","Daytona","500","Mustang","Model A","Fiesta","Focus","Fusion","G70","G80","G90","Accord","Civic","City","Fit","Insight","Elantra","Sonata","Accent","Ioniq 6","Q50","Q60","E-Type","F-Type","XF","XJ","XE","Stinger","Forte","Rio","K5","Diablo","Aventador","Gallardo","Murciélago","Murcielago","Huracán","Huracan","Countach","Revuelto","IS","ES","LC","LS","RC","GS","Ghibli","Quattroporte","MC20","GranTurismo","190 SL","300 SL","A 200","A-Class","A 35","A 45","B-Class","B 200","C 200","C 300","C-Class","C 43","C 63","CLA","CLE","CLS","E 200","E 350","E 450","E-Class","E 53","E 63","S 450","S 500","S 580","S-Class","SL","SLC","GT 43","GT 53","GT 63","Mazda3","Mazda2","MX-5","Miata","Mazda6","540C","570S","570GT","600LT","620R","720S","750S","765LT","Artura","GT","Senna","P1","Speedtail","Elva","Cooper","Clubman","Classic","Elise","Exige","Evora","Emira","Emeya","Evija","Altima","Sentra","Versa","Maxima","718 Boxster","718 Cayman","911","356","912","930","944","968","928","Panamera","Taycan","Clio","Mégane","Megane","Cobra","GT350","GT500","WRX","BRZ","Impreza","Legacy","Swift","Ciaz","Model 3","Model S","Camry","Corolla","GR86","GR Supra","Prius","Yaris","Avalon","Golf","Jetta","Passat","Polo","Virtus","S60","S90","V60","C40"];

function detectTipo(model){
  if(!model) return null;
  const m=model.toLowerCase();
  for(const kw of CAR_KEYWORDS){ if(m.includes(kw.toLowerCase())) return "coche"; }
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
const INK="#0a0a0a"; const MUTED="#86868b"; const SEP="rgba(0,0,0,0.07)";
const OPT_NAMES=["Opción A","Opción B","Opción C"];
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

  const layerStyle={position:"absolute",inset:0,width:"100%",height:"100%",objectFit:"contain"};

  return(
    <div style={{borderRadius:18,background:"linear-gradient(160deg,#fbfbfd,#f2f2f4)",marginBottom:"2rem",padding:"0.75rem"}}>
      <div style={{position:"relative",width:"100%",aspectRatio:"16 / 10",maxHeight:300,margin:"0 auto"}}>
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
  if(postesList.length>0)l.push({code:C.poste[o.tipo],label:`Kevlar postes ${postesList.join(", ")}`,price:P.poste[o.tipo]*postesList.length});
  if(o.carga&&o.tipo==="camioneta")l.push({code:C.carga,label:"Kevlar área de carga",price:P.carga});
  if(o.techo)l.push({code:C.techo[o.tipo],label:"Kevlar techo",price:P.techo[o.tipo]});
  return l;
}
function totals(o){const items=buildItems(o);const sub=items.reduce((s,i)=>s+i.price,0);const iva=Math.round(sub*.16);return{items,sub,iva,total:sub+iva};}

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

function PrintView({opts,name,vehicleStr,onBack}){
  const active=opts.filter(o=>buildItems(o).length>0);
  const multi=active.length>1;
  return(
    <div>
      <style>{`@media print{.np{display:none!important}.opt-sec{break-inside:avoid}}`}</style>
      <div className="np" style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:"1.5rem",paddingBottom:"1rem",borderBottom:`1px solid ${SEP}`}}>
        <button onClick={onBack} style={{background:"none",border:"none",fontSize:15,color:MUTED,cursor:"pointer",fontFamily:"inherit",padding:0}}>← Editar</button>
        <button onClick={()=>window.print()} style={{padding:"10px 24px",borderRadius:100,background:INK,color:"#fff",border:"none",fontSize:14,cursor:"pointer",fontFamily:"inherit"}}>Imprimir / Guardar PDF</button>
      </div>
      <div style={{background:"#fff",color:"#111",maxWidth:580}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:22,paddingBottom:18,borderBottom:"1.5px solid #111"}}>
          <div style={{display:"flex",alignItems:"center",gap:10}}><Shield size={36} color="#111"/><div><div style={{fontSize:22,fontWeight:500,letterSpacing:"0.18em",lineHeight:1}}>VIKING</div><div style={{fontSize:11,color:"#666",letterSpacing:"0.06em"}}>BY GAV</div></div></div>
          <div style={{textAlign:"right"}}><div style={{fontSize:20,fontWeight:500}}>Cotización</div><div style={{fontSize:12,color:"#888",marginTop:3}}>{today}</div></div>
        </div>
        <div style={{marginBottom:24,padding:"14px 16px",background:"#f7f7f5",borderRadius:10,display:"grid",gridTemplateColumns:"1fr 1fr",gap:"10px 24px"}}>
          {[["Cliente",name||"—"],["Vehículo",vehicleStr||"—"],["Fecha",today],["Vigencia","30 días"]].map(([l,v])=>(
            <div key={l}><div style={{fontSize:10,color:"#888",textTransform:"uppercase",letterSpacing:"0.08em",marginBottom:3}}>{l}</div><div style={{fontSize:14,fontWeight:500}}>{v}</div></div>
          ))}
        </div>
        {multi&&<div style={{fontSize:13,color:"#666",marginBottom:18}}>Esta cotización incluye {active.length} opciones de protección para que elijas la que mejor se ajuste a tus necesidades.</div>}
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
            </div>
          );
        })}
        <div style={{marginTop:20,paddingTop:14,borderTop:"1px solid #e5e5e3",fontSize:11,color:"#bbb",lineHeight:1.6}}>
          Precios en pesos mexicanos antes de IVA (16%). Vigencia 30 días. Garantía 5 años propietario original: cubre delaminación, burbujeo y defectos de instalación. No cubre accidentes, golpes ni vandalismo. No transferible. Viking by GAV no es blindaje balístico certificado.
        </div>
      </div>
    </div>
  );
}

export default function App(){
  const [view,setView]=useState("config");
  const [name,setName]=useState(""); const [brand,setBrand]=useState(""); const [model,setModel]=useState(""); const [year,setYear]=useState("");
  const [opts,setOpts]=useState([blankOpt()]);
  const [active,setActive]=useState(0);

  const models=brand&&BRANDS[brand]?BRANDS[brand]:[];
  const vehicleStr=[brand,model,year].filter(Boolean).join(" ");
  const anyFilled=opts.some(o=>buildItems(o).length>0);
  const multi=opts.length>1;
  const curTotal=totals(opts[active]);

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

  if(view==="preview") return <div style={{fontFamily:"-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif",maxWidth:600,margin:"0 auto",padding:"2rem 1rem"}}><PrintView opts={opts} name={name} vehicleStr={vehicleStr} onBack={()=>setView("config")}/></div>;

  return(
    <div style={{fontFamily:"-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif",maxWidth:600,margin:"0 auto",padding:"0 1rem 6rem",position:"relative"}}>
      <div style={{padding:"2rem 0 0"}}>
        <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:"2.5rem"}}>
          <Shield size={36} color={INK}/><div><div style={{fontSize:21,fontWeight:500,letterSpacing:"0.18em",color:INK,lineHeight:1}}>VIKING</div><div style={{fontSize:11,color:MUTED,letterSpacing:"0.06em"}}>BY GAV · {today}</div></div>
        </div>

        <div style={{marginBottom:"2.5rem"}}>
          <SHead>Cliente</SHead>
          <Row first label="Nombre" right={<input type="text" value={name} onChange={e=>setName(e.target.value)} placeholder="Nombre completo" style={{padding:"9px 12px",border:"1px solid rgba(0,0,0,.12)",borderRadius:10,fontSize:14,background:"#f5f5f7",fontFamily:"inherit",width:200}}/>}/>
          <Row label="Marca" right={<Sel value={brand} onChange={v=>{setBrand(v);setModel("");}} w={165}><option value="">Seleccionar</option>{Object.keys(BRANDS).sort().map(b=><option key={b} value={b}>{b}</option>)}</Sel>}/>
          <Row label="Modelo" right={<Sel value={model} onChange={chooseModel} disabled={!brand} w={165}><option value="">Seleccionar</option>{models.map(m=><option key={m} value={m}>{m}</option>)}</Sel>}/>
          <Row label="Año" right={<Sel value={year} onChange={setYear} w={110}><option value="">Año</option>{YEARS.map(y=><option key={y} value={y}>{y}</option>)}</Sel>}/>
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
        <div style={{position:"sticky",bottom:0,marginTop:"2rem",background:"rgba(255,255,255,0.82)",backdropFilter:"blur(20px)",WebkitBackdropFilter:"blur(20px)",borderTop:`1px solid ${SEP}`,padding:"1rem 0",display:"flex",alignItems:"center",justifyContent:"space-between",gap:16}}>
          <div>
            <div style={{fontSize:11,color:MUTED,textTransform:"uppercase",letterSpacing:"0.08em"}}>{multi?`${OPT_NAMES[active]} · total c/IVA`:"Total con IVA"}</div>
            <div style={{fontSize:26,fontWeight:500,color:INK,letterSpacing:"-0.5px",lineHeight:1.15}}>{mxn(curTotal.total)}</div>
          </div>
          <button onClick={()=>setView("preview")} style={{padding:"13px 26px",borderRadius:100,border:"none",background:INK,color:"#fff",fontSize:15,cursor:"pointer",fontFamily:"inherit",whiteSpace:"nowrap"}}>
            Ver cotización →
          </button>
        </div>
      )}
    </div>
  );
}
