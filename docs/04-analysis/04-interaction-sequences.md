# Secuencias de interacción funcional

Las secuencias muestran **cómo colaboran el actor, la gestión de acceso y las responsabilidades funcionales** para producir resultados verificables. Cada participante designa una responsabilidad del sistema, no una clase, un servicio concreto, una ruta HTTP ni una estructura de almacenamiento.

Los rechazos se comunican al actor sin convertir una operación incompleta en un cambio válido. La conservación de movimientos y la auditoría son efectos de la acción correspondiente, no acciones que el operador deba ejecutar por separado.

## 1. Alta de inscripción

```mermaid
sequenceDiagram
    actor Operador as Personal autorizado
    participant Acceso as Control de acceso
    participant Gestion as Gestión de inscripciones
    participant Academia as Información académica
    participant Oferta as Periodo y oferta
    participant Registro as Registro e historial

    Operador->>Acceso: Solicita registrar estudiante en oferta
    Acceso->>Acceso: Verificar sesión y permiso para inscribir
    alt Sin acceso válido
        Acceso-->>Operador: Deniega la operación
    else Acceso autorizado
        Acceso->>Gestion: Tramitar inscripción
        Gestion->>Academia: Verificar estudiante ACTIVE y curso asociado a su programa académico
        Academia-->>Gestion: Resultado de elegibilidad
        Gestion->>Oferta: Verificar ventana, habilitación y disponibilidad
        Oferta-->>Gestion: Condiciones académicas y cupo
        Gestion->>Registro: Comprobar duplicidad y retiro previo del mismo curso y periodo
        Registro-->>Gestion: Antecedentes relevantes
        alt Condiciones no satisfechas
            Gestion-->>Operador: Rechaza y comunica causa
        else Inscripción admisible
            Gestion->>Registro: Confirmar ENROLLED, cupo e historial como una unidad
            alt Otra solicitud concurrente impide confirmar
                Registro-->>Gestion: Conflicto o falta de cupo
                Gestion-->>Operador: Rechaza sin efecto parcial
            else Registro confirmado
                Registro-->>Gestion: Inscripción creada
                Gestion-->>Operador: Confirma inscripción vigente
            end
        end
    end
```

**Interpretación.** Una comprobación favorable previa no reserva indefinidamente el cupo. Al confirmar se garantiza que la oferta aún tenga capacidad y que no aparezca una segunda inscripción vigente del mismo curso y periodo. El historial de creación acompaña el registro aceptado.

## 2. Cambio de sección

```mermaid
sequenceDiagram
    actor Operador as Personal autorizado
    participant Acceso as Control de acceso
    participant Gestion as Gestión de inscripciones
    participant Oferta as Periodo y ofertas
    participant Registro as Registro e historial

    Operador->>Acceso: Solicita traslado con destino y motivo
    Acceso->>Acceso: Verificar sesión y permiso de cambio de sección
    alt Sin autorización
        Acceso-->>Operador: Deniega la operación
    else Autorizado
        Acceso->>Gestion: Tramitar cambio
        Gestion->>Registro: Consultar inscripción vigente y oferta origen
        Registro-->>Gestion: Inscripción ENROLLED y origen
        Gestion->>Oferta: Verificar ventana, habilitación, mismo curso y periodo
        Oferta-->>Gestion: Compatibilidad y disponibilidad del destino
        alt Motivo ausente o traslado no admitido
            Gestion-->>Operador: Rechaza, conserva origen
        else Traslado admisible
            Gestion->>Registro: Confirmar traslado de cupo, nueva oferta y movimiento
            alt Conflicto de capacidad o fallo
                Registro-->>Gestion: Traslado no confirmado
                Gestion-->>Operador: Rechaza; mantiene inscripción y cupo de origen
            else Traslado confirmado
                Registro-->>Gestion: Misma inscripción en nueva oferta
                Gestion-->>Operador: Confirma sección nueva
            end
        end
    end
```

