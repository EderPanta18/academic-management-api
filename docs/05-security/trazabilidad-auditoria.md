# Trazabilidad y auditoría

Este documento define cómo el sistema debe registrar acciones importantes para mantener trazabilidad.

La auditoría responde a esta pregunta:

```txt
¿Quién hizo qué, cuándo y sobre qué recurso?
```

No debe confundirse con logging técnico. El logging ayuda a diagnosticar fallos internos. La auditoría ayuda a reconstruir acciones relevantes del sistema.

## Enfoque general

El sistema debe registrar eventos auditables cuando ocurre una acción importante.

Ejemplos:

```txt
- Creación de usuario.
- Cambio de rol.
- Importación de estudiantes.
- Creación de oferta de curso.
- Cambio de cupo.
- Registro de inscripción.
- Cancelación de inscripción.
- Cambio de estado de periodo académico.
```

No es necesario auditar cada lectura normal en la primera versión, porque puede generar demasiado ruido.

## Ubicación

La auditoría puede dividirse en dos niveles:

```txt
platform/audit
= infraestructura para registrar eventos auditables

modules/audit
= consulta administrativa de auditoría, si se decide exponerla por API
```

Para una primera versión, puede bastar con `platform/audit`.

## Tabla conceptual

Tabla posible:

```txt
audit_logs
- id
- actor_user_id
- action
- resource_type
- resource_id
- module
- description
- metadata
- ip_address
- user_agent
- created_at
```

Campos principales:

```txt
actor_user_id
= usuario que realizó la acción

action
= acción realizada

resource_type
= tipo de recurso afectado

resource_id
= identificador del recurso afectado

module
= módulo relacionado

description
= descripción breve

metadata
= datos adicionales controlados

ip_address
= dirección IP si está disponible

user_agent
= información del cliente si está disponible

created_at
= fecha del evento
```

## Evento de auditoría

Ejemplo conceptual:

```json
{
  "actorUserId": "user-001",
  "action": "ENROLLMENT_CANCELLED",
  "resourceType": "ENROLLMENT",
  "resourceId": "enrollment-001",
  "module": "ENROLLMENT",
  "description": "Inscripción cancelada.",
  "metadata": {
    "reason": "Solicitud del estudiante"
  },
  "timestamp": "2026-06-14T10:30:00.000Z"
}
```

La metadata debe ser controlada. No debe almacenar contraseñas, tokens, datos sensibles innecesarios ni payloads completos sin revisar.

## Acciones auditables

Acciones de autenticación:

```txt
- Login exitoso, si se considera necesario.
- Login fallido repetido.
- Logout.
- Revocación de sesión.
- Refresh token rechazado.
```

Acciones de usuarios y acceso:

```txt
- Creación de usuario.
- Desactivación de usuario.
- Cambio de contraseña.
- Asignación de rol.
- Retiro de rol.
- Asignación de permisos a rol.
- Retiro de permisos a rol.
```

Acciones académicas:

```txt
- Creación o modificación de estudiante.
- Importación de estudiantes.
- Creación o modificación de docente.
- Creación o modificación de programa académico.
- Creación o modificación de curso.
- Creación o cierre de periodo académico.
- Creación de oferta de curso.
- Cambio de cupo de oferta.
- Cierre o cancelación de oferta.
- Registro de inscripción.
- Cancelación o cambio de estado de inscripción.
```

Acciones de reportes:

```txt
- Exportación de reportes, si se implementa.
- Consulta de reportes sensibles, si el sistema lo requiere.
```

No todas las lecturas necesitan auditoría. Solo deben auditarse lecturas sensibles o exportaciones si existe una razón clara.

## Diferencia entre auditoría y logging

Logging:

```txt
- Ayuda a diagnosticar errores técnicos.
- Puede registrar fallos de infraestructura.
- Puede incluir trazas de ejecución.
- Está orientado a desarrollo y operación técnica.
```

Auditoría:

```txt
- Registra acciones importantes del usuario.
- Permite reconstruir cambios del sistema.
- Está orientada a seguridad, control y trazabilidad.
- Debe mantenerse más estable y consultable.
```

## Relación con casos de uso

La auditoría debe registrarse después de acciones relevantes.

Ejemplo:

```txt
CancelEnrollmentUseCase
→ cancela inscripción
→ guarda cambios
→ registra evento ENROLLMENT_CANCELLED
```

El servicio de auditoría no debe decidir si la inscripción puede cancelarse. Esa regla pertenece al módulo de inscripciones.

## Actor de la acción

Toda acción auditable debe intentar registrar el actor.

El actor puede venir de:

```txt
- Usuario autenticado.
- Proceso interno.
- Seed o script.
- Importación masiva.
```

Cuando no exista un usuario humano, se puede usar un actor de sistema.

Ejemplo:

```txt
SYSTEM
```

## Motivo de cambio

Algunas acciones deben permitir motivo.

Ejemplos:

```txt
- Cancelar inscripción.
- Cambiar estado de inscripción.
- Cancelar oferta.
- Desactivar usuario.
- Reducir cupo.
```

El motivo ayuda a explicar decisiones posteriores.

## Seguridad de la auditoría

Los registros de auditoría no deben modificarse libremente.

Reglas recomendadas:

```txt
- No editar eventos de auditoría.
- No eliminar eventos desde operaciones comunes.
- Restringir consulta a usuarios autorizados.
- No guardar secretos.
- No guardar tokens.
- No guardar contraseñas.
```

Si se requiere eliminación por política de retención, debe manejarse como proceso administrativo controlado.

## Consulta de auditoría

Si se expone un módulo de consulta, debe protegerse con permisos.

Ejemplos:

```txt
audit.read
audit.read-sensitive
```

Filtros posibles:

```txt
actorUserId
action
resourceType
resourceId
module
createdFrom
createdTo
```

Respuesta esperada: paginada, usando el formato estándar de la API.

## Criterio general

La auditoría debe enfocarse en acciones que cambian el sistema o afectan seguridad.

```txt
- Registrar cambios importantes.
- Evitar ruido excesivo.
- No reemplazar logs técnicos.
- No decidir reglas de negocio.
- Mantener trazabilidad de usuario, acción, recurso y fecha.
```
