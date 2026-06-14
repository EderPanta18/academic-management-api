# Alcance del sistema

Este documento define hasta dónde llega el sistema en su primera versión funcional. La intención es mantener el proyecto enfocado en el problema principal: organizar y controlar el proceso de inscripción académica.

El sistema no busca cubrir toda la operación de una institución educativa. Su foco está en la información y los procesos necesarios para que un estudiante pueda inscribirse en una oferta de curso dentro de un periodo académico, con control de acceso, trazabilidad y seguimiento.

## Enfoque principal

El sistema se centra en el proceso de inscripción.

Ese proceso necesita datos base bien relacionados: estudiantes, docentes, programas académicos, cursos, periodos académicos y ofertas de curso.

También necesita usuarios identificados, roles, permisos y sesiones controladas para proteger las operaciones que modifican información académica.

La idea general es cubrir este flujo:

```txt
Datos académicos base
→ Periodo académico
→ Oferta de curso
→ Inscripción
→ Seguimiento
→ Reportes
```

Y de forma transversal:

```txt
Usuarios
→ Roles
→ Permisos
→ Sesiones
→ Auditoría
```

Todo lo que forme parte directa de ese flujo entra dentro del alcance inicial. Lo que no tenga relación directa con la inscripción, el seguimiento o la protección de operaciones queda fuera o se deja para una etapa posterior.

## Dentro del alcance

El sistema contempla las siguientes áreas:

```txt
- Personas.
- Estudiantes.
- Docentes.
- Programas académicos.
- Cursos.
- Periodos académicos.
- Ofertas de curso.
- Inscripciones.
- Importación de estudiantes.
- Reportes académicos básicos.
- Usuarios.
- Autenticación.
- Sesiones.
- Roles.
- Permisos.
- Auditoría y trazabilidad.
```

Estas áreas son suficientes para representar el proceso académico principal sin convertir el proyecto en un sistema institucional demasiado amplio.

## Personas

Se incluye la información personal común que puede ser usada por estudiantes o docentes.

La intención es evitar duplicar datos de una misma persona en distintas partes del sistema.

Información considerada:

```txt
- Documento de identidad.
- Nombres y apellidos.
- Correo.
- Teléfono.
- Estado del registro.
```

## Estudiantes

Se incluye la información académica necesaria para identificar a un estudiante y relacionarlo con un programa académico.

Información considerada:

```txt
- Código de estudiante.
- Persona asociada.
- Programa académico.
- Año o periodo de admisión.
- Correo institucional.
- Estado académico.
```

El estado del estudiante es importante porque puede afectar su participación en el proceso de inscripción.

## Docentes

Se incluye la información necesaria para asociar docentes con ofertas de curso.

Información considerada:

```txt
- Código de docente.
- Persona asociada.
- Departamento o unidad académica.
- Especialidad.
- Correo institucional.
- Estado.
```

No se busca cubrir toda la gestión laboral del docente. Solo se considera la información necesaria para el proceso académico.

## Programas académicos

Se incluyen los programas, carreras o planes académicos que permiten organizar estudiantes y cursos.

Información considerada:

```txt
- Código.
- Nombre.
- Unidad académica asociada.
- Estado.
```

Los programas académicos ayudan a mantener coherencia entre estudiantes, cursos e inscripciones.

## Cursos

Se incluye el catálogo de cursos de la institución.

Un curso representa una unidad académica estable. No equivale a una oferta disponible en un periodo específico.

Información considerada:

```txt
- Código de curso.
- Nombre.
- Programa académico relacionado.
- Categoría o área académica.
- Créditos u horas.
- Estado.
```

Los cursos sirven como base para crear ofertas en periodos académicos.

## Periodos académicos

Se incluyen los periodos donde se organizan las ofertas de curso y las inscripciones.

Información considerada:

```txt
- Nombre del periodo.
- Fecha de inicio.
- Fecha de cierre.
- Fechas relacionadas con inscripción.
- Estado.
```

El periodo académico permite saber si una inscripción corresponde a un ciclo válido.

## Ofertas de curso

Se incluyen las ofertas de curso como instancias concretas de un curso dentro de un periodo.

Una oferta permite definir qué curso se dicta, en qué periodo, con qué sección, cupo y docente asignado.

Información considerada:

```txt
- Curso.
- Periodo académico.
- Sección.
- Cupo máximo.
- Cupo disponible.
- Docente asignado.
- Estado.
```

Las inscripciones se realizan sobre ofertas de curso, no directamente sobre el catálogo de cursos.

## Inscripciones

Se incluye la inscripción como el vínculo entre un estudiante y una oferta de curso.

Información considerada:

```txt
- Estudiante.
- Oferta de curso.
- Fecha de inscripción.
- Estado.
- Usuario que registra o modifica.
- Motivo de cambio cuando aplique.
```

