# Diseño de API

Este documento define criterios generales para diseñar la API HTTP del backend.

La API debe ser consistente, fácil de consumir y coherente con el dominio académico del sistema. No se busca que cada endpoint tenga una forma distinta de responder o nombrarse. La intención es que los recursos principales tengan una estructura predecible.

## Enfoque general

La API se organiza alrededor de recursos del dominio.

Los recursos principales del sistema son:

```txt
personas
estudiantes
docentes
programas académicos
cursos
periodos académicos
ofertas de curso
inscripciones
usuarios
roles
reportes
catálogos
```

Cada recurso debe exponer operaciones claras y alineadas con su responsabilidad.

## Prefijo de API

La API debe usar un prefijo versionado.

```txt
/api/v1
```

Ejemplos:

```txt
/api/v1/students
/api/v1/professors
/api/v1/academic-programs
/api/v1/courses
/api/v1/academic-periods
/api/v1/course-offerings
/api/v1/enrollments
```

El versionado permite evolucionar la API sin romper clientes existentes.

## Nombres de rutas

Las rutas deben usar nombres en inglés técnico, en plural y en formato kebab-case.

Ejemplos:

```txt
students
professors
academic-programs
academic-periods
course-offerings
enrollments
```

Aunque la documentación esté en español, los nombres de rutas pueden mantenerse en inglés por consistencia técnica con el código.

Evitar rutas mezcladas o ambiguas:

```txt
/api/v1/carreras
/api/v1/getStudents
/api/v1/courseOfferings
```

Preferir:

```txt
/api/v1/academic-programs
/api/v1/students
/api/v1/course-offerings
```

## Métodos HTTP

Los métodos HTTP deben expresar la intención de la operación.

```txt
GET
= consultar recursos

POST
= crear recursos o ejecutar operaciones de creación

PATCH
= modificar parcialmente un recurso

DELETE
= eliminar, desactivar o cancelar según el contexto

PUT
= reemplazo completo, solo si realmente se necesita
```

Uso común:

```txt
GET    /api/v1/students
GET    /api/v1/students/:id
POST   /api/v1/students
PATCH  /api/v1/students/:id
DELETE /api/v1/students/:id
```

## Operaciones de negocio

No toda operación debe forzarse como CRUD puro.

Si una acción representa una transición clara del dominio, puede exponerse como una subruta de acción.

Ejemplos:

```txt
PATCH /api/v1/enrollments/:id/cancel
PATCH /api/v1/course-offerings/:id/close
PATCH /api/v1/course-offerings/:id/reopen
POST  /api/v1/students/import
```

Estas rutas son aceptables cuando expresan acciones del negocio y no solo cambios genéricos de campos.

## Recursos anidados

Los recursos anidados deben usarse con moderación.

Son útiles cuando la relación mejora la lectura de la API.

Ejemplos válidos:

```txt
GET /api/v1/course-offerings/:id/enrollments
GET /api/v1/students/:id/enrollments
GET /api/v1/academic-periods/:id/course-offerings
```

No conviene crear rutas demasiado profundas.

Evitar:

```txt
/api/v1/academic-programs/:programId/students/:studentId/enrollments/:enrollmentId/course-offerings/:offeringId
```

Una ruta muy profunda suele ser difícil de mantener y consumir.

## Parámetros de ruta

Los parámetros de ruta se usan para identificar un recurso específico.

Ejemplos:

```txt
GET /api/v1/students/:id
PATCH /api/v1/course-offerings/:id
DELETE /api/v1/enrollments/:id
```

El nombre `:id` es suficiente cuando el contexto de la ruta ya indica el recurso.

## Query params

Los query params se usan para paginación, filtros, ordenamiento y búsqueda.

Ejemplo:

```txt
GET /api/v1/students?page=1&limit=20&status=ACTIVE&firstName=eder
```

Los filtros deben ser explícitos cuando el criterio es conocido. Si se quiere filtrar por nombre, código, documento, estado o relación, el parámetro debe nombrar ese campo.

Ejemplos:

```txt
GET /api/v1/students?code=STU-001
GET /api/v1/students?documentNumber=12345678
GET /api/v1/students?firstName=eder
GET /api/v1/students?lastName=panta
GET /api/v1/students?academicProgramId=program-001
GET /api/v1/students?status=ACTIVE
```

El parámetro `search` puede existir, pero solo como búsqueda global opcional cuando el módulo define claramente sobre qué campos busca.

Ejemplo:

```txt
GET /api/v1/students?search=eder
```

En ese caso, la documentación del módulo debe indicar el criterio usado, por ejemplo: código, documento, nombres, apellidos o correo.

Los query params no deben usarse para ejecutar acciones de negocio. Para eso se usan métodos y rutas específicas.

## Cuerpo de la solicitud

El body debe usarse en operaciones de creación o actualización.

Ejemplo:

```json
{
  "code": "STU-001",
  "personId": "person-001",
  "academicProgramId": "program-001",
  "admissionYear": 2026
}
```

El body debe representar datos de entrada, no estructuras internas del dominio.

Los DTOs HTTP no deben exponerse como entidades internas.

## Respuestas

Todas las respuestas deben seguir un formato uniforme.

Éxito:

```json
{
  "success": true,
  "statusCode": 200,
  "timestamp": "2026-06-14T10:30:00.000Z",
  "path": "/api/v1/students/123",
  "data": {}
}
```

Error:

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

El formato detallado se describe en `formato-respuesta.md`.

## Códigos HTTP

Los códigos HTTP deben usarse de forma coherente.

```txt
200
= operación exitosa

201
= recurso creado

400
= solicitud inválida o campos incorrectos

401
= usuario no autenticado

403
= usuario autenticado sin permisos

404
= recurso no encontrado

409
= conflicto con una regla de negocio

422
= datos válidos en forma, pero no procesables según el contexto, si se decide usarlo

500
= error inesperado
```

Para reglas de negocio que bloquean una operación, normalmente se usa `409 Conflict`.

Ejemplos:

```txt
Estudiante ya inscrito.
Oferta sin cupos.
Periodo cerrado.
Cupo máximo menor que inscritos activos.
```

## Separación entre HTTP y negocio

La API HTTP es una forma de entrada y salida. No debe definir el negocio.

Los controladores deben:

```txt
- Recibir datos.
- Validar la forma de entrada.
- Delegar en casos de uso.
- Retornar respuestas.
```

No deben:

```txt
- Decidir si una inscripción es válida.
- Calcular cupos.
- Consultar Prisma directamente.
- Cambiar estados sin pasar por aplicación o dominio.
```

## Consistencia entre módulos

Cada módulo puede tener endpoints propios, pero todos deben respetar las mismas convenciones:

```txt
- Prefijo /api/v1.
- Rutas en plural.
- Kebab-case.
- Respuesta uniforme.
- Errores uniformes.
- Paginación uniforme.
- Filtros explícitos por query params.
- Búsqueda global solo cuando el módulo la defina.
```

Esto permite que el backend se sienta como una sola API y no como varias APIs distintas por módulo.
