# Capa workers

La capa `workers` contiene la orquestación de los procesos asíncronos del backend.

Los workers se ejecutan en paralelo a la API, consumen jobs y eventos, y delegan la lógica real en los casos de uso y servicios de los módulos. No exponen endpoints, no contienen reglas de negocio y no forman parte del arranque de la aplicación HTTP.

Su existencia responde a una necesidad concreta: separar el trabajo interactivo del trabajo intensivo o diferible, sin mezclar ambos en el mismo proceso.

## Responsabilidad principal

La responsabilidad de `workers` es responder a esta pregunta:

```txt
¿Qué procesos se ejecutan fuera del flujo HTTP y cómo se conectan con la cola y el bus?
```

Un worker no decide. Un worker consume. La decisión vive en el módulo dueño del proceso; `workers` solo conecta la cola o el bus con esa decisión.

## Ubicación

```txt
src/
├── worker.ts
└── workers/
    ├── register-jobs.ts
    └── index.ts
```

`src/worker.ts` es el entrypoint del proceso. `src/workers/` contiene la orquestación que registra los procesadores y handlers expuestos por los módulos.

## Relación con `main.ts`

La API tiene su entrypoint en `src/main.ts`.

Los workers tienen su propio entrypoint en `src/worker.ts`, en la raíz de `src/`. Son procesos independientes que se arrancan por separado.

```txt
src/main.ts
= entrypoint de la API

src/worker.ts
= entrypoint de los workers
```

Ambos procesos comparten el mismo código fuente, los mismos módulos, los mismos contratos y la misma infraestructura. Lo que cambia es el punto de arranque y el tipo de trabajo que ejecutan.

## Estructura posible

La estructura puede incluir:

```txt
src/
├── worker.ts
└── workers/
    ├── register-jobs.ts
    └── index.ts
```

No todas las piezas deben existir desde el inicio. Deben aparecer cuando el proyecto realmente las necesite.

## `worker.ts`

Es el punto de entrada del proceso de workers.

Debe mantenerse pequeño y delegar la configuración de arranque.

Uso esperado:

```txt
- Crear el contexto de NestJS en modo aplicación, sin HTTP.
- Invocar la orquestación de `workers/`.
- Iniciar la suscripción a la cola y al bus.
- Mantener el proceso activo mientras el sistema está en ejecución.
```

No debe contener lógica funcional ni reglas de negocio.

## `register-jobs.ts`

Contiene la orquestación que conecta los procesadores de jobs y handlers de eventos expuestos por los módulos con las implementaciones de cola y bus de `platform/queue`.

Uso esperado:

```txt
- Registrar cada procesador de jobs contra la cola.
- Registrar cada handler de eventos contra el bus.
- Asociar nombres lógicos de job o evento con los procesadores del módulo dueño.
- Exponer la orquestación para que `worker.ts` arranque la suscripción.
```

Los procesadores y handlers concretos no viven en `workers/`. Viven en `modules/<module>/entrypoints/queue/`. `register-jobs.ts` solo los conecta.

Ejemplo:

```txt
modules/students/entrypoints/queue/student-import.processor.ts
= procesador del job de importación de estudiantes

workers/register-jobs.ts
= registra ese procesador contra la cola
```

## Qué puede contener

La capa `workers` puede contener:

```txt
- Orquestación del registro de procesadores de jobs.
- Orquestación del registro de handlers de eventos.
- Configuración de arranque específica del proceso asíncrono.
```

## Qué no pertenece a `workers`

No deberían vivir en `workers`:

```txt
- Entidades de dominio.
- Casos de uso.
- Repositorios.
- Reglas de negocio.
- Validaciones académicas.
- Controladores HTTP.
- DTOs HTTP.
- Mappers de presentación.
- Procesadores de jobs concretos.
- Handlers de eventos concretos.
- Configuración global de la API.
- Conexión global a base de datos.
- Implementación concreta de la cola o el bus.
- Guards, pipes, interceptores o filtros HTTP.
```

Un worker no es un módulo ni una capa de negocio. Es un consumidor de capacidades ya definidas.

Si algo decide una regla académica o de acceso funcional, pertenece a `modules`.

Si algo es un procesador de jobs o un handler de eventos del módulo, pertenece a `modules/<module>/entrypoints/queue/`.

Si algo implementa tecnología de cola o bus, pertenece a `platform/queue`.

