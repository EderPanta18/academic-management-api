# Proceso de inscripción

Este documento describe el proceso de inscripción de forma general. No define endpoints, pantallas ni casos de uso detallados. Su intención es explicar cómo fluye la información desde que se prepara un periodo académico hasta que un estudiante queda inscrito en una oferta de curso.

La inscripción no debería entenderse como un registro aislado. Antes de registrar una inscripción, el sistema necesita contar con información académica base, verificar que esa información sea coherente y asegurar que el usuario que ejecuta la operación tenga autorización.

## Idea general

El proceso puede resumirse así:

```txt
Preparar datos académicos
→ Definir periodo académico
→ Crear ofertas de curso
→ Revisar disponibilidad
→ Revisar estudiante
→ Verificar usuario autorizado
→ Registrar inscripción
→ Actualizar seguimiento
```

Cada paso depende del anterior. Si los datos base son incorrectos o el usuario no tiene autorización, el proceso de inscripción también puede terminar siendo incorrecto.

## Preparación de información base

Antes de iniciar inscripciones, la institución debe tener información mínima registrada.

Esta información incluye:

```txt
Personas
Estudiantes
Docentes
Programas académicos
Cursos
Periodos académicos
Usuarios
Roles
Permisos
```

En esta etapa todavía no se registra la inscripción. Solo se prepara la información necesaria para que luego el proceso pueda ejecutarse con datos confiables y usuarios autorizados.

Por ejemplo, no tendría sentido inscribir a un estudiante si aún no está registrado, si no pertenece a un programa académico o si el curso no existe dentro del catálogo. Tampoco tendría sentido permitir que cualquier usuario registre inscripciones sin validar sus permisos.

## Definición del periodo académico

El periodo académico marca el ciclo donde se organizan las ofertas de curso.

Puede representar un semestre, ciclo, módulo o bloque académico. Lo importante es que permita agrupar cursos disponibles e inscripciones bajo una misma unidad temporal.

El periodo ayuda a responder preguntas como:

```txt
¿A qué ciclo pertenece esta inscripción?
¿El periodo está abierto?
¿Las fechas permiten registrar inscripciones?
¿Las ofertas pertenecen al periodo correcto?
```

Sin periodo académico, las inscripciones quedan sin contexto.

## Preparación de ofertas de curso

Una vez definido el periodo, se preparan las ofertas de curso.

Una oferta representa un curso disponible para inscripción dentro de un periodo académico. Puede tener sección, cupo, docente asignado y estado.

Ejemplo:

```txt
Curso: Base de Datos
Periodo: 2026-I
Sección: A
Cupo máximo: 40
Docente: asignado
Estado: abierta
```

La oferta es el elemento sobre el cual se inscribe el estudiante. Por eso, una inscripción no apunta solamente al curso, sino a una oferta específica.

## Revisión de disponibilidad

Antes de registrar una inscripción, se necesita revisar que la oferta pueda recibir estudiantes.

Algunas condiciones importantes son:

```txt
La oferta existe.
La oferta pertenece a un periodo válido.
La oferta está abierta.
El curso está activo.
El periodo permite inscripciones.
Existe cupo disponible.
La cantidad de inscritos activos no supera el cupo máximo.
```

Esta revisión evita que se registren inscripciones sobre cursos cerrados, periodos incorrectos, ofertas canceladas o grupos sin capacidad disponible.

## Revisión del estudiante

También se debe revisar la situación del estudiante.

No todos los estudiantes deberían poder inscribirse en cualquier momento. La institución puede necesitar validar su estado académico o su relación con un programa académico.

Aspectos a revisar:

```txt
El estudiante existe.
El estudiante tiene un estado válido.
El estudiante pertenece a un programa académico.
El estudiante no tiene una inscripción activa en la misma oferta.
La oferta corresponde a un curso compatible con su programa académico cuando la institución lo exige.
```

Esta parte es importante porque el proceso no solo depende de la oferta, sino también de la condición del estudiante.

## Verificación del usuario responsable

El registro de inscripción debe ser ejecutado por un usuario autorizado.

Antes de registrar o modificar una inscripción, el sistema debe validar:

```txt
El usuario está autenticado.
La sesión está activa.
El usuario se encuentra habilitado.
El usuario tiene el permiso requerido.
```

Ejemplos de permisos relacionados:

```txt
enrollments.read
enrollments.create
enrollments.cancel
enrollments.change-status
```

Esta verificación evita que un usuario sin autorización registre, cancele o modifique inscripciones.

## Registro de inscripción

