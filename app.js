/* ==========================================================================
   Portafolio de Evidencias ADSO — SENA ("ÉCHELE CAMELLO")
   Lógica de aplicación en JavaScript puro (ES Module, sin frameworks).
   Secciones:
     1. Configuración de los 12 anexos y reglas de archivos
     2. Funciones puras de validación, formato y visores externos (testeables)
     3. Persistencia de nombres/descripciones en localStorage
     4. Estado de sesión con URL.createObjectURL (nota sobre IndexedDB)
     5. Controladores de UI, carga de archivos, previsualización y zoom
   ========================================================================== */

export const STORAGE_KEYS = {
  titles: 'adso_portafolio_annex_titles_v1',
  descriptions: 'adso_portafolio_annex_descriptions_v1',
};

export const DOCUMENT_EXTENSIONS = ['doc', 'docx', 'pdf', 'xls', 'xlsx', 'ppt', 'pptx'];
export const OFFICE_EXTENSIONS = ['doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx'];
export const VIDEO_EXTENSIONS = ['mp4', 'webm', 'ogg', 'mov', 'm4v'];

export const MAX_DOCUMENT_BYTES = 25 * 1024 * 1024; // 25 MB
export const MAX_VIDEO_BYTES = 150 * 1024 * 1024; // 150 MB

/**
 * Definición base de los 12 anexos requeridos del programa ADSO.
 * Nota: El último botón (L) acepta únicamente video y su título por defecto es "Anexos Html".
 */
