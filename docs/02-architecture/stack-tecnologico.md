# Stack tecnológico

Este documento describe las tecnologías principales usadas por el backend y el criterio general para incorporar herramientas al proyecto.

El stack no define por sí mismo la arquitectura. La arquitectura indica cómo se organiza el código, cómo se separan responsabilidades y cómo se protegen las reglas del negocio. El stack indica con qué herramientas se construye y ejecuta esa arquitectura.

## Enfoque general

El proyecto usa un stack backend basado en TypeScript, NestJS, Prisma y PostgreSQL.

La intención es trabajar con herramientas conocidas, mantenibles y adecuadas para construir una API modular de gestión académica. El sistema debe poder crecer por módulos sin que las reglas del dominio queden atadas directamente a detalles técnicos como el ORM, el framework HTTP o una librería concreta.

Las tecnologías deben cumplir una función clara dentro del proyecto. No se agregan por moda ni por anticipar problemas que todavía no existen.

## Lenguaje

El lenguaje principal del proyecto es **TypeScript**.

TypeScript permite definir contratos claros entre capas, mejorar el autocompletado, reducir errores comunes y mantener mejor el código cuando el sistema crece.

Uso dentro del proyecto:

```txt
- Código fuente del backend.
- Entidades de dominio.
- Casos de uso.
- DTOs.
- Puertos.
- Repositorios.
- Mappers.
- Servicios.
- Configuración.
- Scripts auxiliares cuando corresponda.
```

## Runtime

El backend se ejecuta sobre **Node.js**.

Node.js actúa como entorno de ejecución para NestJS, Prisma, scripts del proyecto y herramientas de desarrollo.

## Framework backend

El framework principal es **NestJS**.

NestJS aporta estructura para construir el backend mediante módulos, controladores, providers, inyección de dependencias, pipes, guards, interceptores y filtros.

Uso dentro del proyecto:

```txt
- Módulo raíz de la aplicación.
- Módulos funcionales.
- Controladores HTTP.
- Inyección de dependencias.
- Providers.
- Pipes.
- Guards.
- Interceptores.
- Filtros de excepción.
```

NestJS organiza la aplicación, pero no debe definir las reglas del negocio académico ni las reglas funcionales de acceso. Las reglas importantes deben mantenerse dentro de los módulos funcionales y no quedar mezcladas directamente con controladores o decoradores del framework.

## Gestor de paquetes

El proyecto usa **pnpm** como gestor de paquetes.

Uso esperado:

```txt
- Instalación de dependencias.
- Ejecución de scripts.
- Gestión de paquetes.
- Comandos de desarrollo.
- Comandos de build, test y calidad.
```

## Base de datos

La base de datos principal es **PostgreSQL**.

PostgreSQL permite manejar relaciones, restricciones, consultas transaccionales e integridad de datos para la información académica y administrativa del sistema.

Uso dentro del proyecto:

```txt
- Personas.
- Estudiantes.
- Docentes.
- Programas académicos.
- Cursos.
- Periodos académicos.
- Ofertas de curso.
- Inscripciones.
- Usuarios.
- Roles.
- Permisos.
- Sesiones.
```

## ORM

El proyecto usa **Prisma** como ORM.

Prisma se encarga del modelado de base de datos, generación del cliente, migraciones, consultas y seeds.

Uso dentro del proyecto:

```txt
- Definición del schema.
- Generación del cliente.
- Migraciones.
- Seeds.
- Acceso técnico a persistencia.
- Repositorios y queries dentro de infraestructura.
```

Las entidades de dominio y los casos de uso no deberían depender directamente de Prisma. El acceso a datos debe quedar encapsulado en la infraestructura de cada módulo o en servicios técnicos de plataforma cuando corresponda.

## Autenticación y tokens

El proyecto puede usar **JWT** para autenticar solicitudes protegidas.

Uso esperado:

```txt
- Access token.
- Refresh token si aplica.
- Validación técnica de requests protegidos.
- Integración con guards de NestJS.
```

La autenticación puede apoyarse en JWT, pero la validez operativa del acceso se controla mediante sesiones registradas. Esto permite cerrar sesión, revocar accesos y limitar sesiones activas por usuario.

La gestión funcional de sesiones pertenece al módulo `auth`. El soporte técnico de JWT pertenece a `platform/security`.

## Validación y transformación

El proyecto puede usar **class-validator** y **class-transformer** para validar y transformar datos recibidos por HTTP.

Uso esperado:

```txt
- DTOs de request.
- DTOs de query.
- Validaciones de entrada.
- Conversión de tipos.
- Normalización inicial de datos recibidos.
```

Estas herramientas pertenecen principalmente a la capa de presentación. No reemplazan las reglas de negocio del dominio.

Ejemplo:

```txt
Validar que un campo sea string
→ presentación

Validar que una inscripción no supere el cupo de una oferta
→ negocio
```

## Documentación de API

El proyecto usa **Swagger / OpenAPI** mediante herramientas de NestJS.

Uso esperado:

