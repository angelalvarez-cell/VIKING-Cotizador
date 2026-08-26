import { useState, useEffect, useLayoutEffect, useRef, useCallback } from "react";
import { VEHICULOS, MARCAS, TRUCK_WORDS, CAR_WORDS, AUTOS_DEMO } from "./datos.js";
import {
  POS_CODE, GLASS_POSITIONS, LAT_DEL, LAT_TRAS, ALETA_DEL, ALETA_TRAS, GRUPOS, TECHO, COBERTURAS, KEVLAR_ZONES, ordenCorta, codigoVidrio, vidriosDe, clavesVidrios, detectTipo, tipoDe, nombreAuto, bahiaTexto, HITOS, HITO_DESMONTAJE, KEVLAR_HITOS, KEVLAR_PROCESO, KEVLAR_SIG, EN_MANO, NO_APLICA_EN_MANO, noAplicaHito, TAREA, etapaEnProceso, etapaTerminada, faseActual, enProcesoAhora, desdeHace, faseSiguiente, proxHito, EQUIPO, CREW_FIJO, VENDEDORES, nombreOw, hoy, aFecha, diasPara, tsEntrega, kevlarListo, entregado, urgencia, URG, fechaCorta, hora12, resumenAhumado, PISO_HRS_SEM, DIGITAL_HRS_SEM, CICLOS_SEM, LATERALES_OP, horasPiso, horasDigital, horasPisoTotal, pisoRestante, digitalRestante, ciclosDe, sumarDiasHabiles, diasPorRecurso, cuelloDe, fechaSugerida, diasEnEscenario, impactoAdelantar, MODO_DEMO, normFecha, normHora, T, FONT_LINK, DISPLAY, BODY,
} from "./modelo.js";

/* =====================================================================
   CONEXIÓN — pega aquí la URL /exec de tu Apps Script (como en el Cotizador).
   Si se deja vacía, la app corre en MODO DEMO (datos locales, sin sincronizar).
===================================================================== */
const BACKEND_URL = "https://script.google.com/macros/s/AKfycbxf2HT7DtnmkeNjfEToLZF6nY5D7MheSmHfBesC87xM3rGOhra566tCDXfjid6RQrKy2g/exec";

/* ================= App =================
   MODOS POR DISPOSITIVO (parámetro ?modo= en la URL):
   · ?modo=tv    → SOLO la vista de Taller, sin navegación. Es la URL de la TELEVISIÓN
                   de la pared: se abre una vez en el navegador de la TV y queda fija (kiosko).
   · ?modo=piso  → SOLO la vista de registro (antes "Tableta"), sin navegación. Es la URL
                   del celular/dispositivo con el que se marca "terminé mi parte".
   · (sin modo)  → modo oficina: todas las pestañas (Taller, Registro, Agenda, Control).
                   La Agenda vive aquí — es herramienta de análisis de oficina, no del piso. */
const MODO_APP = (() => {
  if (typeof window === "undefined") return "oficina";
  const m = new URLSearchParams(window.location.search).get("modo");
  return m === "tv" || m === "piso" ? m : "oficina";
})();
export default function TableroViking() {
  const [vista, setVista] = useState(MODO_APP === "piso" ? "tableta" : "tv");
  const [autos, setAutos] = useState(MODO_DEMO ? AUTOS_DEMO : []);
  const [reloj, setReloj] = useState(new Date());
  const [ultimaSync, setUltimaSync] = useState(null);
  const [errorSync, setErrorSync] = useState(false);

  const cargar = useCallback(async () => {
    if (MODO_DEMO) return;
    try {
      const lista = await apiListar();
      // PROTECCIÓN: los autos recién agregados que aún no se guardan (_local) solo existen
      // en esta pantalla. Un refresco del servidor NO debe pisarlos — se conservan encima
      // de la lista del servidor hasta que Guardar los confirme.
      setAutos((prev) => {
        const locales = prev.filter((a) => a._local);
        const ids = new Set(locales.map((a) => a.id));
        return [...locales, ...lista.filter((a) => !ids.has(a.id))];
      });
      setUltimaSync(new Date()); setErrorSync(false);
    }
    catch (e) { setErrorSync(true); }
  }, []);

  useEffect(() => { const t = setInterval(() => setReloj(new Date()), 15000); return () => clearInterval(t); }, []);
  useEffect(() => { cargar(); }, [cargar]);
  // Polling: la TV cada 8 s, la Tableta cada 20 s.
  // Control NO se auto-refresca (borraría lo que estás capturando); lee al entrar y tras guardar.
  useEffect(() => {
    if (MODO_DEMO || vista === "admin") return;
    const ms = vista === "tv" ? 8000 : 20000;
    const t = setInterval(cargar, ms);
    return () => clearInterval(t);
  }, [vista, cargar]);

  const segsSync = ultimaSync ? Math.round((reloj - ultimaSync) / 1000) : null;

  return (
    <div style={{ minHeight: "100vh", background: T.bg, color: T.ink, fontFamily: BODY }}>
      <link rel="stylesheet" href={FONT_LINK} />
      <style>{`
        @keyframes breathe { 0%,100%{opacity:1} 50%{opacity:.45} }
        @keyframes glow { 0%{box-shadow:0 0 0 1px ${T.gold}} 50%{box-shadow:0 0 0 1px ${T.gold}, 0 0 22px rgba(201,151,63,.35)} 100%{box-shadow:0 0 0 1px ${T.gold}} }
        @keyframes flash { 0%{background:${T.goldDim}} 100%{background:transparent} }
        @keyframes pop { 0%{transform:scale(1)} 40%{transform:scale(1.04)} 100%{transform:scale(1)} }
        .tnum { font-variant-numeric: tabular-nums; }
        .press { transition: transform .08s ease, filter .12s ease; }
        .press:active { transform: scale(.96); filter: brightness(1.12); }
        ::selection { background: rgba(201,151,63,.3); }
      `}</style>

      <header style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "20px 34px", borderBottom: `1px solid ${T.line}` }}>
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <Shield />
          <div>
            <div style={{ fontFamily: DISPLAY, fontSize: 17, letterSpacing: "0.34em" }}>VIKING</div>
            <div style={{ fontSize: 9, letterSpacing: "0.42em", color: T.dim, marginTop: 3, textTransform: "uppercase" }}>Taller · by GAV</div>
          </div>
        </div>
        {MODO_APP === "oficina" ? (
          <nav style={{ display: "flex", gap: 26 }}>
            {[["tv", "Taller"], ["tableta", "Registro"], ["agenda", "Agenda"], ["admin", "Control"]].map(([k, lbl]) => (
              <button key={k} onClick={() => setVista(k)} style={{ background: "none", border: "none", cursor: "pointer", padding: "6px 2px", fontFamily: BODY, fontSize: 13, fontWeight: 600, letterSpacing: "0.12em", textTransform: "uppercase", color: vista === k ? T.gold : T.dim, borderBottom: `2px solid ${vista === k ? T.gold : "transparent"}` }}>{lbl}</button>
            ))}
          </nav>
        ) : (
          <span style={{ fontSize: 10, letterSpacing: "0.3em", color: T.dim, textTransform: "uppercase" }}>{MODO_APP === "tv" ? "" : "Registro de avance"}</span>
        )}
        <div style={{ textAlign: "right" }}>
          <div className="tnum" style={{ fontFamily: DISPLAY, fontSize: 19 }}>{reloj.toLocaleTimeString("es-MX", { hour: "2-digit", minute: "2-digit" })}</div>
          <div style={{ fontSize: 10.5, color: errorSync ? "#e07a7a" : T.dim, textTransform: MODO_DEMO ? "uppercase" : "none", marginTop: 2, letterSpacing: "0.04em" }}>
            {MODO_DEMO ? "modo demo · sin conexión" : errorSync ? "⚠ sin conexión — reintentando" : segsSync === null ? "conectando…" : `actualizado hace ${segsSync}s`}
          </div>
        </div>
      </header>

      {vista === "tv" && <VistaTV autos={autos} />}
      {vista === "tableta" && <VistaTableta autos={autos} setAutos={setAutos} recargar={cargar} />}
      {vista === "agenda" && <VistaAgenda autos={autos} />}
      {vista === "admin" && <Panel autos={autos} setAutos={setAutos} recargar={cargar} />}
    </div>
  );
}

/* ================= Vista TV (output) ================= */
const ROLES = ["Vendedor", "Técnico Digital", "Vidrios", "Líder", "Kevlar"];

