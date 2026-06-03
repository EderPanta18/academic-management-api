# Academic Management API

API REST para la gestión académica universitaria, orientada a centralizar información clave del ciclo académico en una sola plataforma backend.

## Descripción

En un entorno universitario, la operación académica involucra personas, programas, cursos, períodos, oferta lectiva e inscripciones que deben mantenerse consistentes entre sí. Este proyecto aborda ese contexto mediante una API REST que permite registrar y consultar actores académicos, administrar el catálogo de cursos y modelar el proceso real en el que un curso se ofrece dentro de un período académico, con una sección, un docente asignado y reglas de inscripción definidas.

La solución está pensada como una base mantenible para sistemas académicos institucionales. Por eso el diseño no se limita al registro simple de entidades, sino que organiza la lógica del dominio en módulos independientes, incorpora validaciones de negocio, soporta importación masiva de estudiantes y expone documentación OpenAPI para facilitar consumo, pruebas e integración.

## Alcance funcional

El sistema cubre los procesos académicos principales de esta iteración:

- Gestión de profesores.
- Gestión de estudiantes.
- Gestión del catálogo de cursos.
- Gestión de ofertas de curso por período académico.
- Gestión de inscripciones.
- Importación masiva de estudiantes desde archivos `.xlsx` o `.csv`.
- Listados paginados y documentación interactiva de la API.

## Documentación adicional

La carpeta `docs/` reúne la documentación de apoyo del proyecto:

- `docs/01-requirements.md`: alcance, reglas de negocio y requerimientos funcionales y no funcionales.
- `docs/02-system-architecture.md`: arquitectura, organización por capas, módulos y flujo general del sistema.
- `docs/03-data-model.md`: entidades, relaciones, restricciones y decisiones de modelado.

## Stack tecnológico

Tecnologías principales usadas para desarrollar el proyecto:

- NestJS
- TypeScript
- Prisma ORM
- MySQL
- Swagger / OpenAPI
- Docker
- pnpm

## Instalación

### 1. Clonar el proyecto

```bash
git clone <URL_DEL_REPOSITORIO>
cd academic-management-api
```

### 2. Elegir una forma de ejecución

A partir de este punto puedes continuar con una de estas dos opciones:

- Ejecución manual.
- Ejecución con Docker.

## Ejecución manual

### Requisitos previos

Antes de iniciar, asegúrate de contar con lo siguiente:

- Node.js 20 o superior.
- pnpm.
- Acceso a una instancia MySQL mediante una URL de conexión válida.

### Guía de uso

La ejecución manual está pensada para quien desea instalar, configurar y ejecutar la API directamente desde un entorno local.

Esta opción permite comprobar que la aplicación compila correctamente, que Prisma puede conectarse a la base de datos y que el backend inicia de forma adecuada.

### Pasos

1. Instala las dependencias:

```bash
pnpm install
```

2. Crea el archivo de entorno a partir del ejemplo:

```bash
cp .env.example .env
```

3. Abre `.env` y reemplaza los valores de ejemplo por los reales de tu entorno.

4. Genera el cliente de Prisma:

```bash
pnpm prisma:generate
```

5. Ejecuta las migraciones de base de datos:

```bash
pnpm prisma:migrate:dev
```

6. Ejecuta las semillas iniciales si deseas cargar datos base:

```bash
pnpm prisma:seed
```

7. Inicia la aplicación localmente:

```bash
pnpm start:dev
```

## Ejecución con Docker

### Requisitos previos

Antes de usar esta opción, asegúrate de contar con:

- Docker.
- Docker Compose.

### Guía de uso

La ejecución con Docker está pensada para facilitar la evaluación del caso en un entorno aislado y reproducible, evitando configuraciones locales adicionales más allá de Docker y Docker Compose.

Esta opción permite levantar la API junto con la base de datos de forma controlada. Al iniciar el contenedor de la API, las migraciones pendientes se aplican automáticamente y luego la aplicación arranca en modo producción.

### Archivos involucrados

La ejecución con Docker utiliza estos archivos del proyecto:

- `Dockerfile`: define la imagen de la API.
- `docker-compose.yml`: orquesta la base de datos y la API.
- `.env.docker`: centraliza las variables de entorno usadas por Docker Compose.

### Pasos

1. Crea el archivo de entorno para Docker a partir del ejemplo:

```bash
cp .env.docker.example .env.docker
```

