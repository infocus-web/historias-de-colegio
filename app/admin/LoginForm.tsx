"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { adminLogin } from "./actions";
export default function LoginForm() {
const router = useRouter();
const [password, setPassword] = useState("");
const [enviando, setEnviando] = useState(false);
const [errorMsg, setErrorMsg] = useState<string | null>(null);
async function onSubmit(e: React.FormEvent) {
e.preventDefault();
setErrorMsg(null);
setEnviando(true);
try {
const resp = await adminLogin(password);
if (resp.ok) {
router.push("/admin/fotos");
router.refresh();
} else {
setErrorMsg(resp.error ?? "No pudimos iniciar sesión.");
}
} finally {
setEnviando(false);
}
}
return (
<form onSubmit={onSubmit}>
<div className="field">
<label>Contraseña</label>
<input
type="password"
value={password}
onChange={(e) => setPassword(e.target.value)}
autoComplete="current-password"
autoFocus
/>
</div>
{errorMsg && <p style={{ color: "var(--accent-dark)", fontSize: 13, marginTop: -6, marginBottom: 14 }}>{errorMsg}</p>}
<button className="btn" disabled={enviando || !password}>
{enviando ? "Ingresando…" : "Entrar →"}
</button>
</form>
);
}
