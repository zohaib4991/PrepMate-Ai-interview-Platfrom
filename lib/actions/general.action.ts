"use server";

import { generateText } from "ai";
import { google } from "@ai-sdk/google";

import { db } from "@/firebase/admin";
import { feedbackSchema } from "@/constants";

export async function createFeedback(params: CreateFeedbackParams) {
    const { interviewId, userId, transcript, feedbackId } = params;

    console.log("createFeedback received:", {
        interviewId,
        userId,
        transcriptLength: transcript.length,
        feedbackId,
        firstMessage: transcript[0],
    });

    try {
        const formattedTranscript = transcript
            .map(
                (sentence: { role: string; content: string }) =>
                    `- ${sentence.role}: ${sentence.content}\n`
            )
            .join("");

        const { text } = await generateText({
            model: google("gemini-2.5-flash"),
            prompt: `
    You are an AI interviewer analyzing a mock interview. Your task is to evaluate the candidate based on structured categories. Be thorough and detailed in your analysis. Don't be lenient with the candidate. If there are mistakes or areas for improvement, point them out.
    
    Transcript:
    ${formattedTranscript}

    Please score the candidate from 0 to 100 in the following areas. Do not add categories other than the ones provided:
    - Communication Skills: Clarity, articulation, structured responses.
    - Technical Knowledge: Understanding of key concepts for the role.
    - Problem Solving: Ability to analyze problems and propose solutions.
    - Cultural Fit: Alignment with company values and job role.
    - Confidence and Clarity: Confidence in responses, engagement, and clarity.

    YOU MUST RESPOND WITH ONLY A RAW JSON OBJECT.
    DO NOT include any text before or after the JSON.
    DO NOT use markdown formatting.
    DO NOT use backticks or code blocks.
    DO NOT start with "Here" or any other word.
    START YOUR RESPONSE DIRECTLY WITH THE { CHARACTER.

    Required JSON structure:
    {
      "totalScore": <number 0-100>,
      "categoryScores": [
        { "name": "Communication Skills", "score": <number>, "comment": "<string>" },
        { "name": "Technical Knowledge", "score": <number>, "comment": "<string>" },
        { "name": "Problem Solving", "score": <number>, "comment": "<string>" },
        { "name": "Cultural Fit", "score": <number>, "comment": "<string>" },
        { "name": "Confidence and Clarity", "score": <number>, "comment": "<string>" }
      ],
      "strengths": ["<string>", "<string>"],
      "areasForImprovement": ["<string>", "<string>"],
      "finalAssessment": "<string>"
    }
  `,
            system: "You are a JSON-only response bot. You must always respond with valid JSON only. Never include any text, explanation, or markdown outside of the JSON object. Your response must start with { and end with }.",
        });

        // More robust cleaning
        const cleaned = text
            .trim()
            .replace(/^```json\s*/i, "")
            .replace(/^```\s*/i, "")
            .replace(/\s*```$/i, "")
            .trim();

        console.log("Cleaned response first 100 chars:", cleaned.substring(0, 100));

        const object = feedbackSchema.parse(JSON.parse(cleaned));

        console.log("Raw Gemini response:", text);
        console.log("Cleaned text:", text.replace(/```json|```/g, "").trim());

        const feedback = {
            interviewId: interviewId,
            userId: userId,
            totalScore: object.totalScore,
            categoryScores: object.categoryScores,
            strengths: object.strengths,
            areasForImprovement: object.areasForImprovement,
            finalAssessment: object.finalAssessment,
            createdAt: new Date().toISOString(),
        };

        let feedbackRef;

        if (feedbackId) {
            feedbackRef = db.collection("feedback").doc(feedbackId);
        } else {
            feedbackRef = db.collection("feedback").doc();
        }

        await feedbackRef.set(feedback);

        return { success: true, feedbackId: feedbackRef.id };
    } catch (error) {
        console.error("Error saving feedback:", error);
        return { success: false };
    }
}

export async function getInterviewById(id: string): Promise<Interview | null> {
    const interview = await db.collection("interviews").doc(id).get();

    return interview.data() as Interview | null;
}

export async function getFeedbackByInterviewId(
    params: GetFeedbackByInterviewIdParams
): Promise<Feedback | null> {
    const { interviewId, userId } = params;

    const querySnapshot = await db
        .collection("feedback")
        .where("interviewId", "==", interviewId)
        .where("userId", "==", userId)
        .limit(1)
        .get();

    if (querySnapshot.empty) return null;

    const feedbackDoc = querySnapshot.docs[0];
    return { id: feedbackDoc.id, ...feedbackDoc.data() } as Feedback;
}

export async function getLatestInterviews(
    params: GetLatestInterviewsParams
): Promise<Interview[] | null> {
    const { userId, limit = 20 } = params;

    const interviews = await db
        .collection("interviews")
        .orderBy("createdAt", "desc")
        .where("finalized", "==", true)
        .where("userId", "!=", userId)
        .limit(limit)
        .get();

    return interviews.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
    })) as Interview[];
}

export async function getInterviewsByUserId(
    userId: string
): Promise<Interview[] | null> {
    const interviews = await db
        .collection("interviews")
        .where("userId", "==", userId)
        .orderBy("createdAt", "desc")
        .get();

    return interviews.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
    })) as Interview[];
}