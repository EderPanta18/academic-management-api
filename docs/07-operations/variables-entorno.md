# Variables de entorno

Este documento describe las variables de entorno necesarias para ejecutar el backend académico.

Las variables de entorno permiten separar la configuración del código fuente. No deben escribirse secretos directamente en el repositorio.

## Propósito

La configuración del sistema debe permitir ajustar el comportamiento según el entorno.

```txt
development
= entorno local de desarrollo

test
= entorno para pruebas automatizadas

production
= entorno productivo
```

Las variables deben definirse en un archivo `.env` local o en el sistema de configuración usado por el entorno de despliegue.

## Criterios generales

Las variables deben cumplir estas reglas:

```txt
- No guardar secretos reales en el repositorio.
- No subir archivos .env con credenciales.
- Usar nombres claros y consistentes.
- Separar configuración de aplicación, base de datos, seguridad, cola y CORS.
- Mantener valores de ejemplo en archivos seguros, como .env.example.
```

El archivo `.env.example` puede mostrar nombres y valores de referencia, pero no debe contener claves reales.

## Variables de aplicación

| Variable          | Requerida | Ejemplo                          | Descripción                           |
| ----------------- | --------- | -------------------------------- | ------------------------------------- |
| `NODE_ENV`        | Sí        | `development`                    | Entorno de ejecución.                 |
| `APP_PORT`        | Sí        | `3000`                           | Puerto HTTP de la API.                |
| `APP_NAME`        | No        | `Academic Backend API`           | Nombre visible de la aplicación.      |
| `APP_DESCRIPTION` | No        | `API for managing academic data` | Descripción visible de la aplicación. |
| `APP_VERSION`     | No        | `1.0.0`                          | Versión de referencia de la API.      |
| `API_PREFIX`      | Sí        | `/api/v1`                        | Prefijo de la ruta base de la API.    |

Valores esperados para `NODE_ENV`:

```txt
development
test
production
```

## Variables de logging

| Variable    | Requerida | Ejemplo | Descripción                |
| ----------- | --------- | ------- | -------------------------- |
| `LOG_LEVEL` | No        | `debug` | Nivel de logs del sistema. |

Valores comunes:

```txt
debug
info
warn
error
```

## Variables de base de datos

| Variable               | Requerida | Ejemplo                                                               | Descripción                                                     |
| ---------------------- | --------- | --------------------------------------------------------------------- | --------------------------------------------------------------- |
| `DATABASE_URL`         | Sí        | `postgresql://user:password@localhost:5432/academic_db?schema=public` | Cadena de conexión a PostgreSQL.                                |
| `DIRECT_DATABASE_URL`  | No        | `postgresql://user:password@localhost:5432/academic_db?schema=public` | Cadena directa para migraciones si se usa un pooler intermedio. |
| `DATABASE_LOG_QUERIES` | No        | `false`                                                               | Activa o desactiva logs de consultas si el proyecto lo soporta. |

`DATABASE_URL` debe apuntar a una base de datos distinta según entorno.

Ejemplo:

```txt
development → academic_backend_dev
test        → academic_backend_test
production  → base productiva
```

`DIRECT_DATABASE_URL` solo se usa si hay un pooler intermedio entre la aplicación y PostgreSQL. Si no hay pooler, puede omitirse o repetir el valor de `DATABASE_URL`.

PgBoss crea su propio esquema dentro de esta misma base de datos. No requiere una conexión distinta ni un servicio adicional.

## Variables de cola de jobs y bus de eventos

La cola de jobs y el bus de eventos se implementan con **PgBoss** sobre la misma base de datos PostgreSQL. No se requiere Redis ni un servicio externo.

Las variables usan el prefijo `QUEUE_*` porque describen la capacidad de cola en general, no una librería concreta. Si más adelante se cambia la implementación, los nombres de las variables no cambian.

Los workers se ejecutan como proceso independiente de la API, comparten el mismo archivo `.env` y se arrancan con un entrypoint propio. No requieren una variable que indique su modo: cada proceso sabe qué es porque se arranca desde un entrypoint distinto.

### Configuración general

| Variable                   | Requerida | Ejemplo  | Descripción                                                    |
| -------------------------- | --------- | -------- | -------------------------------------------------------------- |
| `QUEUE_SCHEMA`             | No        | `pgboss` | Esquema de PostgreSQL donde PgBoss guarda sus tablas internas. |
| `QUEUE_WORKER_CONCURRENCY` | No        | `5`      | Cantidad de jobs que un worker puede procesar en paralelo.     |

### Configuración de jobs

