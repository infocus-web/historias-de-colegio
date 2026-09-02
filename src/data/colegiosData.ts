import { Colegio, KitProducto, Foto } from '../types';

export const KITS_DISPONIBLES: KitProducto[] = [
  {
    id: 'kit-clasico',
    nombre: 'Kit Impreso + Digital',
    subtitulo: 'Las 3 fotos impresas, con la carpeta',
    tagline: 'Foto grupal 20x30cm + 2 fotos 15x21cm + carpeta exclusiva y descarga HD de regalo',
    precio: 30000,
    popular: true,
    cooperadoraAporte: 6000,
    icono: 'Camera',
    incluye: [
      '1 fotografía grupal en formato ampliado 20x30cm',
      '2 fotografías 15x21cm (individual y con docente)',
      '1 carpeta de presentación con diseño exclusivo',
      '🎁 Descarga en alta resolución (HD) de regalo',
      'Acceso directo por link + código QR y copia por email',
      'Entrega en sobre cerrado individual en el colegio',
      '🎓 Aporte de $6.000 (20%) para la cooperadora del colegio',
    ],
    fotosPermitidas: {
      individuales: 1,
      grupales: 1,
      docentes: 1,
    },
  },
  {
    id: 'kit-digital',
    nombre: 'Solo Digital HD',
    subtitulo: 'Las mismas 3 fotos, sin impresión',
    tagline: 'Mismas 3 fotos seleccionadas en máxima resolución, sin producto físico',
    precio: 15000,
    popular: false,
    cooperadoraAporte: 3000,
    icono: 'Sparkles',
    incluye: [
      '1 fotografía grupal + 2 fotos (individual y con docente)',
      'Todas en alta resolución (HD), sin marca de agua',
      'Acceso inmediato desde el celular vía link + QR',
      'Copia automática enviada por email como respaldo',
      'Pueden sumar el kit impreso después, si lo prefieren',
      '🎓 Aporte de $3.000 (20%) para la cooperadora del colegio',
    ],
    fotosPermitidas: {
      individuales: 1,
      grupales: 1,
      docentes: 1,
    },
  },
  {
    id: 'kit-evento-suelto',
    nombre: 'Fotos Sueltas de Eventos',
    subtitulo: 'Actos patrios, deportes, salidas y muestras',
    tagline: 'Galería digital opcional por evento para adquirir fotos individuales sueltas',
    precio: 5000,
    popular: false,
    cooperadoraAporte: 1000,
    icono: 'Bookmark',
    incluye: [
      '1 fotografía digital en alta resolución (HD) sin marca de agua',
      'Cobertura documental espontánea del calendario escolar',
      'Descarga inmediata a tu celular y computadora',
      '100% opcional evento por evento (sin compromiso)',
      '🎓 20% de aporte destinado a la cooperadora escolar',
    ],
    fotosPermitidas: {
      individuales: 1,
      grupales: 0,
      docentes: 0,
    },
  },
];

