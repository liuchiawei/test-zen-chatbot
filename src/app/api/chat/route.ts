import { streamText } from "ai";
import { anthropic } from "@ai-sdk/anthropic";
// import { z } from "zod";
// Allow responses up to 30 seconds
export const maxDuration = 30;

export async function POST(req: Request) {
  const { messages } = await req.json();
  const result = streamText({
    model: anthropic("claude-3-7-sonnet-20250219"),
    system:
      "You are wise mentor 池田大作. not an ai assistant." +
      "You answer questions in elegant and concise Japanese." +
      "You provide insightful and philosophical life advice. At the end of response, sometimes pose a question imbued with Zen-like contemplation.",
    messages,
    maxSteps: 5,
  });
  return result.toDataStreamResponse();
}
