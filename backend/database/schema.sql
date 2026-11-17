-- ============================================================================
-- Sprint 2: Esquema Relacional (5 Tablas) — SQLite
-- Proyecto: Échele Camello (ADSO SENA - Grupo 8)
-- ============================================================================
PRAGMA foreign_keys = ON;

-- 1. Roles del sistema (Autorización)
CREATE TABLE IF NOT EXISTS roles (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  nombre TEXT NOT NULL UNIQUE,
  descripcion TEXT NOT NULL DEFAULT '',
  creado_en TEXT NOT NULL DEFAULT (datetime('now'))
);

-- 2. Catálogo de permisos granulares sobre operaciones CRUD (Autorización)
CREATE TABLE IF NOT EXISTS permisos (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  codigo TEXT NOT NULL UNIQUE,
  descripcion TEXT NOT NULL DEFAULT ''
);

-- 3. Relación N:M entre roles y permisos (Autorización)
CREATE TABLE IF NOT EXISTS rol_permisos (
  rol_id INTEGER NOT NULL,
  permiso_id INTEGER NOT NULL,
  PRIMARY KEY (rol_id, permiso_id),
  FOREIGN KEY (rol_id) REFERENCES roles(id) ON DELETE CASCADE,
  FOREIGN KEY (permiso_id) REFERENCES permisos(id) ON DELETE CASCADE
);

-- 4. Usuarios registrados (Autenticación y trazabilidad)
CREATE TABLE IF NOT EXISTS usuarios (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  rol_id INTEGER NOT NULL,
  nombre TEXT NOT NULL,
  correo TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  activo INTEGER NOT NULL DEFAULT 1,
  creado_en TEXT NOT NULL DEFAULT (datetime('now')),
  FOREIGN KEY (rol_id) REFERENCES roles(id) ON DELETE RESTRICT
);

-- 5. Entidad de dominio para operaciones CRUD (Ofertas de servicio / Échele Camello)
CREATE TABLE IF NOT EXISTS ofertas_servicio (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  usuario_id INTEGER NOT NULL,
  titulo TEXT NOT NULL,
  descripcion TEXT NOT NULL,
  categoria TEXT NOT NULL DEFAULT 'General',
  ubicacion TEXT NOT NULL DEFAULT 'Neiva, Huila',
  presupuesto REAL NOT NULL DEFAULT 0,
  estado TEXT NOT NULL DEFAULT 'ABIERTA' CHECK (estado IN ('ABIERTA', 'EN_PROCESO', 'CERRADA')),
  creado_en TEXT NOT NULL DEFAULT (datetime('now')),
  actualizado_en TEXT NOT NULL DEFAULT (datetime('now')),
  FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE RESTRICT
);

CREATE INDEX IF NOT EXISTS idx_usuarios_correo ON usuarios(correo);
CREATE INDEX IF NOT EXISTS idx_ofertas_usuario ON ofertas_servicio(usuario_id);
CREATE INDEX IF NOT EXISTS idx_ofertas_estado ON ofertas_servicio(estado);
