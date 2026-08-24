import Link from "next/link";
import SiteHeader from "@/app/components/SiteHeader";
import SiteFooter from "@/app/components/SiteFooter";
import WhatsAppButton from "@/app/components/WhatsAppButton";

export default function GaleriaPage() {
  return (
    <main>
      <SiteHeader />

      <section className="content-hero">
        <div className="eyebrow" style={{ display: "flex", justifyContent: "center" }}>Galería</div>
        <h1>Así se ve la galería de cada evento</h1>
        <p>
          Mientras no compraste, las fotos se ven con marca de agua para protegerlas.
          Una vez confirmado el pago, accedés al archivo original en alta resolución.
        </p>
      </section>

      <section className="section-wrap">
        <div style={{ maxWidth: 420, margin: "0 auto 50px" }}>
          <div className="hero-image-wrap" style={{ maxWidth: "100%" }}>
            <img src="https://ntkqypxvrljuihbxdrtx.supabase.co/storage/v1/object/public/fotos/site-assets/hero-nena-v2.jpg" alt="Ejemplo de foto de galería" />
            <div className="hero-image-badge">Vista previa con marca de agua</div>
          </div>
          <p className="muted center" style={{ marginTop: 14, fontSize: 13 }}>
            Foto de ejemplo. Las fotos reales de tu colegio aparecen dentro de la
            galería de cada evento, protegida con código de acceso.
          </p>
        </div>

        <div className="card-grid cols-3">
          <div className="info-card">
            <div className="icon">🖼️</div>
            <h3>Marca de agua</h3>
            <p>
              Todas las fotos se muestran con marca de agua hasta que se confirma la
              compra, para que nadie pueda usarlas sin pagar.
            </p>
          </div>
          <div className="info-card">
            <div className="icon">🔑</div>
            <h3>Acceso por código</h3>
            <p>
              Cada evento tiene su propio código, que comparte el colegio solo con
              las familias que corresponden.
            </p>
          </div>
          <div className="info-card">
            <div className="icon">✨</div>
            <h3>Alta resolución al comprar</h3>
            <p>
              Al confirmar el pago, la foto queda disponible sin marca de agua, lista
              para descargar o imprimir.
            </p>
          </div>
        </div>
      </section>

      <section className="cta-band">
        <h2>Entrá a la galería de tu colegio</h2>
        <p>Buscá tu colegio, ingresá el código del evento y elegí tus fotos.</p>
        <div className="hero-cta">
          <Link href="/#buscar-colegio" className="btn" style={{ width: "auto", textDecoration: "none" }}>
            Buscar mi colegio
          </Link>
        </div>
      </section>

      <SiteFooter />
      <WhatsAppButton />
    </main>
  );
}