export const DEFAULT_ANNEXES = [
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

export function getFileExtension(fileName) {
  if (typeof fileName !== 'string') return '';
  const trimmed = fileName.trim();
  const lastDot = trimmed.lastIndexOf('.');
  if (lastDot <= 0 || lastDot === trimmed.length - 1) return '';
  return trimmed.slice(lastDot + 1).toLowerCase();
}

export function formatFileSize(bytes) {
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
export function validateFileForAnnex(annex, file) {
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
 * únicamente cuando el archivo es accesible por una URL pública HTTPS/HTTP.
 */
export function buildOfficeViewerUrls(publicUrl) {
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

export function getPreviewCategory(extension) {
  const ext = String(extension || '').toLowerCase();
  if (ext === 'pdf') return 'pdf';
  if (VIDEO_EXTENSIONS.includes(ext)) return 'video';
  if (OFFICE_EXTENSIONS.includes(ext)) return 'office';
  return 'unsupported';
}

/* ==========================================================================
   3. Persistencia de títulos y descripciones en localStorage
   ========================================================================== */

export function loadPersistedMap(storage, key) {
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

export function savePersistedMap(storage, key, map) {
  if (!storage || typeof storage.setItem !== 'function') return;
  try {
    storage.setItem(key, JSON.stringify(map));
  } catch {
    // Silencioso si el almacenamiento está restringido en el navegador
  }
}

export function mergeAnnexesWithStorage(baseAnnexes, titlesMap, descriptionsMap) {
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

/* ==========================================================================
   4. Aplicación interactiva en el DOM
   Nota sobre persistencia de archivos:
   Los archivos cargados se mantienen en memoria durante la sesión activa con
   URL.createObjectURL(file) para previsualización y descarga instantánea.
   Limitación: al recargar la pestaña, los Object URLs se liberan. Para
   conservar archivos binarios entre sesiones se recomienda usar IndexedDB.
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
  const uploadErrorEl = document.getElementById('upload-error');

  const attachedFileCard = document.getElementById('attached-file-card');
  const attachedExtTag = document.getElementById('attached-ext-tag');
  const attachedFileName = document.getElementById('attached-file-name');
  const attachedFileMeta = document.getElementById('attached-file-meta');
  const replaceFileBtn = document.getElementById('replace-file-btn');
  const deleteFileBtn = document.getElementById('delete-file-btn');

  const publicUrlBox = document.getElementById('public-url-box');
  const publicUrlInput = document.getElementById('public-url-input');
  const applyPublicUrlBtn = document.getElementById('apply-public-url-btn');

  const previewAnnexCode = document.getElementById('preview-annex-code');
  const previewHeading = document.getElementById('preview-heading');
  const previewEmpty = document.getElementById('preview-empty');
  const previewEmptyHint = document.getElementById('preview-empty-hint');
  const previewContent = document.getElementById('preview-content');
  const previewDownloadLink = document.getElementById('preview-download-link');

  const zoomControls = document.getElementById('zoom-controls');
  const zoomOutBtn = document.getElementById('zoom-out-btn');
  const zoomInBtn = document.getElementById('zoom-in-btn');
  const zoomResetBtn = document.getElementById('zoom-reset-btn');
  const zoomLevelLabel = document.getElementById('zoom-level-label');

  // Estado en memoria de la aplicación
  const titlesMap = loadPersistedMap(window.localStorage, STORAGE_KEYS.titles);
  const descriptionsMap = loadPersistedMap(window.localStorage, STORAGE_KEYS.descriptions);

  const state = {
    view: 'cover',
    annexes: mergeAnnexesWithStorage(DEFAULT_ANNEXES, titlesMap, descriptionsMap),
    activeAnnexId: 'A',
    drawerOpen: true,
    zoomPercent: 100,
    // Mapa de archivos en sesión: { [annexId]: { file, name, size, ext, objectUrl, publicUrl, officeEngine } }
    sessionFiles: new Map(),
  };

  function getActiveAnnex() {
    return state.annexes.find((a) => a.id === state.activeAnnexId) || state.annexes[0];
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
    }
  }

  function setDrawerOpen(isOpen) {
    state.drawerOpen = isOpen;
    annexDrawer.classList.toggle('is-collapsed', !isOpen);
    toggleDrawerBtn.setAttribute('aria-expanded', String(isOpen));
    toggleDrawerLabel.textContent = isOpen ? 'Ocultar panel' : 'Mostrar panel';
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
     Renderizado de la columna derecha de 12 botones azul oscuro
     ------------------------------------------------------------------------ */
  function renderAnnexRail() {
    annexButtonsList.innerHTML = '';

    state.annexes.forEach((annex) => {
      const li = document.createElement('li');
      const btn = document.createElement('button');
      const hasFile = state.sessionFiles.has(annex.id);
      const isActive = annex.id === state.activeAnnexId;

      btn.type = 'button';
      btn.className = `annex-btn${isActive ? ' is-active' : ''}${hasFile ? ' has-file' : ''}`;
      btn.dataset.annexId = annex.id;
      btn.setAttribute('aria-current', isActive ? 'true' : 'false');
      btn.setAttribute('aria-label', `${annex.title}${hasFile ? ' (archivo cargado)' : ''}`);

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

      const statusSpan = document.createElement('span');
      statusSpan.className = 'annex-btn__status';
      if (hasFile) {
        statusSpan.textContent = 'Cargado';
      } else if (annex.kind === 'video') {
        statusSpan.textContent = 'Video';
      } else {
        statusSpan.textContent = '';
      }

      btn.appendChild(mainSpan);
      btn.appendChild(statusSpan);

      btn.addEventListener('click', () => {
        state.activeAnnexId = annex.id;
        state.zoomPercent = 100;
        setDrawerOpen(true);
        clearError();
        titleSaveStatus.textContent = '';
        renderAll();
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
        ? 'Formato requerido: Video (.mp4, .webm, .ogg, .mov)'
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
      attachedFileMeta.textContent = `${formatFileSize(attached.size)} · Disponible en sesión`;
    } else {
      dropzone.hidden = false;
      attachedFileCard.hidden = true;
    }

    // Mostrar campo de URL pública para visores externos de Office
    const isOfficeCandidate =
      annex.kind === 'document' && (!attached || getPreviewCategory(attached.ext) === 'office');
    publicUrlBox.hidden = !isOfficeCandidate;
    publicUrlInput.value = attached && attached.publicUrl ? attached.publicUrl : '';
  }

  /* ------------------------------------------------------------------------
     Renderizado del área de previsualización (espacio restante)
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

    // Caso 1: Existe una URL pública para visor Office Online / Google Docs
    if (attached && attached.publicUrl && (!attached.file || getPreviewCategory(attached.ext) === 'office')) {
      const urls = buildOfficeViewerUrls(attached.publicUrl);
      if (urls) {
        previewEmpty.hidden = true;
        previewContent.hidden = false;
        zoomControls.hidden = false;

        previewDownloadLink.hidden = false;
        previewDownloadLink.href = attached.objectUrl || attached.publicUrl;
        previewDownloadLink.setAttribute('download', attached.name || `${annex.id}.docx`);

        const tabs = document.createElement('div');
        tabs.className = 'office-viewer-tabs';

        const activeEngine = attached.officeEngine || 'officeOnline';

        const msBtn = document.createElement('button');
        msBtn.type = 'button';
        msBtn.className = `btn-outline-sm${activeEngine === 'officeOnline' ? ' is-active' : ''}`;
        msBtn.textContent = 'Microsoft Office Online';
        msBtn.addEventListener('click', () => {
          attached.officeEngine = 'officeOnline';
          renderPreview();
        });

        const ggBtn = document.createElement('button');
        ggBtn.type = 'button';
        ggBtn.className = `btn-outline-sm${activeEngine === 'googleDocs' ? ' is-active' : ''}`;
        ggBtn.textContent = 'Google Docs Viewer';
        ggBtn.addEventListener('click', () => {
          attached.officeEngine = 'googleDocs';
          renderPreview();
        });

        tabs.appendChild(msBtn);
        tabs.appendChild(ggBtn);

        const zoomWrap = document.createElement('div');
        zoomWrap.className = 'preview-zoom-wrapper';

        const iframe = document.createElement('iframe');
        iframe.className = 'preview-pdf-frame';
        iframe.title = `Visor externo de ${annex.title}`;
        iframe.src = activeEngine === 'googleDocs' ? urls.googleDocs : urls.officeOnline;
        iframe.setAttribute('loading', 'lazy');

        zoomWrap.appendChild(iframe);
        applyZoomTransform(zoomWrap);

        previewContent.appendChild(tabs);
        previewContent.appendChild(zoomWrap);
        return;
      }
    }

    // Caso 2: Sin archivo adjunto
    if (!attached || !attached.objectUrl) {
      previewEmpty.hidden = false;
      previewContent.hidden = true;
      previewDownloadLink.hidden = true;
      zoomControls.hidden = true;
      previewEmptyHint.textContent =
        annex.kind === 'video'
          ? 'Carga un archivo de video (.mp4, .webm, .ogg o .mov) desde el panel lateral para reproducirlo y descargarlo aquí.'
          : 'Carga un documento (.pdf, .doc, .docx, .xls, .xlsx, .ppt o .pptx) desde el panel lateral para previsualizarlo y descargarlo aquí.';
      return;
    }

    previewEmpty.hidden = true;
    previewContent.hidden = false;

    // Enlace real de descarga mediante atributo download
    previewDownloadLink.hidden = false;
    previewDownloadLink.href = attached.objectUrl;
    previewDownloadLink.setAttribute('download', attached.name);

    const category = getPreviewCategory(attached.ext);

    if (category === 'pdf') {
      zoomControls.hidden = false;
      const zoomWrap = document.createElement('div');
      zoomWrap.className = 'preview-zoom-wrapper';

      const iframe = document.createElement('iframe');
      iframe.className = 'preview-pdf-frame';
      iframe.src = attached.objectUrl;
      iframe.title = `Previsualización PDF de ${attached.name}`;

      zoomWrap.appendChild(iframe);
      applyZoomTransform(zoomWrap);
      previewContent.appendChild(zoomWrap);
      return;
    }

    if (category === 'video') {
      zoomControls.hidden = false;
      const zoomWrap = document.createElement('div');
      zoomWrap.className = 'preview-zoom-wrapper';

      const video = document.createElement('video');
      video.className = 'preview-video-player';
      video.controls = true;
      video.playsInline = true;
      video.src = attached.objectUrl;
      video.setAttribute('aria-label', `Reproductor de video para ${attached.name}`);

      zoomWrap.appendChild(video);
      applyZoomTransform(zoomWrap);
      previewContent.appendChild(zoomWrap);
      return;
    }

    // Documentos Office locales (.doc, .docx, .xls, .xlsx, .ppt, .pptx)
    zoomControls.hidden = true;
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
    meta.textContent = `Tamaño: ${formatFileSize(attached.size)} · Listo para descarga directa`;

    leftInfo.appendChild(extBadge);
    leftInfo.appendChild(fileTitle);
    leftInfo.appendChild(meta);
    head.appendChild(leftInfo);

    const notice = document.createElement('div');
    notice.className = 'office-preview-box__notice';
    notice.textContent =
      'Los archivos de Office cargados localmente viven en la memoria del navegador (URL blob:), por lo que Microsoft Office Online y Google Docs Viewer no pueden acceder a ellos de forma directa. Puedes descargarlo ahora o vincular una URL pública HTTPS en el panel lateral para abrirlo en el visor en línea.';

    const directDownload = document.createElement('a');
    directDownload.className = 'btn-download';
    directDownload.href = attached.objectUrl;
    directDownload.setAttribute('download', attached.name);
    directDownload.textContent = `Descargar ${attached.name}`;

    card.appendChild(head);
    card.appendChild(notice);
    card.appendChild(directDownload);
    previewContent.appendChild(card);
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
    state.sessionFiles.set(annex.id, {
      file,
      name: file.name,
      size: file.size,
      ext: validation.extension,
      objectUrl,
      publicUrl: existing ? existing.publicUrl : '',
      officeEngine: 'officeOnline',
    });

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
    titleSaveStatus.textContent = 'Nombre guardado.';
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

  selectFileBtn.addEventListener('click', () => fileInput.click());
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
    state.sessionFiles.set(annex.id, existing);
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

  // Limpieza de memoria al cerrar pestaña
  window.addEventListener('beforeunload', () => {
    state.sessionFiles.forEach((entry) => {
      if (entry.objectUrl) URL.revokeObjectURL(entry.objectUrl);
    });
  });

  // Soporte ?autostart=1 para saltar directo a la vista de anexos si se solicita
  const params = new URLSearchParams(window.location.search);
  if (params.get('autostart') === '1') {
    showView('annexes');
  } else {
    showView('cover');
  }
}

if (typeof document !== 'undefined') {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initPortfolioApp);
  } else {
    initPortfolioApp();
  }
}
