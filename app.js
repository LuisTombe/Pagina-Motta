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
  titles: 'adso_portafolio_annex_titles_v1',
  descriptions: 'adso_portafolio_annex_descriptions_v1',
  publicUrls: 'adso_portafolio_annex_public_urls_v1',
};

const IDB_CONFIG = {
  dbName: 'adso_portafolio_files_db_v1',
  storeName: 'annex_files',
};

const DOCUMENT_EXTENSIONS = ['doc', 'docx', 'pdf', 'xls', 'xlsx', 'ppt', 'pptx'];
const OFFICE_EXTENSIONS = ['doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx'];
const VIDEO_EXTENSIONS = ['mp4', 'webm', 'ogg', 'mov', 'm4v', 'avi', 'mkv'];

const MAX_DOCUMENT_BYTES = 25 * 1024 * 1024; // 25 MB
const MAX_VIDEO_BYTES = 150 * 1024 * 1024; // 150 MB

/**
 * Definición base de los 12 anexos requeridos del programa ADSO (Grupo 8).
 * El último botón (L) acepta únicamente un video y su título por defecto es "Anexos Html".
 */
const DEFAULT_ANNEXES = [
  {
    id: 'A',
    code: 'Anexo A',
    title: 'Anexo A. Planeación de actividades',
    description: 'Cronograma, plan de trabajo, entregables y asignación de tareas del proyecto Échele Camello.',
    kind: 'document',
    acceptedExtensions: DOCUMENT_EXTENSIONS,
    maxBytes: MAX_DOCUMENT_BYTES,
  },
  {
    id: 'B',
    code: 'Anexo B',
    title: 'Anexo B. Diagramas de casos de uso',
    description: 'Actores, escenarios principales, flujos alternos y especificaciones de casos de uso del sistema.',
    kind: 'document',
    acceptedExtensions: DOCUMENT_EXTENSIONS,
    maxBytes: MAX_DOCUMENT_BYTES,
  },
  {
    id: 'C',
    code: 'Anexo C',
    title: 'Anexo C. Diagramas de actividad',
    description: 'Modelado de procesos de negocio, flujos de decisión y secuencia operativa de los módulos.',
    kind: 'document',
    acceptedExtensions: DOCUMENT_EXTENSIONS,
    maxBytes: MAX_DOCUMENT_BYTES,
  },
  {
    id: 'D',
    code: 'Anexo D',
    title: 'Anexo D. Diagrama de dominio',
    description: 'Modelo conceptual de entidades, atributos, relaciones y reglas de negocio del dominio.',
    kind: 'document',
    acceptedExtensions: DOCUMENT_EXTENSIONS,
    maxBytes: MAX_DOCUMENT_BYTES,
  },
  {
    id: 'E',
    code: 'Anexo E',
    title: 'Anexo E. Taller de bases de datos',
    description: 'Modelo entidad-relación, diccionario de datos, normalización y scripts de diseño de base de datos.',
    kind: 'document',
    acceptedExtensions: DOCUMENT_EXTENSIONS,
    maxBytes: MAX_DOCUMENT_BYTES,
  },
  {
    id: 'F',
    code: 'Anexo F',
    title: 'Anexo F. Verificación de modelos y elaboración de prototipos',
    description: 'Listas de chequeo de calidad de modelos, trazabilidad y prototipos de interfaz de usuario.',
    kind: 'document',
    acceptedExtensions: DOCUMENT_EXTENSIONS,
    maxBytes: MAX_DOCUMENT_BYTES,
  },
  {
    id: 'G',
    code: 'Anexo G',
    title: 'Anexo G. Taller general',
    description: 'Evidencias integradoras y ejercicios prácticos transversales desarrollados en la etapa lectiva.',
    kind: 'document',
    acceptedExtensions: DOCUMENT_EXTENSIONS,
    maxBytes: MAX_DOCUMENT_BYTES,
  },
  {
    id: 'H',
    code: 'Anexo H',
    title: 'Anexo H. Hardware',
    description: 'Especificaciones de infraestructura física, estaciones de trabajo, servidores y requerimientos de red.',
    kind: 'document',
    acceptedExtensions: DOCUMENT_EXTENSIONS,
    maxBytes: MAX_DOCUMENT_BYTES,
  },
  {
    id: 'I',
    code: 'Anexo I',
    title: 'Anexo I. Licencias',
    description: 'Análisis de licenciamiento de software libre y propietario utilizado en el desarrollo del proyecto.',
    kind: 'document',
    acceptedExtensions: DOCUMENT_EXTENSIONS,
    maxBytes: MAX_DOCUMENT_BYTES,
  },
  {
    id: 'J',
    code: 'Anexo J',
    title: 'Anexo J. Software',
    description: 'Inventario de herramientas de desarrollo, entornos, bibliotecas, control de versiones y frameworks.',
    kind: 'document',
    acceptedExtensions: DOCUMENT_EXTENSIONS,
    maxBytes: MAX_DOCUMENT_BYTES,
  },
  {
    id: 'K',
    code: 'Anexo K',
    title: 'Anexo K. Recursos humanos',
    description: 'Roles del equipo de desarrollo, responsabilidades, matriz RACI y estimación de talento humano.',
    kind: 'document',
    acceptedExtensions: DOCUMENT_EXTENSIONS,
    maxBytes: MAX_DOCUMENT_BYTES,
  },
  {
    id: 'L',
    code: 'Anexo L',
    title: 'Anexos Html',
    description: 'Video demostrativo de evidencias y recorrido funcional de los anexos HTML del proyecto.',
    kind: 'video',
    acceptedExtensions: VIDEO_EXTENSIONS,
    maxBytes: MAX_VIDEO_BYTES,
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

function mergeAnnexesWithStorage(baseAnnexes, titlesMap, descriptionsMap) {
  return baseAnnexes.map((item) => {
    const customTitle = typeof titlesMap[item.id] === 'string' ? titlesMap[item.id].trim() : '';
    const customDesc = typeof descriptionsMap[item.id] === 'string' ? descriptionsMap[item.id].trim() : '';
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
function openFilesDatabase() {
  return new Promise((resolve) => {
    if (typeof indexedDB === 'undefined') {
      resolve(null);
      return;
    }
    try {
      const request = indexedDB.open(IDB_CONFIG.dbName, 1);
      request.onupgradeneeded = () => {
        const db = request.result;
        if (!db.objectStoreNames.contains(IDB_CONFIG.storeName)) {
          db.createObjectStore(IDB_CONFIG.storeName, { keyPath: 'annexId' });
        }
      };
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => resolve(null);
    } catch {
      resolve(null);
    }
  });
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
    const entryName = decoder.decode(nameBytes);

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

async function readZipEntryText(entries, entryPath) {
  const entry = entries.get(entryPath);
  if (!entry) return null;
  const decoder = new TextDecoder('utf-8');

  if (entry.compression === 0) {
    return decoder.decode(entry.compressedData);
  }

  if (entry.compression === 8 && typeof DecompressionStream !== 'undefined') {
    const ds = new DecompressionStream('deflate-raw');
    const writer = ds.writable.getWriter();
    writer.write(entry.compressedData);
    writer.close();
    const response = new Response(ds.readable);
    const arrayBuffer = await response.arrayBuffer();
    return decoder.decode(arrayBuffer);
  }

  return null;
}

async function renderLocalOfficePreview(file, ext, container) {
  container.innerHTML = '<p class="office-preview-box__meta">Procesando vista previa del documento...</p>';

  try {
    const entries = await extractZipEntries(file);
    const parser = new DOMParser();

    if (ext === 'docx') {
      const xmlText = await readZipEntryText(entries, 'word/document.xml');
      if (!xmlText) throw new Error('No se encontró word/document.xml');
      const xmlDoc = parser.parseFromString(xmlText, 'application/xml');
      const sheet = document.createElement('div');
      sheet.className = 'office-doc-sheet';

      const bodyNode = xmlDoc.getElementsByTagName('w:body')[0] || xmlDoc.documentElement;
      const children = Array.from(bodyNode.children || []);
      let hasContent = false;

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
              tr.appendChild(cellEl);
            });
            table.appendChild(tr);
          });
          tableWrap.appendChild(table);
          sheet.appendChild(tableWrap);
          hasContent = true;
        }
      });

      if (!hasContent) {
        const fallback = document.createElement('p');
        fallback.textContent = 'Documento Word cargado correctamente (sin párrafos de texto plano detectados).';
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

      const sheetKeys = Array.from(entries.keys())
        .filter((k) => /^xl\/worksheets\/sheet\d+\.xml$/i.test(k))
        .sort();

      if (sheetKeys.length === 0) throw new Error('No se encontraron hojas en el libro Excel');

      container.innerHTML = '';
      const tabsBar = document.createElement('div');
      tabsBar.className = 'office-sheet-tabs';
      const tableHolder = document.createElement('div');
      tableHolder.className = 'office-table-wrap';

      const renderSheet = async (sheetPath, activeIdx) => {
        Array.from(tabsBar.children).forEach((btn, idx) => {
          btn.classList.toggle('is-active', idx === activeIdx);
        });
        const sheetXml = await readZipEntryText(entries, sheetPath);
        if (!sheetXml) return;
        const sDoc = parser.parseFromString(sheetXml, 'application/xml');
        const rows = Array.from(sDoc.getElementsByTagName('row'));
        const table = document.createElement('table');
        table.className = 'office-table';

        rows.slice(0, 120).forEach((row, rIdx) => {
          const tr = document.createElement('tr');
          const cells = Array.from(row.getElementsByTagName('c'));
          cells.forEach((c) => {
            const cellEl = document.createElement(rIdx === 0 ? 'th' : 'td');
            const type = c.getAttribute('t');
            const vNode = c.getElementsByTagName('v')[0];
            const isNode = c.getElementsByTagName('is')[0];
            let val = vNode ? vNode.textContent || '' : '';
            if (type === 's' && val !== '') {
              val = sharedStrings[Number(val)] ?? val;
            } else if (type === 'inlineStr' && isNode) {
              val = isNode.textContent || '';
            }
            cellEl.textContent = val;
            tr.appendChild(cellEl);
          });
          table.appendChild(tr);
        });

        tableHolder.innerHTML = '';
        if (rows.length === 0) {
          const emptyMsg = document.createElement('p');
          emptyMsg.textContent = 'Esta hoja de cálculo no contiene celdas con datos.';
          tableHolder.appendChild(emptyMsg);
        } else {
          tableHolder.appendChild(table);
        }
      };

      sheetKeys.forEach((key, idx) => {
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = `btn-outline-sm${idx === 0 ? ' is-active' : ''}`;
        btn.textContent = `Hoja ${idx + 1}`;
        btn.addEventListener('click', () => renderSheet(key, idx));
        tabsBar.appendChild(btn);
      });

      container.appendChild(tabsBar);
      container.appendChild(tableHolder);
      await renderSheet(sheetKeys[0], 0);
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

      const grid = document.createElement('div');
      grid.className = 'office-slides-grid';

      for (let i = 0; i < slideKeys.length; i++) {
        const slideXml = await readZipEntryText(entries, slideKeys[i]);
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

        const card = document.createElement('article');
        card.className = 'office-slide-card';

        const badge = document.createElement('span');
        badge.className = 'office-slide-card__badge';
        badge.textContent = `Diapositiva ${i + 1}`;

        const body = document.createElement('div');
        body.className = 'office-slide-card__body';

        if (paragraphs.length === 0) {
          const p = document.createElement('p');
          p.textContent = '(Diapositiva visual / gráfica)';
          body.appendChild(p);
        } else {
          paragraphs.forEach((line, lIdx) => {
            const p = document.createElement('p');
            if (lIdx === 0) p.style.fontWeight = '700';
            p.textContent = line;
            body.appendChild(p);
          });
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
  } catch {
    container.innerHTML = '';
    const infoP = document.createElement('p');
    infoP.className = 'office-preview-box__notice';
    infoP.textContent =
      'Este archivo de Office está listo para descargarse. Para usar el visor externo de Microsoft Office Online o Google Docs Viewer, vincula su URL pública HTTPS en el panel lateral.';
    container.appendChild(infoP);
  }
}

/* ==========================================================================
   5. Aplicación interactiva en el DOM
   ========================================================================== */

function initPortfolioApp() {
  const coverScreen = document.getElementById('cover-screen');
  const annexesScreen = document.getElementById('annexes-screen');
  const enterPortfolioBtn = document.getElementById('enter-portfolio-btn');
  const backToCoverBtn = document.getElementById('back-to-cover-btn');
  const resetNamesBtn = document.getElementById('reset-names-btn');
  const loadedCounterEl = document.getElementById('loaded-counter');

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

  const previewAnnexCode = document.getElementById('preview-annex-code');
  const previewHeading = document.getElementById('preview-heading');
  const previewEmpty = document.getElementById('preview-empty');
  const previewEmptyHint = document.getElementById('preview-empty-hint');
  const previewContent = document.getElementById('preview-content');
  const previewOpenTabLink = document.getElementById('preview-open-tab-link');
  const previewDownloadLink = document.getElementById('preview-download-link');

  const zoomControls = document.getElementById('zoom-controls');
  const zoomOutBtn = document.getElementById('zoom-out-btn');
  const zoomInBtn = document.getElementById('zoom-in-btn');
  const zoomResetBtn = document.getElementById('zoom-reset-btn');
  const zoomLevelLabel = document.getElementById('zoom-level-label');

  if (!coverScreen || !annexesScreen) return;

  // Estado persistente y de sesión
  const titlesMap = loadPersistedMap(window.localStorage, STORAGE_KEYS.titles);
  const descriptionsMap = loadPersistedMap(window.localStorage, STORAGE_KEYS.descriptions);
  const publicUrlsMap = loadPersistedMap(window.localStorage, STORAGE_KEYS.publicUrls);

  const state = {
    view: 'cover',
    annexes: mergeAnnexesWithStorage(DEFAULT_ANNEXES, titlesMap, descriptionsMap),
    activeAnnexId: 'A',
    drawerOpen: true,
    zoomPercent: 100,
    // Mapa en sesión: { [annexId]: { file, name, size, ext, objectUrl, publicUrl, officeEngine } }
    sessionFiles: new Map(),
  };

  // Inicializar URLs públicas guardadas en localStorage
  Object.keys(publicUrlsMap).forEach((annexId) => {
    const urlVal = publicUrlsMap[annexId];
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

  // Restaurar archivos guardados en IndexedDB del navegador
  loadAllFilesFromIndexedDB().then((records) => {
    if (!records || records.length === 0) return;
    records.forEach((rec) => {
      if (rec && rec.annexId && rec.file) {
        const objectUrl = URL.createObjectURL(rec.file);
        const prev = state.sessionFiles.get(rec.annexId);
        state.sessionFiles.set(rec.annexId, {
          file: rec.file,
          name: rec.name || rec.file.name,
          size: rec.size || rec.file.size,
          ext: rec.ext || getFileExtension(rec.file.name),
          objectUrl,
          publicUrl: prev ? prev.publicUrl : '',
          officeEngine: ['docx', 'xlsx', 'pptx'].includes(rec.ext) ? 'local' : 'officeOnline',
        });
      }
    });
    if (state.view === 'annexes') {
      renderAll();
    } else {
      updateLoadedCounter();
    }
  });

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
    state.view = viewName;
    if (viewName === 'annexes') {
      coverScreen.hidden = true;
      annexesScreen.hidden = false;
      renderAll();
    } else {
      annexesScreen.hidden = true;
      coverScreen.hidden = false;
      coverScreen.classList.remove('is-entering');
      void coverScreen.offsetWidth;
      coverScreen.classList.add('is-entering');
    }
  }

  function setDrawerOpen(isOpen) {
    state.drawerOpen = isOpen;
    annexDrawer.classList.toggle('is-collapsed', !isOpen);
    toggleDrawerBtn.setAttribute('aria-expanded', String(isOpen));
    toggleDrawerLabel.textContent = isOpen ? 'Ocultar panel' : 'Desplegar panel';
    renderAnnexRail();
  }

  function updateLoadedCounter() {
    const count = state.sessionFiles.size;
    loadedCounterEl.textContent = `${count} de ${state.annexes.length} anexos cargados`;
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
     Renderizado de la columna derecha de 12 botones azul oscuro desplegables
     ------------------------------------------------------------------------ */
  function renderAnnexRail() {
    annexButtonsList.innerHTML = '';

    state.annexes.forEach((annex, index) => {
      const li = document.createElement('li');
      li.className = 'annex-rail__item';
      li.style.animationDelay = `${index * 25}ms`;

      const btn = document.createElement('button');
      const attached = state.sessionFiles.get(annex.id);
      const hasFile = Boolean(attached && (attached.objectUrl || attached.publicUrl));
      const isActive = annex.id === state.activeAnnexId;
      const isDeployed = isActive && state.drawerOpen;

      btn.type = 'button';
      btn.className = `annex-btn${isActive ? ' is-active' : ''}${isDeployed ? ' is-deployed' : ' is-collapsed'}${hasFile ? ' has-file' : ''}`;
      btn.dataset.annexId = annex.id;
      btn.setAttribute('aria-current', isActive ? 'true' : 'false');
      btn.setAttribute('aria-expanded', isDeployed ? 'true' : 'false');
      btn.setAttribute('aria-label', `${annex.title}${hasFile ? ' (archivo cargado)' : ''}`);

      // Fila principal del botón
      const topRow = document.createElement('span');
      topRow.className = 'annex-btn__top';

      const mainSpan = document.createElement('span');
      mainSpan.className = 'annex-btn__main';

      const codeSpan = document.createElement('span');
      codeSpan.className = 'annex-btn__code';
      codeSpan.textContent = annex.id;

      const labelSpan = document.createElement('span');
      labelSpan.className = 'annex-btn__label';
      labelSpan.textContent = annex.title;

      mainSpan.appendChild(codeSpan);
      mainSpan.appendChild(labelSpan);

      const rightSpan = document.createElement('span');
      rightSpan.className = 'annex-btn__right';

      const statusSpan = document.createElement('span');
      statusSpan.className = 'annex-btn__status';
      if (hasFile) {
        statusSpan.textContent = attached.ext ? `.${attached.ext.toUpperCase()}` : 'Cargado';
      } else if (annex.kind === 'video') {
        statusSpan.textContent = 'Video';
      } else {
        statusSpan.textContent = 'Doc';
      }

      const chevronSpan = document.createElement('span');
      chevronSpan.className = 'annex-btn__chevron';
      chevronSpan.setAttribute('aria-hidden', 'true');
      chevronSpan.innerHTML =
        '<svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="2" width="14" height="14"><path d="M12 5l-5 5 5 5" stroke-linecap="round" stroke-linejoin="round"/></svg>';

      rightSpan.appendChild(statusSpan);
      rightSpan.appendChild(chevronSpan);

      topRow.appendChild(mainSpan);
      topRow.appendChild(rightSpan);

      // Sub-fila desplegable del botón activo
      const collapseWrap = document.createElement('span');
      collapseWrap.className = 'annex-btn__collapse';
      const collapseInner = document.createElement('span');
      collapseInner.className = 'annex-btn__collapse-inner';

      const subText = document.createElement('span');
      if (hasFile) {
        subText.textContent = `Archivo: ${attached.name}`;
      } else if (annex.kind === 'video') {
        subText.textContent = 'Panel desplegado · Acepta solo video';
      } else {
        subText.textContent = 'Panel desplegado · Pulsa de nuevo para replegar';
      }
      collapseInner.appendChild(subText);
      collapseWrap.appendChild(collapseInner);

      btn.appendChild(topRow);
      btn.appendChild(collapseWrap);

      // Al pulsar el botón: si ya está activo, despliega/repliega el panel; si es otro, cambia y despliega con animación
      btn.addEventListener('click', () => {
        if (state.activeAnnexId === annex.id) {
          setDrawerOpen(!state.drawerOpen);
          if (state.drawerOpen) {
            triggerDrawerSwitchAnimation();
          }
          return;
        }
        state.activeAnnexId = annex.id;
        state.zoomPercent = 100;
        state.drawerOpen = true;
        annexDrawer.classList.remove('is-collapsed');
        toggleDrawerBtn.setAttribute('aria-expanded', 'true');
        toggleDrawerLabel.textContent = 'Ocultar panel';
        clearError();
        titleSaveStatus.textContent = '';
        renderAll();
        triggerDrawerSwitchAnimation();
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
      annex.kind === 'video' ? `${annex.code.toUpperCase()} · SOLO VIDEO` : `${annex.code.toUpperCase()} · DOCUMENTOS`;

    drawerAcceptedLabel.textContent =
      annex.kind === 'video'
        ? 'Formato requerido: Video (.mp4, .webm, .ogg, .mov, .m4v)'
        : 'Formatos: PDF, Word (.doc/.docx), Excel (.xls/.xlsx), PowerPoint (.ppt/.pptx)';

    annexTitleInput.value = annex.title;
    annexDescInput.value = annex.description;

    // Configurar input file según tipo de anexo (A-K documentos vs L video)
    fileInput.accept = annex.acceptedExtensions.map((ext) => `.${ext}`).join(',');
    dropzoneLimits.textContent = `Máximo ${formatFileSize(annex.maxBytes)} · ${annex.acceptedExtensions
      .map((e) => `.${e}`)
      .join(', ')}`;

    if (attached && attached.file) {
      dropzone.hidden = true;
      attachedFileCard.hidden = false;
      attachedExtTag.textContent = attached.ext.toUpperCase();
      attachedFileName.textContent = attached.name;
      attachedFileMeta.textContent = `${formatFileSize(attached.size)} · Previsualización activa`;
      if (drawerDownloadLink) {
        drawerDownloadLink.href = attached.objectUrl;
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

  function renderPreview() {
    const annex = getActiveAnnex();
    const attached = state.sessionFiles.get(annex.id);

    previewAnnexCode.textContent = annex.code;
    previewHeading.textContent = annex.title;
    previewContent.innerHTML = '';

    const hasFileOrUrl = Boolean(attached && (attached.objectUrl || attached.publicUrl));

    if (!hasFileOrUrl) {
      previewEmpty.hidden = false;
      previewContent.hidden = true;
      previewDownloadLink.hidden = true;
      if (previewOpenTabLink) previewOpenTabLink.hidden = true;
      zoomControls.hidden = true;
      previewEmptyHint.textContent =
        annex.kind === 'video'
          ? 'Carga un archivo de video (.mp4, .webm, .ogg o .mov) desde el panel desplegable para reproducirlo y descargarlo aquí.'
          : 'Carga un documento (.pdf, .doc, .docx, .xls, .xlsx, .ppt o .pptx) desde el panel desplegable para previsualizarlo y descargarlo aquí.';
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
      video.src = attached.objectUrl;
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
    const defaultEngine = attached.officeEngine || (urls ? 'officeOnline' : canLocalParse ? 'local' : 'summary');
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

  function renderAll() {
    updateLoadedCounter();
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

    const existing = state.sessionFiles.get(annex.id);
    if (existing && existing.objectUrl) {
      URL.revokeObjectURL(existing.objectUrl);
    }

    const objectUrl = URL.createObjectURL(file);
    const defaultOfficeEngine = ['docx', 'xlsx', 'pptx'].includes(validation.extension)
      ? 'local'
      : 'officeOnline';

    state.sessionFiles.set(annex.id, {
      file,
      name: file.name,
      size: file.size,
      ext: validation.extension,
      objectUrl,
      publicUrl: existing ? existing.publicUrl : '',
      officeEngine: defaultOfficeEngine,
    });

    saveFileToIndexedDB(annex.id, file, validation.extension);

    state.zoomPercent = 100;
    renderAll();
  }

  function removeCurrentFile() {
    const annex = getActiveAnnex();
    const existing = state.sessionFiles.get(annex.id);
    if (existing && existing.objectUrl) {
      URL.revokeObjectURL(existing.objectUrl);
    }
    state.sessionFiles.delete(annex.id);
    delete publicUrlsMap[annex.id];
    savePersistedMap(window.localStorage, STORAGE_KEYS.publicUrls, publicUrlsMap);
    deleteFileFromIndexedDB(annex.id);
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
  enterPortfolioBtn.addEventListener('click', () => showView('annexes'));
  backToCoverBtn.addEventListener('click', () => showView('cover'));

  closeDrawerBtn.addEventListener('click', () => setDrawerOpen(false));
  toggleDrawerBtn.addEventListener('click', () => setDrawerOpen(!state.drawerOpen));

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
    savePersistedMap(window.localStorage, STORAGE_KEYS.titles, {});
    state.annexes = state.annexes.map((current) => {
      const base = DEFAULT_ANNEXES.find((d) => d.id === current.id);
      return { ...current, title: base ? base.title : current.title };
    });
    titleSaveStatus.textContent = 'Nombres predeterminados restaurados.';
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

  window.addEventListener('beforeunload', () => {
    state.sessionFiles.forEach((entry) => {
      if (entry.objectUrl) URL.revokeObjectURL(entry.objectUrl);
    });
  });

  const params = new URLSearchParams(window.location.search);
  if (params.get('autostart') === '1') {
    showView('annexes');
  } else {
    showView('cover');
  }
}

// Exponer utilidades para pruebas automatizadas sin requerir sintaxis export (compatible con file:// y servidores)
globalThis.ADSO_PORTFOLIO = {
  STORAGE_KEYS,
  DOCUMENT_EXTENSIONS,
  OFFICE_EXTENSIONS,
  VIDEO_EXTENSIONS,
  MAX_DOCUMENT_BYTES,
  MAX_VIDEO_BYTES,
  DEFAULT_ANNEXES,
  getFileExtension,
  formatFileSize,
  validateFileForAnnex,
  buildOfficeViewerUrls,
  getPreviewCategory,
  loadPersistedMap,
  savePersistedMap,
  mergeAnnexesWithStorage,
};

if (typeof document !== 'undefined') {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initPortfolioApp);
  } else {
    initPortfolioApp();
  }
}
