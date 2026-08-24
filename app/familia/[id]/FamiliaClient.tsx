"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { cancelarPedido } from "@/app/actions";
import ThemeToggle from "@/app/components/ThemeToggle";
type Pedido = {
id: string;
tipoKit: string;
estado: string;
total: number;
carpetasImpresas: number;
createdAt: string;
metodoPago: string | null;
alumnoNombre: string | null;
alumnoGrado: string | null;
eventoNombre: string | null;
};
const ESTADO_LABEL: Record<string, string> = {
pendiente_pago: "Pendiente de pago",
pagado: "Pagado",
entregado: "Entregado",
cancelado: "Cancelado",
};
export default function FamiliaClient({ familia, pedidos }: { familia: { id: string; nombre: string; whatsapp: string }; pedidos: Pedido[] }) {
const router = useRouter();
const [cancelandoId, setCancelandoId] = useState<string | null>(null);
async function onCancelar(pedidoId: string) {
setCancelandoId(pedidoId);
try {
await cancelarPedido(pedidoId);
router.refresh();
} finally {
setCancelandoId(null);
}
}
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
<div className="eyebrow">Mis pedidos</div>
<h1 style={{ fontSize: 22, marginBottom: 6 }}>{familia.nombre}</h1>
<p className="muted mb">Todos los pedidos de tu familia, en un solo lugar.</p>
{pedidos.length === 0 && (
<p className="muted">Todavía no hiciste ningún pedido.</p>
)}
{pedidos.map((p) => (
<div key={p.id} className="pedido-row">
<div>
<div className="pedido-row-title">
{p.alumnoNombre ?? "Alumno/a"}
{p.alumnoGrado && <span className="muted"> · {p.alumnoGrado}</span>}
</div>
<div className="hint" style={{ marginTop: 2 }}>
{p.eventoNombre} · {p.tipoKit === "impreso_digital" ? "Kit Impreso + Digital" : "Solo Digital HD"}
{p.tipoKit === "impreso_digital" && p.carpetasImpresas > 1 ? ` · ${p.carpetasImpresas} carpetas` : ""}
</div>
</div>
<div className="pedido-row-right">
<span className={`pedido-estado pedido-estado-${p.estado}`}>
{p.estado === "pendiente_pago" && p.metodoPago === "efectivo"
? "Efectivo · pendiente"
: ESTADO_LABEL[p.estado] ?? p.estado}
</span>
<span className="pedido-total">${p.total.toLocaleString("es-AR")}</span>
<div className="pedido-actions">
{p.estado === "pendiente_pago" && (
<>
<Link href={`/pedido/${p.id}`} className="btn ghost" style={{ height: 36, fontSize: 13, padding: "0 14px" }}>
{p.metodoPago === "efectivo" ? "Ver detalle" : "Pagar"}
</Link>
<button
type="button"
className="btn ghost"
style={{ height: 36, fontSize: 13, padding: "0 14px" }}
disabled={cancelandoId === p.id}
onClick={() => onCancelar(p.id)}
>
{cancelandoId === p.id ? "Cancelando…" : "Cancelar"}
</button>
</>
)}
{p.estado !== "pendiente_pago" && (
<Link href={`/pedido/${p.id}`} className="btn ghost" style={{ height: 36, fontSize: 13, padding: "0 14px" }}>
Ver detalle
</Link>
)}
</div>
</div>
</div>
))}
</div>
<p className="center muted mt" style={{ fontSize: 12.5 }}>
¿Necesitás anotar a otro hijo/a o pedir fotos de otro evento? Volvé a entrar desde el link de tu colegio.
</p>
</div>
</main>
);
}
