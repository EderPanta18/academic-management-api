# Platform Structure

## Propósito

Este documento describe la estructura interna de la carpeta `platform/`.

`platform` contiene la infraestructura técnica global de la aplicación. Su contenido representa los mecanismos que permiten que el sistema se ejecute, se configure, se comunique con servicios externos, use base de datos, procese archivos y aplique comportamiento técnico transversal.

Esta capa no contiene reglas de negocio. Su función es agrupar capacidades técnicas reutilizables por la aplicación y por las partes de infraestructura de los módulos funcionales.

## Ubicación

La carpeta `platform/` se encuentra dentro de `src/`:

```txt
src/
└── platform/
```

Forma parte del código fuente de la aplicación NestJS y agrupa infraestructura usada en tiempo de ejecución.

## Estructura general

La estructura interna de `platform/` se compone así:

```txt
src/platform/
├── platform.module.ts
├── config/
├── database/
├── http/
├── files/
├── logging/
├── cache/
├── queue/
├── storage/
├── integrations/
└── index.ts
```

Cada carpeta representa un área técnica global. Algunas áreas pueden existir solo cuando el proyecto tenga una implementación real asociada.

## `platform.module.ts`

Representa el módulo agregador de la capa `platform`.

Ubicación:

```txt
src/platform/platform.module.ts
```

Este archivo centraliza la composición de los módulos técnicos globales. Su función es exponer capacidades de infraestructura para que puedan ser utilizadas por la aplicación.

Contenido conceptual:

```txt
platform.module.ts
- Composición de módulos técnicos
- Exportación de servicios de infraestructura
- Integración técnica global
```

No contiene reglas de negocio ni lógica específica de módulos funcionales.

## `config/`

Contiene la configuración técnica de la aplicación.

Ubicación:

```txt
src/platform/config/
```

Contenido general:

```txt
config/
- Carga de variables de entorno
- Validación de configuración
- Configuración de aplicación
- Configuración de base de datos
- Configuración de servicios técnicos
```

Esta carpeta agrupa la configuración necesaria para que la aplicación se ejecute de forma controlada en distintos entornos.

## `database/`

Contiene la infraestructura de base de datos usada por la aplicación.

Ubicación:

```txt
src/platform/database/
```

Composición general:

```txt
database/
├── prisma/
└── index.ts
```

La carpeta `database/` agrupa adaptadores y servicios relacionados con conexión, acceso técnico y ciclo de vida de la base de datos.

Cuando se usa Prisma, la estructura queda organizada por proveedor técnico:

```txt
database/prisma/
├── prisma.module.ts
├── prisma.service.ts
└── index.ts
```

El servicio de conexión usado por NestJS vive en esta capa. Los recursos operativos de Prisma, como `schema.prisma`, migraciones y seeds, permanecen fuera de `src/`, en la carpeta raíz `prisma/`.

## `http/`

Contiene infraestructura global relacionada con HTTP.

Ubicación:

```txt
src/platform/http/
```

Composición general:

```txt
http/
├── filters/
├── interceptors/
├── responses/
├── pipes/
├── guards/
├── swagger/
└── index.ts
```

Contenido general:

```txt
filters/      = manejo técnico de excepciones HTTP
interceptors/ = transformación o registro transversal de respuestas y peticiones
responses/    = contratos y formatos globales de respuesta HTTP de la API
pipes/        = validación y transformación global de entrada
guards/       = protección técnica de rutas
swagger/      = configuración de documentación OpenAPI
```

Esta carpeta agrupa comportamiento técnico aplicado al transporte HTTP. Los controladores funcionales pertenecen a los módulos de negocio, no a `platform/http`.


### `http/responses/`

Contiene los contratos de respuesta HTTP globales de la API.

Ubicación:

```txt
src/platform/http/responses/
```

Contenido general:

```txt
responses/
- Formato estándar de respuesta exitosa
- Formato estándar de respuesta de error
- Tipos compartidos por filtros e interceptores HTTP
- Contratos de salida aplicados por la infraestructura HTTP global
```

Esta carpeta pertenece a `platform/http` porque sus elementos están ligados al transporte HTTP y son aplicados por mecanismos técnicos como filtros e interceptores globales.

Ejemplo de composición:

```txt
http/responses/
├── api-response.type.ts
└── index.ts
```

Un tipo como `ApiResponse`, `ApiSuccessResponse` o `ApiErrorResponse` debe ubicarse aquí cuando representa el formato global que la API devuelve al cliente.

No debe ubicarse en `shared/responses` si solo es usado por la infraestructura HTTP global. En ese caso, `platform/http/responses` mantiene juntos el contrato de respuesta y los mecanismos que lo aplican.

## `files/`

Contiene infraestructura técnica relacionada con archivos.

Ubicación:

```txt
src/platform/files/
```

Composición general:

```txt
files/
├── parser/
└── index.ts
```

La carpeta `files/` agrupa capacidades técnicas asociadas al manejo de archivos. Cada capacidad se ubica en una subcarpeta específica.

Para el procesamiento de archivos, la estructura se compone así:

```txt
files/parser/
├── file-parser.module.ts
├── file-parser.service.ts
├── strategies/
└── index.ts
```

Contenido general:

```txt
parser/    = lectura e interpretación técnica de archivos
strategies/ = estrategias por formato o mecanismo de lectura
```

Esta separación permite que otras capacidades de archivos, como carga, almacenamiento o validación técnica, puedan existir en subcarpetas propias sin mezclarse con el parser.

## `logging/`

Contiene infraestructura de registro y observabilidad básica.

Ubicación:

```txt
src/platform/logging/
```

Contenido general:

```txt
logging/
- Servicios de log
- Adaptadores de logging
- Configuración de trazas
- Soporte técnico de observabilidad
```

Esta carpeta agrupa mecanismos usados para registrar eventos técnicos, errores, operaciones o información de diagnóstico.

## `cache/`

Contiene infraestructura de cache.

Ubicación:

```txt
src/platform/cache/
```

Contenido general:

```txt
cache/
- Servicio de cache
- Adaptadores de cache
- Configuración de Redis u otro proveedor
- Abstracciones técnicas de almacenamiento temporal
```

Esta carpeta agrupa mecanismos de almacenamiento temporal usados para optimizar consultas, sesiones, resultados o procesos técnicos.

## `queue/`

Contiene infraestructura de colas y trabajos asíncronos.

Ubicación:

```txt
src/platform/queue/
```

Contenido general:

```txt
queue/
- Configuración de colas
- Servicios de publicación
- Procesadores técnicos
- Adaptadores de jobs
```

Esta carpeta agrupa mecanismos de procesamiento diferido o asíncrono.

## `storage/`

Contiene infraestructura de almacenamiento de archivos o recursos externos.

Ubicación:

```txt
src/platform/storage/
```

Contenido general:

```txt
storage/
- Servicios de almacenamiento
- Adaptadores locales o remotos
- Configuración de proveedores de storage
- Operaciones técnicas sobre archivos persistidos
```

Esta carpeta agrupa mecanismos para guardar, recuperar o eliminar archivos fuera del flujo interno de datos.

## `integrations/`

Contiene clientes o adaptadores hacia servicios externos.

Ubicación:

```txt
src/platform/integrations/
```

Contenido general:

```txt
integrations/
- Clientes HTTP externos
- Servicios de correo
- Proveedores institucionales
- APIs externas
- Adaptadores de terceros
```

Cada integración puede organizarse en una subcarpeta propia para mantener aislado su contrato técnico, configuración y cliente.

## Archivos de barril

Cada área puede exponer sus elementos mediante un archivo `index.ts`.

Ejemplo:

```txt
src/platform/
├── config/
│   └── index.ts
├── database/
│   └── index.ts
├── http/
│   └── index.ts
├── files/
│   └── index.ts
├── logging/
│   └── index.ts
└── index.ts
```

El archivo `src/platform/index.ts` actúa como punto de exportación principal de la capa `platform`.

## Relación con otras capas

`platform` puede usar elementos de `core` cuando necesita abstracciones estables o tipos transversales.

```txt
platform → core
```

`platform` no depende de los módulos funcionales, porque la infraestructura global no conoce reglas específicas de negocio.

```txt
platform → modules  no
platform → app      no
```

Los módulos pueden usar `platform` desde sus partes técnicas, como adaptadores, repositorios o infraestructura específica.

```txt
modules/*/infrastructure → platform
app                      → platform
```

## Uso de implementaciones directas

Dentro de `platform` pueden existir implementaciones técnicas directas.

Servicios como una conexión de Prisma, un cliente Redis, un logger o un parser de archivos representan mecanismos técnicos concretos. No necesitan estar envueltos en contratos internos si solo actúan como infraestructura global.

El desacoplamiento principal ocurre en los módulos funcionales. Un caso de uso trabaja contra contratos propios del módulo, mientras que los adaptadores técnicos usan servicios concretos de `platform`.

Flujo conceptual:

```txt
Caso de uso del módulo
  ↓
Puerto del módulo
  ↓
Adaptador de infraestructura del módulo
  ↓
Servicio técnico de platform
```

De esta forma, `platform` puede contener implementaciones concretas sin que esas implementaciones entren directamente al negocio.

## Diferencia con `shared`

`platform` y `shared` cumplen funciones distintas.

```txt
platform = infraestructura técnica global
shared   = soporte reutilizable ligero
```

Un elemento pertenece a `platform` cuando depende de tecnología, framework, proveedor externo, configuración de runtime o mecanismo de infraestructura.

Un elemento pertenece a `shared` cuando es reutilizable, ligero y no encapsula infraestructura técnica.

## Resumen

La carpeta `platform/` agrupa la infraestructura técnica global de la aplicación.

```txt
platform/config       = configuración técnica
platform/database     = conexión y soporte de base de datos
platform/http         = infraestructura HTTP global, filtros, interceptores y formatos de respuesta
platform/files        = capacidades técnicas de archivos
platform/logging      = registro y observabilidad
platform/cache        = cache
platform/queue        = colas y trabajos asíncronos
platform/storage      = almacenamiento
platform/integrations = clientes y servicios externos
```

Su estructura mantiene separados los mecanismos técnicos del negocio y permite que los módulos funcionales usen infraestructura sin acoplar sus reglas internas a detalles concretos.
