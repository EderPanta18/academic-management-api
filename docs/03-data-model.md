# Modelado de Datos

## API de Gestión Académica

**Versión:** 1.0

---

## Visión General

El modelo de datos se organiza en cinco grupos que reflejan las responsabilidades del sistema. Cada grupo agrupa las entidades que comparten un mismo contexto de negocio.

| Grupo                     | Entidades                                             |
| ------------------------- | ----------------------------------------------------- |
| Identidad                 | `Person`                                              |
| Estructura Organizacional | `Department`, `Career`, `AcademicPeriod`              |
| Actores Académicos        | `Professor`, `Student`                                |
| Catálogo Académico        | `CourseCategory`, `Course`                            |
| Oferta e Inscripciones    | `CourseOffering`, `Enrollment`, `EnrollmentStatusLog` |

Todos los modelos aplican las siguientes convenciones transversales:

- `createdAt` y `updatedAt` en todo registro persistido.
- `deletedAt` como mecanismo de borrado lógico. Un registro con `deletedAt` no nulo se considera inactivo, pero no es eliminado físicamente.
- Claves primarias de tipo `INT UNSIGNED AUTO_INCREMENT`, salvo en entidades que heredan su identidad de `Person` (`Professor`, `Student`), donde la clave primaria es también la clave foránea hacia `person.id`.

---

## 1. Identidad

### Person

Supertipo de todos los actores del sistema. Almacena los datos personales comunes a cualquier ser humano registrado, evitando que `Professor` y `Student` repitan los mismos campos. Una persona puede existir en el sistema sin tener aún un rol académico asignado.

| Campo       | Tipo           | Restricciones      | Descripción                                                            |
| ----------- | -------------- | ------------------ | ---------------------------------------------------------------------- |
| `id`        | `INT UNSIGNED` | PK, AUTO_INCREMENT | Identificador único de la persona                                      |
| `dni`       | `CHAR(8)`      | NOT NULL, UNIQUE   | Documento de identidad. Siempre 8 dígitos exactos bajo estándar RENIEC |
| `firstName` | `VARCHAR(100)` | NOT NULL           | Nombres de pila                                                        |
| `lastName`  | `VARCHAR(100)` | NOT NULL           | Apellidos                                                              |
| `email`     | `VARCHAR(150)` | NOT NULL, UNIQUE   | Correo electrónico personal. Es un dato de identidad, no de acceso     |
| `phone`     | `CHAR(9)`      | NULL               | Teléfono o celular. 9 dígitos exactos para el formato peruano          |
| `birthDate` | `DATE`         | NULL               | Fecha de nacimiento. Solo día, mes y año, sin hora                     |
| `createdAt` | `TIMESTAMP`    | NOT NULL           | Fecha de creación del registro                                         |
| `updatedAt` | `TIMESTAMP`    | NOT NULL           | Fecha de última modificación                                           |
| `deletedAt` | `TIMESTAMP`    | NULL               | Fecha de baja lógica. NULL indica que el registro está activo          |

**Relaciones**

- `Person` 1:1 `Professor` — Una persona puede especializarse como docente
- `Person` 1:1 `Student` — Una persona puede especializarse como estudiante

**Notas de diseño**

El correo electrónico personal vive en `Person` y no en una tabla de usuario porque es un dato de identidad de la persona, no una credencial de acceso. Esto permite registrar personas antes de que tengan cuenta activa en el sistema.

---

## 2. Estructura Organizacional

### Department

Representa las unidades académicas de la institución (facultades, escuelas, departamentos). Es el contenedor organizacional de las carreras y de los profesores.

| Campo         | Tipo           | Restricciones      | Descripción                                            |
| ------------- | -------------- | ------------------ | ------------------------------------------------------ |
| `id`          | `INT UNSIGNED` | PK, AUTO_INCREMENT | Identificador único del departamento                   |
| `name`        | `VARCHAR(100)` | NOT NULL, UNIQUE   | Nombre del departamento. Único en toda la institución  |
| `description` | `TEXT`         | NULL               | Descripción extendida. Campo informativo, no operativo |
| `createdAt`   | `TIMESTAMP`    | NOT NULL           | Fecha de creación                                      |
| `updatedAt`   | `TIMESTAMP`    | NOT NULL           | Fecha de última modificación                           |
| `deletedAt`   | `TIMESTAMP`    | NULL               | Fecha de baja lógica                                   |

