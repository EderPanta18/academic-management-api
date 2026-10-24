-- SQL COMPLEMENTARIO. Añadir al FINAL del migration.sql generado por
-- `pnpm exec prisma migrate dev --name align_academic_model --create-only`.
-- No ejecutar separado de la migración versionada.
-- Requiere permisos para instalar la extensión btree_gist en PostgreSQL.

CREATE EXTENSION IF NOT EXISTS btree_gist;

-- Episodios del mismo programa y curso: [valid_from, valid_until), sin solapamientos.
ALTER TABLE "academic_program_courses"
  ADD CONSTRAINT "academic_program_courses_valid_range"
  CHECK ("validUntil" IS NULL OR "validUntil" > "validFrom");

ALTER TABLE "academic_program_courses"
  ADD CONSTRAINT "academic_program_courses_no_overlap"
  EXCLUDE USING gist (
    "academicProgramId" WITH =,
    "courseId" WITH =,
    tstzrange("validFrom", "validUntil", '[)') WITH &&
  );

-- Una única sesión activa por usuario; las revocadas y expiradas se conservan.
CREATE UNIQUE INDEX "user_sessions_one_active_per_user"
  ON "user_sessions" ("userId")
  WHERE "status" = 'ACTIVE';

-- Restricciones sencillas de integridad que Prisma 7.1 no expresa como CHECK.
ALTER TABLE "academic_periods"
  ADD CONSTRAINT "academic_periods_valid_dates"
  CHECK (
    "startDate" <= "endDate"
    AND "enrollmentStartDate" <= "enrollmentEndDate"
    AND "enrollmentEndDate" <= "endDate"
  );

ALTER TABLE "course_offerings"
  ADD CONSTRAINT "course_offerings_capacity_positive"
  CHECK ("maxCapacity" > 0);

ALTER TABLE "course_offerings"
  ADD CONSTRAINT "course_offerings_open_has_professor"
  CHECK ("status" <> 'OPEN' OR "professorId" IS NOT NULL);

ALTER TABLE "student_import_results"
  ADD CONSTRAINT "student_import_results_row_positive"
  CHECK ("rowNumber" > 0);

ALTER TABLE "student_imports"
  ADD CONSTRAINT "student_imports_total_rows_nonnegative"
  CHECK ("totalRows" IS NULL OR "totalRows" >= 0);

ALTER TABLE "outbox_messages"
  ADD CONSTRAINT "outbox_messages_attempts_nonnegative"
  CHECK ("attemptCount" >= 0);

ALTER TABLE "enrollment_movements"
  ADD CONSTRAINT "enrollment_movements_reason_required"
  CHECK (
    "movementType" = 'CREATED'
    OR length(btrim(coalesce("reason", ''))) > 0
  );

-- La evidencia histórica es de solo inserción también frente a actualizaciones
-- SQL directas ordinarias (restringir privilegios de ALTER/DISABLE TRIGGER).
CREATE OR REPLACE FUNCTION prevent_evidence_mutation()
RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN
  RAISE EXCEPTION 'Historical evidence is append-only: %.%', TG_TABLE_SCHEMA, TG_TABLE_NAME;
END;
$$;

CREATE TRIGGER enrollment_movements_immutable
BEFORE UPDATE OR DELETE ON "enrollment_movements"
FOR EACH ROW EXECUTE FUNCTION prevent_evidence_mutation();

CREATE TRIGGER audit_logs_immutable
BEFORE UPDATE OR DELETE ON "audit_logs"
FOR EACH ROW EXECUTE FUNCTION prevent_evidence_mutation();

-- Los cupos, la unicidad ENROLLED por estudiante+curso+periodo y la rectificación
-- de retiros son invariantes entre tablas. Deben verificarse dentro de la misma
-- transacción SERIALIZABLE en todos los casos de uso escritores, con reintentos
-- para conflictos de serialización. No existe un UNIQUE parcial suficiente con
-- solo student_id y course_offering_id sin duplicar claves derivables.
