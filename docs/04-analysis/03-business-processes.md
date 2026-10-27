# Procesos de negocio

Los procesos describen **cómo avanza una operación funcional desde la solicitud del personal autorizado hasta su resultado**, incluidas las decisiones que determinan su aceptación o rechazo. Se representan con actividades y puntos de decisión; no especifican controladores, tablas, algoritmos de bloqueo ni mecanismos internos de despliegue.

Una operación aceptada mantiene la consistencia de los datos afectados y conserva la evidencia funcional que corresponda. Una operación rechazada no debe dejar resultados parciales que aparenten éxito.

## 1. Preparar la inscripción académica

La preparación organiza la información necesaria para que exista una oferta inscribible. No implica realizar inscripciones por anticipado ni habilitar automáticamente cualquier curso del catálogo.

```mermaid
flowchart TD
    A([Inicio]) --> B[Identificar unidades académicas y cursos]
    B --> C[Comprobar asociaciones entre cursos y programas académicos]
    C --> D[Definir periodo y ventana de inscripción]
    D --> E[Configurar ofertas, secciones y capacidades]
    E --> F[Asignar docente a cada oferta que se abrirá]
    F --> G{Estructura y condiciones válidas}
    G -- No --> H[Corregir configuración académica]
    H --> C
    G -- Sí --> I[Habilitar periodo y ofertas conforme a sus reglas]
    I --> J([Oferta disponible para evaluación de inscripciones])
```

**Participación.** Administración y coordinación académica mantienen estructura, periodos y ofertas. Secretaría puede consultarlos para operar inscripciones, sin modificar su configuración. La apertura efectiva exige que la oferta disponga de docente; la elegibilidad final de una inscripción depende también del estudiante, del momento y de los cupos al solicitarla.

**Condiciones de rechazo.** Una estructura incoherente, un curso no asociado al programa académico pertinente, una oferta no habilitable o una configuración incompatible con registros vigentes impiden completar el paso afectado. La falta de habilitación no se resuelve mediante una excepción implícita para secretaría.

## 2. Registrar una inscripción

El registro es inmediato: una solicitud válida produce una inscripción `ENROLLED`. No existen solicitudes pendientes de aprobación.

```mermaid
flowchart TD
    A([Solicitud de inscripción]) --> B{Actor y sesión autorizados}
    B -- No --> X[Rechazar operación]
    B -- Sí --> C{Estudiante ACTIVE y curso asociado a su programa académico}
    C -- No --> X
    C -- Sí --> D{Periodo y oferta habilitados dentro de la ventana}
    D -- No --> X
    D -- Sí --> E{Sin inscripción vigente del mismo curso y periodo}
    E -- No --> X
    E -- Sí --> F{Sin retiro previo que impida reinscripción ordinaria}
    F -- No --> X
    F -- Sí --> G{Cupo disponible al confirmar}
    G -- No --> X
    G -- Sí --> H[Registrar ENROLLED y movimiento de creación como una unidad]
    H --> I[Confirmar inscripción y ocupación]
    I --> Z([Fin])
    X --> Y[Comunicar causa sin inscripción parcial]
    Y --> Z
```

**Puntos críticos.** El curso se compara dentro de un periodo, no únicamente por identificador de oferta. Dos secciones distintas no justifican dos inscripciones vigentes del mismo estudiante al mismo curso. Una inscripción retirada previamente en ese curso y periodo impide una reinscripción ordinaria. Una inscripción cancelada sigue histórica; si una nueva inscripción está permitida, se registra separadamente.

**Resultado consistente.** El cupo se ocupa solo cuando la inscripción queda aceptada. Solicitudes simultáneas no pueden hacer que se supere la capacidad ni que existan duplicados vigentes. El registro del movimiento inicial acompaña la operación aceptada.

## 3. Cancelar o retirar una inscripción

