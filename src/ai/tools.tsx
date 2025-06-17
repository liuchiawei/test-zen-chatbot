import { tool as createTool } from "ai";
import { generateText } from "ai";
import { azure } from "@ai-sdk/azure";
import process from "process";
import { z } from "zod";


// Search ツール
const searchTool = createTool({
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

      const summary = await generateText({
        model: azure(process.env.AZURE_DEPLOYMENT_NAME!),
        system: `あなたは優秀な要約スペシャリストです。
        提供されたコンテンツを的確で読みやすい一言要約に変換してください。
        以下の指針に従ってください：
        - 重要なポイントを漏らさない
        - 簡潔で理解しやすい日本語で回答
        - 元のコンテンツの趣旨を保持
        - 不要な詳細は省略
        - 読み手にとって価値のある情報を優先`,
        prompt: `以下のコンテンツを要約してください：
        ${responseData.answer}
        要約を生成してください。`,
        temperature: 0.3, // 一貫性を保つため低めに設定
        maxTokens: 100,   // 要約なので適度な長さに制限
      });
      
      return {
        status: response.status,
        data: responseData,
        summary: summary.text,
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

// 要約生成ツール (未使用)
const getSummaryTool = createTool({
  description: "Get a summary of the data from searchTool using AI",
  parameters: z.object({
    data: z.string().describe("The data to get a summary of"),
    prompt: z.string().optional().describe("Optional specific instructions for the summary"),
  }),
  execute: async ({ data, prompt }) => {
    try {
      // Azure AIモデルを初期化
      const model = azure(process.env.AZURE_DEPLOYMENT_NAME!);
      
      // dataをパースして構造化（もしJSONの場合）
      let parsedData;
      try {
        parsedData = typeof data === 'string' ? JSON.parse(data) : data;
      } catch {
        parsedData = data; // パース失敗の場合はそのまま使用
      }
      
      // コンテンツを抽出・整理
      let contentToSummarize = '';
      if (parsedData && typeof parsedData === 'object' && parsedData.data) {
        // Azure APIからの応答構造に合わせて処理
        if (parsedData.data.answer) {
          contentToSummarize = parsedData.data.answer;
        } else if (parsedData.data.content) {
          contentToSummarize = parsedData.data.content;
        } else {
          contentToSummarize = JSON.stringify(parsedData.data, null, 2);
        }
      } else {
        contentToSummarize = typeof parsedData === 'string' ? parsedData : JSON.stringify(parsedData, null, 2);
      }

      // AIに要約生成を依頼
      const result = await generateText({
        model,
        system: `あなたは優秀な要約スペシャリストです。
        提供されたコンテンツを的確で読みやすい要約に変換してください。
        以下の指針に従ってください：
        - 重要なポイントを漏らさない
        - 簡潔で理解しやすい日本語で回答
        - 元のコンテンツの趣旨を保持
        - 不要な詳細は省略
        - 読み手にとって価値のある情報を優先`,
        prompt: `以下のコンテンツを要約してください：

        ${contentToSummarize}
        ${prompt ? `特別な要約指示: ${prompt}` : ''}

        要約を生成してください。`,
        temperature: 0.3, // 一貫性を保つため低めに設定
        maxTokens: 500,   // 要約なので適度な長さに制限
      });

      return {
        success: true,
        summary: result.text,
        originalDataLength: contentToSummarize.length,
        timestamp: new Date().toISOString()
      };

    } catch (error) {
      console.error('Error in getSummaryTool:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
        summary: "要約の生成中にエラーが発生しました。"
      };
    }
  }
});

export const tools = {
    searchTool: searchTool,
    // getSummaryTool: getSummaryTool,
}