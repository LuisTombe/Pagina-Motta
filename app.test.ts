import test from 'node:test';
import assert from 'node:assert/strict';
import {
  DEFAULT_ANNEXES,
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
} from './app.js';

test('DEFAULT_ANNEXES defines exactly 12 annexes with exact titles and rules', () => {
  assert.equal(DEFAULT_ANNEXES.length, 12);
  assert.equal(DEFAULT_ANNEXES[0].id, 'A');
  assert.equal(DEFAULT_ANNEXES[0].title, 'Anexo A. Planeación de actividades');
  assert.equal(DEFAULT_ANNEXES[10].id, 'K');
  assert.equal(DEFAULT_ANNEXES[10].title, 'Anexo K. Recursos humanos');

  const last = DEFAULT_ANNEXES[11];
  assert.equal(last.id, 'L');
  assert.equal(last.title, 'Anexos Html');
  assert.equal(last.kind, 'video');
});

test('getFileExtension extracts lowercase extensions safely', () => {
  assert.equal(getFileExtension('Plan_ADSO.PDF'), 'pdf');
  assert.equal(getFileExtension('prototipo.v2.docx'), 'docx');
  assert.equal(getFileExtension('sin_extension'), '');
  assert.equal(getFileExtension('.oculto'), '');
});

test('validateFileForAnnex accepts valid documents for A-K and rejects videos/executables', () => {
  const annexA = DEFAULT_ANNEXES[0];

  assert.equal(validateFileForAnnex(annexA, { name: 'plan.pdf', size: 1024 }).valid, true);
  assert.equal(validateFileForAnnex(annexA, { name: 'casos.docx', size: 4096 }).valid, true);
  assert.equal(validateFileForAnnex(annexA, { name: 'presupuesto.xlsx', size: 4096 }).valid, true);
  assert.equal(validateFileForAnnex(annexA, { name: 'expo.pptx', size: 4096 }).valid, true);

  const videoOnDoc = validateFileForAnnex(annexA, { name: 'demo.mp4', size: 4096 });
  assert.equal(videoOnDoc.valid, false);
  assert.match(videoOnDoc.error ?? '', /Formato no permitido/);

  const emptyFile = validateFileForAnnex(annexA, { name: 'vacio.pdf', size: 0 });
  assert.equal(emptyFile.valid, false);
  assert.match(emptyFile.error ?? '', /vacío/);

  const oversized = validateFileForAnnex(annexA, { name: 'enorme.pdf', size: MAX_DOCUMENT_BYTES + 1 });
  assert.equal(oversized.valid, false);
  assert.match(oversized.error ?? '', /límite permitido/);
});

test('validateFileForAnnex accepts only video files for Anexo L (Anexos Html)', () => {
  const annexL = DEFAULT_ANNEXES[11];

  assert.equal(validateFileForAnnex(annexL, { name: 'recorrido.mp4', size: 2048 }).valid, true);
  assert.equal(validateFileForAnnex(annexL, { name: 'demo.webm', size: 2048 }).valid, true);

  const pdfOnVideo = validateFileForAnnex(annexL, { name: 'manual.pdf', size: 2048 });
  assert.equal(pdfOnVideo.valid, false);
  assert.match(pdfOnVideo.error ?? '', /solo acepta videos/);

  const oversizedVideo = validateFileForAnnex(annexL, { name: 'largo.mp4', size: MAX_VIDEO_BYTES + 1 });
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

test('localStorage persistence helpers merge custom titles and handle malformed data', () => {
  const store = new Map<string, string>();
  const mockStorage = {
    getItem: (k: string) => store.get(k) ?? null,
    setItem: (k: string, v: string) => store.set(k, v),
  };

  savePersistedMap(mockStorage, STORAGE_KEYS.titles, { B: 'Anexo B. Casos Editados' });
  const loaded = loadPersistedMap(mockStorage, STORAGE_KEYS.titles);
  const merged = mergeAnnexesWithStorage(DEFAULT_ANNEXES, loaded, {});

  assert.equal(merged[1].title, 'Anexo B. Casos Editados');
  assert.equal(merged[0].title, 'Anexo A. Planeación de actividades');

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