Cancelar y retirar no son etiquetas intercambiables elegidas por el operador. Cada operación representa un momento académico diferente y conserva su propia historia.

```mermaid
flowchart TD
    A([Solicitud sobre inscripción ENROLLED]) --> B{Actor autorizado y motivo presente}
    B -- No --> R[Rechazar sin cambiar la inscripción]
    B -- Sí --> C{Operación solicitada}
    C -- Cancelar --> D{Antes del inicio efectivo del periodo}
    D -- Sí --> E[Confirmar CANCELLED, liberar cupo y registrar movimiento con motivo como una unidad]
    D -- No --> R
    C -- Retirar --> F{Periodo académico en curso}
    F -- Sí --> G[Confirmar WITHDRAWN, liberar cupo y registrar movimiento con motivo como una unidad]
    F -- No --> R
    E --> I[Confirmar resultado histórico]
    G --> I
    R --> J([Fin])
    I --> J
```

**Cancelación.** Corresponde a la anulación ordinaria antes del inicio académico. Si vuelve a permitirse la inscripción, debe crearse un registro nuevo; no se revive el cancelado.

**Retiro.** Corresponde a una inscripción vigente durante el periodo en curso. Libera el cupo, pero impide la reinscripción ordinaria del mismo estudiante en ese curso y periodo.

**Después del cierre.** El cierre del periodo no convierte una inscripción retirada o cancelada en completada y tampoco habilita estas operaciones ordinarias. Las actuaciones excepcionales requieren una corrección administrativa justificada.

## 4. Cambiar de sección

El traslado no cancela ni crea otra inscripción: mantiene su identidad y modifica su oferta vigente junto con el historial correspondiente.

```mermaid
flowchart TD
    A([Solicitar cambio de sección]) --> B{Actor autorizado, inscripción ENROLLED y motivo}
    B -- No --> R[Rechazar sin cambios]
    B -- Sí --> C{Dentro de ventana y con operaciones habilitadas}
    C -- No --> R
    C -- Sí --> D{Oferta destino distinta, mismo curso y periodo}
    D -- No --> R
    D -- Sí --> E{Destino con cupo al confirmar}
    E -- No --> R
    E -- Sí --> F[Confirmar traslado de inscripción, cupos e historial con motivo como una unidad]
    F --> H[Confirmar misma inscripción en nueva sección]
    R --> I([Fin])
    H --> I
```

**Falla durante el traslado.** No se libera definitivamente el cupo de origen ni se ocupa el de destino por separado. Si no puede completarse el conjunto, la inscripción conserva su sección anterior.

**Cambio fuera de la ventana.** No se acepta como operación ordinaria, aunque el usuario tenga permiso de cambio de sección. Una rectificación extraordinaria es una actuación administrativa distinta y justificada.

## 5. Ejecutar una corrección extraordinaria

La corrección es una excepción controlada a las operaciones ordinarias, no una vía general para evitar las reglas académicas.

```mermaid
flowchart TD
    A([Administrador identifica corrección necesaria]) --> B{Permiso extraordinario vigente}
    B -- No --> R[Rechazar]
    B -- Sí --> C[Identificar inscripción, modificación y motivo]
    C --> D{Corrección admitida y delimitada}
    D -- No --> R
    D -- Sí --> E{Referencias, cupos e historial íntegros}
    E -- No --> R
    E -- Sí --> F[Confirmar corrección, movimiento y auditoría como una unidad]
    F --> G[Confirmar rectificación justificada]
    R --> H([Fin])
    G --> H
```

No se define aquí un catálogo de modificaciones arbitrarias. La facultad excepcional se limita a los cambios de inscripción autorizados, con conservación de la coherencia y de la explicación histórica. Un rechazo mantiene íntegra la situación previa.

## 6. Importar estudiantes

La recepción del archivo y su procesamiento son momentos distintos. El actor no espera a que todas las filas terminen para obtener una constancia de aceptación.