**Relaciones**

- `Department` 1:N `Career` — Un departamento agrupa múltiples carreras
- `Department` 1:N `Professor` — Un departamento puede tener múltiples profesores asignados

---

### Career

Representa un programa académico formal de la institución. Es la entidad a la que el alumno se adscribe al ingresar y la que determina qué cursos puede cursar.

| Campo          | Tipo           | Restricciones                | Descripción                                                        |
| -------------- | -------------- | ---------------------------- | ------------------------------------------------------------------ |
| `id`           | `INT UNSIGNED` | PK, AUTO_INCREMENT           | Identificador único de la carrera                                  |
| `departmentId` | `INT UNSIGNED` | NOT NULL, FK `department.id` | Departamento al que pertenece la carrera                           |
| `name`         | `VARCHAR(150)` | NOT NULL, UNIQUE             | Nombre de la carrera. Único en toda la institución                 |
| `totalCredits` | `SMALLINT`     | NOT NULL                     | Total de créditos requeridos para graduarse. Debe ser mayor a cero |
| `createdAt`    | `TIMESTAMP`    | NOT NULL                     | Fecha de creación                                                  |
| `updatedAt`    | `TIMESTAMP`    | NOT NULL                     | Fecha de última modificación                                       |
| `deletedAt`    | `TIMESTAMP`    | NULL                         | Fecha de baja lógica                                               |

**Relaciones**

- `Career` N:1 `Department` — Toda carrera pertenece a un departamento
- `Career` 1:N `Student` — Una carrera tiene múltiples estudiantes inscritos
- `Career` 1:N `Course` — Una carrera tiene múltiples cursos en su plan de estudios

---

### AcademicPeriod

Define los ciclos académicos en los que opera la institución. Establece el contexto temporal de las ofertas de cursos. Solo un período puede estar marcado como vigente (`isCurrent = true`) en cualquier momento.

| Campo       | Tipo           | Restricciones               | Descripción                                                                              |
| ----------- | -------------- | --------------------------- | ---------------------------------------------------------------------------------------- |
| `id`        | `INT UNSIGNED` | PK, AUTO_INCREMENT          | Identificador único del período                                                          |
| `name`      | `VARCHAR(20)`  | NOT NULL, UNIQUE            | Código legible del período. Ej: `2025-I`, `2025-II`                                      |
| `year`      | `YEAR`         | NOT NULL                    | Año académico                                                                            |
| `semester`  | `TINYINT`      | NOT NULL, CHECK IN (1, 2)   | Número de semestre. Solo admite los valores 1 o 2                                        |
| `startDate` | `DATE`         | NOT NULL                    | Fecha de inicio del período                                                              |
| `endDate`   | `DATE`         | NOT NULL, CHECK > startDate | Fecha de cierre. Siempre posterior a `startDate`                                         |
| `isCurrent` | `BOOLEAN`      | NOT NULL, DEFAULT false     | Indica si este es el período académico activo. Solo uno puede ser `true` simultáneamente |
| `createdAt` | `TIMESTAMP`    | NOT NULL                    | Fecha de creación                                                                        |
| `updatedAt` | `TIMESTAMP`    | NOT NULL                    | Fecha de última modificación                                                             |
| `deletedAt` | `TIMESTAMP`    | NULL                        | Fecha de baja lógica                                                                     |

**Restricciones compuestas**

- UNIQUE `(year, semester)` — No pueden existir dos períodos para el mismo año y semestre

**Relaciones**

- `AcademicPeriod` 1:N `CourseOffering` — Un período contiene múltiples ofertas de cursos

**Notas de diseño**

La validación de que solo un período sea vigente al mismo tiempo se realiza en la capa de aplicación, no en la base de datos, porque requiere evaluar el conjunto completo de registros y no un valor individual.

---

## 3. Actores Académicos

### Professor

Especialización de `Person` que representa al docente de la institución. Usa herencia identificatoria: su clave primaria (`personId`) es también la clave foránea hacia `person.id`, por lo que no genera su propio identificador.

