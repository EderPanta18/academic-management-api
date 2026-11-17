# Casos de uso

Los casos de uso describen los resultados que un actor autorizado obtiene al interactuar con el sistema. Cada objetivo funcional agrupa únicamente las operaciones expresamente contempladas y sus condiciones observables. Un nombre como mantener o administrar no implica que todos los recursos admitan creación, consulta, modificación, eliminación y restauración.

Los identificadores `CU` permiten distinguir las interacciones y relacionarlas con los requerimientos funcionales. La autorización es una precondición de acceso y no sustituye las validaciones funcionales, obligatorias para cualquier actor autorizado.

## 1. Catálogo de casos de uso

La participación indicada describe las funciones institucionales inicialmente previstas; no constituye una lista exclusiva de roles autorizados. Las operaciones ordinarias dependen de permisos efectivos y condiciones funcionales, aunque estos permisos procedan de varios roles o de un rol personalizado. La función de superadministración también puede ejercer las capacidades ordinarias que tenga expresamente concedidas; no es necesario repetirla en cada operación académica. Las operaciones reservadas mantienen además las restricciones de rol y destinatario definidas en la política de acceso.

| ID        | Caso de uso                                    | Participación institucional inicial                                                            | Resultado esperado                                                                                                                                                                         | Requerimientos                         |
| --------- | ---------------------------------------------- | ---------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | -------------------------------------- |
| **CU-01** | Acceder y administrar la sesión propia         | Todas las cuentas habilitadas                                                                  | Acceso autenticado, renovación y cierre de sesión conforme a su vigencia.                                                                                                                  | RF-043–RF-045                          |
| **CU-02** | Administrar cuentas y roles                    | Administración del sistema y superadministración institucional, según destinatario             | Cuentas registradas, consultadas y vinculadas a personas cuando corresponda; estados, roles y asignaciones gestionados sin autoelevación ni alteración del acceso institucional protegido. | RF-042, RF-046–RF-049                  |
| **CU-03** | Mantener personas y estudiantes                | Administración y secretaría académica                                                          | Identidades y perfiles válidos, sin duplicidades ni cambios documentales prohibidos.                                                                                                       | RF-001, RF-003, RF-004, RF-009         |
| **CU-04** | Mantener estructura y catálogo académico       | Administración y coordinación académica                                                        | Unidades, cursos y asociaciones académicas coherentes con su vigencia.                                                                                                                     | RF-002, RF-006–RF-008                  |
| **CU-05** | Mantener docentes                              | Administración y coordinación académica                                                        | Perfiles docentes con adscripción válida y antecedentes conservados.                                                                                                                       | RF-001, RF-005                         |
| **CU-06** | Administrar periodos académicos                | Administración y coordinación académica                                                        | Periodos, fechas, ventanas y transiciones controlados.                                                                                                                                     | RF-010, RF-011                         |
| **CU-07** | Administrar ofertas de cursos                  | Administración y coordinación académica                                                        | Ofertas, secciones, docentes y capacidades consistentes con su estado.                                                                                                                     | RF-012–RF-015                          |
| **CU-08** | Registrar inscripción                          | Administración y secretaría académica                                                          | Inscripción `ENROLLED` confirmada o rechazo sin efectos parciales.                                                                                                                         | RF-016–RF-020                          |
| **CU-09** | Cancelar inscripción ordinaria                 | Administración y secretaría académica                                                          | Inscripción `CANCELLED`, cupo liberado e historial conservado.                                                                                                                             | RF-021, RF-025–RF-029                  |
| **CU-10** | Retirar una inscripción                        | Administración y secretaría académica                                                          | Inscripción `WITHDRAWN` y restricciones de reinscripción preservadas.                                                                                                                      | RF-022, RF-025, RF-027–RF-029          |
| **CU-11** | Cambiar sección de una inscripción             | Administración y secretaría académica                                                          | Inscripción conservada y ocupación trasladada sin inconsistencias.                                                                                                                         | RF-023, RF-025, RF-028, RF-029         |
| **CU-12** | Corregir inscripción extraordinariamente       | Administración con autorización extraordinaria                                                 | Rectificación delimitada, justificada y trazable.                                                                                                                                          | RF-024, RF-025, RF-028, RF-029         |
| **CU-13** | Importar estudiantes                           | Administración y secretaría académica                                                          | Carga aceptada para procesamiento, con resultados por fila y evidencia recuperable.                                                                                                        | RF-030–RF-036                          |
| **CU-14** | Consultar registros académicos e inscripciones | Administración, secretaría y coordinación académica, según la lectura                          | Datos e historial consultados dentro del ámbito de autorización.                                                                                                                           | RF-003, RF-008, RF-014, RF-025, RF-029 |
| **CU-15** | Consultar reportes operativos                  | Todas las funciones con permiso de reportes                                                    | Reportes predefinidos coherentes y sin efectos de escritura.                                                                                                                               | RF-037–RF-041                          |
| **CU-16** | Consultar auditoría                            | Administración con permiso de auditoría                                                        | Evidencia administrativa y de seguridad consultada sin modificarla.                                                                                                                        | RF-052–RF-054                          |
| **CU-17** | Gestionar contraseñas                          | Titular de la cuenta para cambio propio; administración autorizada para restablecimiento ajeno | Credenciales actualizadas, sesiones anteriores revocadas y cambio temporal exigido cuando corresponda.                                                                                     | RF-050, RF-051                         |

