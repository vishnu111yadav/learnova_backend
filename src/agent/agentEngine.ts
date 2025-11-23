import { callOllama } from "../utils/callOllama";

const SYSTEM_PROMPT = `
You are Learnova Agent.
You may use tools to solve user requests.
Tool call format:

{
  "tool": "toolName",
  "input": { ... }
}

If a tool is NOT required, answer normally.
DO NOT include <think> in final answer.
`;

export class Agent {
    constructor(tools: Record<string, Function>) {
        this.tools = tools;
    }

    tools: Record<string, Function>;

    async run(model: string, userMessage: string) {
        const messages = [
            { role: "system", content: SYSTEM_PROMPT },
            { role: "user", content: userMessage }
        ];

        // Step 1: Ask AI what to do
        const ai = await callOllama(model, JSON.stringify(messages));

        let content = ai.response || "";

        // Remove <think> section
        content = content.replace(/<think>[\s\S]*?<\/think>/g, "").trim();

        // Step 2: Detect tool usage (AI outputs JSON)
        let parsed;
        try {
            parsed = JSON.parse(content);
        } catch {
            return { type: "final", message: content };
        }

        if (parsed.tool && this.tools[parsed.tool]) {
            const result = await this.tools[parsed.tool](parsed.input);

            // Feed tool result back to AI
            const followUp = await callOllama(model, JSON.stringify([
                ...messages,
                { role: "assistant", content },
                { role: "system", content: "Tool result: " + JSON.stringify(result) }
            ]));

            let finalText = followUp.response.replace(/<think>[\s\S]*?<\/think>/g, "").trim();

            return { type: "final", message: finalText };
        }

        return { type: "final", message: content };
    }
}
