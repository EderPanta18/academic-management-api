# Requerimientos funcionales

Los requerimientos funcionales definen los resultados y operaciones observables que debe proporcionar el sistema para administrar inscripciones académicas de una sola universidad. Se organizan por capacidades y utilizan identificadores estables, independientes de nombres de clases, rutas HTTP y estructuras de almacenamiento.

Cada criterio de aceptación expresa una condición comprobable. Las restricciones de dominio se formalizan en el modelado; aquí se identifican las obligaciones funcionales sin duplicar toda su especificación.

## 1. Información de referencia académica

| ID | Requerimiento | Criterio de aceptación |
| --- | --- | --- |
| RF-001 | El sistema debe registrar y mantener la identidad de las personas asociadas a perfiles académicos o cuentas de acceso. | Una misma identidad documental no genera personas duplicadas y sus datos comunes se mantienen de forma centralizada. |
| RF-002 | El sistema debe administrar facultades, departamentos académicos y escuelas profesionales como unidades institucionales diferenciadas. | Es posible mantener su información y consultar sus relaciones institucionales sin confundir sus responsabilidades. |
| RF-003 | El sistema debe registrar estudiantes asociados a una persona y a una escuela profesional. | Cada estudiante tiene un código institucional único y una pertenencia académica identificable. |
| RF-004 | El sistema debe administrar la situación de los estudiantes y utilizarla al determinar su habilitación para inscribirse. | Solo los estudiantes en estado `ACTIVE` pueden registrar una inscripción ordinaria. |
| RF-005 | El sistema debe registrar docentes asociados a una persona y a una facultad. | Un docente puede asignarse a ofertas de cursos de otras facultades sin cambiar su adscripción institucional. |
| RF-006 | El sistema debe administrar un catálogo de cursos identificados por códigos únicos en la universidad, asociados a departamentos académicos y clasificados según una dimensión de categorías académicas. | Un curso se identifica de manera unívoca, conserva su unidad responsable y no depende de una sola escuela profesional. |
| RF-007 | El sistema debe administrar la asociación entre escuelas profesionales y cursos. | Un curso puede asociarse con varias escuelas y solo se considera elegible para estudiantes de una escuela con asociación vigente. |
| RF-008 | El sistema debe conservar la validez histórica de referencias académicas cuando se actualicen o deshabiliten registros o asociaciones. | La modificación del catálogo no destruye ni reinterpreta inscripciones históricas y rechaza cambios incompatibles con operaciones vigentes. |
| RF-009 | El sistema debe consultar los tipos de documento de identidad admitidos mediante un catálogo institucional fijo. | Las identidades utilizan tipos reconocidos sin habilitar modificaciones arbitrarias del catálogo desde la API. |

## 2. Periodos y ofertas de cursos

| ID | Requerimiento | Criterio de aceptación |
| --- | --- | --- |
| RF-010 | El sistema debe administrar periodos académicos con fechas de desarrollo y una ventana definida para inscripciones. | Puede determinarse si un periodo admite inscripciones en una fecha determinada. |
| RF-011 | El sistema debe permitir transiciones autorizadas del ciclo de vida de los periodos académicos. | La apertura, el desarrollo, el cierre y la cancelación respetan las condiciones vigentes del periodo. |
| RF-012 | El sistema debe administrar ofertas de cursos vinculadas a un curso, un periodo, una sección, un docente y una capacidad máxima. | Cada oferta representa una sección concreta y su disponibilidad se consulta sin confundirla con el curso del catálogo. |
| RF-013 | El sistema debe gestionar la habilitación y las transiciones de ofertas de cursos. | Una oferta no puede abrirse sin un docente asignado y las operaciones de cierre, reapertura y cancelación respetan su situación operativa. |
| RF-014 | El sistema debe mostrar la ocupación y los cupos disponibles de las ofertas según las inscripciones que conservan plaza. | La capacidad disponible refleja los movimientos vigentes y nunca resulta negativa ni supera la capacidad máxima. |
| RF-015 | El sistema debe impedir nuevas operaciones ordinarias de inscripción cuando el periodo o la oferta no las admita. | Una oferta existente no basta para autorizar inscripciones si su situación o la del periodo es incompatible. |

## 3. Inscripciones y movimientos

