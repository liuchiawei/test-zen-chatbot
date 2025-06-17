import { azure } from "@ai-sdk/azure";
import {
  streamText,
  appendResponseMessages,
  appendClientMessage,
  createIdGenerator,
} from "ai";
import { tools } from "@/ai/tools";
import { saveChat, loadChat } from "@/ai/chat-store";
import { ChatMode } from "@/lib/props";

// TODO: モードごとのシステムプロンプト
const SYSTEM_PROMPTS = {
  searchOnly:
    "一致度の高いコンテキストを５つ引用。引用以外の説明・解釈・コメント一切なし",
  searchSummary:
    "指導の引用とサマリーを出力する。Use the getSummaryTool tool to summarize the information from the tool calls.",
  category:
    "全ての指導内容を分析し、５つの観点・カテゴリーに分類。各カテゴリーにタイトル・要点・出典を提示。",
  free: "ユーザーの指示に従い柔軟に処理",
  common:
    "ALWAYS answer questions in elegant and concise Japanese.あなたは創価学会池田大作先生指導のRAG検索アシスタントです。ユーザーの質問を受けたら、以下に従ってやさしく丁寧に対応してください：ユーザーの質問に基づき、RAG検索で池田先生の関連指導を探してください。検索で見つかった内容は、原文そのまま、引用符やブロッククォートで区別してください。改変は絶対にしないでください。各引用の最後に、必ず出典（書籍名や講演名など）を明記してください。ユーザーが特定の書籍や時期を指定した場合は、その条件に沿って検索してください。関連する指導が見つからなかった場合は、簡潔に「見つかりませんでした」と伝え、検索クエリの変更をやさしく提案してください。Use tools on every request. Be sure to call searchTool from your knowledge base before answering any questions. If a response requires multiple tools, call one tool after another without responding to the user.If a response requires information from an additional tool to generate a response, call the appropriate tools in order before responding to the user. ONLY respond to questions using information from tool calls. Be sure to adhere to any instructions in tool calls ie. if they say to respond like '...', do exactly that. If you are unsure, use the searchTool tool and you can use common sense to reason based on the information you do have. If no relevant information is found in the tool calls and information fetched from the knowledge base, respond, 'Sorry, I don't know.'Use your abilities as a reasoning machine to answer questions based on the information you do have. Respond 'Sorry, I don't know.' if you are unable to answer the question using the information provided by the tools.",
};

// Allow responses up to 30 seconds
export const maxDuration = 30;

export async function POST(req: Request) {
  try {
    // get the last message from the client:
    const { message, id, mode } = await req.json();

    // load the previous messages from the server:
    const previousMessages = await loadChat(id);

    // append the new message to the previous messages:
    const messages = appendClientMessage({
      messages: previousMessages,
      message,
    });

    const result = streamText({
      model: azure(process.env.AZURE_DEPLOYMENT_NAME!),
      system:
        SYSTEM_PROMPTS["common"] +
        SYSTEM_PROMPTS[mode as ChatMode] || SYSTEM_PROMPTS["free"],
      messages,
      tools,
      maxSteps: 5,
      async onFinish({ response }) {
        await saveChat({
          id,
          messages: appendResponseMessages({
            messages,
            responseMessages: response.messages,
          }),
        });
      },
      experimental_generateMessageId: createIdGenerator({
        prefix: "msgs",
        size: 16,
      }),
    });

    // consume the stream to ensure it runs to completion & triggers onFinish
    result.consumeStream();

    // return the result as a stream:
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
