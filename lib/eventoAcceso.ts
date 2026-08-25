import { createHash } from "crypto";
// Ayudante compartido para el "código de acceso" por evento: una familia tiene que
// ingresar el código que le compartió el colegio (WhatsApp, cartel, etc.) antes de
// poder ver las fotos de ese evento puntual. Server-only (usa `crypto`).
export function cookieAccesoEvento(eventoId: string): string {
return `acceso_evento_${eventoId}`;
}
export function tokenParaCodigo(eventoId: string, codigo: string): string {
return createHash("sha256").update(`${eventoId}:${codigo.trim().toUpperCase()}`).digest("hex");
}
