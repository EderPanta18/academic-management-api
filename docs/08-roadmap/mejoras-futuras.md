# Mejoras futuras

Este documento registra mejoras que pueden considerarse después del alcance inicial del backend académico.

No representa compromisos de implementación ni requisitos inmediatos. Su propósito es separar claramente lo que pertenece a la primera versión de aquello que puede evaluarse más adelante.

## Criterio general

Una mejora futura debe cumplir al menos uno de estos criterios:

```txt
- Aporta valor, pero no es necesaria para el flujo inicial.
- Requiere decisiones adicionales de producto.
- Aumenta complejidad técnica.
- Depende de módulos que todavía no existen.
- Puede implementarse sin alterar el núcleo del sistema.
```

El objetivo es evitar que la primera versión crezca sin control.

## Seguridad y autenticación

## Login con proveedores externos

La primera versión usa autenticación interna:

```txt
email + password
users
user_sessions
JWT
```

Como mejora futura puede agregarse login con proveedores externos:

```txt
Google
Microsoft
GitHub
proveedor institucional SSO
```

Para eso podría incorporarse una tabla como:

```txt
user_identity_providers
- id
- user_id
- provider
- provider_user_id
- provider_email
- created_at
```

El backend seguiría creando sesiones propias en `user_sessions`.

## Recuperación de contraseña

Puede incorporarse un flujo de recuperación de contraseña.

Posible soporte:

```txt
password_reset_tokens
- id
- user_id
- token_hash
- expires_at
- used_at
- created_at
```

Debe evitarse guardar tokens en texto plano.

## Autenticación multifactor

Puede evaluarse si el sistema requiere mayor seguridad.

Opciones:

```txt
- Código temporal por correo.
- Aplicación autenticadora.
- Confirmación por dispositivo.
```

No es necesaria para la primera versión.

## Políticas avanzadas de sesión

La primera versión puede manejar una sesión activa por usuario o sesiones registradas simples.

Mejoras posibles:

```txt
- Vista de sesiones activas.
- Cierre de sesión por dispositivo.
- Límite configurable de sesiones activas.
- Detección de actividad sospechosa.
- Registro ampliado de IP y dispositivo.
```

## Roles y permisos avanzados

La primera versión usa roles y permisos base.

Mejoras futuras:

```txt
- Roles personalizados desde interfaz.
- Clonación de roles.
- Permisos por ámbito.
- Permisos por programa académico.
- Permisos por unidad académica.
- Políticas de ownership más elaboradas.
```

Ejemplo:

```txt
Un coordinador solo administra programas académicos asignados.
```

## Importaciones

## Módulo genérico de importaciones

La primera versión mantiene la importación de estudiantes dentro de `students`.

Si luego se importan varias entidades, puede evaluarse:

```txt
modules/imports
```

Casos que justificarían un módulo transversal:

```txt
- Importación de docentes.
- Importación de cursos.
- Importación de ofertas.
- Importación de inscripciones.
- Historial común.
- Reintentos.
- Validación por etapas.
- Procesamiento asíncrono.
```

En ese caso, `imports` coordinaría el proceso, pero cada módulo dueño seguiría validando sus reglas.

## Importaciones asíncronas

Para archivos grandes puede implementarse procesamiento en segundo plano.

Opciones:

```txt
- Cola de trabajos.
- Estado de procesamiento.
- Progreso por porcentaje.
- Notificación al terminar.
- Descarga de errores.
```

La primera versión puede procesar archivos pequeños de forma síncrona.

## Exportación de errores

Si el detalle por fila se vuelve muy usado, puede agregarse exportación.

Ejemplos:

```txt
- Descargar filas rechazadas en XLSX.
- Descargar errores por campo.
- Descargar resumen de importación.
```

## Reportes

## Exportación de reportes

La primera versión puede consultar reportes básicos.

Mejoras futuras:

```txt
- Exportar PDF.
- Exportar XLSX.
- Exportar CSV.
- Programar reportes.
- Enviar reportes por correo.
```

## Dashboard académico

Puede implementarse un dashboard con indicadores.

Ejemplos:

```txt
- Total de estudiantes activos.
- Inscripciones por periodo.
- Cupos ocupados por oferta.
- Cursos con mayor demanda.
- Importaciones recientes.
- Inscripciones canceladas.
```

## Reportes avanzados

Posibles reportes adicionales:

```txt
- Historial académico por estudiante.
- Carga docente.
- Tasa de ocupación por curso.
- Estudiantes sin inscripción.
- Ofertas sin docente asignado.
- Programas con mayor demanda.
```

## Proceso académico

## Prerrequisitos de cursos

El modelo inicial puede operar sin prerrequisitos.

Más adelante puede agregarse:

```txt
course_prerequisites
- id
- course_id
- required_course_id
- type
```

Esto permitiría validar que un estudiante solo se inscriba si cumple requisitos previos.

