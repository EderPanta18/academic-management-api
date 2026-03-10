# Arquitectura del Sistema

## API de Gestión Académica

**Versión:** 1.0

---

## Decisión Arquitectónica

El sistema implementa **Clean Architecture** combinada con el patrón **Ports and Adapters** (Arquitectura Hexagonal). La elección responde a un requisito de mantenibilidad a largo plazo: la lógica de negocio debe ser completamente independiente del framework HTTP, del ORM y del motor de base de datos.

En términos prácticos esto significa que el dominio puede compilar y ejecutarse sin NestJS, sin Prisma y sin MySQL. Un cambio de ORM, de motor de base de datos o de framework no requiere modificar una sola línea de lógica de negocio, porque esa lógica no sabe que esos elementos existen.

**Stack técnico:** NestJS como framework HTTP, Prisma como ORM y MySQL como base de datos relacional. Estos solo aparecen en las capas de `infrastructure` y `presentation` dentro de cada módulo.

---

## Estructura de Alto Nivel

El proyecto se organiza en cuatro zonas principales dentro de `src/`. Cada zona tiene una responsabilidad clara y delimitada.

| Zona       | Responsabilidad                                                                                                                                                           |
| ---------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `app/`     | Configuración y arranque del servidor: registro global de filtros, interceptores, pipes, documentación de la API y el endpoint de salud del sistema                       |
| `core/`    | Conceptos de dominio y aplicación transversales a todos los módulos: clase base de excepciones, objetos de valor, DTOs de respuesta estándar. No importa ningún framework |
| `shared/`  | Infraestructura y utilidades técnicas transversales: cliente de base de datos, módulo de parseo de archivos y componentes de presentación reutilizables                   |
| `modules/` | Los diez módulos de negocio del sistema, cada uno autónomo y organizado en sus propias cuatro capas                                                                       |

---

## Las Cuatro Capas dentro de un Módulo

Cada módulo de negocio se organiza internamente en exactamente cuatro capas. Cada una tiene responsabilidades estrictamente definidas y una sola dirección de conocimiento.

### `domain`

El núcleo del módulo. Contiene:

- **Entidades:** representan los conceptos de negocio con sus datos y comportamiento. Son clases simples sin ningún decorador ni dependencia de framework externo.
- **Puertos:** interfaces que declaran qué necesita la lógica de negocio del exterior sin definir cómo se implementa. Un puerto de repositorio declara `save(entity)` o `findById(id)`, pero no sabe si detrás hay una base de datos SQL, un servicio externo o cualquier otro mecanismo.
- **Excepciones de dominio:** errores propios del negocio, con sus propiedades tipadas e independientes del protocolo HTTP.
- **Enums de estado:** los valores posibles de los estados de negocio de cada entidad (`ACTIVE`, `INACTIVE`, `ENROLLED`, etc.).
- **Objetos de valor:** clases inmutables que encapsulan un concepto junto con sus reglas de validación. Por ejemplo, los parámetros de paginación se modelan como un objeto que valida en su constructor que `page >= 1` y que `pageSize` no supere el máximo permitido. Los casos de uso reciben este objeto ya validado, nunca los valores en bruto de la petición HTTP.

Esta capa no importa ninguna librería externa. Es la más estable del sistema.

### `application`

Orquestación de la lógica de negocio. Contiene:

- **Casos de uso:** cada uno representa una única operación de negocio. Reciben como entrada un Command o Query, aplican las reglas de negocio, llaman a los puertos del dominio y retornan el resultado. No conocen el protocolo HTTP ni el mecanismo de persistencia.
- **Commands:** objetos simples e inmutables que representan la intención de ejecutar una operación de escritura (crear, actualizar, eliminar). No llevan validaciones HTTP; la validación ya ocurrió en la capa de presentación antes de que lleguen aquí.
- **Queries:** objetos simples que representan una intención de lectura con filtros opcionales.

### `infrastructure`

Implementación concreta de los contratos declarados en `domain`. Contiene:

- **Repositorios:** implementan los puertos del dominio y traducen sus operaciones en consultas al ORM.
- **Mappers de persistencia:** traducen entre el modelo que devuelve la base de datos (incluyendo datos de tablas relacionadas obtenidos con JOINs) y la entidad de dominio. Son el único lugar del sistema que conoce la estructura interna de las tablas.

### `presentation`

