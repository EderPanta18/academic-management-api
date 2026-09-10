# Stack tecnológico

Este documento describe las tecnologías principales usadas por el backend y el criterio general para incorporar herramientas al proyecto.

El stack no define por sí mismo la arquitectura. La arquitectura indica cómo se organiza el código, cómo se separan responsabilidades y cómo se protegen las reglas del negocio. El stack indica con qué herramientas se construye y ejecuta esa arquitectura.

## Enfoque general

El proyecto usa un stack backend basado en TypeScript, NestJS, Prisma y PostgreSQL, con procesamiento asíncrono apoyado en una cola de jobs y un bus de eventos sobre la misma base de datos.

La intención es trabajar con herramientas conocidas, mantenibles y adecuadas para construir una API modular de gestión académica. El sistema debe poder crecer por módulos sin que las reglas del dominio queden atadas directamente a detalles técnicos como el ORM, el framework HTTP, la librería de colas o una tecnología concreta.

Las tecnologías deben cumplir una función clara dentro del proyecto. No se agregan por moda ni por anticipar problemas que todavía no existen.

## Lenguaje

El lenguaje principal del proyecto es **TypeScript**.

TypeScript permite definir contratos claros entre capas, mejorar el autocompletado, reducir errores comunes y mantener mejor el código cuando el sistema crece.

Uso dentro del proyecto:

```txt
- Código fuente del backend.
- Entidades de dominio.
- Casos de uso.
- DTOs.
- Puertos.
- Repositorios.
- Mappers.
- Servicios.
- Contratos transversales como JobQueue y EventBus.
- Configuración.
- Scripts auxiliares cuando corresponda.
```

## Runtime

El backend se ejecuta sobre **Node.js**.

Node.js actúa como entorno de ejecución para NestJS, Prisma, scripts del proyecto, workers y herramientas de desarrollo.

La API y los workers se ejecutan como procesos separados sobre el mismo runtime. Comparten el código fuente, pero arrancan desde entrypoints distintos.

## Framework backend

El framework principal es **NestJS**.

NestJS aporta estructura para construir el backend mediante módulos, controladores, providers, inyección de dependencias, pipes, guards, interceptores y filtros.

Uso dentro del proyecto:

```txt
- Módulo raíz de la aplicación.
- Módulos funcionales.
- Controladores HTTP.
- Inyección de dependencias.
- Providers.
- Pipes.
- Guards.
- Interceptores.
- Filtros de excepción.
```

NestJS organiza la aplicación, pero no debe definir las reglas del negocio académico ni las reglas funcionales de acceso. Las reglas importantes deben mantenerse dentro de los módulos funcionales y no quedar mezcladas directamente con controladores o decoradores del framework.

Los workers también pueden aprovechar el contenedor de dependencias de NestJS para resolver casos de uso y servicios, pero se arrancan como procesos independientes y no exponen endpoints.

## Gestor de paquetes

El proyecto usa **pnpm** como gestor de paquetes.

Uso esperado:

```txt
- Instalación de dependencias.
- Ejecución de scripts.
- Gestión de paquetes.
- Comandos de desarrollo.
- Comandos de build, test y calidad.
```

## Base de datos

La base de datos principal es **PostgreSQL**.

PostgreSQL permite manejar relaciones, restricciones, consultas transaccionales e integridad de datos para la información académica y administrativa del sistema.

Uso dentro del proyecto:

```txt
- Personas.
- Estudiantes.
- Docentes.
- Programas académicos.
- Cursos.
- Periodos académicos.
- Ofertas de curso.
- Inscripciones.
- Usuarios.
- Roles.
- Permisos.
- Sesiones.
```

## ORM

El proyecto usa **Prisma** como ORM.

Prisma se encarga del modelado de base de datos, generación del cliente, migraciones, consultas y seeds.

Uso dentro del proyecto:

```txt
- Definición del schema.
- Generación del cliente.
- Migraciones.
- Seeds.
- Acceso técnico a persistencia.
- Repositorios y queries dentro de infraestructura.
```

Las entidades de dominio y los casos de uso no deberían depender directamente de Prisma. El acceso a datos debe quedar encapsulado en la infraestructura de cada módulo o en servicios técnicos de plataforma cuando corresponda.

## Procesamiento asíncrono

El backend separa el trabajo interactivo del trabajo intensivo o diferible.

Dos capacidades transversales sostienen ese flujo:

```txt
Job Queue
= encola unidades de trabajo confiables, con reintentos, prioridad y estado consultable

Event Bus
= publica hechos internos para que otros procesos o módulos reaccionen sin acoplamiento directo
```

Los contratos de ambas capacidades viven en `core`, porque describen mecánica general sin depender de tecnología. Las implementaciones concretas viven en `platform/queue`.

La implementación se apoya en **PgBoss**, una librería de colas que usa PostgreSQL como backend. Esta elección permite reutilizar la misma base de datos del sistema sin agregar infraestructura adicional.

PgBoss cubre las dos capacidades:

```txt
- Cola de jobs con reintentos, backoff, prioridad y estado consultable.
- Publicación y suscripción de eventos internos.
```

La elección concreta de PgBoss es un detalle reemplazable. Lo importante es que los módulos y los workers dependan solo de los contratos, no de la librería de colas.

Uso esperado:

```txt
- Encolar jobs desde casos de uso.
- Consumir jobs desde workers.
- Publicar eventos desde módulos.
- Reaccionar a eventos desde workers o suscriptores internos.
- Reintentos con backoff configurable.
- Trazabilidad mínima del estado de cada job.
- Encolado transaccional junto con la operación de negocio que lo origina.
```

El procesamiento asíncrono no reemplaza las reglas de negocio. Solo cambia dónde y cuándo se ejecutan. La decisión sigue viviendo en el caso de uso del módulo.

Una ventaja de usar PostgreSQL como backend es que un caso de uso puede encolar un job dentro de la misma transacción que persiste el cambio de negocio, reduciendo el riesgo de inconsistencias entre el dato y el trabajo diferido.

## Autenticación y tokens

El proyecto puede usar **JWT** para autenticar solicitudes protegidas.

Uso esperado:

```txt
- Access token.
- Refresh token si aplica.
- Validación técnica de requests protegidos.
- Integración con guards de NestJS.
```

La autenticación puede apoyarse en JWT, pero la validez operativa del acceso se controla mediante sesiones registradas. Esto permite cerrar sesión, revocar accesos y limitar sesiones activas por usuario.

La gestión funcional de cuentas, credenciales y sesiones pertenece al módulo `users`. El soporte técnico de JWT pertenece a `platform/security`.

## Validación y transformación

El proyecto puede usar **class-validator** y **class-transformer** para validar y transformar datos recibidos por HTTP.

Uso esperado:

```txt
- DTOs de request.
- DTOs de query.
- Validaciones de entrada.
- Conversión de tipos.
- Normalización inicial de datos recibidos.
```

Estas herramientas pertenecen principalmente a la capa de presentación. No reemplazan las reglas de negocio del dominio.

Ejemplo:

```txt
Validar que un campo sea string
→ presentación

Validar que una inscripción no supere el cupo de una oferta
→ negocio
```

## Documentación de API

El proyecto usa **Swagger / OpenAPI** mediante herramientas de NestJS.

Uso esperado:

```txt
- Documentar endpoints.
- Agrupar rutas por módulos.
- Describir DTOs de entrada y salida.
- Facilitar pruebas manuales de la API.
- Dar visibilidad al contrato HTTP.
```

Swagger documenta la API, pero no define el comportamiento del negocio.

## Manejo de archivos

El proyecto puede usar librerías para recibir y leer archivos, especialmente para procesos de importación.

Tecnologías posibles:

```txt
- Multer.
- XLSX.
```

Uso esperado:

```txt
- Recepción de archivos.
- Lectura de hojas de cálculo.
- Conversión de archivos a filas procesables.
- Soporte para importación de estudiantes.
```

La lectura técnica del archivo pertenece a infraestructura. La validación académica de los datos importados pertenece al módulo responsable del proceso.

Si el archivo es grande o el procesamiento es intensivo, el caso de uso puede encolar un job y dejar que un worker procese el archivo fuera del flujo HTTP.

## Configuración

La configuración puede gestionarse con **@nestjs/config** y variables de entorno.

Uso esperado:

```txt
- Puerto de la aplicación.
- URL de base de datos.
- Entorno de ejecución.
- Configuración JWT.
- Configuración CORS.
- Configuración de Swagger.
- Esquema de PgBoss dentro de PostgreSQL.
- Parámetros de reintentos, backoff y concurrencia de jobs y eventos.
- Parámetros técnicos de infraestructura.
```

La configuración debe estar separada de las reglas de negocio.

## Calidad de código

El proyecto usa **Biome** para formato y revisión de código.

Biome permite mantener consistencia de estilo, detectar problemas y reducir fricción en el flujo de desarrollo.

