# Verificación funcional y de contratos

Las pruebas funcionales demuestran que cada intención permitida produce su efecto completo y que una intención incompatible se rechaza **sin modificar el estado de manera indebida**. Las pruebas de contrato examinan cómo esos resultados se representan en la API; no redefinen las reglas de negocio ni duplican el inventario de operaciones HTTP.

## 1. Cobertura funcional por capacidades

| Área y cobertura | Escenarios que debe distinguir la evidencia |
| --- | --- |
| Identidades y catálogos (`RF-001`–`RF-009`) | Identidad documental compartida sin duplicación; unicidad de códigos; relaciones entre facultades, departamentos, programas académicos, docentes y cursos; asociación programa–curso; deshabilitación sin destruir referencias históricas; catálogo fijo de tipos de documento. |
| Periodos y ofertas (`RF-010`–`RF-015`) | Ventana y fechas frontera en `America/Lima`; regularización expresa y autorizada de un periodo `PLANNED` atrasado mediante `PLANNED → OPEN → IN_PROGRESS`, sin transiciones automáticas; rechazo de inscripción, cambio de sección y reapertura de oferta durante el `OPEN` atrasado; oferta vinculada a periodo, curso, sección y docente; apertura solo con docente; identidad histórica de oferta y capacidad correctas. |
| Inscripciones (`RF-016`–`RF-029`) | Elegibilidad completa, cupo, unicidad por curso/periodo entre secciones, cancelación, retiro, cambio de sección, corrección privilegiada, motivos, historial y conservación al cerrar el periodo. |
| Importaciones (`RF-030`–`RF-036`) | CSV/XLSX; transiciones `PENDING`, `PROCESSING`, `COMPLETED`, `COMPLETED_WITH_ERRORS` y `FAILED`; archivo original y seguimiento; filas incorporadas, duplicadas, rechazadas y no procesadas; código de programa académico; mismo archivo/usuario rechazado y archivo idéntico de otra cuenta tratado como una solicitud independiente. |
| Reportes (`RF-037`–`RF-041`) | Consultas predefinidas sobre estudiantes, cursos, ofertas, ocupación e inscripciones; filtros y periodo exigible; indicadores agregados de importaciones y detalle restringido; ausencia de consultas libres o exportaciones ajenas al alcance. |
| Cuentas y permisos (`RF-042`–`RF-051`) | Cuenta administrada, sesiones revocables, sesión única, rotación, roles institucionales y personalizados, prohibición de autoasignación, corrección exclusivamente administrativa y cambios de contraseña con revocación. |
| Auditoría (`RF-052`–`RF-054`) | Atribución de actuaciones y eventos de seguridad; consulta restringida; imposibilidad de editar o eliminar evidencia por vías ordinarias. |

Las condiciones del dominio se prueban con combinaciones significativas, no con el producto cartesiano de todos los campos. Se priorizan transiciones entre estados, límites de tiempo, recursos relacionados e intentos de eludir una prohibición mediante un mecanismo alternativo.

## 2. Inscripciones y cambios de estado

La verificación del ciclo del periodo contempla también la **apertura administrativa tardía**: si ya comenzó el desarrollo académico y el periodo sigue en `PLANNED`, un actor autorizado puede realizar `PLANNED → OPEN` y después `OPEN → IN_PROGRESS` mediante acciones separadas. Se comprueba que la primera transición no habilita inscripciones, traslados ni reaperturas de ofertas, que no se produce ninguna transición automática y que, después de la segunda, las operaciones solo se admiten si siguen vigentes sus ventanas y demás condiciones. Se rechazan las transiciones ejecutadas sin autorización.

La prueba de inscripción ordinaria confirma que una admisión válida crea un registro `ENROLLED`, ocupa exactamente una plaza y produce sus efectos históricos. Comprueba que `OPEN` solo habilita antes del inicio académico y `IN_PROGRESS` desde ese inicio, en ambos casos dentro de la ventana; si la transición quedó atrasada, la fecha no concede permiso implícito para inscribir ni cambia automáticamente el estado. La misma intención se rechaza si el estudiante no está `ACTIVE`, el curso no mantiene una asociación vigente con su programa académico, la ventana está cerrada, la oferta no admite inscripciones o no queda cupo. Se comprueba asimismo que el cambio de sección ordinario y la reapertura de una oferta `CLOSED` se rechazan sin efectos cuando el periodo continúa en `OPEN` desde su inicio académico, y que vuelven a ser evaluables tras la transición explícita y autorizada a `IN_PROGRESS` si la ventana y las demás condiciones continúan vigentes.