## 2. Acceso y cuentas

### CU-01 — Acceder y administrar la sesión propia

**Objetivo.** Iniciar, renovar y terminar un acceso autenticado.

**Precondiciones.** Cuenta institucional válida para iniciar sesión; sesión vigente para operaciones que la requieran.

**Secuencia funcional.** El usuario presenta sus credenciales; el sistema comprueba su validez y el estado de la cuenta, establece una sesión y revoca la anterior de esa cuenta si existía. Durante la renovación verifica su vigencia y durante el cierre revoca el acceso asociado.

**Alternativas.** Credenciales inválidas, cuenta deshabilitada o sesión revocada impiden completar el acceso; los intentos de entrada incorrectos están sujetos a limitación. Cerrar una sesión ya cerrada no genera un nuevo acceso.

**Resultado.** Existe como máximo una sesión vigente por cuenta y los accesos sin sesión válida no pueden operar.

### CU-02 — Administrar cuentas y roles

**Objetivo.** Mantener cuentas internas y sus facultades de acceso.

**Precondiciones.** Actor autenticado con los permisos de cada operación y, para facultades reservadas, el rol institucional exigido. La autoridad sobre la cuenta destinataria y las asignaciones se comprueba antes de efectuar cambios. Registrar una persona junto con su cuenta requiere autorización tanto para crear personas como para crear cuentas; los roles iniciales exigen además la facultad de asignarlos. La vinculación posterior requiere una cuenta sin persona asociada y una persona existente, vigente y no vinculada a otra cuenta.

**Secuencia funcional.** El administrador registra y consulta cuentas. Puede registrar una cuenta sin persona, asociarla durante el registro a una persona existente o crear conjuntamente la persona y su cuenta. También puede vincular una persona existente a una cuenta inicialmente desvinculada, sin modificar el correo de acceso ni sustituir una asociación previa. Las operaciones conjuntas confirman todas sus altas y asignaciones iniciales de roles, cuando procedan, como un único resultado. El administrador cambia el estado de las cuentas entre `ACTIVE`, `INACTIVE` y `BLOCKED` mediante operaciones autorizadas y justificadas. Consulta roles, catálogo de permisos y asignaciones vigentes, tanto los roles asociados a una cuenta como las cuentas asociadas a un rol, dentro de su autorización de lectura; administra asignaciones también para cuentas deshabilitadas y registra o modifica roles personalizados únicamente con permisos ordinarios reconocidos. La composición de los roles institucionales permanece protegida. Deshabilitar o bloquear una cuenta revoca sus sesiones y la habilitación posterior exige autenticación nueva; administrar sus roles o vincular una persona no altera esa situación.

