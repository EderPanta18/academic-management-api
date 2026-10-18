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

La baja lógica permite conservar relaciones históricas, evitar pérdida definitiva de información y mantener trazabilidad del proceso. No hay restauración: un registro dado de baja no vuelve al estado operativo.

No todas las tablas necesitan `deleted_at`. Las tablas de historial y auditoría pueden tratarse como registros de solo inserción.

## Unicidad parcial sobre registros activos

Las tablas que manejan baja lógica no pueden tratar la unicidad de forma global. Si una fila se da de baja, debe poder crearse otra con el mismo valor sin chocar con la anterior.

Por eso, en todas las tablas que tienen `deleted_at`, las restricciones únicas se definen como índices únicos parciales con la condición:

```sql
WHERE deleted_at IS NULL
```

Esto significa que:

```txt
- La unicidad solo aplica entre registros activos.
- Un registro dado de baja no cuenta para la restricción única.
- Se puede crear otro registro con el mismo `code`, `email`, `document_number` u otra clave única, siempre que el anterior esté dado de baja.
- Los registros históricos quedan preservados y siguen siendo consultables.
```

Ejemplos:

```txt
Un estudiante con `code = STU-001` dado de baja no impide crear un nuevo estudiante activo con `code = STU-001`.
Una persona con `document_number = 12345678` dada de baja no impide registrar una nueva persona activa con el mismo documento.
Un curso dado de baja no impide crear otro curso activo con el mismo `code` dentro del mismo programa académico.
```

Este criterio aplica a todas las restricciones únicas sobre tablas que tengan `deleted_at`. Las tablas que no manejan baja lógica (historial, auditoría, sesiones, importaciones) mantienen su unicidad de forma global.

En PostgreSQL, esto se implementa con `CREATE UNIQUE INDEX ... WHERE deleted_at IS NULL`. En Prisma, como el schema no expresa índices parciales de forma nativa, esta restricción se agrega mediante migraciones SQL manuales.

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

Enums definidos:

```txt
student_status
professor_status
academic_period_status
course_offering_status
enrollment_status
user_status
session_status
student_import_status
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

No todos los recursos usan enum de estado. Recursos como `persons`, `academic_programs`, `courses`, `course_categories`, `roles` y `permissions` no tienen enum de estado. Su vigencia se representa con baja lógica (`deleted_at`). Un registro dado de baja no se usa para nuevas relaciones, pero se conserva para no romper la información histórica.

## Grupos del modelo

| Grupo                  | Tablas principales                                                                 |
| ---------------------- | ---------------------------------------------------------------------------------- |
| Identidad personal     | `document_types`, `persons`                                                        |
| Actores académicos     | `students`, `professors`                                                           |
| Estructura académica   | `academic_programs`, `course_categories`, `courses`, `academic_periods`            |
| Oferta e inscripción   | `course_offerings`, `enrollments`, `enrollment_status_logs`                        |
| Acceso y seguridad     | `users`, `roles`, `permissions`, `user_roles`, `role_permissions`, `user_sessions` |
| Auditoría              | `audit_logs`                                                                       |
| Soporte de importación | `student_imports`                                                                  |

## Identidad personal

## `document_types`

Representa tipos de documento de identidad.

Se modela como tabla catálogo porque sus valores pueden variar según país, institución o necesidad administrativa.

| Campo         | Tipo lógico | Restricciones    | Descripción                   |
| ------------- | ----------- | ---------------- | ----------------------------- |
| `id`          | UUID        | PK               | Identificador.                |
| `code`        | texto corto | único, requerido | Código del tipo de documento. |
| `name`        | texto       | único, requerido | Nombre visible.               |
| `description` | texto       | opcional         | Descripción.                  |
| `created_at`  | fecha-hora  | requerido        | Fecha de creación.            |
| `updated_at`  | fecha-hora  | requerido        | Fecha de actualización.       |
| `deleted_at`  | fecha-hora  | opcional         | Baja lógica.                  |

La unicidad de `code` y `name` aplica solo entre registros activos (`deleted_at IS NULL`).

Ejemplos:

```txt
DNI
CE
PASSPORT
```

## `persons`

Representa los datos personales comunes.

No representa una cuenta de acceso ni un perfil académico por sí misma.

| Campo              | Tipo lógico | Restricciones | Descripción                  |
| ------------------ | ----------- | ------------- | ---------------------------- |
| `id`               | UUID        | PK            | Identificador de la persona. |
| `document_type_id` | UUID        | FK, requerido | Tipo de documento.           |
| `document_number`  | texto corto | requerido     | Número de documento.         |
| `first_name`       | texto       | requerido     | Nombres.                     |
| `last_name`        | texto       | requerido     | Apellidos.                   |
| `email`            | texto       | opcional      | Correo de contacto.          |
| `phone`            | texto corto | opcional      | Teléfono.                    |
| `birth_date`       | fecha       | opcional      | Fecha de nacimiento.         |
| `created_at`       | fecha-hora  | requerido     | Fecha de creación.           |
| `updated_at`       | fecha-hora  | requerido     | Fecha de actualización.      |
| `deleted_at`       | fecha-hora  | opcional      | Baja lógica.                 |

Restricciones:

```txt
- `document_type_id` + `document_number` debe ser único entre registros activos.
- `email` es único entre registros activos, cuando exista.
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

