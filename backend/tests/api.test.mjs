import test from 'node:test';
import assert from 'node:assert/strict';
import { createApp } from '../src/app.js';

async function startTestServer() {
  const { server, db } = createApp({ dbPath: ':memory:', jwtSecret: 'test_secret_sprint2' });
  await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve));
  const address = server.address();
  const baseUrl = `http://127.0.0.1:${address.port}`;
  return {
    baseUrl,
    close: () =>
      new Promise((resolve) => {
        server.close(() => {
          db.close();
          resolve();
        });
      }),
  };
}

test('Sprint 2 Backend: BD de 5 tablas, Auth JWT, Autorización por roles/permisos y CRUD completo', async () => {
  const srv = await startTestServer();

  try {
    // 1. Health & OpenAPI docs
    const healthRes = await fetch(`${srv.baseUrl}/api/health`);
    assert.equal(healthRes.status, 200);
    const openApiRes = await fetch(`${srv.baseUrl}/api/openapi.json`);
    assert.equal(openApiRes.status, 200);

    // 2. Acceso sin token debe retornar 401 Unauthorized
    const unauthRes = await fetch(`${srv.baseUrl}/api/ofertas`);
    assert.equal(unauthRes.status, 401);

    // 3. Registro de nuevo usuario LECTOR y login
    const regRes = await fetch(`${srv.baseUrl}/api/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        nombre: 'Aprendiz Lector Test',
        correo: 'lector.test@sena.edu.co',
        password: 'Password123',
        rol: 'LECTOR',
      }),
    });
    assert.equal(regRes.status, 201);

    const loginLectorRes = await fetch(`${srv.baseUrl}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ correo: 'lector.test@sena.edu.co', password: 'Password123' }),
    });
    assert.equal(loginLectorRes.status, 200);
    const { token: lectorToken } = await loginLectorRes.json();
    assert.ok(lectorToken);

    // 4. LECTOR puede leer (GET), pero NO puede crear (POST -> 403 Forbidden)
    const lectorGetRes = await fetch(`${srv.baseUrl}/api/ofertas`, {
      headers: { Authorization: `Bearer ${lectorToken}` },
    });
    assert.equal(lectorGetRes.status, 200);

    const lectorPostRes = await fetch(`${srv.baseUrl}/api/ofertas`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${lectorToken}`,
      },
      body: JSON.stringify({
        titulo: 'Intento sin permiso',
        descripcion: 'El rol LECTOR no tiene permiso CREAR.',
      }),
    });
    assert.equal(lectorPostRes.status, 403);

    // 5. Login como ADMIN (tiene CREAR, LEER, ACTUALIZAR, ELIMINAR)
    const loginAdminRes = await fetch(`${srv.baseUrl}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ correo: 'admin@sena.edu.co', password: 'Admin123*' }),
    });
    assert.equal(loginAdminRes.status, 200);
    const { token: adminToken } = await loginAdminRes.json();

    // 6. CRUD completo con ADMIN: CREATE -> READ -> UPDATE -> DELETE
    const createRes = await fetch(`${srv.baseUrl}/api/ofertas`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${adminToken}`,
      },
      body: JSON.stringify({
        titulo: 'Diseño de base de datos relacional',
        descripcion: 'Modelado ER y scripts DDL para proyecto ADSO.',
        categoria: 'Software',
        ubicacion: 'Neiva, Huila',
        presupuesto: 500000,
        estado: 'ABIERTA',
      }),
    });
    assert.equal(createRes.status, 201);
    const createdJson = await createRes.json();
    const newId = createdJson.dato.id;
    assert.ok(newId);

    const getOneRes = await fetch(`${srv.baseUrl}/api/ofertas/${newId}`, {
      headers: { Authorization: `Bearer ${adminToken}` },
    });
    assert.equal(getOneRes.status, 200);

    const updateRes = await fetch(`${srv.baseUrl}/api/ofertas/${newId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${adminToken}`,
      },
      body: JSON.stringify({
        titulo: 'Diseño de BD actualizado',
        estado: 'EN_PROCESO',
        presupuesto: 650000,
      }),
    });
    assert.equal(updateRes.status, 200);
    const updatedJson = await updateRes.json();
    assert.equal(updatedJson.dato.estado, 'EN_PROCESO');
    assert.equal(updatedJson.dato.presupuesto, 650000);

    const deleteRes = await fetch(`${srv.baseUrl}/api/ofertas/${newId}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${adminToken}` },
    });
    assert.equal(deleteRes.status, 200);

    const afterDeleteRes = await fetch(`${srv.baseUrl}/api/ofertas/${newId}`, {
      headers: { Authorization: `Bearer ${adminToken}` },
    });
    assert.equal(afterDeleteRes.status, 404);
  } finally {
    await srv.close();
  }
});
