# Capa shared

La capa `shared` contiene soporte reutilizable ligero.

Su función es evitar duplicación en piezas simples que pueden usarse en más de una parte del sistema, sin convertirlas en reglas de negocio, infraestructura o fundamentos centrales.

`shared` debe mantenerse reducido. No debe convertirse en una carpeta genérica para colocar todo lo que no se sabe ubicar.

## Responsabilidad principal

La responsabilidad de `shared` es responder a esta pregunta:

```txt
¿Qué piezas simples y reutilizables pueden compartirse sin romper fronteras?
```

## Ubicación

```txt
src/
└── shared/
```

## Estructura posible

Puede incluir:

```txt
src/shared/
├── decorators/
├── dtos/
├── helpers/
├── mappers/
├── schemas/
├── types/
├── utils/
└── index.ts
```

La estructura puede variar según las necesidades reales del proyecto.

## `decorators`

Puede contener decoradores reutilizables por varias partes del sistema.

Si un decorador pertenece a un módulo específico, debe vivir en ese módulo.

Si un decorador forma parte de infraestructura global, debe evaluarse si corresponde a `platform`.

## `dtos`

Puede contener DTOs realmente compartidos.

Deben ser estructuras simples y transversales. Los DTOs propios de una operación deben permanecer en el módulo correspondiente.

Ejemplo de criterio:

```txt
DTO usado por un solo módulo
→ modules/<module>/presentation/dtos

DTO transversal reutilizable
→ shared/dtos
```

## `helpers` y `utils`

Contienen funciones auxiliares simples.

Pueden incluir:

```txt
- Normalización básica de texto.
- Limpieza de valores.
- Transformaciones simples.
- Utilidades puras sobre objetos o arrays.
```

No deben contener reglas académicas.

Ejemplo incorrecto:

```txt
canEnrollStudent()
```

Esa regla pertenece a un módulo funcional.

## `mappers`

Puede contener mappers reutilizables y simples.

Los mappers propios de una entidad, una respuesta HTTP de un módulo o un modelo de persistencia deben permanecer dentro del módulo correspondiente.

## `schemas`

Puede contener schemas compartidos por varias rutas o módulos.

Por ejemplo:

```txt
- Schema común de paginación.
- Schema común de parámetros.
- Schema común de filtros simples.
```

Los schemas de una operación concreta deben vivir en el módulo dueño.

## `types`

Puede contener tipos auxiliares no fundamentales.

Si el tipo representa una base estable del sistema, debe evaluarse si pertenece a `core`.

Si el tipo pertenece a una capacidad funcional, debe quedarse en su módulo.

## Qué no pertenece a `shared`

No deberían vivir en `shared`:

```txt
- Entidades.
- Casos de uso.
- Repositorios.
- Reglas de negocio.
- Validaciones académicas.
- Servicios Prisma.
- Configuración de entorno.
- Parsers de archivos.
- Formatos globales HTTP aplicados por infraestructura.
```

El hecho de que algo se use en más de un lugar no significa automáticamente que deba ir a `shared`.

## Diferencia con `core`

`core` contiene base estable.

`shared` contiene soporte práctico.

```txt
core
= fundamentos del sistema

shared
= reutilización ligera
```

## Diferencia con `platform`

`platform` contiene infraestructura técnica.

`shared` no debe encapsular tecnología de ejecución.

```txt
platform/files
= parser de archivos

shared/helpers
= función simple de normalización
```

## Diferencia con `modules`

`modules` contiene negocio.

`shared` no debe decidir reglas funcionales.

```txt
modules/enrollments
= regla de inscripción

shared/utils
= utilidad simple sin dominio
```

## Dependencias permitidas

`shared` puede depender de:

```txt
- core
- TypeScript
- utilidades puras
```

Debe evitar depender de:

```txt
- modules
- platform
- app
- Prisma
- NestJS cuando implique infraestructura global
```

## Crecimiento esperado

`shared` puede crecer mientras conserve su naturaleza ligera.

Si una utilidad empieza a acumular reglas del dominio, debe moverse al módulo dueño. Si empieza a depender de tecnología, debe moverse a `platform`. Si se vuelve una base estable del sistema, puede evaluarse moverla a `core`.

## Criterio de uso

Antes de colocar algo en `shared`, conviene preguntar:

```txt
¿Es simple?
¿Es reutilizable?
¿No depende de infraestructura?
¿No contiene reglas de negocio?
¿No pertenece claramente a un módulo?
```

Si alguna respuesta no encaja, no debería ir en `shared`.
