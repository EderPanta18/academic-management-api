# Reglas de negocio

Este documento reúne las reglas principales que deben mantener consistente el proceso académico. No describe implementación técnica. La intención es dejar claro qué condiciones deben respetarse para evitar que el sistema se comporte como un simple registro de datos.

Las reglas están enfocadas en el proceso de inscripción de estudiantes en ofertas de curso y en el control funcional necesario para proteger ese proceso.

## Reglas sobre identidad y personas

Una persona representa datos de identidad comunes.

Reglas principales:

```txt
- Una persona no debería duplicarse usando el mismo documento de identidad.
- El documento de identidad debe mantenerse como dato de referencia para evitar duplicidades.
- Los datos de contacto deben mantenerse consistentes cuando se usen para comunicación o identificación.
- Una persona puede estar asociada a un estudiante, a un docente o a ambos si la institución lo permite.
- La información personal debe estar protegida y no debe quedar disponible para usuarios no autorizados.
```

## Reglas sobre estudiantes

El estudiante es el participante principal del proceso de inscripción.

Reglas principales:

```txt
- Un estudiante debe tener un código único.
- Un estudiante debe estar asociado a una persona.
- Un estudiante debe pertenecer a un programa académico.
- El estado académico del estudiante debe afectar su posibilidad de inscripción.
- Un estudiante activo puede participar en inscripciones si cumple las demás condiciones.
- Un estudiante inactivo, suspendido, retirado o egresado no debería inscribirse si la institución lo restringe.
- No deben existir estudiantes duplicados por código institucional.
- No se debería importar un estudiante si su documento o código ya pertenece a otro registro activo.
```

Estas reglas evitan que se registren inscripciones sobre estudiantes inexistentes, duplicados o no habilitados.

## Reglas sobre docentes

El docente puede estar asociado a una oferta de curso.

Reglas principales:

```txt
- Un docente debe tener un código único.
- Un docente debe estar asociado a una persona.
- Un docente inactivo no debería asignarse a nuevas ofertas.
- Un docente puede estar asociado a un departamento o unidad académica.
- La asignación docente debe respetar el estado de la oferta de curso.
- No debería asignarse docente a una oferta cancelada o finalizada.
- Si la institución exige docente obligatorio, una oferta no debería abrirse sin docente asignado.
```

No se busca controlar toda la carga laboral del docente en esta etapa, pero sí evitar asignaciones inválidas dentro del proceso académico.

## Reglas sobre programas académicos

El programa académico organiza estudiantes y cursos.

Reglas principales:

```txt
- Un programa académico debe tener código o identificador único.
- Un estudiante debe pertenecer a un programa académico válido.
- Un curso puede estar relacionado con un programa académico.
- Un programa académico inactivo no debería recibir nuevos estudiantes ni nuevas relaciones académicas si la institución lo restringe.
- Si la institución exige compatibilidad académica, el estudiante solo debería inscribirse en ofertas relacionadas con su programa académico.
```

Usar “programa académico” permite mantener el sistema más general que si se usara solo “carrera”.

## Reglas sobre cursos

Un curso representa una unidad académica del catálogo.

Reglas principales:

```txt
- Un curso debe tener código único.
- Un curso debe existir antes de crear una oferta de curso.
- Un curso inactivo no debería usarse para crear nuevas ofertas.
- El curso del catálogo no debe confundirse con una oferta disponible en un periodo.
- Un curso puede pertenecer a un programa académico o a una categoría académica.
- Si un curso deja de estar vigente, las ofertas futuras deberían restringirse, pero las ofertas históricas deben poder consultarse.
```

Esta separación es importante: el curso define la materia; la oferta define cuándo y bajo qué condiciones se dicta.

## Reglas sobre periodos académicos

El periodo académico agrupa ofertas e inscripciones.

Reglas principales:

```txt
- Un periodo académico debe tener fechas coherentes.
- La fecha de inicio no debe ser posterior a la fecha de cierre.
- Las fechas de inscripción deben estar dentro de un rango válido definido por la institución.
- Un periodo cerrado no debería permitir nuevas inscripciones.
- Un periodo cancelado no debería recibir nuevas ofertas.
- Las ofertas de curso deben pertenecer a un periodo académico.
- Las inscripciones deben quedar asociadas indirectamente al periodo mediante la oferta de curso.
- No deberían mezclarse inscripciones de periodos distintos dentro de una misma oferta.
```

El periodo permite dar contexto temporal al proceso.

## Reglas sobre ofertas de curso

La oferta de curso representa un curso disponible para inscripción.

Reglas principales:

```txt
- Una oferta debe estar asociada a un curso.
- Una oferta debe estar asociada a un periodo académico.
- La combinación de curso, periodo y sección no debería repetirse.
- Una oferta debe tener cupo máximo definido.
- El cupo máximo debe ser mayor que cero.
- El cupo disponible no debe ser negativo.
- El cupo disponible no debe superar el cupo máximo.
- Una oferta abierta puede recibir inscripciones mientras exista cupo.
- Una oferta en borrador no debería recibir inscripciones.
- Una oferta cerrada, cancelada o finalizada no debería recibir nuevas inscripciones.
- La asignación de docente debe respetar el estado de la oferta.
- No debería cerrarse una oferta sin conservar el estado de las inscripciones ya registradas.
```

Estas reglas son necesarias para evitar inscripciones en ofertas inválidas o sin capacidad.

## Reglas sobre cupos

El cupo representa la capacidad de una oferta de curso.

Reglas principales:

```txt
- Una inscripción activa consume un cupo.
- Una inscripción pendiente puede consumir o reservar cupo según la regla institucional definida.
- Una inscripción cancelada, rechazada o retirada no debería contar como cupo ocupado si la institución define que libera cupo.
- La cantidad de inscripciones activas no debe superar el cupo máximo de la oferta.
- No se debe permitir una nueva inscripción cuando la oferta no tiene cupos disponibles.
- Si se modifica el cupo máximo, no debería quedar por debajo del número de inscripciones activas.
- El cálculo de cupos debe distinguir inscripciones activas de inscripciones canceladas o rechazadas.
```

Estas reglas evitan que una oferta tenga más estudiantes de los permitidos.

## Reglas sobre inscripciones

La inscripción vincula un estudiante con una oferta de curso.

Reglas principales:

```txt
- Un estudiante no debe inscribirse dos veces en la misma oferta activa.
- La oferta debe existir antes de registrar la inscripción.
- El estudiante debe existir antes de registrar la inscripción.
- La oferta debe estar abierta para aceptar inscripciones.
- Debe existir cupo disponible.
- El periodo académico asociado debe permitir inscripciones.
- El usuario que registra la inscripción debe estar autenticado y autorizado.
- La inscripción debe conservar su estado.
- Los cambios importantes de estado deben conservar trazabilidad.
- Una inscripción cancelada no debería tratarse como inscripción activa.
- Una inscripción finalizada no debería modificarse libremente.
```

La inscripción no debe tratarse como un dato suelto. Es parte de un proceso que puede cambiar con el tiempo.

## Reglas sobre estados

Los estados permiten diferenciar situaciones dentro del sistema.

Ejemplos:

```txt
Estudiante: activo, inactivo, suspendido, retirado, egresado.
Periodo: planificado, abierto, en curso, cerrado, cancelado.
Oferta: borrador, abierta, cerrada, cancelada, finalizada.
Inscripción: pendiente, inscrito, cancelado, retirado, rechazado, finalizado.
Usuario: activo, inactivo, bloqueado.
Sesión: activa, revocada, expirada.
```

Reglas generales:

```txt
- No todos los estados permiten las mismas acciones.
- Los cambios de estado deben seguir una secuencia válida.
- Un estado final no debería modificarse libremente.
- Las cancelaciones o anulaciones deben conservar motivo cuando sea necesario.
- Los reportes deben distinguir estados para evitar conteos incorrectos.
- Una sesión revocada o expirada no debe permitir consumir rutas protegidas.
```

## Reglas sobre importación de estudiantes

La importación ayuda a cargar información desde archivos externos.

Reglas principales:

```txt
- La importación inicial se enfoca en estudiantes.
- Cada fila debe validarse antes de ser aceptada.
- Los registros duplicados deben identificarse.
- Las filas con errores deben reportarse de forma clara.
- El resultado debe indicar cuántos registros fueron procesados, aceptados u observados.
- Una importación no debe ocultar errores de datos.
- Una fila no debería crear registros parciales si sus datos mínimos no son válidos.
- Si el programa académico indicado en una fila no existe, la fila debe quedar observada.
- Si el documento o código del estudiante ya existe, la fila debe tratarse como duplicada u observada.
- El usuario que ejecuta la importación debe tener permiso para hacerlo.
```

La importación no debe sacrificar consistencia por rapidez.

## Reglas sobre usuarios

El usuario representa una cuenta de acceso al sistema.

Reglas principales:

```txt
- Un usuario debe tener un identificador único.
- El correo o username usado para acceder no debe duplicarse.
- La contraseña debe almacenarse como hash, no en texto plano.
- Un usuario inactivo o bloqueado no debe iniciar sesión.
- Un usuario debe tener al menos un rol si necesita operar dentro del sistema.
- Los cambios de estado del usuario deben conservar trazabilidad.
- Las operaciones sobre usuarios deben estar protegidas por permisos.
```

El usuario permite identificar quién accede y quién ejecuta acciones importantes.

## Reglas sobre sesiones

La sesión representa un acceso autenticado de un usuario.

Reglas principales:

```txt
- El login debe crear una sesión válida.
- El logout debe revocar la sesión actual.
- Una sesión revocada no debe permitir acceso.
- Una sesión expirada no debe permitir acceso.
- El refresh token debe validarse contra una sesión activa.
- Si se permite una sola sesión por usuario, el login debe revocar sesiones activas anteriores.
- Los tokens no deben considerarse suficientes si la sesión asociada ya no está activa.
- Los refresh tokens almacenados deben guardarse como hash.
```

Las sesiones permiten controlar accesos activos y cerrar o revocar accesos cuando sea necesario.

## Reglas sobre roles

Un rol agrupa responsabilidades dentro del sistema.

Reglas principales:

```txt
- Un rol debe tener código único.
- Un rol puede agrupar varios permisos.
- Un rol puede asignarse a uno o más usuarios.
- Un rol inactivo no debería asignarse a nuevos usuarios.
- Los cambios de roles deben conservar trazabilidad.
- La administración de roles debe estar protegida por permisos.
```

Los roles ayudan a administrar responsabilidades sin validar cada usuario de forma manual.

## Reglas sobre permisos

Un permiso representa una acción concreta permitida dentro del sistema.

Reglas principales:

```txt
- Un permiso debe tener código único.
- Un permiso debe representar una acción clara.
- Los permisos deben poder agruparse por módulo o capacidad.
- Los permisos se asignan a roles.
- Un endpoint protegido debe validar el permiso requerido.
- Los permisos no deberían ser excesivamente granulares al inicio.
- Los cambios de permisos asignados a roles deben conservar trazabilidad.
```

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

Los permisos permiten proteger operaciones sin depender únicamente del nombre del rol.

## Reglas sobre seguridad

El sistema maneja información académica y personal.

Reglas principales:

```txt
- No todo usuario debe acceder a toda la información.
- Las operaciones sensibles deben estar protegidas.
- La modificación de inscripciones, ofertas, usuarios, roles o permisos debe estar restringida.
- Los datos personales deben consultarse solo cuando exista autorización.
- Las credenciales no deben almacenarse de forma insegura.
- Un usuario sin permisos no debería modificar estados académicos.
- Un usuario de consulta no debería ejecutar acciones de registro, importación o cancelación.
- La autenticación identifica al usuario.
- La autorización valida qué acciones puede ejecutar.
```

La seguridad es parte del problema porque una inscripción incorrecta o una modificación no autorizada puede afectar registros académicos.

## Reglas sobre auditoría

La auditoría permite revisar acciones relevantes.

Reglas principales:

```txt
- Las acciones importantes deben conservar quién las realizó.
- Los cambios de estado deben conservar fecha y usuario responsable.
- Las importaciones deben conservar un resumen del proceso.
- Las cancelaciones o anulaciones deben poder revisarse después.
- Los cambios en usuarios, roles o permisos deben quedar registrados.
- Las modificaciones sobre cupos, ofertas e inscripciones deben dejar evidencia.
- Las sesiones creadas, revocadas o rechazadas pueden registrarse cuando sea necesario.
- La auditoría debe ayudar a reconstruir qué ocurrió, no reemplazar las reglas del proceso.
```

La trazabilidad no reemplaza las reglas de negocio, pero ayuda a revisar lo ocurrido cuando aparece una inconsistencia.

## Reglas sobre reportes

Los reportes deben mostrar información confiable del proceso.

Reglas principales:

```txt
- Los reportes deben basarse en datos consistentes.
- Las inscripciones canceladas no deberían mezclarse sin distinción con inscripciones activas.
- Los cupos disponibles deben reflejar el estado real de las ofertas.
- Los resultados de importación deben diferenciar registros aceptados y registros con error.
- Los reportes deben servir para seguimiento, no para modificar información.
- Los reportes por periodo deben indicar claramente el periodo consultado.
- Los reportes de ocupación deben calcularse usando cupo máximo e inscripciones activas.
- Los reportes deben respetar permisos de acceso.
```

Los reportes ayudan a observar el proceso, pero no deberían convertirse en el lugar donde se corrigen datos.