| Campo                | Tipo           | Restricciones            | Descripción                                                                  |
| -------------------- | -------------- | ------------------------ | ---------------------------------------------------------------------------- |
| `personId`           | `INT UNSIGNED` | PK, FK `person.id`       | Identificador del profesor, heredado de `Person`                             |
| `departmentId`       | `INT UNSIGNED` | NULL, FK `department.id` | Departamento al que pertenece. NULL permite registrarlo antes de asignarlo   |
| `code`               | `VARCHAR(20)`  | NOT NULL, UNIQUE         | Código administrativo inmutable asignado por la institución                  |
| `specialty`          | `VARCHAR(100)` | NULL                     | Área de especialización del docente                                          |
| `institutionalEmail` | `VARCHAR(150)` | NULL, UNIQUE             | Correo institucional. NULL permite registrar antes de asignar cuenta oficial |
| `hireDate`           | `DATE`         | NULL                     | Fecha de contratación                                                        |
| `status`             | `ENUM`         | NOT NULL, DEFAULT ACTIVE | Estado operativo del profesor. Ver valores posibles abajo                    |
| `createdAt`          | `TIMESTAMP`    | NOT NULL                 | Fecha de creación                                                            |
| `updatedAt`          | `TIMESTAMP`    | NOT NULL                 | Fecha de última modificación                                                 |
| `deletedAt`          | `TIMESTAMP`    | NULL                     | Fecha de baja lógica                                                         |

**Valores del estado `ProfessorStatus`**

| Valor      | Descripción                                                                         |
| ---------- | ----------------------------------------------------------------------------------- |
| `ACTIVE`   | Profesor operativo. Puede ser asignado a ofertas de cursos                          |
| `INACTIVE` | Profesor sin actividad. No puede asumir nuevas asignaciones                         |
| `ON_LEAVE` | Profesor en licencia temporal. No puede ser asignado hasta regularizar su situación |

**Relaciones**

- `Professor` N:1 `Person` — Extiende los datos personales de la persona
- `Professor` N:1 `Department` — Pertenece a un departamento (opcional)
- `Professor` 1:N `CourseOffering` — Puede ser asignado a múltiples ofertas de cursos

**Notas de diseño**

El campo `status` y el campo `deletedAt` tienen propósitos distintos. `deletedAt` indica si el registro existe activamente en el sistema. `status` indica en qué condición opera el docente. Un profesor en licencia (`ON_LEAVE`) sigue existiendo en el sistema pero no puede recibir nuevas asignaciones docentes.

---

### Student

Especialización de `Person` que representa al estudiante de la institución. Aplica la misma herencia identificatoria que `Professor`.

| Campo                | Tipo           | Restricciones            | Descripción                                                                            |
| -------------------- | -------------- | ------------------------ | -------------------------------------------------------------------------------------- |
| `personId`           | `INT UNSIGNED` | PK, FK `person.id`       | Identificador del alumno, heredado de `Person`                                         |
| `careerId`           | `INT UNSIGNED` | NOT NULL, FK `career.id` | Carrera a la que pertenece el alumno. Obligatorio desde el registro inicial            |
| `code`               | `CHAR(10)`     | NOT NULL, UNIQUE         | Código universitario. Asignado al ingreso, no cambia durante la trayectoria del alumno |
| `institutionalEmail` | `VARCHAR(150)` | NULL, UNIQUE             | Correo institucional asignado por la universidad                                       |
| `enrollmentDate`     | `DATE`         | NOT NULL                 | Fecha de ingreso del alumno a la institución                                           |
| `status`             | `ENUM`         | NOT NULL, DEFAULT ACTIVE | Estado académico del alumno. Ver valores posibles abajo                                |
| `createdAt`          | `TIMESTAMP`    | NOT NULL                 | Fecha de creación                                                                      |
| `updatedAt`          | `TIMESTAMP`    | NOT NULL                 | Fecha de última modificación                                                           |
| `deletedAt`          | `TIMESTAMP`    | NULL                     | Fecha de baja lógica                                                                   |

**Valores del estado `StudentStatus`**

