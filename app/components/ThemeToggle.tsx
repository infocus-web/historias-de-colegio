"use client";
import { useEffect, useState } from "react";
export default function ThemeToggle() {
const [dark, setDark] = useState(false);
useEffect(() => {
setDark(document.documentElement.classList.contains("dark"));
}, []);
function toggle() {
const next = !dark;
setDark(next);
document.documentElement.classList.toggle("dark", next);
try {
localStorage.setItem("theme", next ? "dark" : "light");
} catch {}
}
return (
<button
type="button"
aria-label={dark ? "Activar modo claro" : "Activar modo oscuro"}
className="theme-toggle"
onClick={toggle}
>
{dark ? (
<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
<circle cx="12" cy="12" r="4" />
<path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
</svg>
) : (
<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
<path d="M20.985 12.486a9 9 0 1 1-9.473-9.472c.405-.022.617.46.402.803a6 6 0 0 0 8.268 8.268c.344-.215.825-.004.803.401" />
</svg>
)}
</button>
);
}
