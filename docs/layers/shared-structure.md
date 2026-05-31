# Shared Structure

## Propósito

Este documento describe la estructura interna de la carpeta `shared/`.

`shared` contiene soporte reutilizable ligero para distintas partes del sistema. Su contenido no representa el núcleo estable del proyecto, no contiene reglas de negocio y no encapsula infraestructura técnica global.

La función de esta capa es agrupar piezas simples y transversales que pueden ser utilizadas por varios módulos sin pertenecer a uno específico.

## Ubicación

La carpeta `shared/` se encuentra dentro de `src/`:

```txt
src/
└── shared/
```

Forma parte del código fuente de la aplicación y actúa como una capa de apoyo reutilizable.

## Estructura general

La estructura interna de `shared/` se compone así:

```txt
src/shared/
├── decorators/
├── dtos/
├── mappers/
├── responses/
├── types/
├── utils/
└── index.ts
```

Cada carpeta agrupa una categoría de soporte reutilizable.

## `decorators/`

Contiene decoradores reutilizables por distintas partes del sistema.

Ubicación:

```txt
src/shared/decorators/
```

Contenido general:

```txt
decorators/
- Decoradores de presentación reutilizables
- Decoradores auxiliares para DTOs
- Decoradores compartidos entre controladores
- Decoradores no ligados a un módulo específico
```

Los decoradores específicos de un módulo permanecen dentro del módulo correspondiente. Los decoradores que forman parte de una configuración técnica global pertenecen a `platform`.

## `dtos/`

Contiene DTOs compartidos y reutilizables.

Ubicación:

```txt
src/shared/dtos/
```

Contenido general:

```txt
dtos/
- DTOs transversales
- DTOs usados por varios módulos
- Estructuras de entrada o salida reutilizables
- DTOs de soporte para presentación
```

Los DTOs propios de una operación funcional permanecen dentro del módulo correspondiente. Las estructuras fundamentales del sistema pertenecen a `core`.

## `responses/`

Contiene estructuras reutilizables de respuesta.

Ubicación:

```txt
src/shared/responses/
```

Contenido general:

```txt
responses/
- Respuestas genéricas de API
- Envoltorios de respuesta
- Estructuras reutilizables de salida
- Formatos comunes de respuesta
```

Esta carpeta agrupa formas de respuesta usadas por distintas partes del sistema, especialmente cuando están orientadas a presentación o comunicación externa.

## `mappers/`

Contiene mappers ligeros y reutilizables.

Ubicación:

```txt
src/shared/mappers/
```

Contenido general:

```txt
mappers/
- Mappers auxiliares
- Transformadores simples
- Conversores reutilizables
- Mapeos no ligados a una entidad de negocio específica
```

Los mappers que convierten entidades o modelos propios de un módulo permanecen dentro de ese módulo. Los mappers que dependen de infraestructura técnica pertenecen a `platform` o a la infraestructura del módulo correspondiente.

## `types/`

Contiene tipos auxiliares reutilizables.

Ubicación:

```txt
src/shared/types/
```

Contenido general:

```txt
types/
- Tipos auxiliares
- Alias reutilizables
- Tipos de soporte
- Tipos compartidos entre varias capas
```

Los tipos fundamentales y estables del sistema pertenecen a `core`. Los tipos propios de una capacidad funcional permanecen dentro del módulo correspondiente.

## `utils/`

Contiene utilidades simples y reutilizables.

Ubicación:

```txt
src/shared/utils/
```

Contenido general:

```txt
utils/
- Funciones auxiliares puras
- Utilidades de formato
- Utilidades de transformación simple
- Helpers reutilizables sin infraestructura
```

Esta carpeta agrupa funciones pequeñas que no dependen de servicios externos, framework, base de datos ni reglas de negocio específicas.

## Archivos de barril

Cada carpeta puede exponer sus elementos mediante un archivo `index.ts`.

Ejemplo:

```txt
src/shared/
├── decorators/
│   └── index.ts
├── dtos/
│   └── index.ts
├── mappers/
│   └── index.ts
├── responses/
│   └── index.ts
├── types/
│   └── index.ts
├── utils/
│   └── index.ts
└── index.ts
```

El archivo `src/shared/index.ts` actúa como punto de exportación principal de la capa `shared`.

## Relación con otras capas

`shared` puede usar elementos de `core` cuando necesita tipos o abstracciones estables.

```txt
shared → core
```

`shared` no depende de módulos funcionales ni de infraestructura técnica global.

```txt
shared → modules   no
shared → platform  no
shared → app       no
```

Los módulos pueden usar `shared` cuando necesitan piezas reutilizables de soporte.

```txt
modules → shared
app     → shared
```

Esta relación mantiene a `shared` como una capa ligera y transversal.

## Diferencia con `core`

`core` contiene fundamentos estables del sistema. `shared` contiene soporte práctico reutilizable.

```txt
core   = base estable y fundamental
shared = apoyo reutilizable ligero
```

Una pieza pertenece a `core` cuando representa una abstracción esencial, estable e independiente de presentación o uso práctico.

Una pieza pertenece a `shared` cuando es reutilizable por varias partes del sistema, pero no forma parte del núcleo conceptual.

## Diferencia con `platform`

`platform` contiene infraestructura técnica global. `shared` contiene piezas reutilizables sin infraestructura pesada.

```txt
platform = mecanismos técnicos
shared   = soporte ligero
```

Un elemento pertenece a `platform` cuando depende de base de datos, configuración, HTTP global, archivos, logging, cache, colas, storage o integraciones externas.

Un elemento pertenece a `shared` cuando es simple, transversal y no encapsula tecnología de ejecución.

## Diferencia con `modules`

`modules` contiene capacidades funcionales y reglas de negocio. `shared` contiene soporte reutilizable entre módulos.

```txt
modules = negocio específico
shared  = soporte transversal
```

Los DTOs, mappers, decoradores, constantes o tipos propios de un módulo permanecen dentro del módulo correspondiente. `shared` agrupa únicamente elementos que tienen uso transversal.

## Resumen

La carpeta `shared/` agrupa soporte reutilizable ligero.

```txt
shared/decorators = decoradores reutilizables
shared/dtos       = DTOs compartidos
shared/responses  = estructuras comunes de respuesta
shared/mappers    = mappers ligeros
shared/types      = tipos auxiliares
shared/utils      = utilidades simples
```

Su estructura mantiene separadas las piezas reutilizables de las reglas de negocio, la infraestructura técnica y el núcleo estable del sistema.
