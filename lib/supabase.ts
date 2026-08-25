import { createClient } from "@supabase/supabase-js";
const url = process.env.NEXT_PUBLIC_SUPABASE_URL as string;
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string;
// Cliente único: se usa tanto en Server Components/Server Actions como en el navegador.
// Al ser un prototipo, las políticas RLS son públicas (ver notas del proyecto) — no hay
// sesión de usuario real, así que un solo cliente con la anon key alcanza en ambos lados.
export const supabase = createClient(url, anonKey);
export type Categoria = "grupal" | "individual" | "docente" | "varias";
export interface Foto {
id: string;
evento_id: string;
alumno_id: string | null;
grado: string | null;
division: string | null;
categoria: Categoria;
storage_path: string | null;
thumb_path: string | null;
preview_path: string | null;
}
export interface Evento {
id: string;
colegio_id: string;
nombre: string;
fecha: string | null;
estado: string;
}
export interface Colegio {
id: string;
slug: string;
nombre: string;
}
export function urlFoto(storagePath: string | null): string {
if (!storagePath) return "";
return `${url}/storage/v1/object/public/fotos/${storagePath}`;
}