Cuando la oferta, el estudiante y el usuario responsable cumplen las condiciones necesarias, se registra la inscripción.

La inscripción debe guardar al menos:

```txt
Estudiante
Oferta de curso
Fecha de inscripción
Estado inicial
Usuario responsable
```

Desde ese momento, la inscripción forma parte del historial académico del proceso. No debería perderse la relación con el periodo, curso y oferta que la originaron.

## Actualización de cupos

Cuando una inscripción queda activa, debe reflejarse en la disponibilidad de la oferta.

La disponibilidad puede manejarse de dos formas:

```txt
- Guardando un cupo disponible y actualizándolo con cada inscripción.
- Calculando cupos disponibles a partir de las inscripciones activas.
```

La regla de negocio debe ser la misma en ambos casos: las inscripciones activas no deben superar el cupo máximo de la oferta.

Si una inscripción se cancela, rechaza o retira, la institución debe definir si ese cupo vuelve a estar disponible. En la mayoría de casos, una inscripción cancelada libera cupo; una inscripción finalizada no debería alterar cupos de periodos cerrados.

## Estados de inscripción

Una inscripción puede tener distintos estados durante su ciclo de vida.

Ejemplos de estados:

```txt
Pendiente
Inscrito
Cancelado
Retirado
Rechazado
Finalizado
```

El estado permite saber en qué situación se encuentra la inscripción y evita tratar todos los registros como si fueran iguales.

Por ejemplo, una inscripción cancelada no debería contarse igual que una inscripción activa.

## Cambios durante el proceso

Durante el periodo académico pueden existir ajustes.

Algunos ejemplos:

```txt
Cancelar una inscripción.
Corregir un registro.
Cambiar el estado de una inscripción.
Cerrar una oferta de curso.
Actualizar cupos disponibles.
Reabrir una oferta si la institución lo permite.
```

Estos cambios deben validar permisos y conservar trazabilidad. En un proceso académico, no basta con modificar el dato final; también es importante saber qué cambió, quién hizo el cambio y por qué.

## Importación de estudiantes

La importación de estudiantes puede formar parte del proceso previo a las inscripciones.

En muchas instituciones, la información de estudiantes proviene de hojas de cálculo o archivos externos. Importarlos ayuda a reducir trabajo manual, pero también puede introducir errores si no se revisa correctamente.

La importación debe permitir identificar:

```txt
Registros válidos
Registros duplicados
Filas con datos incompletos
Errores de formato
Programas académicos no encontrados
Resumen del proceso
Usuario responsable de la importación
```

Por ahora, la importación se considera principalmente para estudiantes. Más adelante podría ampliarse a cursos o docentes si existe una necesidad clara.

## Seguimiento del proceso

Una vez que el proceso está en marcha, la institución necesita revisar su avance.

Algunas preguntas frecuentes son:

```txt
¿Cuántos estudiantes se han inscrito?
¿Qué cursos tienen mayor demanda?
¿Qué ofertas ya no tienen cupos?
¿Qué ofertas aún tienen cupos disponibles?
¿Qué estudiantes están inscritos en una oferta?
¿Qué registros fueron importados con errores?
¿Qué usuario realizó una acción relevante?
```

El seguimiento evita depender de cálculos manuales y permite detectar inconsistencias antes de que el proceso avance demasiado.

## Seguridad durante el proceso

La seguridad acompaña el proceso completo.

No todos los usuarios deben poder ejecutar las mismas acciones. Por ejemplo:

```txt
Un usuario con permiso students.import puede importar estudiantes.
Un usuario con permiso enrollments.create puede registrar inscripciones.
Un usuario con permiso course-offerings.close puede cerrar ofertas.
Un usuario con permiso reports.read puede consultar reportes.
Un usuario con permiso roles.assign-permissions puede administrar permisos de roles.
```

La sesión del usuario permite controlar si el acceso sigue activo. Los permisos permiten controlar qué operación puede ejecutar.

## Flujo resumido

El proceso completo puede verse así:

```txt
1. Registrar información base.
2. Definir periodo académico.
3. Crear ofertas de curso.
4. Asignar docentes cuando corresponda.
5. Revisar disponibilidad de oferta.
6. Revisar estado del estudiante.
7. Validar usuario, sesión y permisos.
8. Validar inscripción duplicada.
9. Validar cupo disponible.
10. Registrar inscripción.
11. Actualizar disponibilidad o conteo de inscritos.
12. Mantener trazabilidad.
13. Consultar reportes.
```

Este flujo mantiene el sistema enfocado en la inscripción académica sin convertirlo en una plataforma educativa completa.
