import { Alumno } from '../types';

export interface SeccionEscolar {
  id: string;
  sala: string;
  turno: 'Mañana' | 'Tarde' | 'Jornada Extendida';
  division: string;
  nombreCompleto: string;
  totalAlumnos: number;
}

export const SECCIONES_INICIAL_2026: SeccionEscolar[] = [
  {
    id: 's3-tm',
    sala: 'Sala 3 años',
    turno: 'Mañana',
    division: 'A (TM)',
    nombreCompleto: 'Sala 3 TM 2026',
    totalAlumnos: 22,
  },
  {
    id: 's3-tt',
    sala: 'Sala 3 años',
    turno: 'Tarde',
    division: 'B (TT)',
    nombreCompleto: 'Sala 3 TT 2026',
    totalAlumnos: 16,
  },
  {
    id: 's3-je',
    sala: 'Sala 3 años',
    turno: 'Jornada Extendida',
    division: 'Jornada Extendida',
    nombreCompleto: 'Sala 3 años - Jornada Extendida',
    totalAlumnos: 11,
  },
  {
    id: 's4-a',
    sala: 'Sala 4 años',
    turno: 'Mañana',
    division: 'A',
    nombreCompleto: 'Sala 4 A 2026',
    totalAlumnos: 21,
  },
  {
    id: 's4-tt',
    sala: 'Sala 4 años',
    turno: 'Tarde',
    division: 'B (TT)',
    nombreCompleto: 'Sala 4 TT 2026',
    totalAlumnos: 17,
  },
  {
    id: 's4-c',
    sala: 'Sala 4 años',
    turno: 'Tarde',
    division: 'C',
    nombreCompleto: 'Sala 4 C 2026',
    totalAlumnos: 19,
  },
  {
    id: 's4-je',
    sala: 'Sala 4 años',
    turno: 'Jornada Extendida',
    division: 'Jornada Extendida',
    nombreCompleto: 'Sala 4 años - Jornada Extendida',
    totalAlumnos: 22,
  },
  {
    id: 's5-a',
    sala: 'Sala 5 años',
    turno: 'Mañana',
    division: 'A',
    nombreCompleto: 'Sala 5 A 2026',
    totalAlumnos: 20,
  },
  {
    id: 's5-b-tt',
    sala: 'Sala 5 años',
    turno: 'Tarde',
    division: 'B (TT)',
    nombreCompleto: 'Sala 5 B TT 2026',
    totalAlumnos: 19,
  },
  {
    id: 's5-c',
    sala: 'Sala 5 años',
    turno: 'Tarde',
    division: 'C',
    nombreCompleto: 'Sala 5 C 2026',
    totalAlumnos: 19,
  },
  {
    id: 's5-je',
    sala: 'Sala 5 años',
    turno: 'Jornada Extendida',
    division: 'Jornada Extendida',
    nombreCompleto: 'Sala 5 años - Jornada Extendida',
    totalAlumnos: 25,
  },
];