export const COLEGIOS_EJEMPLO: Colegio[] = [
  {
    id: 'col-1',
    slug: 'colegio-san-martin-de-tours',
    nombre: 'Colegio San Martín de Tours',
    localidad: 'Palermo / Recoleta',
    zona: 'CABA',
    eventoActual: 'Jornada Fotográfica Anual 2026',
    codigoAcceso: 'TOURS26',
    grados: ['Sala de 5', '1° grado', '2° grado', '3° grado', '4° grado', '5° grado', '6° grado', '7° grado'],
    divisiones: ['A', 'B', 'C'],
    turnos: ['Mañana', 'Tarde', 'Jornada completa'],
  },
  {
    id: 'col-2',
    slug: 'instituto-belgrano-day',
    nombre: 'Instituto Belgrano Day School',
    localidad: 'Belgrano',
    zona: 'CABA',
    eventoActual: 'Retratos Escolares y Promoción 2026',
    codigoAcceso: 'BDS2026',
    grados: ['Jardín', '1° grado', '2° grado', '3° grado', '4° grado', '5° grado', '6° grado', '1° año', '5° año'],
    divisiones: ['A', 'B'],
    turnos: ['Jornada completa'],
  },
  {
    id: 'col-3',
    slug: 'colegio-santa-maria',
    nombre: 'Colegio Santa María de San Isidro',
    localidad: 'San Isidro',
    zona: 'Zona Norte',
    eventoActual: 'Fotos Institucionales y Grado 2026',
    codigoAcceso: 'SMISIDRO',
    grados: ['Sala 4', 'Sala 5', '1° grado', '2° grado', '3° grado', '4° grado', '5° grado', '6° grado'],
    divisiones: ['Azul', 'Verde', 'Rojo'],
    turnos: ['Mañana', 'Tarde'],
  },
  {
    id: 'col-4',
    slug: 'instituto-manuel-belgrano-adrogue',
    nombre: 'Instituto Manuel Belgrano',
    localidad: 'Adrogué',
    zona: 'Zona Sur',
    eventoActual: 'Temporada Fotos Escolares 2026',
    codigoAcceso: 'BELGADR',
    grados: ['1° grado', '2° grado', '3° grado', '4° grado', '5° grado', '6° grado', '1° año', '6° año'],
    divisiones: ['A', 'B'],
    turnos: ['Mañana', 'Tarde'],
  },
  {
    id: 'col-5',
    slug: 'colegio-demo',
    nombre: 'Colegio Modelo Demostración',
    localidad: 'Vicente López',
    zona: 'Zona Norte',
    eventoActual: 'Muestra Abierta de Demostración 2026',
    codigoAcceso: 'DEMO2026',
    grados: ['Sala de 5', '1° grado', '2° grado', '3° grado', '4° grado', '5° grado', '6° grado'],
    divisiones: ['A', 'B'],
    turnos: ['Mañana', 'Tarde'],
  },
];

export const FOTOS_MUESTRA: Foto[] = [
  {
    id: 'foto-ind-1',
    url: 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=1200&q=85',
    thumbnail: 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=400&q=80',
    categoria: 'individual',
    titulo: 'Retrato Individual - Toma A (Sonrisa espontánea)',
    descripcion: 'Luz natural suave con fondo institucional desenfocado',
    grado: '3° grado',
    division: 'A',
  },
  {
    id: 'foto-ind-2',
    url: 'https://images.unsplash.com/photo-1516627145497-ae6968895b74?auto=format&fit=crop&w=1200&q=85',
    thumbnail: 'https://images.unsplash.com/photo-1516627145497-ae6968895b74?auto=format&fit=crop&w=400&q=80',
    categoria: 'individual',
    titulo: 'Retrato Individual - Toma B (Expresión natural)',
    descripcion: 'Plano medio con guardapolvo escolar blanco impecable',
    grado: '3° grado',
    division: 'A',
  },
  {
    id: 'foto-ind-3',
    url: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=1200&q=85',
    thumbnail: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=400&q=80',
    categoria: 'individual',
    titulo: 'Retrato Individual - Toma C (Perfil dinámico)',
    descripcion: 'Toma relajada en aula luminosa con libros de fondo',
    grado: '3° grado',
    division: 'A',
  },
  {
    id: 'foto-grup-1',
    url: 'https://images.unsplash.com/photo-1577896851231-70ef18881754?auto=format&fit=crop&w=1200&q=85',
    thumbnail: 'https://images.unsplash.com/photo-1577896851231-70ef18881754?auto=format&fit=crop&w=400&q=80',
    categoria: 'grupal',
    titulo: 'Foto Grupal de Grado - Formato Panorama',
    descripcion: 'Todo el grado ordenado por alturas con cartel de curso 2026',
    grado: '3° grado',
    division: 'A',
  },
  {
    id: 'foto-grup-2',
    url: 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?auto=format&fit=crop&w=1200&q=85',
    thumbnail: 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?auto=format&fit=crop&w=400&q=80',
    categoria: 'grupal',
    titulo: 'Foto Grupal Divertida - Festejo de Aula',
    descripcion: 'Pose alegre y descontracturada con guardapolvos y abrazos',
    grado: '3° grado',
    division: 'A',
  },
  {
    id: 'foto-doc-1',
    url: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&w=1200&q=85',
    thumbnail: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&w=400&q=80',
    categoria: 'docente',
    titulo: 'Foto con la Docente / Seño',
    descripcion: 'Recuerdo entrañable con la maestra de grado en el pizarrón',
    grado: '3° grado',
    division: 'A',
  },
  {
    id: 'foto-pat-1',
    url: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&w=1200&q=85',
    thumbnail: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&w=400&q=80',
    categoria: 'patio',
    titulo: 'Momento de Recreo / Actividad en el Patio',
    descripcion: 'Fotografía documental espontánea de la jornada escolar',
    grado: '3° grado',
    division: 'A',
  },
];

