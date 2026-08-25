import Link from "next/link";
import SiteHeader from "@/app/components/SiteHeader";
import SiteFooter from "@/app/components/SiteFooter";
import WhatsAppButton from "@/app/components/WhatsAppButton";
const FAQS = [
{
q: "¿Cómo accedo a las fotos de mi hijo o hija?",
a: "Entrás al sitio, buscás el colegio en la lista, ingresás el código de acceso del evento que te compartió el colegio, y cargás los datos de tu hijo o hija para ver la galería.",
},
{
q: "¿Cualquiera puede ver las fotos?",
a: "No. Cada evento tiene un código de acceso propio que solo comparte el colegio con sus familias, y las fotos se muestran con marca de agua hasta que se confirma la compra.",
},
{
q: "¿Qué formas de pago hay?",
a: "Podés pagar online en el momento de hacer el pedido, o dejarlo marcado para pagar en efectivo y coordinar la entrega.",
},
{
q: "¿Puedo cargar más de un hijo?",
a: "Sí. Si tenés más de un hijo o hija en el colegio, podés agregarlos todos en el mismo pedido antes de elegir las fotos.",
},
{
q: "¿Qué incluye cada kit?",
a: "Impreso + Digital ($30.000) incluye la foto impresa y el archivo digital. Solo Digital ($15.000) incluye únicamente el archivo. También podés sumar fotos extra ($5.000 cada una) o una carpeta adicional para otro familiar ($10.000).",
},
{
q: "¿Cuándo recibo la foto en alta resolución?",
a: "Apenas se confirma el pago, la foto queda disponible sin marca de agua para descargar en alta resolución.",
},
{
q: "¿Cómo hago si soy colegio y quiero contratar la cobertura?",
a: "Podés ver la propuesta completa para el ciclo 2026 o escribirnos directamente por WhatsApp para coordinar una reunión.",
},
];
export default function RecursosPage() {
return (
<main>
<SiteHeader />
<section className="content-hero">
<div className="eyebrow" style={{ display: "flex", justifyContent: "center" }}>Recursos</div>
<h1>Preguntas frecuentes</h1>
<p>Todo lo que necesitás saber para usar la galería de fotos de tu colegio.</p>
</section>
<section className="section-wrap">
<div className="faq-list">
{FAQS.map((f) => (
<div className="faq-item" key={f.q}>
<h3>{f.q}</h3>
<p>{f.a}</p>
</div>
))}
</div>
</section>
<section className="cta-band">
<h2>¿Tenés otra duda?</h2>
<p>Escribinos por WhatsApp y te respondemos directamente.</p>
<div className="hero-cta">
<a href="https://wa.me/5491128625916" target="_blank" rel="noopener noreferrer" className="btn" style={{ width: "auto" }}>
Escribir por WhatsApp
</a>
<Link href="/#buscar-colegio" className="btn ghost" style={{ width: "auto", textDecoration: "none" }}>
Buscar mi colegio
</Link>
</div>
</section>
<SiteFooter />
<WhatsAppButton />
</main>
);
}
