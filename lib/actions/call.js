"use server";

import { currentUser } from "@clerk/nextjs/server";
import { db } from "@/lib/prisma";
import { StreamClient } from "@stream-io/node-sdk";

const STREAM_API_KEY = process.env.STREAM_API_KEY || process.env.NEXT_PUBLIC_STREAM_API_KEY;
const STREAM_SECRET_KEY = process.env.STREAM_SECRET_KEY;

const createStreamClient = () => {
    if (!STREAM_API_KEY || !STREAM_SECRET_KEY) {
        console.error(
            "Stream credentials are missing. Ensure STREAM_API_KEY/NEXT_PUBLIC_STREAM_API_KEY and STREAM_SECRET_KEY are set."
        );
        throw new Error("Stream API credentials are not configured.");
    }

    return new StreamClient(STREAM_API_KEY, STREAM_SECRET_KEY);
};

export const getCallData = async (callId) => {
    const user = await currentUser();
    if (!user) return { error: "Unauthorized" };

    const booking = await db.booking.findUnique({
        where: { streamCallId: callId },
        include: {
            interviewer: {
                select: {
                    id: true,
                    clerkUserId: true,
                    name: true,
                    imageUrl: true,
                    categories: true,
                },
            },
            interviewee: {
                select: {
                    id: true,
                    clerkUserId: true,
                    name: true,
                    imageUrl: true,
                },
            },
        },
    });

    if (!booking) return { error: "Call not found" };

    const isInterviewer = booking.interviewer.clerkUserId === user.id;
    const isInterviewee = booking.interviewee.clerkUserId === user.id;
    if (!isInterviewer && !isInterviewee) return { error: "Forbidden" };

    const streamClient = createStreamClient();

    const token = streamClient.generateUserToken({
        user_id: user.id,
        validity_in_seconds: 60 * 60,
    });

    return {
        token,
        isInterviewer,
        currentUser: {
            id: user.id,
            name: `${user.firstName} ${user.lastName}`.trim(),
            imageUrl: user.imageUrl,
        },
        booking: {
            id: booking.id,
            interviewer: booking.interviewer,
            interviewee: booking.interviewee,
            categories: booking.interviewer.categories,
            startTime: booking.startTime.toISOString(),
            endTime: booking.endTime.toISOString(),
        },
    };
};