**Alternativas.** Se rechazan el registro público, las operaciones sobre cuentas fuera de la autoridad del actor, la persona inexistente o no vigente, la persona ya vinculada, la vinculación de una cuenta que ya tiene persona y cualquier intento de modificar el correo o reasignar o retirar la asociación establecida. Se rechazan asimismo los cambios de estado sin autorización o motivo, la modificación de definiciones o asignaciones protegidas, las concesiones fuera del catálogo y los cambios propios o indirectos que eleven los permisos del actor. Un registro conjunto fallido no confirma resultados parciales.

**Resultado.** Cuentas y vinculaciones de identidad consistentes, con atribuciones controladas y sin autoelevación de privilegios.

## 3. Registros y organización académica

### CU-03 — Mantener personas y estudiantes

**Objetivo.** Conservar personas y estudiantes identificables, con información suficiente para comprobar su situación académica.

**Precondiciones.** Cuenta autenticada con los permisos efectivos de la operación; para registrar un estudiante, persona vigente y programa académico vigente.

**Secuencia funcional.** El actor registra o consulta a la persona y actualiza sus datos personales no documentales cuando corresponde. El registro conjunto de persona y perfil estudiantil exige ambos permisos independientes y confirma ambos efectos en una misma operación; el permiso de importación solo habilita crear la persona indispensable dentro del procesamiento admitido, sin conceder registro manual general. El tipo y número de documento se validan al registrar a la persona y no se modifican después. Registra, consulta o actualiza el perfil estudiantil y solicita las transiciones de estado admitidas. La rectificación de un retiro institucional o egreso registrado por error exige acreditar el estado previo y conservar su corrección con motivo y responsable; no constituye readmisión ni modifica inscripciones. El sistema comprueba las identidades, la pertenencia académica y las restricciones aplicables.

**Alternativas.** Se rechazan una combinación documental ya registrada, cualquier intento de modificar el tipo o número de documento después del alta, el código de estudiante duplicado entre vigentes, el programa académico inexistente o no vigente, las rectificaciones terminales sin antecedente comprobable y los cambios incompatibles con antecedentes protegidos.

**Resultado.** Persona y estudiante consultables, con identidad y relaciones válidas; las actualizaciones no reinterpretan inscripciones históricas.

### CU-04 — Mantener estructura y catálogo académico

**Objetivo.** Organizar las unidades académicas, los cursos y las asociaciones que permiten ofrecerlos a los programas académicos.

**Precondiciones.** Cuenta autenticada con el permiso efectivo de la operación concreta.

**Secuencia funcional.** El actor registra, consulta o actualiza facultades, departamentos, programas académicos y cursos, y solicita su baja lógica cuando corresponde. Consulta las categorías institucionales y habilita, consulta o cierra episodios de asociación programa–curso. El sistema comprueba las identidades, la unicidad entre registros vigentes, las referencias necesarias y las dependencias que condicionan cada baja.

**Alternativas.** Se rechaza la duplicidad entre registros vigentes de un atributo sujeto a unicidad, la relación con un recurso padre no vigente y la baja lógica que deje dependencias vigentes incompatibles. La reutilización de un código, sigla o nombre de un registro dado de baja no recupera su identidad anterior. La desasociación de un curso no borra su participación histórica.

**Resultado.** Catálogo coherente y asociaciones vigentes identificables, con identidades históricas permanentes y sin alteración retroactiva de inscripciones.

### CU-05 — Mantener docentes

**Objetivo.** Registrar docentes con facultad de adscripción y habilitar su asignación a ofertas.

