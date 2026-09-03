-- One-shot, idempotent DB setup for race-proof bookings. Run with:
--   prisma db execute --file prisma/sql/setup.sql
-- Safe to run more than once. Adds the interval + hold columns, backfills any
-- existing rows, enforces NOT NULL, indexes, and installs the exclusion
-- constraint that makes double-booking impossible.

CREATE EXTENSION IF NOT EXISTS btree_gist;

ALTER TABLE "Booking" ADD COLUMN IF NOT EXISTS "startsAt" timestamp(3);
ALTER TABLE "Booking" ADD COLUMN IF NOT EXISTS "endsAt"   timestamp(3);
ALTER TABLE "Booking" ADD COLUMN IF NOT EXISTS "holdExpiresAt" timestamp(3);

UPDATE "Booking" SET
  "startsAt" = CASE
    WHEN "charterType" = 'half_day'
      THEN ("scheduleDate" || 'T' || "startTime" || ':00')::timestamp
    ELSE ("scheduleDate")::timestamp
  END,
  "endsAt" = CASE
    WHEN "charterType" = 'half_day'
      THEN ("scheduleDate" || 'T' || "endTime" || ':00')::timestamp
    WHEN "charterType" = 'full_day'
      THEN (("scheduleDate")::date + 1)::timestamp
    ELSE ((COALESCE(NULLIF("endDate", ''), "scheduleDate"))::date + 1)::timestamp
  END
WHERE "startsAt" IS NULL OR "endsAt" IS NULL;

ALTER TABLE "Booking" ALTER COLUMN "startsAt" SET NOT NULL;
ALTER TABLE "Booking" ALTER COLUMN "endsAt" SET NOT NULL;

CREATE INDEX IF NOT EXISTS "Booking_yachtId_startsAt_idx"
  ON "Booking" ("yachtId", "startsAt");

ALTER TABLE "Booking" DROP CONSTRAINT IF EXISTS booking_no_overlap;
ALTER TABLE "Booking" ADD CONSTRAINT booking_no_overlap
  EXCLUDE USING gist (
    "yachtId" WITH =,
    tsrange("startsAt", "endsAt", '[)') WITH &&
  )
  WHERE ("status" <> 'cancelled');
