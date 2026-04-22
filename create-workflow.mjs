const VAPI_API_KEY = "d8ef3a33-a7ac-4392-8479-fcdf54fa67be";
const YOUR_NEXT_URL = "https://prep-mate-ai-interview-platfrom.vercel.app/api/vapi/generate";

const workflow = {
    name: "Interview Generator",
    nodes: [
        {
            type: "conversation",
            name: "Gather Info",
            isStart: true,
            prompt: `You are a voice assistant helping create a personalized job interview.
Your task is to collect the following information from the user one question at a time:
1. Their target job role (e.g. Frontend Developer, Data Scientist)
2. Their experience level (junior, mid, or senior)
3. The tech stack or technologies relevant to the role (e.g. React, Node.js)
4. The type of interview they want: technical, behavioural, or mixed
5. How many questions they want (between 5 and 20)
Ask each question naturally and conversationally.
Wait for a clear answer before moving to the next.
This is a voice conversation - do not use any special characters like * or /.`,
            model: {
                provider: "openai",
                model: "gpt-4o",
            },
            variableExtractionPlan: {
                schema: {
                    type: "object",
                    properties: {
                        role: {
                            type: "string",
                            description: "The job role the user wants to train for.",
                        },
                        level: {
                            type: "string",
                            description: "The job experience level.",
                            enum: ["junior", "mid", "senior"],
                        },
                        techstack: {
                            type: "string",
                            description: "A list of technologies to cover.",
                        },
                        type: {
                            type: "string",
                            description: "The type of interview.",
                            enum: ["technical", "behavioural", "mixed"],
                        },
                        amount: {
                            type: "number",
                            description: "How many questions to generate. Between 5 and 20.",
                        },
                    },
                },
            },
        },
        {
            type: "tool",
            name: "Send to API",
            tool: {
                type: "apiRequest",
                function: {
                    name: "generateInterview",
                    description: "Send collected interview data to generate questions",
                    parameters: { type: "object", properties: {}, required: [] },
                },
                url: YOUR_NEXT_URL,
                method: "POST",
                body: {
                    type: "object",
                    properties: {
                        role: { type: "string", value: "{{role}}", description: "Job role" },
                        level: { type: "string", value: "{{level}}", description: "Experience level" },
                        techstack: { type: "string", value: "{{techstack}}", description: "Tech stack" },
                        type: { type: "string", value: "{{type}}", description: "Interview type" },
                        amount: { type: "string", value: "{{amount}}", description: "Number of questions" },
                        userid: { type: "string", value: "{{userid}}", description: "User ID" },
                    },
                },
                messages: [
                    { type: "request-start", content: "Perfect! I have everything I need. Generating your interview now..." },
                    { type: "request-complete", content: "Your interview has been created and will appear on your dashboard shortly. Good luck!" },
                    { type: "request-failed", content: "I am sorry, something went wrong. Please try again." },
                ],
            },
        },
        {
            type: "hangup",
            name: "End Call",
        },
    ],
    edges: [
        {
            from: "Gather Info",
            to: "Send to API",
            condition: {
                type: "ai",
                prompt: "User has provided all required information: role, level, techstack, type, and amount of questions.",
            },
        },
        {
            from: "Send to API",
            to: "End Call",
        },
    ],
};

const response = await fetch("https://api.vapi.ai/workflow", {
    method: "POST",
    headers: {
        Authorization: `Bearer ${VAPI_API_KEY}`,
        "Content-Type": "application/json",
    },
    body: JSON.stringify(workflow),
});

const data = await response.json();

if (data.id) {
    console.log("✅ Workflow created successfully!");
    console.log("📋 Workflow ID:", data.id);
    console.log("\nAdd this to your .env.local:");
    console.log(`NEXT_PUBLIC_VAPI_WORKFLOW_ID=${data.id}`);
} else {
    console.error("❌ Failed:", JSON.stringify(data, null, 2));
}