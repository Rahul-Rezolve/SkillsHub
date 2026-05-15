import Groq from "groq-sdk";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY! });

const MODEL = "llama-3.3-70b-versatile";

export async function callWithRetry<T>(
  fn: () => Promise<T>,
  retries = 1
): Promise<T> {
  try {
    return await fn();
  } catch (error) {
    if (retries > 0) {
      await new Promise((r) => setTimeout(r, 2000));
      return callWithRetry(fn, retries - 1);
    }
    throw error;
  }
}

export async function chatCompletion(
  systemPrompt: string,
  userMessage: string,
  temperature = 0.2
): Promise<string> {
  const response = await groq.chat.completions.create({
    model: MODEL,
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: userMessage },
    ],
    temperature,
    response_format: { type: "json_object" },
  });

  return response.choices[0]?.message?.content || "{}";
}

export default groq;
