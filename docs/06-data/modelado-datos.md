# Modelado de datos

Este documento describe el modelado lógico de datos del backend académico.

El objetivo es definir qué información almacena el sistema, cómo se relacionan sus entidades, qué restricciones mantienen la consistencia y qué datos deben modelarse como tablas, enums o registros históricos.

El modelo está pensado para una base de datos relacional con PostgreSQL y Prisma. La estructura prioriza normalización, trazabilidad, control de acceso y coherencia con el proceso de inscripción académica.

## Propósito

El modelado de datos responde a estas preguntas:

```txt
¿Qué información necesita persistir el sistema?
¿Cómo se relacionan las entidades principales?
¿Qué restricciones evitan inconsistencias?
¿Qué datos deben ser tablas?
¿Qué datos pueden ser enums?
¿Qué información debe conservar historial?
¿Qué datos pertenecen al dominio académico y cuáles al control de acceso?
```

El sistema no debe funcionar como un conjunto de registros aislados. Las tablas deben reflejar el flujo real:

```txt
Persona
→ Estudiante
→ Programa académico
→ Curso
→ Oferta de curso
→ Inscripción
```

Y el control de acceso:

```txt
Usuario
→ Sesión
→ Rol
→ Permiso
```

## Criterios de normalización

El modelo separa responsabilidades para evitar duplicidad y dependencias innecesarias.

Criterios aplicados:

```txt
- Separar identidad personal de perfiles académicos.
- Separar usuario de persona.
- Separar estudiante y docente como perfiles distintos.
- Separar curso del catálogo y oferta de curso.
- Separar rol de permiso.
- Separar sesión de usuario.
- Separar auditoría de tablas operativas.
- Separar resumen de importación y detalle por fila.
- Usar tablas intermedias para relaciones N:M.
- Usar enums cuando el conjunto de valores es pequeño y estable.
- Usar catálogos cuando los valores pueden crecer o administrarse.
```

## Convenciones transversales

Las tablas operativas principales usan campos comunes.

```txt
id
= identificador único del registro

created_at
= fecha de creación

updated_at
= fecha de última modificación

deleted_at
= fecha de baja lógica
```

Un registro con `deleted_at` distinto de `null` se considera eliminado lógicamente.

La baja lógica permite conservar relaciones históricas, evitar pérdida definitiva de información y mantener trazabilidad del proceso.

No todas las tablas necesitan `deleted_at`. Las tablas de historial, auditoría y detalle de importación pueden tratarse como registros de solo inserción.

## Identificadores

Se recomienda usar UUID como identificador principal para entidades expuestas por API.

Ventajas:

```txt
- Evita exponer secuencias numéricas.
- Facilita integración futura.
- Reduce dependencia del orden interno de inserción.
- Funciona bien con APIs públicas o internas.
```

Criterio recomendado:

```txt
id UUID PK
```

La generación de identificadores debe realizarse desde el backend antes de persistir registros. La base de datos recibe el identificador, valida unicidad e integridad referencial, pero no debe ser la responsable principal de generar IDs operativos.

Este criterio aplica también a tablas catálogo si tienen CRUD o pueden administrarse desde el sistema, porque siguen formando parte del flujo de aplicación y deben comportarse igual que el resto de entidades persistidas.

En seeds, los identificadores también deben ser generados por el propio proceso de seed o definidos de forma estable cuando las pruebas lo requieran.

Si se usan enteros autoincrementales o defaults generados por base de datos en algún caso puntual, debe existir un criterio explícito.

## Enums y tablas catálogo

No todo estado necesita una tabla.

Usar enum cuando:

```txt
- El conjunto de valores es pequeño.
- Los valores son estables.
- No se administran desde la interfaz.
- El valor participa directamente en reglas internas.
```

Ejemplos:

```txt
student_status
professor_status
academic_period_status
course_offering_status
enrollment_status
user_status
session_status
import_status
import_row_status
```

Usar tabla catálogo cuando:

```txt
- Los valores pueden crecer.
- Los valores pueden administrarse.
- Requieren descripción, orden, visibilidad o configuración.
- No forman parte de una regla fija de aplicación.
```

Ejemplos:

```txt
document_types
course_categories
```

