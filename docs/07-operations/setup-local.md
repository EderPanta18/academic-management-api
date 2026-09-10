# Configuración local

Este documento describe el flujo general para levantar el backend académico en un entorno local.

No busca reemplazar los scripts del proyecto. Los comandos concretos pueden ajustarse según la configuración final del `package.json`, Prisma o herramientas internas. El objetivo es documentar el orden operativo esperado.

## Requisitos previos

Para trabajar localmente se requiere:

```txt
- Node.js en una versión compatible con el proyecto.
- pnpm como gestor de paquetes.
- PostgreSQL disponible localmente o en un servicio accesible.
- Git.
- Acceso al repositorio.
```

Herramientas recomendadas:

```txt
- Editor con soporte TypeScript.
- Cliente de base de datos para PostgreSQL.
- Cliente HTTP para probar endpoints si no se usa Swagger.
```

No se requiere Redis ni un servicio externo de colas. La cola de jobs y el bus de eventos usan la misma base de datos PostgreSQL a través de PgBoss.

## Flujo general

El flujo local esperado es:

```txt
1. Clonar el repositorio.
2. Instalar dependencias.
3. Crear archivo .env.
4. Crear base de datos local.
5. Ejecutar migraciones.
6. Ejecutar seeds base.
7. Levantar la API.
8. Levantar los workers.
9. Verificar health check y documentación API.
```

## Clonar repositorio

```bash
git clone <repository-url>
cd <project-folder>
```

El nombre exacto del repositorio puede variar según la organización del proyecto.

## Instalar dependencias

```bash
pnpm install
```

El proyecto debe usar una única fuente de verdad para dependencias: `package.json` y `pnpm-lock.yaml`.

No se deben mezclar gestores de paquetes en el mismo proyecto.

Evitar:

```txt
npm install
yarn install
```

si el proyecto está definido para `pnpm`.

## Configurar variables de entorno

Crear un archivo `.env` local tomando como referencia `.env.example`.

```bash
cp .env.example .env
```

Luego ajustar valores locales:

```txt
NODE_ENV
APP_PORT
DATABASE_URL
JWT_ACCESS_SECRET
JWT_REFRESH_SECRET
CORS_ORIGIN
ADMIN_EMAIL
ADMIN_PASSWORD
PGBOSS_SCHEMA
PGBOSS_JOBS_RETRY_LIMIT
PGBOSS_JOBS_RETRY_DELAY
PGBOSS_JOBS_WORKER_CONCURRENCY
```

El archivo `.env` no debe subirse al repositorio.

## Preparar base de datos local

Crear una base de datos PostgreSQL para desarrollo.

Ejemplo conceptual:

```txt
academic_backend_dev
```

Configurar `DATABASE_URL` para apuntar a esa base.

Ejemplo:

```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/academic_backend_dev"
```

El usuario y contraseña dependen de la instalación local de PostgreSQL.

PgBoss crea su propio esquema dentro de esa misma base. Por defecto usa un esquema llamado `pgboss` y lo inicializa la primera vez que arranca. No hace falta crear nada manualmente ni levantar un segundo servicio.

## Ejecutar migraciones

El proyecto debe crear la estructura de base de datos mediante migraciones.

Comando conceptual:

```bash
pnpm prisma migrate dev
```

El comando exacto puede variar si el proyecto usa scripts internos.

Ejemplos posibles:

```bash
pnpm db:migrate
pnpm prisma:migrate
pnpm migrate:dev
```

El criterio importante es que la estructura local debe quedar sincronizada con el schema definido.

Las migraciones crean las tablas del sistema. El esquema de PgBoss no forma parte de las migraciones: lo crea la propia librería cuando la cola arranca por primera vez.

## Ejecutar seeds

Después de migrar, ejecutar los datos base.

Comando conceptual:

```bash
pnpm prisma db seed
```

O mediante script del proyecto:

```bash
pnpm db:seed
```

Los seeds deben crear:

```txt
- Catálogos base.
- Permisos.
- Roles.
- Relación rol-permiso.
- Usuario administrador inicial.
```

En desarrollo también pueden crear datos académicos de ejemplo si el proyecto lo define.

## Levantar la API

Comando conceptual:

```bash
pnpm start:dev
```

O un script equivalente definido por el proyecto.

La API debe iniciar leyendo variables de entorno, conectando a PostgreSQL y exponiendo la API HTTP.

La API no procesa jobs ni eventos dentro del flujo HTTP. Solo encola trabajo a través de los contratos definidos en `core` y, cuando corresponde, publica eventos internos.

## Levantar los workers

Los workers son un proceso independiente de la API. Se arrancan por separado.

Comando conceptual:

```bash
pnpm workers:dev
```

O un script equivalente definido por el proyecto.

Los workers consumen jobs y eventos desde la misma base de datos PostgreSQL. Se conectan a la cola a través de las implementaciones de `platform/queue` y delegan la lógica en los casos de uso de los módulos.

La API y los workers pueden ejecutarse en la misma máquina en desarrollo, pero son procesos distintos. Detener uno no detiene al otro.

## Verificar ejecución

Primero validar que la API responde.

Endpoint esperado:

```txt
GET /api/v1/health
```

También puede validarse Swagger/OpenAPI si está habilitado.

Ruta esperada según configuración:

```txt
/docs
```

o la ruta definida en:

```txt
OPENAPI_PATH
```

Para validar que los workers están funcionando, puede revisarse el log de arranque del proceso de workers. Debe indicar que se registraron los procesadores de jobs y los handlers de eventos, y que la suscripción a la cola quedó activa.

## Usuario inicial

Si se ejecutaron seeds correctamente, debe existir un usuario administrador inicial.

Credenciales desde variables:

```txt
ADMIN_EMAIL
ADMIN_PASSWORD
```

El login esperado usa autenticación interna:

```txt
email + password
```

No se contempla login con Google u otros proveedores externos en la primera versión.

## Flujo de autenticación local

El flujo básico para probar seguridad es:

```txt
1. Iniciar sesión con usuario administrador.
2. Recibir access token y refresh token.
3. Usar access token para endpoints protegidos.
4. Verificar que se crea sesión en user_sessions.
5. Cerrar sesión y verificar revocación.
```

## Importación de estudiantes

Si el módulo de importación está implementado, la prueba local debe considerar el flujo completo, que puede ser asíncrono:

```txt
1. Enviar archivo al endpoint de importación.
2. Recibir jobId como respuesta 202 Accepted.
3. Consultar el estado del job en el endpoint de importaciones.
4. Verificar que el worker procesó el archivo.
5. Consultar el resumen en student_imports.
6. Consultar el detalle en student_import_rows.
```

La lectura técnica del archivo corresponde a `platform/files`. Las reglas de importación pertenecen a `students`. El procesamiento se ejecuta en un worker fuera del flujo HTTP.

Si los workers no están levantados, el job queda encolado y pendiente, pero no se procesa. Esto es útil para pruebas controladas, pero en un entorno funcional los workers deben estar activos.

## Problemas frecuentes

### No conecta a la base de datos

Revisar:

```txt
- PostgreSQL está activo.
- La base existe.
- DATABASE_URL tiene usuario, contraseña, host, puerto y nombre correctos.
- El usuario tiene permisos sobre la base.
```

### Error por variables faltantes

Revisar:

```txt
- Existe archivo .env.
- Los nombres coinciden con los esperados.
- No hay comillas mal cerradas.
- Los secretos JWT están definidos.
- Las variables de PgBoss están definidas o se aceptan sus valores por defecto.
```

### Swagger no aparece

Revisar:

```txt
OPENAPI_ENABLED=true
OPENAPI_PATH=/docs
```

También validar que la API esté ejecutándose en el puerto correcto.

### Login falla

Revisar:

```txt
- Seeds ejecutados.
- ADMIN_EMAIL correcto.
- ADMIN_PASSWORD correcto.
- Usuario activo.
- Password fue guardado como hash.
```

### Migraciones fallan

Revisar:

```txt
- Base de datos limpia o en estado esperado.
- Schema actualizado.
- Migraciones en orden.
- No hay cambios manuales incompatibles en la base.
```

### Los jobs no se procesan

Revisar:

```txt
- El proceso de workers está levantado.
- Los workers se conectan a la misma base de datos que la API.
- El esquema de PgBoss existe en la base.
- Las variables de configuración de la cola son correctas.
- No hay errores en el log del worker.
```

### Los workers no arrancan

Revisar:

```txt
- Las dependencias están instaladas.
- El archivo .env está cargado en el proceso de workers.
- El comando de arranque de workers existe en package.json.
- No hay conflicto con otro proceso escuchando en el mismo puerto si los workers exponen health.
```

## Reinicio local de base de datos

En desarrollo puede ser útil reiniciar la base.

Comando conceptual:

```bash
pnpm prisma migrate reset
```

O script equivalente:

```bash
pnpm db:reset
```

Esto puede eliminar datos locales. También elimina el esquema de PgBoss, porque vive en la misma base. Al volver a arrancar los workers, PgBoss lo recrea.

No debe ejecutarse contra producción.

## Criterios de trabajo local

Antes de abrir un pull request, conviene validar:

```txt
- La API levanta correctamente.
- Los workers levantan correctamente.
- La base local migra sin errores.
- Los seeds base se ejecutan correctamente.
- El login interno funciona.
- El health check responde.
- Los jobs encolados se procesan.
- No se subieron archivos .env.
```

Los comandos exactos pueden cambiar, pero el flujo debe mantenerse estable.

## Estructura esperada de documentación operativa

Esta carpeta se mantiene mínima para evitar documentación frágil.

```txt
07-operations/
├── variables-entorno.md
└── setup-local.md
```

Otros documentos como estrategia de pruebas, checks de calidad o setup avanzado de base de datos pueden agregarse cuando los scripts y flujos estén más estables.

## Criterio general

La configuración local debe permitir que cualquier desarrollador levante el backend de forma controlada.

```txt
Variables correctas
+ base de datos disponible
+ migraciones aplicadas
+ seeds ejecutados
+ API iniciada
+ workers iniciados
= entorno local funcional
```

El detalle de comandos puede cambiar, pero el orden operativo no debería cambiar sin una razón técnica clara.
