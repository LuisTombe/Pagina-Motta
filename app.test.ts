import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import './report-data.js';
import './app.js';

const {
  DEFAULT_ANNEXES,
  PRESENTATION_VIDEO_ANNEX,
  LEGACY_ID_MAP,
  MAX_DOCUMENT_BYTES,
  MAX_VIDEO_BYTES,
  STORAGE_KEYS,
  buildOfficeViewerUrls,
  formatFileSize,
  getFileExtension,
  getPreviewCategory,
  getPageLabel,
  loadPersistedMap,
  mergeAnnexesWithStorage,
  savePersistedMap,
  validateFileForAnnex,
} = (globalThis as any).ADSO_PORTFOLIO;

test('DEFAULT_ANNEXES y PRESENTATION_VIDEO_ANNEX respetan la estructura fija oficial (1-11 + Anexos + Video)', () => {
  assert.equal(DEFAULT_ANNEXES.length, 12);
  assert.equal(DEFAULT_ANNEXES[0].id, '1');
  assert.equal(DEFAULT_ANNEXES[0].title, '1. Planeación de actividades');
  assert.equal(DEFAULT_ANNEXES[5].subtitles.length, 2);
  assert.equal(DEFAULT_ANNEXES[5].subtitles[0].title, '6.1 Revisión de los modelos de análisis');
  assert.equal(DEFAULT_ANNEXES[5].subtitles[1].title, '6.2 Elaboración de prototipos');
  assert.equal(DEFAULT_ANNEXES[7].subtitles[0].title, '8.1 Comparación de equipos y especificaciones');
  assert.equal(DEFAULT_ANNEXES[7].subtitles[1].title, '8.2 Selección y justificación de los equipos');
  assert.equal(DEFAULT_ANNEXES[9].subtitles[0].title, '10.1 Comparación y cotización de tecnologías');
  assert.equal(DEFAULT_ANNEXES[9].subtitles[1].title, '10.2 Selección y justificación de herramientas');
  assert.equal(DEFAULT_ANNEXES[10].id, '11');
  assert.equal(DEFAULT_ANNEXES[10].title, '11. Recursos humanos');
  assert.equal(DEFAULT_ANNEXES[10].subtitles.length, 3);
  assert.equal(DEFAULT_ANNEXES[10].subtitles[2].title, '11.3 Diagrama de Gantt y estimación de costos');

  const anexosItem = DEFAULT_ANNEXES[11];
  assert.equal(anexosItem.id, '12');
  assert.equal(anexosItem.title, 'Anexos');
  assert.equal(anexosItem.kind, 'document');

  assert.equal(PRESENTATION_VIDEO_ANNEX.id, '13');
  assert.equal(PRESENTATION_VIDEO_ANNEX.kind, 'video');
});

test('getFileExtension extracts lowercase extensions safely', () => {
  assert.equal(getFileExtension('Plan_ADSO.PDF'), 'pdf');
  assert.equal(getFileExtension('prototipo.v2.docx'), 'docx');
  assert.equal(getFileExtension('sin_extension'), '');
  assert.equal(getFileExtension('.oculto'), '');
});

test('validateFileForAnnex accepts valid documents for 1-12 and rejects videos/executables', () => {
  const annex1 = DEFAULT_ANNEXES[0];
  const anexos = DEFAULT_ANNEXES[11];

  assert.equal(validateFileForAnnex(annex1, { name: 'plan.pdf', size: 1024 }).valid, true);
  assert.equal(validateFileForAnnex(anexos, { name: 'portafolio.pdf', size: 2048 }).valid, true);
  assert.equal(validateFileForAnnex(annex1, { name: 'casos.docx', size: 4096 }).valid, true);
  assert.equal(validateFileForAnnex(annex1, { name: 'presupuesto.xlsx', size: 4096 }).valid, true);
  assert.equal(validateFileForAnnex(annex1, { name: 'expo.pptx', size: 4096 }).valid, true);

  const videoOnDoc = validateFileForAnnex(anexos, { name: 'demo.mp4', size: 4096 });
  assert.equal(videoOnDoc.valid, false);
  assert.match(videoOnDoc.error ?? '', /Formato no permitido/);

  const emptyFile = validateFileForAnnex(annex1, { name: 'vacio.pdf', size: 0 });
  assert.equal(emptyFile.valid, false);
  assert.match(emptyFile.error ?? '', /vacío/);

  const oversized = validateFileForAnnex(annex1, { name: 'enorme.pdf', size: MAX_DOCUMENT_BYTES + 1 });
  assert.equal(oversized.valid, false);
  assert.match(oversized.error ?? '', /límite permitido/);
});

