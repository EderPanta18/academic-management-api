# Configuración, entornos y secretos

La configuración declara las condiciones técnicas bajo las cuales opera cada proceso. **Se diferencia del estado funcional**: las reglas académicas y los permisos no se redefinen mediante valores de entorno y la configuración no reemplaza los registros persistentes que gobiernan el sistema.

## 1. Contrato de configuración

Cada proceso recibe un conjunto explícito y validado de parámetros. Las configuraciones requeridas deben tener significado inequívoco; una ausencia, valor mal formado o combinación incompatible **impide iniciar** la responsabilidad afectada en lugar de activar un comportamiento inseguro por defecto.

| Grupo | Propósito | Reglas operativas |
| --- | --- | --- |
| Ejecución | Modo de operación, exposición de la API y gestión de recursos. | La configuración del proceso no modifica reglas de negocio ni define roles administrativos. |
| Persistencia | Conectividad de PostgreSQL y parámetros técnicos de acceso. | Las credenciales se mantienen fuera del código; el acceso de procesos no autoriza migraciones o lecturas administrativas indiscriminadas. |
| Mensajería y despacho | Conectividad de PgBoss, recepción y despacho recuperable. | Una falla de cola no transforma una operación admitida en no admitida ni autoriza perder su intención persistente. |
| Identidad y sesiones | Material de firma, vigencia de credenciales y validación de tokens. | Los secretos permanecen en servidor; su ausencia impide habilitar autenticación. Las duraciones aprobadas no dependen de valores arbitrarios del cliente. |
| Transporte y origen | Orígenes autorizados, HTTPS, cookies y política CORS. | No se habilitan orígenes comodín con credenciales ni se relaja `Secure` en producción. |
| Diagnóstico | Nivel de emisión y destino de registros operativos. | El nivel de logging no desactiva auditoría persistente ni permite registrar secretos. |

Los identificadores físicos exactos de variables se definen en la configuración ejecutable y su validación; no se mantiene un segundo listado normativo que pueda divergir. Cada configuración tiene propietario técnico, tipo esperado y tratamiento definido al faltar.

## 2. Separación de entornos

Los entornos de desarrollo, verificación y producción se mantienen aislados en **datos, credenciales y accesos operativos**. No se reutilizan secretos de producción en desarrollo ni se ejecutan pruebas destructivas contra almacenamiento institucional.

- **Desarrollo:** utiliza recursos locales o aislados y datos de prueba sin información personal real. Se permite el reinicio controlado del esquema únicamente sobre esa base aislada.
- **Verificación:** reproduce los mecanismos relevantes para concurrencia, sesiones, mensajería y recuperación; sus resultados no modifican los datos de producción.
- **Producción:** utiliza credenciales restringidas, transporte seguro, migraciones controladas y respaldos recuperables. Los procesos reciben solo los secretos y permisos técnicos necesarios.

Los archivos locales de variables pueden facilitar el desarrollo, pero no se incorporan secretos reales al repositorio, a imágenes de despliegue públicas ni a ejemplos documentales. La existencia de configuraciones separadas no sustituye el control de acceso a la infraestructura.

## 3. Custodia y rotación de secretos

Los secretos de firma, credenciales de PostgreSQL y demás materiales confidenciales se proporcionan mediante el mecanismo seguro de configuración del entorno. Se restringe su lectura a las identidades de ejecución que los necesitan.

1. La provisión y la rotación no exponen valores en argumentos públicos, resultados de pruebas, trazas, excepciones, archivos versionados ni registros de aplicación.
2. La sustitución de credenciales de infraestructura se coordina con la reconexión de los procesos, evitando que instancias antiguas mantengan indefinidamente acceso revocado.
3. La rotación de material de firma de JWT considera la validación de accesos emitidos y la revocación de sesiones. No se acepta sin más cualquier firma antigua por mantener continuidad de servicio.
4. La exposición presunta de un secreto se trata como incidente: se restringe el acceso, se sustituye el material afectado, se invalida lo que corresponda y se conserva evidencia diagnóstica no sensible.

La actualización de una configuración de autorización no concede permisos retroactivos ni convierte a una tarea técnica en usuario administrativo.

## 4. Validación de configuración y cambios

Cada despliegue valida su configuración antes de admitir tráfico o consumir trabajos. Los cambios se introducen de forma controlada y se inspeccionan junto con la versión del código y del esquema requerida.

Los fallos se informan con **nombre lógico del requisito y causa utilizable**, sin revelar valores sensibles. Las discrepancias entre entornos se diagnostican mediante categorías de configuración y estado de dependencias, no mediante volcado completo de variables.

No se utilizan valores implícitos que relajen autenticación, procedencia de solicitudes, integridad de datos o protección de cookies para recuperar disponibilidad de forma aparente.