| ID | Requerimiento | Criterio de aceptación |
| --- | --- | --- |
| RF-016 | El sistema debe registrar directamente una inscripción válida en una oferta, sin etapa previa de solicitud o aprobación. | Una operación aceptada crea una inscripción `ENROLLED` y una rechazada no crea una inscripción parcial. |
| RF-017 | El sistema debe verificar la habilitación del estudiante y la pertenencia del curso a su escuela profesional. | Se rechaza la inscripción de estudiantes no activos o en cursos no asociados a su escuela. |
| RF-018 | El sistema debe comprobar conjuntamente la ventana de inscripción, el estado del periodo, la disponibilidad de la oferta y los cupos. | Una inscripción solo se acepta si todas esas condiciones se cumplen en el momento de registrarla. |
| RF-019 | El sistema debe impedir más de una inscripción vigente de un estudiante en un mismo curso y periodo, incluso si se intenta utilizar otra sección. | Los intentos repetidos o sobre distintas secciones no generan duplicidad vigente. |
| RF-020 | El sistema debe mantener la unicidad y la ocupación de cupos frente a solicitudes simultáneas. | La concurrencia no produce sobrecupos, duplicidades ni movimientos registrados a medias. |
| RF-021 | El sistema debe permitir cancelar una inscripción vigente conforme al momento académico permitido. | La cancelación ordinaria anterior al inicio efectivo del periodo deja la inscripción en `CANCELLED` y libera su cupo; una anulación posterior requiere intervención administrativa extraordinaria. |
| RF-022 | El sistema debe permitir el retiro de una inscripción vigente durante el periodo académico en curso. | El retiro válido registra `WITHDRAWN`, libera cupo y no habilita una reinscripción ordinaria al mismo curso y periodo. |
| RF-023 | El sistema debe permitir cambiar de sección una inscripción vigente dentro de la ventana habilitada. | El cambio conserva la identidad de la inscripción, exige el mismo curso y periodo, verifica cupo en el destino y traslada la ocupación sin resultados intermedios visibles. |
| RF-024 | El sistema debe permitir correcciones administrativas extraordinarias sujetas a autorización y justificación específicas. | Solo personal con autorización de corrección puede efectuarlas, sin alterar arbitrariamente información ajena ni vulnerar la integridad del registro. |
| RF-025 | El sistema debe conservar un historial inalterable de movimientos relevantes de cada inscripción. | Se puede reconstruir su creación, cancelaciones, retiros, cambios de sección y correcciones, con responsable, momento, motivo exigible y datos modificados. |
| RF-026 | El sistema debe gestionar la reinscripción posterior a una cancelación mediante un registro nuevo cuando las condiciones ordinarias vuelvan a cumplirse. | La inscripción cancelada permanece histórica y la nueva inscripción no sobrescribe la anterior. |
| RF-027 | El sistema debe conservar el estado final registrado de cada inscripción cuando se cierre el periodo académico. | El cierre no convierte automáticamente las inscripciones en completadas o aprobadas ni reemplaza sus estados. |
| RF-028 | El sistema debe exigir una justificación para cancelaciones, retiros, cambios de sección y correcciones. | Ninguna de esas operaciones se completa sin motivo; la inscripción inicial ordinaria no lo requiere. |
| RF-029 | El sistema debe ofrecer consultas de inscripciones vigentes e históricas y de sus movimientos. | Puede distinguirse una inscripción `ENROLLED`, `CANCELLED` o `WITHDRAWN` y recuperar su trayectoria sin restaurar registros cerrados. |

## 4. Importación de estudiantes

| ID | Requerimiento | Criterio de aceptación |
| --- | --- | --- |
| RF-030 | El sistema debe recibir importaciones de estudiantes en formatos CSV y XLSX. | Ambos formatos admitidos se procesan bajo las mismas reglas de validación de estudiantes. |
| RF-031 | El sistema debe validar cada fila de forma independiente y procesar los registros válidos aunque existan filas rechazadas. | Una fila inválida no revierte las filas correctas; ninguna fila deja registros parciales. |
| RF-032 | El sistema debe identificar estudiantes existentes y tratarlos como duplicados sin modificarlos. | Un registro duplicado queda reflejado en el resultado y no sobrescribe información estudiantil. |
| RF-033 | El sistema debe identificar la escuela profesional indicada en cada fila mediante su código institucional. | Las filas con códigos desconocidos se rechazan con una observación específica. |
| RF-034 | El sistema debe impedir que una misma cuenta importe dos veces el contenido exacto de un mismo archivo. | El segundo intento sobre el archivo idéntico del mismo usuario se rechaza sin duplicar registros; otros contenidos se evalúan normalmente. |
| RF-035 | El sistema debe ejecutar las importaciones como procesos asíncronos con identificador y seguimiento de estado. | El usuario recibe constancia de aceptación del procesamiento y puede consultar posteriormente su progreso y resultado. |
| RF-036 | El sistema debe conservar el archivo original y un resultado verificable de cada importación admitida. | Quedan disponibles su origen, responsable, cantidades por resultado y observaciones por fila. |

## 5. Consultas y reportes operativos

