# Protección de solicitudes y superficies de exposición

Los mecanismos de transporte constituyen una frontera de seguridad distinta de la autenticación y de la autorización. El sistema protege las credenciales transportadas por el navegador, verifica la procedencia de las operaciones con efectos y limita la exposición de datos, sin imponer detalles HTTP a las reglas del dominio.

## 1. Política de cookies

El acceso y la renovación se transportan mediante **dos cookies independientes** cuya configuración responde al propósito de cada credencial.

| Propiedad | Cookie de acceso | Cookie de renovación |
| --- | --- | --- |
| `HttpOnly` | Obligatorio. | Obligatorio. |
| `Secure` | Obligatorio en producción sobre HTTPS. | Obligatorio en producción sobre HTTPS. |
| `SameSite` | `Lax`. | `Lax`. |
| `Domain` | Ausente; cookie limitada al host emisor. | Ausente; cookie limitada al host emisor. |
| `Path` | `/`. | `/api/v1/auth`. |
| Vigencia máxima de la credencial | 15 minutos. | 7 días. |

El atributo `HttpOnly` impide que el código JavaScript normal del navegador lea las credenciales; no reemplaza protección contra solicitudes forjadas ni resuelve por sí solo la seguridad del cliente. El atributo `SameSite=Lax` tampoco reemplaza la validación estricta de procedencia exigida a las operaciones sensibles.

Las credenciales no aparecen en parámetros de URL, cuerpos JSON de respuesta, mensajes de error, trazas, eventos de auditoría ni logs de diagnóstico. El cierre de sesión elimina ambas cookies mediante cabeceras coherentes con sus atributos de alcance y revoca el estado persistente de la sesión.

## 2. Procedencia y protección frente a CSRF

Toda solicitud HTTP **que modifique estado** y utilice credenciales basadas en cookies se somete a una validación estricta de la cabecera **`Origin`** contra el conjunto explícito de orígenes admitidos. Esto comprende autenticación que emite cookies, renovación, cierre de sesión, modificaciones académicas, administración de cuentas y recepción de importaciones.

- Un `Origin` ausente, `null` o ajeno al conjunto admitido provoca rechazo de la operación protegida por esta política; no se interpreta como autorización implícita.
- La comparación verifica esquema, host y puerto del origen permitido, no coincidencias parciales de dominio, sufijos de texto o comodines.
- Una operación rechazada por procedencia **no produce el cambio funcional solicitado**. Los métodos de consulta no se transforman en comandos por conveniencia.
- La validación del origen no sustituye la identidad, la sesión vigente, el permiso efectivo ni las reglas funcionales.

La protección comprende también rutas de autenticación porque fijar o renovar cookies modifica el estado de seguridad del navegador. Los clientes legítimos utilizan orígenes autorizados y transporte HTTPS en producción.

## 3. CORS y relaciones entre cliente y API

Las respuestas CORS con credenciales se habilitan exclusivamente para orígenes configurados de forma explícita. Cuando se autoriza un origen, el servidor declara su valor concreto; **no utiliza `*` junto con credenciales**. Los métodos, cabeceras y respuestas de preflight se limitan al contrato admitido.

**CORS controla el acceso de navegadores a respuestas entre orígenes; no es un mecanismo de autorización de usuarios.** Por tanto, una petición que no esté sujeta a CORS sigue necesitando todas las verificaciones de identidad, permisos y procedencia aplicables. La lista de orígenes es una configuración de seguridad, no una ampliación dinámica derivada de una cabecera recibida.

## 4. Validación y tratamiento de entradas

El adaptador rechaza parámetros estructuralmente inválidos, tipos ambiguos, campos inesperados, cargas superiores a los límites admitidos y operaciones no reconocidas. La validación de transporte no reemplaza las reglas académicas ni autoriza actualizaciones genéricas de estados sensibles.

Los archivos CSV/XLSX se reciben como contenido no confiable. El servidor verifica formato y límites antes de admitir la operación; el nombre de archivo aportado por el cliente no se utiliza como ruta ejecutable ni determina dónde se conserva el original. La lectura de filas aplica validación funcional propia y no ejecuta fórmulas, macros ni contenido como instrucciones del sistema.

La información personal y las credenciales no se incluyen en excepciones técnicas expuestas. Las respuestas de acceso restringido no entregan objetos parciales con datos protegidos; los rechazos de inicio de sesión no permiten enumerar cuentas existentes.

## 5. Límites de confianza entre adaptadores y procesos

Cada adaptador autentica o valida el contexto adecuado a su origen y entrega a la aplicación una identidad de actuación confiable. Los procesos internos consumen trabajos previamente aceptados mediante contratos controlados, sin tratar el contenido serializado del trabajo como una autorización nueva e ilimitada.

El sistema no establece confianza por estar dentro de una red, compartir una base de datos o ejecutarse en el mismo proyecto. Los secretos de firma, verificadores de credenciales y configuraciones de origen se mantienen bajo control servidor; el dominio académico y las salidas de reportes no reciben material secreto de infraestructura.