El adaptador HTTP del módulo. Contiene:

- **Controladores:** reciben la petición HTTP, validan la entrada mediante DTOs, construyen el Command o Query correspondiente, invocan el caso de uso y devuelven la respuesta mapeada al DTO de salida. No contienen lógica de negocio.
- **DTOs de entrada:** clases que definen la forma esperada del cuerpo de la petición y las reglas de validación de cada campo.
- **DTOs de salida:** clases que definen exactamente qué devuelve cada endpoint al consumidor de la API.
- **Mappers HTTP:** traducen entre la entidad de dominio y el DTO de respuesta. Completamente independientes de los mappers de persistencia; un cambio en el contrato de la API no afecta cómo se almacenan los datos.
- **Decoradores de documentación:** agrupan las anotaciones Swagger del módulo para no repetirlas en cada endpoint.

---

## Regla de Dependencia

La dirección de conocimiento apunta siempre hacia adentro. Nunca se invierte.

```
presentation  →  application  →  domain
infrastructure               →  domain
```

- `domain` no importa nada externo.
- `application` solo conoce `domain`.
- `infrastructure` solo conoce `domain`.
- `presentation` conoce `application` y `domain`.

Las violaciones más comunes que se deben evitar:

- Un controlador que llama directamente al repositorio, saltándose el caso de uso.
- Un caso de uso que importa un DTO de request HTTP.
- Una entidad de dominio que usa un decorador del framework.

---

## Estructura de los Módulos de Negocio

El sistema tiene **10 módulos de negocio**, organizados en dos grupos según si dependen o no de otros módulos.

### Módulos base — sin dependencias de negocio

| Módulo              | Responsabilidad                                                                         |
| ------------------- | --------------------------------------------------------------------------------------- |
| Personas            | Datos de identidad personal comunes a todos los actores del sistema                     |
| Departamentos       | Unidades organizacionales que agrupan carreras y profesores                             |
| Carreras            | Programas académicos con su plan de estudios y créditos requeridos para graduarse       |
| Períodos Académicos | Ciclos semestrales con fechas de inicio y cierre. Solo uno puede estar vigente a la vez |
| Categorías de Curso | Clasificación temática opcional del catálogo de cursos                                  |

### Módulos de negocio — con dependencias cruzadas

| Módulo           | Responsabilidad                                                                            | Nivel |
| ---------------- | ------------------------------------------------------------------------------------------ | ----- |
| Profesores       | Actor docente con estado operativo                                                         | 1     |
| Estudiantes      | Actor estudiantil con trayectoria académica y soporte de importación masiva                | 1     |
| Cursos           | Definición permanente de unidades académicas, independiente de cuándo se dicten            | 2     |
| Ofertas de Curso | Instancia concreta de un curso en un período y sección, con cupos y profesor asignado      | 3     |
| Inscripciones    | Vínculo formal entre un estudiante y una oferta activa, con historial de cambios de estado | 4     |

El módulo de Inscripciones es el de mayor nivel: consume a todos los demás pero ningún módulo lo consume a él.

---

## Puertos de un Módulo: Cuántos y Para Qué

No todos los módulos necesitan los mismos puertos. La cantidad y tipo de puertos depende de la complejidad del módulo y de si su entidad puede devolverse directamente o requiere datos de otra tabla.

### Módulos con entidad simple

Cuando la entidad del módulo contiene todos sus datos en una sola tabla, el repositorio puede devolverla directamente para lectura y escritura. En este caso un único puerto de repositorio es suficiente.

Operaciones típicas: `save`, `findById`, `findAll` (paginado), `softDelete`.

### Módulos con entidad agregada

Cuando la entidad del módulo depende de datos de otra tabla para construirse completa, las consultas de lectura requieren un JOIN que el repositorio principal no maneja de forma directa. En estos casos se define un puerto de lectura separado que retorna una **vista plana**: una proyección con exactamente los campos que el endpoint necesita devolver, ya aplanados, sin necesidad de trabajar con la entidad de dominio completa.

Este patrón aplica a los módulos cuyos actores dependen de la tabla de personas para obtener nombre, DNI y correo. En ese escenario coexisten:

- **Puerto de escritura:** opera sobre la entidad de dominio del módulo.
- **Puerto de lectura:** retorna vistas planas que combinan los datos del módulo con los datos de persona en una sola consulta.

