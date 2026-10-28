# Verificación de seguridad y control de acceso

La verificación de seguridad comprueba que **cada operación utiliza identidad vigente, autorización efectiva y límites de exposición apropiados**, independientemente del adaptador que la invoque. Se prueban de forma deliberada las denegaciones y la ausencia de fugas, no solo las operaciones autorizadas.

## 1. Autenticación y sesiones

| Escenario                                      | Criterio verificable                                                                                                                                                                       |
| ---------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Contraseña correcta o incorrecta               | El acceso válido crea una sesión solo si la cuenta está `ACTIVE`; `INACTIVE` y `BLOCKED` no permiten autenticación, renovación ni uso de sesiones, sin revelar la existencia de la cuenta. |
| Verificación de credenciales                   | Las contraseñas se validan mediante Argon2id y no se conservan ni exponen como texto plano.                                                                                                |
| Access token expirado o modificado             | El JWT alterado, vencido, de tipo incorrecto o asociado a sesión revocada se rechaza. Su vigencia máxima es de 15 minutos.                                                                 |
| Refresh token                                  | La credencial válida renueva bajo la sesión vigente, rota y deja inutilizable la anterior; su vigencia máxima es de siete días.                                                            |
| Renovaciones simultáneas                       | La misma credencial no produce dos sucesoras válidas; la reutilización confirmada de una credencial consumida revoca la sesión afectada.                                                   |
| Inicio de sesión posterior                     | La nueva sesión invalida la anterior, incluso ante accesos simultáneos.                                                                                                                    |
| Deshabilitación, cierre o cambio de contraseña | La sesión revocada pierde acceso de inmediato sin esperar la caducidad del JWT.                                                                                                            |
| Contraseña temporal                            | Tras restablecimiento administrativo se impide operar académicamente hasta completar el cambio exigido.                                                                                    |
| Intentos fallidos                              | Cinco fallos por identidad en quince minutos activan la limitación temporal; el control no revela la existencia de la cuenta ni cambia automáticamente su estado a `BLOCKED`.              |

Estas pruebas contrastan el estado persistido de sesión y el resultado de llamadas posteriores con las credenciales anteriores. No concluyen que hubo revocación por la sola presencia de una cabecera de eliminación de cookies.

## 2. Roles, permisos y límites de recursos

La matriz de autorización se ejerce con los roles institucionales `ADMIN`, `SECRETARY`, `ACADEMIC_COORDINATOR` y `REPORT_VIEWER`, además de combinaciones válidas de múltiples roles y roles personalizados.

- **Operaciones académicas:** secretaría y administración ejecutan los movimientos que les corresponden; coordinación académica consulta inscripciones, pero no las modifica; el lector de reportes no adquiere acceso nominal por poder consultar indicadores.
- **Administración sensible:** las correcciones extraordinarias de inscripciones y documentos de identidad, la gestión de cuentas y autorizaciones, y la consulta transversal de auditoría exigen simultáneamente rol protegido `ADMIN` y permiso específico. Un rol personalizado con permisos ordinarios acumulados no elude esas reservas; se rechaza asignarle permisos institucionalmente reservados.
- **Autoelevación:** ninguna cuenta altera sus propias asignaciones, ni directamente ni por modificaciones masivas o indirectas.
- **Combinación de roles:** los permisos efectivos representan la unión autorizada de capacidades asignadas, sin conferir operaciones ajenas al catálogo o a sus restricciones institucionales.
- **Revocación dinámica:** retirar un rol o permiso impide el siguiente uso de esa capacidad sin exigir que el usuario cierre sesión; pasar a `INACTIVE` o `BLOCKED` revoca inmediatamente todas las sesiones y la posterior reactivación no las restablece. Cada transición administrativa exige motivo y autorización, incluso entre `INACTIVE` y `BLOCKED`.
- **Importaciones y reportes:** `reports.read` permite exclusivamente agregados autorizados; los archivos, estados individuales y observaciones por fila requieren `students.imports.read`.
- **Ejecución diferida:** el trabajo conserva el actor, alcance e intención autorizada de su admisión. La revocación posterior de cuenta, sesión o rol impide nuevas admisiones, pero no invalida un trabajo durable ya aceptado; el worker no usa una sesión revocada ni amplía el encargo. Las condiciones académicas se validan al confirmar cada efecto.

Las pruebas incluyen un usuario autenticado sin permiso, un usuario con permiso pero recurso incompatible, una referencia ajena a su visibilidad y un actor autorizado con condiciones funcionales inválidas. Se distinguen correctamente **rechazo de autorización** y **rechazo de regla de negocio**.

## 3. Protección del transporte y de los datos

- Las cookies de acceso y renovación incorporan `HttpOnly`, `SameSite=Lax`, `Secure` en producción y las rutas admitidas: acceso en `/`, renovación en `/api/v1/auth`, sin atributo `Domain` expansivo.
- Las respuestas de autenticación no entregan tokens en `data`, parámetros de URL o mensajes de error.
- Las solicitudes que modifican estado y usan cookies verifican su procedencia, también durante login, refresh, logout y admisión de archivos. Un `Origin` nulo o no autorizado se rechaza. La ausencia de `Origin` también se rechaza, salvo cuando otro mecanismo expresamente autorizado verifica de forma segura la procedencia; nunca constituye autorización implícita.
- CORS admite credenciales solo desde orígenes expresamente configurados; ninguna respuesta autoriza credenciales a un comodín de orígenes.
- Entradas inesperadas, nombres de campos no admitidos, archivos inválidos y filtros manipulados no permiten eludir la validación o alcanzar capacidades no autorizadas.
- Los registros operativos y errores no revelan contraseñas, JWT, refresh tokens, bytes de archivos, hashes de contraseña o detalles de otras cuentas.

Las comprobaciones de CSRF y cookies utilizan solicitudes con combinaciones controladas de origen, credenciales y método, no solo inspección estática de la configuración. Verifican que una solicitud rechazada por procedencia no confirme cambios funcionales; si se admite una alternativa a `Origin`, comprueban tanto su aplicación válida como el rechazo cuando dicha verificación falta o falla.

## 4. Auditoría y evidencia sensible

Las modificaciones de inscripciones, operaciones administrativas y cambios de autorización generan la evidencia exigible con **actor, momento, intención y efecto**, conservando la diferencia entre historial funcional y auditoría transversal. Un rechazo relevante de seguridad genera evidencia adecuada sin inventar una operación académica que nunca se confirmó.

La prueba fuerza un fallo antes de confirmar una operación sensible y comprueba que el historial y la auditoría de su **efecto confirmado** no queden desalineados. También intenta editar, eliminar o consultar eventos de auditoría con y sin autorización: las vías ordinarias no reescriben hechos ni entregan información protegida a lectores no habilitados.

No se considera evidencia de seguridad la mera existencia de roles, guardias, interceptores o decoradores en el código. El criterio es el resultado frente a un actor y una intención concretos.