2. Abre `.env.docker` y reemplaza los valores de ejemplo por los reales de tu entorno.

3. Construye y levanta los servicios:

```bash
docker compose --env-file .env.docker up --build -d
```

4. Verifica el estado del entorno:

```bash
docker compose --env-file .env.docker ps
```

5. Consulta los logs de la API si deseas revisar el proceso de arranque:

```bash
docker compose --env-file .env.docker logs -f api
```

6. Ejecuta las semillas solo si deseas cargar datos iniciales:

```bash
docker compose --env-file .env.docker exec api pnpm prisma seed
```

### Detener el entorno

Para detener los contenedores:

```bash
docker compose --env-file .env.docker down
```

Para detenerlos y eliminar también los volúmenes asociados:

```bash
docker compose --env-file .env.docker down -v
```

## Acceso

Con la aplicación en ejecución, la API y la documentación Swagger estarán disponibles sobre el host y puerto configurados en tu entorno. La documentación interactiva se expone en la ruta `/api/v1/docs`.

## Endpoints principales

La referencia completa de contratos, parámetros, respuestas y errores está disponible en Swagger. A continuación se listan los endpoints principales del proyecto.

| Módulo           | Endpoint                                       | Descripción                                         |
| ---------------- | ---------------------------------------------- | --------------------------------------------------- |
| Profesores       | `POST /api/v1/professors`                      | Registrar un profesor                               |
| Profesores       | `GET /api/v1/professors`                       | Listar profesores                                   |
| Profesores       | `GET /api/v1/professors/:id`                   | Obtener un profesor por id                          |
| Estudiantes      | `POST /api/v1/students`                        | Registrar un estudiante                             |
| Estudiantes      | `GET /api/v1/students`                         | Listar estudiantes                                  |
| Estudiantes      | `GET /api/v1/students/:id`                     | Obtener un estudiante por id                        |
| Estudiantes      | `POST /api/v1/students/import`                 | Importar estudiantes desde archivo `.xlsx` o `.csv` |
| Cursos           | `POST /api/v1/courses`                         | Registrar un curso                                  |
| Cursos           | `GET /api/v1/courses`                          | Listar cursos                                       |
| Cursos           | `GET /api/v1/courses/:id`                      | Obtener un curso por id                             |
| Ofertas de curso | `POST /api/v1/course-offerings`                | Crear una oferta de curso                           |
| Ofertas de curso | `GET /api/v1/course-offerings`                 | Listar ofertas de curso                             |
| Ofertas de curso | `GET /api/v1/course-offerings/:id`             | Obtener una oferta de curso por id                  |
| Ofertas de curso | `PATCH /api/v1/course-offerings/:id/professor` | Asignar profesor a una oferta                       |
| Ofertas de curso | `PATCH /api/v1/course-offerings/:id/activate`  | Activar una oferta de curso                         |
| Inscripciones    | `POST /api/v1/enrollments`                     | Inscribir un estudiante en una oferta               |
| Inscripciones    | `GET /api/v1/enrollments`                      | Listar inscripciones                                |
| Inscripciones    | `GET /api/v1/enrollments/:id`                  | Obtener una inscripción por id                      |

## Arquitectura

El proyecto adopta una organización modular basada en Clean Architecture y Ports & Adapters. La lógica de negocio permanece desacoplada del framework HTTP, del ORM y del motor de base de datos, lo que facilita mantenimiento, evolución y reemplazo de infraestructura sin impactar el dominio.

La estructura principal se distribuye en zonas transversales y módulos de negocio. Dentro de `src/` se distinguen `app` para arranque y configuración global, `core` para componentes transversales del dominio y la aplicación, `shared` para infraestructura reutilizable y `modules` para los contextos funcionales del sistema.

## Decisiones técnicas

- La API fue desarrollada con NestJS y TypeScript.
- La persistencia se implementó con Prisma ORM.
- La base de datos utilizada es MySQL.
- La documentación OpenAPI se expone mediante Swagger.
- El proyecto incluye semillas para inicializar datos base.
- La importación masiva de estudiantes soporta archivos `.xlsx` y `.csv`.
- Las respuestas mantienen un formato estructurado y los listados soportan paginación.

## Observaciones

El caso práctico original plantea el uso de TypeORM, pero esta implementación utiliza Prisma como decisión técnica del proyecto.

Para una explicación más detallada del alcance funcional, la arquitectura y el modelo de datos, revisa los documentos disponibles en la carpeta `docs/`.
