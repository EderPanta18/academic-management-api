# Datos semilla

Este documento define los datos iniciales que el sistema necesita para arrancar de forma coherente.

Los datos semilla no son datos de prueba casuales. Representan valores base que permiten que el backend funcione desde el primer despliegue: catálogos mínimos, roles, permisos, usuario administrador y, solo cuando corresponde, datos académicos de desarrollo.

## Propósito

Los seeds responden a estas preguntas:

```txt
¿Qué datos necesita el sistema para iniciar?
¿Qué valores deben existir antes de operar?
¿Qué permisos base protegen los endpoints?
¿Qué roles iniciales agrupan esos permisos?
¿Qué catálogos mínimos permiten crear estudiantes, docentes, cursos e inscripciones?
Qué datos deben existir solo en desarrollo?
```

Los seeds deben ser repetibles, seguros e idempotentes.

Idempotente significa que se pueden ejecutar varias veces sin crear duplicados.


## Generación de identificadores

Los seeds deben generar los UUID desde la aplicación o desde el propio proceso de seed.

La base de datos no debe depender de `DEFAULT gen_random_uuid()` para crear identificadores. Esto mantiene el mismo criterio usado por el backend: el identificador se crea antes de persistir el registro.

Criterios:

```txt
- Generar UUID en el seed antes de insertar.
- Usar códigos únicos para hacer upsert.
- No depender de IDs autogenerados por la base de datos.
- Mantener IDs estables solo cuando una prueba automatizada lo necesite.
```

Esto aplica también a catálogos base como `document_types` y `course_categories`, porque pueden tener CRUD o ser administrados desde el sistema.

## Criterio general

Los datos semilla deben limitarse a información base.

Sí corresponde sembrar:

```txt
- Tipos de documento.
- Categorías de curso iniciales.
- Roles base.
- Permisos base.
- Relación entre roles y permisos.
- Usuario administrador inicial.
- Relación entre usuario administrador y rol ADMIN.
- Datos académicos mínimos solo en entorno de desarrollo.
```

No corresponde sembrar como base obligatoria:

```txt
- Grandes volúmenes de estudiantes.
- Inscripciones reales.
- Sesiones activas.
- Auditoría ficticia.
- Importaciones ficticias en producción.
- Datos sensibles reales.
- Contraseñas en texto plano.
```

## Separación por entorno

Los seeds deben diferenciar entorno.

```txt
base
= datos necesarios para que el sistema funcione

development
= datos de ejemplo para probar el flujo

testing
= datos mínimos para pruebas automatizadas

production
= datos estrictamente necesarios y seguros
```

En producción no deben sembrarse estudiantes, docentes, cursos, ofertas o inscripciones ficticias.

## Orden recomendado de ejecución

El orden debe respetar dependencias.

```txt
1. Catálogos base.
2. Permisos.
3. Roles.
4. Relación rol-permiso.
5. Persona del administrador si aplica.
6. Usuario administrador.
7. Relación usuario-rol.
8. Datos académicos base para desarrollo.
9. Ofertas e inscripciones de ejemplo para desarrollo.
```

Los enums no se siembran como filas si están definidos en Prisma/PostgreSQL. Se usan desde el schema.

## Catálogos base

## Tipos de documento

Tabla:

```txt
document_types
```

Datos sugeridos:

| code | name | is_active |
| --- | --- | --- |
| `DNI` | Documento Nacional de Identidad | true |
| `CE` | Carné de Extranjería | true |
| `PASSPORT` | Pasaporte | true |

Estos valores pueden ajustarse según la institución o país.

## Categorías de curso

Tabla:

```txt
course_categories
```

Datos sugeridos:

| code | name | is_active |
| --- | --- | --- |
| `GENERAL` | Formación general | true |
| `SPECIALTY` | Especialidad | true |
| `ELECTIVE` | Electivo | true |
| `LABORATORY` | Laboratorio | true |

Si la institución no requiere categorías administrables, este catálogo puede mantenerse mínimo.

