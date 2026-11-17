import fs from 'node:fs';
import path from 'node:path';
import { DatabaseSync } from 'node:sqlite';
import { env } from './env.js';
import { hashPassword } from '../utils/crypto.js';

/**
 * Inicializa la base de datos SQLite, ejecuta schema.sql y seed.sql,
 * y garantiza usuarios y registros de ejemplo para probar el Sprint 2 de inmediato.
 */
export function createDatabase(dbPath = env.dbPath) {
  if (dbPath !== ':memory:') {
    fs.mkdirSync(path.dirname(dbPath), { recursive: true });
  }

  const db = new DatabaseSync(dbPath);
  db.exec('PRAGMA foreign_keys = ON;');

  const schemaSql = fs.readFileSync(path.join(env.backendRoot, 'database', 'schema.sql'), 'utf8');
  const seedSql = fs.readFileSync(path.join(env.backendRoot, 'database', 'seed.sql'), 'utf8');

  db.exec(schemaSql);
  db.exec(seedSql);

  seedInitialUsersAndOffers(db);
  return db;
}

function seedInitialUsersAndOffers(db) {
  const userCount = db.prepare('SELECT COUNT(*) AS total FROM usuarios').get().total;
  if (userCount === 0) {
    const insertUser = db.prepare(
      'INSERT INTO usuarios (rol_id, nombre, correo, password_hash, activo) VALUES (?, ?, ?, ?, 1)'
    );
    insertUser.run(1, 'Administrador Grupo 8', 'admin@sena.edu.co', hashPassword('Admin123*'));
    insertUser.run(2, 'Aprendiz Editor', 'editor@sena.edu.co', hashPassword('Editor123*'));
    insertUser.run(3, 'Visitante Lector', 'lector@sena.edu.co', hashPassword('Lector123*'));
  }

  const offerCount = db.prepare('SELECT COUNT(*) AS total FROM ofertas_servicio').get().total;
  if (offerCount === 0) {
    const admin = db.prepare('SELECT id FROM usuarios WHERE correo = ?').get('admin@sena.edu.co');
    if (admin) {
      const insertOffer = db.prepare(
        `INSERT INTO ofertas_servicio (usuario_id, titulo, descripcion, categoria, ubicacion, presupuesto, estado)
         VALUES (?, ?, ?, ?, ?, ?, ?)`
      );
      insertOffer.run(
        admin.id,
        'Instalación de red eléctrica residencial',
        'Revisión completa de tablero de distribución y puntos de toma corriente en Neiva.',
        'Electricidad',
        'Neiva, Huila',
        350000,
        'ABIERTA'
      );
      insertOffer.run(
        admin.id,
        'Desarrollo de página web informativa',
        'Sitio web responsivo para negocio local con formulario de contacto.',
        'Tecnología',
        'Neiva, Huila',
        850000,
        'EN_PROCESO'
      );
    }
  }
}