**Precondiciones.** Cuenta autenticada con el permiso efectivo correspondiente. El registro de un perfil y las nuevas adscripciones requieren una persona vigente y una facultad vigente; la reincorporación a `ACTIVE` requiere perfil y facultad de adscripción vigentes. La consulta autorizada de un perfil docente sin baja lógica no requiere que su facultad de adscripción continúe vigente.

**Secuencia funcional.** El actor identifica a la persona y registra, consulta o actualiza su perfil docente y adscripción. Cuando se registran conjuntamente persona y perfil docente, se exigen los permisos independientes de ambas capacidades y ambos efectos se confirman indivisiblemente. Cambia su estado únicamente entre `ACTIVE` e `INACTIVE`, o entre `ACTIVE` y `ON_LEAVE`, bajo autorización y comprobación de compromisos operativos. La asignación a ofertas de otras facultades no altera su adscripción.

**Alternativas.** Se rechazan perfiles duplicados, nuevas adscripciones a facultades no vigentes, reincorporaciones sin facultad vigente, transiciones directas entre `INACTIVE` y `ON_LEAVE` y cambios que dejarían ofertas operativas sin docente habilitado. Las asignaciones no se modifican automáticamente. El permiso para mantener docentes no concede por sí solo el permiso independiente para registrar personas.

**Resultado.** Perfil docente coherente y consultable, habilitado para asumir ofertas de cualquier facultad únicamente cuando cumple las condiciones de actividad y adscripción.

### CU-06 — Administrar periodos académicos

**Objetivo.** Organizar los periodos, sus fechas y las condiciones temporales de inscripción.

**Precondiciones.** Cuenta autenticada con el permiso efectivo de la operación; datos y condiciones temporales compatibles con la operación solicitada.

**Secuencia funcional.** El actor registra y consulta periodos, corrige su nombre, código, fechas académicas o ventana de inscripción únicamente cuando el periodo está en `PLANNED`, o solicita una transición de estado admitida. El sistema comprueba la unicidad aplicable, la coherencia temporal y los compromisos académicos confirmados.

**Alternativas.** Se rechazan fechas incoherentes, códigos duplicados entre periodos vigentes, cambios de nombre, código, fechas o ventana fuera de `PLANNED` y transiciones no admitidas. El cierre no modifica automáticamente los estados de las inscripciones.

**Resultado.** Periodo con situación inequívoca y condiciones de admisión de inscripciones consultables.

### CU-07 — Administrar ofertas de cursos

**Objetivo.** Preparar y mantener secciones de cursos con capacidad y responsable docente.

**Precondiciones.** Cuenta autenticada con el permiso efectivo de la operación; curso y periodo válidos; docente válido cuando se asigne y obligatorio para abrir la oferta.

**Secuencia funcional.** El actor registra una oferta con curso y periodo definitivos, consulta su estado y modifica la sección solo mientras está en `DRAFT`. Puede modificar docente y capacidad en `DRAFT`, `OPEN` o `CLOSED`, bajo las condiciones de habilitación, ocupación y preservación histórica. Solicita por separado las transiciones admitidas; el sistema verifica la consistencia de la oferta y sus inscripciones.

**Alternativas.** Se rechazan modificaciones de curso o periodo después de crear la oferta, de sección fuera de `DRAFT`, de atributos en `FINISHED` o `CANCELLED`, de docente sin habilitación o de capacidad inferior a la ocupación. La apertura inicial y la reapertura se rechazan sin docente `ACTIVE` habilitado, fuera de la ventana de inscripción, con un periodo distinto de `OPEN` antes del inicio académico o `IN_PROGRESS` desde ese inicio, o cuando el periodo `OPEN` ya alcanzó el inicio académico. Ninguna transición altera implícitamente las inscripciones.

**Resultado.** Oferta con disponibilidad y ocupación interpretables, sin inconsistencias respecto a las inscripciones que sustenta.

## 4. Inscripción ordinaria y movimientos

### CU-08 — Registrar inscripción

**Objetivo.** Inscribir de manera inmediata a un estudiante elegible en una oferta disponible.

