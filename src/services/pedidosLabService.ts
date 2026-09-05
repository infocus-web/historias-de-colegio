import JSZip from 'jszip';
import { FOTOS_MUESTRA } from '../data/colegiosData';

export interface ArchivoFotoLab {
  id: string;
  tipo: 'individual' | 'grupal' | 'docente' | 'stickers' | 'portarretrato';
  nombreArchivoOriginal: string;
  nombreArchivoLab: string; // Ej: SALA3TM_01_ABBA_FAZIO_AGUSTIN_INDIVIDUAL_15x21.jpg
  tamanoImpresion: string; // '15x21' | '20x30' | '10x15'
  urlMuestra: string;
  urlOriginalHD?: string;
}

export interface PedidoEscolarCompleto {
  id: string; // Ej: IFS-2026-8812
  fecha: string;
  colegioId: string;
  colegioNombre: string;
  cursoCodigo: string; // Ej: SALA3TM
  grado: string;
  division: string;
  turno: string;
  alumnoId?: string;
  alumnoNumeroLista: number;
  alumnoNombre: string;
  codigoAlumno: string; // Ej: SALA3TM_01_ABBA_FAZIO_AGUSTIN
  tutorNombre: string;
  tutorTelefono: string;
  tutorEmail: string;
  kitId: string;
  kitNombre: string;
  total: number;
  metodoPago: 'mercadopago' | 'transferencia' | 'efectivo';
  estadoPago: 'aprobado' | 'pendiente';
  estadoEntrega: 'en_espera' | 'en_laboratorio' | 'listo_descarga' | 'entregado';
  fotosSeleccionadas: {
    individualId: string;
    grupalId: string;
    docenteId?: string;
  };
  archivosParaLaboratorio: ArchivoFotoLab[];
  linkDescargaHD: string;
  emailEnviado: boolean;
  fechaEnvioEmail?: string;
}

// Helper to sanitize strings for photo lab minilab machines (Noritsu / Fuji Frontier / Klick)
export function sanitizarParaMinilab(texto: string): string {
  return texto
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // remove accents
    .toUpperCase()
    .replace(/[^A-Z0-9_]/g, '_')
    .replace(/_+/g, '_')
    .replace(/^_|_$/g, '');
}

/**
 * Builds the exact filename that the photo lab prints on the reverse side of each print
 * E.g: SALA3TM_01_ABBA_FAZIO_AGUSTIN_INDIVIDUAL_15x21.jpg
 */
export function generarNombreArchivoLab(
  cursoCodigo: string,
  numeroLista: number,
  alumnoNombre: string,
  tipoFoto: 'INDIVIDUAL' | 'GRUPAL' | 'DOCENTE' | 'STICKERS',
  tamano: '15x21' | '20x30' | '10x15'
): string {
  const cleanCurso = sanitizarParaMinilab(cursoCodigo);
  const numPad = String(numeroLista).padStart(2, '0');
  const cleanAlumno = sanitizarParaMinilab(alumnoNombre);
  return `${cleanCurso}_${numPad}_${cleanAlumno}_${tipoFoto}_${tamano}.jpg`;
}

