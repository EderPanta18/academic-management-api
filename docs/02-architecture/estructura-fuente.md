# Estructura fuente

Este documento define la estructura esperada del código fuente y la ubicación general de los archivos principales.

La intención es que cada carpeta tenga una responsabilidad clara y que el proyecto pueda crecer sin perder coherencia con la arquitectura backend.

## Estructura general del proyecto

La raíz del proyecto debe separar el código fuente de los recursos externos, la documentación, los scripts auxiliares y la configuración principal.

```txt
project-root/
├── docs/
├── prisma/
├── public/
├── scripts/
├── src/
├── test/
├── biome.json
├── package.json
├── pnpm-lock.yaml
├── pnpm-workspace.yaml
├── prisma.config.ts
├── tsconfig.build.json
└── tsconfig.json
```

No se incluyen aquí carpetas generadas, dependencias instaladas o salidas temporales, como `node_modules/`, `dist/`, `graphify-out/` o carpetas similares. Esas carpetas pueden existir durante el desarrollo, pero no forman parte de la estructura lógica principal del proyecto.

## Carpetas principales de raíz

La raíz del proyecto organiza recursos que no pertenecen directamente a la estructura interna de `src`.

```txt
docs/
= documentación del proyecto

prisma/
= schema, migraciones, seeds y recursos operativos de base de datos

public/
= archivos públicos o recursos estáticos si el proyecto los necesita

scripts/
= scripts auxiliares de mantenimiento, generación, análisis o automatización

src/
= código fuente de la aplicación NestJS

test/
= pruebas e2e, pruebas de integración o soporte de testing externo a src
```

Esta separación evita mezclar código de aplicación con documentación, base de datos, pruebas y herramientas auxiliares.

## `scripts/`

`scripts/` contiene tareas auxiliares del proyecto.

Puede incluir scripts para:

```txt
- Generar archivos.
- Analizar estructura del código.
- Automatizar tareas repetitivas.
- Preparar datos auxiliares.
- Ejecutar mantenimiento interno.
- Apoyar herramientas de desarrollo.
```

Los scripts no forman parte directa de la aplicación NestJS en ejecución. Si un archivo representa una capacidad del backend, debe vivir en `src`. Si solo ayuda al proyecto desde fuera, puede vivir en `scripts`.

## Estructura principal de `src`

La estructura principal recomendada dentro de `src` es:

```txt
src/
├── main.ts
├── worker.ts
├── app/
├── core/
├── modules/
├── platform/
├── workers/
└── shared/
```

No se recomienda crear una carpeta global `common`, porque suele mezclar responsabilidades que ya están separadas entre `core`, `platform` y `shared`.

## `main.ts`

`main.ts` es el punto de entrada de la aplicación.

Debe mantenerse pequeño y delegar la configuración de arranque.

Uso esperado:

```txt
- Crear la aplicación NestJS.
- Aplicar configuración inicial mínima.
- Iniciar el servidor.
```

No debe contener lógica funcional ni configuración extensa.

## `worker.ts`

`worker.ts` es el punto de entrada del proceso de workers.

Debe mantenerse pequeño y delegar la configuración de arranque.

Uso esperado:

```txt
- Crear el contexto de NestJS en modo aplicación, sin HTTP.
- Registrar los procesadores de jobs y handlers de eventos a través de `workers/`.
- Iniciar la suscripción a la cola y al bus de eventos.
- Mantener el proceso activo mientras el sistema está en ejecución.
```

No debe contener lógica funcional ni reglas de negocio. La API y los workers se ejecutan como procesos independientes.

## `app/`

`app/` contiene la composición principal de la aplicación.

Uso esperado:

```txt
src/app/
- Módulo raíz.
- Registro de módulos funcionales.
- Registro de infraestructura global.
- Configuración general de arranque.
```

No debe contener controladores de negocio, repositorios, entidades ni casos de aplicación.

