# Portafolio de Evidencias ADSO — ÉCHELE CAMELLO (Grupo 8) | SENA

Portafolio web estático interactivo desarrollado con **HTML5, CSS3 y JavaScript puro (sin frameworks)** para el programa **Análisis y Desarrollo de Software (ADSO)** del **SENA** — **Grupo 8**.

- **Repositorio:** `https://github.com/LuisTombe/Pagina-Motta`
- **Enlace público (GitHub Pages):** `https://luistombe.github.io/Pagina-Motta/`

---

## Datos Institucionales (Portada)

- **Programa:** Análisis y Desarrollo de Software (ADSO)
- **Proyecto:** ÉCHELE CAMELLO
- **Portafolio de Evidencias — Grupo 8**
- **Integrantes:** Luis Yamit Tombe Cabrera; Paula Valentina Vargas Andrade; Juan David Parada Vargas; Martin Andrés Andrade Royet
- **Instructor:** José de Jesús Motta Vargas
- **Ubicación y Fecha:** Neiva/Huila · 10/11/2026
- **Sede:** Sede Industria La Empresa y Los servicios

---

## Estructura de Entrega

El proyecto está separado en tres archivos principales sin dependencias de frameworks:

1. [`index.html`](./index.html): Estructura semántica con la **Portada Institucional (Grupo 8)** como primera pantalla y la **Vista de Anexos** como segunda pantalla, incluyendo la marca de agua del SENA en SVG inline de baja opacidad sobre fondo blanco.
2. [`styles.css`](./styles.css): Diseño responsivo (escritorio, tablet y móvil), variables CSS en `:root`, botones azul oscuro desplegables en la columna derecha, panel desplegable con apertura hacia la izquierda, visores interactivos y animaciones suaves.
3. [`app.js`](./app.js): Lógica de los 12 anexos (A–L), validación de extensión y tamaño antes de cargar, previsualización integrada (PDF, Office y Video), renombrado persistente en `localStorage`, manejo de `URL.createObjectURL` en sesión y respaldo local en `IndexedDB`.

### Recursos externos utilizados (indicados explícitamente)

- **Fuentes tipográficas (Google Fonts):** `Plus Jakarta Sans`, `Source Serif 4` y `JetBrains Mono` (con respaldos del sistema `sans-serif`, `serif` y `monospace` si se abre sin conexión).
- **Iconografía:** SVG inline nativo (sin librerías externas de iconos).

---

## Los 12 Anexos y Tipos de Archivo

- **Anexos A a K** (documentos `.doc`, `.docx`, `.pdf`, hojas de cálculo `.xls`, `.xlsx` y presentaciones `.ppt`, `.pptx`, hasta 25 MB):
  - **Anexo A.** Planeación de actividades
  - **Anexo B.** Diagramas de casos de uso
  - **Anexo C.** Diagramas de actividad
  - **Anexo D.** Diagrama de dominio
  - **Anexo E.** Taller de bases de datos
  - **Anexo F.** Verificación de modelos y elaboración de prototipos
  - **Anexo G.** Taller general
  - **Anexo H.** Hardware
  - **Anexo I.** Licencias
  - **Anexo J.** Software
  - **Anexo K.** Recursos humanos
- **Anexo L (`Anexos Html`)**: acepta **únicamente un archivo de video** (`.mp4`, `.webm`, `.ogg`, `.mov`, `.m4v`, hasta 150 MB) y se reproduce con `<video controls>` y selector de velocidad.

---

## Persistencia de Archivos y Limitaciones Técnicas

- **Nombres y descripciones editables:** Se guardan de forma persistente en `localStorage` para que sobrevivan a recargas de la página.
- **Archivos en sesión (`URL.createObjectURL`) e `IndexedDB`:** Los archivos cargados generan una URL de objeto en memoria (`URL.createObjectURL(file)`) para su previsualización y descarga inmediata sin salir de la página, y además se respaldan automáticamente en `IndexedDB` del navegador local.
- **Visores de Office:** Los archivos `.docx`, `.xlsx` y `.pptx` cuentan con una **Vista Interactiva Local** integrada en el navegador; adicionalmente, cuando el archivo está alojado en una URL pública HTTPS, se habilitan los visores de **Microsoft Office Online** y **Google Docs Viewer**.

---

## Cómo usar y compartir la página

1. **En línea (para que cualquier persona la use desde cualquier dispositivo):**
   - En el repositorio de GitHub (`https://github.com/LuisTombe/Pagina-Motta`), ve a **Settings → Pages**.
   - En **Build and deployment → Source**, selecciona **Deploy from a branch** → rama **`main`** (o **`gh-pages`**) → carpeta **`/ (root)`** y pulsa **Save** (o usa **GitHub Actions**).
   - La página quedará publicada en: `https://luistombe.github.io/Pagina-Motta/`
2. **En tu computador local:**
   - Puedes abrir directamente el archivo `index.html` con doble clic en cualquier navegador moderno (Chrome, Edge, Firefox) sin necesidad de instalar nada.
