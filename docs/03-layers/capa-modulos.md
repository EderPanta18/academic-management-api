# Capa modules

La capa `modules` contiene las capacidades funcionales del sistema.

En este proyecto, los módulos representan partes del dominio académico, identidad, acceso, seguridad funcional, administración y soporte. No se limita a entidades académicas.

La idea no es agrupar archivos por tipo global, sino por responsabilidad funcional. Por eso no se recomienda tener carpetas raíz como `controllers`, `services`, `repositories` o `dtos` para todo el sistema. Cada módulo debe conservar cerca lo que le pertenece.

## Ubicación

```txt
src/
└── modules/
```

## Rol dentro del sistema

`modules` es el centro funcional del backend.

Aquí deben vivir:

```txt
- Reglas de negocio.
- Casos de aplicación.
- Entidades de dominio.
- Puertos.
- Adaptadores propios del módulo.
- Controladores del módulo.
- DTOs del módulo.
- Mappers del módulo.
```

El proceso de inscripción se entiende desde esta capa, pero también las capacidades de identidad y acceso se modelan como módulos funcionales.

```txt
identity
students
academic-programs
courses
academic-periods
course-offerings
enrollments
users
authorization
audit
reports
```

## Módulos esperados

Para el alcance actual, una estructura posible es:

```txt
src/modules/
├── identity/
├── students/
├── professors/
├── academic-programs/
├── courses/
├── academic-periods/
├── course-offerings/
├── enrollments/
├── users/
├── authorization/
├── audit/
└── reports/
```

La diferencia conceptual es:

```txt
identity
= identidad personal base y tipos de documento

students, professors, academic-programs, courses, academic-periods, course-offerings, enrollments
= módulos del dominio académico

users, authorization
= módulos funcionales de acceso y seguridad

audit, reports
= módulos de soporte funcional
```

No todos los módulos necesitan la misma complejidad. Un módulo con muchas reglas, como `enrollments`, puede tener estructura más completa. Un módulo simple, como `professors` o `academic-programs`, puede mantenerse más ligero.

Los catálogos no forman un módulo por defecto. Cada catálogo vive dentro del módulo que lo usa: `document_types` en `identity`, `course_categories` en `courses`. Si un catálogo llega a ser compartido por varios módulos, puede evaluarse extraerlo a un módulo propio de catálogos compartidos.

## Estructura interna sugerida

Un módulo con reglas relevantes puede organizarse así:

```txt
src/modules/<module>/
├── <module>.module.ts
├── domain/
├── application/
├── infrastructure/
├── presentation/
└── index.ts
```

En NestJS, `<module>.module.ts` integra controllers, providers, imports y exports del módulo.

No todos los módulos necesitan todas las carpetas desde el inicio. La estructura debe acompañar la complejidad real del módulo.

## `domain`

`domain` contiene el modelo interno y las reglas propias del módulo.

Puede incluir:

```txt
- Entidades.
- Value objects.
- Constantes de dominio.
- Estados propios del módulo.
- Excepciones de dominio.
- Servicios de dominio.
```

El dominio no debe depender de:

```txt
- NestJS.
- Prisma.
- HTTP.
- Swagger.
- DTOs.
- Controladores.
- Repositorios concretos.
- Contratos de cola o eventos.
```

El dominio no conoce mecanismos de ejecución. Si una decisión de negocio debe diferirse, quien decide es la aplicación; el dominio no encola ni publica.

## `application`

`application` contiene la orquestación funcional del módulo.

Puede incluir:

```txt
- Casos de uso.
- Comandos.
- Consultas.
- Puertos de entrada.
- Puertos de salida.
- Resultados.
- Read models.
- Servicios de aplicación.
- Excepciones de aplicación.
```

Esta capa coordina reglas, entidades y dependencias, pero no implementa detalles técnicos directamente.

Un caso de uso no debería consultar Prisma de forma directa. Debe hacerlo mediante un puerto de salida implementado por infraestructura.

Cuando un caso de uso identifica trabajo que no debería resolverse dentro de la petición HTTP, puede encolar un job o publicar un evento a través de los contratos de `core`. El caso de uso conserva la decisión; el worker solo ejecuta lo decidido. El módulo nunca invoca un worker directamente.

## `infrastructure`

`infrastructure` contiene implementaciones técnicas propias del módulo.

Puede incluir:

```txt
- Repositorios concretos.
- Queries concretas.
- Mappers de persistencia.
- Adaptadores técnicos.
- Providers propios del módulo.
```

Esta capa puede usar servicios de `platform`, como la conexión a base de datos o el manejo técnico de archivos.

```txt
modules/<module>/infrastructure
→ platform/database
```

## `presentation`

`presentation` contiene la entrada y salida HTTP del módulo.

En NestJS, normalmente incluye:

```txt
- Controllers.
- DTOs de request.
- DTOs de response.
- DTOs de query.
- Decoradores Swagger del módulo.
- Pipes propios del módulo.
- Mappers HTTP.
- Constantes de rutas.
```

La presentación no debe contener reglas de negocio. Su función es adaptar HTTP hacia la aplicación.

La presentación no ejecuta trabajo intensivo. Si un caso de uso necesita diferirse, la presentación solo recibe la respuesta del caso de uso, que puede incluir un identificador de job si corresponde.

