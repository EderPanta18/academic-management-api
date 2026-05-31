# Modules Structure

## Propósito

Este documento explica la estructura general de la capa `modules/`.

`modules` es la capa donde vive el negocio del sistema. Cada subcarpeta dentro de `modules/` representa una capacidad funcional independiente, con su propio dominio, casos de uso, contratos, adaptadores técnicos y mecanismos de presentación.

La estructura de los módulos sigue una organización basada en Clean Architecture y puertos y adaptadores. Su propósito es mantener módulos altamente cohesionados, con bajo acoplamiento entre sí y con dependencias orientadas hacia el interior del módulo.

## Visión general

La carpeta `modules/` agrupa los módulos funcionales del sistema.

```txt
src/modules/
├── module-a/
├── module-b/
├── module-c/
└── index.ts
```

Cada módulo representa una frontera funcional. Una frontera funcional agrupa reglas, operaciones, contratos y datos relacionados con una capacidad concreta del sistema.

Un módulo no es solo un grupo de controladores o servicios. Es una unidad arquitectónica completa. Dentro de cada módulo pueden existir reglas de dominio, casos de uso, puertos, adaptadores de infraestructura y controladores de presentación.

## Estructura general de un módulo

La estructura base de un módulo se compone así:

```txt
src/modules/<module>/
├── <module>.module.ts
├── domain/
├── application/
├── infrastructure/
├── presentation/
└── index.ts
```

Cada subcapa tiene una responsabilidad específica:

```txt
domain         = reglas y modelo interno del negocio
application    = casos de uso, puertos, comandos, queries, resultados y orquestación
infrastructure = implementaciones técnicas del módulo
presentation   = entrada y salida hacia el exterior, principalmente HTTP
```

Esta separación permite que el módulo exprese su negocio sin quedar atado directamente a NestJS, Prisma, HTTP o detalles de base de datos.

## Módulo NestJS

El archivo `<module>.module.ts` representa la integración del módulo con NestJS.

Ubicación:

```txt
src/modules/<module>/<module>.module.ts
```

Este archivo registra controladores, casos de uso, providers, adaptadores, tokens y exports que forman parte del módulo.

Contenido conceptual:

```txt
<module>.module.ts
- Declara controladores del módulo
- Registra casos de uso
- Registra adaptadores de infraestructura
- Vincula tokens con implementaciones
- Importa módulos requeridos
- Exporta solo las capacidades que otros módulos pueden consumir
```

Aunque el módulo tenga varias subcapas, normalmente existe un único `.module.ts` principal por módulo funcional. Las subcapas no necesitan tener su propio módulo NestJS salvo que exista una razón técnica fuerte.

## `domain/`

`domain/` contiene el núcleo de negocio del módulo.

Es la subcapa más interna y estable. Representa conceptos propios del módulo, reglas puras, estados, entidades, objetos de valor y excepciones funcionales.

Estructura general:

```txt
domain/
├── constants/
├── entities/
├── exceptions/
├── services/
├── value-objects/
└── index.ts
```

`domain` no depende de NestJS, Prisma, HTTP, DTOs de presentación, repositorios concretos ni servicios de plataforma. Su contenido expresa el negocio sin conocer cómo se persiste, expone o ejecuta.

### `domain/entities/`

Contiene entidades del módulo.

Una entidad representa un concepto de negocio con identidad y comportamiento propio.

```txt
domain/entities/
├── <entity>.entity.ts
├── <entity>.types.ts
└── index.ts
```

La entidad puede contener métodos estáticos como `create()` y `reconstitute()`.

```txt
create()
= construcción de una entidad nueva desde datos de dominio

reconstitute()
= reconstrucción de una entidad existente desde persistencia
```

Los tipos como `Create<Entity>Props` o `<Entity>Props` pertenecen al dominio cuando describen los datos necesarios para crear o reconstruir la entidad. Estos tipos son internos del módulo y no forman parte de la comunicación pública entre módulos.

### `domain/constants/`

Contiene constantes de negocio propias del módulo.

```txt
domain/constants/
- Estados propios del dominio
- Valores permitidos
- Reglas constantes del negocio
```

Estas constantes no representan configuración técnica. La configuración técnica pertenece a `platform`.

### `domain/exceptions/`

Contiene excepciones de negocio propias del módulo.

