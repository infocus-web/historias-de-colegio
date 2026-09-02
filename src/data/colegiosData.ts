import { Colegio, KitProducto, Foto } from '../types';

export const KITS_DISPONIBLES: KitProducto[] = [
  {
    id: 'kit-digital',
    nombre: 'Kit Digital HD',
    tagline: 'Ideal para compartir con la familia en el celular y redes',
    precio: 9500,
    precioOriginal: 12000,
    popular: false,
    icono: 'Sparkles',
    incluye: [
      '3 archivos digitales en máxima resolución (HD)',
      '1 foto individual elegida por vos',
      '1 foto grupal de grado con diseño exclusivo',
      '1 foto con docente o compañeros',
      'Descarga inmediata sin marcas de agua',
      'Envío directo a tu WhatsApp y correo',
      'Licencia para imprimir en cualquier laboratorio',
    ],
    fotosPermitidas: {
      individuales: 1,
      grupales: 1,
      docentes: 1,
    },
  },
  {
    id: 'kit-clasico',
    nombre: 'Kit Clásico Impreso + Digital',
    tagline: 'El más elegido: las fotos físicas para el recuerdo + archivos digitales',
    precio: 16800,
    precioOriginal: 21000,
    popular: true,
    icono: 'Camera',
    incluye: [
      '1 Foto Grupal 15x21 cm en papel fotográfico satinado',
      '1 Retrato Individual 15x21 cm con guardapolvo/uniforme',
      '1 Foto con Docente 13x18 cm conmemorativa',
      'Plancha con 4 fotos carnet escolares 4x4 cm',
      'Portarretrato plegable institucional con año lectivo',
      'Descarga digital HD de todas las fotos incluidas',
      'Entrega en sobre cerrado individual en el colegio',
    ],
    fotosPermitidas: {
      individuales: 1,
      grupales: 1,
      docentes: 1,
    },
  },
  {
    id: 'kit-fotocubo',
    nombre: 'Kit Fotocubo & Egresados',
    tagline: 'El souvenir icónico de Fin de Ciclo y Egresaditos en madera y acrílico',
    precio: 21500,
    precioOriginal: 26000,
    popular: true,
    icono: 'Box',
    incluye: [
      'Fotocubo de madera giratorio 10x10 cm con 6 caras impresas',
      'Foto grupal con diseño de promoción / egresaditos',
      'Retrato individual con toga, birrete o uniforme formal',
      'Foto con directivos o docentes de fin de ciclo',
      'Diseño exclusivo con escudo, nombres de compañeros y año',
      'Descarga digital HD completa de todas las tomas',
      'Presentación en caja conmemorativa para regalo',
    ],
    fotosPermitidas: {
      individuales: 2,
      grupales: 1,
      docentes: 1,
    },
  },
  {
    id: 'kit-premium',
    nombre: 'Kit Colección Premium',
    tagline: 'Recuerdo completo con cuadro de madera, stickers y copias familiares',
    precio: 24900,
    precioOriginal: 31500,
    popular: false,
    icono: 'Crown',
    incluye: [
      'Todo lo incluido en el Kit Clásico Impreso',
      'Ampliación 20x30 cm lista para enmarcar',
      'Cuadro portarretrato en madera de álamo natural',
      'Plancha de 8 stickers autoadhesivos con su nombre',
      '2 copias 10x15 cm adicionales (ideales para abuelos)',
      'Todas las tomas digitales en HD (hasta 5 fotos)',
      'Acceso prioritario a la descarga digital inmediata',
    ],
    fotosPermitidas: {
      individuales: 2,
      grupales: 1,
      docentes: 1,
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
      pregunta: '¿Cómo hago para ver las fotos de mi hijo/a?',
      respuesta:
        'Es muy sencillo: hacé clic en "Acceso Familias", buscá el nombre de tu colegio o ingresá el código de acceso provisto en el comunicado escolar. Luego seleccionás el grado y división de tu hijo/a para abrir su galería privada con marca de agua.',
    },
    {
      pregunta: '¿El colegio recibe dinero en efectivo o tengo que mandar sobres?',
      respuesta:
        'No, para nada. El colegio no toca dinero ni junta sobres. Todo el proceso de selección y pago se realiza 100% online a través de nuestra plataforma mediante Mercado Pago (débito, crédito, dinero en cuenta) o Transferencia bancaria directa.',
    },
    {
      pregunta: '¿Puedo elegir cuál foto individual quiero para mi kit?',
      respuesta:
        '¡Sí! Tomamos varias fotos de cada alumno en distintas poses naturales para que la familia pueda elegir la sonrisa o expresión que más los represente antes de imprimir o descargar.',
    },
    {
      pregunta: '¿Cuándo y cómo recibo las fotos?',
      respuesta:
        'Si comprás el Kit Digital, la descarga en HD se habilita al instante una vez confirmado el pago y además te llega un mensaje automático por WhatsApp con el enlace de descarga directa. Las fotos impresas se entregan organizadas por curso y en sobres personalizados cerrados directamente en el colegio en la fecha pautada.',
    },
    {
      pregunta: '¿Qué pasa si tengo más de un hijo en el mismo colegio?',
      respuesta:
        'Podés ingresar a la galería de cada uno y armar un pedido unificado. Además, ofrecemos descuentos por hermanos a partir del segundo alumno.',
    },
  ],
  colegios: [
    {
      pregunta: '¿Tiene algún costo para la institución educativa?',
      respuesta:
        'Ninguno. La prestación del servicio fotográfico es 100% gratuita para el colegio. La compra de las fotos por parte de las familias es totalmente opcional y voluntaria.',
    },
    {
      pregunta: '¿Cuánto tiempo de clase se pierde durante la jornada de fotos?',
      respuesta:
        'Prácticamente nada. Contamos con un cronograma sincronizado por curso de entre 10 y 15 minutos por grado. Todo el montaje de luces y set se realiza en un espacio acordado (SUM, biblioteca o patio cubierto) para no interrumpir la dinámica áulica.',
    },
    {
      pregunta: '¿Qué obsequios o beneficios recibe la escuela?',
      respuesta:
        'Cada docente y directivo recibe de obsequio su foto grupal de grado de cortesía. Además, entregamos un mosaico institucional / orla de recuerdo para la dirección y un archivo digital ordenado de los retratos de cada alumno para el legajo o sistema de gestión escolar.',
    },
    {
      pregunta: '¿Qué ocurre si algún alumno falta el día de la sesión?',
      respuesta:
        'Coordinamos una fecha de recuperatorio o "segunda pasada" para aquellos alumnos que hayan faltado por enfermedad o viaje, asegurando que nadie se quede sin su recuerdo del ciclo lectivo.',
    },
  ],
};
