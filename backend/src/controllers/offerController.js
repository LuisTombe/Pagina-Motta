const VALID_STATES = new Set(['ABIERTA', 'EN_PROCESO', 'CERRADA']);

/**
 * Controlador CRUD para ofertas_servicio.
 */
export function createOfferController({ offerRepository }) {
  return {
    list(query) {
      const estado = query.get('estado');
      const categoria = query.get('categoria');

      if (estado && !VALID_STATES.has(estado)) {
        return {
          status: 400,
          body: { error: 'Estado inválido. Valores permitidos: ABIERTA, EN_PROCESO, CERRADA.' },
        };
      }

      const ofertas = offerRepository.findAll({ estado, categoria });
      return { status: 200, body: { total: ofertas.length, datos: ofertas } };
    },

    getById(id) {
      const numericId = Number(id);
      if (!Number.isInteger(numericId) || numericId <= 0) {
        return { status: 400, body: { error: 'El identificador debe ser un entero positivo.' } };
      }

      const oferta = offerRepository.findById(numericId);
      if (!oferta) {
        return { status: 404, body: { error: `No se encontró el registro con id ${numericId}.` } };
      }

      return { status: 200, body: { dato: oferta } };
    },

    create(body, user) {
      const titulo = typeof body.titulo === 'string' ? body.titulo.trim() : '';
      const descripcion = typeof body.descripcion === 'string' ? body.descripcion.trim() : '';
      const categoria = typeof body.categoria === 'string' && body.categoria.trim() ? body.categoria.trim() : 'General';
      const ubicacion = typeof body.ubicacion === 'string' && body.ubicacion.trim() ? body.ubicacion.trim() : 'Neiva, Huila';
      const presupuesto = body.presupuesto !== undefined ? Number(body.presupuesto) : 0;
      const estado = typeof body.estado === 'string' ? body.estado.trim().toUpperCase() : 'ABIERTA';

      if (!titulo || titulo.length < 4) {
        return { status: 400, body: { error: 'El campo "titulo" es obligatorio (mínimo 4 caracteres).' } };
      }
      if (!descripcion || descripcion.length < 8) {
        return { status: 400, body: { error: 'El campo "descripcion" es obligatorio (mínimo 8 caracteres).' } };
      }
      if (!Number.isFinite(presupuesto) || presupuesto < 0) {
        return { status: 400, body: { error: 'El campo "presupuesto" debe ser un número mayor o igual a 0.' } };
      }
      if (!VALID_STATES.has(estado)) {
        return { status: 400, body: { error: 'Estado inválido. Valores permitidos: ABIERTA, EN_PROCESO, CERRADA.' } };
      }

      const created = offerRepository.create({
        usuarioId: user.id,
        titulo,
        descripcion,
        categoria,
        ubicacion,
        presupuesto,
        estado,
      });

      return {
        status: 201,
        body: {
          mensaje: 'Registro creado correctamente.',
          dato: created,
        },
      };
    },

    update(id, body) {
      const numericId = Number(id);
      if (!Number.isInteger(numericId) || numericId <= 0) {
        return { status: 400, body: { error: 'El identificador debe ser un entero positivo.' } };
      }

      const existing = offerRepository.findById(numericId);
      if (!existing) {
        return { status: 404, body: { error: `No se encontró el registro con id ${numericId}.` } };
      }

      const titulo = typeof body.titulo === 'string' ? body.titulo.trim() : existing.titulo;
      const descripcion = typeof body.descripcion === 'string' ? body.descripcion.trim() : existing.descripcion;
      const categoria = typeof body.categoria === 'string' ? body.categoria.trim() : existing.categoria;
      const ubicacion = typeof body.ubicacion === 'string' ? body.ubicacion.trim() : existing.ubicacion;
      const presupuesto = body.presupuesto !== undefined ? Number(body.presupuesto) : existing.presupuesto;
      const estado =
        typeof body.estado === 'string' ? body.estado.trim().toUpperCase() : existing.estado;

      if (!titulo || titulo.length < 4) {
        return { status: 400, body: { error: 'El campo "titulo" debe tener al menos 4 caracteres.' } };
      }
      if (!descripcion || descripcion.length < 8) {
        return { status: 400, body: { error: 'El campo "descripcion" debe tener al menos 8 caracteres.' } };
      }
      if (!Number.isFinite(presupuesto) || presupuesto < 0) {
        return { status: 400, body: { error: 'El campo "presupuesto" debe ser un número mayor o igual a 0.' } };
      }
      if (!VALID_STATES.has(estado)) {
        return { status: 400, body: { error: 'Estado inválido. Valores permitidos: ABIERTA, EN_PROCESO, CERRADA.' } };
      }

      const updated = offerRepository.update(numericId, {
        titulo,
        descripcion,
        categoria,
        ubicacion,
        presupuesto,
        estado,
      });

      return {
        status: 200,
        body: {
          mensaje: 'Registro actualizado correctamente.',
          dato: updated,
        },
      };
    },

    remove(id) {
      const numericId = Number(id);
      if (!Number.isInteger(numericId) || numericId <= 0) {
        return { status: 400, body: { error: 'El identificador debe ser un entero positivo.' } };
      }

      const existing = offerRepository.findById(numericId);
      if (!existing) {
        return { status: 404, body: { error: `No se encontró el registro con id ${numericId}.` } };
      }

      offerRepository.remove(numericId);
      return {
        status: 200,
        body: {
          mensaje: `Registro con id ${numericId} eliminado correctamente.`,
        },
      };
    },
  };
}