```txt
domain/exceptions/
- Errores por reglas incumplidas
- Errores por duplicidad funcional
- Errores por transición inválida
- Errores propios del módulo
```

Las excepciones de dominio expresan violaciones de reglas propias del negocio. No deben depender de HTTP, códigos de estado, controladores ni detalles de transporte.

Ejemplos conceptuales:

```txt
StudentCodeAlreadyExistsException
EnrollmentInvalidStatusTransitionException
CourseOfferingDuplicateException
ProfessorNotActiveException
```

Una excepción de dominio responde a la pregunta:

```txt
¿Qué regla de negocio fue violada?
```

No responde a la pregunta:

```txt
¿En qué paso de orquestación falló el caso de uso?
```

### `domain/value-objects/`

Contiene objetos de valor propios del módulo.

Un value object representa un valor sin identidad propia, pero con reglas internas de validación o comportamiento.

```txt
domain/value-objects/
- Códigos con validación
- Rangos
- Periodos
- Valores compuestos propios del dominio
```

### `domain/services/`

Contiene servicios de dominio.

Un servicio de dominio agrupa lógica de negocio que no pertenece naturalmente a una sola entidad. Sigue siendo lógica pura del dominio.

```txt
domain/services/
- Políticas de dominio
- Reglas funcionales compuestas
- Cálculos de negocio
```

No debe usarse para colocar servicios de aplicación ni servicios técnicos.

### Sobre `domain/ports`

`domain/ports` no forma parte de la estructura general por defecto.

Un puerto de dominio solo aparece cuando una regla de dominio pura necesita una abstracción para tomar una decisión de negocio. Es un caso excepcional.

Ejemplo conceptual:

```txt
domain/ports/
└── enrollment-uniqueness-checker.port.ts
```

Ese tipo de puerto representa una pregunta de negocio requerida por una política del dominio, no una operación genérica de persistencia.

La mayoría de contratos del sistema pertenecen a `application/ports`, no a `domain/ports`.

## `application/`

`application/` contiene la orquestación funcional del módulo.

Esta subcapa coordina casos de uso, define entradas internas, salidas, puertos de comunicación, excepciones de aplicación y contratos necesarios para ejecutar operaciones del sistema.

Estructura general:

```txt
application/
├── commands/
├── queries/
├── results/
├── read-models/
├── use-cases/
├── ports/
│   ├── in/
│   └── out/
├── exceptions/
└── index.ts
```

No todas las carpetas aparecen en todos los módulos. Cada carpeta existe cuando el módulo contiene esa responsabilidad.

### `application/commands/`

Contiene comandos de aplicación.

Un command representa una intención de escritura o cambio de estado dentro del sistema.

```txt
application/commands/
├── create-entity.command.ts
├── update-entity.command.ts
└── index.ts
```

Un command no es un DTO HTTP. El DTO HTTP pertenece a `presentation`. El command es una entrada interna del caso de uso.

Flujo conceptual:

```txt
HTTP DTO
  ↓ mapper de presentación
Command
  ↓
Use Case
```

### `application/queries/`

Contiene queries de aplicación.

Una query representa una intención de lectura, búsqueda o listado.

```txt
application/queries/
├── list-entities.query.ts
├── get-entity-by-id.query.ts
└── index.ts
```

Las queries no representan consultas SQL ni Prisma directamente. Son objetos de intención para los casos de uso de lectura.

### `application/results/`

Contiene resultados de casos de uso.

Un result representa una salida de aplicación. Se usa cuando la salida de un caso de uso debe cruzar una frontera del módulo sin exponer entidades de dominio.

```txt
application/results/
├── entity.result.ts
└── index.ts
```

Los results son útiles cuando una operación retorna datos simples pero no se desea exponer la entidad interna. Representan una salida estable de aplicación.

Diferencia conceptual:

```txt
Entity = modelo interno del dominio
Result = salida de aplicación de un caso de uso
```

### `application/read-models/`

Contiene modelos de lectura.

Un read model representa una proyección optimizada para lectura. Normalmente aparece cuando una consulta combina datos, usa joins, agrega campos calculados o no coincide con una entidad de dominio.

```txt
application/read-models/
├── entity.view.ts
└── index.ts
```

Un read model no es una entidad. Tampoco es un DTO HTTP. Es una forma de lectura usada por la aplicación.

Diferencia conceptual:

```txt
Result     = salida de un caso de uso
Read Model = proyección de lectura, usualmente compuesta o derivada
DTO HTTP   = forma expuesta por la capa de presentación
```

### `application/use-cases/`

Contiene los casos de uso del módulo.

Un caso de uso representa una operación funcional del sistema. Coordina comandos, queries, entidades de dominio, puertos de salida, puertos de entrada de otros módulos y validaciones de aplicación.

```txt
application/use-cases/
├── create-entity.use-case.ts
├── list-entities.use-case.ts
├── get-entity-by-id.use-case.ts
└── index.ts
```

El caso de uso contiene la secuencia de ejecución de una operación. No implementa detalles de Prisma, HTTP, archivos o servicios externos de forma directa. Para eso usa puertos.

Ejemplo conceptual:

```txt
Use Case
  ↓ usa
Command / Query
  ↓ usa
Domain Entity
  ↓ usa
Port Out
  ↓ implementado por
Infrastructure Adapter
```

### `application/ports/`

Contiene contratos de entrada y salida del módulo.

```txt
application/ports/
├── in/
└── out/
```

La división `in` y `out` expresa la dirección del puerto desde la perspectiva del módulo.

## `application/ports/in/`

Contiene capacidades que el módulo expone.

Un puerto de entrada representa una operación o consulta funcional que puede ser usada por la presentación del mismo módulo o por otros módulos.

```txt
application/ports/in/
├── entity-finder.port.ts
├── create-entity.port.ts
├── tokens.ts
└── index.ts
```

Ejemplos conceptuales:

```txt
IStudentFinder
ICourseOfferingFinder
ICreatePerson
IProfessorFinder
```

Estos puertos forman la API funcional interna del módulo. Si otro módulo necesita colaborar con este módulo, debe depender de un puerto de entrada, no de entidades, repositorios, controladores ni adaptadores internos.

Un puerto de entrada puede usar:

```txt
commands/
queries/
results/
read-models/
```

No debe exponer tipos internos del dominio si el objetivo es mantener una frontera limpia entre módulos.

Ejemplo de frontera limpia:

```txt
Otro módulo → application/ports/in → módulo dueño
```

## `application/ports/out/`

Contiene dependencias que el módulo necesita para ejecutar sus casos de uso.

Un puerto de salida representa algo que el módulo necesita del exterior: persistencia, consultas, clientes externos, publicadores de eventos o servicios técnicos.

```txt
application/ports/out/
├── entity-repository.port.ts
├── entity-query.port.ts
├── external-service.port.ts
├── tokens.ts
└── index.ts
```

Ejemplos conceptuales:

```txt
IStudentRepository
IStudentQuery
ICourseOfferingRepository
IPersonRepository
```

Estos puertos son internos del módulo. Normalmente los implementa `infrastructure`.

Flujo conceptual:

```txt
Use Case
  ↓
Port Out
  ↓
Infrastructure Adapter
  ↓
Platform Service
```

### Repositories y Queries

Dentro de `ports/out`, se separan repositorios y queries.

```txt
Repository
= persistencia orientada a entidades de dominio

Query
= lectura optimizada, proyecciones, joins o listados
```

Un repository trabaja con entidades del dominio. Una query puede retornar read models.

Ejemplo conceptual:

```txt
IEntityRepository → Entity
IEntityQuery      → EntityView / ReadModel
```

### `application/exceptions/`

Contiene excepciones propias de la capa de aplicación.

Estas excepciones no representan una regla interna de una entidad, sino fallos de orquestación, coordinación, flujo de caso de uso o validaciones que dependen de la interacción entre varias capacidades.

```txt
application/exceptions/
├── operation-not-allowed.exception.ts
├── dependency-not-available.exception.ts
└── index.ts
```

Una excepción de aplicación aparece cuando el caso de uso no puede continuar por una condición de flujo, una dependencia funcional, una política de aplicación o una coordinación entre módulos.

Ejemplos conceptuales:

```txt
StudentNotActiveForEnrollmentException
ProfessorNotActiveForAssignmentException
AcademicPeriodNotCurrentException
CourseOfferingNotOpenException
EnrollmentCareerMismatchException
```

Una excepción de aplicación responde a la pregunta:

```txt
¿Por qué este caso de uso no puede ejecutarse en este contexto?
```

Diferencia con `domain/exceptions`:

```txt
domain/exceptions
= violaciones de reglas internas del modelo de negocio

application/exceptions
= fallos de flujo, coordinación o validaciones del caso de uso
```

Ejemplo:

```txt
EnrollmentInvalidStatusTransitionException
→ domain/exceptions
→ la entidad no permite esa transición de estado

StudentNotActiveForEnrollmentException
→ application/exceptions
→ el caso de uso de matrícula no puede continuar porque una dependencia funcional indica que el estudiante no está activo
```

## `infrastructure/`

`infrastructure/` contiene las implementaciones técnicas propias del módulo.

Esta subcapa adapta los puertos de salida a tecnologías concretas, como Prisma, consultas SQL, clientes HTTP externos, storage, mensajería o proveedores.

Estructura general:

```txt
infrastructure/
├── persistence/
│   ├── repositories/
│   ├── queries/
│   ├── mappers/
│   └── index.ts
├── clients/
├── providers/
├── messaging/
├── storage/
└── index.ts
```

`infrastructure` conoce `application` y `domain`, pero `application` y `domain` no conocen `infrastructure`.

### `infrastructure/persistence/repositories/`

Contiene adaptadores de repositorio.

Un repository adapter implementa un puerto de salida orientado a entidades.

```txt
infrastructure/persistence/repositories/
├── entity.repository.adapter.ts
└── index.ts
```

Trabaja con entidades de dominio y usa servicios técnicos de `platform`, como `PrismaService`.

### `infrastructure/persistence/queries/`

Contiene adaptadores de consulta.

Un query adapter implementa un puerto de salida de lectura. Puede usar consultas optimizadas, joins, includes o proyecciones.

```txt
infrastructure/persistence/queries/
├── entity-query.adapter.ts
└── index.ts
```

Puede devolver read models definidos en `application/read-models`.

### `infrastructure/persistence/mappers/`

Contiene mappers de persistencia.

Un persistence mapper convierte entre modelos técnicos de persistencia y modelos internos del módulo.

```txt
infrastructure/persistence/mappers/
├── entity-persistence.mapper.ts
└── index.ts
```

Ejemplos conceptuales:

```txt
Raw Prisma → Entity
Entity → Persistence Data
Raw Prisma con join → Read Model
```

Los mappers de persistencia no pertenecen a `domain` ni a `presentation`.

### `infrastructure/clients/`

Contiene clientes técnicos hacia servicios externos usados solo por el módulo.

```txt
infrastructure/clients/
- Clientes HTTP específicos
- Adaptadores de APIs externas
```

Si el cliente externo es global y reutilizable por varios módulos, pertenece a `platform/integrations`.

### `infrastructure/providers/`

Contiene providers técnicos propios del módulo.

```txt
infrastructure/providers/
- Implementaciones técnicas locales
- Adaptadores auxiliares del módulo
```

### `infrastructure/messaging/`

Contiene adaptadores de mensajería propios del módulo.

```txt
infrastructure/messaging/
- Publicadores de eventos
- Adaptadores de cola
- Implementaciones de mensajería
```

### `infrastructure/storage/`

Contiene adaptadores de almacenamiento propios del módulo.

```txt
infrastructure/storage/
- Guardado de archivos específico del módulo
- Lectura técnica de recursos propios del módulo
```

## `presentation/`

`presentation/` contiene los adaptadores de entrada y salida hacia el exterior.

En un proyecto NestJS, normalmente esta subcapa representa la exposición HTTP: controladores, DTOs, decoradores, pipes, mappers de presentación y constantes de rutas.

Estructura general:

```txt
presentation/
├── controllers/
├── dtos/
│   ├── request/
│   ├── response/
│   └── query/
├── mappers/
├── decorators/
├── constants/
├── pipes/
└── index.ts
```

`presentation` transforma una petición externa en una entrada de aplicación y transforma la respuesta de aplicación en una respuesta externa.

### `presentation/controllers/`

Contiene controladores NestJS.

```txt
presentation/controllers/
├── entities.controller.ts
└── index.ts
```

Los controladores reciben requests, delegan en casos de uso o puertos de entrada y devuelven respuestas. No contienen lógica de negocio ni acceso directo a Prisma.

### `presentation/dtos/request/`

Contiene DTOs de entrada HTTP.

```txt
presentation/dtos/request/
├── create-entity.dto.ts
└── index.ts
```