test('validateFileForAnnex accepts only video files for PRESENTATION_VIDEO_ANNEX', () => {
  assert.equal(validateFileForAnnex(PRESENTATION_VIDEO_ANNEX, { name: 'recorrido.mp4', size: 2048 }).valid, true);
  assert.equal(validateFileForAnnex(PRESENTATION_VIDEO_ANNEX, { name: 'demo.webm', size: 2048 }).valid, true);

  const pdfOnVideo = validateFileForAnnex(PRESENTATION_VIDEO_ANNEX, { name: 'manual.pdf', size: 2048 });
  assert.equal(pdfOnVideo.valid, false);
  assert.match(pdfOnVideo.error ?? '', /solo acepta videos/);

  const oversizedVideo = validateFileForAnnex(PRESENTATION_VIDEO_ANNEX, { name: 'largo.mp4', size: MAX_VIDEO_BYTES + 1 });
  assert.equal(oversizedVideo.valid, false);
});

test('buildOfficeViewerUrls builds Microsoft Office Online and Google Docs URLs only for http/https', () => {
  const result = buildOfficeViewerUrls('https://sena.edu.co/docs/anexo.docx');
  assert.ok(result);
  assert.match(result.officeOnline, /^https:\/\/view\.officeapps\.live\.com\/op\/embed\.aspx\?src=/);
  assert.match(result.googleDocs, /^https:\/\/docs\.google\.com\/gview\?embedded=true&url=/);

  assert.equal(buildOfficeViewerUrls('blob:http://localhost:3000/abc-123'), null);
  assert.equal(buildOfficeViewerUrls('not-a-url'), null);
});

test('localStorage persistence helpers merge custom titles and format page numbers', () => {
  const store = new Map<string, string>();
  const mockStorage = {
    getItem: (k: string) => store.get(k) ?? null,
    setItem: (k: string, v: string) => store.set(k, v),
  };

  assert.equal(LEGACY_ID_MAP.A, '1');
  assert.equal(LEGACY_ID_MAP.K, '11');
  assert.equal(LEGACY_ID_MAP.L, '13');

  savePersistedMap(mockStorage, STORAGE_KEYS.titles, { '2': '2. Diagramas de casos de uso (Actualizado)' });
  const loaded = loadPersistedMap(mockStorage, STORAGE_KEYS.titles);
  const merged = mergeAnnexesWithStorage(DEFAULT_ANNEXES, loaded, {});

  assert.equal(merged[1].title, '2. Diagramas de casos de uso (Actualizado)');
  assert.equal(merged[0].title, '1. Planeación de actividades');

  assert.equal(getPageLabel({}, '1'), 'Pág. ___');
  assert.equal(getPageLabel({ '6.1': '24' }, '6.1'), 'Pág. 24');

  store.set(STORAGE_KEYS.titles, '{broken json');
  assert.deepEqual(loadPersistedMap(mockStorage, STORAGE_KEYS.titles), {});
});

test('formatFileSize and getPreviewCategory format values cleanly', () => {
  assert.equal(formatFileSize(512), '512 B');
  assert.equal(formatFileSize(2048), '2.0 KB');
  assert.equal(formatFileSize(5 * 1024 * 1024), '5.00 MB');
  assert.equal(getPreviewCategory('pdf'), 'pdf');
  assert.equal(getPreviewCategory('docx'), 'office');
  assert.equal(getPreviewCategory('mp4'), 'video');
});

test('control de versiones: getNextVersionNumber y sortVersionsDescending ordenan el historico', () => {
  const { getNextVersionNumber, sortVersionsDescending } = (globalThis as any).ADSO_PORTFOLIO;

  assert.equal(getNextVersionNumber([]), 1);
  assert.equal(getNextVersionNumber(undefined), 1);
  assert.equal(getNextVersionNumber([{ numero: 1 }, { numero: 3 }, { numero: 2 }]), 4);

  const sorted = sortVersionsDescending([{ numero: 1 }, { numero: 3 }, { numero: 2 }]);
  assert.deepEqual(
    sorted.map((v: { numero: number }) => v.numero),
    [3, 2, 1]
  );
});

