# Requirements

## Propósito

Este documento define los requerimientos del sistema backend de gestión académica.

Su objetivo es describir el problema que resuelve el sistema, el alcance funcional inicial, las reglas de negocio principales, los requerimientos funcionales y los requerimientos no funcionales que deben cumplirse para considerar válido el desarrollo.

Este documento no describe la organización interna del código ni la arquitectura técnica. Su enfoque es funcional: qué debe hacer el sistema y bajo qué condiciones debe operar.

## Alcance del sistema

El sistema corresponde a una API backend para gestión académica universitaria.

La API centraliza información relacionada con personas, profesores, estudiantes, departamentos, carreras, categorías de curso, cursos, periodos académicos, ofertas de curso e inscripciones.

El alcance funcional se concentra en la administración de datos académicos base y en los procesos que relacionan dichos datos. No cubre, en esta etapa, procesos avanzados como evaluación, asistencia, pagos, autenticación compleja, horarios detallados o gestión documental institucional.

## Contexto del sistema

Las instituciones de educación superior manejan información distribuida entre distintos actores y procesos: estudiantes, docentes, carreras, departamentos, cursos, periodos académicos, ofertas de curso e inscripciones.

Cuando esta información se gestiona de forma manual o fragmentada, aparecen problemas de duplicidad, inconsistencia, falta de trazabilidad y dificultad para consultar datos relacionados.

El sistema busca resolver ese problema mediante una API REST que centraliza, valida y expone información académica fundamental de forma estructurada, consistente y mantenible.

## Objetivos generales

El sistema tiene los siguientes objetivos generales:

```txt
- Centralizar la gestión de información académica base.
- Mantener consistencia entre actores académicos y procesos de matrícula.
- Exponer una API REST clara para clientes externos.
- Aplicar validaciones antes de persistir información.
- Garantizar trazabilidad mediante auditoría básica y borrado lógico.
- Mantener separación entre lógica de negocio, presentación e infraestructura.
```

## Módulos funcionales contemplados

El sistema se organiza en módulos funcionales. Cada módulo representa una capacidad del negocio académico.

```txt
persons
= datos personales comunes a estudiantes y profesores

professors
= información académica y operativa de docentes

students
= información académica y operativa de estudiantes

departments
= unidades académicas o administrativas

careers
= programas académicos o carreras

course-categories
= clasificación temática de cursos

courses
= catálogo permanente de cursos

academic-periods
= periodos académicos de dictado

course-offerings
= instancias concretas de cursos en periodos específicos

enrollments
= inscripción de estudiantes en ofertas de curso
```

## Requerimientos de negocio

Los requerimientos de negocio describen reglas y necesidades propias del dominio académico, independientemente de la tecnología utilizada.

## Personas

Una persona representa la información de identidad común a distintos actores del sistema.

El sistema mantiene datos como documento de identidad, nombres, apellidos, correo, teléfono y fecha de nacimiento. Estos datos pueden ser utilizados por módulos como estudiantes y profesores sin duplicar información personal.

Reglas principales:

```txt
- Una persona se identifica mediante un documento único.
- El correo personal debe ser único cuando se usa como identificador de contacto.
- Una persona puede estar asociada a un estudiante, a un profesor o a ambos si el modelo de negocio lo permite.
```

## Profesores

Un profesor representa a un docente dentro de la institución.

Un profesor se asocia a una persona existente o creada durante el proceso de registro. Además de sus datos personales, posee información académica u operativa como código, departamento, especialidad, correo institucional, fecha de contratación y estado.

Reglas principales:

```txt
- El código de profesor debe ser único.
- El correo institucional del profesor debe ser único cuando exista.
- Un profesor puede pertenecer a un departamento.
- Solo profesores válidos y activos pueden ser asignados a ofertas de curso según las reglas del proceso.
```

## Estudiantes

Un estudiante representa a un alumno registrado en la institución.

Un estudiante se asocia a una persona existente o creada durante el proceso de registro. Además de sus datos personales, posee información académica como código, carrera, año de admisión y estado.

Reglas principales:

```txt
- El código de estudiante debe ser único.
- Un estudiante pertenece a una carrera.
- El estado del estudiante determina si puede participar en ciertos procesos académicos.
- La importación masiva permite registrar estudiantes desde archivos estructurados.
```

## Departamentos

