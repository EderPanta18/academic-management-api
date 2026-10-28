# Aplicar la primera migración de Prisma con SQL complementario

Esta guía describe cómo generar la **primera migración** de Academic Management API sin ejecutarla inicialmente, incorporar las restricciones de `prisma/migration-additions.sql`, aplicar la migración completa y generar Prisma Client.

Se utiliza **Prisma 7.1**, **PostgreSQL**, **pnpm** y una terminal **PowerShell**. El procedimiento está destinado a una **base de datos de desarrollo vacía**, sin tablas ni migraciones previamente aplicadas.

## 1. Estructura del proyecto

El repositorio utiliza esta organización:

```text
prisma/
├── data/
├── migrations/
├── seeds/
├── client.ts
├── migration-additions.sql
├── schema.prisma
└── seed.ts
```

- `schema.prisma`: define los modelos y las relaciones representables en Prisma.
- `migration-additions.sql`: contiene los índices parciales, restricciones y triggers que deben incorporarse a la migración inicial.
- `migrations/`: almacena las migraciones versionadas. Prisma crea una subcarpeta con fecha y nombre, y dentro de ella `migration.sql`.

**Importante:** `migration-additions.sql` no se ejecuta automáticamente. Su contenido debe quedar integrado en el `migration.sql` generado, **antes de aplicar la migración**.

## 2. Verificar la configuración

Desde la **raíz del proyecto**, comprobar que PostgreSQL está disponible y que la configuración de Prisma apunta a la base de datos de desarrollo correcta. En Prisma 7, la conexión para migraciones se configura mediante `prisma.config.ts` o la configuración equivalente existente.

Validar el esquema:

```powershell
pnpm exec prisma validate
```

Continuar únicamente si el esquema es válido. La base debe estar vacía, y la configuración de conexión debe permitir crear la extensión `btree_gist` utilizada por el SQL complementario.

> Si `prisma/migrations/` contiene migraciones anteriores, o la base ya tiene tablas, no tratar este procedimiento como una primera migración ni borrar datos para forzarlo.

## 3. Generar la migración SIN aplicarla

Ejecutar:

```powershell
pnpm exec prisma migrate dev --name init --create-only
```

El modificador `--create-only` **genera los archivos SQL, pero no aplica la nueva migración a la base de datos**.

Prisma creará una carpeta parecida a esta:

```text
prisma/
└── migrations/
    └── 20261027193000_init/
        └── migration.sql
```

El prefijo numérico cambia según el momento en que se genera la migración.

## 4. Incorporar manualmente el SQL complementario

1. Abrir en el editor **`prisma/migrations/<fecha>_init/migration.sql`**.
2. Ir hasta el **final del archivo** generado por Prisma.
3. Abrir **`prisma/migration-additions.sql`**.
4. Copiar **todo su contenido**, sin omitir funciones, índices, restricciones o triggers.
5. Volver a `migration.sql`, dejar una línea en blanco al final y **pegar el contenido completo**.
6. **Guardar** `migration.sql`.

El resultado debe tener este orden:

```sql
-- SQL generado automáticamente por Prisma.
CREATE TABLE ...;
ALTER TABLE ...;
CREATE INDEX ...;

-- A partir de aquí, SQL copiado de prisma/migration-additions.sql.
CREATE EXTENSION IF NOT EXISTS btree_gist;

-- Índices únicos, restricciones CHECK, exclusiones y triggers adicionales.
-- ...
```

El fragmento anterior es **ilustrativo**. No reemplazar el SQL real generado por Prisma ni copiar estos puntos suspensivos como instrucciones SQL.

**No ejecutar** `migration-additions.sql` de forma independiente: debe formar parte de la **misma migración versionada**.

## 5. Revisar antes de aplicar

Comprobar en `migration.sql` que:

- Aparecen las tablas, claves foráneas e índices que Prisma generó a partir de `schema.prisma`.
- El contenido de `migration-additions.sql` está pegado **una sola vez** y al final.
- `CREATE EXTENSION IF NOT EXISTS btree_gist;` aparece antes de la restricción de exclusión que utiliza GiST.
- Las funciones y triggers SQL tienen su sintaxis completa, incluidos sus delimitadores `$$` y `;`.
- El SQL de la primera migración no contiene instrucciones para eliminar índices o tablas heredados, ni procesos de migración de datos existentes.

Hasta este momento, **la migración nueva aún no se ha aplicado**.

## 6. Aplicar la migración completa

Después de guardar y revisar `migration.sql`, ejecutar desde la raíz:

```powershell
pnpm exec prisma migrate dev
```

Prisma aplicará el `migration.sql` completo, incluido el SQL complementario que se incorporó manualmente.

Si ocurre un error de SQL o permisos, **corregir la causa antes de continuar**. No ejecutar `prisma db push`, borrar tablas ni reiniciar la base de datos como solución automática.

## 7. Confirmar el estado de las migraciones

Ejecutar:

```powershell
pnpm exec prisma migrate status
```

Verificar que la migración `init` figure como aplicada y que no existan migraciones pendientes. Opcionalmente, comprobar en PostgreSQL que se hayan creado los índices, restricciones y triggers adicionales.

## 8. Generar Prisma Client

Una vez aplicada la migración, ejecutar:

```powershell
pnpm exec prisma generate
```

En Prisma 7, `prisma migrate dev` **no ejecuta automáticamente** `prisma generate` ni los scripts de seed; por eso la generación se realiza expresamente.

Si el proyecto necesita cargar datos iniciales y el seed está configurado, ejecutarlo **después** de la migración y de la generación:

```powershell
pnpm exec prisma db seed
```

El seed es opcional y no forma parte de la aplicación del SQL complementario.

## 9. Resumen de comandos

Los comandos que se ejecutan, en orden, son:

```powershell
# 1. Validar el schema.
pnpm exec prisma validate

# 2. Crear la migración sin aplicarla.
pnpm exec prisma migrate dev --name init --create-only

# 3. INTERVENCIÓN MANUAL:
# Abrir prisma/migrations/<fecha>_init/migration.sql,
# pegar al final TODO prisma/migration-additions.sql y guardar.

# 4. Aplicar la migración completa.
pnpm exec prisma migrate dev

# 5. Confirmar el estado.
pnpm exec prisma migrate status

# 6. Generar Prisma Client.
pnpm exec prisma generate
```

**Resultado esperado:** una sola migración inicial versionada que contiene tanto el esquema generado por Prisma como las restricciones SQL complementarias. La carpeta `prisma/migrations/` y `schema.prisma` deben conservarse en el repositorio.

## Referencia

- [Prisma ORM v7 — Personalización de migraciones](https://www.prisma.io/docs/orm/v7/prisma-migrate/workflows/customizing-migrations)
- [Prisma CLI v7 — `migrate dev`](https://www.prisma.io/docs/cli/v7/migrate/dev)
