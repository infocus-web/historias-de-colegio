"use client";
import Link from "next/link";
import { useState } from "react";
import ThemeToggle from "./ThemeToggle";
const NAV_LINKS = [
{ href: "/servicios", label: "Servicios" },
{ href: "/proceso", label: "Proceso" },
{ href: "/galeria", label: "Galería" },
{ href: "/recursos", label: "Recursos" },
];
export default function SiteHeader() {
const [abierto, setAbierto] = useState(false);
return (
<header className="site-header">
<div className="site-header-inner">
<Link href="/" className="site-logo" style={{ textDecoration: "none" }} onClick={() => setAbierto(false)}>
<b>Infocus</b> Producciones
</Link>
<nav className="site-nav" aria-label="Navegación principal">
{NAV_LINKS.map((l) => (
<Link key={l.href} href={l.href} className="site-nav-link">
{l.label}
</Link>
))}
</nav>
<div className="site-header-actions">
<a
href="https://propuesta-colegio-2026.vercel.app"
target="_blank"
rel="noopener noreferrer"
className="site-nav-btn ghost"
>
Propuesta 2026
</a>
<Link href="/#buscar-colegio" className="site-nav-btn solid">
Ingresar
</Link>
<ThemeToggle />
<button
type="button"
className="site-menu-toggle"
aria-label={abierto ? "Cerrar menú" : "Abrir menú"}
aria-expanded={abierto}
onClick={() => setAbierto((v) => !v)}
>
<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
{abierto ? <path d="M6 6l12 12M18 6L6 18" /> : <path d="M4 7h16M4 12h16M4 17h16" />}
</svg>
</button>
</div>
</div>
{abierto && (
<nav className="site-nav-mobile" aria-label="Navegación móvil">
{NAV_LINKS.map((l) => (
<Link key={l.href} href={l.href} className="site-nav-mobile-link" onClick={() => setAbierto(false)}>
{l.label}
</Link>
))}
<a
href="https://propuesta-colegio-2026.vercel.app"
target="_blank"
rel="noopener noreferrer"
className="site-nav-mobile-link"
>
Propuesta 2026
</a>
<Link href="/#buscar-colegio" className="site-nav-mobile-link" onClick={() => setAbierto(false)}>
Ingresar
</Link>
</nav>
)}
</header>
);
}
