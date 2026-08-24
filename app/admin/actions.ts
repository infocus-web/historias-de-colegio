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
export async function listarAlumnosDeEvento(eventoId: string) {
const { data: evento, error: errEvento } = await supabase
.from("eventos")
.select("colegio_id")
.eq("id", eventoId)
.maybeSingle();
if (errEvento) throw new Error(errEvento.message);
if (!evento) return [];
const { data, error } = await supabase
.from("alumnos")
.select("id, nombre, grado, division, familias!inner(colegio_id)")
.eq("familias.colegio_id", evento.colegio_id)
.order("nombre");
if (error) throw new Error(error.message);
return (data ?? []).map((a: any) => ({
id: a.id as string,
nombre: a.nombre as string,
grado: a.grado as string,
division: a.division as string | null,
}));
}
// Combos únicos de grado+división presentes entre los alumnos del colegio del evento,
// para poblar el selector de fotos grupales (no todos los cursos usan división).
export async function listarGradosDivisionDeEvento(eventoId: string) {
const alumnos = await listarAlumnosDeEvento(eventoId);
const vistos = new Set<string>();
const combos: { grado: string; division: string | null }[] = [];
for (const a of alumnos) {
const clave = `${a.grado}__${a.division ?? ""}`;
if (vistos.has(clave)) continue;
vistos.add(clave);
combos.push({ grado: a.grado, division: a.division });
}
combos.sort((a, b) => a.grado.localeCompare(b.grado) || (a.division ?? "").localeCompare(b.division ?? ""));
return combos;
}
export async function listarFotosEvento(eventoId: string) {
const { data, error } = await supabase
.from("fotos")
.select("id, categoria, storage_path, thumb_path, preview_path, alumno_id, grado, division")
.eq("evento_id", eventoId)
.order("created_at", { ascending: false });
if (error) throw new Error(error.message);
return data ?? [];
}
// Registra en la tabla `fotos` un archivo que el navegador ya subió directamente a
// Supabase Storage (bucket público `fotos`, permite INSERT anónimo).
export async function subirFotoRegistro(
eventoId: string,
categoria: "individual" | "grupal" | "docente" | "varias",
storagePath: string,
thumbPath: string | null = null,
previewPath: string | null = null
) {
const { data, error } = await supabase
.from("fotos")
.insert({
evento_id: eventoId,
categoria,
storage_path: storagePath,
thumb_path: thumbPath,
preview_path: previewPath,
})
.select("id")
.single();
if (error) throw new Error(error.message);
return { id: data.id as string };
}
export async function asignarFotoAlumno(fotoId: string, alumnoId: string) {
const { error } = await supabase
.from("fotos")
.update({ alumno_id: alumnoId, grado: null, division: null })
.eq("id", fotoId);
if (error) throw new Error(error.message);
return { ok: true };
}
export async function asignarFotoGrupal(fotoId: string, grado: string, division: string | null) {
const { error } = await supabase
.from("fotos")
.update({ grado, division: division || null, alumno_id: null })
.eq("id", fotoId);
if (error) throw new Error(error.message);
return { ok: true };
}
export async function desasignarFoto(fotoId: string) {
const { error } = await supabase
.from("fotos")
.update({ alumno_id: null, grado: null, division: null })
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
