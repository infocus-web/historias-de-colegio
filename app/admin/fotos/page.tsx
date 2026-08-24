import { redirect } from "next/navigation";
import Link from "next/link";
import { haySesionAdmin, listarEventos } from "../actions";
import AdminFotosClient from "./AdminFotosClient";
import ThemeToggle from "@/app/components/ThemeToggle";
export const dynamic = "force-dynamic";
export default async function AdminFotosPage() {
if (!(await haySesionAdmin())) {
redirect("/admin");
}
const eventos = await listarEventos();
return (
<main style={{ minHeight: "100vh", background: "var(--gradient-warm)" }}>
<div className="wrap-wide" style={{ paddingBottom: 60 }}>
<div className="page-header">
<Link href="/" className="brand" style={{ textDecoration: "none" }}>
<b>Infocus</b> Producciones
</Link>
<ThemeToggle />
</div>
<div className="eyebrow">Panel interno</div>
<h1 style={{ fontSize: 26, marginBottom: 16 }}>Carga y asignación de fotos</h1>
<AdminFotosClient eventos={eventos} />
</div>
</main>
);
}