**Precondiciones.** Actor autorizado y autenticado; estudiante registrado y activo; curso asociado al programa académico del estudiante; periodo y oferta habilitados dentro de la ventana de inscripción; plaza disponible; ausencia de otra inscripción `ENROLLED` del mismo curso y periodo **y de un antecedente `WITHDRAWN` de ese mismo estudiante, curso y periodo** que impida reinscripción ordinaria.

**Secuencia funcional.**

1. El actor identifica al estudiante y selecciona una oferta concreta.
2. El sistema comprueba elegibilidad académica, fechas y situaciones operativas.
3. Se comprueba que no exista una inscripción vigente equivalente, incluida otra sección del curso, ni un retiro previo que impida una nueva inscripción ordinaria.
4. Se confirma la disponibilidad y se registra la inscripción con estado `ENROLLED`.
5. Se conserva el movimiento de creación y el actor recibe la confirmación.

**Alternativas.** Si alguna condición falla, el sistema rechaza el registro y comunica la causa funcional; no ocupa cupo ni deja una inscripción parcial. Ante solicitudes simultáneas, solo se aceptan las que puedan mantenerse íntegramente válidas.

**Resultado.** Inscripción identificable, capacidad ocupada exactamente una vez e historial iniciado. No existe etapa `PENDING` ni revisión de aprobación.

### CU-09 — Cancelar inscripción ordinaria

**Objetivo.** Anular una inscripción vigente mientras el periodo permanece en `OPEN`, antes del inicio académico.

**Precondiciones.** Inscripción `ENROLLED`, periodo `OPEN` antes del inicio académico, actor autorizado y motivo registrado.

**Secuencia funcional.** El actor identifica la inscripción, expresa el motivo y solicita la cancelación. El sistema valida el estado `OPEN` del periodo, la fecha de inicio académico y la situación de la inscripción; registra `CANCELLED`, libera la plaza y conserva el movimiento correspondiente.

**Alternativas.** Si el periodo no está en `OPEN` o ya alcanzó el inicio académico, la cancelación ordinaria se rechaza sin transformarse automáticamente en retiro. Una anulación extraordinaria posterior es una corrección administrativa privilegiada, no una ampliación de los permisos ordinarios.

**Resultado.** La inscripción cancelada se mantiene consultable; una nueva inscripción ordinaria requiere crear otro registro y satisfacer todas las condiciones vigentes.

### CU-10 — Retirar estudiante de una inscripción

**Objetivo.** Registrar la retirada académica de una inscripción vigente durante el periodo en curso.

**Precondiciones.** Inscripción `ENROLLED`, periodo académico en desarrollo, actor autorizado y motivo obligatorio.

**Secuencia funcional.** El actor selecciona la inscripción y presenta el motivo del retiro; el sistema verifica las condiciones, registra `WITHDRAWN`, libera el cupo y conserva el movimiento.

**Alternativas.** Se rechaza el retiro ordinario fuera de su momento académico, sobre una inscripción no vigente o sin justificación. No se reabre la inscripción mediante una operación ordinaria.

**Resultado.** Se conserva una retirada histórica que impide la reinscripción ordinaria del mismo estudiante al curso durante ese periodo, aunque la plaza liberada pueda utilizarse por otro estudiante cuando aún se admitan inscripciones.

### CU-11 — Cambiar sección

**Objetivo.** Trasladar una inscripción vigente a otra oferta del mismo curso y periodo.

**Precondiciones.** Actor autorizado; inscripción `ENROLLED`; ventana vigente; oferta de origen y destino compatibles y habilitadas; capacidad en el destino; motivo obligatorio.

**Secuencia funcional.** El actor identifica la inscripción y el destino. El sistema comprueba que ambas ofertas representen el mismo curso y periodo, valida la nueva capacidad y sustituye la oferta de la inscripción en una operación indivisible. Se conserva el movimiento con origen, destino, responsable y motivo.