Roles, permisos y sesiones no son catálogos simples. Tienen relaciones, reglas y operaciones propias.

Si un catálogo tiene CRUD o es administrable por el sistema, su `id` también debe generarse desde backend o desde el proceso de seed. La base de datos no debe asignarle un UUID automáticamente.

## Grupos del modelo

| Grupo | Tablas principales |
| --- | --- |
| Identidad personal | `document_types`, `persons` |
| Actores académicos | `students`, `professors` |
| Estructura académica | `academic_programs`, `course_categories`, `courses`, `academic_periods` |
| Oferta e inscripción | `course_offerings`, `enrollments`, `enrollment_status_logs` |
| Acceso y seguridad | `users`, `roles`, `permissions`, `user_roles`, `role_permissions`, `user_sessions` |
| Auditoría | `audit_logs` |
| Soporte de importación | `student_imports`, `student_import_rows` |

## Identidad personal

## `document_types`

Representa tipos de documento de identidad.

Se modela como tabla catálogo porque sus valores pueden variar según país, institución o necesidad administrativa.

| Campo | Tipo lógico | Restricciones | Descripción |
| --- | --- | --- | --- |
| `id` | UUID | PK | Identificador. |
| `code` | texto corto | único, requerido | Código del tipo de documento. |
| `name` | texto | único, requerido | Nombre visible. |
| `description` | texto | opcional | Descripción. |
| `is_active` | booleano | requerido | Indica si puede usarse. |
| `created_at` | fecha-hora | requerido | Fecha de creación. |
| `updated_at` | fecha-hora | requerido | Fecha de actualización. |
| `deleted_at` | fecha-hora | opcional | Baja lógica. |

Ejemplos:

```txt
DNI
CE
PASSPORT
```

## `persons`

Representa los datos personales comunes.

No representa una cuenta de acceso ni un perfil académico por sí misma.

| Campo | Tipo lógico | Restricciones | Descripción |
| --- | --- | --- | --- |
| `id` | UUID | PK | Identificador de la persona. |
| `document_type_id` | UUID | FK, requerido | Tipo de documento. |
| `document_number` | texto corto | requerido | Número de documento. |
| `first_name` | texto | requerido | Nombres. |
| `last_name` | texto | requerido | Apellidos. |
| `email` | texto | opcional | Correo de contacto. |
| `phone` | texto corto | opcional | Teléfono. |
| `birth_date` | fecha | opcional | Fecha de nacimiento. |
| `created_at` | fecha-hora | requerido | Fecha de creación. |
| `updated_at` | fecha-hora | requerido | Fecha de actualización. |
| `deleted_at` | fecha-hora | opcional | Baja lógica. |

Restricciones:

```txt
- `document_type_id` + `document_number` debe ser único para registros activos.
- `email` puede ser único si la institución lo exige.
```

Relaciones:

```txt
persons 1:1 students
persons 1:1 professors
persons 1:1 users opcional
```

Notas:

```txt
- Una persona puede existir sin usuario.
- Un usuario puede existir para personal administrativo que no sea estudiante ni docente.
- Una persona puede ser estudiante y docente si la institución lo permite.
```

## Actores académicos

## `students`

Representa a un estudiante.

| Campo | Tipo lógico | Restricciones | Descripción |
| --- | --- | --- | --- |
| `id` | UUID | PK | Identificador del estudiante. |
| `person_id` | UUID | FK, único, requerido | Persona asociada. |
| `academic_program_id` | UUID | FK, requerido | Programa académico. |
| `code` | texto corto | único, requerido | Código institucional del estudiante. |
| `institutional_email` | texto | único, opcional | Correo institucional. |
| `admission_period` | texto corto | opcional | Periodo o año de admisión. |
| `status` | enum | requerido | Estado académico. |
| `created_at` | fecha-hora | requerido | Fecha de creación. |
| `updated_at` | fecha-hora | requerido | Fecha de actualización. |
| `deleted_at` | fecha-hora | opcional | Baja lógica. |

Enum sugerido:

```txt
student_status:
- ACTIVE
- INACTIVE
- SUSPENDED
- WITHDRAWN
- GRADUATED
```

Relaciones:

```txt
students N:1 academic_programs
students 1:N enrollments
student_import_rows N:1 students opcional
```

