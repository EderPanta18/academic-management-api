# Plan de implementación

Este documento define un orden recomendado para construir el backend académico.

El plan no representa un cronograma cerrado ni una lista de fechas. Su propósito es ordenar el desarrollo por dependencias funcionales y técnicas, evitando implementar módulos que todavía no tienen bases suficientes.

## Criterio general

El sistema debe construirse desde las capacidades base hacia los procesos académicos principales.

```txt
Base técnica
→ Base de datos
→ Procesamiento asíncrono
→ Seguridad
→ Datos maestros
→ Estructura académica
→ Ofertas
→ Inscripciones
→ Importación
→ Reportes
→ Auditoría consultable
```

El orden puede ajustarse si el proyecto necesita priorizar una entrega específica, pero las dependencias entre módulos deben respetarse.

## Principios de implementación

La implementación debe seguir estos criterios:

```txt
- Construir primero las bases compartidas.
- Evitar módulos genéricos antes de tener necesidad real.
- Mantener límites claros entre módulos.
- No exponer entidades internas directamente por HTTP.
- Validar reglas de negocio en application/domain, no en controladores.
- Persistir información operativa importante.
- Mantener seguridad desde el inicio, no al final.
- Diferir trabajo intensivo fuera del flujo HTTP desde etapas tempranas.
```

## Fase 1: Base del proyecto

Objetivo: dejar el backend ejecutable y con estructura mínima estable.

Incluye:

```txt
- Configuración del proyecto NestJS.
- Estructura base de carpetas.
- Configuración TypeScript.
- Configuración de Biome.
- Configuración de Prisma.
- Conexión a PostgreSQL.
- Variables de entorno.
- Health check.
- Swagger/OpenAPI base.
- Formato de respuesta base.
- Manejo global de errores.
- Estructura inicial de src/workers.
```

Resultado esperado:

```txt
El backend levanta localmente, responde health check y tiene una base técnica consistente.
```

## Fase 2: Base de datos y modelo inicial

Objetivo: preparar el esquema inicial de datos.

Incluye:

```txt
- Enums base.
- Tablas principales.
- Relaciones.
- Restricciones.
- Índices.
- Migraciones.
- Seeds mínimos.
```

Tablas iniciales relevantes:

```txt
document_types
persons
users
roles
permissions
user_roles
role_permissions
user_sessions
```

Resultado esperado:

```txt
La base de datos puede migrarse y poblarse con datos mínimos para operar seguridad y usuarios.
```

## Fase 3: Procesamiento asíncrono base

Objetivo: dejar operativa la cola de jobs y el bus de eventos sobre PostgreSQL.

Incluye:

```txt
- Contratos JobQueue y EventBus en core.
- Implementación de PgBoss en platform/queue.
- Configuración del esquema de PgBoss en PostgreSQL.
- Variables de entorno de la cola.
- Entrypoint de workers en src/workers.
- Registro de procesadores y handlers.
- Conexión de workers a la misma base de datos.
```

Resultado esperado:

```txt
La API puede encolar jobs y publicar eventos. Los workers arrancan como proceso independiente, consumen jobs y eventos, y delegan la lógica en los módulos.
```

No incluye todavía:

```txt
- Colas separadas por tipo de job.
- Priorización dinámica.
- Jobs programados con expresión cron.
- Dead letter queue.
- Panel de monitoreo.
```

## Fase 4: Seguridad base

Objetivo: implementar autenticación y autorización interna.

Incluye:

```txt
- Login con email y contraseña.
- Hash de contraseña.
- Access token.
- Refresh token.
- Sesiones registradas.
- Logout.
- Refresh.
- Guards de autenticación.
- Guards de permisos.
- Decorador de permisos requeridos.
```

Módulos involucrados:

```txt
users
authorization
platform/security
```

Resultado esperado:

```txt
Un usuario puede iniciar sesión, obtener tokens, operar con sesión activa y ser bloqueado por falta de permisos.
```

No incluye todavía:

```txt
- Login con Google.
- Login con Microsoft.
- Recuperación avanzada de contraseña.
- Autenticación multifactor.
```

## Fase 5: Usuarios y autorización

Objetivo: administrar el acceso funcional del sistema.

Incluye:

```txt
- Crear usuarios.
- Consultar usuarios.
- Activar o dar de baja usuarios.
- Asignar roles a usuarios.
- Consultar roles.
- Crear o administrar roles si aplica.
- Consultar permisos.
- Asignar permisos a roles.
```

