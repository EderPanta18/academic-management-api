# Capa platform

La capa `platform` contiene infraestructura técnica global.

En un proyecto NestJS, esta capa agrupa los mecanismos que permiten que la aplicación funcione: configuración, base de datos, HTTP global, Swagger, archivos, seguridad técnica, auditoría, logging, cache o integraciones externas.

`platform` no contiene reglas de negocio académico ni reglas funcionales de acceso. Su papel es ofrecer capacidades técnicas al resto de la aplicación.

## Responsabilidad principal

La responsabilidad de `platform` es responder a esta pregunta:

```txt
¿Qué mecanismos técnicos necesita la aplicación para ejecutarse?
```

La infraestructura debe estar separada del negocio para que las reglas académicas y de acceso no dependan directamente de herramientas concretas.

## Ubicación

```txt
src/
└── platform/
```

## Estructura posible

La estructura puede incluir:

```txt
src/platform/
├── config/
├── database/
├── http/
├── files/
├── security/
├── audit/
├── logging/
├── cache/
├── queue/
├── storage/
├── integrations/
└── index.ts
```

No todas las carpetas deben existir desde el inicio. Deben aparecer cuando el proyecto realmente las necesite.

## `config`

Contiene configuración técnica del entorno.

Puede incluir:

```txt
- Carga de variables de entorno.
- Validación de configuración.
- Configuración de base de datos.
- Configuración JWT.
- Configuración CORS.
- Configuración Swagger.
- Configuración general de runtime.
```

No debe contener reglas de negocio.

## `database`

Contiene la infraestructura de conexión a base de datos usada por la aplicación.

En este proyecto puede contener la integración técnica con Prisma.

```txt
platform/database
= conexión y soporte técnico de base de datos
```

Los repositorios concretos de cada módulo no deberían vivir aquí. Deben vivir en la infraestructura del módulo dueño.

```txt
modules/<module>/infrastructure/persistence
= repositorios y queries del módulo
```

La carpeta raíz `prisma/` permanece fuera de `src` porque contiene schema, migraciones y seeds.

## `http`

Contiene infraestructura global relacionada con HTTP.

Puede incluir:

```txt
- Filtros globales.
- Interceptores globales.
- Pipes globales.
- Guards globales.
- Formato global de respuestas.
- Configuración Swagger/OpenAPI.
- Health check.
```

Los controladores funcionales no pertenecen a `platform/http`. Pertenecen a `presentation` dentro de cada módulo.

## `files`

Contiene infraestructura técnica para manejo de archivos.

Puede incluir:

```txt
- Recepción técnica de archivos.
- Lectura de CSV.
- Lectura de XLSX.
- Estrategias de parsing.
- Conversión de archivos a filas simples.
```

La validación de negocio de esas filas no pertenece a `platform/files`.

Ejemplo:

```txt
platform/files
= interpreta archivo

students/application
= valida si los datos representan estudiantes válidos
```

## `security`

Contiene soporte técnico de seguridad.

Puede incluir:

```txt
- JWT.
- Hash de contraseñas.
- Guards técnicos.
- Decoradores técnicos.
- Estrategias de autenticación.
- Extracción del usuario autenticado.
- Utilidades relacionadas con tokens.
```

`platform/security` no administra usuarios, roles, permisos ni sesiones como reglas funcionales.

Responsabilidades funcionales:

```txt
modules/auth
= login, logout, refresh token y sesiones

modules/users
= cuentas y estado del usuario

modules/roles
= roles y asignación de roles

modules/permissions
= permisos y asignación de permisos
```

Responsabilidades técnicas:

```txt
platform/security
= validar token, aplicar guards, hacer hash, exponer decorators técnicos
```

## `audit`

Contiene infraestructura transversal de auditoría.

Puede registrar:

```txt
- Usuario responsable.
- Acción realizada.
- Recurso afectado.
- Fecha.
- Datos mínimos de contexto.
```

La auditoría no debe decidir reglas de negocio.

Ejemplo correcto:

```txt
enrollments cancela inscripción
→ platform/audit registra acción
```

Ejemplo incorrecto:

```txt
platform/audit decide si una inscripción se puede cancelar
```

Si se requieren endpoints para consultar auditoría, puede existir un módulo funcional de consulta. La infraestructura transversal de registro puede mantenerse en `platform/audit`.

## `logging`

Contiene soporte técnico de logs y observabilidad.

Puede incluir:

```txt
- Logger de aplicación.
- Registro técnico de errores.
- Trazas operativas.
```

Logging no es lo mismo que auditoría funcional. El log ayuda a diagnosticar problemas técnicos. La auditoría ayuda a reconstruir acciones importantes del sistema.

## `cache`, `queue`, `storage` e `integrations`

Estas carpetas pueden aparecer si el sistema las necesita.

```txt
cache
= almacenamiento temporal

queue
= trabajos asíncronos

storage
= almacenamiento de archivos

integrations
= clientes hacia servicios externos
```

No deben agregarse por anticipado si no existe una necesidad real.

## Qué no pertenece a `platform`

No deberían vivir en `platform`:

```txt
- Entidades de dominio.
- Casos de uso.
- Reglas de inscripción.
- Validaciones de cupos.
- Estados académicos como lógica funcional.
- Reglas de programas académicos.
- Repositorios globales de negocio.
- Administración de roles.
- Administración de permisos.
- Flujo funcional de sesiones de usuario.
```

Si algo decide una regla del proceso académico o de acceso funcional, pertenece a `modules`.

## Dependencias permitidas

`platform` puede depender de:

```txt
- core
- shared
- librerías técnicas
- NestJS
- Prisma
- proveedores externos
```

`platform` no debe depender de módulos funcionales.

```txt
platform → modules  no
```

Los módulos pueden usar `platform` desde su infraestructura.

```txt
modules/*/infrastructure → platform
```

## Crecimiento esperado

`platform` puede crecer cuando aparecen nuevas necesidades técnicas.

Ese crecimiento no debería obligar a cambiar reglas de negocio.

Por ejemplo, cambiar la forma de leer archivos no debería cambiar la regla que valida si un estudiante importado es válido. Cambiar Prisma no debería cambiar la regla que impide superar el cupo de una oferta. Cambiar la estrategia JWT no debería cambiar la regla funcional de roles y permisos.

## Criterio de uso

Antes de colocar algo en `platform`, conviene preguntar:

```txt
¿Esto depende de tecnología, framework, entorno, base de datos, HTTP, archivos o servicios externos?
```

Si la respuesta es sí, probablemente pertenece a `platform`.

Si la respuesta es “esto decide una regla académica o de acceso funcional”, no pertenece a `platform`.
