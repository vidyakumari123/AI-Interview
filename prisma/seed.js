import "dotenv/config";
import { PrismaClient } from "../lib/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";

// Replicate the same adapter pattern as lib/prisma.ts
// Can't use @/ alias — seed runs outside Next.js
const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const db = new PrismaClient({ adapter });

// ── CHANGE THIS ───────────────────────────────────────────────────────────────
const BOOKING_ID = "03a70419-1166-43c4-aad9-8578ff771b15";
// ─────────────────────────────────────────────────────────────────────────────

const feedback = {
    summary:
        "Vidya demonstrated a solid understanding of React fundamentals and component architecture. He approached problems methodically and showed good instincts around state management. With some refinement in system design and async patterns, he's well on track for a mid-level frontend role.",
    technical:
        "Strong grasp of React hooks, component lifecycle, and basic TypeScript. Handled the closure question confidently. Struggled slightly with the event loop explanation and needed hints on optimising a recursive tree traversal — but recovered well once guided.",
    communication:
        "Articulate and structured in most answers. Thinks out loud effectively, which made it easy to follow his reasoning. Occasionally jumped to implementation before fully exploring the problem space.",
    problemSolving:
        "Good instinct for breaking problems down. Chose sensible data structures for most questions. The dynamic programming problem was a stretch — he identified the overlapping subproblems but didn't arrive at a memoised solution independently.",
    recommendation:
        "Recommended for mid-level frontend roles at growth-stage startups. Not yet ready for senior FAANG interviews without deepening system design knowledge. Suggest focusing on: async JavaScript internals, large-scale component architecture, and DP patterns.",
    strengths: [
        "Strong React & hooks knowledge",
        "Clear verbal communication",
        "Systematic debugging approach",
        "Good CSS & browser fundamentals",
    ],
    improvements: [
        "System design depth",
        "Async/event loop internals",
        "Dynamic programming patterns",
        "Ask clarifying questions upfront",
    ],
    overallRating: "GOOD", // POOR | AVERAGE | GOOD | EXCELLENT
    sessionRating: 4,
    sessionComment:
        "Great session — Vidya was engaged and receptive to feedback. Would be happy to interview him again after he's done more system design prep.",
};

async function main() {
    console.log("Seeding database...");

    const interviewer = await db.user.upsert({
        where: { clerkUserId: "seed_interviewer" },
        update: {
            email: "expert@example.com",
            name: "Expert Interviewer",
            role: "INTERVIEWER",
            title: "Principal Engineer",
            company: "Big Tech",
            yearsExp: 10,
            categories: ["FRONTEND"],
            creditRate: 10,
            bio: "I help candidates prepare for frontend and systems interviews with practical, hands-on feedback.",
        },
        create: {
            clerkUserId: "seed_interviewer",
            email: "expert@example.com",
            name: "Expert Interviewer",
            role: "INTERVIEWER",
            title: "Principal Engineer",
            company: "Big Tech",
            yearsExp: 10,
            categories: ["FRONTEND"],
            creditRate: 10,
            creditBalance: 0,
            bio: "I help candidates prepare for frontend and systems interviews with practical, hands-on feedback.",
        },
    });

    const interviewee = await db.user.upsert({
        where: { clerkUserId: "seed_interviewee" },
        update: {
            email: "vidya@example.com",
            name: "Vidya",
            role: "INTERVIEWEE",
            credits: 20,
            currentPlan: "starter",
        },
        create: {
            clerkUserId: "seed_interviewee",
            email: "vidya@example.com",
            name: "Vidya",
            role: "INTERVIEWEE",
            credits: 20,
            currentPlan: "starter",
        },
    });

    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const availabilityStart = new Date(tomorrow);
    availabilityStart.setHours(10, 0, 0, 0);
    const availabilityEnd = new Date(tomorrow);
    availabilityEnd.setHours(17, 0, 0, 0);

    const existingAvailability = await db.availability.findFirst({
        where: {
            interviewerId: interviewer.id,
            status: "AVAILABLE",
            startTime: availabilityStart,
            endTime: availabilityEnd,
        },
    });

    if (!existingAvailability) {
        await db.availability.create({
            data: {
                interviewerId: interviewer.id,
                startTime: availabilityStart,
                endTime: availabilityEnd,
                status: "AVAILABLE",
            },
        });
        console.log("✅  Created mock availability for the seeded interviewer.");
    }

    let existingBooking = await db.booking.findFirst({
        where: {
            intervieweeId: interviewee.id,
            interviewerId: interviewer.id,
            status: "SCHEDULED",
        },
        select: { id: true },
    });

    if (!existingBooking) {
        console.log("No existing booking found. Creating a dummy past booking...");
        existingBooking = await db.booking.create({
            data: {
                intervieweeId: interviewee.id,
                interviewerId: interviewer.id,
                startTime: new Date(Date.now() - 86400000), // 1 day ago
                endTime: new Date(Date.now() - 82800000),   // 45 mins later
                status: "SCHEDULED",
                creditsCharged: 10,
            },
            select: { id: true },
        });
        console.log(`✅  Created mock Booking ID: ${existingBooking.id}`);
    }

    let finalBookingId = existingBooking.id;

    const existingFeedback = await db.feedback.findUnique({
        where: { bookingId: finalBookingId },
    });

    if (existingFeedback) {
        console.log(`ℹ️  Feedback already exists for booking: ${finalBookingId}. Seed is already up to date.`);
        return;
    }

    await db.$transaction([
        db.feedback.create({
            data: { bookingId: finalBookingId, ...feedback },
        }),
        db.booking.update({
            where: { id: finalBookingId },
            data: { status: "COMPLETED" },
        }),
    ]);

    console.log(`✅  Feedback seeded for booking: ${finalBookingId}`);
    console.log(`✅  Booking status → COMPLETED`);
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(() => db.$disconnect());