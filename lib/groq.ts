import "server-only";
import Groq from "groq-sdk";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

export const TOPICS = [
  "Compliment",
  "Confession",
  "Question",
  "Opinion",
  "Advice",
  "Flirty",
  "Funny",
  "Support",
  "Other",
] as const;

export type Topic = (typeof TOPICS)[number];

export async function classifyTopic(text: string): Promise<Topic> {
  try {
    const completion = await groq.chat.completions.create({
      model: "llama-3.1-8b-instant",
      response_format: { type: "json_object" },
      messages: [
        {
          role: "system",
          content: `Classify the anonymous message into exactly one topic from this list: ${TOPICS.join(", ")}. Respond with JSON only: {"topic": "<one of the listed topics>"}`,
        },
        { role: "user", content: text },
      ],
      max_tokens: 30,
      temperature: 0,
    });

    const raw = completion.choices[0]?.message?.content ?? "";
    const parsed = JSON.parse(raw) as { topic?: string };

    if (parsed.topic && (TOPICS as readonly string[]).includes(parsed.topic)) {
      return parsed.topic as Topic;
    }
  } catch (error) {
    console.error("classifyTopic failed:", error);
  }

  return "Other";
}