| Campo                 | Tipo lógico | Restricciones        | Descripción                          |
| --------------------- | ----------- | -------------------- | ------------------------------------ |
| `id`                  | UUID        | PK                   | Identificador del estudiante.        |
| `person_id`           | UUID        | FK, único, requerido | Persona asociada.                    |
| `academic_program_id` | UUID        | FK, requerido        | Programa académico.                  |
| `code`                | texto corto | único, requerido     | Código institucional del estudiante. |
| `institutional_email` | texto       | único, opcional      | Correo institucional.                |
| `admission_period`    | texto corto | opcional             | Periodo o año de admisión.           |
| `status`              | enum        | requerido            | Estado académico.                    |
| `created_at`          | fecha-hora  | requerido            | Fecha de creación.                   |
| `updated_at`          | fecha-hora  | requerido            | Fecha de actualización.              |
| `deleted_at`          | fecha-hora  | opcional             | Baja lógica.                         |

Enum sugerido:

```txt
student_status:
- ACTIVE
- INACTIVE
- SUSPENDED
- WITHDRAWN
- GRADUATED
```

Restricciones:

```txt
- `code` es único entre registros activos.
- `person_id` es único entre registros activos.
- `institutional_email` es único entre registros activos, cuando exista.
```

Relaciones:

```txt
students N:1 academic_programs
students 1:N enrollments
```

Reglas relacionadas:

```txt
- Un estudiante activo puede inscribirse si cumple las demás condiciones.
- Un estudiante suspendido, retirado o egresado no debería inscribirse si la institución lo restringe.
- No debe duplicarse por código institucional entre registros activos.
```

## `professors`

Representa a un docente.

| Campo                 | Tipo lógico | Restricciones        | Descripción                            |
| --------------------- | ----------- | -------------------- | -------------------------------------- |
| `id`                  | UUID        | PK                   | Identificador del docente.             |
| `person_id`           | UUID        | FK, único, requerido | Persona asociada.                      |
| `code`                | texto corto | único, requerido     | Código institucional del docente.      |
| `institutional_email` | texto       | único, opcional      | Correo institucional.                  |
| `department`          | texto       | opcional             | Unidad, departamento o área académica. |
| `specialty`           | texto       | opcional             | Especialidad.                          |
| `status`              | enum        | requerido            | Estado operativo.                      |
| `created_at`          | fecha-hora  | requerido            | Fecha de creación.                     |
| `updated_at`          | fecha-hora  | requerido            | Fecha de actualización.                |
| `deleted_at`          | fecha-hora  | opcional             | Baja lógica.                           |

Enum sugerido:

```txt
professor_status:
- ACTIVE
- INACTIVE
- ON_LEAVE
```

Restricciones:

```txt
- `code` es único entre registros activos.
- `person_id` es único entre registros activos.
- `institutional_email` es único entre registros activos, cuando exista.
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

| Campo           | Tipo lógico | Restricciones    | Descripción                |
| --------------- | ----------- | ---------------- | -------------------------- |
| `id`            | UUID        | PK               | Identificador.             |
| `code`          | texto corto | único, requerido | Código del programa.       |
| `name`          | texto       | único, requerido | Nombre del programa.       |
| `academic_unit` | texto       | opcional         | Unidad académica asociada. |
| `created_at`    | fecha-hora  | requerido        | Fecha de creación.         |
| `updated_at`    | fecha-hora  | requerido        | Fecha de actualización.    |
| `deleted_at`    | fecha-hora  | opcional         | Baja lógica.               |

Restricciones:

```txt
- `code` es único entre registros activos.
- `name` es único entre registros activos.
```

Relaciones:

```txt
academic_programs 1:N students
academic_programs 1:N courses
```

## `course_categories`

Representa una clasificación de curso.

Se modela como tabla catálogo porque sus valores pueden variar según la institución.

| Campo         | Tipo lógico | Restricciones    | Descripción             |
| ------------- | ----------- | ---------------- | ----------------------- |
| `id`          | UUID        | PK               | Identificador.          |
| `code`        | texto corto | único, requerido | Código de categoría.    |
| `name`        | texto       | único, requerido | Nombre de categoría.    |
| `description` | texto       | opcional         | Descripción.            |
| `created_at`  | fecha-hora  | requerido        | Fecha de creación.      |
| `updated_at`  | fecha-hora  | requerido        | Fecha de actualización. |
| `deleted_at`  | fecha-hora  | opcional         | Baja lógica.            |

Restricciones:

```txt
- `code` es único entre registros activos.
- `name` es único entre registros activos.
```

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

| Campo                 | Tipo lógico | Restricciones | Descripción             |
| --------------------- | ----------- | ------------- | ----------------------- |
| `id`                  | UUID        | PK            | Identificador.          |
| `academic_program_id` | UUID        | FK, requerido | Programa académico.     |
| `course_category_id`  | UUID        | FK, opcional  | Categoría.              |
| `code`                | texto corto | requerido     | Código del curso.       |
| `name`                | texto       | requerido     | Nombre del curso.       |
| `description`         | texto       | opcional      | Descripción.            |
| `credits`             | entero      | requerido     | Créditos.               |
| `hours`               | entero      | opcional      | Horas académicas.       |
| `created_at`          | fecha-hora  | requerido     | Fecha de creación.      |
| `updated_at`          | fecha-hora  | requerido     | Fecha de actualización. |
| `deleted_at`          | fecha-hora  | opcional      | Baja lógica.            |

Restricciones:

```txt
- `academic_program_id` + `code` debe ser único entre registros activos.
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

| Campo                   | Tipo lógico | Restricciones    | Descripción              |
| ----------------------- | ----------- | ---------------- | ------------------------ |
| `id`                    | UUID        | PK               | Identificador.           |
| `code`                  | texto corto | único, requerido | Código del periodo.      |
| `name`                  | texto       | requerido        | Nombre del periodo.      |
| `start_date`            | fecha       | requerido        | Fecha de inicio.         |
| `end_date`              | fecha       | requerido        | Fecha de cierre.         |
| `enrollment_start_date` | fecha       | opcional         | Inicio de inscripciones. |
| `enrollment_end_date`   | fecha       | opcional         | Fin de inscripciones.    |
| `status`                | enum        | requerido        | Estado del periodo.      |
| `created_at`            | fecha-hora  | requerido        | Fecha de creación.       |
| `updated_at`            | fecha-hora  | requerido        | Fecha de actualización.  |
| `deleted_at`            | fecha-hora  | opcional         | Baja lógica.             |

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
- `code` es único entre registros activos.
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

