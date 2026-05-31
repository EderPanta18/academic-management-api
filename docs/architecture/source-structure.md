# Source Structure

## Propósito

Este documento define cómo debe componerse la estructura principal del código fuente. A diferencia del documento de arquitectura, aquí se describe la organización esperada de carpetas y la ubicación general de los elementos del proyecto.

El objetivo es que cualquier nuevo archivo tenga una ubicación clara y que la estructura mantenga coherencia con las responsabilidades arquitectónicas.

## Estructura general del proyecto

La raíz del proyecto debe separar el código fuente de los recursos externos.

```txt
project-root/
├── prisma/
├── docs/
├── public/
├── test/
├── src/
├── package.json
├── tsconfig.json
└── nest-cli.json
```

`src/` contiene el código de la aplicación. Las demás carpetas cumplen funciones externas, de documentación, pruebas, archivos públicos, configuración o administración de base de datos.

## Estructura principal de `src`

La estructura principal recomendada dentro de `src/` es:

```txt
src/
├── main.ts
├── app/
├── core/
├── modules/
├── platform/
└── shared/
```

No se recomienda agregar una carpeta principal `common`, porque sus responsabilidades quedarían solapadas con `core`, `shared` y `platform`.

## `main.ts`

`main.ts` debe mantenerse como punto de entrada mínimo.

Debe iniciar la aplicación y delegar la configuración de arranque. No debe contener lógica extensa.

Ubicación:

```txt
src/
└── main.ts
```

## `app/`

`app/` debe contener la composición principal de NestJS.

Uso esperado:

```txt
src/app/
- Módulo raíz de la aplicación
- Configuración de arranque
- Registro global de módulos
- Composición de platform y modules
```

No debe contener entidades, repositorios, servicios de base de datos, controladores funcionales ni reglas de negocio.

## `core/`

`core/` debe contener elementos puros y estables del sistema.

Uso esperado:

```txt
src/core/
- Excepciones base
- Value objects generales
- Tipos fundamentales
- Contratos estables
- Constantes puras
- Abstracciones transversales sin dependencia técnica
```

No debe importar NestJS, Prisma, HTTP, Swagger, servicios externos ni módulos funcionales.

## `modules/`

`modules/` debe contener los módulos funcionales del sistema.

Uso esperado:

```txt
src/modules/
- Módulos de negocio
- Reglas funcionales
- Casos de uso
- Controladores propios de cada módulo
- DTOs propios de cada módulo
- Adaptadores y repositorios propios de cada módulo
```

Cada capacidad funcional debe vivir en su propio módulo. La estructura interna de cada módulo puede definirse en documentos específicos, pero la regla general es que todo lo que pertenezca a una capacidad de negocio debe permanecer dentro de su módulo.

Ejemplo de composición de alto nivel:

```txt
src/modules/
├── module-a/
├── module-b/
└── module-c/
```

Los nombres reales deben responder al dominio del sistema.

## `platform/`

`platform/` debe contener infraestructura técnica global.

Uso esperado:

```txt
src/platform/
- Base de datos usada por la aplicación
- Configuración técnica
- Filtros globales
- Interceptores globales
- Pipes globales
- Guards globales
- Swagger
- Manejo de archivos
- Logging
- Cache
- Colas
- Storage
- Integraciones externas
```

Aquí debe ubicarse el servicio de conexión a base de datos usado por NestJS. Por ejemplo, el servicio Prisma de la aplicación pertenece a `platform`, no a `prisma/`.

`platform` no debe contener lógica de negocio ni depender de módulos funcionales.

## `shared/`

`shared/` debe contener código reutilizable ligero.

Uso esperado:

```txt
src/shared/
- Decoradores reutilizables
- DTOs compartidos
- Respuestas genéricas
- Helpers simples
- Mappers ligeros
- Tipos auxiliares reutilizables
```

`shared` debe mantenerse reducido. Si una pieza empieza a depender de infraestructura, debe moverse a `platform`. Si representa una base conceptual del sistema, debe moverse a `core`. Si pertenece a una capacidad de negocio, debe moverse a `modules`.

## `prisma/` fuera de `src`

La carpeta `prisma/` debe permanecer fuera de `src/`.

Uso esperado:

```txt
prisma/
- Schema de Prisma
- Migraciones
- Scripts de seed
- Datos iniciales
- Cliente auxiliar para seeds, si se requiere
```

Aunque los seeds necesiten conectarse a la base de datos, siguen siendo scripts operativos. Por eso no deben mezclarse con la estructura interna de `src`.

La aplicación NestJS debe usar su propio servicio de conexión dentro de `src/platform`.

## Regla de ubicación rápida

Para ubicar nuevo código:

```txt
¿Arranca o compone la app?
→ src/app/

¿Es base pura y estable?
→ src/core/

¿Pertenece a una función de negocio?
→ src/modules/

¿Depende de tecnología, framework o servicios externos?
→ src/platform/

¿Es reutilizable, simple y transversal?
→ src/shared/

¿Es schema, migración o seed de Prisma?
→ prisma/
```

## Estructura final recomendada

```txt
project-root/
├── prisma/
│   ├── schema.prisma
│   ├── migrations/
│   ├── seed.ts
│   ├── data/
│   └── seeds/
│
├── src/
│   ├── main.ts
│   ├── app/
│   ├── core/
│   ├── modules/
│   ├── platform/
│   └── shared/
│
├── docs/
├── public/
├── test/
├── package.json
├── tsconfig.json
└── nest-cli.json
```

## Resumen

La estructura debe permitir ubicar cada archivo por responsabilidad:

```txt
app      = composición
core     = base estable
modules  = negocio
platform = infraestructura
shared   = reutilizable ligero
prisma   = recursos externos de base de datos
```

Esta organización mantiene `src/` enfocado en la aplicación y conserva fuera de él los recursos operativos que no forman parte directa de la arquitectura interna de NestJS.
