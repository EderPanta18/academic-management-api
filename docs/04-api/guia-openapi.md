# Guía OpenAPI

Este documento define criterios para documentar la API mediante Swagger / OpenAPI.

La documentación OpenAPI debe servir para entender y probar la API sin tener que leer el código fuente. Debe ser clara, consistente y alineada con los formatos reales de respuesta.

## Enfoque general

OpenAPI debe documentar el contrato HTTP del sistema.

Debe incluir:

```txt
- Rutas.
- Métodos HTTP.
- Parámetros.
- Query params.
- Bodies de entrada.
- Respuestas exitosas.
- Respuestas de error.
- Esquemas de paginación.
- Autenticación cuando aplique.
- Permisos requeridos cuando la ruta sea protegida.
- Operaciones asíncronas cuando aplique.
```

No debe usarse para documentar reglas internas de arquitectura ni detalles de implementación.

## Tags

Los endpoints deben agruparse por módulo o capacidad funcional.

Ejemplos:

```txt
Identity
Students
Professors
Academic Programs
Courses
Academic Periods
Course Offerings
Enrollments
Users
Authorization
Audit
Reports
```

Los tags deben ayudar a navegar la documentación. El tag agrupa por capacidad, no necesariamente por módulo. Los endpoints de autenticación pertenecen al módulo `users`, pero pueden exponerse bajo un tag `Auth` si ayuda a la lectura, o mantenerse bajo `Users`. Lo importante es que el consumidor encuentre los endpoints rápidamente.

## Summaries

Cada endpoint debe tener un summary corto y directo.

Ejemplos:

```txt
Crear estudiante
Listar estudiantes
Obtener estudiante por id
Crear oferta de curso
Registrar inscripción
Cancelar inscripción
Listar permisos
Asignar permisos a rol
Cerrar sesión
Consultar estado de importación
```

El summary no debe ser demasiado largo.

## Descripciones

La descripción puede explicar brevemente la intención del endpoint.

Ejemplo:

```txt
Registra una nueva inscripción de un estudiante en una oferta de curso disponible.
```

No debe repetir toda la regla de negocio, pero sí dar contexto suficiente.

## Parámetros de ruta

Los parámetros de ruta deben documentarse.

Ejemplo:

```txt
id
= identificador del recurso
```

Si el endpoint usa un identificador específico, el nombre puede ser más claro:

```txt
studentId
courseOfferingId
academicPeriodId
roleId
permissionId
jobId
```

## Query params

Los endpoints de listado deben documentar filtros, paginación y ordenamiento.

Ejemplo:

```txt
page
limit
code
name
status
sortBy
sortOrder
academicProgramId
academicPeriodId
```

Los filtros deben ser explícitos cuando el criterio corresponde a un campo conocido.

El parámetro `search` solo debe documentarse si el módulo soporta búsqueda global y se indica claramente sobre qué campos busca.

También deben documentarse valores permitidos cuando existan enums.

## DTOs de entrada

Los DTOs de request deben representar solo los datos que el cliente puede enviar.

No deben exponer entidades internas ni modelos de base de datos.

Ejemplo:

```json
{
    "studentId": "student-001",
    "courseOfferingId": "offering-001"
}
```

No se deben pedir campos que el sistema debe calcular o asignar internamente, como `createdAt`, `updatedAt`, cupos calculados o estados derivados.

## DTOs de respuesta

Los DTOs de respuesta deben representar lo que la API entrega al cliente.

No deben devolver entidades internas completas si no son necesarias.

Ejemplo:

```json
{
    "id": "student-001",
    "code": "STU-001",
    "fullName": "Eder Panta",
    "status": "ACTIVE"
}
```

La documentación debe mostrar la respuesta envuelta por el formato global.

## Respuestas exitosas

OpenAPI debe documentar el formato real de éxito.

Ejemplo:

```json
{
    "success": true,
    "statusCode": 200,
    "timestamp": "2026-06-14T10:30:00.000Z",
    "path": "/api/v1/students/student-001",
    "data": {
        "id": "student-001",
        "code": "STU-001",
        "status": "ACTIVE"
    }
}
```

Si el endpoint crea un recurso, debe documentarse `201`.

## Respuestas paginadas

Las respuestas paginadas deben documentar `data.items` y `data.meta`.

Ejemplo:

```json
{
    "success": true,
    "statusCode": 200,
    "timestamp": "2026-06-14T10:30:00.000Z",
    "path": "/api/v1/students?page=1&limit=20",
    "data": {
        "items": [],
        "meta": {
            "page": 1,
            "limit": 20,
            "totalItems": 0,
            "totalPages": 0,
            "hasNextPage": false,
            "hasPreviousPage": false
        }
    }
}
```

El schema paginado puede ser genérico, pero debe permitir indicar el tipo de item.

## Respuestas asíncronas

Los endpoints que encolan trabajo y responden sin esperar el resultado deben documentarse con `202 Accepted`.

Ejemplo:

```json
{
    "success": true,
    "statusCode": 202,
    "timestamp": "2026-06-14T10:30:00.000Z",
    "path": "/api/v1/students/import",
    "data": {
        "jobId": "job-001",
        "status": "PENDING",
        "message": "La importación fue encolada y será procesada en segundo plano."
    }
}
```

La documentación debe indicar:

```txt
- Que la operación es asíncrona.
- Que el cliente recibe un jobId.
- Qué endpoint permite consultar el estado.
- Qué estados puede devolver el job.
- Si la operación publica eventos o no.
```

