# Data Modeling

## Propósito

Este documento describe el modelado de datos del sistema backend de gestión académica.

Su objetivo es definir las entidades persistentes, sus campos principales, relaciones, restricciones y reglas de integridad que sostienen el funcionamiento del sistema. El documento se enfoca en el diseño lógico de datos y en cómo las entidades se relacionan dentro del dominio académico.

El modelado de datos responde principalmente a estas preguntas:

```txt
¿Qué información necesita almacenar el sistema?
¿Cómo se relacionan las entidades entre sí?
¿Qué restricciones deben preservar la consistencia de los datos?
¿Qué convenciones se aplican a todos los modelos persistidos?
```

## Alcance del modelado

El modelo de datos cubre las entidades principales del sistema académico:

```txt
- Personas
- Profesores
- Estudiantes
- Departamentos
- Carreras
- Categorías de curso
- Cursos
- Periodos académicos
- Ofertas de curso
- Inscripciones
- Historial de estados de inscripción
```

El modelo está orientado a una base de datos relacional. Las entidades se diseñan para preservar integridad referencial, evitar duplicidad, soportar auditoría básica y mantener trazabilidad mediante borrado lógico e historial de cambios cuando corresponde.

## Convenciones transversales

Todos los modelos persistidos aplican convenciones comunes.

```txt
createdAt
= fecha de creación del registro

updatedAt
= fecha de última modificación del registro

deletedAt
= fecha de baja lógica del registro
```

Un registro con `deletedAt` distinto de `null` se considera eliminado lógicamente. No se elimina físicamente de la base de datos.

La eliminación lógica permite:

```txt
- Mantener trazabilidad histórica.
- Evitar pérdida definitiva de información.
- Preservar relaciones pasadas.
- Permitir auditoría o recuperación futura si fuese necesario.
```

Las tablas operativas principales usan claves primarias numéricas autoincrementales. Las entidades que especializan a `Person`, como `Professor` y `Student`, usan herencia identificatoria: su clave primaria es también la clave foránea hacia la persona asociada.

## Grupos del modelo

El modelo se organiza en grupos lógicos según responsabilidad.

| Grupo | Entidades |
| --- | --- |
| Identidad | `Person` |
| Estructura organizacional | `Department`, `Career`, `AcademicPeriod` |
| Actores académicos | `Professor`, `Student` |
| Catálogo académico | `CourseCategory`, `Course` |
| Oferta e inscripciones | `CourseOffering`, `Enrollment`, `EnrollmentStatusLog` |

## Identidad

## `Person`

`Person` representa los datos personales comunes a los actores del sistema.

Es la entidad base para registrar información de identidad que puede ser compartida por profesores, estudiantes u otros actores futuros. Su existencia permite evitar duplicación de datos personales entre módulos.

| Campo | Tipo lógico | Restricciones | Descripción |
| --- | --- | --- | --- |
| `id` | entero | PK, autoincremental | Identificador único de la persona. |
| `dni` | texto corto | requerido, único | Documento de identidad. |
| `firstName` | texto | requerido | Nombres de la persona. |
| `lastName` | texto | requerido | Apellidos de la persona. |
| `email` | texto | requerido, único | Correo personal o de contacto. |
| `phone` | texto corto | opcional | Teléfono o celular. |
| `birthDate` | fecha | opcional | Fecha de nacimiento. |
| `createdAt` | fecha-hora | requerido | Fecha de creación. |
| `updatedAt` | fecha-hora | requerido | Fecha de última modificación. |
| `deletedAt` | fecha-hora | opcional | Fecha de baja lógica. |

Relaciones:

```txt
Person 1:1 Professor
Person 1:1 Student
```

Notas de diseño:

```txt
- `Person` almacena identidad personal, no credenciales de acceso.
- Una persona puede existir antes de tener un rol académico específico.
- Los módulos especializados usan la identidad de `Person` como base.
```

## Estructura organizacional

## `Department`

`Department` representa una unidad académica u organizacional.

Agrupa carreras, profesores u otros elementos institucionales según el diseño del sistema.

| Campo | Tipo lógico | Restricciones | Descripción |
| --- | --- | --- | --- |
| `id` | entero | PK, autoincremental | Identificador único del departamento. |
| `name` | texto | requerido, único | Nombre del departamento. |
| `description` | texto largo | opcional | Descripción informativa. |
| `createdAt` | fecha-hora | requerido | Fecha de creación. |
| `updatedAt` | fecha-hora | requerido | Fecha de última modificación. |
| `deletedAt` | fecha-hora | opcional | Fecha de baja lógica. |

