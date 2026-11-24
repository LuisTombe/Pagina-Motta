# Guión de Presentación — Proyecto "ÉCHELE CAMELLO" (Grupo 8 · ADSO SENA)

**Duración total estimada:** 10 a 12 minutos  
**Objetivo:** Demostrar ante compañeros e instructor que *Échele Camello* resuelve una necesidad real con rigor de ingeniería (análisis, diseño, modelado, viabilidad técnica, costos y planeación), apoyándose en el video inicial y la página interactiva de evidencias en pantalla de proyección.

---

## Distribución de Roles en la Exposición
- **Luis Yamit Tombe Cabrera** *(Líder de proyecto y analista)*: Apertura, problema (DANE), propuesta de valor, planeación (Apartado 1) y cierre.
- **Martin Andrés Andrade Royet** *(Analista de requerimientos y arquitectura)*: Casos de uso, diagramas de actividad, dominio y base de datos (Apartados 2, 3, 4 y 5).
- **Paula Valentina Vargas Andrade** *(Diseño UI/UX, verificación y QA)*: Verificación de modelos, prototipos y taller general (Apartados 6 y 7).
- **Juan David Parada Vargas** *(Desarrollador principal y planeación técnica)*: Viabilidad de hardware, licencias, stack de software, recursos humanos, Gantt y costos (Apartados 8, 9, 10 y 11).

---

## Sección 1: Apertura e Impacto del Problema + Video (0:00 – 2:30 · 2 min 30 s)
**Presenta:** **Luis Yamit Tombe Cabrera**  
**En pantalla:** Inicio de la página (Video de presentación de *Échele Camello* y tarjetas de resumen).

> «Buenos días/tardes instructor y compañeros. Somos el **Grupo 8** de ADSO y hoy no venimos solo a mostrar documentos: venimos a presentar **Échele Camello**, una solución real para un problema que vemos todos los días en Neiva y en toda Colombia.
>
> Según cifras oficiales del **DANE (2026)**, la informalidad laboral en Colombia alcanza el **55,3 %** a nivel nacional y sube hasta el **83,2 %** en centros poblados y zonas rurales. Miles de plomeros, electricistas, cerrajeros y técnicos independientes dependen del "rebusque" o del voz a voz porque no tienen una presencia digital organizada; al mismo tiempo, los clientes no encuentran servicios de proximidad confiables y disponibles cuando los necesitan.
>
> Para resolver esta brecha nace **Échele Camello**: una multiplataforma web y móvil Android que conecta clientes y trabajadores de oficios cotidianos con perfiles verificables, búsqueda por cercanía, agendamiento, chat contextual y calificaciones reales. Antes de entrar en la arquitectura y las evidencias, veamos nuestro video de presentación.»

*(Reproducir el video de presentación en pantalla. Al terminar el video, bajar hacia el Explorador del Portafolio y activar el **Modo proyección**).*

**Transición:**  
> «Como ven, la visión es clara, pero detrás de esa idea hay ingeniería disciplinada. En el **Apartado 1 (Planeación de actividades)** organizamos el desarrollo en etapas incrementales para no sobredimensionar el MVP. Ahora le doy paso a **Martin**, quien les mostrará cómo tradujimos esa necesidad en requerimientos, modelos y base de datos.»

---

## Sección 2: Análisis, Modelos y Base de Datos (2:30 – 5:30 · 3 min)
**Presenta:** **Martin Andrés Andrade Royet**  
**En pantalla:** Navegar por los apartados **2 (Diagramas de casos de uso)**, **3 (Diagramas de actividad)**, **4 (Diagrama de dominio)** y **5 (Taller de bases de datos)**; hacer clic en los diagramas/imágenes para ampliarlos en pantalla completa.

> «Gracias, Luis. Un proyecto sólido no empieza tirando código; empieza entendiendo exactamente qué necesita cada actor: **Cliente**, **Trabajador** y **Administrador**.
>
> *(Mostrar Apartado 2 — Casos de Uso)* Aquí consolidamos **61 Requerimientos Funcionales**, **30 No Funcionales** y **16 Casos de Uso (`CU-01` a `CU-16`)** organizados en 5 módulos: Acceso, Perfiles y Servicios, Búsqueda y Contratación, Comunicación y Reputación.
>
> *(Mostrar Apartado 3 — Diagramas de actividad)* En los diagramas de actividad modelamos el flujo operativo completo: desde que el cliente busca un servicio cercano, lo solicita y agenda, hasta que el trabajador acepta, ejecuta y recibe su calificación.
>
> *(Mostrar Apartado 4 — Diagrama de dominio y ampliarlo con un clic)* Este es nuestro **Diagrama de Dominio** consolidado en **17 entidades limpias**. Eliminamos tablas redundantes como usuarios duplicados por rol, aplicamos borrado lógico para no perder historiales y garantizamos reglas clave como una sola calificación y una sola conversación por solicitud finalizada.
>
> *(Mostrar Apartado 5 — Taller de bases de datos)* Y en el taller de base de datos aterrizamos esas 17 entidades con llaves primarias, foráneas, restricciones `UNIQUE` e integridad referencial, listas para alimentar nuestros **7 microservicios lógicos** (`ms-usuarios`, `ms-perfiles`, `ms-servicios`, `ms-busqueda`, `ms-solicitudes`, `ms-comunicacion` y `ms-reputacion`).»

