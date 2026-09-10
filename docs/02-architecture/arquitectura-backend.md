# Arquitectura backend

Este documento describe la arquitectura general del backend desde una perspectiva técnica. La intención es explicar cómo se organiza la aplicación para sostener el proceso de inscripción académica sin mezclar reglas de negocio con detalles de framework, base de datos o transporte HTTP.

El sistema se plantea como una API backend modular. Su núcleo funcional está en los módulos de negocio: identidad, estudiantes, docentes, programas académicos, cursos, periodos académicos, ofertas de curso, inscripciones, acceso y reportes.

## Enfoque general

El backend se organiza alrededor de una separación clara de responsabilidades.

```txt
Negocio académico
→ reglas, entidades, casos de aplicación y contratos

Presentación HTTP
→ controladores, DTOs, validación de entrada y documentación de API

Infraestructura
→ base de datos, archivos, configuración, autenticación técnica y servicios externos

Procesamiento asíncrono
→ jobs, eventos y workers que operan fuera del flujo HTTP

Composición
→ arranque, registro de módulos y configuración global
```

La idea es que el sistema pueda crecer sin que todo quede concentrado en controladores o servicios grandes. Cada parte debe tener una razón clara para existir.

## Principio principal

La regla principal de la arquitectura es que el negocio no debe depender directamente de detalles técnicos.

Por ejemplo:

```txt
- La regla de que una oferta no puede superar su cupo no depende de Prisma.
- La regla de que un estudiante suspendido no puede inscribirse no depende de HTTP.
- La regla de que una inscripción duplicada debe bloquearse no depende de Swagger.
- La trazabilidad de una acción no debería estar mezclada con el controlador.
```

Las herramientas técnicas son necesarias, pero no deben definir el modelo del sistema.

## Capas conceptuales

El backend se puede leer en cuatro niveles principales:

```txt
Presentación
Aplicación
Dominio
Infraestructura
```

No todos los módulos tienen que ser excesivamente complejos, pero la separación debe mantenerse cuando exista lógica suficiente.

Estos cuatro niveles describen la estructura interna de un módulo. El procesamiento asíncrono no agrega un nivel nuevo dentro del módulo: los workers consumen casos de uso y servicios ya existentes. Lo que agrega es una forma distinta de ejecución, fuera del flujo HTTP.

## Presentación

La presentación es la parte que recibe y responde solicitudes HTTP.

Aquí viven elementos como:

```txt
- Controladores.
- DTOs de entrada.
- DTOs de salida.
- Validaciones de formato.
- Decoradores de documentación.
- Mappers hacia respuestas HTTP.
```

La presentación no debería contener reglas de negocio importantes. Su función es recibir datos, validarlos superficialmente, llamar a la aplicación y devolver una respuesta clara.

Ejemplo de responsabilidades correctas:

```txt
- Leer parámetros de ruta.
- Leer filtros de consulta.
- Validar forma del body.
- Convertir una respuesta de aplicación a DTO HTTP.
```

Ejemplo de responsabilidades que no deberían vivir aquí:

```txt
- Decidir si un estudiante puede inscribirse.
- Calcular cupos disponibles.
- Cambiar estados académicos directamente.
- Consultar Prisma desde el controlador.
- Ejecutar trabajo intensivo dentro de la petición.
```

## Aplicación

La capa de aplicación coordina acciones del sistema.

Aquí se ubican los casos de aplicación, comandos, consultas y contratos que expresan lo que el sistema puede hacer.

Ejemplos:

```txt
- Registrar estudiante.
- Importar estudiantes.
- Crear oferta de curso.
- Inscribir estudiante.
- Cambiar estado de inscripción.
- Obtener reportes académicos.
```

La aplicación coordina reglas, validaciones de negocio, consultas a repositorios y operaciones transversales como auditoría cuando corresponde.

No debería depender directamente del protocolo HTTP.

Cuando un caso de uso identifica trabajo que no debería resolverse dentro de la petición —porque es lento, intensivo o depende de servicios externos—, puede encolar un job o publicar un evento a través de los contratos definidos en `core`. El caso de uso conserva el control de la decisión; el worker solo ejecuta lo que ya fue decidido.

## Dominio

El dominio contiene las reglas propias del negocio académico.

Aquí viven conceptos como:

```txt
- Estudiante.
- Docente.
- Programa académico.
- Curso.
- Periodo académico.
- Oferta de curso.
- Inscripción.
- Estados del proceso.
```

El dominio debe expresar comportamiento cuando el concepto lo necesita.

Ejemplos:

```txt
- Una oferta sabe si está abierta.
- Una oferta sabe si tiene cupo disponible.
- Un estudiante sabe si está habilitado según su estado.
- Una inscripción sabe si puede cambiar de estado.
```

El dominio no debe depender de NestJS, Prisma, HTTP, Swagger ni detalles de infraestructura. Tampoco debe conocer colas ni buses de eventos; esos son mecanismos de ejecución, no reglas del negocio.

## Infraestructura

La infraestructura conecta el sistema con herramientas externas.

Aquí se ubican adaptadores concretos para:

```txt
- Persistencia con Prisma.
- Base de datos PostgreSQL.
- Lectura de archivos CSV/XLSX.
- Hash de contraseñas.
- JWT o mecanismos de autenticación.
- Registro de auditoría.
- Implementación concreta de colas y bus de eventos.
- Configuración del entorno.
```

