# Informe Técnico Interactivo y Portafolio — Échele Camello

Aplicación web estática que presenta el **Informe Técnico** del proyecto **Échele Camello** (*Plataforma de Intermediación de Servicios Informales en Colombia*), organizada por secciones técnicas desplegables de navegación directa y con **12 Anexos** descargables y previsualizables al final del menú.

- **Sitio publicado (GitHub Pages):** <https://luistombe.github.io/Pagina-Motta/>
- **Programa:** Análisis y Desarrollo de Software (ADSO) · Ficha 3223719 · SENA
- **Autores:** Jesús David Motta, Luis Felipe Tombe y Juan David Parada

## Estructura del Informe Técnico

- **Portada e Índice Ejecutivo**: Identificación institucional, resumen y acceso directo a cada capítulo.
- **Secciones Técnicas (1–19, omitiendo únicamente las no documentadas en los talleres)**: Introducción, Problemática, Objetivos, Análisis de Viabilidad, Alcance y Exclusiones (MVP sin pasarela de pago obligatoria), Requerimientos Funcionales y No Funcionales, **Evaluación frente a ISO/IEC 25010 (Sección 10)**, Diseño Conceptual de BD, Prototipo, Diagramas UML (Casos de Uso y Actividades), Arquitectura e Infraestructura (7 Microservicios + Liquibase), **Pruebas y Aseguramiento de la Calidad QA (Sección 15)**, Análisis de Costos y Recursos Humanos, Licencias, Conclusiones y Recomendaciones.
- **Sección 20 — Anexos (1 al 12)**: Repositorio documental completo (`.docx`, `.xlsx`, `.xlsm`, `.zip`, `.jpg`) con visor local integrado (incluyendo parser OOXML para Word/Excel con macros) y descarga directa.

## Pruebas y Ejecución Local

```bash
# Ejecutar suite de pruebas unitarias de integridad del portafolio y manifiesto
npm test

# Servir localmente en red (http://localhost:8080)
npm start
```

> Nota: Para los anexos `.docx`, `.xlsx`, `.xlsm` y `.zip`, el visor integrado renderiza directamente en el navegador mediante `app.js` y `evidencias/manifest.js` / `manifest.json`.
