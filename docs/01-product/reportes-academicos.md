# Reportes académicos

Este documento describe los reportes que tienen sentido dentro del alcance inicial del sistema. No se plantea una capa avanzada de analítica, sino consultas útiles para revisar el proceso de inscripción y el estado operativo de la información académica.

Los reportes deben ayudar a responder preguntas frecuentes sin depender de hojas de cálculo ni cálculos manuales.

## Enfoque de los reportes

Los reportes se enfocan en el seguimiento del proceso de inscripción.

La institución necesita saber qué está ocurriendo con estudiantes, ofertas, cupos, inscripciones e importaciones. Esta información permite detectar problemas, revisar demanda y tomar decisiones operativas.

Los reportes no deberían modificar datos. Su propósito es observar el estado del sistema.

## Reportes sobre estudiantes

Estos reportes ayudan a revisar la población estudiantil registrada.

Ejemplos:

```txt
Estudiantes activos.
Estudiantes por programa académico.
Estudiantes por estado académico.
Estudiantes registrados recientemente.
Estudiantes importados desde archivos.
Estudiantes con datos incompletos u observados.
```

Estos reportes son útiles para validar que la información base esté preparada antes de iniciar o continuar un proceso de inscripción.

## Reportes sobre programas académicos

Estos reportes permiten observar cómo se distribuyen los estudiantes e inscripciones por programa académico.

Ejemplos:

```txt
Cantidad de estudiantes por programa académico.
Cantidad de inscripciones por programa académico.
Programas con mayor volumen de inscripciones.
Programas con estudiantes sin inscripciones registradas en un periodo.
```

El objetivo es tener una vista general de la actividad académica por programa sin depender de conteos manuales.

## Reportes sobre cursos

Estos reportes ayudan a identificar demanda y actividad del catálogo académico.

Ejemplos:

```txt
Cursos con mayor demanda.
Cursos sin ofertas activas.
Cursos ofertados por periodo académico.
Cursos con más estudiantes inscritos.
Cursos relacionados con programas académicos específicos.
```

Estos reportes permiten revisar qué cursos están teniendo mayor movimiento dentro del proceso.

## Reportes sobre ofertas de curso

Las ofertas de curso son claves porque sobre ellas se realizan las inscripciones.

Reportes útiles:

```txt
Ofertas abiertas.
Ofertas cerradas.
Ofertas canceladas.
Ofertas con cupos disponibles.
Ofertas con cupos completos.
Ofertas sin estudiantes inscritos.
Ofertas por periodo académico.
Ofertas por docente asignado.
Ofertas con alta ocupación.
Ofertas con baja ocupación.
```

Estos reportes ayudan a revisar disponibilidad, capacidad y avance del periodo académico.

## Reportes sobre cupos

El control de cupos debe tener reportes propios porque afecta directamente la inscripción.

Reportes útiles:

```txt
Cupo máximo por oferta.
Cupo disponible por oferta.
Cantidad de inscritos activos por oferta.
Porcentaje de ocupación por oferta.
Ofertas que alcanzaron el cupo máximo.
Ofertas próximas a llenarse.
Ofertas con cupo disponible.
```

Estos reportes permiten detectar rápidamente qué ofertas todavía pueden recibir estudiantes y cuáles ya están completas.

## Reportes sobre inscripciones

Estos reportes muestran el estado del proceso central del sistema.

Ejemplos:

```txt
Inscripciones por periodo académico.
Inscripciones por programa académico.
Inscripciones por oferta de curso.
Inscripciones por estado.
Inscripciones registradas recientemente.
Inscripciones canceladas o rechazadas.
Estudiantes inscritos en una oferta específica.
Historial básico de inscripción de un estudiante.
```

Es importante que los reportes distingan estados. Una inscripción activa no debe mezclarse sin contexto con una cancelada o rechazada.

## Reportes sobre docentes

Estos reportes ayudan a revisar la participación de docentes en las ofertas académicas.

Ejemplos:

```txt
Ofertas asignadas por docente.
Cantidad de estudiantes asociados a ofertas de un docente.
Docentes sin ofertas asignadas.
Carga académica básica por periodo.
```

El objetivo no es gestionar toda la carga laboral, sino tener una vista útil para el proceso académico.

## Reportes sobre importaciones

La importación de estudiantes debe poder revisarse después de ejecutarse.

Reportes útiles:

```txt
Importaciones realizadas.
Cantidad de registros procesados.
Cantidad de registros aceptados.
Cantidad de registros observados.
Errores por fila.
Errores más frecuentes.
Fecha y usuario responsable de la importación.
```

Estos reportes permiten revisar qué ocurrió durante una carga masiva y corregir datos sin perder contexto.

## Indicadores generales

Además de reportes específicos, puede existir un resumen general del periodo académico.

Indicadores posibles:

```txt
Total de estudiantes activos.
Total de ofertas abiertas.
Total de inscripciones activas.
Total de inscripciones canceladas.
Total de cupos disponibles.
Porcentaje de ocupación de ofertas.
Cursos con mayor demanda.
Ofertas completas.
Ofertas sin inscritos.
Últimas importaciones realizadas.
```

Este resumen puede servir como base para un dashboard administrativo.

## Filtros necesarios

Los reportes deberían poder filtrarse por criterios básicos.

Filtros comunes:

```txt
Periodo académico.
Programa académico.
Curso.
Oferta de curso.
Docente.
Estado.
Rango de fechas.
```

Sin filtros, los reportes pueden volverse demasiado generales y poco útiles.

## Consideraciones sobre consistencia

Los reportes deben reflejar el estado real del proceso.

Por eso, deben tener cuidado con registros cancelados, retirados, duplicados o importados con errores.

Algunas consideraciones:

```txt
Una inscripción cancelada no debería contar como inscripción activa.
Una inscripción rechazada no debería ocupar cupo.
Una oferta completa debe calcularse según cupo máximo e inscripciones activas.
Un estudiante suspendido debe aparecer con su estado correspondiente.
Una importación debe diferenciar registros aceptados y registros con error.
Los reportes deben evitar mezclar datos de periodos distintos sin indicarlo.
```

## Reportes fuera del alcance inicial

Para mantener el sistema enfocado, algunos reportes no forman parte de la primera versión.

Fuera del alcance inicial:

```txt
Reportes financieros.
Reportes de pagos o deudas.
Reportes de asistencia.
Reportes de calificaciones.
Reportes de rendimiento académico avanzado.
Reportes de horarios detallados.
Reportes institucionales complejos.
```

Estos reportes pueden agregarse más adelante si el sistema crece hacia otras áreas académicas o administrativas.

## Resumen operativo

En la primera versión, los reportes deberían responder principalmente estas preguntas:

```txt
¿Cuántos estudiantes están activos?
¿Cuántas inscripciones existen en un periodo?
¿Qué cursos tienen mayor demanda?
¿Qué ofertas tienen cupos disponibles?
¿Qué ofertas están completas?
¿Qué estudiantes están inscritos en una oferta?
¿Qué docentes tienen ofertas asignadas?
¿Qué ocurrió en una importación de estudiantes?
```

Con esos reportes, el sistema ya permite seguir el proceso de inscripción de forma más confiable que mediante archivos manuales.
