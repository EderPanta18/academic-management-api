# Requerimientos de calidad

Los requerimientos de calidad establecen las condiciones transversales de seguridad, consistencia, trazabilidad y mantenibilidad del sistema. Se expresan como obligaciones verificables mediante comportamientos y resultados observables, sin imponer la organización interna de clases, tablas o adaptadores ni introducir umbrales numéricos ajenos al alcance establecido.

## 1. Integridad y consistencia

| ID | Requerimiento | Evidencia de cumplimiento |
| --- | --- | --- |
| RNF-001 | Las relaciones institucionales y académicas deben conservar su integridad durante altas, modificaciones, deshabilitaciones y consultas históricas. | Las operaciones inválidas se rechazan y los antecedentes mantienen referencias interpretables. |
| RNF-002 | Las operaciones que modifican inscripciones y cupos deben ser atómicas y seguras ante concurrencia. | Pruebas con solicitudes simultáneas no producen sobrecupos, duplicidades vigentes ni movimientos parciales. |
| RNF-003 | Las consultas de ocupación y disponibilidad deben derivar sus valores de registros vigentes consistentes. | Los resultados coinciden con las inscripciones que ocupan plaza, incluso después de cancelaciones, retiros y cambios de sección. |
| RNF-004 | Las operaciones fallidas no deben dejar resultados persistentes incompletos o inconsistentes. | Ante validaciones rechazadas y fallas transaccionales se conserva el último estado válido. |

## 2. Seguridad y protección de información

| ID | Requerimiento | Evidencia de cumplimiento |
| --- | --- | --- |
| RNF-005 | Las contraseñas y credenciales de sesión deben protegerse frente a exposición y reutilización indebida. | No se almacenan contraseñas ni credenciales de renovación en texto plano ni se exponen tokens mediante respuestas de datos o registros operativos. |
| RNF-006 | Las operaciones protegidas deben comprobar la identidad, la vigencia de la sesión y la autorización efectiva en el momento de la solicitud. | Una cuenta deshabilitada, una sesión revocada o un permiso retirado dejan de conceder acceso. |
| RNF-007 | Las operaciones autenticadas mediante cookies que modifican información deben contar con protección frente a solicitudes de origen no autorizado y ataques CSRF, adicional al control de acceso entre orígenes. | Las solicitudes que no satisfacen la política de origen y protección CSRF se rechazan antes de producir cambios, incluso cuando carecen de información de origen suficiente para considerarlas confiables. |
| RNF-008 | Los intentos reiterados de autenticación inválida deben limitarse mediante una política verificable. | Tras cinco fallos por identidad dentro de quince minutos, los intentos adicionales se rechazan temporalmente. |
| RNF-009 | Los datos personales, las sesiones, los permisos y los eventos de auditoría solo deben ser accesibles dentro de las autorizaciones correspondientes. | Los intentos de consulta o modificación sin permiso se rechazan, sin filtrar información sensible en errores. |

## 3. Trazabilidad y conservación

| ID | Requerimiento | Evidencia de cumplimiento |
| --- | --- | --- |
| RNF-010 | La evidencia histórica de inscripciones y auditoría debe conservar su significado original y no admitir modificaciones ordinarias. | Los movimientos y eventos son acumulativos y permiten reconstruir su secuencia sin sobrescrituras. |
| RNF-011 | Los movimientos funcionales y la auditoría transversal deben conservar propósitos distinguibles. | El historial académico explica la trayectoria de una inscripción y la auditoría permite atribuir operaciones y cambios de acceso. |
| RNF-012 | Cada importación aceptada debe poder explicarse mediante su archivo fuente, responsable y resultado procesado. | Los archivos y resultados se recuperan íntegramente y permiten revisar las observaciones por fila. |

## 4. Continuidad de procesos y comportamiento de la API

| ID | Requerimiento | Evidencia de cumplimiento |
| --- | --- | --- |
| RNF-013 | Los trabajos de importación deben ejecutarse de manera separada de la atención interactiva y ofrecer estados consultables. | La aceptación de una carga no requiere esperar al procesamiento completo y su resultado final puede consultarse. |
| RNF-014 | Las fallas de una fila o un procesamiento no deben propagarse indebidamente a registros ya aceptados o a otras solicitudes. | Los resultados parciales correctos permanecen íntegros y los errores quedan identificados. |
| RNF-015 | La API debe mantener un contrato uniforme que distinga explícitamente los resultados satisfactorios de los errores estructurados, con validación estricta y estados HTTP coherentes. | Las respuestas mantienen la distinción entre éxito, datos y detalle de error definida por el contrato de la API; las entradas inesperadas se rechazan y los conflictos funcionales conocidos reciben el estado HTTP correspondiente sin exponer información técnica sensible. |
| RNF-016 | Las consultas de colecciones y reportes deben disponer de filtros controlados, ordenamiento determinista y límites de paginación. | Las respuestas no dependen de ordenamientos arbitrarios ni admiten filtros o tamaños no autorizados. |

## 5. Mantenibilidad, observabilidad y verificación

| ID | Requerimiento | Evidencia de cumplimiento |
| --- | --- | --- |
| RNF-017 | Las reglas académicas deben permanecer separadas de los mecanismos HTTP, persistencia y ejecución asíncrona. | Las decisiones funcionales pueden verificarse sin depender necesariamente del transporte o de adaptadores concretos. |
| RNF-018 | Los módulos deben mantener responsabilidades y dependencias explícitas, sin acceso indiscriminado a implementaciones internas de otros módulos. | Las dependencias verificadas respetan los límites funcionales y técnicos definidos. |
| RNF-019 | La operación debe permitir diagnosticar errores de acceso, importación y cambios críticos sin divulgar secretos ni registrar ruido innecesario. | Los eventos operativos contienen contexto suficiente para diagnóstico y omiten credenciales y datos sensibles no necesarios. |
| RNF-020 | Los comportamientos críticos deben poder comprobarse con pruebas automatizadas reproducibles, incluidos casos inválidos y de concurrencia. | Existen verificaciones ejecutables para autorizaciones, ventanas académicas, estados, cupos, movimientos y cargas masivas. |

## Criterios de interpretación

- **Integridad** no equivale a aceptar toda solicitud: un rechazo controlado es el resultado correcto cuando se vulnera una condición.
- **Seguridad** no se demuestra solo con la presencia de tokens o roles; exige comprobar sesiones vigentes y permisos efectivos.
- **Concurrencia** se evalúa por el estado final persistente, no por la ausencia aparente de errores en una prueba secuencial.
- **Asincronía** no traslada la inscripción ordinaria a un trabajo diferido: esta debe confirmar su resultado de forma inmediata.
- **Observabilidad** permite investigar fallas, pero no sustituye el historial funcional ni la auditoría.

La conformidad se determina mediante los criterios observables de cada requerimiento. No se imponen umbrales numéricos arbitrarios de latencia, concurrencia máxima, volumen de importación, disponibilidad porcentual u objetivos de recuperación.