// Initial demo orders to showcase the functionality immediately
const PEDIDOS_INICIALES: PedidoEscolarCompleto[] = [
  {
    id: 'IFS-2026-8812',
    fecha: '02/09/2026 10:30',
    colegioId: 'col-inicial-2026',
    colegioNombre: 'Colegio San Martín de Tours (Nivel Inicial)',
    cursoCodigo: 'SALA3TM',
    grado: 'Sala 3',
    division: 'Única',
    turno: 'Mañana',
    alumnoId: 'alu-01',
    alumnoNumeroLista: 1,
    alumnoNombre: 'Abba Fazio, Agustín',
    codigoAlumno: 'SALA3TM_01_ABBA_FAZIO_AGUSTIN',
    tutorNombre: 'Mariana Fazio',
    tutorTelefono: '1154893210',
    tutorEmail: 'mariana.fazio@gmail.com',
    kitId: 'kit-impreso-digital',
    kitNombre: 'Kit Impreso + Digital',
    total: 30000,
    metodoPago: 'mercadopago',
    estadoPago: 'aprobado',
    estadoEntrega: 'en_laboratorio',
    fotosSeleccionadas: {
      individualId: 'f-ind-1',
      grupalId: 'f-grup-1',
      docenteId: 'f-doc-1'
    },
    archivosParaLaboratorio: [
      {
        id: 'arch-1',
        tipo: 'individual',
        nombreArchivoOriginal: 'IMG_4901_HD.jpg',
        nombreArchivoLab: 'SALA3TM_01_ABBA_FAZIO_AGUSTIN_INDIVIDUAL_15x21.jpg',
        tamanoImpresion: '15x21',
        urlMuestra: FOTOS_MUESTRA[0].thumbnail,
        urlOriginalHD: FOTOS_MUESTRA[0].url
      },
      {
        id: 'arch-2',
        tipo: 'grupal',
        nombreArchivoOriginal: 'IMG_4920_GRUPAL_HD.jpg',
        nombreArchivoLab: 'SALA3TM_01_ABBA_FAZIO_AGUSTIN_GRUPAL_20x30.jpg',
        tamanoImpresion: '20x30',
        urlMuestra: FOTOS_MUESTRA[3].thumbnail,
        urlOriginalHD: FOTOS_MUESTRA[3].url
      },
      {
        id: 'arch-3',
        tipo: 'docente',
        nombreArchivoOriginal: 'IMG_4935_DOCENTE_HD.jpg',
        nombreArchivoLab: 'SALA3TM_01_ABBA_FAZIO_AGUSTIN_DOCENTE_15x21.jpg',
        tamanoImpresion: '15x21',
        urlMuestra: FOTOS_MUESTRA[5].thumbnail,
        urlOriginalHD: FOTOS_MUESTRA[5].url
      }
    ],
    linkDescargaHD: 'https://ntkqypxvrljuihbxdrtx.supabase.co/storage/v1/object/public/fotos-hd/2026/SALA3TM/01_ABBA_FAZIO_AGUSTIN.zip',
    emailEnviado: true,
    fechaEnvioEmail: '02/09/2026 10:31'
  },
  {
    id: 'IFS-2026-8809',
    fecha: '02/09/2026 11:45',
    colegioId: 'col-inicial-2026',
    colegioNombre: 'Colegio San Martín de Tours (Nivel Inicial)',
    cursoCodigo: 'SALA3TM',
    grado: 'Sala 3',
    division: 'Única',
    turno: 'Mañana',
    alumnoId: 'alu-02',
    alumnoNumeroLista: 2,
    alumnoNombre: 'Amigorena, Lucas',
    codigoAlumno: 'SALA3TM_02_AMIGORENA_LUCAS',
    tutorNombre: 'Esteban Amigorena',
    tutorTelefono: '1144559988',
    tutorEmail: 'esteban.amigorena@hotmail.com',
    kitId: 'kit-solo-digital',
    kitNombre: 'Solo Digital HD',
    total: 15000,
    metodoPago: 'transferencia',
    estadoPago: 'aprobado',
    estadoEntrega: 'listo_descarga',
    fotosSeleccionadas: {
      individualId: 'f-ind-2',
      grupalId: 'f-grup-1'
    },
    archivosParaLaboratorio: [
      {
        id: 'arch-4',
        tipo: 'individual',
        nombreArchivoOriginal: 'IMG_4905_HD.jpg',
        nombreArchivoLab: 'SALA3TM_02_AMIGORENA_LUCAS_INDIVIDUAL_15x21.jpg',
        tamanoImpresion: '15x21',
        urlMuestra: FOTOS_MUESTRA[1].thumbnail,
        urlOriginalHD: FOTOS_MUESTRA[1].url
      },
      {
        id: 'arch-5',
        tipo: 'grupal',
        nombreArchivoOriginal: 'IMG_4920_GRUPAL_HD.jpg',
        nombreArchivoLab: 'SALA3TM_02_AMIGORENA_LUCAS_GRUPAL_20x30.jpg',
        tamanoImpresion: '20x30',
        urlMuestra: FOTOS_MUESTRA[3].thumbnail,
        urlOriginalHD: FOTOS_MUESTRA[3].url
      }
    ],
    linkDescargaHD: 'https://ntkqypxvrljuihbxdrtx.supabase.co/storage/v1/object/public/fotos-hd/2026/SALA3TM/02_AMIGORENA_LUCAS.zip',
    emailEnviado: true,
    fechaEnvioEmail: '02/09/2026 11:46'
  },
  {
    id: 'IFS-2026-8795',
    fecha: '01/09/2026 16:20',
    colegioId: 'col-inicial-2026',
    colegioNombre: 'Colegio San Martín de Tours (Nivel Inicial)',
    cursoCodigo: 'SALA4A',
    grado: 'Sala 4',
    division: 'A',
    turno: 'Tarde',
    alumnoId: 'alu-04',
    alumnoNumeroLista: 4,
    alumnoNombre: 'Balbi, Paz',
    codigoAlumno: 'SALA4A_04_BALBI_PAZ',
    tutorNombre: 'Carolina Balbi',
    tutorTelefono: '1167221100',
    tutorEmail: 'caro.balbi@yahoo.com.ar',
    kitId: 'kit-impreso-digital',
    kitNombre: 'Kit Impreso + Digital',
    total: 36700,
    metodoPago: 'mercadopago',
    estadoPago: 'aprobado',
    estadoEntrega: 'en_laboratorio',
    fotosSeleccionadas: {
      individualId: 'f-ind-3',
      grupalId: 'f-grup-1',
      docenteId: 'f-doc-1'
    },
    archivosParaLaboratorio: [
      {
        id: 'arch-6',
        tipo: 'individual',
        nombreArchivoOriginal: 'IMG_5102_HD.jpg',
        nombreArchivoLab: 'SALA4A_04_BALBI_PAZ_INDIVIDUAL_15x21.jpg',
        tamanoImpresion: '15x21',
        urlMuestra: FOTOS_MUESTRA[2].thumbnail,
        urlOriginalHD: FOTOS_MUESTRA[2].url
      },
      {
        id: 'arch-7',
        tipo: 'grupal',
        nombreArchivoOriginal: 'IMG_5150_GRUPAL_HD.jpg',
        nombreArchivoLab: 'SALA4A_04_BALBI_PAZ_GRUPAL_20x30.jpg',
        tamanoImpresion: '20x30',
        urlMuestra: FOTOS_MUESTRA[3].thumbnail,
        urlOriginalHD: FOTOS_MUESTRA[3].url
      },
      {
        id: 'arch-8',
        tipo: 'docente',
        nombreArchivoOriginal: 'IMG_5180_DOCENTE_HD.jpg',
        nombreArchivoLab: 'SALA4A_04_BALBI_PAZ_DOCENTE_15x21.jpg',
        tamanoImpresion: '15x21',
        urlMuestra: FOTOS_MUESTRA[5].thumbnail,
        urlOriginalHD: FOTOS_MUESTRA[5].url
      }
    ],
    linkDescargaHD: 'https://ntkqypxvrljuihbxdrtx.supabase.co/storage/v1/object/public/fotos-hd/2026/SALA4A/04_BALBI_PAZ.zip',
    emailEnviado: true,
    fechaEnvioEmail: '01/09/2026 16:21'
  }
];

