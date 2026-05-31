# Technology Stack

## Propósito

Este documento describe el stack tecnológico utilizado por el proyecto.

Su función no es explicar la arquitectura interna ni la estructura física del código fuente. Esos temas se documentan en `source-architecture.md` y `source-structure.md`. Este archivo se enfoca en las tecnologías, herramientas y responsabilidades técnicas que sostienen la aplicación.

## Alcance

El stack tecnológico define las herramientas principales usadas para construir, ejecutar, validar, documentar y mantener el backend.

Incluye:

```txt
- Lenguaje de programación
- Framework principal
- Gestor de paquetes
- ORM
- Base de datos
- Validación de datos
- Documentación de API
- Formateo y linting
- Testing
- Scripts de base de datos
- Convenciones de ejecución
```

No define reglas de arquitectura, límites entre capas ni estructura interna de módulos.

## Lenguaje principal

El proyecto utiliza **TypeScript** como lenguaje principal.

TypeScript permite trabajar con tipado estático sobre Node.js, lo que mejora la detección temprana de errores, la navegación del código, el autocompletado y la claridad de contratos entre capas.

Uso dentro del proyecto:

```txt
TypeScript
- Código fuente de la aplicación
- Definición de entidades
- Casos de uso
- DTOs
- Puertos e interfaces
- Servicios de infraestructura
- Configuración de NestJS
- Scripts auxiliares cuando corresponde
```

## Runtime

El backend se ejecuta sobre **Node.js**.

Node.js actúa como entorno de ejecución para la aplicación NestJS, los scripts de desarrollo, los comandos de Prisma y las herramientas asociadas al proyecto.

## Framework principal

El proyecto utiliza **NestJS** como framework principal del backend.

NestJS se encarga de la composición de módulos, inyección de dependencias, controladores HTTP, providers, pipes, interceptores, filtros, guards y configuración general de la aplicación.

Uso dentro del proyecto:

```txt
NestJS
- Módulo raíz de la aplicación
- Módulos funcionales
- Controladores HTTP
- Inyección de dependencias
- Providers
- Pipes
- Interceptores
- Filtros de excepción
- Guards
```

NestJS pertenece a la capa técnica de ejecución. Las reglas de negocio no dependen directamente del framework.

## Gestor de paquetes

El proyecto utiliza **pnpm** como gestor de paquetes.

`pnpm` administra dependencias, scripts, instalación local de paquetes y ejecución de comandos del proyecto.

Uso dentro del proyecto:

```txt
pnpm install
pnpm run start:dev
pnpm run build
pnpm run lint
pnpm run format
pnpm prisma generate
```

Los comandos pueden variar según los scripts definidos en `package.json`.

## ORM

El proyecto utiliza **Prisma** como ORM.

Prisma administra el modelo de datos, generación del cliente, migraciones, consultas a base de datos y scripts de seed.

Uso dentro del proyecto:

```txt
Prisma
- Definición del schema de base de datos
- Generación del cliente
- Migraciones
- Seeds
- Acceso técnico a persistencia
- Integración con repositorios y queries de infraestructura
```

La carpeta `prisma/` permanece fuera de `src/` porque contiene recursos operativos de base de datos: schema, migraciones, seeds y datos iniciales.

El servicio de conexión usado por la aplicación NestJS vive dentro de `src/platform/database/prisma/`.

## Base de datos

La base de datos relacional del proyecto es **PostgreSQL**.

PostgreSQL almacena la información persistente del sistema y es accedida desde la aplicación mediante Prisma.

Uso dentro del proyecto:

```txt
PostgreSQL
- Persistencia principal
- Relaciones entre entidades
- Consultas transaccionales
- Integridad referencial
- Soporte para migraciones mediante Prisma
```

La conexión se define mediante la variable `DATABASE_URL`.

Formato general:

```env
DATABASE_URL="postgresql://usuario:password@localhost:5432/database_name?schema=public"
```

## Adaptador de Prisma

El proyecto puede usar el adaptador de Prisma para PostgreSQL cuando la configuración del cliente lo requiere.

Tecnologías asociadas:

```txt
@prisma/adapter-pg
pg
```

El adaptador pertenece a la infraestructura técnica de base de datos y se ubica en la capa `platform`, no en los módulos de negocio.

## Validación y transformación

El proyecto utiliza herramientas de validación y transformación para controlar la entrada de datos hacia la API.

Tecnologías asociadas:

```txt
class-validator
class-transformer
```

Uso dentro del proyecto:

```txt
class-validator
- Validación de DTOs HTTP
- Reglas de entrada en presentation

class-transformer
- Transformación de datos entrantes
- Conversión de tipos en DTOs
```

