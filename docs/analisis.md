# Análisis del Sistema

## API de Gestión Académica

**Fecha:** 09 de marzo de 2026
**Alcance:** Sistema backend de gestión académica universitaria, módulos de Profesores, Alumnos, Cursos e Inscripciones.

---

## 1. Contexto del Sistema

Las instituciones de educación superior operan con una estructura de datos compleja donde coexisten actores de distintos roles —docentes y estudiantes—, catálogos de oferta académica y procesos de matrícula que los relacionan. La gestión manual o fragmentada de esta información genera inconsistencias, dificulta el acceso a datos consolidados y limita la trazabilidad de los procesos académicos.

El presente sistema surge como respuesta a esa necesidad. Su propósito es proveer una interfaz de programación de aplicaciones (API REST) que centralice, valide y exponga la información académica fundamental de forma estructurada, confiable y accesible para cualquier cliente que la consuma, ya sea una aplicación web, móvil o cualquier integración futura.

## 2. Alcance Inicial

El sistema no pretende ser un ERP académico completo en esta primera iteración. Se delimita estrictamente a los procesos core de registro de actores y gestión del catálogo de cursos con sus relaciones, sentando las bases sobre las que se construirán módulos futuros como evaluación, asistencia o seguridad.

Los módulos contemplados en esta etapa son:

- Gestión de profesores
- Gestión de alumnos
- Gestión de cursos
- Gestión de inscripciones

## 3. Requerimientos de Negocio

Los requerimientos de negocio describen qué debe resolver el sistema en términos del dominio académico, independientemente de la tecnología utilizada. Son las reglas y verdades que el sistema debe respetar para ser válido dentro del contexto universitario.

### 3.1 Gestión de Profesores

La institución necesita mantener un registro actualizado de sus docentes. Un profesor es un actor académico identificado por su nombre completo y correo electrónico institucional. El correo electrónico es un identificador único dentro del sistema: no pueden existir dos profesores con el mismo correo. El sistema debe ser capaz de registrar nuevos profesores y listar los existentes para consulta administrativa.

Un profesor puede estar asignado a un curso, pero esta asignación no es obligatoria al momento de crear el curso. La relación entre profesor y curso es de uno a muchos desde el punto de vista del profesor: un docente puede ser responsable de múltiples cursos, pero un curso solo puede tener un único profesor asignado en un momento dado. La asignación puede realizarse o modificarse en cualquier momento del ciclo de vida del curso.

### 3.2 Gestión de Alumnos

La institución requiere un registro de sus estudiantes que permita identificarlos de forma única tanto por su correo electrónico como por su código universitario. El código es un identificador institucional asignado al alumno al momento de su ingreso y no cambia durante toda su trayectoria en la institución. Tampoco pueden existir dos alumnos con el mismo código ni con el mismo correo electrónico.

El sistema debe permitir registrar alumnos de forma individual para los casos de admisión ordinaria. Sin embargo, existe también la necesidad de incorporar alumnos de forma masiva desde archivos estructurados, dado que en procesos de admisión por lote o migración de datos históricos puede requerirse registrar decenas o cientos de alumnos en una sola operación.

### 3.3 Gestión de Cursos

Un curso representa una unidad de oferta académica de la institución. Se identifica por un nombre y puede tener una descripción opcional que amplíe su contenido. Todo curso tiene un estado que puede ser activo o inactivo. Esta distinción es relevante para el negocio: un curso inactivo no debe poder recibir nuevas inscripciones, aunque sus inscripciones históricas permanezcan registradas. El estado del curso es por tanto una regla de negocio con efecto directo sobre otros procesos.

El sistema debe permitir crear cursos, consultarlos individualmente con su detalle completo —incluyendo el profesor asignado y la lista de alumnos inscritos— y listarlos para una vista administrativa general.

### 3.4 Gestión de Inscripciones

La inscripción es el proceso que vincula a un alumno con un curso. Es la relación central del sistema desde el punto de vista académico. Las reglas de negocio que gobiernan este proceso son precisas: un alumno no puede estar inscrito dos veces en el mismo curso, lo que significa que la combinación de alumno y curso debe ser única dentro del sistema. Además, solo se pueden generar inscripciones en cursos cuyo estado sea activo, ya que inscribir a un alumno en un curso inactivo carecería de sentido académico.

Desde la perspectiva del curso, este puede tener muchos alumnos inscritos. Desde la perspectiva del alumno, este puede estar inscrito en múltiples cursos simultáneamente. La inscripción es la entidad que materializa esta relación muchos a muchos entre alumnos y cursos.

## 4. Requerimientos Funcionales

### 4.1 Módulo: Profesores

| ID     | Nombre                | Descripción                                                                                            | Condiciones de error                                                                                             |
| ------ | --------------------- | ------------------------------------------------------------------------------------------------------ | ---------------------------------------------------------------------------------------------------------------- |
| RF-P01 | Registro de profesor  | El sistema permite registrar un nuevo profesor proporcionando nombres, apellidos y correo electrónico. | 400 si algún campo obligatorio falta o tiene formato inválido. 400 si ya existe un profesor con el mismo correo. |
| RF-P02 | Listado de profesores | El sistema retorna la colección de todos los profesores registrados con sus datos esenciales.          | N/A                                                                                                              |

### 4.2 Módulo: Alumnos

