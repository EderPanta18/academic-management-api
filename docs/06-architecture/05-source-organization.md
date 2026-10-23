# Organización del código fuente

La organización física del backend hace visibles los límites del monolito modular, sin convertir cada carpeta en un contrato público. El criterio dominante es la **responsabilidad**: los cambios internos de archivos no deben obligar a reescribir las reglas del sistema.

## 1. Áreas de responsabilidad

| Área | Propósito estable | Qué no contiene |
| --- | --- | --- |
| `src/app/` | Composición de los procesos de exposición e interacción, módulos habilitados y adaptadores correspondientes. | Reglas y casos de uso académicos; restricciones de entrada a un solo protocolo. |
| `src/core/` | Contratos técnicos transversales puros y tipos base independientes de proveedor. | Entidades o políticas de un módulo funcional concreto. |
| `src/modules/` | Módulos funcionales, con sus estados, reglas, contratos y adaptadores específicos. | Dependencias internas libres entre capacidades. |
| `src/platform/` | Soporte técnico común: conexión de datos, mensajería, archivos, seguridad técnica, logging. | Propiedad sobre estudiantes, ofertas o inscripciones. |
| `src/workers/` | Composición de procesos de trabajo diferido, consumidores y mecanismos técnicos de recepción. | Reglas de los trabajos o casos de uso de los módulos propietarios. |
| `src/shared/` | Utilidades simples y tipos auxiliares sin negocio propio. | Un lugar alternativo para servicios compartidos que gobiernen el dominio. |

Las áreas `src/app/` y `src/workers/` organizan **la composición de procesos**, no las capas de negocio ni una clasificación exhaustiva de transportes. La API REST se expone desde un proceso interactivo y los trabajos diferidos se consumen en procesos independientes; cada uno construye su propio contenedor NestJS. Todos reutilizan capacidades funcionales por contratos, sin compartir instancias en memoria ni adquirir autoridad académica por el mecanismo de ejecución.

## 2. Anatomía de un módulo funcional

Un módulo con comportamiento significativo separa **cuatro áreas internas**:

```text
<module>/
├── domain/
├── application/
├── infrastructure/
├── entrypoints/
├── <module>.module.ts
└── index.ts
```

El árbol es una **estructura conceptual mínima**, no una orden de crear carpetas vacías o inventariar cada clase. Se mantiene la separación de responsabilidades incluso si una capacidad pequeña requiere pocas piezas físicas.

| Área | Responsabilidad concreta |
| --- | --- |
| `domain/` | Entidades con invariantes, value objects, estados, reglas y registros históricos propios. |
| `application/` | Casos de uso, coordinación, comandos, consultas, contratos y puertos. |
| `infrastructure/` | Adaptadores concretos, repositorios, queries técnicas y mapeos a persistencia. |
| `entrypoints/` | Adaptadores por los que llegan invocaciones desde protocolos, procesos y mecanismos externos hacia los casos de uso. |

La capa de dominio desconoce los adaptadores. La aplicación declara puertos de salida para persistir o integrar; la infraestructura implementa esos puertos. Las entradas adaptan solicitudes hacia casos de uso en lugar de ejecutar escrituras directamente.

## 3. Entidades y registros históricos

Una **entidad del dominio** mantiene identidad, invariantes y transiciones significativas. Un **registro histórico** representa un hecho conservado, con datos de referencia y sin ciclo de edición ordinario. Esta distinción es relevante para movimientos de inscripción y auditoría, sin obligar a construir clases ricas para todo registro.

Los registros históricos de un módulo permanecen junto a la capacidad que les da significado. El carácter de solo inserción no los convierte en infraestructura global ni en un catálogo compartido. Las excepciones y los tipos propios también pertenecen a su módulo; no se trasladan a `shared` para evitar diseñar una superficie pública.

Cuando un módulo crece, subdivide sus entidades, contratos o adaptadores por responsabilidad real. No se crean directorios por cada acción trivial ni se imponen límites de cantidad de archivos para forzar jerarquías.

## 4. Puertos, contratos y superficies públicas

La aplicación distingue dos direcciones:

- **Puertos de entrada:** operaciones o consultas del módulo que pueden ser invocadas de manera autorizada desde otra entrada o capacidad.
- **Puertos de salida:** contratos que la aplicación necesita para persistir, consultar o utilizar servicios externos y que implementan sus adaptadores.

Los contratos públicos internos deben exponer capacidad y resultados estables, no entidades de Prisma ni repositorios internos. Los tipos compartidos puros no necesitan registrarse como providers de NestJS.

`index.ts` constituye una superficie de importación de TypeScript controlada; no reemplaza `exports` en el decorador NestJS. La exportación de un contrato por código y su disponibilidad mediante inyección deben estar alineadas, pero se verifican separadamente.

