/**
 * Repositorio CRUD sobre la tabla ofertas_servicio (entidad de dominio del Sprint 2).
 */
export function createOfferRepository(db) {
  return {
    findAll({ estado, categoria } = {}) {
      const conditions = [];
      const params = [];

      if (estado) {
        conditions.push('o.estado = ?');
        params.push(estado);
      }
      if (categoria) {
        conditions.push('LOWER(o.categoria) = LOWER(?)');
        params.push(categoria);
      }

      const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';
      return db
        .prepare(
          `SELECT o.id, o.usuario_id, u.nombre AS autor_nombre, u.correo AS autor_correo,
                  o.titulo, o.descripcion, o.categoria, o.ubicacion, o.presupuesto, o.estado,
                  o.creado_en, o.actualizado_en
           FROM ofertas_servicio o
           INNER JOIN usuarios u ON u.id = o.usuario_id
           ${whereClause}
           ORDER BY o.id DESC`
        )
        .all(...params);
    },

    findById(id) {
      return db
        .prepare(
          `SELECT o.id, o.usuario_id, u.nombre AS autor_nombre, u.correo AS autor_correo,
                  o.titulo, o.descripcion, o.categoria, o.ubicacion, o.presupuesto, o.estado,
                  o.creado_en, o.actualizado_en
           FROM ofertas_servicio o
           INNER JOIN usuarios u ON u.id = o.usuario_id
           WHERE o.id = ?`
        )
        .get(id);
    },

    create({ usuarioId, titulo, descripcion, categoria, ubicacion, presupuesto, estado }) {
      const result = db
        .prepare(
          `INSERT INTO ofertas_servicio (usuario_id, titulo, descripcion, categoria, ubicacion, presupuesto, estado)
           VALUES (?, ?, ?, ?, ?, ?, ?)`
        )
        .run(usuarioId, titulo, descripcion, categoria, ubicacion, presupuesto, estado);
      return this.findById(Number(result.lastInsertRowid));
    },

    update(id, { titulo, descripcion, categoria, ubicacion, presupuesto, estado }) {
      db.prepare(
        `UPDATE ofertas_servicio
         SET titulo = ?,
             descripcion = ?,
             categoria = ?,
             ubicacion = ?,
             presupuesto = ?,
             estado = ?,
             actualizado_en = datetime('now')
         WHERE id = ?`
      ).run(titulo, descripcion, categoria, ubicacion, presupuesto, estado, id);
      return this.findById(id);
    },

    remove(id) {
      const result = db.prepare('DELETE FROM ofertas_servicio WHERE id = ?').run(id);
      return result.changes > 0;
    },
  };
}