Estas herramientas pertenecen a la capa de presentación. Los comandos, queries y entidades internas no dependen de validadores HTTP.

## Documentación de API

El proyecto utiliza **Swagger / OpenAPI** mediante NestJS.

Tecnologías asociadas:

```txt
@nestjs/swagger
swagger-ui-express
```

Uso dentro del proyecto:

```txt
Swagger
- Documentación de endpoints
- Descripción de DTOs
- Agrupación por tags
- Contrato visible para consumidores de la API
```

La configuración global de Swagger pertenece a `platform/http/swagger`. Los decoradores específicos de un módulo pueden vivir en la presentación del módulo o en `shared` si son reutilizables.

## Manejo de archivos

El proyecto puede procesar archivos para operaciones como importación masiva.

Tecnologías asociadas:

```txt
multer
xlsx
```

Uso dentro del proyecto:

```txt
multer
- Recepción de archivos desde HTTP

xlsx
- Lectura de archivos Excel

parser de archivos
- Interpretación técnica de formatos
- Estrategias por tipo de archivo
```

La infraestructura de archivos pertenece a `src/platform/files/`.

## Formateo de código

El proyecto utiliza **Prettier** para formateo automático de código.

Uso dentro del proyecto:

```txt
Prettier
- Formateo consistente
- Integración con editor
- Ejecución mediante scripts de package.json
```

Prettier no define reglas de arquitectura. Solo garantiza consistencia de estilo.

## Linting

El proyecto utiliza **ESLint** para análisis estático.

Uso dentro del proyecto:

```txt
ESLint
- Detección de problemas de código
- Reglas de calidad
- Integración con TypeScript
- Integración con Prettier cuando corresponde
```

ESLint ayuda a mantener consistencia, pero las reglas arquitectónicas principales se documentan en los archivos de arquitectura y estructura.

## Testing

El proyecto utiliza **Jest** como framework de pruebas.

Uso dentro del proyecto:

```txt
Jest
- Pruebas unitarias
- Pruebas de integración
- Pruebas e2e cuando corresponde
```

Las pruebas pueden organizarse dentro de `test/` o junto al código fuente, según el tipo de prueba y la convención adoptada por el proyecto.

## Configuración

La configuración de aplicación se gestiona mediante variables de entorno y módulos de configuración de NestJS.

Tecnologías asociadas:

```txt
@nestjs/config
dotenv
dotenv-cli
```

Uso dentro del proyecto:

```txt
Configuración
- Variables de entorno
- DATABASE_URL
- Puerto de aplicación
- Entorno de ejecución
- Parámetros técnicos de infraestructura
```

La configuración técnica pertenece a `src/platform/config/`.

## Scripts de desarrollo

Los scripts del proyecto se definen en `package.json`.

Tipos de scripts esperados:

```txt
start
start:dev
build
lint
format
test
prisma:generate
prisma:migrate
prisma:seed
prisma:studio
```

Los scripts actúan como interfaz de operación para desarrollo, pruebas, base de datos y ejecución de la aplicación.

## Organización técnica del stack

La relación entre tecnologías y capas se entiende así:

```txt
NestJS
→ app, platform, presentation de módulos

Prisma
→ platform/database y infrastructure/persistence de módulos

PostgreSQL
→ base de datos externa

class-validator / class-transformer
→ presentation

Swagger
→ platform/http y presentation

Multer / XLSX
→ platform/files

Prettier / ESLint
→ herramientas de calidad de código

Jest
→ testing
```

## Separación entre stack y arquitectura

El stack tecnológico define qué herramientas se usan. La arquitectura define cómo se organiza el código y cómo se protegen las dependencias.

Ejemplo:

```txt
Prisma
= tecnología de acceso a datos

Repository Adapter
= forma arquitectónica de encapsular el acceso a datos

PostgreSQL
= motor de base de datos

Infrastructure Layer
= lugar donde se adapta la base de datos al sistema
```

La tecnología puede cambiar sin que cambie necesariamente la intención arquitectónica del proyecto.

## Resumen del stack

```txt
Lenguaje       = TypeScript
Runtime        = Node.js
Framework      = NestJS
Gestor paquetes = pnpm
ORM            = Prisma
Base de datos  = PostgreSQL
Validación     = class-validator / class-transformer
Documentación  = Swagger / OpenAPI
Archivos       = Multer / XLSX
Formato        = Prettier
Linting        = ESLint
Testing        = Jest
Configuración  = @nestjs/config / dotenv
```

Este documento establece la base tecnológica del proyecto y complementa los documentos de arquitectura y estructura del código fuente.