| Variable                                 | Requerida | Ejemplo | Descripción                                                          |
| ---------------------------------------- | --------- | ------- | -------------------------------------------------------------------- |
| `QUEUE_JOB_RETRY_LIMIT`                  | No        | `3`     | Número máximo de reintentos por job.                                 |
| `QUEUE_JOB_RETRY_DELAY_MS`               | No        | `1000`  | Delay base entre reintentos, en milisegundos.                        |
| `QUEUE_JOB_RETRY_BACKOFF`                | No        | `true`  | Activa backoff exponencial entre reintentos.                         |
| `QUEUE_JOB_EXPIRE_IN_MINUTES`            | No        | `15`    | Tiempo máximo de ejecución de un job antes de considerarlo expirado. |
| `QUEUE_JOB_ARCHIVE_COMPLETED_AFTER_DAYS` | No        | `7`     | Días que se conservan los jobs completados antes de archivarse.      |
| `QUEUE_JOB_ARCHIVE_FAILED_AFTER_DAYS`    | No        | `30`    | Días que se conservan los jobs fallidos antes de archivarse.         |

### Configuración de eventos

| Variable                  | Requerida | Ejemplo | Descripción                                                   |
| ------------------------- | --------- | ------- | ------------------------------------------------------------- |
| `QUEUE_EVENT_RETRY_LIMIT` | No        | `3`     | Número máximo de reintentos por evento.                       |
| `QUEUE_EVENT_CONCURRENCY` | No        | `5`     | Cantidad de eventos que un worker puede procesar en paralelo. |

Los valores por defecto de PgBoss son razonables para desarrollo. En producción conviene ajustarlos según carga, latencia y política de retención.

## Variables de autenticación

La autenticación usa credenciales internas de la tabla `users`, sesiones registradas en `user_sessions` y tokens emitidos por el backend.

| Variable                 | Requerida | Ejemplo                    | Descripción                         |
| ------------------------ | --------- | -------------------------- | ----------------------------------- |
| `JWT_ACCESS_NAME`        | Sí        | `accessJwt`                | Nombre del token access.            |
| `JWT_ACCESS_SECRET`      | Sí        | `change-me-access-secret`  | Secreto para firmar access tokens.  |
| `JWT_ACCESS_EXPIRES_IN`  | Sí        | `15m`                      | Tiempo de vida del access token.    |
| `JWT_REFRESH_NAME`       | Sí        | `refreshJwt`               | Nombre del token refresh.           |
| `JWT_REFRESH_SECRET`     | Sí        | `change-me-refresh-secret` | Secreto para firmar refresh tokens. |
| `JWT_REFRESH_EXPIRES_IN` | Sí        | `7d`                       | Tiempo de vida del refresh token.   |

Los secretos deben ser distintos entre `access` y `refresh`.

No se debe usar el mismo secreto en desarrollo y producción.

## Variables de sesión

| Variable                      | Requerida | Ejemplo | Descripción                                              |
| ----------------------------- | --------- | ------- | -------------------------------------------------------- |
| `AUTH_SINGLE_SESSION`         | No        | `true`  | Indica si un usuario solo puede tener una sesión activa. |
| `AUTH_REFRESH_TOKEN_ROTATION` | No        | `true`  | Indica si el refresh token rota al renovarse.            |

Estas variables pueden omitirse si la política de sesión se define directamente en configuración interna del backend.

Criterio recomendado para la primera versión:

```txt
AUTH_SINGLE_SESSION=true
AUTH_REFRESH_TOKEN_ROTATION=true
```

## Variables de CORS

| Variable           | Requerida | Ejemplo                                       | Descripción                                                   |
| ------------------ | --------- | --------------------------------------------- | ------------------------------------------------------------- |
| `CORS_ORIGINS`     | Sí        | `http://localhost:5173,http://127.0.0.1:5173` | Orígenes permitidos para consumir la API, separados por coma. |
| `CORS_CREDENTIALS` | No        | `true`                                        | Indica si se permiten credenciales en peticiones CORS.        |

En desarrollo puede apuntar al frontend local.

En producción debe apuntar al dominio real de la aplicación.

## Variables de documentación API

| Variable          | Requerida | Ejemplo | Descripción                        |
| ----------------- | --------- | ------- | ---------------------------------- |
| `OPENAPI_ENABLED` | No        | `true`  | Habilita Swagger/OpenAPI.          |
| `OPENAPI_PATH`    | No        | `/docs` | Ruta de documentación interactiva. |

En producción puede deshabilitarse si la institución no quiere exponer documentación pública.

## Variables de usuario administrador inicial

El sistema puede crear un usuario administrador inicial mediante seed.

