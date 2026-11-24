/* ==========================================================================
   Portafolio de Evidencias ADSO — SENA ("ÉCHELE CAMELLO" · Grupo 8)
   Lógica de aplicación en JavaScript puro (sin frameworks externos).
   Secciones:
     1. Configuración de los 12 anexos y reglas de archivos
     2. Funciones puras de validación, formato y visores externos
     3. Persistencia de nombres/descripciones en localStorage e IndexedDB
     4. Lector local de archivos Office Open XML (.docx, .xlsx, .pptx) en navegador
     5. Controladores de UI, botones desplegables, previsualización y zoom
   ========================================================================== */

const STORAGE_KEYS = {
  titles: 'adso_portafolio_annex_titles_v2',
  descriptions: 'adso_portafolio_annex_descriptions_v2',
  publicUrls: 'adso_portafolio_annex_public_urls_v1',
  pages: 'adso_portafolio_annex_pages_v1',
};

const IDB_CONFIG = {
  dbName: 'adso_portafolio_files_db_v1',
  storeName: 'annex_files',
  versionsStoreName: 'annex_versions',
  dbVersion: 2,
};

const IMAGE_EXTENSIONS = ['png', 'jpg', 'jpeg', 'gif', 'webp', 'svg', 'bmp'];
const DOCUMENT_EXTENSIONS = ['doc', 'docx', 'pdf', 'xls', 'xlsx', 'ppt', 'pptx', ...IMAGE_EXTENSIONS];
const OFFICE_EXTENSIONS = ['doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx'];
const VIDEO_EXTENSIONS = ['mp4', 'webm', 'ogg', 'mov', 'm4v', 'avi', 'mkv'];

const MAX_DOCUMENT_BYTES = 2048 * 1024 * 1024; // 2048 MB (2 GB) para admitir portafolios y documentos pesados
const MAX_VIDEO_BYTES = 2048 * 1024 * 1024; // 2048 MB (2 GB)

/**
 * Mapa de migración automática de anexos con letras (A-L) a numeración (1-13)
 * para conservar intactos todos los archivos y datos que el usuario ya haya subido.
 * A..K -> 1..11, y L (video) -> 13 (quedando el 12 para "Portafolio de evidencias").
 */
const LEGACY_ID_MAP = {
  A: '1',
  B: '2',
  C: '3',
  D: '4',
  E: '5',
  F: '6',
  G: '7',
  H: '8',
  I: '9',
  J: '10',
  K: '11',
  L: '13',
};

/**
 * Definición fija del video de presentación al inicio de la página (conserva ID '13' de IndexedDB).
 */
const PRESENTATION_VIDEO_ANNEX = {
  id: '13',
  code: 'Video',
  title: 'Video de presentación — Échele Camello',
  description: '',
  kind: 'video',
  acceptedExtensions: VIDEO_EXTENSIONS,
  maxBytes: MAX_VIDEO_BYTES,
  subtitles: [],
};

/**
 * Estructura fija oficial del portafolio (1 a 11 con sus subtítulos exactos + Anexos).
 * Conserva IDs '1'..'12' para mantener intactos todos los archivos ya guardados en IndexedDB.
 */
const DEFAULT_ANNEXES = [
  {
    id: '1',
    code: '1',
    title: '1. Planeación de actividades',
    description: '',
    kind: 'document',
    acceptedExtensions: DOCUMENT_EXTENSIONS,
    maxBytes: MAX_DOCUMENT_BYTES,
    subtitles: [],
  },
  {
    id: '2',
    code: '2',
    title: '2. Diagramas de casos de uso',
    description: '',
    kind: 'document',
    acceptedExtensions: DOCUMENT_EXTENSIONS,
    maxBytes: MAX_DOCUMENT_BYTES,
    subtitles: [],
  },
  {
    id: '3',
    code: '3',
    title: '3. Diagramas de actividad',
    description: '',
    kind: 'document',
    acceptedExtensions: DOCUMENT_EXTENSIONS,
    maxBytes: MAX_DOCUMENT_BYTES,
    subtitles: [],
  },
  {
    id: '4',
    code: '4',
    title: '4. Diagrama de dominio',
    description: '',
    kind: 'document',
    acceptedExtensions: DOCUMENT_EXTENSIONS,
    maxBytes: MAX_DOCUMENT_BYTES,
    subtitles: [],
  },
  {
    id: '5',
    code: '5',
    title: '5. Taller de bases de datos',
    description: '',
    kind: 'document',
    acceptedExtensions: DOCUMENT_EXTENSIONS,
    maxBytes: MAX_DOCUMENT_BYTES,
    subtitles: [],
  },
  {
    id: '6',
    code: '6',
    title: '6. Verificación de modelos y elaboración de prototipos',
    description: '',
    kind: 'document',
    acceptedExtensions: DOCUMENT_EXTENSIONS,
    maxBytes: MAX_DOCUMENT_BYTES,
    subtitles: [
      { id: '6.1', title: '6.1 Revisión de los modelos de análisis' },
      { id: '6.2', title: '6.2 Elaboración de prototipos' },
    ],
  },
  {
    id: '7',
    code: '7',
    title: '7. Taller general',
    description: '',
    kind: 'document',
    acceptedExtensions: DOCUMENT_EXTENSIONS,
    maxBytes: MAX_DOCUMENT_BYTES,
    subtitles: [],
  },
  {
    id: '8',
    code: '8',
    title: '8. Hardware',
    description: '',
    kind: 'document',
    acceptedExtensions: DOCUMENT_EXTENSIONS,
    maxBytes: MAX_DOCUMENT_BYTES,
    subtitles: [
      { id: '8.1', title: '8.1 Comparación de equipos y especificaciones' },
      { id: '8.2', title: '8.2 Selección y justificación de los equipos' },
    ],
  },
  {
    id: '9',
    code: '9',
    title: '9. Licencias',
    description: '',
    kind: 'document',
    acceptedExtensions: DOCUMENT_EXTENSIONS,
    maxBytes: MAX_DOCUMENT_BYTES,
    subtitles: [],
  },
  {
    id: '10',
    code: '10',
    title: '10. Software',
    description: '',
    kind: 'document',
    acceptedExtensions: DOCUMENT_EXTENSIONS,
    maxBytes: MAX_DOCUMENT_BYTES,
    subtitles: [
      { id: '10.1', title: '10.1 Comparación y cotización de tecnologías' },
      { id: '10.2', title: '10.2 Selección y justificación de herramientas' },
    ],
  },
  {
    id: '11',
    code: '11',
    title: '11. Recursos humanos',
    description: '',
    kind: 'document',
    acceptedExtensions: DOCUMENT_EXTENSIONS,
    maxBytes: MAX_DOCUMENT_BYTES,
    subtitles: [
      { id: '11.1', title: '11.1 Metodología de trabajo y justificación' },
      { id: '11.2', title: '11.2 Asignación de roles y tiempos' },
      { id: '11.3', title: '11.3 Diagrama de Gantt y estimación de costos' },
    ],
  },
  {
    id: '12',
    code: 'Anexos',
    title: 'Anexos',
    description: '',
    kind: 'document',
    acceptedExtensions: DOCUMENT_EXTENSIONS,
    maxBytes: MAX_DOCUMENT_BYTES,
    subtitles: [],
  },
];

/* ==========================================================================
   2. Funciones puras (validación, formato y URLs de visores externos)
   ========================================================================== */

function getFileExtension(fileName) {
  if (typeof fileName !== 'string') return '';
  const trimmed = fileName.trim();
  const lastDot = trimmed.lastIndexOf('.');
  if (lastDot <= 0 || lastDot === trimmed.length - 1) return '';
  return trimmed.slice(lastDot + 1).toLowerCase();
}

function formatFileSize(bytes) {
  if (!Number.isFinite(bytes) || bytes < 0) return '0 B';
  if (bytes < 1024) return `${bytes} B`;
  const kb = bytes / 1024;
  if (kb < 1024) return `${kb.toFixed(1)} KB`;
  const mb = kb / 1024;
  return `${mb.toFixed(2)} MB`;
}

/**
 * Valida extensión, tamaño mínimo (> 0) y tamaño máximo antes de cargar un archivo.
 */
function validateFileForAnnex(annex, file) {
  if (!annex || !file) {
    return { valid: false, error: 'No se seleccionó ningún archivo válido.' };
  }

  const ext = getFileExtension(file.name);
  if (!ext || !annex.acceptedExtensions.includes(ext)) {
    const allowedText = annex.acceptedExtensions.map((e) => `.${e}`).join(', ');
    if (annex.kind === 'video') {
      return {
        valid: false,
        error: `El anexo "${annex.title}" solo acepta videos (${allowedText}). El archivo "${file.name}" no es compatible.`,
      };
    }
    return {
      valid: false,
      error: `Formato no permitido para "${annex.title}". Solo se aceptan: ${allowedText}.`,
    };
  }

  if (typeof file.size !== 'number' || file.size <= 0) {
    return {
      valid: false,
      error: `El archivo "${file.name}" está vacío (0 bytes). Selecciona un archivo con contenido válido.`,
    };
  }

  if (file.size > annex.maxBytes) {
    return {
      valid: false,
      error: `El archivo supera el límite permitido de ${formatFileSize(annex.maxBytes)} (tamaño actual: ${formatFileSize(file.size)}).`,
    };
  }

  return { valid: true, extension: ext };
}

/**
 * Construye las URLs de previsualización para visores externos de Office
 * cuando el archivo es accesible por una URL pública HTTPS/HTTP.
 */
function buildOfficeViewerUrls(publicUrl) {
  if (typeof publicUrl !== 'string') return null;
  const trimmed = publicUrl.trim();
  if (!trimmed) return null;

  let parsed;
  try {
    parsed = new URL(trimmed);
  } catch {
    return null;
  }

  if (parsed.protocol !== 'https:' && parsed.protocol !== 'http:') {
    return null;
  }

  const encoded = encodeURIComponent(parsed.toString());
  return {
    officeOnline: `https://view.officeapps.live.com/op/embed.aspx?src=${encoded}`,
    googleDocs: `https://docs.google.com/gview?embedded=true&url=${encoded}`,
  };
}

function getPreviewCategory(extension) {
  const ext = String(extension || '').toLowerCase();
  if (ext === 'pdf') return 'pdf';
  if (IMAGE_EXTENSIONS.includes(ext)) return 'image';
  if (VIDEO_EXTENSIONS.includes(ext)) return 'video';
  if (OFFICE_EXTENSIONS.includes(ext)) return 'office';
  return 'unsupported';
}

/* ==========================================================================
   3. Persistencia en localStorage e IndexedDB
   ========================================================================== */

function loadPersistedMap(storage, key) {
  if (!storage || typeof storage.getItem !== 'function') return {};
  try {
    const raw = storage.getItem(key);
    if (!raw) return {};
    const parsed = JSON.parse(raw);
    return parsed && typeof parsed === 'object' && !Array.isArray(parsed) ? parsed : {};
  } catch {
    return {};
  }
}

function savePersistedMap(storage, key, map) {
  if (!storage || typeof storage.setItem !== 'function') return;
  try {
    storage.setItem(key, JSON.stringify(map));
  } catch {
    // Ignorar si el navegador restringe almacenamiento
  }
}

function normalizeNumberedTitle(id, rawTitle) {
  if (typeof rawTitle !== 'string') return '';
  const trimmed = rawTitle.trim();
  if (!trimmed) return '';
  if (id === '13' && /^anexos\s+html$/i.test(trimmed)) {
    return 'Anexo 13. Anexos Html';
  }
  return trimmed.replace(/^Anexo\s+[A-L]\b\.?\s*/i, `Anexo ${id}. `);
}

function migrateLegacyStorageMap(map, isTitleMap = false) {
  if (!map || typeof map !== 'object') return false;
  let changed = false;
  Object.entries(LEGACY_ID_MAP).forEach(([legacyKey, newId]) => {
    if (typeof map[legacyKey] === 'string' && map[legacyKey].trim()) {
      if (!map[newId]) {
        map[newId] = isTitleMap ? normalizeNumberedTitle(newId, map[legacyKey]) : map[legacyKey];
      }
      delete map[legacyKey];
      changed = true;
    }
  });
  if (isTitleMap) {
    Object.keys(map).forEach((k) => {
      const normalized = normalizeNumberedTitle(k, map[k]);
      if (normalized !== map[k]) {
        map[k] = normalized;
        changed = true;
      }
    });
  }
  return changed;
}

function mergeAnnexesWithStorage(baseAnnexes, titlesMap, descriptionsMap) {
  const safeTitles = { ...(titlesMap || {}) };
  const safeDescs = { ...(descriptionsMap || {}) };
  migrateLegacyStorageMap(safeTitles, true);
  migrateLegacyStorageMap(safeDescs, false);

  return baseAnnexes.map((item) => {
    const customTitle = typeof safeTitles[item.id] === 'string' ? safeTitles[item.id].trim() : '';
    const customDesc = typeof safeDescs[item.id] === 'string' ? safeDescs[item.id].trim() : '';
    return {
      ...item,
      title: customTitle || item.title,
      description: customDesc || item.description,
    };
  });
}

/**
 * Respaldo local en IndexedDB para que los archivos cargados por el usuario
 * se mantengan disponibles incluso si recarga la pestaña en su navegador.
 */
let filesDatabasePromise = null;

function openFilesDatabase() {
  // Se reutiliza una sola conexión a IndexedDB durante toda la sesión
  if (filesDatabasePromise) return filesDatabasePromise;

  filesDatabasePromise = new Promise((resolve) => {
    if (typeof indexedDB === 'undefined') {
      resolve(null);
      return;
    }
    try {
      const request = indexedDB.open(IDB_CONFIG.dbName, IDB_CONFIG.dbVersion);
      request.onupgradeneeded = () => {
        const db = request.result;
        if (!db.objectStoreNames.contains(IDB_CONFIG.storeName)) {
          db.createObjectStore(IDB_CONFIG.storeName, { keyPath: 'annexId' });
        }
        // Almacén del histórico de versiones (v2): una fila por cada archivo subido o restaurado
        if (!db.objectStoreNames.contains(IDB_CONFIG.versionsStoreName)) {
          const versionsStore = db.createObjectStore(IDB_CONFIG.versionsStoreName, {
            keyPath: 'versionId',
            autoIncrement: true,
          });
          versionsStore.createIndex('annexId', 'annexId', { unique: false });
        }
      };
      request.onsuccess = () => {
        const db = request.result;
        // Si otra pestaña necesita actualizar el esquema, se libera esta conexión para no bloquearla
        db.onversionchange = () => {
          db.close();
          filesDatabasePromise = null;
        };
        resolve(db);
      };
      request.onerror = () => {
        filesDatabasePromise = null;
        resolve(null);
      };
    } catch {
      filesDatabasePromise = null;
      resolve(null);
    }
  });
  return filesDatabasePromise;
}

