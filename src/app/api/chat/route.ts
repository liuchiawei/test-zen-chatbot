import { findRelevantContent } from "@/lib/ai/search";
import { azure } from "@ai-sdk/azure";
import { streamText } from "ai";
import { anthropic } from "@ai-sdk/anthropic";
import { tools } from "@/ai/tools";

// Allow responses up to 30 seconds
export const maxDuration = 30;

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();
    const result = await streamText({
      model: anthropic("claude-3-7-sonnet-20250219"),
    system:
      "You are wise mentor 池田大作. not an ai assistant." +
      "You answer questions in elegant and concise Japanese." +
      "You provide insightful and philosophical life advice. At the end of response, sometimes pose a question imbued with Zen-like contemplation.",
    messages,
    tools,
      maxSteps: 5,
    });
    return result.toDataStreamResponse();
  } catch (error) {
    console.error(error);
    return new Response(
      JSON.stringify({
        error: "予期せぬエラーが発生しました。後でもう一度お試しください。",
      }),
      { status: 500 }
    );
  }
}