| Escenario | Resultado verificable |
| --- | --- |
| Inscripción repetida en el mismo curso y periodo, incluso cambiando de sección | Existe como máximo una inscripción `ENROLLED` de ese estudiante para el curso y periodo; no se reserva una segunda plaza. |
| Cancelación ordinaria antes del inicio | Estado `CANCELLED`, plaza liberada, motivo y movimiento conservados. |
| Reinscripción después de `CANCELLED` con condiciones vigentes | Se crea una inscripción nueva; la cancelada permanece como antecedente. |
| Retiro durante el periodo en curso | Estado `WITHDRAWN`, plaza liberada, motivo registrado y prohibición de reinscripción ordinaria al mismo curso y periodo mientras el retiro sea auténtico. |
| Retiro registrado por error y rectificado por administración | El movimiento original permanece en el historial y la corrección vinculada deja sin efecto el retiro erróneo; la decisión posterior no aplica un bloqueo ficticio y tampoco crea por sí sola otra inscripción. |
| Retiro real presentado como supuesto error | La corrección no invalida el bloqueo ni facilita una nueva inscripción ordinaria; las acciones rechazadas no modifican el historial. |
| Cambio de sección permitido | Se conserva la identidad de la inscripción y la ocupación se traslada de forma indivisible al destino válido. |
| Cambio a otro curso/periodo o sección sin plaza | Rechazo sin alterar inscripción, cupos ni historial con un movimiento ficticio. |
| Cierre de periodo con inscripciones históricas | Se conservan `ENROLLED`, `CANCELLED` o `WITHDRAWN` tal como quedaron, sin generar estados académicos inexistentes. |
| Corrección extraordinaria sin autorización o motivo | Rechazo sin efecto; un administrador autorizado conserva antecedentes y evidencia de la rectificación admitida. |

Las pruebas de concurrencia que acompañan estas operaciones se evalúan separadamente con almacenamiento real, porque la verificación funcional secuencial no demuestra exclusión entre escrituras simultáneas. También se comprueba que cerrar y volver a habilitar la asociación programa–curso genere episodios de vigencia distintos y que una inscripción histórica permita reconstruir inequívocamente el episodio vigente al admitirse, a partir del programa académico de admisión, el curso y el momento de admisión, sin exigir una referencia directa almacenada al episodio.

## 3. Contratos HTTP y validación

Con Supertest se ejerce el adaptador REST bajo el prefijo `/api/v1` y se contrasta su comportamiento con OpenAPI generado a partir de los contratos ejecutables.

- Las respuestas JSON con cuerpo incluyen `success`, `statusCode`, `timestamp` y `path`. El éxito se representa con `success: true` y `data`, sin un objeto `error` ficticio; el fallo se representa con `success: false` y `error` estructurado, con `code`, `message` y únicamente los detalles permitidos, sin `data` de éxito. `message` no es un campo universal de la raíz. Una respuesta `204` no tiene cuerpo ni envoltura JSON.
- Cada operación conserva su forma de respuesta con independencia de la cantidad de resultados: las listas no paginadas y acotadas se devuelven directamente como arreglo en `data`; las consultas paginadas utilizan `data.items` y `data.meta` con `page`, `limit`, `totalItems`, `totalPages`, `hasNextPage` y `hasPreviousPage`, sin duplicar `meta` en la raíz.
- Se comprueba la coherencia de los metadatos con el conjunto filtrado y la página solicitada, incluidos la primera y la última página, los resultados vacíos y las páginas sin elementos. Los indicadores de navegación se derivan de las condiciones de paginación, sin depender de estados independientes ni de una implementación interna concreta.
- Una creación confirmada utiliza `201`, una consulta o modificación representada utiliza `200`, y una importación admitida de manera durable utiliza `202`, sin presentarla como procesamiento concluido.
- Las entradas mal formadas, los campos inesperados y los filtros no admitidos se rechazan con `400`; las credenciales inválidas con `401`; los permisos insuficientes con `403`; las referencias no visibles o inexistentes con `404` cuando corresponda; los conflictos funcionales con `409`.
- Un rechazo funcional no se convierte en `500`, y un error interno no expone detalles de tablas, trazas ni secretos.
- La paginación empieza en `page=1`, usa `limit=20` por defecto y admite como máximo `limit=100`, con orden determinista y desempate estable.
- Las operaciones intencionales de estado no se sustituyen por un cambio genérico de `status`; las lecturas no producen modificaciones funcionales.
- OpenAPI expresa coherentemente métodos, autenticación por cookies, envolturas de éxito y error, formas paginadas y no paginadas, respuestas sin cuerpo y restricciones reales. Las pruebas contrastan ese contrato con las respuestas efectivas, sin aceptar representaciones alternativas incompatibles.

## 4. Consultas y reportes

La verificación de lecturas utiliza un conjunto controlado con registros vigentes e históricos. Cada conteo se contrasta con el conjunto de entidades que efectivamente debe contar, sin mezclar cursos, ofertas, secciones o inscripciones como si fueran la misma unidad.

Se comprueba que las consultas de ofertas e inscripciones requieren el periodo cuando corresponde; que los filtros históricos no alteran el criterio por defecto de vigencia; y que las proyecciones devuelven resultados coherentes con un corte de lectura consistente. La presencia de registros cancelados o retirados debe poder distinguirse cuando la consulta los incluye expresamente.

El acceso a indicadores agregados de importaciones mediante `reports.read` **no permite** recuperar archivo fuente, resultados por fila ni seguimiento individual protegido por `students.imports.read`. Las pruebas verifican tanto el resultado autorizado como la ausencia de campos y recursos fuera de alcance.
