# Alcance y límites de la solución

La primera versión comprende la **gestión administrativa de inscripciones académicas de una sola universidad**. Incluye las capacidades directamente necesarias para preparar la oferta académica, registrar y mantener inscripciones, controlar el acceso a las operaciones y consultar su desarrollo.

El límite del producto se define por su responsabilidad sobre las inscripciones: no reemplaza un sistema universitario integral ni incorpora procesos que requieran gestionar resultados académicos, finanzas, planificación curricular o servicios estudiantiles ajenos al registro de inscripciones.

## Ámbito institucional

- El sistema sirve a **una institución universitaria**; sus facultades y demás unidades académicas forman parte de esa misma organización.
- La estructura institucional contemplada incluye **facultades**, **departamentos académicos** y **programas académicos**, como unidades institucionales diferenciadas.
- Los estudiantes se vinculan con un programa académico. Los cursos pertenecen académicamente a un departamento y pueden habilitarse para más de un programa académico.
- Los docentes se registran con su pertenencia institucional y pueden estar asignados a ofertas de cursos de otras facultades.
- La operación cotidiana corresponde a usuarios administrativos autorizados. La condición de estudiante o docente no concede por sí sola una cuenta ni acceso funcional.

La organización y sus relaciones se incluyen en la medida necesaria para definir quién puede inscribirse, en qué curso y sobre qué oferta, y para conservar el significado de los registros. Las operaciones de mantenimiento dependen de las necesidades funcionales de cada recurso: la existencia de una entidad o de una capacidad administrativa no implica disponer de todas las operaciones de creación, consulta, modificación y baja.

## Capacidades incluidas

### 1. Identificación y registros académicos base

El sistema permite mantener personas y sus perfiles académicos de estudiante o docente, evitando tratar la información personal compartida como datos independientes para cada función.

Se incluyen el registro y la actualización de estudiantes, docentes, facultades, departamentos académicos, programas académicos y cursos, junto con las consultas necesarias. Las bajas lógicas de unidades y recursos de catálogo que las admiten están condicionadas por sus dependencias vigentes. Las categorías de cursos se utilizan conforme al catálogo establecido, y las asociaciones programa–curso se habilitan y cierran sin eliminar sus episodios históricos.

La información de docentes cubre su participación en la oferta académica; la de estudiantes, su identificación y situación relevante para inscribirse. No comprende la gestión integral de expedientes laborales o de trayectoria académica.

### 2. Periodos académicos y ofertas de cursos

Se contempla el registro y la consulta de periodos académicos, la corrección de nombre, código, fechas y ventanas de inscripción únicamente en `PLANNED` y las transiciones permitidas. Se incluyen también la preparación, consulta, configuración y transiciones de las ofertas de cursos organizadas en esos periodos.

Cada oferta concreta la disponibilidad de un curso para un periodo y una sección, con capacidad definida, situación operativa y asignación docente exigida para su apertura. La administración incluye las acciones necesarias para habilitar, cerrar o cancelar periodos y ofertas, así como la reapertura autorizada de ofertas cuando sus condiciones lo permiten.

La existencia de un curso en el catálogo no implica que esté ofertado ni que acepte inscripciones en un momento determinado.

### 3. Inscripciones y movimientos académicos

La inscripción vincula un estudiante con una oferta de curso disponible. El sistema comprende:

- Registro directo de inscripciones válidas, sin flujo de solicitud o aprobación previa.
- Comprobación de la situación habilitada del estudiante y de su relación académica con el curso.
- Control de la disponibilidad del periodo, de la oferta y de los cupos.
- Prevención de inscripciones vigentes duplicadas para un mismo estudiante, curso y periodo, incluso mediante secciones diferentes.
- Cancelación, retiro y cambio de sección conforme a sus condiciones funcionales.
- Correcciones administrativas extraordinarias por personal expresamente autorizado.
- Conservación de movimientos, motivos exigibles y responsables de las operaciones.
- Consulta de inscripciones vigentes e históricas, sin perder las distinciones entre sus situaciones.

La capacidad de una sección refleja las inscripciones que efectivamente ocupan plaza. Los movimientos deben mantener esa ocupación consistente, también cuando dos operaciones ocurren de manera simultánea.

### 4. Incorporación masiva de estudiantes

Se incluye la importación de **estudiantes** desde archivos estructurados CSV y XLSX, con procesamiento separado de la interacción inmediata del usuario.

La operación contempla verificación de registros, identificación de duplicados, tratamiento independiente de filas válidas e inválidas, seguimiento del resultado y conservación de evidencia del archivo recibido. Un registro rechazado no invalida por sí mismo los demás registros correctos de la misma importación.

La importación no constituye una herramienta genérica para cargar cualquier entidad académica ni un mecanismo para sobrescribir automáticamente estudiantes existentes.

### 5. Reportes y consultas operativas

Se incluyen consultas y reportes predefinidos sobre:

- Población estudiantil y situación de sus registros.
- Cursos y su actividad de oferta.
- Secciones, capacidad y ocupación.
- Inscripciones y su distribución por periodo y programa académico.
- Participación de docentes en las ofertas.
- Indicadores agregados de importaciones, como cantidades procesadas, incorporadas, duplicadas y rechazadas.

Su finalidad es supervisar la operación y facilitar decisiones administrativas. Las consultas de actividad académica se sitúan en el periodo correspondiente y permiten distinguir el estado vigente de la información histórica cuando sea aplicable.