Relaciones:

```txt
Department 1:N Career
Department 1:N Professor
```

## `Career`

`Career` representa una carrera o programa académico formal.

Se asocia con estudiantes y cursos, y puede depender de un departamento.

| Campo | Tipo lógico | Restricciones | Descripción |
| --- | --- | --- | --- |
| `id` | entero | PK, autoincremental | Identificador único de la carrera. |
| `departmentId` | entero | FK, requerido | Departamento al que pertenece. |
| `name` | texto | requerido, único | Nombre de la carrera. |
| `totalCredits` | entero | requerido | Créditos totales requeridos. |
| `createdAt` | fecha-hora | requerido | Fecha de creación. |
| `updatedAt` | fecha-hora | requerido | Fecha de última modificación. |
| `deletedAt` | fecha-hora | opcional | Fecha de baja lógica. |

Relaciones:

```txt
Career N:1 Department
Career 1:N Student
Career 1:N Course
```

## `AcademicPeriod`

`AcademicPeriod` representa un periodo académico de dictado o matrícula.

Define el contexto temporal en el que se crean ofertas de curso.

| Campo | Tipo lógico | Restricciones | Descripción |
| --- | --- | --- | --- |
| `id` | entero | PK, autoincremental | Identificador único del periodo. |
| `name` | texto corto | requerido, único | Nombre o código del periodo. |
| `year` | entero | requerido | Año académico. |
| `semester` | entero | requerido | Semestre académico. |
| `startDate` | fecha | requerido | Fecha de inicio. |
| `endDate` | fecha | requerido | Fecha de cierre. |
| `isCurrent` | booleano | requerido | Indica si es el periodo vigente. |
| `createdAt` | fecha-hora | requerido | Fecha de creación. |
| `updatedAt` | fecha-hora | requerido | Fecha de última modificación. |
| `deletedAt` | fecha-hora | opcional | Fecha de baja lógica. |

Restricciones:

```txt
- La combinación `year` + `semester` debe ser única.
- `endDate` debe ser posterior a `startDate`.
- Solo un periodo puede estar marcado como vigente cuando la regla institucional lo exige.
```

Relaciones:

```txt
AcademicPeriod 1:N CourseOffering
```

## Actores académicos

## `Professor`

`Professor` representa a un docente.

Es una especialización de `Person`, por lo que utiliza `personId` como identificador principal y como referencia a la persona asociada.

| Campo | Tipo lógico | Restricciones | Descripción |
| --- | --- | --- | --- |
| `personId` | entero | PK, FK `Person` | Identificador heredado de `Person`. |
| `departmentId` | entero | FK, opcional | Departamento al que pertenece. |
| `code` | texto corto | requerido, único | Código institucional del profesor. |
| `specialty` | texto | opcional | Área de especialidad. |
| `institutionalEmail` | texto | opcional, único | Correo institucional. |
| `hireDate` | fecha | opcional | Fecha de contratación. |
| `status` | enum | requerido | Estado operativo del profesor. |
| `createdAt` | fecha-hora | requerido | Fecha de creación. |
| `updatedAt` | fecha-hora | requerido | Fecha de última modificación. |
| `deletedAt` | fecha-hora | opcional | Fecha de baja lógica. |

Estados principales:

| Estado | Descripción |
| --- | --- |
| `ACTIVE` | Profesor operativo. |
| `INACTIVE` | Profesor sin actividad. |
| `ON_LEAVE` | Profesor en licencia temporal. |

Relaciones:

```txt
Professor 1:1 Person
Professor N:1 Department
Professor 1:N CourseOffering
```

Notas de diseño:

```txt
- `status` indica condición operativa.
- `deletedAt` indica baja lógica del registro.
- Un profesor puede existir sin estar asignado a una oferta de curso.
```

## `Student`

`Student` representa a un estudiante.

Es una especialización de `Person`, por lo que utiliza `personId` como identificador principal y como referencia a la persona asociada.

| Campo | Tipo lógico | Restricciones | Descripción |
| --- | --- | --- | --- |
| `personId` | entero | PK, FK `Person` | Identificador heredado de `Person`. |
| `careerId` | entero | FK, requerido | Carrera a la que pertenece. |
| `code` | texto corto | requerido, único | Código universitario del estudiante. |
| `institutionalEmail` | texto | opcional, único | Correo institucional. |
| `enrollmentDate` | fecha | requerido | Fecha de ingreso. |
| `status` | enum | requerido | Estado académico del estudiante. |
| `createdAt` | fecha-hora | requerido | Fecha de creación. |
| `updatedAt` | fecha-hora | requerido | Fecha de última modificación. |
| `deletedAt` | fecha-hora | opcional | Fecha de baja lógica. |

