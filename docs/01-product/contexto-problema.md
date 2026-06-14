# Contexto del problema

En una institución educativa, el proceso de inscripción no depende solo de registrar que un estudiante llevará un curso. Antes de llegar a ese punto, existe información que debe estar ordenada: datos del estudiante, programa académico, cursos disponibles, periodo académico, cupos, docentes, estados de los registros, usuarios del sistema, permisos de acceso y condiciones internas de la institución.

Cuando esa información se maneja en hojas de cálculo, archivos sueltos, registros manuales o sistemas que no están conectados, el proceso empieza a depender demasiado de revisiones manuales. Esto puede funcionar al inicio, pero se vuelve difícil de controlar cuando aumenta la cantidad de estudiantes, cursos, periodos, secciones, usuarios y movimientos académicos.

El problema principal aparece cuando la institución no tiene una base clara y confiable para saber qué información es válida, qué datos están actualizados, qué registros ya fueron procesados y qué usuarios pueden ejecutar acciones sensibles.

## Situación actual

En muchos entornos académicos, parte de la información se administra en archivos separados. Por ejemplo, una hoja puede contener estudiantes, otra cursos, otra docentes, otra ofertas disponibles y otra inscripciones. A veces también existen formularios, correos, reportes manuales o registros internos que se actualizan por separado.

Esto genera trabajo repetitivo para el personal académico o administrativo. Antes de registrar una inscripción, normalmente se debe revisar si el estudiante existe, si pertenece al programa correcto, si el curso está disponible, si la oferta está abierta, si el periodo sigue vigente, si hay cupos y si no existe una inscripción previa.

Además, no todos los usuarios deberían poder realizar las mismas acciones. Registrar estudiantes, importar datos, modificar cupos, cancelar inscripciones o administrar roles son operaciones que necesitan control. Si el sistema no diferencia usuarios, roles, permisos y sesiones activas, puede ser difícil saber quién accedió, qué acción realizó y si realmente estaba autorizado.

Mientras más archivos, usuarios o fuentes intervienen, mayor es la posibilidad de que la información no coincida.

## Problemas que se presentan

Los problemas más comunes suelen aparecer en tareas aparentemente simples, como buscar un estudiante, validar un curso, revisar el estado de una oferta, confirmar cupos disponibles o controlar quién puede modificar un registro.

Entre los casos más frecuentes están:

```txt
- Estudiantes registrados más de una vez.
- Datos personales incompletos o desactualizados.
- Programas académicos sin una relación clara con estudiantes o cursos.
- Cursos que existen en el catálogo, pero no están disponibles para un periodo específico.
- Periodos académicos sin fechas o estados claros.
- Ofertas de curso sin control suficiente de cupos.
- Ofertas abiertas sin docente asignado cuando la institución lo exige.
- Inscripciones duplicadas sobre una misma oferta.
- Estudiantes inscritos en ofertas cerradas, canceladas o sin cupos.
- Cambios en inscripciones sin historial claro.
- Reportes preparados manualmente con datos que pueden no coincidir.
- Archivos de importación con errores difíciles de revisar.
- Usuarios con acceso a información que no deberían consultar o modificar.
- Roles poco claros o permisos definidos solo de forma manual.
- Sesiones abiertas sin control suficiente.
```

Estos problemas no siempre se notan de inmediato. Muchas veces aparecen cuando se necesita corregir una inscripción, justificar un cambio, revisar cupos, cerrar un periodo, preparar reportes para coordinación académica o explicar quién realizó una modificación.

## Efectos en el proceso académico

Cuando la información está fragmentada, el proceso de inscripción se vuelve más lento y más propenso a errores.

El personal debe invertir tiempo en revisar datos, comparar archivos y corregir inconsistencias. También puede depender de personas específicas que conocen dónde está cada archivo, cómo se actualiza cierta información o quién tiene autorización para modificarla.

A nivel académico, esto puede generar inscripciones incorrectas, cursos con más estudiantes de los permitidos, estudiantes registrados en ofertas no disponibles, cupos mal calculados o información que no refleja el estado real del periodo.

A nivel administrativo, dificulta obtener una vista clara del proceso. Por ejemplo, saber cuántos estudiantes están inscritos, qué cursos tienen mayor demanda, cuántos cupos quedan disponibles, qué ofertas están completas, qué registros fueron importados con errores o qué usuario realizó un cambio importante.

