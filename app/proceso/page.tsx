import Link from "next/link";
import SiteHeader from "@/app/components/SiteHeader";
import SiteFooter from "@/app/components/SiteFooter";
import WhatsAppButton from "@/app/components/WhatsAppButton";
const PASOS = [
{
titulo: "Buscás tu colegio",
texto:
"Entrás al sitio, elegís el colegio de tu hijo o hija de la lista y accedés al evento correspondiente.",
},
{
titulo: "Ingresás el código del evento",
texto:
"Cada evento tiene un código de acceso que el colegio comparte solo con las familias, para que la galería quede protegida.",
},
{
titulo: "Cargás los datos de tu hijo o hija",
texto:
"Completás nombre, grado y sección. Podés agregar más de un alumno si tenés varios hijos en el colegio.",
},
{
titulo: "Elegís las fotos",
texto:
"Vas a ver la galería del evento con marca de agua. Marcás las fotos que te interesan tocando cada una.",
},
{
titulo: "Elegís el kit",
texto:
"Impreso + Digital, Solo Digital, o sumás fotos y carpetas extra según lo que necesites.",
},
{
titulo: "Pagás online o en efectivo",
texto:
"Podés pagar en el momento o dejar el pedido marcado para pagar en efectivo. Vos elegís.",
},
{
titulo: "Recibís tus fotos",
texto:
"Una vez confirmado el pago, coordinamos la entrega del kit impreso y/o el acceso a los archivos digitales en alta resolución, sin marca de agua.",
},
];
export default function ProcesoPage() {
return (
<main>
<SiteHeader />
<section className="content-hero">
<div className="eyebrow" style={{ display: "flex", justifyContent: "center" }}>Proceso</div>
<h1>Así de simple es todo el proceso</h1>
<p>Desde que buscás el colegio hasta que recibís las fotos, todo se hace desde el celular.</p>
</section>
<section className="section-wrap">
<div className="process-list">
{PASOS.map((p, i) => (
<div className="process-step" key={p.titulo}>
<div className="process-step-num">{i + 1}</div>
<div>
<h3>{p.titulo}</h3>
<p>{p.texto}</p>
</div>
</div>
))}
</div>
</section>
<section className="cta-band">
<h2>¿Ya tenés el código de tu evento?</h2>
<p>Buscá tu colegio y empezá a elegir las fotos ahora mismo.</p>
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
