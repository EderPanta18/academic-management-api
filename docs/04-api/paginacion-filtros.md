# Paginación y filtros

Este documento define las convenciones para paginar, filtrar, buscar y ordenar resultados en la API.

La paginación y los filtros deben ser consistentes entre módulos para que las listas sean fáciles de consumir y documentar.

## Enfoque general

Las operaciones de listado deben usar query params.

Ejemplo:

```txt
GET /api/v1/students?page=1&limit=20&status=ACTIVE&firstName=eder
```

La respuesta debe usar el formato paginado estándar:

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

## Query params de paginación

Parámetros base:

```txt
page
= número de página

limit
= cantidad de elementos por página
```

Ejemplo:

```txt
GET /api/v1/students?page=1&limit=20
```

Valores recomendados:

```txt
page mínimo
= 1

limit mínimo
= 1

limit por defecto
= 20

limit máximo
= 100
```

Estos valores pueden ajustarse, pero deben ser consistentes en todos los módulos.

## Metadata de paginación

La metadata debe ir dentro de `data.meta`.

```json
{
  "page": 1,
  "limit": 20,
  "totalItems": 120,
  "totalPages": 6,
  "hasNextPage": true,
  "hasPreviousPage": false
}
```

Campos:

```txt
page
= página actual

limit
= cantidad solicitada por página

totalItems
= total de registros encontrados

totalPages
= total de páginas disponibles

hasNextPage
= indica si existe página siguiente

hasPreviousPage
= indica si existe página anterior
```

## Items

Los elementos de la página deben ir dentro de `data.items`.

```json
{
  "items": [
    {
      "id": "student-001",
      "code": "STU-001",
      "fullName": "Eder Panta",
      "status": "ACTIVE"
    }
  ]
}
```

Los `items` deben devolver DTOs de respuesta, no entidades internas del dominio ni modelos crudos de Prisma.

## Filtros

Los filtros deben expresarse con query params claros y específicos.

Cuando el criterio de búsqueda corresponde a un campo conocido, el parámetro debe usar el nombre de ese campo.

Ejemplos:

```txt
GET /api/v1/students?code=STU-001
GET /api/v1/students?documentNumber=12345678
GET /api/v1/students?firstName=eder
GET /api/v1/students?lastName=panta
GET /api/v1/students?academicProgramId=program-001
GET /api/v1/students?status=ACTIVE
```

Para cursos:

```txt
GET /api/v1/courses?code=CS-101
GET /api/v1/courses?name=base
GET /api/v1/courses?academicProgramId=program-001
GET /api/v1/courses?status=ACTIVE
```

Para ofertas de curso:

```txt
GET /api/v1/course-offerings?courseId=course-001
GET /api/v1/course-offerings?academicPeriodId=period-001
GET /api/v1/course-offerings?professorId=professor-001
GET /api/v1/course-offerings?section=A
GET /api/v1/course-offerings?status=OPEN
```

Para inscripciones:

```txt
GET /api/v1/enrollments?studentId=student-001
GET /api/v1/enrollments?courseOfferingId=offering-001
GET /api/v1/enrollments?academicPeriodId=period-001
GET /api/v1/enrollments?status=ENROLLED
```

Este enfoque permite que el consumidor de la API sepa exactamente qué criterio está usando.

## Búsqueda global

El parámetro `search` solo debe usarse como búsqueda global opcional.

Debe aplicarse cuando el módulo define explícitamente sobre qué campos busca.

Ejemplo:

```txt
GET /api/v1/students?search=eder
```

La documentación del endpoint debe indicar el alcance de esa búsqueda.

Ejemplo:

```txt
students.search
= busca por código, documento, nombres, apellidos o correo
```

Otro ejemplo:

```txt
courses.search
= busca por código o nombre del curso
```

`search` no debe reemplazar filtros específicos cuando el consumidor necesita controlar el campo exacto.

Preferir:

```txt
GET /api/v1/students?firstName=eder
```

cuando se busca solo por nombres.

Usar:

```txt
GET /api/v1/students?search=eder
```

cuando se quiere una búsqueda libre sobre varios campos definidos por el módulo.

## Ordenamiento

Si se necesita ordenamiento, se puede usar:

```txt
sortBy
sortOrder
```

Ejemplo:

```txt
GET /api/v1/students?sortBy=createdAt&sortOrder=desc
```

Valores recomendados:

```txt
sortOrder=asc
sortOrder=desc
```

Cada módulo debe controlar qué campos pueden usarse en `sortBy`. No se debe permitir ordenar por cualquier campo recibido sin validación.

## Rango de fechas

Para filtrar por fechas, usar nombres explícitos.

Ejemplos:

```txt
createdFrom
createdTo
enrolledFrom
enrolledTo
startDateFrom
startDateTo
```

Ejemplo:

```txt
GET /api/v1/enrollments?enrolledFrom=2026-01-01&enrolledTo=2026-01-31
```

## Filtros por estado

Los estados deben enviarse como valores claros.

Ejemplo:

```txt
GET /api/v1/students?status=ACTIVE
GET /api/v1/course-offerings?status=OPEN
GET /api/v1/enrollments?status=ENROLLED
```

Los valores permitidos deben documentarse en OpenAPI.

## Combinación de filtros

Los filtros pueden combinarse.

Ejemplo:

```txt
GET /api/v1/enrollments?academicPeriodId=period-001&status=ENROLLED&page=1&limit=20
```

La combinación debe interpretarse normalmente como condición `AND`.

Si se combina `search` con filtros específicos, `search` funciona como búsqueda global dentro del conjunto filtrado.

Ejemplo:

```txt
GET /api/v1/students?academicProgramId=program-001&status=ACTIVE&search=eder
```

## Validación de query params

Los query params deben validarse.

Errores comunes:

```txt
page menor que 1
limit mayor que el máximo permitido
status no permitido
sortBy no permitido
fecha con formato inválido
identificador inválido
campo de filtro no soportado
```

Si un query param es inválido, se debe responder con error de validación.

```json
{
  "success": false,
  "statusCode": 400,
  "timestamp": "2026-06-14T10:30:00.000Z",
  "path": "/api/v1/students?page=0",
  "error": {
    "key": "VALIDATION_ERROR",
    "code": "VAL_001",
    "message": "La solicitud contiene campos inválidos.",
    "fieldErrors": [
      {
        "field": "page",
        "message": "La página debe ser mayor o igual a 1."
      }
    ]
  }
}
```

## Paginación vacía

Si no existen resultados, no debe ser error.

Respuesta esperada:

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

Una lista vacía representa una consulta válida sin resultados.

## Filtros por relaciones

Para filtrar por relaciones, usar identificadores explícitos.

Ejemplos:

```txt
academicProgramId
studentId
professorId
courseId
academicPeriodId
courseOfferingId
```

Esto mantiene los filtros claros y evita rutas excesivamente profundas.

## Criterio general

Toda lista importante debería soportar, como mínimo:

```txt
page
limit
```

Y según el módulo:

```txt
filtros específicos por campo
filtros por relación
filtros por estado
rangos de fecha
sortBy
sortOrder
search como búsqueda global opcional
```

La paginación y los filtros deben definirse por módulo, pero el formato de respuesta debe mantenerse igual en toda la API.