Un departamento representa una unidad académica u organizacional.

Puede agrupar profesores, carreras u otros elementos académicos según el modelo institucional.

Reglas principales:

```txt
- Un departamento tiene un nombre único o identificador institucional.
- Un departamento puede estar activo o inactivo.
- No se debe usar un departamento inexistente o inactivo en relaciones que requieran validez académica.
```

## Carreras

Una carrera representa un programa académico.

Se asocia con estudiantes, cursos u otros elementos del modelo académico según corresponda.

Reglas principales:

```txt
- Una carrera debe estar registrada antes de asociar estudiantes o cursos.
- Una carrera puede tener estado activo o inactivo.
- Los procesos académicos pueden validar que estudiante, curso u oferta pertenezcan a carreras compatibles.
```

## Categorías de curso

Una categoría de curso clasifica cursos por área, línea académica o agrupación temática.

Reglas principales:

```txt
- Una categoría puede ser opcional para un curso.
- Una categoría permite organizar el catálogo académico.
- Una categoría inactiva no debe usarse para nuevas asociaciones si el proceso lo restringe.
```

## Cursos

Un curso representa una unidad académica permanente dentro del catálogo institucional.

No representa necesariamente un dictado específico en un periodo. Esa responsabilidad corresponde a las ofertas de curso.

Reglas principales:

```txt
- Un curso tiene código y nombre.
- El código de curso debe ser único.
- Un curso puede pertenecer a una carrera y a una categoría.
- Un curso puede estar activo o inactivo.
- Un curso inactivo no debe generar nuevas ofertas si las reglas del proceso lo impiden.
```

## Periodos académicos

Un periodo académico representa un ciclo de dictado, matrícula o actividad académica.

Reglas principales:

```txt
- Un periodo académico tiene fechas de inicio y cierre.
- Puede existir un periodo vigente según la regla institucional.
- Las ofertas de curso se asocian a un periodo académico.
- Las inscripciones dependen de la vigencia o apertura del periodo y de la oferta.
```

## Ofertas de curso

Una oferta de curso representa una instancia concreta de un curso en un periodo académico.

Incluye información como sección, cupos, profesor asignado, estado y fecha límite de inscripción.

Reglas principales:

```txt
- Una oferta pertenece a un curso.
- Una oferta pertenece a un periodo académico.
- Una oferta puede tener un profesor asignado.
- La combinación curso, periodo y sección debe ser única.
- Una oferta puede estar activa, inactiva, cerrada o en otro estado definido por el dominio.
- Solo ofertas abiertas y válidas pueden recibir inscripciones.
```

## Inscripciones

Una inscripción representa el vínculo formal entre un estudiante y una oferta de curso.

Reglas principales:

```txt
- Un estudiante no puede inscribirse dos veces en la misma oferta activa.
- La oferta debe existir y estar abierta para matrícula.
- El estudiante debe existir y cumplir las condiciones necesarias para inscribirse.
- La inscripción conserva su estado e historial lógico.
- Las restricciones de carrera, periodo o cupo se validan antes de registrar la inscripción.
```

## Requerimientos funcionales

Los requerimientos funcionales describen capacidades observables que la API debe ofrecer.

## Personas

| ID | Nombre | Descripción | Condiciones de error |
| --- | --- | --- | --- |
| RF-PER-01 | Crear persona | Permite registrar una persona con datos de identidad y contacto. | Error si el documento o correo ya existen, o si los campos obligatorios son inválidos. |
| RF-PER-02 | Consultar persona | Permite obtener información de una persona existente. | Error si la persona no existe o fue eliminada lógicamente. |
| RF-PER-03 | Verificar existencia | Permite validar si una persona existe para uso de otros módulos. | Retorna resultado negativo si no existe o no está disponible. |

## Profesores

| ID | Nombre | Descripción | Condiciones de error |
| --- | --- | --- | --- |
| RF-PRO-01 | Crear profesor | Permite registrar un profesor asociado a datos personales y académicos. | Error si el código o correo institucional ya existen, o si el departamento indicado no existe. |
| RF-PRO-02 | Listar profesores | Permite listar profesores con filtros y paginación. | Error si los filtros son inválidos. |
| RF-PRO-03 | Consultar profesor | Permite obtener el detalle de un profesor. | Error si el profesor no existe. |
| RF-PRO-04 | Verificar profesor | Permite validar existencia o estado del profesor para otros módulos. | Retorna resultado negativo si no cumple la condición consultada. |