Separar ambos puertos garantiza que las lecturas estén optimizadas para la presentación y que los cambios en el contrato HTTP no afecten la lógica de escritura ni viceversa.

### Puerto de verificación externa

Todo módulo que otros módulos necesiten consultar exporta adicionalmente un tercer puerto, reducido exclusivamente a operaciones de verificación de existencia y estado: `exists(id)` e `isActive(id)`. Sin escritura, sin datos, sin lógica de negocio expuesta. Es el único contrato que otros módulos pueden consumir del módulo proveedor.

---

## Comunicación entre Módulos

Los módulos de negocio nunca se importan directamente entre sí. La comunicación se realiza exclusivamente a través de los puertos de verificación externa.

El módulo proveedor exporta su puerto de verificación y su token de inyección de dependencias. El módulo consumidor declara una dependencia sobre ese token en su caso de uso. Nunca importa el módulo de origen ni accede a sus casos de uso, sus repositorios ni sus entidades directamente.

**Ejemplo conceptual:** el módulo de Ofertas de Curso necesita verificar que un profesor existe y está activo antes de asignarlo. No importa el módulo de Profesores: recibe el contrato `IProfessorFinder` por inyección de dependencias. Quién lo implementa y cómo accede a los datos es completamente transparente para el consumidor.

Este diseño garantiza que:

- Los módulos de nivel inferior no conocen a los de nivel superior.
- Cambiar la implementación interna de un módulo no afecta a los que lo consumen.
- El grafo de dependencias no contiene ciclos.

---

## Grafo de Dependencias

Las flechas representan dependencia a través de un puerto de verificación exportado, no una importación directa de módulos.

```
Personas ──────────────────────────────────┐
Departamentos ─────────────────────────────┼──► Profesores ──────────────────────┐
Carreras ──────────────────────────────────┼──► Estudiantes                      │
Períodos Académicos ───────────────────────┤                                      ├──► Inscripciones
Categorías de Curso ───────────────────────┘──► Cursos ──► Ofertas de Curso ──────┘
```

No existen ciclos. El módulo de Inscripciones está en el extremo del grafo y no exporta ningún contrato hacia otros módulos.

---

## Parseo de Archivos para Importación Masiva

El módulo de Estudiantes soporta la creación masiva de registros desde un archivo adjunto. El mecanismo de parseo se implementa con el **patrón Strategy**: existe una interfaz abstracta de parser con una implementación concreta por cada formato soportado. El sistema selecciona la implementación adecuada según la extensión del archivo recibido.

Un interceptor actúa antes del controlador: recibe la petición con el archivo adjunto, aplica la estrategia de parseo correspondiente y adjunta al request el resultado ya estructurado, filas procesadas correctamente separadas de las filas con errores de estructura. El controlador recibe los datos listos y los delega al caso de uso sin procesar el archivo.

---

## Jerarquía de Excepciones de Dominio

El sistema implementa tres niveles de herencia que permiten al manejador global de errores construir la respuesta de error sin condicionales, sin importar qué excepción concreta se haya lanzado.

```
ExcepciónBase (core)
│   Contrato obligatorio para toda excepción del sistema:
│   message · statusCode · domain · errorKey · errorCode
│
├── ExcepciónEntidadNoEncontrada (core)
│       Para cuando un módulo busca una entidad
│       de otro módulo y no la encuentra
│
├── ExcepciónBase del módulo  (domain/exceptions de cada módulo)
│       Establece: prefijo del código de error del módulo
│                  código HTTP por defecto del módulo
│
└── Excepción concreta  (domain/exceptions o application/exceptions)
        Declara: mensaje descriptivo para el consumidor
                 sufijo numérico del código de error
        Código resultante: PROF001, COFF007, ENR001
```

**Por qué tres niveles:**

- **Nivel 1:** el manejador global siempre tiene todas las propiedades necesarias sin saber qué excepción concreta llegó.
- **Nivel 2:** cambiar el comportamiento de todas las excepciones de un módulo requiere modificar un solo archivo.
- **Nivel 3:** cada error tiene su propio mensaje y código únicos, identificables por el cliente sin parsear el texto del mensaje.

Las excepciones que dependen de la coordinación entre múltiples módulos viven en `application/exceptions` en lugar de `domain/exceptions`, porque su regla involucra información de más de un contexto.

---