Estados principales:

| Estado | Descripción |
| --- | --- |
| `ACTIVE` | Estudiante operativo. |
| `INACTIVE` | Estudiante sin actividad académica. |
| `GRADUATED` | Estudiante egresado o graduado. |
| `WITHDRAWN` | Estudiante retirado. |
| `SUSPENDED` | Estudiante suspendido. |

Relaciones:

```txt
Student 1:1 Person
Student N:1 Career
Student 1:N Enrollment
```

## Catálogo académico

## `CourseCategory`

`CourseCategory` representa una clasificación temática del catálogo de cursos.

| Campo | Tipo lógico | Restricciones | Descripción |
| --- | --- | --- | --- |
| `id` | entero | PK, autoincremental | Identificador único de la categoría. |
| `name` | texto | requerido, único | Nombre de la categoría. |
| `description` | texto largo | opcional | Descripción informativa. |
| `createdAt` | fecha-hora | requerido | Fecha de creación. |
| `updatedAt` | fecha-hora | requerido | Fecha de última modificación. |
| `deletedAt` | fecha-hora | opcional | Fecha de baja lógica. |

Relaciones:

```txt
CourseCategory 1:N Course
```

## `Course`

`Course` representa una unidad académica permanente dentro del catálogo.

No representa un dictado específico. Los dictados concretos se modelan mediante `CourseOffering`.

| Campo | Tipo lógico | Restricciones | Descripción |
| --- | --- | --- | --- |
| `id` | entero | PK, autoincremental | Identificador único del curso. |
| `careerId` | entero | FK, requerido | Carrera a la que pertenece. |
| `categoryId` | entero | FK, opcional | Categoría temática del curso. |
| `name` | texto | requerido | Nombre del curso. |
| `description` | texto largo | opcional | Descripción del curso. |
| `credits` | entero | requerido | Créditos académicos otorgados. |
| `createdAt` | fecha-hora | requerido | Fecha de creación. |
| `updatedAt` | fecha-hora | requerido | Fecha de última modificación. |
| `deletedAt` | fecha-hora | opcional | Fecha de baja lógica. |

Restricciones:

```txt
- La combinación `careerId` + `name` debe ser única.
```

Relaciones:

```txt
Course N:1 Career
Course N:1 CourseCategory
Course 1:N CourseOffering
```

## Oferta e inscripciones

## `CourseOffering`

`CourseOffering` representa una instancia concreta de un curso en un periodo académico.

Define qué curso se dicta, en qué periodo, en qué sección, con qué profesor, con cuántos cupos y hasta cuándo se permite la inscripción.

| Campo | Tipo lógico | Restricciones | Descripción |
| --- | --- | --- | --- |
| `id` | entero | PK, autoincremental | Identificador único de la oferta. |
| `courseId` | entero | FK, requerido | Curso asociado. |
| `academicPeriodId` | entero | FK, requerido | Periodo académico asociado. |
| `professorId` | entero | FK, opcional | Profesor asignado. |
| `section` | texto corto | requerido | Sección de dictado. |
| `maxStudents` | entero | requerido | Capacidad máxima de estudiantes. |
| `enrollmentDeadline` | fecha | opcional | Fecha límite de inscripción. |
| `status` | enum | requerido | Estado de la oferta. |
| `createdAt` | fecha-hora | requerido | Fecha de creación. |
| `updatedAt` | fecha-hora | requerido | Fecha de última modificación. |
| `deletedAt` | fecha-hora | opcional | Fecha de baja lógica. |

Estados principales:

| Estado | Descripción |
| --- | --- |
| `INACTIVE` | Oferta creada, pero aún no abierta. |
| `ACTIVE` | Oferta vigente y disponible para inscripción. |
| `CANCELLED` | Oferta cancelada. |
| `COMPLETED` | Oferta finalizada. |

Restricciones:

```txt
- La combinación `courseId` + `academicPeriodId` + `section` debe ser única.
- Una oferta activa puede recibir inscripciones mientras cumpla las reglas de cupo, fecha y estado.
```

Relaciones:

```txt
CourseOffering N:1 Course
CourseOffering N:1 AcademicPeriod
CourseOffering N:1 Professor
CourseOffering 1:N Enrollment
```

## `Enrollment`

`Enrollment` representa la inscripción de un estudiante en una oferta de curso.

