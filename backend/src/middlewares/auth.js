import { verifyJwt } from '../utils/crypto.js';

/**
 * Middlewares de Autenticación (JWT -> 401) y Autorización (rol_permisos -> 403).
 */
export function createAuthMiddleware({ userRepository, jwtSecret }) {
  function authenticate(req) {
    const authHeader = req.headers.authorization || req.headers.Authorization || '';
    if (typeof authHeader !== 'string' || !authHeader.startsWith('Bearer ')) {
      return { ok: false, status: 401, message: 'Token de autenticación requerido (Bearer).' };
    }

    const token = authHeader.slice(7).trim();
    const verification = verifyJwt(token, jwtSecret);
    if (!verification.valid) {
      return { ok: false, status: 401, message: verification.error };
    }

    const user = userRepository.findById(verification.payload.sub);
    if (!user || !user.activo) {
      return { ok: false, status: 401, message: 'Usuario inactivo o inexistente.' };
    }

    return { ok: true, user };
  }

  function authorize(user, requiredPermission) {
    if (!user) {
      return { ok: false, status: 401, message: 'No autenticado.' };
    }
    const allowed = userRepository.hasPermission(user.rol_id, requiredPermission);
    if (!allowed) {
      return {
        ok: false,
        status: 403,
        message: `Acceso denegado: el rol "${user.rol_nombre}" no tiene permiso "${requiredPermission}".`,
      };
    }
    return { ok: true };
  }

  return { authenticate, authorize };
}
