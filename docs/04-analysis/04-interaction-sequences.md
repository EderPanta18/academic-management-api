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
        Gestion->>Academia: Verificar estudiante ACTIVE y curso asociado a su escuela
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
        alt Cancelación ordinaria antes del inicio
            Gestion->>Registro: Confirmar CANCELLED, liberar cupo y registrar motivo
            Registro-->>Gestion: Cancelación registrada
            Gestion-->>Operador: Confirma cancelación
        else Retiro durante el periodo en curso
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
    participant Archivo as Custodia del archivo original
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
        else Archivo aceptado
            Recepcion->>Archivo: Conservar archivo original
            Recepcion->>Seguimiento: Abrir seguimiento de importación
            Recepcion->>Proceso: Solicitar procesamiento
            Recepcion-->>Operador: Confirma aceptación e identificador
            loop Por cada fila del archivo
                Proceso->>Estudiantes: Validar datos, escuela y existencia previa
                alt Fila válida y estudiante nuevo
                    Estudiantes-->>Proceso: Incorporación independiente confirmada
                    Proceso->>Seguimiento: Registrar fila incorporada
                else Estudiante ya existente
                    Estudiantes-->>Proceso: Duplicado sin modificación
                    Proceso->>Seguimiento: Registrar fila duplicada
                else Fila inválida
                    Estudiantes-->>Proceso: Rechazo de fila sin registro parcial
                    Proceso->>Seguimiento: Registrar causa del rechazo
                end
            end
            Proceso->>Seguimiento: Consolidar estado y cantidades
            Operador->>Seguimiento: Consulta progreso o resultado
            Seguimiento-->>Operador: Estado, cantidades y observaciones disponibles
        end
    end
```

**Interpretación.** La respuesta de aceptación no declara terminada la carga. Cada fila queda tratada de manera independiente, y una falla global se expresa como resultado no completado; el archivo y los avances ya confirmados conservan su evidencia. El trabajador asíncrono es una responsabilidad interna, no una cuenta con un rol académico adicional.

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
    participant Acceso as Gestión de autenticación
    participant Sesion as Gestión de sesiones
    participant Permisos as Autorización efectiva
    participant Funcion as Operación académica

    Usuario->>Acceso: Presenta credenciales
    Acceso->>Acceso: Comprobar identidad, contraseña y estado
    alt Credenciales o cuenta no válidas
        Acceso-->>Usuario: Rechaza acceso
    else Identidad válida
        Acceso->>Sesion: Revocar sesión anterior y crear nueva sesión
        Sesion-->>Acceso: Sesión vigente
        Acceso-->>Usuario: Confirma acceso autenticado
        Usuario->>Permisos: Solicita una operación protegida
        Permisos->>Sesion: Verificar vigencia de usuario y sesión
        Sesion-->>Permisos: Estado de sesión
        Permisos->>Permisos: Resolver roles y permisos vigentes
        alt Sesión inválida o permiso insuficiente
            Permisos-->>Usuario: Deniega operación
        else Acceso efectivo
            Permisos->>Funcion: Tramitar operación requerida
            Funcion-->>Usuario: Resultado funcional
        end
    end
```

**Interpretación.** La identidad autenticada y la autorización de cada operación son comprobaciones diferentes. Tener sesión no concede acceso a todas las capacidades, y una sesión revocada no mantiene los permisos que tuvo anteriormente. La gestión concreta de credenciales de sesión y sus protecciones técnicas no altera estos resultados funcionales.

## 8. Principios de lectura de las secuencias

- **El rechazo no es una transición de negocio.** Una acción denegada no cambia el estado de una inscripción ni registra un movimiento funcional como si hubiera ocurrido.
- **La operación crítica se confirma como una unidad.** Registro, cambio de sección, cancelación, retiro y corrección preservan sus efectos e historia de manera coherente; la descomposición interna no forma parte de esta representación funcional.
- **El actor solicita; el sistema comprueba.** La selección de una oferta o de un movimiento no garantiza su aceptación, aunque el actor disponga del permiso general.
- **La importación separa aceptación y ejecución.** El seguimiento refleja resultados parciales y finales sin ocultar filas rechazadas o duplicadas.
- **La consulta no altera.** Reportes y auditoría son capacidades de lectura con permisos propios y resultados diferenciados.