## Módulos de acceso y seguridad

Los módulos de acceso viven en `modules` porque tienen datos, casos de uso y reglas funcionales propias.

```txt
users
= cuentas de usuario, credenciales, sesiones, login, logout y refresh token

authorization
= roles, permisos y asignación entre usuarios, roles y permisos
```

La parte técnica de seguridad no pertenece a estos módulos, sino a `platform/security`.

```txt
platform/security
= JWT, guards, decorators, hashing y estrategias técnicas
```

## Sesiones de usuario

Las sesiones pertenecen funcionalmente al módulo `users`.

```txt
users
→ user_sessions
```

El módulo `users` controla cuándo se crea una sesión, cuándo se revoca, cuándo se renueva y si se permiten una o varias sesiones activas por usuario. También administra las cuentas y credenciales, que son parte del mismo flujo de autenticación.

`platform/security` puede validar técnicamente un token, pero la regla funcional de sesión pertenece a `users`.

## Flujo de escritura

Una operación de escritura debería seguir una dirección similar:

```txt
Controller
→ Request DTO
→ Mapper
→ Command
→ Use Case
→ Domain
→ Port Out
→ Infrastructure
→ Database
```

El controlador no decide reglas. El caso de uso coordina. El dominio protege invariantes. La infraestructura persiste.

Si el caso de uso decide diferir trabajo, puede encolar un job a través del contrato de `JobQueue` antes de finalizar. El encolado se hace dentro de la misma transacción que persiste el cambio cuando la implementación lo permite.

## Flujo de lectura

Una operación de lectura puede seguir este recorrido:

```txt
Controller
→ Query DTO
→ Mapper
→ Application Query
→ Use Case
→ Query Port
→ Infrastructure Query
→ Read Model
→ Response DTO
```

Las lecturas pueden usar read models cuando no sea necesario reconstruir una entidad de dominio completa.

## Comunicación entre módulos

Un módulo no debe entrar libremente en los detalles de otro.

Evitar:

```txt
enrollments importa students/infrastructure
enrollments importa students/domain/entities
users importa repositorios internos de authorization
reports modifica enrollments
course-offerings usa repositorios internos de professors
```

Preferir:

```txt
enrollments → students/application/ports/in
enrollments → course-offerings/application/ports/in
course-offerings → professors/application/ports/in
users → authorization/application/ports/in
reports → queries públicas o puertos de lectura
```

## Workers y módulos

Los workers no son módulos. Son procesos asíncronos que consumen jobs y eventos desde fuera del flujo HTTP.

Un worker no importa detalles internos de un módulo. Consume casos de uso, servicios o contratos públicos del módulo dueño.

```txt
worker
→ consume un caso de uso de students
→ students valida, persiste y decide
```

Un worker no debe contener reglas de negocio ni consultar tablas directamente. Toda decisión vive en el módulo.

Los módulos no dependen de workers. La dependencia va en una sola dirección: los workers consumen módulos.

Si un módulo necesita diferir trabajo, encola un job o publica un evento a través de los contratos de `core`. El módulo no sabe quién consume ese trabajo.

## Reglas por módulo

Cada módulo debe ser dueño de sus reglas principales.

Ejemplos:

```txt
identity
= identidad personal y tipos de documento

students
= estado académico del estudiante, importación de estudiantes

course-offerings
= cupos, sección, estado de oferta, docente asignado

enrollments
= inscripción, duplicidad, cambios de estado

academic-periods
= fechas y estado del periodo académico

courses
= catálogo de cursos y categorías de curso

users
= cuentas, credenciales, sesiones y flujo de autenticación

authorization
= roles, permisos y asignación entre usuarios, roles y permisos

reports
= consultas resumidas sin modificar datos
```

La regla general es que quien es dueño del dato principal debe ser dueño de la regla principal.

## Módulos simples

No todos los módulos necesitan una estructura completa.

Un módulo con pocas reglas puede empezar con menos archivos. Si luego crece en reglas, puede adoptar una estructura más completa sin afectar a los demás módulos.

La arquitectura permite crecimiento progresivo.

## Qué no pertenece a `modules`

No pertenecen directamente a `modules`:

```txt
- Configuración global.
- Conexión global a base de datos.
- Plugins HTTP globales.
- Parser de archivos genérico.
- Logger global.
- Formato global de respuesta.
- Guards técnicos reutilizables.
- Estrategias JWT.
- Hashing técnico de contraseñas.
- Procesadores de jobs.
- Handlers de eventos.
- Entrypoints de workers.
```

Esos elementos pertenecen a `platform` o a `workers`.

## Crecimiento esperado

Cuando el sistema crezca, se pueden agregar nuevos módulos sin modificar profundamente los existentes.

La clave es mantener fronteras claras:

```txt
Nuevo módulo
→ define su dominio
→ define sus casos de uso
→ define sus puertos
→ define su infraestructura
→ expone solo lo necesario
```

## Criterio de uso

Antes de crear o modificar un módulo, conviene preguntar:

```txt
¿Qué capacidad funcional representa?
Qué reglas controla?
Qué datos son su responsabilidad?
Qué expone hacia otros módulos?
Qué detalles debe mantener internos?
```

Si esas respuestas no están claras, el módulo todavía no está bien delimitado.
