# Reglas de dependencia

Este documento define las reglas de dependencia que deben respetarse dentro del backend. Su objetivo es evitar acoplamiento innecesario y proteger las reglas del negocio académico frente a detalles técnicos.

Las dependencias deben ser fáciles de explicar: las partes más concretas pueden conocer a las más estables, pero las partes estables no deben depender de detalles de ejecución.

## Principio base

La regla principal es:

```txt
El negocio no debe depender de la infraestructura.
```

Esto significa que las reglas de inscripción, cupos, estados o duplicidad no deben depender directamente de Prisma, NestJS, HTTP, Swagger, parsers de archivos ni mecanismos de cola o eventos.

## Dirección general

La dirección general esperada es:

```txt
main.ts
→ app
→ modules
→ core / shared
```

Para infraestructura:

```txt
app
→ platform

modules/infrastructure
→ platform o adaptadores técnicos

platform
→ core / shared
```

Para procesamiento asíncrono:

```txt
workers
→ core (contratos)
→ modules (casos de uso y servicios)
→ platform (implementaciones de cola y bus)
→ shared
```

## Dependencias permitidas

Relaciones permitidas:

```txt
app → modules
app → platform
app → core
app → shared

modules → core
modules → shared

modules/presentation → modules/application
modules/application → modules/domain
modules/infrastructure → modules/application
modules/infrastructure → modules/domain

platform → core
platform → shared

workers → core
workers → modules
workers → platform
workers → shared

shared → core
```

Estas relaciones mantienen el centro del sistema independiente de detalles externos y permiten que el procesamiento asíncrono consuma contratos y casos de uso sin acoplarse a detalles internos.

## Dependencias no permitidas

Relaciones que deben evitarse:

```txt
core → app
core → modules
core → platform
core → shared con lógica concreta

shared → modules
shared → platform

platform → modules

modules → app
modules → workers
modules/domain → infrastructure
modules/domain → presentation
modules/domain → Prisma
modules/domain → NestJS
modules/domain → HTTP

workers → app
workers → modules/domain
workers → modules/infrastructure
```

Si aparece una dependencia de este tipo, probablemente una responsabilidad está ubicada en el lugar incorrecto.

## Reglas para `core`

`core` es la zona más estable.

Puede ser usado por otras partes, pero no debe conocerlas.

Puede depender de:

```txt
- TypeScript.
- Elementos puros del lenguaje.
```

No debe depender de:

```txt
- NestJS.
- Prisma.
- HTTP.
- Swagger.
- Módulos funcionales.
- Platform.
- Workers.
- Shared si eso genera ciclos o acoplamiento innecesario.
```

Los contratos de capacidades transversales que no dependen de tecnología viven aquí: por ejemplo, el contrato de `JobQueue` y el de `EventBus`. No describen reglas de negocio ni detalles de infraestructura; solo la mecánica general de encolar trabajo y publicar eventos internos.

## Reglas para `modules`

`modules` contiene el negocio y la aplicación funcional.

Un módulo puede depender de:

```txt
- core.
- shared.
- Sus propias carpetas internas.
- Contratos públicos de otros módulos, si son necesarios.
- Contratos transversales de core, como JobQueue o EventBus, cuando necesite delegar trabajo o anunciar hechos.
```

Debe evitar:

```txt
- Importar detalles internos de otro módulo.
- Depender de app.
- Depender de workers.
- Usar Prisma directamente fuera de infrastructure.
- Colocar reglas académicas en presentation.
- Ejecutar trabajo intensivo dentro del flujo HTTP.
```

Cuando un caso de uso identifica trabajo que no debería resolverse dentro de la petición, puede encolar un job o publicar un evento a través de los contratos de `core`. El caso de uso conserva la decisión; el worker solo ejecuta lo decidido. El módulo nunca invoca un worker directamente ni conoce su existencia.

## Reglas internas de un módulo

Dentro de un módulo con estructura por capas, la dirección recomendada es:

```txt
presentation
→ application
→ domain

infrastructure
→ application
infrastructure
→ domain
```

El dominio no debe depender de presentación ni infraestructura.

```txt
domain
= no conoce controladores, DTOs HTTP, repositorios concretos, colas ni buses de eventos
```

La aplicación puede definir puertos o contratos para lo que necesita.

```txt
application
= coordina casos, usa contratos y reglas
= puede encolar jobs o publicar eventos a través de contratos de core
```

La infraestructura implementa esos contratos.

```txt
infrastructure
= Prisma, mappers de persistencia, adaptadores técnicos
```

## Reglas para `platform`

`platform` contiene infraestructura global.

Puede depender de:

```txt
- core.
- shared.
- Librerías técnicas.
- Frameworks.
```

Debe evitar depender de módulos funcionales.

Ejemplo incorrecto:

```txt
platform/audit importa enrollments/domain
```

