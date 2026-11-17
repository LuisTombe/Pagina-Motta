/**
 * Repositorio de acceso a datos para usuarios, roles y permisos (SQL parametrizado).
 */
export function createUserRepository(db) {
  return {
    findByEmail(correo) {
      return db
        .prepare(
          `SELECT u.id, u.rol_id, r.nombre AS rol_nombre, u.nombre, u.correo, u.password_hash, u.activo, u.creado_en
           FROM usuarios u
           INNER JOIN roles r ON r.id = u.rol_id
           WHERE LOWER(u.correo) = LOWER(?)`
        )
        .get(correo);
    },

    findById(id) {
      return db
        .prepare(
          `SELECT u.id, u.rol_id, r.nombre AS rol_nombre, u.nombre, u.correo, u.activo, u.creado_en
           FROM usuarios u
           INNER JOIN roles r ON r.id = u.rol_id
           WHERE u.id = ?`
        )
        .get(id);
    },

    findRoleByName(nombre) {
      return db.prepare('SELECT id, nombre, descripcion FROM roles WHERE UPPER(nombre) = UPPER(?)').get(nombre);
    },

    getPermissionsByRoleId(rolId) {
      const rows = db
        .prepare(
          `SELECT p.codigo
           FROM rol_permisos rp
           INNER JOIN permisos p ON p.id = rp.permiso_id
           WHERE rp.rol_id = ?`
        )
        .all(rolId);
      return rows.map((r) => r.codigo);
    },

    hasPermission(rolId, codigoPermiso) {
      const row = db
        .prepare(
          `SELECT 1 AS permitido
           FROM rol_permisos rp
           INNER JOIN permisos p ON p.id = rp.permiso_id
           WHERE rp.rol_id = ? AND p.codigo = ?
           LIMIT 1`
        )
        .get(rolId, codigoPermiso);
      return Boolean(row);
    },

    create({ rolId, nombre, correo, passwordHash }) {
      const result = db
        .prepare(
          `INSERT INTO usuarios (rol_id, nombre, correo, password_hash, activo)
           VALUES (?, ?, ?, ?, 1)`
        )
        .run(rolId, nombre, correo, passwordHash);
      return this.findById(Number(result.lastInsertRowid));
    },
  };
}
