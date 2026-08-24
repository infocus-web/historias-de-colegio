"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { verificarCodigoEvento } from "./actions";
export default function AccesoEvento({
eventoId,
colegioNombre,
eventoNombre,
}: {
eventoId: string;
colegioNombre: string;
eventoNombre: string;
}) {
const router = useRouter();
const [codigo, setCodigo] = useState("");
const [enviando, setEnviando] = useState(false);
const [error, setError] = useState<string | null>(null);
async function onSubmit(e: React.FormEvent) {
e.preventDefault();
if (!codigo.trim()) return;
setEnviando(true);
setError(null);
const resp = await verificarCodigoEvento(eventoId, codigo);
if (resp.ok) {
router.refresh();
} else {
setError(resp.error ?? "Código incorrecto.");
setEnviando(false);
}
}
return (
<div className="card center mt">
<div className="eyebrow">{colegioNombre}</div>
<h1 style={{ fontSize: 22, marginBottom: 6 }}>Acceso protegido</h1>
<p className="muted mb">
Para ver las fotos de <b>{eventoNombre}</b> necesitás el código que te compartió el
colegio (por WhatsApp o en un cartel del evento).
</p>
<form onSubmit={onSubmit} style={{ textAlign: "left" }}>
<div className="field">
<label>Código de acceso</label>
<input
type="text"
value={codigo}
onChange={(e) => setCodigo(e.target.value)}
placeholder="Ej: COLE2026"
autoFocus
style={{ textTransform: "uppercase" }}
/>
</div>
{error && (
<div className="notice" style={{ borderColor: "var(--bad, #c0392b)" }}>
{error}
</div>
)}
<button type="submit" className="btn mt" disabled={enviando || !codigo.trim()}>
{enviando ? "Verificando…" : "Entrar"}
</button>
</form>
<p className="muted mt" style={{ fontSize: 12.5 }}>
¿No tenés el código? Consultalo directamente con el colegio o con Infocus Producciones.
</p>
</div>
);
}
