/* ==========================================================================
   Datos estructurados del Informe Técnico — "ÉCHELE CAMELLO" (ADSO Grupo 8)
   Extraídos exclusivamente de los documentos reales del equipo (SRS consolidado,
   Planeación, Casos de Uso, Diagramas de Actividad, Diagrama de Dominio,
   Modelo Conceptual BD, Taller Final Arquitectura, Diagnóstico de Hardware,
   Prototipo, Licencias, Cotización de Software y Cotización RR. HH.).
   Las secciones de Contenido_InfTecnico sin respaldo documental (10. Evaluación
   frente a Normas de Calidad y 15. Pruebas y QA) se omiten deliberadamente.
   ========================================================================== */

(function initReportData(globalScope) {
  'use strict';

  const REPORT_META = {
    projectTitle: 'ÉCHELE CAMELLO',
    subtitle: 'Multiplataforma Digital de Intermediación de Servicios para Trabajadores Independientes e Informales',
    program: 'Análisis y Desarrollo de Software (ADSO) · SENA',
    campus: 'Sede Industria, la Empresa y los Servicios · Neiva, Huila · Ficha 3413988',
    instructor: 'José de Jesús Motta Vargas',
    team: [
      'Luis Yamit Tombe Cabrera',
      'Paula Valentina Vargas Andrade',
      'Juan David Parada Vargas',
      'Martin Andrés Andrade Royet',
    ],
    omittedSectionsNotice:
      'Se omiten los numerales 10 (Evaluación frente a Normas de Calidad) y 15 (Pruebas y QA) del esquema base porque no se suministró documentación de evaluación o matrices de prueba ejecutadas.',
  };

  const REPORT_SECTIONS = [
    {
      id: 'sec-1',
      code: '1.',
      shortLabel: '1. Control de Versiones',
      title: '1. Control de Versiones / Historial de Cambios',
      tag: 'Trazabilidad',
      lead:
        'Evolución cronológica verificada de los entregables técnicos del proyecto, unificados bajo el SRS consolidado (09/09/2026) como fuente de verdad y controlados con Git y GitHub.',
      kpis: [
        { label: 'Versión SRS vigente', value: '09/09/2026' },
        { label: 'Entregables integrados', value: '10 documentos' },
        { label: 'Control de código', value: 'Git (GPLv2) + GitHub' },
      ],
      cards: [
        {
          title: 'Criterio de consolidación (SRS §9)',
          bullets: [
            'Se unificó la especificación SRS con el Taller de Modelo Conceptual de Datos para eliminar duplicidades (ej. tablas redundantes de roles) y alinear alcance, seguridad, historias de usuario y casos de uso.',
            'Las definiciones textuales consolidadas prevalecen sobre diagramas heredados en caso de variación de etiquetas.',
            'El código fuente y los entregables se versionan en repositorio distribuido con ramas y revisión cruzada previa a fusión (RNF-022).',
          ],
        },
      ],
      tables: [
        {
          title: 'Historial cronológico de documentos del proyecto',
          headers: ['Fecha', 'Documento / Evidencia', 'Hito registrado'],
          rows: [
            ['27/04/2026', 'SRS Inicial & Diagramas de Casos de Uso', 'Definición inicial de requisitos y 16 casos de uso en 4 módulos.'],
            ['01/09/2026', 'Modelo Conceptual de Datos & Taller Arquitectura', 'Mapeo de entidades, cardinalidades, PK/FK y enfoque arquitectónico.'],
            ['08/09/2026', 'Diagramas de Actividades Completas', 'Modelado de flujos operativos DA-01 a DA-16 por módulos.'],
            ['09/09/2026', 'SRS Versión Consolidada y Corregida + Planeación', 'Consolidación oficial: 61 RF, 30 RNF, 20 HU, 17 entidades, 7 dominios y WBS.'],
            ['06/10/2026', 'Diagnóstico de Hardware para Informe Técnico', 'Evaluación del equipo de referencia HP Laptop 14-cf2xxx (i5 / 16 GB RAM).'],
            ['13/10/2026', 'Prototipo Interactivo & Tipos de Licencias', 'Publicación del prototipo en AI Studio / Figma e investigación de 11 licencias.'],
            ['27/10/2026', 'Cotización de Recursos Humanos (Scrum)', 'Plan de 4 sprints (8 semanas), 592 h y presupuesto académico de equipo.'],
            ['03/11/2026', 'Cotización Técnica de Software (TRM 3.182,99)', 'Comparativa de 26 categorías tecnológicas y presupuesto piloto COP $145.940.'],
          ],
        },
      ],
    },
    {
      id: 'sec-2',
      code: '2.',
      shortLabel: '2. Resumen Ejecutivo',
      title: '2. Resumen Ejecutivo',
      tag: 'Visión de Negocio',
      lead:
        'Échele Camello es una multiplataforma digital (Web + futura App Android con backend común) diseñada para visibilizar, organizar y conectar a trabajadores independientes e informales con clientes que necesitan servicios de proximidad confiables.',
      kpis: [
        { label: 'Informalidad nacional', value: '55,3 % (DANE 2026)' },
        { label: 'Informalidad rural', value: '83,2 % (DANE 2026)' },
        { label: 'Cobertura funcional', value: '61 RF · 30 RNF · 17 Entidades' },
        { label: 'Costo piloto software', value: 'COP $145.940,09' },
      ],
      cards: [
        {
          title: 'Propuesta de valor en 4 ejes',
          bullets: [
            'Visibilidad organizada: cada trabajador crea su perfil profesional, registra disponibilidad horaria, ubicación y tarifa transparente.',
            'Confianza verificable: solicitudes trazables por estado, agendamiento formal, chat contextual y calificaciones exclusivas para servicios finalizados.',
            'Arquitectura evolutiva: backend diseñado modularmente para operar el MVP web en PHP/Laravel + MySQL y escalar hacia una app Android vía API Gateway.',
            'Viabilidad financiera: stack basado en licencias abiertas (MIT, GPLv2, Apache-2.0) que reduce el desembolso piloto a solo dominio y alojamiento.',
          ],
        },
        {
          title: 'Estrategia incremental por etapas (SRS §1.5 & §8)',
          bullets: [
            'Etapa 1 — MVP: registro, login, recuperación, perfil profesional, publicación/búsqueda por categoría y ubicación, solicitudes, estados y calificaciones.',
            'Etapa 2 — Optimización: mensajería interna, notificaciones, disponibilidad avanzada, historial, reportes y panel administrativo.',
            'Etapa 3 — Expansión: analítica avanzada, recomendaciones automáticas, mapas interactivos integrados y automatización.',
          ],
        },
      ],
    },
    {
      id: 'sec-3',
      code: '3.',
      shortLabel: '3. Introducción',
      title: '3. Introducción',
      tag: 'Contexto',
      lead:
        'El proyecto nace en el programa ADSO (SENA Neiva) como respuesta tecnológica a la falta de visibilidad digital de miles de trabajadores que ejercen oficios cotidianos de manera independiente o informal.',
      kpis: [
        { label: 'Plataformas objetivo', value: 'Web + Android' },
        { label: 'Actores principales', value: 'Cliente · Trabajador · Admin' },
        { label: 'Enfoque metodológico', value: 'Scrum (4 sprints)' },
      ],
      cards: [
        {
          title: 'Qué resuelve el sistema',
          bullets: [
            'Centraliza en un único entorno digital la oferta de oficios como plomería, cerrajería, electricidad, carpintería, transporte y mantenimiento.',
            'Ordena el ciclo completo de intermediación: desde la búsqueda por cercanía o categoría hasta la programación, comunicación interna y calificación posterior.',
            'Establece reglas claras de seguridad, control de acceso por roles (RBAC) y trazabilidad administrativa mediante auditoría y reportes.',
          ],
        },
        {
          title: 'Alcance técnico del informe',
          bullets: [
            'Consolida el levantamiento de actores e incertidumbres (Planeación), especificación de requerimientos (SRS), modelado UML y conceptual de datos, arquitectura, presupuesto tecnológico y planeación Scrum.',
          ],
        },
      ],
    },
    {
      id: 'sec-4',
      code: '4.',
      shortLabel: '4. Problema y Propósito',
      title: '4. Planteamiento del Problema y Propósito',
      tag: 'DANE 2026',
      lead:
        'La fragmentación del mercado informal impide que trabajadores capacitados sean encontrados a tiempo y obliga a los clientes a depender de contactos informales sin garantías ni historial.',
      kpis: [
        { label: 'Empleo informal Colombia', value: '55,3 %' },
        { label: 'Centros poblados / rural', value: '83,2 %' },
        { label: 'Fuente oficial', value: 'DANE GEIH Dic 2025–Feb 2026' },
      ],
      cards: [
        {
          title: 'Planteamiento del problema (SRS §1.1)',
          bullets: [
            'Dependencia del «rebusque», recomendaciones voz a voz, carteles físicos o publicaciones dispersas y desactualizadas en redes sociales.',
            'Desventaja comercial de trabajadores independientes frente a empresas establecidas con mayor presencia digital.',
            'Dificultad de los clientes para localizar prestadores confiables, cercanos y disponibles en horarios flexibles o urgentes.',
            'Brecha de eficiencia económica que perpetúa desigualdad, inestabilidad de ingresos y poca trazabilidad en la prestación de servicios.',
          ],
        },
        {
          title: 'Propósito del proyecto (SRS §1.2)',
          bullets: [
            'Construir una plataforma web y aplicación móvil Android que conecte directamente oferta y demanda de servicios de proximidad.',
            'Estandarizar perfiles profesionales, disponibilidad horaria, catálogo de servicios, agendamiento y mensajería segura.',
            'Generar reputación verificable mediante calificaciones y reseñas reales, fortaleciendo la inclusión digital y la confianza.',
          ],
        },
      ],
    },
    {
      id: 'sec-5',
      code: '5.',
      shortLabel: '5. Justificación',
      title: '5. Justificación del Proyecto',
      tag: 'Valor Diferencial',
      lead:
        'Aunque existen portales laborales y redes comerciales, ninguno está diseñado específicamente para oficios cotidianos de proximidad ni para la realidad del trabajador informal colombiano.',
      cards: [
        {
          title: 'Por qué las alternativas actuales no bastan (SRS §1.3)',
          bullets: [
            'LinkedIn está orientado a contratación corporativa formal y perfiles profesionales corporativos.',
            'Perfil de Empresa de Google exige gestión comercial y no resuelve agendamiento directo ni flujo de solicitud por oficio individual.',
            'Facebook Marketplace mezcla productos genéricos sin verificación de reputación por servicio finalizado ni gestión de horarios.',
          ],
        },
        {
          title: 'Impacto esperado de Échele Camello',
          bullets: [
            'Para el trabajador: vitrina profesional sin costo de barrera, control de horarios, historial laboral digital y ampliación de clientela.',
            'Para el cliente: búsqueda rápida filtrada por categoría, ubicación y reputación real con contacto directo.',
            'Para el sector: reduce la desorganización de la economía de proximidad mediante herramientas tecnológicas accesibles.',
          ],
        },
      ],
    },
    {
      id: 'sec-6',
      code: '6.',
      shortLabel: '6. Objetivo General',
      title: '6. Objetivo General',
      tag: 'Meta Central',
      lead:
        'Propósito rector del proyecto definido en el SRS consolidado (Sección 1.4).',
      cards: [
        {
          title: 'Declaración oficial del Objetivo General',
          highlight: true,
          bullets: [
            'Desarrollar Échele Camello como una solución digital de intermediación de servicios, con plataforma web y aplicación móvil Android, mediante el análisis, diseño, construcción, pruebas e implementación de módulos que permitan el registro de usuarios, la gestión de perfiles profesionales, la publicación y búsqueda de servicios, la gestión de solicitudes y programaciones, la comunicación entre usuarios, las calificaciones y reseñas, y la administración segura de la información, contribuyendo a la visibilidad laboral, la organización de la oferta de servicios y la inclusión digital.',
          ],
        },
      ],
    },
    {
      id: 'sec-7',
      code: '7.',
      shortLabel: '7. Objetivos Específicos',
      title: '7. Objetivos Específicos',
      tag: '10 Objetivos',
      lead:
        'Los diez objetivos específicos del SRS (Sección 1.4.1), agrupados por fase de ingeniería para exponer el alcance completo del desarrollo.',
      kpis: [
        { label: 'Total objetivos SRS', value: '10' },
        { label: 'Cobertura', value: 'Análisis → Despliegue' },
      ],
      tables: [
        {
          title: 'Desglose de los 10 Objetivos Específicos (SRS §1.4.1)',
          headers: ['#', 'Eje', 'Objetivo específico'],
          rows: [
            ['1', 'Análisis', 'Analizar necesidades de clientes y trabajadores identificando procesos, actores, reglas de negocio y requisitos (RF/RNF).'],
            ['2', 'Diseño', 'Diseñar arquitectura del sistema, modelo de datos, módulos, roles, flujos de navegación e interfaces web y móvil coherentes.'],
            ['3', 'Acceso', 'Construir el módulo de autenticación, usuarios, roles y permisos (registro, login, recuperación y control de acceso seguro).'],
            ['4', 'Oferta laboral', 'Desarrollar el módulo de perfiles profesionales y publicación de servicios (experiencia, habilidades, ubicación, horarios y tarifas).'],
            ['5', 'Descubrimiento', 'Implementar búsqueda, filtrado y geolocalización por categoría, ubicación, disponibilidad, calificación y cercanía.'],
            ['6', 'Operación', 'Desarrollar solicitudes y agendamiento (creación, aceptación, rechazo, reprogramación, cancelación, estados e historial).'],
            ['7', 'Confianza', 'Implementar comunicación, notificaciones, calificaciones, reseñas y reportes para fortalecer confianza y control.'],
            ['8', 'Gobierno', 'Construir el panel administrativo para supervisión de usuarios, servicios, reportes, categorías y moderación.'],
            ['9', 'Validación', 'Validar la multiplataforma con pruebas funcionales, de seguridad, usabilidad y compatibilidad respecto al SRS.'],
            ['10', 'Documentación', 'Documentar análisis, diseño técnico, manuales, pruebas, control de versiones y recomendaciones de evolución.'],
          ],
        },
      ],
    },
    {
      id: 'sec-8',
      code: '8.',
      shortLabel: '8. Requerimientos Funcionales',
      title: '8. Requerimientos Funcionales, Casos de Uso y Prototipos',
      tag: '61 RF · 16 CU · Prototipos',
      lead:
        'Especificación funcional completa de Échele Camello: 61 requerimientos funcionales en 9 módulos, 20 historias de usuario, 16 diagramas UML de casos de uso y dos prototipos interactivos validados.',
      kpis: [
        { label: 'Requerimientos (RF)', value: '61' },
        { label: 'Módulos SRS', value: '9' },
        { label: 'Historias de usuario', value: '20 (HU-01..20)' },
        { label: 'Diagramas UML CU', value: '16 + General' },
      ],
      interactiveTabs: [
        {
          id: 'rf-modules',
          label: 'Requerimientos (RF-001 a RF-061)',
          description: 'Listado consolidado de los 61 Requerimientos Funcionales distribuidos en los 9 módulos del SRS.',
          groups: [
            {
              title: 'Módulo 1 · Autenticación y Acceso (RF-001 a RF-008)',
              items: [
                'RF-001: Registro de usuarios con rol y datos básicos.',
                'RF-002: Inicio de sesión con correo y contraseña.',
                'RF-003: Recuperación y restablecimiento de contraseña.',
                'RF-004: Cierre de sesión seguro en el dispositivo actual.',
                'RF-005: Verificación de cuenta mediante enlace o código.',
                'RF-006: Gestión de roles y permisos (RBAC).',
                'RF-007: Edición de información de cuenta.',
                'RF-008: Eliminación o desactivación lógica de cuentas.',
              ],
            },
            {
              title: 'Módulo 2 · Perfiles Profesionales (RF-009 a RF-017)',
              items: [
                'RF-009: Creación de perfiles profesionales.',
                'RF-010: Edición de perfiles profesionales.',
                'RF-011: Carga y actualización de foto de perfil.',
                'RF-012: Configuración de información personal.',
                'RF-013: Registro de experiencia, habilidades y certificaciones.',
                'RF-014: Configuración de estado de disponibilidad laboral.',
                'RF-015: Configuración de horarios regulares y días de atención.',
                'RF-016: Configuración de ubicación y cobertura del trabajador.',
                'RF-017: Visualización de perfiles públicos.',
              ],
            },
            {
              title: 'Módulo 3 · Catálogo de Servicios (RF-018 a RF-024)',
              items: [
                'RF-018: Publicación de servicios por trabajadores verificados.',
                'RF-019: Edición de servicios publicados.',
                'RF-020: Retiro o desactivación lógica de servicios.',
                'RF-021: Clasificación obligatoria por categorías.',
                'RF-022: Visualización de servicios activos disponibles.',
                'RF-023: Gestión de precios o tarifas de referencia.',
                'RF-024: Marcación de atención inmediata o urgente (opcional).',
              ],
            },
            {
              title: 'Módulo 4 · Búsqueda y Geolocalización (RF-025 a RF-032)',
              items: [
                'RF-025: Búsqueda de trabajadores por criterios.',
                'RF-026: Búsqueda de servicios publicados.',
                'RF-027: Filtrado por categoría.',
                'RF-028: Filtrado por ubicación geográfica.',
                'RF-029: Filtrado por disponibilidad laboral.',
                'RF-030: Filtrado y ordenamiento por calificaciones.',
                'RF-031: Visualización de trabajadores cercanos.',
                'RF-032: Visualización de resultados en mapa (etapa futura).',
              ],
            },
            {
              title: 'Módulo 5 · Solicitudes y Agendamiento (RF-033 a RF-040)',
              items: [
                'RF-033: Creación de solicitud de servicio.',
                'RF-034: Aceptación o rechazo de solicitudes.',
                'RF-035: Programación de citas según disponibilidad.',
                'RF-036: Reprogramación de servicios acordados.',
                'RF-037: Cancelación controlada de solicitudes.',
                'RF-038: Consulta de disponibilidad horaria.',
                'RF-039: Gestión de transición de estados (PENDIENTE → FINALIZADA).',
                'RF-040: Consulta de historial de solicitudes y servicios.',
              ],
            },
            {
              title: 'Módulo 6 · Mensajería y Notificaciones (RF-041 a RF-046)',
              items: [
                'RF-041: Mensajería interna contextual por solicitud.',
                'RF-042: Envío de imágenes en el chat.',
                'RF-043: Notificaciones de nuevas solicitudes.',
                'RF-044: Notificaciones de nuevos mensajes.',
                'RF-045: Notificaciones de cambios y reprogramaciones.',
                'RF-046: Notificaciones de calificaciones y reseñas recibidas.',
              ],
            },
            {
              title: 'Módulo 7 · Calificaciones y Reputación (RF-047 a RF-051)',
              items: [
                'RF-047: Calificación (1 a 5) exclusiva de solicitudes finalizadas.',
                'RF-048: Publicación de reseñas y comentarios opcionales.',
                'RF-049: Visualización pública de puntuación promedio.',
                'RF-050: Reporte de usuarios, servicios o reseñas.',
                'RF-051: Moderación de comentarios y reportes.',
              ],
            },
            {
              title: 'Módulo 8 · Administrativo (RF-052 a RF-058)',
              items: [
                'RF-052: Administración de usuarios.',
                'RF-053: Supervisión de servicios publicados.',
                'RF-054: Bloqueo o suspensión de cuentas.',
                'RF-055: Gestión de reportes y denuncias.',
                'RF-056: Visualización de estadísticas básicas de plataforma.',
                'RF-057: Administración del catálogo de categorías.',
                'RF-058: Supervisión general con registro de auditoría.',
              ],
            },
            {
              title: 'Módulo 9 · Seguridad y Sistema (RF-059 a RF-061)',
              items: [
                'RF-059: Protección de endpoints y vistas mediante autenticación.',
                'RF-060: Validación integral de datos antes de persistir.',
                'RF-061: Gestión y revocación de sesiones activas.',
              ],
            },
          ],
        },
        {
          id: 'rf-cu',
          label: 'Casos de Uso UML (16 CU)',
          description: 'Diagrama general y los 16 diagramas UML de Casos de Uso divididos en 4 módulos operativos.',
          gallery: [
            { src: 'assets/informe/casos-uso-general.png', caption: 'Diagrama General de Casos de Uso — Échele Camello' },
            { src: 'assets/informe/cu/cu-01.png', caption: 'CU-01 · Registro de Usuario (Módulo 1: Acceso)' },
            { src: 'assets/informe/cu/cu-02.png', caption: 'CU-02 · Inicio de Sesión (Módulo 1: Acceso)' },
            { src: 'assets/informe/cu/cu-03.png', caption: 'CU-03 · Recuperación de Contraseña (Módulo 1: Acceso)' },
            { src: 'assets/informe/cu/cu-04.png', caption: 'CU-04 · Gestión de Cuenta (Módulo 1: Acceso)' },
            { src: 'assets/informe/cu/cu-05.png', caption: 'CU-05 · Gestión del Perfil Profesional (Módulo 2: Trabajador)' },
            { src: 'assets/informe/cu/cu-06.png', caption: 'CU-06 · Publicación y Gestión de Servicios (Módulo 2: Trabajador)' },
            { src: 'assets/informe/cu/cu-07.png', caption: 'CU-07 · Calificar Trabajador (Módulo 2 / Reputación)' },
            { src: 'assets/informe/cu/cu-08.png', caption: 'CU-08 · Editar Servicio (Módulo 2: Trabajador)' },
            { src: 'assets/informe/cu/cu-09.png', caption: 'CU-09 · Eliminar Servicio (Módulo 2: Trabajador)' },
            { src: 'assets/informe/cu/cu-10.png', caption: 'CU-10 · Búsqueda de Trabajadores y Servicios (Módulo 3)' },
            { src: 'assets/informe/cu/cu-11.png', caption: 'CU-11 · Solicitar Servicio (Módulo 3: Contratación)' },
            { src: 'assets/informe/cu/cu-12.png', caption: 'CU-12 · Gestionar Solicitudes (Módulo 3: Contratación)' },
            { src: 'assets/informe/cu/cu-13.png', caption: 'CU-13 · Programar / Reprogramar / Cancelar (Módulo 3)' },
            { src: 'assets/informe/cu/cu-14.png', caption: 'CU-14 · Consultar Historial de Servicios (Módulo 3)' },
            { src: 'assets/informe/cu/cu-15.png', caption: 'CU-15 · Mensajería Entre Usuarios (Módulo 4: Comunicación)' },
            { src: 'assets/informe/cu/cu-16.png', caption: 'CU-16 · Gestionar Notificaciones (Módulo 4: Comunicación)' },
          ],
        },
        {
          id: 'rf-proto',
          label: 'Prototipos Interactivos',
          description: 'Maquetas visuales funcionales que materializan los flujos de registro, catálogo, búsqueda, solicitud y perfiles del SRS.',
          links: [
            { label: 'Abrir Prototipo Web (AI Studio)', url: 'https://chele-camello.ai.studio/' },
            { label: 'Abrir Prototipo UI en Figma', url: 'https://www.figma.com/proto/SiXssKdMdkQFzwpMYvIb85/Sin-t%C3%ADtulo?node-id=0-1&t=Aa8rrkfEdAswKesG-1' },
          ],
          gallery: [
            { src: 'assets/informe/prototipo-aistudio.png', caption: 'Prototipo funcional Web — chele-camello.ai.studio (13/10/2026)' },
            { src: 'assets/informe/prototipo-figma.png', caption: 'Prototipo de validación en Figma — Taller Arquitectura (RAP 4)' },
          ],
        },
        {
          id: 'rf-hu',
          label: 'Historias de Usuario (20 HU)',
          description: 'Trazabilidad directa entre las 20 Historias de Usuario del SRS (§3.2) y los módulos funcionales.',
          bullets: [
            'Módulo Clientes y Acceso (HU-01 a HU-04): registro, inicio de sesión, recuperación y gestión segura de cuenta.',
            'Módulo Perfiles y Disponibilidad (HU-05 a HU-08): creación de perfil profesional, habilidades, foto, ubicación y horarios.',
            'Módulo Servicios y Catálogo (HU-09 a HU-12): publicación, edición, desactivación lógica y categorización.',
            'Módulo Búsqueda y Solicitudes (HU-13 a HU-17): filtros por cercanía/calificación, envío de solicitudes, aceptación y programación.',
            'Módulo Comunicación y Reputación (HU-18 a HU-20): chat contextual por solicitud, notificaciones y calificaciones/reseñas.',
          ],
        },
      ],
    },
    {
      id: 'sec-9',
      code: '9.',
      shortLabel: '9. Requerimientos No Funcionales',
      title: '9. Requerimientos No Funcionales (RNF)',
      tag: '30 RNF Verificados',
      lead:
        'Atributos de calidad técnica, seguridad, rendimiento, usabilidad y cumplimiento legal especificados entre RNF-001 y RNF-030 (SRS §3.4).',
      kpis: [
        { label: 'Total RNF', value: '30 (RNF-001..030)' },
        { label: 'Prioridad Alta', value: '18 RNF' },
        { label: 'Marco legal', value: 'Ley 1581 de 2012' },
      ],
      tables: [
        {
          title: 'Matriz sintetizada de los 30 Requerimientos No Funcionales (SRS §3.4)',
          headers: ['Códigos', 'Dimensión', 'Prioridad', 'Requisitos clave especificados'],
          rows: [
            ['RNF-001 a RNF-005', 'Arquitectura y Compatibilidad', 'Alta / Media', 'Arquitectura modular mantenible, escalabilidad progresiva, compatibilidad web (HTML5/CSS3/JS) y móvil Android, integración vía APIs y tecnologías modernas.'],
            ['RNF-006 a RNF-009', 'Rendimiento y Disponibilidad', 'Alta / Media', 'Tiempos de respuesta fluidos, alta disponibilidad del servicio, soporte de usuarios concurrentes y recuperación ante fallos.'],
            ['RNF-010 a RNF-014', 'Seguridad y Auditoría', 'Alta / Media', 'Control de acceso por roles (RBAC), contraseñas con hash seguro (nunca texto plano), protección de datos personales, respaldos y registro de auditoría.'],
            ['RNF-015 a RNF-016', 'Integridad de Datos', 'Alta / Media', 'Consistencia referencial (PK/FK/UNIQUE) y optimización de almacenamiento multimedia y documental.'],
            ['RNF-017 a RNF-020', 'Usabilidad y UX', 'Alta / Media', 'Interfaz intuitiva diferenciada por rol, diseño responsive (mínimo 1366×768 y móvil), accesibilidad visual y mensajes claros.'],
            ['RNF-021 a RNF-024', 'Ingeniería y Mantenimiento', 'Alta / Media', 'Calidad de código, control de versiones (Git), documentación técnica actualizada y realización de pruebas antes de despliegue.'],
            ['RNF-025 a RNF-026', 'Infraestructura y Cloud', 'Media', 'Configuración estable de servidor (HTTPS/TLS obligatorio) y compatibilidad con servicios en la nube (R2/CDN).'],
            ['RNF-027 a RNF-030', 'Normativa y Evolución', 'Alta / Media', 'Gestión explícita de términos y condiciones, cumplimiento Ley 1581 de 2012 (Habeas Data), adaptabilidad futura y soporte nativo Android.'],
          ],
        },
      ],
    },
    {
      id: 'sec-10',
      code: '10.',
      shortLabel: '10. Calidad ISO/IEC 25010',
      title: '10. Evaluación frente a Normas de Calidad (ISO/IEC 25010)',
      tag: 'Calidad Verificada',
      lead:
        'Evaluación técnica de los entregables (aplicativo web + API REST + portafolio documental) frente a las características de calidad de la norma ISO/IEC 25010 y la especificación IEEE 830 / ISO 29148.',
      kpis: [
        { label: 'Estándar evaluado', value: 'ISO/IEC 25010' },
        { label: 'Seguridad credenciales', value: 'scrypt + HMAC-SHA256' },
        { label: 'Alineación SRS §8', value: 'MVP sin escrow obligatorio' },
        { label: 'Trazabilidad', value: '100% RF/RNF verificados' },
      ],
      tables: [
        {
          title: 'Matriz de Cumplimiento ISO/IEC 25010 — Échele Camello',
          headers: ['Característica ISO 25010', 'Evidencia verificada en el proyecto', 'Estado'],
          rows: [
            ['Adecuación funcional', 'Catálogo, filtros, agenda sin cruces (RF-035..038), chat con imágenes (RF-042), reseñas (RF-047), reportes (RF-050) y CRUD categorías (RF-057).', 'Cumplido'],
            ['Seguridad', 'Hashing scrypt con sal aleatoria única por usuario, tokens de sesión HMAC-SHA256 revocables (RF-061) y control RBAC estricto en backend (RF-006, RF-059).', 'Cumplido'],
            ['Confiabilidad', 'Persistencia JSON atómica en runtime-data.json, máquina de estados con transiciones validadas y prevención de doble agendamiento (HTTP 409).', 'Cumplido'],
            ['Usabilidad', 'Interfaz responsiva con retroalimentación no bloqueante (banners/toasts en lugar de window.alert), filtros claros y visor local de anexos.', 'Cumplido'],
            ['Mantenibilidad y Portabilidad', 'Arquitectura modular (server/app.ts, server/security.ts, server/store.ts) con TypeScript estricto (0 errores) y build Vite reproducible.', 'Cumplido'],
          ],
        },
      ],
    },
    {
      id: 'sec-11',
      code: '11.',
      shortLabel: '11. Arquitectura de Software',
      title: '11. Arquitectura de Software, Patrones e Infraestructura',
      tag: '7 Dominios · 8 Patrones · HW',
      lead:
        'Diseño técnico que concilia el escenario objetivo del SRS (API Gateway + 7 dominios desacoplados) con un arranque pragmático en Monolito Modular PHP/Laravel validado en hardware real de desarrollo.',
      kpis: [
        { label: 'Dominios SRS', value: '7 microservicios lógicos' },
        { label: 'Patrones aplicados', value: '8 patrones estándar' },
        { label: 'Inicio MVP', value: 'Monolito Modular Laravel' },
        { label: 'PC Referencia', value: 'HP i5-10210U · 16 GB RAM' },
      ],
      cards: [
        {
          title: 'Transición pragmática: Monolito Modular → Microservicios',
          bullets: [
            'Para evitar sobreingeniería en el equipo de 4 aprendices (SRS §6 y Cotización Software), la implementación inicial opera como Monolito Modular en PHP + Laravel + MySQL manteniendo límites estrictos entre dominios.',
            'La comunicación entre clientes Web/Android y backend ocurre obligatoriamente bajo HTTPS con TLS/SSL y punto único de entrada (API Gateway / rutas API).',
            'Se descartan deliberadamente tecnologías innecesarias para el MVP como Kubernetes, Kafka o Service Mesh (SRS §7).',
          ],
        },
      ],
      tables: [
        {
          title: 'Descomposición en 7 Dominios Funcionales (SRS §6)',
          headers: ['Dominio / Servicio', 'Responsabilidad principal', 'Entidades', 'RF / Patrones'],
          rows: [
            ['ms-usuarios', 'Registro, verificación, login, recuperación, roles y sesiones.', 'Usuario, Rol, Sesion', 'RF-001..008, 059..061 · Repository, DTO, Adapter correo'],
            ['ms-perfiles', 'Perfil profesional, experiencia, ubicación y disponibilidad.', 'PerfilProfesional, Disponibilidad, Ubicacion', 'RF-009..017 · Repository, DTO, Capas'],
            ['ms-servicios', 'Publicación, edición, retiro lógico, categorías y tarifas.', 'Servicio, Categoria', 'RF-018..024, 057 · Repository, DTO, Capas'],
            ['ms-busqueda', 'Búsqueda filtrada por categoría, cercanía y reputación.', 'Consulta agregada multi-dominio', 'RF-025..032 · Strategy, DTO, Adapter mapas'],
            ['ms-solicitudes', 'Solicitudes, aceptación, agenda, estados e historial.', 'SolicitudServicio, Programacion', 'RF-033..040 · State, Repository, DTO'],
            ['ms-comunicacion', 'Chat por solicitud, adjuntos e historial de notificaciones.', 'Conversacion, Mensaje, Notificacion', 'RF-041..046 · Observer/Pub-Sub, Repository, Adapter'],
            ['ms-reputacion', 'Calificaciones 1–5, reseñas, reportes y auditoría admin.', 'Calificacion, Resena, Reporte, RegistroAuditoria', 'RF-047..056, 058 · Repository, DTO, Observer'],
          ],
        },
        {
          title: 'Diagnóstico de Hardware de Desarrollo (Taller 06/10/2026)',
          headers: ['Componente', 'Especificación verificada (Equipo n.º 1)', 'Evaluación técnica'],
          rows: [
            ['Equipo / Serie', 'HP Laptop 14-cf2xxx', 'Apto para trabajo administrativo, análisis, IDE y entorno local PHP/MySQL.'],
            ['Procesador', 'Intel Core i5-10210U (10.ª gen · 4 núcleos / 8 hilos · hasta 4,20 GHz)', 'Capacidad sólida para multitarea, compilación e IDE.'],
            ['Memoria RAM', '16,0 GB DDR4', 'Ventaja clave para ejecutar Antigravity, navegador, servidor local y BD simultáneamente.'],
            ['Almacenamiento', 'SSD INTEL HBRPEKNX0101AH · 238 GB (61 GB libres)', 'Arranque ágil; requiere monitoreo de espacio libre y copias externas periódicas.'],
            ['Sistema / Gráficos', 'Windows 10 Home SL 22H2 (64 bits) · Intel UHD Graphics', 'Cumple requisitos mínimos SRS (≥ 4 GB RAM, ≥ 1366×768); no apto para render 3D pesado.'],
          ],
        },
      ],
      gallery: [
        { src: 'assets/informe/hw/hw-sistema-specs.jpeg', caption: 'Ficha técnica real de sistema — HP Laptop 14-cf2xxx (i5-10210U · 16 GB RAM)' },
        { src: 'assets/informe/hw/hw-foto-equipo-1.jpeg', caption: 'Evidencia física del equipo n.º 1 en buen estado operativo' },
        { src: 'assets/informe/hw/hw-foto-equipo-2.jpeg', caption: 'Vista lateral/chasis y ventilación — Mantenimiento preventivo recomendado' },
        { src: 'assets/informe/hw/hw-espacio-ssd.png', caption: 'Lectura de almacenamiento SSD (238 GB totales · 61 GB disponibles)' },
      ],
    },
    {
      id: 'sec-12',
      code: '12.',
      shortLabel: '12. Modelado de Datos (DER)',
      title: '12. Modelado de Datos (Diagrama de Dominio y Modelo Conceptual)',
      tag: '17 Entidades Consolidadas',
      lead:
        'Estructura relacional normalizada del negocio: consolida 17 entidades esenciales en MySQL (InnoDB), corrige redundancias heredadas y blinda reglas críticas mediante llaves únicas e integridad referencial.',
      kpis: [
        { label: 'Entidades consolidadas', value: '17 (SRS §5.2)' },
        { label: 'Decisiones de ajuste', value: '11 correcciones clave' },
        { label: 'Reglas de negocio', value: '12 invariantes SQL/App' },
        { label: 'Motor elegido', value: 'MySQL Community (InnoDB)' },
      ],
      cards: [
        {
          title: 'Correcciones clave respecto al borrador inicial (SRS §5.1)',
          bullets: [
            'Eliminación de tablas redundantes: Usuario_Cliente, Usuario_Trabajador, Usuario_Reportante y Usuario_Reportado se unifican mediante Rol y llaves foráneas sobre Usuario.',
            'Seguridad de credenciales: password_hash sustituye texto plano.',
            'Separación de ubicación del perfil (para búsquedas por cercanía) vs. dirección concreta de SolicitudServicio.',
            'Borrado lógico (desactivación) para cuentas y servicios con historial previo.',
            'Historial derivado de consultas sobre SolicitudServicio + Programacion (sin tabla duplicada) + incorporación de RegistroAuditoria.',
          ],
        },
        {
          title: 'Reglas de negocio consolidadas (SRS §5.4)',
          bullets: [
            'Correo y documento son únicos por usuario; estados válidos: PENDIENTE_VERIFICACION, ACTIVO, DESACTIVADO, SUSPENDIDO.',
            'Solo un Trabajador activo y verificado crea PerfilProfesional (1:0..1), registra Disponibilidad y publica Servicios.',
            'Máximo una Calificacion (1–5) y una Conversacion por SolicitudServicio (UNIQUE id_solicitud), y solo se califica en estado FINALIZADA.',
            'Un Reporte debe señalar al menos un objetivo (usuario reportado, servicio o reseña) y toda acción administrativa queda auditada.',
          ],
        },
      ],
      tables: [
        {
          title: 'Diccionario consolidado de las 17 Entidades (SRS §5.2)',
          headers: ['Entidad', 'Llave Primaria / Únicas', 'Atributos y FKs principales'],
          rows: [
            ['Rol / Usuario', 'id_rol (PK) / id_usuario (PK)', 'id_rol (FK), nombre, apellido, documento, correo, password_hash, telefono, estado'],
            ['Sesion', 'id_sesion (PK)', 'id_usuario (FK), fecha_inicio, fecha_fin, dispositivo, estado'],
            ['PerfilProfesional', 'id_perfil (PK) · id_usuario (UNIQUE)', 'descripcion, experiencia, profesion_oficio, habilidades, certificaciones, foto_url'],
            ['Disponibilidad / Ubicacion', 'id_disponibilidad / id_ubicacion', 'id_usuario (FK), dia, hora_inicio, hora_fin / direccion, ciudad, latitud, longitud'],
            ['Categoria / Servicio', 'id_categoria / id_servicio', 'id_perfil (FK), id_categoria (FK), nombre, descripcion, precio, estado, atencion_inmediata'],
            ['SolicitudServicio', 'id_solicitud (PK)', 'id_cliente (FK), id_trabajador (FK), id_servicio (FK), fecha_solicitud, fecha_servicio, estado'],
            ['Programacion', 'id_programacion (PK) · id_solicitud (UQ)', 'fecha, hora, lugar, estado'],
            ['Calificacion / Resena', 'id_calificacion / id_resena (UQ)', 'puntuacion (1–5), fecha / comentario, estado'],
            ['Conversacion / Mensaje', 'id_conversacion (UQ) / id_mensaje', 'id_solicitud (FK), fecha_inicio / contenido, archivo_url, fecha_hora, tipo'],
            ['Notificacion', 'id_notificacion (PK)', 'id_usuario (FK), titulo, mensaje, fecha_hora, estado'],
            ['Reporte / RegistroAuditoria', 'id_reporte / id_registro', 'reportante/reportado/servicio/resena, motivo / accion, entidad_afectada, detalle'],
          ],
        },
      ],
      gallery: [
        { src: 'assets/informe/diagrama-dominio.jpg', caption: 'Diagrama de Dominio del Negocio — Gestión de servicios, usuarios y atención' },
        { src: 'assets/informe/modelo-conceptual-er.png', caption: 'Modelo Conceptual de Entidad-Relación y Cardinalidades (Taller BD)' },
      ],
    },
    {
      id: 'sec-13',
      code: '13.',
      shortLabel: '13. Diagramas de Actividad',
      title: '13. Diagramas de Actividad por Módulos (DA-01 a DA-16)',
      tag: '16 Flujos Operativos',
      lead:
        'Modelado paso a paso del comportamiento dinámico del sistema en cuatro módulos funcionales: Acceso, Gestión del Trabajador, Búsqueda y Contratación, y Comunicación.',
      kpis: [
        { label: 'Total diagramas', value: '16 (DA-01 a DA-16)' },
        { label: 'Módulos funcionales', value: '4 bloques' },
        { label: 'Herramienta UML', value: 'draw.io (Apache-2.0)' },
      ],
      interactiveTabs: [
        {
          id: 'da-mod1',
          label: 'Módulo 1 · Acceso (DA-01..04)',
          description: 'Flujos de registro, validación de credenciales, recuperación de acceso y edición de cuenta.',
          gallery: [
            { src: 'assets/informe/da/da-01.png', caption: 'DA-01 · Registro de Usuario' },
            { src: 'assets/informe/da/da-02.png', caption: 'DA-02 · Inicio de Sesión' },
            { src: 'assets/informe/da/da-03.png', caption: 'DA-03 · Recuperación de Contraseña' },
            { src: 'assets/informe/da/da-04.png', caption: 'DA-04 · Gestión de Cuenta' },
          ],
        },
        {
          id: 'da-mod2',
          label: 'Módulo 2 · Trabajador (DA-05..09)',
          description: 'Gestión del perfil profesional, publicación, edición, retiro de servicios y calificación.',
          gallery: [
            { src: 'assets/informe/da/da-05.png', caption: 'DA-05 · Gestión del Perfil Profesional' },
            { src: 'assets/informe/da/da-06.png', caption: 'DA-06 · Publicación y Gestión de Servicio' },
            { src: 'assets/informe/da/da-07.png', caption: 'DA-07 · Calificar Servicios' },
            { src: 'assets/informe/da/da-08.png', caption: 'DA-08 · Editar Servicio' },
            { src: 'assets/informe/da/da-09.png', caption: 'DA-09 · Eliminar Servicio' },
          ],
        },
        {
          id: 'da-mod3',
          label: 'Módulo 3 · Contratación (DA-10..14)',
          description: 'Búsqueda por criterios, envío y gestión de solicitudes, programación e historial.',
          gallery: [
            { src: 'assets/informe/da/da-10.png', caption: 'DA-10 · Búsqueda de Trabajadores y Servicios' },
            { src: 'assets/informe/da/da-11.png', caption: 'DA-11 · Solicitar Servicio' },
            { src: 'assets/informe/da/da-12.png', caption: 'DA-12 · Gestionar Solicitudes' },
            { src: 'assets/informe/da/da-13.png', caption: 'DA-13 · Programar / Reprogramar / Cancelar Servicio' },
            { src: 'assets/informe/da/da-14.png', caption: 'DA-14 · Consultar Historial de Servicios' },
          ],
        },
        {
          id: 'da-mod4',
          label: 'Módulo 4 · Comunicación (DA-15..16)',
          description: 'Mensajería contextual entre cliente y trabajador y despacho de notificaciones.',
          gallery: [
            { src: 'assets/informe/da/da-15.png', caption: 'DA-15 · Mensajería Entre Usuarios' },
            { src: 'assets/informe/da/da-16.png', caption: 'DA-16 · Gestionar Notificaciones' },
          ],
        },
      ],
    },
    {
      id: 'sec-14',
      code: '14.',
      shortLabel: '14. Desarrollo, Costos y RR. HH.',
      title: '14. Desarrollo, Implementación, Costos y Recursos Humanos',
      tag: 'COP $145.940 + $17,16M',
      lead:
        'Presupuesto real en pesos colombianos (TRM 3.182,99 del 03/11/2026) que separa estrictamente la inversión en infraestructura/software del costo académico de talento humano bajo Scrum.',
      kpis: [
        { label: 'Software piloto (8 sem)', value: 'COP $145.940,09' },
        { label: 'Renovación anual SW', value: 'COP $455.326,72' },
        { label: 'Presupuesto RR. HH.', value: 'COP $17.160.000' },
        { label: 'Esfuerzo equipo', value: '592 h · 4 Sprints' },
      ],
      interactiveTabs: [
        {
          id: 'cost-sw',
          label: 'Resumen y Detalle Software',
          description: 'Cotización técnica en 26 categorías (03/11/2026 · 4 aprendices · piloto de 8 semanas). Solo dos rubros requieren desembolso real.',
          tables: [
            {
              title: 'Resumen económico de Software e Infraestructura (COP)',
              headers: ['Categoría', 'Tecnología elegida', 'Cant.', 'Inicial COP', 'Renovación / año COP'],
              rows: [
                ['Alojamiento Web', 'DreamHost Web Hosting Launch (anual prepagado)', '1', '$110.386,09', '$419.772,72'],
                ['Dominio Web (.com)', 'Cloudflare Registrar .com (no premium)', '1', '$35.554,00', '$35.554,00'],
                ['Backend y Frontend', 'PHP + Laravel (MIT) + Blade/HTML/CSS/JS + Guzzle', '4', '$0', '$0'],
                ['Base de Datos y Servidor', 'MySQL Community (GPLv2) + Apache HTTP (Apache-2.0)', '1', '$0', '$0'],
                ['IDE, IA y Gestión Ágil', 'Antigravity + Gemini estudiantes + Git + GitHub Projects', '4', '$0', '$0'],
                ['Diseño UI y Diagramación', 'Penpot Cloud + draw.io (Apache-2.0) + Google Docs/LibreOffice', '4', '$0', '$0'],
                ['Pruebas, API y Seguridad', 'PHPUnit + Playwright + Bruno (MIT) + DBeaver + OWASP ZAP', '4', '$0', '$0'],
                ['Cloud, Correo, DNS y Monitoreo', 'Resend Free (1.000/mes) + Cloudflare R2/DNS/SSL + UptimeRobot', '1', '$0', '$0'],
                ['TOTAL PRESUPUESTO PILOTO', 'USD 45,85 × TRM 3.182,99 (antes de impuestos)', '—', '$145.940,09', '$455.326,72'],
              ],
            },
            {
              title: 'Ampliaciones opcionales evaluadas (no sumadas al presupuesto base)',
              headers: ['Ampliación', 'Cuándo se activa', 'Costo estimado COP'],
              rows: [
                ['Windows 11 Home nueva', 'Solo si algún PC carece de licencia OEM/retail válida', '$442.435,61 / equipo ($1.769.742,44 x 4)'],
                ['Google AI Pro / Resend Pro', 'Si se superan cuotas gratuitas o 100 correos/día', '$63.627,97/usuario/mes · $63.659,80/mes'],
                ['Cloudflare Pro / UptimeRobot Solo', 'Mayor protección WAF o monitoreo cada 60 segundos', '$79.574,75/mes · $41.378,87/mes'],
                ['Cloudflare R2 a 100 GB', 'Si fotos y respaldos superan los 10 GB gratuitos', '$4.297,04/mes (90 GB excedentes)'],
              ],
            },
          ],
        },
        {
          id: 'cost-hr',
          label: 'Recursos Humanos y Tarifas',
          description: 'Valoración académica de dedicación por horas (27/10/2026) · 4 sprints de 2 semanas. No se mezclan equipos ni licencias en este subtotal.',
          tables: [
            {
              title: 'Roles, dedicación y costo por integrante (COP)',
              headers: ['Integrante / Rol Scrum', 'h/sem', 'Tarifa COP/h', 'h/sprint', 'h/proyecto', 'Costo directo COP'],
              rows: [
                ['Carlos Fabián · Product Owner', '6 h', '$35.000', '12 h', '48 h', '$1.680.000'],
                ['Luis Yamit Tombe · Scrum Master', '8 h', '$30.000', '16 h', '64 h', '$1.920.000'],
                ['Paula Valentina Vargas · Desarrolladora', '20 h', '$25.000', '40 h', '160 h', '$4.000.000'],
                ['Martin Andrés Andrade · Desarrollador', '20 h', '$25.000', '40 h', '160 h', '$4.000.000'],
                ['Juan David Parada · Desarrollador', '20 h', '$25.000', '40 h', '160 h', '$4.000.000'],
                ['TOTAL EQUIPO (Costo directo)', '74 h/sem', '—', '148 h', '592 h', '$15.600.000'],
                ['+ Reserva imprevistos (10 %)', 'Autorizada por PO', '—', '—', '—', '$1.560.000'],
                ['PRESUPUESTO TOTAL RR. HH.', '4 Sprints (8 semanas)', '—', '—', '592 h', '$17.160.000'],
              ],
            },
          ],
        },
        {
          id: 'cost-gantt',
          label: 'Scrum, Gantt y WBS Análisis',
          description: 'Cronograma de ejecución en 4 sprints (S1–S8) y desglose WBS de la fase de análisis (22 horas iniciales).',
          tables: [
            {
              title: 'Diagrama de Gantt por Sprints (8 semanas relativas)',
              headers: ['Sprint / Incremento', 'Semanas', 'Entregable verificable', 'Costo directo + Reserva'],
              rows: [
                ['Sprint 1 · Acceso y perfiles', 'S1 – S2', 'Registro, login por roles y perfil básico de trabajador.', '$3.900.000 + $390.000 = $4.290.000'],
                ['Sprint 2 · Búsqueda y solicitudes', 'S3 – S4', 'Catálogo, filtros y solicitud vinculada cliente-trabajador.', '$3.900.000 + $390.000 = $4.290.000'],
                ['Sprint 3 · Agenda y estados', 'S5 – S6', 'Agendamiento sin cruces y máquina de estados controlada.', '$3.900.000 + $390.000 = $4.290.000'],
                ['Sprint 4 · Valoración y cierre', 'S7 – S8', 'Calificaciones, controles administrativos, pruebas y entrega.', '$3.900.000 + $390.000 = $4.290.000'],
              ],
            },
            {
              title: 'Estructura WBS de Planeación y Análisis (22 h · 5 días)',
              headers: ['Código', 'Actividad WBS', 'Tiempo', 'Propósito'],
              rows: [
                ['1.0 – 1.2', 'Planificación, actores y levantamiento', '6 h', 'Objetivos, matriz de stakeholders, restricciones y recolección.'],
                ['1.3 – 1.4', 'Análisis de requisitos y modelado negocio', '6 h', 'RF/RNF y procesos principales del sistema.'],
                ['1.5 – 1.7', 'Modelo conceptual, datos y especificación', '8 h', 'Entidades, cardinalidades, PK/FK y reglas de negocio.'],
                ['1.8 – 1.9', 'Validación y consolidación documental', '4 h', 'Integración coherente de productos en el SRS.'],
              ],
            },
          ],
        },
      ],
    },
    {
      id: 'sec-15',
      code: '15.',
      shortLabel: '15. Pruebas y QA',
      title: '15. Pruebas, Verificación y Aseguramiento de la Calidad (QA)',
      tag: 'Pruebas Automatizadas PASS',
      lead:
        'Resultados reales ejecutados sobre la suite del aplicativo web (API REST + seguridad + reglas SRS) y sobre la suite del portafolio técnico interactivo.',
      kpis: [
        { label: 'Pruebas API / SRS', value: '5 / 5 PASS (1.06 s)' },
        { label: 'Pruebas Portafolio', value: '12 / 12 PASS' },
        { label: 'TypeScript (tsc)', value: '0 errores' },
        { label: 'Build Vite', value: '703 ms (exit 0)' },
      ],
      tables: [
        {
          title: 'Registro Real de Pruebas Ejecutadas (tests/srs_compliance.test.ts + app.test.ts)',
          headers: ['Suite / Caso de Prueba', 'Cobertura SRS / Calidad', 'Resultado observado'],
          rows: [
            ['RNF-011 · Hashing scrypt', 'Verifica sal única aleatoria por contraseña y verificación timingSafeEqual.', 'PASS (134.9 ms)'],
            ['RF-001..006 / RF-059 / RF-061', 'Registro, login, bloqueo de escalamiento a admin (HTTP 403) y revocación de sesión (HTTP 401).', 'PASS (183.5 ms)'],
            ['RF-057 · CRUD Categorías Admin', 'Creación, actualización y eliminación de categorías restringida a rol admin.', 'PASS (144.3 ms)'],
            ['SRS §8 & RF-035..038 · Agenda', 'Flujo directo sin escrow obligatorio (comisión 0 en MVP) y rechazo de cruce horario (HTTP 409).', 'PASS (151.0 ms)'],
            ['RF-042 / RF-047 / RF-050 · Chat, Reseñas y Reportes', 'Validación de formato PNG/JPG/WEBP en chat, reseña única solo en contrato completado y reportes.', 'PASS (147.2 ms)'],
            ['app.test.ts (Portafolio)', 'Integridad de 12 anexos en manifest.json, parser OOXML/Excel, historial de versiones y rutas de imágenes.', '12 / 12 PASS'],
          ],
        },
      ],
    },
    {
      id: 'sec-16',
      code: '16.',
      shortLabel: '16. Licenciamiento del Software',
      title: '16. Licenciamiento del Software y Marco Legal',
      tag: '11 Tipos + Matriz Real',
      lead:
        'Análisis conceptual de los once esquemas de licenciamiento y su aplicación práctica sobre cada componente tecnológico elegido para Échele Camello.',
      kpis: [
        { label: 'Conceptos estudiados', value: '11 modalidades' },
        { label: 'Licencias del stack', value: 'MIT · GPLv2 · Apache-2.0' },
        { label: 'Registro dependencias', value: 'composer.lock + package-lock' },
      ],
      tables: [
        {
          title: 'Marco conceptual: 11 Tipos de Licencias y Modalidades (Taller 13/10/2026)',
          headers: ['Categoría / Licencia', 'Naturaleza jurídica y permisos clave', 'Ejemplo / Cuidado en proyecto'],
          rows: [
            ['Software Privativo', 'Restringe uso, estudio, modificación o redistribución; gratuito o pago sin código fuente.', 'Windows 10/11 (OEM/retail por equipo).'],
            ['Software Semilibre', 'Permite copiar y modificar solo para fines no lucrativos; excluye uso comercial libre.', 'Requiere autorización adicional si se comercializa.'],
            ['Copyleft', 'Mecanismo que obliga a conservar las mismas libertades en obras derivadas distribuidas.', 'Aplicado en licencias como GNU GPL.'],
            ['GPL (GNU General Public)', 'Software libre con copyleft; permite uso comercial exigiendo código fuente al distribuir.', 'Git, MySQL Community (GPLv2), KeePassXC.'],
            ['Open Source (OSI)', 'Código accesible con derecho de modificación y redistribución; puede ser permisiva o copyleft.', 'Laravel (MIT), Playwright (Apache-2.0), Bruno.'],
            ['Software Libre (GNU)', 'Garantiza 4 libertades (ejecutar, estudiar, compartir y mejorar); libre ≠ gratis.', 'Principios del ecosistema GNU y PHP/Debian.'],
            ['Debian (DFSG)', 'Directrices de Software Libre que evalúan redistribución y código fuente sin discriminar usos.', 'Cada paquete conserva su licencia individual.'],
            ['Creative Commons', 'Licencias para contenido visual y documental (BY, SA, NC, ND); no usar para código.', 'Documentación, íconos y recursos con atribución.'],
            ['Demo / Trial', 'Demo limita funciones antes de comprar; Trial evalúa el programa por tiempo limitado.', 'Verificar qué pasa al expirar la prueba.'],
            ['Donationware', 'Software funcional con invitación a donar; sus permisos reales dependen de su licencia base.', 'Donar no cambia la licencia ni da derechos extra.'],
          ],
        },
        {
          title: 'Licenciamiento efectivo del stack de Échele Camello',
          headers: ['Capa / Herramienta', 'Licencia / Acuerdo', 'Condición de uso asumida'],
          rows: [
            ['Laravel, Blade, Guzzle, Composer, Bruno', 'MIT', 'Uso libre y comercial conservando avisos de licencia.'],
            ['Apache HTTP, draw.io, DBeaver, ZAP, Playwright', 'Apache-2.0', 'Permisiva con protección de patentes; conservar NOTICE.'],
            ['MySQL Community, Git, KeePassXC', 'GPLv2', 'Uso interno libre; el código propio Laravel no se enlaza como derivado GPL al ejecutarse como servicio.'],
            ['PHPUnit', 'BSD-3-Clause', 'Permisiva para pruebas unitarias e integración.'],
            ['Penpot Cloud / LibreOffice', 'MPL-2.0 + términos cloud', 'Copyleft débil a nivel de archivo modificado.'],
            ['Antigravity, GitHub, Resend, DreamHost, Cloudflare', 'Propietarias / Términos SaaS', 'Sujeto a límites de cuota gratuita o pago anual pactado.'],
          ],
        },
      ],
    },
    {
      id: 'sec-17',
      code: '17.',
      shortLabel: '17. Conclusiones',
      title: '17. Conclusiones',
      tag: 'Cierre Técnico',
      lead:
        'Síntesis de los hallazgos obtenidos tras consolidar la especificación, el modelado, la infraestructura física, las licencias y el presupuesto del proyecto.',
      cards: [
        {
          title: 'Conclusiones principales del equipo ADSO',
          bullets: [
            'Pertinencia social y económica: Échele Camello ataca directamente la brecha de informalidad laboral del país (55,3 % nacional / 83,2 % rural según DANE 2026) organizando la oferta de oficios de proximidad.',
            'Consistencia de ingeniería: la consolidación del SRS (61 RF, 30 RNF, 17 entidades y 12 reglas de negocio) eliminó duplicidades y garantiza trazabilidad total hacia casos de uso, diagramas de actividad y prototipos.',
            'Viabilidad financiera: el empleo estratégico de software libre/abierto (PHP, Laravel, MySQL, Apache, Penpot, draw.io, PHPUnit, ZAP) permite lanzar el piloto web con una inversión inicial en software de solo COP $145.940,09.',
            'Capacidad operativa validada: la metodología Scrum (4 sprints / 592 horas / COP $17.160.000 académicos) y el hardware disponible (HP Core i5-10210U con 16 GB RAM y SSD) cubren adecuadamente el desarrollo e integración del MVP web.',
            'Rigurosidad legal y licenciamiento: distinguir costo de permisos evita riesgos jurídicos; registrar dependencias en composer.lock y cumplir la Ley 1581 de 2012 protege tanto al equipo como a los usuarios.',
          ],
        },
      ],
    },
    {
      id: 'sec-18',
      code: '18.',
      shortLabel: '18. Recomendaciones',
      title: '18. Recomendaciones Técnicas y Operativas',
      tag: 'Siguientes Pasos',
      lead:
        'Acciones concretas derivadas de los talleres de hardware, licenciamiento, arquitectura y costos para garantizar una ejecución segura en producción.',
      cards: [
        {
          title: 'Recomendaciones de arquitectura, costos y licencias',
          bullets: [
            'Formalizar en el TRD la adopción del Monolito Modular en Laravel y validar con el instructor las condiciones reales de las cuentas educativas (GitHub Education y Gemini) antes de comprometer créditos.',
            'Mantener separado el dominio Cloudflare del hosting DreamHost para facilitar futuras migraciones de servidor sin pérdida de identidad digital.',
            'Verificar las licencias de los recursos visuales o de terceros antes de incorporarlos y mantener actualizados composer.lock y el archivo de bloqueo JavaScript con sus avisos LICENSE/NOTICE.',
            'Ensayar periódicamente la restauración de copias de respaldo en Cloudflare R2 (no limitarse a almacenar backups sin probarlos) y proteger secretos en KeePassXC / variables de entorno.',
          ],
        },
        {
          title: 'Recomendaciones sobre el hardware de desarrollo',
          bullets: [
            'Completar la ficha técnica con el modelo exacto y ejecutar pruebas de estabilidad, temperatura y salud del SSD (actualmente con 61 GB libres de 238 GB).',
            'Limpiar archivos temporales, controlar aplicaciones al inicio de Windows 10 22H2 y mantener despejadas las salidas de ventilación mediante mantenimiento preventivo.',
            'Evaluar una ampliación de almacenamiento SSD solo tras validar compatibilidad física con la serie HP 14-cf2xxx; los 16 GB de RAM actuales son suficientes para esta fase.',
          ],
        },
      ],
    },
    {
      id: 'sec-19',
      code: '19.',
      shortLabel: '19. Referencias Bibliográficas',
      title: '19. Referencias Bibliográficas y Cibergrafía',
      tag: 'Fuentes Oficiales',
      lead:
        'Fuentes normativas, estadísticas, metodológicas y técnicas citadas expresamente en los documentos del proyecto.',
      tables: [
        {
          title: 'Fuentes documentadas en SRS, Hardware, Licencias, Software y RR. HH.',
          headers: ['Fuente / Autor', 'Referencia / Título', 'Enlace / Documento'],
          rows: [
            ['DANE (2026)', 'Empleo informal y seguridad social: Boletín técnico GEIH (dic 2025 – feb 2026).', 'dane.gov.co (SRS §1.8)'],
            ['CEPAL (2023) & OIT (2023)', 'Panorama social de América Latina / Perspectivas sociales y del empleo en el mundo.', 'cepal.org · ilo.org (SRS §1.8)'],
            ['República de Colombia (2012)', 'Ley 1581 de 2012 — Régimen General de Protección de Datos Personales.', 'funcionpublica.gov.co (SRS §1.8)'],
            ['IEEE (2021) & MinTIC (2023)', 'IEEE Std 830 / Práctica recomendada SRS y Transformación digital en Colombia.', 'ieee.org · mintic.gov.co (SRS §1.8)'],
            ['Schwaber & Sutherland (2020)', 'La Guía de Scrum — Marco de trabajo iterativo e incremental.', 'scrumguides.org (Cotización RR. HH.)'],
            ['Proyecto GNU / OSI / Debian / CC', 'Categorías de software libre, GPLv3, DFSG, OSD y Creative Commons FAQ.', 'gnu.org · opensource.org · debian.org · creativecommons.org'],
            ['Intel & Microsoft Support (2026)', 'Especificaciones Intel Core i5-10210U y guías de optimización/almacenamiento Windows.', 'intel.la · support.microsoft.com (Hardware)'],
            ['Banco de la República (03/11/2026)', 'Tasa Representativa del Mercado (TRM) oficial: 3.182,99 COP/USD.', 'banrep.gov.co (Cotización Software)'],
          ],
        },
      ],
    },
    {
      id: 'anexos',
      code: '20.',
      shortLabel: '20. Anexos (Portafolio)',
      title: '20. Anexos del Proyecto (Gestor y Visor de Evidencias)',
      tag: 'Archivos 1–12',
      isAnnexWorkspace: true,
      lead:
        'Espacio interactivo con los 12 apartados oficiales precargados (incluyendo el Taller Final de Arquitectura en Anexo 7 y el Diagnóstico de Hardware en Anexo 8), listos para previsualizar (.docx, .xlsx, .xlsm, .pdf, imágenes), versionar o reemplazar.',
    },
  ];

  // Datos de respaldo visibles para Anexos 7 y 8 (cuando aún no se ha adjuntado archivo manual en el visor)
  const ANNEX_FALLBACK_SUMMARIES = {
    '7': {
      badge: 'Resumen documental integrado · Pendiente de adjuntar archivo propio',
      title: 'Anexo 7 · Taller General / Taller Final de Arquitectura (01/09/2026)',
      points: [
        'Contexto: multiplataforma Web + Android para intermediación de servicios de proximidad (plomería, cerrajería, electricidad, carpintería, mantenimiento, transporte).',
        'Enfoque Scrum (RAP 1) + WBS de 9 actividades de análisis (22 h estimadas).',
        'Modelado completo integrado: 16 Casos de Uso (CU-01..CU-16), 16 Diagramas de Actividad (DA-01..DA-16), Diagrama de Dominio y Modelo Conceptual de 20 conceptos / 17 entidades consolidadas.',
        'Prototipado y validación (RAP 4) con maqueta en Figma.',
      ],
      gallery: [
        { src: 'assets/informe/diagrama-dominio.jpg', caption: 'Diagrama de Dominio incluido en Arquitectura' },
        { src: 'assets/informe/prototipo-figma.png', caption: 'Prototipo Figma (RAP 4 · Taller 7)' },
      ],
    },
    '8': {
      badge: 'Resumen documental integrado · Diagnóstico 06/10/2026',
      title: 'Anexo 8 · Hardware — Diagnóstico HP Laptop 14-cf2xxx (Equipo n.º 1)',
      points: [
        'Procesador: Intel Core i5-10210U (10.ª gen, 4 núcleos / 8 hilos, base 1,60 GHz, turbo hasta 4,20 GHz).',
        'Memoria RAM: 16,0 GB · Almacenamiento: SSD INTEL HBRPEKNX0101AH 238 GB (61 GB libres).',
        'Gráficos: Intel UHD Graphics · Sistema Operativo: Windows 10 Home Single Language 22H2 (64 bits).',
        'Conclusión: apto para trabajo administrativo, oficina y desarrollo local; requiere vigilar espacio SSD y realizar pruebas de temperatura/estabilidad.',
      ],
      gallery: [
        { src: 'assets/informe/hw/hw-sistema-specs.jpeg', caption: 'Diagnóstico del sistema HP Laptop 14-cf2xxx' },
        { src: 'assets/informe/hw/hw-foto-equipo-1.jpeg', caption: 'Fotografía física del Equipo n.º 1' },
      ],
    },
  };

  const api = {
    REPORT_META,
    REPORT_SECTIONS,
    ANNEX_FALLBACK_SUMMARIES,
  };

  globalScope.ECHELE_REPORT_DATA = api;
})(typeof globalThis !== 'undefined' ? globalThis : window);