## Horarios académicos

La primera versión no administra horarios detallados.

Mejoras posibles:

```txt
course_offering_schedules
- id
- course_offering_id
- day_of_week
- start_time
- end_time
- classroom
```

Esto permitiría validar cruces de horario.

## Aulas y ambientes

Puede agregarse gestión de aulas.

Ejemplos:

```txt
classrooms
buildings
campuses
```

Esto solo conviene si el sistema administrará disponibilidad física.

## Malla curricular

Puede añadirse una estructura curricular más formal.

Posibles entidades:

```txt
curriculums
curriculum_courses
curriculum_cycles
```

Esto permitiría organizar cursos por ciclo, plan y versión.

## Matrícula más compleja

Si la institución requiere un proceso más amplio, puede diferenciarse inscripción y matrícula.

Ejemplo:

```txt
enrollments
= inscripción a oferta de curso

registrations
= matrícula académica global del periodo
```

No es necesario si el sistema solo gestiona inscripción por oferta.

## Notificaciones

La primera versión puede operar sin notificaciones automáticas.

Mejoras futuras:

```txt
- Notificación de inscripción exitosa.
- Notificación de cancelación.
- Notificación de cierre de periodo.
- Notificación de importación finalizada.
- Notificación de recuperación de contraseña.
```

Canales posibles:

```txt
correo
panel interno
websocket
```

## Auditoría avanzada

La primera versión puede registrar eventos en `audit_logs`.

Mejoras futuras:

```txt
- Consulta avanzada de auditoría.
- Filtros por usuario, módulo, recurso y fecha.
- Exportación de auditoría.
- Retención configurable.
- Alertas por acciones sensibles.
```

También puede agregarse trazabilidad más granular para cambios de campos.

Ejemplo:

```txt
before
after
changed_fields
```

Debe cuidarse no guardar datos sensibles innecesarios.

## Integraciones externas

Posibles integraciones futuras:

```txt
- Sistema institucional de identidad.
- Sistema de pagos.
- Sistema de notas.
- Sistema de asistencia.
- Plataforma LMS.
- Servicios de correo.
- Almacenamiento externo de archivos.
```

Cada integración debe evaluarse como decisión independiente.

## Archivos y almacenamiento

La primera versión puede procesar archivos sin conservarlos o conservar solo información de importación.

Mejoras futuras:

```txt
- Almacenar archivo original.
- Guardar hash del archivo.
- Usar almacenamiento externo.
- Controlar versiones de archivos.
- Descargar archivo importado.
```

Si se almacenan archivos originales, debe definirse política de retención.

## Observabilidad

Puede mejorarse la operación técnica del sistema.

Opciones:

```txt
- Logs estructurados.
- Métricas.
- Trazas.
- Correlation ID.
- Alertas.
- Health checks extendidos.
```

Esto no es obligatorio para una primera versión académica, pero ayuda en producción.

## Calidad y pruebas

Mejoras futuras:

```txt
- Pruebas e2e para flujos principales.
- Tests de permisos por endpoint.
- Tests de importación con archivos reales de ejemplo.
- Tests de concurrencia para cupos.
- Pipeline CI.
- Validación automática de migraciones.
```

Estas mejoras deben agregarse cuando el flujo del proyecto esté más estable.

## Frontend y experiencia de usuario

El backend puede sostener futuras pantallas como:

```txt
- Administración de estudiantes.
- Administración de docentes.
- Administración de cursos.
- Gestión de ofertas.
- Registro de inscripciones.
- Historial de importaciones.
- Reportes.
- Administración de usuarios, roles y permisos.
```

El diseño del frontend debe respetar permisos del backend.

## Fuera de alcance inicial

Estas capacidades no pertenecen a la primera versión salvo decisión explícita:

```txt
- Pagos.
- Calificaciones completas.
- Asistencia.
- Certificados.
- Trámite documentario.
- Admisión.
- Portal completo del estudiante.
- Portal completo del docente.
- Horarios avanzados.
- LMS.
```

Pueden evaluarse como módulos futuros si el producto crece.

## Criterio de priorización

Antes de implementar una mejora futura, conviene validar:

```txt
- Qué problema resuelve.
- Qué usuario la necesita.
- Qué módulo sería dueño.
- Qué tablas nuevas requiere.
- Qué permisos necesita.
- Qué impacto tiene en seguridad.
- Qué impacto tiene en reportes.
- Qué impacto tiene en migraciones.
```

No toda idea debe convertirse inmediatamente en módulo.

## Criterio general

Las mejoras futuras permiten proyectar crecimiento sin inflar la primera versión.

```txt
Primera versión
= flujo académico esencial y seguridad base

Futuro
= integraciones, automatización, experiencia avanzada y operación productiva
```

El sistema debe poder crecer, pero no debe cargar complejidad antes de que exista una necesidad real.