| Variable           | Requerida            | Ejemplo                    | Descripción                               |
| ------------------ | -------------------- | -------------------------- | ----------------------------------------- |
| `ADMIN_EMAIL`      | Sí para seed inicial | `admin@example.com`        | Correo del usuario administrador inicial. |
| `ADMIN_PASSWORD`   | Sí para seed inicial | `change-me-admin-password` | Contraseña inicial antes de ser hasheada. |
| `ADMIN_FIRST_NAME` | No                   | `Admin`                    | Nombre de la persona asociada.            |
| `ADMIN_LAST_NAME`  | No                   | `System`                   | Apellidos de la persona asociada.         |

`ADMIN_PASSWORD` nunca debe guardarse en texto plano dentro de la base de datos. El seed debe generar el hash antes de persistir.

## Variables de archivos

La importación de estudiantes puede requerir límites de archivo.

| Variable                    | Requerida | Ejemplo                                                                      | Descripción                            |
| --------------------------- | --------- | ---------------------------------------------------------------------------- | -------------------------------------- |
| `UPLOAD_MAX_FILE_SIZE`      | No        | `5242880`                                                                    | Tamaño máximo permitido para archivos. |
| `UPLOAD_ALLOWED_MIME_TYPES` | No        | `application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,text/csv` | Tipos permitidos para importación.     |

Estas variables pueden ajustarse cuando se implemente la importación de archivos.

En producción conviene evitar logs excesivamente detallados.

## Ejemplo de `.env`

```env
NODE_ENV=development
APP_PORT=3000
APP_NAME="Academic Backend API"
APP_DESCRIPTION="API for managing academic data"
APP_VERSION=1.0.0
API_PREFIX="/api/v1"

LOG_LEVEL=debug

DATABASE_URL="postgresql://postgres:postgres@localhost:5432/academic_backend_dev?schema=public"
DIRECT_DATABASE_URL="postgresql://postgres:postgres@localhost:5432/academic_backend_dev?schema=public"
DATABASE_LOG_QUERIES=false

QUEUE_SCHEMA="pgboss"
QUEUE_WORKER_CONCURRENCY=5

QUEUE_JOB_RETRY_LIMIT=3
QUEUE_JOB_RETRY_DELAY_MS=1000
QUEUE_JOB_RETRY_BACKOFF=true
QUEUE_JOB_EXPIRE_IN_MINUTES=15
QUEUE_JOB_ARCHIVE_COMPLETED_AFTER_DAYS=7
QUEUE_JOB_ARCHIVE_FAILED_AFTER_DAYS=30

QUEUE_EVENT_RETRY_LIMIT=3
QUEUE_EVENT_CONCURRENCY=5

JWT_ACCESS_NAME="accessJwt"
JWT_ACCESS_SECRET="change-me-access-secret"
JWT_ACCESS_EXPIRES_IN="15m"
JWT_REFRESH_NAME="refreshJwt"
JWT_REFRESH_SECRET="change-me-refresh-secret"
JWT_REFRESH_EXPIRES_IN="7d"

AUTH_SINGLE_SESSION=true
AUTH_REFRESH_TOKEN_ROTATION=true

CORS_ORIGINS="http://localhost:5173,http://127.0.0.1:5173"
CORS_CREDENTIALS=true

OPENAPI_ENABLED=true
OPENAPI_PATH="/docs"

ADMIN_EMAIL="admin@example.com"
ADMIN_PASSWORD="change-me-admin-password"
ADMIN_FIRST_NAME="Admin"
ADMIN_LAST_NAME="System"

UPLOAD_MAX_FILE_SIZE=5242880
UPLOAD_ALLOWED_MIME_TYPES="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,text/csv"
```

## Variables que no deben subirse

No deben versionarse archivos con valores reales:

```txt
.env
.env.local
.env.production
.env.*.local
```

Sí puede versionarse:

```txt
.env.example
```

si contiene valores ficticios y seguros.

## Criterio general

Las variables de entorno deben permitir ejecutar el sistema sin modificar código fuente.

```txt
Aplicación
= puerto, entorno y metadatos

Base de datos
= conexión PostgreSQL

Cola de jobs y bus de eventos
= configuración de PgBoss sobre PostgreSQL

Seguridad
= JWT, sesiones y secretos

CORS
= orígenes permitidos

OpenAPI
= documentación interactiva

Seeds
= usuario administrador inicial

Archivos
= límites de importación

Logs
= nivel de salida
```

Si una configuración empieza a representar una regla de negocio administrable, debe evaluarse si corresponde mantenerla como variable o persistirla en base de datos.
