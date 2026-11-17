import fs from 'node:fs';
import http from 'node:http';
import path from 'node:path';
import { createDatabase } from './config/database.js';
import { env } from './config/env.js';
import { createAuthController } from './controllers/authController.js';
import { createOfferController } from './controllers/offerController.js';
import { createAuthMiddleware } from './middlewares/auth.js';
import { createOfferRepository } from './repositories/offerRepository.js';
import { createUserRepository } from './repositories/userRepository.js';

function sendJson(res, status, data) {
  res.writeHead(status, {
    'Content-Type': 'application/json; charset=utf-8',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, PATCH, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  });
  res.end(JSON.stringify(data, null, 2));
}

function sendHtml(res, status, html) {
  res.writeHead(status, { 'Content-Type': 'text/html; charset=utf-8' });
  res.end(html);
}

function readJsonBody(req) {
  return new Promise((resolve, reject) => {
    let raw = '';
    req.on('data', (chunk) => {
      raw += chunk;
      if (raw.length > 1024 * 1024) {
        reject(new Error('PAYLOAD_TOO_LARGE'));
      }
    });
    req.on('end', () => {
      if (!raw.trim()) {
        resolve({});
        return;
      }
      try {
        resolve(JSON.parse(raw));
      } catch {
        reject(new Error('INVALID_JSON'));
      }
    });
    req.on('error', reject);
  });
}

function renderDocsHtml(spec) {
  const pathsHtml = Object.entries(spec.paths)
    .map(([routePath, methods]) => {
      return Object.entries(methods)
        .map(([method, info]) => {
          const sec = info.security ? 'Requiere Bearer JWT' : 'Público';
          return `<div class="ep">
            <div class="ep-head"><span class="m ${method}">${method.toUpperCase()}</span> <code>${routePath}</code> <span class="sec">${sec}</span></div>
            <p>${info.summary || ''}</p>
          </div>`;
        })
        .join('');
    })
    .join('');

  return `<!doctype html><html lang="es"><head><meta charset="utf-8"><title>${spec.info.title}</title>
  <style>
    body{font-family:system-ui,sans-serif;max-width:860px;margin:40px auto;padding:0 20px;color:#0f172a;background:#f8fafc}
    h1{color:#0b2545} .ep{background:#fff;border:1px solid #e2e8f0;border-radius:8px;padding:14px 16px;margin:10px 0}
    .ep-head{display:flex;align-items:center;gap:10px;flex-wrap:wrap}
    .m{font-size:12px;font-weight:700;padding:3px 8px;border-radius:4px;color:#fff}
    .get{background:#2563eb}.post{background:#16a34a}.put{background:#d97706}.delete{background:#dc2626}
    .sec{margin-left:auto;font-size:12px;color:#475569;background:#f1f5f9;padding:2px 8px;border-radius:999px}
    code{font-family:monospace;font-size:14px;font-weight:600}
  </style></head><body>
  <h1>${spec.info.title}</h1><p>${spec.info.description}</p>
  <p>Especificación OpenAPI 3.0 en JSON: <a href="/api/openapi.json">/api/openapi.json</a></p>
  ${pathsHtml}</body></html>`;
}

/**
 * Crea la aplicación HTTP REST conectando base de datos, seguridad y controladores CRUD.
 */
