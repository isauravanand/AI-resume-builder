const axios = require("axios");

// 🔑 CHANGE 1: Updated the model name to gemini-2.5-flash
const GEMINI_URL =
    "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent";

async function generateWithGemini(prompt, retries = 2) {
    for (let attempt = 1; attempt <= retries; attempt++) {
        try {
            const payload = {
                contents: [{ role: "user", parts: [{ text: prompt }] }],
            };

            const response = await axios.post(
                `${GEMINI_URL}?key=${process.env.GOOGLE_GEMINI_API_KEY}`,
                payload,
                {
                    headers: { "Content-Type": "application/json" },
                    timeout: 20000
                }
            );

            const text =
                response?.data?.candidates?.[0]?.content?.parts?.[0]?.text;

            if (!text) throw new Error("Empty response from Gemini");
            return text;

        } catch (err) {
            if (attempt === retries) {
                console.error(`Gemini failed after ${retries} attempts.`);
                // Log the actual status code if it's an Axios error
                if (err.response) {
                    console.error(`Status: ${err.response.status}, Data: ${JSON.stringify(err.response.data)}`);
                }
                throw err;
            }

            // 🔑 CHANGE 2: Improved Exponential Backoff with Jitter
            // This is crucial for handling 429 errors gracefully.
            const baseDelay = 1000; // Start at 1 second
            const maxDelay = 16000; // Maximum delay of 16 seconds
            const exponentialDelay = Math.min(
                maxDelay,
                baseDelay * Math.pow(2, attempt - 1)
            );
            const jitter = Math.random() * 1000; // Add up to 1 second of random delay

            const delay = exponentialDelay + jitter;
            console.warn(`Attempt ${attempt} failed. Retrying in ${Math.round(delay / 1000)}s...`);
            await new Promise((r) => setTimeout(r, delay));
        }
    }
}

/**
 * Safely extracts and parses JSON block from a string response.
 */
function safeExtractJSON(text) {
    // Looks for the first block of text that starts with { and ends with }
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error("Gemini did not return parsable JSON");

    const clean = jsonMatch[0]
        .replace(/[\u0000-\u001F]+/g, "")
        .trim();

    return JSON.parse(clean);
}

module.exports = { generateWithGemini, safeExtractJSON };