## Información sensible

El proceso académico maneja datos personales y datos institucionales. No toda la información debería estar disponible para cualquier usuario ni todas las personas deberían poder modificar registros importantes.

Sin un control claro, pueden ocurrir modificaciones no autorizadas, exposición de datos sensibles o pérdida de confianza en la información registrada.

Por eso, el problema no se limita a ordenar datos. También incluye controlar el acceso, proteger operaciones importantes, administrar roles y permisos, controlar sesiones activas y mantener evidencia sobre los cambios realizados.

## Necesidad de control de acceso

El sistema necesita diferenciar responsabilidades.

Un usuario de consulta no debería registrar inscripciones. Un docente no debería modificar cupos generales si esa acción corresponde a coordinación. Un usuario administrativo no debería administrar permisos si no tiene autorización para ello.

El control de acceso debe permitir responder preguntas como:

```txt
- Qué usuario puede registrar estudiantes.
- Qué usuario puede importar estudiantes.
- Qué usuario puede crear o cerrar ofertas.
- Qué usuario puede registrar o cancelar inscripciones.
- Qué usuario puede consultar reportes.
- Qué usuario puede administrar roles y permisos.
- Qué sesiones están activas o fueron revocadas.
```

Los roles ayudan a agrupar responsabilidades. Los permisos ayudan a controlar acciones específicas. Las sesiones permiten controlar accesos activos y revocar accesos cuando sea necesario.

## Necesidad de trazabilidad

En el proceso de inscripción pueden ocurrir cambios, correcciones, anulaciones, importaciones, ajustes de estado y modificaciones de acceso. Si no existe trazabilidad, es difícil saber qué ocurrió realmente.

Algunas preguntas importantes serían:

```txt
- Quién registró una inscripción.
- Cuándo se modificó una inscripción.
- Por qué se canceló o cambió el estado de un registro.
- Qué datos fueron importados desde un archivo.
- Qué errores aparecieron durante una importación.
- Qué usuario realizó un cambio importante.
- Qué oferta cambió de estado y cuándo ocurrió.
- Cómo se llegó al cupo actual de una oferta.
- Qué usuario recibió un rol.
- Qué permisos fueron asignados a un rol.
- Qué sesión fue creada, cerrada o revocada.
```

Tener esta información ayuda a revisar errores, resolver reclamos y mantener control sobre el proceso académico.

## Necesidad de reportes

El seguimiento del proceso académico requiere información resumida y confiable. Si los reportes se preparan manualmente, pueden aparecer diferencias entre áreas o decisiones basadas en datos desactualizados.

La institución necesita consultar información como:

```txt
- Estudiantes activos.
- Inscripciones por periodo académico.
- Inscripciones por programa académico.
- Cursos con mayor demanda.
- Ofertas con cupos disponibles.
- Ofertas con cupos completos.
- Estudiantes inscritos en una oferta.
- Carga académica asociada a docentes.
- Resultados de importaciones.
- Registros con errores o inconsistencias.
```

Estos reportes permiten observar el estado del proceso sin depender de cálculos manuales o archivos aislados.

## Límite del problema

El problema se concentra en la gestión de información relacionada con la inscripción académica y el control de acceso necesario para protegerla.

Incluye elementos como:

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
- Reportes del proceso.
- Usuarios.
- Roles.
- Permisos.
- Sesiones.
- Seguridad y trazabilidad.
```

No se centra en pagos, asistencia, notas, horarios detallados, documentación institucional o comunicación con estudiantes. Esos procesos pueden relacionarse con la gestión académica, pero no forman parte del núcleo inicial del problema.

## Idea central

La inscripción académica debe entenderse como un proceso conectado. No basta con registrar estudiantes o cursos por separado. Lo importante es que la información se relacione correctamente y permita controlar el flujo académico.

Una inscripción depende de varios elementos:

```txt
Estudiante
Programa académico
Curso
Periodo académico
Oferta de curso
Cupo disponible
Estado de inscripción
Usuario autorizado
Seguimiento académico
```

Si alguno de estos datos está incompleto, duplicado, desactualizado o queda en manos de un usuario sin autorización, el proceso completo puede verse afectado.
