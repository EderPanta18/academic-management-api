# Reglas de negocio

Las siguientes reglas expresan condiciones **obligatorias** para reconocer una estructura académica válida, aceptar inscripciones y conservar antecedentes. Se aplican con independencia de quién inicie la operación o de la forma técnica de exponerla. Una autorización habilita a solicitar una operación, pero **no suspende las reglas de integridad académica**.

Los identificadores `RN` distinguen reglas estables. No representan nombres de funciones, verificaciones individuales de una API ni un orden de ejecución. La existencia de una regla de vigencia, baja o unicidad no habilita por sí sola una operación de mantenimiento sobre todos los recursos afectados; las operaciones admitidas se delimitan funcionalmente.

## 1. Identidad y organización académica

**RN-001 — Identidad personal no duplicada.** Cada persona se identifica mediante una combinación de tipo y número de documento única globalmente, con independencia de su baja lógica. Ambos valores se validan al registrar a la persona y no pueden modificarse después ni reasignarse a otra. Las modificaciones permitidas de otros datos personales no cambian esa identidad. Los perfiles de estudiante, docente y usuario vinculados comparten la identidad de la persona y no la duplican.

**RN-002 — Perfiles no intercambiables.** Cada estudiante y docente corresponde a una persona existente; una misma persona puede desempeñar ambos perfiles. La condición de estudiante, docente o persona no concede automáticamente acceso a una cuenta.

**RN-003 — Unidades institucionales diferenciadas.** Cada programa académico y cada departamento académico pertenece a una facultad. Todo docente está adscrito a una facultad y cada estudiante pertenece a un programa académico. La facultad dispone de una sigla institucional y un nombre como atributos de identificación operativa; no utiliza un código institucional adicional.

**RN-004 — Propiedad de los cursos.** Cada curso pertenece a un solo departamento académico. Su código es único entre cursos vigentes de la universidad; no se crean cursos equivalentes por programa académico para representar una materia compartida.

**RN-005 — Elegibilidad por asociación.** Un programa académico habilita la inscripción en un curso únicamente durante un episodio vigente de su asociación con él. Los episodios del mismo par no se superponen; una nueva habilitación crea otro episodio sin reescribir el anterior. La elegibilidad no se infiere de la facultad a la que pertenecen el programa y el departamento.

**RN-006 — Docencia entre facultades.** Una oferta puede asignarse a un docente `ACTIVE` de otra facultad. La adscripción del docente no altera el departamento propietario del curso ni la elegibilidad por programa académico. Las transiciones del docente solo se admiten entre `ACTIVE` e `INACTIVE`, o entre `ACTIVE` y `ON_LEAVE`; los otros dos estados no transitan directamente entre sí. Al perder la habilitación, las ofertas con obligaciones docentes protegidas deben contar previamente con un responsable habilitado; el cambio de estado no reasigna ni modifica ofertas automáticamente. La reincorporación a `ACTIVE` exige una facultad vigente y no restituye asignaciones anteriores.

**RN-007 — Clasificación homogénea.** Un curso pertenece a una categoría de formación `GENERAL`, `DISCIPLINARY` o `SPECIALIZED`. No se incorporan al mismo catálogo valores que expresen modalidad de dictado o condición de electivo.

**RN-008 — Vigencia sin destrucción histórica.** Dar de baja lógicamente una persona, perfil, unidad o curso, cuando la entidad admita esa operación, impide nuevas relaciones que requieran su vigencia, pero no borra ni reinterpreta inscripciones o actuaciones anteriores. Una desasociación conserva sus episodios históricos. Los valores de negocio reutilizados no modifican el significado de una referencia anterior.

**RN-009 — Cambios estructurales compatibles.** No se permite cerrar un episodio programa–curso si existen inscripciones `ENROLLED` admitidas bajo ese programa y curso durante periodos no cerrados. Tampoco se permite cambiar el programa académico actual de un estudiante si ello dejaría inválidas inscripciones `ENROLLED` de periodos operativos. Los registros históricos permanecen atribuidos al programa académico con el que se aceptaron.

