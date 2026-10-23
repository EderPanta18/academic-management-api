# Stack tecnológico

El sistema utiliza tecnologías seleccionadas según su función en el monolito modular, el procesamiento transaccional y la operación institucional. La selección tecnológica es parte del diseño del backend; **las responsabilidades del dominio y los contratos de aplicación no dependen de las bibliotecas que las implementan**.

Las versiones, opciones de ejecución y dependencias transitivas se administran mediante manifiestos y configuraciones ejecutables. No alteran las responsabilidades arquitectónicas ni los límites entre capacidades.

## 1. Lenguaje, runtime y framework

| Tecnología | Responsabilidad arquitectónica | Límite de uso |
| --- | --- | --- |
| **TypeScript** | Tipado y desarrollo de módulos, contratos, adaptadores y composición. | Los tipos de transporte y persistencia no gobiernan los modelos del dominio. |
| **Node.js** | Runtime de los procesos de aplicación y trabajo diferido. | Los procesos no dependen de memoria compartida para mantener consistencia funcional. |
| **NestJS** | Composición modular, inyección de dependencias, ciclo de vida y mecanismos de entrada. | Sus decoradores y contenedores quedan fuera de las reglas puras del dominio. |
| **Express**, integrado mediante NestJS | Adaptador de transporte HTTP para la API REST. | El protocolo HTTP no define la interfaz interna de los casos de uso. |

NestJS utiliza módulos declarativos para asociar implementaciones con contratos y ensamblar los procesos. Cada módulo conserva su superficie pública controlada; el contenedor resuelve la inyección de dependencias de acuerdo con las relaciones declaradas. El adaptador HTTP constituye un mecanismo de exposición de la aplicación y no la frontera exclusiva de entrada.

## 2. Persistencia y acceso a datos

| Tecnología | Responsabilidad arquitectónica | Límite de uso |
| --- | --- | --- |
| **PostgreSQL** | Persistencia relacional, integridad, transacciones y conservación histórica. | Los módulos no intercambian escrituras mediante acceso directo a tablas privadas ajenas. |
| **Prisma** | Acceso a datos, mapeo relacional y gestión de migraciones. | Los modelos y resultados del ORM no forman parte de los contratos puros del dominio. |
| **`@prisma/adapter-pg` y `pg`** | Conectividad entre Prisma y PostgreSQL. | Las decisiones de conexión pertenecen a infraestructura y composición. |

Los adaptadores de persistencia implementan los puertos que requiere la aplicación. La integridad concurrente combina restricciones de almacenamiento y coordinación transaccional, sin duplicar un contador persistente de cupos libres. El esquema y las migraciones determinan las columnas e índices físicos; los contratos de dominio conservan su independencia frente a ese detalle.

## 3. Mensajería y ejecución diferida

**PgBoss**, sobre PostgreSQL, implementa la cola persistente para trabajos y los mecanismos de entrega de eventos internos. Las capacidades funcionales declaran el significado de cada trabajo o hecho; la infraestructura gestiona publicación, recepción, reintentos y recuperación.

El **outbox transaccional** conserva, junto con el cambio de negocio, la intención de despacho que debe sobrevivir a fallos entre persistencia y publicación. Un relay técnico entrega esas intenciones a PgBoss. Los consumidores usan identidad estable de trabajo e idempotencia de efectos, porque una entrega puede repetirse.

El sistema distingue la admisión sincrónica y durable del procesamiento diferido. La cola no sustituye la fuente de verdad de importaciones ni participa en la decisión final de inscripciones interactivas.

## 4. Contratos y adaptación de entradas

| Tecnología | Función |
| --- | --- |
| **`class-validator` y `class-transformer`** | Validar y transformar datos en los límites de entrada HTTP. |
| **OpenAPI, `@nestjs/swagger` y Swagger UI** | Publicar y examinar el contrato de la API REST a partir de definiciones ejecutables. |
| **Multer** | Recibir los archivos cargados a través del adaptador HTTP. |
| **XLSX** | Interpretar archivos de hoja de cálculo admitidos en la importación. |

Las entradas CSV y XLSX se normalizan hacia contratos de aplicación y se someten a las mismas reglas funcionales. Las validaciones del transporte no sustituyen la elegibilidad, la unicidad ni los controles de negocio. OpenAPI representa el contrato HTTP ejecutable y mantiene la definición operativa de sus recursos y esquemas; los límites arquitectónicos se establecen mediante responsabilidades y contratos internos.

La arquitectura admite adaptadores de entrada adicionales por composición y contratos; ninguno altera el significado de los casos de uso por el solo hecho de utilizar otro protocolo.

## 5. Protección de identidad y sesiones

| Tecnología o mecanismo | Decisión de diseño |
| --- | --- |
| **Argon2id** | Protege contraseñas mediante derivación resistente a ataques sobre hashes. |
| **JWT** | Representa el acceso autenticado mediante tokens de vida corta, sujetos a validación de sesión y estado de cuenta. |
| **Refresh tokens rotativos** | Permiten renovar el acceso, con huellas protegidas en persistencia y revocación de sesiones. |
| **Cookies `HttpOnly`** | Transportan por separado los tokens de acceso y renovación sin exponerlos al JavaScript del cliente. |
| **Políticas CORS y validación de `Origin`** | Restringen orígenes autorizados y protegen operaciones que modifican estado. |

El backend aplica permisos efectivos desde su autoridad de autorización; no interpreta el contenido de un JWT como una copia definitiva de los permisos. Las primitivas criptográficas y los mecanismos de sesión pertenecen a adaptadores y servicios de seguridad; el dominio académico no contiene decisiones de transporte de credenciales.

Argon2id es el algoritmo seleccionado para contraseñas. Su elección no obliga a que el resto de la arquitectura dependa de una biblioteca concreta ni introduce autenticación pública por registro automático de usuarios.

## 6. Desarrollo, pruebas y mantenimiento

| Herramienta | Función |
| --- | --- |
| **pnpm** | Gestor de paquetes y ejecutor oficial de herramientas del proyecto, incluidas las de Prisma. |
| **Biome** | Formato y análisis estático del código. |
| **Jest** | Ejecución de pruebas unitarias y de integración. |
| **Supertest** | Verificación del comportamiento HTTP de la aplicación. |

La verificación de integridad de datos y concurrencia utiliza el almacenamiento y los mecanismos reales que garantizan esas propiedades; los tests unitarios aislados no sustituyen pruebas sobre restricciones transaccionales. Las herramientas de calidad verifican el código y sus comportamientos sin acoplar los contratos funcionales a los scripts de ejecución.

## 7. Regla de aislamiento tecnológico

Una elección tecnológica se usa donde implementa una responsabilidad y no se propaga a otras capas por comodidad. Las bibliotecas de entrada no aparecen en contratos de dominio; los tipos generados por Prisma no cruzan como modelos académicos; los jobs no contienen objetos internos del broker; y la gestión de paquetes no determina el diseño del sistema.

El stack es concreto y definido, pero sus adaptadores mantienen fronteras que permiten cambiar el mecanismo de ejecución, entrada o infraestructura conservando las reglas, las autorizaciones y el historial del sistema.
