export async function callOllama(model: string, prompt: string, options: any = {}) {
    const body: any = {
        model,
        prompt,
        stream: false,
    };

    // Only include "options" if not empty
    if (Object.keys(options).length > 0) {
        body.options = options;
    }

    const res = await fetch(`${process.env.OLLAMA_BASE_URL}/api/generate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
    });

    if (!res.ok) {
        const errText = await res.text();
        throw new Error(`Ollama error: ${res.status} → ${errText}`);
    }

    return res.json();
}