**Interpretación.** Se conserva el identificador de inscripción. El movimiento informa origen, destino, responsable, momento y justificación; no se transforma el cambio en una cancelación seguida de inscripción independiente.

## 3. Cancelación y retiro: efectos diferenciados

```mermaid
sequenceDiagram
    actor Operador as Personal autorizado
    participant Acceso as Control de acceso
    participant Gestion as Gestión de inscripciones
    participant Periodo as Situación académica
    participant Registro as Registro e historial

    Operador->>Acceso: Solicita cancelar o retirar e informa motivo
    Acceso->>Acceso: Verificar permiso específico de la operación
    alt Acceso no permitido
        Acceso-->>Operador: Deniega operación
    else Permiso válido
        Acceso->>Gestion: Tramitar movimiento solicitado
        Gestion->>Registro: Comprobar inscripción ENROLLED
        Registro-->>Gestion: Situación vigente
        Gestion->>Periodo: Comprobar momento académico aplicable
        Periodo-->>Gestion: Inicio y situación del periodo
        alt Cancelación solicitada con periodo OPEN antes del inicio académico
            Gestion->>Registro: Confirmar CANCELLED, liberar cupo y registrar motivo
            Registro-->>Gestion: Cancelación registrada
            Gestion-->>Operador: Confirma cancelación
        else Retiro solicitado con periodo IN_PROGRESS durante el desarrollo académico
            Gestion->>Registro: Confirmar WITHDRAWN, liberar cupo y registrar motivo
            Registro-->>Gestion: Retiro registrado
            Gestion-->>Operador: Confirma retiro
        else No corresponde a operación ordinaria
            Gestion-->>Operador: Rechaza sin cambiar inscripción
        end
    end
```

**Interpretación.** La solicitud indica qué operación pretende realizar el actor. El sistema **no transforma automáticamente** una solicitud de cancelación en retiro cuando las fechas ya no admiten cancelar. El retiro conserva su prohibición de reinscripción ordinaria del mismo curso y periodo; la cancelación permanece histórica y permite un nuevo registro únicamente si vuelven a satisfacerse las condiciones ordinarias.

## 4. Corrección administrativa extraordinaria

```mermaid
sequenceDiagram
    actor Admin as Administrador
    participant Acceso as Control de acceso
    participant Gestion as Corrección de inscripciones
    participant Integridad as Validación académica y capacidad
    participant Evidencia as Historial y auditoría

    Admin->>Acceso: Solicita corrección delimitada y registra motivo
    Acceso->>Acceso: Verificar sesión y facultad extraordinaria
    alt No autorizado
        Acceso-->>Admin: Deniega
    else Autorizado
        Acceso->>Gestion: Tramitar corrección
        Gestion->>Integridad: Comprobar cambio admitido y preservación de integridad
        Integridad-->>Gestion: Resultado de comprobaciones
        alt Falta motivo, excede alcance o vulnera integridad
            Gestion-->>Admin: Rechaza sin alterar registro
        else Corrección admisible
            Gestion->>Evidencia: Confirmar corrección, movimiento y auditoría
            alt No se confirma íntegramente
                Evidencia-->>Gestion: Operación rechazada sin cambios parciales
                Gestion-->>Admin: Comunica rechazo
            else Confirmación íntegra
                Evidencia-->>Gestion: Corrección documentada
                Gestion-->>Admin: Confirma resultado y trazabilidad
            end
        end
    end
```

**Interpretación.** Las condiciones extraordinarias habilitan una intervención especializada, pero no autorizan alterar libremente la inscripción ni sus referencias. La justificación, el movimiento funcional y la atribución administrativa forman parte del resultado.

## 5. Importación asíncrona de estudiantes