## Estudiantes

| ID | Nombre | Descripción | Condiciones de error |
| --- | --- | --- | --- |
| RF-STU-01 | Crear estudiante | Permite registrar un estudiante asociado a una persona y una carrera. | Error si el código ya existe, si la carrera no existe o si los datos son inválidos. |
| RF-STU-02 | Listar estudiantes | Permite listar estudiantes con filtros y paginación. | Error si los filtros son inválidos. |
| RF-STU-03 | Consultar estudiante | Permite obtener el detalle de un estudiante. | Error si el estudiante no existe. |
| RF-STU-04 | Importar estudiantes | Permite registrar estudiantes desde un archivo estructurado. | Error si el archivo no tiene formato válido o si las filas contienen datos inválidos. |
| RF-STU-05 | Verificar estudiante | Permite validar existencia o estado del estudiante para otros módulos. | Retorna resultado negativo si no cumple la condición consultada. |

## Departamentos

| ID | Nombre | Descripción | Condiciones de error |
| --- | --- | --- | --- |
| RF-DEP-01 | Crear departamento | Permite registrar un departamento académico. | Error si el nombre o código ya existe. |
| RF-DEP-02 | Listar departamentos | Permite consultar departamentos disponibles. | Error si los filtros son inválidos. |
| RF-DEP-03 | Verificar departamento | Permite validar existencia o estado del departamento. | Retorna resultado negativo si no cumple la condición consultada. |

## Carreras

| ID | Nombre | Descripción | Condiciones de error |
| --- | --- | --- | --- |
| RF-CAR-01 | Crear carrera | Permite registrar una carrera o programa académico. | Error si el código o nombre ya existe. |
| RF-CAR-02 | Listar carreras | Permite consultar carreras disponibles. | Error si los filtros son inválidos. |
| RF-CAR-03 | Verificar carrera | Permite validar existencia o estado de una carrera. | Retorna resultado negativo si no cumple la condición consultada. |

## Categorías de curso

| ID | Nombre | Descripción | Condiciones de error |
| --- | --- | --- | --- |
| RF-CCA-01 | Crear categoría | Permite registrar una categoría de curso. | Error si el nombre ya existe. |
| RF-CCA-02 | Listar categorías | Permite consultar categorías disponibles. | Error si los filtros son inválidos. |

## Cursos

| ID | Nombre | Descripción | Condiciones de error |
| --- | --- | --- | --- |
| RF-COU-01 | Crear curso | Permite registrar un curso en el catálogo académico. | Error si el código ya existe o si las referencias indicadas no son válidas. |
| RF-COU-02 | Listar cursos | Permite listar cursos con filtros y paginación. | Error si los filtros son inválidos. |
| RF-COU-03 | Consultar curso | Permite obtener el detalle de un curso. | Error si el curso no existe. |
| RF-COU-04 | Verificar curso | Permite validar existencia o estado del curso para otros módulos. | Retorna resultado negativo si no cumple la condición consultada. |

## Periodos académicos

| ID | Nombre | Descripción | Condiciones de error |
| --- | --- | --- | --- |
| RF-ACP-01 | Crear periodo académico | Permite registrar un periodo académico con fechas y estado. | Error si las fechas son inválidas o si contradicen reglas de vigencia. |
| RF-ACP-02 | Listar periodos académicos | Permite consultar periodos registrados. | Error si los filtros son inválidos. |
| RF-ACP-03 | Verificar periodo académico | Permite validar existencia, vigencia o estado de un periodo. | Retorna resultado negativo si no cumple la condición consultada. |

## Ofertas de curso

| ID | Nombre | Descripción | Condiciones de error |
| --- | --- | --- | --- |
| RF-COF-01 | Crear oferta de curso | Permite crear una oferta para un curso en un periodo y sección. | Error si curso o periodo no existen, o si la combinación curso-periodo-sección ya existe. |
| RF-COF-02 | Listar ofertas de curso | Permite listar ofertas con filtros y paginación. | Error si los filtros son inválidos. |
| RF-COF-03 | Consultar oferta de curso | Permite obtener el detalle de una oferta. | Error si la oferta no existe. |
| RF-COF-04 | Asignar profesor | Permite asignar o reasignar un profesor a una oferta. | Error si la oferta no existe, si el profesor no existe o si la oferta no permite asignación. |
| RF-COF-05 | Activar oferta | Permite activar una oferta de curso. | Error si la oferta no existe o no cumple condiciones para activarse. |
| RF-COF-06 | Verificar oferta | Permite validar existencia, estado o apertura de una oferta para otros módulos. | Retorna resultado negativo si no cumple la condición consultada. |

