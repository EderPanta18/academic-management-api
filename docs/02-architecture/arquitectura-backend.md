# Arquitectura backend

Este documento describe la arquitectura general del backend desde una perspectiva técnica. La intención es explicar cómo se organiza la aplicación para sostener el proceso de inscripción académica sin mezclar reglas de negocio con detalles de framework, base de datos o transporte HTTP.

El sistema se plantea como una API backend modular. Su núcleo funcional está en los módulos de negocio: estudiantes, docentes, programas académicos, cursos, periodos académicos, ofertas de curso, inscripciones, seguridad y reportes.

## Enfoque general

El backend se organiza alrededor de una separación clara de responsabilidades.

```txt
Negocio académico
→ reglas, entidades, casos de aplicación y contratos

Presentación HTTP
→ controladores, DTOs, validación de entrada y documentación de API

Infraestructura
→ base de datos, archivos, configuración, autenticación técnica y servicios externos

Composición
→ arranque, registro de módulos y configuración global
```

La idea es que el sistema pueda crecer sin que todo quede concentrado en controladores o servicios grandes. Cada parte debe tener una razón clara para existir.

## Principio principal

La regla principal de la arquitectura es que el negocio no debe depender directamente de detalles técnicos.

Por ejemplo:

```txt
- La regla de que una oferta no puede superar su cupo no depende de Prisma.
- La regla de que un estudiante suspendido no puede inscribirse no depende de HTTP.
- La regla de que una inscripción duplicada debe bloquearse no depende de Swagger.
- La trazabilidad de una acción no debería estar mezclada con el controlador.
```

Las herramientas técnicas son necesarias, pero no deben definir el modelo del sistema.

## Capas conceptuales

El backend se puede leer en cuatro niveles principales:

```txt
Presentación
Aplicación
Dominio
Infraestructura
```

No todos los módulos tienen que ser excesivamente complejos, pero la separación debe mantenerse cuando exista lógica suficiente.

## Presentación

La presentación es la parte que recibe y responde solicitudes HTTP.

Aquí viven elementos como:

```txt
- Controladores.
- DTOs de entrada.
- DTOs de salida.
- Validaciones de formato.
- Decoradores de documentación.
- Mappers hacia respuestas HTTP.
```

La presentación no debería contener reglas de negocio importantes. Su función es recibir datos, validarlos superficialmente, llamar a la aplicación y devolver una respuesta clara.

Ejemplo de responsabilidades correctas:

```txt
- Leer parámetros de ruta.
- Leer filtros de consulta.
- Validar forma del body.
- Convertir una respuesta de aplicación a DTO HTTP.
```

Ejemplo de responsabilidades que no deberían vivir aquí:

```txt
- Decidir si un estudiante puede inscribirse.
- Calcular cupos disponibles.
- Cambiar estados académicos directamente.
- Consultar Prisma desde el controlador.
```

## Aplicación

La capa de aplicación coordina acciones del sistema.

Aquí se ubican los casos de aplicación, comandos, consultas y contratos que expresan lo que el sistema puede hacer.

Ejemplos:

```txt
- Registrar estudiante.
- Importar estudiantes.
- Crear oferta de curso.
- Inscribir estudiante.
- Cambiar estado de inscripción.
- Obtener reportes académicos.
```

La aplicación coordina reglas, validaciones de negocio, consultas a repositorios y operaciones transversales como auditoría cuando corresponde.

No debería depender directamente del protocolo HTTP.

## Dominio

El dominio contiene las reglas propias del negocio académico.

Aquí viven conceptos como:

```txt
- Estudiante.
- Docente.
- Programa académico.
- Curso.
- Periodo académico.
- Oferta de curso.
- Inscripción.
- Estados del proceso.
```

El dominio debe expresar comportamiento cuando el concepto lo necesita.

Ejemplos:

```txt
- Una oferta sabe si está abierta.
- Una oferta sabe si tiene cupo disponible.
- Un estudiante sabe si está habilitado según su estado.
- Una inscripción sabe si puede cambiar de estado.
```

El dominio no debe depender de NestJS, Prisma, HTTP, Swagger ni detalles de infraestructura.

## Infraestructura

La infraestructura conecta el sistema con herramientas externas.

Aquí se ubican adaptadores concretos para:

```txt
- Persistencia con Prisma.
- Base de datos PostgreSQL.
- Lectura de archivos CSV/XLSX.
- Hash de contraseñas.
- JWT o mecanismos de autenticación.
- Registro de auditoría.
- Configuración del entorno.
```

La infraestructura implementa detalles, pero no debe decidir reglas de negocio.

Por ejemplo, un repositorio puede guardar una inscripción, pero no debería decidir por sí solo si el estudiante puede inscribirse. Esa decisión pertenece al dominio o a la aplicación.

## Módulos funcionales

Los módulos funcionales representan capacidades del sistema.

Para este proyecto, los módulos principales pueden ser:

```txt
auth
users
roles
persons
students
professors
academic-programs
courses
academic-periods
course-offerings
enrollments
reports
catalogs
```

No todos tienen el mismo peso. Algunos contienen reglas fuertes, como `enrollments` o `course-offerings`. Otros pueden ser más simples, como `catalogs`.

## Capacidades transversales

Algunas capacidades no pertenecen a un solo módulo de negocio.

Ejemplos:

```txt
files
audit
database
config
security
```

Estas capacidades pueden vivir en `platform` porque son infraestructura o soporte técnico utilizado por varios módulos.

La importación de estudiantes, por ejemplo, pertenece funcionalmente a `students`, pero puede apoyarse en un parser de archivos ubicado en `platform/files`.

## Relación con el proceso de inscripción

La arquitectura debe sostener el proceso definido en la documentación de producto:

```txt
Estudiante
→ Programa académico
→ Curso
→ Periodo académico
→ Oferta de curso
→ Inscripción
→ Reportes
```

Por eso, los módulos no deben organizarse solo por tablas, sino por responsabilidades del negocio.

El sistema no trata la inscripción como un CRUD aislado. La inscripción depende del estado del estudiante, de la oferta, del periodo, del cupo y de reglas de duplicidad.

## Criterio de simplicidad

La arquitectura no debe volverse más compleja que el problema.

Un módulo simple puede tener menos carpetas. Un módulo con reglas fuertes puede tener separación más clara entre dominio, aplicación, infraestructura y presentación.

La regla práctica es:

```txt
Si solo expone datos simples, mantenerlo simple.
Si coordina reglas importantes, separar responsabilidades.
```

Esto evita crear estructura innecesaria solo por formalidad.

## Resultado esperado

La arquitectura backend debe permitir:

```txt
- Mantener reglas de negocio fuera de controladores.
- Evitar que Prisma invada el dominio.
- Proteger el proceso de inscripción con reglas claras.
- Separar infraestructura de lógica académica.
- Ubicar cada archivo por responsabilidad.
- Facilitar pruebas de reglas y casos principales.
- Permitir crecimiento sin perder orden.
```