## Roles base

Tabla:

```txt
roles
```

Roles sugeridos:

| code | name | Descripción |
| --- | --- | --- |
| `ADMIN` | Administrador | Acceso completo al sistema. |
| `ACADEMIC_COORDINATOR` | Coordinación académica | Gestiona estructura académica, periodos, cursos, ofertas y reportes. |
| `SECRETARY` | Secretaría académica | Gestiona estudiantes, importaciones e inscripciones. |
| `PROFESSOR` | Docente | Consulta información académica relacionada. |
| `REPORT_VIEWER` | Consulta académica | Consulta reportes. |

Campos recomendados:

```txt
is_system = true
status = ACTIVE
```

Los roles base no deberían eliminarse físicamente.

## Permisos base

Tabla:

```txt
permissions
```

Los permisos deben seguir la convención:

```txt
recurso.accion
```

Los permisos base deben coincidir con los endpoints protegidos documentados en la API y con los guards del sistema.

## Permisos de usuarios

| code | module | Descripción |
| --- | --- | --- |
| `users.read` | users | Consultar usuarios. |
| `users.create` | users | Crear usuarios. |
| `users.update` | users | Actualizar usuarios. |
| `users.disable` | users | Desactivar usuarios. |
| `users.assign-roles` | users | Asignar roles a usuarios. |

## Permisos de roles y permisos

| code | module | Descripción |
| --- | --- | --- |
| `roles.read` | roles | Consultar roles. |
| `roles.create` | roles | Crear roles. |
| `roles.update` | roles | Actualizar roles. |
| `roles.disable` | roles | Desactivar roles. |
| `roles.assign-permissions` | roles | Asignar permisos a roles. |
| `permissions.read` | permissions | Consultar permisos. |
| `permissions.assign` | permissions | Asignar permisos. |

## Permisos de personas

| code | module | Descripción |
| --- | --- | --- |
| `persons.read` | persons | Consultar personas. |
| `persons.create` | persons | Crear personas. |
| `persons.update` | persons | Actualizar personas. |

## Permisos de estudiantes

| code | module | Descripción |
| --- | --- | --- |
| `students.read` | students | Consultar estudiantes. |
| `students.create` | students | Crear estudiantes. |
| `students.update` | students | Actualizar estudiantes. |
| `students.disable` | students | Desactivar estudiantes. |
| `students.import` | students | Importar estudiantes. |
| `students.imports.read` | students | Consultar importaciones de estudiantes. |
| `students.imports.rows.read` | students | Consultar detalle por fila de importaciones. |

Los permisos de consulta de importación permiten revisar historial y errores minuciosos sin dar permiso para ejecutar nuevas importaciones.

## Permisos de docentes

| code | module | Descripción |
| --- | --- | --- |
| `professors.read` | professors | Consultar docentes. |
| `professors.create` | professors | Crear docentes. |
| `professors.update` | professors | Actualizar docentes. |
| `professors.disable` | professors | Desactivar docentes. |

## Permisos de programas académicos

| code | module | Descripción |
| --- | --- | --- |
| `academic-programs.read` | academic-programs | Consultar programas académicos. |
| `academic-programs.create` | academic-programs | Crear programas académicos. |
| `academic-programs.update` | academic-programs | Actualizar programas académicos. |
| `academic-programs.disable` | academic-programs | Desactivar programas académicos. |

## Permisos de cursos

| code | module | Descripción |
| --- | --- | --- |
| `courses.read` | courses | Consultar cursos. |
| `courses.create` | courses | Crear cursos. |
| `courses.update` | courses | Actualizar cursos. |
| `courses.disable` | courses | Desactivar cursos. |

## Permisos de periodos académicos

| code | module | Descripción |
| --- | --- | --- |
| `academic-periods.read` | academic-periods | Consultar periodos. |
| `academic-periods.create` | academic-periods | Crear periodos. |
| `academic-periods.update` | academic-periods | Actualizar periodos. |
| `academic-periods.close` | academic-periods | Cerrar periodos. |
| `academic-periods.cancel` | academic-periods | Cancelar periodos. |