La inscripción debe poder ser consultada y seguida durante su ciclo de vida. No debe tratarse como un registro sin historial.

## Importación de estudiantes

Se incluye la importación de estudiantes porque es una necesidad común cuando la institución maneja información desde archivos.

El alcance inicial considera:

```txt
- Carga de archivos estructurados.
- Lectura de registros.
- Validación de datos.
- Detección de errores por fila.
- Resumen del resultado de importación.
```

Por ahora, la importación se enfoca en estudiantes. No se considera necesario crear un proceso de importación general para todas las entidades desde el inicio.

## Reportes académicos

Se incluyen reportes básicos para revisar el estado del proceso académico.

Reportes considerados:

```txt
- Estudiantes activos.
- Inscripciones por periodo.
- Inscripciones por programa académico.
- Cursos con mayor demanda.
- Ofertas con cupos disponibles.
- Ofertas con cupos completos.
- Estudiantes inscritos por oferta.
- Carga académica por docente.
- Resultado de importaciones.
- Registros con errores o inconsistencias.
```

Los reportes se enfocan en seguimiento operativo. No se plantea una capa avanzada de analítica o inteligencia de negocios.

## Usuarios

Se incluye la administración de usuarios porque el sistema necesita identificar quién accede y quién realiza acciones importantes.

Información considerada:

```txt
- Correo o nombre de usuario.
- Credenciales protegidas.
- Estado del usuario.
- Roles asociados.
```

El usuario representa una cuenta de acceso al sistema. No todo usuario es necesariamente estudiante o docente.

## Autenticación y sesiones

Se incluye autenticación para controlar el ingreso al sistema.

Aspectos considerados:

```txt
- Inicio de sesión.
- Cierre de sesión.
- Renovación de acceso cuando aplique.
- Sesiones activas.
- Revocación de sesiones.
- Control de una o varias sesiones activas según política.
```

Las sesiones permiten controlar si un acceso sigue siendo válido y ayudan a evitar sesiones activas no deseadas.

## Roles y permisos

Se incluyen roles y permisos para controlar operaciones sensibles.

Aspectos considerados:

```txt
- Roles del sistema.
- Permisos por operación.
- Asignación de roles a usuarios.
- Asignación de permisos a roles.
- Protección de rutas y acciones importantes.
```

Los roles agrupan responsabilidades. Los permisos representan acciones concretas, como crear estudiantes, registrar inscripciones, cerrar ofertas o consultar reportes.

## Auditoría y trazabilidad

Se incluye trazabilidad sobre acciones relevantes del sistema.

Acciones que deberían conservar historial:

```txt
- Registro de estudiantes.
- Importación de estudiantes.
- Creación o modificación de ofertas de curso.
- Asignación de docentes.
- Registro de inscripciones.
- Cambios de estado de inscripción.
- Cancelaciones o anulaciones.
- Cambios relacionados con usuarios.
- Cambios de roles o permisos.
- Creación, cierre o revocación de sesiones cuando aplique.
```

La trazabilidad ayuda a revisar errores, resolver reclamos y conocer qué ocurrió durante el proceso.

## Fuera del alcance inicial

Para mantener el sistema enfocado, no se incluyen estos procesos en la primera versión:

```txt
- Pagos, pensiones o deudas.
- Control de asistencia.
- Registro de notas.
- Horarios detallados.
- Gestión documental institucional.
- Portal completo para estudiantes.
- Portal completo para docentes.
- Notificaciones por correo o mensajería.
- Integraciones con sistemas externos reales.
- Certificados o constancias.
- Admisión.
- Evaluaciones académicas.
- Gestión avanzada de seguridad corporativa.
```

Estos temas pueden agregarse después, pero no son necesarios para demostrar el control del proceso de inscripción.

## Criterio para decidir si algo entra al sistema

Una funcionalidad debería entrar en el alcance inicial si responde a alguna de estas preguntas:

```txt
- ¿Ayuda a registrar información necesaria para una inscripción?
- ¿Ayuda a validar si una inscripción es válida?
- ¿Ayuda a controlar ofertas, cupos o periodos?
- ¿Ayuda a consultar el estado del proceso?
- ¿Ayuda a proteger información o registrar cambios relevantes?
- ¿Ayuda a controlar quién puede ejecutar una operación sensible?
```

Si la respuesta es no, probablemente debería quedar fuera de esta primera versión.

## Resumen operativo

El alcance inicial queda concentrado en este recorrido:

```txt
Registrar estudiantes
Registrar docentes
Registrar programas y cursos
Definir periodos académicos
Crear ofertas de curso
Controlar cupos
Registrar inscripciones
Consultar reportes
Controlar usuarios, roles, permisos y sesiones
Mantener seguridad y trazabilidad
```

Ese recorrido es suficiente para construir un backend académico enfocado, entendible y con reglas reales de negocio.