Criterio:

```txt
Los endpoints se protegen principalmente con permisos, no con roles directos.
```

Ejemplo:

```txt
students.create
enrollments.create
roles.assign-permissions
```

Resultado esperado:

```txt
El sistema puede controlar qué acciones puede realizar cada usuario.
```

## Fase 6: Catálogos base

Objetivo: tener datos de referencia necesarios para registrar información académica.

Incluye:

```txt
document_types
course_categories
```

Criterio:

```txt
Los catálogos tienen tabla porque pueden variar o administrarse.
Los estados pequeños y estables se mantienen como enums.

document_types vive en identity.
course_categories vive en courses.
```

Resultado esperado:

```txt
El sistema cuenta con valores base para registrar personas y clasificar cursos.
```

## Fase 7: Identidad personal

Objetivo: registrar identidad personal común.

Incluye:

```txt
- Crear persona.
- Consultar persona.
- Actualizar persona.
- Validar documento único.
- Validar tipo de documento.
- Dar de baja persona cuando corresponda.
```

Módulo:

```txt
identity
```

Resultado esperado:

```txt
El sistema puede registrar datos personales reutilizables por estudiantes, docentes y usuarios.
```

## Fase 8: Programas académicos

Objetivo: registrar estructura académica inicial.

Incluye:

```txt
- Crear programa académico.
- Consultar programas.
- Actualizar programa.
- Dar de baja programa cuando corresponda.
- Validar código único.
```

Módulo:

```txt
academic-programs
```

Resultado esperado:

```txt
El sistema puede asociar estudiantes y cursos a un programa académico.
```

## Fase 9: Estudiantes

Objetivo: registrar y administrar estudiantes.

Incluye:

```txt
- Crear estudiante.
- Consultar estudiantes.
- Actualizar estudiante.
- Cambiar estado académico.
- Dar de baja estudiante cuando corresponda.
- Vincular estudiante con persona.
- Vincular estudiante con programa académico.
- Validar código institucional único.
- Validar documento único mediante persona.
```

Módulo:

```txt
students
```

Resultado esperado:

```txt
El sistema puede registrar estudiantes válidos para procesos académicos posteriores.
```

## Fase 10: Docentes

Objetivo: registrar docentes que pueden ser asignados a ofertas de curso.

Incluye:

```txt
- Crear docente.
- Consultar docentes.
- Actualizar docente.
- Cambiar estado operativo.
- Dar de baja docente cuando corresponda.
- Vincular docente con persona.
- Validar código institucional único.
```

Módulo:

```txt
professors
```

Resultado esperado:

```txt
El sistema puede asociar docentes a ofertas de curso.
```

## Fase 11: Cursos

Objetivo: registrar cursos del catálogo académico.

Incluye:

```txt
- Crear curso.
- Consultar cursos.
- Actualizar curso.
- Dar de baja curso cuando corresponda.
- Asociar curso a programa académico.
- Asociar curso a categoría.
- Validar créditos.
- Validar código único dentro del programa.
```

Módulo:

```txt
courses
```

Resultado esperado:

```txt
El sistema puede crear ofertas a partir de cursos existentes.
```

## Fase 12: Periodos académicos

Objetivo: definir los periodos donde se dictan ofertas e inscripciones.

Incluye:

```txt
- Crear periodo académico.
- Consultar periodos.
- Actualizar periodo.
- Abrir periodo.
- Cerrar periodo.
- Cancelar periodo.
- Validar rangos de fechas.
- Validar ventana de inscripción.
```

Módulo:

```txt
academic-periods
```

Resultado esperado:

```txt
El sistema puede controlar cuándo se pueden abrir ofertas e inscribir estudiantes.
```

## Fase 13: Ofertas de curso

Objetivo: publicar cursos disponibles en un periodo académico.

Incluye:

```txt
- Crear oferta de curso.
- Consultar ofertas.
- Actualizar oferta.
- Asignar docente.
- Definir sección.
- Definir cupo.
- Abrir oferta.
- Cerrar oferta.
- Reabrir oferta.
- Cancelar oferta.
- Validar curso vigente.
- Validar periodo válido.
- Validar docente activo si existe.
```

Módulo:

```txt
course-offerings
```

Resultado esperado:

```txt
El sistema puede ofrecer cursos concretos para inscripción.
```

## Fase 14: Inscripciones

Objetivo: registrar estudiantes en ofertas de curso.

Incluye:

```txt
- Crear inscripción.
- Consultar inscripciones.
- Cancelar inscripción.
- Cambiar estado.
- Registrar historial de cambios.
- Validar estudiante habilitado.
- Validar oferta abierta.
- Validar periodo vigente.
- Validar cupo disponible.
- Evitar inscripción duplicada.
- Registrar usuario responsable.
```

Módulo:

```txt
enrollments
```

Resultado esperado:

```txt
El sistema puede ejecutar el flujo académico principal de inscripción con reglas de negocio.
```

## Fase 15: Importación de estudiantes

Objetivo: permitir carga masiva de estudiantes con procesamiento asíncrono.

Incluye:

```txt
- Endpoint que recibe archivo y responde 202 Accepted con jobId.
- Lectura técnica del archivo desde platform/files.
- Encolado de job a través del contrato JobQueue.
- Worker que consume el job.
- Validación de estructura.
- Validación de filas.
- Detección de duplicados.
- Creación de estudiantes válidos.
- Persistencia de resumen de importación.
- Persistencia de detalle por fila.
- Endpoint de consulta de estado del job.
- Consulta de historial de importaciones.
- Consulta de errores por fila.
```

Módulo dueño:

```txt
students
```

Soporte técnico:

```txt
platform/files
platform/queue
workers
```

Tablas:

```txt
student_imports
student_import_rows
```

Resultado esperado:

```txt
El sistema puede importar estudiantes de forma asíncrona, conservar evidencia detallada del resultado y permitir que el cliente consulte el estado del job.
```

No crear todavía:

```txt
modules/imports
```

Ese módulo solo tendría sentido si varias entidades requieren importaciones comunes.

## Fase 16: Reportes básicos

Objetivo: entregar consultas académicas útiles sin convertir reportes en módulo de escritura.

Incluye:

```txt
- Estudiantes por programa.
- Inscripciones por periodo.
- Cupos por oferta.
- Cursos ofertados.
- Inscripciones canceladas.
- Resultados de importaciones.
```

Módulo:

```txt
reports
```

Criterio:

```txt
reports consulta información; no modifica datos académicos.
```

Resultado esperado:

```txt
El sistema puede mostrar información consolidada para seguimiento académico.
```

## Fase 17: Auditoría

Objetivo: registrar y consultar acciones relevantes del sistema.

Incluye desde etapas tempranas:

```txt
- Login.
- Logout.
- Revocación de sesión.
- Creación o cambio de usuarios.
- Asignación de roles.
- Asignación de permisos.
- Importación de estudiantes.
- Creación o cambio de ofertas.
- Creación o cancelación de inscripciones.
```

Registro técnico:

```txt
platform/audit
= infraestructura para registrar eventos auditables
```

Consulta administrativa:

```txt
modules/audit
= consulta de eventos auditables por API
```

La auditoría puede registrarse de forma directa desde el caso de uso o de forma diferida a través del bus de eventos y un worker de auditoría.

Resultado esperado:

```txt
El sistema conserva trazabilidad de acciones críticas y permite consultarla desde la API.
```

## Orden resumido

```txt
1. Base técnica.
2. Base de datos.
3. Procesamiento asíncrono base.
4. Seguridad.
5. Usuarios y autorización.
6. Catálogos.
7. Identidad personal.
8. Programas académicos.
9. Estudiantes.
10. Docentes.
11. Cursos.
12. Periodos académicos.
13. Ofertas de curso.
14. Inscripciones.
15. Importación de estudiantes.
16. Reportes.
17. Auditoría.
```

## Dependencias principales

```txt
identity es usado por students, professors y users.

students depende de identity y academic-programs.

professors depende de identity.

courses depende de academic-programs y course-categories.

course-offerings depende de courses, academic-periods y professors.

enrollments depende de students, course-offerings y users.

student imports depende de students, identity, academic-programs, users y la cola de jobs.

users depende de la cola de jobs para auditoría diferida y procesos asíncronos.

authorization depende de users.

reports depende de datos académicos ya implementados.

audit consume eventos de todos los módulos.
```

## Criterio general

El plan debe guiar el orden de construcción sin bloquear ajustes del proyecto.

```txt
Primero estabilidad técnica.
Luego base de datos y procesamiento asíncrono.
Luego seguridad.
Luego datos base.
Luego proceso académico.
Luego reportes y auditoría consultable.
```

Este orden reduce retrabajo y mantiene el crecimiento del sistema alineado con sus dependencias reales.