Los reportes son consultas controladas, no un generador libre de indicadores, consultas arbitrarias o tableros de inteligencia de negocios. **La consulta detallada de una importación** —estado de una carga identificada, observaciones por fila y archivo original— es una capacidad operativa distinta, reservada al personal autorizado para consultar importaciones. El permiso de reportes no concede por sí solo ese acceso.

### 6. Usuarios, acceso y responsabilidades

El sistema administra cuentas internas, autenticación, sesiones, roles y permisos para el acceso de personal autorizado. Distingue responsabilidades de superadministración institucional, administración ordinaria, coordinación académica, secretaría y consulta de reportes.

Comprende el registro, la consulta y la modificación autorizados de cuentas, la gestión de roles y asignaciones, la autenticación, la revocación de accesos y el control de operaciones sensibles. Las facultades administrativas se delimitan por permisos y por las restricciones de protección de cuentas y asignaciones institucionales. No existe registro público de cuentas ni una facultad general para modificar cualquier cuenta por el solo hecho de poseer un rol administrativo.

La existencia de varios roles para una cuenta y la capacidad de administrar roles personalizados no amplían el alcance académico del producto: constituyen mecanismos para regular las responsabilidades de quienes lo operan.

### 7. Historial y auditoría

El sistema conserva dos clases de evidencia con finalidades distintas:

- **Historial funcional de inscripciones:** creación y movimientos que explican su trayectoria, incluyendo cancelaciones, retiros, cambios de sección y correcciones.
- **Auditoría de acciones relevantes:** operaciones administrativas y de seguridad cuyo autor, momento y efecto deben poder examinarse.

Esta información permite reconstruir decisiones y revisar operaciones sin convertir todos los accesos de lectura en eventos académicos ni sustituir el historial de negocio por un registro técnico genérico.

## Límites de la operación académica

- La inscripción se realiza sobre una **oferta existente**; no crea automáticamente cursos, periodos o secciones.
- El proceso es **administrativo y directo**. No se incluyen listas de espera, solicitudes pendientes ni aprobaciones sucesivas de inscripción.
- Un estudiante debe cumplir las condiciones que habilitan su participación. El sistema no evalúa calificaciones previas ni prerrequisitos curriculares para determinarla.
- Los cambios de sección son movimientos dentro del curso y periodo correspondientes, no sustituciones arbitrarias por cursos distintos.
- La finalización de un periodo conserva los antecedentes académicos; no equivale a certificar que el estudiante haya aprobado un curso.
- La consulta de información histórica no implica habilitar nuevamente operaciones sobre periodos u ofertas que ya no las admiten.

Las condiciones detalladas de los estados y movimientos forman parte del comportamiento del sistema; su existencia no amplía el producto hacia el seguimiento integral del rendimiento académico.

## Exclusiones explícitas

| Área                      | Fuera de la primera versión                                                                                                      |
| ------------------------- | -------------------------------------------------------------------------------------------------------------------------------- |
| Resultados académicos     | Calificaciones, actas, promedios, evaluaciones, aprobación de cursos y expedientes académicos completos.                         |
| Currículo                 | Planes y versiones curriculares, ciclos curriculares, equivalencias, prerrequisitos y comprobación de avance de estudios.        |
| Finanzas                  | Pensiones, pagos, deudas, facturación, becas y bloqueo de inscripciones por obligaciones financieras.                            |
| Asistencia y horarios     | Control de asistencia, planificación horaria detallada, conflictos de horarios, aulas, edificios y reserva de ambientes.         |
| Admisión y certificación  | Procesos de admisión, postulaciones, títulos, constancias y certificados.                                                        |
| Autoservicio              | Portales de autoservicio estudiantil o docente, solicitudes de inscripción y flujos de aprobación asociados.                     |
| Comunicación              | Notificaciones por correo, mensajería, campañas y automatizaciones de comunicación con estudiantes.                              |
| Integración institucional | Sincronización automática con ERP, LMS, sistemas externos reales u otras instituciones.                                          |
| Administración general    | Recursos humanos, nóminas, gestión documental completa y operaciones administrativas no relacionadas con las inscripciones.      |
| Carga y analítica general | Importaciones genéricas de todas las entidades, exportación documental de reportes, consultas analíticas libres y plataforma BI. |
| Multiinstitución          | Administración de universidades independientes, separación de datos por institución o reglas multitenant.                        |

Estas exclusiones son **límites del producto**, no funcionalidades implícitas pendientes de activar. Incorporarlas supondría modificar expresamente su alcance.

## Criterio de pertenencia al alcance

Una capacidad pertenece a este producto cuando resulta necesaria para al menos una de estas responsabilidades:

1. Mantener información de referencia indispensable para una inscripción académica.
2. Determinar la disponibilidad y validez de una oferta y de la inscripción asociada.
3. Ejecutar y conservar movimientos de inscripción con integridad e historial.
4. Autorizar, atribuir y auditar operaciones sobre esa información.
5. Consultar el estado operativo del proceso y sus antecedentes.
6. Incorporar registros estudiantiles mediante el mecanismo de importación delimitado.

La proximidad temática con la vida universitaria no es suficiente para incluir una capacidad. Su relación con estas responsabilidades debe ser directa y estar expresamente contemplada.

## Delimitación del resultado

La primera versión constituye un **backend especializado en gestión de inscripciones académicas**, con funciones institucionales complementarias estrictamente necesarias para operar el proceso. Su resultado esperado es un registro consistente y supervisable de ofertas, estudiantes e inscripciones, con control de acceso y preservación de la historia funcional.