function VistaTV({ autos }) {
  // Orden del tablero: bloque URGE arriba; después, entrega más próxima (fecha + hora) primero.
  const claveOrden = (a) => (a.prioridad ? tsEntrega(a) - 1e13 : tsEntrega(a));
  const orden = [...autos].filter((a) => !entregado(a)).sort((a, b) => claveOrden(a) - claveOrden(b));

  /* Slideshow: 2 autos grandes por pantalla, rota cada 20 s (urgentes primero por el orden). */
  const POR_SLIDE = 2, SEG = 20000;
  const grupos = [];
  for (let i = 0; i < orden.length; i += POR_SLIDE) grupos.push(orden.slice(i, i + POR_SLIDE));
  const totalSlides = Math.max(1, grupos.length);
  const [slide, setSlide] = useState(0);
  useEffect(() => { if (slide > totalSlides - 1) setSlide(0); }, [totalSlides, slide]);
  useEffect(() => {
    if (totalSlides <= 1) return;
    const t = setInterval(() => setSlide((s) => (s + 1) % totalSlides), SEG);
    return () => clearInterval(t);
  }, [totalSlides]);
  const grupoActual = grupos[Math.min(slide, totalSlides - 1)] || [];

  /* Auto-ajuste suave: si el par de coches queda un poco alto para la pantalla,
     encoge lo mínimo para que TODO quepa sin scroll (con 2 tarjetas casi no se nota). */
  const contRef = useRef(null);
  const [ajuste, setAjuste] = useState({ f: 1, alto: null });
  useEffect(() => {
    const reset = () => setAjuste({ f: 1, alto: null });
    window.addEventListener("resize", reset);
    const t = setTimeout(reset, 900);
    return () => { window.removeEventListener("resize", reset); clearTimeout(t); };
  }, []);
  useLayoutEffect(() => { setAjuste({ f: 1, alto: null }); }, [slide, autos]);
  useLayoutEffect(() => {
    if (ajuste.f !== 1) return;
    const el = contRef.current; if (!el) return;
    const disponible = window.innerHeight - el.getBoundingClientRect().top - 24;
    const natural = el.scrollHeight;
    if (natural > disponible && disponible > 100) {
      const f = Math.max(0.7, disponible / natural);
      setAjuste({ f, alto: Math.floor(natural * f) });
    }
  }, [ajuste, slide, autos]);
  const escala = ajuste.f;

  // Equipo deducido de los hitos: para cada rol, qué autos tiene en sus manos (paso siguiente).
  const cola = {};
  ROLES.forEach((r) => (cola[r] = []));
  autos.forEach((a) => {
    if (entregado(a)) return;
    if (a.hito < HITOS.length - 1) {
      const sig = HITOS[proxHito(a, 1)]; // salta etapas que no aplican (En mano)
      if (cola[sig.ow]) cola[sig.ow].push({ auto: a, etapa: sig.n });
    }
    if (a.kevlar.length && a.hito >= HITO_DESMONTAJE && a.kevlarHito < 3) {
      cola["Kevlar"].push({ auto: a, etapa: KEVLAR_PROCESO[a.kevlarHito] });
    }
  });

  return (
    <main style={{ maxWidth: 1900, margin: "0 auto", padding: "14px 34px 6px", overflow: "hidden" }}>
      <div ref={contRef} style={{ transform: escala < 1 ? `scale(${escala})` : "none", transformOrigin: "top left", width: escala < 1 ? (100 / escala).toFixed(2) + "%" : "100%", height: ajuste.alto ? ajuste.alto + "px" : "auto" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
        <Leyenda />
      </div>
      {orden.length > 0 && (
        <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: 14, marginTop: 14 }}>
          {grupoActual.map((a) => <Banda key={a.id} auto={a} />)}
        </div>
      )}
      {orden.length === 0 && <div style={{ textAlign: "center", color: T.dim, padding: "60px 0" }}>Sin autos en proceso.</div>}

      {totalSlides > 1 && (
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, marginTop: 20 }}>
          {grupos.map((_, i) => (
            <span key={i} style={{ width: i === slide ? 22 : 7, height: 7, borderRadius: 4, background: i === slide ? T.gold : T.line2, transition: "width .3s ease, background .3s ease" }} />
          ))}
          <span style={{ fontSize: 11, color: T.dim, marginLeft: 10, letterSpacing: "0.05em" }}>{orden.length} autos · grupo {slide + 1}/{totalSlides}</span>
        </div>
      )}

      <div style={{ marginTop: 24, display: "flex", alignItems: "baseline", gap: 14 }}>
        <span style={{ fontFamily: DISPLAY, fontSize: 11, letterSpacing: "0.34em", color: T.gold, textTransform: "uppercase" }}>Equipo</span>
        <span style={{ fontSize: 11, color: T.dim }}>en vivo, según la etapa de cada auto</span>
        <span style={{ flex: 1, height: 1, background: T.line }} />
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", columnGap: 26, marginTop: 6 }}>
        {ROLES.map((r) => {
          const q = cola[r];
          const enFila = q.length - 1;
          return (
            <div key={r} style={{ padding: "13px 0", borderBottom: `1px solid ${T.line}` }}>
              {/* Solo la persona; el puesto queda implícito (para "Vendedor", que varía, se deja la palabra) */}
              <div style={{ fontSize: 10, letterSpacing: "0.16em", color: T.dim, textTransform: "uppercase" }}>
                {EQUIPO[r] && EQUIPO[r].length > 0 ? EQUIPO[r].join(" · ") : r}
              </div>
              {q.length === 0 ? (
                <div style={{ fontSize: 13.5, marginTop: 4, color: T.dim, fontStyle: "italic" }}>Disponible</div>
              ) : (
                <>
                  <div style={{ fontSize: 13.5, marginTop: 4, fontWeight: 600, color: T.ink }}>{nombreAuto(q[0].auto)}</div>
                  <div style={{ fontSize: 11, color: T.mut, marginTop: 1 }}>{q[0].etapa}</div>
                  {enFila > 0 && <div style={{ fontSize: 11, color: T.gold, marginTop: 3 }}>+{enFila} en fila</div>}
                </>
              )}
            </div>
          );
        })}
      </div>
      </div>
    </main>
  );
}

/* ================= Vista Agenda (Gantt semanal por operador — piloto aproximado) ================= */
function VistaAgenda({ autos }) {
  // 5 días hábiles a partir de hoy
  const dias = [];
  { const d = new Date(); d.setHours(0, 0, 0, 0); while (dias.length < 5) { const dow = d.getDay(); if (dow !== 0 && dow !== 6) dias.push(new Date(d)); d.setDate(d.getDate() + 1); } }
  const hoyISO = new Date().toISOString().slice(0, 10);
  // Orden del tablero: bloque URGE arriba; después, entrega más próxima (fecha + hora) primero.
  const claveOrden = (a) => (a.prioridad ? tsEntrega(a) - 1e13 : tsEntrega(a));
  const enProceso = [...autos].filter((a) => !entregado(a)).sort((a, b) => claveOrden(a) - claveOrden(b));

  const filas = ["Vendedor", "Técnico Digital", "Vidrios", "Líder", "Kevlar"];
  const grid = {}; filas.forEach((f) => (grid[f] = [[], [], [], [], []]));

  // Reparto por HORAS REALES (doc de Capacidad): cada etapa ocupa los días que su carga
  // implica, no un plano de 2/día. Montaje y —en modelos nuevos— el Técnico Digital
  // empujan la fila; el Kevlar corre en paralelo en su carril. Sigue siendo proyección visual.
  const HRS_DIA = 9;                                  // jornada efectiva por persona
  const personasDe = (owner) => (owner === "Vidrios" || owner === "Kevlar" ? 2 : 1);
  const horasEtapa = (a, h) => {
    const p = horasPiso(a);
    switch (HITOS[h].n) {
      case "Desmontaje": return p.desmontaje;
      case "Material cortado": return horasDigital(a); // aquí pega el nuevo vs repetido
      case "Armado de capas": return p.armado;
      case "En autoclave": return ciclosDe(a) * 3.3;   // tiempo de máquina (no mano de obra)
      case "Montaje": return p.montaje;                 // el frente más pesado
      case "Calidad aprobada": return 2;
      default: return 1;                                // Ingresado / Entregado: trámite
    }
  };
  enProceso.forEach((a) => {
    let cursor = 0; // días hábiles acumulados desde hoy
    for (let h = a.hito + 1; h < HITOS.length; h++) {
      if (noAplicaHito(a, h)) continue; // "En mano": sin desmontaje ni montaje
      const owner = HITOS[h].ow;
      const dia = Math.floor(cursor);
      if (dia < 5 && grid[owner]) grid[owner][dia].push({ auto: a, etapa: HITOS[h].n });
      const span = horasEtapa(a, h) / (HRS_DIA * personasDe(owner));
      cursor += Math.max(span, 0.4); // cada etapa avanza el reloj al menos ~medio día
    }
    if (a.kevlar.length) {
      const hk = horasPiso(a).kevlar;                   // plantilla (si 1ª vez) + instalación
      let cursorK = a.hito < HITO_DESMONTAJE ? 1 : 0;   // el Kevlar arranca al desmontar
      const pasos = 3 - a.kevlarHito;
      const spanK = pasos > 0 ? (hk / (HRS_DIA * 2)) / pasos : 0; // repartido entre los pasos que faltan
      for (let k = a.kevlarHito + 1; k <= 3; k++) {
        const dia = Math.floor(cursorK);
        if (dia < 5) grid["Kevlar"][dia].push({ auto: a, etapa: KEVLAR_PROCESO[k - 1] }); // trabajo en proceso
        cursorK += Math.max(spanK, 0.4);
      }
    }
  });

  const cellBg = (esHoy) => (esHoy ? "rgba(201,151,63,0.05)" : "transparent");

  return (
    <main style={{ maxWidth: 1240, margin: "0 auto", padding: "20px 34px 60px" }}>
      <div style={{ display: "flex", alignItems: "baseline", gap: 14, marginBottom: 6 }}>
        <span style={{ fontFamily: DISPLAY, fontSize: 12, letterSpacing: "0.3em", color: T.gold, textTransform: "uppercase" }}>Agenda de la semana</span>
        <span style={{ fontSize: 12, color: T.mut }}>proyección aproximada por operador · piloto</span>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "132px repeat(5, 1fr)", border: `1px solid ${T.line}`, borderRadius: 12, overflow: "hidden", marginTop: 14 }}>
        {/* encabezado */}
        <div style={{ background: T.panel, borderBottom: `1px solid ${T.line}`, padding: "12px 14px" }} />
        {dias.map((d, i) => {
          const esHoy = d.toISOString().slice(0, 10) === hoyISO;
          return (
            <div key={i} style={{ background: esHoy ? T.goldDim : T.panel, borderBottom: `1px solid ${T.line}`, borderLeft: `1px solid ${T.line}`, padding: "10px 12px", textAlign: "center" }}>
              <div style={{ fontSize: 10.5, letterSpacing: "0.14em", textTransform: "uppercase", color: esHoy ? T.gold : T.dim }}>{d.toLocaleDateString("es-MX", { weekday: "short" })}</div>
              <div className="tnum" style={{ fontSize: 13, color: esHoy ? T.gold : T.mut, marginTop: 2 }}>{d.getDate()}</div>
            </div>
          );
        })}

        {/* filas por operador */}
        {filas.map((f) => (
          <div key={f} style={{ display: "contents" }}>
            <div style={{ background: T.panel, borderBottom: `1px solid ${T.line}`, padding: "12px 14px", display: "flex", alignItems: "center" }}>
              <span style={{ fontSize: 11, letterSpacing: "0.1em", textTransform: "uppercase", color: T.ink, fontWeight: 600 }}>{f}</span>
            </div>
            {dias.map((d, i) => {
              const esHoy = d.toISOString().slice(0, 10) === hoyISO;
              const bloques = grid[f][i];
              return (
                <div key={i} style={{ borderBottom: `1px solid ${T.line}`, borderLeft: `1px solid ${T.line}`, padding: 8, minHeight: 62, background: cellBg(esHoy) }}>
                  {bloques.map((b, j) => {
                    const plus = false;
                    const urg = urgencia(b.auto) === "urgente";
                    return (
                      <div key={j} style={{ background: T.panel, border: `1px solid ${urg ? URG.urgente.c : T.line2}`, borderLeft: `3px solid ${urg ? URG.urgente.c : T.goldSoft}`, borderRadius: 6, padding: "5px 8px", marginBottom: 5 }}>
                        <div style={{ fontSize: 11.5, fontWeight: 600, color: T.ink, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{nombreAuto(b.auto)}</div>
                        <div style={{ fontSize: 10, color: f === "Kevlar" ? T.teal : T.gold, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{b.etapa}</div>
                      </div>
                    );
                  })}
                </div>
              );
            })}
          </div>
        ))}
      </div>

      <p style={{ fontSize: 11.5, color: T.dim, marginTop: 16, lineHeight: 1.5 }}>
        Proyección <b style={{ color: T.mut }}>aproximada</b>: cada etapa ocupa los días que implican sus <b style={{ color: T.mut }}>horas reales</b>
        (doc de Capacidad), no un plano fijo — por eso el montaje y, en modelos nuevos, el Técnico Digital empujan la fila. No modela el lag
        del proveedor de cejas ni todas las dependencias finas. El Kevlar se muestra en su propio carril, en paralelo.
      </p>
    </main>
  );
}

function Leyenda() {
  const dot = (c) => <span style={{ width: 8, height: 8, borderRadius: "50%", background: c }} />;
  const item = (sw, txt) => <span style={{ display: "inline-flex", alignItems: "center", gap: 7, fontSize: 11, color: T.mut }}>{sw}{txt}</span>;
  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: 20, alignItems: "center", paddingBottom: 14, marginBottom: 4, borderBottom: `1px solid ${T.line}` }}>
      {item(dot(T.blue), "Viking")}
      {item(dot(T.gold), "Viking Plus")}
      {item(<span style={{ fontSize: 10, letterSpacing: "0.08em", textTransform: "uppercase", color: T.mut, border: `1px solid ${T.line2}`, borderRadius: 4, padding: "1px 6px" }}>ahumado</span>, "Con lámina ahumada")}
      {item(dot(T.teal), "Kevlar")}
    </div>
  );
}