const LOCAL_STORAGE_PEDIDOS_KEY = 'infocus_pedidos_escolares_v1';

export function obtenerPedidosGuardados(): PedidoEscolarCompleto[] {
  if (typeof window === 'undefined') return PEDIDOS_INICIALES;
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_PEDIDOS_KEY);
    if (!raw) {
      localStorage.setItem(LOCAL_STORAGE_PEDIDOS_KEY, JSON.stringify(PEDIDOS_INICIALES));
      return PEDIDOS_INICIALES;
    }
    return JSON.parse(raw);
  } catch {
    return PEDIDOS_INICIALES;
  }
}

export function guardarPedidosEnStorage(pedidos: PedidoEscolarCompleto[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(LOCAL_STORAGE_PEDIDOS_KEY, JSON.stringify(pedidos));
  } catch (err) {
    console.error('Error guardando pedidos:', err);
  }
}

/**
 * Registers a new order created by a parent in the portal
 */
export function registrarPedidoDesdePortal(params: {
  colegioId: string;
  colegioNombre: string;
  cursoCodigo: string;
  grado: string;
  division: string;
  turno: string;
  alumnoNombre: string;
  alumnoNumeroLista?: number;
  tutorNombre: string;
  tutorTelefono: string;
  tutorEmail: string;
  kitId: string;
  kitNombre: string;
  total: number;
  metodoPago: 'mercadopago' | 'transferencia' | 'efectivo';
  fotosSeleccionadas: {
    individualId: string;
    grupalId: string;
    docenteId?: string;
  };
}): PedidoEscolarCompleto {
  const currentPedidos = obtenerPedidosGuardados();
  const numPedido = `IFS-2026-${Math.floor(1000 + Math.random() * 9000)}`;
  const numLista = params.alumnoNumeroLista || currentPedidos.length + 1;
  const codigoAlumno = `${sanitizarParaMinilab(params.cursoCodigo)}_${String(numLista).padStart(2, '0')}_${sanitizarParaMinilab(params.alumnoNombre)}`;

  const individualFoto = FOTOS_MUESTRA.find(f => f.id === params.fotosSeleccionadas.individualId) || FOTOS_MUESTRA[0];
  const grupalFoto = FOTOS_MUESTRA.find(f => f.id === params.fotosSeleccionadas.grupalId) || FOTOS_MUESTRA[3];
  const docenteFoto = params.fotosSeleccionadas.docenteId ? (FOTOS_MUESTRA.find(f => f.id === params.fotosSeleccionadas.docenteId) || FOTOS_MUESTRA[5]) : undefined;

  const archivosLab: ArchivoFotoLab[] = [
    {
      id: `arch-${Date.now()}-1`,
      tipo: 'individual',
      nombreArchivoOriginal: 'INDIVIDUAL_HD.jpg',
      nombreArchivoLab: generarNombreArchivoLab(params.cursoCodigo, numLista, params.alumnoNombre, 'INDIVIDUAL', '15x21'),
      tamanoImpresion: '15x21',
      urlMuestra: individualFoto.thumbnail,
      urlOriginalHD: individualFoto.url
    },
    {
      id: `arch-${Date.now()}-2`,
      tipo: 'grupal',
      nombreArchivoOriginal: 'GRUPAL_HD.jpg',
      nombreArchivoLab: generarNombreArchivoLab(params.cursoCodigo, numLista, params.alumnoNombre, 'GRUPAL', '20x30'),
      tamanoImpresion: '20x30',
      urlMuestra: grupalFoto.thumbnail,
      urlOriginalHD: grupalFoto.url
    }
  ];

  if (docenteFoto) {
    archivosLab.push({
      id: `arch-${Date.now()}-3`,
      tipo: 'docente',
      nombreArchivoOriginal: 'DOCENTE_HD.jpg',
      nombreArchivoLab: generarNombreArchivoLab(params.cursoCodigo, numLista, params.alumnoNombre, 'DOCENTE', '15x21'),
      tamanoImpresion: '15x21',
      urlMuestra: docenteFoto.thumbnail,
      urlOriginalHD: docenteFoto.url
    });
  }

  const now = new Date();
  const fechaStr = `${String(now.getDate()).padStart(2, '0')}/${String(now.getMonth() + 1).padStart(2, '0')}/${now.getFullYear()} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

  const nuevoPedido: PedidoEscolarCompleto = {
    id: numPedido,
    fecha: fechaStr,
    colegioId: params.colegioId,
    colegioNombre: params.colegioNombre,
    cursoCodigo: params.cursoCodigo.toUpperCase(),
    grado: params.grado,
    division: params.division,
    turno: params.turno,
    alumnoNumeroLista: numLista,
    alumnoNombre: params.alumnoNombre,
    codigoAlumno,
    tutorNombre: params.tutorNombre,
    tutorTelefono: params.tutorTelefono,
    tutorEmail: params.tutorEmail,
    kitId: params.kitId,
    kitNombre: params.kitNombre,
    total: params.total,
    metodoPago: params.metodoPago,
    estadoPago: 'aprobado',
    estadoEntrega: 'en_laboratorio',
    fotosSeleccionadas: params.fotosSeleccionadas,
    archivosParaLaboratorio: archivosLab,
    linkDescargaHD: `https://ntkqypxvrljuihbxdrtx.supabase.co/storage/v1/object/public/fotos-hd/2026/${sanitizarParaMinilab(params.cursoCodigo)}/${codigoAlumno}.zip`,
    emailEnviado: true,
    fechaEnvioEmail: fechaStr
  };

  const listaActualizada = [nuevoPedido, ...currentPedidos];
  guardarPedidosEnStorage(listaActualizada);
  return nuevoPedido;
}

