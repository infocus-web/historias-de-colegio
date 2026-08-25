"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { simularPagoAprobado, elegirPagoEfectivo } from "@/app/actions";
import ThemeToggle from "@/app/components/ThemeToggle";
const ETIQUETAS: Record<string, string> = {
grupal: "Grupal · 20x30cm",
individual: "Individual · 15x21cm",
docente: "Con docente · 15x21cm",
};
export default function PedidoClient({ pedido, familia, evento, fotos }: any) {
const router = useRouter();
const [pagando, setPagando] = useState(false);
const [modoPrueba, setModoPrueba] = useState(false);
const [mostrarEfectivo, setMostrarEfectivo] = useState(false);
const [confirmandoEfectivo, setConfirmandoEfectivo] = useState(false);
async function pagar() {
setPagando(true);
const resp = await fetch("/api/mercadopago/crear-preferencia", {
method: "POST",
headers: { "Content-Type": "application/json" },
body: JSON.stringify({
pedidoId: pedido.id,
titulo: `${evento?.nombre ?? "Fotos escolares"} — Kit ${pedido.tipo_kit === "impreso_digital" ? "Impreso + Digital" : "Solo Digital HD"}`,
total: pedido.total,
}),
});
const data = await resp.json();
if (data.ok && data.init_point) {
window.location.href = data.init_point;
return;
}
setModoPrueba(true);
setPagando(false);
}
async function simular() {
setPagando(true);
await simularPagoAprobado(pedido.id);
router.refresh();
setPagando(false);
}
async function confirmarEfectivo() {
setConfirmandoEfectivo(true);
await elegirPagoEfectivo(pedido.id);
router.refresh();
setConfirmandoEfectivo(false);
}
const pagado = pedido.estado === "pagado";
const efectivoElegido = pedido.metodo_pago === "efectivo";
return (
<main style={{ minHeight: "100vh", background: "var(--gradient-warm)" }}>
<div className="wrap" style={{ paddingBottom: 60 }}>
<div className="page-header">
<Link href="/" className="brand" style={{ textDecoration: "none" }}>
<b>Infocus</b> Producciones
</Link>
<ThemeToggle />
</div>
<div className="card mt">
{!pagado && !efectivoElegido && !mostrarEfectivo && (
<>
<div className="eyebrow">{evento?.nombre}</div>
<h1 style={{ fontSize: 20, marginBottom: 6 }}>Confirmá tu pago</h1>
<p className="muted mb">
{familia?.nombre} · {pedido.tipo_kit === "impreso_digital" ? "Kit Impreso + Digital" : "Solo Digital HD"} · $
{Number(pedido.total).toLocaleString("es-AR")}
</p>
{!modoPrueba ? (
<button className="btn" disabled={pagando} onClick={pagar}>
{pagando ? "Conectando con Mercado Pago…" : "Pagar con Mercado Pago →"}
</button>
) : (
<>
<div className="notice">
<strong>Modo de prueba.</strong> Todavía no configuramos las credenciales reales de
Mercado Pago en este proyecto, así que no se puede cobrar de verdad. Simulá el pago
aprobado para ver cómo sigue el flujo (entrega de las fotos en HD).
</div>
<button className="btn dark" disabled={pagando} onClick={simular}>
{pagando ? "Procesando…" : "Simular pago aprobado (modo prueba)"}
</button>
</>
)}
<button type="button" className="btn ghost mt" onClick={() => setMostrarEfectivo(true)}>
Pagar en efectivo en el colegio
</button>
</>
)}
{!pagado && !efectivoElegido && mostrarEfectivo && (
<>
<div className="eyebrow">{evento?.nombre}</div>
<h1 style={{ fontSize: 20, marginBottom: 6 }}>Pago en efectivo</h1>
<p className="muted mb">
Vas a abonar <b>${Number(pedido.total).toLocaleString("es-AR")}</b> en efectivo, en sobre
cerrado, el día que retirés el pedido en el colegio.
</p>
<div className="notice">
<strong>Importante:</strong> una vez que confirmes esta opción no vas a poder cambiar el
medio de pago para este pedido.
</div>
<button className="btn" disabled={confirmandoEfectivo} onClick={confirmarEfectivo}>
{confirmandoEfectivo ? "Confirmando…" : "Confirmar pago en efectivo"}
</button>
<button type="button" className="btn ghost mt" onClick={() => setMostrarEfectivo(false)}>
← Volver
</button>
</>
)}
{!pagado && efectivoElegido && (
<>
<div className="eyebrow">{evento?.nombre}</div>
<h1 style={{ fontSize: 20, marginBottom: 6 }}>Pago en efectivo confirmado</h1>
<p className="muted mb">
{familia?.nombre} · {pedido.tipo_kit === "impreso_digital" ? "Kit Impreso + Digital" : "Solo Digital HD"}
</p>
<div className="notice">
<strong>Llevá ${Number(pedido.total).toLocaleString("es-AR")} en efectivo</strong>, en sobre
cerrado, el día que retirés el pedido en el colegio. Te avisamos por WhatsApp cuando esté listo.
</div>
<Link href="/" className="btn ghost mt" style={{ textDecoration: "none" }}>
← Volver al inicio
</Link>
</>
)}
{pagado && (
<>
<div className="eyebrow" style={{ color: "var(--good)" }}>✓ Pago confirmado</div>
<h1 style={{ fontSize: 20, marginBottom: 6 }}>¡Gracias, {familia?.nombre?.split(" ")[0]}!</h1>
<p className="muted mb">
Te enviamos tus fotos en alta resolución al WhatsApp {familia?.whatsapp}.
</p>
<div className="notice">
<strong>Cómo llegan tus fotos en HD:</strong>{" "}
{pedido.tipo_kit === "impreso_digital"
? `Además de retirar ${pedido.carpetas_impresas > 1 ? `las ${pedido.carpetas_impresas} carpetas impresas` : "la carpeta impresa"} en el colegio, te llega por WhatsApp el link de descarga de todas tus fotos en HD sin marca de agua, de regalo.`
: "Te llega por WhatsApp el link de descarga privado de todas tus fotos en HD, sin marca de agua."}
{" "}(En este prototipo el envío real por WhatsApp todavía no está conectado — ver nota abajo.)
</div>
{pedido.tipo_kit === "impreso_digital" && pedido.carpetas_impresas > 1 && (
<p className="muted mb" style={{ fontSize: 13.5 }}>
Carpetas impresas: {pedido.carpetas_impresas}
</p>
)}
<div className="gallery" style={{ gridTemplateColumns: "repeat(3, 1fr)" }}>
{fotos.map((f: any, i: number) => (
<div key={i} className="photo-card">
<img src={f.url} alt={ETIQUETAS[f.categoria]} style={{ filter: "none" }} />
{f.esExtra && <div className="photo-tag">Extra</div>}
</div>
))}
</div>
<Link href="/" className="btn ghost mt" style={{ textDecoration: "none" }}>
← Volver al inicio
</Link>
</>
)}
</div>
</div>
</main>
);
}
