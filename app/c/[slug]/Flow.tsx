"use client";
import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { urlFoto, type Categoria } from "@/lib/supabase";
import { guardarFamiliaConAlumnos, crearPedido, type AlumnoInput } from "@/app/actions";
import ThemeToggle from "@/app/components/ThemeToggle";
type Colegio = { id: string; slug: string; nombre: string };
type Evento = { id: string; nombre: string; fecha: string | null; estado: string };
type Foto = {
id: string;
categoria: Categoria;
storage_path: string | null;
thumb_path: string | null;
preview_path: string | null;
alumno_id: string | null;
grado: string | null;
division: string | null;
};
const FOTOS_POR_PAGINA = 12;
const ETIQUETAS: Record<Categoria, string> = {
grupal: "Grupal · 20x30cm",
individual: "Individual · 15x21cm",
docente: "Con docente · 15x21cm",
varias: "Varias",
};
const CAT_TINT: Record<Categoria, string> = {
individual: "tint-rose",
grupal: "tint-blue",
docente: "tint-sage",
varias: "tint-cream",
};
// Las 3 categorías obligatorias (una selección de cada una). "varias" no es obligatoria:
// las fotos de esa categoría se ofrecen directamente como fotos extra opcionales.
type CategoriaMandatoria = "individual" | "grupal" | "docente";
const ORDEN: CategoriaMandatoria[] = ["individual", "grupal", "docente"];
const PASOS = ["Tus datos", "Elegí las fotos", "Pago y entrega"];
const PRECIO_FOTO_EXTRA = 5000;
const PRECIO_CARPETA_EXTRA = 10000;
const GRADOS_PRIMARIA = ["Jardín", "1° grado", "2° grado", "3° grado", "4° grado", "5° grado", "6° grado", "7° grado"];
const GRADOS_SECUNDARIA = ["1° año", "2° año", "3° año", "4° año", "5° año", "6° año"];
const TURNOS = ["Mañana", "Tarde", "Jornada completa"];
type AlumnoForm = { nombre: string; grado: string; division: string; turno: string };
type AlumnoRegistrado = { id: string; nombre: string; grado: string; division: string | null };
function alumnoVacio(): AlumnoForm {
return { nombre: "", grado: "", division: "", turno: "" };
}
function Steps({ paso }: { paso: number }) {
return (
<div className="steps">
{PASOS.map((label, i) => {
const n = i + 1;
const state = paso === n ? "active" : paso > n ? "done" : "";
return (
<div key={label} className={`step ${state}`}>
<span className="bar" />
<span className="label">{label}</span>
</div>
);
})}
</div>
);
}
export default function Flow({ colegio, evento, fotos }: { colegio: Colegio; evento: Evento; fotos: Foto[] }) {
const router = useRouter();
const [paso, setPaso] = useState(1);
const [enviando, setEnviando] = useState(false);
const [errorMsg, setErrorMsg] = useState<string | null>(null);
// Paso 1: datos del tutor + uno o más alumnos
const [tutorNombre, setTutorNombre] = useState("");
const [tutorWhatsapp, setTutorWhatsapp] = useState("");
const [whatsappConfirmado, setWhatsappConfirmado] = useState(false);
const [alumnosForm, setAlumnosForm] = useState<AlumnoForm[]>([alumnoVacio()]);
const [autorizaFotografica, setAutorizaFotografica] = useState(false);
const [autorizaBackstage, setAutorizaBackstage] = useState(false);
const [familiaId, setFamiliaId] = useState<string | null>(null);
const [alumnosRegistrados, setAlumnosRegistrados] = useState<AlumnoRegistrado[]>([]);
const [alumnoActualIndex, setAlumnoActualIndex] = useState(0);
// Pasos 2 y 3: selección de fotos y kit para el alumno actual
const [seleccion, setSeleccion] = useState<Record<CategoriaMandatoria, string | null>>({
grupal: null,
individual: null,
docente: null,
});
const [tipoKit, setTipoKit] = useState<"impreso_digital" | "solo_digital">("impreso_digital");
const [fotosExtraIds, setFotosExtraIds] = useState<string[]>([]);
const [carpetas, setCarpetas] = useState(1);
// Preview grande (lightbox) y paginación "ver más" para no renderizar cientos de fotos de una.
const [lightbox, setLightbox] = useState<{ foto: Foto; categoria: Categoria; esExtra: boolean } | null>(null);
const [visiblesPorCategoria, setVisiblesPorCategoria] = useState<Record<CategoriaMandatoria, number>>({
grupal: FOTOS_POR_PAGINA,
individual: FOTOS_POR_PAGINA,
docente: FOTOS_POR_PAGINA,
});
const [visiblesExtra, setVisiblesExtra] = useState(FOTOS_POR_PAGINA);
const alumnoActual = alumnosRegistrados[alumnoActualIndex] ?? null;
// Detecta si ya se etiquetó al menos una foto de cada tipo para este evento. Mientras
// el fotógrafo no haya usado el panel de asignación (/admin/fotos), no filtramos nada —
// así el evento demo (con fotos sin etiquetar) sigue mostrando todo, como antes.
const fotosIndividualTaggedExist = useMemo(
() => fotos.some((f) => f.categoria === "individual" && f.alumno_id),
[fotos]
);
const fotosDocenteTaggedExist = useMemo(
() => fotos.some((f) => f.categoria === "docente" && f.alumno_id),
[fotos]
);
const fotosGrupalTaggedExist = useMemo(
() => fotos.some((f) => f.categoria === "grupal" && f.grado),
[fotos]
);
// Fotos que le corresponden al alumno/a actual: si ya hay etiquetado para esa categoría,
// filtra por alumno (individual/docente) o por grado+división (grupal); si no, muestra
// todas las fotos de la categoría (comportamiento de antes, para no romper el demo).
const fotosDelAlumno = useMemo(() => {
if (!alumnoActual) return fotos;
return fotos.filter((f) => {
if (f.categoria === "individual") {
return fotosIndividualTaggedExist ? f.alumno_id === alumnoActual.id : true;
}
if (f.categoria === "docente") {
return fotosDocenteTaggedExist ? f.alumno_id === alumnoActual.id : true;
}
if (f.categoria === "grupal") {
if (fotosGrupalTaggedExist) {
return f.grado === alumnoActual.grado && (f.division ?? "") === (alumnoActual.division ?? "");
}
return true;
}
// "varias": no se etiquetan por alumno/grado — se muestran a todas las familias del evento.
return true;
});
}, [fotos, alumnoActual, fotosIndividualTaggedExist, fotosDocenteTaggedExist, fotosGrupalTaggedExist]);
const fotosPorCategoria = useMemo(() => {
const m: Record<CategoriaMandatoria, Foto[]> = { grupal: [], individual: [], docente: [] };
for (const f of fotosDelAlumno) {
if (f.categoria === "varias") continue; // "varias" va directo al bloque de fotos extra, no a una galería obligatoria
m[f.categoria].push(f);
}
return m;
}, [fotosDelAlumno]);
const idsSeleccionMandatoria = useMemo(
() => new Set(ORDEN.map((c) => seleccion[c]).filter(Boolean) as string[]),
[seleccion]
);
function actualizarAlumno(i: number, campo: keyof AlumnoForm, valor: string) {
setAlumnosForm((lista) => lista.map((a, idx) => (idx === i ? { ...a, [campo]: valor } : a)));
}
function agregarAlumno() {
setAlumnosForm((lista) => [...lista, alumnoVacio()]);
}
function quitarAlumno(i: number) {
setAlumnosForm((lista) => lista.filter((_, idx) => idx !== i));
}
function toggleFotoExtra(fotoId: string) {
setFotosExtraIds((ids) => (ids.includes(fotoId) ? ids.filter((id) => id !== fotoId) : [...ids, fotoId]));
}
function resetSeleccionParaSiguienteAlumno() {
setSeleccion({ grupal: null, individual: null, docente: null });
setTipoKit("impreso_digital");
setFotosExtraIds([]);
setCarpetas(1);
setLightbox(null);
setVisiblesPorCategoria({ grupal: FOTOS_POR_PAGINA, individual: FOTOS_POR_PAGINA, docente: FOTOS_POR_PAGINA });
setVisiblesExtra(FOTOS_POR_PAGINA);
}
function verMasCategoria(categoria: CategoriaMandatoria) {
setVisiblesPorCategoria((v) => ({ ...v, [categoria]: v[categoria] + FOTOS_POR_PAGINA }));
}
const seleccionCompleta = ORDEN.every((c) => seleccion[c]);
const totalBase = tipoKit === "impreso_digital" ? 30000 : 15000;
const subtotalFotosExtra = fotosExtraIds.length * PRECIO_FOTO_EXTRA;
const subtotalCarpetasExtra = tipoKit === "impreso_digital" ? (carpetas - 1) * PRECIO_CARPETA_EXTRA : 0;
const total = totalBase + subtotalFotosExtra + subtotalCarpetasExtra;
async function onSubmitOnboarding(e: React.FormEvent) {
e.preventDefault();
setErrorMsg(null);
if (!tutorNombre.trim() || tutorWhatsapp.replace(/\D/g, "").length < 8) {
setErrorMsg("Completá tu nombre y un WhatsApp válido.");
return;
}
if (!whatsappConfirmado) {
setErrorMsg("Confirmá que el WhatsApp ingresado es correcto.");
return;
}
if (alumnosForm.some((a) => !a.nombre.trim() || !a.grado)) {
setErrorMsg("Completá el nombre y el grado de cada alumno/a.");
return;
}
if (!autorizaFotografica) {
setErrorMsg("La autorización de la toma fotográfica es obligatoria para continuar.");
return;
}
setEnviando(true);
try {
const alumnosInput: AlumnoInput[] = alumnosForm.map((a) => ({
nombre: a.nombre.trim(),
grado: a.grado,
division: a.division.trim(),
turno: a.turno,
autorizaFotografica,
autorizaBackstage,
}));
const { familiaId: id, alumnoIds } = await guardarFamiliaConAlumnos(
colegio.id,
{ nombre: tutorNombre.trim(), whatsapp: tutorWhatsapp },
alumnosInput
);
setFamiliaId(id);
setAlumnosRegistrados(
alumnosForm.map((a, i) => ({
id: alumnoIds[i],
nombre: a.nombre.trim(),
grado: a.grado,
division: a.division.trim() || null,
}))
);
setAlumnoActualIndex(0);
setPaso(2);
} catch (err: any) {
setErrorMsg("No pudimos guardar tus datos. Probá de nuevo.");
} finally {
setEnviando(false);
}
}
function elegirFoto(categoria: CategoriaMandatoria, fotoId: string) {
setSeleccion((s) => ({ ...s, [categoria]: s[categoria] === fotoId ? null : fotoId }));
}
async function confirmarPedido() {
if (!familiaId || !alumnoActual) return;
setEnviando(true);
setErrorMsg(null);
try {
const fotosSeleccionadas = ORDEN.map((c) => ({ fotoId: seleccion[c] as string, categoria: c }));
const fotosExtraSeleccionadas = fotos
.filter((f) => fotosExtraIds.includes(f.id))
.map((f) => ({ fotoId: f.id, categoria: f.categoria }));
await crearPedido({
familiaId,
alumnoId: alumnoActual.id,
eventoId: evento.id,
tipoKit,
fotos: fotosSeleccionadas,
fotosExtra: fotosExtraSeleccionadas,
carpetasImpresas: carpetas,
});
const hayMasAlumnos = alumnoActualIndex + 1 < alumnosRegistrados.length;
if (hayMasAlumnos) {
resetSeleccionParaSiguienteAlumno();
setAlumnoActualIndex((i) => i + 1);
setPaso(2);
setEnviando(false);
} else {
router.push(`/familia/${familiaId}`);
}
} catch (err: any) {
setErrorMsg("No pudimos crear el pedido. Probá de nuevo.");
setEnviando(false);
}
}
// Paso 1: alta del tutor + uno o más alumnos, formulario centrado sin foto
if (paso === 1) {
return (
<main style={{ minHeight: "100vh", background: "var(--gradient-warm)" }}>
<div className="wrap-narrow" style={{ paddingBottom: 60 }}>
<div className="page-header">
<Link href="/" className="brand" style={{ textDecoration: "none" }}>
<b>Infocus</b> Producciones
</Link>
<ThemeToggle />
</div>
<Steps paso={paso} />
<div className="card">
<div className="eyebrow center">Fotografía escolar</div>
<h1 className="center" style={{ fontSize: 28, marginBottom: 10 }}>
Completá tu perfil
</h1>
<p className="muted center mb">
Te pedimos esto una sola vez para acceder a las fotos de {evento.nombre}.
</p>
<div className="evento-pill">📍 {colegio.nombre}</div>
<form onSubmit={onSubmitOnboarding}>
{alumnosForm.map((alumno, i) => (
<div key={i} className="alumno-block">
<div className="alumno-block-header">
<span className="alumno-num">{i + 1}</span>
<div>
<div className="alumno-title">Alumno {i + 1}</div>
<div className="hint" style={{ marginTop: 0 }}>Completá los datos</div>
</div>
{alumnosForm.length > 1 && (
<button
type="button"
className="alumno-quitar"
onClick={() => quitarAlumno(i)}
aria-label="Quitar alumno"
>
Quitar
</button>
)}
</div>
<div className="field">
<label>Nombre y apellido del alumno/a</label>
<input
value={alumno.nombre}
onChange={(e) => actualizarAlumno(i, "nombre", e.target.value)}
placeholder="Ej: Lucía González"
autoComplete="off"
/>
</div>
<div className="alumno-grid">
<div className="field">
<label>Grado</label>
<select value={alumno.grado} onChange={(e) => actualizarAlumno(i, "grado", e.target.value)}>
<option value="">Seleccionar…</option>
<optgroup label="Primaria">
{GRADOS_PRIMARIA.map((g) => (
<option key={g} value={g}>{g}</option>
))}
</optgroup>
<optgroup label="Secundaria">
{GRADOS_SECUNDARIA.map((g) => (
<option key={g} value={g}>{g}</option>
))}
</optgroup>
</select>
</div>
<div className="field">
<label>División (opcional)</label>
<input
value={alumno.division}
onChange={(e) => actualizarAlumno(i, "division", e.target.value)}
placeholder="Ej: A"
/>
</div>
</div>
<div className="field">
<label>Turno (opcional)</label>
<select value={alumno.turno} onChange={(e) => actualizarAlumno(i, "turno", e.target.value)}>
<option value="">Seleccionar…</option>
{TURNOS.map((t) => (
<option key={t} value={t}>{t}</option>
))}
</select>
</div>
</div>
))}
<button type="button" className="btn ghost agregar-hijo" onClick={agregarAlumno}>
+ Agregar otro hijo/a
</button>
<div className="alumno-block">
<div className="hint" style={{ marginTop: 0, marginBottom: 10, fontWeight: 600, color: "var(--ink)" }}>
Tus datos
</div>
<div className="field">
<label>Tu nombre completo</label>
<input
value={tutorNombre}
onChange={(e) => setTutorNombre(e.target.value)}
placeholder="Ej: María González"
autoComplete="name"
/>
</div>
<div className="field">
<label>WhatsApp</label>
<div className="with-prefix">
<span>+54</span>
<input
value={tutorWhatsapp}
onChange={(e) => setTutorWhatsapp(e.target.value)}
placeholder="11 1234 5678"
inputMode="tel"
autoComplete="tel-national"
/>
</div>
<label className="check-row">
<input
type="checkbox"
checked={whatsappConfirmado}
onChange={(e) => setWhatsappConfirmado(e.target.checked)}
/>
<span>Confirmo que este WhatsApp es correcto</span>
</label>
<p className="hint">Lo usamos para avisarte y, cuando pagues, enviarte tus fotos en HD.</p>
</div>
</div>
<label className="check-row check-row-box">
<input
type="checkbox"
checked={autorizaFotografica}
onChange={(e) => setAutorizaFotografica(e.target.checked)}
/>
<span>
Autorizo la toma fotográfica de mi hijo/a en el contexto de la sesión escolar. Los datos
personales no serán compartidos con terceros. <b>Obligatorio</b>
</span>
</label>
<div className="backstage-box">
<label className="check-row">
<input
type="checkbox"
checked={autorizaBackstage}
onChange={(e) => setAutorizaBackstage(e.target.checked)}
/>
<span>
<b>Backstage de la producción</b> <span className="muted">(opcional)</span>
<br />
<span className="hint" style={{ marginTop: 4 }}>
En ocasiones grabamos parte del backstage de la sesión para mostrar nuestro trabajo en redes.
Si estás de acuerdo, vas a poder descargarte el video o compartirlo.
</span>
</span>
</label>
</div>
{errorMsg && <p style={{ color: "var(--accent-dark)", fontSize: 13, marginTop: 4, marginBottom: 12 }}>{errorMsg}</p>}
<button className="btn" disabled={enviando}>
{enviando ? "Guardando…" : "Registrarme →"}
</button>
</form>
</div>
<p className="center muted mt" style={{ fontSize: 12.5 }}>
Tus datos quedan solo entre vos y el fotógrafo del colegio.
</p>
</div>
</main>
);
}
// Pasos 2 y 3: layout ancho centrado (necesitan más espacio para las fotos), se repiten por cada alumno
return (
<main style={{ minHeight: "100vh", background: "var(--gradient-warm)" }}>
<div className="wrap-wide" style={{ paddingBottom: 60 }}>
<div className="page-header">
<Link href="/" className="brand" style={{ textDecoration: "none" }}>
<b>Infocus</b> Producciones
</Link>
<ThemeToggle />
</div>
<Steps paso={paso} />
{alumnosRegistrados.length > 1 && alumnoActual && (
<p className="muted mb" style={{ fontSize: 13 }}>
Alumno {alumnoActualIndex + 1} de {alumnosRegistrados.length} · {alumnoActual.nombre}
</p>
)}
{paso === 2 && (
<>
<div className="eyebrow">Vista previa con marca de agua</div>
<h1 style={{ fontSize: 26, marginBottom: 10 }}>
Elegí las 3 fotos{alumnoActual ? ` de ${alumnoActual.nombre}` : ""}
</h1>
<p className="muted mb">Una grupal, una individual y una con el/la docente.</p>
<div className="card">
{ORDEN.map((categoria) => (
<div key={categoria} style={{ marginBottom: 22 }}>
<h4 style={{ fontSize: 14.5, marginBottom: 10 }}><span className={`category-badge ${CAT_TINT[categoria]}`}>{ETIQUETAS[categoria]}</span></h4>
<div className="gallery">
{fotosPorCategoria[categoria].length === 0 && (
<p className="muted" style={{ fontSize: 13 }}>
Todavía no hay fotos de esta categoría cargadas para
{alumnoActual ? ` ${alumnoActual.nombre}` : " este alumno/a"}.
</p>
)}
{fotosPorCategoria[categoria].slice(0, visiblesPorCategoria[categoria]).map((f) => (
<div
key={f.id}
className={`photo-card ${seleccion[categoria] === f.id ? "selected" : ""}`}
onClick={() => setLightbox({ foto: f, categoria, esExtra: false })}
>
<img src={urlFoto(f.thumb_path ?? f.preview_path ?? f.storage_path)} alt={ETIQUETAS[categoria]} loading="lazy" />
<div className="wm">
<span>INFOCUS · MUESTRA</span>
<span>INFOCUS · MUESTRA</span>
<span>INFOCUS · MUESTRA</span>
</div>
<button
type="button"
className="photo-check"
aria-label={seleccion[categoria] === f.id ? "Quitar selección" : "Elegir esta foto"}
onClick={(e) => {
e.stopPropagation();
elegirFoto(categoria, f.id);
}}
>
{seleccion[categoria] === f.id ? "✓" : ""}
</button>
</div>
))}
</div>
{fotosPorCategoria[categoria].length > visiblesPorCategoria[categoria] && (
<button type="button" className="btn ghost load-more" onClick={() => verMasCategoria(categoria)}>
Ver más fotos ({fotosPorCategoria[categoria].length - visiblesPorCategoria[categoria]} más)
</button>
)}
</div>
))}
<div style={{ marginTop: 8, marginBottom: 4, borderTop: "1px solid var(--line)", paddingTop: 22 }}>
<h4 style={{ fontSize: 14.5, marginBottom: 4 }}>¿Querés sumar más fotos digitales?</h4>
<p className="hint" style={{ marginTop: 0, marginBottom: 12 }}>
Opcional — cada foto adicional cuesta ${PRECIO_FOTO_EXTRA.toLocaleString("es-AR")} y se suma a tu pedido en HD.
</p>
<div className="gallery">
{fotosDelAlumno
.filter((f) => !idsSeleccionMandatoria.has(f.id))
.slice(0, visiblesExtra)
.map((f) => (
<div
key={f.id}
className={`photo-card ${fotosExtraIds.includes(f.id) ? "selected" : ""}`}
onClick={() => setLightbox({ foto: f, categoria: f.categoria, esExtra: true })}
>
<img src={urlFoto(f.thumb_path ?? f.preview_path ?? f.storage_path)} alt={ETIQUETAS[f.categoria]} loading="lazy" />
<div className="wm">
<span>INFOCUS · MUESTRA</span>
<span>INFOCUS · MUESTRA</span>
<span>INFOCUS · MUESTRA</span>
</div>
<div className="photo-tag">{ETIQUETAS[f.categoria]}</div>
<button
type="button"
className="photo-check"
aria-label={fotosExtraIds.includes(f.id) ? "Quitar de extras" : "Agregar como extra"}
onClick={(e) => {
e.stopPropagation();
toggleFotoExtra(f.id);
}}
>
{fotosExtraIds.includes(f.id) ? "✓" : ""}
</button>
</div>
))}
{fotosDelAlumno.filter((f) => !idsSeleccionMandatoria.has(f.id)).length === 0 && (
<p className="muted" style={{ fontSize: 13 }}>No hay más fotos disponibles para este alumno/a.</p>
)}
</div>
{fotosDelAlumno.filter((f) => !idsSeleccionMandatoria.has(f.id)).length > visiblesExtra && (
<button
type="button"
className="btn ghost load-more"
onClick={() => setVisiblesExtra((n) => n + FOTOS_POR_PAGINA)}
>
Ver más fotos (
{fotosDelAlumno.filter((f) => !idsSeleccionMandatoria.has(f.id)).length - visiblesExtra} más)
</button>
)}
{fotosExtraIds.length > 0 && (
<p className="hint">
{fotosExtraIds.length} foto{fotosExtraIds.length > 1 ? "s" : ""} extra seleccionada
{fotosExtraIds.length > 1 ? "s" : ""} · +${(fotosExtraIds.length * PRECIO_FOTO_EXTRA).toLocaleString("es-AR")}
</p>
)}
</div>
<button className="btn" disabled={!seleccionCompleta} onClick={() => setPaso(3)}>
{seleccionCompleta ? "Continuar →" : "Elegí las 3 fotos para continuar"}
</button>
<button className="btn ghost mt" onClick={() => setPaso(1)}>
← Volver
</button>
</div>
</>
)}
{paso === 3 && (
<>
<div className="eyebrow">Resumen y pago</div>
<h1 style={{ fontSize: 26, marginBottom: 16 }}>
Elegí cómo querés recibirlas{alumnoActual ? ` — ${alumnoActual.nombre}` : ""}
</h1>
<div className="card">
<div
className={`kit-option ${tipoKit === "impreso_digital" ? "selected" : ""}`}
onClick={() => setTipoKit("impreso_digital")}
>
<input type="radio" checked={tipoKit === "impreso_digital"} onChange={() => setTipoKit("impreso_digital")} />
<div>
<h4>Kit Impreso + Digital</h4>
<p>Las 3 fotos impresas + descarga en HD de regalo por WhatsApp.</p>
<div className="price">$30.000</div>
</div>
</div>
<div
className={`kit-option ${tipoKit === "solo_digital" ? "selected" : ""}`}
onClick={() => setTipoKit("solo_digital")}
>
<input type="radio" checked={tipoKit === "solo_digital"} onChange={() => setTipoKit("solo_digital")} />
<div>
<h4>Solo Digital HD</h4>
<p>Las mismas 3 fotos en HD, enviadas por WhatsApp. Sin impresión.</p>
<div className="price">$15.000</div>
</div>
</div>
{tipoKit === "impreso_digital" && (
<div className="kit-option" style={{ cursor: "default" }}>
<div style={{ width: "100%" }}>
<h4>Cantidad de carpetas impresas</h4>
<p>La primera carpeta va incluida en el kit. Cada adicional (para regalar, por ejemplo) cuesta ${PRECIO_CARPETA_EXTRA.toLocaleString("es-AR")}.</p>
<div style={{ display: "flex", alignItems: "center", gap: 14, marginTop: 10 }}>
<button
type="button"
className="btn ghost"
style={{ width: 40, height: 40, padding: 0 }}
onClick={() => setCarpetas((n) => Math.max(1, n - 1))}
disabled={carpetas <= 1}
>
−
</button>
<span style={{ fontWeight: 700, fontSize: 16, minWidth: 18, textAlign: "center" }}>{carpetas}</span>
<button
type="button"
className="btn ghost"
style={{ width: 40, height: 40, padding: 0 }}
onClick={() => setCarpetas((n) => n + 1)}
>
+
</button>
</div>
</div>
</div>
)}
<div style={{ margin: "20px 0" }}>
{ORDEN.map((c) => (
<div className="summary-row" key={c}>
<span className="n">{ETIQUETAS[c]}</span>
<span>✓ Seleccionada</span>
</div>
))}
{fotosExtraIds.length > 0 && (
<div className="summary-row">
<span className="n">
{fotosExtraIds.length} foto{fotosExtraIds.length > 1 ? "s" : ""} digital{fotosExtraIds.length > 1 ? "es" : ""} extra
</span>
<span>${subtotalFotosExtra.toLocaleString("es-AR")}</span>
</div>
)}
{tipoKit === "impreso_digital" && carpetas > 1 && (
<div className="summary-row">
<span className="n">{carpetas - 1} carpeta{carpetas > 2 ? "s" : ""} impresa{carpetas > 2 ? "s" : ""} extra</span>
<span>${subtotalCarpetasExtra.toLocaleString("es-AR")}</span>
</div>
)}
<div className="summary-row" style={{ fontWeight: 700 }}>
<span>Total</span>
<span>${total.toLocaleString("es-AR")}</span>
</div>
</div>
{errorMsg && <p style={{ color: "var(--accent-dark)", fontSize: 13, marginBottom: 12 }}>{errorMsg}</p>}
<button className="btn" disabled={enviando} onClick={confirmarPedido}>
{enviando
? "Creando pedido…"
: alumnoActualIndex + 1 < alumnosRegistrados.length
? "Guardar y seguir con el próximo hijo/a →"
: "Confirmar pedido →"}
</button>
<button className="btn ghost mt" onClick={() => setPaso(2)}>
← Volver a elegir fotos
</button>
</div>
</>
)}
{lightbox && (
<div className="lightbox-backdrop" onClick={() => setLightbox(null)}>
<div className="lightbox-box" onClick={(e) => e.stopPropagation()}>
<button type="button" className="lightbox-close" aria-label="Cerrar" onClick={() => setLightbox(null)}>
✕
</button>
<div className="lightbox-img-wrap">
<img
src={urlFoto(lightbox.foto.preview_path ?? lightbox.foto.thumb_path ?? lightbox.foto.storage_path)}
alt={ETIQUETAS[lightbox.categoria]}
/>
<div className="wm">
<span>INFOCUS · MUESTRA</span>
<span>INFOCUS · MUESTRA</span>
<span>INFOCUS · MUESTRA</span>
</div>
</div>
<div className="lightbox-actions">
<span className="photo-tag" style={{ position: "static" }}>{ETIQUETAS[lightbox.categoria]}</span>
{lightbox.esExtra ? (
<button
type="button"
className="btn"
onClick={() => toggleFotoExtra(lightbox.foto.id)}
>
{fotosExtraIds.includes(lightbox.foto.id) ? "✓ Quitar de extras" : "+ Agregar como extra"}
</button>
) : (
<button
type="button"
className="btn"
onClick={() => elegirFoto(lightbox.categoria as CategoriaMandatoria, lightbox.foto.id)}
>
{seleccion[lightbox.categoria as CategoriaMandatoria] === lightbox.foto.id ? "✓ Quitar selección" : "Elegir esta foto"}
</button>
)}
</div>
</div>
</div>
)}
</div>
</main>
);
}