Reglas relacionadas:

```txt
- Un estudiante activo puede inscribirse si cumple las demás condiciones.
- Un estudiante suspendido, retirado o egresado no debería inscribirse si la institución lo restringe.
- No debe duplicarse por código institucional.
```

## `professors`

Representa a un docente.

| Campo | Tipo lógico | Restricciones | Descripción |
| --- | --- | --- | --- |
| `id` | UUID | PK | Identificador del docente. |
| `person_id` | UUID | FK, único, requerido | Persona asociada. |
| `code` | texto corto | único, requerido | Código institucional del docente. |
| `institutional_email` | texto | único, opcional | Correo institucional. |
| `department` | texto | opcional | Unidad, departamento o área académica. |
| `specialty` | texto | opcional | Especialidad. |
| `status` | enum | requerido | Estado operativo. |
| `created_at` | fecha-hora | requerido | Fecha de creación. |
| `updated_at` | fecha-hora | requerido | Fecha de actualización. |
| `deleted_at` | fecha-hora | opcional | Baja lógica. |

Enum sugerido:

```txt
professor_status:
- ACTIVE
- INACTIVE
- ON_LEAVE
```

Relaciones:

```txt
professors 1:N course_offerings
```

Notas:

```txt
- `department` puede mantenerse como texto si no se administra estructura orgánica formal.
- Si la institución necesita departamentos administrables, puede normalizarse a una tabla `academic_units` o `departments`.
```

## Estructura académica

## `academic_programs`

Representa un programa académico.

Se usa este nombre en lugar de carrera para mantener el modelo general.

| Campo | Tipo lógico | Restricciones | Descripción |
| --- | --- | --- | --- |
| `id` | UUID | PK | Identificador. |
| `code` | texto corto | único, requerido | Código del programa. |
| `name` | texto | único, requerido | Nombre del programa. |
| `academic_unit` | texto | opcional | Unidad académica asociada. |
| `status` | enum | requerido | Estado del programa. |
| `created_at` | fecha-hora | requerido | Fecha de creación. |
| `updated_at` | fecha-hora | requerido | Fecha de actualización. |
| `deleted_at` | fecha-hora | opcional | Baja lógica. |

Enum reutilizable:

```txt
record_status:
- ACTIVE
- INACTIVE
```

Relaciones:

```txt
academic_programs 1:N students
academic_programs 1:N courses
```

## `course_categories`

Representa una clasificación de curso.

Se modela como tabla catálogo porque sus valores pueden variar según la institución.

| Campo | Tipo lógico | Restricciones | Descripción |
| --- | --- | --- | --- |
| `id` | UUID | PK | Identificador. |
| `code` | texto corto | único, requerido | Código de categoría. |
| `name` | texto | único, requerido | Nombre de categoría. |
| `description` | texto | opcional | Descripción. |
| `is_active` | booleano | requerido | Indica si puede usarse. |
| `created_at` | fecha-hora | requerido | Fecha de creación. |
| `updated_at` | fecha-hora | requerido | Fecha de actualización. |
| `deleted_at` | fecha-hora | opcional | Baja lógica. |

Ejemplos:

```txt
GENERAL
SPECIALTY
ELECTIVE
LABORATORY
```

## `courses`

Representa una unidad académica del catálogo.

No representa un dictado específico. El dictado concreto se modela con `course_offerings`.

| Campo | Tipo lógico | Restricciones | Descripción |
| --- | --- | --- | --- |
| `id` | UUID | PK | Identificador. |
| `academic_program_id` | UUID | FK, requerido | Programa académico. |
| `course_category_id` | UUID | FK, opcional | Categoría. |
| `code` | texto corto | requerido | Código del curso. |
| `name` | texto | requerido | Nombre del curso. |
| `description` | texto | opcional | Descripción. |
| `credits` | entero | requerido | Créditos. |
| `hours` | entero | opcional | Horas académicas. |
| `status` | enum | requerido | Estado. |
| `created_at` | fecha-hora | requerido | Fecha de creación. |
| `updated_at` | fecha-hora | requerido | Fecha de actualización. |
| `deleted_at` | fecha-hora | opcional | Baja lógica. |

Restricciones:

```txt
- `code` debe ser único si el código es institucionalmente global.
- Alternativamente, `academic_program_id` + `code` debe ser único si el código solo es único por programa.
- `credits` debe ser mayor que cero.
```

Relaciones:

```txt
courses N:1 academic_programs
courses N:1 course_categories
courses 1:N course_offerings
```

## `academic_periods`

Representa un periodo académico.

| Campo | Tipo lógico | Restricciones | Descripción |
| --- | --- | --- | --- |
| `id` | UUID | PK | Identificador. |
| `code` | texto corto | único, requerido | Código del periodo. |
| `name` | texto | requerido | Nombre del periodo. |
| `start_date` | fecha | requerido | Fecha de inicio. |
| `end_date` | fecha | requerido | Fecha de cierre. |
| `enrollment_start_date` | fecha | opcional | Inicio de inscripciones. |
| `enrollment_end_date` | fecha | opcional | Fin de inscripciones. |
| `status` | enum | requerido | Estado del periodo. |
| `created_at` | fecha-hora | requerido | Fecha de creación. |
| `updated_at` | fecha-hora | requerido | Fecha de actualización. |
| `deleted_at` | fecha-hora | opcional | Baja lógica. |

Enum sugerido:

```txt
academic_period_status:
- PLANNED
- OPEN
- IN_PROGRESS
- CLOSED
- CANCELLED
```

Restricciones:

```txt
- `end_date` no debe ser anterior a `start_date`.
- Las fechas de inscripción deben estar dentro de un rango válido.
- Un periodo cerrado o cancelado no debe recibir nuevas inscripciones.
```

Relaciones:

```txt
academic_periods 1:N course_offerings
```

## Oferta e inscripción

## `course_offerings`

Representa una instancia concreta de un curso dentro de un periodo.

| Campo | Tipo lógico | Restricciones | Descripción |
| --- | --- | --- | --- |
| `id` | UUID | PK | Identificador. |
| `course_id` | UUID | FK, requerido | Curso asociado. |
| `academic_period_id` | UUID | FK, requerido | Periodo académico. |
| `professor_id` | UUID | FK, opcional | Docente asignado. |
| `section` | texto corto | requerido | Sección. |
| `max_capacity` | entero | requerido | Cupo máximo. |
| `available_capacity` | entero | opcional | Cupo disponible si se decide persistirlo. |
| `status` | enum | requerido | Estado de la oferta. |
| `created_at` | fecha-hora | requerido | Fecha de creación. |
| `updated_at` | fecha-hora | requerido | Fecha de actualización. |
| `deleted_at` | fecha-hora | opcional | Baja lógica. |

Enum sugerido:

```txt
course_offering_status:
- DRAFT
- OPEN
- CLOSED
- CANCELLED
- FINISHED
```

Restricciones:

```txt
- `course_id` + `academic_period_id` + `section` debe ser único para registros activos.
- `max_capacity` debe ser mayor que cero.
- `available_capacity` no debe ser negativo si se persiste.
- Una oferta abierta puede recibir inscripciones si cumple reglas de cupo y periodo.
```

Relaciones:

```txt
course_offerings N:1 courses
course_offerings N:1 academic_periods
course_offerings N:1 professors
course_offerings 1:N enrollments
```

### Cupo disponible

El cupo disponible puede manejarse de dos formas.

Opción recomendada para consistencia:

```txt
available_capacity no se persiste
= se calcula con max_capacity - inscripciones activas
```

Opción alternativa:

```txt
available_capacity se persiste
= se actualiza transaccionalmente al crear o cancelar inscripciones
```

Si se persiste, debe cuidarse la consistencia con transacciones para evitar cupos negativos o diferencias frente a inscripciones activas.

## `enrollments`

Representa la inscripción de un estudiante en una oferta de curso.

| Campo | Tipo lógico | Restricciones | Descripción |
| --- | --- | --- | --- |
| `id` | UUID | PK | Identificador. |
| `student_id` | UUID | FK, requerido | Estudiante. |
| `course_offering_id` | UUID | FK, requerido | Oferta. |
| `status` | enum | requerido | Estado actual. |
| `enrolled_at` | fecha-hora | requerido | Fecha de inscripción. |
| `registered_by_user_id` | UUID | FK, opcional | Usuario responsable. |
| `status_reason` | texto | opcional | Motivo del estado actual cuando aplique. |
| `created_at` | fecha-hora | requerido | Fecha de creación. |
| `updated_at` | fecha-hora | requerido | Fecha de actualización. |
| `deleted_at` | fecha-hora | opcional | Baja lógica. |

