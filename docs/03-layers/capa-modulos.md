# Capa modules

La capa `modules` contiene las capacidades funcionales del sistema.

En este proyecto, los módulos representan partes del dominio académico, acceso, seguridad funcional, administración y soporte. No se limita a entidades académicas.

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

El proceso de inscripción se entiende desde esta capa, pero también las capacidades de acceso se modelan como módulos funcionales.

```txt
students
academic-programs
courses
academic-periods
course-offerings
enrollments
auth
users
roles
permissions
reports
```

## Módulos esperados

Para el alcance actual, una estructura posible es:

```txt
src/modules/
├── auth/
├── users/
├── roles/
├── permissions/
├── persons/
├── students/
├── professors/
├── academic-programs/
├── courses/
├── academic-periods/
├── course-offerings/
├── enrollments/
├── reports/
└── catalogs/
```

La diferencia conceptual es:

```txt
students, professors, courses, enrollments
= módulos del dominio académico

auth, users, roles, permissions
= módulos funcionales de acceso y seguridad

reports, catalogs
= módulos de soporte funcional
```

No todos los módulos necesitan la misma complejidad. Un módulo con muchas reglas, como `enrollments`, puede tener estructura más completa. Un módulo simple, como `catalogs`, puede mantenerse más ligero.

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
```

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

## Módulos de acceso y seguridad

Los módulos de acceso viven en `modules` porque tienen datos, casos de uso y reglas funcionales propias.

```txt
auth
= login, logout, refresh token, sesiones y revocación de accesos

users
= cuentas de usuario, estado y credenciales

roles
= roles del sistema y asignación de roles a usuarios

permissions
= permisos y asignación de permisos a roles
```

La parte técnica de seguridad no pertenece a estos módulos, sino a `platform/security`.

```txt
platform/security
= JWT, guards, decorators, hashing y estrategias técnicas
```

## Sesiones de usuario

Las sesiones pertenecen funcionalmente al módulo `auth`.

```txt
auth
→ user_sessions
```

El módulo `auth` controla cuándo se crea una sesión, cuándo se revoca, cuándo se renueva y si se permiten una o varias sesiones activas por usuario.

`platform/security` puede validar técnicamente un token, pero la regla funcional de sesión pertenece a `auth`.

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
auth importa repositorios internos de roles
reports modifica enrollments
course-offerings usa repositorios internos de professors
```

Preferir:

```txt
enrollments → students/application/ports/in
enrollments → course-offerings/application/ports/in
course-offerings → professors/application/ports/in
auth → users/application/ports/in
auth → roles o permissions mediante capacidades públicas
reports → queries públicas o puertos de lectura
```

## Reglas por módulo

Cada módulo debe ser dueño de sus reglas principales.

Ejemplos:

```txt
students
= estado académico del estudiante, importación de estudiantes

course-offerings
= cupos, sección, estado de oferta, docente asignado

enrollments
= inscripción, duplicidad, cambios de estado

academic-periods
= fechas y estado del periodo académico

auth
= sesiones y flujo de autenticación

users
= cuentas y estado del usuario

roles
= roles y asignación de roles

permissions
= permisos y asignación de permisos a roles

reports
= consultas resumidas sin modificar datos
```

La regla general es que quien es dueño del dato principal debe ser dueño de la regla principal.

## Módulos simples

No todos los módulos necesitan una estructura completa.

Un módulo de catálogo o una capacidad muy simple puede empezar con menos archivos. Si luego crece en reglas, puede adoptar una estructura más completa sin afectar a los demás módulos.

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
```

Esos elementos pertenecen a `platform`.

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
