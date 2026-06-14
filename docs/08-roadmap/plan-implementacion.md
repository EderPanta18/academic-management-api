# Plan de implementación

Este documento define un orden recomendado para construir el backend académico.

El plan no representa un cronograma cerrado ni una lista de fechas. Su propósito es ordenar el desarrollo por dependencias funcionales y técnicas, evitando implementar módulos que todavía no tienen bases suficientes.

## Criterio general

El sistema debe construirse desde las capacidades base hacia los procesos académicos principales.

```txt
Base técnica
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

## Fase 3: Seguridad base

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
auth
users
roles
permissions
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

## Fase 4: Usuarios, roles y permisos

Objetivo: administrar el acceso funcional del sistema.

Incluye:

```txt
- Crear usuarios.
- Consultar usuarios.
- Activar/desactivar usuarios.
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

## Fase 5: Catálogos base

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
```

Resultado esperado:

```txt
El sistema cuenta con valores base para registrar personas y clasificar cursos.
```

## Fase 6: Personas

Objetivo: registrar identidad personal común.

Incluye:

```txt
- Crear persona.
- Consultar persona.
- Actualizar persona.
- Validar documento único.
- Validar tipo de documento.
```

Módulo:

```txt
persons
```

Resultado esperado:

```txt
El sistema puede registrar datos personales reutilizables por estudiantes, docentes y usuarios.
```

## Fase 7: Programas académicos

Objetivo: registrar estructura académica inicial.

Incluye:

```txt
- Crear programa académico.
- Consultar programas.
- Actualizar programa.
- Activar/desactivar programa.
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

## Fase 8: Estudiantes

Objetivo: registrar y administrar estudiantes.

Incluye:

```txt
- Crear estudiante.
- Consultar estudiantes.
- Actualizar estudiante.
- Activar/desactivar estudiante.
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

## Fase 9: Docentes

Objetivo: registrar docentes que pueden ser asignados a ofertas de curso.

Incluye:

```txt
- Crear docente.
- Consultar docentes.
- Actualizar docente.
- Activar/desactivar docente.
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

## Fase 10: Cursos

Objetivo: registrar cursos del catálogo académico.

Incluye:

```txt
- Crear curso.
- Consultar cursos.
- Actualizar curso.
- Activar/desactivar curso.
- Asociar curso a programa académico.
- Asociar curso a categoría.
- Validar créditos.
- Validar código único.
```

Módulo:

```txt
courses
```

Resultado esperado:

```txt
El sistema puede crear ofertas a partir de cursos existentes.
```

## Fase 11: Periodos académicos

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

## Fase 12: Ofertas de curso

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
- Cancelar oferta.
- Validar curso activo.
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

## Fase 13: Inscripciones

Objetivo: registrar estudiantes en ofertas de curso.

Incluye:

```txt
- Crear inscripción.
- Consultar inscripciones.
- Cancelar inscripción.
- Cambiar estado.
- Registrar historial de cambios.
- Validar estudiante activo.
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

## Fase 14: Importación de estudiantes

Objetivo: permitir carga masiva de estudiantes.

Incluye:

```txt
- Recibir archivo.
- Leer archivo desde platform/files.
- Validar estructura.
- Validar filas.
- Detectar duplicados.
- Crear estudiantes válidos.
- Persistir resumen de importación.
- Persistir detalle por fila.
- Consultar historial de importaciones.
- Consultar errores por fila.
```

Módulo dueño:

```txt
students
```

Soporte técnico:

```txt
platform/files
```

Tablas:

```txt
student_imports
student_import_rows
```

Resultado esperado:

```txt
El sistema puede importar estudiantes y conservar evidencia detallada del resultado.
```

No crear todavía:

```txt
modules/imports
```

Ese módulo solo tendría sentido si varias entidades requieren importaciones comunes.

## Fase 15: Reportes básicos

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

## Fase 16: Auditoría

Objetivo: registrar acciones relevantes del sistema.

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

Primera versión:

```txt
platform/audit
= registrar eventos
```

Versión posterior si se requiere consulta:

```txt
modules/audit
= consultar eventos por API
```

Resultado esperado:

```txt
El sistema conserva trazabilidad de acciones críticas.
```

## Orden resumido

```txt
1. Base técnica.
2. Base de datos.
3. Seguridad.
4. Usuarios, roles y permisos.
5. Catálogos.
6. Personas.
7. Programas académicos.
8. Estudiantes.
9. Docentes.
10. Cursos.
11. Periodos académicos.
12. Ofertas de curso.
13. Inscripciones.
14. Importación de estudiantes.
15. Reportes.
16. Auditoría consultable si aplica.
```

## Dependencias principales

```txt
students depende de persons y academic-programs.

professors depende de persons.

courses depende de academic-programs y course-categories.

course-offerings depende de courses, academic-periods y professors.

enrollments depende de students, course-offerings y users.

student imports depende de students, persons, academic-programs y users.

auth depende de users, roles, permissions y user_sessions.

reports depende de datos académicos ya implementados.
```

## Criterio general

El plan debe guiar el orden de construcción sin bloquear ajustes del proyecto.

```txt
Primero estabilidad técnica.
Luego seguridad.
Luego datos base.
Luego proceso académico.
Luego reportes y mejoras.
```

Este orden reduce retrabajo y mantiene el crecimiento del sistema alineado con sus dependencias reales.