| Valor       | Descripción                                                            |
| ----------- | ---------------------------------------------------------------------- |
| `ACTIVE`    | Alumno matriculado y operativo. Puede inscribirse en ofertas de cursos |
| `INACTIVE`  | Alumno sin actividad académica. No puede generar nuevas inscripciones  |
| `GRADUATED` | Alumno que completó el plan de estudios                                |
| `WITHDRAWN` | Alumno que se retiró voluntariamente                                   |
| `SUSPENDED` | Alumno con restricción temporal por causa administrativa o académica   |

**Relaciones**

- `Student` N:1 `Person` — Extiende los datos personales de la persona
- `Student` N:1 `Career` — Pertenece a una carrera. Solo puede inscribirse en cursos de esa carrera
- `Student` 1:N `Enrollment` — Puede tener múltiples inscripciones a lo largo de su trayectoria

---

## 4. Catálogo Académico

### CourseCategory

Agrupa los cursos del catálogo por categorías temáticas. Es una entidad de clasificación opcional: un curso puede existir sin categoría asignada.

| Campo         | Tipo           | Restricciones      | Descripción                                          |
| ------------- | -------------- | ------------------ | ---------------------------------------------------- |
| `id`          | `INT UNSIGNED` | PK, AUTO_INCREMENT | Identificador único de la categoría                  |
| `name`        | `VARCHAR(100)` | NOT NULL, UNIQUE   | Nombre de la categoría. Único en toda la institución |
| `description` | `TEXT`         | NULL               | Descripción de la categoría                          |
| `createdAt`   | `TIMESTAMP`    | NOT NULL           | Fecha de creación                                    |
| `updatedAt`   | `TIMESTAMP`    | NOT NULL           | Fecha de última modificación                         |
| `deletedAt`   | `TIMESTAMP`    | NULL               | Fecha de baja lógica                                 |

**Relaciones**

- `CourseCategory` 1:N `Course` — Una categoría puede agrupar múltiples cursos del catálogo

---

### Course

Representa una unidad académica formal del plan de estudios de una carrera. Es la definición permanente del curso, independiente de cuándo o cuántas veces se dicte. Su disponibilidad real queda determinada por las ofertas que se generen a partir de él.

| Campo         | Tipo           | Restricciones                 | Descripción                                         |
| ------------- | -------------- | ----------------------------- | --------------------------------------------------- |
| `id`          | `INT UNSIGNED` | PK, AUTO_INCREMENT            | Identificador único del curso                       |
| `careerId`    | `INT UNSIGNED` | NOT NULL, FK `career.id`      | Carrera a la que pertenece este curso               |
| `categoryId`  | `INT UNSIGNED` | NULL, FK `course_category.id` | Categoría temática del curso. Opcional              |
| `name`        | `VARCHAR(150)` | NOT NULL                      | Nombre del curso. Único dentro de la misma carrera  |
| `description` | `TEXT`         | NULL                          | Descripción del contenido del curso                 |
| `credits`     | `TINYINT`      | NOT NULL                      | Cantidad de créditos académicos que otorga el curso |
| `createdAt`   | `TIMESTAMP`    | NOT NULL                      | Fecha de creación                                   |
| `updatedAt`   | `TIMESTAMP`    | NOT NULL                      | Fecha de última modificación                        |
| `deletedAt`   | `TIMESTAMP`    | NULL                          | Fecha de baja lógica                                |

**Restricciones compuestas**

- UNIQUE `(careerId, name)` — No pueden existir dos cursos con el mismo nombre dentro de la misma carrera

**Relaciones**

- `Course` N:1 `Career` — Todo curso pertenece a una carrera
- `Course` N:1 `CourseCategory` — Un curso puede tener una categoría (opcional)
- `Course` 1:N `CourseOffering` — Un curso puede tener múltiples ofertas a lo largo de los períodos académicos

---

## 5. Oferta e Inscripciones

### CourseOffering

Es la entidad operativa central del sistema. Representa la instancia concreta de un curso del catálogo en un período académico específico: qué curso se dicta, en qué período, en qué sección, con qué profesor, con cuántos cupos y hasta cuándo se puede inscribir.