```mermaid
sequenceDiagram
    actor Operador as Administración o secretaría
    participant Acceso as Control de acceso
    participant Recepcion as Recepción de importaciones
    participant Persistencia as Registro, archivo y outbox
    participant Despacho as Despacho recuperable
    participant Proceso as Procesamiento asíncrono
    participant Estudiantes as Registro de estudiantes
    participant Seguimiento as Estado y observaciones

    Operador->>Acceso: Envía archivo CSV o XLSX
    Acceso->>Acceso: Verificar permiso de importación
    alt No autorizado
        Acceso-->>Operador: Deniega carga
    else Autorizado
        Acceso->>Recepcion: Presentar archivo e identidad del actor
        Recepcion->>Recepcion: Validar formato y repetición exacta por usuario
        alt Archivo no admitido o repetido
            Recepcion-->>Operador: Rechaza con causa
        else Archivo admisible
            Recepcion->>Persistencia: Confirmar registro, bytes originales e intención de outbox en una transacción
            alt Admisión no confirmada
                Persistencia-->>Recepcion: Sin aceptación ni efectos parciales
                Recepcion-->>Operador: Rechaza admisión
            else Admisión confirmada
                Persistencia-->>Recepcion: Identificador estable y obligación durable
                Recepcion-->>Operador: Confirma aceptación e identificador
                Despacho->>Persistencia: Recuperar intención confirmada
                Persistencia-->>Despacho: Encargo pendiente de publicación
                Despacho->>Proceso: Entregar encargo recuperable
                loop Por cada fila pendiente del archivo
                    Proceso->>Proceso: Iniciar unidad de confirmación independiente
                    Proceso->>Estudiantes: Validar datos, programa académico y existencia previa
                    alt Fila válida y estudiante nuevo
                        Estudiantes-->>Proceso: Perfil y, si corresponde, persona preparados sin confirmar
                        Proceso->>Seguimiento: Incorporar resultado de fila en la misma unidad
                    else Estudiante ya existente
                        Estudiantes-->>Proceso: Duplicado sin modificar registros
                        Proceso->>Seguimiento: Incorporar resultado de duplicado en la misma unidad
                    else Fila inválida
                        Estudiantes-->>Proceso: Rechazo sin registros parciales
                        Proceso->>Seguimiento: Incorporar motivo de rechazo en la misma unidad
                    end
                    Proceso->>Proceso: Confirmar conjuntamente efectos y resultado definitivo
                end
                Proceso->>Seguimiento: Consolidar estado y cantidades
                Operador->>Seguimiento: Consulta progreso o resultado
                Seguimiento-->>Operador: Estado, cantidades y observaciones disponibles
            end
        end
    end
```

**Interpretación.** La aceptación exige confirmar en una sola transacción de PostgreSQL el registro de importación, los bytes originales del archivo y la intención de ejecución en el outbox. Solo después de esa confirmación se comunica la aceptación; el despacho y la entrega al procesamiento ocurren posteriormente y pueden repetirse sin duplicar efectos funcionales. La respuesta de aceptación no declara terminada la carga. Cada fila se confirma independientemente: si corresponde registrar una persona y un perfil estudiantil, ambos registros y el resultado definitivo de la fila pertenecen a la misma unidad; los duplicados y rechazos confirman únicamente su resultado, sin modificar registros académicos. Si la unidad falla, no queda una incorporación sin resultado ni un resultado de incorporación sin sus registros; el tratamiento se reintenta o recupera sin repetir efectos ya confirmados. Una falla global se expresa como resultado no completado y conserva el archivo original y los avances confirmados. El trabajador asíncrono es una responsabilidad interna, no una cuenta con un rol académico adicional.

## 6. Consulta de reportes