Enum sugerido:

```txt
enrollment_status:
- PENDING
- ENROLLED
- CANCELLED
- WITHDRAWN
- REJECTED
- FINISHED
```

Restricciones:

```txt
- `student_id` + `course_offering_id` debe ser único para inscripciones vigentes según regla institucional.
- La oferta debe estar abierta.
- El periodo debe permitir inscripción.
- El estudiante debe estar habilitado.
- Debe existir cupo disponible.
- El usuario responsable debe estar autorizado.
```

Relaciones:

```txt
enrollments N:1 students
enrollments N:1 course_offerings
enrollments N:1 users
enrollments 1:N enrollment_status_logs
```

## `enrollment_status_logs`

Registra cambios de estado de una inscripción.

Es una tabla histórica de solo inserción.

| Campo | Tipo lógico | Restricciones | Descripción |
| --- | --- | --- | --- |
| `id` | UUID | PK | Identificador. |
| `enrollment_id` | UUID | FK, requerido | Inscripción. |
| `previous_status` | enum | opcional | Estado anterior. |
| `new_status` | enum | requerido | Nuevo estado. |
| `reason` | texto | opcional | Motivo del cambio. |
| `changed_by_user_id` | UUID | FK, opcional | Usuario responsable. |
| `created_at` | fecha-hora | requerido | Fecha del evento. |

No requiere `updated_at` ni `deleted_at`, porque representa eventos históricos.

Relaciones:

```txt
enrollment_status_logs N:1 enrollments
enrollment_status_logs N:1 users
```

## Acceso y seguridad

## `users`

Representa una cuenta de acceso al sistema.

No equivale necesariamente a una persona académica. Puede estar vinculada a `persons`, pero no es obligatorio en todos los casos.

| Campo | Tipo lógico | Restricciones | Descripción |
| --- | --- | --- | --- |
| `id` | UUID | PK | Identificador. |
| `person_id` | UUID | FK, opcional, único | Persona asociada. |
| `email` | texto | único, requerido | Correo de acceso. |
| `password_hash` | texto | requerido | Hash de contraseña. |
| `status` | enum | requerido | Estado del usuario. |
| `last_login_at` | fecha-hora | opcional | Último inicio de sesión. |
| `created_at` | fecha-hora | requerido | Fecha de creación. |
| `updated_at` | fecha-hora | requerido | Fecha de actualización. |
| `deleted_at` | fecha-hora | opcional | Baja lógica. |

Enum sugerido:

```txt
user_status:
- ACTIVE
- INACTIVE
- BLOCKED
```

Relaciones:

```txt
users N:M roles
users 1:N user_sessions
users 1:N audit_logs
users 1:N enrollments
users 1:N student_imports
```

La contraseña nunca debe guardarse en texto plano.

## `roles`

Representa una agrupación de responsabilidades.

| Campo | Tipo lógico | Restricciones | Descripción |
| --- | --- | --- | --- |
| `id` | UUID | PK | Identificador. |
| `code` | texto corto | único, requerido | Código del rol. |
| `name` | texto | único, requerido | Nombre visible. |
| `description` | texto | opcional | Descripción. |
| `is_system` | booleano | requerido | Indica si es rol base del sistema. |
| `status` | enum | requerido | Estado. |
| `created_at` | fecha-hora | requerido | Fecha de creación. |
| `updated_at` | fecha-hora | requerido | Fecha de actualización. |
| `deleted_at` | fecha-hora | opcional | Baja lógica. |

Enum reutilizable:

```txt
record_status:
- ACTIVE
- INACTIVE
```

Ejemplos:

```txt
ADMIN
ACADEMIC_COORDINATOR
SECRETARY
PROFESSOR
REPORT_VIEWER
```

## `permissions`

Representa una acción permitida dentro del sistema.

