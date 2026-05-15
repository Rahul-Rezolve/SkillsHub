import { GoogleGenerativeAI, SchemaType } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export const geminiPro = genAI.getGenerativeModel({
  model: "gemini-2.5-pro-preview-05-06",
});

export const geminiFlash = genAI.getGenerativeModel({
  model: "gemini-2.5-flash-preview-05-20",
});

export async function callWithRetry<T>(
  fn: () => Promise<T>,
  retries = 1
): Promise<T> {
  try {
    return await fn();
  } catch (error) {
    if (retries > 0) {
      await new Promise((r) => setTimeout(r, 1000));
      return callWithRetry(fn, retries - 1);
    }
    throw error;
  }
}

export { SchemaType };
export default genAI;
