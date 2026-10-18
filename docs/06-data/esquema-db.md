# Esquema de base de datos

Este documento describe el esquema relacional propuesto para la base de datos del sistema académico.

El esquema está alineado con el modelado de datos del sistema y con los documentos de producto, arquitectura, API, seguridad y datos. Su objetivo es servir como referencia técnica para entender cómo se traducen las entidades del dominio a tablas, relaciones, restricciones, enums e índices.

El diseño está pensado para PostgreSQL.

## Propósito

El esquema de base de datos debe permitir:

```txt
- Registrar personas, estudiantes y docentes.
- Organizar programas académicos, cursos, periodos y ofertas.
- Registrar inscripciones y cambios de estado.
- Administrar usuarios, roles, permisos y sesiones.
- Mantener auditoría de acciones relevantes.
- Persistir importaciones de estudiantes con su resumen y errores.
```

La base de datos no reemplaza las reglas de aplicación, pero sí debe proteger restricciones estructurales importantes mediante claves primarias, claves foráneas, unicidad, checks e índices.

## Convenciones generales

Las tablas usan nombres en snake_case y plural.

Ejemplos:

```txt
persons
students
course_offerings
user_sessions
student_imports
```

Las columnas también usan snake_case.

Ejemplos:

```txt
created_at
updated_at
deleted_at
student_id
course_offering_id
```

Los identificadores principales usan UUID y son generados por la aplicación.

```txt
id UUID PRIMARY KEY
```

Las tablas operativas principales incluyen:

```txt
created_at
updated_at
deleted_at
```

Las tablas históricas o de solo inserción usan `created_at`, pero no necesariamente `updated_at` ni `deleted_at`.

No todos los recursos tienen un enum de estado. Cuando un recurso no tiene un estado interno propio, su vigencia se representa con `deleted_at`. Un registro con `deleted_at` distinto de `null` se considera dado de baja y no se usa para nuevas relaciones, pero se conserva para no romper la información histórica.

## Generación de identificadores

Los UUID se generan desde el backend o desde el proceso de seed antes de insertar registros.

La base de datos no usa `DEFAULT gen_random_uuid()` para las tablas del sistema. Su responsabilidad es validar claves primarias, unicidad, relaciones e integridad, no producir los identificadores operativos.

Esto aplica también a tablas catálogo como `document_types` y `course_categories` cuando tienen CRUD o pueden administrarse desde el sistema.

En PostgreSQL, las columnas se definen así:

```sql
id UUID PRIMARY KEY
```

y no así:

```sql
id UUID PRIMARY KEY DEFAULT gen_random_uuid()
```

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

## Enums

Los estados con pocos valores y comportamiento estable se modelan como enums.

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

Esto evita crear tablas innecesarias para valores que forman parte del comportamiento interno del sistema.

## Catálogos

Algunos valores se modelan como tablas porque pueden variar o administrarse.

Tablas catálogo:

```txt
document_types
course_categories
```

Estas tablas permiten activar, desactivar, describir o ampliar valores sin tocar enums internos. Su vigencia se representa con `deleted_at`.

## Identidad personal

## `document_types`

Define tipos de documento.

Relación principal:

```txt
document_types 1:N persons
```

Restricciones principales:

```txt
code único entre registros activos
name único entre registros activos
```

Incluye `deleted_at` para baja lógica.

## `persons`

Registra datos personales comunes.

Relaciones principales:

```txt
persons 1:1 students
persons 1:1 professors
persons 1:1 users opcional
```

Restricciones principales:

```txt
document_type_id + document_number único entre registros activos
email único entre registros activos cuando exista
```

La persona no representa una cuenta de acceso ni un rol académico por sí misma. Su vigencia se representa con `deleted_at`.

## Actores académicos

## `students`

Representa estudiantes.

Relaciones principales:

```txt
students N:1 academic_programs
students N:1 persons
students 1:N enrollments
```

Restricciones principales:

```txt
person_id único entre registros activos
code único entre registros activos
institutional_email único entre registros activos cuando exista
```

El estado del estudiante se modela con `student_status`. Además, la tabla incluye `deleted_at` para baja lógica.

## `professors`

Representa docentes.

Relaciones principales:

```txt
professors N:1 persons
professors 1:N course_offerings
```

Restricciones principales:

```txt
person_id único entre registros activos
code único entre registros activos
institutional_email único entre registros activos cuando exista
```

El estado del docente se modela con `professor_status`. Además, la tabla incluye `deleted_at` para baja lógica.

## Estructura académica

## `academic_programs`

Representa programas académicos.

Relaciones principales:

```txt
academic_programs 1:N students
academic_programs 1:N courses
```

Restricciones principales:

```txt
code único entre registros activos
name único entre registros activos
```

No tiene enum de estado. Su vigencia se representa con `deleted_at`.

## `course_categories`

Representa categorías administrables de curso.

Relación principal:

```txt
course_categories 1:N courses
```

Restricciones principales:

```txt
code único entre registros activos
name único entre registros activos
```

Su vigencia se representa con `deleted_at`.

## `courses`

Representa cursos del catálogo académico.

Relaciones principales:

```txt
courses N:1 academic_programs
courses N:1 course_categories
courses 1:N course_offerings
```

Restricciones principales:

```txt
academic_program_id + code único entre registros activos
credits > 0
```

No tiene enum de estado. Su vigencia se representa con `deleted_at`. El código del curso es único dentro de su programa académico, no de forma global.

## `academic_periods`

Representa periodos académicos.

Relación principal:

```txt
academic_periods 1:N course_offerings
```

Restricciones principales:

```txt
code único entre registros activos
end_date >= start_date
enrollment_end_date >= enrollment_start_date cuando existan
```

El estado se modela con `academic_period_status`. Además, la tabla incluye `deleted_at` para baja lógica.

## Oferta e inscripción

## `course_offerings`

Representa un curso disponible dentro de un periodo académico.

Relaciones principales:

```txt
course_offerings N:1 courses
course_offerings N:1 academic_periods
course_offerings N:1 professors
course_offerings 1:N enrollments
```

Restricciones principales:

```txt
course_id + academic_period_id + section único entre registros activos
max_capacity > 0
available_capacity >= 0 cuando exista
```

El cupo disponible puede calcularse desde inscripciones activas o persistirse de forma transaccional. El DDL incluye `available_capacity` como campo opcional.

El estado se modela con `course_offering_status`. Además, la tabla incluye `deleted_at` para baja lógica.

## `enrollments`

Representa la inscripción de un estudiante en una oferta de curso.

Relaciones principales:

```txt
enrollments N:1 students
enrollments N:1 course_offerings
enrollments N:1 users
enrollments 1:N enrollment_status_logs
```

Restricciones principales:

```txt
student_id + course_offering_id único entre registros activos
```

La regla de si se permite una nueva inscripción después de una cancelación depende de la política institucional. El DDL usa una unicidad parcial sobre inscripciones activas para evitar duplicidad estricta en la misma oferta sin bloquear el historial.

El estado se modela con `enrollment_status`. Además, la tabla incluye `deleted_at` para baja lógica.

## `enrollment_status_logs`

Registra cambios de estado de una inscripción.

Es una tabla histórica de solo inserción.

Relaciones principales:

```txt
enrollment_status_logs N:1 enrollments
enrollment_status_logs N:1 users
```

No incluye `updated_at` ni `deleted_at`.

## Acceso y seguridad

## `users`

Representa cuentas de acceso.

Relaciones principales:

```txt
users 1:1 persons opcional
users N:M roles
users 1:N user_sessions
users 1:N enrollments
users 1:N audit_logs
users 1:N student_imports
```

Restricciones principales:

```txt
email único entre registros activos
person_id único entre registros activos cuando exista
```

Las contraseñas se guardan como hash. El estado se modela con `user_status`. Además, la tabla incluye `deleted_at` para baja lógica.

## `roles`

Agrupa responsabilidades.

Relaciones principales:

```txt
roles N:M users
roles N:M permissions
```

Restricciones principales:

```txt
code único entre registros activos
name único entre registros activos
```

No tiene enum de estado. Su vigencia se representa con `deleted_at`. El campo `is_system` identifica los roles base del sistema, que no deberían darse de baja desde operaciones comunes.

## `permissions`

Representa acciones concretas autorizables.

Relaciones principales:

```txt
permissions N:M roles
```

Restricciones principales:

```txt
code único entre registros activos
```

Convención:

```txt
recurso.accion
```

Ejemplos:

```txt
students.import
enrollments.create
roles.assign-permissions
```

No tiene enum de estado. Su vigencia se representa con `deleted_at`. El campo `is_system` identifica los permisos base del sistema, que el código usa para proteger endpoints.

## `user_roles`

Tabla intermedia entre usuarios y roles.

Restricción principal:

```txt
user_id + role_id PK
```

Esta tabla no maneja baja lógica, por lo que su unicidad es global.

## `role_permissions`

Tabla intermedia entre roles y permisos.

Restricción principal:

```txt
role_id + permission_id PK
```

Esta tabla no maneja baja lógica, por lo que su unicidad es global.

