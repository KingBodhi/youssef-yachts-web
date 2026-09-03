-- Run AFTER `prisma db push`. This is the guarantee that no two people can book
-- the same yacht at the same time. btree_gist gives us the '=' operator class
-- for the text yachtId so it can sit in a GiST exclusion constraint next to the
-- time range. The constraint rejects any INSERT/UPDATE that would leave two
-- non-cancelled bookings for one yacht with overlapping [startsAt, endsAt)
-- ranges. It is enforced by Postgres itself, so it holds under any amount of
-- concurrency — the application cannot race past it.
CREATE EXTENSION IF NOT EXISTS btree_gist;

ALTER TABLE "Booking" DROP CONSTRAINT IF EXISTS booking_no_overlap;

ALTER TABLE "Booking" ADD CONSTRAINT booking_no_overlap
  EXCLUDE USING gist (
    "yachtId" WITH =,
    tsrange("startsAt", "endsAt", '[)') WITH &&
  )
  WHERE ("status" <> 'cancelled');
