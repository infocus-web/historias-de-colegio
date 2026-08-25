"use server";

import { cookies } from "next/headers";
import { supabase } from "@/lib/supabase";
import { ADMIN_COOKIE, adminPasswordConfigurada, tokenParaPassword, tokenEsValido } from "@/lib/adminAuth";

// ---- Sesión ----

export async function adminLogin(password: string) {
  if (!adminPasswordConfigurada()) {
    return { ok: false, error: "ADMIN_PASSWORD no está configurada todavía en el servidor." };
  }
  if (password !== process.env.ADMIN_PASSWORD) {
    return { ok: false, error: "Contraseña incorrecta." };
  }
  const store = await cookies();
  store.set(ADMIN_COOKIE, tokenParaPassword(password), {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 30, // 30 días
  });
  return { ok: true };
}

export async function adminLogout() {
  const store = await cookies();
  store.delete(ADMIN_COOKIE);
  return { ok: true };
}

// Chequeo de sesión reusable desde Server Components del panel.
export async function haySesionAdmin(): Promise<boolean> {
  const store = await cookies();
  return tokenEsValido(store.get(ADMIN_COOKIE)?.value);
}

// ---- Datos para el panel ----

export async function listarEventos() {
  const { data, error } = await supabase
    .from("eventos")
    .select("id, nombre, fecha, estado, colegio_id, codigo_acceso, colegios(nombre)")
    .order("fecha", { ascending: false });
  if (error) throw new Error(error.message);
  return (data ?? []).map((e: any) => ({
    id: e.id as string,
    nombre: e.nombre as string,
    fecha: e.fecha as string | null,
    estado: e.estado as string,
    colegioId: e.colegio_id as string,
    colegioNombre: e.colegios?.nombre as string,
    codigoAcceso: e.codigo_acceso as string | null,
  }));
}

// Cambia (o quita, si se manda vacío) el código de acceso que las familias tienen
// que ingresar para ver las fotos de este evento en /c/[slug].
export async function actualizarCodigoAcceso(eventoId: string, codigo: string) {
  const limpio = codigo.trim().toUpperCase();
  const { error } = await supabase
    .from("eventos")
    .update({ codigo_acceso: limpio || null })
    .eq("id", eventoId);
  if (error) throw new Error(error.message);
  return { ok: true, codigoAcceso: limpio || null };
}

export async function listarFotosEvento(eventoId: string) {
  const { data, error } = await supabase
    .from("fotos")
    .select("id, categoria, storage_path, thumb_path, preview_path, alumno_id, grado, division, turno")
    .eq("evento_id", eventoId)
    .order("created_at", { ascending: false });
  if (error) throw new Error(error.message);
  return data ?? [];
}

// Registra en la tabla `fotos` un archivo que el navegador ya subió directamente a
// Supabase Storage (bucket público `fotos`, permite INSERT anónimo). Si se pasan
// grado/division/turno, la foto queda asignada a ese curso desde el momento en que
// se sube — ya no hace falta un paso aparte de "asignar" foto por foto.
export async function subirFotoRegistro(
  eventoId: string,
  categoria: "individual" | "grupal" | "docente" | "varias",
  storagePath: string,
  thumbPath: string | null = null,
  previewPath: string | null = null,
  grado: string | null = null,
  division: string | null = null,
  turno: string | null = null
) {
  const { data, error } = await supabase
    .from("fotos")
    .insert({
      evento_id: eventoId,
      categoria,
      storage_path: storagePath,
      thumb_path: thumbPath,
      preview_path: previewPath,
      grado,
      division,
      turno,
    })
    .select("id")
    .single();
  if (error) throw new Error(error.message);
  return { id: data.id as string };
}

// Asigna (o reasigna) una foto ya subida a un curso completo — grado + división (opcional)
// + turno (opcional). Se usa para individual, grupal y con docente por igual: todas las
// familias de ese curso van a ver esta foto. Reemplaza cualquier asignación por alumno
// puntual que tuviera antes.
export async function asignarFotoCurso(
  fotoId: string,
  grado: string,
  division: string | null,
  turno: string | null
) {
  const { error } = await supabase
    .from("fotos")
    .update({ grado, division: division || null, turno: turno || null, alumno_id: null })
    .eq("id", fotoId);
  if (error) throw new Error(error.message);
  return { ok: true };
}

// Asigna de una sola vez el mismo curso a varias fotos — para resolver de un saque un lote
// que quedó "sin asignar" (por ejemplo fotos subidas antes de elegir el curso al subir).
export async function asignarFotosACurso(
  fotoIds: string[],
  grado: string,
  division: string | null,
  turno: string | null
) {
  if (fotoIds.length === 0) return { ok: true, actualizadas: 0 };
  const { error } = await supabase
    .from("fotos")
    .update({ grado, division: division || null, turno: turno || null, alumno_id: null })
    .in("id", fotoIds);
  if (error) throw new Error(error.message);
  return { ok: true, actualizadas: fotoIds.length };
}

export async function desasignarFoto(fotoId: string) {
  const { error } = await supabase
    .from("fotos")
    .update({ alumno_id: null, grado: null, division: null, turno: null })
    .eq("id", fotoId);
  if (error) throw new Error(error.message);
  return { ok: true };
}

export async function eliminarFoto(fotoId: string) {
  const { data: foto } = await supabase
    .from("fotos")
    .select("storage_path, thumb_path, preview_path")
    .eq("id", fotoId)
    .maybeSingle();
  const { error } = await supabase.from("fotos").delete().eq("id", fotoId);
  if (error) throw new Error(error.message);
  // Best-effort: borra también los archivos del bucket (original + miniatura + preview)
  // para no dejar imágenes huérfanas ocupando espacio. Si falla, no rompemos el borrado.
  if (foto) {
    const paths = [foto.storage_path, foto.thumb_path, foto.preview_path].filter(Boolean) as string[];
    if (paths.length) {
      await supabase.storage.from("fotos").remove(paths);
    }
  }
  return { ok: true };
}