| ID     | Nombre             | Descripción                                                                                                                                                                                 | Condiciones de error                                                                                                  |
| ------ | ------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------- |
| RF-A01 | Registro de alumno | El sistema permite registrar un alumno proporcionando nombres, apellidos, código universitario y correo electrónico.                                                                        | 400 si algún campo obligatorio falta o tiene formato inválido. 400 si el correo o el código ya existen en el sistema. |
| RF-A02 | Listado de alumnos | El sistema retorna la colección de todos los alumnos registrados con sus datos identificadores.                                                                                             | N/A                                                                                                                   |
| RF-A03 | Importación masiva | El sistema acepta un archivo estructurado, procesa cada fila como un alumno a registrar, persiste los válidos y retorna un resumen con los registros exitosos y los fallidos con su motivo. | 400 si el archivo no tiene el formato esperado o las columnas requeridas no existen.                                  |

### 4.3 Módulo: Cursos

| ID     | Nombre                 | Descripción                                                                                                                                | Condiciones de error                                                                                                                  |
| ------ | ---------------------- | ------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------- |
| RF-C01 | Creación de curso      | El sistema permite crear un curso con nombre, descripción opcional y estado. Si no se envía estado, el curso nace como activo por defecto. | 400 si el nombre no se proporciona.                                                                                                   |
| RF-C02 | Listado de cursos      | El sistema retorna la colección de cursos, filtrable opcionalmente por estado (activo / inactivo).                                         | N/A                                                                                                                                   |
| RF-C03 | Detalle de curso       | El sistema retorna la información completa de un curso: nombre, descripción, estado, profesor asignado y lista de alumnos inscritos.       | 404 si el identificador no corresponde a ningún curso existente.                                                                      |
| RF-C04 | Asignación de profesor | El sistema permite asociar un profesor existente a un curso existente.                                                                     | 404 si el curso no existe. 404 si el profesor no existe.                                                                              |
| RF-C05 | Inscripción de alumno  | El sistema permite inscribir un alumno existente en un curso existente activo.                                                             | 404 si el curso no existe. 404 si el alumno no existe. 400 si el curso está inactivo. 400 si el alumno ya está inscrito en ese curso. |

## 5. Requerimientos No Funcionales

| ID     | Categoría        | Nombre                      | Descripción                                                                                                                                                                                                                                        |
| ------ | ---------------- | --------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| RNF-01 | Formato          | Respuestas en JSON          | Todas las respuestas de la API, tanto de éxito como de error, deben estar en formato JSON. No se aceptan respuestas en texto plano ni HTML bajo ninguna circunstancia.                                                                             |
| RNF-02 | Confiabilidad    | Manejo explícito de errores | Los errores de validación retornan HTTP 400 con detalle por campo. Los recursos no encontrados retornan HTTP 404. Ningún error de dominio conocido puede llegar al consumidor como un error genérico 500.                                          |
| RNF-03 | Confiabilidad    | Validación de entrada       | Todo dato que ingrese al sistema debe ser validado en la capa de presentación antes de llegar a la lógica de negocio. La validación cubre campos obligatorios, formato de correo, tipos de dato y longitudes máximas.                              |
| RNF-04 | Mantenibilidad   | Separación de capas         | La lógica de negocio, la capa HTTP y la capa de persistencia deben estar estrictamente separadas. Un cambio de ORM no debe afectar la lógica de negocio. Un cambio en el contrato de la API no debe afectar la persistencia.                       |
| RNF-05 | Mantenibilidad   | Organización del código     | Cada componente tiene una responsabilidad única y clara. Los controladores no contienen lógica de negocio. Los casos de uso no acceden directamente a la base de datos. Las dependencias entre módulos son explícitas y unidireccionales.          |
| RNF-06 | Consistencia     | Unicidad de datos           | Las restricciones de unicidad —correo electrónico y código de alumno— deben estar garantizadas en dos niveles: validación previa en la capa de aplicación y constraints únicos en el esquema de base de datos.                                     |
| RNF-07 | Escalabilidad    | Independencia de módulos    | Cada módulo debe ser independiente. Agregar un nuevo módulo no debe requerir modificar los existentes. La comunicación entre módulos se realiza mediante contratos (interfaces) explícitos.                                                        |
| RNF-08 | Usabilidad       | Documentación interactiva   | La API debe contar con documentación OpenAPI generada automáticamente. Debe describir cada endpoint, sus parámetros, esquemas de respuesta y posibles errores. La documentación vive dentro del código y se mantiene sincronizada automáticamente. |
| RNF-09 | Rendimiento      | Paginación de listados      | Los endpoints de listado de profesores, alumnos y cursos deben soportar paginación configurable por parámetros de consulta. La respuesta debe incluir metadatos: total de registros, página actual y existencia de página siguiente.               |
| RNF-10 | Reproducibilidad | Semillas de datos           | El proyecto debe incluir un proceso de semillas que pueble la base de datos con datos iniciales en un único comando. Cualquier desarrollador que clone el repositorio debe poder tener un entorno funcional sin intervención manual adicional.     |
| RNF-11 | Trazabilidad     | Registro de fechas          | Todo registro persistido en base de datos debe almacenar su fecha de creación y su fecha de última modificación. Los registros no se eliminan físicamente: se utiliza borrado lógico mediante un campo de fecha de baja.                           |