## Pipeline de una Petición HTTP

Toda petición recorre una secuencia de pasos en orden fijo. Cada paso tiene una responsabilidad precisa y no se puede alterar.

```
Petición entrante
      │
      ▼
 1. Middlewares
      Se ejecutan antes del enrutamiento, con acceso
      al objeto Request y Response completos.
      Uso: logging de trazabilidad, inyección de contexto.
      │
      ▼
 2. Guards
      Deciden si la petición tiene permiso de continuar.
      Si el guard rechaza, el pipeline se interrumpe
      y retorna HTTP 403 sin llegar al controlador.
      │
      ▼
 3. Interceptores (fase de entrada)
      El interceptor de logging registra método, ruta y momento de inicio.
      El interceptor de parseo de archivos actúa aquí
      en el endpoint de importación masiva.
      │
      ▼
 4. Pipes
      Transforman y validan el cuerpo de la petición:
      — Convierten el JSON recibido al tipo del DTO declarado
      — Ejecutan todas las validaciones definidas en el DTO
      — Eliminan cualquier propiedad no declarada en el DTO
      — Si alguna validación falla, retornan HTTP 400 con
        un mapa detallado campo → mensajes de error,
        sin llegar al controlador
      │
      ▼
 5. Controlador  ◄── frontera entre presentation y application
      Construye el Command o Query con los datos validados.
      Llama al caso de uso. No contiene lógica de negocio.
      │
      ▼
 6. Caso de uso
      Orquesta la lógica de negocio:
      valida reglas, consulta puertos, actualiza estado.
      │
      ▼
 7. Repositorio  ◄── frontera entre application e infrastructure
      Ejecuta la operación de persistencia.
      Retorna la entidad de dominio o la vista de lectura.
      │
      ▼
 8. Interceptores (fase de salida)
      Envuelven el resultado en el contrato estándar de respuesta.
      Registran código de estado y tiempo total de la petición.
      │
      ▼
 9. Filtros de excepción (solo si ocurrió un error)
      — Filtro de dominio: captura toda excepción que herede
        de ExcepciónBase y construye la respuesta estructurada.
      — Filtro general: captura cualquier otro error inesperado.
        Retorna HTTP 500 sin exponer detalles internos.
      │
      ▼
Respuesta JSON al cliente
```

---

## Contratos de Respuesta HTTP

Toda respuesta del sistema sigue dos estructuras fijas, generadas por los componentes globales sin intervención del controlador.

**Respuesta exitosa** — producida por el interceptor de respuesta:

```json
{
  "success": true,
  "statusCode": 200,
  "data": {},
  "timestamp": "2026-03-09T21:00:00.000Z",
  "path": "/api/v1/..."
}
```

**Respuesta de error** — producida por el filtro de excepciones de dominio:

```json
{
  "success": false,
  "statusCode": 404,
  "domain": "PROFESSOR",
  "errorKey": "PROFESSOR_NOT_FOUND",
  "errorCode": "PRO_F001",
  "message": "No se encontró un profesor con el id 5",
  "timestamp": "2026-03-09T21:00:00.000Z",
  "path": "/api/v1/professors/5"
}
```

El campo `errorCode` es el identificador tipado que el cliente usa para reaccionar a errores concretos sin depender del texto del mensaje, lo que hace el contrato resistente a cambios en la redacción.

---

## Convenciones Transversales de Persistencia

Todos los modelos de base de datos aplican las siguientes convenciones sin excepción.

### Borrado lógico

Ningún registro se elimina físicamente. En lugar de ejecutar un `DELETE`, se escribe la fecha y hora actual en el campo `deleted_at`. Un registro con ese campo no nulo se considera inactivo y no aparece en ninguna consulta normal del sistema.

Esto preserva la integridad referencial, mantiene el historial completo y permite recuperar datos si fuera necesario.

### Campos de auditoría

Todo modelo registra `created_at` (asignado automáticamente al insertar) y `updated_at` (actualizado automáticamente por la base de datos en cada modificación). La aplicación no necesita enviar estos valores.

### Claves primarias

Entero sin signo, autoincrementado, en todos los modelos. La excepción son los módulos cuyas entidades heredan su identidad del módulo de Personas: en esos casos la clave primaria es la misma clave foránea que apunta a la tabla de personas, lo que garantiza que no pueda existir un actor del sistema sin una persona asociada.
