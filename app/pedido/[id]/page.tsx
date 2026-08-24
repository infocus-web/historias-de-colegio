import { supabase, urlFoto } from "@/lib/supabase";
import { notFound } from "next/navigation";
import PedidoClient from "./PedidoClient";
export const dynamic = "force-dynamic";
export default async function PedidoPage({ params }: { params: Promise<{ id: string }> }) {
const { id } = await params;
const { data: pedido } = await supabase
.from("pedidos")
.select("id, tipo_kit, estado, total, familia_id, evento_id, carpetas_impresas, metodo_pago")
.eq("id", id)
.maybeSingle();
if (!pedido) notFound();
const [{ data: familia }, { data: evento }, { data: items }] = await Promise.all([
supabase.from("familias").select("nombre, whatsapp").eq("id", pedido.familia_id).maybeSingle(),
supabase.from("eventos").select("nombre, colegio_id").eq("id", pedido.evento_id).maybeSingle(),
supabase
.from("pedido_fotos")
.select("categoria, fotos(storage_path, categoria)")
.eq("pedido_id", pedido.id),
]);
// El original en HD sin marca de agua solo se manda al navegador una vez que el pedido está
// pagado — antes de eso, PedidoClient no muestra la galería igual, pero no tiene sentido que
// la URL real viaje en el payload de la página si todavía no corresponde entregarla.
const fotos =
pedido.estado === "pagado"
? (items ?? []).map((it: any) => ({
categoria: it.fotos.categoria as string,
esExtra: it.categoria === "extra",
url: urlFoto(it.fotos.storage_path),
}))
: [];
return (
<PedidoClient
pedido={pedido}
familia={familia}
evento={evento}
fotos={fotos}
/>
);
}
