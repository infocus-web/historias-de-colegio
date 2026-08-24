"use server";
import { supabase } from "@/lib/supabase";
const PRECIOS: Record<string, number> = {
impreso_digital: 30000,
solo_digital: 15000,
};
const PRECIO_FOTO_EXTRA = 5000; // foto digital adicional, más allá de las 3 del kit
const PRECIO_CARPETA_EXTRA = 10000; // cada carpeta impresa adicional (la primera va incluida en el kit)
export type AlumnoInput = {
nombre: string;
grado: string;
division?: string;
turno?: string;
autorizaFotografica: boolean;
autorizaBackstage: boolean;
};
// Da de alta (o reconoce) a la familia por WhatsApp dentro del colegio, y registra
// uno o más alumnos asociados en la misma operación (soporte multi-hijo).
export async function guardarFamiliaConAlumnos(
colegioId: string,
tutor: { nombre: string; whatsapp: string },
alumnos: AlumnoInput[]
) {
const whatsappLimpio = tutor.whatsapp.replace(/\D/g, "");
const { data: existente } = await supabase
.from("familias")
.select("id")
.eq("colegio_id", colegioId)
.eq("whatsapp", whatsappLimpio)
.maybeSingle();
let familiaId: string;
if (existente) {
familiaId = existente.id as string;
} else {
const { data, error } = await supabase
.from("familias")
.insert({ colegio_id: colegioId, nombre: tutor.nombre, whatsapp: whatsappLimpio })
.select("id")
.single();
if (error) throw new Error(error.message);
familiaId = data.id as string;
}
const filas = alumnos.map((a) => ({
familia_id: familiaId,
nombre: a.nombre,
grado: a.grado,
division: a.division || null,
turno: a.turno || null,
autoriza_fotografica: a.autorizaFotografica,
autoriza_backstage: a.autorizaBackstage,
}));
const { data: alumnosData, error: errAlumnos } = await supabase
.from("alumnos")
.insert(filas)
.select("id");
if (errAlumnos) throw new Error(errAlumnos.message);
return {
familiaId,
alumnoIds: (alumnosData ?? []).map((a: any) => a.id as string),
};
}
export async function crearPedido(params: {
familiaId: string;
alumnoId?: string | null;
eventoId: string;
tipoKit: "impreso_digital" | "solo_digital";
fotos: { fotoId: string; categoria: string }[];
fotosExtra?: { fotoId: string; categoria: string }[];
carpetasImpresas?: number;
}) {
const fotosExtra = params.fotosExtra ?? [];
// Las carpetas impresas extra solo tienen sentido si el kit incluye impresión.
const carpetasImpresas =
params.tipoKit === "impreso_digital" ? Math.max(1, params.carpetasImpresas ?? 1) : 1;
const total =
(PRECIOS[params.tipoKit] ?? 0) +
fotosExtra.length * PRECIO_FOTO_EXTRA +
(carpetasImpresas - 1) * PRECIO_CARPETA_EXTRA;
const { data: pedido, error } = await supabase
.from("pedidos")
.insert({
familia_id: params.familiaId,
alumno_id: params.alumnoId ?? null,
evento_id: params.eventoId,
tipo_kit: params.tipoKit,
carpetas_impresas: carpetasImpresas,
total,
estado: "pendiente_pago",
})
.select("id")
.single();
if (error) throw new Error(error.message);
const filas = [
...params.fotos.map((f) => ({
pedido_id: pedido.id,
foto_id: f.fotoId,
categoria: f.categoria,
})),
...fotosExtra.map((f) => ({
pedido_id: pedido.id,
foto_id: f.fotoId,
categoria: "extra",
})),
];
const { error: err2 } = await supabase.from("pedido_fotos").insert(filas);
if (err2) throw new Error(err2.message);
return { id: pedido.id as string, total };
}
// Simula la confirmación de pago para poder probar el resto del flujo
// (entrega en HD) sin credenciales reales de Mercado Pago todavía.
export async function simularPagoAprobado(pedidoId: string) {
const { error } = await supabase
.from("pedidos")
.update({ estado: "pagado", updated_at: new Date().toISOString() })
.eq("id", pedidoId);
if (error) throw new Error(error.message);
return { ok: true };
}
// Cancela un pedido pendiente de pago (panel "Mis pedidos" de la familia).
export async function cancelarPedido(pedidoId: string) {
const { error } = await supabase
.from("pedidos")
.update({ estado: "cancelado", updated_at: new Date().toISOString() })
.eq("id", pedidoId);
if (error) throw new Error(error.message);
return { ok: true };
}
// Registra que la familia eligió pagar en efectivo (sobre cerrado, a entregar en el
// colegio). El pedido sigue "pendiente_pago" hasta que alguien del lado de Infocus
// confirme la entrega del efectivo (todavía no hay panel de administración para eso).
export async function elegirPagoEfectivo(pedidoId: string) {
const { error } = await supabase
.from("pedidos")
.update({ metodo_pago: "efectivo", updated_at: new Date().toISOString() })
.eq("id", pedidoId);
if (error) throw new Error(error.message);
return { ok: true };
}
