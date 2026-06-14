# Autenticación

Este documento define cómo el sistema identifica a un usuario y controla sus sesiones de acceso.

La autenticación responde a una pregunta concreta:

```txt
¿Quién está intentando usar el sistema?
```

No debe confundirse con autorización. Autenticación valida identidad. Autorización decide qué puede hacer esa identidad dentro del sistema.

## Enfoque general

El sistema usa autenticación basada en credenciales y tokens.

El flujo general es:

```txt
Usuario envía credenciales
→ el sistema valida usuario y contraseña
→ el sistema crea una sesión
→ el sistema emite tokens
→ el cliente usa el access token para consumir rutas protegidas
```

La sesión debe quedar registrada para poder controlar accesos activos, cerrar sesión, revocar tokens y evitar múltiples sesiones si esa política está habilitada.

## Módulo responsable

La autenticación pertenece al módulo funcional:

```txt
modules/auth
```

Este módulo se encarga de:

```txt
- Login.
- Logout.
- Refresh token.
- Creación de sesión.
- Revocación de sesión.
- Validación funcional del acceso.
- Control de sesiones activas por usuario.
```

El soporte técnico relacionado con JWT, hashing, guards, estrategias o extracción de tokens pertenece a:

```txt
platform/security
```

## Usuarios y credenciales

Las cuentas del sistema pertenecen a:

```txt
modules/users
```

El usuario debe tener, como mínimo:

```txt
- Identificador.
- Correo o username.
- Password hash.
- Estado.
```

La contraseña nunca debe guardarse en texto plano. Solo debe almacenarse el hash.

Ejemplo conceptual:

```txt
users
- id
- email
- passwordHash
- status
```

## Login

El login valida las credenciales del usuario.

Flujo esperado:

```txt
POST /api/v1/auth/login
→ validar entrada
→ buscar usuario
→ verificar contraseña
→ verificar estado del usuario
→ revocar sesiones previas si aplica
→ crear nueva sesión
→ emitir access token
→ emitir refresh token si aplica
```

Respuesta esperada:

```json
{
  "success": true,
  "statusCode": 200,
  "timestamp": "2026-06-14T10:30:00.000Z",
  "path": "/api/v1/auth/login",
  "data": {
    "accessToken": "access-token",
    "refreshToken": "refresh-token",
    "expiresIn": 900,
    "user": {
      "id": "user-001",
      "email": "admin@example.com",
      "roles": ["ADMIN"]
    }
  }
}
```

La respuesta puede ajustarse según la estrategia del proyecto, pero no debe exponer datos sensibles.

## Tokens

El sistema puede usar dos tipos de token:

```txt
Access token
= token de corta duración para consumir rutas protegidas

Refresh token
= token de mayor duración para renovar el access token
```

El access token debe tener vida corta.

El refresh token debe tratarse como un valor sensible. Si se almacena en base de datos, debe guardarse como hash, no en texto plano.

## Payload del token

El token debe incluir solo información necesaria.

Ejemplo conceptual:

```json
{
  "sub": "user-001",
  "sessionId": "session-001",
  "roles": ["SECRETARY"],
  "permissions": [
    "students.read",
    "students.create",
    "enrollments.create"
  ]
}
```

Campos esperados:

```txt
sub
= identificador del usuario

sessionId
= identificador de la sesión activa

roles
= roles del usuario

permissions
= permisos efectivos del usuario
```

No deben incluirse datos sensibles, datos personales innecesarios ni información académica que pueda cambiar con frecuencia.

## Sesiones de usuario

El sistema debe registrar sesiones activas.

Tabla conceptual:

```txt
user_sessions
- id
- user_id
- refresh_token_hash
- access_token_jti
- device_name
- ip_address
- user_agent
- status
- created_at
- expires_at
- revoked_at
- last_used_at
```

La sesión permite controlar si un token sigue siendo válido en términos operativos.

Aunque un JWT sea técnicamente válido, el sistema puede rechazarlo si la sesión ya fue revocada, expiró o pertenece a un usuario deshabilitado.

## Una sola sesión por usuario

Si se quiere evitar que el mismo usuario esté conectado en dos lugares al mismo tiempo, el login debe revocar sesiones activas anteriores.

Flujo:

```txt
Usuario inicia sesión
→ se revocan sesiones activas previas del usuario
→ se crea una nueva sesión
→ se emiten nuevos tokens
```

Cuando un token anterior intente usarse, el guard detectará que su `sessionId` ya no está activo.

Esta política puede aplicarse de forma global o por rol, según necesidad.

Ejemplo:

```txt
SECRETARY
= una sola sesión activa

ADMIN
= puede permitir más de una sesión, si el sistema lo decide
```

## Refresh token

El refresh token permite emitir un nuevo access token sin pedir credenciales otra vez.

Flujo esperado:

```txt
POST /api/v1/auth/refresh
→ validar refresh token
→ buscar sesión
→ verificar que la sesión esté activa
→ verificar que el usuario siga activo
→ emitir nuevo access token
```

Si el refresh token no coincide con el hash almacenado, la solicitud debe rechazarse.

## Logout

El logout revoca la sesión actual.

Flujo esperado:

```txt
POST /api/v1/auth/logout
→ identificar sesión actual
→ revocar sesión
→ responder éxito
```

Respuesta posible:

```json
{
  "success": true,
  "statusCode": 200,
  "timestamp": "2026-06-14T10:30:00.000Z",
  "path": "/api/v1/auth/logout",
  "data": {
    "message": "Sesión cerrada correctamente."
  }
}
```

## Rutas públicas y protegidas

Las rutas públicas no requieren token.

Ejemplos:

```txt
POST /api/v1/auth/login
GET /api/v1/health
```

Las rutas protegidas requieren autenticación.

Ejemplos:

```txt
GET /api/v1/students
POST /api/v1/enrollments
PATCH /api/v1/course-offerings/:id/close
GET /api/v1/reports/academic-summary
```

## Errores de autenticación

Cuando el usuario no está autenticado o el token no es válido, se debe responder con `401`.

Ejemplo:

```json
{
  "success": false,
  "statusCode": 401,
  "timestamp": "2026-06-14T10:30:00.000Z",
  "path": "/api/v1/students",
  "error": {
    "key": "UNAUTHORIZED",
    "code": "AUTH_001",
    "message": "No se pudo autenticar la solicitud.",
    "domain": "AUTH"
  }
}
```

Casos comunes:

```txt
- Token ausente.
- Token inválido.
- Token expirado.
- Sesión revocada.
- Usuario deshabilitado.
- Refresh token inválido.
```

## Separación de responsabilidades

La autenticación no debe mezclarse con reglas académicas.

```txt
auth
= autenticar, crear sesión, renovar tokens, cerrar sesión

users
= administrar cuentas y estado del usuario

roles / permissions
= definir acceso y permisos

platform/security
= JWT, hashing, guards, decorators y estrategias técnicas
```

## Criterio general

La autenticación debe permitir identificar al usuario de forma segura, controlar sesiones activas y revocar accesos cuando sea necesario.

El token autentica la solicitud, pero la sesión registrada permite controlar su validez operativa.
