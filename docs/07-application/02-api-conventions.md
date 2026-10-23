# Convenciones de la API REST

La API REST es el contrato HTTP de acceso institucional a las capacidades de aplicación. **Expone operaciones y resultados**, no la distribución de clases, tablas ni adaptadores internos. La versión, los formatos de respuesta y las políticas comunes se aplican de manera uniforme a los recursos incluidos en el alcance del sistema.

La definición ejecutable de las operaciones, parámetros y esquemas se publica mediante OpenAPI. Este diseño establece las convenciones comunes sin mantener un segundo inventario de endpoints o DTOs que pueda divergir de aquel contrato.

## 1. Identificación y semántica de recursos

- Todas las rutas públicas de la API utilizan el prefijo **`/api/v1`**.
- Los nombres de recursos son sustantivos plurales, en inglés y `kebab-case`. Los identificadores corresponden a recursos funcionales estables y no a posiciones de una colección.
- Las rutas expresan la jerarquía funcional solo cuando representa una relación de pertenencia real. La estructura de carpetas o los nombres de módulos no determinan automáticamente rutas públicas.
- `GET` consulta recursos o colecciones sin efectos de modificación; `POST` admite creaciones u operaciones funcionales explícitas; `PATCH` modifica parcialmente recursos donde la actualización está permitida; `DELETE` se reserva a eliminaciones realmente admitidas por el dominio.
- Las transiciones sujetas a reglas y evidencia propia se exponen como **operaciones intencionales**. No se ofrece una actualización genérica de `status` para forzar cancelaciones, retiros, cambios de sección o correcciones.

Una consulta de estado histórico no modifica ese estado. La deshabilitación de una referencia institucional no autoriza una eliminación física de registros que sustentan movimientos anteriores.

## 2. Estructura común de respuestas

Las respuestas con cuerpo utilizan JSON y mantienen los campos comunes siguientes:

| Campo | Propósito |
| --- | --- |
| `statusCode` | Estado HTTP efectivo de la respuesta. |
| `timestamp` | Momento del resultado, expresado como fecha y hora inequívoca. |
| `path` | Ruta HTTP atendida, sin secretos ni credenciales. |
| `data` | Recurso, colección o resultado funcional de una respuesta satisfactoria. |
| `meta` | Metadatos de consulta o paginación cuando correspondan. |

Las respuestas fallidas mantienen `statusCode`, `timestamp` y `path`, y expresan una **descripción de error** mediante `message`; cuando existe detalle validable, este se incorpora de forma estructurada sin divulgar trazas, consultas internas ni información de otros usuarios. No incluyen un recurso de éxito fingido en `data`.

La estructura de salida se aplica desde el adaptador HTTP: no impone que los casos de uso reciban o devuelvan objetos con campos `statusCode` o `path`. Las cookies de autenticación se gestionan mediante cabeceras seguras, **no como tokens serializados dentro de `data`**.

## 3. Estados HTTP y significado

| Código | Uso contractual |
| --- | --- |
| `200 OK` | Lectura o modificación confirmada con resultado representado. |
| `201 Created` | Recurso creado y confirmado. |
| `202 Accepted` | Trabajo admitido de manera durable, cuya ejecución todavía no se declara finalizada. |
| `204 No Content` | Operación completada para la cual no se devuelve cuerpo. |
| `400 Bad Request` | Estructura, parámetros o validación de entrada inválidos. |
| `401 Unauthorized` | Credenciales o sesión inexistentes, inválidas o no vigentes. |
| `403 Forbidden` | Cuenta autenticada sin autorización efectiva para la operación. |
| `404 Not Found` | Recurso o referencia solicitada no encontrada dentro del acceso permitido. |
| `409 Conflict` | Solicitud incompatible con una condición funcional o estado concurrente, incluida la duplicidad de una operación que no puede repetirse. |
| `500 Internal Server Error` | Falla interna no representada como rechazo funcional; se entrega sin detalles sensibles. |

`204` no lleva envoltura JSON porque carece de cuerpo. Un conflicto académico, una solicitud inválida y un problema de autorización **no se ocultan como errores `500`**. El rechazo de una operación atómica no comunica éxito parcial.

## 4. Validación y normalización de entrada

La entrada HTTP valida tipo, formato, obligatoriedad y límites declarados de cada parámetro. Se rechazan campos inesperados y conversiones ambiguas; una propiedad no reconocida no debe convertirse silenciosamente en una modificación. Los identificadores y los filtros se validan antes de invocar el caso de uso.

La aplicación vuelve a evaluar vigencia, referencias y reglas funcionales sobre los datos aceptados, sin confiar en que la validación sintáctica demuestre por sí sola la validez de una operación académica. Las fechas y ventanas académicas se verifican desde la autoridad del servidor, no desde un reloj aportado por el cliente.

Los archivos se reciben mediante el mecanismo de carga HTTP y se entregan al caso de uso responsable con su identidad y metadatos esenciales. El contenido de un archivo no se interpreta como una petición genérica de actualización de entidades.

## 5. Listados, filtros y paginación

- Las colecciones se paginan desde **`page=1`**, con **`limit=20`** por defecto y **`limit=100`** como máximo.
- Los filtros y criterios de ordenación pertenecen a un conjunto explícitamente admitido por cada consulta. Se rechazan filtros, campos de ordenación y tamaños no autorizados.
- El orden es determinista e incluye un criterio estable de desempate para evitar resultados ambiguos entre páginas.
- `meta` identifica al menos la página efectiva, el tamaño aplicado y la información necesaria para interpretar el recorrido de la colección; no modifica la estructura de los registros de `data`.
- La lectura ordinaria privilegia registros vigentes cuando la capacidad tiene una noción de vigencia. La consulta histórica utiliza filtros explícitos; no se mezclan registros inactivos con vigentes sin distinguirlos.

La paginación limita la cantidad de resultados, no las reglas de visibilidad. Una cuenta autorizada para reportes no puede navegar hacia datos nominales restringidos utilizando filtros diferentes.

## 6. Seguridad del contrato HTTP

La API opera con sesiones autenticadas transportadas en cookies `HttpOnly` de acceso y renovación. La recepción de una cookie no basta por sí sola: el servidor valida la sesión, la situación de la cuenta y los permisos efectivos en cada operación protegida. Los cambios de estado comprueban además la procedencia permitida de la solicitud.

La política de CORS permite credenciales únicamente para orígenes autorizados; no convierte a cualquier origen en un cliente confiable. Las rutas de autenticación mantienen sus propias restricciones de emisión, renovación y revocación sin exponer secretos por JSON, URL o registros.

La documentación OpenAPI describe la autenticación por cookies y las respuestas realmente contractuales. Los recursos de estudiantes, reportes, importaciones y auditoría no se hacen públicos por el hecho de estar documentados.

## 7. Evolución y compatibilidad

El prefijo de versión delimita cambios incompatibles del contrato de transporte. Dentro de una versión se conservan la semántica de las operaciones, los identificadores funcionales y las convenciones de respuesta. Los cambios internos de módulos, adaptadores, workers o almacenamiento **no alteran por sí mismos la versión de la API**.

El contrato se mantiene mediante definiciones ejecutables y sus pruebas; los textos conceptuales no reemplazan esa fuente de verdad con un listado exhaustivo de rutas o tipos.
