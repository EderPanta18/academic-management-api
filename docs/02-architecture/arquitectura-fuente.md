# Arquitectura fuente

Este documento explica la filosofía de organización del código fuente. Su objetivo es definir cómo se entiende el proyecto internamente y qué papel cumple cada zona principal dentro de `src`.

La arquitectura sigue una variante práctica de Clean Architecture aplicada a un backend modular. No busca imponer carpetas por formalidad, sino mantener una separación clara entre negocio académico, infraestructura técnica, código compartido, procesamiento asíncrono y composición de la aplicación.

## Idea principal

El código fuente debe organizarse según responsabilidades.

```txt
app
= composición y arranque de la aplicación

core
= base estable y transversal del sistema

modules
= capacidades funcionales y reglas del negocio académico

platform
= infraestructura técnica global

workers
= procesos asíncronos que consumen jobs y eventos

shared
= utilidades ligeras reutilizables
```

Esta división permite leer el sistema desde tres perspectivas: como una aplicación técnica, como un conjunto de capacidades del negocio académico y como un conjunto de procesos que operan fuera del flujo HTTP.

## Relación con el dominio del sistema

El centro funcional del sistema está en el proceso de inscripción académica.

Por eso, `modules` debe contener los módulos que representan el dominio:

```txt
students
professors
academic-programs
courses
academic-periods
course-offerings
enrollments
reports
```

El dominio no debe quedar disperso en carpetas globales como `services`, `controllers`, `repositories` o `dtos` a nivel raíz. Cada capacidad debe mantener cerca sus piezas relacionadas.

## `app`

`app` representa la composición de la aplicación.

Debe encargarse de unir módulos, plataforma y configuración global. No contiene reglas académicas ni detalles concretos de persistencia.

Puede contener:

```txt
- Módulo raíz.
- Configuración de arranque.
- Registro global de módulos.
- Integración entre módulos funcionales y plataforma.
```

No debería contener:

```txt
- Entidades de dominio.
- Casos de aplicación.
- Repositorios de negocio.
- Controladores funcionales.
- Lógica de inscripción.
```

## `core`

`core` contiene elementos estables que pueden ser usados por varias partes del sistema.

Debe ser lo más independiente posible.

Puede contener:

```txt
- Excepciones base.
- Contratos fundamentales.
- Value objects generales.
- Tipos estables.
- Constantes puras.
- Abstracciones transversales sin tecnología concreta.
```

Entre los contratos fundamentales viven los que describen capacidades transversales sin depender de ninguna tecnología: por ejemplo, el contrato de `JobQueue` y el de `EventBus`. Estos contratos no describen reglas de negocio ni detalles de infraestructura, solo la mecánica general de encolar trabajo y publicar eventos internos.

No debe depender de:

```txt
- NestJS.
- Prisma.
- HTTP.
- Swagger.
- Módulos funcionales.
- Servicios externos.
```

Si `core` empieza a importar infraestructura o módulos concretos, deja de ser una base estable.

## `modules`

`modules` contiene el negocio del sistema.

Cada módulo representa una capacidad funcional. En este proyecto, los módulos principales se relacionan con la inscripción académica, con los datos que la sostienen y con el control de acceso que la protege.

Ejemplos:

```txt
identity
students
professors
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

Un módulo puede contener:

```txt
- Dominio.
- Casos de aplicación.
- Contratos internos.
- Adaptadores de infraestructura propios.
- Controladores.
- DTOs.
- Mappers.
```

No todos los módulos necesitan la misma profundidad. `enrollments` puede requerir más estructura que `professors` o `academic-programs`.

Los catálogos no forman un módulo por sí mismos. Cada catálogo vive dentro del módulo que lo usa: los tipos de documento en `identity`, las categorías de curso en `courses`. Solo se extraen a un módulo propio si varios módulos llegan a depender del mismo catálogo.

Cuando un caso de uso necesita delegar trabajo pesado o anunciar un hecho, puede encolar un job o publicar un evento a través de los contratos de `core`. Nunca ejecuta trabajo intensivo dentro del flujo HTTP.

## `platform`

`platform` contiene infraestructura técnica global.

Representa herramientas y mecanismos necesarios para que la aplicación funcione, pero que no son negocio académico.

Puede contener:

```txt
- Conexión a base de datos.
- Configuración.
- HTTP global.
- Swagger.
- Autenticación técnica.
- Lectura de archivos.
- Auditoría técnica.
- Implementación concreta de colas y event bus.
- Logging.
- Cache.
- Integraciones externas.
```

`platform` implementa los contratos de `core` con tecnologías concretas. Por ejemplo, el contrato de `JobQueue` se implementa sobre una librería de colas, y el contrato de `EventBus` sobre un mecanismo de eventos interno. La tecnología específica es un detalle reemplazable.

`platform` no debe contener reglas como “un estudiante no puede inscribirse si la oferta no tiene cupo”. Esa regla pertenece a los módulos funcionales.

## `workers`

`workers` contiene procesos autónomos que se ejecutan en paralelo a la API.

Los workers consumen jobs y eventos a través de los contratos de `core` y delegan la lógica real en casos de uso y servicios de los módulos. No forman parte del flujo HTTP y no exponen endpoints.

Puede contener:

```txt
- Entrypoints de workers.
- Registro de procesadores de jobs.
- Registro de handlers de eventos.
```

No debería contener:

```txt
- Entidades de dominio.
- Casos de aplicación.
- Repositorios.
- Controladores HTTP.
- Reglas de negocio.
```

Un worker se limita a conectar la cola o el bus con el módulo dueño del proceso. La regla de negocio vive en el módulo, no en el worker.

## `shared`

`shared` contiene piezas reutilizables ligeras.

Puede contener:

```txt
- Helpers simples.
- DTOs compartidos.
- Tipos auxiliares.
- Decoradores reutilizables.
- Funciones pequeñas sin dependencia fuerte.
```

Debe mantenerse reducido. Si algo crece demasiado o empieza a tener reglas importantes, probablemente pertenece a un módulo. Si depende de tecnología, probablemente pertenece a `platform`. Si es base fundamental, probablemente pertenece a `core`.

## Recursos fuera de `src`

No todo archivo del proyecto pertenece a la arquitectura interna de la aplicación.

Carpetas como estas deben permanecer fuera de `src`:

```txt
prisma/
docs/
test/
public/
```

`prisma/` contiene schema, migraciones, seeds y datos iniciales. Aunque se relaciona con la base de datos, no reemplaza la capa de infraestructura usada por la aplicación.

La aplicación debe acceder a la base de datos mediante servicios o adaptadores dentro de `src/platform` y/o dentro de la infraestructura de cada módulo.

## Dirección general de dependencias

La dependencia debe fluir desde lo concreto hacia lo más estable.

```txt
main.ts
→ app
→ modules
→ core/shared
```

Para el flujo asíncrono:

```txt
workers
→ core (contratos)
→ modules (casos de uso y servicios)
→ platform (implementaciones concretas de cola y bus)
```

Relaciones aceptables:

```txt
app      → modules, platform, core, shared
modules  → core, shared
platform → core, shared
workers  → core, modules, platform, shared
shared   → core
```

Relaciones que deben evitarse:

```txt
core     → app
core     → modules
core     → platform
shared   → modules
platform → modules
modules  → app
workers  → app
modules  → workers
```

Cuando un módulo necesita una capacidad técnica, debe hacerlo mediante una abstracción o a través de su infraestructura, no mezclando la regla de negocio con el detalle técnico.

## Lectura rápida del proyecto

Una forma práctica de leer el proyecto es:

```txt
app
= cómo se levanta y conecta todo

modules
= qué hace el sistema para el negocio

platform
= con qué tecnología se conecta

workers
= qué procesos se ejecutan fuera del flujo HTTP

core
= qué fundamentos estables comparte

shared
= qué piezas ligeras se reutilizan
```

Esta organización evita que el sistema se convierta en un conjunto de carpetas globales sin contexto y mantiene el dominio académico como centro del backend, separando con claridad el trabajo interactivo del trabajo diferido.