## 5. Composición de un módulo NestJS

La clase decorada con `@Module()` declara de forma estática las categorías fundamentales de NestJS:

| Elemento | Responsabilidad |
| --- | --- |
| `imports` | Módulos de los que necesita providers exportados. |
| `controllers` | Controladores admitidos por la composición NestJS del adaptador HTTP. |
| `providers` | Implementaciones, adaptadores, casos de uso y procesadores que resuelve su contenedor. |
| `exports` | Contratos o providers destinados expresamente a consumidores externos. |

**Cada módulo compone sus piezas internas y declara sus dependencias directas.** La composición raíz selecciona y reúne los módulos que participan en el proceso; no administra manualmente las dependencias privadas de todos ellos. NestJS resuelve el orden de construcción a partir del grafo, no de la posición visual de los elementos en `imports`.

Las clases de módulo son declarativas: no consultan la base, no publican eventos ni hacen trabajo en su constructor. La inicialización y el apagado técnico se resuelven mediante providers especializados y el ciclo de vida del framework, sin introducir lógica académica en bootstrap.

Los puertos de entrada consumidos por otras capacidades se exponen de forma selectiva. Los casos de uso internos, controladores, repositorios y adaptadores no se publican por defecto. Cuando el runtime de workers necesita obtener un processor, su exposición se restringe a la **composición técnica del proceso**, sin convertirlo en contrato funcional para otros módulos.

## 6. Composición de procesos y agrupadores

Cada proceso reúne las capacidades y los servicios técnicos exigidos por sus **responsabilidades de ejecución**, no por una categoría cerrada de protocolo. La composición determina qué entradas habilita, qué contratos de aplicación consume, qué adaptadores de salida necesita y qué recursos administra durante su ciclo de vida.

La API REST atiende solicitudes mediante controladores HTTP; los consumidores de trabajo diferido reciben entregas mediante el adaptador de mensajería. Esta es la distribución concreta del sistema, no una restricción que impida exponer nuevos mecanismos de entrada ni una razón para duplicar casos de uso. Los procesos comparten definiciones, no instancias de providers, y no cargan adaptadores ajenos a sus responsabilidades.

Un módulo agregador de dominio solo está justificado cuando simplifica una agrupación funcional inequívoca. Importa módulos constituyentes y, cuando corresponde, reexporta de forma controlada los contratos que se decida publicar. No contiene nuevos casos de uso ni agrupa controladores y providers de otras capacidades en un servicio común.

La agrupación no implica comunicación privilegiada. Los módulos ubicados bajo la misma carpeta de dominio conservan las mismas fronteras que los situados en dominios distintos. No se crean agregadores transparentes que reexportan indiscriminadamente todo.

## 7. Adaptadores de entrada extensibles

`entrypoints/` es la frontera general entre los mecanismos de invocación y la aplicación. Cada adaptador interpreta la solicitud o entrega que recibe, valida su forma según el mecanismo, construye una invocación de caso de uso y traduce el resultado al contrato de salida correspondiente. **La frontera se define por la dirección de la interacción, no por una lista cerrada de protocolos.**

La API REST utiliza un adaptador HTTP y el procesamiento asíncrono utiliza adaptadores de entrega de trabajos y eventos. Ambos pertenecen a esa responsabilidad general sin agotar sus posibles formas. Incorporar una nueva interfaz de acceso exige adaptar su transporte y autorización, no replicar reglas de matrícula, historia o cupos.

Los adaptadores solo se materializan cuando participan en una capacidad real del sistema. Ninguna capacidad crea directorios de mecanismos que no utiliza. El procesador de un job pertenece al módulo funcional que decide su ejecución; la composición compartida solo conecta ese procesador al sistema de mensajería.

Los mapeos de datos de transporte a comandos o consultas permanecen junto a la entrada correspondiente. Los mapeos entre resultados de Prisma y modelos del dominio permanecen junto a la infraestructura. Los contratos de aplicación no importan DTOs específicos del transporte, tipos generados del ORM ni payloads internos de PgBoss.

## 8. Criterio de evolución

Una reorganización interna puede cambiar carpetas, nombres y agrupaciones sin alterar el diseño si conserva estas condiciones:

- Las cuatro responsabilidades internas siguen separadas y sus adaptadores de entrada no se limitan a un transporte único.
- El estado funcional mantiene un solo propietario.
- La superficie pública no se amplía accidentalmente.
- Las dependencias pueden reconstruirse mediante `imports` y `exports` sin ciclos.
- Cada proceso compone únicamente recursos y adaptadores pertinentes, sin ejecutar lógica de dominio durante el arranque.

Una modificación que cambia propiedad, sentido de las dependencias o forma de confirmar operaciones críticas requiere revisar la arquitectura, aunque solo implique mover unas pocas clases.