| ID | Requerimiento | Criterio de aceptación |
| --- | --- | --- |
| RF-037 | El sistema debe proporcionar reportes predefinidos sobre estudiantes y el estado de sus registros. | Se pueden consultar conteos y distribuciones estudiantiles sin incluir calificaciones, rendimiento o avance curricular ni ejecutar consultas arbitrarias proporcionadas por el cliente. |
| RF-038 | El sistema debe proporcionar reportes de cursos, ofertas, secciones, docentes y ocupación. | Se distinguen ofertas existentes, disponibles, completas y su participación docente usando datos operativos consistentes. |
| RF-039 | El sistema debe proporcionar reportes de inscripciones por periodo, escuela profesional, curso, oferta y situación. | Las consultas de actividad exigen un periodo explícito y no mezclan inscripciones vigentes con históricas sin distinguirlas. |
| RF-040 | El sistema debe permitir al personal con autorización de consulta de importaciones acceder al seguimiento y al resultado detallado de cada carga. | `ADMIN` y `SECRETARY`, mediante `students.imports.read`, pueden consultar el estado, las cantidades y las observaciones por fila de una importación; `reports.read` por sí solo no concede ese acceso. |
| RF-041 | El sistema debe restringir los reportes a consultas y filtros predefinidos, en respuestas de datos estructurados. | Los reportes pueden ofrecer indicadores agregados de importaciones, pero no archivos originales ni observaciones por fila; no se admiten consultas libres ni exportaciones documentales de reportes. |

## 6. Usuarios, sesiones y autorizaciones

| ID | Requerimiento | Criterio de aceptación |
| --- | --- | --- |
| RF-042 | El sistema debe permitir a personal autorizado administrar cuentas internas y sus estados. | Las cuentas se crean por administración autorizada; no existe registro público y una cuenta deshabilitada no puede operar. |
| RF-043 | El sistema debe autenticar a los usuarios con correo electrónico y contraseña y mantener sesiones revocables. | Un acceso válido genera sesión y uno inválido no permite acceder a operaciones protegidas. |
| RF-044 | El sistema debe permitir renovar el acceso autenticado y cerrar sesión de forma controlada. | La renovación verifica una sesión vigente; el cierre impide reutilizar credenciales de sesión revocadas. |
| RF-045 | El sistema debe mantener una única sesión activa por cuenta. | Iniciar sesión nuevamente invalida la sesión anterior de la misma cuenta. |
| RF-046 | El sistema debe administrar roles y sus asignaciones a usuarios bajo autorización. | Una cuenta puede tener varios roles y sus autorizaciones efectivas resultan de los permisos vigentes de esos roles. |
| RF-047 | El sistema debe iniciar con roles institucionales diferenciados de administración, coordinación académica, secretaría y consulta de reportes. | Cada rol dispone solo de las capacidades que le corresponden; el rol de consulta de reportes carece de facultades de modificación. |
| RF-048 | El sistema debe permitir administrar roles personalizados sin modificar arbitrariamente los roles base ni el catálogo técnico de permisos. | Los roles base permanecen protegidos y las nuevas asignaciones respetan los permisos existentes. |
| RF-049 | El sistema debe impedir que una persona altere sus propias asignaciones de roles y limitar las correcciones excepcionales de inscripciones a administración. | Las operaciones sensibles solo se aceptan con autorización efectiva y no pueden utilizarse para elevar privilegios propios. |
| RF-050 | El sistema debe permitir restablecer administrativamente contraseñas y exigir el cambio de una contraseña temporal antes de acceder a funciones académicas. | Tras el restablecimiento se invalidan las sesiones anteriores y se restringe el acceso hasta completar el cambio exigido. |
| RF-051 | El sistema debe permitir cambiar la contraseña propia a un usuario autenticado sin concederle facultades de administración sobre otras cuentas. | El cambio autorizado revoca sesiones previas y no implica permiso para modificar otros usuarios. |

## 7. Auditoría y responsabilidad

| ID | Requerimiento | Criterio de aceptación |
| --- | --- | --- |
| RF-052 | El sistema debe registrar acciones administrativas y académicas relevantes con autor, momento y efecto. | Los cambios sensibles en datos, inscripciones, autorizaciones e importaciones pueden examinarse sin depender de logs temporales de aplicación. |
| RF-053 | El sistema debe registrar los eventos relevantes de autenticación y seguridad. | Los intentos de acceso, renovaciones, revocaciones y situaciones de seguridad significativas dejan evidencia adecuada. |
| RF-054 | El sistema debe permitir la consulta autorizada de auditoría sin facultar la modificación o eliminación de sus eventos. | Solo usuarios con autorización de auditoría acceden a los registros y no existen operaciones ordinarias para reescribirlos. |

## Límites funcionales

Los requerimientos no incluyen aprobación de solicitudes de inscripción, listas de espera, autoservicio estudiantil o docente, calificaciones, prerrequisitos, horarios, asistencia, pagos, notificaciones, sincronización institucional automática ni una plataforma general de análisis o exportaciones. La gestión de datos académicos, cuentas y consultas permanece subordinada al proceso de inscripción y a su supervisión.

La numeración `RF` identifica obligaciones estables del producto; no equivale a una secuencia de desarrollo ni a nombres de funcionalidades implementadas.