**RN-010 — Recursos referenciados.** La baja lógica se rechaza si el recurso todavía es necesario para una relación operativa vigente o para cumplir un compromiso académico protegido. La existencia de una clave foránea, de un registro no eliminado o de un estado denominado activo no basta, por sí sola, para decidir el bloqueo. Se evalúa la función de cada relación:

- **Estructura académica:** una facultad no puede darse de baja mientras conserve departamentos o programas académicos vigentes que requieran su pertenencia institucional. Un departamento no puede darse de baja mientras conserve cursos vigentes que dependan de él.
- **Programas y cursos:** bloquean la baja las asociaciones programa–curso todavía habilitantes y las relaciones actuales necesarias para estudiantes, ofertas o inscripciones con obligaciones operativas pendientes. Los episodios de asociación cerrados permanecen como antecedentes.
- **Perfiles y adscripciones:** un estudiante habilitado requiere un programa vigente; un docente con actividad docente habilitada requiere una facultad vigente. Un docente `INACTIVE` sin ofertas operativas ni otros compromisos pendientes no bloquea, por su sola adscripción, la baja de la facultad. La misma distinción entre situación funcional y obligación protegida se aplica a los demás perfiles.
- **Ofertas e inscripciones:** se preservan los recursos necesarios para ofertas que todavía puedan prepararse, abrirse o reabrirse y para inscripciones `ENROLLED` ligadas a periodos con obligaciones académicas operativas. Las ofertas finalizadas o canceladas, las inscripciones históricas y los movimientos inmutables no bloquean por su mera referencia.

Las relaciones funcionalmente vigentes de estas clases se comprueban incluso cuando su entidad no utiliza `deletedAt`. Una baja admitida no elimina ni modifica dependientes en cascada y conserva los UUID y las referencias históricas. Las nuevas altas y vinculaciones operativas exigen los recursos padres vigentes que correspondan. Esta regla no habilita operaciones de baja para entidades cuyo alcance funcional no las contemple.

## 2. Periodos académicos y ofertas

**RN-011 — Fechas válidas del periodo.** Cada periodo tiene fechas ordenadas de inicio y término académico y una ventana de inscripción obligatoria, también ordenada, cuyo final no excede el término académico. El nombre, el código, las fechas académicas y la ventana de inscripción solo pueden corregirse en `PLANNED`, mediante una operación autorizada que preserve la unicidad aplicable, la coherencia temporal y los compromisos académicos ya confirmados. Los estados `OPEN`, `IN_PROGRESS`, `CLOSED` y `CANCELLED` no admiten edición ordinaria de esos atributos. El límite temporal restringe nuevas inscripciones, no la conservación histórica de las existentes.

**RN-012 — Periodo habilitado para inscribir.** Se admiten inscripciones ordinarias únicamente cuando la fecha institucional actual pertenece, inclusive, a la ventana de inscripción y es coherente con el estado del periodo: `OPEN` habilita antes de la fecha de inicio académico e `IN_PROGRESS` habilita desde esa fecha. Si se alcanza el inicio académico y el periodo permanece en `OPEN`, se rechazan nuevas inscripciones hasta que una transición explícita y autorizada lo sitúe en `IN_PROGRESS`; el paso del tiempo no modifica el estado automáticamente. Los estados `PLANNED`, `CLOSED` y `CANCELLED` no habilitan inscribir.

**RN-013 — Oferta identificable.** Una oferta pertenece a un solo curso y periodo, que no pueden cambiar tras su creación. La combinación de curso, periodo y sección es única entre todas las ofertas registradas, independientemente de su estado. La cancelación o finalización de una oferta no libera esa combinación para otra oferta. La sección solo puede corregirse en `DRAFT`, siempre que la nueva combinación no esté registrada. La capacidad máxima es positiva. El docente y la capacidad solo se pueden ajustar en `DRAFT`, `OPEN` o `CLOSED`, verificando la habilitación docente, las obligaciones académicas y la ocupación, con conservación de la trazabilidad. `FINISHED` y `CANCELLED` no admiten modificaciones ordinarias de configuración.