| Campo                | Tipo           | Restricciones                     | Descripción                                                                            |
| -------------------- | -------------- | --------------------------------- | -------------------------------------------------------------------------------------- |
| `id`                 | `INT UNSIGNED` | PK, AUTO_INCREMENT                | Identificador único de la oferta                                                       |
| `courseId`           | `INT UNSIGNED` | NOT NULL, FK `course.id`          | Curso del catálogo que esta oferta instancia                                           |
| `academicPeriodId`   | `INT UNSIGNED` | NOT NULL, FK `academic_period.id` | Período académico al que pertenece la oferta                                           |
| `professorId`        | `INT UNSIGNED` | NULL, FK `professor.person_id`    | Profesor asignado. NULL cuando la oferta aún está en preparación                       |
| `section`            | `VARCHAR(10)`  | NOT NULL, DEFAULT 'A'             | Identificador de sección. Permite múltiples grupos del mismo curso en el mismo período |
| `maxStudents`        | `SMALLINT`     | NOT NULL, DEFAULT 30              | Capacidad máxima de estudiantes inscritos                                              |
| `enrollmentDeadline` | `DATE`         | NULL                              | Fecha límite para inscribirse. NULL indica sin fecha límite definida                   |
| `status`             | `ENUM`         | NOT NULL, DEFAULT INACTIVE        | Estado del ciclo de vida de la oferta. Ver valores posibles abajo                      |
| `createdAt`          | `TIMESTAMP`    | NOT NULL                          | Fecha de creación                                                                      |
| `updatedAt`          | `TIMESTAMP`    | NOT NULL                          | Fecha de última modificación                                                           |
| `deletedAt`          | `TIMESTAMP`    | NULL                              | Fecha de baja lógica                                                                   |

**Restricciones compuestas**

- UNIQUE `(courseId, academicPeriodId, section)` — No pueden existir dos ofertas para el mismo curso, en el mismo período y con la misma sección

**Valores del estado `CourseOfferingStatus`**

| Valor       | Descripción                                                                                        |
| ----------- | -------------------------------------------------------------------------------------------------- |
| `INACTIVE`  | Creada pero en preparación. No acepta inscripciones. Requiere profesor asignado antes de activarse |
| `ACTIVE`    | Vigente. Acepta inscripciones mientras no se supere `maxStudents` ni se pase `enrollmentDeadline`  |
| `CANCELLED` | No se dictará. Bloquea nuevas inscripciones. Estado terminal                                       |
| `COMPLETED` | Ciclo cerrado. Solo disponible como referencia histórica. Estado terminal                          |

**Relaciones**

- `CourseOffering` N:1 `Course` — Instancia un curso del catálogo
- `CourseOffering` N:1 `AcademicPeriod` — Pertenece a un período académico
- `CourseOffering` N:1 `Professor` — Tiene asignado un profesor (opcional en INACTIVE)
- `CourseOffering` 1:N `Enrollment` — Puede tener múltiples inscripciones de alumnos

**Notas de diseño**

Una oferta nacida de la combinación `(courseId, academicPeriodId, section)` es única. Esto permite que un mismo curso se dicte en múltiples secciones dentro del mismo período (sección A, sección B, etc.) sin conflicto, pero impide crear dos ofertas idénticas por error.

---

### Enrollment

Materializa la inscripción de un alumno en una oferta de curso. Es la relación central del sistema desde el punto de vista académico. Cada registro representa el vínculo formal entre un estudiante y una instancia concreta del dictado de un curso.

| Campo              | Tipo           | Restricciones                     | Descripción                                                                           |
| ------------------ | -------------- | --------------------------------- | ------------------------------------------------------------------------------------- |
| `id`               | `INT UNSIGNED` | PK, AUTO_INCREMENT                | Identificador único de la inscripción                                                 |
| `studentId`        | `INT UNSIGNED` | NOT NULL, FK `student.person_id`  | Alumno inscrito                                                                       |
| `courseOfferingId` | `INT UNSIGNED` | NOT NULL, FK `course_offering.id` | Oferta de curso en la que se inscribió                                                |
| `status`           | `ENUM`         | NOT NULL, DEFAULT ENROLLED        | Estado actual de la inscripción                                                       |
| `enrollmentDate`   | `DATE`         | NOT NULL                          | Fecha en que se realizó la inscripción                                                |
| `createdBy`        | `INT UNSIGNED` | NULL                              | Referencia al usuario que procesó la inscripción. NULL para inscripciones automáticas |
| `createdAt`        | `TIMESTAMP`    | NOT NULL                          | Fecha de creación del registro                                                        |
| `updatedAt`        | `TIMESTAMP`    | NOT NULL                          | Fecha de última modificación                                                          |
| `deletedAt`        | `TIMESTAMP`    | NULL                              | Fecha de baja lógica                                                                  |