export function createApp({ dbPath = env.dbPath, jwtSecret = env.jwtSecret } = {}) {
  const db = createDatabase(dbPath);
  const userRepository = createUserRepository(db);
  const offerRepository = createOfferRepository(db);

  const authMiddleware = createAuthMiddleware({ userRepository, jwtSecret });
  const authController = createAuthController({
    userRepository,
    jwtSecret,
    jwtExpiresInSeconds: env.jwtExpiresInSeconds,
  });
  const offerController = createOfferController({ offerRepository });

  const openApiPath = path.join(env.backendRoot, 'docs', 'openapi.json');
  const openApiSpec = JSON.parse(fs.readFileSync(openApiPath, 'utf8'));

  const server = http.createServer(async (req, res) => {
    try {
      if (req.method === 'OPTIONS') {
        sendJson(res, 204, {});
        return;
      }

      const url = new URL(req.url || '/', 'http://localhost');
      const pathname = url.pathname;

      // Salud del servicio y documentación
      if (req.method === 'GET' && pathname === '/api/health') {
        sendJson(res, 200, { estado: 'OK', sprint: 2, proyecto: 'Échele Camello - ADSO Grupo 8' });
        return;
      }
      if (req.method === 'GET' && pathname === '/api/openapi.json') {
        sendJson(res, 200, openApiSpec);
        return;
      }
      if (req.method === 'GET' && (pathname === '/api/docs' || pathname === '/')) {
        sendHtml(res, 200, renderDocsHtml(openApiSpec));
        return;
      }

      // Parsear cuerpo JSON para métodos con payload
      let body = {};
      if (['POST', 'PUT', 'PATCH'].includes(req.method)) {
        try {
          body = await readJsonBody(req);
        } catch (err) {
          const msg =
            err.message === 'PAYLOAD_TOO_LARGE'
              ? 'El cuerpo de la petición supera 1 MB.'
              : 'JSON malformado en el cuerpo de la petición.';
          sendJson(res, 400, { error: msg });
          return;
        }
      }

      // Endpoints públicos de Autenticación
      if (req.method === 'POST' && pathname === '/api/auth/register') {
        const result = authController.register(body);
        sendJson(res, result.status, result.body);
        return;
      }
      if (req.method === 'POST' && pathname === '/api/auth/login') {
        const result = authController.login(body);
        sendJson(res, result.status, result.body);
        return;
      }

      // Endpoint protegido de perfil autenticado
      if (req.method === 'GET' && pathname === '/api/auth/me') {
        const auth = authMiddleware.authenticate(req);
        if (!auth.ok) {
          sendJson(res, auth.status, { error: auth.message });
          return;
        }
        const result = authController.me(auth.user);
        sendJson(res, result.status, result.body);
        return;
      }

      // Endpoints CRUD de ofertas_servicio protegidos por JWT y permisos en BD
      if (pathname === '/api/ofertas') {
        const auth = authMiddleware.authenticate(req);
        if (!auth.ok) {
          sendJson(res, auth.status, { error: auth.message });
          return;
        }

        if (req.method === 'GET') {
          const perm = authMiddleware.authorize(auth.user, 'LEER');
          if (!perm.ok) {
            sendJson(res, perm.status, { error: perm.message });
            return;
          }
          const result = offerController.list(url.searchParams);
          sendJson(res, result.status, result.body);
          return;
        }

        if (req.method === 'POST') {
          const perm = authMiddleware.authorize(auth.user, 'CREAR');
          if (!perm.ok) {
            sendJson(res, perm.status, { error: perm.message });
            return;
          }
          const result = offerController.create(body, auth.user);
          sendJson(res, result.status, result.body);
          return;
        }
      }

      const offerIdMatch = pathname.match(/^\/api\/ofertas\/([^/]+)$/);
      if (offerIdMatch) {
        const idParam = offerIdMatch[1];
        const auth = authMiddleware.authenticate(req);
        if (!auth.ok) {
          sendJson(res, auth.status, { error: auth.message });
          return;
        }

        if (req.method === 'GET') {
          const perm = authMiddleware.authorize(auth.user, 'LEER');
          if (!perm.ok) {
            sendJson(res, perm.status, { error: perm.message });
            return;
          }
          const result = offerController.getById(idParam);
          sendJson(res, result.status, result.body);
          return;
        }

        if (req.method === 'PUT' || req.method === 'PATCH') {
          const perm = authMiddleware.authorize(auth.user, 'ACTUALIZAR');
          if (!perm.ok) {
            sendJson(res, perm.status, { error: perm.message });
            return;
          }
          const result = offerController.update(idParam, body);
          sendJson(res, result.status, result.body);
          return;
        }

        if (req.method === 'DELETE') {
          const perm = authMiddleware.authorize(auth.user, 'ELIMINAR');
          if (!perm.ok) {
            sendJson(res, perm.status, { error: perm.message });
            return;
          }
          const result = offerController.remove(idParam);
          sendJson(res, result.status, result.body);
          return;
        }
      }

      sendJson(res, 404, { error: `Ruta no encontrada: ${req.method} ${pathname}` });
    } catch (error) {
      sendJson(res, 500, { error: 'Error interno del servidor.', detalle: error.message });
    }
  });

  return { server, db };
}