**RN-014 — Docente antes de apertura.** Una oferta `OPEN` debe tener un docente `ACTIVE` asignado y habilitado. En `DRAFT` puede faltar el docente; una oferta `CLOSED` conserva los compromisos y antecedentes docentes asociados y solo admite una reasignación justificada a otro docente habilitado. La reasignación no reescribe la historia de responsables anteriores ni altera las inscripciones.

**RN-015 — Oferta habilitada para inscribir.** La inscripción ordinaria requiere que la oferta esté `OPEN`. Una oferta con capacidad completa puede continuar en estado `OPEN`, pero no admite nuevas plazas mientras su ocupación alcance el máximo. La reapertura de una oferta `CLOSED` también exige que el estado del periodo y la fecha institucional sean coherentes para operar dentro de la ventana de inscripción; no se admite la reapertura con un periodo `OPEN` cuyo inicio académico ya se alcanzó.

**RN-016 — No reducir cupos ocupados.** La capacidad máxima no puede establecerse por debajo del número de inscripciones `ENROLLED` de la oferta.

**RN-017 — Cancelación sin inscripciones vigentes.** No se cancela un periodo u oferta que conserve inscripciones `ENROLLED` vinculadas. Antes debe resolverse justificadamente la situación de esas inscripciones mediante operaciones válidas; una cancelación del contenedor no las anula automáticamente.

**RN-018 — Cierre sin mutación implícita.** Cerrar un periodo u oferta impide nuevas operaciones ordinarias que dependan de su apertura, pero **no** cambia por sí solo el estado de las inscripciones asociadas ni crea resultados académicos.

## 3. Admisión de inscripciones

**RN-019 — Habilitación del estudiante.** Solo un estudiante en estado `ACTIVE`, vigente y con programa académico válido puede obtener una nueva inscripción ordinaria. Un retiro institucional o egreso estudiantil registrado erróneamente solo puede rectificarse hacia el estado inmediatamente anterior comprobado (`ACTIVE` o `INACTIVE`), con autorización para modificar el estado estudiantil, motivo verificable y evidencia del cambio. No reabre inscripciones ni habilita readmisión institucional.

**RN-020 — Inscripción directa.** Cuando se cumplen todas las condiciones, se crea una inscripción en estado `ENROLLED`, sin estados intermedios de solicitud, espera o aprobación. Una operación rechazada no crea inscripción ni consume cupo.

**RN-021 — Curso correspondiente al programa académico.** El programa académico del estudiante debe mantener asociación vigente con el curso de la oferta elegida al momento de registrar la inscripción. Una oferta puede recibir estudiantes de distintos programas académicos elegibles y todos utilizan la misma capacidad.

**RN-022 — Unicidad entre secciones.** Un estudiante no puede conservar dos inscripciones `ENROLLED` para un mismo **curso y periodo**. Cambiar el identificador de sección no crea una excepción.

**RN-023 — Efecto histórico de retiro.** Un retiro auténtico cuyos efectos continúan vigentes bloquea otra inscripción **ordinaria** del mismo estudiante en el mismo curso y periodo, aunque haya liberado plaza. Un retiro registrado por error y rectificado conserva el movimiento histórico, pero no conserva ese efecto impeditivo.

**RN-024 — Cupo disponible real.** Se acepta una nueva inscripción únicamente si las inscripciones `ENROLLED` de la oferta, incluida la operación solicitada, no superan su capacidad máxima. La comprobación debe seguir siendo válida bajo operaciones concurrentes.

**RN-025 — Nueva identidad tras cancelación.** Una inscripción `CANCELLED` no se reactiva por operación ordinaria. Si vuelven a cumplirse todas las condiciones, la nueva inscripción crea otro registro y conserva intacto el antecedente cancelado.

