// Catálogo único de grados, divisiones y turnos, compartido entre el formulario de alta de
// la familia (app/c/[slug]/Flow.tsx) y el panel de carga de fotos (app/admin/fotos). Que
// ambos lados usen exactamente las mismas strings es lo que hace que una foto asignada a un
// curso en el panel le llegue después a la familia correcta: si un lado dijera "Mañana" y el
// otro "mañana", el match fallaría en silencio.
export const GRADOS_PRIMARIA = [
  "Jardín",
  "1° grado",
  "2° grado",
  "3° grado",
  "4° grado",
  "5° grado",
  "6° grado",
  "7° grado",
];

export const GRADOS_SECUNDARIA = ["1° año", "2° año", "3° año", "4° año", "5° año", "6° año"];

export const TURNOS = ["Mañana", "Tarde", "Jornada completa"];
