import { generateText } from "ai";
import { google } from "@ai-sdk/google";

import { db } from "@/firebase/admin";
import { getRandomInterviewCover } from "@/lib/utils";

export async function POST(request: Request) {
    const body = await request.json();

    console.log("Full body received:", JSON.stringify(body, null, 2));

    // Handle apiRequest tool call format
    const message = body.message;
    const toolCall = message?.toolCalls?.[0] ?? message?.toolCallList?.[0];
    const args = toolCall?.function?.arguments ?? toolCall?.function?.parameters;

    const role = args?.role;
    const level = args?.level;
    const techstack = args?.techstack;
    const type = args?.type;
    const amount = args?.amount;
    const userid = message?.call?.assistantOverrides?.variableValues?.userid
        ?? message?.call?.assistantOverrides?.variableValues?.userId;

    console.log("Extracted values:", { role, level, techstack, type, amount, userid });

    if (!role || !level || !techstack || !amount || !userid || !type) {
        return Response.json(
            { success: false, error: "Missing required fields" },
            { status: 400 }
        );
    }

    try {
        const { text: questions } = await generateText({
            model: google("gemini-2.5-flash"),
            prompt: `Prepare questions for a job interview.
        The job role is ${role}.
        The job experience level is ${level}.
        The tech stack used in the job is: ${techstack}.
        The focus between behavioural and technical questions should lean towards: ${type}.
        The amount of questions required is: ${amount}.
        Please return only the questions, without any additional text.
        The questions are going to be read by a voice assistant so do not use "/" or "*" or any other special characters which might break the voice assistant.
        Return the questions formatted like this:
        ["Question 1", "Question 2", "Question 3"]
        Thank you! <3
      `,
        });

        const interview = {
            role,
            type,
            level,
            techstack: techstack.split(",").map((t: string) => t.trim()),
            questions: JSON.parse(questions),
            userId: userid,
            finalized: true,
            coverImage: getRandomInterviewCover(),
            createdAt: new Date().toISOString(),
        };

        await db.collection("interviews").add(interview);

        // Return format required by Vapi for tool calls
        return Response.json({
            results: [
                {
                    toolCallId: toolCall?.id,
                    result: "Interview generated successfully. The call will now end.",
                },
            ],
        });

    } catch (error) {
        console.error("Error:", error);
        return Response.json({ success: false, error: error }, { status: 500 });
    }
}

export async function GET() {
    return Response.json({ success: true, data: "Thank you!" }, { status: 200 });
}