**RN-026 — Contexto académico histórico.** La inscripción preserva el programa académico de admisión y las identidades del curso y periodo, aunque el programa actual del estudiante o la vigencia de la asociación cambien después. La comprobación histórica utiliza el episodio válido en el instante de admisión, sin atribuirle retroactivamente otro episodio. Una corrección no puede ocultar incoherencias de registros vigentes.

## 4. Cancelación, retiro y cambio de sección

**RN-027 — Cancelación ordinaria previa al inicio.** Una inscripción `ENROLLED` puede pasar a `CANCELLED` ordinariamente **antes de la fecha efectiva de inicio del periodo**, con el periodo en `OPEN`. Exige actor autorizado y motivo.

**RN-028 — Retiro durante el desarrollo.** Una inscripción `ENROLLED` puede pasar ordinariamente a `WITHDRAWN` durante el desarrollo académico, con periodo `IN_PROGRESS` y fecha comprendida entre inicio y fin del periodo. Exige actor autorizado y motivo. No depende de que la ventana de nuevas inscripciones continúe abierta.

**RN-029 — Estados terminales ordinarios.** `CANCELLED` y `WITHDRAWN` no retornan a `ENROLLED` ni transitan uno al otro mediante operaciones ordinarias. Las rectificaciones justificadas no son una transición libre para reinscribir a quien se retiró.

**RN-030 — Liberación de ocupación.** Cancelar o retirar elimina a la inscripción del conteo de plazas ocupadas. Una plaza liberada solo puede ser utilizada para una nueva inscripción si el periodo, la oferta y la ventana vigente siguen habilitándola.

**RN-031 — Traslado conservando identidad.** Un cambio de sección requiere inscripción `ENROLLED`, motivo, ventana abierta, periodo cuyo estado sea coherente con la fecha institucional conforme a la habilitación ordinaria y ofertas de origen y destino `OPEN`. El destino debe ser **otra oferta del mismo curso y periodo**, con capacidad disponible. La inscripción mantiene su identidad y su estado. Si la fecha de inicio académico ya llegó y el periodo sigue `OPEN`, se rechaza el traslado hasta que se confirme la transición autorizada a `IN_PROGRESS`.

**RN-032 — Traslado indivisible.** La actualización de la oferta actual, la ocupación de origen y destino y el movimiento histórico deben confirmarse como una unidad. Si alguna parte falla, la inscripción conserva íntegramente su sección anterior.

**RN-033 — Motivos exigidos.** El motivo es obligatorio en cancelación, retiro, cambio de sección y corrección extraordinaria; no es obligatorio al crear una inscripción válida ordinaria.

## 5. Corrección extraordinaria e historial

**RN-034 — Autoridad excepcional restringida.** Solo un usuario con autorización administrativa específica puede corregir extraordinariamente inscripciones. El alcance se limita a una anulación excepcional, un traslado extemporáneo dentro del mismo curso y periodo, o la rectificación verificable de errores administrativos de inscripción y movimientos.

**RN-035 — Corrección sin atajos.** Una corrección no puede cambiar arbitrariamente de estudiante, curso o periodo, sustituir referencias por registros incompatibles, producir duplicados vigentes, superar cupos ni transformar un retiro auténtico en una reinscripción ordinaria encubierta.

**RN-036 — Rectificación histórica, no eliminación.** Si un estado o movimiento se registró por error, la rectificación conserva el hecho original y agrega evidencia de la corrección, incluyendo el motivo y los valores afectados. Toda corrección aceptada conserva integridad de la inscripción y evidencia de auditoría en la misma operación.

**RN-037 — Historial de solo inserción.** Toda creación y movimiento efectivo de inscripción genera un registro histórico propio con tipo, responsable, fecha y diferencias pertinentes. No se editan ni borran movimientos anteriores. Una operación rechazada no se registra como movimiento académico completado.

**RN-038 — Cierre conserva estados.** El cierre de un periodo no convierte `ENROLLED` en una categoría ficticia de curso terminado. `CANCELLED` y `WITHDRAWN` permanecen históricamente identificables.