function Banda({ auto }) {
  const dias = diasPara(auto.entregaFecha);
  const u = URG[urgencia(auto)];
  const esG = auto.tipo === "Garantía";
  const pct = (auto.hito / (HITOS.length - 1)) * 100;
  const conKevlar = auto.kevlar.length > 0;

  return (
    <section style={{ background: T.panel, border: `1px solid ${T.line}`, borderRadius: 12, padding: "14px 16px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 14 }}>
        <div style={{ minWidth: 0 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
            <h3 style={{ margin: 0, fontSize: 19, fontWeight: 700, letterSpacing: "-0.01em", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{nombreAuto(auto)} <span style={{ fontWeight: 400, color: T.mut, fontSize: 14 }}>{auto.anio}</span></h3>
            {auto.bahia
              ? <span style={{ fontFamily: DISPLAY, fontSize: 9, letterSpacing: "0.16em", color: T.gold, border: `1px solid ${T.goldSoft}`, borderRadius: 3, padding: "2px 6px", flexShrink: 0, textTransform: "uppercase" }}>{bahiaTexto(auto.bahia)}</span>
              : auto.tipo === EN_MANO
                ? <span style={{ fontFamily: DISPLAY, fontSize: 9, letterSpacing: "0.16em", color: T.teal, border: `1px solid ${T.teal}`, borderRadius: 3, padding: "2px 6px", flexShrink: 0 }}>EN MANO</span>
                : <span style={{ fontFamily: DISPLAY, fontSize: 9, letterSpacing: "0.16em", color: T.dim, border: `1px solid ${T.line2}`, borderRadius: 3, padding: "2px 6px", flexShrink: 0 }}>EN COLA</span>}
            {esG && <span style={{ fontSize: 8.5, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: "#0a0a0b", background: T.gold, borderRadius: 3, padding: "3px 6px", flexShrink: 0 }}>Garantía</span>}
            {auto.prioridad && <span style={{ fontSize: 8.5, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: "#fff", background: "#c25454", borderRadius: 3, padding: "3px 6px", flexShrink: 0, animation: "breathe 1.6s ease-in-out infinite" }}>⚡ Urge</span>}
          </div>
          <div className="tnum" style={{ fontSize: 10.5, color: T.dim, marginTop: 3, letterSpacing: "0.03em" }}>{[auto.placa, auto.orden, auto.tipo === EN_MANO ? auto.cliente : ""].filter(Boolean).join("  ·  ")}</div>
        </div>
        <div style={{ textAlign: "right", flexShrink: 0 }}>
          <div style={{ display: "flex", alignItems: "baseline", gap: 8, justifyContent: "flex-end" }}>
            <span style={{ fontSize: 9, letterSpacing: "0.14em", textTransform: "uppercase", color: u.c }}>
              <span style={{ display: "inline-block", width: 5, height: 5, borderRadius: "50%", background: u.c, marginRight: 5, verticalAlign: "middle", animation: u.label === "Urgente" ? "breathe 1.6s ease-in-out infinite" : "none" }} />{u.label}
            </span>
            <span className="tnum" style={{ fontFamily: DISPLAY, fontSize: 34, color: u.c, lineHeight: 1 }}>{entregado(auto) ? "✓" : dias === null ? "—" : dias <= 0 ? "HOY" : dias + "d"}</span>
          </div>
          <div style={{ fontSize: 10.5, color: T.mut, marginTop: 2, textTransform: "capitalize", letterSpacing: "0.02em" }}>{fechaCorta(auto.entregaFecha)}{hora12(auto.entregaHora) ? " · " + hora12(auto.entregaHora) : ""}</div>
        </div>
      </div>

      <div style={{ marginTop: 10 }}>
        {esG && (
          <div style={{ marginBottom: vidriosDe(auto).length ? 10 : 0 }}>
            <div style={{ fontSize: 9, letterSpacing: "0.14em", color: T.dim, textTransform: "uppercase", marginBottom: 3 }}>Motivo de garantía</div>
            <div style={{ fontSize: 12.5, color: T.ink, fontWeight: 600, lineHeight: 1.35 }}>{auto.motivo || "—"}</div>
          </div>
        )}
        {/* En garantía los vidrios marcados se muestran con la MISMA lista clara que un coche normal */}
        {(!esG || vidriosDe(auto).length > 0) && (() => {
          const vid = vidriosDe(auto);
          const mitad = Math.ceil(vid.length / 2);
          const cols = [vid.slice(0, mitad), vid.slice(mitad)];
          const lineaVidrio = (p) => {
            const plus = auto.glass[p] === "Viking Plus";
            const cod = codigoVidrio(auto.orden, p);
            return (
              <div key={p} style={{ display: "flex", alignItems: "baseline", gap: 8, padding: "2px 0" }}>
                <span style={{ width: 6, height: 6, borderRadius: "50%", background: plus ? T.gold : T.blue, flexShrink: 0, transform: "translateY(-1px)" }} />
                <span style={{ fontSize: 13, color: T.ink, minWidth: 118 }}>{p}</span>
                {cod && <span className="tnum" style={{ fontSize: 12.5, fontWeight: 700, color: T.mut, minWidth: 76, flexShrink: 0 }}>{cod}</span>}
                <span style={{ fontSize: 12.5, fontWeight: 600, color: plus ? T.gold : T.blue, flexShrink: 0 }}>{auto.glass[p]}</span>
                {auto.ahumado[p] && <span style={{ fontSize: 10, letterSpacing: "0.06em", textTransform: "uppercase", color: T.mut, border: `1px solid ${T.line2}`, borderRadius: 4, padding: "1px 5px", flexShrink: 0 }}>ahumado</span>}
              </div>
            );
          };
          return (
            <div style={{ display: "grid", gridTemplateColumns: "1.3fr 1.3fr 1fr", gap: "4px 28px" }}>
              <div>
                <div style={{ fontSize: 9, letterSpacing: "0.14em", color: T.dim, textTransform: "uppercase", marginBottom: 4 }}>{esG ? "Vidrios a re-procesar" : "Vidrios"}</div>
                {cols[0].map(lineaVidrio)}
              </div>
              <div>
                <div style={{ fontSize: 9, letterSpacing: "0.14em", color: T.dim, textTransform: "uppercase", marginBottom: 4, visibility: "hidden" }}>·</div>
                {cols[1].map(lineaVidrio)}
              </div>
              <div>
                <div style={{ fontSize: 9, letterSpacing: "0.14em", color: T.dim, textTransform: "uppercase", marginBottom: 4 }}>Kevlar</div>
                {auto.kevlar.length ? auto.kevlar.map((z) => (
                  <div key={z} style={{ display: "flex", alignItems: "baseline", gap: 6, padding: "2px 0" }}>
                    <span style={{ width: 5, height: 5, borderRadius: "50%", background: T.teal, flexShrink: 0, transform: "translateY(-1px)" }} />
                    <span style={{ fontSize: 12.5, color: T.ink }}>{z}</span>
                  </div>
                )) : <div style={{ fontSize: 12, color: T.dim, fontStyle: "italic" }}>Sin Kevlar</div>}
                {auto.paquete.codigos.length > 0 && <div className="tnum" style={{ fontSize: 10.5, color: T.dim, marginTop: 6 }}>{auto.paquete.codigos.join(" · ")}</div>}
              </div>
            </div>
          );
        })()}
      </div>

      <div style={{ marginTop: 10, paddingTop: 8, borderTop: `1px solid ${T.line}` }}>
        <div style={{ display: "flex", alignItems: "baseline", gap: 8, marginBottom: 5 }}>
          {/* "Sigue" = el trabajo pendiente. El sistema solo registra lo terminado, así que
              no puede afirmar que algo esté "en proceso" — solo qué falta hacer. */}
          {/* Línea de tiempo: ✓ lo que ya quedó · FASE ACTUAL (grande) · → a dónde va */}
          {entregado(auto)
            ? <span style={{ fontFamily: DISPLAY, fontSize: 10.5, letterSpacing: "0.1em", color: T.teal, textTransform: "uppercase" }}>Entregado</span>
            : <>
                {auto.hito > 0 && <span style={{ fontSize: 9.5, color: T.dim }}>✓ {TAREA[etapaTerminada(auto).n] || etapaTerminada(auto).n} ·</span>}
                <span style={{ fontFamily: DISPLAY, fontSize: 10.5, letterSpacing: "0.1em", color: T.gold, textTransform: "uppercase" }}>{faseActual(auto)}</span>
                {enProcesoAhora(auto)
                  ? <span style={{ fontSize: 9.5, color: T.teal }}>▶ en proceso · {desdeHace(auto.inicioTs)}</span>
                  : <span style={{ fontSize: 9.5, color: T.dim }}>en espera</span>}
                {faseSiguiente(auto) && <span style={{ fontSize: 9.5, color: T.dim }}>· → {faseSiguiente(auto)}</span>}
              </>}
          <span className="tnum" style={{ fontSize: 9.5, color: T.dim, marginLeft: "auto" }}>{auto.hito + 1}/{HITOS.length}</span>
        </div>
        <div style={{ position: "relative", height: 8, marginBottom: conKevlar ? 8 : 0 }}>
          <div style={{ position: "absolute", top: 3, left: 0, right: 0, height: 2, background: T.line2, borderRadius: 1 }} />
          <div style={{ position: "absolute", top: 3, left: 0, width: pct + "%", height: 2, background: `linear-gradient(90deg, ${T.goldSoft}, ${T.gold})`, borderRadius: 1 }} />
          {HITOS.map((s, i) => {
            const x = (i / (HITOS.length - 1)) * 100, done = i < auto.hito, now = i === auto.hito;
            return <span key={s.n} title={s.n} style={{ position: "absolute", top: now ? 0 : 1.5, left: `calc(${x}% - ${now ? 4 : 2.5}px)`, width: now ? 8 : 5, height: now ? 8 : 5, borderRadius: "50%", background: now ? T.gold : done ? T.goldSoft : T.line2, boxShadow: now ? `0 0 8px ${T.gold}` : "none" }} />;
          })}
        </div>
        {conKevlar && (
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <span style={{ fontSize: 9, letterSpacing: "0.1em", color: T.teal, textTransform: "uppercase", width: 42, flexShrink: 0 }}>Kevlar</span>
            <div style={{ position: "relative", flex: 1, height: 6 }}>
              <div style={{ position: "absolute", top: 2, left: 0, right: 0, height: 2, background: T.line2, borderRadius: 1 }} />
              <div style={{ position: "absolute", top: 2, left: 0, width: (auto.kevlarHito / 3) * 100 + "%", height: 2, background: T.teal, borderRadius: 1 }} />
              {[1, 2, 3].map((i) => {
                const x = (i / 3) * 100;
                return <span key={i} style={{ position: "absolute", top: 0.5, left: `calc(${x}% - 2.5px)`, width: 5, height: 5, borderRadius: "50%", background: i <= auto.kevlarHito ? T.teal : T.line2 }} />;
              })}
            </div>
            <span style={{ fontSize: 9.5, color: auto.kevlarHito >= 3 ? T.teal : T.mut, flexShrink: 0 }}>{KEVLAR_PROCESO[auto.kevlarHito]}</span>
          </div>
        )}
      </div>

      {auto.notas && <div style={{ marginTop: 8, fontSize: 10.5, color: T.dim, fontStyle: "italic", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }} title={auto.notas}>{auto.notas}</div>}
    </section>
  );
}

/* ================= Vista Tableta (input de técnicos) ================= */
function VistaTableta({ autos, setAutos, recargar }) {
  const [flash, setFlash] = useState(null);
  const [pend, setPend] = useState({});
  const [nota, setNota] = useState(null);
  const [area, setArea] = useState("Todos");
  // "¿Quién registra?" — se guarda en el teléfono y firma cada avance en la bitácora
  const [quien, setQuien] = useState(() => { try { return localStorage.getItem("vk_quien") || ""; } catch (e) { return ""; } });
  const elegirQuien = (n) => { const v = quien === n ? "" : n; setQuien(v); try { localStorage.setItem("vk_quien", v); } catch (e) {} };
  const doFlash = (id) => { setFlash(id); setTimeout(() => setFlash((f) => (f === id ? null : f)), 900); };
  const marcarPend = (id, v) => setPend((p) => ({ ...p, [id]: v }));

  const mover = async (id, tipoAccion, dir) => {
    const campo = tipoAccion === "hito" ? "hito" : "kevlarHito";
    const max = tipoAccion === "hito" ? HITOS.length - 1 : 3;
    const previo = autos.find((a) => a.id === id);
    if (!previo) return;
    // "En mano" salta Desmontaje/Montaje: el destino puede estar a más de un paso.
    const nuevoVal = tipoAccion === "hito" ? proxHito(previo, dir) : Math.max(0, Math.min(max, previo[campo] + dir));
    const pasos = tipoAccion === "hito" ? Math.max(1, Math.abs(nuevoVal - previo.hito)) : 1;
    // Actualización optimista
    setAutos((p) => p.map((a) => (a.id === id ? { ...a, [campo]: nuevoVal } : a)));
    if (dir > 0) doFlash(id);
    if (MODO_DEMO) return;
    marcarPend(id, true);
    try {
      for (let i = 0; i < pasos; i++) await apiPost({ action: tipoAccion, id, dir, quien });
      await recargar(); // confirma con el servidor
    } catch (e) {
      // No adivinamos: pedimos al servidor el estado real y reconciliamos.
      // (el cambio pudo haberse guardado aunque la respuesta fallara)
      await recargar();
      setNota({ id, txt: e.message && e.message.indexOf("Kevlar") >= 0 ? e.message : "No se guardó, intenta de nuevo" });
      setTimeout(() => setNota((n) => (n && n.id === id ? null : n)), 2800);
    } finally {
      marcarPend(id, false);
    }
  };

  // Orden del tablero: bloque URGE arriba; después, entrega más próxima (fecha + hora) primero.
  const claveOrden = (a) => (a.prioridad ? tsEntrega(a) - 1e13 : tsEntrega(a));
  const enProceso = [...autos].filter((a) => !entregado(a)).sort((a, b) => claveOrden(a) - claveOrden(b));
  const entregadosSemana = autos.filter(entregado).length;
  // "▶ Empecé": marca el inicio real de la etapa pendiente (opcional, un solo toque).
  const iniciar = async (id) => {
    const a = autos.find((x) => x.id === id);
    if (!a) return;
    const etapa = proxHito(a, 1);
    setAutos((p) => p.map((x) => (x.id === id ? { ...x, inicioHito: etapa, inicioTs: new Date().toISOString() } : x)));
    if (MODO_DEMO) return;
    marcarPend(id, true);
    try { await apiPost({ action: "iniciar", id, etapa, quien }); await recargar(); }
    catch (e) { await recargar(); }
    finally { marcarPend(id, false); }
  };

  // ¿Le toca a este rol el siguiente paso del auto? (Kevlar = carril activo)
  const tocaA = (a, rol) => {
    if (rol === "Kevlar") return a.kevlar.length > 0 && a.hito >= HITO_DESMONTAJE && a.kevlarHito < 3;
    return a.hito < HITOS.length - 1 && HITOS[proxHito(a, 1)].ow === rol;
  };
  const visibles = area === "Todos" ? enProceso : enProceso.filter((x) => tocaA(x, area));

  return (
    <main style={{ maxWidth: 860, margin: "0 auto", padding: "18px 20px 70px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingBottom: 14, marginBottom: 6, borderBottom: `1px solid ${T.line}` }}>
        <span style={{ fontSize: 13, color: T.mut }}>Toca cuando <b style={{ color: T.ink }}>termines</b> tu parte. El tablero se actualiza solo.</span>
        <span style={{ fontSize: 12.5, color: T.mut }}>Entregados esta semana <b className="tnum" style={{ color: T.gold, fontSize: 17, fontFamily: DISPLAY, marginLeft: 6 }}>{entregadosSemana}</b></span>
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap", margin: "12px 0 0" }}>
        <span style={{ fontSize: 10, letterSpacing: "0.16em", color: T.dim, textTransform: "uppercase", marginRight: 2 }}>Registra</span>
        {[...CREW_FIJO, ...VENDEDORES].map((n) => <button key={n} onClick={() => elegirQuien(n)} style={S.chip(quien === n)}>{n}</button>)}
        {!quien && <span style={{ fontSize: 11.5, color: T.dim }}>elige tu nombre — firma cada avance en la bitácora</span>}
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap", margin: "10px 0 4px" }}>
        <span style={{ fontSize: 10, letterSpacing: "0.16em", color: T.dim, textTransform: "uppercase", marginRight: 2 }}>Ver</span>
        {["Todos", ...ROLES].map((r) => {
          const n = r === "Todos" ? enProceso.length : enProceso.filter((x) => tocaA(x, r)).length;
          return (
            <button key={r} onClick={() => setArea(r)} style={{ ...S.chip(area === r), fontSize: 12.5, padding: "6px 13px" }}>
              {r}{n > 0 && <span style={{ marginLeft: 6, opacity: 0.7 }}>{n}</span>}
            </button>
          );
        })}
      </div>

      <div style={{ display: "grid", gap: 14, marginTop: 12 }}>
        {visibles.map((a) => {
          const esUltimo = a.hito >= HITOS.length - 1;
          const conKevlar = a.kevlar.length > 0;
          const bloqueaEntrega = a.hito === HITOS.length - 2 && !kevlarListo(a);
          const ocupado = !!pend[a.id];
          return (
            <div key={a.id} style={{ background: T.panel, border: `1px solid ${T.line}`, borderRadius: 14, padding: 18, animation: flash === a.id ? "flash .9s ease-out, pop .3s ease-out" : "none", opacity: ocupado ? 0.75 : 1 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 12 }}>
                <div>
                  <div style={{ fontSize: 19, fontWeight: 700 }}>{nombreAuto(a)} <span style={{ color: T.mut, fontWeight: 400, fontSize: 14 }}>{a.anio}</span></div>
                  <div className="tnum" style={{ fontSize: 12, color: T.dim, marginTop: 3 }}>{a.orden} · {bahiaTexto(a.bahia) || (a.tipo === EN_MANO ? "En mano" : "En cola")}{a.tipo === "Garantía" ? "  · GARANTÍA" : ""}{a.tipo === EN_MANO && a.cliente ? " · " + a.cliente : ""}{a.prioridad ? <span style={{ color: "#e07a7a", fontWeight: 700 }}>  · ⚡ URGE</span> : null}</div>
                </div>
                <div style={{ textAlign: "right" }}>
                  {!esUltimo && a.hito > 0 && <div style={{ fontSize: 10.5, color: T.dim }}>✓ {TAREA[etapaTerminada(a).n] || etapaTerminada(a).n}</div>}
                  <div style={{ fontFamily: DISPLAY, fontSize: 13, color: esUltimo ? T.teal : T.gold, marginTop: 2 }}>{esUltimo ? "Entregado" : faseActual(a)}</div>
                  {!esUltimo && (enProcesoAhora(a)
                    ? <div style={{ fontSize: 10.5, color: T.teal, marginTop: 3 }}>▶ en proceso · {desdeHace(a.inicioTs)}</div>
                    : <div style={{ fontSize: 10.5, color: T.dim, marginTop: 3 }}>en espera</div>)}
                  {!esUltimo && faseSiguiente(a) && <div style={{ fontSize: 10.5, color: T.dim, marginTop: 3 }}>→ {faseSiguiente(a)}</div>}
                </div>
              </div>

              <div style={{ position: "relative", height: 10, margin: "16px 0 18px" }}>
                <div style={{ position: "absolute", top: 4, left: 0, right: 0, height: 2, background: T.line2 }} />
                <div style={{ position: "absolute", top: 4, left: 0, width: (a.hito / (HITOS.length - 1)) * 100 + "%", height: 2, background: T.gold }} />
                {HITOS.map((s, i) => { const x = (i / (HITOS.length - 1)) * 100, now = i === a.hito, done = i < a.hito;
                  return <span key={s.n} style={{ position: "absolute", top: now ? 0 : 2, left: `calc(${x}% - ${now ? 5 : 3}px)`, width: now ? 10 : 6, height: now ? 10 : 6, borderRadius: "50%", background: now ? T.gold : done ? T.goldSoft : T.line2 }} />; })}
              </div>

              <div style={{ display: "flex", gap: 10, alignItems: "stretch" }}>
                <button className="press" onClick={() => mover(a.id, "hito", 1)} disabled={esUltimo || bloqueaEntrega || ocupado}
                  style={{ flex: 1, cursor: esUltimo || bloqueaEntrega ? "not-allowed" : "pointer", border: "none", borderRadius: 12, padding: "18px 20px", fontFamily: BODY, fontSize: 17, fontWeight: 700,
                    background: esUltimo ? T.line : bloqueaEntrega ? T.line2 : T.gold, color: esUltimo || bloqueaEntrega ? T.dim : "#0a0a0b" }}>
                  {esUltimo ? "✓ Entregado" : bloqueaEntrega ? "Falta terminar Kevlar" : "✓ " + HITOS[proxHito(a, 1)].sig}
                </button>
                {!esUltimo && !enProcesoAhora(a) && (
                  <button className="press" onClick={() => iniciar(a.id)} disabled={ocupado} title="Marca la hora real en que empezó esta fase"
                    style={{ cursor: "pointer", border: `1px solid ${T.teal}`, background: "transparent", color: T.teal, borderRadius: 12, padding: "0 18px", fontSize: 14, fontWeight: 600, fontFamily: BODY, whiteSpace: "nowrap" }}>▶ Empecé</button>
                )}
                {a.hito > 0 && !esUltimo && (
                  <button className="press" onClick={() => mover(a.id, "hito", -1)} disabled={ocupado} title="Deshacer"
                    style={{ cursor: "pointer", border: `1px solid ${T.line2}`, background: "transparent", color: T.mut, borderRadius: 12, padding: "0 18px", fontSize: 13, fontFamily: BODY }}>Deshacer</button>
                )}
              </div>

              {nota && nota.id === a.id && (
                <div style={{ marginTop: 10, fontSize: 12.5, color: "#e0b57a", background: "rgba(201,151,63,0.12)", border: `1px solid ${T.goldSoft}`, borderRadius: 8, padding: "8px 12px" }}>{nota.txt}</div>
              )}

              {conKevlar && (() => {
                const kevlarBloqueado = a.hito < HITO_DESMONTAJE;
                return (
                <div style={{ marginTop: 14, paddingTop: 14, borderTop: `1px solid ${T.line}` }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
                    <span style={{ fontSize: 11, letterSpacing: "0.14em", color: T.teal, textTransform: "uppercase" }}>Carril Kevlar</span>
                    <span style={{ fontSize: 12.5, color: a.kevlarHito >= 3 ? T.teal : T.mut, fontWeight: 600 }}>{kevlarBloqueado ? "Se habilita al terminar el desmontaje" : a.kevlarHito >= 3 ? "Kevlar listo ✓" : KEVLAR_PROCESO[a.kevlarHito]}</span>
                  </div>
                  <div style={{ display: "flex", gap: 10 }}>
                    <button className="press" onClick={() => mover(a.id, "kevlar", 1)} disabled={a.kevlarHito >= 3 || ocupado || kevlarBloqueado}
                      style={{ flex: 1, cursor: a.kevlarHito >= 3 || kevlarBloqueado ? "not-allowed" : "pointer", border: "none", borderRadius: 12, padding: "14px 18px", fontFamily: BODY, fontSize: 15, fontWeight: 700,
                        background: a.kevlarHito >= 3 || kevlarBloqueado ? T.line : T.teal, color: a.kevlarHito >= 3 || kevlarBloqueado ? T.dim : "#0a0a0b" }}>
                      {kevlarBloqueado ? "Kevlar en espera" : a.kevlarHito >= 3 ? "✓ Kevlar listo" : "✓ " + KEVLAR_SIG[a.kevlarHito]}
                    </button>
                    {a.kevlarHito > 0 && !kevlarBloqueado && (
                      <button className="press" onClick={() => mover(a.id, "kevlar", -1)} disabled={ocupado}
                        style={{ cursor: "pointer", border: `1px solid ${T.line2}`, background: "transparent", color: T.mut, borderRadius: 12, padding: "0 16px", fontSize: 13, fontFamily: BODY }}>Deshacer</button>
                    )}
                  </div>
                </div>
                );
              })()}
            </div>
          );
        })}
        {visibles.length === 0 && <div style={{ textAlign: "center", color: T.dim, padding: "50px 0", fontSize: 14 }}>{enProceso.length === 0 ? "No hay autos en proceso." : "Nada pendiente para " + area + " ahora mismo."}</div>}
      </div>
    </main>
  );
}

/* ================= Panel de Control (admin) ================= */
function Panel({ autos, setAutos, recargar }) {
  const [clave, setClave] = useState(MODO_DEMO ? "demo" : "");
  const [intento, setIntento] = useState("");
  const [nuevoId, setNuevoId] = useState(null);
  const [guardando, setGuardando] = useState({});
  const [abiertos, setAbiertos] = useState({}); // entregados: colapsados salvo que se abran
  const toggleAbierto = (id) => setAbiertos((o) => ({ ...o, [id]: !o[id] }));
  const abierto = MODO_DEMO || clave !== "";

  if (!abierto) {
    return (
      <main style={{ maxWidth: 380, margin: "80px auto", padding: "0 20px", textAlign: "center" }}>
        <div style={{ fontFamily: DISPLAY, fontSize: 13, letterSpacing: "0.3em", color: T.gold, marginBottom: 18 }}>CONTROL</div>
        <input type="password" placeholder="Clave de administración" value={intento} onChange={(e) => setIntento(e.target.value)}
          autoCapitalize="none" autoCorrect="off" spellCheck={false}
          onKeyDown={(e) => { if (e.key === "Enter") setClave(intento.trim()); }}
          style={{ ...S.inp, textAlign: "center", fontSize: 15, padding: "13px" }} />
        <button onClick={() => setClave(intento.trim())} style={{ ...S.gold, width: "100%", marginTop: 12, padding: "13px" }}>Entrar</button>
        <p style={{ fontSize: 11.5, color: T.dim, marginTop: 14 }}>La clave se valida al guardar. Sin ella, el backend rechaza cualquier cambio.</p>
      </main>
    );
  }

  const upd = (id, c, v) => setAutos((p) => p.map((a) => (a.id === id ? { ...a, [c]: v } : a)));
  // Cambiar el tipo de ingreso; "En mano" no ocupa bahía, así que se limpia si tenía.
  const setTipo = (id, t) => setAutos((p) => p.map((a) => (a.id === id ? { ...a, tipo: t, bahia: t === EN_MANO ? "" : a.bahia } : a)));
  const setMarca = (id, marca) => setAutos((p) => p.map((a) => (a.id === id ? { ...a, marca, modelo: "", tipoVeh: "" } : a)));
  const setModelo = (id, marca, modelo) => setAutos((p) => p.map((a) => (a.id === id ? { ...a, modelo, tipoVeh: tipoDe(marca, modelo) } : a)));
  const aplicarCob = (id, nombre) => setAutos((p) => p.map((a) => {
    if (a.id !== id) return a;
    const cob = COBERTURAS[nombre]; const nivel = cob.soloPlus ? "Viking Plus" : a.nivel;
    const glass = {}; cob.pos.forEach((q) => (glass[q] = nivel));
    return { ...a, glass, nivel, paquete: { label: nombre, codigos: [...(cob.cod[nivel] || cob.cod["Viking Plus"])] } };
  }));
  const integral = (id) => setAutos((p) => p.map((a) => {
    if (a.id !== id) return a;
    const glass = {}; COBERTURAS["Cristales completos"].pos.forEach((q) => (glass[q] = "Viking Plus"));
    return { ...a, glass, nivel: "Viking Plus", kevlar: ["Puertas del.", "Puertas tras.", "Cajuela / 5ª puerta"], paquete: { label: "Protección integral", codigos: ["VK106", "VK108", "VK110", "VK130×4", "VK132"] } };
  }));
  const ahuGrupo = (id, g) => setAutos((p) => p.map((a) => {
    if (a.id !== id) return a;
    const ahumado = {}; if (g !== "Ninguno") GRUPOS[g].forEach((q) => { if (a.glass[q]) ahumado[q] = true; });
    return { ...a, ahumado };
  }));
  const ahuPos = (id, q) => setAutos((p) => p.map((a) => {
    if (a.id !== id || !a.glass[q]) return a;
    const ah = { ...a.ahumado }; ah[q] ? delete ah[q] : (ah[q] = true); return { ...a, ahumado: ah };
  }));
  const tglGlass = (id, pos) => setAutos((p) => p.map((a) => {
    if (a.id !== id) return a;
    const g = { ...a.glass }, ah = { ...a.ahumado };
    if (g[pos]) { delete g[pos]; delete ah[pos]; } else { g[pos] = a.nivel; }
    return { ...a, glass: g, ahumado: ah, paquete: { ...a.paquete, label: "Personalizado" } };
  }));
  const tgl = (id, campo, v) => setAutos((p) => p.map((a) => (a.id === id ? { ...a, [campo]: a[campo].includes(v) ? a[campo].filter((x) => x !== v) : [...a[campo], v] } : a)));
  // Un solo vendedor por unidad: elegir uno quita al anterior; tocarlo de nuevo lo desmarca.
  const setVendedor = (id, n) => setAutos((p) => p.map((a) => {
    if (a.id !== id) return a;
    const yaEstaba = (a.crew || []).includes(n);
    const sinVendedores = (a.crew || []).filter((x) => !VENDEDORES.includes(x));
    return { ...a, crew: yaEstaba ? sinVendedores : [...sinVendedores, n] };
  }));

  const agregar = () => {
    const nid = Date.now(); // id único: nunca choca con otro auto (evita sobrescribir)
    // Número de orden automático: el mayor existente + 1 (editable por si se necesita otro).
    // El backend lo confirma al guardar: si va vacío o "VK-", asigna el consecutivo él mismo.
    const nums = autos.map((x) => parseInt(ordenCorta(x.orden), 10)).filter((n) => !isNaN(n));
    const sigOrden = nums.length ? "VK-" + (Math.max(...nums) + 1) : "VK-";
    setNuevoId(nid);
    setAutos((p) => [{ id: nid, _local: true, tipo: "Nuevo", marca: "", modelo: "", tipoVeh: "", anio: 2026, placa: "", orden: sigOrden, cliente: "", bahia: "", entregaFecha: "2026-07-20", entregaHora: "18:00", nivel: "Viking Plus", paquete: { label: "Sin paquete", codigos: [] }, glass: {}, ahumado: {}, kevlar: [], kevlarHito: 0, vidriosNuevo: true, kevlarNuevo: false, hito: 0, crew: [...CREW_FIJO], motivo: "", notas: "" }, ...p]);
    if (typeof window !== "undefined") window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const guardar = async (a) => {
    if (MODO_DEMO) return;
    setGuardando((g) => ({ ...g, [a.id]: "…" }));
    // No recargamos toda la lista: borraría autos nuevos aún sin guardar u otras
    // ediciones en curso. La tarjeta ya vive en el estado local con su id.
    // Se manda `vidrios` (claves de posición separadas por coma) para que el backend
    // lo vuelque tal cual a la columna VIDRIOS de la hoja AUTOS, sin recalcular nada.
    try {
      const j = await apiPost({ action: "guardar", clave, auto: { ...a, vidrios: clavesVidrios(a) } });
      // Guardado confirmado: ya vive en el servidor → deja de ser "_local" (y toma la orden asignada)
      setAutos((p) => p.map((x) => (x.id === a.id ? { ...x, _local: false, orden: j.orden || x.orden } : x)));
      setGuardando((g) => ({ ...g, [a.id]: "✓ Guardado" })); setTimeout(() => setGuardando((g) => ({ ...g, [a.id]: "" })), 1800);
    }
    catch (e) {
      setGuardando((g) => ({ ...g, [a.id]: "✗ " + e.message }));
      // Clave incorrecta → regresar a la pantalla de clave para reintentar.
      // Lo capturado NO se pierde: los autos nuevos son _local y las ediciones viven en el estado.
      if (String(e.message).indexOf("Clave incorrecta") >= 0) setTimeout(() => { setClave(""); setIntento(""); }, 1500);
    }
  };
  const eliminar = async (id) => {
    setAutos((p) => p.filter((a) => a.id !== id));
    if (MODO_DEMO) return;
    try { await apiPost({ action: "eliminar", clave, id }); }
    catch (e) { setGuardando((g) => ({ ...g, [id]: "✗ No se pudo eliminar" })); }
  };
  // Archivar: el auto entregado sale de TODAS las vistas, pero su fila queda en la hoja
  // (historial para el análisis de tiempos). No es eliminar.
  const archivar = async (id) => {
    if (MODO_DEMO) { setAutos((p) => p.filter((a) => a.id !== id)); return; }
    setGuardando((g) => ({ ...g, [id]: "…" }));
    try { await apiPost({ action: "archivar", clave, id }); setAutos((p) => p.filter((a) => a.id !== id)); }
    catch (e) { setGuardando((g) => ({ ...g, [id]: "✗ " + e.message })); }
  };

  return (
    <main style={{ maxWidth: 980, margin: "0 auto", padding: "26px 34px 80px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
        <p style={{ margin: 0, fontSize: 13, color: T.mut, maxWidth: 600, lineHeight: 1.5 }}>
          Alta en menos de un minuto. El auto nuevo aparece arriba. {MODO_DEMO ? "MODO DEMO: los cambios no se guardan." : "Al terminar de editar un auto, toca Guardar."}
        </p>
        <button onClick={agregar} style={S.gold}>+ Agregar auto</button>
      </div>
      {/* Mismo orden que la TV: lo nuevo sin guardar arriba, luego URGE, luego entrega más
          próxima; los entregados (ya no relevantes hoy) se van hasta el final. */}
      <div style={{ display: "grid", gap: 16 }}>
        {[...autos].sort((x, y) => {
          if (!!x._local !== !!y._local) return x._local ? -1 : 1;
          if (entregado(x) !== entregado(y)) return entregado(x) ? 1 : -1;
          if (!!x.prioridad !== !!y.prioridad) return x.prioridad ? -1 : 1;
          return tsEntrega(x) - tsEntrega(y);
        }).map((a) => {
          const esG = a.tipo === "Garantía", nuevo = a.id === nuevoId;
          // Entregado = fuera del día a día: se muestra en una sola línea hasta que lo abras.
          if (entregado(a) && !abiertos[a.id]) return (
            <div key={a.id} style={{ background: T.panel, border: `1px solid ${T.line}`, borderRadius: 12, padding: "12px 18px", display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap", opacity: 0.6 }}>
              <span style={{ fontSize: 9.5, letterSpacing: "0.14em", textTransform: "uppercase", color: T.teal, border: `1px solid rgba(90,160,138,.45)`, borderRadius: 3, padding: "2px 6px" }}>Entregado</span>
              <span style={{ fontSize: 14, fontWeight: 600 }}>{nombreAuto(a)}</span>
              <span className="tnum" style={{ fontSize: 11.5, color: T.dim }}>{a.orden}{a.placa ? " · " + a.placa : ""} · {fechaCorta(a.entregaFecha)}</span>
              <span style={{ fontSize: 11, color: T.dim, marginLeft: "auto" }}>se archiva solo a las 24 h</span>
              <button onClick={() => toggleAbierto(a.id)} style={S.ghost}>Abrir</button>
              <button onClick={() => archivar(a.id)} style={{ ...S.ghost, color: T.teal, borderColor: "rgba(90,160,138,.45)" }}>Archivar ✓</button>
              {guardando[a.id] ? <span style={{ fontSize: 12, color: T.mut }}>{guardando[a.id]}</span> : null}
            </div>
          );
          return (
            <div key={a.id} style={{ background: T.panel, border: `1px solid ${nuevo ? T.gold : T.line}`, borderRadius: 12, padding: 20, animation: nuevo ? "glow 1.6s ease-in-out 2" : "none", opacity: entregado(a) && !nuevo ? 0.55 : 1 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
                <Lbl>Ingreso</Lbl>
                {["Nuevo", "Garantía", EN_MANO].map((t) => <button key={t} onClick={() => setTipo(a.id, t)} style={S.chip(a.tipo === t)}>{t}</button>)}
                {esG && <span style={{ fontSize: 11.5, color: T.mut, marginLeft: 6 }}>Sin facturar · elige la etapa de arranque según la reparación</span>}
                {a.tipo === EN_MANO && <span style={{ fontSize: 11.5, color: T.mut, marginLeft: 6 }}>Vidrios de socio, ya desmontados — sin bahía; el flujo salta desmontaje y montaje</span>}
                {entregado(a) && (
                  <>
                    <button onClick={() => toggleAbierto(a.id)} style={{ ...S.ghost, marginLeft: "auto" }}>Cerrar</button>
                    <button onClick={() => archivar(a.id)} title="Sale de todas las vistas; la fila queda en la hoja como historial"
                      style={{ ...S.ghost, color: T.teal, borderColor: "rgba(90,160,138,.45)" }}>Archivar ✓</button>
                  </>
                )}
                <button onClick={() => upd(a.id, "prioridad", !a.prioridad)} title="Este auto pasa al frente de la fila"
                  style={{ ...S.chip(!!a.prioridad), marginLeft: entregado(a) ? 0 : "auto", borderColor: a.prioridad ? "#e07a7a" : T.line2, color: a.prioridad ? "#e07a7a" : T.mut, background: a.prioridad ? "rgba(224,122,122,.12)" : "transparent", fontWeight: 700 }}>⚡ Urge</button>
                <button onClick={() => eliminar(a.id)} style={{ ...S.ghost, color: "#c96a6a", borderColor: "rgba(201,106,106,.35)" }}>Eliminar</button>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1.2fr .55fr .8fr .55fr", gap: 10, marginBottom: 10 }}>
                <Campo label="Marca">
                  <select style={S.inp} value={a.marca} onChange={(e) => setMarca(a.id, e.target.value)}>
                    <option value="">— elige —</option>
                    {MARCAS.map((m) => <option key={m} value={m}>{m}</option>)}
                  </select>
                </Campo>
                <Campo label={"Modelo" + (a.tipoVeh ? " · " + a.tipoVeh : "")}>
                  {a.marca === "Otro" ? (
                    <input style={S.inp} value={a.modelo} onChange={(e) => upd(a.id, "modelo", e.target.value)} placeholder="Escribir modelo" />
                  ) : (
                    <select style={S.inp} value={a.modelo} onChange={(e) => setModelo(a.id, a.marca, e.target.value)} disabled={!a.marca}>
                      <option value="">{a.marca ? "— elige —" : "elige marca"}</option>
                      {(VEHICULOS[a.marca] || []).map((m) => <option key={m} value={m}>{m}</option>)}
                    </select>
                  )}
                </Campo>
                <Campo label="Año"><input style={S.inp} type="number" value={a.anio} onChange={(e) => upd(a.id, "anio", Number(e.target.value))} /></Campo>
                <Campo label="Placa"><input style={S.inp} value={a.placa} onChange={(e) => upd(a.id, "placa", e.target.value)} /></Campo>
                {a.tipo === EN_MANO
                  ? <Campo label="Bahía"><div style={{ ...S.inp, display: "flex", alignItems: "center", color: T.dim, fontStyle: "italic", border: `1px dashed ${T.line2}`, background: "transparent" }}>No aplica</div></Campo>
                  : (
                    /* Solo se captura el NÚMERO; la palabra "Bahía" la pone el sistema.
                       Sin número = En cola. En la hoja se guarda "B3" para no romper nada. */
                    <Campo label="Bahía">
                      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <span style={{ fontSize: 12.5, color: T.mut, whiteSpace: "nowrap" }}>Bahía</span>
                        <input style={{ ...S.inp, width: 70, textAlign: "center", fontWeight: 700 }} inputMode="numeric"
                          value={String(a.bahia || "").replace(/\D/g, "")}
                          onChange={(e) => { const n = e.target.value.replace(/\D/g, ""); upd(a.id, "bahia", n ? "B" + n : ""); }}
                          placeholder="—" />
                        <span style={{ fontSize: 11.5, color: T.dim }}>
                          {String(a.bahia || "").replace(/\D/g, "") ? "" : "sin número = En cola"}
                        </span>
                      </div>
                    </Campo>
                  )}
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 16, flexWrap: "wrap", marginBottom: 12 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <Lbl>Vidrios</Lbl>
                  <button onClick={() => upd(a.id, "vidriosNuevo", true)} style={S.chip(a.vidriosNuevo)}>Primera vez</button>
                  <button onClick={() => upd(a.id, "vidriosNuevo", false)} style={S.chip(!a.vidriosNuevo)}>Repetido</button>
                </div>
                {a.kevlar.length > 0 && (
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <Lbl>Kevlar</Lbl>
                    <button onClick={() => upd(a.id, "kevlarNuevo", true)} style={S.chip(a.kevlarNuevo)}>Primera vez</button>
                    <button onClick={() => upd(a.id, "kevlarNuevo", false)} style={S.chip(!a.kevlarNuevo)}>Repetido</button>
                  </div>
                )}
                <span style={{ fontSize: 11.5, color: T.mut }}>"Primera vez" del modelo suma trabajo (escaneo/patrón, plantillas) y aleja la fecha sugerida</span>
              </div>
              {/* Sin campo de cliente/dueño: el tablero no captura ni muestra datos del dueño.
                  La columna CLIENTE sigue en la hoja por compatibilidad, pero queda vacía. */}
              {a.tipo === EN_MANO && (
                <div style={{ marginBottom: 10 }}>
                  <Campo label="Socio comercial / referencia"><input style={S.inp} value={a.cliente} onChange={(e) => upd(a.id, "cliente", e.target.value)} placeholder="ej. Blindajes XYZ — 3 vidrios de Suburban" /></Campo>
                </div>
              )}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr .8fr", gap: 10, marginBottom: 8 }}>
                <Campo label="Orden"><input style={S.inp} value={a.orden} onChange={(e) => upd(a.id, "orden", e.target.value)} /></Campo>
                <Campo label="Entrega"><input style={S.inp} type="date" value={a.entregaFecha} onChange={(e) => upd(a.id, "entregaFecha", e.target.value)} /></Campo>
                <Campo label="Hora"><input style={S.inp} type="time" value={a.entregaHora} onChange={(e) => upd(a.id, "entregaHora", e.target.value)} /></Campo>
              </div>
              {(() => {
                const sug = fechaSugerida(a, autos);
                const coincide = a.entregaFecha === sug;
                const cuello = cuelloDe(a, autos);
                const hp = horasPisoTotal(a), hd = horasDigital(a);
                return (
                  <div style={{ marginBottom: 14 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap", fontSize: 12.5, color: T.mut }}>
                      <span>Sugerencia por carga del taller: <b style={{ color: T.gold, textTransform: "capitalize" }}>{fechaCorta(sug)}</b> <span style={{ color: T.dim }}>(estimado)</span></span>
                      {a.prioridad && <span style={{ color: "#e07a7a", fontWeight: 600 }}>⚡ URGE — calculado como el primero de la fila</span>}
                      {!coincide && <button onClick={() => upd(a.id, "entregaFecha", sug)} style={S.ghost}>Usar fecha sugerida</button>}
                      {coincide && <span style={{ color: T.teal }}>✓ en uso</span>}
                    </div>
                    <div className="tnum" style={{ fontSize: 11, color: T.dim, marginTop: 5 }}>
                      Manda: <b style={{ color: cuello === "Técnico Digital" ? T.blue : T.mut }}>{cuello}</b>
                      &nbsp;·&nbsp; Piso ~{hp.toFixed(0)} h &nbsp;·&nbsp; Digital ~{hd.toFixed(0)} h
                      &nbsp;·&nbsp; {a.vidriosNuevo ? "modelo NUEVO (sin escanear)" : "modelo REPETIDO (en el sistema)"}
                    </div>
                    {(() => {
                      const imp = impactoAdelantar(a, autos);
                      if (!imp) return null;
                      return (
                        <div style={{ marginTop: 8, padding: "9px 12px", border: `1px solid ${T.line2}`, borderLeft: `3px solid ${T.blue}`, borderRadius: 8, background: "rgba(125,167,196,.06)", fontSize: 12 }}>
                          <div style={{ color: T.ink }}>
                            <b style={{ color: T.blue }}>Si lo adelantas al frente de la fila:</b>{" "}
                            saldría <b style={{ textTransform: "capitalize" }}>{fechaCorta(imp.fecha)}</b>
                            {imp.gana > 0 && <span style={{ color: T.teal }}> — {imp.gana} {imp.gana === 1 ? "día" : "días"} antes</span>}
                          </div>
                          <div style={{ color: T.mut, marginTop: 3 }}>
                            {imp.afectados.length
                              ? <>Costo: {imp.afectados.map((x) => `${nombreAuto(x.auto)} (${x.auto.orden}) +${x.dias}d`).join(" · ")}</>
                              : <>Sin costo para los demás.</>}
                          </div>
                        </div>
                      );
                    })()}
                  </div>
                );
              })()}

              {esG ? (
                <div style={{ marginBottom: 14 }}>
                  <div style={{ marginBottom: 12 }}><Campo label="Motivo de garantía"><input style={S.inp} value={a.motivo} onChange={(e) => upd(a.id, "motivo", e.target.value)} placeholder="ej. Delaminación lateral tras. izq. — deslaminar y rehacer" /></Campo></div>
                  {/* En garantía también se marcan los vidrios afectados: alimentan la columna
                      VIDRIOS (app del autoclave), el estimador de carga y el kit a re-procesar. */}
                  <div style={{ background: T.bg, border: `1px solid ${T.line}`, borderRadius: 10, padding: 14 }}>
                    <Lbl style={{ display: "block", marginBottom: 6 }}>Vidrios a re-procesar</Lbl>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                      {GLASS_POSITIONS.map((q) => (
                        <button key={q} onClick={() => tglGlass(a.id, q)} style={S.chip(!!a.glass[q])} title={q}>
                          <span className="tnum" style={{ fontWeight: 700 }}>{POS_CODE[q]}</span> <span style={{ opacity: 0.75 }}>{q}</span>
                        </button>
                      ))}
                    </div>
                    <Lbl style={{ display: "block", margin: "12px 0 6px" }}>Kevlar a re-instalar (si aplica)</Lbl>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                      {KEVLAR_ZONES.map((z) => <button key={z} onClick={() => tgl(a.id, "kevlar", z)} style={S.chip(a.kevlar.includes(z))}>{z}</button>)}
                    </div>
                    <div style={{ marginTop: 12, paddingTop: 10, borderTop: `1px solid ${T.line}`, fontSize: 11.5, color: T.mut }}>
                      Se escribirá en la columna <b className="tnum" style={{ color: T.gold }}>VIDRIOS</b>:{" "}
                      {clavesVidrios(a)
                        ? <span className="tnum" style={{ color: T.ink }}>{clavesVidrios(a)}</span>
                        : <span style={{ fontStyle: "italic", color: T.dim }}>sin vidrios seleccionados</span>}
                    </div>
                  </div>
                </div>
              ) : (
                <>
                  <div style={{ background: T.bg, border: `1px solid ${T.line}`, borderRadius: 10, padding: 14, marginBottom: 12 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10, flexWrap: "wrap" }}>
                      <Lbl>Nivel</Lbl>
                      {["Viking", "Viking Plus"].map((n) => <button key={n} onClick={() => upd(a.id, "nivel", n)} style={S.chip(a.nivel === n)}>{n}</button>)}
                      <span style={{ marginLeft: "auto", fontSize: 12, color: T.mut }}><b style={{ color: T.gold, fontWeight: 600 }}>{a.paquete.label}</b>{a.paquete.codigos.length ? <span className="tnum">&ensp;{a.paquete.codigos.join(" ")}</span> : null}</span>
                    </div>
                    <Lbl style={{ marginBottom: 6, display: "block" }}>Paquete — un clic</Lbl>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginTop: 6 }}>
                      {Object.keys(COBERTURAS).map((n) => <button key={n} onClick={() => aplicarCob(a.id, n)} style={S.pkg}>{n}</button>)}
                      <button onClick={() => integral(a.id)} style={{ ...S.pkg, borderColor: T.goldSoft, color: T.gold }}>★ Protección integral</button>
                    </div>
                    <Lbl style={{ margin: "14px 0 6px", display: "block" }}>Vidrios — selección individual (incluye aletas)</Lbl>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                      {GLASS_POSITIONS.map((q) => (
                        <button key={q} onClick={() => tglGlass(a.id, q)} style={S.chip(!!a.glass[q])} title={q}>
                          <span className="tnum" style={{ fontWeight: 700 }}>{POS_CODE[q]}</span> <span style={{ opacity: 0.75 }}>{q}</span>
                        </button>
                      ))}
                    </div>
                    <div style={{ marginTop: 12, paddingTop: 10, borderTop: `1px solid ${T.line}`, fontSize: 11.5, color: T.mut }}>
                      Se escribirá en la columna <b className="tnum" style={{ color: T.gold }}>VIDRIOS</b>:{" "}
                      {clavesVidrios(a)
                        ? <span className="tnum" style={{ color: T.ink }}>{clavesVidrios(a)}</span>
                        : <span style={{ fontStyle: "italic", color: T.dim }}>sin vidrios seleccionados</span>}
                    </div>
                  </div>
                  <div style={{ marginBottom: 12 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap", marginBottom: 7 }}>
                      <Lbl>Ahumado</Lbl>
                      {["Ninguno", "Delanteros", "Traseros", "Todos"].map((g) => <button key={g} onClick={() => ahuGrupo(a.id, g)} style={S.chip(false)}>{g}</button>)}
                      <span style={{ fontSize: 11.5, color: T.mut }}>{resumenAhumado(a)}</span>
                    </div>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                      {vidriosDe(a).map((q) => <button key={q} onClick={() => ahuPos(a.id, q)} style={S.chip(!!a.ahumado[q])}>{q}{q === "Parabrisas" ? " ⚠" : ""}</button>)}
                    </div>
                  </div>
                  <div style={{ marginBottom: 12 }}>
                    <Lbl style={{ display: "block", marginBottom: 7 }}>Kevlar — zonas y postes</Lbl>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginTop: 7 }}>
                      {KEVLAR_ZONES.map((z) => <button key={z} onClick={() => tgl(a.id, "kevlar", z)} style={S.chip(a.kevlar.includes(z))}>{z}</button>)}
                    </div>
                  </div>
                </>
              )}

              <div style={{ marginBottom: 12 }}>
                <Lbl style={{ display: "block", marginBottom: 7 }}>Vendedor de esta unidad</Lbl>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                  {VENDEDORES.map((n) => <button key={n} onClick={() => setVendedor(a.id, n)} style={S.chip((a.crew || []).includes(n))}>{n}</button>)}
                </div>
                <div style={{ fontSize: 11, color: T.dim, marginTop: 6 }}>El equipo técnico ({CREW_FIJO.join(", ")}) se asigna solo — nada que capturar.</div>
              </div>
              <div style={{ marginBottom: 12 }}>
                <Campo label={esG ? "Última etapa terminada (arranque)" : "Última etapa terminada"}>
                  <select style={S.inp} value={a.hito} onChange={(e) => upd(a.id, "hito", Number(e.target.value))}>
                    {HITOS.map((s, i) => <option key={s.n} value={i}>{i + 1}. {s.n} ({s.ow})</option>)}
                  </select>
                </Campo>
                <div style={{ fontSize: 11, color: T.dim, marginTop: 5 }}>
                  {a.hito > 0 ? `✓ ${TAREA[etapaTerminada(a).n] || etapaTerminada(a).n} · ` : ""}
                  <b style={{ color: T.gold }}>{faseActual(a)}</b>
                  {faseSiguiente(a) ? ` · → ${faseSiguiente(a)}` : ""}
                </div>
              </div>
              <Campo label="Notas"><textarea style={{ ...S.inp, minHeight: 42, resize: "vertical" }} value={a.notas} onChange={(e) => upd(a.id, "notas", e.target.value)} /></Campo>

              {!MODO_DEMO && (
                <div style={{ display: "flex", justifyContent: "flex-end", alignItems: "center", gap: 12, marginTop: 14 }}>
                  <span style={{ fontSize: 12, color: guardando[a.id] && guardando[a.id].startsWith("✗") ? "#e07a7a" : T.teal }}>{guardando[a.id] || ""}</span>
                  <button onClick={() => guardar(a)} style={S.gold}>Guardar</button>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </main>
  );
}

/* ================= Piezas ================= */
function Campo({ label, children }) { return <label style={{ display: "block" }}><Lbl style={{ display: "block", marginBottom: 5 }}>{label}</Lbl>{children}</label>; }
function Lbl({ children, style }) { return <span style={{ fontSize: 9.5, letterSpacing: "0.18em", color: T.dim, textTransform: "uppercase", fontWeight: 600, ...style }}>{children}</span>; }
function Shield() {
  return (
    <svg width="26" height="30" viewBox="0 0 30 34" fill="none">
      <path d="M15 2 L27 7 V17 C27 25 21 30 15 32 C9 30 3 25 3 17 V7 Z" stroke={T.gold} strokeWidth="1.5" fill="none" />
      <path d="M15 8 L21 18 H9 Z" stroke={T.gold} strokeWidth="1.3" fill="none" />
    </svg>
  );
}
const S = {
  inp: { width: "100%", background: T.bg, border: `1px solid ${T.line2}`, borderRadius: 8, padding: "9px 11px", color: T.ink, fontSize: 13, fontFamily: BODY, boxSizing: "border-box", outline: "none" },
  gold: { fontSize: 12.5, fontWeight: 700, letterSpacing: "0.06em", padding: "10px 18px", borderRadius: 8, cursor: "pointer", border: "none", background: T.gold, color: "#0a0a0b", fontFamily: BODY },
  ghost: { fontSize: 12, fontWeight: 600, padding: "7px 14px", borderRadius: 8, cursor: "pointer", background: "transparent", border: `1px solid ${T.line2}`, color: T.mut, fontFamily: BODY },
  pkg: { fontSize: 12, fontWeight: 600, padding: "7px 13px", borderRadius: 8, cursor: "pointer", background: T.panel, border: `1px solid ${T.line2}`, color: T.ink, fontFamily: BODY },
  chip: (on) => ({ fontSize: 12, padding: "5px 12px", borderRadius: 999, cursor: "pointer", fontFamily: BODY, border: `1px solid ${on ? T.goldSoft : T.line2}`, background: on ? T.goldDim : "transparent", color: on ? T.gold : T.mut, fontWeight: on ? 600 : 500 }),
};
