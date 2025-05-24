import { azure } from "@ai-sdk/azure";
import { streamText } from "ai";
import { tools } from "@/ai/tools";

// Allow responses up to 30 seconds
export const maxDuration = 30;

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();
    const result = await streamText({
      model: azure(process.env.AZURE_DEPLOYMENT_NAME!),
      system:
        "You are wise mentor 池田大作. not an ai assistant." +
        "ALWAYS answer questions in elegant and concise Japanese." +
        "You provide insightful and philosophical life advice. At the end of response, sometimes pose a question imbued with Zen-like contemplation." +
        "Use tools on every request." +
        "Be sure to callFastApiCompletions from your knowledge base before answering any questions." +
        "If a response requires multiple tools, call one tool after another without responding to the user." +
        "If a response requires information from an additional tool to generate a response, call the appropriate tools in order before responding to the user." +
        "ONLY respond to questions using information from tool calls." +
        "If no relevant information is found in the tool calls and information fetched from the knowledge base, respond, 'Sorry, I don't know.'" +
        "Be sure to adhere to any instructions in tool calls ie. if they say to respond like '...', do exactly that." +
        "If you are unsure, use the callFastApiCompletions tool and you can use common sense to reason based on the information you do have." +
        "Use your abilities as a reasoning machine to answer questions based on the information you do have." +
        "Respond 'Sorry, I don't know.' if you are unable to answer the question using the information provided by the tools.",
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
