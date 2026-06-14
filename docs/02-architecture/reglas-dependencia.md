# Reglas de dependencia

Este documento define las reglas de dependencia que deben respetarse dentro del backend. Su objetivo es evitar acoplamiento innecesario y proteger las reglas del negocio académico frente a detalles técnicos.

Las dependencias deben ser fáciles de explicar: las partes más concretas pueden conocer a las más estables, pero las partes estables no deben depender de detalles de ejecución.

## Principio base

La regla principal es:

```txt
El negocio no debe depender de la infraestructura.
```

Esto significa que las reglas de inscripción, cupos, estados o duplicidad no deben depender directamente de Prisma, NestJS, HTTP, Swagger o parsers de archivos.

## Dirección general

La dirección general esperada es:

```txt
main.ts
→ app
→ modules
→ core / shared
```

Y para infraestructura:

```txt
app
→ platform

modules/infrastructure
→ platform o adaptadores técnicos

platform
→ core / shared
```

## Dependencias permitidas

Relaciones permitidas:

```txt
app → modules
app → platform
app → core
app → shared

modules → core
modules → shared

modules/presentation → modules/application
modules/application → modules/domain
modules/infrastructure → modules/application
modules/infrastructure → modules/domain

platform → core
platform → shared

shared → core
```

Estas relaciones mantienen el centro del sistema independiente de detalles externos.

## Dependencias no permitidas

Relaciones que deben evitarse:

```txt
core → app
core → modules
core → platform
core → shared con lógica concreta

shared → modules
shared → platform

platform → modules

modules → app
modules/domain → infrastructure
modules/domain → presentation
modules/domain → Prisma
modules/domain → NestJS
modules/domain → HTTP
```

Si aparece una dependencia de este tipo, probablemente una responsabilidad está ubicada en el lugar incorrecto.

## Reglas para `core`

`core` es la zona más estable.

Puede ser usado por otras partes, pero no debe conocerlas.

Puede depender de:

```txt
- TypeScript.
- Elementos puros del lenguaje.
```

No debe depender de:

```txt
- NestJS.
- Prisma.
- HTTP.
- Swagger.
- Módulos funcionales.
- Platform.
- Shared si eso genera ciclos o acoplamiento innecesario.
```

## Reglas para `modules`

`modules` contiene el negocio y la aplicación funcional.

Un módulo puede depender de:

```txt
- core.
- shared.
- Sus propias carpetas internas.
- Contratos públicos de otros módulos, si son necesarios.
```

Debe evitar:

```txt
- Importar detalles internos de otro módulo.
- Depender de app.
- Usar Prisma directamente fuera de infrastructure.
- Colocar reglas académicas en presentation.
```

## Reglas internas de un módulo

Dentro de un módulo con estructura por capas, la dirección recomendada es:

```txt
presentation
→ application
→ domain

infrastructure
→ application
infrastructure
→ domain
```

El dominio no debe depender de presentación ni infraestructura.

```txt
domain
= no conoce controladores, DTOs HTTP ni repositorios concretos
```

La aplicación puede definir puertos o contratos para lo que necesita.

```txt
application
= coordina casos, usa contratos y reglas
```

La infraestructura implementa esos contratos.

```txt
infrastructure
= Prisma, mappers de persistencia, adaptadores técnicos
```

## Reglas para `platform`

`platform` contiene infraestructura global.

Puede depender de:

```txt
- core.
- shared.
- Librerías técnicas.
- Frameworks.
```

Debe evitar depender de módulos funcionales.

Ejemplo incorrecto:

```txt
platform/audit importa enrollments/domain
```

Ejemplo correcto:

```txt
enrollments usa un contrato o servicio de auditoría para registrar una acción
```

La plataforma ofrece capacidades, pero no debe conocer reglas académicas.

## Reglas para `shared`

`shared` debe mantenerse simple.

Puede depender de:

```txt
- core, si es necesario.
- TypeScript.
```

Debe evitar depender de:

```txt
- modules.
- platform.
- app.
- Prisma.
- NestJS, salvo que se trate de elementos compartidos claramente de presentación.
```

Si un elemento compartido empieza a tener demasiada lógica, debe moverse a un módulo o a `core`.

## Comunicación entre módulos

Los módulos no deberían acceder libremente a detalles internos de otros módulos.

Evitar:

```txt
students importa repositories internos de academic-programs
enrollments importa entidades internas no públicas de students
course-offerings consulta directamente infraestructura de courses
```

Preferir:

```txt
- Contratos públicos.
- Servicios de consulta internos.
- Puertos de aplicación.
- Composición desde app.
```

La regla práctica es que un módulo puede pedir información a otro, pero no debería meterse en su implementación.

## Casos comunes

### Inscripción necesita validar estudiante

`enrollments` necesita saber si un estudiante existe y si puede inscribirse.

No debería consultar directamente la tabla de estudiantes desde cualquier lugar.

Una opción limpia es que `students` exponga una capacidad interna o contrato de consulta:

```txt
StudentFinder
StudentEligibilityChecker
```

Así `enrollments` depende de una capacidad clara, no de detalles internos.

### Inscripción necesita validar oferta

`enrollments` necesita saber si una oferta existe, está abierta y tiene cupo.

`course-offerings` puede exponer una capacidad como:

```txt
CourseOfferingFinder
CourseOfferingAvailabilityChecker
```

La regla de inscripción queda clara y no se duplica lógica de oferta en cualquier parte.

### Importación necesita leer archivos

`students` puede tener el proceso de importación, pero la lectura CSV/XLSX puede estar en `platform/files`.

```txt
students
→ usa parser de archivos
→ valida filas según reglas de estudiantes
```

La lectura del archivo es técnica. La validación del estudiante es de negocio.

## Evitar ciclos

Los ciclos de dependencia vuelven difícil mantener el sistema.

Ejemplo problemático:

```txt
students → enrollments
enrollments → students
```

Si ambos módulos necesitan colaborar, se debe extraer un contrato o definir una dependencia en una sola dirección.

## Regla de revisión

Antes de aceptar una dependencia nueva, conviene preguntar:

```txt
¿La capa que importa es más concreta que la capa importada?
¿Estoy importando una capacidad o un detalle interno?
¿Esta dependencia hará más difícil probar la regla de negocio?
¿La regla académica queda atada a una herramienta?
¿El módulo importado debería exponer un contrato público?
```

Si la dependencia no se puede explicar con claridad, probablemente debe revisarse.