Estos DTOs pueden usar validadores, transformadores y decoradores de Swagger. Representan cómo llega la información desde el exterior.

### `presentation/dtos/query/`

Contiene DTOs de query params HTTP.

```txt
presentation/dtos/query/
├── list-entities-query.dto.ts
└── index.ts
```

Representan filtros, paginación o parámetros de búsqueda recibidos desde HTTP.

### `presentation/dtos/response/`

Contiene DTOs de salida HTTP.

```txt
presentation/dtos/response/
├── entity-response.dto.ts
└── index.ts
```

Representan cómo se entrega la información al cliente externo.

### `presentation/mappers/`

Contiene mappers de presentación.

```txt
presentation/mappers/
├── entity-http.mapper.ts
└── index.ts
```

Transforman:

```txt
Request DTO → Command / Query
Result / Read Model → Response DTO
```

Esta separación evita que los casos de uso dependan de DTOs HTTP.

### `presentation/decorators/`

Contiene decoradores de presentación específicos del módulo.

```txt
presentation/decorators/
- Decoradores Swagger específicos
- Decoradores de documentación del módulo
```

Decoradores reutilizables entre módulos pertenecen a `shared`.

### `presentation/constants/`

Contiene constantes de presentación del módulo.

```txt
presentation/constants/
- Rutas HTTP del módulo
- Tags de documentación
- Nombres de operaciones de presentación
```

Estas constantes no son reglas de dominio.

### `presentation/pipes/`

Contiene pipes específicos del módulo.

```txt
presentation/pipes/
- Pipes de transformación local
- Pipes de validación propios del módulo
```

Los pipes globales pertenecen a `platform/http`.

## Independencia entre módulos

Cada módulo mantiene su implementación interna protegida.

Un módulo no accede directamente a `domain`, `infrastructure`, `presentation` ni `ports/out` de otro módulo. Si necesita colaborar con otro módulo, utiliza los puertos de entrada expuestos por ese módulo.

Relación correcta:

```txt
Module A
  ↓
Module B / application / ports / in
```

Relaciones que rompen la independencia:

```txt
Module A → Module B / domain / entities
Module A → Module B / infrastructure / repositories
Module A → Module B / presentation / controllers
Module A → Module B / application / ports / out
```

La independencia permite que un módulo cambie su persistencia, su entidad interna o su presentación sin romper otros módulos.

## Dependencias entre módulos

La dependencia entre módulos existe cuando una capacidad funcional necesita colaborar con otra. Esa dependencia debe ser explícita y unidireccional.

Ejemplo conceptual:

```txt
enrollments
  ↓ necesita validar estudiante
students/application/ports/in/IStudentFinder
```

```txt
professors
  ↓ necesita crear persona
persons/application/ports/in/ICreatePerson
```

La dirección expresa dependencia funcional, no dependencia técnica. El módulo consumidor conoce un contrato de entrada. El módulo dueño mantiene la implementación.

Los módulos no se instancian entre sí manualmente. NestJS resuelve la inyección mediante módulos, providers, tokens, imports y exports.

## Exports públicos del módulo

El archivo `index.ts` de un módulo y los `exports` de su módulo NestJS definen qué elementos pueden ser consumidos externamente.

```txt
src/modules/<module>/index.ts
```

Contenido público conceptual:

```txt
- <module>.module.ts
- application/ports/in
- commands o queries necesarios para ports/in
- results o read-models necesarios para ports/in
```

Contenido que permanece interno:

```txt
- domain/entities
- domain/exceptions específicas
- application/ports/out
- infrastructure
- presentation
- mappers internos
```

La frontera pública del módulo debe ser mínima. Exponer menos elementos reduce acoplamiento.

## Tokens de inyección

Los contratos usados por NestJS necesitan tokens de inyección.

Ubicación habitual:

```txt
application/ports/in/tokens.ts
application/ports/out/tokens.ts
```

Ejemplo conceptual:

```txt
STUDENT_FINDER_PORT
STUDENT_REPOSITORY_PORT
CREATE_PERSON_PORT
```

Los tokens permiten inyectar interfaces en tiempo de ejecución sin depender de clases concretas.

## Uso de entidades entre módulos

Las entidades de dominio pertenecen al módulo que las define.

