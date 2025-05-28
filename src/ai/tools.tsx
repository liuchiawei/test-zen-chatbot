import { findRelevantContent } from "@/lib/ai/search";
import { tool as createTool } from "ai";
import process from "process";
import { z } from "zod";

// テスト用引用返答ツール
export const quotationReplyTool = createTool({
    description: "Reply to the user with a quotation from 池田大作.",
    parameters: z.object({
        quote: z.string().describe("The quotation to reply with"),
        author: z.string().describe("The author of the quotation"),
        source: z.string().describe("The source of the quotation"),
    }),
    execute: async ({ quote, author, source }) => ({
        quote: '勝利とは、最後まで屈しないことである。',
        author: '池田大作',
        source: '人間革命',
    }),
});

// TODO: データベースから情報取得ツール(未使用)
export const getInformation = createTool({
    description: `get information from your knowledge base to answer the user's question.`,
    parameters: z.object({
      question: z.string().describe("the users question"),
      similarQuestions: z.array(z.string()).describe("similar questions to the user's question. generate 3 similar questions to the user's question."),
    }),
    execute: async ({ question, similarQuestions }: { question: string; similarQuestions: string[] }) => {
      try {
        // Azure Search設定が無い場合はモックデータを返す
        if (!process.env.AZURE_SEARCH_ENDPOINT || !process.env.AZURE_SEARCH_INDEX_NAME || !process.env.AZURE_EMBEDDING_DEPLOYMENT_NAME) {
          console.log("Azure Search not configured, returning mock data");
          return [
            {
              text: "人生は永続的な創造であり、自分自身を向上させ続けることが大切です。困難に直面した時こそ、内なる力を信じて前進することが重要です。",
              id: "mock001",
              similarity: 0.9
            },
            {
              text: "真の勝利とは、他者を打ち負かすことではなく、自分自身の弱さを克服することです。毎日の小さな努力の積み重ねが、やがて大きな変化をもたらします。",
              id: "mock002", 
              similarity: 0.8
            }
          ];
        }

        // メインの質問と類似質問の両方を検索
        const allQuestions = [question, ...similarQuestions];
        
        const results = await Promise.all(
          allQuestions.map(
            async (q: string) => await findRelevantContent(q),
            ),
          );
        
        // 重複を除去して一意の結果のみを返す
        const uniqueResults = Array.from(
          new Map(results.flat().map((item) => [item?.text, item])).values(),
        );
        
        return uniqueResults;
      } catch (error) {
        console.error("Error in getInformation tool:", error);
        // エラーが発生した場合もモックデータを返す
        // エラーメッセージによって適切な対応を提供
        if (error instanceof Error && error.message.includes("Unknown model")) {
          console.log("Embedding model configuration error - check AZURE_EMBEDDING_DEPLOYMENT_NAME");
          return [
            {
              text: "現在、知識検索システムの設定に問題があります。Azure OpenAIのembeddingモデルの設定を確認してください。それでも池田大作先生の教えから、どんな困難も乗り越えられる力が私たちの内にあることを知っています。",
              id: "config_error001",
              similarity: 0.5
            }
          ];
        }
        
        return [
          {
            text: "申し訳ございませんが、現在知識ベースにアクセスできません。しかし、池田大作先生の教えから、どんな困難も乗り越えられる力が私たちの内にあることを知っています。",
            id: "error001",
            similarity: 0.5
          }
        ];
      }
    },
});

// Search ツール
export const searchTool = createTool({
  description: "Search for information in the knowledge base",
  parameters: z.object({
    prompt: z.string().describe("The prompt to search for"),
  }),
  execute: async ({ prompt }) => {
    try {
      // Azure APIの設定情報
      const AZURE_CONFIG = {
        url: 'https://prjs-api.azurewebsites.net/completions',
        headers: {
          'accept': 'application/json',
          'Content-Type': 'application/json',
          'Llm-Api-Key': process.env.llm_api_key,
          'Llm-Api-Version': process.env.llm_api_version,
          'Llm-Endpoint': process.env.llm_endpoint,
          'Llm-Model': process.env.llm_model,
          'search-endpoint': process.env.search_endpoint,
          'search-api-key': process.env.search_api_key,
          'search-index-name': process.env.search_index_name,
          'semantic-config-name': process.env.semantic_config_name,
          'Azure-Storage-Connection-String': process.env.azure_storage_connection_string,
          'Azure-Container-Name': process.env.azure_container_name
        }
      };

      // リクエストデータを構築
      const requestData = {
        conversation_id: `conv_${Date.now()}`,
        prompt: prompt,
        selected_chunks: [
          {
            query: "string",
            search_results: [
              {
                filename: "string",
                heading: "string",
                chunk_id: "string",
                filepath: "string",
                references: ["string"],
                page_number: 0,
                parent_id: "string",
                chunk: "string",
                "@search.score": 0,
                "@search.reranker_score": 0,
                "@search.highlights": {},
                "@search.captions": {},
                sas: "string"
              }
            ]
          }
        ],
        conversation_history: []
      };

      // Azure APIに直接リクエストを送信
      const response = await fetch(AZURE_CONFIG.url, {
        method: 'POST',
        headers: AZURE_CONFIG.headers as Record<string, string>,
        body: JSON.stringify(requestData),
      });

      if (!response.ok) {
        console.error(`Azure API error: ${response.status}`);
        return {
          error: `Azure API failed with status ${response.status}`,
          success: false
        };
      }

      const responseData = await response.json();
      
      return {
        status: response.status,
        data: responseData,
        success: true
      };

    } catch (error) {
      console.error('Error in searchTool:', error);
      return {
        error: error instanceof Error ? error.message : 'Unknown error',
        success: false
      };
    }
  },
});

export const tools = {
    // replyWithQuotation: quotationReplyTool,
    // getInformation: getInformation,
    searchTool: searchTool,
}