| Campo | Tipo lógico | Restricciones | Descripción |
| --- | --- | --- | --- |
| `id` | UUID | PK | Identificador. |
| `code` | texto | único, requerido | Código del permiso. |
| `name` | texto | requerido | Nombre visible. |
| `description` | texto | opcional | Descripción. |
| `module` | texto corto | requerido | Módulo o capacidad asociada. |
| `is_system` | booleano | requerido | Indica si es permiso base del sistema. |
| `status` | enum | requerido | Estado. |
| `created_at` | fecha-hora | requerido | Fecha de creación. |
| `updated_at` | fecha-hora | requerido | Fecha de actualización. |
| `deleted_at` | fecha-hora | opcional | Baja lógica. |

Convención de `code`:

```txt
recurso.accion
```

Ejemplos:

```txt
students.read
students.create
students.import
course-offerings.close
enrollments.create
roles.assign-permissions
```

Los permisos no deben ser excesivamente granulares en la primera versión.

## `user_roles`

Tabla intermedia entre usuarios y roles.

| Campo | Tipo lógico | Restricciones | Descripción |
| --- | --- | --- | --- |
| `user_id` | UUID | PK compuesta, FK | Usuario. |
| `role_id` | UUID | PK compuesta, FK | Rol. |
| `assigned_by_user_id` | UUID | FK, opcional | Usuario que asignó. |
| `assigned_at` | fecha-hora | requerido | Fecha de asignación. |

Restricciones:

```txt
- `user_id` + `role_id` debe ser único.
```

## `role_permissions`

Tabla intermedia entre roles y permisos.

| Campo | Tipo lógico | Restricciones | Descripción |
| --- | --- | --- | --- |
| `role_id` | UUID | PK compuesta, FK | Rol. |
| `permission_id` | UUID | PK compuesta, FK | Permiso. |
| `assigned_by_user_id` | UUID | FK, opcional | Usuario que asignó. |
| `assigned_at` | fecha-hora | requerido | Fecha de asignación. |

Restricciones:

```txt
- `role_id` + `permission_id` debe ser único.
```

## `user_sessions`

Representa una sesión de usuario.

Permite controlar sesiones activas, cerrar sesión, revocar accesos y limitar una o varias sesiones por usuario.

| Campo | Tipo lógico | Restricciones | Descripción |
| --- | --- | --- | --- |
| `id` | UUID | PK | Identificador de sesión. |
| `user_id` | UUID | FK, requerido | Usuario. |
| `refresh_token_hash` | texto | opcional | Hash del refresh token. |
| `access_token_jti` | texto | opcional, único | Identificador del access token si se usa. |
| `device_name` | texto | opcional | Nombre del dispositivo. |
| `ip_address` | texto | opcional | IP de origen. |
| `user_agent` | texto | opcional | Cliente o navegador. |
| `status` | enum | requerido | Estado de la sesión. |
| `created_at` | fecha-hora | requerido | Fecha de creación. |
| `expires_at` | fecha-hora | requerido | Fecha de expiración. |
| `revoked_at` | fecha-hora | opcional | Fecha de revocación. |
| `last_used_at` | fecha-hora | opcional | Último uso. |

Enum sugerido:

```txt
session_status:
- ACTIVE
- REVOKED
- EXPIRED
```

Restricciones:

```txt
- Una sesión revocada o expirada no debe permitir acceso.
- Si la política es una sola sesión, solo debe existir una sesión ACTIVE por usuario.
- El refresh token debe almacenarse como hash.
```

## Auditoría

## `audit_logs`

Registra acciones relevantes del sistema.

Es una tabla histórica de solo inserción.

| Campo | Tipo lógico | Restricciones | Descripción |
| --- | --- | --- | --- |
| `id` | UUID | PK | Identificador. |
| `actor_user_id` | UUID | FK, opcional | Usuario responsable. |
| `action` | texto corto | requerido | Acción realizada. |
| `resource_type` | texto corto | requerido | Tipo de recurso afectado. |
| `resource_id` | UUID/texto | opcional | Identificador del recurso. |
| `module` | texto corto | opcional | Módulo relacionado. |
| `description` | texto | opcional | Descripción breve. |
| `metadata` | JSON | opcional | Datos adicionales controlados. |
| `ip_address` | texto | opcional | IP del actor. |
| `user_agent` | texto | opcional | Cliente del actor. |
| `created_at` | fecha-hora | requerido | Fecha del evento. |