Una entidad no cruza módulos como contrato público. Cuando otro módulo necesita datos de una capacidad, recibe un `Result` o `ReadModel` definido por la capa de aplicación del módulo dueño.

```txt
Entity
= interno del módulo

Result
= salida de caso de uso

ReadModel
= proyección de lectura
```

Esta separación mantiene limpia la frontera entre módulos.

## Commands, Queries, Results y Read Models

Estos tipos pertenecen a `application` y cumplen roles distintos.

```txt
Command
= entrada de escritura para un caso de uso

Query
= entrada de lectura para un caso de uso

Result
= salida de una operación de aplicación

ReadModel
= proyección de lectura, normalmente compuesta o derivada
```

Los DTOs HTTP pertenecen a `presentation`, no a `application`.

```txt
presentation/dtos/request → Command
presentation/dtos/query   → Query
Result / ReadModel        → presentation/dtos/response
```

## Flujo de escritura

Flujo conceptual de una operación de escritura:

```txt
Controller
  ↓
Request DTO
  ↓ mapper
Command
  ↓
Use Case
  ↓
Domain Entity
  ↓
Repository Port
  ↓
Repository Adapter
  ↓
Platform Database Service
```

La entidad se crea o modifica dentro del módulo. La persistencia se ejecuta mediante un puerto de salida y un adaptador de infraestructura.

## Flujo de lectura

Flujo conceptual de una operación de lectura:

```txt
Controller
  ↓
Query DTO
  ↓ mapper
Application Query
  ↓
Use Case
  ↓
Query Port
  ↓
Query Adapter
  ↓
Read Model
  ↓ mapper
Response DTO
```

Las lecturas pueden usar read models para evitar forzar a la entidad de dominio a representar consultas compuestas.

## Flujo entre módulos

Flujo conceptual de colaboración entre módulos:

```txt
Use Case del módulo consumidor
  ↓
Port In del módulo dueño
  ↓
Use Case o servicio de aplicación del módulo dueño
  ↓
Result / ReadModel
```

El módulo consumidor no conoce la infraestructura ni las entidades internas del módulo dueño.

## Relación con `core`, `shared` y `platform`

Los módulos pueden usar otras capas del proyecto con límites claros.

```txt
modules → core
modules → shared
modules/infrastructure → platform
modules/presentation → shared
```

`core` aporta fundamentos estables. `shared` aporta soporte reutilizable ligero. `platform` aporta infraestructura técnica.

La infraestructura del módulo puede usar servicios de `platform`, como conexión a base de datos o parser de archivos. El dominio no usa `platform`.

## Resumen de subcapas

```txt
domain
= reglas puras, entidades, value objects, excepciones y servicios de dominio

application
= casos de uso, comandos, queries, results, read models, puertos y excepciones de aplicación

infrastructure
= adaptadores técnicos, repositorios, queries, mappers de persistencia y clientes

presentation
= controladores, DTOs HTTP, mappers HTTP, decoradores y constantes de rutas
```

## Estructura completa de referencia

```txt
src/modules/<module>/
├── <module>.module.ts
├── index.ts
│
├── domain/
│   ├── constants/
│   ├── entities/
│   ├── exceptions/
│   ├── services/
│   ├── value-objects/
│   └── index.ts
│
├── application/
│   ├── commands/
│   ├── queries/
│   ├── results/
│   ├── read-models/
│   ├── use-cases/
│   ├── ports/
│   │   ├── in/
│   │   │   ├── tokens.ts
│   │   │   └── index.ts
│   │   └── out/
│   │       ├── tokens.ts
│   │       └── index.ts
│   ├── exceptions/
│   └── index.ts
│
├── infrastructure/
│   ├── persistence/
│   │   ├── repositories/
│   │   ├── queries/
│   │   ├── mappers/
│   │   └── index.ts
│   ├── clients/
│   ├── providers/
│   ├── messaging/
│   ├── storage/
│   └── index.ts
│
└── presentation/
    ├── controllers/
    ├── dtos/
    │   ├── request/
    │   ├── response/
    │   └── query/
    ├── mappers/
    ├── decorators/
    ├── constants/
    ├── pipes/
    └── index.ts
```

Esta estructura expresa una separación limpia entre negocio, aplicación, infraestructura y presentación. La repetición controlada de tipos entre capas permite proteger las fronteras del módulo y mantener independencia entre capacidades funcionales.
