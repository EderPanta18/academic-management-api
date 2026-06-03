# Academic Management API

API REST para gestion academica universitaria. Centraliza profesores, estudiantes, cursos, ofertas academicas, inscripciones e importacion masiva de estudiantes.

El proyecto esta construido con NestJS, TypeScript, Prisma ORM, PostgreSQL, Swagger/OpenAPI, Docker y pnpm.

## Documentacion

La documentacion detallada vive en [`docs/`](./docs/README.md):

- Alcance y requerimientos: [`docs/overview/requirements.md`](./docs/overview/requirements.md)
- Stack tecnico: [`docs/overview/technology-stack.md`](./docs/overview/technology-stack.md)
- Arquitectura: [`docs/architecture/source-architecture.md`](./docs/architecture/source-architecture.md)
- Estructura del codigo: [`docs/architecture/source-structure.md`](./docs/architecture/source-structure.md)
- Modelo de datos: [`docs/data/data-modeling.md`](./docs/data/data-modeling.md)
- Script SQL de referencia: [`docs/data/script_db.sql`](./docs/data/script_db.sql)

## Inicio Rapido

### Local

```bash
pnpm install
cp .env.example .env
pnpm db:dev
pnpm start:dev
```

Configura `DATABASE_URL` en `.env` antes de ejecutar `pnpm db:dev`.

### Docker

```bash
cp .env.docker.example .env.docker
docker compose --env-file .env.docker up --build
```

El contenedor de la API ejecuta migraciones y seed con `pnpm db:prod` antes de iniciar en modo produccion.

## Acceso

Con la configuracion por defecto:

- API: `http://localhost:3000/api/v1`
- Swagger: `http://localhost:3000/api/v1/docs`

## Comandos

```bash
pnpm start:dev    # desarrollo
pnpm build        # compilar
pnpm start:prod   # ejecutar dist
pnpm check        # formato + lint con Biome
pnpm check:ci     # validacion CI
pnpm test         # pruebas unitarias
pnpm test:e2e     # pruebas e2e
pnpm db:dev       # migraciones dev + seed
pnpm db:prod      # migraciones deploy + seed
pnpm db:reset     # reset de base de datos
pnpm db:studio    # Prisma Studio
```

## Variables de Entorno

Usa los archivos de ejemplo como base:

- `.env.example` para ejecucion local.
- `.env.docker.example` para Docker Compose.

## Licencia

Ver [`LICENSE`](./LICENSE).