No requiere `updated_at` ni `deleted_at`.

La auditoría no debe guardar contraseñas, tokens, secretos ni payloads completos sin control.

## Soporte de importación de estudiantes

La importación de estudiantes pertenece funcionalmente al módulo `students`.

La lectura técnica del archivo pertenece a `platform/files`, pero la validación de filas, detección de duplicados y creación de estudiantes pertenece a `students`.

```txt
students
= decide qué significa importar estudiantes

platform/files
= lee técnicamente CSV/XLSX

student_imports
= resumen de la importación

student_import_rows
= detalle por fila de la importación
```

No se crea una tabla genérica `imports` mientras la importación solo pertenezca a estudiantes. Si en el futuro varias entidades requieren importación común, puede evaluarse una capacidad transversal.

## `student_imports`

Representa el resumen general de una importación de estudiantes.

| Campo | Tipo lógico | Restricciones | Descripción |
| --- | --- | --- | --- |
| `id` | UUID | PK | Identificador. |
| `file_name` | texto | requerido | Nombre del archivo. |
| `file_size` | entero | opcional | Tamaño del archivo en bytes. |
| `file_mime_type` | texto | opcional | Tipo MIME del archivo. |
| `status` | enum | requerido | Estado del proceso. |
| `total_rows` | entero | requerido | Total de filas detectadas. |
| `processed_rows` | entero | requerido | Filas procesadas. |
| `accepted_rows` | entero | requerido | Filas aceptadas. |
| `rejected_rows` | entero | requerido | Filas rechazadas. |
| `duplicated_rows` | entero | requerido | Filas duplicadas. |
| `observed_rows` | entero | requerido | Filas observadas. |
| `created_by_user_id` | UUID | FK, opcional | Usuario responsable. |
| `created_at` | fecha-hora | requerido | Fecha de creación. |
| `started_at` | fecha-hora | opcional | Fecha de inicio de procesamiento. |
| `finished_at` | fecha-hora | opcional | Fecha de finalización. |

Enum sugerido:

```txt
import_status:
- PENDING
- PROCESSING
- COMPLETED
- COMPLETED_WITH_ERRORS
- FAILED
```

Relaciones:

```txt
student_imports N:1 users
student_imports 1:N student_import_rows
```

Notas:

```txt
- Permite saber quién importó, cuándo, qué archivo se procesó y cuál fue el resultado.
- No reemplaza a la auditoría; la complementa con detalle operativo del proceso.
```

## `student_import_rows`

Representa el resultado individual de cada fila procesada en una importación de estudiantes.

| Campo | Tipo lógico | Restricciones | Descripción |
| --- | --- | --- | --- |
| `id` | UUID | PK | Identificador. |
| `student_import_id` | UUID | FK, requerido | Importación asociada. |
| `row_number` | entero | requerido | Número de fila dentro del archivo. |
| `raw_data` | JSON | requerido | Datos originales de la fila. |
| `normalized_data` | JSON | opcional | Datos normalizados antes de aplicar reglas. |
| `status` | enum | requerido | Resultado de la fila. |
| `error_summary` | texto | opcional | Resumen de error u observación. |
| `field_errors` | JSON | opcional | Errores por campo. |
| `created_student_id` | UUID | FK, opcional | Estudiante creado si aplica. |
| `updated_student_id` | UUID | FK, opcional | Estudiante actualizado si aplica. |
| `created_at` | fecha-hora | requerido | Fecha de registro. |

Enum sugerido:

```txt
import_row_status:
- ACCEPTED
- REJECTED
- DUPLICATED
- OBSERVED
- UPDATED
```

Restricciones:

```txt
- `student_import_id` + `row_number` debe ser único.
```

Relaciones:

```txt
student_import_rows N:1 student_imports
student_import_rows N:1 students opcional
```

Notas:

```txt
- `raw_data` conserva la fila original de forma controlada.
- `normalized_data` permite revisar cómo el sistema interpretó los datos.
- `field_errors` permite consultar errores minuciosos después de procesar el archivo.
- No deben guardarse datos sensibles innecesarios.
```

## Relaciones principales

Vista resumida:

```txt
document_types 1:N persons

persons 1:1 students
persons 1:1 professors
persons 1:1 users opcional

academic_programs 1:N students
academic_programs 1:N courses

course_categories 1:N courses

academic_periods 1:N course_offerings
courses 1:N course_offerings
professors 1:N course_offerings

course_offerings 1:N enrollments
students 1:N enrollments
users 1:N enrollments

enrollments 1:N enrollment_status_logs

users N:M roles
roles N:M permissions
users 1:N user_sessions

users 1:N audit_logs

users 1:N student_imports
student_imports 1:N student_import_rows
students 1:N student_import_rows opcional
```

## Restricciones principales

Restricciones de unicidad:

```txt
document_types.code
persons.document_type_id + persons.document_number
students.code
students.person_id
students.institutional_email cuando exista
professors.code
professors.person_id
professors.institutional_email cuando exista
academic_programs.code
academic_programs.name
courses.code o academic_program_id + code
course_categories.code
academic_periods.code
course_offerings.course_id + academic_period_id + section
enrollments.student_id + course_offering_id según regla de vigencia
users.email
roles.code
permissions.code
user_roles.user_id + role_id
role_permissions.role_id + permission_id
student_import_rows.student_import_id + row_number
```

Restricciones de aplicación:

```txt
- No crear inscripción si la oferta no está abierta.
- No crear inscripción si el periodo no permite inscripciones.
- No crear inscripción si el estudiante no está habilitado.
- No crear inscripción si no hay cupo disponible.
- No reducir cupo máximo por debajo de inscripciones activas.
- No permitir acceso con sesión revocada o expirada.
- No permitir acción sin permiso requerido.
- No aceptar una fila de importación si sus datos mínimos son inválidos.
- No crear estudiante duplicado por documento o código institucional.
```

## Datos derivados

Algunos datos pueden calcularse en lugar de persistirse.

Ejemplos:

```txt
available_capacity
= max_capacity - inscripciones activas

full_name
= first_name + last_name

effective_permissions
= roles del usuario + permisos de esos roles

import_success_rate
= accepted_rows / total_rows
```

Persistir datos derivados puede mejorar lectura, pero aumenta el costo de consistencia. Debe hacerse solo cuando exista una necesidad clara.

## Índices recomendados

Además de claves primarias y foráneas, conviene indexar campos de consulta frecuente.

```txt
persons.document_number
students.code
students.academic_program_id
students.status
professors.code
academic_programs.code
courses.code
academic_periods.status
course_offerings.academic_period_id
course_offerings.course_id
course_offerings.professor_id
course_offerings.status
enrollments.student_id
enrollments.course_offering_id
enrollments.status
users.email
user_sessions.user_id
user_sessions.status
audit_logs.actor_user_id
audit_logs.resource_type
audit_logs.resource_id
audit_logs.created_at
student_imports.created_by_user_id
student_imports.status
student_imports.created_at
student_import_rows.student_import_id
student_import_rows.status
student_import_rows.created_student_id
```

## Orden lógico de creación de tablas

Orden sugerido para migraciones o comprensión del modelo:

```txt
1. Enums.
2. document_types.
3. persons.
4. academic_programs.
5. course_categories.
6. students.
7. professors.
8. courses.
9. academic_periods.
10. course_offerings.
11. users.
12. roles.
13. permissions.
14. user_roles.
15. role_permissions.
16. user_sessions.
17. enrollments.
18. enrollment_status_logs.
19. audit_logs.
20. student_imports.
21. student_import_rows.
```

Este orden puede cambiar según dependencias exactas del schema, pero debe respetar claves foráneas.

## Criterio general

El modelo mantiene separadas las responsabilidades.

```txt
Persona
= identidad personal

Estudiante / docente
= perfil académico

Usuario
= cuenta de acceso

Rol
= agrupación de responsabilidades

Permiso
= acción concreta autorizada

Sesión
= acceso activo o registrado

Curso
= catálogo académico

Oferta
= curso disponible en un periodo

Inscripción
= vínculo entre estudiante y oferta

Importación de estudiantes
= proceso controlado de carga de estudiantes

Auditoría
= evidencia de acciones relevantes
```

Esta separación permite que el sistema mantenga consistencia, trazabilidad y control sin duplicar información innecesaria.
