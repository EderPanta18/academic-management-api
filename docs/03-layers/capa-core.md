# Capa core

La capa `core` contiene los elementos más estables y transversales del sistema.

Su contenido no pertenece a un módulo funcional específico y tampoco representa infraestructura técnica. Debe mantenerse independiente de NestJS, Prisma, HTTP, Swagger, archivos, base de datos o proveedores externos.

`core` debe ser pequeño, estable y difícil de cambiar.

## Responsabilidad principal

La responsabilidad de `core` es responder a esta pregunta:

```txt
¿Qué fundamentos internos son compartidos por el sistema sin depender de tecnología?
```

Aquí viven piezas que pueden ser usadas por varias capas sin crear acoplamiento con frameworks o detalles técnicos.

## Ubicación

```txt
src/
└── core/
```

## Qué puede contener

La estructura puede incluir:

```txt
src/core/
├── exceptions/
├── pagination/
├── contracts/
├── types/
├── value-objects/
└── index.ts
```

No todas las carpetas son obligatorias. Deben existir cuando el proyecto realmente las necesite.

## Excepciones base

`core/exceptions` puede contener errores base o abstracciones generales de error.

Ejemplos de responsabilidad:

```txt
- Error base de aplicación.
- Error base de dominio.
- Error base de validación.
- Error base de autorización.
```

Las excepciones específicas de estudiantes, ofertas, cursos o inscripciones deben permanecer dentro del módulo correspondiente.

## Paginación

`core/pagination` puede contener elementos generales de paginación.

Ejemplos de responsabilidad:

```txt
- Value object de paginación.
- Resultado paginado.
- Metadatos generales de paginación.
```

La forma HTTP de recibir paginación, como query params o DTOs de entrada, pertenece a la capa de presentación de los módulos o a `shared` si es reutilizable.

## Contratos fundamentales

`core/contracts` puede contener contratos realmente transversales.

Deben ser contratos que tengan sentido para varias partes del sistema y que no pertenezcan a un módulo específico.

Los contratos propios de un módulo deben quedarse dentro de ese módulo.

## Tipos y value objects generales

`core/types` y `core/value-objects` pueden contener tipos o valores reutilizables que no pertenecen a un dominio funcional concreto.

Si un value object solo tiene sentido para un módulo, no debe ir a `core`.

Ejemplos de ubicación correcta:

```txt
Código de estudiante
→ students/domain

Estado de inscripción
→ enrollments/domain

Paginación base
→ core/pagination
```

## Qué no pertenece a `core`

No deben vivir en `core`:

```txt
- Entidades académicas.
- Reglas de inscripción.
- Reglas de cupos.
- Repositorios.
- Controladores.
- DTOs HTTP.
- Configuración de entorno.
- Servicios Prisma.
- Decoradores Swagger.
- Parsers de archivos.
```

`core` no debe convertirse en una carpeta global para colocar lo que se repite.

## Dependencias permitidas

`core` no debe depender de las otras capas.

```txt
core → app       no
core → modules   no
core → platform  no
core → shared    evitar
```

Las demás capas pueden usar `core`.

```txt
modules → core
platform → core
shared → core
app → core
```

## Diferencia con `modules`

`modules` contiene negocio específico.

`core` contiene fundamentos generales.

Si una regla tiene dueño funcional, debe vivir en su módulo, aunque otro módulo la necesite. En ese caso, se debe exponer mediante un contrato de aplicación, no moverla a `core`.

## Diferencia con `platform`

`platform` contiene infraestructura técnica.

`core` no debe depender de tecnología.

Si un archivo necesita NestJS, Prisma, HTTP, variables de entorno o archivos externos, no pertenece a `core`.

## Diferencia con `shared`

`shared` contiene soporte práctico reutilizable.

`core` contiene piezas más fundamentales.

Una utilidad simple de texto no suele pertenecer a `core`. Un contrato transversal o una excepción base sí puede pertenecer a `core`.

## Crecimiento esperado

`core` debe crecer lentamente.

Agregar demasiadas piezas a `core` puede volverlo una capa ambigua. Cada nuevo elemento debe justificar que es estable, transversal y libre de tecnología.

## Criterio de uso

Antes de colocar algo en `core`, conviene preguntar:

```txt
¿Esto seguiría teniendo sentido si cambia el framework?
¿No pertenece a un módulo específico?
¿No depende de infraestructura?
¿Es suficientemente estable para ser base del sistema?
```

Si alguna respuesta no es clara, conviene ubicarlo en otra capa.
