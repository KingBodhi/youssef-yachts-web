-- Runs FIRST in `npm run db:setup`. Safe on a brand-new database (the Booking
-- table may not exist yet — the guard makes this a no-op) and on an existing
-- one with rows (adds the interval columns nullable and backfills them, so the
-- subsequent `prisma db push` can flip them to NOT NULL without failing).
DO $$
BEGIN
  IF to_regclass('"Booking"') IS NOT NULL THEN
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
  END IF;
END $$;
