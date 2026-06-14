# Autorización

Este documento define cómo el sistema decide si un usuario autenticado puede ejecutar una acción.

La autorización responde a esta pregunta:

```txt
¿Qué puede hacer este usuario dentro del sistema?
```

La autenticación identifica al usuario. La autorización evalúa si ese usuario tiene permisos para acceder a una ruta o ejecutar una operación.

## Enfoque general

La autorización debe basarse principalmente en permisos.

Los roles agrupan permisos, pero los endpoints deben protegerse con permisos concretos cuando sea posible.

Ejemplo:

```txt
@RequirePermissions("students.create")
```

Esto permite que distintos roles puedan compartir permisos sin modificar el código de los controladores.

## Relación entre usuario, rol y permiso

Modelo conceptual:

```txt
Usuario
→ tiene uno o más roles

Rol
→ agrupa permisos

Permiso
→ representa una acción permitida sobre una capacidad
```

Ejemplo:

```txt
SECRETARY
→ students.read
→ students.create
→ students.import
→ enrollments.create
```

El endpoint no necesita saber si el usuario es `SECRETARY`. Solo necesita saber si tiene `students.create`.

## Módulos responsables

La autorización se distribuye entre módulos funcionales y soporte técnico.

```txt
modules/roles
= administración de roles

modules/permissions
= administración de permisos

modules/users
= asignación de roles a usuarios, si se decide manejarlo desde usuarios o roles

platform/security
= guards, decorators y verificación técnica en requests
```

## Guards

En NestJS, la protección de rutas debe implementarse mediante guards.

Flujo esperado:

```txt
Request
→ JwtAuthGuard
→ PermissionsGuard
→ Controller
```

El primer guard valida identidad. El segundo valida permisos.

## Decorador de permisos

Los endpoints protegidos deben declarar los permisos requeridos.

Ejemplo conceptual:

```ts
@UseGuards(JwtAuthGuard, PermissionsGuard)
@RequirePermissions("students.create")
@Post()
createStudent() {}
```

La intención debe ser clara:

```txt
Este endpoint requiere el permiso students.create.
```

## Permisos por recurso y acción

Los permisos deben seguir una convención estable.

Formato recomendado:

```txt
recurso.accion
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

Esta convención permite documentar y mantener los permisos con facilidad.

## Protección de endpoints

Ejemplos conceptuales:

```ts
@RequirePermissions("students.read")
@Get()
findAllStudents() {}
```

```ts
@RequirePermissions("students.create")
@Post()
createStudent() {}
```

```ts
@RequirePermissions("enrollments.create")
@Post()
createEnrollment() {}
```

```ts
@RequirePermissions("course-offerings.close")
@Patch(":id/close")
closeCourseOffering() {}
```

```ts
@RequirePermissions("reports.read")
@Get("academic-summary")
getAcademicSummary() {}
```

El controlador declara el permiso. La lógica del guard decide si el usuario lo tiene.

## Roles como agrupadores

Los roles no deben reemplazar a los permisos.

Un rol es una agrupación de responsabilidades. El permiso es la acción concreta.

Ejemplo:

```txt
ADMIN
= todos los permisos

SECRETARY
= estudiantes e inscripciones

ACADEMIC_COORDINATOR
= cursos, periodos, ofertas y reportes

PROFESSOR
= consulta limitada a información relacionada

REPORT_VIEWER
= solo reportes
```

Si mañana se crea un nuevo rol, basta con asignarle permisos. No debería ser necesario modificar cada endpoint.

## Casos `own`

Algunas acciones dependen de propiedad o relación con el recurso.

Ejemplo:

```txt
course-offerings.read-own
enrollments.read-own
```

Estos permisos indican que el usuario solo puede acceder a información relacionada consigo mismo.

Ejemplo:

```txt
Profesor
→ puede ver sus propias ofertas
→ no necesariamente puede ver todas las ofertas
```

Este tipo de regla no se resuelve solo con el permiso. También requiere una condición de ownership dentro del caso de uso o en una política específica.

## 401 y 403

La API debe diferenciar autenticación y autorización.

```txt
401 Unauthorized
= el usuario no está autenticado o su token no es válido

403 Forbidden
= el usuario está autenticado, pero no tiene permisos
```

Ejemplo de autorización fallida:

```json
{
  "success": false,
  "statusCode": 403,
  "timestamp": "2026-06-14T10:30:00.000Z",
  "path": "/api/v1/enrollments",
  "error": {
    "key": "FORBIDDEN",
    "code": "AUTH_002",
    "message": "No tienes permisos para realizar esta acción.",
    "domain": "AUTH"
  }
}
```

## Rutas administrativas

Las rutas administrativas deben tener permisos propios.

Ejemplos:

```txt
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

No conviene proteger todo solo con `ADMIN`, porque eso vuelve rígido el sistema.

## Separación de responsabilidades

El controlador declara la protección. El guard evalúa el acceso. El caso de uso aplica reglas propias del negocio.

Ejemplo:

```txt
PermissionsGuard
= verifica si el usuario tiene enrollments.create

CreateEnrollmentUseCase
= verifica si la oferta tiene cupo y si el estudiante puede inscribirse
```

El permiso permite entrar a la operación. La regla de negocio decide si la operación es válida.

## Criterio general

La autorización debe ser explícita, flexible y consistente.

```txt
- Usar permisos para proteger endpoints.
- Usar roles como agrupadores.
- Usar guards para verificación técnica.
- Usar reglas de negocio dentro de casos de uso.
- Usar permisos `own` solo cuando exista una regla real de propiedad.
```
