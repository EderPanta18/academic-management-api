# Academic Management API

> API REST para gestion academica universitaria, construida como caso practico backend con arquitectura modular, Prisma y PostgreSQL.

![NestJS](https://img.shields.io/badge/NestJS-11-E0234E?style=flat-square)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=flat-square)
![Prisma](https://img.shields.io/badge/Prisma-7-2D3748?style=flat-square)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-4169E1?style=flat-square)
![Docker](https://img.shields.io/badge/Docker-ready-2496ED?style=flat-square)

Centraliza profesores, estudiantes, cursos, ofertas academicas, inscripciones e importacion masiva de estudiantes desde archivos.

## Vista Rapida

- Backend: NestJS + TypeScript.
- Persistencia: Prisma ORM + PostgreSQL.
- Documentacion interactiva: Swagger/OpenAPI.
- Calidad: Biome + Jest.
- Ejecucion: local con pnpm o entorno aislado con Docker Compose.

## Primeros Pasos

### Opcion A: Docker

La forma mas directa para levantar API + PostgreSQL.

```bash
cp .env.docker.example .env.docker
docker compose --env-file .env.docker up --build
```

El contenedor de la API ejecuta migraciones y seed con `pnpm db:prod` antes de iniciar.

Para correrlo en segundo plano:

```bash
docker compose --env-file .env.docker up --build -d
```

Para ver servicios y logs:

```bash
docker compose --env-file .env.docker ps
docker compose --env-file .env.docker logs -f api
```

Para apagar Docker:

```bash
docker compose --env-file .env.docker down
```

Para apagar y borrar tambien el volumen de PostgreSQL:

```bash
docker compose --env-file .env.docker down -v
```

### Opcion B: Local

```bash
pnpm install
cp .env.example .env
pnpm db:dev
pnpm start:dev
```

Antes de `pnpm db:dev`, configura `DATABASE_URL` en `.env`.

## Acceso

Con la configuracion por defecto:

- API: `http://localhost:3000/api/v1`
- Swagger: `http://localhost:3000/api/v1/docs`
- Prisma Studio: `pnpm db:studio`

## Comandos Utiles

| Comando | Uso |
| --- | --- |
| `pnpm start:dev` | Levanta la API en desarrollo |
| `pnpm build` | Compila el proyecto |
| `pnpm start:prod` | Ejecuta la version compilada |
| `pnpm check` | Formatea y corrige con Biome |
| `pnpm check:ci` | Valida formato/lint para CI |
| `pnpm test` | Ejecuta pruebas unitarias |
| `pnpm test:e2e` | Ejecuta pruebas e2e |
| `pnpm db:dev` | Migraciones dev + seed |
| `pnpm db:prod` | Migraciones deploy + seed |
| `pnpm db:reset` | Reinicia la base de datos |
| `pnpm db:push` | Sincroniza esquema sin migracion |
| `pnpm db:studio` | Abre Prisma Studio |

## Documentacion

Los detalles viven en [`docs/`](./docs/README.md):

- [Requerimientos](./docs/overview/requirements.md)
- [Stack tecnico](./docs/overview/technology-stack.md)
- [Arquitectura](./docs/architecture/source-architecture.md)
- [Estructura del codigo](./docs/architecture/source-structure.md)
- [Modelo de datos](./docs/data/data-modeling.md)
- [Script SQL de referencia](./docs/data/script_db.sql)

## Variables de Entorno

Usa estos archivos como punto de partida:

- `.env.example` para ejecucion local.
- `.env.docker.example` para Docker Compose.

## Licencia

Ver [`LICENSE`](./LICENSE).