## Permisos de ofertas de curso

| code | module | Descripción |
| --- | --- | --- |
| `course-offerings.read` | course-offerings | Consultar ofertas. |
| `course-offerings.create` | course-offerings | Crear ofertas. |
| `course-offerings.update` | course-offerings | Actualizar ofertas. |
| `course-offerings.close` | course-offerings | Cerrar ofertas. |
| `course-offerings.reopen` | course-offerings | Reabrir ofertas. |
| `course-offerings.cancel` | course-offerings | Cancelar ofertas. |
| `course-offerings.read-own` | course-offerings | Consultar ofertas propias. |

## Permisos de inscripciones

| code | module | Descripción |
| --- | --- | --- |
| `enrollments.read` | enrollments | Consultar inscripciones. |
| `enrollments.create` | enrollments | Registrar inscripciones. |
| `enrollments.cancel` | enrollments | Cancelar inscripciones. |
| `enrollments.change-status` | enrollments | Cambiar estado de inscripción. |
| `enrollments.read-own` | enrollments | Consultar inscripciones relacionadas al usuario. |

## Permisos de reportes

| code | module | Descripción |
| --- | --- | --- |
| `reports.read` | reports | Consultar reportes. |
| `reports.export` | reports | Exportar reportes si se implementa. |

## Permisos de auditoría

| code | module | Descripción |
| --- | --- | --- |
| `audit.read` | audit | Consultar auditoría. |
| `audit.read-sensitive` | audit | Consultar eventos sensibles si aplica. |

## Asignación inicial de permisos por rol

## `ADMIN`

Debe recibir todos los permisos base.

```txt
ADMIN
= todos los permisos
```

Este rol permite administrar el sistema y resolver configuración inicial.

## `ACADEMIC_COORDINATOR`

Permisos sugeridos:

```txt
persons.read

students.read
professors.read

academic-programs.read
academic-programs.create
academic-programs.update

courses.read
courses.create
courses.update

academic-periods.read
academic-periods.create
academic-periods.update
academic-periods.close
academic-periods.cancel

course-offerings.read
course-offerings.create
course-offerings.update
course-offerings.close
course-offerings.reopen
course-offerings.cancel

enrollments.read

reports.read
```

Este rol gestiona la estructura académica y el seguimiento operativo.

## `SECRETARY`

Permisos sugeridos:

```txt
persons.read
persons.create
persons.update

students.read
students.create
students.update
students.import
students.imports.read
students.imports.rows.read

academic-programs.read
courses.read
academic-periods.read
course-offerings.read

enrollments.read
enrollments.create
enrollments.cancel
enrollments.change-status

reports.read
```

Este rol opera el registro académico diario.

## `PROFESSOR`

Permisos sugeridos:

```txt
course-offerings.read-own
enrollments.read-own
```

Este rol debe acceder solo a información relacionada con sus ofertas o estudiantes asociados, según las reglas del sistema.

## `REPORT_VIEWER`

Permisos sugeridos:

```txt
reports.read
```

Puede ampliarse si necesita consultar datos base:

```txt
students.read
course-offerings.read
enrollments.read
```

Debe evitarse entregar permisos de modificación.

## Usuario administrador inicial

Debe existir un usuario administrador para acceder al sistema después del primer despliegue.

Tabla:

```txt
users
```

Datos sugeridos por variables de entorno:

```txt
ADMIN_EMAIL
ADMIN_PASSWORD
ADMIN_FIRST_NAME
ADMIN_LAST_NAME
```

El seed debe:

```txt
- Crear o encontrar la persona asociada, si se requiere.
- Crear el usuario administrador.
- Guardar `password_hash`, nunca password plano.
- Asignar rol `ADMIN`.
```

La contraseña inicial no debe quedar escrita directamente en el código del seed.

