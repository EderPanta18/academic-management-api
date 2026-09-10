# Capa workers

La capa `workers` contiene los procesos asíncronos del backend.

Los workers se ejecutan en paralelo a la API, consumen jobs y eventos, y delegan la lógica real en los casos de uso y servicios de los módulos. No exponen endpoints, no contienen reglas de negocio y no forman parte del arranque de la aplicación HTTP.

Su existencia responde a una necesidad concreta: separar el trabajo interactivo del trabajo intensivo o diferible, sin mezclar ambos en el mismo proceso.

## Responsabilidad principal

La responsabilidad de `workers` es responder a esta pregunta:

```txt
¿Qué procesos se ejecutan fuera del flujo HTTP?
```

Un worker no decide. Un worker consume. La decisión vive en el módulo dueño del proceso; el worker solo conecta la cola o el bus con esa decisión.

## Ubicación

```txt
src/
└── workers/
```

## Relación con `main.ts`

La API tiene su entrypoint en `src/main.ts`.

Los workers tienen su propio entrypoint dentro de `src/workers/`. Son procesos independientes que se arrancan por separado.

```txt
src/main.ts
= entrypoint de la API

src/workers/main.ts
= entrypoint de los workers
```

Ambos procesos comparten el mismo código fuente, los mismos módulos, los mismos contratos y la misma infraestructura. Lo que cambia es el punto de arranque y el tipo de trabajo que ejecutan.

## Estructura posible

La estructura puede incluir:

```txt
src/workers/
├── main.ts
├── jobs/
├── events/
└── index.ts
```

No todas las carpetas deben existir desde el inicio. Deben aparecer cuando el proyecto realmente las necesite.

## `main.ts`

Es el punto de entrada del proceso de workers.

Debe mantenerse pequeño y delegar la configuración de arranque.

Uso esperado:

```txt
- Crear el contenedor de dependencias.
- Registrar procesadores de jobs.
- Registrar handlers de eventos.
- Iniciar la suscripción a la cola y al bus.
- Mantener el proceso activo mientras el sistema está en ejecución.
```

No debe contener lógica funcional ni reglas de negocio.

## `jobs/`

Contiene los procesadores de jobs.

Un procesador de jobs es una función que recibe un payload y ejecuta el caso de uso correspondiente del módulo dueño.

Estructura posible:

```txt
src/workers/jobs/
├── student-import.processor.ts
├── report-generation.processor.ts
└── index.ts
```

Uso esperado:

```txt
- Registrar el procesador con un nombre lógico de job.
- Validar que el payload tenga la forma esperada.
- Delegar la lógica en un caso de uso del módulo.
- Devolver el resultado esperado por la cola.
```

Un procesador no contiene reglas de negocio. No consulta tablas directamente. No decide si una operación es válida. Todo eso pertenece al módulo.

Ejemplo:

```txt
student-import.processor.ts
→ recibe el payload del job
→ llama al caso de uso de importación de students
→ students valida, persiste y decide
```

## `events/`

Contiene los handlers de eventos.

Un handler de eventos es una función que reacciona a un hecho publicado por un módulo y delega la reacción en el caso de uso correspondiente.

Estructura posible:

```txt
src/workers/events/
├── enrollment-created.handler.ts
├── user-session-revoked.handler.ts
└── index.ts
```

Uso esperado:

```txt
- Registrar el handler con un nombre lógico de evento.
- Validar que el payload tenga la forma esperada.
- Delegar la lógica en un caso de uso o servicio del módulo.
- Devolver el resultado esperado por el bus.
```

Un handler no contiene reglas de negocio. Si el evento requiere una reacción compleja, esa reacción vive en el módulo, no en el handler.

## Qué puede contener

La capa `workers` puede contener:

```txt
- Entrypoint de workers.
- Registro de procesadores de jobs.
- Registro de handlers de eventos.
- Configuración de arranque específica del proceso.
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
- Configuración global de la API.
- Conexión global a base de datos.
- Implementación concreta de la cola o el bus.
- Guards, pipes, interceptores o filtros HTTP.
```

Un worker no es un módulo ni una capa de negocio. Es un consumidor de capacidades ya definidas.

Si algo decide una regla académica o de acceso funcional, pertenece a `modules`.

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

La dependencia con `modules` se hace a través de casos de uso, servicios o contratos públicos del módulo dueño, no de sus detalles internos.

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

Los workers consumen casos de uso, servicios o contratos públicos de los módulos.

```txt
worker
→ consume un caso de uso de students
→ students valida, persiste y decide
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

La API y los workers son procesos paralelos, no jerárquicos. `app` compone la API; `workers` compone el proceso asíncrono.

## Cómo se relaciona un worker con un módulo

El patrón general es el siguiente:

```txt
1. Un caso de uso de un módulo identifica trabajo diferible.
2. El caso de uso encola un job o publica un evento a través de un contrato de core.
3. El worker consume el job o el evento.
4. El worker delega la lógica en el caso de uso o servicio del módulo.
5. El módulo valida, persiste y decide.
6. El worker finaliza el job o el evento.
```

El worker nunca reemplaza al módulo. Solo ejecuta, fuera del flujo HTTP, algo que el módulo ya decidió.

## Diferencia con `platform/queue`

`platform/queue` implementa la mecánica de la cola y del bus.

`workers` consume esa mecánica.

```txt
platform/queue
= implementación concreta de JobQueue y EventBus

workers
= procesos que consumen jobs y eventos
```

El worker no implementa la cola. Solo se suscribe a ella.

## Diferencia con `modules`

`modules` contiene reglas de negocio.

`workers` no contiene reglas de negocio. Solo conecta la cola o el bus con el módulo que decide.

```txt
modules/students
= reglas de importación de estudiantes

workers/jobs/student-import.processor.ts
= conecta el job con el caso de uso de students
```

## Crecimiento esperado

`workers` puede crecer cuando aparecen nuevos procesos diferibles.

Cada nuevo worker debería seguir el mismo criterio:

```txt
- Registrar un procesador o handler.
- Delegar la lógica en un módulo.
- No contener reglas propias.
- No depender de detalles internos de otros módulos.
```

Si un worker empieza a acumular lógica, probablemente esa lógica pertenece a un módulo. Si un worker empieza a depender de detalles técnicos concretos, probablemente esa dependencia pertenece a `platform`.

## Criterio de uso

Antes de colocar algo en `workers`, conviene preguntar:

```txt
¿Es un proceso que se ejecuta fuera del flujo HTTP?
¿Consume un job o un evento?
¿Delega la lógica en un módulo?
¿No contiene reglas de negocio propias?
¿No depende de detalles internos de otros módulos?
```

Si alguna respuesta no encaja, probablemente no pertenece a `workers`.
