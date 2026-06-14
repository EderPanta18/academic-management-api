# Capa app

La capa `app` representa el punto de composición principal del backend.

En un proyecto NestJS, esta capa se encarga de organizar cómo se levanta la aplicación, qué módulos se registran, qué configuración global se aplica y cómo se conectan las capacidades funcionales con la infraestructura técnica.

No contiene reglas de negocio ni detalles de persistencia. Su función es componer el sistema.

## Responsabilidad principal

La responsabilidad de `app` es responder a esta pregunta:

```txt
¿Cómo se ensambla y arranca la aplicación?
```

Por eso, aquí pueden ubicarse archivos relacionados con:

```txt
- Módulo raíz de NestJS.
- Configuración general de arranque.
- Registro global de módulos.
- Registro de configuración técnica global.
- Composición entre módulos funcionales y plataforma.
```

## Ubicación

```txt
src/
└── app/
```

## Relación con `main.ts`

`main.ts` debe mantenerse como punto de entrada mínimo.

La relación esperada es:

```txt
main.ts
→ app
→ platform
→ modules
```

`main.ts` inicia el proceso. `app` define cómo se compone la aplicación. `platform` aporta infraestructura técnica. `modules` aporta negocio.

## Qué puede contener

La capa `app` puede contener:

```txt
- app.module.ts
- app.bootstrap.ts
- app.config.ts
- index.ts
```

La estructura exacta puede variar, pero la intención debe mantenerse.

## `app.module.ts`

Representa el módulo raíz de NestJS.

Debe registrar los módulos principales de la aplicación, tanto funcionales como técnicos.

Su responsabilidad es declarar composición, no implementar lógica.

```txt
app.module.ts
= módulo raíz y composición principal
```

## `app.bootstrap.ts`

Puede concentrar la configuración global aplicada al iniciar la aplicación.

Puede incluir:

```txt
- Prefijo global de API.
- Pipes globales.
- Filtros globales.
- Interceptores globales.
- Configuración Swagger.
- CORS.
- Versionado de API si aplica.
```

El objetivo es evitar que `main.ts` crezca demasiado.

## `app.config.ts`

Puede contener constantes generales de composición.

Ejemplos:

```txt
- Nombre de la aplicación.
- Versión pública de la API.
- Prefijo global.
- Ruta de documentación.
```

No debe reemplazar la configuración técnica de entorno. Esa responsabilidad pertenece a `platform/config`.

## Qué no pertenece a `app`

No deberían vivir en `app`:

```txt
- Entidades de dominio.
- Casos de uso.
- Repositorios.
- DTOs propios de módulos.
- Controladores funcionales.
- Mappers de negocio.
- Reglas de inscripción.
- Reglas de cupos.
- Configuración de base de datos concreta.
```

Si un archivo representa negocio, debe ir en `modules`.

Si representa infraestructura técnica, debe ir en `platform`.

Si representa base estable transversal, debe ir en `core`.

Si representa soporte reutilizable ligero, debe ir en `shared`.

## Dependencias permitidas

`app` puede depender de:

```txt
- modules
- platform
- core
- shared
```

Las demás capas no deberían depender de `app`.

```txt
modules → app   no
platform → app  no
core → app      no
shared → app    no
```

## Crecimiento esperado

A medida que el sistema crezca, `app` puede registrar más módulos funcionales o más infraestructura global.

Ese crecimiento no debería obligar a modificar reglas internas de los módulos. La capa `app` solo integra piezas ya definidas.

Cuando se agregue un nuevo módulo académico, el cambio esperado en `app` debería ser principalmente de registro o importación, no de lógica.

## Criterio de uso

Antes de colocar algo en `app`, conviene preguntar:

```txt
¿Este archivo existe para arrancar o componer la aplicación?
```

Si la respuesta es no, probablemente pertenece a otra capa.
