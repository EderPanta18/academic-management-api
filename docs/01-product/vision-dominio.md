# Visión general del dominio

Este documento describe los conceptos principales del sistema desde el punto de vista del negocio académico y de las capacidades funcionales necesarias para protegerlo. No define tablas, endpoints ni estructura interna del código. Su intención es dejar claro qué representa cada elemento dentro del proceso de inscripción.

El sistema gira alrededor de una idea central: una institución necesita organizar estudiantes, docentes, programas académicos, cursos, periodos y ofertas para poder registrar inscripciones de forma consistente. Además, necesita controlar qué usuarios pueden realizar acciones sobre esa información.

## Persona

Una persona representa los datos de identidad comunes dentro de la institución.

Puede estar asociada a un estudiante, a un docente o a ambos si el contexto institucional lo permite. La persona no representa por sí sola un rol académico, sino la información base de identificación.

Ejemplos de datos relacionados:

```txt
Documento de identidad
Nombres y apellidos
Correo
Teléfono
Estado del registro
```

Separar la persona de los perfiles académicos evita repetir información personal cuando una misma persona participa en más de un rol dentro de la institución.

## Estudiante

Un estudiante representa a una persona vinculada a un programa académico.

Es el participante principal del proceso de inscripción. Para que pueda inscribirse, no basta con que exista en el sistema; también debe tener una situación académica válida.

Datos que normalmente lo describen:

```txt
Código de estudiante
Persona asociada
Programa académico
Año o periodo de admisión
Correo institucional
Estado académico
```

El estado del estudiante es importante porque puede limitar su participación en el proceso. Por ejemplo, un estudiante activo no se trata igual que uno retirado, suspendido o egresado.

## Docente

Un docente representa a una persona que puede estar asociada a una oferta de curso.

No se busca modelar toda su gestión laboral, sino la información necesaria para relacionarlo con el proceso académico.

Datos habituales:

```txt
Código de docente
Persona asociada
Departamento o unidad académica
Especialidad
Correo institucional
Estado
```

El docente cobra relevancia cuando una oferta de curso necesita tener un responsable académico asignado.

## Programa académico

Un programa académico representa la estructura formativa a la que pertenece un estudiante o un curso.

Se usa este nombre porque es más general que “carrera”. Puede representar una carrera universitaria, un programa técnico, una especialidad, un diplomado o un plan formativo, según el tipo de institución.

Datos comunes:

```txt
Código del programa
Nombre
Unidad académica asociada
Estado
```

El programa académico ayuda a mantener coherencia entre estudiantes, cursos e inscripciones.

## Curso

Un curso representa una unidad académica del catálogo institucional.

El curso no indica todavía que se esté dictando en un periodo específico. Solo define que existe dentro de la estructura académica.

Datos comunes:

```txt
Código de curso
Nombre
Programa académico relacionado
Categoría o área académica
Créditos u horas
Estado
```

Por ejemplo, “Base de Datos” puede existir como curso del catálogo, pero solo se convierte en una opción inscribible cuando se crea una oferta de curso para un periodo académico.

## Periodo académico

Un periodo académico representa un ciclo donde se organizan ofertas e inscripciones.

Puede ser un semestre, ciclo, módulo, bloque académico o cualquier unidad temporal que use la institución para organizar sus actividades.

Datos comunes:

```txt
Nombre del periodo
Fecha de inicio
Fecha de cierre
Fechas de inscripción
Estado
```

El periodo académico permite saber si una inscripción pertenece a un momento válido de la operación institucional.

## Oferta de curso

Una oferta de curso representa un curso disponible dentro de un periodo académico.

Es diferente del curso del catálogo. El curso describe la materia; la oferta indica que esa materia se dictará en un periodo, con una sección, cupo y posiblemente un docente.

Datos comunes:

```txt
Curso
Periodo académico
Sección
Cupo máximo
Cupo disponible
Docente asignado
Estado
```

Las inscripciones se realizan sobre ofertas de curso, no directamente sobre cursos del catálogo.

## Inscripción

Una inscripción representa el vínculo entre un estudiante y una oferta de curso.

Es el centro del proceso académico tratado por el sistema. Una inscripción debe mantener estado, fecha, relación con el estudiante y relación con la oferta correspondiente.

Datos comunes:

```txt
Estudiante
Oferta de curso
Fecha de inscripción
Estado
Usuario responsable
Motivo de cambio cuando aplique
```

La inscripción no debería tratarse como un simple registro editable. Su ciclo de vida debe conservar trazabilidad, especialmente cuando cambia de estado o se cancela.

## Usuario

Un usuario representa una cuenta que puede ingresar al sistema y realizar acciones según sus permisos.

No todo usuario es necesariamente estudiante o docente. Puede ser personal administrativo, coordinación académica, soporte interno, docente con acceso al sistema o un perfil de consulta.

Datos comunes:

```txt
Correo o nombre de usuario
Credenciales de acceso
Estado
Roles asociados
```