test('imagenes (diagramas): se aceptan en los apartados 1-12 y no en el video de presentacion', () => {
  const annex4 = DEFAULT_ANNEXES[3];

  for (const name of ['diagrama.png', 'dominio.JPG', 'modelo.jpeg', 'flujo.gif', 'er.webp', 'uml.svg', 'foto.bmp']) {
    assert.equal(validateFileForAnnex(annex4, { name, size: 2048 }).valid, true, name);
  }
  assert.equal(validateFileForAnnex(PRESENTATION_VIDEO_ANNEX, { name: 'diagrama.png', size: 2048 }).valid, false);
  assert.equal(getPreviewCategory('png'), 'image');
  assert.equal(getPreviewCategory('svg'), 'image');
  assert.equal(getPreviewCategory('pdf'), 'pdf');
});

test('excel: colIndexToLetter genera referencias de columna correctas', () => {
  const { colIndexToLetter } = (globalThis as any).ADSO_PORTFOLIO;
  assert.equal(colIndexToLetter(0), 'A');
  assert.equal(colIndexToLetter(25), 'Z');
  assert.equal(colIndexToLetter(26), 'AA');
  assert.equal(colIndexToLetter(27), 'AB');
});

test('ECHELE_REPORT_DATA: omite puntos sin respaldo (10 y 15), deja Anexos al final y todas sus imágenes existen', () => {
  const { REPORT_SECTIONS, ANNEX_FALLBACK_SUMMARIES } = (globalThis as any).ECHELE_REPORT_DATA;
  assert.ok(Array.isArray(REPORT_SECTIONS) && REPORT_SECTIONS.length >= 16);

  const ids = REPORT_SECTIONS.map((s: any) => s.id);
  assert.equal(ids.includes('sec-10'), false);
  assert.equal(ids.includes('sec-15'), false);

  const last = REPORT_SECTIONS[REPORT_SECTIONS.length - 1];
  assert.equal(last.id, 'anexos');
  assert.equal(last.isAnnexWorkspace, true);

  assert.ok(ANNEX_FALLBACK_SUMMARIES['7']);
  assert.ok(ANNEX_FALLBACK_SUMMARIES['8']);

  const imageRefs: string[] = [];
  for (const sec of REPORT_SECTIONS) {
    if (Array.isArray(sec.gallery)) sec.gallery.forEach((g: any) => imageRefs.push(g.src));
    if (Array.isArray(sec.interactiveTabs)) {
      sec.interactiveTabs.forEach((t: any) => {
        if (Array.isArray(t.gallery)) t.gallery.forEach((g: any) => imageRefs.push(g.src));
      });
    }
  }
  Object.values(ANNEX_FALLBACK_SUMMARIES).forEach((fb: any) => {
    if (Array.isArray(fb.gallery)) fb.gallery.forEach((g: any) => imageRefs.push(g.src));
  });

  assert.ok(imageRefs.length >= 35, 'Debe incluir los diagramas y fotos extraídos');
  for (const rel of imageRefs) {
    const abs = path.join(process.cwd(), rel);
    assert.equal(fs.existsSync(abs), true, `Falta imagen referenciada: ${rel}`);
  }
});

test('evidencias/manifest.json publica los 12 anexos (incluyendo 7 y 8) y admite .xlsm', () => {
  assert.equal(getPreviewCategory('xlsm'), 'office');
  assert.equal(validateFileForAnnex(DEFAULT_ANNEXES[10], { name: 'rrhh.xlsm', size: 1024 }).valid, true);

  const manifestRaw = fs.readFileSync(path.join(process.cwd(), 'evidencias', 'manifest.json'), 'utf8');
  const manifest = JSON.parse(manifestRaw);
  assert.ok(Array.isArray(manifest.annexes));
  assert.equal(manifest.annexes.length, 12);

  const ids = manifest.annexes.map((a: any) => a.id);
  for (let i = 1; i <= 12; i++) {
    assert.equal(ids.includes(String(i)), true, `Falta anexo ${i} en manifest.json`);
  }
  for (const item of manifest.annexes) {
    const abs = path.join(process.cwd(), item.path);
    assert.equal(fs.existsSync(abs), true, `Falta archivo publicado: ${item.path}`);
    assert.ok(fs.statSync(abs).size > 0, `Archivo vacío: ${item.path}`);
  }
});