Si algo representa la composición de la API, pertenece a `app`.

## Dependencias permitidas

`workers` puede depender de:

```txt
- core
- modules
- platform
- shared
```

`workers` no debe depender de:

```txt
- app
- modules/domain
- modules/infrastructure
```

La dependencia con `modules` se hace a través de los procesadores y handlers expuestos en `entrypoints/queue/`, que a su vez consumen casos de uso, servicios o contratos públicos del módulo dueño, no de sus detalles internos.

## Relación con otras capas

### Con `core`

Los workers consumen los contratos de capacidades transversales definidos en `core`.

```txt
core/contracts/job-queue
= contrato JobQueue

core/contracts/event-bus
= contrato EventBus
```

Los workers no conocen la implementación concreta. Solo conocen el contrato.

### Con `modules`

Los workers conectan los procesadores y handlers de `modules/<module>/entrypoints/queue/` con la cola y el bus.

```txt
worker
→ consume un procesador de modules/<module>/entrypoints/queue
→ el procesador llama a un caso de uso del módulo
→ el módulo valida, persiste y decide
```

Un worker no importa `modules/domain` ni `modules/infrastructure`. No consulta tablas directamente.

### Con `platform`

Los workers usan `platform` para acceder a las implementaciones concretas de cola y bus.

```txt
workers
→ platform/queue
```

También pueden usar `platform/database` si necesitan una conexión propia, aunque lo normal es que el acceso a datos ocurra dentro de los módulos.

### Con `shared`

Los workers pueden usar `shared` para utilidades ligeras, igual que cualquier otro consumidor.

### Con `app`

Los workers no dependen de `app`.

```txt
workers → app   no
```

La API y los workers son procesos paralelos, no jerárquicos. `app` compone la API; `workers` compone la orquestación del proceso asíncrono.

## Cómo se relaciona un worker con un módulo

El patrón general es el siguiente:

```txt
1. Un caso de uso de un módulo identifica trabajo diferible.
2. El caso de uso encola un job o publica un evento a través de un contrato de core.
3. El procesador o handler del módulo (en modules/<module>/entrypoints/queue) recibe el payload.
4. El procesador delega la lógica en el caso de uso o servicio del módulo.
5. El módulo valida, persiste y decide.
6. El procesador finaliza el job o el evento.
```

El worker nunca reemplaza al módulo. Solo ejecuta, fuera del flujo HTTP, algo que el módulo ya decidió.

## Diferencia con `platform/queue`

`platform/queue` implementa la mecánica de la cola y del bus.

`workers` orquesta el registro de los procesadores y handlers contra esa mecánica.

```txt
platform/queue
= implementación concreta de JobQueue y EventBus

workers
= orquestación que registra procesadores y handlers
```

El worker no implementa la cola. Solo se suscribe a ella.

## Diferencia con `modules`

`modules` contiene reglas de negocio y los procesadores concretos en `entrypoints/queue/`.

`workers` no contiene reglas de negocio ni procesadores concretos. Solo orquesta el registro.

```txt
modules/students
= reglas de importación de estudiantes

modules/students/entrypoints/queue/student-import.processor.ts
= procesador que recibe el payload y llama al caso de uso

workers/register-jobs.ts
= conecta ese procesador con la cola
```

## Crecimiento esperado

`workers` puede crecer cuando aparecen nuevos procesos diferibles.

Cada nuevo proceso debería seguir el mismo criterio:

```txt
- Crear el procesador o handler en modules/<module>/entrypoints/queue/.
- Registrarlo en workers/register-jobs.ts.
- Delegar la lógica en un módulo.
- No contener reglas propias.
- No depender de detalles internos de otros módulos.
```

Si un worker empieza a acumular lógica, probablemente esa lógica pertenece a un módulo. Si un worker empieza a depender de detalles técnicos concretos, probablemente esa dependencia pertenece a `platform`.

## Criterio de uso

Antes de colocar algo en `workers`, conviene preguntar:

```txt
¿Es parte de la orquestación del proceso asíncrono?
¿Registra un procesador o handler ya definido en un módulo?
¿No contiene reglas de negocio propias?
¿No contiene procesadores ni handlers concretos?
¿No depende de detalles internos de otros módulos?
```

Si alguna respuesta no encaja, probablemente no pertenece a `workers`.
