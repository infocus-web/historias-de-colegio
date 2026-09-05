export interface InscripcionFamilia {
  id: string;
  padreNombre: string;       // Nombre y apellido del padre o madre / tutor
  telefonoWhatsApp: string;  // Número de teléfono de WhatsApp
  email: string;             // Correo electrónico
  alumnoNombre: string;      // Nombre del alumno
  alumnoApellido: string;    // Apellido del alumno
  turno: string;             // Turno (Mañana, Tarde, Jornada Completa)
  grado: string;             // Grado o Sala
  division: string;          // División
  colegioId: string;
  colegioNombre: string;
  fechaInscripcion: string;
}

const STORAGE_KEY_INSCRIPCIONES = 'infocus_familias_inscriptas_v1';
const STORAGE_KEY_ACTIVO = 'infocus_familia_activa_v1';

// Familias de ejemplo iniciales para que el sistema tenga registros de demostración
const INSCRIPCIONES_INICIALES: InscripcionFamilia[] = [
  {
    id: 'INS-2026-001',
    padreNombre: 'Mariana Gómez',
    telefonoWhatsApp: '11 5489-3210',
    email: 'mariana.gomez@gmail.com',
    alumnoNombre: 'Benjamín',
    alumnoApellido: 'Gómez',
    turno: 'Tarde',
    grado: 'Sala 5 años',
    division: 'Celeste',
    colegioId: 'col-inicial-2026',
    colegioNombre: 'Colegio San Martín de Tours (Nivel Inicial)',
    fechaInscripcion: '02/03/2026 10:15'
  },
  {
    id: 'INS-2026-002',
    padreNombre: 'Diego Benítez',
    telefonoWhatsApp: '11 2384-9912',
    email: 'diego.benitez@outlook.com',
    alumnoNombre: 'Mateo',
    alumnoApellido: 'Benítez',
    turno: 'Mañana',
    grado: 'Sala 4 años',
    division: 'Verde',
    colegioId: 'col-inicial-2026',
    colegioNombre: 'Colegio San Martín de Tours (Nivel Inicial)',
    fechaInscripcion: '03/03/2026 14:30'
  }
];

export function obtenerInscripciones(): InscripcionFamilia[] {
  if (typeof window === 'undefined') return INSCRIPCIONES_INICIALES;
  try {
    const raw = localStorage.getItem(STORAGE_KEY_INSCRIPCIONES);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY_INSCRIPCIONES, JSON.stringify(INSCRIPCIONES_INICIALES));
      return INSCRIPCIONES_INICIALES;
    }
    return JSON.parse(raw);
  } catch (err) {
    console.error('Error al leer inscripciones:', err);
    return INSCRIPCIONES_INICIALES;
  }
}

export function guardarInscripcion(
  datos: Omit<InscripcionFamilia, 'id' | 'fechaInscripcion'>
): InscripcionFamilia {
  const lista = obtenerInscripciones();
  const idNuevo = `INS-2026-${String(lista.length + 1).padStart(3, '0')}`;
  const now = new Date();
  const fechaStr = `${String(now.getDate()).padStart(2, '0')}/${String(now.getMonth() + 1).padStart(2, '0')}/${now.getFullYear()} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

  const nueva: InscripcionFamilia = {
    ...datos,
    id: idNuevo,
    fechaInscripcion: fechaStr
  };

  const actualizada = [nueva, ...lista];
  try {
    localStorage.setItem(STORAGE_KEY_INSCRIPCIONES, JSON.stringify(actualizada));
    guardarFamiliaActiva(nueva);
  } catch (err) {
    console.error('Error al guardar inscripción:', err);
  }

  return nueva;
}

export function obtenerFamiliaActiva(): InscripcionFamilia | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(STORAGE_KEY_ACTIVO);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function guardarFamiliaActiva(familia: InscripcionFamilia | null): void {
  if (typeof window === 'undefined') return;
  try {
    if (familia) {
      localStorage.setItem(STORAGE_KEY_ACTIVO, JSON.stringify(familia));
    } else {
      localStorage.removeItem(STORAGE_KEY_ACTIVO);
    }
  } catch (err) {
    console.error('Error al guardar familia activa:', err);
  }
}

export function cerrarSesionFamilia(): void {
  guardarFamiliaActiva(null);
}

export function buscarFamiliaPorContacto(query: string): InscripcionFamilia | undefined {
  if (!query || query.trim().length < 3) return undefined;
  const q = query.trim().toLowerCase().replace(/[\s-+()]/g, '');
  const lista = obtenerInscripciones();
  return lista.find((item) => {
    const emailMatch = item.email.toLowerCase().includes(query.trim().toLowerCase());
    const telClean = item.telefonoWhatsApp.replace(/[\s-+()]/g, '');
    const telMatch = telClean.includes(q) || q.includes(telClean);
    const alumnoMatch = `${item.alumnoNombre} ${item.alumnoApellido}`.toLowerCase().includes(query.trim().toLowerCase());
    const padreMatch = item.padreNombre.toLowerCase().includes(query.trim().toLowerCase());
    return emailMatch || telMatch || alumnoMatch || padreMatch;
  });
}
