# Fronteras de módulos

Este documento define cómo deben separarse los módulos funcionales del backend. Su objetivo es evitar que las responsabilidades se mezclen y que un módulo termine usando detalles internos de otro.

El sistema se organiza por capacidades funcionales, no solo por tablas.

## Idea principal

Un módulo representa una capacidad funcional del sistema.

Ejemplos:

```txt
students
course-offerings
enrollments
auth
roles
permissions
```

Cada módulo debe ser dueño de sus reglas, datos principales, contratos y forma de exposición.

La frontera de un módulo existe para responder una pregunta:

```txt
¿Qué parte del problema controla este módulo?
```

## Módulos principales

Para el alcance actual, los módulos funcionales pueden ser:

```txt
auth
users
roles
permissions
persons
students
professors
academic-programs
courses
academic-periods
course-offerings
enrollments
reports
catalogs
```

No todos tienen el mismo peso. Algunos son módulos de negocio académico fuerte; otros son módulos de acceso, soporte o consulta.

## Módulos de negocio académico

Son módulos con reglas propias y participación directa en el proceso de inscripción.

```txt
students
professors
academic-programs
courses
academic-periods
course-offerings
enrollments
```

Estos módulos deben cuidar mejor su frontera porque contienen reglas relevantes.

Ejemplo:

```txt
enrollments no debería manipular directamente cómo se guarda una oferta.
course-offerings no debería decidir estados internos de un estudiante.
students no debería crear inscripciones por su cuenta.
```

## Módulos de acceso y seguridad funcional

Son módulos funcionales que controlan identidad, cuentas, roles y permisos.

```txt
auth
users
roles
permissions
```

Responsabilidades:

```txt
auth
= login, logout, refresh token, sesiones y revocación de accesos

users
= cuentas de usuario, estado del usuario y credenciales

roles
= roles del sistema y asignación de roles a usuarios

permissions
= permisos disponibles y asignación de permisos a roles
```

Estos módulos están dentro de `modules/` porque tienen datos, casos de uso, reglas y endpoints propios.

No deben confundirse con `platform/security`.

```txt
platform/security
= JWT, hashing, guards, decorators y estrategias técnicas
```

## Módulos de soporte funcional

Son módulos que apoyan el proceso, pero no siempre representan el centro de la inscripción.

```txt
persons
reports
catalogs
```

`persons` sostiene información común. `reports` consulta información resumida. `catalogs` agrupa datos de referencia.

## `catalogs`

`catalogs` debe usarse solo para datos de referencia simples.

Ejemplos:

```txt
Tipos de documento
Estados de estudiante
Estados de docente
Estados de inscripción
Estados de periodo
Estados de oferta
Categorías de curso
```

No deberían ir en `catalogs`:

```txt
Estudiantes
Docentes
Programas académicos
Cursos
Periodos académicos
Ofertas
Inscripciones
Roles
Permisos
Sesiones de usuario
```

La regla práctica es:

```txt
Si solo llena opciones o clasifica datos, puede ir en catalogs.
Si tiene proceso, reglas fuertes, relaciones importantes o endpoints propios, debe tener módulo propio.
```

## Importación

No se recomienda crear un módulo `imports` desde el inicio.

La importación inicial se enfoca en estudiantes, por lo que el proceso debe pertenecer funcionalmente a `students`.

```txt
students
→ importar estudiantes
```

La lectura técnica del archivo puede vivir en `platform/files`.

```txt
platform/files
→ leer CSV/XLSX
```

Así se separa el dueño funcional del proceso y la herramienta técnica utilizada.

Si en el futuro se importan muchas entidades y se necesita historial centralizado de importaciones, puede evaluarse una capacidad más específica.

## Auditoría

La auditoría no debe decidir reglas académicas ni reglas de acceso.

Debe tratarse como una capacidad transversal.

```txt
platform/audit
= registrar eventos auditables
```

Si en el futuro se exponen endpoints para consultar auditoría, puede existir un módulo funcional de consulta:

```txt
modules/audit
= consulta administrativa de eventos auditables
```

Pero el registro técnico transversal puede mantenerse en `platform/audit`.

Ejemplo correcto:

```txt
enrollments cambia estado de inscripción
→ registra evento de auditoría
```

Ejemplo incorrecto:

```txt
audit decide si una inscripción puede cancelarse
```

## Sesiones de usuario

Las sesiones pertenecen funcionalmente a `auth`.

```txt
modules/auth
= creación, renovación y revocación de sesiones
```

La tabla conceptual puede ser:

```txt
user_sessions
```

Aunque usa JWT y soporte técnico de seguridad, la sesión representa un acceso autenticado del usuario. Por eso su regla funcional pertenece a `auth`.

`platform/security` aporta herramientas técnicas para validar tokens o extraer el usuario autenticado, pero no administra las sesiones como capacidad funcional.

## Comunicación entre módulos

Un módulo no debe usar libremente archivos internos de otro.

Evitar:

```txt
enrollments importa repositories internos de students
course-offerings importa infraestructura interna de professors
auth modifica roles directamente sin pasar por una capacidad del módulo dueño
reports modifica datos de enrollments
```