| Campo                | Tipo lógico | Restricciones | Descripción                               |
| -------------------- | ----------- | ------------- | ----------------------------------------- |
| `id`                 | UUID        | PK            | Identificador.                            |
| `course_id`          | UUID        | FK, requerido | Curso asociado.                           |
| `academic_period_id` | UUID        | FK, requerido | Periodo académico.                        |
| `professor_id`       | UUID        | FK, opcional  | Docente asignado.                         |
| `section`            | texto corto | requerido     | Sección.                                  |
| `max_capacity`       | entero      | requerido     | Cupo máximo.                              |
| `available_capacity` | entero      | opcional      | Cupo disponible si se decide persistirlo. |
| `status`             | enum        | requerido     | Estado de la oferta.                      |
| `created_at`         | fecha-hora  | requerido     | Fecha de creación.                        |
| `updated_at`         | fecha-hora  | requerido     | Fecha de actualización.                   |
| `deleted_at`         | fecha-hora  | opcional      | Baja lógica.                              |

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
- `course_id` + `academic_period_id` + `section` debe ser único entre registros activos.
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

| Campo                   | Tipo lógico | Restricciones | Descripción                              |
| ----------------------- | ----------- | ------------- | ---------------------------------------- |
| `id`                    | UUID        | PK            | Identificador.                           |
| `student_id`            | UUID        | FK, requerido | Estudiante.                              |
| `course_offering_id`    | UUID        | FK, requerido | Oferta.                                  |
| `status`                | enum        | requerido     | Estado actual.                           |
| `enrolled_at`           | fecha-hora  | requerido     | Fecha de inscripción.                    |
| `registered_by_user_id` | UUID        | FK, requerido | Usuario responsable.                     |
| `status_reason`         | texto       | opcional      | Motivo del estado actual cuando aplique. |
| `created_at`            | fecha-hora  | requerido     | Fecha de creación.                       |
| `updated_at`            | fecha-hora  | requerido     | Fecha de actualización.                  |
| `deleted_at`            | fecha-hora  | opcional      | Baja lógica.                             |

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
- `student_id` + `course_offering_id` debe ser único entre inscripciones activas.
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

| Campo                | Tipo lógico | Restricciones | Descripción          |
| -------------------- | ----------- | ------------- | -------------------- |
| `id`                 | UUID        | PK            | Identificador.       |
| `enrollment_id`      | UUID        | FK, requerido | Inscripción.         |
| `previous_status`    | enum        | opcional      | Estado anterior.     |
| `new_status`         | enum        | requerido     | Nuevo estado.        |
| `reason`             | texto       | opcional      | Motivo del cambio.   |
| `changed_by_user_id` | UUID        | FK, requerido | Usuario responsable. |
| `created_at`         | fecha-hora  | requerido     | Fecha del evento.    |

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

| Campo           | Tipo lógico | Restricciones       | Descripción              |
| --------------- | ----------- | ------------------- | ------------------------ |
| `id`            | UUID        | PK                  | Identificador.           |
| `person_id`     | UUID        | FK, opcional, único | Persona asociada.        |
| `email`         | texto       | único, requerido    | Correo de acceso.        |
| `password_hash` | texto       | requerido           | Hash de contraseña.      |
| `status`        | enum        | requerido           | Estado del usuario.      |
| `last_login_at` | fecha-hora  | opcional            | Último inicio de sesión. |
| `created_at`    | fecha-hora  | requerido           | Fecha de creación.       |
| `updated_at`    | fecha-hora  | requerido           | Fecha de actualización.  |
| `deleted_at`    | fecha-hora  | opcional            | Baja lógica.             |

Enum sugerido:

```txt
user_status:
- ACTIVE
- INACTIVE
- BLOCKED
```

Restricciones:

```txt
- `email` es único entre registros activos.
- `person_id` es único entre registros activos, cuando exista.
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

| Campo         | Tipo lógico | Restricciones    | Descripción                        |
| ------------- | ----------- | ---------------- | ---------------------------------- |
| `id`          | UUID        | PK               | Identificador.                     |
| `code`        | texto corto | único, requerido | Código del rol.                    |
| `name`        | texto       | único, requerido | Nombre visible.                    |
| `description` | texto       | opcional         | Descripción.                       |
| `is_system`   | booleano    | requerido        | Indica si es rol base del sistema. |
| `created_at`  | fecha-hora  | requerido        | Fecha de creación.                 |
| `updated_at`  | fecha-hora  | requerido        | Fecha de actualización.            |
| `deleted_at`  | fecha-hora  | opcional         | Baja lógica.                       |

Restricciones:

```txt
- `code` es único entre registros activos.
- `name` es único entre registros activos.
```

Ejemplos:

```txt
ADMIN
ACADEMIC_COORDINATOR
SECRETARY
PROFESSOR
REPORT_VIEWER
```

Los roles no tienen un enum de estado. Su vigencia se representa con baja lógica. Un rol dado de baja no se asigna a nuevos usuarios, pero se conserva para no romper la información histórica. Los roles con `is_system = true` no deberían darse de baja desde operaciones comunes.

## `permissions`

Representa una acción permitida dentro del sistema.

| Campo         | Tipo lógico | Restricciones    | Descripción                            |
| ------------- | ----------- | ---------------- | -------------------------------------- |
| `id`          | UUID        | PK               | Identificador.                         |
| `code`        | texto       | único, requerido | Código del permiso.                    |
| `name`        | texto       | requerido        | Nombre visible.                        |
| `description` | texto       | opcional         | Descripción.                           |
| `module`      | texto corto | requerido        | Módulo o capacidad asociada.           |
| `is_system`   | booleano    | requerido        | Indica si es permiso base del sistema. |
| `created_at`  | fecha-hora  | requerido        | Fecha de creación.                     |
| `updated_at`  | fecha-hora  | requerido        | Fecha de actualización.                |
| `deleted_at`  | fecha-hora  | opcional         | Baja lógica.                           |

Restricciones:

```txt
- `code` es único entre registros activos.
```

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

Los permisos no deben ser excesivamente granulares en la primera versión. Los permisos con `is_system = true` no deberían eliminarse libremente, porque el código los usa para proteger endpoints.

## `user_roles`

Tabla intermedia entre usuarios y roles.

| Campo                 | Tipo lógico | Restricciones    | Descripción          |
| --------------------- | ----------- | ---------------- | -------------------- |
| `user_id`             | UUID        | PK compuesta, FK | Usuario.             |
| `role_id`             | UUID        | PK compuesta, FK | Rol.                 |
| `assigned_by_user_id` | UUID        | FK, opcional     | Usuario que asignó.  |
| `assigned_at`         | fecha-hora  | requerido        | Fecha de asignación. |

Restricciones:

```txt
- `user_id` + `role_id` debe ser único.
```

Esta tabla no maneja baja lógica, por lo que la unicidad es global.

## `role_permissions`

Tabla intermedia entre roles y permisos.

| Campo                 | Tipo lógico | Restricciones    | Descripción          |
| --------------------- | ----------- | ---------------- | -------------------- |
| `role_id`             | UUID        | PK compuesta, FK | Rol.                 |
| `permission_id`       | UUID        | PK compuesta, FK | Permiso.             |
| `assigned_by_user_id` | UUID        | FK, opcional     | Usuario que asignó.  |
| `assigned_at`         | fecha-hora  | requerido        | Fecha de asignación. |

Restricciones:

```txt
- `role_id` + `permission_id` debe ser único.
```

Esta tabla no maneja baja lógica, por lo que la unicidad es global.

## `user_sessions`

Representa una sesión de usuario.

Permite controlar sesiones activas, cerrar sesión, revocar accesos y limitar una o varias sesiones por usuario.

| Campo                | Tipo lógico | Restricciones   | Descripción                               |
| -------------------- | ----------- | --------------- | ----------------------------------------- |
| `id`                 | UUID        | PK              | Identificador de sesión.                  |
| `user_id`            | UUID        | FK, requerido   | Usuario.                                  |
| `refresh_token_hash` | texto       | opcional        | Hash del refresh token.                   |
| `access_token_jti`   | texto       | opcional, único | Identificador del access token si se usa. |
| `device_name`        | texto       | opcional        | Nombre del dispositivo.                   |
| `ip_address`         | texto       | opcional        | IP de origen.                             |
| `user_agent`         | texto       | opcional        | Cliente o navegador.                      |
| `status`             | enum        | requerido       | Estado de la sesión.                      |
| `created_at`         | fecha-hora  | requerido       | Fecha de creación.                        |
| `expires_at`         | fecha-hora  | requerido       | Fecha de expiración.                      |
| `revoked_at`         | fecha-hora  | opcional        | Fecha de revocación.                      |
| `last_used_at`       | fecha-hora  | opcional        | Último uso.                               |

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
- `access_token_jti` es único cuando exista.
```

