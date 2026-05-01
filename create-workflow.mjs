const VAPI_API_KEY = "a613605d-e7b9-4ea7-9e8e-b248e0029a6a";
const YOUR_NEXT_URL = "https://prep-mate-ai-interview-platfrom.vercel.app/api/vapi/generate";

const assistant = {
    name: "Interview Generator",
    firstMessage: "Hello {{username}}! I am your AI interview assistant. I will ask you a few questions to create your personalized interview. Let us get started — what job role are you preparing for?",
    model: {
        provider: "openai",
        model: "gpt-4o",
        messages: [
            {
                role: "system",
                content: `You are a voice assistant helping create a personalized job interview.
Your task is to collect the following information from the user one question at a time:
1. Their target job role (e.g. Frontend Developer, Data Scientist)
2. Their experience level: must be exactly one of: junior, mid, or senior
3. The tech stack or technologies (e.g. React, Node.js) - ask them to list them separated by commas
4. The type of interview: must be exactly one of: technical, behavioural, or mixed
5. How many questions they want (a number between 5 and 20)

Ask each question naturally and conversationally.
Wait for a clear answer before moving to the next question.
Once you have ALL five answers, immediately call the generateInterview function.
Do not say goodbye or end the call yourself — the system will handle that.
This is a voice conversation - do not use any special characters like * or /.`,
            },
        ],
        tools: [
            {
                type: "function",
                function: {
                    name: "generateInterview",
                    description: "Call this when you have collected all five pieces of information: role, level, techstack, type, and amount.",
                    parameters: {
                        type: "object",
                        properties: {
                            role: {
                                type: "string",
                                description: "The job role the user wants to train for e.g. Frontend Developer",
                            },
                            level: {
                                type: "string",
                                description: "Experience level: junior, mid, or senior",
                                enum: ["junior", "mid", "senior"],
                            },
                            techstack: {
                                type: "string",
                                description: "Comma separated list of technologies e.g. React, Node.js",
                            },
                            type: {
                                type: "string",
                                description: "Type of interview: technical, behavioural, or mixed",
                                enum: ["technical", "behavioural", "mixed"],
                            },
                            amount: {
                                type: "number",
                                description: "Number of questions between 5 and 20",
                            },
                        },
                        required: ["role", "level", "techstack", "type", "amount"],
                    },
                },
                server: {
                    url: YOUR_NEXT_URL,
                },
            },
        ],
    },
    voice: {
        provider: "11labs",
        voiceId: "sarah",
    },
    endCallMessage: "Your interview has been created and will appear on your dashboard shortly. Good luck!",
    endCallPhrases: ["goodbye", "thank you goodbye", "your interview is ready"],
};

const response = await fetch("https://api.vapi.ai/assistant", {
    method: "POST",
    headers: {
        Authorization: `Bearer ${VAPI_API_KEY}`,
        "Content-Type": "application/json",
    },
    body: JSON.stringify(assistant),
});

const data = await response.json();

if (data.id) {
    console.log("✅ Assistant created successfully!");
    console.log("📋 Assistant ID:", data.id);
    console.log("\nAdd this to your .env.local:");
    console.log(`NEXT_PUBLIC_VAPI_ASSISTANT_ID=${data.id}`);
} else {
    console.error("❌ Failed:", JSON.stringify(data, null, 2));
}