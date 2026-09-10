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
users
authorization
audit
```

Cada módulo debe ser dueño de sus reglas, datos principales, contratos y forma de exposición.

La frontera de un módulo existe para responder una pregunta:

```txt
¿Qué parte del problema controla este módulo?
```

## Módulos principales

Para el alcance actual, los módulos funcionales son:

```txt
identity
students
professors
academic-programs
courses
academic-periods
course-offerings
enrollments
users
authorization
audit
reports
```

No todos tienen el mismo peso. Algunos son módulos de negocio académico fuerte; otros son módulos de identidad, acceso, soporte o consulta.

`catalogs` no forma parte de los módulos iniciales. Un catálogo vive dentro del módulo que lo usa. Si en el futuro un catálogo necesita ser compartido por varios módulos, puede evaluarse extraerlo a un módulo propio de catálogos compartidos.

Los workers no son módulos. Son procesos asíncronos que consumen contratos públicos de los módulos, pero no pertenecen a ninguno de ellos.

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

Son módulos funcionales que controlan cuentas, sesiones, roles y permisos.

```txt
users
authorization
```

Responsabilidades:

```txt
users
= cuentas de usuario, credenciales, sesiones, login, logout y refresh token

authorization
= roles, permisos y asignación entre usuarios, roles y permisos
```

Estos módulos están dentro de `modules/` porque tienen datos, casos de uso, reglas y endpoints propios.

No deben confundirse con `platform/security`.

```txt
platform/security
= JWT, hashing, guards, decorators y estrategias técnicas
```

## Módulos de soporte funcional

Son módulos que apoyan el proceso, pero no representan el centro de la inscripción.

```txt
identity
audit
reports
```

`identity` sostiene la identidad personal común. `audit` expone la consulta administrativa de eventos auditables. `reports` consulta información resumida.

## Catálogos

Los catálogos son datos de referencia que clasifican o validan información: tipos de documento, categorías de curso y valores similares.

No forman un módulo por defecto. Cada catálogo pertenece al módulo que lo usa como parte de sus reglas.

```txt
identity
= dueño de document_types

courses
= dueño de course_categories
```

La regla práctica es:

```txt
Si un catálogo lo usa un solo módulo, vive dentro de ese módulo.
Si varios módulos dependen del mismo catálogo, puede extraerse a un módulo de catálogos compartidos.
```

Mientras un catálogo tenga un solo dueño funcional, no conviene separarlo. Extraerlo antes de tiempo genera un módulo artificial sin reglas propias.

Los estados del sistema (estado de estudiante, estado de docente, estado de periodo, estado de oferta, estado de inscripción, estado de usuario, estado de sesión) no son catálogos. Son enums internos porque representan valores pequeños y estables que forman parte del comportamiento del sistema.

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

Se separa en dos piezas con responsabilidades distintas:

```txt
platform/audit
= infraestructura técnica para registrar eventos auditables

modules/audit
= consulta administrativa y contratos funcionales de auditoría
```

El registro técnico transversal vive en `platform/audit`. La exposición administrativa, filtros y contratos de consulta viven en `modules/audit`.

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

Las sesiones pertenecen funcionalmente a `users`.

```txt
modules/users
= creación, renovación y revocación de sesiones
```

La tabla conceptual puede ser:

```txt
user_sessions
```

Aunque usa JWT y soporte técnico de seguridad, la sesión representa un acceso autenticado del usuario. Por eso su regla funcional pertenece a `users`, que también administra cuentas y credenciales.

`platform/security` aporta herramientas técnicas para validar tokens o extraer el usuario autenticado, pero no administra las sesiones como capacidad funcional.

## Comunicación entre módulos

Un módulo no debe usar libremente archivos internos de otro.

Evitar:

```txt
enrollments importa repositories internos de students
course-offerings importa infraestructura interna de professors
users modifica roles directamente sin pasar por una capacidad del módulo dueño
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

## Workers y fronteras

Los workers son procesos asíncronos que se ejecutan fuera del flujo HTTP y consumen jobs y eventos. No son módulos, pero interactúan con ellos y deben respetar las mismas fronteras.

Reglas:

```txt
- Un worker no importa detalles internos de un módulo.
- Un worker consume contratos públicos, casos de uso o servicios expuestos por el módulo dueño.
- Un worker no contiene reglas de negocio; delega en el módulo correspondiente.
- Un worker encola y publica a través de los contratos de Job Queue y Event Bus definidos en core.
- Ningún módulo depende de workers. La dependencia va en una sola dirección: workers consumen módulos.
```

Ejemplo correcto:

```txt
worker de importación
→ consume el caso de uso de importación de students
→ students valida, persiste y decide
```

Ejemplo incorrecto:

```txt
worker de importación
→ consulta directamente la tabla students
→ aplica sus propias reglas de validación
```

Los módulos no saben que existen workers. Solo exponen capacidades y, cuando corresponde, encolan jobs o publican eventos a través de los contratos de `core`. El worker es un consumidor más, igual que un controlador HTTP, pero con un punto de entrada distinto.

## Ejemplo: `users`

`users` debe encargarse de:

```txt
- Crear y administrar cuentas de usuario.
- Administrar credenciales.
- Login.
- Logout.
- Refresh token.
- Crear sesión.
- Revocar sesión.
- Revocar sesiones anteriores si se permite una sola sesión activa.
```

No debe encargarse de:

```txt
- Crear roles o permisos.
- Administrar estudiantes.
- Definir reglas académicas.
- Definir políticas de autorización fina.
```

Puede consultar roles y permisos mediante capacidades del módulo `authorization`.

## Ejemplo: `authorization`

`authorization` debe encargarse de:

```txt
- Crear roles.
- Listar roles.
- Actualizar roles.
- Dar de baja roles no sistema.
- Asignar roles a usuarios.
- Listar permisos.
- Agrupar permisos por módulo.
- Asignar permisos a roles.
- Retirar permisos de roles.
```

No debe encargarse de:

```txt
- Emitir tokens.
- Validar contraseñas.
- Crear sesiones.
- Ejecutar guards.
- Validar JWT.
- Hash de contraseñas.
- Registrar inscripciones.
- Decidir reglas académicas.
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
- Definir catálogos compartidos.
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
PersonFinder
UserFinder
UserCredentialsValidator
SessionValidator
RolePermissionResolver
```

Esto evita que otros módulos importen repositorios, entidades internas o detalles de persistencia. Los workers también consumen esta frontera pública cuando necesitan datos o decisiones de un módulo.

## Regla de ownership

Cada dato importante debe tener un dueño funcional.

Ejemplos:

```txt
identity
= dueño de la identidad personal y de los tipos de documento

students
= dueño del estado académico del estudiante

course-offerings
= dueño del estado y cupos de la oferta

enrollments
= dueño del estado de la inscripción

academic-periods
= dueño de fechas y estado del periodo

courses
= dueño del catálogo de cursos y de las categorías de curso

users
= dueño de cuentas, credenciales, sesiones y flujo de autenticación

authorization
= dueño de roles y permisos

platform/audit
= infraestructura técnica de registro de eventos

modules/audit
= consulta administrativa de auditoría
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
- Platform/security administra cuentas, roles o permisos como negocio.
- Un worker contiene reglas de negocio o consulta tablas ajenas directamente.
- Un módulo depende de un worker para funcionar.
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
