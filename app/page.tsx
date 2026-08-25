import { supabase } from "@/lib/supabase";
import Link from "next/link";
import SiteHeader from "@/app/components/SiteHeader";
import SiteFooter from "@/app/components/SiteFooter";
import WhatsAppButton from "@/app/components/WhatsAppButton";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const { data: colegios } = await supabase
    .from("colegios")
    .select("slug, nombre")
    .order("nombre");

  return (
    <main>
      <SiteHeader />

      <section className="hero-section">
        <div>
          <div className="hero-eyebrow">Fotografía escolar</div>
          <h1 className="hero-title">
            Las fotos del colegio, <span className="accent-text">directo al celular</span> de cada familia
          </h1>
          <p className="hero-subtitle">
            Cubrimos actos y jornadas escolares, y cada familia elige y compra online
            solo las fotos de su hijo o hija. Sin sobres, sin planillas, sin vueltas.
          </p>
          <div className="hero-cta">
            <Link href="/proceso" className="btn ghost" style={{ textDecoration: "none" }}>
              Cómo funciona
            </Link>
          </div>
        </div>

        <div className="hero-image-wrap">
          <img src="https://ntkqypxvrljuihbxdrtx.supabase.co/storage/v1/object/public/fotos/site-assets/hero-nena-v2.jpg" alt="Alumna con guardapolvo" />
          <div className="hero-image-badge">Fotografía escolar profesional</div>
        </div>
      </section>

      <section className="buscar-section" id="buscar-colegio">
        <div className="card">
          <div className="eyebrow">Fotografía escolar</div>
          <h2 style={{ fontSize: 26, marginBottom: 10 }}>Buscá tu colegio</h2>
          <p className="muted" style={{ marginBottom: 26 }}>
            Seleccioná el colegio de tu hijo/a para acceder a las fotos del evento.
          </p>

          {(!colegios || colegios.length === 0) && (
            <p className="muted">Todavía no hay colegios cargados.</p>
          )}

          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {colegios?.map((c) => (
              <Link key={c.slug} href={`/c/${c.slug}`} className="btn ghost" style={{ textDecoration: "none" }}>
                {c.nombre}
              </Link>
            ))}
          </div>
        </div>

        <p className="center muted mt" style={{ fontSize: 12.5 }}>
          Prototipo funcional — datos de ejemplo para probar el flujo completo.
        </p>
      </section>

      <SiteFooter />
      <WhatsAppButton />
    </main>
  );
}