**Alternativas.** Se rechaza un destino sin cupo, de otro curso o periodo, o un cambio fuera de la ventana ordinaria. Una falla no debe dejar el cupo liberado sin traslado ni registrar doble ocupación.

**Resultado.** Se mantiene la identidad de la inscripción y el estado `ENROLLED`; cambia la oferta vigente, no se crea una segunda inscripción.

### CU-12 — Corrección administrativa extraordinaria

**Objetivo.** Rectificar excepcionalmente una inscripción o un movimiento académico que no puede resolverse mediante una operación ordinaria.

**Precondiciones.** Actor autenticado con el permiso reservado de corrección extraordinaria y pertenencia a un rol administrativo institucional protegido; inscripción identificada, motivo obligatorio y cambio circunscrito al ámbito de las inscripciones.

**Secuencia funcional.**

1. El administrador identifica la inscripción, la situación incorrecta y la rectificación solicitada.
2. El sistema verifica que se trate de una **anulación excepcional fuera del plazo ordinario**, un **cambio de sección extemporáneo** dentro del mismo curso y periodo o una **rectificación justificada de un error administrativo en la inscripción o su movimiento**.
3. Se comprueba que la rectificación no supere cupos, genere una inscripción duplicada, cambie el curso o periodo por sustitución arbitraria ni elimine antecedentes históricos.
4. Se confirma el efecto admitido junto con el motivo, el responsable, el nuevo movimiento histórico y la evidencia de auditoría como una unidad.

**Alternativas.** Se rechaza una actuación que exceda estas finalidades, carezca de motivo, intente sobrescribir o eliminar movimientos anteriores, vulnere integridad académica o utilice la corrección como reinscripción ordinaria encubierta tras un retiro. La corrección de un movimiento registrado por error exige preservar tanto el hecho original como su rectificación.

**Resultado.** Situación excepcional rectificada y trazable, sin conceder facultad para alterar libremente datos personales, cursos, periodos o el historial acumulado.

## 5. Importación y consultas académicas

### CU-13 — Importar estudiantes

**Objetivo.** Incorporar lotes de estudiantes sin suspender la atención interactiva ni sobrescribir estudiantes existentes.

**Precondiciones.** Cuenta autenticada con permiso de importación para la carga; archivo CSV o XLSX recibido, con origen y responsable identificados. La consulta posterior requiere `students.imports.read`.

**Secuencia funcional.**

1. El actor entrega el archivo.
2. El sistema rechaza una repetición exacta ya importada por la misma cuenta o acepta la nueva carga con identificador de seguimiento.
3. El procesamiento evalúa individualmente las filas y reconoce los programas académicos por sus códigos institucionales.
4. Cada fila válida puede incorporarse sin depender de las filas rechazadas; estudiantes existentes se clasifican como duplicados y no se modifican.
5. El actor con `students.imports.read` consulta el resultado con cantidades, observaciones por fila y evidencia de la carga.

**Alternativas.** Se rechazan archivos no admitidos o cargas idénticas del mismo usuario. Una fila inválida no cancela las filas correctas. Una falla general del procesamiento permanece visible en el seguimiento y no convierte resultados parciales en éxito completo.

**Resultado.** El usuario conoce el resultado de la importación y el archivo original queda conservado con su historial de procesamiento.

### CU-14 — Consultar registros académicos e inscripciones

**Objetivo.** Examinar registros y antecedentes pertinentes a la responsabilidad del actor.

**Precondiciones.** Sesión válida y permiso específico de lectura sobre el recurso solicitado.

**Secuencia funcional.** El actor consulta catálogos, estudiantes, ofertas, inscripciones o sus movimientos según sus permisos. El sistema aplica los filtros autorizados y distingue datos vigentes e históricos cuando procede.

**Alternativas.** La ausencia del permiso del recurso impide su consulta directa, aunque el actor pueda consultar reportes. Un actor limitado a reportes no adquiere lectura general de estudiantes ni del historial de movimientos individuales.

