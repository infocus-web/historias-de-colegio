import { supabase } from "@/lib/supabase";
import { notFound } from "next/navigation";
import FamiliaClient from "./FamiliaClient";
export const dynamic = "force-dynamic";
export default async function FamiliaPage({ params }: { params: Promise<{ id: string }> }) {
const { id } = await params;
const { data: familia } = await supabase
.from("familias")
.select("id, nombre, whatsapp")
.eq("id", id)
.maybeSingle();
if (!familia) notFound();
const { data: pedidos } = await supabase
.from("pedidos")
.select("id, tipo_kit, estado, total, carpetas_impresas, created_at, alumno_id, evento_id, metodo_pago")
.eq("familia_id", id)
.order("created_at", { ascending: false });
const alumnoIds = Array.from(new Set((pedidos ?? []).map((p) => p.alumno_id).filter(Boolean))) as string[];
const eventoIds = Array.from(new Set((pedidos ?? []).map((p) => p.evento_id).filter(Boolean))) as string[];
const [{ data: alumnos }, { data: eventos }] = await Promise.all([
alumnoIds.length
? supabase.from("alumnos").select("id, nombre, grado, division").in("id", alumnoIds)
: Promise.resolve({ data: [] as any[] }),
eventoIds.length
? supabase.from("eventos").select("id, nombre").in("id", eventoIds)
: Promise.resolve({ data: [] as any[] }),
]);
const alumnoPorId = new Map((alumnos ?? []).map((a: any) => [a.id, a]));
const eventoPorId = new Map((eventos ?? []).map((e: any) => [e.id, e]));
const pedidosConDatos = (pedidos ?? []).map((p) => {
const alumno = p.alumno_id ? alumnoPorId.get(p.alumno_id) : null;
const evento = p.evento_id ? eventoPorId.get(p.evento_id) : null;
return {
id: p.id as string,
tipoKit: p.tipo_kit as string,
estado: p.estado as string,
total: Number(p.total),
carpetasImpresas: p.carpetas_impresas as number,
createdAt: p.created_at as string,
metodoPago: p.metodo_pago as string | null,
alumnoNombre: alumno?.nombre ?? null,
alumnoGrado: alumno ? [alumno.grado, alumno.division].filter(Boolean).join(" · ") : null,
eventoNombre: evento?.nombre ?? null,
};
});
return <FamiliaClient familia={familia} pedidos={pedidosConDatos} />;
}
