# Formato de respuesta

Este documento define la forma estándar de las respuestas HTTP de la API.

La API debe responder con una estructura uniforme para facilitar el consumo desde clientes, pruebas manuales y documentación OpenAPI.

## Respuesta exitosa

Toda respuesta exitosa debe incluir metadatos básicos y el contenido dentro de `data`.

Formato base:

```json
{
  "success": true,
  "statusCode": 200,
  "timestamp": "2026-06-14T10:30:00.000Z",
  "path": "/api/v1/students/123",
  "data": {}
}
```

Campos:

```txt
success
= indica si la operación fue exitosa

statusCode
= código HTTP devuelto

timestamp
= fecha y hora de la respuesta en formato ISO

path
= ruta solicitada

data
= contenido funcional de la respuesta
```

La raíz de la respuesta debe reservarse para metadatos generales. El contenido propio del recurso debe ir dentro de `data`.

## Respuesta de creación

Cuando se crea un recurso, se debe usar `201`.

```json
{
  "success": true,
  "statusCode": 201,
  "timestamp": "2026-06-14T10:30:00.000Z",
  "path": "/api/v1/students",
  "data": {
    "id": "student-001",
    "code": "STU-001",
    "status": "ACTIVE"
  }
}
```

La respuesta puede devolver el recurso creado o un resumen suficiente para que el cliente continúe.

## Respuesta de actualización

Una actualización puede devolver el recurso actualizado o un resumen de la operación.

```json
{
  "success": true,
  "statusCode": 200,
  "timestamp": "2026-06-14T10:30:00.000Z",
  "path": "/api/v1/course-offerings/offering-001",
  "data": {
    "id": "offering-001",
    "status": "OPEN",
    "capacity": 40,
    "availableSeats": 12
  }
}
```

## Respuesta sin entidad principal

Para operaciones que no necesitan devolver una entidad completa, se puede retornar un mensaje simple dentro de `data`.

```json
{
  "success": true,
  "statusCode": 200,
  "timestamp": "2026-06-14T10:30:00.000Z",
  "path": "/api/v1/enrollments/enrollment-001/cancel",
  "data": {
    "message": "Inscripción cancelada correctamente."
  }
}
```

Aunque `204 No Content` es válido en HTTP, usar `200` con `data.message` mantiene consistencia y facilita pruebas en Swagger.

## Respuesta paginada

Las respuestas paginadas deben mantener los elementos y la metadata dentro de `data`.

```json
{
  "success": true,
  "statusCode": 200,
  "timestamp": "2026-06-14T10:30:00.000Z",
  "path": "/api/v1/students?page=1&limit=10",
  "data": {
    "items": [
      {
        "id": "student-001",
        "code": "STU-001",
        "fullName": "Eder Panta",
        "status": "ACTIVE"
      }
    ],
    "meta": {
      "page": 1,
      "limit": 10,
      "totalItems": 35,
      "totalPages": 4,
      "hasNextPage": true,
      "hasPreviousPage": false
    }
  }
}
```

La metadata de paginación se mantiene dentro de `data` porque pertenece al resultado funcional de esa consulta.

La raíz mantiene solo metadatos globales de la respuesta:

```txt
success
statusCode
timestamp
path
```

## Respuesta de error

Toda respuesta de error debe incluir un objeto `error`.

Formato base:

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

El objeto `error` mantiene separados los metadatos globales de la respuesta y los detalles del problema.

## Campos del error

```txt
key
= identificador legible del error

code
= código corto, estable y documentable

message
= mensaje entendible para el consumidor de la API

domain
= área funcional relacionada, cuando aplique

fieldErrors
= lista de errores por campo, solo para validaciones de entrada

details
= información adicional controlada, si realmente se necesita
```

No se deben colocar `errorKey`, `errorCode`, `message`, `domain` y `fieldErrors` directamente en la raíz. Eso mezcla metadatos globales con detalles del error.

## Error de validación

Cuando la solicitud contiene campos inválidos, se debe responder con `400`.

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
        "field": "email",
        "message": "El correo no tiene un formato válido."
      },
      {
        "field": "code",
        "message": "El código del estudiante es obligatorio."
      }
    ]
  }
}
```

## Error de negocio

Cuando la solicitud tiene una forma válida, pero no puede ejecutarse por una regla del sistema, se debe usar un error de negocio.

Ejemplo:

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

## Error inesperado

Los errores inesperados no deben exponer información interna sensible.

```json
{
  "success": false,
  "statusCode": 500,
  "timestamp": "2026-06-14T10:30:00.000Z",
  "path": "/api/v1/students",
  "error": {
    "key": "INTERNAL_SERVER_ERROR",
    "code": "SYS_001",
    "message": "Ocurrió un error inesperado."
  }
}
```

En entorno de desarrollo puede incluirse información adicional controlada, pero no debe exponerse en producción.

## Criterio general

La estructura final debe ser:

Éxito:

```txt
metadatos globales
+ data
```

Error:

```txt
metadatos globales
+ error
```

Paginación:

```txt
metadatos globales
+ data.items
+ data.meta
```

Esto mantiene una API consistente y fácil de documentar.