## Sesiones

No se deben sembrar sesiones activas.

Las sesiones deben crearse mediante login.

Criterio:

```txt
user_sessions
= se generan por operación, no por seed
```

Si existe una política de sesión configurable por base de datos, puede sembrarse esa configuración. Si la política vive en variables de entorno o configuración de aplicación, no requiere seed.

## Auditoría

No se debe sembrar auditoría funcional ficticia.

La auditoría debe generarse por acciones reales del sistema.

En entorno de desarrollo puede generarse algún evento controlado solo si ayuda a probar pantallas o endpoints de auditoría, pero no debe ser necesario para que el sistema funcione.

## Importaciones de estudiantes

No se deben sembrar importaciones en producción.

Las tablas:

```txt
student_imports
student_import_rows
```

se llenan mediante operaciones reales de importación.

En desarrollo puede sembrarse una importación de ejemplo solo si se necesita probar la consulta de historial y detalle por fila.

Si se siembra, debe cumplir estas reglas:

```txt
- Usar datos ficticios.
- No simular una importación productiva.
- Mantener pocas filas.
- Indicar claramente estados aceptados, rechazados u observados.
- No guardar datos sensibles innecesarios en raw_data.
```

Ejemplo de importación de desarrollo:

```txt
student_imports
- file_name: students-sample.xlsx
- status: COMPLETED_WITH_ERRORS
- total_rows: 5
- accepted_rows: 3
- rejected_rows: 1
- observed_rows: 1
```

Ejemplo de filas:

```txt
student_import_rows
- row_number: 2
- status: ACCEPTED
- created_student_id: student-001

student_import_rows
- row_number: 4
- status: REJECTED
- error_summary: Documento inválido

student_import_rows
- row_number: 5
- status: OBSERVED
- error_summary: Programa académico no encontrado
```

## Datos académicos base para desarrollo

En entorno de desarrollo puede ser útil sembrar datos mínimos para probar el flujo.

Estos datos no deben ejecutarse en producción.

## Programas académicos de desarrollo

Tabla:

```txt
academic_programs
```

Ejemplos:

| code | name | status |
| --- | --- | --- |
| `SOFT-ENG` | Ingeniería de Software | ACTIVE |
| `INFO-SYS` | Sistemas de Información | ACTIVE |

## Cursos de desarrollo

Tabla:

```txt
courses
```

Ejemplos:

| code | name | credits | category |
| --- | --- | --- | --- |
| `CS-101` | Fundamentos de Programación | 4 | SPECIALTY |
| `DB-201` | Base de Datos | 4 | SPECIALTY |
| `SE-301` | Ingeniería de Software | 4 | SPECIALTY |

## Periodo académico de desarrollo

Tabla:

```txt
academic_periods
```

Ejemplo:

| code | name | status |
| --- | --- | --- |
| `2026-I` | Periodo académico 2026-I | OPEN |

Fechas sugeridas solo para desarrollo:

```txt
start_date
end_date
enrollment_start_date
enrollment_end_date
```

## Personas, docentes y estudiantes de desarrollo

Puede sembrarse un conjunto pequeño.

Criterios:

```txt
- Datos ficticios.
- Documentos ficticios.
- Correos institucionales ficticios.
- Cantidad reducida.
```

Ejemplos:

```txt
1 docente activo
3 estudiantes activos
1 estudiante suspendido
```

Esto permite probar reglas de inscripción.

## Ofertas de curso de desarrollo

Tabla:

```txt
course_offerings
```

Ejemplo:

```txt
Curso: Base de Datos
Periodo: 2026-I
Sección: A
Cupo máximo: 40
Docente: activo
Estado: OPEN
```

También conviene tener ofertas con estados o condiciones distintas para probar errores de negocio.

Ejemplos:

```txt
- Oferta abierta con cupos.
- Oferta cerrada.
- Oferta cancelada.
- Oferta con cupo máximo bajo.
```

## Inscripciones de desarrollo