/**
 * Downloads a complete ZIP bundle with all student photos automatically renamed for the photo lab.
 * Includes a packing checklist file for envelope sorting.
 */
export async function descargarLoteLaboratorioZip(
  pedidos: PedidoEscolarCompleto[],
  opciones: {
    nombreColegio: string;
    filtroCurso?: string;
    organizarEnSubcarpetasPorAlumno?: boolean;
  }
): Promise<Blob> {
  const zip = new JSZip();
  const pedidosFiltrados = pedidos.filter(p => 
    (!opciones.filtroCurso || opciones.filtroCurso === 'todos' || p.cursoCodigo === opciones.filtroCurso) &&
    p.estadoPago === 'aprobado'
  );

  // 1. Text checklist for envelope packing
  let planillaTexto = `===========================================================\n`;
  planillaTexto += `INFOCUS SCHOOLS - PLANILLA DE LABORATORIO Y ENSOBRADO\n`;
  planillaTexto += `Institución: ${opciones.nombreColegio}\n`;
  planillaTexto += `Fecha de Generación: ${new Date().toLocaleString('es-AR')}\n`;
  planillaTexto += `Total de Pedidos Aprobados: ${pedidosFiltrados.length}\n`;
  planillaTexto += `===========================================================\n\n`;

  planillaTexto += `ORDEN | CURSO | ALUMNO | KIT | ARCHIVOS A IMPRIMIR | ENSOBRADO [ ]\n`;
  planillaTexto += `----------------------------------------------------------------------------------------------------\n`;

  for (let i = 0; i < pedidosFiltrados.length; i++) {
    const p = pedidosFiltrados[i];
    const listaArchivosLab = p.archivosParaLaboratorio.map(a => a.nombreArchivoLab).join(' + ');
    planillaTexto += `#${String(p.alumnoNumeroLista).padStart(2, '0')} | ${p.cursoCodigo} | ${p.alumnoNombre} | ${p.kitNombre} | ${listaArchivosLab} | [  ]\n`;

    // 2. Fetch and add each photo renamed to the ZIP
    for (const foto of p.archivosParaLaboratorio) {
      try {
        const response = await fetch(foto.urlOriginalHD || foto.urlMuestra);
        const blob = await response.blob();
        
        if (opciones.organizarEnSubcarpetasPorAlumno) {
          // Folder per student: CURSO / 01_APELLIDO_NOMBRE / SALA3TM_01_APELLIDO_NOMBRE_INDIVIDUAL_15x21.jpg
          const carpetaAlumno = `${p.cursoCodigo}/${String(p.alumnoNumeroLista).padStart(2, '0')}_${sanitizarParaMinilab(p.alumnoNombre)}`;
          zip.folder(carpetaAlumno)?.file(foto.nombreArchivoLab, blob);
        } else {
          // Flat folder for direct Noritsu / Fuji machine queue
          zip.file(foto.nombreArchivoLab, blob);
        }
      } catch (err) {
        console.warn(`No se pudo descargar imagen para ${foto.nombreArchivoLab}, usando placeholder de prueba`, err);
        // Add a placeholder text file if image fetch fails due to CORS in preview
        zip.file(`${foto.nombreArchivoLab}.info.txt`, `Archivo correspondiente a: ${p.alumnoNombre}\nCódigo: ${foto.nombreArchivoLab}`);
      }
    }
  }

  // 3. Add packing checklist
  zip.file(`00_PLANILLA_CONTROL_ENSOBRADO_${sanitizarParaMinilab(opciones.filtroCurso || 'TODOS')}.txt`, planillaTexto);

  // 4. Add Readme for the lab technician
  const readmeLab = `INSTRUCCIONES PARA EL OPERADOR DE MINILAB FOTOGRÁFICO:
1. Este paquete contiene las fotos de los alumnos con nomenclatura unificada.
2. Cada archivo tiene en su nombre:
   [CODIGO_CURSO]_[NUMERO_LISTA]_[APELLIDO_Y_NOMBRE]_[TIPO_TOMA]_[TAMANO_PAPEL].jpg
3. Por favor asegurar que la máquina (Noritsu / Fuji Frontier / Klick) tenga activada la opción:
   "IMPRIMIR NOMBRE DE ARCHIVO EN EL DORSO DEL PAPEL (Backprint)".
4. De este modo, al retirar las copias de la canasta de salida, el dorso ya contiene el nombre del alumno para ensobrar sin errores.
Muchas gracias. InFocus Fotografía Escolar.`;

  zip.file(`00_LEAME_OPERADOR_LABORATORIO.txt`, readmeLab);

  return await zip.generateAsync({ type: 'blob' });
}