```mermaid
sequenceDiagram
    actor Consultante as Usuario autorizado
    participant Acceso as Control de acceso
    participant Reportes as Consulta de reportes
    participant Datos as Información operativa

    Consultante->>Acceso: Solicita reporte y filtros
    Acceso->>Acceso: Verificar permiso de consulta de reportes
    alt No autorizado
        Acceso-->>Consultante: Deniega consulta
    else Autorizado
        Acceso->>Reportes: Evaluar tipo de reporte y filtros
        alt Filtro no admitido o falta periodo obligatorio
            Reportes-->>Consultante: Rechaza parámetros
        else Consulta válida
            Reportes->>Datos: Obtener información dentro de filtros predefinidos
            Datos-->>Reportes: Datos vigentes e históricos identificables
            Reportes-->>Consultante: Devuelve resultado estructurado
        end
    end
```

**Interpretación.** Los reportes sobre ofertas e inscripciones requieren seleccionar un periodo. Los indicadores agregados de importaciones no exponen seguimiento individual de cargas, archivos originales ni observaciones por fila. El permiso de reportes no se transforma en permiso de lectura general de entidades, consulta detallada de importaciones ni acceso a la auditoría.

## 7. Acceso y responsabilidad por operación

```mermaid
sequenceDiagram
    actor Usuario as Usuario institucional
    participant Entrada as Entrada protegida
    participant Autenticacion as Autenticación
    participant Cuentas as Cuentas y sesiones
    participant Autorizacion as Autorización
    participant Operacion as Operación funcional

    Usuario->>Autenticacion: Presenta credenciales
    Autenticacion->>Cuentas: Verifica cuenta y credenciales
    alt Credenciales inválidas o cuenta deshabilitada
        Cuentas-->>Autenticacion: Rechazo
        Autenticacion-->>Usuario: Deniega el acceso
    else Cuenta habilitada
        Autenticacion->>Cuentas: Confirma una sesión vigente y revoca la anterior
        Cuentas-->>Autenticacion: Identidad y sesión
        Autenticacion-->>Usuario: Entrega acceso autenticado
        Usuario->>Entrada: Solicita operación protegida
        Entrada->>Autenticacion: Comprueba token de acceso
        Autenticacion->>Cuentas: Comprueba cuenta habilitada y sesión vigente
        alt Autenticación o sesión no válida
            Autenticacion-->>Entrada: Acceso no autenticado
            Entrada-->>Usuario: Rechaza la solicitud
        else Identidad y sesión válidas
            Autenticacion-->>Entrada: Identidad del actor autenticado
            Entrada->>Operacion: Invoca operación con actor confiable
            Operacion->>Autorizacion: Comprueba permiso y restricciones de acceso
            alt Autorización o condiciones incumplidas
                Autorizacion-->>Operacion: Rechazo de autorización
                Operacion-->>Usuario: Deniega o rechaza sin efectos
            else Acceso autorizado
                Autorizacion-->>Operacion: Permiso vigente
                Operacion-->>Usuario: Resultado funcional
            end
        end
    end
```

**Interpretación.** La autenticación verifica identidad, estado de cuenta y sesión mediante las capacidades públicas de cuentas. La autorización resuelve las facultades vigentes del actor sin administrar sesiones. Los casos de uso preservan sus comprobaciones propias, aunque la entrada HTTP ya haya autenticado al solicitante. La sesión y los permisos se evalúan al usar la capacidad; conservar una credencial no evita la revocación ni un permiso retirado.

## 8. Principios de lectura de las secuencias

- **El rechazo no es una transición de negocio.** Una acción denegada no cambia el estado de una inscripción ni registra un movimiento funcional como si hubiera ocurrido.
- **La operación crítica se confirma como una unidad.** Registro, cambio de sección, cancelación, retiro y corrección preservan sus efectos e historia de manera coherente; la descomposición interna no forma parte de esta representación funcional.
- **El actor solicita; el sistema comprueba.** La selección de una oferta o de un movimiento no garantiza su aceptación, aunque el actor disponga del permiso general.
- **La importación separa aceptación y ejecución.** El seguimiento refleja resultados parciales y finales sin ocultar filas rechazadas o duplicadas.
- **La consulta no altera.** Reportes y auditoría son capacidades de lectura con permisos propios y resultados diferenciados.
