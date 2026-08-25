"use client";
import { useEffect, useState } from "react";
import { supabase, urlFoto, type Categoria } from "@/lib/supabase";
import {
listarAlumnosDeEvento,
listarGradosDivisionDeEvento,
listarFotosEvento,
subirFotoRegistro,
asignarFotoAlumno,
asignarFotoGrupal,
desasignarFoto,
eliminarFoto,
actualizarCodigoAcceso,
adminLogout,
} from "../actions";
type Evento = {
id: string;
nombre: string;
fecha: string | null;
estado: string;
colegioId: string;
colegioNombre: string;
codigoAcceso: string | null;
};
function generarCodigoAleatorio(): string {
const letras = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"; // sin caracteres confundibles (0/O, 1/I)
let out = "";
for (let i = 0; i < 6; i++) out += letras[Math.floor(Math.random() * letras.length)];
return out;
}
type Alumno = { id: string; nombre: string; grado: string; division: string | null };
type Combo = { grado: string; division: string | null };
type Foto = {
id: string;
categoria: Categoria;
storage_path: string;
thumb_path: string | null;
preview_path: string | null;
alumno_id: string | null;
grado: string | null;
division: string | null;
};
// Dibuja la marca de agua "horneada" en los píxeles del canvas (no como overlay CSS),
// para que una versión descargada directamente del navegador ya venga marcada.
function dibujarMarcaDeAgua(ctx: CanvasRenderingContext2D, width: number, height: number) {
ctx.save();
const texto = "INFOCUS · MUESTRA";
const fontSize = Math.max(14, Math.round(width * 0.045));
ctx.font = `bold ${fontSize}px sans-serif`;
ctx.fillStyle = "rgba(255,255,255,0.55)";
ctx.shadowColor = "rgba(0,0,0,0.6)";
ctx.shadowBlur = 4;
ctx.textAlign = "center";
ctx.textBaseline = "middle";
const anchoTexto = ctx.measureText(texto).width;
const pasoX = anchoTexto + 70;
const pasoY = Math.max(90, height * 0.16);
const diagonal = Math.sqrt(width * width + height * height);
ctx.translate(width / 2, height / 2);
ctx.rotate((-24 * Math.PI) / 180);
for (let y = -diagonal; y <= diagonal; y += pasoY) {
for (let x = -diagonal; x <= diagonal; x += pasoX) {
ctx.fillText(texto, x, y);
}
}
ctx.restore();
}
// Genera, en el navegador (canvas), una versión redimensionada y con la marca de agua
// horneada en los píxeles — evita depender de un servicio externo. Se usa tanto para la
// miniatura del grid como para el preview grande del lightbox; el original (sin marca)
// se sube aparte y nunca se manda al navegador de la familia (ver app/c/[slug]/page.tsx).
function generarVersionConMarca(file: File, maxLado: number, calidad: number): Promise<Blob> {
return new Promise((resolve, reject) => {
const img = new Image();
const url = URL.createObjectURL(file);
img.onload = () => {
URL.revokeObjectURL(url);
let { width, height } = img;
if (width > height && width > maxLado) {
height = Math.round((height * maxLado) / width);
width = maxLado;
} else if (height >= width && height > maxLado) {
width = Math.round((width * maxLado) / height);
height = maxLado;
}
const canvas = document.createElement("canvas");
canvas.width = width;
canvas.height = height;
const ctx = canvas.getContext("2d");
if (!ctx) {
reject(new Error("No se pudo procesar la imagen (canvas no disponible)."));
return;
}
ctx.drawImage(img, 0, 0, width, height);
dibujarMarcaDeAgua(ctx, width, height);
canvas.toBlob(
(blob) => {
if (blob) resolve(blob);
else reject(new Error("No se pudo generar la imagen."));
},
"image/jpeg",
calidad
);
};
img.onerror = () => {
URL.revokeObjectURL(url);
reject(new Error("No se pudo leer la imagen."));
};
img.src = url;
});
}
const ETIQUETAS: Record<Categoria, string> = {
individual: "Individual",
grupal: "Grupal",
docente: "Con docente",
varias: "Varias",
};
function comboKey(grado: string, division: string | null) {
return `${grado}__${division ?? ""}`;
}
function comboLabel(a: { grado: string; division: string | null }) {
return a.division ? `${a.grado} · ${a.division}` : a.grado;
}
export default function AdminFotosClient({ eventos }: { eventos: Evento[] }) {
const [eventoId, setEventoId] = useState(eventos[0]?.id ?? "");
const [alumnos, setAlumnos] = useState<Alumno[]>([]);
const [combos, setCombos] = useState<Combo[]>([]);
const [fotos, setFotos] = useState<Foto[]>([]);
const [cargando, setCargando] = useState(false);
// Código de acceso por evento: las familias tienen que ingresarlo en /c/[slug]
// antes de ver las fotos. Se guarda localmente (además de en la base) para
// reflejar el cambio al toque sin tener que recargar toda la lista de eventos.
const [codigos, setCodigos] = useState<Record<string, string | null>>(() =>
Object.fromEntries(eventos.map((e) => [e.id, e.codigoAcceso]))
);
const [codigoInput, setCodigoInput] = useState(codigos[eventos[0]?.id ?? ""] ?? "");
const [guardandoCodigo, setGuardandoCodigo] = useState(false);
const [codigoMsg, setCodigoMsg] = useState<string | null>(null);
const [categoriaSubida, setCategoriaSubida] = useState<Categoria>("individual");
const [subiendo, setSubiendo] = useState(false);
const [progreso, setProgreso] = useState<{ total: number; hechas: number } | null>(null);
const [errorMsg, setErrorMsg] = useState<string | null>(null);
const [nombresArchivos, setNombresArchivos] = useState<string[]>([]);
async function recargarDatosEvento(id: string) {
if (!id) {
setAlumnos([]);
setCombos([]);
setFotos([]);
return;
}
setCargando(true);
try {
const [a, c, f] = await Promise.all([
listarAlumnosDeEvento(id),
listarGradosDivisionDeEvento(id),
listarFotosEvento(id),
]);
setAlumnos(a);
setCombos(c);
setFotos(f as Foto[]);
} finally {
setCargando(false);
}
}
useEffect(() => {
recargarDatosEvento(eventoId);
setCodigoInput(codigos[eventoId] ?? "");
setCodigoMsg(null);
// eslint-disable-next-line react-hooks/exhaustive-deps
}, [eventoId]);
async function onGuardarCodigo() {
if (!eventoId) return;
setGuardandoCodigo(true);
setCodigoMsg(null);
try {
const resp = await actualizarCodigoAcceso(eventoId, codigoInput);
setCodigos((prev) => ({ ...prev, [eventoId]: resp.codigoAcceso }));
setCodigoInput(resp.codigoAcceso ?? "");
setCodigoMsg(
resp.codigoAcceso
? "Código guardado. Compartíselo a las familias de este evento."
: "Se quitó el código: cualquiera con el link puede ver las fotos de este evento."
);
} finally {
setGuardandoCodigo(false);
}
}
function onGenerarCodigo() {
setCodigoInput(generarCodigoAleatorio());
setCodigoMsg(null);
}
async function onSeleccionarArchivos(e: React.ChangeEvent<HTMLInputElement>) {
const archivos = Array.from(e.target.files ?? []);
e.target.value = "";
if (!archivos.length || !eventoId) return;
setNombresArchivos(archivos.map((f) => f.name));
setErrorMsg(null);
setSubiendo(true);
setProgreso({ total: archivos.length, hechas: 0 });
let hechas = 0;
for (const file of archivos) {
try {
const id = crypto.randomUUID();
const path = `${eventoId}/${categoriaSubida}/${id}-${file.name}`;
const { error: errStorage } = await supabase.storage.from("fotos").upload(path, file);
if (errStorage) throw new Error(errStorage.message);
let thumbPath: string | null = null;
let previewPath: string | null = null;
try {
const [miniatura, vistaPrevia] = await Promise.all([
generarVersionConMarca(file, 500, 0.75),
generarVersionConMarca(file, 1400, 0.82),
]);
thumbPath = `${eventoId}/${categoriaSubida}/thumb-${id}.jpg`;
previewPath = `${eventoId}/${categoriaSubida}/preview-${id}.jpg`;
const [subidaThumb, subidaPreview] = await Promise.all([
supabase.storage.from("fotos").upload(thumbPath, miniatura, { contentType: "image/jpeg" }),
supabase.storage.from("fotos").upload(previewPath, vistaPrevia, { contentType: "image/jpeg" }),
]);
// Si falla alguna, no abortamos la subida: la galería usa la que sí se haya podido generar.
if (subidaThumb.error) thumbPath = null;
if (subidaPreview.error) previewPath = null;
} catch {
thumbPath = null;
previewPath = null;
}
await subirFotoRegistro(eventoId, categoriaSubida, path, thumbPath, previewPath);
} catch (err: any) {
setErrorMsg(`Error subiendo ${file.name}: ${err.message ?? "desconocido"}`);
}
hechas += 1;
setProgreso({ total: archivos.length, hechas });
}
setSubiendo(false);
setProgreso(null);
setNombresArchivos([]);
await recargarDatosEvento(eventoId);
}
async function onAsignarAlumno(fotoId: string, alumnoId: string) {
if (!alumnoId) {
await desasignarFoto(fotoId);
} else {
await asignarFotoAlumno(fotoId, alumnoId);
}
await recargarDatosEvento(eventoId);
}
async function onAsignarCombo(fotoId: string, clave: string) {
if (!clave) {
await desasignarFoto(fotoId);
} else {
const combo = combos.find((c) => comboKey(c.grado, c.division) === clave);
if (combo) await asignarFotoGrupal(fotoId, combo.grado, combo.division);
}
await recargarDatosEvento(eventoId);
}
async function onEliminar(fotoId: string) {
await eliminarFoto(fotoId);
await recargarDatosEvento(eventoId);
}
const varias = fotos.filter((f) => f.categoria === "varias");
const asignables = fotos.filter((f) => f.categoria !== "varias");
const sinAsignar = asignables.filter((f) => (f.categoria === "grupal" ? !f.grado : !f.alumno_id));
const asignadas = asignables.filter((f) => (f.categoria === "grupal" ? !!f.grado : !!f.alumno_id));
return (
<div>
<div className="card">
<div className="field" style={{ marginBottom: 20 }}>
<label>Evento</label>
<select value={eventoId} onChange={(e) => setEventoId(e.target.value)}>
{eventos.length === 0 && <option value="">No hay eventos cargados</option>}
{eventos.map((ev) => (
<option key={ev.id} value={ev.id}>
{ev.colegioNombre} — {ev.nombre} ({ev.estado})
</option>
))}
</select>
</div>
{eventoId && (
<div className="field" style={{ marginBottom: 20 }}>
<label>Código de acceso para las familias</label>
<p className="muted" style={{ fontSize: 13, marginTop: -4, marginBottom: 8 }}>
La familia tiene que ingresar este código antes de ver las fotos de este evento en la
web. Compartíselo por WhatsApp o en un cartel del colegio. Si lo dejás vacío, el evento
queda abierto: cualquiera con el link puede entrar sin código.
</p>
<div style={{ display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center" }}>
<input
type="text"
value={codigoInput}
onChange={(e) => setCodigoInput(e.target.value)}
placeholder="Sin código"
style={{ maxWidth: 220, textTransform: "uppercase" }}
/>
<button type="button" className="btn ghost" onClick={onGenerarCodigo} disabled={guardandoCodigo}>
Generar código nuevo
</button>
<button type="button" className="btn" onClick={onGuardarCodigo} disabled={guardandoCodigo}>
{guardandoCodigo ? "Guardando…" : "Guardar código"}
</button>
</div>
{codigoMsg && (
<p className="muted" style={{ fontSize: 13, marginTop: 8 }}>
{codigoMsg}
</p>
)}
</div>
)}
<div className="admin-upload-row">
<div className="field" style={{ flex: "0 0 auto", minWidth: 200 }}>
<label>Categoría de las fotos a subir</label>
<select value={categoriaSubida} onChange={(e) => setCategoriaSubida(e.target.value as Categoria)}>
<option value="individual">Individual</option>
<option value="grupal">Grupal</option>
<option value="docente">Con docente</option>
<option value="varias">Varias</option>
</select>
</div>
<div className="field" style={{ flex: 1 }}>
<label>Archivos (podés seleccionar varios a la vez)</label>
<label className={`file-picker ${subiendo || !eventoId ? "disabled" : ""}`}>
<input
type="file"
accept="image/*"
multiple
disabled={subiendo || !eventoId}
onChange={onSeleccionarArchivos}
/>
<span className="file-picker-btn">Elegir archivos</span>
<span className="file-picker-name">
{nombresArchivos.length === 0
? "Sin archivos seleccionados"
: nombresArchivos.length === 1
? nombresArchivos[0]
: `${nombresArchivos.length} archivos seleccionados`}
</span>
</label>
</div>
</div>
{subiendo && progreso && (
<p className="hint">Subiendo {progreso.hechas} de {progreso.total}…</p>
)}
{errorMsg && <p style={{ color: "var(--accent-dark)", fontSize: 13 }}>{errorMsg}</p>}
<p className="hint" style={{ marginTop: 4 }}>
Las fotos individuales y "con docente" se asignan a un alumno puntual. Las grupales se
asignan una vez por grado + división: todas las familias de ese curso ven la misma. Las
"varias" no se asignan: se muestran automáticamente como fotos extra a todas las familias del evento.
</p>
</div>
{cargando && <p className="muted mt">Cargando…</p>}
{!cargando && eventoId && (
<>
<div className="card mt">
<h3 style={{ fontSize: 16, marginBottom: 4 }}>Fotos sin asignar ({sinAsignar.length})</h3>
<p className="hint" style={{ marginTop: 0, marginBottom: 16 }}>
Mientras no asignes una foto, no se le muestra a ninguna familia.
</p>
{sinAsignar.length === 0 && <p className="muted">No hay fotos pendientes de asignar.</p>}
{sinAsignar.map((f) => (
<FilaFoto
key={f.id}
foto={f}
alumnos={alumnos}
combos={combos}
onAsignarAlumno={onAsignarAlumno}
onAsignarCombo={onAsignarCombo}
onEliminar={onEliminar}
/>
))}
</div>
<div className="card mt">
<h3 style={{ fontSize: 16, marginBottom: 16 }}>Fotos asignadas ({asignadas.length})</h3>
{asignadas.length === 0 && <p className="muted">Todavía no asignaste ninguna foto.</p>}
{asignadas.map((f) => (
<FilaFoto
key={f.id}
foto={f}
alumnos={alumnos}
combos={combos}
onAsignarAlumno={onAsignarAlumno}
onAsignarCombo={onAsignarCombo}
onEliminar={onEliminar}
/>
))}
</div>
<div className="card mt">
<h3 style={{ fontSize: 16, marginBottom: 4 }}>Fotos varias ({varias.length})</h3>
<p className="hint" style={{ marginTop: 0, marginBottom: 16 }}>
No necesitan asignación: aparecen como fotos extra para todas las familias de este evento.
</p>
{varias.length === 0 && <p className="muted">Todavía no subiste fotos "varias".</p>}
{varias.map((f) => (
<FilaFoto
key={f.id}
foto={f}
alumnos={alumnos}
combos={combos}
onAsignarAlumno={onAsignarAlumno}
onAsignarCombo={onAsignarCombo}
onEliminar={onEliminar}
/>
))}
</div>
</>
)}
<p className="center mt">
<button
type="button"
className="btn ghost"
onClick={async () => {
await adminLogout();
window.location.href = "/admin";
}}
>
Cerrar sesión
</button>
</p>
</div>
);
}
function FilaFoto({
foto,
alumnos,
combos,
onAsignarAlumno,
onAsignarCombo,
onEliminar,
}: {
foto: Foto;
alumnos: Alumno[];
combos: Combo[];
onAsignarAlumno: (fotoId: string, alumnoId: string) => void;
onAsignarCombo: (fotoId: string, clave: string) => void;
onEliminar: (fotoId: string) => void;
}) {
return (
<div className="admin-photo-row">
<img className="admin-photo-thumb" src={urlFoto(foto.thumb_path ?? foto.storage_path)} alt={ETIQUETAS[foto.categoria]} />
<div className="admin-photo-meta">
<span className="admin-badge">{ETIQUETAS[foto.categoria]}</span>
</div>
<div className="admin-photo-assign">
{foto.categoria === "varias" ? (
<span className="muted" style={{ fontSize: 13 }}>Se muestra a todas las familias</span>
) : foto.categoria === "grupal" ? (
<select
value={foto.grado ? comboKey(foto.grado, foto.division) : ""}
onChange={(e) => onAsignarCombo(foto.id, e.target.value)}
>
<option value="">Sin asignar</option>
{combos.map((c) => (
<option key={comboKey(c.grado, c.division)} value={comboKey(c.grado, c.division)}>
{comboLabel(c)}
</option>
))}
</select>
) : (
<select value={foto.alumno_id ?? ""} onChange={(e) => onAsignarAlumno(foto.id, e.target.value)}>
<option value="">Sin asignar</option>
{alumnos.map((a) => (
<option key={a.id} value={a.id}>
{a.nombre} — {comboLabel(a)}
</option>
))}
</select>
)}
</div>
<button type="button" className="btn ghost" style={{ height: 36, fontSize: 13, padding: "0 12px" }} onClick={() => onEliminar(foto.id)}>
Eliminar
</button>
</div>
);
}
