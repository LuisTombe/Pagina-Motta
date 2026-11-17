import { hashPassword, signJwt, verifyPassword } from '../utils/crypto.js';

/**
 * Controlador de Autenticación: registro, inicio de sesión y perfil autenticado.
 */
export function createAuthController({ userRepository, jwtSecret, jwtExpiresInSeconds }) {
  return {
    register(body) {
      const nombre = typeof body.nombre === 'string' ? body.nombre.trim() : '';
      const correo = typeof body.correo === 'string' ? body.correo.trim().toLowerCase() : '';
      const password = typeof body.password === 'string' ? body.password : '';
      const rolSolicitado = typeof body.rol === 'string' ? body.rol.trim().toUpperCase() : 'EDITOR';

      if (!nombre || nombre.length < 3) {
        return { status: 400, body: { error: 'El campo "nombre" es obligatorio (mínimo 3 caracteres).' } };
      }
      if (!correo || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo)) {
        return { status: 400, body: { error: 'El campo "correo" debe tener un formato válido.' } };
      }
      if (password.length < 6) {
        return { status: 400, body: { error: 'La contraseña debe tener al menos 6 caracteres.' } };
      }

      const existing = userRepository.findByEmail(correo);
      if (existing) {
        return { status: 409, body: { error: 'Ya existe un usuario registrado con ese correo.' } };
      }

      // Por seguridad, el auto-registro solo asigna EDITOR o LECTOR; ADMIN requiere asignación interna
      const safeRoleName = rolSolicitado === 'LECTOR' ? 'LECTOR' : 'EDITOR';
      const role = userRepository.findRoleByName(safeRoleName);
      if (!role) {
        return { status: 500, body: { error: 'Rol predeterminado no configurado en la base de datos.' } };
      }

      const created = userRepository.create({
        rolId: role.id,
        nombre,
        correo,
        passwordHash: hashPassword(password),
      });

      const permisos = userRepository.getPermissionsByRoleId(created.rol_id);
      return {
        status: 201,
        body: {
          mensaje: 'Usuario registrado correctamente.',
          usuario: {
            id: created.id,
            nombre: created.nombre,
            correo: created.correo,
            rol: created.rol_nombre,
            permisos,
          },
        },
      };
    },

    login(body) {
      const correo = typeof body.correo === 'string' ? body.correo.trim().toLowerCase() : '';
      const password = typeof body.password === 'string' ? body.password : '';

      if (!correo || !password) {
        return { status: 400, body: { error: 'Debes enviar "correo" y "password".' } };
      }

      const user = userRepository.findByEmail(correo);
      if (!user || !user.activo || !verifyPassword(password, user.password_hash)) {
        return { status: 401, body: { error: 'Credenciales inválidas.' } };
      }

      const permisos = userRepository.getPermissionsByRoleId(user.rol_id);
      const token = signJwt(
        {
          sub: user.id,
          correo: user.correo,
          rol: user.rol_nombre,
        },
        jwtSecret,
        jwtExpiresInSeconds
      );

      return {
        status: 200,
        body: {
          mensaje: 'Inicio de sesión exitoso.',
          token,
          tipo: 'Bearer',
          expira_en_segundos: jwtExpiresInSeconds,
          usuario: {
            id: user.id,
            nombre: user.nombre,
            correo: user.correo,
            rol: user.rol_nombre,
            permisos,
          },
        },
      };
    },

    me(user) {
      const permisos = userRepository.getPermissionsByRoleId(user.rol_id);
      return {
        status: 200,
        body: {
          usuario: {
            id: user.id,
            nombre: user.nombre,
            correo: user.correo,
            rol: user.rol_nombre,
            permisos,
            creado_en: user.creado_en,
          },
        },
      };
    },
  };
}
