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
- Separar configuración de aplicación, base de datos, seguridad y CORS.
- Mantener valores de ejemplo en archivos seguros, como .env.example.
```

El archivo `.env.example` puede mostrar nombres y valores de referencia, pero no debe contener claves reales.

## Variables de aplicación

| Variable | Requerida | Ejemplo | Descripción |
| --- | --- | --- | --- |
| `NODE_ENV` | Sí | `development` | Entorno de ejecución. |
| `APP_PORT` | Sí | `3000` | Puerto HTTP del backend. |
| `APP_NAME` | No | `Academic Backend API` | Nombre visible de la aplicación. |
| `APP_VERSION` | No | `1.0.0` | Versión de referencia de la API. |

Valores esperados para `NODE_ENV`:

```txt
development
test
production
```

## Variables de base de datos

| Variable | Requerida | Ejemplo | Descripción |
| --- | --- | --- | --- |
| `DATABASE_URL` | Sí | `postgresql://user:password@localhost:5432/academic_db` | Cadena de conexión a PostgreSQL. |
| `DATABASE_LOG_QUERIES` | No | `false` | Activa o desactiva logs de consultas si el proyecto lo soporta. |

`DATABASE_URL` debe apuntar a una base de datos distinta según entorno.

Ejemplo:

```txt
development → academic_backend_dev
test        → academic_backend_test
production  → base productiva
```

## Variables de autenticación

La autenticación actual usa credenciales internas de la tabla `users`, sesiones registradas en `user_sessions` y tokens emitidos por el backend.

| Variable | Requerida | Ejemplo | Descripción |
| --- | --- | --- | --- |
| `JWT_ACCESS_SECRET` | Sí | `change-me-access-secret` | Secreto para firmar access tokens. |
| `JWT_ACCESS_EXPIRES_IN` | Sí | `15m` | Tiempo de vida del access token. |
| `JWT_REFRESH_SECRET` | Sí | `change-me-refresh-secret` | Secreto para firmar refresh tokens. |
| `JWT_REFRESH_EXPIRES_IN` | Sí | `7d` | Tiempo de vida del refresh token. |

Los secretos deben ser distintos entre `access` y `refresh`.

No se debe usar el mismo secreto en desarrollo y producción.

## Variables de sesión

| Variable | Requerida | Ejemplo | Descripción |
| --- | --- | --- | --- |
| `AUTH_SINGLE_SESSION` | No | `true` | Indica si un usuario solo puede tener una sesión activa. |
| `AUTH_REFRESH_TOKEN_ROTATION` | No | `true` | Indica si el refresh token rota al renovarse. |

Estas variables pueden omitirse si la política de sesión se define directamente en configuración interna del backend.

Criterio recomendado para la primera versión:

```txt
AUTH_SINGLE_SESSION=true
AUTH_REFRESH_TOKEN_ROTATION=true
```

## Variables de CORS

| Variable | Requerida | Ejemplo | Descripción |
| --- | --- | --- | --- |
| `CORS_ORIGIN` | Sí | `http://localhost:5173` | Origen permitido para consumir la API. |
| `CORS_CREDENTIALS` | No | `true` | Indica si se permiten credenciales en peticiones CORS. |

En desarrollo puede apuntar al frontend local.

En producción debe apuntar al dominio real de la aplicación.

## Variables de documentación API

| Variable | Requerida | Ejemplo | Descripción |
| --- | --- | --- | --- |
| `OPENAPI_ENABLED` | No | `true` | Habilita Swagger/OpenAPI. |
| `OPENAPI_PATH` | No | `/docs` | Ruta de documentación interactiva. |

En producción puede deshabilitarse si la institución no quiere exponer documentación pública.

## Variables de usuario administrador inicial

El sistema puede crear un usuario administrador inicial mediante seed.

| Variable | Requerida | Ejemplo | Descripción |
| --- | --- | --- | --- |
| `ADMIN_EMAIL` | Sí para seed inicial | `admin@example.com` | Correo del usuario administrador inicial. |
| `ADMIN_PASSWORD` | Sí para seed inicial | `change-me-admin-password` | Contraseña inicial antes de ser hasheada. |
| `ADMIN_FIRST_NAME` | No | `Admin` | Nombre de la persona asociada. |
| `ADMIN_LAST_NAME` | No | `System` | Apellidos de la persona asociada. |

`ADMIN_PASSWORD` nunca debe guardarse en texto plano dentro de la base de datos. El seed debe generar el hash antes de persistir.

## Variables de archivos

La importación de estudiantes puede requerir límites de archivo.

| Variable | Requerida | Ejemplo | Descripción |
| --- | --- | --- | --- |
| `UPLOAD_MAX_FILE_SIZE` | No | `5242880` | Tamaño máximo permitido para archivos. |
| `UPLOAD_ALLOWED_MIME_TYPES` | No | `application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,text/csv` | Tipos permitidos para importación. |

Estas variables pueden ajustarse cuando se implemente la importación de archivos.

## Variables de logging

| Variable | Requerida | Ejemplo | Descripción |
| --- | --- | --- | --- |
| `LOG_LEVEL` | No | `debug` | Nivel de logs del sistema. |

Valores comunes:

```txt
debug
info
warn
error
```

En producción conviene evitar logs excesivamente detallados.

## Ejemplo de `.env`

```env
NODE_ENV=development
APP_PORT=3000
APP_NAME="Academic Backend API"
APP_VERSION=1.0.0

DATABASE_URL="postgresql://postgres:postgres@localhost:5432/academic_backend_dev"
DATABASE_LOG_QUERIES=false

JWT_ACCESS_SECRET="change-me-access-secret"
JWT_ACCESS_EXPIRES_IN="15m"
JWT_REFRESH_SECRET="change-me-refresh-secret"
JWT_REFRESH_EXPIRES_IN="7d"

AUTH_SINGLE_SESSION=true
AUTH_REFRESH_TOKEN_ROTATION=true

CORS_ORIGIN="http://localhost:5173"
CORS_CREDENTIALS=true

OPENAPI_ENABLED=true
OPENAPI_PATH="/docs"

ADMIN_EMAIL="admin@example.com"
ADMIN_PASSWORD="change-me-admin-password"
ADMIN_FIRST_NAME="Admin"
ADMIN_LAST_NAME="System"

UPLOAD_MAX_FILE_SIZE=5242880
UPLOAD_ALLOWED_MIME_TYPES="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,text/csv"

LOG_LEVEL=debug
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

Seguridad
= JWT, sesiones y secretos

CORS
= origen permitido

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