**Transición:**  
> «Pero un modelo en papel no sirve si tiene fallas de lógica o usabilidad. Le cedo la palabra a **Paula**, encargada de verificar que cada modelo cuadre y convertirlo en interfaces reales para el usuario.»

---

## Sección 3: Verificación de Modelos, Prototipos y Taller General (5:30 – 7:45 · 2 min 15 s)
**Presenta:** **Paula Valentina Vargas Andrade**  
**En pantalla:** Apartado **6 (`6.1 Revisión de los modelos de análisis` y `6.2 Elaboración de prototipos`)** y Apartado **7 (Taller general)**.

> «Gracias, Martin. En el **Apartado 6.1 (Revisión de los modelos de análisis)** auditamos la trazabilidad completa entre historias de usuario (`HU-01` a `HU-20`), requerimientos y diagrama de dominio. Detectamos y corregimos inconsistencias de alcance —por ejemplo, dejamos claro que el historial es una vista derivada de solicitudes y programaciones, no una entidad duplicada, y separamos la ubicación del trabajador de la dirección puntual del servicio.
>
> *(Mostrar 6.2 — Elaboración de prototipos)* Con los flujos validados pasamos al **Apartado 6.2**, donde diseñamos los prototipos UI/UX diferenciados para cliente, trabajador y administrador, priorizando diseño responsivo, contraste legible, formularios validados y una navegación intuitiva para personas con distintos niveles de experiencia digital.
>
> *(Mostrar Apartado 7 — Taller general)* Finalmente, en el **Apartado 7** reunimos los ejercicios transversales de integración que validan la coherencia entre diseño visual, reglas de negocio y seguridad.»

**Transición:**  
> «Ya tenemos un producto validado en funcionalidad, datos y diseño. Ahora la pregunta clave para cualquier evaluador o cliente es: ¿cuánto cuesta, con qué equipos y tecnologías se construye y en cuánto tiempo se entrega? Eso nos lo explica **Juan David**.»

---

## Sección 4: Viabilidad Técnica, Presupuesto, Cronograma y Cierre (7:45 – 11:00 · 3 min 15 s)
**Presenta:** **Juan David Parada Vargas** *(y cierre de **Luis Yamit Tombe Cabrera**)*  
**En pantalla:** Apartados **8 (`8.1` y `8.2`)**, **9 (Licencias)**, **10 (`10.1` y `10.2`)** y **11 (`11.1`, `11.2`, `11.3`)** — mostrar las hojas `.xlsx` con scroll horizontal controlado y el índice con sus números de página.

> «*(Juan David)* Gracias, Paula. Un proyecto bien documentado demuestra viabilidad técnica y financiera antes de salir a producción:
>
> *(Mostrar Apartado 8 — Hardware `8.1` y `8.2`)* En hardware evaluamos y comparamos equipos reales de desarrollo y servidores, justificando la selección mínima recomendada para garantizar fluidez tanto en el entorno web como en la compilación Android.
>
> *(Mostrar Apartado 9 y 10 — Licencias y Software `10.1` y `10.2`)* En licencias y software cotizamos y comparamos alternativas comerciales frente a tecnologías abiertas y escalables. Priorizamos estándares web (HTML5, CSS3, JavaScript), APIs REST reutilizables por web y Android, hash seguro para contraseñas y cumplimiento de la Ley 1581 de 2012 sobre protección de datos personales.
>
> *(Mostrar Apartado 11 — Recursos humanos `11.1`, `11.2`, `11.3`)* Por último, en Recursos Humanos definimos nuestra metodología de trabajo ágil/incremental, la asignación de roles y tiempos del equipo, y el **Diagrama de Gantt con estimación de costos** en hoja de cálculo, demostrando que cada entregable tiene responsable, fecha y presupuesto medido.»

**Cierre (Luis Yamit Tombe Cabrera · últimos 30 segundos):**  
**En pantalla:** Apartado **Anexos** y vista general de la página.

> «Para cerrar: **Échele Camello** no es una idea improvisada. Tiene un problema validado con cifras del DANE, un SRS consolidado con 61 requerimientos funcionales, 17 entidades normalizadas, prototipos verificados, arquitectura preparada para web y Android, y un plan de hardware, software y costos medido al detalle. Todo queda disponible y navegable en este portafolio para su revisión. Muchas gracias, quedamos atentos a sus preguntas.»

---

## Consejos Rápidos de Proyección
1. **Activa el «Modo proyección»** en la barra superior del explorador para ocultar el panel lateral de edición y agrandar la tipografía de Word y Excel.
2. **Haz clic en cualquier imagen o diagrama** dentro de Word o como imagen directa para abrirlo en pantalla completa con zoom.
3. **Usa `pág. ___`** en el panel lateral para diligenciar las páginas definitivas cuando impriman o consoliden el informe final en PDF.
