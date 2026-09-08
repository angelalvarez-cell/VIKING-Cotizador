import { useState, useEffect, Fragment } from "react";
import BRANDS, { YEARS } from "./catalogo.js";
import { tipoDe, carroceriaDe } from "./deteccion.js";
import { generacionDe } from "./vehiculos_meta.js";

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

// Señales de COCHE — sedán, coupé, hatch, deportivo, convertible.

const P = {
  lat:{2:{v:54000,p:66000},4:{v:89000,p:99000},6:{v:109000,p:119000}},
  med:{v:25000,p:28000},para:38000,quema:{n:22000,p:30000},puerta:25000,
  cajuela:{coche:16000,camioneta:20000},poste:{coche:9000,camioneta:10000},
  carga:22000,techo:{coche:12000,camioneta:15000},
};
const C={
  lat:{2:{v:"VK101",p:"VK102"},4:{v:"VK103",p:"VK104"},6:{v:"VK105",p:"VK106"}},
  med:{v:"VK107",p:"VK108"},para:"VK110",quema:{n:"VK111",p:"VK112"},puerta:"VK130",
  cajuela:{coche:"VK131",camioneta:"VK132"},poste:{coche:"VK133",camioneta:"VK134"},
  carga:"VK135",techo:{coche:"VK136",camioneta:"VK137"},
};
const mxn=n=>"$"+Math.round(n).toLocaleString("es-MX");

// ── Peso aproximado agregado (kg) por zona ────────────────────────────────
// Cifras de referencia para una camioneta grande; el coche se ajusta a la baja.
// Calibradas con la guía: todos los vidrios Plus ≈27 kg · Kevlar 4 puertas+cajuela ≈14 kg.
const W = {
  lateral: 3.0,   // por cristal lateral (Viking Plus)
  medallon: 3.0,  // medallón (Viking Plus)
  parabrisas: 5.0,
  quemaN: 4.0,    // quemacocos normal (Viking Plus)
  quemaP: 6.0,    // quemacocos panorámico (más grande)
  vikingFactor: 0.6,  // Viking (3.5 mm) pesa ~60% del Plus (6.0 mm)
  puerta: 2.5,    // Kevlar por puerta
  cajuela: 4.0,
  posteLado: 0.8, // Kevlar por lado de poste (cada poste = 2 lados)
  carga: 4.0,
  techo: 5.0,
  cocheFactor: 0.8, // un coche tiene paneles/cristales más chicos que una camioneta
};

// Peso aproximado agregado según lo que eligió el cliente y el tipo de vehículo
function estPeso(o){
  let w=0;
  if(o.lat) w += o.lat * W.lateral * (o.latT==="p"?1:W.vikingFactor);
  if(o.med) w += W.medallon * (o.medT==="p"?1:W.vikingFactor);
  if(o.para) w += W.parabrisas;
  if(o.quema==="n") w += W.quemaN;
  if(o.quema==="p") w += W.quemaP;
  if(o.puertas>0) w += o.puertas * W.puerta;
  if(o.cajuela) w += W.cajuela;
  const postes=[o.posteB,o.posteC,o.posteD].filter(Boolean).length;
  if(postes>0) w += postes * 2 * W.posteLado;
  if(o.carga && o.tipo==="camioneta") w += W.carga;
  if(o.techo) w += W.techo;
  if(o.tipo==="coche") w *= W.cocheFactor;
  return w;
}

// Días hábiles estimados en taller según el alcance de la opción
function diasHabiles(o){
  const todosVidrios = o.lat>=6 && o.med && o.para;   // vidrios completos
  const hayVidrio = (o.lat>0) || o.med || o.para || !!o.quema;
  let d=0;
  if(todosVidrios) d=7; else if(hayVidrio) d=5;        // base por vidrios
  if(o.puertas>=1) d+=4;                                // Kevlar en puertas
  if(o.posteB||o.posteC||o.posteD||o.carga||o.cajuela||o.techo) d+=3; // Kevlar en carrocería
  return d;
}

// Nivel de cobertura aproximado según lo elegido, con sugerencia de mejora (upsell)
function nivelCobertura(o){
  const vidrios=(o.lat?1:0)+(o.med?1:0)+(o.para?1:0)+(o.quema?1:0);
  const kevlar=(o.puertas>0?1:0)+(o.cajuela?1:0)+((o.posteB||o.posteC||o.posteD)?1:0)+((o.carga&&o.tipo==="camioneta")?1:0)+(o.techo?1:0);
  const vidriosAmplio = o.lat===6 || (o.lat>=4 && o.med);
  let nivel, idx;
  if(vidriosAmplio && kevlar>=3){ nivel="Integral"; idx=3; }
  else if((o.lat>=4||vidrios>=2) && kevlar>=1){ nivel="Reforzada"; idx=2; }
  else { nivel="Básica"; idx=1; }
  // Sugerencia para subir de nivel
  let sugerencia="";
  if(idx<3){
    if(kevlar===0) sugerencia="Tus vidrios ya quedan protegidos; reforzar la carrocería con Kevlar en puertas completa la protección y sube a cobertura Reforzada.";
    else if(!o.med && o.lat) sugerencia="Sumar el medallón cubre uno de los cristales más expuestos y redondea la protección de vidrios.";
    else if(o.lat && o.lat<6 && o.tipo==="camioneta") sugerencia="Ampliar a 6 laterales cubre también las ventanas traseras y deja todo el costado protegido.";
    else if(kevlar<3) sugerencia="Estás a unas zonas de la cobertura Integral: sumar postes, techo o cajuela refuerza los puntos restantes.";
    else sugerencia="Combinar vidrios amplios con Kevlar en varias zonas lleva el vehículo a protección Integral.";
  }
  return {nivel, idx, sugerencia};
}

