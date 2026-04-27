import express from 'express';

const router = express.Router();

// ─── In-memory store ──────────────────────────────────────────────────────────
// Each entry shape:
//   { id, workerId, date, hours, reason, month, year, createdAt }
//
// `month` and `year` are derived from `date` at write-time so the
// monthly-cap check is a simple O(n) filter without repeated Date parsing.
const overtimeEntries = [];
let nextId = 1;

// ─── Helper ───────────────────────────────────────────────────────────────────
// Extract YYYY-MM from a "YYYY-MM-DD" string — used to group by calendar month.
const getYearMonth = (dateStr) => dateStr.slice(0, 7); // e.g. "2026-04"

// ─── Validation ───────────────────────────────────────────────────────────────
// Returns an array of human-readable error strings.
// An empty array means the request is valid.
const validateRequest = (body, existingEntries) => {
    const errors = [];
    const { workerId, date, hours, reason } = body;

    // ── 1. Required fields ────────────────────────────────────────────────────
    // Check each field individually so we can report exactly which one is missing.
    if (!workerId || String(workerId).trim() === '')
        errors.push('workerId is required.');

    if (!date || String(date).trim() === '')
        errors.push('date is required.');

    if (hours === undefined || hours === null || String(hours).trim() === '')
        errors.push('hours is required.');

    if (!reason || String(reason).trim() === '')
        errors.push('reason is required.');

    // Stop here if any field is missing — the subsequent checks
    // need valid values to make sense.
    if (errors.length > 0) return errors;

    // ── 2. Hours range: 1–6 ───────────────────────────────────────────────────
    // Parse as a number; reject non-integers and values outside the window.
    const hoursNum = Number(hours);
    if (!Number.isFinite(hoursNum) || !Number.isInteger(hoursNum) || hoursNum < 1 || hoursNum > 6)
        errors.push('hours must be an integer between 1 and 6.');

    // ── 3. Duplicate check: same workerId + date ─────────────────────────────
    // Two entries are a duplicate when they share both the worker and
    // the exact calendar date — you cannot log overtime twice on the same day.
    const isDuplicate = existingEntries.some(
        (entry) => entry.workerId === String(workerId).trim() && entry.date === date
    );
    if (isDuplicate)
        errors.push(`Overtime for worker '${workerId}' on ${date} already exists.`);

    // ── 4. Monthly cap: total overtime per worker ≤ 60 hours ─────────────────
    // Sum all existing overtime hours for this worker in the same calendar month
    // (YYYY-MM), then add the proposed hours. If the total would exceed 60, reject.
    const targetMonth = getYearMonth(date);
    const usedHoursThisMonth = existingEntries
        .filter(
            (entry) =>
                entry.workerId === String(workerId).trim() &&
                getYearMonth(entry.date) === targetMonth
        )
        .reduce((sum, entry) => sum + entry.hours, 0);

    if (usedHoursThisMonth + hoursNum > 60)
        errors.push(
            `Monthly overtime limit exceeded. Worker '${workerId}' has already logged ` +
            `${usedHoursThisMonth} hour(s) this month. ` +
            `Adding ${hoursNum} would exceed the 60-hour cap.`
        );

    return errors;
};

// ─── POST /api/overtime ───────────────────────────────────────────────────────
router.post('/api/overtime', (req, res) => {
    const { workerId, date, hours, reason } = req.body;

    // Run all validation rules and collect every error at once.
    const errors = validateRequest(req.body, overtimeEntries);

    // If any rule failed, respond with 400 and the full list of errors.
    // Returning all errors at once (not just the first) lets the client
    // display a complete form-level summary in one round-trip.
    if (errors.length > 0) {
        return res.status(400).json({ msg: errors.join(' ') , errors });
    }

    // Build and persist the new entry.
    const newEntry = {
        id        : nextId++,
        workerId  : String(workerId).trim(),
        date,                                // stored as-is: "YYYY-MM-DD"
        hours     : Number(hours),
        reason    : String(reason).trim(),
        createdAt : new Date().toISOString(),
    };

    overtimeEntries.push(newEntry);

    return res.status(201).json({
        msg  : 'Overtime entry saved successfully.',
        data : newEntry,
    });
});

// ─── GET /api/overtime ────────────────────────────────────────────────────────
// Convenience endpoint to inspect the in-memory store during development.
router.get('/api/overtime', (_req, res) => {
    res.json({ total: overtimeEntries.length, data: overtimeEntries });
});

export default router;
