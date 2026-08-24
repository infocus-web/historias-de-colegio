import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
// Webhook de Mercado Pago: cuando el pago se aprueba, marca el pedido como
// pagado. Requiere MERCADOPAGO_ACCESS_TOKEN configurado (ver crear-preferencia/route.ts).
// Cuando el pedido pasa a "pagado" es el momento de disparar el envío por
// WhatsApp con las 3 fotos en HD (ver nota en README del proyecto).
export async function POST(req: Request) {
const token = process.env.MERCADOPAGO_ACCESS_TOKEN;
if (!token) return NextResponse.json({ ok: false }, { status: 200 });
const body = await req.json().catch(() => null);
const paymentId = body?.data?.id;
if (!paymentId) return NextResponse.json({ ok: true });
const resp = await fetch(`https://api.mercadopago.com/v1/payments/${paymentId}`, {
headers: { Authorization: `Bearer ${token}` },
});
if (!resp.ok) return NextResponse.json({ ok: false });
const payment = await resp.json();
const pedidoId = payment.external_reference;
if (!pedidoId) return NextResponse.json({ ok: true });
if (payment.status === "approved") {
await supabase
.from("pedidos")
.update({ estado: "pagado", mp_payment_id: String(paymentId), updated_at: new Date().toISOString() })
.eq("id", pedidoId);
// TODO: disparar acá el envío por WhatsApp de las 3 fotos en HD
// (adjuntas o con link de descarga) una vez conectada la WhatsApp Business API.
}
return NextResponse.json({ ok: true });
}
