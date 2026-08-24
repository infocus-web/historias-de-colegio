"use server";
import { cookies } from "next/headers";
import { supabase } from "@/lib/supabase";
import { cookieAccesoEvento, tokenParaCodigo } from "@/lib/eventoAcceso";
// Verifica el código de acceso que ingresó la familia contra el que tiene cargado
// el evento. Si es correcto, guarda una cookie (90 días) para que no tenga que
// volver a escribirlo cada vez que entre durante ese período.
export async function verificarCodigoEvento(eventoId: string, codigo: string) {
const { data: evento } = await supabase
.from("eventos")
.select("codigo_acceso")
.eq("id", eventoId)
.maybeSingle();
// Si el evento no tiene código configurado, no hay gate que pasar.
if (!evento?.codigo_acceso) {
return { ok: true };
}
const codigoIngresado = codigo.trim().toUpperCase();
const codigoReal = evento.codigo_acceso.trim().toUpperCase();
if (!codigoIngresado || codigoIngresado !== codigoReal) {
return { ok: false, error: "Código incorrecto. Revisá el mensaje que te mandó el colegio." };
}
const store = await cookies();
store.set(cookieAccesoEvento(eventoId), tokenParaCodigo(eventoId, codigoIngresado), {
httpOnly: true,
secure: true,
sameSite: "lax",
path: "/",
maxAge: 60 * 60 * 24 * 90, // 90 días
});
return { ok: true };
}
