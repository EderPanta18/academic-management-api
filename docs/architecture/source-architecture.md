# Source Architecture

## Propósito

Este documento explica la filosofía arquitectónica del código fuente del proyecto. Describe cómo se entiende el sistema a nivel conceptual, qué papel cumplen sus capas principales y cómo se separan las responsabilidades para mantener bajo acoplamiento.

La arquitectura se basa en una variante práctica de Clean Architecture aplicada a NestJS. El objetivo no es seguir una estructura rígida por formalidad, sino proteger el núcleo de negocio frente a detalles externos como frameworks, base de datos, HTTP, archivos, configuración o proveedores técnicos.

## Enfoque arquitectónico

El sistema se organiza alrededor de una idea central: las reglas de negocio deben vivir en módulos funcionales y no depender directamente de mecanismos técnicos.

NestJS, Prisma, HTTP, Swagger, validadores, parsers de archivos y servicios externos son detalles de ejecución. Son necesarios para que la aplicación funcione, pero no deben definir el modelo mental del negocio.

Por eso, el proyecto separa cinco responsabilidades principales:

```txt
app      = composición y arranque de la aplicación
core     = base estable y transversal del sistema
modules  = capacidades funcionales y reglas de negocio
platform = infraestructura técnica global
shared   = soporte reutilizable ligero
```

Esta división permite que el código se lea desde dos perspectivas: como sistema de negocio y como aplicación técnica. El negocio se concentra en `modules`; la infraestructura se concentra en `platform`; el arranque se concentra en `app`.

## Relación con Clean Architecture

La arquitectura sigue el principio de dependencia hacia el interior. Las partes más estables del sistema no dependen de las partes más concretas o cambiantes.

En términos prácticos:

```txt
Las reglas de negocio no dependen de Prisma.
Las entidades no dependen de controladores.
Los casos de uso no dependen de HTTP.
El núcleo estable no depende de NestJS.
La infraestructura adapta detalles externos al modelo interno.
```

Esto permite que una decisión técnica, como cambiar el motor de base de datos, modificar un parser de archivos o ajustar la forma de exponer endpoints, no obligue a cambiar el corazón funcional del sistema.

## Puertos y adaptadores

El proyecto usa la idea de puertos y adaptadores para desacoplar el negocio de la infraestructura.

Un puerto representa una capacidad que el negocio necesita, expresada como contrato. Un adaptador representa la implementación concreta de ese contrato usando una tecnología específica.

Ejemplo conceptual:

```txt
Puerto:
- El sistema necesita guardar o consultar información.

Adaptador:
- Esa operación se implementa usando Prisma, una base de datos concreta o cualquier otro mecanismo técnico.
```

El módulo funcional trabaja contra la abstracción. La infraestructura implementa el detalle.

Este enfoque evita que los casos de uso y las reglas de negocio queden atados a una librería, ORM, protocolo o proveedor específico.

## Desacoplamiento

El desacoplamiento se logra separando lo que cambia por razones distintas.

El negocio cambia cuando cambian las reglas del dominio. La infraestructura cambia cuando cambian herramientas, librerías, bases de datos o mecanismos de comunicación. La presentación cambia cuando cambia la forma de exponer o recibir información. El arranque cambia cuando cambia la composición general de la aplicación.

Mantener estas razones de cambio separadas evita que una modificación pequeña se propague por zonas que no deberían verse afectadas.

## `app` como composición

`app` representa la composición de la aplicación.

Esta capa conoce qué piezas existen y cómo se integran para levantar el sistema. Su papel es conectar módulos funcionales, plataforma técnica y configuración global.

`app` no representa negocio ni infraestructura específica. Es la capa que organiza el sistema en tiempo de arranque.

## `core` como base estable

`core` representa los elementos más estables y transversales del sistema.

Contiene conceptos que no pertenecen a un módulo específico y que tampoco dependen de tecnología. Su contenido expresa fundamentos internos que pueden ser usados por varias partes del proyecto.

`core` se mantiene aislado porque funciona como base común. Si `core` empieza a depender de infraestructura o de módulos concretos, pierde su estabilidad.

## `modules` como centro funcional

`modules` contiene el negocio del sistema.

Cada módulo representa una capacidad funcional. Dentro de los módulos se ubican las reglas, casos de uso, contratos, entidades, adaptadores específicos y mecanismos de exposición propios de esa capacidad.

El módulo es la unidad principal de organización del negocio. Esta decisión reduce la dispersión de archivos y evita que una funcionalidad quede repartida entre carpetas globales sin relación clara.

## `platform` como infraestructura

`platform` representa la infraestructura técnica que sostiene la aplicación.

Contiene servicios y configuraciones relacionados con herramientas externas o mecanismos globales: base de datos, HTTP, configuración, logging, archivos, cache, colas, almacenamiento e integraciones.

La plataforma ofrece capacidades técnicas al sistema, pero no contiene reglas de negocio. Su función es conectar el mundo externo con la aplicación.

## `shared` como soporte reutilizable

`shared` contiene piezas reutilizables ligeras que pueden ser usadas por diferentes partes del sistema.

No representa el núcleo de negocio ni la infraestructura técnica. Su rol es evitar duplicación cuando existen elementos simples, transversales y no fundamentales.

`shared` se diferencia de `core` porque no contiene conceptos esenciales del sistema. También se diferencia de `platform` porque no encapsula tecnología ni servicios externos.

## Recursos externos al código fuente

La arquitectura distingue entre código fuente de aplicación y recursos operativos del proyecto.

Carpetas como `prisma/`, `docs/`, `public/` y `test/` existen fuera de `src/` porque no forman parte directa del diseño interno de la aplicación NestJS.

`prisma/` tiene un papel especial: contiene schema, migraciones, seeds y datos iniciales. Estos recursos administran la base de datos, pero no son la capa de acceso a datos de la aplicación. La conexión usada por NestJS pertenece a la infraestructura dentro de `src/platform`.

## Dirección de dependencias

La dependencia general fluye desde lo concreto hacia lo estable.

```txt
main.ts
  ↓
app
  ↓
modules
```

Las capas transversales se relacionan así:

```txt
app      → modules, platform, shared, core
modules  → core, shared
platform → core
shared   → core
```

Cuando un módulo necesita infraestructura, esa dependencia se ubica en su parte técnica, no en su lógica central.

Las dependencias que rompen el modelo son aquellas donde una capa estable conoce una capa más concreta:

```txt
core     → app
core     → modules
core     → platform
platform → modules
shared   → modules
modules  → app
```

La arquitectura se mantiene clara cuando el núcleo no conoce cómo se ejecuta, cómo se persiste ni cómo se expone el sistema.

## Lectura conceptual del proyecto

El proyecto puede leerse de la siguiente forma:

```txt
app compone la aplicación.
modules expresan el negocio.
platform conecta con tecnología.
core ofrece fundamentos estables.
shared reduce duplicación ligera.
```

Esta filosofía permite que el sistema crezca sin convertir las carpetas globales en contenedores ambiguos y sin mezclar reglas funcionales con detalles técnicos.
