import { NextResponse } from "next/server";
// Crea una preferencia de pago real en Mercado Pago (Checkout Pro).
// Necesita la variable de entorno MERCADOPAGO_ACCESS_TOKEN configurada en Vercel
// (Project Settings → Environment Variables) con el Access Token de la cuenta
// de Mercado Pago de Infocus. Mientras no esté configurada, responde ok:false
// para que el frontend pueda mostrar el modo de prueba.
export async function POST(req: Request) {
const token = process.env.MERCADOPAGO_ACCESS_TOKEN;
if (!token) {
return NextResponse.json(
{ ok: false, reason: "sin_credenciales" },
{ status: 200 }
);
}
const body = await req.json();
const { pedidoId, titulo, total } = body as {
pedidoId: string;
titulo: string;
total: number;
};
const origin = req.headers.get("origin") ?? "";
try {
const resp = await fetch("https://api.mercadopago.com/checkout/preferences", {
method: "POST",
headers: {
"Content-Type": "application/json",
Authorization: `Bearer ${token}`,
},
body: JSON.stringify({
items: [
{
title: titulo,
quantity: 1,
unit_price: total,
currency_id: "ARS",
},
],
external_reference: pedidoId,
back_urls: {
success: `${origin}/pedido/${pedidoId}?pago=aprobado`,
pending: `${origin}/pedido/${pedidoId}?pago=pendiente`,
failure: `${origin}/pedido/${pedidoId}?pago=fallido`,
},
auto_return: "approved",
notification_url: `${origin}/api/mercadopago/webhook`,
}),
});
if (!resp.ok) {
const errText = await resp.text();
return NextResponse.json({ ok: false, reason: "error_mp", detalle: errText }, { status: 200 });
}
const pref = await resp.json();
return NextResponse.json({ ok: true, init_point: pref.init_point });
} catch (e: any) {
return NextResponse.json({ ok: false, reason: "excepcion", detalle: e.message }, { status: 200 });
}
}
