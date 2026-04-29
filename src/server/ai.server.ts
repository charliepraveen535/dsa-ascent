import { z } from "zod";

const OPENROUTER_URL = "https://openrouter.ai/api/v1/chat/completions";
const MODEL = "google/gemini-2.0-flash-exp:free"; // free-tier friendly default; users can switch via env

type ChatMessage = { role: "system" | "user" | "assistant"; content: string };

export async function callOpenRouter(messages: ChatMessage[]): Promise<string> {
  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey) {
    throw new Error("Server misconfigured: missing OPENROUTER_API_KEY");
  }

  const res = await fetch(OPENROUTER_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
      "HTTP-Referer": "https://lovable.dev",
      "X-Title": "DSA Comeback",
    },
    body: JSON.stringify({
      model: process.env.OPENROUTER_MODEL || MODEL,
      messages,
      temperature: 0.7,
    }),
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    console.error("OpenRouter error:", res.status, text);
    throw new Error(`OpenRouter error (${res.status})`);
  }

  const data = (await res.json()) as {
    choices?: { message?: { content?: string } }[];
  };
  const content = data.choices?.[0]?.message?.content;
  if (!content) throw new Error("Empty response from model");
  return content;
}

export const generateQuestionSchema = z.object({
  topic: z.string().min(1).max(100),
  difficulty: z.enum(["Easy", "Medium", "Hard"]),
});

export const askDoubtSchema = z.object({
  messages: z
    .array(
      z.object({
        role: z.enum(["user", "assistant"]),
        content: z.string().min(1).max(4000),
      }),
    )
    .min(1)
    .max(20),
});

export type GenerateQuestionInput = z.infer<typeof generateQuestionSchema>;
export type AskDoubtInput = z.infer<typeof askDoubtSchema>;