Preferir:

```txt
- Servicios públicos internos.
- Puertos de consulta.
- Contratos explícitos.
- Lectura controlada de datos para reportes.
```

La colaboración debe ocurrir mediante capacidades claras.

## Ejemplo: `auth`

`auth` debe encargarse de:

```txt
- Login.
- Logout.
- Refresh token.
- Crear sesión.
- Revocar sesión.
- Revocar sesiones anteriores si se permite una sola sesión activa.
```

No debe encargarse de:

```txt
- Crear roles.
- Crear permisos.
- Administrar estudiantes.
- Definir reglas académicas.
```

Puede consultar usuario, roles y permisos mediante capacidades de los módulos dueños.

## Ejemplo: `roles`

`roles` debe encargarse de:

```txt
- Crear roles.
- Listar roles.
- Actualizar roles.
- Activar o desactivar roles.
- Asignar roles a usuarios si esa responsabilidad se define ahí.
```

No debe encargarse de:

```txt
- Emitir tokens.
- Validar contraseñas.
- Registrar inscripciones.
- Decidir reglas académicas.
```

## Ejemplo: `permissions`

`permissions` debe encargarse de:

```txt
- Listar permisos.
- Agrupar permisos por módulo.
- Asignar permisos a roles.
- Retirar permisos de roles.
```

No debe encargarse de:

```txt
- Ejecutar guards.
- Validar JWT.
- Hash de contraseñas.
- Crear sesiones.
```

## Ejemplo: `enrollments`

`enrollments` es uno de los módulos centrales del dominio académico.

Debe encargarse de:

```txt
- Registrar inscripciones.
- Evitar duplicidades.
- Validar estado del estudiante.
- Validar disponibilidad de oferta.
- Controlar cambios de estado.
- Mantener trazabilidad del proceso.
```

Pero no debe adueñarse de:

```txt
- Crear estudiantes.
- Crear cursos.
- Crear periodos académicos.
- Crear docentes.
- Definir catálogos globales.
- Administrar permisos.
```

Puede consultar esas capacidades, pero no reemplazarlas.

## Ejemplo: `course-offerings`

`course-offerings` controla las ofertas disponibles para inscripción.

Debe encargarse de:

```txt
- Crear ofertas de curso.
- Asociar curso y periodo.
- Definir sección.
- Controlar cupos.
- Asignar docente.
- Abrir, cerrar o cancelar ofertas.
```

No debe encargarse de:

```txt
- Registrar estudiantes.
- Crear inscripciones directamente.
- Gestionar usuarios.
- Generar reportes globales.
```

## Ejemplo: `reports`

`reports` consulta y resume información.

Debe encargarse de:

```txt
- Inscripciones por periodo.
- Cupos disponibles.
- Ofertas completas.
- Cursos con mayor demanda.
- Resultados de importaciones.
```

No debe encargarse de:

```txt
- Modificar inscripciones.
- Cambiar estados.
- Crear ofertas.
- Corregir datos.
```

Los reportes observan el sistema, no lo modifican.

## Frontera pública de un módulo

Un módulo puede exponer una parte pública para otros módulos.

Ejemplos:

```txt
StudentFinder
StudentEligibilityChecker
CourseOfferingAvailabilityChecker
ProfessorFinder
AcademicProgramFinder
UserFinder
UserCredentialsValidator
RolePermissionResolver
```

Esto evita que otros módulos importen repositorios, entidades internas o detalles de persistencia.

## Regla de ownership

Cada dato importante debe tener un dueño funcional.

Ejemplos:

```txt
students
= dueño del estado académico del estudiante

course-offerings
= dueño del estado y cupos de la oferta

enrollments
= dueño del estado de la inscripción

academic-periods
= dueño de fechas y estado del periodo

users
= dueño de cuentas y estado de usuario

auth
= dueño de sesiones y flujo de autenticación

roles
= dueño de roles

permissions
= dueño de permisos

platform/audit
= dueño del registro transversal de eventos
```

Cuando un módulo necesita información de otro, debe solicitarla, no modificarla directamente.

## Señales de frontera rota

Una frontera probablemente está rota si ocurre alguno de estos casos:

```txt
- Un módulo importa demasiados archivos internos de otro.
- Un controlador contiene reglas de varios módulos.
- Un repositorio de un módulo consulta y modifica muchas tablas ajenas sin una razón clara.
- Una regla se repite en dos módulos.
- Un módulo técnico decide reglas de negocio.
- Reports modifica datos.
- Audit decide procesos académicos.
- Platform/security administra roles o permisos como negocio.
```

Cuando aparezcan estas señales, conviene revisar si falta un contrato o si una responsabilidad está en el módulo incorrecto.

## Regla práctica

Para decidir dónde ubicar una funcionalidad:

```txt
¿Quién es dueño del dato principal?
¿Quién define la regla?
¿Quién cambia el estado?
¿Quién solo consulta?
¿Quién solo ofrece soporte técnico?
```

La respuesta ayuda a definir el módulo correcto.