async function saveFileToIndexedDB(annexId, file, ext) {
  const db = await openFilesDatabase();
  if (!db) return;
  try {
    const tx = db.transaction(IDB_CONFIG.storeName, 'readwrite');
    tx.objectStore(IDB_CONFIG.storeName).put({
      annexId,
      file,
      name: file.name,
      size: file.size,
      ext,
      updatedAt: Date.now(),
    });
  } catch {
    // Continuar con URL.createObjectURL en sesión
  }
}

async function deleteFileFromIndexedDB(annexId) {
  const db = await openFilesDatabase();
  if (!db) return;
  try {
    const tx = db.transaction(IDB_CONFIG.storeName, 'readwrite');
    tx.objectStore(IDB_CONFIG.storeName).delete(annexId);
  } catch {
    // Silencioso
  }
}

async function loadAllFilesFromIndexedDB() {
  const db = await openFilesDatabase();
  if (!db) return [];
  return new Promise((resolve) => {
    try {
      const tx = db.transaction(IDB_CONFIG.storeName, 'readonly');
      const req = tx.objectStore(IDB_CONFIG.storeName).getAll();
      req.onsuccess = () => resolve(Array.isArray(req.result) ? req.result : []);
      req.onerror = () => resolve([]);
    } catch {
      resolve([]);
    }
  });
}

/* ==========================================================================
   3b. Control de versiones e histórico por anexo (IndexedDB)
       Cada archivo subido o restaurado queda registrado como una versión
       numerada (v1, v2, v3…) que se puede ver, descargar, restaurar o eliminar.
   ========================================================================== */

function idbRequestToPromise(request) {
  return new Promise((resolve) => {
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => resolve(null);
  });
}

function idbTransactionDone(tx) {
  return new Promise((resolve) => {
    tx.oncomplete = () => resolve(true);
    tx.onerror = () => resolve(false);
    tx.onabort = () => resolve(false);
  });
}

/** Número que corresponde a la siguiente versión de un anexo (máximo existente + 1). */
function getNextVersionNumber(versions) {
  if (!Array.isArray(versions)) return 1;
  return versions.reduce((max, v) => Math.max(max, Number(v && v.numero) || 0), 0) + 1;
}

/** Devuelve las versiones de un anexo ordenadas de la más reciente a la más antigua. */
function sortVersionsDescending(versions) {
  return [...(versions || [])].sort((a, b) => (b.numero || 0) - (a.numero || 0));
}

async function listVersionsFromIndexedDB(annexId) {
  const db = await openFilesDatabase();
  if (!db) return [];
  try {
    const tx = db.transaction(IDB_CONFIG.versionsStoreName, 'readonly');
    const rows = await idbRequestToPromise(tx.objectStore(IDB_CONFIG.versionsStoreName).index('annexId').getAll(annexId));
    return sortVersionsDescending(Array.isArray(rows) ? rows : []);
  } catch {
    return [];
  }
}

async function addVersionToIndexedDB(annexId, file, ext, extra = {}) {
  const db = await openFilesDatabase();
  if (!db) return null;
  try {
    const existing = await listVersionsFromIndexedDB(annexId);
    const record = {
      annexId,
      numero: getNextVersionNumber(existing),
      file,
      name: file.name,
      size: file.size,
      ext,
      subidoEn: Date.now(),
      restauradaDe: extra.restauradaDe || null,
    };
    const tx = db.transaction(IDB_CONFIG.versionsStoreName, 'readwrite');
    const done = idbTransactionDone(tx);
    const key = await idbRequestToPromise(tx.objectStore(IDB_CONFIG.versionsStoreName).add(record));
    await done;
    return key === null ? null : { ...record, versionId: key };
  } catch {
    return null;
  }
}

async function deleteVersionFromIndexedDB(versionId) {
  const db = await openFilesDatabase();
  if (!db) return false;
  try {
    const tx = db.transaction(IDB_CONFIG.versionsStoreName, 'readwrite');
    const done = idbTransactionDone(tx);
    tx.objectStore(IDB_CONFIG.versionsStoreName).delete(versionId);
    return await done;
  } catch {
    return false;
  }
}

/* ==========================================================================
   4. Previsualizador local nativo para archivos Office (.docx, .xlsx, .pptx)
      Extrae el contenido XML del contenedor ZIP usando Web APIs nativas
      (DataView + DecompressionStream + DOMParser) sin librerías externas.
   ========================================================================== */

async function extractZipEntries(file) {
  const buffer = await file.arrayBuffer();
  const view = new DataView(buffer);
  const bytes = new Uint8Array(buffer);
  const decoder = new TextDecoder('utf-8');
  const entries = new Map();

  // Buscar End of Central Directory (EOCD)
  let eocdOffset = -1;
  const minEocdOffset = Math.max(0, bytes.length - 65557);
  for (let i = bytes.length - 22; i >= minEocdOffset; i--) {
    if (view.getUint32(i, true) === 0x06054b50) {
      eocdOffset = i;
      break;
    }
  }
  if (eocdOffset < 0) return entries;

  const totalEntries = view.getUint16(eocdOffset + 10, true);
  let cdOffset = view.getUint32(eocdOffset + 16, true);

  for (let i = 0; i < totalEntries && cdOffset + 46 <= bytes.length; i++) {
    if (view.getUint32(cdOffset, true) !== 0x02014b50) break;
    const compression = view.getUint16(cdOffset + 10, true);
    const compressedSize = view.getUint32(cdOffset + 20, true);
    const fileNameLen = view.getUint16(cdOffset + 28, true);
    const extraLen = view.getUint16(cdOffset + 30, true);
    const commentLen = view.getUint16(cdOffset + 32, true);
    const localHeaderOffset = view.getUint32(cdOffset + 42, true);

    const nameBytes = bytes.subarray(cdOffset + 46, cdOffset + 46 + fileNameLen);
    const rawEntryName = decoder.decode(nameBytes);
    const entryName = rawEntryName.replace(/\\/g, '/').replace(/^\/+/, '');

    if (localHeaderOffset + 30 <= bytes.length && view.getUint32(localHeaderOffset, true) === 0x04034b50) {
      const localNameLen = view.getUint16(localHeaderOffset + 26, true);
      const localExtraLen = view.getUint16(localHeaderOffset + 28, true);
      const dataStart = localHeaderOffset + 30 + localNameLen + localExtraLen;
      const compressedData = bytes.subarray(dataStart, dataStart + compressedSize);

      entries.set(entryName, { compression, compressedData });
    }

    cdOffset += 46 + fileNameLen + extraLen + commentLen;
  }

  return entries;
}

async function readZipEntryBytes(entries, entryPath) {
  const normalizedPath = String(entryPath || '').replace(/\\/g, '/').replace(/^\/+/, '');
  let entry = entries.get(normalizedPath);
  if (!entry) {
    const lowerTarget = normalizedPath.toLowerCase();
    for (const [k, v] of entries.entries()) {
      if (k.toLowerCase() === lowerTarget) {
        entry = v;
        break;
      }
    }
  }
  if (!entry) return null;

  if (entry.compression === 0) {
    return entry.compressedData;
  }

  if (entry.compressedData.byteLength === 0) {
    return new Uint8Array(0);
  }

  if (entry.compression === 8 && typeof DecompressionStream !== 'undefined') {
    try {
      const stream = new Blob([entry.compressedData])
        .stream()
        .pipeThrough(new DecompressionStream('deflate-raw'));
      const arrayBuffer = await new Response(stream).arrayBuffer();
      return new Uint8Array(arrayBuffer);
    } catch {
      return null;
    }
  }

  return null;
}

async function readZipEntryText(entries, entryPath) {
  const bytes = await readZipEntryBytes(entries, entryPath);
  if (!bytes) return null;
  return new TextDecoder('utf-8').decode(bytes);
}

function getMediaMimeType(entryPath) {
  const ext = getFileExtension(entryPath);
  const mimeMap = {
    png: 'image/png',
    jpg: 'image/jpeg',
    jpeg: 'image/jpeg',
    gif: 'image/gif',
    webp: 'image/webp',
    svg: 'image/svg+xml',
    bmp: 'image/bmp',
    tif: 'image/tiff',
    tiff: 'image/tiff',
  };
  return mimeMap[ext] || '';
}

function resolveZipRelTarget(baseFolder, target) {
  if (typeof target !== 'string' || !target.trim()) return '';
  const clean = target.trim().replace(/\\/g, '/');
  if (clean.startsWith('/')) return clean.slice(1);
  if (clean.startsWith('../')) {
    return clean.replace(/^(\.\.\/)+/, '');
  }
  if (baseFolder && !clean.startsWith(`${baseFolder}/`)) {
    return `${baseFolder}/${clean}`;
  }
  return clean;
}

async function buildOfficeMediaMap(entries, prefix) {
  const mediaUrls = new Map();
  for (const key of entries.keys()) {
    if (!key.toLowerCase().startsWith(prefix.toLowerCase())) continue;
    const mime = getMediaMimeType(key);
    if (!mime) continue;
    const bytes = await readZipEntryBytes(entries, key);
    if (bytes && bytes.byteLength > 0) {
      const blob = new Blob([bytes], { type: mime });
      mediaUrls.set(key, URL.createObjectURL(blob));
    }
  }
  return mediaUrls;
}

async function parseOfficeRels(entries, relsPath, baseFolder, parser) {
  const relMap = new Map();
  const relsXml = await readZipEntryText(entries, relsPath);
  if (!relsXml) return relMap;
  const relsDoc = parser.parseFromString(relsXml, 'application/xml');
  Array.from(relsDoc.getElementsByTagName('Relationship')).forEach((rel) => {
    const id = rel.getAttribute('Id');
    const target = rel.getAttribute('Target');
    if (id && target) {
      relMap.set(id, resolveZipRelTarget(baseFolder, target));
    }
  });
  return relMap;
}

function findReferencedMediaPaths(xmlNode, relMap, mediaUrls) {
  const found = [];
  if (!xmlNode || !xmlNode.getElementsByTagName) return found;
  const elements = [xmlNode, ...Array.from(xmlNode.getElementsByTagName('*'))];
  elements.forEach((el) => {
    if (!el.attributes) return;
    for (let i = 0; i < el.attributes.length; i++) {
      const val = el.attributes[i].value;
      if (relMap.has(val)) {
        const targetPath = relMap.get(val);
        if (mediaUrls.has(targetPath) && !found.includes(targetPath)) {
          found.push(targetPath);
        }
      }
    }
  });
  return found;
}

function getPageLabel(pagesMap, itemId) {
  const raw = pagesMap && typeof pagesMap[itemId] === 'string' ? pagesMap[itemId].trim() : '';
  return raw ? `Pág. ${raw}` : 'Pág. ___';
}

function createEmbeddedImageFigure(blobUrl, captionText) {
  const figure = document.createElement('figure');
  figure.className = 'office-doc-figure';
  const img = document.createElement('img');
  img.className = 'office-embedded-image';
  img.src = blobUrl;
  img.alt = captionText || 'Imagen integrada en el documento';
  img.decoding = 'async';
  figure.appendChild(img);
  return figure;
}

/* --------------------------------------------------------------------------
   Utilidades de lectura para hojas de cálculo Excel (.xlsx)
   -------------------------------------------------------------------------- */

function colIndexToLetter(index) {
  let col = Number(index);
  let label = '';
  while (col >= 0) {
    label = String.fromCharCode((col % 26) + 65) + label;
    col = Math.floor(col / 26) - 1;
  }
  return label;
}

function letterToColIndex(letters) {
  let col = 0;
  const upper = String(letters || '').toUpperCase();
  for (let i = 0; i < upper.length; i++) {
    col = col * 26 + (upper.charCodeAt(i) - 64);
  }
  return col - 1;
}

function parseCellReference(ref, fallbackRow, fallbackCol) {
  if (typeof ref === 'string') {
    const match = /^([A-Z]+)(\d+)$/i.exec(ref.trim());
    if (match) {
      return {
        row: Number(match[2]) - 1,
        col: letterToColIndex(match[1]),
      };
    }
  }
  return { row: fallbackRow, col: fallbackCol };
}

