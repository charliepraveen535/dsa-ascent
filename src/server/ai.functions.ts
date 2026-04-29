import { createServerFn } from "@tanstack/react-start";
import {
  askDoubtSchema,
  callOpenRouter,
  generateQuestionSchema,
} from "./ai.server";

export const generateQuestion = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => generateQuestionSchema.parse(input))
  .handler(async ({ data }) => {
    const system = `You are a senior coding interviewer creating ORIGINAL DSA practice problems for a student preparing for tech interviews.

Output STRICT MARKDOWN with this exact structure:

## <Catchy problem title>

**Difficulty:** ${data.difficulty}  
**Topic:** ${data.topic}

### Problem
<2-4 sentences describing the problem clearly>

### Examples
\`\`\`
Input: ...
Output: ...
Explanation: ...
\`\`\`

\`\`\`
Input: ...
Output: ...
\`\`\`

### Constraints
- ...
- ...

### Hints
1. <subtle hint>
2. <stronger hint>

### Follow-up
<one harder variation>

Do NOT include the solution. Keep it concise and interview-realistic.`;

    try {
      const content = await callOpenRouter([
        { role: "system", content: system },
        {
          role: "user",
          content: `Generate a ${data.difficulty} ${data.topic} problem.`,
        },
      ]);
      return { ok: true as const, content };
    } catch (err) {
      console.error("generateQuestion failed:", err);
      return {
        ok: false as const,
        error:
          "Couldn't generate a question right now. Check your OpenRouter key and try again.",
      };
    }
  });

export const askDoubt = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => askDoubtSchema.parse(input))
  .handler(async ({ data }) => {
    const system = `You are a friendly, patient DSA tutor. Help the student understand Data Structures & Algorithms concepts.

Rules:
- Explain in simple language. Use analogies when useful.
- Always include a small code example (Python or JS) when relevant, in fenced code blocks.
- Mention time/space complexity when discussing algorithms.
- If the question is unrelated to DSA / programming / interview prep, gently steer back.
- Be concise — prefer clarity over length. Use markdown headings/lists.`;

    try {
      const content = await callOpenRouter([
        { role: "system", content: system },
        ...data.messages,
      ]);
      return { ok: true as const, content };
    } catch (err) {
      console.error("askDoubt failed:", err);
      return {
        ok: false as const,
        error:
          "Couldn't reach the tutor right now. Check your OpenRouter key and try again.",
      };
    }
  });