El usuario permite controlar quién accede al sistema y quién realiza acciones relevantes.

## Sesión

Una sesión representa un acceso activo o registrado de un usuario.

Permite controlar si un token o acceso sigue siendo válido. También permite cerrar sesión, revocar accesos y limitar sesiones activas si el sistema lo requiere.

Datos comunes:

```txt
Usuario asociado
Estado de sesión
Fecha de creación
Fecha de expiración
Fecha de revocación
Información del dispositivo o cliente cuando aplique
```

La sesión no reemplaza al usuario. El usuario representa la cuenta; la sesión representa un acceso generado por autenticación.

## Rol

Un rol agrupa responsabilidades dentro del sistema.

Sirve para diferenciar perfiles de uso. Por ejemplo, no todos los usuarios deberían poder importar estudiantes, modificar inscripciones, cerrar ofertas de curso o administrar accesos.

Ejemplos de roles posibles:

```txt
Administrador
Coordinación académica
Secretaría académica
Docente
Consulta académica
```

Los roles ayudan a agrupar responsabilidades, pero no deberían ser el único nivel de control.

## Permiso

Un permiso representa una acción concreta que un usuario puede realizar dentro del sistema.

Los permisos permiten proteger operaciones específicas.

Ejemplos:

```txt
students.read
students.create
students.import
course-offerings.close
enrollments.create
enrollments.cancel
reports.read
roles.assign-permissions
```

El usuario recibe permisos mediante sus roles. Esto permite cambiar responsabilidades sin modificar cada operación del sistema.

## Catálogos

Los catálogos representan datos de referencia que se usan para clasificar o validar información.

No todos los elementos deben ser módulos principales. Algunos solo existen para mantener opciones consistentes dentro del sistema.

Ejemplos de catálogos:

```txt
Tipos de documento
Estados de estudiante
Estados de docente
Estados de inscripción
Categorías de curso
Estados de oferta
Estados de periodo académico
```

Un catálogo debe usarse para datos relativamente estables, no para procesos que tienen reglas importantes.

Roles, permisos y sesiones no se consideran catálogos porque tienen reglas, relaciones y operaciones propias.

## Reporte

Un reporte representa una consulta resumida del estado académico u operativo del sistema.

No forma parte del proceso de inscripción en sí, pero ayuda a revisar su avance y detectar problemas.

Ejemplos:

```txt
Inscripciones por periodo
Estudiantes por programa académico
Cursos con mayor demanda
Ofertas con cupos disponibles
Resultados de importación
```

Los reportes ayudan a evitar que el seguimiento dependa de archivos manuales.

## Auditoría

La auditoría representa el registro de acciones importantes realizadas en el sistema.

Permite saber quién realizó una acción, sobre qué recurso, cuándo ocurrió y qué cambio se produjo.

Ejemplos de acciones auditables:

```txt
Registro de inscripción
Cancelación de inscripción
Cambio de cupo
Importación de estudiantes
Asignación de rol
Asignación de permisos
Revocación de sesión
```

La auditoría no decide reglas del proceso. Solo conserva evidencia sobre acciones relevantes.

## Relación general entre conceptos

El dominio académico puede entenderse como una cadena de relaciones:

```txt
Persona
→ Estudiante
→ Programa académico
→ Curso
→ Oferta de curso
→ Inscripción
```

Y también:

```txt
Persona
→ Docente
→ Oferta de curso
```

El control de acceso puede entenderse así:

```txt
Usuario
→ Sesión
→ Rol
→ Permiso
```

El proceso de inscripción aparece cuando un estudiante se vincula a una oferta de curso válida dentro de un periodo académico, y esa acción es ejecutada por un usuario autorizado.

## Diferencia entre curso, oferta e inscripción

Esta diferencia es una de las más importantes del dominio.

```txt
Curso
= materia o unidad académica del catálogo.

Oferta de curso
= curso disponible en un periodo, con sección, cupo, estado y docente.

Inscripción
= vínculo entre un estudiante y una oferta de curso.
```

Ejemplo:

```txt
Curso: Base de Datos
Oferta: Base de Datos - 2026-I - Sección A - 40 cupos
Inscripción: Estudiante E001 inscrito en esa oferta
```

Esta separación evita confundir el catálogo académico con los cursos disponibles para inscripción.

## Diferencia entre usuario, rol, permiso y sesión

Estos conceptos pertenecen al control de acceso.

```txt
Usuario
= cuenta que puede ingresar al sistema.

Sesión
= acceso activo o registrado del usuario.

Rol
= agrupación de responsabilidades.

Permiso
= acción concreta permitida.
```

Ejemplo:

```txt
Usuario: secretaria@institucion.edu
Sesión: acceso activo desde un navegador
Rol: Secretaría académica
Permisos: students.create, enrollments.create, enrollments.cancel
```

Esta separación permite proteger operaciones sin mezclar identidad, acceso y responsabilidades.
