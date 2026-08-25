import { createHash } from "crypto";
// Autenticación mínima para el panel interno /admin: una sola contraseña compartida
// (variable de entorno ADMIN_PASSWORD, todavía sin configurar en Vercel). No hay
// usuarios ni roles — es un gate simple para que la carga y etiquetado de fotos no
// quede abierta a cualquiera que encuentre la URL. Server-only: nunca se importa
// desde un componente cliente (usa `crypto` y `next/headers`, que no existen en el browser).
export const ADMIN_COOKIE = "admin_session";
export function adminPasswordConfigurada(): boolean {
return Boolean(process.env.ADMIN_PASSWORD);
}
export function tokenParaPassword(password: string): string {
return createHash("sha256").update(password).digest("hex");
}
export function tokenEsValido(token: string | undefined): boolean {
const real = process.env.ADMIN_PASSWORD;
if (!real || !token) return false;
return token === tokenParaPassword(real);
}