Materializa la relación entre un estudiante y una oferta académica concreta.

| Campo | Tipo lógico | Restricciones | Descripción |
| --- | --- | --- | --- |
| `id` | entero | PK, autoincremental | Identificador único de la inscripción. |
| `studentId` | entero | FK, requerido | Estudiante inscrito. |
| `courseOfferingId` | entero | FK, requerido | Oferta de curso asociada. |
| `status` | enum | requerido | Estado actual de la inscripción. |
| `enrollmentDate` | fecha | requerido | Fecha de inscripción. |
| `createdBy` | entero | opcional | Usuario o proceso que creó la inscripción. |
| `createdAt` | fecha-hora | requerido | Fecha de creación. |
| `updatedAt` | fecha-hora | requerido | Fecha de última modificación. |
| `deletedAt` | fecha-hora | opcional | Fecha de baja lógica. |

Estados principales:

| Estado | Descripción |
| --- | --- |
| `ENROLLED` | Inscripción activa. |
| `WITHDRAWN` | Retiro del curso. |
| `COMPLETED` | Curso completado. |
| `SUSPENDED` | Inscripción suspendida. |

Restricciones:

```txt
- La combinación `studentId` + `courseOfferingId` debe ser única.
- Solo se pueden crear inscripciones para ofertas válidas.
- El estudiante debe cumplir las condiciones necesarias para inscribirse.
```

Relaciones:

```txt
Enrollment N:1 Student
Enrollment N:1 CourseOffering
Enrollment 1:N EnrollmentStatusLog
```

## `EnrollmentStatusLog`

`EnrollmentStatusLog` registra el historial de cambios de estado de una inscripción.

Es una entidad de auditoría de solo inserción. Sus registros representan eventos históricos y no deben modificarse como parte del flujo normal del sistema.

| Campo | Tipo lógico | Restricciones | Descripción |
| --- | --- | --- | --- |
| `id` | entero | PK, autoincremental | Identificador único del evento. |
| `enrollmentId` | entero | FK, requerido | Inscripción asociada. |
| `previousStatus` | enum | opcional | Estado anterior. |
| `newStatus` | enum | requerido | Nuevo estado. |
| `reason` | texto largo | opcional | Motivo del cambio. |
| `changedBy` | entero | opcional | Usuario o proceso que generó el cambio. |
| `createdAt` | fecha-hora | requerido | Fecha de creación del evento. |

Relaciones:

```txt
EnrollmentStatusLog N:1 Enrollment
```

Notas de diseño:

```txt
- No contiene `updatedAt` porque sus registros no se modifican.
- No contiene `deletedAt` porque sus registros no se eliminan lógicamente.
- Cada registro representa una fotografía histórica de una transición.
```

## Flujo de dependencias entre entidades

Las entidades tienen dependencias lógicas por relación.

| Capa lógica | Entidades | Depende de |
| --- | --- | --- |
| Base | `Person`, `Department` | Sin dependencias principales |
| Estructura | `Career`, `AcademicPeriod`, `CourseCategory` | `Department` cuando corresponde |
| Actores | `Professor`, `Student` | `Person`, `Department`, `Career` |
| Catálogo | `Course` | `Career`, `CourseCategory` |
| Oferta | `CourseOffering` | `Course`, `AcademicPeriod`, `Professor` |
| Inscripción | `Enrollment`, `EnrollmentStatusLog` | `Student`, `CourseOffering` |

## Integridad de datos

El modelo conserva consistencia mediante restricciones de unicidad, claves foráneas y validaciones de aplicación.

Restricciones principales:

```txt
- `Person.dni` único.
- `Person.email` único.
- `Professor.code` único.
- `Professor.institutionalEmail` único cuando exista.
- `Student.code` único.
- `Student.institutionalEmail` único cuando exista.
- `Department.name` único.
- `Career.name` único.
- `CourseCategory.name` único.
- `Course` único por carrera y nombre.
- `AcademicPeriod` único por año y semestre.
- `CourseOffering` único por curso, periodo y sección.
- `Enrollment` único por estudiante y oferta.
```

## Resumen

El modelo de datos organiza la información académica en entidades relacionadas por identidad, estructura institucional, actores, catálogo, oferta e inscripción.

La separación entre `Person`, `Professor` y `Student` evita duplicar datos personales. La separación entre `Course` y `CourseOffering` distingue el catálogo académico permanente del dictado concreto en un periodo. La entidad `Enrollment` materializa la relación entre estudiantes y ofertas, mientras que `EnrollmentStatusLog` conserva la trazabilidad de cambios de estado.
