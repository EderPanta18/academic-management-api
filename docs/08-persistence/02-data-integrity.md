# Integridad de datos y preservación histórica

La persistencia impone **garantías estructurales independientes de la ruta de entrada**. Los controles de aplicación establecen qué operaciones son legítimas; las restricciones de PostgreSQL impiden que datos incompatibles se confirmen por errores de programación, escrituras concurrentes o procesos técnicos distintos.

La protección de una regla puede requerir varios mecanismos complementarios. Una clave única resuelve una duplicidad expresable en columnas; una condición que relaciona estados y registros de distintas tablas exige además una **decisión transaccional protegida contra concurrencia**. No se supone que una clave foránea o un índice aislado demuestren toda la validez académica.

## 1. Garantías estructurales

| Tipo de garantía | Obligación de persistencia | Distinción importante |
| --- | --- | --- |
| **Identidad** | Cada recurso posee una clave primaria estable y las identidades institucionales declaradas únicas no se duplican. | La unicidad de códigos y documentos respeta su ámbito lógico. |
| **Referencias** | Las relaciones obligatorias se sustentan en referencias válidas y las opcionales permiten ausencia únicamente en estados que la admiten. | Un docente puede faltar en una oferta en preparación, no en una oferta `OPEN`. |
| **Asociaciones** | Las relaciones de cardinalidad única impiden perfiles o vínculos duplicados; las asociaciones históricas mantienen sus antecedentes. | La desactivación no convierte un vínculo anterior en inexistente. |
| **Dominios de valores** | Estados, categorías, capacidad y atributos restringidos no admiten representaciones inválidas. | Las reglas de transición siguen perteneciendo a los casos de uso propietarios. |
| **Evidencia** | Los hechos confirmados conservan actor, instante, identidad y diferencias relevantes. | Un cambio académico no queda confirmado sin su movimiento y auditoría exigibles. |
| **Idempotencia persistente** | Las identidades de solicitudes o unidades de trabajo no admiten la creación repetida del mismo efecto. | La idempotencia funcional no se sustituye por la deduplicación temporal del broker. |

Los datos deben conservar integridad incluso cuando una consulta o una operación se ejecuta desde un worker en lugar de una solicitud interactiva. Ningún adaptador recibe una excepción a las restricciones de almacenamiento por su mecanismo de entrada.

## 2. Invariantes que atraviesan registros

La persistencia participa de la protección de relaciones funcionales cuya validez no se demuestra mediante una única referencia:

- **Inscripción por curso y periodo:** la identidad del curso y periodo de una inscripción permanece consistente con la oferta vinculada. La comprobación de que no existe otra inscripción `ENROLLED` para el mismo estudiante, curso y periodo **abarca todas las secciones**, no solo la oferta actual.
- **Antecedente de retiro:** la existencia de un retiro real para el mismo estudiante, curso y periodo impide la nueva inscripción ordinaria; no se interpreta su ausencia del conteo de cupos como habilitación para reinscribir.
- **Escuela de referencia:** la escuela utilizada al admitir la inscripción se conserva, aunque se modifique la escuela vigente del estudiante o la relación entre escuela y curso.
- **Capacidad:** los registros `ENROLLED` que apuntan a una oferta no superan su capacidad máxima. La condición se comprueba también cuando se reduce una capacidad o cambia una sección, no solo al crear inscripciones.
- **Oferta y periodo:** los estados y fechas que habilitan una operación se comprueban sobre las referencias persistentes que realmente se confirman, no sobre una vista anterior sin protección transaccional.

Las restricciones únicas y referenciales expresables directamente se aplican en PostgreSQL. Las invariantes que dependen de **predicados sobre varios registros, estados o asociaciones** se aseguran mediante la coordinación transaccional común a todos los escritores autorizados. No se pretende expresar una unicidad entre estudiante, curso y periodo mediante un índice exclusivo sobre `student_id` y `course_offering_id`, porque ese par permite duplicados entre secciones.

## 3. Identidad y duplicidad de operaciones técnicas

| Dato persistente | Unicidad protegida | Efecto |
| --- | --- | --- |
| Asociación usuario–rol | Usuario y rol. | No se asigna dos veces el mismo rol a una cuenta. |
| Asociación rol–permiso | Rol y permiso. | No se duplica la concesión de un permiso. |
| Sesión activa | Una por cuenta, aunque existan sesiones históricas revocadas. | Dos inicios o renovaciones concurrentes no mantienen sesiones activas paralelas. |
| Archivo importado | Cuenta responsable y SHA-256 de los bytes originales. | Dos admisiones simultáneas del mismo archivo por esa cuenta producen una sola importación aceptada. |
| Unidad confirmada de importación | Importación y posición de la fila. | Una entrega repetida no aplica otra vez una fila ya resuelta. |
| Entrega durable | Identidad estable de intención de publicación. | El relay y los consumidores reconocen reentregas del mismo trabajo o evento. |

La protección mediante claves de identidad se acompaña de decisiones funcionales: **identificar una fila como duplicada no autoriza sobrescribir datos existentes**; identificar un trabajo repetido no significa repetir efectos y registrar una sesión nueva no permite conservar otra sesión activa por accidente.

La cuenta y el hash se comparan sobre el **contenido binario original** de la importación, sin convertirlo a un formato distinto antes de calcular su identidad. Los errores de colisión con registros preexistentes se traducen en resultados funcionales controlados, no en datos sobrescritos por operaciones de tipo *upsert* indiscriminadas.

## 4. Historial, bajas y rectificaciones

Los movimientos de inscripción, auditorías y demás evidencias que sustentan hechos confirmados siguen un modelo **de solo incorporación**. Las interfaces de escritura ordinarias no permiten modificarlos ni eliminarlos. La corrección extraordinaria conserva el dato previo y agrega una evidencia nueva que explica quién corrigió, qué cambió y por qué.

Las restricciones referenciales evitan eliminar recursos necesarios para interpretar historias, incluso cuando ya no están habilitados para operaciones nuevas. No se emplean cascadas destructivas desde estudiantes, ofertas, periodos, personas, cuentas o importaciones hacia inscripciones, movimientos o auditorías.

La baja lógica aplica a recursos administrativos cuya vigencia cambia sin destruir su identidad. No se utiliza un indicador genérico de eliminación como sustituto de estados funcionales: una inscripción `CANCELLED` o `WITHDRAWN` mantiene su resultado académico; una importación fallida conserva los efectos parciales válidos y su evidencia.

## 5. Detección de violaciones y límites

Una violación de clave única, referencia o condición estructural provoca rechazo de la escritura correspondiente; nunca se corrige mediante eliminación automática de antecedentes, cambio arbitrario de sección o sustitución silenciosa de identificadores. El adaptador de persistencia clasifica el fallo y lo traduce a un resultado de aplicación cuando representa un conflicto conocido. Las excepciones técnicas no revelan detalles internos del esquema a los consumidores.

La integridad no depende exclusivamente de que los usuarios accedan por una ruta autorizada: las operaciones administrativas, los workers, el relay y las migraciones deben preservar las mismas restricciones. La autoridad del dominio decide el **significado**; la persistencia asegura que ninguna de sus representaciones confirmadas lo contradiga.