export const ALUMNOS_NOMINA_2026: Alumno[] = [
  // ==========================================
  // SALA 3 TM 2026 (22 alumnos)
  // ==========================================
  { id: 'alu-3tm-01', nombre: 'Agustín', apellido: 'Abba Fazio', grado: 'Sala 3 años', turno: 'Mañana', division: 'A (TM)', estado: 'pendiente' },
  { id: 'alu-3tm-02', nombre: 'Lautaro', apellido: 'Abellá', grado: 'Sala 3 años', turno: 'Mañana', division: 'A (TM)', estado: 'pendiente' },
  { id: 'alu-3tm-03', nombre: 'Teo', apellido: 'Astrada Henrichson', grado: 'Sala 3 años', turno: 'Mañana', division: 'A (TM)', estado: 'pendiente' },
  { id: 'alu-3tm-04', nombre: 'Bruna', apellido: 'Ballesteros Vendler', grado: 'Sala 3 años', turno: 'Mañana', division: 'A (TM)', estado: 'pendiente' },
  { id: 'alu-3tm-05', nombre: 'Olivia', apellido: 'Barzaghi', grado: 'Sala 3 años', turno: 'Mañana', division: 'A (TM)', estado: 'pendiente' },
  { id: 'alu-3tm-06', nombre: 'Ana', apellido: 'Carniglia Cavaliere', grado: 'Sala 3 años', turno: 'Mañana', division: 'A (TM)', estado: 'pendiente' },
  { id: 'alu-3tm-07', nombre: 'Milo', apellido: 'Castro', grado: 'Sala 3 años', turno: 'Mañana', division: 'A (TM)', estado: 'pendiente' },
  { id: 'alu-3tm-08', nombre: 'Tomás', apellido: 'De Oliveira Leme', grado: 'Sala 3 años', turno: 'Mañana', division: 'A (TM)', estado: 'pendiente' },
  { id: 'alu-3tm-09', nombre: 'Vito', apellido: 'Duhau', grado: 'Sala 3 años', turno: 'Mañana', division: 'A (TM)', estado: 'pendiente' },
  { id: 'alu-3tm-10', nombre: 'Martín', apellido: 'Gaya', grado: 'Sala 3 años', turno: 'Mañana', division: 'A (TM)', estado: 'pendiente' },
  { id: 'alu-3tm-11', nombre: 'Federico', apellido: 'Gherardi', grado: 'Sala 3 años', turno: 'Mañana', division: 'A (TM)', estado: 'pendiente' },
  { id: 'alu-3tm-12', nombre: 'Catalina', apellido: 'Gimenez', grado: 'Sala 3 años', turno: 'Mañana', division: 'A (TM)', estado: 'pendiente' },
  { id: 'alu-3tm-13', nombre: 'María Paz', apellido: 'Guevara', grado: 'Sala 3 años', turno: 'Mañana', division: 'A (TM)', estado: 'pendiente' },
  { id: 'alu-3tm-14', nombre: 'Ciro', apellido: 'Lagomarsino Sobrero', grado: 'Sala 3 años', turno: 'Mañana', division: 'A (TM)', estado: 'pendiente' },
  { id: 'alu-3tm-15', nombre: 'Isabella', apellido: 'Ramirez Ayala', grado: 'Sala 3 años', turno: 'Mañana', division: 'A (TM)', estado: 'pendiente' },
  { id: 'alu-3tm-16', nombre: 'Tomás', apellido: 'Rodriguez Burgos', grado: 'Sala 3 años', turno: 'Mañana', division: 'A (TM)', estado: 'pendiente' },
  { id: 'alu-3tm-17', nombre: 'Juana', apellido: 'Rojas Sack', grado: 'Sala 3 años', turno: 'Mañana', division: 'A (TM)', estado: 'pendiente' },
  { id: 'alu-3tm-18', nombre: 'Borja', apellido: 'Romero', grado: 'Sala 3 años', turno: 'Mañana', division: 'A (TM)', estado: 'pendiente' },
  { id: 'alu-3tm-19', nombre: 'Helena', apellido: 'San Martin', grado: 'Sala 3 años', turno: 'Mañana', division: 'A (TM)', estado: 'pendiente' },
  { id: 'alu-3tm-20', nombre: 'Lorenzo Lionel', apellido: 'Tacchini', grado: 'Sala 3 años', turno: 'Mañana', division: 'A (TM)', estado: 'pendiente' },
  { id: 'alu-3tm-21', nombre: 'Luca Amadeo', apellido: 'Torres', grado: 'Sala 3 años', turno: 'Mañana', division: 'A (TM)', estado: 'pendiente' },
  { id: 'alu-3tm-22', nombre: 'Polo Salvador', apellido: 'Viana', grado: 'Sala 3 años', turno: 'Mañana', division: 'A (TM)', estado: 'pendiente' },

  // ==========================================
  // SALA 3 TT 2026 (16 alumnos)
  // ==========================================
  { id: 'alu-3tt-01', nombre: 'Astien', apellido: 'Arrighi Lopez', grado: 'Sala 3 años', turno: 'Tarde', division: 'B (TT)', estado: 'pendiente' },
  { id: 'alu-3tt-02', nombre: 'Helena', apellido: 'Casanovas', grado: 'Sala 3 años', turno: 'Tarde', division: 'B (TT)', estado: 'pendiente' },
  { id: 'alu-3tt-03', nombre: 'Arya Pilar', apellido: 'Castellanos Escobar', grado: 'Sala 3 años', turno: 'Tarde', division: 'B (TT)', estado: 'pendiente' },
  { id: 'alu-3tt-04', nombre: 'Fausto', apellido: 'Fernandez', grado: 'Sala 3 años', turno: 'Tarde', division: 'B (TT)', estado: 'pendiente' },
  { id: 'alu-3tt-05', nombre: 'Arianna', apellido: 'Galliussi', grado: 'Sala 3 años', turno: 'Tarde', division: 'B (TT)', estado: 'pendiente' },
  { id: 'alu-3tt-06', nombre: 'Luna', apellido: 'García Goliero', grado: 'Sala 3 años', turno: 'Tarde', division: 'B (TT)', estado: 'pendiente' },
  { id: 'alu-3tt-07', nombre: 'Santino', apellido: 'Lopez Ballesteros', grado: 'Sala 3 años', turno: 'Tarde', division: 'B (TT)', estado: 'pendiente' },
  { id: 'alu-3tt-08', nombre: 'Bruna', apellido: 'Maciel Salinas', grado: 'Sala 3 años', turno: 'Tarde', division: 'B (TT)', estado: 'pendiente' },
  { id: 'alu-3tt-09', nombre: 'Gianna Vittoria', apellido: 'Marta', grado: 'Sala 3 años', turno: 'Tarde', division: 'B (TT)', estado: 'pendiente' },
  { id: 'alu-3tt-10', nombre: 'Oliver Pablo', apellido: 'Moran Hernandez', grado: 'Sala 3 años', turno: 'Tarde', division: 'B (TT)', estado: 'pendiente' },
  { id: 'alu-3tt-11', nombre: 'Julia', apellido: 'Ortiz Tolosa', grado: 'Sala 3 años', turno: 'Tarde', division: 'B (TT)', estado: 'pendiente' },
  { id: 'alu-3tt-12', nombre: 'Juan Ignacio', apellido: 'Requelme', grado: 'Sala 3 años', turno: 'Tarde', division: 'B (TT)', estado: 'pendiente' },
  { id: 'alu-3tt-13', nombre: 'Faustina', apellido: 'Rodriguez Maynard', grado: 'Sala 3 años', turno: 'Tarde', division: 'B (TT)', estado: 'pendiente' },
  { id: 'alu-3tt-14', nombre: 'Juliana', apellido: 'Sacchi', grado: 'Sala 3 años', turno: 'Tarde', division: 'B (TT)', estado: 'pendiente' },
  { id: 'alu-3tt-15', nombre: 'Romeo', apellido: 'Serfas', grado: 'Sala 3 años', turno: 'Tarde', division: 'B (TT)', estado: 'pendiente' },
  { id: 'alu-3tt-16', nombre: 'María Jazmín', apellido: 'Suarez', grado: 'Sala 3 años', turno: 'Tarde', division: 'B (TT)', estado: 'pendiente' },

  // ==========================================
  // SALA 3 - JORNADA EXTENDIDA (11 alumnos)
  // ==========================================
  { id: 'alu-3je-01', nombre: 'Agustín', apellido: 'Abba Fazio', grado: 'Sala 3 años', turno: 'Jornada Extendida', division: 'Jornada Extendida', estado: 'pendiente' },
  { id: 'alu-3je-02', nombre: 'Lautaro', apellido: 'Abella', grado: 'Sala 3 años', turno: 'Jornada Extendida', division: 'Jornada Extendida', estado: 'pendiente' },
  { id: 'alu-3je-03', nombre: 'Bruna', apellido: 'Ballesteros Vendler', grado: 'Sala 3 años', turno: 'Jornada Extendida', division: 'Jornada Extendida', estado: 'pendiente' },
  { id: 'alu-3je-04', nombre: 'Olivia', apellido: 'Barzagui', grado: 'Sala 3 años', turno: 'Jornada Extendida', division: 'Jornada Extendida', estado: 'pendiente' },
  { id: 'alu-3je-05', nombre: 'Ana', apellido: 'Carniglia Cavaliere', grado: 'Sala 3 años', turno: 'Jornada Extendida', division: 'Jornada Extendida', estado: 'pendiente' },
  { id: 'alu-3je-06', nombre: 'Vito', apellido: 'Duhau', grado: 'Sala 3 años', turno: 'Jornada Extendida', division: 'Jornada Extendida', estado: 'pendiente' },
  { id: 'alu-3je-07', nombre: 'Martín', apellido: 'Gaya', grado: 'Sala 3 años', turno: 'Jornada Extendida', division: 'Jornada Extendida', estado: 'pendiente' },
  { id: 'alu-3je-08', nombre: 'María Paz', apellido: 'Guevara', grado: 'Sala 3 años', turno: 'Jornada Extendida', division: 'Jornada Extendida', estado: 'pendiente' },
  { id: 'alu-3je-09', nombre: 'Juana', apellido: 'Rojas Sack', grado: 'Sala 3 años', turno: 'Jornada Extendida', division: 'Jornada Extendida', estado: 'pendiente' },
  { id: 'alu-3je-10', nombre: 'Borja', apellido: 'Romero', grado: 'Sala 3 años', turno: 'Jornada Extendida', division: 'Jornada Extendida', estado: 'pendiente' },
  { id: 'alu-3je-11', nombre: 'Polo', apellido: 'Viana', grado: 'Sala 3 años', turno: 'Jornada Extendida', division: 'Jornada Extendida', estado: 'pendiente' },

  // ==========================================
  // SALA 4 A 2026 (21 alumnos)
  // ==========================================
  { id: 'alu-4a-01', nombre: 'Niza', apellido: 'Arbelo', grado: 'Sala 4 años', turno: 'Mañana', division: 'A', estado: 'pendiente' },
  { id: 'alu-4a-02', nombre: 'Vicente', apellido: 'Arguello Terre', grado: 'Sala 4 años', turno: 'Mañana', division: 'A', estado: 'pendiente' },
  { id: 'alu-4a-03', nombre: 'Faustino', apellido: 'Avejera', grado: 'Sala 4 años', turno: 'Mañana', division: 'A', estado: 'pendiente' },
  { id: 'alu-4a-04', nombre: 'Emilio', apellido: 'Barboza Burnet', grado: 'Sala 4 años', turno: 'Mañana', division: 'A', estado: 'pendiente' },
  { id: 'alu-4a-05', nombre: 'Gema', apellido: 'Bertoldo', grado: 'Sala 4 años', turno: 'Mañana', division: 'A', estado: 'pendiente' },
  { id: 'alu-4a-06', nombre: 'Matheo Damián', apellido: 'Bertone Leiva', grado: 'Sala 4 años', turno: 'Mañana', division: 'A', estado: 'pendiente' },
  { id: 'alu-4a-07', nombre: 'Baltazar', apellido: 'Boroski', grado: 'Sala 4 años', turno: 'Mañana', division: 'A', estado: 'pendiente' },
  { id: 'alu-4a-08', nombre: 'Ramona', apellido: 'Charalambous Garcia', grado: 'Sala 4 años', turno: 'Mañana', division: 'A', estado: 'pendiente' },
  { id: 'alu-4a-09', nombre: 'Emma', apellido: 'Codaro', grado: 'Sala 4 años', turno: 'Mañana', division: 'A', estado: 'pendiente' },
  { id: 'alu-4a-10', nombre: 'Adela', apellido: 'Gauto', grado: 'Sala 4 años', turno: 'Mañana', division: 'A', estado: 'pendiente' },
  { id: 'alu-4a-11', nombre: 'Martina', apellido: 'Gomez Menti', grado: 'Sala 4 años', turno: 'Mañana', division: 'A', estado: 'pendiente' },
  { id: 'alu-4a-12', nombre: 'Camilo', apellido: 'Guevara', grado: 'Sala 4 años', turno: 'Mañana', division: 'A', estado: 'pendiente' },
  { id: 'alu-4a-13', nombre: 'Joaquín Ezequiel', apellido: 'Hoffmann', grado: 'Sala 4 años', turno: 'Mañana', division: 'A', estado: 'pendiente' },
  { id: 'alu-4a-14', nombre: 'Mateo', apellido: 'Ispizúa', grado: 'Sala 4 años', turno: 'Mañana', division: 'A', estado: 'pendiente' },
  { id: 'alu-4a-15', nombre: 'Álvaro', apellido: 'Juhal', grado: 'Sala 4 años', turno: 'Mañana', division: 'A', estado: 'pendiente' },
  { id: 'alu-4a-16', nombre: 'Trinidad', apellido: 'Maesa', grado: 'Sala 4 años', turno: 'Mañana', division: 'A', estado: 'pendiente' },
  { id: 'alu-4a-17', nombre: 'Martina', apellido: 'Poloni', grado: 'Sala 4 años', turno: 'Mañana', division: 'A', estado: 'pendiente' },
  { id: 'alu-4a-18', nombre: 'Josefina', apellido: 'Rossi', grado: 'Sala 4 años', turno: 'Mañana', division: 'A', estado: 'pendiente' },
  { id: 'alu-4a-19', nombre: 'Giuliana', apellido: 'Serraiocco Arce', grado: 'Sala 4 años', turno: 'Mañana', division: 'A', estado: 'pendiente' },
  { id: 'alu-4a-20', nombre: 'Julieta', apellido: 'Videla', grado: 'Sala 4 años', turno: 'Mañana', division: 'A', estado: 'pendiente' },
  { id: 'alu-4a-21', nombre: 'Viggo León', apellido: 'Weschenfeller', grado: 'Sala 4 años', turno: 'Mañana', division: 'A', estado: 'pendiente' },

  // ==========================================
  // SALA 4 TT 2026 (17 alumnos)
  // ==========================================
  { id: 'alu-4tt-01', nombre: 'Josefina', apellido: 'Altamirano', grado: 'Sala 4 años', turno: 'Tarde', division: 'B (TT)', estado: 'pendiente' },
  { id: 'alu-4tt-02', nombre: 'Juana Valentina', apellido: 'Delgado', grado: 'Sala 4 años', turno: 'Tarde', division: 'B (TT)', estado: 'pendiente' },
  { id: 'alu-4tt-03', nombre: 'Irache', apellido: 'Diaz Fischer', grado: 'Sala 4 años', turno: 'Tarde', division: 'B (TT)', estado: 'pendiente' },
  { id: 'alu-4tt-04', nombre: 'Benicio', apellido: 'Duhau', grado: 'Sala 4 años', turno: 'Tarde', division: 'B (TT)', estado: 'pendiente' },
  { id: 'alu-4tt-05', nombre: 'Adeline Magalí', apellido: 'Flores Ortigoza', grado: 'Sala 4 años', turno: 'Tarde', division: 'B (TT)', estado: 'pendiente' },
  { id: 'alu-4tt-06', nombre: 'Valentino', apellido: 'Garnica', grado: 'Sala 4 años', turno: 'Tarde', division: 'B (TT)', estado: 'pendiente' },
  { id: 'alu-4tt-07', nombre: 'Agustín Facundo', apellido: 'Guiñazú', grado: 'Sala 4 años', turno: 'Tarde', division: 'B (TT)', estado: 'pendiente' },
  { id: 'alu-4tt-08', nombre: 'Joaquín', apellido: 'Hauret Zamparutti', grado: 'Sala 4 años', turno: 'Tarde', division: 'B (TT)', estado: 'pendiente' },
  { id: 'alu-4tt-09', nombre: 'Rebeca Agnes', apellido: 'Lescano Wagner', grado: 'Sala 4 años', turno: 'Tarde', division: 'B (TT)', estado: 'pendiente' },
  { id: 'alu-4tt-10', nombre: 'Augusto Tomás', apellido: 'Montero', grado: 'Sala 4 años', turno: 'Tarde', division: 'B (TT)', estado: 'pendiente' },
  { id: 'alu-4tt-11', nombre: 'Bianca Rossella', apellido: 'Petracci', grado: 'Sala 4 años', turno: 'Tarde', division: 'B (TT)', estado: 'pendiente' },
  { id: 'alu-4tt-12', nombre: 'Valentina', apellido: 'Rotela', grado: 'Sala 4 años', turno: 'Tarde', division: 'B (TT)', estado: 'pendiente' },
  { id: 'alu-4tt-13', nombre: 'Camila', apellido: 'Ruiz Diaz Machado', grado: 'Sala 4 años', turno: 'Tarde', division: 'B (TT)', estado: 'pendiente' },
  { id: 'alu-4tt-14', nombre: 'Catalina', apellido: 'Ruiz Diaz Machado', grado: 'Sala 4 años', turno: 'Tarde', division: 'B (TT)', estado: 'pendiente' },
  { id: 'alu-4tt-15', nombre: 'Lionel', apellido: 'Sanchez', grado: 'Sala 4 años', turno: 'Tarde', division: 'B (TT)', estado: 'pendiente' },
  { id: 'alu-4tt-16', nombre: 'Mia Luján', apellido: 'Toledo', grado: 'Sala 4 años', turno: 'Tarde', division: 'B (TT)', estado: 'pendiente' },
  { id: 'alu-4tt-17', nombre: 'Luca', apellido: 'Torres Patiño', grado: 'Sala 4 años', turno: 'Tarde', division: 'B (TT)', estado: 'pendiente' },

  // ==========================================
  // SALA 4 C 2026 (19 alumnos)
  // ==========================================
  { id: 'alu-4c-01', nombre: 'Ianna', apellido: 'Arbelo', grado: 'Sala 4 años', turno: 'Tarde', division: 'C', estado: 'pendiente' },
  { id: 'alu-4c-02', nombre: 'Salvador', apellido: 'Beretta', grado: 'Sala 4 años', turno: 'Tarde', division: 'C', estado: 'pendiente' },
  { id: 'alu-4c-03', nombre: 'Martina', apellido: 'Caceres', grado: 'Sala 4 años', turno: 'Tarde', division: 'C', estado: 'pendiente' },
  { id: 'alu-4c-04', nombre: 'Félix', apellido: 'Castellano', grado: 'Sala 4 años', turno: 'Tarde', division: 'C', estado: 'pendiente' },
  { id: 'alu-4c-05', nombre: 'Borja', apellido: 'Ceballos', grado: 'Sala 4 años', turno: 'Tarde', division: 'C', estado: 'pendiente' },
  { id: 'alu-4c-06', nombre: 'Lucía', apellido: 'Codaro', grado: 'Sala 4 años', turno: 'Tarde', division: 'C', estado: 'pendiente' },
  { id: 'alu-4c-07', nombre: 'Mateo', apellido: 'Corvalan', grado: 'Sala 4 años', turno: 'Tarde', division: 'C', estado: 'pendiente' },
  { id: 'alu-4c-08', nombre: 'Mateo', apellido: 'De Olazabal de Fortuny', grado: 'Sala 4 años', turno: 'Tarde', division: 'C', estado: 'pendiente' },
  { id: 'alu-4c-09', nombre: 'Ambar', apellido: 'Gimenez', grado: 'Sala 4 años', turno: 'Tarde', division: 'C', estado: 'pendiente' },
  { id: 'alu-4c-10', nombre: 'Tomás', apellido: 'Hernando Paludi', grado: 'Sala 4 años', turno: 'Tarde', division: 'C', estado: 'pendiente' },
  { id: 'alu-4c-11', nombre: 'Milo', apellido: 'Hykalik', grado: 'Sala 4 años', turno: 'Tarde', division: 'C', estado: 'pendiente' },
  { id: 'alu-4c-12', nombre: 'Margarita', apellido: 'Marchesani', grado: 'Sala 4 años', turno: 'Tarde', division: 'C', estado: 'pendiente' },
  { id: 'alu-4c-13', nombre: 'Morena Paz', apellido: 'Masluj Molina', grado: 'Sala 4 años', turno: 'Tarde', division: 'C', estado: 'pendiente' },
  { id: 'alu-4c-14', nombre: 'Regina', apellido: 'Monacci', grado: 'Sala 4 años', turno: 'Tarde', division: 'C', estado: 'pendiente' },
  { id: 'alu-4c-15', nombre: 'Tomás Ezequiel', apellido: 'Pellegrini', grado: 'Sala 4 años', turno: 'Tarde', division: 'C', estado: 'pendiente' },
  { id: 'alu-4c-16', nombre: 'Francesca', apellido: 'Ribba', grado: 'Sala 4 años', turno: 'Tarde', division: 'C', estado: 'pendiente' },
  { id: 'alu-4c-17', nombre: 'Agostina', apellido: 'Staravijosky', grado: 'Sala 4 años', turno: 'Tarde', division: 'C', estado: 'pendiente' },
  { id: 'alu-4c-18', nombre: 'Tomás', apellido: 'Techeira', grado: 'Sala 4 años', turno: 'Tarde', division: 'C', estado: 'pendiente' },
  { id: 'alu-4c-19', nombre: 'Xander Elián', apellido: 'Villamizar Sereno', grado: 'Sala 4 años', turno: 'Tarde', division: 'C', estado: 'pendiente' },

  // ==========================================
  // SALA 4 - JORNADA EXTENDIDA (22 alumnos)
  // ==========================================
  { id: 'alu-4je-01', nombre: 'Ianna', apellido: 'Arbelo', grado: 'Sala 4 años', turno: 'Jornada Extendida', division: 'Jornada Extendida', estado: 'pendiente' },
  { id: 'alu-4je-02', nombre: 'Niza', apellido: 'Arbelo', grado: 'Sala 4 años', turno: 'Jornada Extendida', division: 'Jornada Extendida', estado: 'pendiente' },
  { id: 'alu-4je-03', nombre: 'Vicente', apellido: 'Arguello Terre', grado: 'Sala 4 años', turno: 'Jornada Extendida', division: 'Jornada Extendida', estado: 'pendiente' },
  { id: 'alu-4je-04', nombre: 'Baltazar', apellido: 'Boroski', grado: 'Sala 4 años', turno: 'Jornada Extendida', division: 'Jornada Extendida', estado: 'pendiente' },
  { id: 'alu-4je-05', nombre: 'Félix', apellido: 'Castellano', grado: 'Sala 4 años', turno: 'Jornada Extendida', division: 'Jornada Extendida', estado: 'pendiente' },
  { id: 'alu-4je-06', nombre: 'Ramona', apellido: 'Charalambous García', grado: 'Sala 4 años', turno: 'Jornada Extendida', division: 'Jornada Extendida', estado: 'pendiente' },
  { id: 'alu-4je-07', nombre: 'Mateo', apellido: 'Corvalán', grado: 'Sala 4 años', turno: 'Jornada Extendida', division: 'Jornada Extendida', estado: 'pendiente' },
  { id: 'alu-4je-08', nombre: 'Adela', apellido: 'Gauto', grado: 'Sala 4 años', turno: 'Jornada Extendida', division: 'Jornada Extendida', estado: 'pendiente' },
  { id: 'alu-4je-09', nombre: 'Camilo', apellido: 'Guevara', grado: 'Sala 4 años', turno: 'Jornada Extendida', division: 'Jornada Extendida', estado: 'pendiente' },
  { id: 'alu-4je-10', nombre: 'Milo', apellido: 'Hykalik', grado: 'Sala 4 años', turno: 'Jornada Extendida', division: 'Jornada Extendida', estado: 'pendiente' },
  { id: 'alu-4je-11', nombre: 'Mateo', apellido: 'Ispizúa', grado: 'Sala 4 años', turno: 'Jornada Extendida', division: 'Jornada Extendida', estado: 'pendiente' },
  { id: 'alu-4je-12', nombre: 'Álvaro', apellido: 'Juhal', grado: 'Sala 4 años', turno: 'Jornada Extendida', division: 'Jornada Extendida', estado: 'pendiente' },
  { id: 'alu-4je-13', nombre: 'Trinidad', apellido: 'Maesa', grado: 'Sala 4 años', turno: 'Jornada Extendida', division: 'Jornada Extendida', estado: 'pendiente' },
  { id: 'alu-4je-14', nombre: 'Margarita', apellido: 'Marchesani', grado: 'Sala 4 años', turno: 'Jornada Extendida', division: 'Jornada Extendida', estado: 'pendiente' },
  { id: 'alu-4je-15', nombre: 'Morena Paz', apellido: 'Masluj Molina', grado: 'Sala 4 años', turno: 'Jornada Extendida', division: 'Jornada Extendida', estado: 'pendiente' },
  { id: 'alu-4je-16', nombre: 'Regina', apellido: 'Monacci', grado: 'Sala 4 años', turno: 'Jornada Extendida', division: 'Jornada Extendida', estado: 'pendiente' },
  { id: 'alu-4je-17', nombre: 'Martina', apellido: 'Poloni', grado: 'Sala 4 años', turno: 'Jornada Extendida', division: 'Jornada Extendida', estado: 'pendiente' },
  { id: 'alu-4je-18', nombre: 'Josefina', apellido: 'Rossi', grado: 'Sala 4 años', turno: 'Jornada Extendida', division: 'Jornada Extendida', estado: 'pendiente' },
  { id: 'alu-4je-19', nombre: 'Julieta', apellido: 'Videla', grado: 'Sala 4 años', turno: 'Jornada Extendida', division: 'Jornada Extendida', estado: 'pendiente' },
  { id: 'alu-4je-20', nombre: 'Viggo León', apellido: 'Weschenfeller', grado: 'Sala 4 años', turno: 'Jornada Extendida', division: 'Jornada Extendida', estado: 'pendiente' },
  { id: 'alu-4je-21', nombre: 'Agostina', apellido: 'Staravijosky', grado: 'Sala 4 años', turno: 'Jornada Extendida', division: 'Jornada Extendida', estado: 'pendiente' },
  { id: 'alu-4je-22', nombre: 'Salvador', apellido: 'Beretta', grado: 'Sala 4 años', turno: 'Jornada Extendida', division: 'Jornada Extendida', estado: 'pendiente' },

  // ==========================================
  // SALA 5 A 2026 (20 alumnos)
  // ==========================================
  { id: 'alu-5a-01', nombre: 'Justina Lucía', apellido: 'Amigo', grado: 'Sala 5 años', turno: 'Mañana', division: 'A', estado: 'pendiente' },
  { id: 'alu-5a-02', nombre: 'Lucía', apellido: 'Andorno', grado: 'Sala 5 años', turno: 'Mañana', division: 'A', estado: 'pendiente' },
  { id: 'alu-5a-03', nombre: 'Bautista Enzo', apellido: 'Claus', grado: 'Sala 5 años', turno: 'Mañana', division: 'A', estado: 'pendiente' },
  { id: 'alu-5a-04', nombre: 'Lucas', apellido: 'Cordone', grado: 'Sala 5 años', turno: 'Mañana', division: 'A', estado: 'pendiente' },
  { id: 'alu-5a-05', nombre: 'Mercedes Inés', apellido: 'Gomez', grado: 'Sala 5 años', turno: 'Mañana', division: 'A', estado: 'pendiente' },
  { id: 'alu-5a-06', nombre: 'Isidro', apellido: 'Gorini Litardo', grado: 'Sala 5 años', turno: 'Mañana', division: 'A', estado: 'pendiente' },
  { id: 'alu-5a-07', nombre: 'Rafael', apellido: 'Gramajo', grado: 'Sala 5 años', turno: 'Mañana', division: 'A', estado: 'pendiente' },
  { id: 'alu-5a-08', nombre: 'Julieta Amanda', apellido: 'Insua Ponce', grado: 'Sala 5 años', turno: 'Mañana', division: 'A', estado: 'pendiente' },
  { id: 'alu-5a-09', nombre: 'Ciro', apellido: 'Irrazabal Burzo', grado: 'Sala 5 años', turno: 'Mañana', division: 'A', estado: 'pendiente' },
  { id: 'alu-5a-10', nombre: 'Benjamín', apellido: 'Jovino', grado: 'Sala 5 años', turno: 'Mañana', division: 'A', estado: 'pendiente' },
  { id: 'alu-5a-11', nombre: 'Hilario', apellido: 'Lopez Fusero', grado: 'Sala 5 años', turno: 'Mañana', division: 'A', estado: 'pendiente' },
  { id: 'alu-5a-12', nombre: 'Francisco', apellido: 'Mammi Bonfiglio', grado: 'Sala 5 años', turno: 'Mañana', division: 'A', estado: 'pendiente' },
  { id: 'alu-5a-13', nombre: 'Fausto', apellido: 'Marin', grado: 'Sala 5 años', turno: 'Mañana', division: 'A', estado: 'pendiente' },
  { id: 'alu-5a-14', nombre: 'Ciro', apellido: 'Muñoz Mareco', grado: 'Sala 5 años', turno: 'Mañana', division: 'A', estado: 'pendiente' },
  { id: 'alu-5a-15', nombre: 'Agustín', apellido: 'Potes', grado: 'Sala 5 años', turno: 'Mañana', division: 'A', estado: 'pendiente' },
  { id: 'alu-5a-16', nombre: 'Sofía Pilar', apellido: 'Puebla', grado: 'Sala 5 años', turno: 'Mañana', division: 'A', estado: 'pendiente' },
  { id: 'alu-5a-17', nombre: 'Justina', apellido: 'Segovia Rivera', grado: 'Sala 5 años', turno: 'Mañana', division: 'A', estado: 'pendiente' },
  { id: 'alu-5a-18', nombre: 'Clementina', apellido: 'Toppazzini Rodriguez', grado: 'Sala 5 años', turno: 'Mañana', division: 'A', estado: 'pendiente' },
  { id: 'alu-5a-19', nombre: 'Juan Ignacio', apellido: 'Tornatore', grado: 'Sala 5 años', turno: 'Mañana', division: 'A', estado: 'pendiente' },
  { id: 'alu-5a-20', nombre: 'Rosario', apellido: 'Yadarola Pavan', grado: 'Sala 5 años', turno: 'Mañana', division: 'A', estado: 'pendiente' },

  // ==========================================
  // SALA 5 B TT 2026 (19 alumnos)
  // ==========================================
  { id: 'alu-5b-01', nombre: 'Roma', apellido: 'Arias', grado: 'Sala 5 años', turno: 'Tarde', division: 'B (TT)', estado: 'pendiente' },
  { id: 'alu-5b-02', nombre: 'Sofía', apellido: 'Ballerini', grado: 'Sala 5 años', turno: 'Tarde', division: 'B (TT)', estado: 'pendiente' },
  { id: 'alu-5b-03', nombre: 'Renato', apellido: 'Delgado', grado: 'Sala 5 años', turno: 'Tarde', division: 'B (TT)', estado: 'pendiente' },
  { id: 'alu-5b-04', nombre: 'Lupe', apellido: 'Diaz Bottani', grado: 'Sala 5 años', turno: 'Tarde', division: 'B (TT)', estado: 'pendiente' },
  { id: 'alu-5b-05', nombre: 'Donato', apellido: 'Ibarra', grado: 'Sala 5 años', turno: 'Tarde', division: 'B (TT)', estado: 'pendiente' },
  { id: 'alu-5b-06', nombre: 'Chloe Martina', apellido: 'Loredo', grado: 'Sala 5 años', turno: 'Tarde', division: 'B (TT)', estado: 'pendiente' },
  { id: 'alu-5b-07', nombre: 'Noah', apellido: 'Meneses', grado: 'Sala 5 años', turno: 'Tarde', division: 'B (TT)', estado: 'pendiente' },
  { id: 'alu-5b-08', nombre: 'Emilia', apellido: 'Morales', grado: 'Sala 5 años', turno: 'Tarde', division: 'B (TT)', estado: 'pendiente' },
  { id: 'alu-5b-09', nombre: 'Ambar Catalina', apellido: 'Moyano', grado: 'Sala 5 años', turno: 'Tarde', division: 'B (TT)', estado: 'pendiente' },
  { id: 'alu-5b-10', nombre: 'María Agostina', apellido: 'Peralta', grado: 'Sala 5 años', turno: 'Tarde', division: 'B (TT)', estado: 'pendiente' },
  { id: 'alu-5b-11', nombre: 'Amparo', apellido: 'Pittala Martinez', grado: 'Sala 5 años', turno: 'Tarde', division: 'B (TT)', estado: 'pendiente' },
  { id: 'alu-5b-12', nombre: 'Sofía', apellido: 'Rivas', grado: 'Sala 5 años', turno: 'Tarde', division: 'B (TT)', estado: 'pendiente' },
  { id: 'alu-5b-13', nombre: 'Bianca', apellido: 'Rodriguez', grado: 'Sala 5 años', turno: 'Tarde', division: 'B (TT)', estado: 'pendiente' },
  { id: 'alu-5b-14', nombre: 'Felipe Aarón', apellido: 'Roldan', grado: 'Sala 5 años', turno: 'Tarde', division: 'B (TT)', estado: 'pendiente' },
  { id: 'alu-5b-15', nombre: 'Olivia Ayelén', apellido: 'Sanchez', grado: 'Sala 5 años', turno: 'Tarde', division: 'B (TT)', estado: 'pendiente' },
  { id: 'alu-5b-16', nombre: 'Lorenzo', apellido: 'Torres', grado: 'Sala 5 años', turno: 'Tarde', division: 'B (TT)', estado: 'pendiente' },
  { id: 'alu-5b-17', nombre: 'Jana Regina', apellido: 'Vargas Martinez', grado: 'Sala 5 años', turno: 'Tarde', division: 'B (TT)', estado: 'pendiente' },
  { id: 'alu-5b-18', nombre: 'Paulina', apellido: 'Vazquez', grado: 'Sala 5 años', turno: 'Tarde', division: 'B (TT)', estado: 'pendiente' },
  { id: 'alu-5b-19', nombre: 'Maia Paz', apellido: 'Vegas', grado: 'Sala 5 años', turno: 'Tarde', division: 'B (TT)', estado: 'pendiente' },

  // ==========================================
  // SALA 5 C 2026 (19 alumnos)
  // ==========================================
  { id: 'alu-5c-01', nombre: 'Justina', apellido: 'Aquino', grado: 'Sala 5 años', turno: 'Tarde', division: 'C', estado: 'pendiente' },
  { id: 'alu-5c-02', nombre: 'Milán André', apellido: 'Baez Rubín', grado: 'Sala 5 años', turno: 'Tarde', division: 'C', estado: 'pendiente' },
  { id: 'alu-5c-03', nombre: 'Donato', apellido: 'Bravo', grado: 'Sala 5 años', turno: 'Tarde', division: 'C', estado: 'pendiente' },
  { id: 'alu-5c-04', nombre: 'Bautista', apellido: 'Britez', grado: 'Sala 5 años', turno: 'Tarde', division: 'C', estado: 'pendiente' },
  { id: 'alu-5c-05', nombre: 'Bastian', apellido: 'Castelli', grado: 'Sala 5 años', turno: 'Tarde', division: 'C', estado: 'pendiente' },
  { id: 'alu-5c-06', nombre: 'Paz', apellido: 'Cúneo Zúccaro', grado: 'Sala 5 años', turno: 'Tarde', division: 'C', estado: 'pendiente' },
  { id: 'alu-5c-07', nombre: 'Bianca Beatriz', apellido: 'Gavigagoxeascoa Bellome', grado: 'Sala 5 años', turno: 'Tarde', division: 'C', estado: 'pendiente' },
  { id: 'alu-5c-08', nombre: 'Alfonsina', apellido: 'Gonzalez Tabarez', grado: 'Sala 5 años', turno: 'Tarde', division: 'C', estado: 'pendiente' },
  { id: 'alu-5c-09', nombre: 'Ignacio Agustín', apellido: 'Ledesma', grado: 'Sala 5 años', turno: 'Tarde', division: 'C', estado: 'pendiente' },
  { id: 'alu-5c-10', nombre: 'Amelia Alison', apellido: 'Leiva Escobar', grado: 'Sala 5 años', turno: 'Tarde', division: 'C', estado: 'pendiente' },
  { id: 'alu-5c-11', nombre: 'Jade Helena', apellido: 'Maggi Ponce de León', grado: 'Sala 5 años', turno: 'Tarde', division: 'C', estado: 'pendiente' },
  { id: 'alu-5c-12', nombre: 'Emma Julieta', apellido: 'Martin Vigna', grado: 'Sala 5 años', turno: 'Tarde', division: 'C', estado: 'pendiente' },
  { id: 'alu-5c-13', nombre: 'Renata', apellido: 'Pellegrini Neme', grado: 'Sala 5 años', turno: 'Tarde', division: 'C', estado: 'pendiente' },
  { id: 'alu-5c-14', nombre: 'Gio Valentino', apellido: 'Porcu', grado: 'Sala 5 años', turno: 'Tarde', division: 'C', estado: 'pendiente' },
  { id: 'alu-5c-15', nombre: 'María Luján', apellido: 'Ravazzoli', grado: 'Sala 5 años', turno: 'Tarde', division: 'C', estado: 'pendiente' },
  { id: 'alu-5c-16', nombre: 'Felipe', apellido: 'Rodriguez Ortiz de Rozas', grado: 'Sala 5 años', turno: 'Tarde', division: 'C', estado: 'pendiente' },
  { id: 'alu-5c-17', nombre: 'Agustín', apellido: 'Rossi', grado: 'Sala 5 años', turno: 'Tarde', division: 'C', estado: 'pendiente' },
  { id: 'alu-5c-18', nombre: 'Jeremías', apellido: 'Trench', grado: 'Sala 5 años', turno: 'Tarde', division: 'C', estado: 'pendiente' },
  { id: 'alu-5c-19', nombre: 'Delfina', apellido: 'Unamuno', grado: 'Sala 5 años', turno: 'Tarde', division: 'C', estado: 'pendiente' },

  // ==========================================
  // SALA 5 - JORNADA EXTENDIDA (25 alumnos)
  // ==========================================
  { id: 'alu-5je-01', nombre: 'Milán Andre', apellido: 'Baez Rubin', grado: 'Sala 5 años', turno: 'Jornada Extendida', division: 'Jornada Extendida', estado: 'pendiente' },
  { id: 'alu-5je-02', nombre: 'Donato', apellido: 'Bravo', grado: 'Sala 5 años', turno: 'Jornada Extendida', division: 'Jornada Extendida', estado: 'pendiente' },
  { id: 'alu-5je-03', nombre: 'Bastian', apellido: 'Castelli', grado: 'Sala 5 años', turno: 'Jornada Extendida', division: 'Jornada Extendida', estado: 'pendiente' },
  { id: 'alu-5je-04', nombre: 'Paz', apellido: 'Cúneo Zúccaro', grado: 'Sala 5 años', turno: 'Jornada Extendida', division: 'Jornada Extendida', estado: 'pendiente' },
  { id: 'alu-5je-05', nombre: 'Alfonsina', apellido: 'Gonzalez Tabarez', grado: 'Sala 5 años', turno: 'Jornada Extendida', division: 'Jornada Extendida', estado: 'pendiente' },
  { id: 'alu-5je-06', nombre: 'Isidro', apellido: 'Gorini Litardo', grado: 'Sala 5 años', turno: 'Jornada Extendida', division: 'Jornada Extendida', estado: 'pendiente' },
  { id: 'alu-5je-07', nombre: 'Rafael', apellido: 'Gramajo', grado: 'Sala 5 años', turno: 'Jornada Extendida', division: 'Jornada Extendida', estado: 'pendiente' },
  { id: 'alu-5je-08', nombre: 'Julieta Amanda', apellido: 'Insua Ponce', grado: 'Sala 5 años', turno: 'Jornada Extendida', division: 'Jornada Extendida', estado: 'pendiente' },
  { id: 'alu-5je-09', nombre: 'Ciro', apellido: 'Irrazabal Burzo', grado: 'Sala 5 años', turno: 'Jornada Extendida', division: 'Jornada Extendida', estado: 'pendiente' },
  { id: 'alu-5je-10', nombre: 'Francisco', apellido: 'Mammi Bonfiglio', grado: 'Sala 5 años', turno: 'Jornada Extendida', division: 'Jornada Extendida', estado: 'pendiente' },
  { id: 'alu-5je-11', nombre: 'Fausto', apellido: 'Marin', grado: 'Sala 5 años', turno: 'Jornada Extendida', division: 'Jornada Extendida', estado: 'pendiente' },
  { id: 'alu-5je-12', nombre: 'Emma Julieta', apellido: 'Martin Vigna', grado: 'Sala 5 años', turno: 'Jornada Extendida', division: 'Jornada Extendida', estado: 'pendiente' },
  { id: 'alu-5je-13', nombre: 'Ciro', apellido: 'Muñoz Mareco', grado: 'Sala 5 años', turno: 'Jornada Extendida', division: 'Jornada Extendida', estado: 'pendiente' },
  { id: 'alu-5je-14', nombre: 'Renata', apellido: 'Pellegrini Neme', grado: 'Sala 5 años', turno: 'Jornada Extendida', division: 'Jornada Extendida', estado: 'pendiente' },
  { id: 'alu-5je-15', nombre: 'Gio Valentino', apellido: 'Porcu', grado: 'Sala 5 años', turno: 'Jornada Extendida', division: 'Jornada Extendida', estado: 'pendiente' },
  { id: 'alu-5je-16', nombre: 'Agustín', apellido: 'Potes', grado: 'Sala 5 años', turno: 'Jornada Extendida', division: 'Jornada Extendida', estado: 'pendiente' },
  { id: 'alu-5je-17', nombre: 'Sofía', apellido: 'Puebla', grado: 'Sala 5 años', turno: 'Jornada Extendida', division: 'Jornada Extendida', estado: 'pendiente' },
  { id: 'alu-5je-18', nombre: 'María Luján', apellido: 'Ravazzoli', grado: 'Sala 5 años', turno: 'Jornada Extendida', division: 'Jornada Extendida', estado: 'pendiente' },
  { id: 'alu-5je-19', nombre: 'Felipe', apellido: 'Rodriguez Ortiz de Rozas', grado: 'Sala 5 años', turno: 'Jornada Extendida', division: 'Jornada Extendida', estado: 'pendiente' },
  { id: 'alu-5je-20', nombre: 'Agustín', apellido: 'Rossi', grado: 'Sala 5 años', turno: 'Jornada Extendida', division: 'Jornada Extendida', estado: 'pendiente' },
  { id: 'alu-5je-21', nombre: 'Justina', apellido: 'Segovia Rivera', grado: 'Sala 5 años', turno: 'Jornada Extendida', division: 'Jornada Extendida', estado: 'pendiente' },
  { id: 'alu-5je-22', nombre: 'Clementina', apellido: 'Toppazzini Rodriguez', grado: 'Sala 5 años', turno: 'Jornada Extendida', division: 'Jornada Extendida', estado: 'pendiente' },
  { id: 'alu-5je-23', nombre: 'Juan Ignacio', apellido: 'Tornatore', grado: 'Sala 5 años', turno: 'Jornada Extendida', division: 'Jornada Extendida', estado: 'pendiente' },
  { id: 'alu-5je-24', nombre: 'Delfina', apellido: 'Unamuno', grado: 'Sala 5 años', turno: 'Jornada Extendida', division: 'Jornada Extendida', estado: 'pendiente' },
  { id: 'alu-5je-25', nombre: 'Rosario', apellido: 'Yadarola Pavan', grado: 'Sala 5 años', turno: 'Jornada Extendida', division: 'Jornada Extendida', estado: 'pendiente' },
];

/**
 * Retorna todos los alumnos con formato completo "Apellido, Nombre"
 */
export function getNombreCompleto(alumno: Alumno): string {
  if (alumno.apellido) {
    return `${alumno.apellido}, ${alumno.nombre}`;
  }
  return alumno.nombre;
}

/**
 * Búsqueda inteligente de alumnos por nombre, apellido, sala o división
 */
export function buscarAlumnos(query: string): Alumno[] {
  const q = query.trim().toLowerCase();
  if (!q) return ALUMNOS_NOMINA_2026;

  return ALUMNOS_NOMINA_2026.filter((a) => {
    const nombreCompleto = `${a.nombre} ${a.apellido || ''}`.toLowerCase();
    const apellidoNombre = `${a.apellido || ''} ${a.nombre}`.toLowerCase();
    const grado = (a.grado || '').toLowerCase();
    const division = (a.division || '').toLowerCase();
    const turno = (a.turno || '').toLowerCase();

    return (
      nombreCompleto.includes(q) ||
      apellidoNombre.includes(q) ||
      grado.includes(q) ||
      division.includes(q) ||
      turno.includes(q)
    );
  });
}
