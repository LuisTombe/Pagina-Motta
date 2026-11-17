import test from 'node:test';
import assert from 'node:assert/strict';
import './app.js';

const {
  DEFAULT_ANNEXES,
  LEGACY_ID_MAP,
  MAX_DOCUMENT_BYTES,
  MAX_VIDEO_BYTES,
  STORAGE_KEYS,
  buildOfficeViewerUrls,
  formatFileSize,
  getFileExtension,
  getPreviewCategory,
  loadPersistedMap,
  mergeAnnexesWithStorage,
  savePersistedMap,
  validateFileForAnnex,
} = (globalThis as any).ADSO_PORTFOLIO;

test('DEFAULT_ANNEXES defines 13 numbered annexes (1-13), with 12 as Portafolio de evidencias and 13 as video', () => {
  assert.equal(DEFAULT_ANNEXES.length, 13);
  assert.equal(DEFAULT_ANNEXES[0].id, '1');
  assert.equal(DEFAULT_ANNEXES[0].title, 'Anexo 1. Planeación de actividades');
  assert.equal(DEFAULT_ANNEXES[10].id, '11');
  assert.equal(DEFAULT_ANNEXES[10].title, 'Anexo 11. Recursos humanos');

  const annex12 = DEFAULT_ANNEXES[11];
  assert.equal(annex12.id, '12');
  assert.equal(annex12.title, 'Anexo 12. Portafolio de evidencias');
  assert.equal(annex12.kind, 'document');

  const annex13 = DEFAULT_ANNEXES[12];
  assert.equal(annex13.id, '13');
  assert.equal(annex13.title, 'Anexo 13. Anexos Html');
  assert.equal(annex13.kind, 'video');
});

test('getFileExtension extracts lowercase extensions safely', () => {
  assert.equal(getFileExtension('Plan_ADSO.PDF'), 'pdf');
  assert.equal(getFileExtension('prototipo.v2.docx'), 'docx');
  assert.equal(getFileExtension('sin_extension'), '');
  assert.equal(getFileExtension('.oculto'), '');
});

test('validateFileForAnnex accepts valid documents for 1-12 and rejects videos/executables', () => {
  const annex1 = DEFAULT_ANNEXES[0];
  const annex12 = DEFAULT_ANNEXES[11];

  assert.equal(validateFileForAnnex(annex1, { name: 'plan.pdf', size: 1024 }).valid, true);
  assert.equal(validateFileForAnnex(annex12, { name: 'portafolio.pdf', size: 2048 }).valid, true);
  assert.equal(validateFileForAnnex(annex1, { name: 'casos.docx', size: 4096 }).valid, true);
  assert.equal(validateFileForAnnex(annex1, { name: 'presupuesto.xlsx', size: 4096 }).valid, true);
  assert.equal(validateFileForAnnex(annex1, { name: 'expo.pptx', size: 4096 }).valid, true);

  const videoOnDoc = validateFileForAnnex(annex12, { name: 'demo.mp4', size: 4096 });
  assert.equal(videoOnDoc.valid, false);
  assert.match(videoOnDoc.error ?? '', /Formato no permitido/);

  const emptyFile = validateFileForAnnex(annex1, { name: 'vacio.pdf', size: 0 });
  assert.equal(emptyFile.valid, false);
  assert.match(emptyFile.error ?? '', /vacío/);

  const oversized = validateFileForAnnex(annex1, { name: 'enorme.pdf', size: MAX_DOCUMENT_BYTES + 1 });
  assert.equal(oversized.valid, false);
  assert.match(oversized.error ?? '', /límite permitido/);
});

test('validateFileForAnnex accepts only video files for Anexo 13 (Anexo 13. Anexos Html)', () => {
  const annex13 = DEFAULT_ANNEXES[12];

  assert.equal(validateFileForAnnex(annex13, { name: 'recorrido.mp4', size: 2048 }).valid, true);
  assert.equal(validateFileForAnnex(annex13, { name: 'demo.webm', size: 2048 }).valid, true);

  const pdfOnVideo = validateFileForAnnex(annex13, { name: 'manual.pdf', size: 2048 });
  assert.equal(pdfOnVideo.valid, false);
  assert.match(pdfOnVideo.error ?? '', /solo acepta videos/);

  const oversizedVideo = validateFileForAnnex(annex13, { name: 'largo.mp4', size: MAX_VIDEO_BYTES + 1 });
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

test('localStorage persistence helpers merge custom titles and migrate legacy A-L keys to 1-13', () => {
  const store = new Map<string, string>();
  const mockStorage = {
    getItem: (k: string) => store.get(k) ?? null,
    setItem: (k: string, v: string) => store.set(k, v),
  };

  assert.equal(LEGACY_ID_MAP.A, '1');
  assert.equal(LEGACY_ID_MAP.K, '11');
  assert.equal(LEGACY_ID_MAP.L, '13');

  savePersistedMap(mockStorage, STORAGE_KEYS.titles, { B: 'Anexo B. Casos Editados' });
  const loaded = loadPersistedMap(mockStorage, STORAGE_KEYS.titles);
  const merged = mergeAnnexesWithStorage(DEFAULT_ANNEXES, loaded, {});

  assert.equal(merged[1].title, 'Anexo 2. Casos Editados');
  assert.equal(merged[0].title, 'Anexo 1. Planeación de actividades');

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