Los workers no pasan por `app/`. Tienen su propio entrypoint en `worker.ts` y su propia composición en `workers/`.

## `core/`

`core/` contiene elementos puros y estables.

Uso esperado:

```txt
src/core/
- Excepciones base.
- Contratos fundamentales.
- Tipos estables.
- Value objects generales.
- Paginación base.
- Constantes puras si son necesarias.
```

Restricciones:

```txt
- No importar NestJS.
- No importar Prisma.
- No importar módulos funcionales.
- No importar platform.
- No depender de HTTP.
```

Los contratos de capacidades transversales que no dependen de tecnología viven aquí. Por ejemplo, el contrato de `JobQueue` y el de `EventBus`, que describen cómo encolar trabajo y cómo publicar eventos internos sin asumir una implementación concreta.

## `modules/`

`modules/` contiene capacidades funcionales del sistema.

No se limita únicamente a módulos académicos. También puede contener módulos de identidad, acceso, autorización, auditoría y soporte.

Estructura de alto nivel esperada:

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

Los módulos pueden ajustarse según avance el sistema, pero deben responder a una capacidad funcional clara y no solo a nombres de tablas.

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

Los catálogos no forman un módulo por defecto. Cada catálogo vive dentro del módulo que lo usa: `document_types` en `identity`, `course_categories` en `courses`. Si un catálogo llega a ser compartido por varios módulos, puede evaluarse extraerlo a un módulo propio de catálogos compartidos.

## Estructura interna sugerida de un módulo

Un módulo con reglas importantes puede organizarse así:

```txt
module-name/
├── module-name.module.ts
├── domain/
├── application/
├── infrastructure/
├── entrypoints/
│   ├── http/
│   └── queue/
└── index.ts
```

Uso esperado:

```txt
domain
= entidades, value objects, reglas y excepciones propias

application
= casos de aplicación, comandos, consultas, puertos y coordinación funcional

infrastructure
= adaptadores técnicos, repositorios concretos, queries y mappers de persistencia

entrypoints
= puntos de entrada del módulo
```

Los entrypoints separan los distintos medios por los que el módulo es invocado:

```txt
entrypoints/http
= controladores, DTOs, validaciones HTTP, decoradores y mappers HTTP

entrypoints/queue
= procesadores de jobs o handlers de eventos que reciben payloads de la cola
```

Los procesadores de `entrypoints/queue` no contienen reglas de negocio. Delegan la lógica en casos de uso o servicios del mismo módulo.

No todos los módulos deben tener todas las carpetas desde el inicio. Si el módulo es simple, puede empezar con menos estructura y crecer cuando tenga más reglas o responsabilidades.

## `platform/`

`platform/` contiene infraestructura técnica global.

Estructura posible:

```txt
src/platform/
├── config/
├── database/
├── http/
├── files/
├── security/
├── queue/
├── audit/
└── logging/
```

Uso esperado:

```txt
config
= variables y configuración de entorno

database
= conexión global a base de datos

http
= filtros, interceptores, pipes, guards y configuración HTTP global

files
= lectura técnica de archivos y parsers CSV/XLSX

security
= soporte técnico de autenticación y autorización

queue
= implementación concreta de la cola de jobs y el bus de eventos

audit
= infraestructura transversal de auditoría

logging
= registro técnico de eventos
```

`platform` no debe contener reglas académicas ni reglas funcionales de identidad, acceso o autorización.

La infraestructura de auditoría puede vivir aquí, pero su consulta administrativa y sus contratos funcionales pertenecen al módulo `audit`.

`platform/queue` implementa los contratos definidos en `core`. La tecnología concreta de la cola y del bus de eventos es un detalle reemplazable; los módulos no deberían conocerla.

## `workers/`

`workers/` contiene la orquestación del proceso asíncrono que consume jobs y eventos fuera del flujo HTTP.

Estructura posible:

```txt
src/workers/
├── register-jobs.ts
└── index.ts
```

