# Roles y permisos

Este documento define el modelo de roles y permisos del sistema.

Los roles y permisos permiten controlar qué acciones puede realizar cada usuario dentro del backend.

## Enfoque general

El sistema debe usar un modelo basado en roles con permisos.

```txt
Usuario
→ tiene roles

Rol
→ agrupa permisos

Permiso
→ representa una acción del sistema
```

Este enfoque es más flexible que validar únicamente por rol, porque permite crear nuevos roles o modificar responsabilidades sin cambiar la protección de cada endpoint.

## Módulos responsables

Los roles y permisos se manejan como módulos funcionales.

```txt
modules/roles
modules/permissions
```

Están al mismo nivel que otros módulos porque `modules/` agrupa capacidades funcionales de la aplicación, no solo capacidades académicas.

La diferencia es conceptual:

```txt
students, courses, enrollments
= módulos del dominio académico

auth, users, roles, permissions
= módulos funcionales de seguridad y acceso

reports, catalogs
= módulos de soporte funcional
```

## Tablas principales

Modelo conceptual:

```txt
users
roles
permissions
user_roles
role_permissions
```

Relaciones:

```txt
users
→ user_roles
→ roles
→ role_permissions
→ permissions
```

## Tabla `roles`

Representa responsabilidades o perfiles de acceso.

Campos conceptuales:

```txt
roles
- id
- code
- name
- description
- status
- created_at
- updated_at
```

Ejemplos:

```txt
ADMIN
SECRETARY
ACADEMIC_COORDINATOR
PROFESSOR
REPORT_VIEWER
```

## Tabla `permissions`

Representa acciones permitidas dentro del sistema.

Campos conceptuales:

```txt
permissions
- id
- code
- name
- description
- module
- created_at
- updated_at
```

Ejemplos:

```txt
students.read
students.create
students.update
students.import

course-offerings.read
course-offerings.create
course-offerings.update
course-offerings.close

enrollments.read
enrollments.create
enrollments.cancel

reports.read
```

Sí conviene tener una tabla `permissions`, porque permite consultar, asignar, documentar y administrar permisos sin dejarlos completamente quemados en código.

## Tabla `user_roles`

Relaciona usuarios con roles.

```txt
user_roles
- user_id
- role_id
- assigned_at
- assigned_by
```

Un usuario puede tener uno o más roles.

## Tabla `role_permissions`

Relaciona roles con permisos.

```txt
role_permissions
- role_id
- permission_id
- assigned_at
- assigned_by
```

Un rol puede tener muchos permisos.

## Convención de permisos

Los permisos deben seguir el formato:

```txt
recurso.accion
```

Ejemplos:

```txt
students.read
students.create
students.update
students.delete
students.import

professors.read
professors.create
professors.update

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

course-offerings.read
course-offerings.create
course-offerings.update
course-offerings.close
course-offerings.cancel

enrollments.read
enrollments.create
enrollments.cancel
enrollments.change-status

reports.read

users.read
users.create
users.update
users.disable

roles.read
roles.create
roles.update
roles.assign-permissions

permissions.read
permissions.assign
```

No conviene hacer permisos demasiado granulares al inicio.

Evitar:

```txt
students.read.firstName
students.read.email
students.update.phone
```

Ese nivel de detalle complica el sistema y no aporta suficiente valor en una primera versión.

## Roles iniciales

Una configuración inicial razonable puede ser:

```txt
ADMIN
= todos los permisos

SECRETARY
= gestión de estudiantes e inscripciones

ACADEMIC_COORDINATOR
= gestión académica de cursos, periodos y ofertas

PROFESSOR
= consulta limitada a sus propias ofertas o estudiantes asociados

REPORT_VIEWER
= consulta de reportes
```

Los permisos concretos deben asignarse según las necesidades reales del sistema.

## Permisos `own`

Algunos permisos pueden representar acceso limitado a recursos propios o relacionados.

Ejemplos:

```txt
course-offerings.read-own
enrollments.read-own
```

Estos permisos deben usarse con cuidado. No bastan por sí solos. Requieren que el caso de uso limite la consulta al usuario autenticado o a la relación correspondiente.

Ejemplo:

```txt
Profesor con course-offerings.read-own
→ solo consulta ofertas donde está asignado como docente
```

## Seeds

Los roles y permisos iniciales pueden crearse mediante seeds.

Esto permite que el sistema tenga una base de acceso definida desde el inicio.

El seed puede crear:

```txt
- Permisos base.
- Roles base.
- Relación entre roles y permisos.
- Usuario administrador inicial si aplica.
```

No es necesario tener una pantalla administrativa completa desde la primera versión, pero la base de datos debe permitir crecer hacia esa gestión.

## Protección de endpoints

Los endpoints deben protegerse por permiso.

Ejemplo:

```ts
@RequirePermissions("students.create")
@Post()
createStudent() {}
```

El rol solo agrupa el permiso. El endpoint no debería depender directamente del nombre del rol salvo en casos administrativos muy específicos.

## Administración de roles y permisos

Operaciones posibles para roles:

```txt
- Crear rol.
- Listar roles.
- Actualizar rol.
- Activar o desactivar rol.
- Asignar permisos a rol.
- Quitar permisos de rol.
```

Operaciones posibles para permisos:

```txt
- Listar permisos.
- Consultar permisos por módulo.
- Asignar permisos a rol.
```

La creación libre de permisos desde API puede restringirse si los permisos base se manejan por seed, para evitar inconsistencias con permisos que el código no reconoce.

## Criterio general

El modelo debe ser flexible, pero no excesivamente complejo.

```txt
- Roles agrupan responsabilidades.
- Permisos protegen acciones.
- Usuarios reciben roles.
- Endpoints declaran permisos.
- Seeds pueden definir la base inicial.
```

Este diseño permite crecer sin modificar la protección de cada endpoint cada vez que cambie una responsabilidad.