export const PREGUNTAS_FRECUENTES = {
  familias: [
    {
      pregunta: '¿Puedo comprar solo la versión digital?',
      respuesta:
        'Sí. El paquete Solo Digital HD ($15.000) incluye exactamente las mismas 3 fotos en alta resolución (grupal, individual y con docente) sin marcas de agua, para ver y guardar directamente en el celular o computadora.',
    },
    {
      pregunta: '¿Cómo elijo y recibo mis fotos?',
      respuesta:
        'Accedés a una galería online privada protegida para ver las fotos en baja resolución con marca de agua. Elegís tus favoritas, abonás online sin efectivo y recibís el acceso inmediato por link + código QR y copia de respaldo por email. Si compraste el Kit Impreso + Digital ($30.000), las copias físicas se entregan en carpeta en el colegio.',
    },
    {
      pregunta: '¿Qué pasa si una familia no quiere comprar?',
      respuesta:
        'Nada — no hay ninguna obligación. El modelo es 100% opcional evento por evento: cada familia decide libremente si compra, y quien no compra no abona nada ni queda comprometido.',
    },
    {
      pregunta: '¿El colegio recibe dinero en efectivo o tengo que mandar sobres?',
      respuesta:
        'No, para nada. El colegio no toca dinero ni junta sobres. Todo el proceso de selección y pago se realiza 100% online mediante Mercado Pago o Transferencia bancaria directa.',
    },
    {
      pregunta: '¿Puedo comprar fotos sueltas de otros actos del año?',
      respuesta:
        'Sí. Los eventos del año (actos patrios, torneos deportivos, salidas, muestras) cuentan con galería digital opcional, con fotos sueltas digitales disponibles desde $5.000 por toma.',
    },
  ],
  colegios: [
    {
      pregunta: '¿El colegio tiene que cobrar o administrar algo?',
      respuesta:
        'No. Coordinamos, difundimos, cobramos y entregamos nosotros. La institución no administra pagos, reclamos ni entregas en ningún momento.',
    },
    {
      pregunta: '¿Cómo funciona el aporte del 20% para la Cooperadora?',
      respuesta:
        'El 20% de cada venta se destina directamente a la cooperadora escolar ($6.000 por Kit Impreso + Digital y $3.000 por Solo Digital HD). Se calcula, rinde y transfiere automáticamente por evento sin trámites ni gestión administrativa para el colegio.',
    },
    {
      pregunta: '¿Cómo se maneja el uso de imagen de los alumnos?',
      respuesta:
        'Gestionamos la autorización correspondiente conforme a la Ley 25.326 de Protección de Datos Personales, coordinado prolijamente junto con el colegio.',
    },
    {
      pregunta: '¿Cuánto tiempo de clase insume la jornada de fotos?',
      respuesta:
        'Prácticamente nada. Contamos con un cronograma sincronizado de 10 a 15 minutos por curso en un espacio designado (SUM o biblioteca) para cuidar al 100% la rutina escolar.',
    },
  ],
};
