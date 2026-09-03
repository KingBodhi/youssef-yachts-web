# Booking + Payment System — Setup & Go-Live

This adds two things to the site:

1. **Race-proof double-booking prevention.** A Postgres exclusion constraint
   makes it physically impossible for two overlapping non-cancelled bookings to
   exist for the same yacht. The app cannot race past it — the database rejects
   the second booking. A live availability calendar greys out taken dates/slots
   in the UI on top of that.
2. **Stripe payments.** Guests reserve a slot (15–35 min hold), pay a deposit
   (or full amount) via Stripe Checkout, and a webhook finalizes the booking so
   the order completes even if they close the tab on the way back.

Everything is built. Three things remain, all requiring credentials or a live
DB — do these on your Mac (or in Vercel), because this repo's Prisma engine
cannot be fetched inside the Claude sandbox.

---

## 1. Fill in `.env.local`

The Vercel dev pull only returned `BLOB_READ_WRITE_TOKEN` and
`VERCEL_OIDC_TOKEN`. These are still blank and must be filled:

| Var | Where to get it |
| --- | --- |
| `DATABASE_URL` | Neon pooled URL. It's in your Vercel **Production** env, not the dev pull. Run `vercel env pull .env.production.local --environment=production` and copy it, or copy from the Neon dashboard. |
| `DIRECT_URL` | Neon **non-pooled** URL (same place). Used for migrations. |
| `AUTH_SECRET` | `openssl rand -base64 32` |
| `STRIPE_SECRET_KEY` | Stripe Dashboard → Developers → API keys → **Secret key** (`sk_test_...`). |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Same page → **Publishable key** (`pk_test_...`). |
| `STRIPE_WEBHOOK_SECRET` | Set in step 3 below (`whsec_...`). |
| `STRIPE_CHARGE_MODE` | `full` (charge the whole amount — current setting) or `deposit` (50%). |
| `NEXT_PUBLIC_BASE_URL` | Your deployed URL, e.g. `https://youssef-yachts.vercel.app`. |

> Until Stripe keys are present the site still works — it falls back to the
> original "request a charter" flow (no payment). Add the keys to turn payments on.

Also add all of these to the Vercel project's env (Production + Preview) so the
deployed site has them.

---

## 2. Set up the database (one command)

```bash
npm run db:setup
```

This runs, in order:
1. `prisma/sql/001_backfill_intervals.sql` — adds the interval columns (safe on a fresh DB).
2. `prisma db push` — syncs the schema (creates `startsAt`, `endsAt`, `holdExpiresAt`).
3. `prisma/sql/002_no_overlap_constraint.sql` — enables `btree_gist` and adds the
   `booking_no_overlap` exclusion constraint (the real double-booking guard).
4. `prisma generate` — regenerates the client with the new fields.

You can confirm the guard exists:

```bash
psql "$DIRECT_URL" -c "\d+ \"Booking\"" | grep booking_no_overlap
```

---

## 3. Create the Stripe webhook

**Local testing** (Stripe CLI):
```bash
stripe login
stripe listen --forward-to localhost:3000/api/stripe/webhook
# copy the whsec_... it prints into STRIPE_WEBHOOK_SECRET
```

**Production**: Stripe Dashboard → Developers → Webhooks → Add endpoint
- URL: `https://<your-domain>/api/stripe/webhook`
- Events: `checkout.session.completed`, `checkout.session.expired`
- Copy the **Signing secret** (`whsec_...`) into `STRIPE_WEBHOOK_SECRET` (Vercel env).

---

## 4. Test end-to-end (test mode)

1. `npm run dev` (or use the deployed preview).
2. Book a yacht → you're redirected to Stripe Checkout.
3. Pay with test card `4242 4242 4242 4242`, any future expiry, any CVC/ZIP.
4. You land on `/book/success` — reservation confirmed, deposit recorded.
5. In `/admin`, the booking shows `deposit_paid` with the Stripe payment id.
6. **Prove no double-booking:** open the same yacht/date/slot in two tabs, try to
   book both. The second gets "That date and time was just reserved…". The
   calendar also greys the slot out after the first reservation.

Useful test cards: success `4242…4242`; declined `4000 0000 0000 0002`.

---

## 5. Go live

1. Swap Stripe **test** keys for **live** keys in Vercel env.
2. Create a **live-mode** webhook (repeat step 3 with the live dashboard).
3. Redeploy.

---

## Known limitations / future work

- **Multi-day pricing** currently charges one day's rate (`multiDayPerDay`) and
  the form doesn't collect an end date, so a multi-day charter reserves a single
  day. To fully support multi-day, add an end-date picker and multiply the base
  by the number of days. The interval + constraint logic already blocks whole
  date ranges once an `endDate` is provided.
- **Balance collection** is offline by default (matches the site copy). To take
  the balance online later, add a second Checkout for `remainingAmount`.
- **Confirmation emails** are not included. Add a provider (e.g. Resend) in the
  webhook's `checkout.session.completed` handler if you want automated emails.
