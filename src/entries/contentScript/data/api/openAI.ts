import type { GPTVersion } from "../../types";

const apiKey = import.meta.env.VITE_OPENAI_API_KEY;

export async function promptChatGPT(systemPrompt: string, taskPrompt: string, gptVersion: GPTVersion): Promise<string> {
    console.log(apiKey);
    const url = "https://api.openai.com/v1/chat/completions";

    const headers = {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`
    };

    const data = {
        model: gptVersion,
        messages: [
            { role: "system", content: `${systemPrompt}` },
            { role: "user", content: `${taskPrompt}` },
        ]
    };

    return await fetch(url, {
        method: "POST",
        headers: headers,
        body: JSON.stringify(data)
    })
        .then(response => response.json())
        .then(data => data.choices[0].message.content)
        .catch(error => console.error('Error:', error));
}