## Inscripciones

| ID | Nombre | Descripción | Condiciones de error |
| --- | --- | --- | --- |
| RF-ENR-01 | Crear inscripción | Permite inscribir un estudiante en una oferta de curso. | Error si estudiante u oferta no existen, si la oferta no está abierta o si ya existe inscripción activa. |
| RF-ENR-02 | Listar inscripciones | Permite listar inscripciones con filtros y paginación. | Error si los filtros son inválidos. |
| RF-ENR-03 | Consultar inscripción | Permite obtener el detalle de una inscripción. | Error si la inscripción no existe. |
| RF-ENR-04 | Cambiar estado de inscripción | Permite actualizar el estado de una inscripción según reglas definidas. | Error si la transición de estado no está permitida. |

## Requerimientos no funcionales

Los requerimientos no funcionales describen condiciones de calidad, operación y mantenimiento que el sistema debe cumplir.

| ID | Categoría | Nombre | Descripción |
| --- | --- | --- | --- |
| RNF-01 | Formato | Respuestas JSON | Todas las respuestas de la API se entregan en JSON. |
| RNF-02 | Validación | Validación de entrada | Todo dato recibido por HTTP se valida antes de llegar a la lógica de aplicación. |
| RNF-03 | Errores | Manejo estructurado de errores | Los errores conocidos se devuelven con una estructura consistente y no como errores genéricos. |
| RNF-04 | Mantenibilidad | Separación de responsabilidades | La lógica de negocio, presentación e infraestructura permanecen separadas. |
| RNF-05 | Mantenibilidad | Independencia de módulos | Los módulos colaboran mediante contratos explícitos y no acceden a implementaciones internas de otros módulos. |
| RNF-06 | Persistencia | Borrado lógico | Los registros se eliminan lógicamente mediante un campo de baja, no con eliminación física. |
| RNF-07 | Persistencia | Auditoría básica | Los registros persistidos mantienen fecha de creación y actualización. |
| RNF-08 | Consistencia | Unicidad de datos | Los identificadores únicos se validan en aplicación y se respaldan con restricciones de base de datos. |
| RNF-09 | Rendimiento | Paginación | Los listados soportan paginación para evitar respuestas excesivamente grandes. |
| RNF-10 | Documentación | OpenAPI | La API cuenta con documentación interactiva generada desde el código. |
| RNF-11 | Reproducibilidad | Seeds | El proyecto incluye datos iniciales reproducibles para entorno de desarrollo. |
| RNF-12 | Calidad | Tipado estático | El proyecto usa TypeScript para definir contratos explícitos entre capas. |
| RNF-13 | Calidad | Formato y linting | El código mantiene formato y reglas de calidad mediante herramientas automáticas. |

## Restricciones del sistema

El sistema opera bajo las siguientes restricciones:

```txt
- La API se expone como backend REST.
- La persistencia se realiza sobre una base de datos relacional.
- El acceso a datos se realiza mediante Prisma.
- Los recursos de Prisma permanecen fuera del código fuente de ejecución.
- Los módulos funcionales mantienen fronteras internas.
```

## Criterios generales de aceptación

El sistema cumple su alcance inicial cuando:

```txt
- Los módulos funcionales principales pueden registrar y consultar información académica.
- Las reglas de unicidad se respetan.
- Las relaciones entre módulos se validan antes de persistir operaciones.
- Los listados soportan paginación.
- Los errores conocidos se devuelven de forma estructurada.
- La documentación OpenAPI refleja los endpoints disponibles.
- El proyecto puede inicializar una base de datos con seeds.
- El código mantiene separación entre presentación, aplicación, dominio e infraestructura.
```

## Resumen

`requirements.md` define qué debe resolver el sistema y qué condiciones debe cumplir.

Su función es servir como base funcional y no funcional para el desarrollo del backend de gestión académica.