## 6. Importaciones, consultas y acceso

**RN-039 — Aislamiento por fila.** Una importación de estudiantes incorpora cada fila válida sin depender del éxito de las demás. Una fila rechazada no deja un estudiante o persona parcialmente creados; una fila duplicada no sobrescribe al estudiante existente.

**RN-040 — Programa académico identificable para importar.** Toda fila incorporada debe referirse a un programa académico existente y vigente, identificado por su código institucional. Un código desconocido provoca rechazo de esa fila, no una asignación inferida.

**RN-041 — Archivo no repetido por cuenta.** Se rechaza la segunda presentación del contenido binario idéntico por el mismo usuario, identificada mediante su hash SHA-256. El archivo admitido y sus resultados se conservan para consulta autorizada.

**RN-042 — Reportes sin ampliar permisos.** Los reportes predefinidos incluyen indicadores agregados de importaciones, pero no exponen por ese solo permiso archivos originales, seguimiento individual, observaciones por fila ni eventos de auditoría. Los reportes de ofertas e inscripciones requieren periodo académico explícito.

**RN-043 — Autorización no reemplaza integridad.** El acceso ordinario depende de los permisos efectivos obtenidos como unión de los permisos vigentes de todos los roles de la cuenta, sin herencia entre roles; su nombre institucional o personalizado no sustituye la comprobación. Las facultades de administración de cuentas y autorizaciones, corrección extraordinaria de inscripciones y consulta transversal de auditoría requieren además el rol protegido `ADMIN`. La autorización excepcional no elimina restricciones de identidad, unicidad, capacidad o preservación histórica. Ningún cambio administrativo de estado o asignación puede dejar al sistema sin una cuenta `ACTIVE` que posea el rol protegido `ADMIN` y los permisos reservados de gestión de cuentas y asignaciones definidos por el catálogo.

## 7. Invariantes transversales

**RN-044 — Unicidad operativa de registros con baja lógica.** En las entidades que admiten baja lógica, la unicidad de los atributos de negocio reutilizables, individuales o combinados, se exige entre registros no eliminados lógicamente. Los registros dados de baja no reservan esos valores para nuevas identidades. Los nombres, códigos, siglas y correos electrónicos sujetos a unicidad se comparan sin distinguir mayúsculas ni minúsculas y sin considerar espacios exteriores; se conservan los acentos y espacios interiores sin aplicar equivalencias adicionales. Esta comparación se utiliza al registrar, modificar y comprobar la restricción persistente, en el ámbito de unicidad correspondiente a cada atributo. Las siglas y los nombres de las facultades están sujetos a esta regla. El tipo y número de documento personal registrados forman una identidad única e inmutable, reservada globalmente incluso tras la baja lógica, sin excepciones por errores declarados con posterioridad ni posibilidad de reutilización. Las identidades permanentes, las relaciones de cardinalidad obligatoria y las garantías de evidencia histórica conservan sus restricciones propias. Reutilizar un valor de negocio no sustituye las referencias al registro anterior. Un estado funcional como `CANCELLED`, `WITHDRAWN` o `INACTIVE` no equivale a una baja lógica.

Las operaciones de inscripción, retiro, cancelación, cambio de sección y rectificación deben preservar conjuntamente:

- **Existencia referencial:** todas las identidades vinculadas corresponden a registros válidos y conservables.
- **Ausencia de duplicados vigentes:** como máximo una inscripción `ENROLLED` por estudiante, curso y periodo.
- **Capacidad acotada:** ninguna oferta tiene más inscripciones `ENROLLED` que plazas máximas.
- **Movimientos íntegros:** cada cambio aceptado tiene su hecho histórico; ninguno se graba a medias.
- **Atribución:** los movimientos y correcciones tienen actor y momento identificables.
- **Preservación histórica:** no se reescriben o pierden decisiones registradas con anterioridad.

Una solicitud que no pueda conservar todas estas propiedades **debe rechazarse sin efectos académicos parciales**.
