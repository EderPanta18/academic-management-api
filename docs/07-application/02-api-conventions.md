# Convenciones de la API REST

La API REST es el contrato HTTP de acceso institucional a las capacidades de aplicación. **Expone operaciones y resultados**, no la distribución de clases, tablas ni adaptadores internos. La versión, los formatos de respuesta y las políticas comunes se aplican de manera uniforme a los recursos incluidos en el alcance del sistema.

La definición ejecutable de las operaciones, parámetros y esquemas se publica mediante OpenAPI. Este diseño establece las convenciones comunes sin mantener un segundo inventario de endpoints o DTOs que pueda divergir de aquel contrato.

## 1. Identificación y semántica de recursos

- Todas las rutas públicas de la API utilizan el prefijo **`/api/v1`**.
- Los nombres de recursos son sustantivos plurales, en inglés y `kebab-case`. Los identificadores corresponden a recursos funcionales estables y no a posiciones de una colección.
- Las rutas expresan la jerarquía funcional solo cuando representa una relación de pertenencia real. La estructura de carpetas o los nombres de módulos no determinan automáticamente rutas públicas.
- `GET` consulta recursos o colecciones sin efectos de modificación; `POST` admite creaciones u operaciones funcionales explícitas; `PATCH` modifica parcialmente recursos donde la actualización está permitida; `DELETE` se reserva a bajas o eliminaciones expresamente admitidas. Ningún recurso obtiene estas operaciones automáticamente por disponer de un módulo, una tabla o un mecanismo de baja lógica.
- Las transiciones sujetas a reglas y evidencia propia se exponen como **operaciones intencionales**. No se ofrece una actualización genérica de `status` para forzar cancelaciones, retiros, cambios de sección o correcciones.

Una consulta de estado histórico no modifica ese estado. La baja lógica no implica eliminación física ni habilita por sí sola una operación de restauración. Los recursos no disponibles para las operaciones ordinarias se tratan como no encontrados en ese ámbito; las condiciones que bloquean una operación admitida se comunican como conflictos funcionales.

## 2. Estructura común de respuestas

Las respuestas con cuerpo utilizan JSON y una envoltura común:

| Campo        | Propósito                                                                      |
| ------------ | ------------------------------------------------------------------------------ |
| `success`    | Indica si la operación tuvo un resultado satisfactorio o fallido.              |
| `statusCode` | Estado HTTP efectivo de la respuesta.                                          |
| `timestamp`  | Momento del resultado, expresado como fecha y hora inequívoca.                 |
| `path`       | Ruta HTTP atendida, sin secretos ni credenciales.                              |
| `data`       | Resultado de la operación satisfactoria: recurso, lista o resultado compuesto. |
| `error`      | Descripción estructurada del fallo, con código, mensaje y detalles permitidos. |

Las respuestas satisfactorias incluyen `success: true` y `data`, sin un error ficticio. Las respuestas fallidas incluyen `success: false` y `error`, sin un resultado exitoso ficticio en `data`. Los errores de validación, autorización o negocio mantienen códigos y descripciones consistentes; los fallos inesperados no divulgan trazas, consultas internas ni información de otros usuarios.

Una operación que devuelve una lista completa presenta la colección directamente en `data`. Una operación paginada presenta en `data` el conjunto de elementos y sus metadatos de paginación. La forma del resultado es estable para cada operación y no cambia según la cantidad de registros devueltos.

La estructura de salida se aplica desde el adaptador HTTP: no impone que los casos de uso reciban o devuelvan objetos con campos `statusCode` o `path`. Las cookies de autenticación se gestionan mediante cabeceras seguras, **no como tokens serializados dentro de `data`**.

## 3. Estados HTTP y significado

| Código                      | Uso contractual                                                                                                                          |
| --------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------- |
| `200 OK`                    | Lectura o modificación confirmada con resultado representado.                                                                            |
| `201 Created`               | Recurso creado y confirmado.                                                                                                             |
| `202 Accepted`              | Trabajo admitido de manera durable, cuya ejecución todavía no se declara finalizada.                                                     |
| `204 No Content`            | Respuesta sin cuerpo, únicamente cuando el contrato de la operación la admite.                                                           |
| `400 Bad Request`           | Estructura, parámetros o validación de entrada inválidos.                                                                                |
| `401 Unauthorized`          | Credenciales o sesión inexistentes, inválidas o no vigentes.                                                                             |
| `403 Forbidden`             | Cuenta autenticada sin autorización efectiva para la operación.                                                                          |
| `404 Not Found`             | Recurso o referencia solicitada no encontrada dentro del acceso permitido.                                                               |
| `409 Conflict`              | Solicitud incompatible con una condición funcional o estado concurrente, incluida la duplicidad de una operación que no puede repetirse. |
| `500 Internal Server Error` | Falla interna no representada como rechazo funcional; se entrega sin detalles sensibles.                                                 |

Las operaciones de creación y modificación comunican normalmente `201` o `200`, con una respuesta estructurada. Si una operación admite `204`, no devuelve cuerpo ni envoltura JSON. Un conflicto académico, una solicitud inválida y un problema de autorización **no se ocultan como errores `500`**. El rechazo de una operación atómica no comunica éxito parcial.

