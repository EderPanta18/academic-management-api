# App Structure

## Propósito

Este documento describe la estructura interna de la capa `app/`.

`app` representa la capa de arranque y composición principal de la aplicación NestJS. Su responsabilidad es ensamblar el sistema, conectar las capas globales, registrar los módulos funcionales y delegar la configuración de ejecución.

Esta capa no contiene reglas de negocio, entidades, repositorios, controladores funcionales ni lógica técnica concreta. Su función es organizar cómo se inicia y se compone la aplicación.

## Ubicación

La carpeta `app/` se encuentra dentro de `src/`:

```txt
src/
└── app/
```

Forma parte del código fuente de la aplicación y actúa como punto de composición entre `main.ts`, `platform` y `modules`.

## Rol dentro del sistema

La capa `app` se ubica entre el punto de entrada del proceso y el resto de capas internas.

```txt
main.ts
  ↓
app
  ↓
platform + modules
```

`main.ts` inicia el proceso. `app` define cómo se compone la aplicación. `platform` aporta infraestructura técnica. `modules` aporta capacidades funcionales.

## Estructura general

La estructura interna de `app/` se compone así:

```txt
src/app/
├── app.module.ts
├── app.bootstrap.ts
├── app.config.ts
└── index.ts
```

Cada archivo cumple una responsabilidad específica dentro del arranque y composición de la aplicación.

## `app.module.ts`

Representa el módulo raíz de NestJS.

Ubicación:

```txt
src/app/app.module.ts
```

Este archivo agrupa los módulos principales que forman parte de la aplicación. Importa la infraestructura global desde `platform` y los módulos funcionales desde `modules`.

Contenido conceptual:

```txt
app.module.ts
- Declara el módulo raíz de NestJS
- Importa módulos técnicos globales
- Importa módulos funcionales
- Define la composición principal del sistema
```

Ejemplo conceptual:

```ts
@Module({
  imports: [
    PlatformModule,
    StudentsModule,
    ProfessorsModule,
    CoursesModule,
  ],
})
export class AppModule {}
```

`app.module.ts` no implementa lógica de negocio. Su función es componer.

## `app.bootstrap.ts`

Contiene la configuración de arranque de la aplicación NestJS.

Ubicación:

```txt
src/app/app.bootstrap.ts
```

Este archivo concentra las operaciones globales que se ejecutan al iniciar la aplicación.

Contenido conceptual:

```txt
app.bootstrap.ts
- Configuración global de prefijos
- Registro global de pipes
- Registro global de interceptores
- Registro global de filtros
- Configuración global de Swagger
- Configuración de CORS
- Configuración de versión de API
```

El objetivo de este archivo es evitar que `main.ts` acumule configuración extensa.

Flujo conceptual:

```txt
main.ts
  ↓ crea aplicación NestJS
app.bootstrap.ts
  ↓ aplica configuración global
app.listen(...)
```

## `app.config.ts`

Contiene constantes o funciones de configuración general de la aplicación.

Ubicación:

```txt
src/app/app.config.ts
```

Contenido conceptual:

```txt
app.config.ts
- Prefijo global de API
- Versión global de API
- Nombre de la aplicación
- Configuración general de bootstrap
- Valores de composición no pertenecientes al dominio
```

Este archivo no reemplaza a `platform/config`. La diferencia es:

```txt
app.config.ts
= configuración de composición de la aplicación

platform/config
= configuración técnica basada en entorno, validación y proveedores
```

## `index.ts`

Actúa como punto de exportación de la capa `app`.

Ubicación:

```txt
src/app/index.ts
```

Contenido conceptual:

```txt
index.ts
- Exporta AppModule
- Exporta funciones de bootstrap
- Exporta elementos públicos de la capa app
```

Este archivo permite importar desde `@app` sin depender de rutas internas largas.

## Relación con `main.ts`

`main.ts` es el punto de entrada del proceso, pero no contiene la composición completa de la aplicación.

La relación esperada es:

```txt
src/main.ts
  ↓
src/app/app.module.ts
  ↓
src/app/app.bootstrap.ts
```

`main.ts` se mantiene mínimo:

```txt
main.ts
- Crea la instancia de NestJS
- Aplica bootstrap
- Inicia el servidor
```

`app` contiene la lógica de composición y configuración global de arranque.

## Relación con `platform`

`app` importa y registra capacidades técnicas globales desde `platform`.

```txt
app → platform
```

Ejemplos:

```txt
PlatformModule
PrismaModule
PlatformConfigModule
FileParserModule
Swagger setup
Filtros globales
Pipes globales
Interceptors globales
```

`app` puede usar `platform` para ensamblar la aplicación, pero no implementa directamente los servicios técnicos.

## Relación con `modules`

`app` importa los módulos funcionales del sistema.

```txt
app → modules
```

Ejemplos:

```txt
StudentsModule
ProfessorsModule
CoursesModule
EnrollmentsModule
```

`app` no conoce la lógica interna de esos módulos. Solo los registra dentro del sistema.

## Relación con `core` y `shared`

`app` puede usar `core` o `shared` si necesita tipos o elementos transversales durante la composición, aunque su uso debe ser limitado.

```txt
app → core
app → shared
```

La capa `app` no debe convertirse en un lugar para utilidades globales, decoradores, DTOs o excepciones. Esos elementos pertenecen a `core`, `shared` o `platform` según su naturaleza.

## Qué no pertenece a `app`

La capa `app` no contiene:

```txt
- Entidades de dominio
- Casos de uso
- Repositorios
- Adaptadores Prisma
- Controladores funcionales
- DTOs HTTP de módulos
- Mappers de negocio
- Reglas de negocio
- Lógica de persistencia
- Parsers de archivos
- Servicios técnicos concretos
```

Estos elementos pertenecen a otras capas:

```txt
Negocio funcional        → modules/
Infraestructura técnica  → platform/
Base estable             → core/
Soporte reutilizable     → shared/
```

## Dirección de dependencias

La capa `app` depende de capas internas para componer la aplicación, pero esas capas no dependen de `app`.

```txt
app → platform
app → modules
app → shared
app → core
```

Relaciones no permitidas:

```txt
modules → app
platform → app
core → app
shared → app
```

Esto mantiene a `app` como capa de composición y evita que el negocio o la infraestructura dependan del arranque de la aplicación.

## Flujo de arranque

El flujo general de arranque se entiende así:

```txt
main.ts
  ↓
NestFactory.create(AppModule)
  ↓
bootstrapApp(app)
  ↓
configuración global
  ↓
app.listen(...)
```

La capa `app` organiza este flujo sin mezclarlo con reglas funcionales ni detalles de módulos específicos.

## Resumen

La carpeta `app/` agrupa la composición y arranque principal de la aplicación.

```txt
app.module.ts    = módulo raíz de NestJS
app.bootstrap.ts = configuración global de arranque
app.config.ts    = constantes generales de composición
index.ts         = exportación pública de la capa app
```

Su responsabilidad es conectar `main.ts`, `platform` y `modules` de forma clara. Esta capa permite que el punto de entrada se mantenga mínimo y que el resto del sistema permanezca desacoplado del proceso de arranque.