Las inscripciones de ejemplo deben ser pocas.

Casos útiles:

```txt
- Inscripción activa.
- Inscripción cancelada.
- Inscripción con historial de estado.
```

En producción no se deben sembrar inscripciones.

## Seeds de prueba automatizada

Para tests, los datos deben ser mínimos y deterministas.

Criterios:

```txt
- IDs conocidos o recuperables por código.
- Nombres simples.
- Pocos registros.
- Sin datos aleatorios innecesarios.
- Sin dependencia de fechas reales cuando no sea necesario.
```

Ejemplos de códigos estables:

```txt
TEST_ADMIN
TEST_STUDENT_ACTIVE
TEST_STUDENT_SUSPENDED
TEST_COURSE_DB
TEST_PERIOD_OPEN
TEST_OFFERING_OPEN
TEST_ROLE_SECRETARY
TEST_PERMISSION_STUDENTS_IMPORT
```

## Idempotencia

Todo seed debe poder ejecutarse varias veces sin duplicar datos.

Criterios:

```txt
- Usar upsert cuando sea posible.
- Buscar por campos únicos.
- No insertar sin verificar existencia.
- Mantener códigos únicos estables.
```

Ejemplo conceptual:

```txt
upsert document_type by code con id generado por seed
upsert course_category by code con id generado por seed
upsert permission by code con id generado por seed
upsert role by code con id generado por seed
upsert academic_program by code con id generado por seed
upsert user by email con id generado por seed
```

## Seguridad en seeds

Los seeds no deben exponer secretos.

Evitar:

```txt
- Contraseña admin escrita en el repositorio.
- Tokens predefinidos.
- Refresh tokens sembrados.
- Sesiones activas sembradas.
- Datos personales reales.
```

Preferir:

```txt
- Variables de entorno.
- Hash de contraseña generado en ejecución.
- Datos ficticios para desarrollo.
```

## Relación con migraciones

Las migraciones definen estructura. Los seeds insertan datos base.

```txt
migrations
= schema y cambios estructurales

seeds
= datos iniciales
```

No se debe usar seed para modificar estructura de tablas.

## Organización sugerida de seeds

Estructura posible:

```txt
prisma/
├── seed.ts
└── seeds/
    ├── seed-document-types.ts
    ├── seed-course-categories.ts
    ├── seed-permissions.ts
    ├── seed-roles.ts
    ├── seed-role-permissions.ts
    ├── seed-admin-user.ts
    └── seed-development-data.ts
```

Si se necesita poblar datos de importación de ejemplo para desarrollo, puede incluirse dentro de `seed-development-data.ts` o en un archivo separado.

```txt
seed-development-student-imports.ts
```

El seed principal puede orquestar el orden.

```txt
seed.ts
→ catálogos
→ permisos
→ roles
→ rol-permisos
→ usuario admin
→ datos de desarrollo si NODE_ENV=development
```

## Criterio para producción

En producción, ejecutar solo:

```txt
- Tipos de documento base.
- Categorías base necesarias.
- Permisos base.
- Roles base.
- Relación rol-permiso.
- Usuario administrador inicial si no existe.
```

No ejecutar:

```txt
- Estudiantes ficticios.
- Docentes ficticios.
- Cursos ficticios.
- Ofertas ficticias.
- Inscripciones ficticias.
- Importaciones ficticias.
- Sesiones activas.
```

## Criterio general

Los datos semilla deben permitir que el sistema arranque con una configuración mínima, segura y coherente.

```txt
Catálogos
= valores base para registrar información

Permisos
= acciones protegidas por el sistema

Roles
= agrupaciones iniciales de permisos

Usuario admin
= acceso inicial controlado

Datos académicos de desarrollo
= apoyo para probar el flujo

Importaciones de desarrollo
= apoyo opcional para probar historial y detalle por fila
```

Un seed correcto no reemplaza reglas de negocio. Solo prepara los datos necesarios para que esas reglas puedan ejecutarse.
