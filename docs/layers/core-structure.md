# Core Structure

## Propósito

Este documento describe la estructura interna de la carpeta `core/`.

`core` contiene la base estable y transversal del sistema. Su contenido no pertenece a un módulo funcional específico y tampoco representa infraestructura técnica. Su función es agrupar piezas fundamentales que pueden ser usadas por distintas partes del código sin depender de NestJS, Prisma, HTTP, Swagger, archivos, base de datos o servicios externos.

Dentro de `core` no se usan carpetas como `domain/` o `application/`, porque esos nombres pertenecen a la organización interna de los módulos funcionales. En `core`, las carpetas se nombran directamente por el tipo de elemento que contienen.

## Ubicación

La carpeta `core/` se encuentra dentro de `src/`:

```txt
src/
└── core/
```

Forma parte del código fuente de la aplicación, pero se mantiene aislada de las capas técnicas y funcionales concretas.

## Estructura general

La estructura interna de `core/` se compone así:

```txt
src/core/
├── constants/
├── contracts/
├── dtos/
├── exceptions/
├── pagination/
├── types/
└── value-objects/
```

Cada carpeta representa una categoría transversal concreta.

## `constants/`

Contiene constantes generales y estables del sistema.

Estas constantes no pertenecen a un módulo funcional específico y no dependen de infraestructura. Representan valores compartidos que tienen sentido a nivel global.

Ubicación:

```txt
src/core/constants/
```

Contenido típico:

```txt
constants/
- Límites generales
- Valores base del sistema
- Constantes transversales
- Configuraciones puras no asociadas a infraestructura
```

Las constantes técnicas relacionadas con HTTP, base de datos, Swagger, archivos o proveedores externos pertenecen a `platform`, no a `core`.

## `contracts/`

Contiene contratos generales e independientes de tecnología.

Un contrato define una forma esperada de interacción o una abstracción base que puede ser implementada en otras capas. En `core`, estos contratos no dependen de NestJS, Prisma ni de módulos funcionales concretos.

Ubicación:

```txt
src/core/contracts/
```

Contenido típico:

```txt
contracts/
- Interfaces base
- Contratos transversales
- Abstracciones genéricas
- Definiciones independientes de infraestructura
```

Los contratos propios de un módulo funcional permanecen dentro del módulo correspondiente.

## `dtos/`

Contiene DTOs transversales que representan estructuras de datos reutilizables en varias partes del sistema.

Estos DTOs no pertenecen a una operación específica de un módulo. Expresan formas de datos genéricas y estables.

Ubicación:

```txt
src/core/dtos/
```

Contenido típico:

```txt
dtos/
- Resultados genéricos
- Respuestas base
- Estructuras de datos compartidas
- DTOs transversales no ligados a HTTP concreto
```

Los DTOs de entrada o salida propios de un endpoint o módulo permanecen dentro del módulo correspondiente o en `shared` si son reutilizables a nivel de presentación.

## `exceptions/`

Contiene excepciones base del sistema.

Estas excepciones representan errores fundamentales o abstracciones de error que pueden ser extendidas o utilizadas por distintas capas.

Ubicación:

```txt
src/core/exceptions/
```

Contenido típico:

```txt
exceptions/
- Excepción base de dominio
- Excepción base de entidad no encontrada
- Excepciones transversales
- Clases base para errores funcionales
```

Las excepciones específicas de una regla de negocio permanecen dentro del módulo que contiene esa regla.

## `pagination/`

Contiene elementos generales relacionados con paginación.

Esta carpeta agrupa estructuras, tipos o utilidades de paginación que no dependen de un módulo concreto ni de un endpoint específico.

Ubicación:

```txt
src/core/pagination/
```

Contenido típico:

```txt
pagination/
- Value objects de paginación
- Tipos de paginación
- Resultados paginados
- Constantes puras de paginación
```

La paginación de presentación, como queries HTTP o decoradores Swagger, pertenece a `shared` o `platform` según su naturaleza.

## `types/`

Contiene tipos auxiliares globales.

Estos tipos ayudan a expresar conceptos reutilizables dentro del sistema sin introducir dependencias técnicas.

Ubicación:

```txt
src/core/types/
```

Contenido típico:

```txt
types/
- Tipos utilitarios
- Tipos primitivos extendidos
- Tipos genéricos reutilizables
- Alias de tipos transversales
```

Los tipos propios de una entidad o caso de uso permanecen dentro del módulo correspondiente.

## `value-objects/`

Contiene value objects generales y reutilizables.

Un value object representa un valor con reglas internas de validación o comportamiento. En `core`, solo se ubican value objects que tienen sentido transversal y no pertenecen a un módulo funcional específico.

Ubicación:

```txt
src/core/value-objects/
```

Contenido típico:

```txt
value-objects/
- Value objects genéricos
- Objetos de valor transversales
- Validaciones puras reutilizables
```

Los value objects específicos de un dominio funcional permanecen dentro del módulo correspondiente.

## Archivos de barril

Cada carpeta puede exponer sus elementos mediante un archivo `index.ts`.

Ejemplo:

```txt
src/core/
├── constants/
│   └── index.ts
├── contracts/
│   └── index.ts
├── dtos/
│   └── index.ts
├── exceptions/
│   └── index.ts
├── pagination/
│   └── index.ts
├── types/
│   └── index.ts
├── value-objects/
│   └── index.ts
└── index.ts
```

El archivo `src/core/index.ts` actúa como punto de exportación principal de la capa `core`.

## Relación con otras capas

`core` puede ser utilizado por `modules`, `shared`, `platform` y `app`.

```txt
modules  → core
shared   → core
platform → core
app      → core
```

`core` no depende de esas capas.

```txt
core → modules   no
core → shared    no
core → platform  no
core → app       no
```

Esta relación mantiene a `core` como una base estable del sistema.

## Diferencia con los módulos

Dentro de `modules`, las carpetas como `domain/`, `application/`, `infrastructure/` y `presentation/` organizan una capacidad funcional.

En `core`, esa división no se usa porque `core` no representa una capacidad de negocio. Su estructura se basa en categorías transversales directas.

Comparación conceptual:

```txt
modules/<module>/domain/
= reglas y conceptos propios de un módulo

src/core/exceptions/
= excepciones base reutilizables por varias partes del sistema
```

```txt
modules/<module>/application/
= casos de uso y comandos propios de un módulo

src/core/contracts/
= contratos generales independientes de módulos concretos
```

## Resumen

La carpeta `core/` agrupa fundamentos estables y transversales del sistema.

```txt
core/constants      = constantes puras generales
core/contracts      = contratos transversales
core/dtos           = estructuras de datos generales
core/exceptions     = errores base del sistema
core/pagination     = piezas generales de paginación
core/types          = tipos auxiliares globales
core/value-objects  = objetos de valor reutilizables
```

Su estructura evita crear una Clean Architecture global paralela. Las capas `domain`, `application`, `infrastructure` y `presentation` pertenecen a los módulos funcionales; `core` se organiza por categorías fundamentales.