Las sesiones no manejan baja lógica, por lo que su unicidad es global.

## Auditoría

## `audit_logs`

Registra acciones relevantes del sistema.

Es una tabla histórica de solo inserción.

| Campo           | Tipo lógico | Restricciones | Descripción                    |
| --------------- | ----------- | ------------- | ------------------------------ |
| `id`            | UUID        | PK            | Identificador.                 |
| `actor_user_id` | UUID        | FK, opcional  | Usuario responsable.           |
| `action`        | texto corto | requerido     | Acción realizada.              |
| `resource_type` | texto corto | requerido     | Tipo de recurso afectado.      |
| `resource_id`   | UUID/texto  | opcional      | Identificador del recurso.     |
| `module`        | texto corto | opcional      | Módulo relacionado.            |
| `description`   | texto       | opcional      | Descripción breve.             |
| `metadata`      | JSON        | opcional      | Datos adicionales controlados. |
| `ip_address`    | texto       | opcional      | IP del actor.                  |
| `user_agent`    | texto       | opcional      | Cliente del actor.             |
| `created_at`    | fecha-hora  | requerido     | Fecha del evento.              |

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
= resumen y resultado de la importación
```

No se crea una tabla genérica `imports` mientras la importación solo pertenezca a estudiantes. Si en el futuro varias entidades requieren importación común, puede evaluarse una capacidad transversal.

El detalle por fila no se persiste en una tabla relacional. Los errores se guardan en un campo `errors` de tipo `JSONB` dentro de `student_imports`, junto con el progreso y el resultado del proceso. Esta decisión evita insertar una fila por cada registro procesado en una tabla adicional, lo cual es costoso cuando se importan archivos con miles de filas.

## `student_imports`

Representa el resumen y resultado de una importación de estudiantes.

| Campo                | Tipo lógico | Restricciones | Descripción                                               |
| -------------------- | ----------- | ------------- | --------------------------------------------------------- |
| `id`                 | UUID        | PK            | Identificador.                                            |
| `file_name`          | texto       | requerido     | Nombre del archivo.                                       |
| `file_extension`     | texto corto | requerido     | Extensión del archivo (`csv`, `xlsx`).                    |
| `file_hash`          | texto corto | requerido     | Hash SHA-256 del archivo para detectar duplicados.        |
| `file_content`       | binario     | requerido     | Contenido del archivo almacenado en la base.              |
| `file_size`          | entero      | opcional      | Tamaño del archivo en bytes.                              |
| `file_mime_type`     | texto       | opcional      | Tipo MIME del archivo.                                    |
| `status`             | enum        | requerido     | Estado del proceso.                                       |
| `total_rows`         | entero      | requerido     | Total de filas detectadas.                                |
| `processed_rows`     | entero      | requerido     | Filas procesadas.                                         |
| `accepted_rows`      | entero      | requerido     | Filas aceptadas.                                          |
| `rejected_rows`      | entero      | requerido     | Filas rechazadas.                                         |
| `duplicated_rows`    | entero      | requerido     | Filas duplicadas.                                         |
| `observed_rows`      | entero      | requerido     | Filas observadas.                                         |
| `errors`             | JSON        | opcional      | Lista de errores por fila: `{ row, reasons[] }`.          |
| `failure_reason`     | texto       | opcional      | Motivo de error catastrófico, por ejemplo caída de la BD. |
| `created_by_user_id` | UUID        | FK, requerido | Usuario responsable.                                      |
| `started_at`         | fecha-hora  | opcional      | Fecha de inicio de procesamiento.                         |
| `finished_at`        | fecha-hora  | opcional      | Fecha de finalización.                                    |
| `created_at`         | fecha-hora  | requerido     | Fecha de creación.                                        |
| `updated_at`         | fecha-hora  | requerido     | Fecha de actualización.                                   |

Enum sugerido:

```txt
student_import_status:
- PENDING
- PROCESSING
- COMPLETED
- COMPLETED_WITH_ERRORS
- FAILED
```

Restricciones:

```txt
- `created_by_user_id` + `file_hash` debe ser único. Un mismo usuario no puede subir dos veces el mismo archivo.
```

Esta tabla no maneja baja lógica, por lo que la unicidad es global.

Relaciones:

```txt
student_imports N:1 users
```

Notas:

```txt
- Permite saber quién importó, cuándo, qué archivo se procesó y cuál fue el resultado.
- El campo `errors` guarda el detalle por fila en JSONB: arreglo de `{ row, reasons }`.
- El campo `failure_reason` se usa para errores catastróficos, no para errores por fila.
- `processed_rows` permite guardar checkpoints durante el procesamiento y reanudar sin reprocesar todo.
- El estado no cambia a un valor final al guardar checkpoints, solo avanza el progreso.
- No reemplaza a la auditoría; la complementa con detalle operativo del proceso.
- El procesamiento puede ejecutarse de forma asíncrona a través de un job.
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
```

## Restricciones principales

Restricciones de unicidad entre registros activos (`deleted_at IS NULL`):

```txt
document_types.code
document_types.name
persons.document_type_id + persons.document_number
persons.email cuando exista
students.code
students.person_id
students.institutional_email cuando exista
professors.code
professors.person_id
professors.institutional_email cuando exista
academic_programs.code
academic_programs.name
courses.academic_program_id + courses.code
course_categories.code
course_categories.name
academic_periods.code
course_offerings.course_id + academic_period_id + section
enrollments.student_id + course_offering_id
users.email
users.person_id cuando exista
roles.code
roles.name
permissions.code
```

Restricciones de unicidad global (tablas sin baja lógica):

```txt
user_roles.user_id + role_id
role_permissions.role_id + permission_id
user_sessions.access_token_jti cuando exista
student_imports.created_by_user_id + file_hash
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
- No crear estudiante duplicado por documento o código institucional entre registros activos.
- No usar un registro dado de baja para nuevas relaciones.
- No aceptar una importación si ya existe otra del mismo usuario con el mismo hash de archivo.
- No procesar dos veces la misma fila dentro de una importación.
- Si una importación falla, el worker puede reanudar desde `processed_rows` sin reprocesar las filas ya aceptadas.
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
persons.deleted_at
students.code
students.academic_program_id
students.status
students.deleted_at
professors.deleted_at
academic_programs.deleted_at
courses.code
courses.deleted_at
academic_periods.status
academic_periods.deleted_at
course_offerings.academic_period_id
course_offerings.course_id
course_offerings.professor_id
course_offerings.status
course_offerings.deleted_at
enrollments.student_id
enrollments.course_offering_id
enrollments.status
enrollments.deleted_at
users.email
users.deleted_at
user_sessions.user_id
user_sessions.status
audit_logs.actor_user_id
audit_logs.resource_type
audit_logs.resource_id
audit_logs.created_at
student_imports.created_by_user_id
student_imports.status
student_imports.created_at
```

Los índices únicos parciales con `WHERE deleted_at IS NULL` también se consideran parte de los índices recomendados. Se declaran aparte porque combinan unicidad y filtro de vigencia.

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
= proceso controlado de carga de estudiantes con resumen y errores en JSONB

Auditoría
= evidencia de acciones relevantes
```

La unicidad sobre registros activos permite que un registro dado de baja no bloquee nuevas altas, manteniendo a la vez el historial completo del sistema.

Esta separación permite que el sistema mantenga consistencia, trazabilidad y control sin duplicar información innecesaria.
