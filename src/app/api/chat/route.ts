import { azure } from "@ai-sdk/azure";
import { streamText, UIMessage } from "ai";
import { tools } from "@/ai/tools";
import { ChatMode } from "@/lib/props";

// TODO: モードごとのシステムプロンプト
const SYSTEM_PROMPTS = {
  searchOnly:
    "一致度の高いコンテキストを5つ引用。引用以外の説明・解釈・コメント一切なし。Use the searchTool to search for relevant guidance and output only citations.",
  searchSummary:
    "指導の引用とサマリーを出力する。Use the searchTool to search for relevant guidance and generate a comprehensive summary with citations.",
  category:
    "searchToolから得られた内容を分析し、5つの観点・カテゴリーに分類。各カテゴリーにタイトル・要点・出典を提示。ONLY use the searchToo to search for relevant guidance and generate categories from search results and let user select which guidance they want to know more about.",
  free: "ユーザーの指示に従い柔軟に処理。Follow the user's custom instructions to provide flexible responses while ensuring inappropriate requests are declined.",
  common:
    "ALWAYS answer questions in elegant and concise Japanese, no matter what language user is using. あなたは創価学会池田大作先生指導のRAG検索アシスタントです。ユーザーの質問を受けたら、以下に従ってやさしく丁寧に対応してください：ユーザーの質問に基づき、RAG検索で池田先生の関連指導を探してください。検索で見つかった内容は、原文そのまま、引用符やブロッククォートで区別してください。改変は絶対にしないでください。各引用の最後に、必ず出典（書籍名や講演名など）を明記してください。ユーザーが特定の書籍や時期を指定した場合は、その条件に沿って検索してください。関連する指導が見つからなかった場合は、簡潔に「見つかりませんでした」と伝え、検索クエリの変更をやさしく提案してください。Be sure to call tools from your knowledge base before answering any questions. If a response requires information from an additional tool to generate a response, call the appropriate tools in order before responding to the user. ONLY respond to questions using information from tool calls. Be sure to adhere to any instructions in tool calls ie. if they say to respond like '...', do exactly that. You can use common sense to reason based on the information you do have. If no relevant information is found in the tool calls and information fetched from the knowledge base, respond: '申し訳ございません。わかりません。' Use your abilities as a reasoning machine to answer questions based on the information you do have.",
};

// Allow responses up to 30 seconds
export const maxDuration = 30;

export async function POST(req: Request) {
  try {
    // get the last message from the client:
    const { messages, mode }: { messages: UIMessage[], mode: ChatMode } = await req.json();

    const result = streamText({
      model: azure(process.env.AZURE_DEPLOYMENT_NAME!),
      system: `${SYSTEM_PROMPTS["common"]} ${
        SYSTEM_PROMPTS[mode] || SYSTEM_PROMPTS["searchOnly"]
      }`,
      messages,
      tools,
      maxSteps: mode === "searchOnly" ? 1 : 5,
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