La infraestructura implementa detalles, pero no debe decidir reglas de negocio.

Por ejemplo, un repositorio puede guardar una inscripción, pero no debería decidir por sí solo si el estudiante puede inscribirse. Esa decisión pertenece al dominio o a la aplicación.

Lo mismo aplica a la cola y al bus de eventos: la infraestructura ofrece el mecanismo, pero no define qué trabajo se encola ni qué eventos se publican.

## Procesamiento asíncrono

El backend separa el trabajo interactivo del trabajo intensivo o diferible.

El trabajo interactivo se atiende en el flujo HTTP y debe responder rápido. El trabajo intensivo —procesos batch, importaciones grandes, análisis, integraciones lentas— se delega a una cola de jobs, y los hechos relevantes se anuncian a través de un bus de eventos.

Dos capacidades transversales sostienen este flujo:

```txt
Job Queue
= encola unidades de trabajo que se ejecutan de forma confiable, con reintentos, prioridad y estado consultable

Event Bus
= publica hechos internos para que otros procesos o módulos reaccionen sin acoplamiento directo
```

Los contratos de ambas capacidades viven en `core`, porque describen mecánica general sin depender de tecnología. Las implementaciones concretas viven en `platform`, porque son detalle de infraestructura reemplazable.

Los workers son procesos autónomos que consumen jobs y eventos desde fuera del flujo HTTP. No exponen endpoints, no contienen reglas de negocio y no forman parte del arranque de la API. Se ejecutan como entrypoints independientes y delegan la lógica real en casos de uso y servicios de los módulos.

Esta separación permite:

```txt
- No bloquear la API con trabajo pesado.
- Reintentar operaciones sin reescribir casos de uso.
- Añadir reacciones a eventos sin modificar a los emisores.
- Reemplazar la tecnología de cola sin tocar la lógica académica.
```

## Módulos funcionales

Los módulos funcionales representan capacidades del sistema.

Para este proyecto, los módulos principales pueden ser:

```txt
identity
students
professors
academic-programs
courses
academic-periods
course-offerings
enrollments
users
authorization
audit
reports
```

No todos tienen el mismo peso. Algunos contienen reglas fuertes, como `enrollments` o `course-offerings`. Otros pueden ser más simples, como `professors` o `academic-programs`.

Los catálogos no forman un módulo por sí mismos. Cada catálogo vive dentro del módulo que lo usa: los tipos de documento en `identity`, las categorías de curso en `courses`. Solo se extraen a un módulo propio si varios módulos llegan a depender del mismo catálogo.

## Capacidades transversales

Algunas capacidades no pertenecen a un solo módulo de negocio.

Ejemplos:

```txt
files
database
config
security
logging
queue
event-bus
```

Estas capacidades pueden vivir en `platform` porque son infraestructura o soporte técnico utilizado por varios módulos.

La importación de estudiantes, por ejemplo, pertenece funcionalmente a `students`, pero puede apoyarse en un parser de archivos ubicado en `platform/files` y en un job encolado a través del contrato de `JobQueue`.

La auditoría, aunque tiene una infraestructura técnica en `platform/audit`, también puede exponerse como módulo funcional `audit` cuando necesita consulta administrativa o contratos propios.

## Relación con el proceso de inscripción

La arquitectura debe sostener el proceso definido en la documentación de producto:

```txt
Estudiante
→ Programa académico
→ Curso
→ Periodo académico
→ Oferta de curso
→ Inscripción
→ Reportes
```

Por eso, los módulos no deben organizarse solo por tablas, sino por responsabilidades del negocio.

El sistema no trata la inscripción como un CRUD aislado. La inscripción depende del estado del estudiante, de la oferta, del periodo, del cupo y de reglas de duplicidad.

El registro de una inscripción sigue siendo una operación interactiva: debe ser síncrona porque el usuario necesita saber si la inscripción quedó registrada. Lo que puede diferirse son operaciones alrededor de la inscripción: notificar, auditar, recalcular reportes, procesar importaciones previas o consolidar información.

## Criterio de simplicidad

La arquitectura no debe volverse más compleja que el problema.

Un módulo simple puede tener menos carpetas. Un módulo con reglas fuertes puede tener separación más clara entre dominio, aplicación, infraestructura y presentación.

La regla práctica es:

```txt
Si solo expone datos simples, mantenerlo simple.
Si coordina reglas importantes, separar responsabilidades.
```

Esto evita crear estructura innecesaria solo por formalidad. El procesamiento asíncrono sigue el mismo criterio: se introduce donde el caso lo justifica, no por anticipación.

## Resultado esperado

La arquitectura backend debe permitir:

```txt
- Mantener reglas de negocio fuera de controladores.
- Evitar que Prisma invada el dominio.
- Separar infraestructura de lógica académica.
- Proteger el proceso de inscripción con reglas claras.
- Delegar trabajo intensivo fuera del flujo HTTP.
- Reaccionar a hechos internos sin acoplar módulos.
- Ubicar cada archivo por responsabilidad.
- Facilitar pruebas de reglas y casos principales.
- Permitir crecimiento sin perder orden.
```