```txt
- Documentar endpoints.
- Agrupar rutas por módulos.
- Describir DTOs de entrada y salida.
- Facilitar pruebas manuales de la API.
- Dar visibilidad al contrato HTTP.
```

Swagger documenta la API, pero no define el comportamiento del negocio.

## Manejo de archivos

El proyecto puede usar librerías para recibir y leer archivos, especialmente para procesos de importación.

Tecnologías posibles:

```txt
- Multer.
- XLSX.
```

Uso esperado:

```txt
- Recepción de archivos.
- Lectura de hojas de cálculo.
- Conversión de archivos a filas procesables.
- Soporte para importación de estudiantes.
```

La lectura técnica del archivo pertenece a infraestructura. La validación académica de los datos importados pertenece al módulo responsable del proceso.

## Configuración

La configuración puede gestionarse con **@nestjs/config** y variables de entorno.

Uso esperado:

```txt
- Puerto de la aplicación.
- URL de base de datos.
- Entorno de ejecución.
- Configuración JWT.
- Configuración CORS.
- Configuración de Swagger.
- Parámetros técnicos de infraestructura.
```

La configuración debe estar separada de las reglas de negocio.

## Calidad de código

El proyecto usa **Biome** para formato y revisión de código.

Biome permite mantener consistencia de estilo, detectar problemas y reducir fricción en el flujo de desarrollo.

Uso esperado:

```txt
- Formateo de código.
- Revisión estática.
- Corrección automática cuando aplique.
- Estilo consistente en el proyecto.
```

Biome reemplaza la necesidad de mantener varias herramientas separadas para tareas básicas de formato y linting cuando cubre el caso del proyecto.

## Testing

El proyecto puede usar **Jest** para pruebas.

Uso esperado:

```txt
- Pruebas unitarias.
- Pruebas de casos de uso.
- Pruebas de servicios.
- Pruebas de reglas de dominio.
- Pruebas de integración.
- Pruebas e2e cuando aplique.
```

Las pruebas más importantes deberían cubrir las reglas del proceso académico: cupos, duplicidad de inscripciones, estados válidos, periodo académico y restricciones de estudiante.

También deben cubrir reglas de acceso relevantes, como autenticación, sesiones, roles, permisos y protección de endpoints críticos.

## Scripts del proyecto

Los scripts se definen en `package.json`.

Tipos de scripts esperados:

```txt
start
start:dev
build
check
format
test
test:e2e
prisma:generate
prisma:migrate
prisma:seed
prisma:studio
```

Los nombres exactos pueden variar, pero deben mantener una intención clara.

## Criterio para instalar librerías

El proyecto no debe evitar librerías cuando una herramienta resuelve bien un problema real.

Si existe una librería mantenida, estable y adecuada para una necesidad concreta, puede instalarse en lugar de implementar una solución manual innecesaria.

El criterio general es:

```txt
- Si el problema es común y ya existe una librería confiable, se puede instalar.
- Si la librería reduce complejidad real, se puede instalar.
- Si la librería mejora seguridad, validación, parsing o integración, se puede instalar.
- Si la librería evita código propio frágil o difícil de mantener, se puede instalar.
```

Pero también se debe evitar instalar dependencias sin necesidad.

Antes de agregar una librería conviene revisar:

```txt
- Qué problema resuelve.
- Si el problema ya existe en el proyecto.
- Si está mantenida.
- Si tiene buen soporte en TypeScript.
- Si no introduce acoplamiento innecesario.
- Si no reemplaza una regla de negocio propia del sistema.
```

Una librería puede resolver un problema técnico. No debería ocultar decisiones importantes del dominio.

Ejemplo:

```txt
Leer un archivo XLSX
→ librería adecuada

Validar si un estudiante puede inscribirse
→ regla del sistema
```

## Relación entre tecnologías y capas

La relación general se entiende así:

```txt
NestJS
→ app, platform y presentation de módulos

Prisma
→ platform/database e infrastructure de módulos

PostgreSQL
→ base de datos externa

JWT
→ platform/security y auth

class-validator / class-transformer
→ presentation

Swagger / OpenAPI
→ platform/http y presentation

Multer / XLSX
→ platform/files

Biome
→ calidad y formato de código

Jest
→ pruebas
```

## Separación entre stack y arquitectura

El stack define herramientas. La arquitectura define cómo se organiza el código.

Ejemplo:

```txt
Prisma
= herramienta de persistencia

Repository Adapter
= forma arquitectónica de encapsular persistencia
```

La tecnología puede cambiar, pero la intención arquitectónica debería mantenerse.

## Resumen

```txt
Lenguaje       = TypeScript
Runtime        = Node.js
Framework      = NestJS
Paquetes       = pnpm
ORM            = Prisma
Base de datos  = PostgreSQL
Autenticación  = JWT + sesiones registradas
Validación     = class-validator / class-transformer
API Docs       = Swagger / OpenAPI
Archivos       = Multer / XLSX
Config         = @nestjs/config / variables de entorno
Calidad        = Biome
Testing        = Jest
```
