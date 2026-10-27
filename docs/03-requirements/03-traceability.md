# Trazabilidad de requerimientos

La trazabilidad relaciona los requerimientos identificados con los resultados del producto, las capacidades funcionales y las evidencias de cumplimiento. Establece la cobertura exigida y permite identificar vacíos o contradicciones, sin duplicar la descripción de cada obligación.

Los identificadores de requerimientos permanecen estables para relacionar cada obligación con los resultados y las evidencias de cumplimiento. No dependen de nombres de clases, endpoints ni tareas de implementación.

## 1. Objetivos de referencia

| Código | Resultado que debe poder demostrarse                                                                       |
| ------ | ---------------------------------------------------------------------------------------------------------- |
| OB-01  | Registro de inscripciones correcto y coherente con la estructura académica, la disponibilidad y los cupos. |
| OB-02  | Operación académica y administración del acceso controladas por responsabilidades autorizadas.             |
| OB-03  | Conservación y reconstrucción de movimientos, decisiones y evidencia operativa.                            |
| OB-04  | Supervisión mediante información consistente, consultas controladas y seguimiento de importaciones.        |

Un requerimiento puede contribuir a varios objetivos. La clasificación señala su contribución principal y, cuando corresponde, las secundarias.

## 2. Matriz de cobertura funcional

| Requerimientos                         | Objetivos    | Capacidad que debe verificarse              | Modalidad principal de evidencia                    |
| -------------------------------------- | ------------ | ------------------------------------------- | --------------------------------------------------- |
| RF-001, RF-003, RF-004, RF-009         | OB-01        | Identidad y habilitación estudiantil        | Pruebas funcionales y de restricciones              |
| RF-002, RF-005, RF-006, RF-007, RF-008 | OB-01        | Organización y asociaciones académicas      | Pruebas de relaciones y conservación histórica      |
| RF-010, RF-011                         | OB-01, OB-02 | Periodos y ventanas de inscripción          | Escenarios de estados y fechas                      |
| RF-012, RF-013, RF-015                 | OB-01, OB-02 | Gestión y disponibilidad de ofertas         | Escenarios de transiciones y autorización           |
| RF-014                                 | OB-01, OB-04 | Ocupación y cupos disponibles               | Contraste de conteos antes y después de movimientos |
| RF-016, RF-017, RF-018, RF-019         | OB-01        | Alta de inscripción y elegibilidad          | Escenarios válidos, inválidos y duplicados          |
| RF-020                                 | OB-01        | Integridad ante inscripciones simultáneas   | Pruebas de concurrencia                             |
| RF-021, RF-022, RF-026, RF-027         | OB-01, OB-03 | Cancelación, retiro y permanencia histórica | Pruebas de transiciones y antecedentes              |
| RF-023                                 | OB-01, OB-03 | Cambio de sección                           | Pruebas de atomicidad y capacidad del destino       |
| RF-024, RF-028                         | OB-02, OB-03 | Correcciones y motivos obligatorios         | Escenarios de autorización y justificación          |
| RF-025, RF-029                         | OB-03, OB-04 | Historial de inscripción                    | Consultas de movimientos acumulativos               |
| RF-030, RF-031, RF-032, RF-033         | OB-01, OB-04 | Validación e incorporación masiva           | Archivos de prueba con filas válidas e inválidas    |
| RF-034                                 | OB-01, OB-04 | Prevención de cargas repetidas              | Reintento del mismo contenido por usuario           |
| RF-035, RF-036                         | OB-03, OB-04 | Seguimiento y evidencia de importación      | Consulta de resultados y recuperación del archivo   |
| RF-037, RF-038, RF-039, RF-040, RF-041 | OB-04        | Reportes predefinidos y filtros             | Contraste con datos operativos conocidos            |
| RF-042, RF-043, RF-044, RF-045         | OB-02        | Cuentas y sesiones                          | Pruebas de acceso, renovación y revocación          |
| RF-046, RF-047, RF-048, RF-049         | OB-02        | Roles y permisos                            | Matriz de operaciones permitidas y denegadas        |
| RF-050, RF-051                         | OB-02        | Recuperación y cambio de contraseñas        | Escenarios de restablecimiento y revocación         |
| RF-052, RF-053, RF-054                 | OB-02, OB-03 | Evidencia de operaciones y seguridad        | Verificación de eventos y acceso restringido        |

Esta matriz cubre **RF-001 a RF-054**. Las pruebas funcionales concretas pueden agrupar varias obligaciones cuando describen una misma interacción, sin eliminar los resultados que cada una exige.

## 3. Matriz de cobertura de calidad

| Requerimientos                              | Objetivos                  | Aspecto de verificación                                               |
| ------------------------------------------- | -------------------------- | --------------------------------------------------------------------- |
| RNF-001, RNF-003, RNF-004                   | OB-01                      | Integridad referencial, ocupación correcta y recuperación ante fallas |
| RNF-002                                     | OB-01                      | Exclusión de sobrecupos y duplicidades bajo concurrencia              |
| RNF-005, RNF-006, RNF-007, RNF-008, RNF-009 | OB-02                      | Protección de credenciales, acceso, origen, intentos y privacidad     |
| RNF-010, RNF-011                            | OB-03                      | Inmutabilidad y distinción de evidencias históricas                   |
| RNF-012                                     | OB-03, OB-04               | Revisión íntegra de importaciones                                     |
| RNF-013, RNF-014                            | OB-01, OB-04               | Procesamiento asíncrono y aislamiento de errores                      |
| RNF-015, RNF-016                            | OB-02, OB-04               | Consistencia de contratos y consultas controladas                     |
| RNF-017, RNF-018                            | OB-01, OB-02               | Separación de responsabilidades y dependencias                        |
| RNF-019                                     | OB-02, OB-03               | Diagnóstico seguro y evidencia operativa                              |
| RNF-020                                     | OB-01, OB-02, OB-03, OB-04 | Verificación automatizada de los comportamientos críticos             |

Esta matriz cubre **RNF-001 a RNF-020**.

## 4. Criterios de completitud de la trazabilidad

La cobertura de una capacidad no se determina únicamente por la existencia de una pantalla, una ruta o una entidad persistente. Se determina por los siguientes criterios:

1. **Identidad del requerimiento:** cada obligación tiene un identificador único, estable y sin reutilización para otro significado.
2. **Contribución clara:** todo requerimiento contribuye a un resultado institucional o a una condición de calidad necesaria para alcanzarlo.
3. **Comportamiento comprobable:** existe al menos una verificación que distingue aceptación de rechazo, cuando ambas situaciones son relevantes.
4. **Operaciones críticas contrastadas:** los controles de cupos, duplicidad, estados, permisos e integridad histórica se ejercitan con condiciones favorables y adversas.
5. **Cobertura bidireccional:** toda capacidad pertenece al alcance definido y toda obligación exige evidencia de cumplimiento.
6. **Cambios controlados:** si se modifica el significado de un requerimiento, se revisan su objetivo, su cobertura funcional y las verificaciones afectadas, sin conservar asociaciones que ya no correspondan.