Uso esperado:

```txt
register-jobs.ts
= conecta los procesadores de jobs y handlers de eventos expuestos por los módulos con las implementaciones de cola y bus de eventos de `platform/queue`

index.ts
= agrupa y expone lo necesario para que `worker.ts` arranque la orquestación
```

Los workers no exponen endpoints, no contienen reglas de negocio y no forman parte del arranque de la API. Delegan la lógica real en casos de uso y servicios de los módulos, usando los contratos de `core` y las implementaciones de `platform/queue`.

Los procesadores y handlers concretos viven en `modules/<module>/entrypoints/queue/`. `workers/` solo los registra.

## `shared/`

`shared/` contiene piezas reutilizables simples.

Estructura posible:

```txt
src/shared/
├── decorators/
├── dtos/
├── helpers/
├── mappers/
├── schemas/
├── types/
└── utils/
```

Uso esperado:

```txt
- Helpers pequeños.
- DTOs realmente compartidos.
- Schemas reutilizables.
- Tipos auxiliares.
- Funciones de transformación ligeras.
```

Si una pieza empieza a tener lógica de negocio, debe moverse al módulo correspondiente. Si depende de infraestructura, debe moverse a `platform`. Si representa una base estable del sistema, debe evaluarse si pertenece a `core`.

## `prisma/`

`prisma/` debe permanecer fuera de `src`.

Uso esperado:

```txt
prisma/
├── schema.prisma
├── migrations/
├── seed.ts
├── data/
└── seeds/
```

Esta carpeta administra recursos de base de datos, pero no representa la capa de persistencia interna de la aplicación.

La aplicación debe usar servicios o repositorios dentro de `src`, normalmente desde `platform/database` y desde la infraestructura de cada módulo.

## Documentación

La documentación debe separarse del código fuente.

Estructura sugerida:

```txt
docs/
├── 01-product/
├── 02-architecture/
├── 03-layers/
├── 04-api/
├── 05-security/
├── 06-data/
├── 07-operations/
└── 08-roadmap/
```

Los documentos de producto explican el problema y el dominio. Los documentos técnicos explican arquitectura, capas, API, seguridad, datos y operación.

## Regla rápida de ubicación

Para ubicar un archivo nuevo:

```txt
¿Arranca la API?
→ src/main.ts

¿Arranca el proceso de workers?
→ src/worker.ts

¿Compone la aplicación HTTP?
→ src/app/

¿Es base estable y sin tecnología concreta?
→ src/core/

¿Pertenece a una capacidad funcional del sistema?
→ src/modules/

¿Es un punto de entrada HTTP del módulo?
→ src/modules/<module>/entrypoints/http/

¿Es un procesador de jobs o handler de eventos del módulo?
→ src/modules/<module>/entrypoints/queue/

¿Depende de tecnología o integra herramientas externas?
→ src/platform/

¿Es la orquestación del proceso asíncrono?
→ src/workers/

¿Es reutilizable, simple y transversal?
→ src/shared/

¿Es schema, migración o seed?
→ prisma/

¿Es una tarea auxiliar del proyecto?
→ scripts/

¿Explica decisiones o funcionamiento?
→ docs/

¿Es una prueba externa o e2e?
→ test/
```

## Estructura recomendada completa

```txt
project-root/
├── docs/
├── prisma/
├── public/
├── scripts/
├── src/
│   ├── main.ts
│   ├── worker.ts
│   ├── app/
│   ├── core/
│   ├── modules/
│   ├── platform/
│   ├── workers/
│   │   ├── register-jobs.ts
│   │   └── index.ts
│   └── shared/
├── test/
├── biome.json
├── package.json
├── pnpm-lock.yaml
├── pnpm-workspace.yaml
├── prisma.config.ts
├── tsconfig.build.json
└── tsconfig.json
```

La estructura debe permitir encontrar cada archivo por responsabilidad y evitar que el proyecto crezca de forma desordenada.
