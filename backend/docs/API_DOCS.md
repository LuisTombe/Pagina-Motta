# Documentación Técnica — Entregable Sprint 2
**Proyecto:** Échele Camello — ADSO SENA (Grupo 8)  
**Alcance:** Base de datos relacional (5 tablas), API REST, Autenticación JWT, Autorización por roles/permisos, Operaciones CRUD y Documentación de Endpoints.

---

## 1. Arquitectura de la Base de Datos (5 Tablas)

El modelo relacional está implementado en [`backend/database/schema.sql`](../database/schema.sql) (SQLite listo para ejecutar automáticamente) y su equivalente para MySQL/MariaDB en [`backend/database/schema.mysql.sql`](../database/schema.mysql.sql):

| # | Tabla | Propósito funcional dentro del Sprint 2 |
|---|---|---|
| 1 | `roles` | Define los perfiles del sistema (`ADMIN`, `EDITOR`, `LECTOR`) para la autorización. |
| 2 | `permisos` | Define el catálogo de acciones permitidas (`CREAR`, `LEER`, `ACTUALIZAR`, `ELIMINAR`). |
| 3 | `rol_permisos` | Tabla intermedia N:M que asigna permisos concretos a cada rol. |
| 4 | `usuarios` | Almacena credenciales cifradas (`scrypt` + salt), rol asignado y trazabilidad de autoría. |
| 5 | `ofertas_servicio` | Entidad de negocio principal sobre la que se ejecutan las operaciones CRUD. |

### Matriz de Roles y Permisos (Semilla inicial)
- **`ADMIN`:** `CREAR`, `LEER`, `ACTUALIZAR`, `ELIMINAR` (`admin@sena.edu.co` / `Admin123*`)
- **`EDITOR`:** `CREAR`, `LEER`, `ACTUALIZAR` (`editor@sena.edu.co` / `Editor123*`)
- **`LECTOR`:** `LEER` (`lector@sena.edu.co` / `Lector123*`)

---

## 2. Cómo ejecutar el Backend localmente

Requiere **Node.js 22.5+** (probado en Node `v26.13.0`, sin instalación de paquetes externos):

```bash
# 1. Iniciar el servidor y crear automáticamente la base de datos con datos semilla
node backend/server.js

# 2. Ejecutar las pruebas automatizadas de integración (BD + Auth + Permisos + CRUD)
node --test backend/tests/api.test.mjs
```

- **URL Base:** `http://localhost:3001`
- **Documentación interactiva en navegador:** `http://localhost:3001/api/docs`
- **Especificación OpenAPI 3.0 JSON:** `http://localhost:3001/api/openapi.json`
- **Colección Postman:** [`backend/docs/postman_collection.json`](./postman_collection.json)

---

## 3. Catálogo de Endpoints REST

### A. Salud y Documentación
- **`GET /api/health`** *(Público)* → `200 OK`
- **`GET /api/docs`** *(Público)* → Vista HTML de documentación
- **`GET /api/openapi.json`** *(Público)* → Contrato OpenAPI 3.0

---

### B. Autenticación (`/api/auth`)

#### 1. `POST /api/auth/register` *(Público)*
Registra un usuario nuevo con contraseña cifrada.
- **Request Body (`application/json`):**
```json
{
  "nombre": "Paula Vargas",
  "correo": "paula@sena.edu.co",
  "password": "MiPassword123",
  "rol": "EDITOR"
}
```
- **Respuestas:**
  - `201 Created`: devuelve los datos del usuario y sus permisos.
  - `400 Bad Request`: nombre, correo o contraseña inválidos.
  - `409 Conflict`: correo ya registrado.

#### 2. `POST /api/auth/login` *(Público)*
Valida credenciales y emite un token JWT HS256.
- **Request Body (`application/json`):**
```json
{
  "correo": "admin@sena.edu.co",
  "password": "Admin123*"
}
```
- **Response `200 OK`:**
```json
{
  "mensaje": "Inicio de sesión exitoso.",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "tipo": "Bearer",
  "expira_en_segundos": 7200,
  "usuario": {
    "id": 1,
    "nombre": "Administrador Grupo 8",
    "correo": "admin@sena.edu.co",
    "rol": "ADMIN",
    "permisos": ["CREAR", "LEER", "ACTUALIZAR", "ELIMINAR"]
  }
}
```
- **Errores:** `400 Bad Request`, `401 Unauthorized`.

#### 3. `GET /api/auth/me` *(Protegido — Header `Authorization: Bearer <token>`)*
Devuelve el perfil y permisos del usuario autenticado.
- **Respuestas:** `200 OK` | `401 Unauthorized`.

---

### C. Operaciones CRUD (`/api/ofertas`)
*Todos los endpoints de este grupo requieren `Authorization: Bearer <token>` y el permiso correspondiente en `rol_permisos`.*

| Operación | Método y Ruta | Permiso Exigido | Códigos HTTP |
|---|---|---|---|
| Listar ofertas | `GET /api/ofertas` *(filtros opcionales `?estado=` y `?categoria=`)* | `LEER` | `200`, `400`, `401`, `403` |
| Consultar por ID | `GET /api/ofertas/:id` | `LEER` | `200`, `400`, `401`, `403`, `404` |
| Crear oferta | `POST /api/ofertas` | `CREAR` | `201`, `400`, `401`, `403` |
| Actualizar oferta | `PUT /api/ofertas/:id` *(también `PATCH`)* | `ACTUALIZAR` | `200`, `400`, `401`, `403`, `404` |
| Eliminar oferta | `DELETE /api/ofertas/:id` | `ELIMINAR` *(solo `ADMIN`)* | `200`, `400`, `401`, `403`, `404` |

#### Ejemplo `POST /api/ofertas` (Request Body):
```json
{
  "titulo": "Mantenimiento preventivo de equipos",
  "descripcion": "Limpieza interna, cambio de pasta térmica y revisión de hardware.",
  "categoria": "Soporte Técnico",
  "ubicacion": "Neiva, Huila",
  "presupuesto": 120000,
  "estado": "ABIERTA"
}
```