## `user_sessions`

Representa sesiones de usuario.

Relaciones principales:

```txt
user_sessions N:1 users
```

Restricciones principales:

```txt
access_token_jti único cuando exista
```

El estado se modela con `session_status`.

Si la política exige una sola sesión activa por usuario, el DDL incluye un índice único parcial:

```sql
CREATE UNIQUE INDEX uq_user_sessions_one_active_per_user
ON user_sessions (user_id)
WHERE status = 'ACTIVE';
```

Si se quieren permitir varias sesiones activas, ese índice puede omitirse.

Las sesiones no manejan baja lógica, por lo que su unicidad es global.

## Auditoría

## `audit_logs`

Registra acciones relevantes del sistema.

Relación principal:

```txt
audit_logs N:1 users
```

Es una tabla de solo inserción. No incluye `updated_at` ni `deleted_at`.

El campo `metadata` es `JSONB` para guardar datos adicionales controlados.

No debe almacenar contraseñas, tokens ni secretos.

## Importación de estudiantes

La importación de estudiantes pertenece funcionalmente al módulo `students`.

## `student_imports`

Representa el resumen y resultado de una importación.

Relaciones principales:

```txt
student_imports N:1 users
```

Permite saber qué archivo se importó, quién lo hizo, cuándo ocurrió y cuál fue el resultado. El estado se modela con `student_import_status`.

Campos principales:

```txt
file_name
file_extension
file_hash
file_content
file_size
file_mime_type
status
total_rows
processed_rows
accepted_rows
rejected_rows
duplicated_rows
observed_rows
errors
failure_reason
created_by_user_id
started_at
finished_at
```

Restricciones principales:

```txt
created_by_user_id + file_hash único
```

El campo `file_hash` guarda el hash SHA-256 del archivo para detectar reimportaciones del mismo usuario. El campo `file_extension` permite saber si el worker debe parsear como CSV o Excel. El campo `errors` es `JSONB` y guarda un arreglo de `{ row, reasons[] }` con los errores por fila. El campo `failure_reason` se usa para errores catastróficos, no para errores por fila. El campo `processed_rows` permite guardar checkpoints durante el procesamiento y reanudar sin reprocesar todo.

Esta tabla no maneja baja lógica, por lo que su unicidad es global.

El detalle por fila no se persiste en una tabla relacional. Se guarda en el campo `errors` como `JSONB`, lo que evita insertar una fila por cada registro procesado en una tabla adicional cuando se importan archivos con miles de filas.

## Índices

El DDL define índices para campos de consulta frecuente.

Ejemplos:

```txt
persons.document_number
persons.deleted_at
students.code
students.status
students.deleted_at
professors.deleted_at
academic_programs.deleted_at
courses.deleted_at
academic_periods.deleted_at
course_offerings.status
course_offerings.deleted_at
enrollments.student_id
enrollments.deleted_at
users.email
users.deleted_at
user_sessions.status
audit_logs.created_at
student_imports.status
student_imports.created_at
```

Los índices pueden ajustarse según consultas reales del sistema.

Los índices únicos parciales con `WHERE deleted_at IS NULL` también forman parte de los índices del esquema. Se declaran aparte porque combinan unicidad y filtro de vigencia.

## Relación con Prisma

Este DDL funciona como referencia SQL directa.

Si el proyecto usa Prisma, el schema de Prisma debe reflejar:

```txt
- Las mismas tablas.
- Las mismas relaciones.
- Los mismos enums.
- Los mismos campos de auditoría temporal.
```

En Prisma, algunas restricciones parciales de PostgreSQL pueden requerir migraciones SQL manuales, especialmente índices únicos parciales como:

```txt
- Restricciones únicas sobre registros activos (`WHERE deleted_at IS NULL`).
- Una sola sesión activa por usuario (`WHERE status = 'ACTIVE'`).
```

## Criterio general

El esquema mantiene separadas las responsabilidades:

```txt
persons
= identidad personal

students / professors
= perfiles académicos

users
= cuentas de acceso

roles / permissions
= autorización

user_sessions
= sesiones activas o revocadas

courses
= catálogo académico

course_offerings
= curso disponible en un periodo

enrollments
= vínculo entre estudiante y oferta

student_imports
= importación de estudiantes con resumen y errores en JSONB

audit_logs
= evidencia de acciones relevantes
```

La unicidad sobre registros activos permite que un registro dado de baja no bloquee nuevas altas, manteniendo a la vez el historial completo del sistema.

Esta separación permite consistencia, trazabilidad y crecimiento sin duplicar información innecesaria.