Uso esperado:

```txt
- Formateo de código.
- Revisión estática.
- Corrección automática cuando aplique.
- Estilo consistente en el proyecto.
```

Biome reemplaza la necesidad de mantener varias herramientas separadas para tareas básicas de formato y linting cuando cubre el caso del proyecto.

## Testing

El proyecto puede usar **Jest** para pruebas.

Uso esperado:

```txt
- Pruebas unitarias.
- Pruebas de casos de uso.
- Pruebas de servicios.
- Pruebas de reglas de dominio.
- Pruebas de procesadores de jobs.
- Pruebas de handlers de eventos.
- Pruebas de integración.
- Pruebas e2e cuando aplique.
```

Las pruebas más importantes deberían cubrir las reglas del proceso académico: cupos, duplicidad de inscripciones, estados válidos, periodo académico y restricciones de estudiante.

También deben cubrir reglas de acceso relevantes, como autenticación, sesiones, roles, permisos y protección de endpoints críticos.

Para el flujo asíncrono, conviene probar que los procesadores de jobs y los handlers de eventos delegan correctamente en los casos de uso de los módulos, sin duplicar reglas.

## Scripts del proyecto

Los scripts se definen en `package.json`.

Tipos de scripts esperados:

```txt
start
start:dev
build
check
format
test
test:e2e
workers:dev
workers:start
prisma:generate
prisma:migrate
prisma:seed
prisma:studio
```

Los nombres exactos pueden variar, pero deben mantener una intención clara. La API y los workers tienen comandos de arranque separados.

## Criterio para instalar librerías

El proyecto no debe evitar librerías cuando una herramienta resuelve bien un problema real.

Si existe una librería mantenida, estable y adecuada para una necesidad concreta, puede instalarse en lugar de implementar una solución manual innecesaria.

El criterio general es:

```txt
- Si el problema es común y ya existe una librería confiable, se puede instalar.
- Si la librería reduce complejidad real, se puede instalar.
- Si la librería mejora seguridad, validación, parsing o integración, se puede instalar.
- Si la librería evita código propio frágil o difícil de mantener, se puede instalar.
```

Pero también se debe evitar instalar dependencias sin necesidad.

Antes de agregar una librería conviene revisar:

```txt
- Qué problema resuelve.
- Si el problema ya existe en el proyecto.
- Si está mantenida.
- Si tiene buen soporte en TypeScript.
- Si no introduce acoplamiento innecesario.
- Si no reemplaza una regla de negocio propia del sistema.
```

Una librería puede resolver un problema técnico. No debería ocultar decisiones importantes del dominio.

Ejemplo:

```txt
Leer un archivo XLSX
→ librería adecuada

Encolar un job
→ librería adecuada, detrás de un contrato

Validar si un estudiante puede inscribirse
→ regla del sistema
```

## Relación entre tecnologías y capas

La relación general se entiende así:

```txt
NestJS
→ app, platform, presentation de módulos y workers

Prisma
→ platform/database e infrastructure de módulos

PostgreSQL
→ base de datos externa y backend de la cola de jobs

PgBoss
→ platform/queue, implementando el contrato de JobQueue y el de EventBus

JWT
→ platform/security y users

class-validator / class-transformer
→ presentation

Swagger / OpenAPI
→ platform/http y presentation

Multer / XLSX
→ platform/files

Biome
→ calidad y formato de código

Jest
→ pruebas
```

## Separación entre stack y arquitectura

El stack define herramientas. La arquitectura define cómo se organiza el código.

Ejemplo:

```txt
Prisma
= herramienta de persistencia

Repository Adapter
= forma arquitectónica de encapsular persistencia
```

Otro ejemplo:

```txt
PgBoss
= herramienta de cola y bus de eventos

JobQueue / EventBus
= contratos que los módulos y workers consumen
```

La tecnología puede cambiar, pero la intención arquitectónica debería mantenerse.

## Resumen

```txt
Lenguaje       = TypeScript
Runtime        = Node.js
Framework      = NestJS
Paquetes       = pnpm
ORM            = Prisma
Base de datos  = PostgreSQL
Cola de jobs   = PgBoss sobre PostgreSQL
Bus de eventos = PgBoss sobre PostgreSQL
Autenticación  = JWT + sesiones registradas
Validación     = class-validator / class-transformer
API Docs       = Swagger / OpenAPI
Archivos       = Multer / XLSX
Config         = @nestjs/config / variables de entorno
Calidad        = Biome
Testing        = Jest
```
