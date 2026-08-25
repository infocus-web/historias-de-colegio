import Link from "next/link";
import SiteHeader from "@/app/components/SiteHeader";
import SiteFooter from "@/app/components/SiteFooter";
import WhatsAppButton from "@/app/components/WhatsAppButton";
export default function ServiciosPage() {
return (
<main>
<SiteHeader />
<section className="content-hero">
<div className="eyebrow" style={{ display: "flex", justifyContent: "center" }}>Servicios</div>
<h1>Cobertura fotográfica pensada para colegios</h1>
<p>
Cubrimos actos, jornadas y eventos escolares, y le damos a cada familia
un lugar simple para ver y comprar solo las fotos de su hijo o hija.
</p>
</section>
<section className="section-wrap">
<div className="card-grid cols-3">
<div className="info-card">
<div className="icon">📷</div>
<h3>Cobertura del evento</h3>
<p>
Fotografiamos el acto o la jornada completa: momentos grupales, entrega de
diplomas, actividades y detalles. Sin interrumpir la actividad del colegio.
</p>
</div>
<div className="info-card">
<div className="icon">🔒</div>
<h3>Galería con acceso protegido</h3>
<p>
Cada evento tiene su propia galería online, con marca de agua para proteger
las imágenes hasta el momento de la compra, y acceso limitado a las familias
del colegio.
</p>
</div>
<div className="info-card">
<div className="icon">🛒</div>
<h3>Compra directa desde el celular</h3>
<p>
Cada familia entra, encuentra las fotos de su hijo o hija, elige las que
quiere y paga online. Sin planillas, sin sobres, sin intermediarios.
</p>
</div>
</div>
</section>
<section className="section-wrap" style={{ paddingTop: 0 }}>
<h2 style={{ textAlign: "center", fontSize: 24, marginBottom: 28 }}>Kits disponibles</h2>
<div className="card-grid">
<div className="info-card">
<h3>Impreso + Digital</h3>
<p>Fotos seleccionadas impresas en alta calidad, más el archivo digital de cada una.</p>
<div className="price">$30.000</div>
</div>
<div className="info-card">
<h3>Solo Digital</h3>
<p>El archivo digital en alta resolución, sin marca de agua, listo para descargar.</p>
<div className="price">$15.000</div>
</div>
<div className="info-card">
<h3>Foto extra</h3>
<p>Sumar una foto más allá de las incluidas en el kit elegido.</p>
<div className="price">$5.000 c/u</div>
</div>
<div className="info-card">
<h3>Carpeta extra</h3>
<p>Una carpeta adicional para otro familiar (abuelos, padrinos, etc.).</p>
<div className="price">$10.000</div>
</div>
</div>
</section>
<section className="cta-band">
<h2>¿Sos parte de un colegio?</h2>
<p>Mirá la propuesta completa para el ciclo 2026, con todos los detalles del acuerdo con el colegio.</p>
<div className="hero-cta">
<a href="https://propuesta-colegio-2026.vercel.app" target="_blank" rel="noopener noreferrer" className="btn" style={{ width: "auto" }}>
Ver propuesta 2026
</a>
<Link href="/#buscar-colegio" className="btn ghost" style={{ width: "auto", textDecoration: "none" }}>
Ya sos familia — Ingresar
</Link>
</div>
</section>
<SiteFooter />
<WhatsAppButton />
</main>
);
}