// Fecha desplazada N días, formateada en español
function fechaMas(dias){
  const d=new Date(); d.setDate(d.getDate()+dias);
  return d.toLocaleDateString("es-MX",{day:"numeric",month:"long",year:"numeric"});
}
const today=new Date().toLocaleDateString("es-MX",{day:"numeric",month:"long",year:"numeric"});

// Capitaliza cada palabra respetando acentos: "maría de la cruz" -> "María De La Cruz"
function capitalizar(s){
  return String(s||"").toLowerCase().replace(/(^|[\s'’\-])(\p{L})/gu, (m,sep,ch)=>sep+ch.toUpperCase()).trim();
}

// Datos de contacto de Viking (editar con los reales)
const VIKING_INFO = {
  tel: "55 0000 0000",
  correo: "contacto@gav.mx",
  direccion: "Dirección del taller, Ciudad",
  web: "gav.mx · @vikingbyGAV",
};

// WhatsApp para el QR de la cotización. Formato internacional sin signos: 52 + 10 dígitos.
// Ejemplo CDMX: "525512345678"
const WHATSAPP = "523332460342";

// URL del Web App de Google Sheets (pegar la que termina en /exec)
const SHEETS_URL = "https://script.google.com/macros/s/AKfycbxfGIH87EauXma94CqNSme1p4z3OkYaXoHAxJBrSKGWHHzLYOdhsz47kCxThH4cYS_qag/exec";

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

// Normaliza para comparar sin acentos ni mayúsculas
const norm=s=>String(s||"").normalize("NFD").replace(/[\u0300-\u036f]/g,"").toLowerCase().trim();

// Campo "ciego": el asesor escribe y solo aparece su coincidencia. Catálogo cerrado.
function AsesorPicker({value,onChange}){
  const [q,setQ]=useState(value||"");
  const [focus,setFocus]=useState(false);
  const matches = q.trim() ? ATIENDE.filter(a=>norm(a).includes(norm(q))) : [];
  const exacto = ATIENDE.find(a=>norm(a)===norm(q));
  function type(v){
    setQ(v);
    const m=ATIENDE.find(a=>norm(a)===norm(v));
    onChange(m||""); // solo queda seleccionado si coincide con un asesor válido
  }
  function pick(a){ setQ(a); onChange(a); setFocus(false); }
  const showList = focus && matches.length>0 && !exacto;
  return(
    <div style={{position:"relative",width:200}}>
      <input
        type="text" value={q}
        onChange={e=>type(e.target.value)}
        onFocus={()=>setFocus(true)}
        onBlur={()=>setTimeout(()=>setFocus(false),150)}
        placeholder="Escribe tu nombre"
        autoComplete="off"
        style={{width:"100%",padding:"9px 12px",border:`1px solid ${value?"rgba(0,0,0,.12)":"rgba(0,0,0,.12)"}`,borderRadius:10,fontSize:14,background:"#f5f5f7",fontFamily:"inherit"}}
      />
      {showList && (
        <div style={{position:"absolute",top:"calc(100% + 4px)",left:0,right:0,background:"#fff",border:`1px solid ${SEP}`,borderRadius:10,boxShadow:"0 6px 20px rgba(0,0,0,0.10)",zIndex:20,overflow:"hidden"}}>
          {matches.map(a=>(
            <div key={a} onMouseDown={()=>pick(a)} style={{padding:"9px 12px",fontSize:14,cursor:"pointer",color:INK}}
              onMouseEnter={e=>e.currentTarget.style.background="#f5f5f7"}
              onMouseLeave={e=>e.currentTarget.style.background="#fff"}>{a}</div>
          ))}
        </div>
      )}
    </div>
  );
}
const OPT_NAMES=["Opción A","Opción B","Opción C"];
const ATIENDE = ["Ángel Álvarez","Bruno Balcázar","Carlos García","Carlos Mateos","Efrén Canto","Javier Fernández","Jesús Landeros","Julio de Botton","Miguel Ángel Chain","Tony Berensten"];
const ADMIN_PASS = "viking2026"; // cambia esto por tu contraseña de admin
const blankOpt=()=>({tipo:"camioneta",lat:null,latT:"p",med:false,medT:"p",para:false,quema:null,puertas:0,cajuela:false,posteB:false,posteC:false,posteD:false,carga:false,techo:false});

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
      <div style={{position:"relative",width:"100%",aspectRatio:"16 / 7",maxHeight:300,margin:"0 auto"}}>
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
  const grosor=(t,ceja)=>t==="p"?("+6.0 mm"+(ceja?" (ceja de acero en cristales operables)":"")):"+3.5 mm";
  if(o.lat){
    const aletas=o.lat>=4?", aletas incluidas":"";
    const cobertura=o.lat===2?"2 puertas delanteras":o.lat===4?"4 puertas":"4 puertas + 2 ventanas traseras fijas";
    l.push({code:C.lat[o.lat][o.latT],label:`${o.latT==="p"?"Viking Plus":"Viking"} · ${o.lat} laterales`,desc:`Refuerza ${cobertura} (${o.lat} cristales). ${grosor(o.latT,true)} sobre el cristal original${aletas}.`,price:P.lat[o.lat][o.latT]});
  }
  if(o.med)l.push({code:C.med[o.medT],label:`${o.medT==="p"?"Viking Plus":"Viking"} · Medallón`,desc:`Refuerza el cristal trasero (medallón). ${grosor(o.medT,false)} sobre el cristal original.`,price:P.med[o.medT]});
  if(o.para)l.push({code:C.para,label:"Viking · Parabrisas",desc:"Refuerzo del parabrisas. Sujeto a evaluación previa por la curvatura del cristal.",price:P.para});
  if(o.quema==="n")l.push({code:C.quema.n,label:"Viking Plus · Quemacocos",desc:"Refuerzo del quemacocos. Sujeto a evaluación previa del cristal.",price:P.quema.n});
  if(o.quema==="p")l.push({code:C.quema.p,label:"Viking Plus · Quemacocos panorámico",desc:"Refuerzo del quemacocos panorámico. Sujeto a evaluación previa por su tamaño y curvatura.",price:P.quema.p});
  if(o.puertas>0)l.push({code:C.puerta,label:`Kevlar puertas ×${o.puertas}`,desc:`Refuerzo interior de Kevlar de 9 capas en ${o.puertas} ${o.puertas===1?"puerta":"puertas"}. No altera la apariencia.`,price:P.puerta*o.puertas});
  if(o.cajuela)l.push({code:C.cajuela[o.tipo],label:"Kevlar cajuela",desc:"Refuerzo interior de Kevlar de 9 capas en la cajuela.",price:P.cajuela[o.tipo]});
  const postesList=[o.posteB&&"B",o.posteC&&"C",o.posteD&&"D"].filter(Boolean);
  if(postesList.length>0)l.push({code:C.poste[o.tipo],label:`Kevlar postes ${postesList.join(", ")} (×2 c/u)`,desc:`Refuerzo interior de Kevlar de 9 capas en los postes ${postesList.join(", ")}, ambos lados del vehículo.`,price:P.poste[o.tipo]*postesList.length*2});
  if(o.carga&&o.tipo==="camioneta")l.push({code:C.carga,label:"Kevlar área de carga",desc:"Refuerzo interior de Kevlar de 9 capas en el área de carga, ambos lados.",price:P.carga});
  if(o.techo)l.push({code:C.techo[o.tipo],label:"Kevlar techo",desc:"Refuerzo interior de Kevlar de 9 capas en el techo.",price:P.techo[o.tipo]});
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
  const W_LATERAL = 430;  // ancho de la vista lateral
  const W_OTRA    = 190;  // ancho de frente / atrás
  const imgStyle={position:"absolute",inset:0,width:"100%",height:"100%",objectFit:"contain"};
  const Vista=({v})=>{
    const {base,layers}=viewLayers(o,v);
    const w = v==="lateral" ? W_LATERAL : W_OTRA;
    const ar = v==="lateral" ? "16 / 7" : "10 / 11";
    return(
      <div style={{position:"relative",width:w,aspectRatio:ar}}>
        <img src={base} alt="" style={imgStyle}/>
        {layers.map((s)=><img key={s} src={s} alt="" style={imgStyle}/>)}
      </div>
    );
  };
  const lateral = views.includes("lateral");
  const otras = views.filter(v=>v!=="lateral");
  return(
    <div style={{display:"flex",flexDirection:"column",gap:6,alignItems:"center",marginTop:16}}>
      {lateral && <Vista v="lateral"/>}
      {otras.length>0 && (
        <div style={{display:"flex",gap:24,justifyContent:"center",alignItems:"flex-end"}}>
          {otras.map(v=><Vista key={v} v={v}/>)}
        </div>
      )}
      <div style={{display:"flex",gap:16,justifyContent:"center",alignItems:"center",fontSize:10.5,color:"#666",marginTop:4}}>
        <span style={{display:"flex",alignItems:"center",gap:5}}><svg width="10" height="10" style={{flexShrink:0}}><rect width="10" height="10" rx="2" fill="#c0392b"/></svg>Vidrios reforzados</span>
        <span style={{display:"flex",alignItems:"center",gap:5}}><svg width="10" height="10" style={{flexShrink:0}}><rect width="10" height="10" rx="2" fill="#9acd32"/></svg>Kevlar en carrocería</span>
      </div>
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
              <Pill sm active={o.lat===2} onClick={()=>u("lat",o.lat===2?null:2)}>2</Pill>
              <Pill sm active={o.lat===4} onClick={()=>u("lat",o.lat===4?null:4)}>4</Pill>
              {o.tipo==="camioneta"&&<Pill sm active={o.lat===6} onClick={()=>u("lat",o.lat===6?null:6)}>6</Pill>}
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
        <Row label="Quemacocos" sub={o.quema==="n"?`${mxn(P.quema.n)} + IVA`:o.quema==="p"?`${mxn(P.quema.p)} + IVA`:"Sujeto a evaluación"} right={
          <div style={{display:"flex",gap:6}}>
            <Pill sm active={o.quema==="n"} onClick={()=>u("quema",o.quema==="n"?null:"n")}>Normal</Pill>
            <Pill sm active={o.quema==="p"} onClick={()=>u("quema",o.quema==="p"?null:"p")}>Panorámico</Pill>
          </div>
        }/>
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
  const diasArr=active.map(diasHabiles);
  const dMin=diasArr.length?Math.min(...diasArr):0, dMax=diasArr.length?Math.max(...diasArr):0;
  const diasTxt = dMin===dMax ? `~${dMax} días hábiles` : `~${dMin}–${dMax} días hábiles`;
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
  // El título de la página se usa como nombre del PDF (ej. "Cotización Viking VK-260720-8351 · Land Rover Defender 110 2023").
  function imprimirYGuardar(){
    guardar();        // se dispara solo, no bloquea la impresión
    const prev=document.title;
    document.title=`Cotización Viking ${folio}${vehicleStr?` · ${vehicleStr}`:""}${name?` · ${name}`:""}`;
    window.print();
    setTimeout(()=>{document.title=prev;},1000);
  }

  return(
    <div>
      <style>{`@media print{.np{display:none!important}.sec{break-inside:avoid}.optcore{break-inside:avoid}.illus{break-inside:avoid}}`}</style>
      <div className="np" style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:"1.5rem",paddingBottom:"1rem",borderBottom:`1px solid ${SEP}`,gap:10}}>
        <button onClick={onBack} style={{background:"none",border:"none",fontSize:15,color:MUTED,cursor:"pointer",fontFamily:"inherit",padding:0}}>← Editar</button>
        <div style={{display:"flex",gap:10,alignItems:"center"}}>
          <button onClick={imprimirYGuardar} style={{padding:"10px 24px",borderRadius:100,background:INK,color:"#fff",border:"none",fontSize:14,cursor:"pointer",fontFamily:"inherit"}}>Imprimir / Guardar PDF</button>
        </div>
      </div>
      {saveErr && <div className="np" style={{fontSize:12,color:"#b91c1c",marginBottom:"1rem",textAlign:"right"}}>No se pudo guardar: {saveErr}</div>}
      <div style={{background:"#fff",color:"#111",maxWidth:580}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:22,paddingBottom:18,borderBottom:"1.5px solid #111"}}>
          <Logo h={92} variant="negro"/>
          <div style={{textAlign:"right"}}><div style={{fontSize:20,fontWeight:500}}>Cotización</div><div style={{fontSize:12,color:"#666",marginTop:3}}>{today}</div><div style={{fontSize:12,color:"#888",marginTop:2,fontFamily:"monospace"}}>{folio}</div></div>
        </div>
        <div style={{marginBottom:24,padding:"14px 16px",background:"#f7f7f5",borderRadius:10,display:"grid",gridTemplateColumns:"1fr 1fr",gap:"10px 24px"}}>
          {[["Cliente",name||"—"],["Teléfono",tel||"—"],["Vehículo",vehicleStr||"—"],["Atendido por",asesor||"—"],["Vigencia",`hasta el ${fechaMas(30)}`],["Entrega estimada",`${diasTxt} desde el inicio`]].map(([l,v])=>(
            <div key={l}><div style={{fontSize:10,color:"#5b5b60",textTransform:"uppercase",letterSpacing:"0.08em",marginBottom:3}}>{l}</div><div style={{fontSize:14,fontWeight:500}}>{v}</div></div>
          ))}
        </div>
        {multi&&<div style={{fontSize:13,color:"#666",marginBottom:18}}>Esta cotización incluye {active.length} opciones de protección para que elijas la que mejor se ajuste a tus necesidades.</div>}

        <div className="sec" style={{marginBottom:24}}>
          <div style={{fontSize:11,fontWeight:600,color:"#111",textTransform:"uppercase",letterSpacing:"0.08em",marginBottom:8}}>¿Qué es Viking?</div>
          <div style={{fontSize:12.5,color:"#444",lineHeight:1.65}}>
            Viking by GAV es un sistema de protección para vehículos que refuerza los puntos más vulnerables del coche. Trabajamos en dos frentes: el refuerzo de los vidrios y el refuerzo de la carrocería con Kevlar de 9 capas en puertas, postes, techo, cajuela y área de carga. Los cristales se transforman en una verdadera armadura que resiste golpes de objetos como martillos, hachas, picos y bats, dando más tiempo de reacción ante un asalto. Todo con una instalación discreta que conserva la apariencia, la funcionalidad y el manejo originales del vehículo.
          </div>
          <div style={{fontSize:12.5,color:"#444",lineHeight:1.65,marginTop:10}}>
            <b>Viking Plus</b> (+6.0 mm) es nuestro nivel máximo de refuerzo de vidrios: suma una ceja de acero en los cristales operables y acabado transparente o ahumado al 50%.
          </div>
        </div>

        <div className="sec" style={{marginBottom:20,fontSize:10,color:"#888",fontStyle:"italic",lineHeight:1.5}}>
          Viking aumenta la resistencia del vidrio original y da más tiempo de reacción. No es un blindaje certificado ni lo sustituye. Resultados basados en pruebas internas no certificadas.
        </div>

        {active.map((o,idx)=>{
          const {items,sub,iva,total}=totals(o);
          return(
            <div key={idx} className="opt-sec" style={{marginBottom:28}}>
              <div className="optcore">
              {multi&&<div style={{display:"flex",alignItems:"center",gap:10,marginBottom:12}}>
                <div style={{background:INK,color:"#fff",fontSize:13,fontWeight:500,padding:"4px 14px",borderRadius:100}}>{OPT_NAMES[idx]}</div>
                <div style={{flex:1,height:1,background:"#e5e5e3"}}/>
                <div style={{fontSize:13,color:"#555",textTransform:"capitalize"}}>{o.tipo}</div>
              </div>}
              <table style={{width:"100%",borderCollapse:"collapse",fontSize:14}}>
                <thead><tr style={{borderBottom:"1px solid #ccc"}}>
                  {["Código","Descripción","Precio"].map((h,i)=><th key={h} style={{textAlign:i===2?"right":"left",padding:"5px 0",fontWeight:600,color:"#555",fontSize:10,textTransform:"uppercase",letterSpacing:"0.06em",...(i===0?{width:64}:{}),...(i===1?{paddingLeft:8}:{})}}>{h}</th>)}
                </tr></thead>
                <tbody>
                  {items.map((it,i)=>(
                    <tr key={i} style={{borderBottom:"1px solid #f0f0f0"}}>
                      <td style={{padding:"9px 0",color:"#777",fontSize:12,verticalAlign:"top"}}>{it.code}</td>
                      <td style={{padding:"9px 8px"}}>{it.label}</td>
                      <td style={{padding:"9px 0",textAlign:"right",whiteSpace:"nowrap",verticalAlign:"top"}}>{mxn(it.price)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div style={{display:"flex",justifyContent:"flex-end",marginTop:10}}>
                <div style={{minWidth:220}}>
                  <div style={{display:"flex",justifyContent:"space-between",fontSize:13,color:"#555",marginBottom:5}}><span>Subtotal</span><span>{mxn(sub)}</span></div>
                  <div style={{display:"flex",justifyContent:"space-between",fontSize:13,color:"#555",marginBottom:8}}><span>IVA 16%</span><span>{mxn(iva)}</span></div>
                  <div style={{display:"flex",justifyContent:"space-between",alignItems:"baseline",borderTop:"1.5px solid #111",paddingTop:8}}>
                    <span style={{fontSize:14,fontWeight:500}}>{multi?`Total ${OPT_NAMES[idx]}`:"Total con IVA"}</span>
                    <span style={{fontSize:22,fontWeight:500,letterSpacing:"-0.5px"}}>{mxn(total)}</span>
                  </div>
                  <div style={{display:"flex",justifyContent:"space-between",fontSize:11.5,color:"#666",marginTop:6}}>
                    <span>Peso aprox. agregado</span><span>~{Math.round(estPeso(o))} kg</span>
                  </div>
                  <div style={{display:"flex",justifyContent:"space-between",fontSize:11.5,color:"#666",marginTop:4}}>
                    <span>Tiempo estimado en taller</span><span>~{diasHabiles(o)} días hábiles</span>
                  </div>
                  {(()=>{const nc=nivelCobertura(o);return(
                    <div style={{marginTop:8,paddingTop:8,borderTop:"1px solid #f0f0f0"}}>
                      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",gap:8}}>
                        <span style={{fontSize:11.5,color:"#666"}}>Nivel de cobertura</span>
                        <span style={{display:"flex",gap:4,alignItems:"center"}}>
                          {[1,2,3].map(n=><svg key={n} width="18" height="5" style={{flexShrink:0}}><rect width="18" height="5" rx="2.5" fill={n<=nc.idx?INK:"#e0e0e0"}/></svg>)}
                          <span style={{fontSize:12,fontWeight:600,color:INK,marginLeft:4}}>{nc.nivel}</span>
                        </span>
                      </div>
                      {nc.sugerencia&&<div style={{fontSize:10.5,color:"#b5852a",marginTop:5,lineHeight:1.45}}>Sugerencia: {nc.sugerencia}</div>}
                    </div>
                  );})()}
                </div>
              </div>
              </div>
              <div className="illus"><QuoteIllustration o={o}/></div>
            </div>
          );
        })}

        <div className="sec" style={{marginTop:24}}>
          <div style={{fontSize:11,fontWeight:600,color:"#111",textTransform:"uppercase",letterSpacing:"0.08em",marginBottom:12}}>¿Por qué Viking?</div>
          <div style={{display:"flex",gap:10,flexWrap:"wrap"}}>
            {[
              ["Invisible","Nadie nota que tu auto está protegido; conserva su apariencia original."],
              ["No modifica tu auto","Sin alterar estructura, peso ni manejo. Es reversible."],
              ["A tu medida","Eliges exactamente qué zonas proteger y a qué nivel."],
              ["Respaldado","5 años de garantía y materiales de alta resistencia."],
            ].map(([t,d])=>(
              <div key={t} style={{flex:"1 1 44%",minWidth:200,border:`1px solid ${SEP}`,borderRadius:10,padding:"12px 14px"}}>
                <div style={{fontSize:13,fontWeight:600,color:"#111",marginBottom:4}}>{t}</div>
                <div style={{fontSize:11,color:"#888",lineHeight:1.5}}>{d}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="sec" style={{marginTop:22}}>
          <div style={{fontSize:11,fontWeight:600,color:"#111",textTransform:"uppercase",letterSpacing:"0.08em",marginBottom:10}}>Garantía</div>
          <ul style={{margin:0,paddingLeft:18,fontSize:11.5,color:"#555",lineHeight:1.7}}>
            <li><b>Vidrios reforzados</b> (laterales, medallón y parabrisas): 5 años contra delaminación y burbujeo.</li>
            <li><b>Kevlar 9 capas</b>: 5 años contra defectos de instalación y de materiales.</li>
            <li><b>Ajuste y funcionamiento</b>: cubierto contra ruidos o desajuste de puertas y elevadores derivados de la instalación.</li>
            <li>Aplica para el propietario original; no es transferible. No cubre accidentes, golpes ni vandalismo.</li>
          </ul>
        </div>

        <div className="sec" style={{marginTop:22}}>
          <div style={{fontSize:11,fontWeight:600,color:"#111",textTransform:"uppercase",letterSpacing:"0.08em",marginBottom:12}}>Próximos pasos</div>
          <div style={{display:"flex",gap:10,flexWrap:"wrap"}}>
            {[
              ["1","Confirma","Aceptas la cotización y apartas fecha."],
              ["2","Anticipo","Pagas el 50% para programar el ingreso."],
              ["3","Inspección","Revisamos y documentamos el vehículo."],
              ["4","Instalación",`Trabajo en taller (${diasTxt}).`],
              ["5","Entrega","Saldo cubierto y entrega del vehículo."],
            ].map(([n,t,d])=>(
              <div key={n} style={{flex:"1 1 28%",minWidth:140,border:`1px solid ${SEP}`,borderRadius:10,padding:"10px 12px"}}>
                <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:4}}>
                  <span style={{width:20,height:20,borderRadius:10,background:INK,color:"#fff",fontSize:11,fontWeight:600,display:"flex",alignItems:"center",justifyContent:"center"}}>{n}</span>
                  <span style={{fontSize:12.5,fontWeight:600,color:"#111"}}>{t}</span>
                </div>
                <div style={{fontSize:10.5,color:"#888",lineHeight:1.45}}>{d}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="sec" style={{marginTop:24,paddingTop:18,borderTop:"1px solid #e5e5e3"}}>
          <div style={{fontSize:11,fontWeight:600,color:"#111",textTransform:"uppercase",letterSpacing:"0.08em",marginBottom:10}}>Notas y condiciones</div>
          <ol style={{margin:0,paddingLeft:18,fontSize:11.5,color:"#555",lineHeight:1.7}}>
            <li>Anticipo del 50% del total para iniciar el trabajo; el saldo restante deberá estar cubierto antes de la entrega del vehículo.</li>
            <li>El tiempo estimado en taller se indica en cada opción y depende del alcance del trabajo (vidrios y zonas de Kevlar).</li>
            <li>Inspección previa documentada del vehículo antes de iniciar. Cualquier ajuste al alcance se comunica y reconfirma con el cliente.</li>
            <li>El polarizado no está incluido y se cotiza por separado.</li>
            <li>Acabado Viking Plus disponible en transparente o ahumado 50%, a definir con el cliente antes de la instalación.</li>
            <li>Se utilizan los vidrios originales del vehículo: se desmontan, se procesan en autoclave y se reinstalan en el mismo marco. No se modifica la estructura ni se alteran puertas o mecanismos.</li>
            <li>El peso aproximado agregado se indica en cada opción y es una estimación de referencia que varía según el vehículo. Es mínimo respecto al peso total y los elevadores siguen funcionando con normalidad.</li>
            <li>En la cobertura de 4 puertas, si las puertas traseras cuentan con aletas (ventanas fijas pequeñas), van incluidas sin costo adicional.</li>
            <li>Las ilustraciones son referenciales y pueden no coincidir exactamente con el modelo de tu vehículo; la cobertura indicada aplica igual.</li>
            <li>Vigencia de la cotización: 30 días a partir de la fecha de emisión.</li>
          </ol>
        </div>

        <div className="sec" style={{marginTop:22,padding:"16px 18px",background:"#f7f7f5",borderRadius:12,display:"flex",alignItems:"center",gap:18}}>
          <img
            src={`https://api.qrserver.com/v1/create-qr-code/?size=220x220&margin=0&data=${encodeURIComponent(`https://wa.me/${WHATSAPP}?text=`+encodeURIComponent(`Hola, quiero proceder con la cotización ${folio}${vehicleStr?` de mi ${vehicleStr}`:""}.`))}`}
            alt="QR para continuar por WhatsApp"
            style={{width:96,height:96,flexShrink:0,borderRadius:6,background:"#fff"}}
          />
          <div>
            <div style={{fontSize:13,fontWeight:600,color:"#111",marginBottom:3}}>¿Listo para proceder?</div>
            <div style={{fontSize:12,color:"#555",lineHeight:1.55}}>
              Escanea el código con la cámara de tu teléfono y te abrirá un chat de WhatsApp con nosotros, listo para confirmar esta cotización <span style={{fontFamily:"monospace",color:"#333"}}>{folio}</span>.
            </div>
          </div>
        </div>

        <div style={{marginTop:24,paddingTop:16,borderTop:"1.5px solid #111",display:"flex",justifyContent:"space-between",flexWrap:"wrap",gap:20}}>
          <div>
            <div style={{fontSize:10,color:"#5b5b60",textTransform:"uppercase",letterSpacing:"0.08em",marginBottom:5}}>Contacto</div>
            <div style={{fontSize:12,color:"#444",lineHeight:1.7}}>
              {VIKING_INFO.tel}<br/>
              {VIKING_INFO.correo}<br/>
              {VIKING_INFO.direccion}<br/>
              {VIKING_INFO.web}
            </div>
          </div>
          <div style={{flex:"0 0 auto"}}>
            <div style={{fontSize:10,color:"#5b5b60",textTransform:"uppercase",letterSpacing:"0.08em",marginBottom:5}}>Datos para depósito</div>
            <div style={{fontSize:12,color:"#444",lineHeight:1.7}}>
              <span style={{color:"#5b5b60"}}>Banco</span> BBVA Bancomer<br/>
              <span style={{color:"#5b5b60"}}>Beneficiario</span> GAV Detailing SA de CV<br/>
              <span style={{color:"#5b5b60"}}>Cuenta</span> 0110645915<br/>
              <span style={{color:"#5b5b60"}}>CLABE</span> 012180001106459158
            </div>
          </div>
        </div>
        <div style={{marginTop:16,display:"flex",justifyContent:"flex-end"}}>
          <div style={{opacity:.4}}><Logo h={24} variant="negro"/></div>
        </div>
        <div style={{marginTop:16,paddingTop:14,borderTop:"1px solid #e5e5e3",fontSize:11,color:"#bbb",lineHeight:1.6}}>
          Precios en pesos mexicanos antes de IVA (16%). Vigencia hasta el {fechaMas(30)}. Viking by GAV es una solución de protección y seguridad; no es un blindaje balístico certificado ni pretende sustituirlo.
        </div>
        <div style={{marginTop:10,paddingTop:8,borderTop:`1px solid ${SEP}`,display:"flex",justifyContent:"space-between",fontSize:9.5,color:"#c7c7cc",letterSpacing:"0.03em"}}>
          <span>Viking by GAV Detailing · Cotización {vehicleStr||"—"}</span>
          <span style={{fontFamily:"monospace"}}>{folio}</span>
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
    <div style={{textAlign:"center",marginTop:"4rem",paddingTop:"1rem"}}>
      <button onClick={()=>setOpen(true)} aria-label="" title="" style={{background:"none",border:"none",fontSize:16,lineHeight:1,color:"#000",opacity:0.12,cursor:"default",fontFamily:"inherit",letterSpacing:"0.15em",padding:"4px 10px"}}>•••</button>
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
  const [abierta,setAbierta]=useState(null); // índice del renglón expandido
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
        // Filtra cualquier fila de encabezados que se haya colado
        const limpio=list.filter(r=>r && String(r.fecha).trim().toLowerCase()!=="fecha" && (r.folio||r.cliente||r.vehiculo));
        if(alive){ setRows(limpio); setLoading(false); }
      }catch(e){ if(alive){ setErr("No se pudo cargar el historial desde Sheets."); setLoading(false); } }
    })();
    return ()=>{alive=false;};
  },[]);
  return(
    <div style={{fontFamily:"-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif",maxWidth:860,margin:"0 auto",padding:"2rem 1rem"}}>
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
            {["Fecha","Folio","Cliente","Vehículo","Total","Estado",""].map((h,i)=><th key={i} style={{padding:"8px 6px",fontWeight:500,fontSize:11,textTransform:"uppercase",letterSpacing:"0.06em"}}>{h}</th>)}
          </tr></thead>
          <tbody>
            {rows.map((r,i)=>{
              const open=abierta===i;
              return(
                <Fragment key={i}>
                  <tr style={{borderBottom:open?"none":`1px solid ${SEP}`}}>
                    <td style={{padding:"8px 6px"}}>{r.fecha||"—"}</td>
                    <td style={{padding:"8px 6px",fontFamily:"monospace"}}>{r.folio||"—"}</td>
                    <td style={{padding:"8px 6px"}}>{r.cliente||"—"}</td>
                    <td style={{padding:"8px 6px"}}>{r.vehiculo||"—"}</td>
                    <td style={{padding:"8px 6px",whiteSpace:"nowrap"}}>{r.total!==undefined&&r.total!==""&&!isNaN(Number(r.total))?mxn(Number(r.total)):"—"}</td>
                    <td style={{padding:"8px 6px"}}>{r.estado||"—"}</td>
                    <td style={{padding:"8px 6px",textAlign:"right"}}>
                      <button onClick={()=>setAbierta(open?null:i)} style={{background:"none",border:`1px solid ${SEP}`,borderRadius:8,padding:"4px 10px",fontSize:12,cursor:"pointer",fontFamily:"inherit",color:INK,whiteSpace:"nowrap"}}>{open?"Ocultar":"Ver detalle"}</button>
                    </td>
                  </tr>
                  {open&&(
                    <tr style={{borderBottom:`1px solid ${SEP}`,background:"#f7f7f5"}}>
                      <td colSpan={7} style={{padding:"12px 14px"}}>
                        <div style={{display:"flex",flexWrap:"wrap",gap:"6px 28px",marginBottom:r.zonas?10:0,fontSize:12.5}}>
                          <span><span style={{color:MUTED}}>Teléfono: </span>{r.telefono||"—"}</span>
                          <span><span style={{color:MUTED}}>Atendió: </span>{r.atendio||"—"}</span>
                          <span><span style={{color:MUTED}}>Tipo: </span>{r.tipo||"—"}</span>
                          <span><span style={{color:MUTED}}>Opciones: </span>{r.opciones||"—"}</span>
                          <span><span style={{color:MUTED}}>Subtotal: </span>{r.subtotal!==undefined&&r.subtotal!==""&&!isNaN(Number(r.subtotal))?mxn(Number(r.subtotal)):"—"}</span>
                        </div>
                        {r.zonas&&(
                          <div style={{fontSize:12.5,lineHeight:1.6}}>
                            <span style={{color:MUTED}}>Cotizó: </span>
                            {String(r.zonas).split("||").map((parte,k)=>(
                              <div key={k} style={{paddingLeft:8}}>{parte.trim().split(";").join(" · ")}</div>
                            ))}
                          </div>
                        )}
                      </td>
                    </tr>
                  )}
                </Fragment>
              );
            })}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default function App(){
  const [view,setView]=useState("config");
  const [admin,setAdmin]=useState(false);
  const [nombre,setNombre]=useState(""); const [apellidos,setApellidos]=useState(""); const [tel,setTel]=useState(""); const [brand,setBrand]=useState(""); const [model,setModel]=useState(""); const [year,setYear]=useState("");
  const [asesor,setAsesor]=useState("");
  const [folio]=useState(makeFolio);
  const [opts,setOpts]=useState([blankOpt()]);
  const [active,setActive]=useState(0);

  if(admin) return <AdminView onBack={()=>setAdmin(false)}/>;

  const models=brand&&BRANDS[brand]?BRANDS[brand]:[];
  const vehicleStr=[brand,model,year].filter(Boolean).join(" ");
  const cliente=[capitalizar(nombre),capitalizar(apellidos)].filter(Boolean).join(" ");
  const anyFilled=opts.some(o=>buildItems(o).length>0);
  const multi=opts.length>1;
  const curTotal=totals(opts[active]);

  // Campos obligatorios para poder ver la cotización
  const faltantes=[];
  if(!asesor) faltantes.push("Atendido por");
  if(!nombre.trim()) faltantes.push("Nombre(s)");
  if(!apellidos.trim()) faltantes.push("Apellido(s)");
  if(!tel.trim()) faltantes.push("Teléfono");
  if(!brand) faltantes.push("Marca");
  if(!model) faltantes.push("Modelo");
  if(!year) faltantes.push("Año");
  if(!anyFilled) faltantes.push("Al menos un servicio");
  const puedeVer = faltantes.length===0;

  function setOpt(i,next){setOpts(p=>p.map((o,idx)=>idx===i?next:o));}
  function chooseModel(m){
    setModel(m);
    // tipoDe devuelve null cuando el tipo lo debe elegir el asesor (marca/modelo "Otro"): no se asume nada.
    const t=tipoDe(brand,m);
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

  if(view==="preview") return <div style={{fontFamily:"-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif",maxWidth:600,margin:"0 auto",padding:"2rem 1rem"}}><PrintView opts={opts} name={cliente} tel={tel} vehicleStr={vehicleStr} asesor={asesor} folio={folio} onBack={()=>setView("config")}/></div>;

  return(
    <div style={{fontFamily:"-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif",maxWidth:600,margin:"0 auto",padding:"0 1rem 6rem",position:"relative"}}>
      <div style={{padding:"2rem 0 0"}}>
        <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:"1.75rem"}}>
          <Logo h={88} variant="negro"/>
          <div style={{fontSize:11,color:MUTED,letterSpacing:"0.06em",borderLeft:`1px solid ${SEP}`,paddingLeft:12}}>{today}</div>
        </div>

        <div style={{marginBottom:"1.5rem"}}>
          <Row first label="Atendido por *" right={<AsesorPicker value={asesor} onChange={setAsesor}/>}/>
        </div>

        <div style={{marginBottom:"1.5rem"}}>
          <SHead>Cliente</SHead>
          <Row first label="Nombre(s) *" right={<input type="text" value={nombre} onChange={e=>setNombre(e.target.value)} placeholder="Nombre(s)" style={{padding:"9px 12px",border:"1px solid rgba(0,0,0,.12)",borderRadius:10,fontSize:14,background:"#f5f5f7",fontFamily:"inherit",width:200}}/>}/>
          <Row label="Apellido(s) *" right={<input type="text" value={apellidos} onChange={e=>setApellidos(e.target.value)} placeholder="Apellido(s)" style={{padding:"9px 12px",border:"1px solid rgba(0,0,0,.12)",borderRadius:10,fontSize:14,background:"#f5f5f7",fontFamily:"inherit",width:200}}/>}/>
          <Row label="Teléfono *" right={<input type="tel" value={tel} onChange={e=>setTel(e.target.value)} placeholder="55 1234 5678" style={{padding:"9px 12px",border:"1px solid rgba(0,0,0,.12)",borderRadius:10,fontSize:14,background:"#f5f5f7",fontFamily:"inherit",width:200}}/>}/>
          <Row label="Marca *" right={<Sel value={brand} onChange={v=>{setBrand(v);setModel("");}} w={165}><option value="">Seleccionar</option>{Object.keys(BRANDS).sort().map(b=><option key={b} value={b}>{b}</option>)}</Sel>}/>
          <Row label="Modelo *" right={<Sel value={model} onChange={chooseModel} disabled={!brand} w={165}><option value="">Seleccionar</option>{models.map(m=><option key={m} value={m}>{m}</option>)}</Sel>}/>
          <Row label="Año *" right={<Sel value={year} onChange={setYear} w={110}><option value="">Año</option>{YEARS.map(y=><option key={y} value={y}>{y}</option>)}</Sel>}/>
          {(()=>{
            if(!brand||!model) return null;
            const avisos=[];
            if(tipoDe(brand,model)===null) avisos.push("Selecciona manualmente si es coche o camioneta.");
            if(model && carroceriaDe(brand,model)==="por confirmar") avisos.push("Carrocería sin confirmar: verifica el vehículo antes de cotizar.");
            if(year){
              const g=generacionDe(brand,model,Number(year));
              if(g.estado==="ambiguo") avisos.push(`Ese año tiene dos generaciones posibles (${g.candidatos.join(" o ")}); confirma con el cliente.`);
              else if(g.estado==="sin_informacion"&&g.motivo==="esa versión no existía en ese año") avisos.push("Revisa el año: esa versión no se fabricaba entonces.");
            }
            if(!avisos.length) return null;
            return <div style={{fontSize:12,color:"#b5852a",lineHeight:1.5,padding:"0 0 12px"}}>{avisos.map((a,i)=><div key={i}>· {a}</div>)}</div>;
          })()}
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
