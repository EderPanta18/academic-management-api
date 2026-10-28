-- Extensiones y restricciones complementarias de la PRIMERA migracion.
-- Anexar al final del migration.sql inicial generado por Prisma 7.1.
-- Todas las tablas, enums, FK, claves primarias e indices ordinarios
-- deben haber sido creados previamente por la parte generada por Prisma.
-- Exclusivamente para una base vacia; no es una migracion incremental.

CREATE EXTENSION IF NOT EXISTS btree_gist;

-- Unicidad de negocio entre vigentes: comparacion sin distinguir mayusculas
-- ni espacios exteriores. No se eliminan tildes ni espacios internos.
-- Los nombres de columnas son exactamente los del schema Prisma (camelCase).

CREATE UNIQUE INDEX "persons_active_email_uq"
  ON "persons" (lower(btrim("email")))
  WHERE "deletedAt" IS NULL;

CREATE UNIQUE INDEX "faculties_active_acronym_uq"
  ON "faculties" (lower(btrim("acronym")))
  WHERE "deletedAt" IS NULL;

CREATE UNIQUE INDEX "faculties_active_name_uq"
  ON "faculties" (lower(btrim("name")))
  WHERE "deletedAt" IS NULL;

CREATE UNIQUE INDEX "academic_departments_active_code_uq"
  ON "academic_departments" (lower(btrim("code")))
  WHERE "deletedAt" IS NULL;

CREATE UNIQUE INDEX "academic_programs_active_code_uq"
  ON "academic_programs" (lower(btrim("code")))
  WHERE "deletedAt" IS NULL;

CREATE UNIQUE INDEX "students_active_code_uq"
  ON "students" (lower(btrim("code")))
  WHERE "deletedAt" IS NULL;

CREATE UNIQUE INDEX "students_active_institutional_email_uq"
  ON "students" (lower(btrim("institutionalEmail")))
  WHERE "deletedAt" IS NULL;

CREATE UNIQUE INDEX "professors_active_code_uq"
  ON "professors" (lower(btrim("code")))
  WHERE "deletedAt" IS NULL;

CREATE UNIQUE INDEX "professors_active_institutional_email_uq"
  ON "professors" (lower(btrim("institutionalEmail")))
  WHERE "deletedAt" IS NULL;

CREATE UNIQUE INDEX "course_categories_active_code_uq"
  ON "course_categories" (lower(btrim("code")))
  WHERE "deletedAt" IS NULL;

CREATE UNIQUE INDEX "courses_active_code_uq"
  ON "courses" (lower(btrim("code")))
  WHERE "deletedAt" IS NULL;

CREATE UNIQUE INDEX "academic_periods_active_code_uq"
  ON "academic_periods" (lower(btrim("code")))
  WHERE "deletedAt" IS NULL;

-- Clave compuesta de oferta: la seccion se compara como identificador
-- literal; no se altera su semantica mediante una normalizacion no aprobada.
CREATE UNIQUE INDEX "course_offerings_active_section_uq"
  ON "course_offerings" ("courseId", "academicPeriodId", "section")
  WHERE "deletedAt" IS NULL;

CREATE UNIQUE INDEX "users_active_email_uq"
  ON "users" (lower(btrim("email")))
  WHERE "deletedAt" IS NULL;

CREATE UNIQUE INDEX "roles_active_code_uq"
  ON "roles" (lower(btrim("code")))
  WHERE "deletedAt" IS NULL;

-- Catálogos sin baja lógica: unicidad GLOBAL, pero normalizada.
-- Prisma 7.1 no representa indices de expresion como @unique.
CREATE UNIQUE INDEX "document_types_normalized_code_uq"
  ON "document_types" (lower(btrim("code")));
CREATE UNIQUE INDEX "document_types_normalized_name_uq"
  ON "document_types" (lower(btrim("name")));
CREATE UNIQUE INDEX "permissions_normalized_code_uq"
  ON "permissions" (lower(btrim("code")));

-- Reglas de integridad no representables en Prisma Schema Language.
-- La extension debe estar disponible antes de crear la exclusion GiST.