El endpoint de consulta de estado también debe documentarse.

Ejemplo:

```txt
GET /api/v1/students/imports/:jobId
```

Respuesta esperada:

```json
{
    "success": true,
    "statusCode": 200,
    "timestamp": "2026-06-14T10:30:00.000Z",
    "path": "/api/v1/students/imports/job-001",
    "data": {
        "jobId": "job-001",
        "status": "COMPLETED_WITH_ERRORS",
        "totalRows": 100,
        "acceptedRows": 95,
        "rejectedRows": 5,
        "startedAt": "2026-06-14T10:28:00.000Z",
        "finishedAt": "2026-06-14T10:30:00.000Z"
    }
}
```

No se debe documentar el worker ni la cola como parte del contrato HTTP. Lo único que el cliente ve es el `jobId` y el estado consultable.

## Respuestas de error

OpenAPI debe documentar errores comunes.

Como mínimo:

```txt
400 Validation Error
401 Unauthorized
403 Forbidden
404 Not Found
409 Conflict
500 Internal Server Error
```

Para operaciones asíncronas puede ser útil documentar errores de encolado, aunque el procesamiento posterior se reporte por estado del job.

Ejemplo de error:

```json
{
    "success": false,
    "statusCode": 409,
    "timestamp": "2026-06-14T10:30:00.000Z",
    "path": "/api/v1/enrollments",
    "error": {
        "key": "COURSE_OFFERING_HAS_NO_SEATS",
        "code": "ENR_004",
        "message": "La oferta de curso no tiene cupos disponibles.",
        "domain": "ENROLLMENT"
    }
}
```

Los errores deben usar el mismo formato en todos los módulos.

## Autenticación

Cuando una ruta requiere autenticación, debe indicarse en OpenAPI.

Las rutas protegidas deben mostrar el esquema de seguridad correspondiente, por ejemplo Bearer Token.

Ejemplo conceptual:

```txt
Authorization: Bearer <token>
```

Las rutas públicas, como login o health check, no deben marcarse como protegidas.

## Permisos requeridos

Las rutas protegidas deben indicar los permisos requeridos cuando aplique.

Ejemplos:

```txt
students.read
students.create
students.import
enrollments.create
course-offerings.close
roles.assign-permissions
reports.read
```

Esto permite que quien consume la documentación entienda no solo que necesita autenticarse, sino también qué capacidad debe tener su usuario.

La documentación no reemplaza al guard de permisos. Solo debe reflejar el contrato real de acceso.

Los permisos no cambian según el nombre del módulo. Un permiso como `roles.assign-permissions` sigue siendo válido aunque roles y permisos vivan en el módulo `authorization`.

## Sesiones

Las rutas relacionadas con autenticación deben documentar su relación con sesiones.

Ejemplos:

```txt
POST /api/v1/auth/login
= crea una sesión y emite tokens

POST /api/v1/auth/logout
= revoca la sesión actual

POST /api/v1/auth/refresh
= renueva el access token si la sesión sigue activa
```

Aunque el módulo que administra cuentas, credenciales y sesiones es `users`, las rutas de autenticación pueden exponerse bajo `/auth` por claridad. La documentación debe indicar la capacidad real y no confundir al consumidor con la organización interna del código.

Los detalles sensibles del token o del hash no deben exponerse en OpenAPI.

## Consistencia entre documentación y ejecución

La documentación debe coincidir con lo que la API devuelve realmente.

Evitar:

```txt
- Documentar data plana si la API responde con wrapper.
- Documentar errores con message en raíz si la API usa error.message.
- Documentar meta en raíz si la API usa data.meta.
- Documentar DTOs internos como si fueran respuestas públicas.
- Documentar rutas protegidas sin indicar autenticación.
- Documentar permisos que el endpoint no valida realmente.
- Documentar operaciones asíncronas como si fueran síncronas.
- Documentar el worker o la cola como parte del contrato HTTP.
```

## OpenAPI y módulos

Cada módulo puede tener decoradores o helpers propios para documentar sus endpoints.

Los decoradores reutilizables pueden vivir en `shared` si son simples y no dependen de un módulo específico.

La configuración global de Swagger debe vivir en infraestructura HTTP, dentro de `platform`.

Los workers no se documentan en OpenAPI. No exponen endpoints. Su existencia se refleja indirectamente a través de las respuestas `202 Accepted` y los endpoints de consulta de estado.

## Ejemplos

Los endpoints importantes deben incluir ejemplos.

Es especialmente útil para:

```txt
- Login.
- Refresh token.
- Logout.
- Crear estudiante.
- Importar estudiantes.
- Consultar estado de importación.
- Crear oferta de curso.
- Registrar inscripción.
- Cancelar inscripción.
- Listar con paginación.
- Asignar permisos a rol.
- Errores de negocio.
```

Los ejemplos deben ser realistas y coherentes con el dominio académico y con el modelo de seguridad.

## Criterio general

La documentación OpenAPI debe responder rápidamente:

```txt
Qué hace el endpoint.
Qué datos recibe.
Qué datos devuelve.
Qué errores puede generar.
Si requiere autenticación.
Qué permisos requiere.
Cómo se pagina o filtra.
Si la operación es síncrona o asíncrona.
Cómo se consulta el estado si es asíncrona.
```

Si un endpoint no permite entender eso desde Swagger, la documentación está incompleta.