**Resultado.** Información consultada sin alterar estados, cupos ni antecedentes.

### CU-15 — Consultar reportes operativos

**Objetivo.** Supervisar la operación mediante informes de consulta predefinidos.

**Precondiciones.** Actor autenticado con `reports.read` y filtros válidos; periodo explícito cuando el reporte corresponda a ofertas o inscripciones.

**Secuencia funcional.** El actor selecciona el reporte y sus filtros admitidos. El sistema devuelve datos estructurados sobre estudiantes, cursos, ofertas, docentes, inscripciones o indicadores agregados de importaciones. Los indicadores agregados de importaciones forman parte de los reportes predefinidos; el acceso a un archivo individual, sus filas u observaciones requiere la autorización específica de importaciones.

**Alternativas.** Se rechazan filtros no admitidos o ausencia de periodo obligatorio. El permiso `reports.read` no habilita consultar el archivo de una importación, sus observaciones por fila, el seguimiento de una carga individual ni los eventos de auditoría.

**Resultado.** Reporte disponible sin modificar registros ni ampliar los permisos de consulta a recursos subyacentes.

## 6. Auditoría y credenciales

### CU-16 — Consultar auditoría

**Objetivo.** Examinar evidencias relevantes de acciones académicas, administrativas y de seguridad.

**Precondiciones.** Actor autenticado con el permiso reservado de consulta de auditoría y pertenencia a un rol administrativo institucional protegido.

**Secuencia funcional.** El administrador solicita los eventos pertinentes con filtros autorizados. El sistema entrega información que permita atribuir acciones a responsables y momentos, separada del historial de movimientos de inscripciones.

**Alternativas.** Se rechaza una lectura sin autorización; la consulta no permite modificar ni eliminar eventos de auditoría.

**Resultado.** Evidencia disponible para examen administrativo sin alteración de su contenido.

### CU-17 — Gestionar contraseñas

**Objetivo.** Cambiar la contraseña propia o restablecer administrativamente la de otra cuenta.

**Precondiciones.** Para el cambio propio, sesión válida y acreditación de la contraseña vigente. Para el restablecimiento ajeno, permiso administrativo reservado y autoridad suficiente sobre la cuenta destinataria; en ambos casos, cuenta identificada.

**Secuencia funcional.** Para cambiar la propia contraseña, el titular acredita la vigente y establece otra. En el restablecimiento ajeno, el actor administrativo autorizado genera una contraseña temporal para una cuenta comprendida en su autoridad: la administración ordinaria solo alcanza cuentas no administrativas y la superadministración puede intervenir sobre otras cuentas administrativas, excepto la cuenta superior protegida. Todo cambio o restablecimiento válido revoca las sesiones anteriores. La contraseña temporal se entrega protegida y una sola vez al actor que autorizó el restablecimiento; su titular debe sustituirla antes de acceder a funciones académicas.

**Alternativas.** Se rechaza el cambio propio sin acreditar la contraseña vigente, el restablecimiento sin permiso o fuera del ámbito de administración del actor y cualquier restablecimiento administrativo de la cuenta institucional superior protegida. Una contraseña temporal no habilita operaciones académicas antes de sustituirla.

**Resultado.** Credenciales actualizadas y accesos anteriores revocados, sin conceder facultades administrativas adicionales al titular.

## 7. Reglas de lectura del catálogo

Los casos de uso expresan **resultados observables**. No determinan la cantidad de controladores, servicios o transacciones internas. Cada operación contemplada tiene un propósito funcional y una autorización; no se derivan operaciones adicionales del nombre del caso de uso, del módulo o de su representación persistente. Las condiciones que implican simultaneidad, estados o integridad describen el comportamiento que debe garantizarse, sin imponer un mecanismo técnico particular.

Los movimientos ordinarios y las correcciones extraordinarias son intenciones distintas, aun cuando afecten una misma inscripción. Tampoco se equipara la aceptación de un archivo para importación con la finalización exitosa de su procesamiento.