ALTER TABLE "academic_program_courses" ADD CONSTRAINT "academic_program_courses_valid_range"
  CHECK ("validUntil" IS NULL OR "validUntil" > "validFrom");

ALTER TABLE "academic_program_courses" ADD CONSTRAINT "academic_program_courses_no_overlap"
  EXCLUDE USING gist (
  "academicProgramId" WITH =,
  "courseId" WITH =,
  tstzrange("validFrom", "validUntil", '[)') WITH &&
  );

ALTER TABLE "academic_periods" ADD CONSTRAINT "academic_periods_valid_dates"
  CHECK ("startDate" <= "endDate"
  AND "enrollmentStartDate" <= "enrollmentEndDate"
  AND "enrollmentEndDate" <= "endDate");

ALTER TABLE "course_offerings" ADD CONSTRAINT "course_offerings_capacity_positive"
  CHECK ("maxCapacity" > 0);

ALTER TABLE "course_offerings" ADD CONSTRAINT "course_offerings_open_has_professor"
  CHECK ("status" <> 'OPEN' OR "professorId" IS NOT NULL);

ALTER TABLE "student_import_results" ADD CONSTRAINT "student_import_results_row_positive"
  CHECK ("rowNumber" > 0);

ALTER TABLE "student_imports" ADD CONSTRAINT "student_imports_total_rows_nonnegative"
  CHECK ("totalRows" IS NULL OR "totalRows" >= 0);

ALTER TABLE "outbox_messages" ADD CONSTRAINT "outbox_messages_attempts_nonnegative"
  CHECK ("attemptCount" >= 0);

ALTER TABLE "enrollment_movements" ADD CONSTRAINT "enrollment_movements_reason_required"
  CHECK ("movementType" = 'CREATED' OR length(btrim(coalesce("reason", ''))) > 0);

-- Una unica sesion ACTIVE por usuario. Las sesiones anteriores se conservan.
CREATE UNIQUE INDEX "user_sessions_one_active_per_user"
  ON "user_sessions" ("userId")
  WHERE "status" = 'ACTIVE';

-- El tipo y numero de documento se fijan en el alta y son inmutables.
-- La UNIQUE global creada por Prisma no depende de deletedAt.
-- El trigger protege esta regla incluso frente a UPDATE SQL ordinarios.
CREATE FUNCTION prevent_person_document_update()
RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN
  IF NEW."documentTypeId" IS DISTINCT FROM OLD."documentTypeId"
    OR NEW."documentNumber" IS DISTINCT FROM OLD."documentNumber" THEN
    RAISE EXCEPTION 'Document type and number are immutable after person registration';
  END IF;
  RETURN NEW;
END;
$$;

CREATE TRIGGER persons_document_immutable
  BEFORE UPDATE ON "persons"
  FOR EACH ROW EXECUTE FUNCTION prevent_person_document_update();

-- La evidencia confirmada no puede editarse ni eliminarse por SQL ordinario.
CREATE FUNCTION prevent_evidence_mutation()
RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN
  RAISE EXCEPTION 'Historical evidence is append-only: %.%',
    TG_TABLE_SCHEMA, TG_TABLE_NAME;
END;
$$;

CREATE TRIGGER enrollment_movements_immutable
  BEFORE UPDATE OR DELETE ON "enrollment_movements"
  FOR EACH ROW EXECUTE FUNCTION prevent_evidence_mutation();

CREATE TRIGGER audit_logs_immutable
  BEFORE UPDATE OR DELETE ON "audit_logs"
  FOR EACH ROW EXECUTE FUNCTION prevent_evidence_mutation();

-- Invariantes transversales que permanecen en transacciones SERIALIZABLE
-- de todos los escritores autorizados, con reintentos de serializacion:
-- cupos, inscripcion ENROLLED unica por alumno/curso/periodo (entre secciones),
-- rectificacion de retiros, proteccion de dependencias y bajas logicas,
-- precondiciones de cambios de estado y atributos de ofertas/periodos,
-- autorizacion de correcciones academicas, revocacion de sesiones.
-- Nunca eliminar ni reasignar evidencia historica por cascada.
