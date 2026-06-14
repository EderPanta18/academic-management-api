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
- Persistir importaciones de estudiantes con detalle por fila.
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
student_import_rows
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

## Enums

Los estados con pocos valores y comportamiento estable se modelan como enums.

Enums definidos:

```txt
record_status
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

Esto evita crear tablas innecesarias para valores que forman parte del comportamiento interno del sistema.

## Catálogos

Algunos valores se modelan como tablas porque pueden variar o administrarse.

Tablas catálogo:

```txt
document_types
course_categories
```

Estas tablas permiten activar, desactivar, describir o ampliar valores sin tocar enums internos.

## Identidad personal

## `document_types`

Define tipos de documento.

Relación principal:

```txt
document_types 1:N persons
```

Restricciones principales:

```txt
code único
name único
```

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
document_type_id + document_number único
```

La persona no representa una cuenta de acceso ni un rol académico por sí misma.

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
person_id único
code único
institutional_email único cuando exista
```

El estado del estudiante se modela con `student_status`.

## `professors`

Representa docentes.

Relaciones principales:

```txt
professors N:1 persons
professors 1:N course_offerings
```

Restricciones principales:

```txt
person_id único
code único
institutional_email único cuando exista
```

El estado del docente se modela con `professor_status`.

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
code único
name único
```

## `course_categories`

Representa categorías administrables de curso.

Relación principal:

```txt
course_categories 1:N courses
```

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
code único
credits > 0
hours > 0 cuando exista
```

Si la institución decide que el código de curso solo es único por programa, puede reemplazarse la unicidad global de `code` por `academic_program_id + code`.

## `academic_periods`

Representa periodos académicos.

Relación principal:

```txt
academic_periods 1:N course_offerings
```

Restricciones principales:

```txt
code único
end_date >= start_date
enrollment_end_date >= enrollment_start_date cuando existan
```

El estado se modela con `academic_period_status`.

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
course_id + academic_period_id + section único
max_capacity > 0
available_capacity >= 0 cuando exista
```

El cupo disponible puede calcularse desde inscripciones activas o persistirse de forma transaccional. El DDL incluye `available_capacity` como campo opcional.

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
student_id + course_offering_id único
```

La regla de si se permite una nueva inscripción después de una cancelación depende de la política institucional. El DDL usa una unicidad directa para evitar duplicidad estricta en la misma oferta.

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
email único
person_id único cuando exista
```

Las contraseñas se guardan como hash.

## `roles`

Agrupa responsabilidades.

Relaciones principales:

```txt
roles N:M users
roles N:M permissions
```

Restricciones principales:

```txt
code único
name único
```

## `permissions`

Representa acciones concretas autorizables.

Relaciones principales:

```txt
permissions N:M roles
```

Restricciones principales:

```txt
code único
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

## `user_roles`

Tabla intermedia entre usuarios y roles.

Restricción principal:

```txt
user_id + role_id PK
```

## `role_permissions`

Tabla intermedia entre roles y permisos.

Restricción principal:

```txt
role_id + permission_id PK
```

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

Si la política exige una sola sesión activa por usuario, el DDL incluye un índice único parcial:

```sql
CREATE UNIQUE INDEX uq_user_sessions_one_active_per_user
ON user_sessions (user_id)
WHERE status = 'ACTIVE';
```

Si se quieren permitir varias sesiones activas, ese índice puede omitirse.

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

Representa el resumen general de una importación.

Relaciones principales:

```txt
student_imports N:1 users
student_imports 1:N student_import_rows
```

Permite saber qué archivo se importó, quién lo hizo, cuándo ocurrió y cuál fue el resultado.

## `student_import_rows`

Representa el detalle por fila de una importación.

Relaciones principales:

```txt
student_import_rows N:1 student_imports
student_import_rows N:1 students opcional
```

Permite revisar datos originales, datos normalizados, errores por campo y resultado de cada fila.

## Índices

El DDL define índices para campos de consulta frecuente.

Ejemplos:

```txt
students.code
students.status
course_offerings.status
enrollments.student_id
users.email
user_sessions.status
audit_logs.created_at
student_import_rows.status
```

Los índices pueden ajustarse según consultas reales del sistema.

## Relación con Prisma

Este DDL funciona como referencia SQL directa.

Si el proyecto usa Prisma, el schema de Prisma debe reflejar:

```txt
- Las mismas tablas.
- Las mismas relaciones.
- Los mismos enums.
- Las mismas restricciones de unicidad.
- Los mismos campos de auditoría temporal.
```

En Prisma, algunas restricciones parciales de PostgreSQL pueden requerir migraciones SQL manuales, especialmente índices únicos parciales como una sola sesión activa por usuario.

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

student_imports / student_import_rows
= importación detallada de estudiantes

audit_logs
= evidencia de acciones relevantes
```

Esta separación permite consistencia, trazabilidad y crecimiento sin duplicar información innecesaria.