function normalizeArgbToCss(rgbAttr) {
  if (typeof rgbAttr !== 'string') return '';
  const clean = rgbAttr.trim().replace(/^#/, '');
  if (clean.length === 8) {
    if (clean.toUpperCase().startsWith('00')) return '';
    return `#${clean.slice(2)}`;
  }
  if (clean.length === 6) {
    return `#${clean}`;
  }
  return '';
}

function formatExcelSerialDate(serial) {
  const num = Number(serial);
  if (!Number.isFinite(num) || num <= 0) return String(serial);
  const utcDays = Math.floor(num - 25569);
  const date = new Date(utcDays * 86400 * 1000);
  if (Number.isNaN(date.getTime())) return String(serial);
  const d = String(date.getUTCDate()).padStart(2, '0');
  const m = String(date.getUTCMonth() + 1).padStart(2, '0');
  const y = date.getUTCFullYear();
  return `${d}/${m}/${y}`;
}

function parseExcelStyles(stylesXml, parser) {
  if (!stylesXml) return [];
  const doc = parser.parseFromString(stylesXml, 'application/xml');

  const fonts = Array.from(doc.querySelectorAll('fonts > font')).map((fontEl) => {
    const bold = Boolean(fontEl.getElementsByTagName('b')[0]);
    const italic = Boolean(fontEl.getElementsByTagName('i')[0]);
    const colorEl = fontEl.getElementsByTagName('color')[0];
    const rgb = colorEl ? normalizeArgbToCss(colorEl.getAttribute('rgb')) : '';
    const textColor = rgb && rgb.toUpperCase() !== '#000000' ? rgb : '';
    return { bold, italic, textColor };
  });

  const fills = Array.from(doc.querySelectorAll('fills > fill')).map((fillEl) => {
    const pattern = fillEl.getElementsByTagName('patternFill')[0];
    if (!pattern) return '';
    const patternType = pattern.getAttribute('patternType') || '';
    if (patternType === 'none' || patternType === 'gray125') return '';
    const fg = pattern.getElementsByTagName('fgColor')[0];
    const bgColor = fg ? normalizeArgbToCss(fg.getAttribute('rgb')) : '';
    if (!bgColor || bgColor.toUpperCase() === '#FFFFFF' || bgColor.toUpperCase() === '#000000') return '';
    return bgColor;
  });

  const xfs = Array.from(doc.querySelectorAll('cellXfs > xf')).map((xf) => {
    const fontId = Number(xf.getAttribute('fontId') || 0);
    const fillId = Number(xf.getAttribute('fillId') || 0);
    const numFmtId = Number(xf.getAttribute('numFmtId') || 0);
    const alignmentEl = xf.getElementsByTagName('alignment')[0];
    const align = alignmentEl ? alignmentEl.getAttribute('horizontal') || '' : '';
    const font = fonts[fontId] || {};
    const bgColor = fills[fillId] || '';
    return {
      bold: Boolean(font.bold),
      italic: Boolean(font.italic),
      textColor: font.textColor || '',
      bgColor,
      numFmtId,
      align: ['left', 'center', 'right'].includes(align) ? align : '',
    };
  });

  return xfs;
}

async function resolveExcelSheets(entries, parser) {
  const wbXml = await readZipEntryText(entries, 'xl/workbook.xml');
  if (wbXml) {
    const wbDoc = parser.parseFromString(wbXml, 'application/xml');
    const relMap = await parseOfficeRels(entries, 'xl/_rels/workbook.xml.rels', 'xl', parser);
    const sheets = [];
    Array.from(wbDoc.getElementsByTagName('sheet')).forEach((sheetEl, idx) => {
      const name = sheetEl.getAttribute('name') || `Hoja ${idx + 1}`;
      const rId = sheetEl.getAttribute('r:id') || sheetEl.getAttribute('id') || '';
      const targetPath = relMap.get(rId);
      if (targetPath && entries.has(targetPath)) {
        sheets.push({ name, path: targetPath });
      }
    });
    if (sheets.length > 0) return sheets;
  }

  return Array.from(entries.keys())
    .filter((k) => /^xl\/worksheets\/sheet\d+\.xml$/i.test(k))
    .sort((a, b) => {
      const na = Number((a.match(/sheet(\d+)\.xml/i) || [])[1] || 0);
      const nb = Number((b.match(/sheet(\d+)\.xml/i) || [])[1] || 0);
      return na - nb;
    })
    .map((sheetPath, idx) => ({ name: `Hoja ${idx + 1}`, path: sheetPath }));
}

function buildExcelSheetGrid(sDoc, sharedStrings, cellStyles) {
  const cells = new Map();
  const merges = new Map();
  const skipped = new Set();
  let maxRow = -1;
  let maxCol = -1;

  const MAX_RENDER_ROWS = 400;
  const MAX_RENDER_COLS = 40;

  Array.from(sDoc.getElementsByTagName('mergeCell')).forEach((mc) => {
    const ref = mc.getAttribute('ref') || '';
    const parts = ref.split(':');
    if (parts.length !== 2) return;
    const start = parseCellReference(parts[0], 0, 0);
    const end = parseCellReference(parts[1], 0, 0);
    if (start.row >= MAX_RENDER_ROWS || start.col >= MAX_RENDER_COLS) return;
    const cappedEndRow = Math.min(end.row, MAX_RENDER_ROWS - 1);
    const cappedEndCol = Math.min(end.col, MAX_RENDER_COLS - 1);
    const rowSpan = cappedEndRow - start.row + 1;
    const colSpan = cappedEndCol - start.col + 1;
    merges.set(`${start.row}:${start.col}`, { rowSpan, colSpan });
    for (let r = start.row; r <= cappedEndRow; r++) {
      for (let c = start.col; c <= cappedEndCol; c++) {
        if (r !== start.row || c !== start.col) {
          skipped.add(`${r}:${c}`);
        }
      }
    }
    maxRow = Math.max(maxRow, cappedEndRow);
    maxCol = Math.max(maxCol, cappedEndCol);
  });

  const rows = Array.from(sDoc.getElementsByTagName('row'));
  rows.forEach((rowEl, rFallback) => {
    const rowAttr = rowEl.getAttribute('r');
    const rowIdx = rowAttr ? Number(rowAttr) - 1 : rFallback;
    if (rowIdx < 0 || rowIdx >= MAX_RENDER_ROWS) return;

    const cNodes = Array.from(rowEl.getElementsByTagName('c'));
    cNodes.forEach((cEl, cFallback) => {
      const pos = parseCellReference(cEl.getAttribute('r'), rowIdx, cFallback);
      if (pos.row < 0 || pos.col < 0 || pos.row >= MAX_RENDER_ROWS || pos.col >= MAX_RENDER_COLS) return;

      const type = cEl.getAttribute('t') || '';
      const styleIdx = Number(cEl.getAttribute('s') || 0);
      const style = cellStyles[styleIdx] || null;
      const vNode = cEl.getElementsByTagName('v')[0];
      const isNode = cEl.getElementsByTagName('is')[0];

      let text = '';
      let isNumeric = false;

      if (type === 's' && vNode) {
        text = sharedStrings[Number(vNode.textContent || 0)] ?? '';
      } else if (type === 'inlineStr' && isNode) {
        const tNodes = Array.from(isNode.getElementsByTagName('t'));
        text = tNodes.length > 0 ? tNodes.map((t) => t.textContent || '').join('') : isNode.textContent || '';
      } else if (type === 'str' || type === 'e') {
        text = vNode ? vNode.textContent || '' : '';
      } else if (type === 'b' && vNode) {
        text = vNode.textContent === '1' ? 'VERDADERO' : 'FALSO';
      } else if (vNode && vNode.textContent !== null && vNode.textContent !== '') {
        const raw = vNode.textContent;
        const num = Number(raw);
        if (style && style.numFmtId >= 14 && style.numFmtId <= 22 && Number.isFinite(num)) {
          text = formatExcelSerialDate(num);
        } else if (Number.isFinite(num)) {
          isNumeric = true;
          text = raw.includes('.') && !Number.isInteger(num) ? String(Number(num.toFixed(4))) : raw;
        } else {
          text = raw;
        }
      }

      if (text !== '' || (style && style.bgColor)) {
        cells.set(`${pos.row}:${pos.col}`, { text, isNumeric, style });
        maxRow = Math.max(maxRow, pos.row);
        maxCol = Math.max(maxCol, pos.col);
      }
    });
  });

  return { cells, merges, skipped, maxRow, maxCol };
}

async function renderLocalOfficePreview(file, ext, container) {
  container.innerHTML = '<p class="office-preview-box__meta">Procesando vista previa del documento...</p>';

  try {
    const entries = await extractZipEntries(file);
    if (entries.size === 0 && ext === 'xls') {
      throw new Error('Archivo Excel binario (.xls 97-2003)');
    }
    const parser = new DOMParser();

    if (ext === 'docx') {
      const xmlText = await readZipEntryText(entries, 'word/document.xml');
      if (!xmlText) throw new Error('No se encontró word/document.xml');
      const xmlDoc = parser.parseFromString(xmlText, 'application/xml');
      const mediaUrls = await buildOfficeMediaMap(entries, 'word/media/');
      const relMap = await parseOfficeRels(entries, 'word/_rels/document.xml.rels', 'word', parser);
      const renderedMedia = new Set();

      const sheet = document.createElement('div');
      sheet.className = 'office-doc-sheet';

      const bodyNode = xmlDoc.getElementsByTagName('w:body')[0] || xmlDoc.documentElement;
      const children = Array.from(bodyNode.children || []);
      let hasContent = false;

      const appendImagesFromNode = (node, targetContainer) => {
        const mediaPaths = findReferencedMediaPaths(node, relMap, mediaUrls);
        mediaPaths.forEach((mPath) => {
          const url = mediaUrls.get(mPath);
          if (url) {
            targetContainer.appendChild(createEmbeddedImageFigure(url, file.name));
            renderedMedia.add(mPath);
            hasContent = true;
          }
        });
      };

      children.forEach((node) => {
        if (node.tagName === 'w:p') {
          const texts = Array.from(node.getElementsByTagName('w:t')).map((t) => t.textContent || '');
          const line = texts.join('').trim();
          if (line) {
            hasContent = true;
            const pStyle = node.getElementsByTagName('w:pStyle')[0];
            const styleVal = pStyle ? pStyle.getAttribute('w:val') || '' : '';
            const el = /Heading|Titulo|Ttulo/i.test(styleVal) ? document.createElement('h3') : document.createElement('p');
            el.textContent = line;
            sheet.appendChild(el);
          }
          appendImagesFromNode(node, sheet);
        } else if (node.tagName === 'w:tbl') {
          const tableWrap = document.createElement('div');
          tableWrap.className = 'office-table-wrap';
          const table = document.createElement('table');
          table.className = 'office-table';
          const rows = Array.from(node.getElementsByTagName('w:tr'));
          rows.forEach((row, rIdx) => {
            const tr = document.createElement('tr');
            const cells = Array.from(row.getElementsByTagName('w:tc'));
            cells.forEach((cell) => {
              const cellEl = document.createElement(rIdx === 0 ? 'th' : 'td');
              const cellTexts = Array.from(cell.getElementsByTagName('w:t')).map((t) => t.textContent || '');
              cellEl.textContent = cellTexts.join(' ').trim();
              appendImagesFromNode(cell, cellEl);
              tr.appendChild(cellEl);
            });
            table.appendChild(tr);
          });
          tableWrap.appendChild(table);
          sheet.appendChild(tableWrap);
          hasContent = true;
        } else {
          appendImagesFromNode(node, sheet);
        }
      });

      // Mostrar cualquier imagen en word/media/ que no haya sido referenciada directamente en un párrafo estándar
      mediaUrls.forEach((url, mPath) => {
        if (!renderedMedia.has(mPath)) {
          sheet.appendChild(createEmbeddedImageFigure(url, file.name));
          renderedMedia.add(mPath);
          hasContent = true;
        }
      });

      if (!hasContent) {
        const fallback = document.createElement('p');
        fallback.textContent = 'Documento Word cargado correctamente (sin contenido de texto o imagen detectado).';
        sheet.appendChild(fallback);
      }

      container.innerHTML = '';
      container.appendChild(sheet);
      return;
    }

    if (ext === 'xlsx') {
      const sharedXml = await readZipEntryText(entries, 'xl/sharedStrings.xml');
      const sharedStrings = [];
      if (sharedXml) {
        const sDoc = parser.parseFromString(sharedXml, 'application/xml');
        Array.from(sDoc.getElementsByTagName('si')).forEach((si) => {
          const parts = Array.from(si.getElementsByTagName('t')).map((t) => t.textContent || '');
          sharedStrings.push(parts.join(''));
        });
      }

      const stylesXml = await readZipEntryText(entries, 'xl/styles.xml');
      const cellStyles = parseExcelStyles(stylesXml, parser);
      const sheetList = await resolveExcelSheets(entries, parser);
      const excelMediaUrls = await buildOfficeMediaMap(entries, 'xl/media/');

      if (sheetList.length === 0) throw new Error('No se encontraron hojas en el libro Excel');

      container.innerHTML = '';
      const tabsBar = document.createElement('div');
      tabsBar.className = 'office-sheet-tabs';
      const tableHolder = document.createElement('div');
      tableHolder.className = 'office-table-wrap office-table-wrap--excel';

      const renderSheet = async (sheetInfo, activeIdx) => {
        Array.from(tabsBar.children).forEach((btn, idx) => {
          btn.classList.toggle('is-active', idx === activeIdx);
        });
        const sheetXml = await readZipEntryText(entries, sheetInfo.path);
        if (!sheetXml) return;
        const sDoc = parser.parseFromString(sheetXml, 'application/xml');

        const gridData = buildExcelSheetGrid(sDoc, sharedStrings, cellStyles);
        tableHolder.innerHTML = '';

        if (gridData.maxRow < 0 || gridData.maxCol < 0) {
          const emptyMsg = document.createElement('p');
          emptyMsg.className = 'office-preview-box__meta';
          emptyMsg.textContent = 'Esta hoja de cálculo no contiene celdas con datos.';
          tableHolder.appendChild(emptyMsg);
        } else {
          const table = document.createElement('table');
          table.className = 'office-table office-table--excel';

          // Cabecera de letras de columna estilo Excel (A, B, C...)
          const thead = document.createElement('thead');
          const headTr = document.createElement('tr');
          const cornerTh = document.createElement('th');
          cornerTh.className = 'excel-corner-cell';
          cornerTh.textContent = '#';
          headTr.appendChild(cornerTh);

          for (let c = 0; c <= gridData.maxCol; c++) {
            const colTh = document.createElement('th');
            colTh.className = 'excel-col-header';
            colTh.textContent = colIndexToLetter(c);
            headTr.appendChild(colTh);
          }
          thead.appendChild(headTr);
          table.appendChild(thead);

          const tbody = document.createElement('tbody');
          for (let r = 0; r <= gridData.maxRow; r++) {
            const tr = document.createElement('tr');
            const rowNumTh = document.createElement('th');
            rowNumTh.className = 'excel-row-header tabular-nums';
            rowNumTh.textContent = String(r + 1);
            tr.appendChild(rowNumTh);

            for (let c = 0; c <= gridData.maxCol; c++) {
              const key = `${r}:${c}`;
              if (gridData.skipped.has(key)) continue;

              const cellInfo = gridData.cells.get(key);
              const td = document.createElement('td');
              const merge = gridData.merges.get(key);
              if (merge) {
                if (merge.colSpan > 1) td.colSpan = merge.colSpan;
                if (merge.rowSpan > 1) td.rowSpan = merge.rowSpan;
              }

              if (cellInfo) {
                td.textContent = cellInfo.text;
                if (cellInfo.isNumeric) td.classList.add('excel-cell--num');
                if (cellInfo.style) {
                  if (cellInfo.style.bold) td.style.fontWeight = '700';
                  if (cellInfo.style.italic) td.style.fontStyle = 'italic';
                  if (cellInfo.style.bgColor) td.style.backgroundColor = cellInfo.style.bgColor;
                  if (cellInfo.style.textColor) td.style.color = cellInfo.style.textColor;
                  if (cellInfo.style.align) td.style.textAlign = cellInfo.style.align;
                }
              }
              tr.appendChild(td);
            }
            tbody.appendChild(tr);
          }
          table.appendChild(tbody);
          tableHolder.appendChild(table);
        }

        // Si el libro Excel contiene imágenes o diagramas incrustados en xl/media/, mostrarlos debajo
        if (excelMediaUrls.size > 0 && activeIdx === 0) {
          excelMediaUrls.forEach((url) => {
            tableHolder.appendChild(createEmbeddedImageFigure(url, sheetInfo.name));
          });
        }
      };

      sheetList.forEach((sheetInfo, idx) => {
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = `btn-outline-sm${idx === 0 ? ' is-active' : ''}`;
        btn.textContent = sheetInfo.name;
        btn.addEventListener('click', () => renderSheet(sheetInfo, idx));
        tabsBar.appendChild(btn);
      });

      container.appendChild(tabsBar);
      container.appendChild(tableHolder);
      await renderSheet(sheetList[0], 0);
      return;
    }

    if (ext === 'pptx') {
      const slideKeys = Array.from(entries.keys())
        .filter((k) => /^ppt\/slides\/slide\d+\.xml$/i.test(k))
        .sort((a, b) => {
          const na = Number((a.match(/slide(\d+)\.xml/i) || [])[1] || 0);
          const nb = Number((b.match(/slide(\d+)\.xml/i) || [])[1] || 0);
          return na - nb;
        });

      if (slideKeys.length === 0) throw new Error('No se encontraron diapositivas');

      const pptMediaUrls = await buildOfficeMediaMap(entries, 'ppt/media/');
      const grid = document.createElement('div');
      grid.className = 'office-slides-grid';

      for (let i = 0; i < slideKeys.length; i++) {
        const slideKey = slideKeys[i];
        const slideFileName = slideKey.split('/').pop();
        const slideRelsPath = `ppt/slides/_rels/${slideFileName}.rels`;
        const slideRelMap = await parseOfficeRels(entries, slideRelsPath, 'ppt', parser);
        const slideXml = await readZipEntryText(entries, slideKey);
        if (!slideXml) continue;
        const sDoc = parser.parseFromString(slideXml, 'application/xml');
        const paragraphs = Array.from(sDoc.getElementsByTagName('a:p'))
          .map((p) =>
            Array.from(p.getElementsByTagName('a:t'))
              .map((t) => t.textContent || '')
              .join('')
              .trim()
          )
          .filter(Boolean);

        const slideImages = findReferencedMediaPaths(sDoc.documentElement, slideRelMap, pptMediaUrls);

        const card = document.createElement('article');
        card.className = 'office-slide-card';

        const badge = document.createElement('span');
        badge.className = 'office-slide-card__badge';
        badge.textContent = `Diapositiva ${i + 1}`;

        const body = document.createElement('div');
        body.className = 'office-slide-card__body';

        paragraphs.forEach((line, lIdx) => {
          const p = document.createElement('p');
          if (lIdx === 0) p.style.fontWeight = '700';
          p.textContent = line;
          body.appendChild(p);
        });

        slideImages.forEach((mPath) => {
          const url = pptMediaUrls.get(mPath);
          if (url) {
            body.appendChild(createEmbeddedImageFigure(url, `Diapositiva ${i + 1}`));
          }
        });

        if (paragraphs.length === 0 && slideImages.length === 0) {
          const p = document.createElement('p');
          p.textContent = '(Diapositiva visual / gráfica)';
          body.appendChild(p);
        }

        card.appendChild(badge);
        card.appendChild(body);
        grid.appendChild(card);
      }

      container.innerHTML = '';
      container.appendChild(grid);
      return;
    }

    throw new Error('Formato binario clásico');
  } catch (err) {
    container.innerHTML = '';
    const infoP = document.createElement('p');
    infoP.className = 'office-preview-box__notice';
    if (ext === 'xls' || ext === 'doc' || ext === 'ppt') {
      infoP.textContent =
        `El formato binario antiguo (.${ext}) no se puede renderizar directamente en el navegador sin servidor. Guárdalo como .${ext}x (Excel/Word/PowerPoint moderno) para previsualizarlo aquí al instante, vincúlalo por URL pública HTTPS para Microsoft Office Online / Google Docs Viewer, o descárgalo directamente.`;
    } else {
      infoP.textContent =
        'Este archivo de Office está listo para descargarse. Para usar el visor externo de Microsoft Office Online o Google Docs Viewer, vincula su URL pública HTTPS en el panel lateral.';
    }
    container.appendChild(infoP);
  }
}

/* ==========================================================================
   5. Aplicación interactiva en el DOM
   ========================================================================== */

function initPortfolioApp() {
  const resetNamesBtn = document.getElementById('reset-names-btn');
  const loadedCounterEl = document.getElementById('loaded-counter');

  // Video de presentación al inicio de la página
  const heroVideoDropzone = document.getElementById('hero-video-dropzone');
  const heroVideoEmpty = document.getElementById('hero-video-empty');
  const heroVideoPlayer = document.getElementById('hero-video-player');
  const heroVideoInput = document.getElementById('hero-video-input');
  const heroVideoUploadBtn = document.getElementById('hero-video-upload-btn');
  const heroVideoEmptyBtn = document.getElementById('hero-video-empty-btn');
  const heroVideoDownloadLink = document.getElementById('hero-video-download-link');
  const heroVideoRemoveBtn = document.getElementById('hero-video-remove-btn');
  const heroVideoFilename = document.getElementById('hero-video-filename');
  const heroVideoSpeeds = document.getElementById('hero-video-speeds');
  const heroVideoError = document.getElementById('hero-video-error');

  // Modal portada institucional
  const coverModal = document.getElementById('cover-modal');
  const openCoverModalBtn = document.getElementById('open-cover-modal-btn');
  const closeCoverModalBtn = document.getElementById('close-cover-modal-btn');
  const enterPortfolioBtn = document.getElementById('enter-portfolio-btn');

  // Compartir / Importar
  const sharePortfolioBtn = document.getElementById('share-portfolio-btn');
  const importPackageBtn = document.getElementById('import-package-btn');
  const importPackageInput = document.getElementById('import-package-input');
  const shareModal = document.getElementById('share-modal');
  const closeShareModalBtn = document.getElementById('close-share-modal-btn');
  const exportPackageBtn = document.getElementById('export-package-btn');
  const exportManifestBtn = document.getElementById('export-manifest-btn');
  const shareStatusMsg = document.getElementById('share-status-msg');

  // Lightbox para ampliación de imágenes al hacer clic
  const imageLightbox = document.getElementById('image-lightbox');
  const lightboxImg = document.getElementById('lightbox-img');
  const lightboxCaption = document.getElementById('lightbox-caption');
  const lightboxZoomIn = document.getElementById('lightbox-zoom-in');
  const lightboxZoomOut = document.getElementById('lightbox-zoom-out');
  const lightboxZoomReset = document.getElementById('lightbox-zoom-reset');
  const lightboxZoomLabel = document.getElementById('lightbox-zoom-label');
  const lightboxCloseBtn = document.getElementById('lightbox-close-btn');

  // Espacio de trabajo del portafolio
  const workspaceGrid = document.getElementById('workspace-grid');
  const projectionModeBtn = document.getElementById('projection-mode-btn');
  const projectionModeLabel = document.getElementById('projection-mode-label');

  const annexButtonsList = document.getElementById('annex-buttons-list');
  const annexDrawer = document.getElementById('annex-drawer');
  const annexDrawerInner = document.getElementById('annex-drawer-inner');
  const closeDrawerBtn = document.getElementById('close-drawer-btn');
  const toggleDrawerBtn = document.getElementById('toggle-drawer-btn');
  const toggleDrawerLabel = document.getElementById('toggle-drawer-label');

  const drawerCodeLabel = document.getElementById('drawer-code-label');
  const drawerAcceptedLabel = document.getElementById('drawer-accepted-label');
  const annexTitleInput = document.getElementById('annex-title-input');
  const saveTitleBtn = document.getElementById('save-title-btn');
  const titleSaveStatus = document.getElementById('title-save-status');
  const annexPageInput = document.getElementById('annex-page-input');
  const subtitlesPagesBox = document.getElementById('subtitles-pages-box');
  const annexDescInput = document.getElementById('annex-desc-input');

  const dropzone = document.getElementById('dropzone');
  const fileInput = document.getElementById('file-input');
  const dropzoneLimits = document.getElementById('dropzone-limits');
  const selectFileBtn = document.getElementById('select-file-btn');
  const emptyUploadTriggerBtn = document.getElementById('empty-upload-trigger-btn');
  const uploadErrorEl = document.getElementById('upload-error');

  const attachedFileCard = document.getElementById('attached-file-card');
  const attachedExtTag = document.getElementById('attached-ext-tag');
  const attachedFileName = document.getElementById('attached-file-name');
  const attachedFileMeta = document.getElementById('attached-file-meta');
  const replaceFileBtn = document.getElementById('replace-file-btn');
  const drawerDownloadLink = document.getElementById('drawer-download-link');
  const deleteFileBtn = document.getElementById('delete-file-btn');

  const publicUrlBox = document.getElementById('public-url-box');
  const publicUrlInput = document.getElementById('public-url-input');
  const applyPublicUrlBtn = document.getElementById('apply-public-url-btn');

  const versionHistoryList = document.getElementById('version-history-list');
  const versionHistoryCount = document.getElementById('version-history-count');
  const versionHistoryEmpty = document.getElementById('version-history-empty');

  const previewAnnexCode = document.getElementById('preview-annex-code');
  const previewPageBadge = document.getElementById('preview-page-badge');
  const previewHeading = document.getElementById('preview-heading');
  const previewSubtitlesList = document.getElementById('preview-subtitles-list');
  const previewEmpty = document.getElementById('preview-empty');
  const previewEmptyTitle = document.getElementById('preview-empty-title');
  const previewEmptyHint = document.getElementById('preview-empty-hint');
  const previewEmptySubtitles = document.getElementById('preview-empty-subtitles');
  const previewContent = document.getElementById('preview-content');
  const previewOpenTabLink = document.getElementById('preview-open-tab-link');
  const previewDownloadLink = document.getElementById('preview-download-link');

  const zoomControls = document.getElementById('zoom-controls');
  const zoomOutBtn = document.getElementById('zoom-out-btn');
  const zoomInBtn = document.getElementById('zoom-in-btn');
  const zoomResetBtn = document.getElementById('zoom-reset-btn');
  const zoomLevelLabel = document.getElementById('zoom-level-label');

  if (!annexButtonsList || !previewContent) return;

  // Estado persistente y de sesión
  const titlesMap = loadPersistedMap(window.localStorage, STORAGE_KEYS.titles);
  const descriptionsMap = loadPersistedMap(window.localStorage, STORAGE_KEYS.descriptions);
  const publicUrlsMap = loadPersistedMap(window.localStorage, STORAGE_KEYS.publicUrls);
  const pagesMap = loadPersistedMap(window.localStorage, STORAGE_KEYS.pages);

  if (migrateLegacyStorageMap(titlesMap, true)) {
    savePersistedMap(window.localStorage, STORAGE_KEYS.titles, titlesMap);
  }
  if (migrateLegacyStorageMap(descriptionsMap, false)) {
    savePersistedMap(window.localStorage, STORAGE_KEYS.descriptions, descriptionsMap);
  }
  if (migrateLegacyStorageMap(publicUrlsMap, false)) {
    savePersistedMap(window.localStorage, STORAGE_KEYS.publicUrls, publicUrlsMap);
  }

  const state = {
    view: 'annexes',
    annexes: mergeAnnexesWithStorage(DEFAULT_ANNEXES, titlesMap, descriptionsMap),
    activeAnnexId: '1',
    drawerOpen: true,
    projectionMode: false,
    zoomPercent: 100,
    lightboxZoomPercent: 100,
    // Mapa en sesión: { [annexId]: { file, name, size, ext, objectUrl, publicUrl, officeEngine, versionId } }
    sessionFiles: new Map(),
    // Histórico de versiones por anexo
    versionsByAnnex: new Map(),
    // Versión antigua en previsualización temporal
    viewingVersion: null,
  };

  // Inicializar URLs públicas guardadas en localStorage
  Object.keys(publicUrlsMap).forEach((rawAnnexId) => {
    const annexId = LEGACY_ID_MAP[rawAnnexId] || String(rawAnnexId);
    const urlVal = publicUrlsMap[rawAnnexId];
    if (typeof urlVal === 'string' && buildOfficeViewerUrls(urlVal)) {
      state.sessionFiles.set(annexId, {
        file: null,
        name: urlVal.split('/').pop() || `Anexo-${annexId}.docx`,
        size: 0,
        ext: getFileExtension(urlVal) || 'docx',
        objectUrl: '',
        publicUrl: urlVal,
        officeEngine: 'officeOnline',
      });
    }
  });

  // Restaurar archivos guardados en IndexedDB del navegador (migrando automáticamente A..L -> 1..13)
  loadAllFilesFromIndexedDB().then((records) => {
    if (!records || records.length === 0) return;
    records.forEach((rec) => {
      if (rec && rec.annexId && rec.file) {
        const mappedId = LEGACY_ID_MAP[rec.annexId] || String(rec.annexId);
        // Si el registro venía con clave antigua (A..L), respaldarlo con su nuevo número (1..13) y limpiar la clave antigua
        if (rec.annexId !== mappedId) {
          saveFileToIndexedDB(mappedId, rec.file, rec.ext || getFileExtension(rec.file.name)).then(() => {
            deleteFileFromIndexedDB(rec.annexId);
          });
        }
        const existingInSession = state.sessionFiles.get(mappedId);
        if (existingInSession && existingInSession.file && rec.annexId !== mappedId) {
          return;
        }
        const objectUrl = URL.createObjectURL(rec.file);
        const prev = state.sessionFiles.get(mappedId);
        const ext = rec.ext || getFileExtension(rec.file.name);
        state.sessionFiles.set(mappedId, {
          file: rec.file,
          name: rec.name || rec.file.name,
          size: rec.size || rec.file.size,
          ext,
          objectUrl,
          publicUrl: prev ? prev.publicUrl : '',
          officeEngine: ['docx', 'xlsx', 'pptx'].includes(ext) ? 'local' : 'officeOnline',
        });
      }
    });
    // Si hay archivos previos sin histórico, registrarlos como versión 1 y marcar la versión actual
    ensureInitialVersions().then(() => {
      if (state.view === 'annexes') {
        renderVersionHistory();
      }
    });
    if (state.view === 'annexes') {
      renderAll();
    } else {
      updateLoadedCounter();
    }
  });

  // Cargar evidencias publicadas en el repositorio (evidencias/manifest.json) para que cualquier visitante las vea
  loadPublishedManifest();

  function resolvePublicHttpsUrl(relativePath) {
    try {
      if (typeof window === 'undefined' || !window.location) return '';
      const resolved = new URL(relativePath, window.location.href);
      if (resolved.protocol === 'https:' || resolved.protocol === 'http:') {
        return resolved.href;
      }
    } catch {
      // Silencioso en file://
    }
    return '';
  }

  function applyPublishedManifestData(manifest) {
    if (!manifest || !Array.isArray(manifest.annexes)) return;
    let changed = false;

    manifest.annexes.forEach((item) => {
      if (!item || !item.id) return;
      const annexId = String(item.id);
      const annexObj =
        annexId === PRESENTATION_VIDEO_ANNEX.id
          ? PRESENTATION_VIDEO_ANNEX
          : state.annexes.find((a) => a.id === annexId);
      if (!annexObj) return;

      if (typeof item.title === 'string' && item.title.trim() && !titlesMap[annexId]) {
        annexObj.title = item.title.trim();
      }
      if (typeof item.description === 'string' && item.description.trim() && !descriptionsMap[annexId]) {
        annexObj.description = item.description.trim();
      }

      const existing = state.sessionFiles.get(annexId);
      if (existing && existing.file) {
        // El usuario tiene una copia local en su navegador; no la sobrescribimos
        return;
      }

      const ext = item.ext || getFileExtension(item.fileName || item.path || '');
      const publicUrl = item.publicUrl || resolvePublicHttpsUrl(item.path || '');
      if (item.path || publicUrl) {
        state.sessionFiles.set(annexId, {
          file: null,
          name: item.fileName || (item.path ? item.path.split('/').pop() : `Anexo-${annexId}.${ext || 'pdf'}`),
          size: Number(item.size || 0),
          ext,
          objectUrl: '',
          publicUrl,
          publishedPath: item.path || '',
          isPublished: true,
          loadingPublished: false,
          officeEngine: ['docx', 'xlsx', 'pptx'].includes(ext) ? 'local' : 'officeOnline',
        });
        changed = true;
      }
    });

    if (changed) {
      renderAll();
    }
  }

  async function loadPublishedManifest() {
    if (typeof window !== 'undefined' && window.location && window.location.protocol !== 'file:') {
      try {
        const res = await fetch(`./evidencias/manifest.json?t=${Date.now()}`, { cache: 'no-store' });
        if (res.ok) {
          const data = await res.json();
          applyPublishedManifestData(data);
          return;
        }
      } catch {
        // Continuar con respaldo manifest.js
      }
    }
    if (typeof window !== 'undefined' && window.ADSO_PUBLISHED_MANIFEST) {
      applyPublishedManifestData(window.ADSO_PUBLISHED_MANIFEST);
    }
  }

  async function ensurePublishedFileLoaded(annexId, entry) {
    if (!entry || entry.file || !entry.publishedPath || entry.loadingPublished) return;
    entry.loadingPublished = true;
    try {
      const res = await fetch(entry.publishedPath, { cache: 'no-store' });
      if (!res.ok) throw new Error('No disponible');
      const blob = await res.blob();
      const loadedFile = new File([blob], entry.name, { type: blob.type || undefined });
      entry.file = loadedFile;
      entry.size = loadedFile.size || entry.size;
      entry.objectUrl = URL.createObjectURL(loadedFile);
      entry.loadingPublished = false;
      if (state.activeAnnexId === annexId || annexId === PRESENTATION_VIDEO_ANNEX.id) {
        renderAll();
      }
    } catch {
      entry.loadingPublished = false;
    }
  }

  async function ensureInitialVersions() {
    for (const [annexId, entry] of state.sessionFiles) {
      if (!entry.file) continue;
      let versions = await listVersionsFromIndexedDB(annexId);
      if (versions.length === 0) {
        const created = await addVersionToIndexedDB(annexId, entry.file, entry.ext);
        versions = created ? [created] : [];
      }
      state.versionsByAnnex.set(annexId, versions);
      if (versions.length > 0 && !entry.versionId) {
        entry.versionId = versions[0].versionId;
      }
    }
  }

  function getActiveAnnex() {
    return state.annexes.find((a) => a.id === state.activeAnnexId) || state.annexes[0];
  }

  function triggerDrawerSwitchAnimation() {
    if (!annexDrawerInner) return;
    annexDrawerInner.classList.remove('is-switching');
    void annexDrawerInner.offsetWidth;
    annexDrawerInner.classList.add('is-switching');
  }

  function showView(viewName) {
    state.view = viewName || 'annexes';
    renderAll();
  }

  function setDrawerOpen(isOpen) {
    state.drawerOpen = isOpen;
    if (annexDrawer) annexDrawer.classList.toggle('is-collapsed', !isOpen);
    if (toggleDrawerBtn) toggleDrawerBtn.setAttribute('aria-expanded', String(isOpen));
    if (toggleDrawerLabel) toggleDrawerLabel.textContent = isOpen ? 'Ocultar panel' : 'Desplegar panel';
    renderAnnexRail();
  }

  function setProjectionMode(enabled) {
    state.projectionMode = Boolean(enabled);
    if (workspaceGrid) workspaceGrid.classList.toggle('is-projection-mode', state.projectionMode);
    if (projectionModeBtn) {
      projectionModeBtn.setAttribute('aria-pressed', String(state.projectionMode));
      projectionModeBtn.classList.toggle('is-active', state.projectionMode);
    }
    if (projectionModeLabel) {
      projectionModeLabel.textContent = state.projectionMode ? 'Salir de proyección' : 'Modo proyección';
    }
  }

  function applyLightboxZoom() {
    if (!lightboxImg || !lightboxZoomLabel) return;
    lightboxImg.style.transform = `scale(${state.lightboxZoomPercent / 100})`;
    lightboxZoomLabel.textContent = `${state.lightboxZoomPercent}%`;
  }

  function openImageLightbox(src, caption) {
    if (!imageLightbox || !lightboxImg || !src) return;
    state.lightboxZoomPercent = 100;
    lightboxImg.src = src;
    lightboxImg.alt = caption || 'Imagen ampliada';
    if (lightboxCaption) lightboxCaption.textContent = caption || 'Imagen ampliada';
    applyLightboxZoom();
    imageLightbox.hidden = false;
  }

  function closeImageLightbox() {
    if (!imageLightbox) return;
    imageLightbox.hidden = true;
    if (lightboxImg) lightboxImg.src = '';
  }

  function updateLoadedCounter() {
    const loadedSections = state.annexes.filter((a) => state.sessionFiles.has(a.id)).length;
    if (loadedCounterEl) {
      loadedCounterEl.textContent = `${loadedSections} de ${state.annexes.length} con archivo`;
    }
  }

  /* ------------------------------------------------------------------------
     Renderizado del Video de Presentación al inicio de la página
     ------------------------------------------------------------------------ */
  function renderHeroVideo() {
    if (!heroVideoPlayer || !heroVideoEmpty) return;
    const videoEntry = state.sessionFiles.get(PRESENTATION_VIDEO_ANNEX.id);
    const videoSrc = videoEntry ? videoEntry.objectUrl || videoEntry.publishedPath || videoEntry.publicUrl : '';

    if (videoEntry && videoEntry.publishedPath && !videoEntry.file) {
      ensurePublishedFileLoaded(PRESENTATION_VIDEO_ANNEX.id, videoEntry);
    }

    if (videoSrc) {
      heroVideoEmpty.hidden = true;
      heroVideoPlayer.hidden = false;
      if (heroVideoPlayer.getAttribute('src') !== videoSrc) {
        heroVideoPlayer.setAttribute('src', videoSrc);
      }
      if (heroVideoFilename) {
        heroVideoFilename.textContent = `${videoEntry.name} (${formatFileSize(videoEntry.size)})`;
      }
      if (heroVideoSpeeds) heroVideoSpeeds.hidden = false;
      if (heroVideoDownloadLink) {
        heroVideoDownloadLink.hidden = false;
        heroVideoDownloadLink.href = videoSrc;
        heroVideoDownloadLink.setAttribute('download', videoEntry.name || 'presentacion-echele-camello.mp4');
      }
      if (heroVideoRemoveBtn) heroVideoRemoveBtn.hidden = false;
    } else {
      heroVideoPlayer.pause();
      heroVideoPlayer.removeAttribute('src');
      heroVideoPlayer.hidden = true;
      heroVideoEmpty.hidden = false;
      if (heroVideoFilename) heroVideoFilename.textContent = 'Pendiente por adjuntar';
      if (heroVideoSpeeds) heroVideoSpeeds.hidden = true;
      if (heroVideoDownloadLink) heroVideoDownloadLink.hidden = true;
      if (heroVideoRemoveBtn) heroVideoRemoveBtn.hidden = true;
    }
  }

  function handleHeroVideoFile(file) {
    if (heroVideoError) {
      heroVideoError.hidden = true;
      heroVideoError.textContent = '';
    }
    const validation = validateFileForAnnex(PRESENTATION_VIDEO_ANNEX, file);
    if (!validation.valid) {
      if (heroVideoError) {
        heroVideoError.textContent = validation.error;
        heroVideoError.hidden = false;
      }
      return;
    }
    const existing = state.sessionFiles.get(PRESENTATION_VIDEO_ANNEX.id);
    if (existing && existing.objectUrl) URL.revokeObjectURL(existing.objectUrl);

    const objectUrl = URL.createObjectURL(file);
    state.sessionFiles.set(PRESENTATION_VIDEO_ANNEX.id, {
      file,
      name: file.name,
      size: file.size,
      ext: validation.extension,
      objectUrl,
      publicUrl: '',
      officeEngine: 'video',
      versionId: null,
    });
    saveFileToIndexedDB(PRESENTATION_VIDEO_ANNEX.id, file, validation.extension);
    addVersionToIndexedDB(PRESENTATION_VIDEO_ANNEX.id, file, validation.extension).catch(() => {});
    renderHeroVideo();
  }

  function removeHeroVideoFile() {
    const existing = state.sessionFiles.get(PRESENTATION_VIDEO_ANNEX.id);
    if (existing && existing.objectUrl) URL.revokeObjectURL(existing.objectUrl);
    state.sessionFiles.delete(PRESENTATION_VIDEO_ANNEX.id);
    deleteFileFromIndexedDB(PRESENTATION_VIDEO_ANNEX.id);
    if (heroVideoInput) heroVideoInput.value = '';
    if (heroVideoError) {
      heroVideoError.hidden = true;
      heroVideoError.textContent = '';
    }
    renderHeroVideo();
  }

  function clearError() {
    uploadErrorEl.hidden = true;
    uploadErrorEl.textContent = '';
  }

  function showError(message) {
    uploadErrorEl.textContent = message;
    uploadErrorEl.hidden = false;
  }

  /* ------------------------------------------------------------------------
     Renderizado del índice lateral derecho (estructura fija 1–11 + Anexos)
     ------------------------------------------------------------------------ */
  function renderAnnexRail() {
    annexButtonsList.innerHTML = '';

    state.annexes.forEach((annex) => {
      const li = document.createElement('li');
      li.className = 'annex-rail__item';

      const btn = document.createElement('button');
      const attached = state.sessionFiles.get(annex.id);
      const hasFile = Boolean(attached && (attached.objectUrl || attached.publicUrl || attached.publishedPath));
      const isActive = annex.id === state.activeAnnexId;

      btn.type = 'button';
      btn.className = `annex-btn${isActive ? ' is-active' : ''}${hasFile ? ' has-file' : ''}`;
      btn.dataset.annexId = annex.id;
      btn.setAttribute('aria-current', isActive ? 'true' : 'false');
      btn.setAttribute('aria-label', `${annex.title}${hasFile ? ' (archivo cargado)' : ' (pendiente)'}`);

      const topRow = document.createElement('span');
      topRow.className = 'annex-btn__top';

      const mainSpan = document.createElement('span');
      mainSpan.className = 'annex-btn__main';

      const codeSpan = document.createElement('span');
      codeSpan.className = 'annex-btn__code';
      codeSpan.textContent = annex.id === '12' ? 'Anx' : annex.id;

      const labelSpan = document.createElement('span');
      labelSpan.className = 'annex-btn__label';
      labelSpan.textContent = annex.title;

      mainSpan.appendChild(codeSpan);
      mainSpan.appendChild(labelSpan);

      const rightSpan = document.createElement('span');
      rightSpan.className = 'annex-btn__right';

      const pageSpan = document.createElement('span');
      pageSpan.className = 'annex-btn__page tabular-nums';
      pageSpan.textContent = getPageLabel(pagesMap, annex.id);

      const statusSpan = document.createElement('span');
      statusSpan.className = 'annex-btn__status';
      statusSpan.textContent = hasFile
        ? attached.ext
          ? `.${attached.ext.toUpperCase()}`
          : 'Cargado'
        : 'Pendiente';

      rightSpan.appendChild(pageSpan);
      rightSpan.appendChild(statusSpan);

      topRow.appendChild(mainSpan);
      topRow.appendChild(rightSpan);
      btn.appendChild(topRow);

      // Subtítulos exactos cuando el apartado los tiene (6.1/6.2, 8.1/8.2, 10.1/10.2, 11.1/11.2/11.3)
      if (Array.isArray(annex.subtitles) && annex.subtitles.length > 0) {
        const subList = document.createElement('ul');
        subList.className = 'annex-btn__subtitles';
        annex.subtitles.forEach((sub) => {
          const subLi = document.createElement('li');
          const subTitle = document.createElement('span');
          subTitle.textContent = sub.title;
          const subPage = document.createElement('span');
          subPage.className = 'tabular-nums';
          subPage.textContent = getPageLabel(pagesMap, sub.id);
          subLi.appendChild(subTitle);
          subLi.appendChild(subPage);
          subList.appendChild(subLi);
        });
        btn.appendChild(subList);
      }

      btn.addEventListener('click', () => {
        if (state.activeAnnexId === annex.id && !state.projectionMode) {
          setDrawerOpen(!state.drawerOpen);
          if (state.drawerOpen) triggerDrawerSwitchAnimation();
          return;
        }
        state.activeAnnexId = annex.id;
        clearViewingVersion();
        state.zoomPercent = 100;
        if (!state.projectionMode) {
          state.drawerOpen = true;
          annexDrawer.classList.remove('is-collapsed');
          toggleDrawerBtn.setAttribute('aria-expanded', 'true');
          toggleDrawerLabel.textContent = 'Ocultar panel';
        }
        clearError();
        titleSaveStatus.textContent = '';
        renderAll();
        if (!state.projectionMode) triggerDrawerSwitchAnimation();
      });

      li.appendChild(btn);
      annexButtonsList.appendChild(li);
    });
  }

  /* ------------------------------------------------------------------------
     Renderizado del panel desplegable hacia la izquierda
     ------------------------------------------------------------------------ */
  function renderDrawer() {
    const annex = getActiveAnnex();
    const attached = state.sessionFiles.get(annex.id);

    drawerCodeLabel.textContent =
      annex.id === '12' ? 'ANEXOS · DOCUMENTOS' : `APARTADO ${annex.code.toUpperCase()} · EVIDENCIA`;

    drawerAcceptedLabel.textContent =
      'Formatos: Word (.docx), Excel (.xlsx), PowerPoint (.pptx), PDF e imágenes (.png, .jpg, .svg, .webp)';

    annexTitleInput.value = annex.title;
    annexDescInput.value = annex.description;

    // Numeración de página editable ("___")
    if (annexPageInput) {
      annexPageInput.value = pagesMap[annex.id] || '';
    }
    if (subtitlesPagesBox) {
      subtitlesPagesBox.innerHTML = '';
      if (Array.isArray(annex.subtitles) && annex.subtitles.length > 0) {
        subtitlesPagesBox.hidden = false;
        annex.subtitles.forEach((sub) => {
          const row = document.createElement('div');
          row.className = 'page-number-row';
          const lbl = document.createElement('label');
          lbl.className = 'page-number-label';
          lbl.textContent = sub.title;
          const inp = document.createElement('input');
          inp.type = 'text';
          inp.className = 'text-input page-number-input tabular-nums';
          inp.placeholder = '___';
          inp.maxLength = 12;
          inp.value = pagesMap[sub.id] || '';
          inp.addEventListener('input', () => {
            const val = inp.value.trim();
            if (val) {
              pagesMap[sub.id] = val;
            } else {
              delete pagesMap[sub.id];
            }
            savePersistedMap(window.localStorage, STORAGE_KEYS.pages, pagesMap);
            renderAnnexRail();
            renderPreviewHeaderMeta();
          });
          row.appendChild(lbl);
          row.appendChild(inp);
          subtitlesPagesBox.appendChild(row);
        });
      } else {
        subtitlesPagesBox.hidden = true;
      }
    }

    // Configurar input file
    fileInput.accept = annex.acceptedExtensions.map((ext) => `.${ext}`).join(',');
    dropzoneLimits.textContent = `Máximo ${formatFileSize(annex.maxBytes)} · ${annex.acceptedExtensions
      .map((e) => `.${e}`)
      .join(', ')}`;

    if (attached && (attached.file || attached.isPublished)) {
      dropzone.hidden = true;
      attachedFileCard.hidden = false;
      attachedExtTag.textContent = (attached.ext || 'DOC').toUpperCase();
      attachedFileName.textContent = attached.name;
      const originNote = attached.isPublished && !attached.file ? 'Publicado (cargando...)' : 'Previsualización activa';
      attachedFileMeta.textContent = `${formatFileSize(attached.size)} · ${originNote}`;
      if (drawerDownloadLink) {
        drawerDownloadLink.href = attached.objectUrl || attached.publishedPath || attached.publicUrl || '#';
        drawerDownloadLink.setAttribute('download', attached.name);
      }
    } else {
      dropzone.hidden = false;
      attachedFileCard.hidden = true;
    }

    // Mostrar campo de URL pública para visores externos de Office
    const isOfficeCandidate =
      annex.kind === 'document' && (!attached || !attached.file || getPreviewCategory(attached.ext) === 'office');
    publicUrlBox.hidden = !isOfficeCandidate;
    publicUrlInput.value = attached && attached.publicUrl ? attached.publicUrl : '';

    // Histórico de versiones del anexo activo (se carga desde IndexedDB la primera vez)
    if (!state.versionsByAnnex.has(annex.id)) {
      refreshVersions(annex.id);
    }
    renderVersionHistory();
  }

  /* ------------------------------------------------------------------------
     Renderizado del área de previsualización (PDF, Video y Office)
     ------------------------------------------------------------------------ */
  function applyZoomTransform(targetEl) {
    if (!targetEl) return;
    const scale = state.zoomPercent / 100;
    targetEl.style.transform = `scale(${scale})`;
    zoomLevelLabel.textContent = `${state.zoomPercent}%`;
  }

  function renderPreviewHeaderMeta() {
    const annex = getActiveAnnex();
    if (previewAnnexCode) {
      previewAnnexCode.textContent = annex.id === '12' ? 'Anexos' : `Apartado ${annex.code}`;
    }
    if (previewPageBadge) {
      previewPageBadge.textContent = getPageLabel(pagesMap, annex.id);
    }
    if (previewHeading) {
      previewHeading.textContent = annex.title;
    }
    if (previewSubtitlesList) {
      previewSubtitlesList.innerHTML = '';
      if (Array.isArray(annex.subtitles) && annex.subtitles.length > 0) {
        previewSubtitlesList.hidden = false;
        annex.subtitles.forEach((sub) => {
          const li = document.createElement('li');
          li.textContent = `${sub.title} (${getPageLabel(pagesMap, sub.id)})`;
          previewSubtitlesList.appendChild(li);
        });
      } else {
        previewSubtitlesList.hidden = true;
      }
    }
  }

  function renderPreview() {
    const annex = getActiveAnnex();
    // Si se está viendo una versión anterior del histórico, se previsualiza esa en lugar de la actual
    const viewing =
      state.viewingVersion && state.viewingVersion.annexId === annex.id ? state.viewingVersion : null;
    const attached = viewing ? viewing.entry : state.sessionFiles.get(annex.id);

    renderPreviewHeaderMeta();
    previewContent.innerHTML = '';

    const hasFileOrUrl = Boolean(attached && (attached.objectUrl || attached.publicUrl || attached.publishedPath));

    if (!hasFileOrUrl) {
      previewEmpty.hidden = false;
      previewContent.hidden = true;
      previewDownloadLink.hidden = true;
      if (previewOpenTabLink) previewOpenTabLink.hidden = true;
      zoomControls.hidden = true;
      if (previewEmptyTitle) previewEmptyTitle.textContent = annex.title;
      if (previewEmptySubtitles) {
        previewEmptySubtitles.innerHTML = '';
        if (Array.isArray(annex.subtitles) && annex.subtitles.length > 0) {
          previewEmptySubtitles.hidden = false;
          annex.subtitles.forEach((sub) => {
            const li = document.createElement('li');
            const t = document.createElement('span');
            t.textContent = sub.title;
            const p = document.createElement('span');
            p.className = 'tabular-nums';
            p.textContent = getPageLabel(pagesMap, sub.id);
            li.appendChild(t);
            li.appendChild(p);
            previewEmptySubtitles.appendChild(li);
          });
        } else {
          previewEmptySubtitles.hidden = true;
        }
      }
      previewEmptyHint.textContent =
        'Este apartado aún no tiene un documento cargado. Adjunta tu archivo Word (.docx), Excel (.xlsx), PowerPoint (.pptx), PDF o imagen para previsualizarlo en pantalla.';
      return;
    }

    // Si proviene del repositorio publicado (manifest.json) y aún no se ha descargado en memoria, obtenerlo ahora
    if (attached && attached.publishedPath && !attached.file && !viewing) {
      previewEmpty.hidden = true;
      previewContent.hidden = false;
      previewDownloadLink.hidden = false;
      previewDownloadLink.href = attached.publishedPath;
      previewDownloadLink.setAttribute('download', attached.name || `${annex.id}`);
      previewContent.innerHTML = '<p class="office-preview-box__meta">Cargando archivo publicado para previsualizar...</p>';
      ensurePublishedFileLoaded(annex.id, attached);
      return;
    }

    previewEmpty.hidden = true;
    previewContent.hidden = false;
    zoomControls.hidden = false;

    const activeHref = attached.objectUrl || attached.publicUrl;
    previewDownloadLink.hidden = false;
    previewDownloadLink.href = activeHref;
    previewDownloadLink.setAttribute('download', attached.name || `${annex.id}`);

    if (previewOpenTabLink) {
      previewOpenTabLink.hidden = false;
      previewOpenTabLink.href = activeHref;
    }

    const category = getPreviewCategory(attached.ext);

    // Aviso cuando se está viendo una versión anterior del histórico
    if (viewing) {
      const banner = document.createElement('div');
      banner.className = 'version-view-banner';

      const bannerText = document.createElement('span');
      bannerText.textContent = `Estás viendo la versión v${viewing.numero} (${attached.name}), que no es la versión actual.`;

      const bannerActions = document.createElement('div');
      bannerActions.className = 'version-view-banner__actions';

      const backBtn = document.createElement('button');
      backBtn.type = 'button';
      backBtn.className = 'btn-outline-sm';
      backBtn.textContent = 'Volver a la versión actual';
      backBtn.addEventListener('click', () => {
        clearViewingVersion();
        renderPreview();
        renderVersionHistory();
      });

      const restoreBtn = document.createElement('button');
      restoreBtn.type = 'button';
      restoreBtn.className = 'btn-navy-sm';
      restoreBtn.textContent = 'Restaurar esta versión';
      restoreBtn.addEventListener('click', () => {
        const rec = (state.versionsByAnnex.get(annex.id) || []).find((v) => v.numero === viewing.numero);
        if (rec) restoreVersion(rec);
      });

      bannerActions.appendChild(backBtn);
      bannerActions.appendChild(restoreBtn);
      banner.appendChild(bannerText);
      banner.appendChild(bannerActions);
      previewContent.appendChild(banner);
    }
    // 1. Previsualización de PDF en visor integrado (<iframe> / <embed>)
    if (category === 'pdf') {
      const zoomWrap = document.createElement('div');
      zoomWrap.className = 'preview-zoom-wrapper';

      const iframe = document.createElement('iframe');
      iframe.className = 'preview-pdf-frame';
      iframe.src = attached.objectUrl || attached.publicUrl;
      iframe.title = `Previsualización PDF de ${attached.name}`;

      zoomWrap.appendChild(iframe);
      applyZoomTransform(zoomWrap);
      previewContent.appendChild(zoomWrap);
      return;
    }

    // 2. Previsualización de Video en Anexo L ("Anexos Html") con <video controls>
    // 1b. Previsualización de imágenes (diagramas de dominio, casos de uso, etc.) con clic para ampliar
    if (category === 'image') {
      const zoomWrap = document.createElement('div');
      zoomWrap.className = 'preview-zoom-wrapper preview-zoom-wrapper--image';

      const hint = document.createElement('p');
      hint.className = 'image-click-hint';
      hint.textContent = 'Haz clic sobre la imagen para ampliarla a pantalla completa.';

      const img = document.createElement('img');
      img.className = 'preview-image';
      img.src = attached.objectUrl || attached.publicUrl;
      img.alt = `Imagen: ${attached.name}`;
      img.title = 'Haz clic para ampliar';
      img.decoding = 'async';
      img.addEventListener('error', () => {
        zoomWrap.innerHTML = '';
        const msg = document.createElement('p');
        msg.className = 'office-preview-box__notice';
        msg.textContent = 'No se pudo mostrar esta imagen. Puedes descargarla con el botón «Descargar».';
        zoomWrap.appendChild(msg);
      });

      zoomWrap.appendChild(hint);
      zoomWrap.appendChild(img);
      applyZoomTransform(zoomWrap);
      previewContent.appendChild(zoomWrap);
      return;
    }

    if (category === 'video') {
      const zoomWrap = document.createElement('div');
      zoomWrap.className = 'preview-zoom-wrapper';

      const stageCard = document.createElement('div');
      stageCard.className = 'video-stage-card';

      const toolbar = document.createElement('div');
      toolbar.className = 'video-stage-toolbar';

      const fileInfo = document.createElement('span');
      fileInfo.textContent = `Reproduciendo: ${attached.name} (${formatFileSize(attached.size)})`;

      const speedGroup = document.createElement('div');
      speedGroup.className = 'video-speed-group';
      const speedLabel = document.createElement('span');
      speedLabel.textContent = 'Velocidad:';
      speedGroup.appendChild(speedLabel);

      const video = document.createElement('video');
      video.className = 'preview-video-player';
      video.controls = true;
      video.playsInline = true;
      video.preload = 'metadata';
      video.src = attached.objectUrl || attached.publishedPath || attached.publicUrl;
      video.setAttribute('aria-label', `Reproductor de video para ${attached.name}`);

      [0.5, 1, 1.25, 1.5, 2].forEach((rate) => {
        const sBtn = document.createElement('button');
        sBtn.type = 'button';
        sBtn.className = `video-speed-btn${rate === 1 ? ' is-active' : ''}`;
        sBtn.textContent = `${rate}x`;
        sBtn.addEventListener('click', () => {
          video.playbackRate = rate;
          Array.from(speedGroup.querySelectorAll('.video-speed-btn')).forEach((b) =>
            b.classList.toggle('is-active', b === sBtn)
          );
        });
        speedGroup.appendChild(sBtn);
      });

      toolbar.appendChild(fileInfo);
      toolbar.appendChild(speedGroup);

      stageCard.appendChild(toolbar);
      stageCard.appendChild(video);

      zoomWrap.appendChild(stageCard);
      applyZoomTransform(zoomWrap);
      previewContent.appendChild(zoomWrap);
      return;
    }

    // 3. Previsualización de Office (.doc, .docx, .xls, .xlsx, .ppt, .pptx)
    // Soporta vista interactiva integrada + Microsoft Office Online + Google Docs Viewer
    const urls = buildOfficeViewerUrls(attached.publicUrl);
    const canLocalParse = Boolean(attached.file && ['docx', 'xlsx', 'pptx'].includes(attached.ext));
    let defaultEngine = attached.officeEngine || (canLocalParse ? 'local' : urls ? 'officeOnline' : 'summary');
    if (defaultEngine === 'local' && !canLocalParse) {
      defaultEngine = urls ? 'officeOnline' : 'summary';
    }
    attached.officeEngine = defaultEngine;

    const tabs = document.createElement('div');
    tabs.className = 'office-viewer-tabs';

    const leftTabs = document.createElement('div');
    leftTabs.className = 'office-viewer-tabs__group';

    if (canLocalParse) {
      const localBtn = document.createElement('button');
      localBtn.type = 'button';
      localBtn.className = `btn-outline-sm${defaultEngine === 'local' ? ' is-active' : ''}`;
      localBtn.textContent = 'Vista Interactiva Local';
      localBtn.addEventListener('click', () => {
        attached.officeEngine = 'local';
        renderPreview();
      });
      leftTabs.appendChild(localBtn);
    }

    const msBtn = document.createElement('button');
    msBtn.type = 'button';
    msBtn.className = `btn-outline-sm${defaultEngine === 'officeOnline' ? ' is-active' : ''}`;
    msBtn.textContent = 'Microsoft Office Online';
    msBtn.addEventListener('click', () => {
      attached.officeEngine = 'officeOnline';
      renderPreview();
    });

    const ggBtn = document.createElement('button');
    ggBtn.type = 'button';
    ggBtn.className = `btn-outline-sm${defaultEngine === 'googleDocs' ? ' is-active' : ''}`;
    ggBtn.textContent = 'Google Docs Viewer';
    ggBtn.addEventListener('click', () => {
      attached.officeEngine = 'googleDocs';
      renderPreview();
    });

    leftTabs.appendChild(msBtn);
    leftTabs.appendChild(ggBtn);
    tabs.appendChild(leftTabs);

    const zoomWrap = document.createElement('div');
    zoomWrap.className = 'preview-zoom-wrapper';

    if (defaultEngine === 'local' && canLocalParse) {
      const localStage = document.createElement('div');
      localStage.className = 'office-local-stage';
      renderLocalOfficePreview(attached.file, attached.ext, localStage);
      zoomWrap.appendChild(localStage);
    } else if ((defaultEngine === 'officeOnline' || defaultEngine === 'googleDocs') && urls) {
      const iframe = document.createElement('iframe');
      iframe.className = 'preview-pdf-frame';
      iframe.title = `Visor externo de ${annex.title}`;
      iframe.src = defaultEngine === 'googleDocs' ? urls.googleDocs : urls.officeOnline;
      iframe.setAttribute('loading', 'lazy');
      zoomWrap.appendChild(iframe);
    } else {
      const card = document.createElement('div');
      card.className = 'office-preview-box';

      const head = document.createElement('div');
      head.className = 'office-preview-box__head';

      const leftInfo = document.createElement('div');
      const extBadge = document.createElement('span');
      extBadge.className = 'office-preview-box__ext';
      extBadge.textContent = `.${attached.ext.toUpperCase()}`;

      const fileTitle = document.createElement('h3');
      fileTitle.className = 'office-preview-box__title';
      fileTitle.textContent = attached.name;

      const meta = document.createElement('p');
      meta.className = 'office-preview-box__meta tabular-nums';
      meta.textContent = `Tamaño: ${formatFileSize(attached.size)} · Disponible para descarga directa`;

      leftInfo.appendChild(extBadge);
      leftInfo.appendChild(fileTitle);
      leftInfo.appendChild(meta);
      head.appendChild(leftInfo);

      const notice = document.createElement('div');
      notice.className = 'office-preview-box__notice';
      notice.textContent =
        'Los visores externos (Microsoft Office Online y Google Docs Viewer) requieren que el archivo tenga una URL pública HTTPS. Puedes pegar una URL pública en el panel desplegable izquierdo, usar la Vista Interactiva Local (para .docx, .xlsx y .pptx) o descargar el archivo directamente.';

      const directDownload = document.createElement('a');
      directDownload.className = 'btn-download';
      directDownload.href = attached.objectUrl || attached.publicUrl;
      directDownload.setAttribute('download', attached.name);
      directDownload.textContent = `Descargar ${attached.name}`;

      card.appendChild(head);
      card.appendChild(notice);
      card.appendChild(directDownload);
      zoomWrap.appendChild(card);
    }

    applyZoomTransform(zoomWrap);
    previewContent.appendChild(tabs);
    previewContent.appendChild(zoomWrap);
  }

  /* ------------------------------------------------------------------------
     Control de versiones e histórico del anexo activo
     ------------------------------------------------------------------------ */
  function formatVersionDate(timestamp) {
    try {
      return new Date(timestamp).toLocaleString('es-CO', { dateStyle: 'short', timeStyle: 'short' });
    } catch {
      return '';
    }
  }

  function clearViewingVersion() {
    if (state.viewingVersion && state.viewingVersion.entry && state.viewingVersion.entry.objectUrl) {
      URL.revokeObjectURL(state.viewingVersion.entry.objectUrl);
    }
    state.viewingVersion = null;
  }

  async function refreshVersions(annexId) {
    const list = await listVersionsFromIndexedDB(annexId);
    state.versionsByAnnex.set(annexId, list);
    if (state.activeAnnexId === annexId && state.view === 'annexes') {
      renderVersionHistory();
    }
  }

  function downloadVersion(rec) {
    const url = URL.createObjectURL(rec.file);
    const link = document.createElement('a');
    link.href = url;
    link.download = rec.name;
    document.body.appendChild(link);
    link.click();
    link.remove();
    setTimeout(() => URL.revokeObjectURL(url), 4000);
  }

  function viewVersion(rec, isCurrent) {
    clearViewingVersion();
    if (!isCurrent) {
      state.viewingVersion = {
        annexId: rec.annexId,
        numero: rec.numero,
        entry: {
          file: rec.file,
          name: rec.name,
          size: rec.size,
          ext: rec.ext,
          objectUrl: URL.createObjectURL(rec.file),
          publicUrl: '',
          officeEngine: ['docx', 'xlsx', 'pptx'].includes(rec.ext) ? 'local' : 'officeOnline',
        },
      };
    }
    state.zoomPercent = 100;
    renderPreview();
    renderVersionHistory();
  }

  async function restoreVersion(rec) {
    clearError();
    clearViewingVersion();

    const existing = state.sessionFiles.get(rec.annexId);
    if (existing && existing.objectUrl) {
      URL.revokeObjectURL(existing.objectUrl);
    }

    const entry = {
      file: rec.file,
      name: rec.name,
      size: rec.size,
      ext: rec.ext,
      objectUrl: URL.createObjectURL(rec.file),
      publicUrl: existing ? existing.publicUrl : '',
      officeEngine: ['docx', 'xlsx', 'pptx'].includes(rec.ext) ? 'local' : 'officeOnline',
      versionId: null,
    };
    state.sessionFiles.set(rec.annexId, entry);
    state.zoomPercent = 100;

    await saveFileToIndexedDB(rec.annexId, rec.file, rec.ext);
    // La restauración queda registrada como una nueva versión (el histórico nunca se reescribe)
    const created = await addVersionToIndexedDB(rec.annexId, rec.file, rec.ext, { restauradaDe: rec.numero });
    if (created) entry.versionId = created.versionId;
    await refreshVersions(rec.annexId);
    renderAll();
  }

  async function deleteVersion(rec) {
    const confirmed = window.confirm(`¿Eliminar definitivamente la versión v${rec.numero} (${rec.name}) del histórico?`);
    if (!confirmed) return;
    if (state.viewingVersion && state.viewingVersion.numero === rec.numero && state.viewingVersion.annexId === rec.annexId) {
      clearViewingVersion();
    }
    await deleteVersionFromIndexedDB(rec.versionId);
    await refreshVersions(rec.annexId);
    renderPreview();
  }

  function renderVersionHistory() {
    if (!versionHistoryList) return;
    const annex = getActiveAnnex();
    const versions = state.versionsByAnnex.get(annex.id) || [];
    const currentEntry = state.sessionFiles.get(annex.id);
    const currentVersionId = currentEntry ? currentEntry.versionId : null;
    const viewingNumero =
      state.viewingVersion && state.viewingVersion.annexId === annex.id ? state.viewingVersion.numero : null;

    versionHistoryList.innerHTML = '';
    versionHistoryCount.textContent = `${versions.length} ${versions.length === 1 ? 'versión' : 'versiones'}`;
    versionHistoryEmpty.hidden = versions.length > 0;

    versions.forEach((rec) => {
      const isCurrent = currentVersionId !== null && currentVersionId !== undefined && rec.versionId === currentVersionId;
      const isViewing = viewingNumero === rec.numero;

      const li = document.createElement('li');
      li.className = `version-item${isCurrent ? ' is-current' : ''}${isViewing ? ' is-viewing' : ''}`;

      const head = document.createElement('div');
      head.className = 'version-item__head';

      const badge = document.createElement('span');
      badge.className = 'version-item__badge';
      badge.textContent = `v${rec.numero}`;

      const name = document.createElement('span');
      name.className = 'version-item__name';
      name.textContent = rec.name;
      name.title = rec.name;

      head.appendChild(badge);
      head.appendChild(name);

      if (isCurrent) {
        const tag = document.createElement('span');
        tag.className = 'version-item__tag';
        tag.textContent = 'Actual';
        head.appendChild(tag);
      } else if (isViewing) {
        const tag = document.createElement('span');
        tag.className = 'version-item__tag version-item__tag--viewing';
        tag.textContent = 'Viendo';
        head.appendChild(tag);
      }

      const meta = document.createElement('p');
      meta.className = 'version-item__meta tabular-nums';
      const restoredText = rec.restauradaDe ? ` · restaurada de v${rec.restauradaDe}` : '';
      meta.textContent = `${formatVersionDate(rec.subidoEn)} · ${formatFileSize(rec.size)}${restoredText}`;

      const actions = document.createElement('div');
      actions.className = 'version-item__actions';

      const viewBtn = document.createElement('button');
      viewBtn.type = 'button';
      viewBtn.className = 'btn-ghost-xs';
      viewBtn.textContent = 'Ver';
      viewBtn.addEventListener('click', () => viewVersion(rec, isCurrent));

      const downloadBtn = document.createElement('button');
      downloadBtn.type = 'button';
      downloadBtn.className = 'btn-ghost-xs';
      downloadBtn.textContent = 'Descargar';
      downloadBtn.addEventListener('click', () => downloadVersion(rec));

      actions.appendChild(viewBtn);
      actions.appendChild(downloadBtn);

      if (!isCurrent) {
        const restoreBtn = document.createElement('button');
        restoreBtn.type = 'button';
        restoreBtn.className = 'btn-ghost-xs';
        restoreBtn.textContent = 'Restaurar';
        restoreBtn.addEventListener('click', () => restoreVersion(rec));

        const deleteBtn = document.createElement('button');
        deleteBtn.type = 'button';
        deleteBtn.className = 'btn-ghost-xs version-item__delete';
        deleteBtn.textContent = 'Eliminar';
        deleteBtn.addEventListener('click', () => deleteVersion(rec));

        actions.appendChild(restoreBtn);
        actions.appendChild(deleteBtn);
      }

      li.appendChild(head);
      li.appendChild(meta);
      li.appendChild(actions);
      versionHistoryList.appendChild(li);
    });
  }

  function renderAll() {
    updateLoadedCounter();
    renderHeroVideo();
    renderAnnexRail();
    renderDrawer();
    renderPreview();
  }

  /* ------------------------------------------------------------------------
     Manejo de archivos (subir, reemplazar, eliminar)
     ------------------------------------------------------------------------ */
  function handleIncomingFile(file) {
    const annex = getActiveAnnex();
    clearError();

    const validation = validateFileForAnnex(annex, file);
    if (!validation.valid) {
      showError(validation.error);
      return;
    }

    clearViewingVersion();

    const existing = state.sessionFiles.get(annex.id);
    if (existing && existing.objectUrl) {
      URL.revokeObjectURL(existing.objectUrl);
    }

    const objectUrl = URL.createObjectURL(file);
    const defaultOfficeEngine = ['docx', 'xlsx', 'pptx'].includes(validation.extension)
      ? 'local'
      : 'officeOnline';

    const newEntry = {
      file,
      name: file.name,
      size: file.size,
      ext: validation.extension,
      objectUrl,
      publicUrl: existing ? existing.publicUrl : '',
      officeEngine: defaultOfficeEngine,
      versionId: null,
    };
    state.sessionFiles.set(annex.id, newEntry);

    saveFileToIndexedDB(annex.id, file, validation.extension);

    // Control de versiones: cada archivo subido o reemplazado queda como una nueva versión en el histórico
    addVersionToIndexedDB(annex.id, file, validation.extension)
      .then((created) => {
        if (created) newEntry.versionId = created.versionId;
        return refreshVersions(annex.id);
      })
      .catch(() => {});

    state.zoomPercent = 100;
    renderAll();
  }

  function removeCurrentFile() {
    const annex = getActiveAnnex();
    clearViewingVersion();
    const existing = state.sessionFiles.get(annex.id);
    if (existing && existing.objectUrl) {
      URL.revokeObjectURL(existing.objectUrl);
    }
    state.sessionFiles.delete(annex.id);
    delete publicUrlsMap[annex.id];
    savePersistedMap(window.localStorage, STORAGE_KEYS.publicUrls, publicUrlsMap);
    deleteFileFromIndexedDB(annex.id);
    Object.entries(LEGACY_ID_MAP).forEach(([legacyKey, newId]) => {
      if (newId === annex.id) {
        deleteFileFromIndexedDB(legacyKey);
      }
    });
    fileInput.value = '';
    clearError();
    renderAll();
  }

  /* ------------------------------------------------------------------------
     Persistencia de título y descripción editables
     ------------------------------------------------------------------------ */
  function saveCurrentTitle() {
    const annex = getActiveAnnex();
    const nextTitle = annexTitleInput.value.trim();
    if (!nextTitle) {
      titleSaveStatus.textContent = 'El nombre no puede quedar vacío.';
      annexTitleInput.value = annex.title;
      return;
    }

    annex.title = nextTitle;
    titlesMap[annex.id] = nextTitle;
    savePersistedMap(window.localStorage, STORAGE_KEYS.titles, titlesMap);
    titleSaveStatus.textContent = 'Nombre guardado en localStorage.';
    renderAnnexRail();
    previewHeading.textContent = annex.title;
  }

  function saveCurrentDescription() {
    const annex = getActiveAnnex();
    const nextDesc = annexDescInput.value.trim();
    annex.description = nextDesc;
    descriptionsMap[annex.id] = nextDesc;
    savePersistedMap(window.localStorage, STORAGE_KEYS.descriptions, descriptionsMap);
  }

  /* ------------------------------------------------------------------------
     Eventos de interfaz
     ------------------------------------------------------------------------ */
  if (openCoverModalBtn && coverModal) {
    openCoverModalBtn.addEventListener('click', () => {
      coverModal.hidden = false;
    });
  }
  const closeCoverModal = () => {
    if (coverModal) coverModal.hidden = true;
  };
  if (closeCoverModalBtn) closeCoverModalBtn.addEventListener('click', closeCoverModal);
  if (enterPortfolioBtn) enterPortfolioBtn.addEventListener('click', closeCoverModal);
  if (coverModal) {
    coverModal.addEventListener('click', (e) => {
      if (e.target === coverModal) closeCoverModal();
    });
  }

  // Video de presentación (Hero inicial)
  if (heroVideoUploadBtn && heroVideoInput) {
    heroVideoUploadBtn.addEventListener('click', () => heroVideoInput.click());
  }
  if (heroVideoEmptyBtn && heroVideoInput) {
    heroVideoEmptyBtn.addEventListener('click', () => heroVideoInput.click());
  }
  if (heroVideoInput) {
    heroVideoInput.addEventListener('change', (e) => {
      const target = e.target;
      if (target.files && target.files[0]) {
        handleHeroVideoFile(target.files[0]);
        target.value = '';
      }
    });
  }
  if (heroVideoRemoveBtn) {
    heroVideoRemoveBtn.addEventListener('click', removeHeroVideoFile);
  }
  if (heroVideoDropzone) {
    heroVideoDropzone.addEventListener('dragover', (e) => {
      e.preventDefault();
      heroVideoDropzone.classList.add('is-dragover');
    });
    heroVideoDropzone.addEventListener('dragleave', () => {
      heroVideoDropzone.classList.remove('is-dragover');
    });
    heroVideoDropzone.addEventListener('drop', (e) => {
      e.preventDefault();
      heroVideoDropzone.classList.remove('is-dragover');
      if (e.dataTransfer && e.dataTransfer.files && e.dataTransfer.files[0]) {
        handleHeroVideoFile(e.dataTransfer.files[0]);
      }
    });
  }
  if (heroVideoSpeeds && heroVideoPlayer) {
    heroVideoSpeeds.querySelectorAll('.video-speed-btn').forEach((btn) => {
      btn.addEventListener('click', () => {
        const rate = Number(btn.getAttribute('data-rate') || 1);
        heroVideoPlayer.playbackRate = rate;
        heroVideoSpeeds.querySelectorAll('.video-speed-btn').forEach((b) =>
          b.classList.toggle('is-active', b === btn)
        );
      });
    });
  }

  // Ampliación de imágenes al hacer clic (directas o incrustadas en Word/PowerPoint/Excel)
  previewContent.addEventListener('click', (e) => {
    const img = e.target.closest('img.preview-image, img.office-embedded-image');
    if (img && img.src) {
      openImageLightbox(img.src, img.alt || getActiveAnnex().title);
    }
  });
  if (lightboxZoomIn) {
    lightboxZoomIn.addEventListener('click', () => {
      state.lightboxZoomPercent = Math.min(300, state.lightboxZoomPercent + 25);
      applyLightboxZoom();
    });
  }
  if (lightboxZoomOut) {
    lightboxZoomOut.addEventListener('click', () => {
      state.lightboxZoomPercent = Math.max(50, state.lightboxZoomPercent - 25);
      applyLightboxZoom();
    });
  }
  if (lightboxZoomReset) {
    lightboxZoomReset.addEventListener('click', () => {
      state.lightboxZoomPercent = 100;
      applyLightboxZoom();
    });
  }
  if (lightboxCloseBtn) {
    lightboxCloseBtn.addEventListener('click', closeImageLightbox);
  }
  if (imageLightbox) {
    imageLightbox.addEventListener('click', (e) => {
      if (e.target === imageLightbox || e.target.id === 'lightbox-stage') {
        closeImageLightbox();
      }
    });
  }
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      if (imageLightbox && !imageLightbox.hidden) closeImageLightbox();
      if (coverModal && !coverModal.hidden) closeCoverModal();
      if (shareModal && !shareModal.hidden) shareModal.hidden = true;
    }
  });

  if (projectionModeBtn) {
    projectionModeBtn.addEventListener('click', () => setProjectionMode(!state.projectionMode));
  }

  closeDrawerBtn.addEventListener('click', () => setDrawerOpen(false));
  toggleDrawerBtn.addEventListener('click', () => setDrawerOpen(!state.drawerOpen));

  if (annexPageInput) {
    annexPageInput.addEventListener('input', () => {
      const annex = getActiveAnnex();
      const val = annexPageInput.value.trim();
      if (val) {
        pagesMap[annex.id] = val;
      } else {
        delete pagesMap[annex.id];
      }
      savePersistedMap(window.localStorage, STORAGE_KEYS.pages, pagesMap);
      renderAnnexRail();
      renderPreviewHeaderMeta();
    });
  }

  saveTitleBtn.addEventListener('click', saveCurrentTitle);
  annexTitleInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      saveCurrentTitle();
    }
  });
  annexDescInput.addEventListener('input', saveCurrentDescription);

  resetNamesBtn.addEventListener('click', () => {
    Object.keys(titlesMap).forEach((k) => delete titlesMap[k]);
    Object.keys(pagesMap).forEach((k) => delete pagesMap[k]);
    savePersistedMap(window.localStorage, STORAGE_KEYS.titles, {});
    savePersistedMap(window.localStorage, STORAGE_KEYS.pages, {});
    state.annexes = state.annexes.map((current) => {
      const base = DEFAULT_ANNEXES.find((d) => d.id === current.id);
      return { ...current, title: base ? base.title : current.title };
    });
    titleSaveStatus.textContent = 'Índice y numeración predeterminados restaurados.';
    renderAll();
  });

  selectFileBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    fileInput.click();
  });
  dropzone.addEventListener('click', (e) => {
    if (e.target === fileInput) return;
    fileInput.click();
  });
  if (emptyUploadTriggerBtn) {
    emptyUploadTriggerBtn.addEventListener('click', () => {
      setDrawerOpen(true);
      fileInput.click();
    });
  }
  replaceFileBtn.addEventListener('click', () => fileInput.click());
  deleteFileBtn.addEventListener('click', removeCurrentFile);

  fileInput.addEventListener('change', (e) => {
    const target = e.target;
    if (target.files && target.files[0]) {
      handleIncomingFile(target.files[0]);
      target.value = '';
    }
  });

  dropzone.addEventListener('dragover', (e) => {
    e.preventDefault();
    dropzone.classList.add('is-dragover');
  });

  dropzone.addEventListener('dragleave', () => {
    dropzone.classList.remove('is-dragover');
  });

  dropzone.addEventListener('drop', (e) => {
    e.preventDefault();
    dropzone.classList.remove('is-dragover');
    if (e.dataTransfer && e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleIncomingFile(e.dataTransfer.files[0]);
    }
  });

  applyPublicUrlBtn.addEventListener('click', () => {
    const annex = getActiveAnnex();
    const urlValue = publicUrlInput.value.trim();
    clearError();

    if (!urlValue) {
      const existing = state.sessionFiles.get(annex.id);
      if (existing) {
        existing.publicUrl = '';
        delete publicUrlsMap[annex.id];
        savePersistedMap(window.localStorage, STORAGE_KEYS.publicUrls, publicUrlsMap);
        if (!existing.file) state.sessionFiles.delete(annex.id);
      }
      renderAll();
      return;
    }

    const viewerUrls = buildOfficeViewerUrls(urlValue);
    if (!viewerUrls) {
      showError('Ingresa una URL pública válida que comience con https:// o http://.');
      return;
    }

    const existing = state.sessionFiles.get(annex.id) || {
      file: null,
      name: urlValue.split('/').pop() || `${annex.code}.docx`,
      size: 0,
      ext: getFileExtension(urlValue) || 'docx',
      objectUrl: '',
      officeEngine: 'officeOnline',
    };
    existing.publicUrl = urlValue;
    existing.officeEngine = 'officeOnline';
    state.sessionFiles.set(annex.id, existing);
    publicUrlsMap[annex.id] = urlValue;
    savePersistedMap(window.localStorage, STORAGE_KEYS.publicUrls, publicUrlsMap);
    renderAll();
  });

  zoomInBtn.addEventListener('click', () => {
    state.zoomPercent = Math.min(200, state.zoomPercent + 15);
    applyZoomTransform(previewContent.querySelector('.preview-zoom-wrapper'));
  });

  zoomOutBtn.addEventListener('click', () => {
    state.zoomPercent = Math.max(50, state.zoomPercent - 15);
    applyZoomTransform(previewContent.querySelector('.preview-zoom-wrapper'));
  });

  zoomResetBtn.addEventListener('click', () => {
    state.zoomPercent = 100;
    applyZoomTransform(previewContent.querySelector('.preview-zoom-wrapper'));
  });

  function arrayBufferToBase64(buffer) {
    const bytes = new Uint8Array(buffer);
    const chunkSize = 0x8000;
    let binary = '';
    for (let i = 0; i < bytes.length; i += chunkSize) {
      binary += String.fromCharCode.apply(null, bytes.subarray(i, i + chunkSize));
    }
    return btoa(binary);
  }

  function base64ToUint8Array(base64) {
    const binary = atob(base64);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) {
      bytes[i] = binary.charCodeAt(i);
    }
    return bytes;
  }

  function triggerDownloadBlob(blob, filename) {
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    link.remove();
    setTimeout(() => URL.revokeObjectURL(url), 4000);
  }

  function sanitizePublishedFileName(annexId, originalName) {
    const safe = String(originalName || `anexo-${annexId}`)
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-zA-Z0-9._-]+/g, '-');
    return `anexo-${annexId}-${safe}`;
  }

  async function exportPortablePackage() {
    if (shareStatusMsg) shareStatusMsg.textContent = 'Generando paquete portátil...';
    const items = [];
    let skippedLarge = 0;

    const allItemsToExport = [...state.annexes, PRESENTATION_VIDEO_ANNEX];
    for (const annex of allItemsToExport) {
      const entry = state.sessionFiles.get(annex.id);
      const itemData = {
        id: annex.id,
        title: annex.title,
        description: annex.description,
        page: pagesMap[annex.id] || '',
        publicUrl: entry ? entry.publicUrl || '' : '',
      };

      if (entry && entry.file) {
        if (entry.file.size > 100 * 1024 * 1024) {
          skippedLarge += 1;
        } else {
          const buf = await entry.file.arrayBuffer();
          itemData.fileName = entry.name;
          itemData.mimeType = entry.file.type || 'application/octet-stream';
          itemData.ext = entry.ext;
          itemData.size = entry.size;
          itemData.base64 = arrayBufferToBase64(buf);
        }
      }
      items.push(itemData);
    }

    const payload = {
      format: 'adso-portafolio-grupo8',
      version: 1,
      exportedAt: new Date().toISOString(),
      annexes: items,
    };

    const jsonBlob = new Blob([JSON.stringify(payload)], { type: 'application/json' });
    triggerDownloadBlob(jsonBlob, 'portafolio-echele-camello-grupo8.json');

    if (shareStatusMsg) {
      shareStatusMsg.textContent =
        skippedLarge > 0
          ? `Paquete descargado (${skippedLarge} archivo(s) > 100 MB omitidos del JSON; usa Opción 2 para archivos muy grandes).`
          : 'Paquete descargado. Envíalo a tus compañeros/instructor para que pulsen «Importar paquete».';
    }
  }

  async function exportGithubEvidencias() {
    const manifestEntries = [];
    let downloadedCount = 0;

    const allItemsToPublish = [...state.annexes, PRESENTATION_VIDEO_ANNEX];
    for (const annex of allItemsToPublish) {
      const entry = state.sessionFiles.get(annex.id);
      if (!entry || (!entry.file && !entry.publicUrl)) continue;

      if (entry.file) {
        const cleanName = sanitizePublishedFileName(annex.id, entry.name);
        manifestEntries.push({
          id: annex.id,
          title: annex.title,
          description: annex.description,
          fileName: entry.name,
          path: `./evidencias/${cleanName}`,
          size: entry.size,
          ext: entry.ext,
        });
        triggerDownloadBlob(entry.file, cleanName);
        downloadedCount += 1;
      } else if (entry.publicUrl) {
        manifestEntries.push({
          id: annex.id,
          title: annex.title,
          description: annex.description,
          fileName: entry.name,
          publicUrl: entry.publicUrl,
          size: entry.size,
          ext: entry.ext,
        });
      }
    }

    const manifestObj = {
      version: 1,
      updatedAt: new Date().toISOString(),
      annexes: manifestEntries,
    };

    triggerDownloadBlob(
      new Blob([JSON.stringify(manifestObj, null, 2)], { type: 'application/json' }),
      'manifest.json'
    );
    triggerDownloadBlob(
      new Blob([`window.ADSO_PUBLISHED_MANIFEST = ${JSON.stringify(manifestObj, null, 2)};\n`], {
        type: 'text/javascript',
      }),
      'manifest.js'
    );

    if (shareStatusMsg) {
      shareStatusMsg.textContent = `Descargados manifest.json, manifest.js y ${downloadedCount} archivo(s). Cópialos en la carpeta evidencias/ del repositorio y súbelos a GitHub.`;
    }
  }

  async function importPortablePackage(file) {
    try {
      const text = await file.text();
      const data = JSON.parse(text);
      if (!data || !Array.isArray(data.annexes)) {
        window.alert('El archivo seleccionado no es un paquete válido del Portafolio ADSO.');
        return;
      }

      for (const item of data.annexes) {
        if (!item || !item.id) continue;
        const annexId = String(item.id);
        const annexObj =
          annexId === PRESENTATION_VIDEO_ANNEX.id
            ? PRESENTATION_VIDEO_ANNEX
            : state.annexes.find((a) => a.id === annexId);
        if (!annexObj) continue;

        if (typeof item.page === 'string' && item.page.trim()) {
          pagesMap[annexId] = item.page.trim();
        }

        if (typeof item.title === 'string' && item.title.trim()) {
          annexObj.title = item.title.trim();
          titlesMap[annexId] = annexObj.title;
        }
        if (typeof item.description === 'string' && item.description.trim()) {
          annexObj.description = item.description.trim();
          descriptionsMap[annexId] = annexObj.description;
        }
        if (typeof item.publicUrl === 'string' && item.publicUrl.trim()) {
          publicUrlsMap[annexId] = item.publicUrl.trim();
        }

        if (item.base64 && item.fileName) {
          const bytes = base64ToUint8Array(item.base64);
          const restoredFile = new File([bytes], item.fileName, {
            type: item.mimeType || 'application/octet-stream',
          });
          const ext = item.ext || getFileExtension(item.fileName);
          const existing = state.sessionFiles.get(annexId);
          if (existing && existing.objectUrl) URL.revokeObjectURL(existing.objectUrl);

          const entry = {
            file: restoredFile,
            name: restoredFile.name,
            size: restoredFile.size,
            ext,
            objectUrl: URL.createObjectURL(restoredFile),
            publicUrl: item.publicUrl || '',
            officeEngine: ['docx', 'xlsx', 'pptx'].includes(ext) ? 'local' : 'officeOnline',
            versionId: null,
          };
          state.sessionFiles.set(annexId, entry);
          await saveFileToIndexedDB(annexId, restoredFile, ext);
          const ver = await addVersionToIndexedDB(annexId, restoredFile, ext);
          if (ver) entry.versionId = ver.versionId;
          await refreshVersions(annexId);
        }
      }

      savePersistedMap(window.localStorage, STORAGE_KEYS.titles, titlesMap);
      savePersistedMap(window.localStorage, STORAGE_KEYS.descriptions, descriptionsMap);
      savePersistedMap(window.localStorage, STORAGE_KEYS.publicUrls, publicUrlsMap);
      savePersistedMap(window.localStorage, STORAGE_KEYS.pages, pagesMap);
      renderAll();
      window.alert('Paquete del portafolio importado correctamente. Ya puedes previsualizar todos los anexos.');
    } catch {
      window.alert('No se pudo leer el archivo de paquete (.json). Verifica que esté completo y sin daños.');
    }
  }

  if (sharePortfolioBtn && shareModal) {
    sharePortfolioBtn.addEventListener('click', () => {
      if (shareStatusMsg) shareStatusMsg.textContent = '';
      shareModal.hidden = false;
    });
  }
  if (closeShareModalBtn && shareModal) {
    closeShareModalBtn.addEventListener('click', () => {
      shareModal.hidden = true;
    });
    shareModal.addEventListener('click', (e) => {
      if (e.target === shareModal) shareModal.hidden = true;
    });
  }
  if (exportPackageBtn) {
    exportPackageBtn.addEventListener('click', exportPortablePackage);
  }
  if (exportManifestBtn) {
    exportManifestBtn.addEventListener('click', exportGithubEvidencias);
  }
  if (importPackageBtn && importPackageInput) {
    importPackageBtn.addEventListener('click', () => importPackageInput.click());
    importPackageInput.addEventListener('change', (e) => {
      const target = e.target;
      if (target.files && target.files[0]) {
        importPortablePackage(target.files[0]);
        target.value = '';
      }
    });
  }

  window.addEventListener('beforeunload', () => {
    state.sessionFiles.forEach((entry) => {
      if (entry.objectUrl) URL.revokeObjectURL(entry.objectUrl);
    });
  });

  // Iniciar mostrando directamente el Video de Presentación al inicio y el Portafolio debajo
  renderAll();
}

// Exponer utilidades para pruebas automatizadas sin requerir sintaxis export (compatible con file:// y servidores)
globalThis.ADSO_PORTFOLIO = {
  STORAGE_KEYS,
  LEGACY_ID_MAP,
  DOCUMENT_EXTENSIONS,
  OFFICE_EXTENSIONS,
  VIDEO_EXTENSIONS,
  MAX_DOCUMENT_BYTES,
  MAX_VIDEO_BYTES,
  PRESENTATION_VIDEO_ANNEX,
  DEFAULT_ANNEXES,
  getFileExtension,
  formatFileSize,
  validateFileForAnnex,
  buildOfficeViewerUrls,
  getPreviewCategory,
  getPageLabel,
  loadPersistedMap,
  savePersistedMap,
  mergeAnnexesWithStorage,
  getNextVersionNumber,
  sortVersionsDescending,
  addVersionToIndexedDB,
  listVersionsFromIndexedDB,
  deleteVersionFromIndexedDB,
  extractZipEntries,
  resolveExcelSheets,
  parseExcelStyles,
  buildExcelSheetGrid,
  colIndexToLetter,
};

if (typeof document !== 'undefined') {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initPortfolioApp);
  } else {
    initPortfolioApp();
  }
}
