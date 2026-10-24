# Academic Management API

> API REST para la administración académica universitaria y la gestión de matrículas.

![NestJS](https://img.shields.io/badge/NestJS-11-E0234E?style=flat-square)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=flat-square)
![Prisma](https://img.shields.io/badge/Prisma-7-2D3748?style=flat-square)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-4169E1?style=flat-square)
![pnpm](https://img.shields.io/badge/pnpm-package%20manager-F69220?style=flat-square)

El sistema centraliza la estructura académica de una universidad —facultades, departamentos y programas académicos— y la administración de estudiantes, docentes, cursos, períodos académicos, ofertas de cursos y matrículas. Incluye importación masiva de estudiantes, consultas, reportes, control de acceso y trazabilidad de operaciones.

## Tecnologías

- **Backend:** NestJS 11, TypeScript y API REST.
- **Persistencia:** Prisma ORM 7 y PostgreSQL.
- **Procesamiento asíncrono:** PgBoss para colas y workers.
- **Documentación de API:** Swagger/OpenAPI.
- **Calidad:** Biome, Jest y Supertest.
- **Gestor de paquetes:** pnpm.
- **Ejecución:** entorno local o Docker Compose.

## Primeros pasos

### Opción A: Docker Compose

Crea el archivo de entorno a partir del ejemplo y levanta los servicios definidos en Docker Compose:

```powershell
Copy-Item .env.docker.example .env.docker
docker compose --env-file .env.docker up --build -d
```

Consulta el estado de los servicios y los registros de la API:

```powershell
docker compose --env-file .env.docker ps
docker compose --env-file .env.docker logs -f api
```

Detén los servicios sin eliminar los volúmenes:

```powershell
docker compose --env-file .env.docker down
```

Para eliminar **también los volúmenes y sus datos**, ejecuta únicamente si deseas descartarlos:

```powershell
docker compose --env-file .env.docker down -v
```

> El comportamiento de migración y carga inicial de datos depende de los comandos configurados en el servicio de API del archivo Docker Compose.

### Opción B: ejecución local

Necesitas Node.js, pnpm y una instancia accesible de PostgreSQL.

```powershell
pnpm install
Copy-Item .env.example .env
```

Configura `DATABASE_URL` y el resto de variables requeridas en `.env`. Después, prepara la base de datos e inicia la API:

```powershell
pnpm db:dev
pnpm start:dev
```

Para ejecutar el worker como proceso separado, utiliza otra terminal:

```powershell
pnpm start:worker:dev
```

## Acceso local

Con los valores de entorno indicados en el ejemplo original:

| Recurso | Dirección |
| --- | --- |
| API REST | `http://localhost:3000/api/v1` |
| Swagger UI | `http://localhost:3000/api/v1/docs` |
| Prisma Studio | `pnpm db:studio` |

Las direcciones dependen del puerto, prefijo y configuración efectiva de la aplicación.

## Comandos útiles

| Comando | Función |
| --- | --- |
| `pnpm start:dev` | Inicia la API en modo desarrollo. |
| `pnpm start:worker:dev` | Inicia el worker en modo desarrollo. |
| `pnpm build` | Compila el proyecto. |
| `pnpm start:prod` | Ejecuta la API compilada. |
| `pnpm start:worker:prod` | Ejecuta el worker compilado. |
| `pnpm check` | Aplica las comprobaciones y correcciones de Biome. |
| `pnpm check:ci` | Ejecuta las comprobaciones de Biome sin modificar archivos. |
| `pnpm test` | Ejecuta las pruebas unitarias. |
| `pnpm test:e2e` | Ejecuta las pruebas de extremo a extremo. |
| `pnpm test:cov` | Genera el reporte de cobertura. |
| `pnpm db:dev` | Aplica migraciones de desarrollo y ejecuta el seed. |
| `pnpm db:prod` | Aplica migraciones pendientes y ejecuta el seed configurado. |
| `pnpm db:reset` | **Borra y reconstruye** la base de desarrollo. |
| `pnpm db:studio` | Abre Prisma Studio. |

Los nombres anteriores corresponden a los scripts del `package.json` compartido. `db:reset` destruye los datos del esquema administrado; no debe utilizarse sobre una base que necesites conservar. Para migraciones versionadas, utiliza Prisma Migrate en lugar de `db push` como flujo habitual.

## Documentación técnica

La especificación del sistema está organizada en [`docs/`](./docs/README.md). Entre sus áreas principales se encuentran:

- [Requisitos funcionales](./docs/03-requirements/01-functional-requirements.md)
- [Modelo de dominio](./docs/05-modeling/01-domain-model.md)
- [Modelo de datos](./docs/05-modeling/02-data-model.md)
- [Reglas de negocio](./docs/05-modeling/03-business-rules.md)
- [Límites de los módulos](./docs/06-architecture/03-module-boundaries.md)
- [Diseño de persistencia](./docs/08-persistence/01-persistence-design.md)
- [Autorización y control de acceso](./docs/09-security/02-authorization-and-access-control.md)

## Variables de entorno

Los archivos de ejemplo sirven como punto de partida para cada entorno:

- `.env.example`: ejecución local.
- `.env.docker.example`: ejecución mediante Docker Compose.

Los archivos con secretos y credenciales reales no deben incorporarse al repositorio.

## Licencia

Este proyecto se distribuye bajo una [licencia personalizada de uso no comercial](./LICENSE.md). Los usos comerciales requieren autorización previa y por escrito del titular de los derechos.