## 4. Validación y normalización de entrada

La entrada HTTP valida tipo, formato, obligatoriedad y límites declarados de cada parámetro. En las estructuras sujetas a un contrato de entrada definido, las propiedades no reconocidas se rechazan explícitamente, en lugar de descartarse en silencio; los campos declarados como extensibles se rigen por sus propias reglas. También se rechazan conversiones ambiguas. Los identificadores y los filtros se validan antes de invocar el caso de uso. Para nombres, códigos, siglas y correos electrónicos sujetos a unicidad, la comparación ignora mayúsculas, minúsculas y espacios exteriores sin eliminar acentos ni espacios interiores; esta regla también rige las comprobaciones definitivas de persistencia. La identidad documental conserva su unicidad global sin depender de la baja lógica.

La aplicación vuelve a evaluar vigencia, referencias y reglas funcionales sobre los datos aceptados, sin confiar en que la validación sintáctica demuestre por sí sola la validez de una operación académica. Las fechas y ventanas académicas se verifican desde la autoridad del servidor, no desde un reloj aportado por el cliente.

Los archivos se reciben mediante el mecanismo de carga HTTP y se entregan al caso de uso responsable con su identidad y metadatos esenciales. El contenido de un archivo no se interpreta como una petición genérica de actualización de entidades.

## 5. Listados, filtros y paginación

- Las consultas de colecciones potencialmente extensas utilizan paginación desde **`page=1`**, con **`limit=20`** por defecto y **`limit=100`** como máximo. Las colecciones acotadas pueden devolverse completas cuando así lo establece el contrato de consulta.
- Los filtros y criterios de ordenación pertenecen a un conjunto explícitamente admitido por cada consulta. Se rechazan filtros, campos de ordenación y tamaños no autorizados.
- El orden es determinista e incluye un criterio estable de desempate para evitar resultados ambiguos entre páginas.
- Los resultados paginados se representan dentro de `data` mediante `items` y `meta`. Los metadatos incluyen `page` (página efectiva), `limit` (tamaño aplicado), `totalItems` (cantidad de elementos que satisfacen los filtros), `totalPages` (cantidad de páginas resultante), `hasNextPage` (existencia de elementos en páginas posteriores) y `hasPreviousPage` (existencia de una posición de página anterior). No se duplica `meta` en la raíz ni se altera la estructura de cada elemento.
- Los metadatos se calculan coherentemente a partir de los mismos filtros, el tamaño de página y el total de elementos. Los indicadores de navegación son derivados, no estados independientes: no se persisten ni se mantienen por separado. Una colección sin coincidencias informa `totalItems=0` y `totalPages=0`; la ausencia de elementos en una página no suprime los metadatos ni modifica la forma contractual de la respuesta.
- Los listados no paginados devuelven la colección directamente en `data`, sin `items` ni metadatos de paginación. Una misma operación no alterna entre ambos formatos en función del número de resultados.
- Las consultas ordinarias de entidades con baja lógica excluyen los registros eliminados y los tratan como no encontrados cuando se solicitan individualmente. Los antecedentes solo se consultan mediante las capacidades históricas expresamente previstas, con la autorización y los filtros propios de cada una. No existe un filtro universal para incluir registros eliminados ni se confunde la baja lógica con un estado funcional inactivo.

La paginación limita la cantidad de resultados, no las reglas de visibilidad. Una cuenta autorizada para reportes no puede navegar hacia datos nominales restringidos utilizando filtros diferentes.

## 6. Seguridad del contrato HTTP

La API opera con sesiones autenticadas transportadas en cookies `HttpOnly` de acceso y renovación. La recepción de una cookie no basta por sí sola: el servidor valida la sesión, la situación de la cuenta y los permisos efectivos en cada operación protegida. Los cambios de estado comprueban además la procedencia permitida de la solicitud.

La política de CORS permite credenciales únicamente para orígenes autorizados; no convierte a cualquier origen en un cliente confiable. Las rutas de autenticación mantienen sus propias restricciones de emisión, renovación y revocación sin exponer secretos por JSON, URL o registros.

La especificación OpenAPI describe la autenticación por cookies, distingue operaciones públicas y protegidas, y representa las respuestas realmente contractuales, incluidos el envoltorio común, los resultados paginados o no paginados y los errores estructurados. La documentación no concede acceso ni expone credenciales. Los recursos de estudiantes, reportes, importaciones y auditoría no se hacen públicos por el hecho de estar documentados.

## 7. Evolución y compatibilidad

El prefijo de versión delimita cambios incompatibles del contrato de transporte. Dentro de una versión se conservan la semántica de las operaciones, los identificadores funcionales y las convenciones de respuesta. Los cambios internos de módulos, adaptadores, workers o almacenamiento **no alteran por sí mismos la versión de la API**.

El contrato se mantiene mediante definiciones ejecutables y sus pruebas; los textos conceptuales no reemplazan esa fuente de verdad con un listado exhaustivo de rutas o tipos.
