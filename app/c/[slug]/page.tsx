import { supabase } from "@/lib/supabase";
import { notFound } from "next/navigation";
import { cookies } from "next/headers";
import Link from "next/link";
import Flow from "./Flow";
import AccesoEvento from "./AccesoEvento";
import ThemeToggle from "@/app/components/ThemeToggle";
import { cookieAccesoEvento, tokenParaCodigo } from "@/lib/eventoAcceso";
export const dynamic = "force-dynamic";
export default async function ColegioPage({ params }: { params: Promise<{ slug: string }> }) {
const { slug } = await params;
const { data: colegio } = await supabase
.from("colegios")
.select("id, slug, nombre")
.eq("slug", slug)
.maybeSingle();
if (!colegio) notFound();
const { data: evento } = await supabase
.from("eventos")
.select("id, nombre, fecha, estado, codigo_acceso")
.eq("colegio_id", colegio.id)
.eq("estado", "abierto")
.order("fecha", { ascending: false })
.limit(1)
.maybeSingle();
if (!evento) {
return (
<main style={{ minHeight: "100vh", background: "var(--gradient-warm)" }}>
<div className="wrap">
<div className="page-header">
<Link href="/" className="brand" style={{ textDecoration: "none" }}>
<b>Infocus</b> Producciones
</Link>
<ThemeToggle />
</div>
<div className="card center mt">
<h1 style={{ fontSize: 22 }}>{colegio.nombre}</h1>
<p className="muted mt">Todavía no hay ningún evento con galería abierta.</p>
</div>
</div>
</main>
);
}
// Gate por código de acceso: si el evento tiene un código configurado, la familia
// tiene que ingresarlo antes de ver ninguna foto (protege las fotos de los chicos
// de accesos no autorizados por cualquiera que encuentre el link del colegio).
if (evento.codigo_acceso) {
const store = await cookies();
const cookieVal = store.get(cookieAccesoEvento(evento.id))?.value;
const esperado = tokenParaCodigo(evento.id, evento.codigo_acceso);
if (cookieVal !== esperado) {
return (
<main style={{ minHeight: "100vh", background: "var(--gradient-warm)" }}>
<div className="wrap">
<div className="page-header">
<Link href="/" className="brand" style={{ textDecoration: "none" }}>
<b>Infocus</b> Producciones
</Link>
<ThemeToggle />
</div>
<AccesoEvento eventoId={evento.id} colegioNombre={colegio.nombre} eventoNombre={evento.nombre} />
</div>
</main>
);
}
}
const { data: fotos } = await supabase
.from("fotos")
.select("id, categoria, storage_path, thumb_path, preview_path, alumno_id, grado, division")
.eq("evento_id", evento.id);
// El original en HD (storage_path) nunca debe llegar al navegador de la familia cuando ya
// existe una versión con la marca de agua horneada en los píxeles (thumb_path + preview_path):
// así una foto no se puede "guardar como..." sin marca antes de pagar. Si a una foto le falta
// alguna de las dos (por ejemplo las 3 fotos demo, cargadas antes de esta función), se mantiene
// el comportamiento anterior como respaldo para no romper la demo.
const fotosParaFamilia = (fotos ?? []).map((f) => ({
...f,
storage_path: f.thumb_path && f.preview_path ? null : f.storage_path,
}));
return (
<Flow
colegio={colegio}
evento={evento}
fotos={fotosParaFamilia}
/>
);
}
