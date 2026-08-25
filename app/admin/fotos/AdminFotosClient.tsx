"use client";

import { useEffect, useMemo, useState } from "react";
import { supabase, urlFoto, type Categoria } from "@/lib/supabase";
import { GRADOS_PRIMARIA, GRADOS_SECUNDARIA, TURNOS } from "@/lib/cursos";
import {
  listarFotosEvento,
  subirFotoRegistro,
  asignarFotoCurso,
  asignarFotosACurso,
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

type Foto = {
  id: string;
  categoria: Categoria;
  storage_path: string;
  thumb_path: string | null;
  preview_path: string | null;
  alumno_id: string | null;
  grado: string | null;
  division: string | null;
  turno: string | null;
};

// Dibuja la marca de agua "horneada" en los píxeles del canvas (no como overlay CSS),
// para que una versión descargada directamente del navegador ya venga marcada.
function dibujarMarcaDeAgua(ctx: CanvasRenderingContext2D, width: number, height: number) {
  ctx.save();
  const texto = "INFOCUS · MUESTRA";
  const fontSize = Math.max(9, Math.round(width * 0.0225));
  ctx.font = `bold ${fontSize}px sans-serif`;
  ctx.fillStyle = "rgba(255,255,255,0.55)";
  ctx.shadowColor = "rgba(0,0,0,0.6)";
  ctx.shadowBlur = 4;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  const anchoTexto = ctx.measureText(texto).width;
  const pasoX = anchoTexto + 35;
  const pasoY = Math.max(45, height * 0.08);
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
const CAT_TINT: Record<Categoria, string> = {
  individual: "tint-rose",
  grupal: "tint-blue",
  docente: "tint-sage",
  varias: "tint-cream",
};

const GRADOS = [...GRADOS_PRIMARIA, ...GRADOS_SECUNDARIA];

function cursoLabel(f: { grado: string | null; division: string | null; turno: string | null }) {
  if (!f.grado) return null;
  const partes = [f.grado, f.division || null, f.turno || null].filter(Boolean);
  return partes.join(" · ");
}

// Selector de Grado + División + Turno, reutilizado tanto para elegir el curso antes de
// subir un lote como para corregir la asignación de una foto ya subida.
function SelectorCurso({
  grado,
  division,
  turno,
  onChange,
}: {
  grado: string;
  division: string;
  turno: string;
  onChange: (campo: "grado" | "division" | "turno", valor: string) => void;
}) {
  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: 12 }}>
      <div className="field" style={{ marginBottom: 0, flex: "1 1 180px" }}>
        <label>Grado</label>
        <select value={grado} onChange={(e) => onChange("grado", e.target.value)}>
          <option value="">Seleccionar…</option>
          <optgroup label="Primaria">
            {GRADOS_PRIMARIA.map((g) => (
              <option key={g} value={g}>
                {g}
              </option>
            ))}
          </optgroup>
          <optgroup label="Secundaria">
            {GRADOS_SECUNDARIA.map((g) => (
              <option key={g} value={g}>
                {g}
              </option>
            ))}
          </optgroup>
        </select>
      </div>
      <div className="field" style={{ marginBottom: 0, flex: "1 1 110px" }}>
        <label>División (opcional)</label>
        <input value={division} onChange={(e) => onChange("division", e.target.value)} placeholder="Ej: A" />
      </div>
      <div className="field" style={{ marginBottom: 0, flex: "1 1 160px" }}>
        <label>Turno (opcional)</label>
        <select value={turno} onChange={(e) => onChange("turno", e.target.value)}>
          <option value="">Seleccionar…</option>
          {TURNOS.map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}

export default function AdminFotosClient({ eventos }: { eventos: Evento[] }) {
  const [eventoId, setEventoId] = useState(eventos[0]?.id ?? "");
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
  // Curso al que se va a asignar el lote completo que se está por subir. Con categoría
  // "varias" no aplica: esas fotos se muestran a todas las familias del evento.
  const [subidaGrado, setSubidaGrado] = useState("");
  const [subidaDivision, setSubidaDivision] = useState("");
  const [subidaTurno, setSubidaTurno] = useState("");
  const [subiendo, setSubiendo] = useState(false);
  const [progreso, setProgreso] = useState<{ total: number; hechas: number } | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [nombresArchivos, setNombresArchivos] = useState<string[]>([]);

  // Asignación en lote de fotos que quedaron "sin asignar" (por ejemplo, subidas antes de
  // este cambio): se elige un curso una sola vez y se aplica a todas de un saque.
  const [loteGrado, setLoteGrado] = useState("");
  const [loteDivision, setLoteDivision] = useState("");
  const [loteTurno, setLoteTurno] = useState("");
  const [asignandoLote, setAsignandoLote] = useState(false);

  // Filtro por curso para encontrar rápido un grupo puntual dentro de una lista larga
  // de fotos ya asignadas (con cientos o miles de alumnos, desplazarse a mano no alcanza).
  const [filtroGrado, setFiltroGrado] = useState("todos");
  const [filtroCategoria, setFiltroCategoria] = useState<"todas" | Categoria>("todas");

  async function recargarDatosEvento(id: string) {
    if (!id) {
      setFotos([]);
      return;
    }
    setCargando(true);
    try {
      const f = await listarFotosEvento(id);
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

  const necesitaCurso = categoriaSubida !== "varias";
  const puedeSubir = !subiendo && !!eventoId && (!necesitaCurso || !!subidaGrado);

  async function onSeleccionarArchivos(e: React.ChangeEvent<HTMLInputElement>) {
    const archivos = Array.from(e.target.files ?? []);
    e.target.value = "";
    if (!archivos.length || !eventoId) return;
    setNombresArchivos(archivos.map((f) => f.name));
    setErrorMsg(null);
    setSubiendo(true);
    setProgreso({ total: archivos.length, hechas: 0 });

    const grado = necesitaCurso ? subidaGrado || null : null;
    const division = necesitaCurso ? subidaDivision.trim() || null : null;
    const turno = necesitaCurso ? subidaTurno || null : null;

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

        await subirFotoRegistro(eventoId, categoriaSubida, path, thumbPath, previewPath, grado, division, turno);
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

  async function onAsignarCurso(fotoId: string, grado: string, division: string, turno: string) {
    if (!grado) {
      await desasignarFoto(fotoId);
    } else {
      await asignarFotoCurso(fotoId, grado, division.trim() || null, turno || null);
    }
    await recargarDatosEvento(eventoId);
  }

  async function onEliminar(fotoId: string) {
    await eliminarFoto(fotoId);
    await recargarDatosEvento(eventoId);
  }

  const varias = fotos.filter((f) => f.categoria === "varias");
  const asignables = fotos.filter((f) => f.categoria !== "varias");
  const sinAsignar = asignables.filter((f) => !f.grado);
  const asignadas = asignables.filter((f) => !!f.grado);

  const asignadasFiltradas = useMemo(() => {
    return asignadas.filter((f) => {
      if (filtroCategoria !== "todas" && f.categoria !== filtroCategoria) return false;
      if (filtroGrado !== "todos" && f.grado !== filtroGrado) return false;
      return true;
    });
  }, [asignadas, filtroCategoria, filtroGrado]);

  async function onAsignarLote() {
    if (!loteGrado || sinAsignar.length === 0) return;
    setAsignandoLote(true);
    try {
      await asignarFotosACurso(
        sinAsignar.map((f) => f.id),
        loteGrado,
        loteDivision.trim() || null,
        loteTurno || null
      );
      setLoteGrado("");
      setLoteDivision("");
      setLoteTurno("");
      await recargarDatosEvento(eventoId);
    } finally {
      setAsignandoLote(false);
    }
  }

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

        <div className="field" style={{ maxWidth: 260, marginBottom: 16 }}>
          <label>Categoría de las fotos a subir</label>
          <select value={categoriaSubida} onChange={(e) => setCategoriaSubida(e.target.value as Categoria)}>
            <option value="individual">Individual</option>
            <option value="grupal">Grupal</option>
            <option value="docente">Con docente</option>
            <option value="varias">Varias</option>
          </select>
        </div>

        {necesitaCurso && (
          <div className="field" style={{ marginBottom: 4 }}>
            <label>¿De qué curso son estas fotos?</label>
            <p className="hint" style={{ marginTop: 0, marginBottom: 10 }}>
              Elegí el curso una sola vez y subí todo el lote de esa carpeta — quedan asignadas
              todas juntas, sin tener que elegir alumno por alumno ni foto por foto.
            </p>
            <SelectorCurso
              grado={subidaGrado}
              division={subidaDivision}
              turno={subidaTurno}
              onChange={(campo, valor) => {
                if (campo === "grado") setSubidaGrado(valor);
                if (campo === "division") setSubidaDivision(valor);
                if (campo === "turno") setSubidaTurno(valor);
              }}
            />
          </div>
        )}

        <div className="admin-upload-row" style={{ marginTop: 16 }}>
          <div className="field" style={{ flex: 1 }}>
            <label>Archivos (podés seleccionar toda la carpeta de una vez)</label>
            <label className={`file-picker ${!puedeSubir ? "disabled" : ""}`}>
              <input
                type="file"
                accept="image/*"
                multiple
                disabled={!puedeSubir}
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
            {necesitaCurso && !subidaGrado && (
              <p className="hint" style={{ marginTop: 6 }}>
                Elegí primero el grado de arriba para poder subir fotos de esta categoría.
              </p>
            )}
          </div>
        </div>

        {subiendo && progreso && <p className="hint">Subiendo {progreso.hechas} de {progreso.total}…</p>}
        {errorMsg && <p style={{ color: "var(--accent-dark)", fontSize: 13 }}>{errorMsg}</p>}
        <p className="hint" style={{ marginTop: 4 }}>
          Individual, grupal y con docente se asignan por curso completo (grado + división + turno):
          todas las familias de ese curso ven esas fotos y cada una elige la suya. Las "varias" no se
          asignan: se muestran automáticamente como fotos extra a todas las familias del evento.
        </p>
      </div>

      {cargando && <p className="muted mt">Cargando…</p>}

      {!cargando && eventoId && (
        <>
          <div className="card mt">
            <h3 style={{ fontSize: 16, marginBottom: 4 }}>Fotos sin asignar ({sinAsignar.length})</h3>
            <p className="hint" style={{ marginTop: 0, marginBottom: 16 }}>
              Mientras no asignes una foto a un curso, no se le muestra a ninguna familia.
            </p>

            {sinAsignar.length > 0 && (
              <div
                style={{
                  background: "var(--bg-alt)",
                  border: "1px dashed var(--accent)",
                  borderRadius: "var(--radius-sm)",
                  padding: "16px 18px",
                  marginBottom: 18,
                }}
              >
                <p className="hint" style={{ marginTop: 0, marginBottom: 10, fontWeight: 600, color: "var(--ink)" }}>
                  Asignar TODAS estas {sinAsignar.length} fotos al mismo curso, de una sola vez
                </p>
                <SelectorCurso
                  grado={loteGrado}
                  division={loteDivision}
                  turno={loteTurno}
                  onChange={(campo, valor) => {
                    if (campo === "grado") setLoteGrado(valor);
                    if (campo === "division") setLoteDivision(valor);
                    if (campo === "turno") setLoteTurno(valor);
                  }}
                />
                <button
                  type="button"
                  className="btn mt"
                  disabled={!loteGrado || asignandoLote}
                  onClick={onAsignarLote}
                >
                  {asignandoLote ? "Asignando…" : `Asignar las ${sinAsignar.length} fotos a este curso`}
                </button>
              </div>
            )}

            {sinAsignar.length === 0 && <p className="muted">No hay fotos pendientes de asignar.</p>}
            {sinAsignar.map((f) => (
              <FilaFoto key={f.id} foto={f} onAsignarCurso={onAsignarCurso} onEliminar={onEliminar} />
            ))}
          </div>

          <div className="card mt">
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 10, marginBottom: 16 }}>
              <h3 style={{ fontSize: 16, margin: 0 }}>Fotos asignadas ({asignadasFiltradas.length} de {asignadas.length})</h3>
              {asignadas.length > 0 && (
                <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                  <select value={filtroCategoria} onChange={(e) => setFiltroCategoria(e.target.value as any)} style={{ maxWidth: 160 }}>
                    <option value="todas">Todas las categorías</option>
                    <option value="individual">Individual</option>
                    <option value="grupal">Grupal</option>
                    <option value="docente">Con docente</option>
                  </select>
                  <select value={filtroGrado} onChange={(e) => setFiltroGrado(e.target.value)} style={{ maxWidth: 160 }}>
                    <option value="todos">Todos los grados</option>
                    {GRADOS.map((g) => (
                      <option key={g} value={g}>
                        {g}
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </div>
            {asignadas.length === 0 && <p className="muted">Todavía no asignaste ninguna foto.</p>}
            {asignadas.length > 0 && asignadasFiltradas.length === 0 && (
              <p className="muted">Ningún curso coincide con ese filtro.</p>
            )}
            {asignadasFiltradas.map((f) => (
              <FilaFoto key={f.id} foto={f} onAsignarCurso={onAsignarCurso} onEliminar={onEliminar} />
            ))}
          </div>

          <div className="card mt">
            <h3 style={{ fontSize: 16, marginBottom: 4 }}>Fotos varias ({varias.length})</h3>
            <p className="hint" style={{ marginTop: 0, marginBottom: 16 }}>
              No necesitan asignación: aparecen como fotos extra para todas las familias de este evento.
            </p>
            {varias.length === 0 && <p className="muted">Todavía no subiste fotos "varias".</p>}
            {varias.map((f) => (
              <FilaFoto key={f.id} foto={f} onAsignarCurso={onAsignarCurso} onEliminar={onEliminar} />
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
  onAsignarCurso,
  onEliminar,
}: {
  foto: Foto;
  onAsignarCurso: (fotoId: string, grado: string, division: string, turno: string) => void;
  onEliminar: (fotoId: string) => void;
}) {
  const [editando, setEditando] = useState(false);
  const [grado, setGrado] = useState(foto.grado ?? "");
  const [division, setDivision] = useState(foto.division ?? "");
  const [turno, setTurno] = useState(foto.turno ?? "");
  const label = cursoLabel(foto);
  const cambio = grado !== (foto.grado ?? "") || division !== (foto.division ?? "") || turno !== (foto.turno ?? "");

  return (
    <div className="admin-photo-row" style={{ flexWrap: "wrap", alignItems: "flex-start" }}>
      <img
        className="admin-photo-thumb"
        src={urlFoto(foto.thumb_path ?? foto.storage_path)}
        alt={ETIQUETAS[foto.categoria]}
      />
      <div className="admin-photo-meta">
        <span className={`admin-badge ${CAT_TINT[foto.categoria]}`}>{ETIQUETAS[foto.categoria]}</span>
        {foto.categoria !== "varias" && (
          <div style={{ marginTop: 6, fontSize: 13 }}>
            {label ? (
              <span>{label}</span>
            ) : (
              <span className="muted">Sin asignar</span>
            )}
            {foto.alumno_id && !foto.grado && (
              <div className="muted" style={{ fontSize: 11.5, marginTop: 2 }}>
                (asignación anterior por alumno puntual)
              </div>
            )}
          </div>
        )}
      </div>

      {foto.categoria === "varias" ? (
        <span className="muted" style={{ fontSize: 13 }}>Se muestra a todas las familias</span>
      ) : !editando ? (
        <button type="button" className="btn ghost" style={{ height: 36, fontSize: 13, padding: "0 12px" }} onClick={() => setEditando(true)}>
          {label ? "Cambiar curso" : "Asignar curso"}
        </button>
      ) : (
        <div className="admin-photo-assign">
          <SelectorCurso
            grado={grado}
            division={division}
            turno={turno}
            onChange={(campo, valor) => {
              if (campo === "grado") setGrado(valor);
              if (campo === "division") setDivision(valor);
              if (campo === "turno") setTurno(valor);
            }}
          />
          <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
            <button
              type="button"
              className="btn"
              style={{ height: 34, fontSize: 13, padding: "0 12px" }}
              disabled={!cambio}
              onClick={() => {
                onAsignarCurso(foto.id, grado, division, turno);
                setEditando(false);
              }}
            >
              Guardar
            </button>
            <button
              type="button"
              className="btn ghost"
              style={{ height: 34, fontSize: 13, padding: "0 12px" }}
              onClick={() => {
                setGrado(foto.grado ?? "");
                setDivision(foto.division ?? "");
                setTurno(foto.turno ?? "");
                setEditando(false);
              }}
            >
              Cancelar
            </button>
          </div>
        </div>
      )}

      <button
        type="button"
        className="btn ghost"
        style={{ height: 36, fontSize: 13, padding: "0 12px" }}
        onClick={() => onEliminar(foto.id)}
      >
        Eliminar
      </button>
    </div>
  );
}
