# Documentación

Esta carpeta reúne la documentación interna del backend académico.

El objetivo es mantener una referencia clara del producto, la arquitectura, las capas, la API, la seguridad, los datos, la operación básica y el roadmap del sistema.

La documentación está organizada por tema para que cada archivo tenga un propósito específico y no mezcle decisiones de producto con detalles técnicos o de operación.

## Naturaleza de esta documentación

Esta documentación es una **guía de referencia**, no una especificación rígida.

Sirve para explicar el problema, ordenar decisiones, dejar claro qué se espera del sistema y por qué se organiza de cierta manera. Su función es orientar el desarrollo y mantener coherencia entre las partes del proyecto.

Durante la implementación, algunos detalles pueden desarrollarse ligeramente distintos a lo que dice un archivo. Eso es esperado y no invalida el documento. Los nombres exactos de archivos, la estructura de carpetas, los scripts, los comandos o la ubicación precisa de una pieza pueden ajustarse si el caso lo justifica y la decisión se mantiene coherente con la arquitectura general.

La documentación debe actualizarse cuando cambia una decisión importante, no cada vez que un detalle menor se implementa de forma distinta.

## Estructura

```txt
docs/
├── 01-product/
├── 02-architecture/
├── 03-layers/
├── 04-api/
├── 05-security/
├── 06-data/
├── 07-operations/
├── 08-roadmap/
└── README.md
```

## 01-product

Define el problema, el alcance y el comportamiento esperado del sistema desde el punto de vista funcional.

Archivos:

```txt
alcance-sistema.md
contexto-problema.md
proceso-inscripcion.md
reglas-negocio.md
reportes-academicos.md
vision-dominio.md
```

Usar esta sección para entender qué resuelve el sistema, qué queda fuera del alcance inicial y cuáles son las reglas principales del dominio académico.

## 02-architecture

Describe la arquitectura general del backend y las reglas de organización del código fuente.

Archivos:

```txt
arquitectura-backend.md
arquitectura-fuente.md
estructura-fuente.md
fronteras-modulos.md
reglas-dependencia.md
stack-tecnologico.md
```

Usar esta sección para entender cómo se organiza el proyecto, qué responsabilidades tiene cada zona del código y qué dependencias están permitidas.

## 03-layers

Explica las capas internas del backend y el propósito de cada una.

Archivos:

```txt
capa-app.md
capa-core.md
capa-modulos.md
capa-platform.md
capa-workers.md
capa-shared.md
```

Usar esta sección para decidir dónde debe ir una clase, servicio, contrato, helper, módulo, integración técnica o proceso asíncrono.

## 04-api

Documenta criterios de diseño HTTP, formato de respuesta, manejo de errores, paginación y OpenAPI.

Archivos:

```txt
diseno-api.md
formato-respuesta.md
guia-openapi.md
manejo-errores.md
paginacion-filtros.md
```

Usar esta sección al crear o modificar endpoints.

## 05-security

Define autenticación, autorización, roles, permisos, sesiones y trazabilidad.

Archivos:

```txt
autenticacion.md
autorizacion.md
roles-permisos.md
trazabilidad-auditoria.md
```

Usar esta sección para implementar login, protección de rutas, permisos, sesiones y auditoría.

## 06-data

Describe el modelo de datos, el esquema de base de datos, el DDL y los datos semilla.

Archivos:

```txt
modelado-datos.md
esquema-db.md
ddl.sql
seeds.md
```

Usar esta sección para entender tablas, relaciones, enums, restricciones, índices y seeds iniciales.

Los UUID del sistema se generan desde el backend o desde el proceso de seed. La base de datos valida los identificadores, pero no los genera mediante defaults.

## 07-operations

Contiene documentación operativa mínima y estable.

Archivos:

```txt
variables-entorno.md
setup-local.md
```

Usar esta sección para revisar configuración de entorno y flujo local general.

Los comandos concretos pueden cambiar según los scripts del proyecto. Por eso esta sección evita documentar una operación demasiado rígida.

## 08-roadmap

Define el orden recomendado de implementación y posibles mejoras futuras.

Archivos:

```txt
plan-implementacion.md
mejoras-futuras.md
```

Usar esta sección para diferenciar lo que pertenece a la primera versión de lo que puede evaluarse más adelante.

## Criterios de mantenimiento

La documentación debe mantenerse alineada con el código y con las decisiones del proyecto, sin volverse un freno para el desarrollo.

Criterios:

```txt
- No duplicar información innecesariamente.
- No documentar scripts inestables como si fueran definitivos.
- No mezclar producto, arquitectura, datos y operación en un mismo archivo.
- Mantener nombres de archivos claros y relativamente cortos.
- Preferir decisiones explícitas antes que reglas ambiguas.
- Actualizar documentación cuando cambie una decisión importante.
- No actualizar documentación por detalles menores que no cambian el sentido.
- Cuando la implementación difiera ligeramente de lo documentado, priorizar el sentido y no la literalidad.
```

## Nombres de archivos

Los nombres deben ser descriptivos sin ser demasiado largos.

Criterio usado:

```txt
contexto-problema.md
reglas-negocio.md
fronteras-modulos.md
formato-respuesta.md
roles-permisos.md
modelado-datos.md
plan-implementacion.md
```

Evitar nombres demasiado extensos con exceso de conectores.

## Orden de lectura recomendado

Para entender el sistema desde cero:

```txt
1. 01-product/contexto-problema.md
2. 01-product/alcance-sistema.md
3. 01-product/vision-dominio.md
4. 02-architecture/arquitectura-backend.md
5. 02-architecture/arquitectura-fuente.md
6. 02-architecture/estructura-fuente.md
7. 03-layers/capa-modulos.md
8. 03-layers/capa-workers.md
9. 04-api/diseno-api.md
10. 05-security/autenticacion.md
11. 06-data/modelado-datos.md
12. 08-roadmap/plan-implementacion.md
```

Para implementar un módulo nuevo:

```txt
1. Revisar alcance funcional.
2. Revisar fronteras de módulos.
3. Revisar reglas de capas.
4. Revisar diseño API.
5. Revisar seguridad y permisos.
6. Revisar modelo de datos.
7. Ubicar el módulo en el plan de implementación.
```

Si el módulo diferirá trabajo a workers, conviene revisar también:

```txt
1. 02-architecture/reglas-dependencia.md
2. 03-layers/capa-workers.md
3. 03-layers/capa-platform.md
```

## Criterio general

La documentación debe ayudar a construir el sistema sin imponer ruido innecesario.

```txt
Producto
= qué se necesita

Arquitectura
= cómo se organiza

Capas
= dónde va cada responsabilidad

API
= cómo se expone

Seguridad
= cómo se protege

Datos
= qué se persiste

Operación
= cómo se configura

Roadmap
= en qué orden avanzar
```

La documentación orienta, pero no reemplaza el juicio técnico durante la implementación. Cuando el código y la documentación entren en conflicto, conviene decidir cuál refleja mejor la intención actual y actualizar el otro.
