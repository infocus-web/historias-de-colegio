import Link from "next/link";
export default function SiteFooter() {
return (
<footer className="site-footer">
<div className="site-footer-inner">
<div>
<div className="site-footer-brand">
<b>Infocus</b> Producciones
</div>
<p>
Cobertura fotográfica para eventos escolares. Las familias eligen y compran
solo las fotos que quieren, directamente desde el celular.
</p>
</div>
<div className="site-footer-col">
<h4>Sitio</h4>
<Link href="/servicios">Servicios</Link>
<Link href="/proceso">Proceso</Link>
<Link href="/galeria">Galería</Link>
<Link href="/recursos">Recursos</Link>
</div>
<div className="site-footer-col">
<h4>Contacto</h4>
<a href="https://wa.me/5491128625916" target="_blank" rel="noopener noreferrer">
WhatsApp
</a>
<a href="mailto:infocusfotografiayvideo@gmail.com">infocusfotografiayvideo@gmail.com</a>
<a href="https://instagram.com/somos.infocus" target="_blank" rel="noopener noreferrer">
@somos.infocus
</a>
</div>
</div>
<div className="site-footer-bottom">
<span>© {new Date().getFullYear()} Infocus Producciones</span>
<a
href="https://propuesta-colegio-2026.vercel.app"
target="_blank"
rel="noopener noreferrer"
style={{ textDecoration: "none", color: "inherit" }}
>
Propuesta para colegios 2026
</a>
</div>
</footer>
);
}
