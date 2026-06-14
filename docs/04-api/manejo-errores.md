# Manejo de errores

Este documento define cómo deben manejarse y representarse los errores de la API.

El objetivo es que los errores sean consistentes, claros y útiles para clientes, pruebas y documentación, sin exponer detalles internos innecesarios.

## Enfoque general

Todo error debe responder con el mismo formato base:

```json
{
  "success": false,
  "statusCode": 409,
  "timestamp": "2026-06-14T10:30:00.000Z",
  "path": "/api/v1/enrollments",
  "error": {
    "key": "STUDENT_ALREADY_ENROLLED",
    "code": "ENR_001",
    "message": "El estudiante ya tiene una inscripción activa en esta oferta.",
    "domain": "ENROLLMENT"
  }
}
```

La raíz contiene metadatos globales. El objeto `error` contiene los detalles del problema.

## Tipos de error

La API puede manejar estos grupos principales de errores:

```txt
- Errores de validación.
- Errores de autenticación.
- Errores de autorización.
- Errores de recurso no encontrado.
- Errores de negocio.
- Errores inesperados.
```

Cada grupo debe mapearse a un código HTTP coherente.

## Error de validación

Se usa cuando la solicitud no cumple con la forma esperada.

Código HTTP:

```txt
400 Bad Request
```

Ejemplo:

```json
{
  "success": false,
  "statusCode": 400,
  "timestamp": "2026-06-14T10:30:00.000Z",
  "path": "/api/v1/students",
  "error": {
    "key": "VALIDATION_ERROR",
    "code": "VAL_001",
    "message": "La solicitud contiene campos inválidos.",
    "fieldErrors": [
      {
        "field": "documentNumber",
        "message": "El número de documento es obligatorio."
      }
    ]
  }
}
```

Este error pertenece a la entrada HTTP, no necesariamente al dominio.

## Error de autenticación

Se usa cuando el usuario no está autenticado o el token no es válido.

Código HTTP:

```txt
401 Unauthorized
```

Ejemplo:

```json
{
  "success": false,
  "statusCode": 401,
  "timestamp": "2026-06-14T10:30:00.000Z",
  "path": "/api/v1/students",
  "error": {
    "key": "UNAUTHORIZED",
    "code": "AUTH_001",
    "message": "No se pudo autenticar la solicitud.",
    "domain": "AUTH"
  }
}
```

## Error de autorización

Se usa cuando el usuario está autenticado, pero no tiene permisos para realizar la acción.

Código HTTP:

```txt
403 Forbidden
```

Ejemplo:

```json
{
  "success": false,
  "statusCode": 403,
  "timestamp": "2026-06-14T10:30:00.000Z",
  "path": "/api/v1/users",
  "error": {
    "key": "FORBIDDEN",
    "code": "AUTH_002",
    "message": "No tienes permisos para realizar esta acción.",
    "domain": "AUTH"
  }
}
```

## Error de recurso no encontrado

Se usa cuando el recurso solicitado no existe o no está disponible.

Código HTTP:

```txt
404 Not Found
```

Ejemplo:

```json
{
  "success": false,
  "statusCode": 404,
  "timestamp": "2026-06-14T10:30:00.000Z",
  "path": "/api/v1/students/student-001",
  "error": {
    "key": "STUDENT_NOT_FOUND",
    "code": "STU_001",
    "message": "No se encontró el estudiante solicitado.",
    "domain": "STUDENT"
  }
}
```

## Error de negocio

Se usa cuando la solicitud tiene forma válida, pero no puede ejecutarse por una regla del sistema.

Código HTTP recomendado:

```txt
409 Conflict
```

Ejemplos:

```txt
- Estudiante ya inscrito en la oferta.
- Oferta sin cupos disponibles.
- Periodo académico cerrado.
- Estudiante no activo.
- Cupo máximo menor que inscripciones activas.
- Oferta no abierta para inscripciones.
```

Ejemplo:

```json
{
  "success": false,
  "statusCode": 409,
  "timestamp": "2026-06-14T10:30:00.000Z",
  "path": "/api/v1/course-offerings/offering-001",
  "error": {
    "key": "COURSE_OFFERING_CANNOT_REDUCE_CAPACITY",
    "code": "COF_003",
    "message": "El cupo máximo no puede ser menor que la cantidad de inscripciones activas.",
    "domain": "COURSE_OFFERING"
  }
}
```

## Error inesperado

Se usa cuando ocurre un fallo no controlado.

Código HTTP:

```txt
500 Internal Server Error
```

Ejemplo:

```json
{
  "success": false,
  "statusCode": 500,
  "timestamp": "2026-06-14T10:30:00.000Z",
  "path": "/api/v1/enrollments",
  "error": {
    "key": "INTERNAL_SERVER_ERROR",
    "code": "SYS_001",
    "message": "Ocurrió un error inesperado."
  }
}
```

No se deben exponer stack traces, consultas SQL, tokens, variables de entorno ni detalles internos en producción.

## Uso de `key`

`key` identifica el tipo de error de forma legible.

Ejemplos:

```txt
VALIDATION_ERROR
STUDENT_NOT_FOUND
STUDENT_ALREADY_ENROLLED
COURSE_OFFERING_HAS_NO_SEATS
ACADEMIC_PERIOD_CLOSED
FORBIDDEN
```

Debe ser estable y útil para que un cliente pueda tomar decisiones.

## Uso de `code`

`code` es un identificador corto y documentable.

Ejemplos:

```txt
VAL_001
AUTH_001
STU_001
ENR_001
COF_003
SYS_001
```

Puede usarse para soporte, documentación o mapeo de mensajes en clientes.

## Uso de `domain`

`domain` indica el área funcional relacionada con el error.

Ejemplos:

```txt
AUTH
STUDENT
PROFESSOR
ACADEMIC_PROGRAM
COURSE
ACADEMIC_PERIOD
COURSE_OFFERING
ENROLLMENT
REPORT
```

No todos los errores necesitan dominio. Errores técnicos generales pueden omitirlo.

## `fieldErrors`

`fieldErrors` solo debe usarse en errores de validación.

Estructura:

```json
[
  {
    "field": "email",
    "message": "El correo no tiene un formato válido."
  }
]
```

No debe usarse para errores de negocio generales.

## Filtro global

En NestJS, el manejo de errores debe centralizarse mediante un filtro global.

El filtro global debe encargarse de:

```txt
- Capturar excepciones conocidas.
- Mapear excepciones a statusCode.
- Construir el formato uniforme de error.
- Ocultar detalles internos en producción.
- Mantener consistencia en todos los módulos.
```

Los módulos pueden lanzar excepciones propias, pero la respuesta HTTP final debe ser uniforme.

## Errores de dominio y aplicación

Conviene diferenciar errores internos según su intención.

```txt
Errores de dominio
= reglas internas del modelo

Errores de aplicación
= fallos de flujo, coordinación o validaciones entre módulos

Errores de presentación
= entrada HTTP inválida

Errores técnicos
= infraestructura o fallos inesperados
```

Aunque internamente puedan tener clases distintas, todos deben salir por la API con el mismo formato.

## Criterio final

La API debe evitar respuestas de error improvisadas.

No responder:

```json
{
  "message": "error"
}
```

No responder:

```json
{
  "errorKey": "STUDENT_NOT_FOUND",
  "errorCode": "STU_001",
  "message": "No encontrado"
}
```

Preferir:

```json
{
  "success": false,
  "statusCode": 404,
  "timestamp": "2026-06-14T10:30:00.000Z",
  "path": "/api/v1/students/student-001",
  "error": {
    "key": "STUDENT_NOT_FOUND",
    "code": "STU_001",
    "message": "No se encontró el estudiante solicitado.",
    "domain": "STUDENT"
  }
}
```
