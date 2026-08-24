import { redirect } from "next/navigation";
import Link from "next/link";
import { haySesionAdmin } from "./actions";
import { adminPasswordConfigurada } from "@/lib/adminAuth";
import LoginForm from "./LoginForm";
import ThemeToggle from "@/app/components/ThemeToggle";
export const dynamic = "force-dynamic";
export default async function AdminPage() {
if (await haySesionAdmin()) {
redirect("/admin/fotos");
}
return (
<main style={{ minHeight: "100vh", background: "var(--gradient-warm)" }}>
<div className="wrap-narrow" style={{ paddingBottom: 60 }}>
<div className="page-header">
<Link href="/" className="brand" style={{ textDecoration: "none" }}>
<b>Infocus</b> Producciones
</Link>
<ThemeToggle />
</div>
<div className="card mt">
<div className="eyebrow center">Panel interno</div>
<h1 className="center" style={{ fontSize: 22, marginBottom: 10 }}>
Ingresá la contraseña
</h1>
<p className="muted center mb">Carga y asignación de fotos por evento.</p>
{!adminPasswordConfigurada() && (
<div className="notice">
<strong>ADMIN_PASSWORD no está configurada.</strong> Falta setear esa variable de
entorno en Vercel para poder entrar a este panel.
</div>
)}
<LoginForm />
</div>
</div>
</main>
);
}
