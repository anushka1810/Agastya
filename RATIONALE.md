# Design Rationale — Fee Collection Screen

## 1. Hierarchy: what's on top, what's demoted, and why

The top of the screen carries exactly two numbers: **Total Outstanding** (₹) and **Overdue Students** (count). Nothing else competes with them for attention — no logo art, no secondary stats, no chart. Lakshmi's actual job this morning is to answer "what's my number" before 11am, and that number has to be readable in under two seconds without scrolling or doing arithmetic in her head.

Everything else is demoted a level:
- **Filter chips** (All / Overdue / Payment Failed / Partially Paid / Paid / Instalment Plan / Credit Balance / Withdrawn) sit directly below the summary, each showing a count, since narrowing the list is the very next thing she does after seeing the total.
- **Per-student detail** — full fee component breakdown, payment history, guardian contact — is pushed one click away into a detail view, not shown inline. At 900 rows, showing full detail per row would drown the list in noise. The row itself only shows what's needed to triage: name, class, balance, and a status chip.
- **Family context** (siblings) is shown as a light grouping only when it actually matters — see click-cost discussion below — rather than as a permanent structural element on every row.

The guiding rule: the list view answers "who do I chase," the detail view answers "why, and what's the history." Mixing the two would slow down the triage pass that Lakshmi does 900 times.

## 2. Three awkward records and how they were handled

**Scholarship holder with transport due (Devansh Patil, STU-1005):** Tuition is fully waived, but transport is still owed. Showing this student as "₹0 due" in the same grey as a fully-paid student would hide a real ₹9,000 receivable. Instead, the student still carries an **OVERDUE** status (because the transport component genuinely is overdue), but the detail view explicitly breaks out "Scholarship — tuition waived" as its own line, so the waiver is visible rather than looking like an error or an oversight.

**Bounced cheque (Kavya Reddy, STU-1006):** This is not the same problem as a student who simply hasn't paid yet — it needs a different action (re-contact about a failed payment method, not a first reminder). It's given a distinct status ("Payment Failed") separate from plain Overdue, styled differently so it doesn't blend into the general red-overdue group, and the bounced payment itself is called out inside the payment history rather than silently disappearing from the ledger.

**Approved instalment plan not yet due (Ishaan Nair, STU-1007):** This student technically has an unpaid balance but is not late — there's an approved plan. Marking this the same as Overdue would send an unnecessary, trust-damaging reminder. It's shown as a separate neutral "Instalment Plan" status, explicitly not counted in the overdue total, and the detail view clearly calls out exactly when the next payment is due and for how much.

**Withdrawn student with remaining balance (Anya Krishnan, STU-1012):** This student is no longer enrolled but has a non-zero balance and a refund due. To prevent any accidental communication or confusion, this student is given a "Withdrawn" neutral status, is omitted from any overdue aggregations, and carries a prominent "Do not chase" alert and refund details in the detail view.

## 3. Interaction path: chasing 30 defaulters, counted in clicks

1. Open screen — total outstanding and overdue count are already visible (0 clicks).
2. Click **"Select all overdue"** — every currently-overdue student gets selected (1 click).
3. Click **"Send Reminder"** — bulk reminder is sent (1 click).

**Total: 2 clicks**, regardless of whether it's 5 defaulters or 300. If Lakshmi wants to deselect a few individuals first (say, a family she's already spoken to on the phone), that's one additional click per exclusion — but the default path never requires reading or selecting rows one at a time.

## 4. Mobile: what was kept, what was dropped

Mobile is a **different layout**, not a shrunk desktop table — Lakshmi's mobile use case is a quick corridor check, not full triage.

Kept: the two summary numbers (stacked, not side-by-side, since 375px doesn't have room for both cards horizontally), the "Select all overdue" bulk-select with checkboxes, and a short list of only the students who are Overdue or Payment-Failed, sorted by balance descending, each with a tap-to-call icon next to the guardian's number.

Dropped entirely on mobile: filter chips and the full 24-student list. None of these serve a "quick glance in the corridor" moment — filtering is a desk task, not a hallway task.

## 5. One thing tried and rejected

The first version grouped **every** student into a family card, including families with only one child, since the data technically supports family grouping for all 24 students. This was rejected after testing the click path: it added an unnecessary expand-click for the majority of students who don't have a sibling in the school, which directly hurt the interaction-cost goal. The final version only creates a family grouping when a family actually has more than one enrolled child (in this dataset, only the Fernandes family) — everyone else renders as a normal flat row.