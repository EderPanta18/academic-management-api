# Verificación funcional y de contratos

Las pruebas funcionales demuestran que cada intención permitida produce su efecto completo y que una intención incompatible se rechaza **sin modificar el estado de manera indebida**. Las pruebas de contrato examinan cómo esos resultados se representan en la API; no redefinen las reglas de negocio ni duplican el inventario de operaciones HTTP.

## 1. Cobertura funcional por capacidades

| Área y cobertura | Escenarios que debe distinguir la evidencia |
| --- | --- |
| Identidades y catálogos (`RF-001`–`RF-009`) | Identidad documental compartida sin duplicación; unicidad de códigos; relaciones entre facultades, departamentos, escuelas, docentes y cursos; asociación curso-escuela; deshabilitación sin destruir referencias históricas; catálogo fijo de tipos de documento. |
| Periodos y ofertas (`RF-010`–`RF-015`) | Ventana de inscripción y fechas frontera; transiciones válidas y prohibidas; oferta vinculada a periodo, curso, sección y docente; imposibilidad de abrir sin docente; ocupación y disponibilidad correctas. |
| Inscripciones (`RF-016`–`RF-029`) | Elegibilidad completa, cupo, unicidad por curso/periodo entre secciones, cancelación, retiro, cambio de sección, corrección privilegiada, motivos, historial y conservación al cerrar el periodo. |
| Importaciones (`RF-030`–`RF-036`) | CSV/XLSX; admisión, archivo original y seguimiento; filas incorporadas, duplicadas, rechazadas y no procesadas; código de escuela; mismo archivo/usuario rechazado y archivo idéntico de otra cuenta tratado como una solicitud independiente. |
| Reportes (`RF-037`–`RF-041`) | Consultas predefinidas sobre estudiantes, cursos, ofertas, ocupación e inscripciones; filtros y periodo exigible; indicadores agregados de importaciones y detalle restringido; ausencia de consultas libres o exportaciones ajenas al alcance. |
| Cuentas y permisos (`RF-042`–`RF-051`) | Cuenta administrada, sesiones revocables, sesión única, rotación, roles institucionales y personalizados, prohibición de autoasignación, corrección exclusivamente administrativa y cambios de contraseña con revocación. |
| Auditoría (`RF-052`–`RF-054`) | Atribución de actuaciones y eventos de seguridad; consulta restringida; imposibilidad de editar o eliminar evidencia por vías ordinarias. |

Las condiciones del dominio se prueban con combinaciones significativas, no con el producto cartesiano de todos los campos. Se priorizan transiciones entre estados, límites de tiempo, recursos relacionados e intentos de eludir una prohibición mediante un mecanismo alternativo.

## 2. Inscripciones y cambios de estado

La prueba de inscripción ordinaria confirma que una admisión válida crea un registro `ENROLLED`, ocupa exactamente una plaza y produce sus efectos históricos. La misma intención se rechaza si el estudiante no está `ACTIVE`, el curso no pertenece a su escuela, la ventana está cerrada, la oferta no admite inscripciones o no queda cupo.

| Escenario | Resultado verificable |
| --- | --- |
| Inscripción repetida en el mismo curso y periodo, incluso cambiando de sección | Existe como máximo una inscripción `ENROLLED` de ese estudiante para el curso y periodo; no se reserva una segunda plaza. |
| Cancelación ordinaria antes del inicio | Estado `CANCELLED`, plaza liberada, motivo y movimiento conservados. |
| Reinscripción después de `CANCELLED` con condiciones vigentes | Se crea una inscripción nueva; la cancelada permanece como antecedente. |
| Retiro durante el periodo en curso | Estado `WITHDRAWN`, plaza liberada, motivo registrado y prohibición de reinscripción ordinaria al mismo curso y periodo. |
| Cambio de sección permitido | Se conserva la identidad de la inscripción y la ocupación se traslada de forma indivisible al destino válido. |
| Cambio a otro curso/periodo o sección sin plaza | Rechazo sin alterar inscripción, cupos ni historial con un movimiento ficticio. |
| Cierre de periodo con inscripciones históricas | Se conservan `ENROLLED`, `CANCELLED` o `WITHDRAWN` tal como quedaron, sin generar estados académicos inexistentes. |
| Corrección extraordinaria sin autorización o motivo | Rechazo sin efecto; un administrador autorizado conserva antecedentes y evidencia de la rectificación admitida. |

Las pruebas de concurrencia que acompañan estas operaciones se evalúan separadamente con almacenamiento real, porque la verificación funcional secuencial no demuestra exclusión entre escrituras simultáneas.

## 3. Contratos HTTP y validación

Con Supertest se ejerce el adaptador REST bajo el prefijo `/api/v1` y se contrasta su comportamiento con OpenAPI generado a partir de los contratos ejecutables.

- Las respuestas JSON con cuerpo mantienen `statusCode`, `timestamp`, `path` y `data` o la descripción estructurada de error pertinente; `meta` aparece cuando la consulta lo exige. `204` no contiene cuerpo.
- Una creación confirmada utiliza `201`, una consulta o modificación representada utiliza `200`, y una importación admitida de manera durable utiliza `202`, sin presentarla como procesamiento concluido.
- Las entradas mal formadas, los campos inesperados y los filtros no admitidos se rechazan con `400`; las credenciales inválidas con `401`; los permisos insuficientes con `403`; las referencias no visibles o inexistentes con `404` cuando corresponda; los conflictos funcionales con `409`.
- Un rechazo funcional no se convierte en `500`, y un error interno no expone detalles de tablas, trazas ni secretos.
- La paginación empieza en `page=1`, usa `limit=20` por defecto y admite como máximo `limit=100`, con orden determinista y desempate estable.
- Las operaciones intencionales de estado no se sustituyen por un cambio genérico de `status`; las lecturas no producen modificaciones funcionales.
- OpenAPI expresa coherentemente métodos, autenticación por cookies, respuestas y restricciones reales, sin permitir divergencias silenciosas respecto del comportamiento atendido.

## 4. Consultas y reportes

La verificación de lecturas utiliza un conjunto controlado con registros vigentes e históricos. Cada conteo se contrasta con el conjunto de entidades que efectivamente debe contar, sin mezclar cursos, ofertas, secciones o inscripciones como si fueran la misma unidad.

Se comprueba que las consultas de ofertas e inscripciones requieren el periodo cuando corresponde; que los filtros históricos no alteran el criterio por defecto de vigencia; y que las proyecciones devuelven resultados coherentes con un corte de lectura consistente. La presencia de registros cancelados o retirados debe poder distinguirse cuando la consulta los incluye expresamente.

El acceso a indicadores agregados de importaciones mediante `reports.read` **no permite** recuperar archivo fuente, resultados por fila ni seguimiento individual protegido por `students.imports.read`. Las pruebas verifican tanto el resultado autorizado como la ausencia de campos y recursos fuera de alcance.
