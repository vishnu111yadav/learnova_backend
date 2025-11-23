import dotenv from "dotenv";
dotenv.config();

export async function callOllama(model: string, prompt: string, options: any = {}) {
    const body: any = {
        model,
        prompt,
        stream: false,
    };

    // Only add correct 'options' block
    if (Object.keys(options).length > 0) {
        body.options = options;
    }

    console.log("📤 Sending to Ollama:", body);

    const res = await fetch(`${process.env.OLLAMA_BASE_URL}/api/generate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
    });

    if (!res.ok) {
        const text = await res.text();
        console.error("❌ Ollama returned:", text);
        throw new Error(`Ollama error: ${res.status} — ${text}`);
    }

    return res.json();
}
