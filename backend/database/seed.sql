-- ============================================================================
-- Sprint 2: Datos Semilla Iniciales (Roles, Permisos y Cruces)
-- Nota: Los usuarios de prueba con password_hash dinámico se siembran al iniciar
-- el servidor en backend/src/config/database.js si la tabla usuarios está vacía.
-- ============================================================================

INSERT OR IGNORE INTO roles (id, nombre, descripcion) VALUES
  (1, 'ADMIN', 'Acceso completo: crear, leer, actualizar y eliminar registros'),
  (2, 'EDITOR', 'Puede crear, consultar y actualizar ofertas de servicio'),
  (3, 'LECTOR', 'Solo puede consultar ofertas de servicio (solo lectura)');

INSERT OR IGNORE INTO permisos (id, codigo, descripcion) VALUES
  (1, 'CREAR', 'Permite crear nuevos registros mediante POST'),
  (2, 'LEER', 'Permite listar y consultar registros mediante GET'),
  (3, 'ACTUALIZAR', 'Permite modificar registros existentes mediante PUT/PATCH'),
  (4, 'ELIMINAR', 'Permite eliminar registros mediante DELETE');

-- ADMIN: todos los permisos (1, 2, 3, 4)
INSERT OR IGNORE INTO rol_permisos (rol_id, permiso_id) VALUES
  (1, 1), (1, 2), (1, 3), (1, 4),
  -- EDITOR: CREAR, LEER, ACTUALIZAR
  (2, 1), (2, 2), (2, 3),
  -- LECTOR: solo LEER
  (3, 2);