```mermaid
flowchart TD
    A([Enviar archivo CSV o XLSX]) --> B{Actor autorizado y archivo admitido}
    B -- No --> R[Rechazar la solicitud]
    B -- Sí --> C{Mismo contenido ya importado por esta cuenta}
    C -- Sí --> R
    C -- No --> D[Conservar archivo y aceptar procesamiento]
    D --> E[Entregar identificador de seguimiento]
    E --> F[Procesar una fila]
    F --> G{Programa académico identificado y datos válidos}
    G -- No --> H[Registrar fila rechazada y su causa]
    G -- Sí --> I{Estudiante ya existente}
    I -- Sí --> J[Registrar duplicado sin modificarlo]
    I -- No --> K[Incorporar fila válida de forma independiente]
    H --> L{Quedan filas por evaluar}
    J --> L
    K --> L
    L -- Sí --> F
    L -- No --> M[Consolidar resultado y observaciones]
    M --> N[Permitir consulta del estado y resultado]
    N --> O([Fin])
    R --> O
```

**Aislamiento.** El resultado de una fila no debe anular inserciones ya válidas de otras filas. Una fila rechazada no deja un estudiante parcialmente registrado. Los estudiantes existentes permanecen sin cambios.

**Seguimiento.** El archivo original, el actor que lo envió, el estado del procesamiento, las cantidades y los errores por fila deben poder examinarse. Si ocurre una falla general, el estado no se presenta como éxito completo y se conservan los resultados ya válidos.

## 7. Consultar reportes de operación

Los reportes son consultas predefinidas y no operaciones de mantenimiento académico.

```mermaid
flowchart TD
    A([Solicitar reporte autorizado]) --> B{Permiso reports.read vigente}
    B -- No --> R[Denegar consulta]
    B -- Sí --> C[Seleccionar reporte y filtros admitidos]
    C --> D{Reporte de ofertas o inscripciones}
    D -- Sí --> E{Periodo explícito presente}
    E -- No --> V[Rechazar filtros]
    E -- Sí --> F[Aplicar consulta predefinida]
    D -- No --> F
    F --> G[Presentar datos estructurados]
    G --> H([Fin])
    R --> H
    V --> H
```

Los reportes distinguen situaciones vigentes e históricas mediante filtros admitidos. Pueden incluir **indicadores agregados de importaciones**, pero no entregan archivos originales, observaciones por fila ni seguimiento detallado de una carga. Los datos presentados no implican facultad para modificar inscripciones, consultar auditoría o administrar usuarios.

## 8. Resultados que deben permanecer distinguibles

| Situación                 | Resultado funcional                                                                            |
| ------------------------- | ---------------------------------------------------------------------------------------------- |
| Inscripción válida        | `ENROLLED`, cupo ocupado, creación e identidad del actor registradas.                          |
| Inscripción inválida      | Rechazo sin cupo ni inscripción parcial.                                                       |
| Cancelación ordinaria     | `CANCELLED`, plaza liberada, motivo e historial preservados.                                   |
| Retiro ordinario          | `WITHDRAWN`, plaza liberada y prohibición de reinscripción ordinaria al mismo curso y periodo. |
| Cambio de sección         | Misma inscripción, nuevo destino, ocupación consistente e historial del traslado.              |
| Corrección extraordinaria | Modificación acotada y justificada, sin pérdida de integridad.                                 |
| Archivo aceptado          | Seguimiento disponible; procesamiento aún no necesariamente concluido.                         |
| Fila inválida o duplicada | Resultado registrado sin modificar datos que no corresponde modificar.                         |
| Consulta de reporte       | Datos de lectura; ninguna modificación operativa asociada.                                     |

Los diagramas representan la secuencia funcional y sus decisiones. Las verificaciones de fechas, autorización y consistencia se realizan en el momento en que la operación intenta confirmarse, no solamente cuando el usuario selecciona una opción.