Ejemplo correcto:

```txt
enrollments usa un contrato o servicio de auditoría para registrar una acción
```

La plataforma ofrece capacidades, pero no debe conocer reglas académicas.

`platform/queue` implementa los contratos de `JobQueue` y `EventBus` definidos en `core`. La tecnología concreta de la cola y del bus es un detalle reemplazable; ni los módulos ni los workers deberían conocerla.

## Reglas para `workers`

`workers` contiene procesos asíncronos que operan fuera del flujo HTTP.

Un worker puede depender de:

```txt
- core, para usar los contratos de JobQueue y EventBus.
- modules, para usar casos de uso, servicios y contratos públicos de los módulos.
- platform, para acceder a las implementaciones concretas de cola y bus.
- shared, para utilidades ligeras.
```

Debe evitar:

```txt
- Depender de app.
- Importar módulos/domain directamente.
- Importar módulos/infrastructure directamente.
- Contener reglas de negocio propias.
- Consultar tablas ajenas sin pasar por un contrato del módulo dueño.
- Exponer endpoints HTTP.
```

Un worker se limita a conectar la cola o el bus con el módulo dueño del proceso. Toda decisión de negocio se delega al caso de uso o servicio correspondiente. El worker no decide, solo consume.

## Reglas para `shared`

`shared` debe mantenerse simple.

Puede depender de:

```txt
- core, si es necesario.
- TypeScript.
```

Debe evitar depender de:

```txt
- modules.
- platform.
- workers.
- app.
- Prisma.
- NestJS, salvo que se trate de elementos compartidos claramente de presentación.
```

Si un elemento compartido empieza a tener demasiada lógica, debe moverse a un módulo o a `core`.

## Comunicación entre módulos

Los módulos no deberían acceder libremente a detalles internos de otros módulos.

Evitar:

```txt
students importa repositories internos de academic-programs
enrollments importa entidades internas no públicas de students
course-offerings consulta directamente infraestructura de courses
```

Preferir:

```txt
- Contratos públicos.
- Servicios de consulta internos.
- Puertos de aplicación.
- Composición desde app.
```

La regla práctica es que un módulo puede pedir información a otro, pero no debería meterse en su implementación. Los workers siguen la misma regla frente a los módulos: consumen contratos públicos, no detalles internos.

## Casos comunes

### Inscripción necesita validar estudiante

`enrollments` necesita saber si un estudiante existe y si puede inscribirse.

No debería consultar directamente la tabla de estudiantes desde cualquier lugar.

Una opción limpia es que `students` exponga una capacidad interna o contrato de consulta:

```txt
StudentFinder
StudentEligibilityChecker
```

Así `enrollments` depende de una capacidad clara, no de detalles internos.

### Inscripción necesita validar oferta

`enrollments` necesita saber si una oferta existe, está abierta y tiene cupo.

`course-offerings` puede exponer una capacidad como:

```txt
CourseOfferingFinder
CourseOfferingAvailabilityChecker
```

La regla de inscripción queda clara y no se duplica lógica de oferta en cualquier parte.

### Importación necesita leer archivos

`students` puede tener el proceso de importación, pero la lectura CSV/XLSX puede estar en `platform/files`.

```txt
students
→ usa parser de archivos
→ valida filas según reglas de estudiantes
```

La lectura del archivo es técnica. La validación del estudiante es de negocio.

### Importación necesita procesarse en segundo plano

Si la importación es intensiva, el caso de uso de `students` puede encolar un job a través del contrato de `JobQueue`.

```txt
students/application
→ encola job "student-import.process"
→ worker consume el job
→ worker invoca el caso de uso de students
→ students valida, persiste y decide
```

El worker no accede directamente a la tabla de estudiantes ni aplica sus propias reglas. Solo conecta la cola con el caso de uso.

## Evitar ciclos

Los ciclos de dependencia vuelven difícil mantener el sistema.

Ejemplo problemático:

```txt
students → enrollments
enrollments → students
```

Si ambos módulos necesitan colaborar, se debe extraer un contrato o definir una dependencia en una sola dirección.

Otro ciclo problemático:

```txt
modules → workers
workers → modules
```

Este ciclo se evita porque los módulos nunca dependen de workers. La dependencia va en una sola dirección: los workers consumen módulos.

## Regla de revisión

Antes de aceptar una dependencia nueva, conviene preguntar:

```txt
¿La capa que importa es más concreta que la capa importada?
¿Estoy importando una capacidad o un detalle interno?
¿Esta dependencia hará más difícil probar la regla de negocio?
¿La regla académica queda atada a una herramienta?
¿El módulo importado debería exponer un contrato público?
¿Esta dependencia pertenece al flujo HTTP o al flujo asíncrono?
```

Si la dependencia no se puede explicar con claridad, probablemente debe revisarse.