**Restricciones compuestas**

- UNIQUE `(studentId, courseOfferingId)` — Un alumno no puede estar inscrito dos veces en la misma oferta

**Valores del estado `EnrollmentStatus`**

| Valor       | Descripción                                                 |
| ----------- | ----------------------------------------------------------- |
| `ENROLLED`  | Inscripción activa y vigente                                |
| `WITHDRAWN` | El alumno se retiró del curso                               |
| `COMPLETED` | El alumno completó el curso al cierre del período           |
| `SUSPENDED` | Inscripción suspendida por causa académica o administrativa |

**Relaciones**

- `Enrollment` N:1 `Student` — Pertenece a un alumno
- `Enrollment` N:1 `CourseOffering` — Pertenece a una oferta de curso
- `Enrollment` 1:N `EnrollmentStatusLog` — Registra el historial de cambios de estado

---

### EnrollmentStatusLog

Registra cada cambio de estado que sufre una inscripción a lo largo del tiempo. Es una tabla de solo inserción: sus registros no se modifican ni se eliminan. Provee la trazabilidad completa del historial de una inscripción, más allá del estado actual que almacena `Enrollment`.

| Campo            | Tipo           | Restricciones                | Descripción                                                                                              |
| ---------------- | -------------- | ---------------------------- | -------------------------------------------------------------------------------------------------------- |
| `id`             | `INT UNSIGNED` | PK, AUTO_INCREMENT           | Identificador único del evento                                                                           |
| `enrollmentId`   | `INT UNSIGNED` | NOT NULL, FK `enrollment.id` | Inscripción a la que pertenece este evento                                                               |
| `previousStatus` | `ENUM`         | NULL                         | Estado anterior a la transición. NULL en el primer evento, cuando la inscripción nació sin estado previo |
| `newStatus`      | `ENUM`         | NOT NULL                     | Estado al que se transitó                                                                                |
| `reason`         | `TEXT`         | NULL                         | Motivo del cambio. NULL para transiciones automáticas del sistema                                        |
| `changedBy`      | `INT UNSIGNED` | NULL                         | Usuario que procesó el cambio. NULL para cambios automáticos                                             |
| `createdAt`      | `TIMESTAMP`    | NOT NULL                     | Fecha y hora exacta del evento                                                                           |

**Relaciones**

- `EnrollmentStatusLog` N:1 `Enrollment` — Cada evento pertenece a una inscripción

**Notas de diseño**

`EnrollmentStatusLog` no tiene `updatedAt` ni `deletedAt` porque sus registros son inmutables por diseño. Cada evento es una fotografía en el tiempo: qué pasó, desde qué estado, hacia qué estado, cuándo y quién lo hizo. Esta tabla es la fuente de verdad para cualquier auditoría futura sobre el historial académico de un alumno.

---

## 6. Flujo de Dependencias entre Entidades

Las entidades se construyen en capas. Cada capa depende de las anteriores y no puede existir sin ellas.

| Capa        | Entidades                                    | Depende de                              |
| ----------- | -------------------------------------------- | --------------------------------------- |
| Base        | `Person`, `Department`                       | Sin dependencias externas               |
| Estructura  | `Career`, `AcademicPeriod`, `CourseCategory` | `Department`                            |
| Actores     | `Professor`, `Student`                       | `Person`, `Department`, `Career`        |
| Catálogo    | `Course`                                     | `Career`, `CourseCategory`              |
| Oferta      | `CourseOffering`                             | `Course`, `AcademicPeriod`, `Professor` |
| Inscripción | `Enrollment`, `EnrollmentStatusLog`          | `Student`, `CourseOffering`             |
