import { tool as createTool } from "ai";
import process from "process";
import { z } from "zod";

// Search ツール
const searchTool = createTool({
  description: "Search for information in the knowledge base",
  parameters: z.object({
    prompt: z.string().describe("The prompt to search for"),
    topK: z.number().describe("The number of top results to return, default is 1, max is 5"),
    range: z.string().describe("The range of the search, default is '全集'"),
  }),
  execute: async ({ prompt, topK, range }) => {
    try {
      // Azure APIの設定情報
      const AZURE_CONFIG = {
        url: "https://prjs-api.azurewebsites.net/search",
        headers: {
          accept: "application/json",
          "Content-Type": "application/json",
          "Llm-Api-Key": process.env.llm_api_key,
          "Llm-Api-Version": process.env.llm_api_version,
          "Llm-Endpoint": process.env.llm_endpoint,
          "Llm-Model": process.env.llm_model,
          "search-endpoint": process.env.search_endpoint,
          "search-api-key": process.env.search_api_key,
          "search-index-name": process.env.search_index_name,
          "semantic-config-name": process.env.semantic_config_name,
          "Azure-Storage-Connection-String":
            process.env.azure_storage_connection_string,
          "Azure-Container-Name": process.env.azure_container_name,
        },
      };
      // Necessity APIに直接リクエストを送信
      // Necessity API: ユーザーの要求が検索を必要とするかどうかを判断
      const necessityRequestData = {
        prompt: prompt,
        conversation_id: `conv_${Date.now()}`,
        conversation_history: [],
      };
      const necessityResponse = await fetch("https://prjs-api.azurewebsites.net/necessity", {
        method: "POST",
        headers: {
          accept: "application/json",
          "Content-Type": "application/json",
          "Llm-Api-Key": AZURE_CONFIG.headers["Llm-Api-Key"] as string,
          "Llm-Api-Version": AZURE_CONFIG.headers["Llm-Api-Version"] as string,
          "Llm-Endpoint": AZURE_CONFIG.headers["Llm-Endpoint"] as string,
          "Llm-Model": AZURE_CONFIG.headers["Llm-Model"] as string,
        },
        body: JSON.stringify(necessityRequestData),
      });
      if (!necessityResponse.ok) {
        console.error(`Necessity API error: ${necessityResponse.status}`);
        return {
          error: `Necessity API failed with status ${necessityResponse.status}`,
          success: false,
        };
      }
      const necessityResponseData = await necessityResponse.json();

      // リクエストデータを構築
      const requestData = {
        conversation_id: `conv_${Date.now()}`,
        prompt: prompt,
        filter: ["全集"],
        top: topK || 1,
      };

      // Azure Search APIに直接リクエストを送信
      // Search API: ユーザーの要求に合致する情報を検索
      const response = await fetch(AZURE_CONFIG.url, {
        method: "POST",
        headers: AZURE_CONFIG.headers as Record<string, string>,
        body: JSON.stringify(requestData),
      });

      if (!response.ok) {
        console.error(`Search API error: ${response.status}`);
        return {
          error: `Search API failed with status ${response.status}`,
          success: false,
        };
      }

      const responseData = await response.json();

      // Azure Completion Stream APIに直接リクエストを送信
      // Completion Stream API: 検索結果を元に最大5つの引用を出力
      const completionStreamRequestData = {
        conversation_id: `conv_${Date.now()}`,
        prompt: "優しく説明して",
        "selected_chunks": responseData.all_search_results.map((searchResult: any) => ({
          "query": searchResult.query,
          "search_results": searchResult.search_results.map((result: any) => ({
            "filename": result.filename,
            "heading": "string",
            "chunk_id": result.chunk_id,
            "filepath": "string",
            "references": [
              "string"
            ],
            "page_number": result.page_number,
            "parent_id": "string",
            "chunk": result.chunk,
            "@search.score": 0,
            "@search.reranker_score": 0,
            "@search.highlights": {},
            "@search.captions": {},
            "sas": "string"
          }))
        })),
        "conversation_history": []
      };

      const completionStreamResponse = await fetch("https://prjs-api.azurewebsites.net/completions/stream", {
        method: "POST",
        headers: {
          accept: "text/plain",
          "Content-Type": "application/json",
          "Llm-Api-Key": AZURE_CONFIG.headers["Llm-Api-Key"] as string,
          "Llm-Api-Version": AZURE_CONFIG.headers["Llm-Api-Version"] as string,
          "Llm-Endpoint": AZURE_CONFIG.headers["Llm-Endpoint"] as string,
          "Llm-Model": AZURE_CONFIG.headers["Llm-Model"] as string,
        },
        body: JSON.stringify(completionStreamRequestData),
      });

      if (!completionStreamResponse.ok) {
        console.error(`Completion-Stream API error: ${completionStreamResponse.status}`);
        return {
          error: `Completion-Stream API failed with status ${completionStreamResponse.status}`,
          success: false,
        };
      }

      // ストリーム応答をテキストとして取得
      const completionStreamResponseText = await completionStreamResponse.text();
      
      // SSE 形式の応答を解析
      let completionStreamResponseData;
      try {
        // "data: " プレフィックスを削除して JSON 部分を抽出
        const lines = completionStreamResponseText.split('\n');
        const dataLines = lines.filter(line => line.startsWith('data: ') && !line.includes('[DONE]'));
        if (dataLines.length > 0) {
          const lastDataLine = dataLines[dataLines.length - 1];
          const jsonPart = lastDataLine.substring(6); // "data: " を削除
          completionStreamResponseData = JSON.parse(jsonPart);
        } else {
          // SSE 形式でない場合は、直接 JSON として解析を試行
          completionStreamResponseData = JSON.parse(completionStreamResponseText);
        }
      } catch (parseError) {
        console.error("Failed to parse response:", parseError);
        // パース失敗時は生テキストを返す
        completionStreamResponseData = { text: completionStreamResponseText };
      }
      if (necessityResponseData.is_necessary) {
      return {
          responseData: responseData,
          completionStreamResponseData: completionStreamResponseData,
        };
      } else {
        return {
          reason: necessityResponseData.reason,
        };
      }
    } catch (error) {
      console.error("Error in searchTool:", error);
      return {
        error: error instanceof Error ? error.message : "Unknown error",
        success: false,
      };
    }
  },
});

// Category Tool
const categoryTool = createTool({
  description: "Search for information in the knowledge base, and return the category of the information",
  parameters: z.object({
    prompt: z.string().describe("The prompt to search for"),
  }),
  execute: async ({ prompt }) => {
    try {
      // Azure APIの設定情報
      const AZURE_CONFIG = {
        url: "https://prjs-api.azurewebsites.net/search",
        headers: {
          accept: "application/json",
          "Content-Type": "application/json",
          "Llm-Api-Key": process.env.llm_api_key,
          "Llm-Api-Version": process.env.llm_api_version,
          "Llm-Endpoint": process.env.llm_endpoint,
          "Llm-Model": process.env.llm_model,
          "search-endpoint": process.env.search_endpoint,
          "search-api-key": process.env.search_api_key,
          "search-index-name": process.env.search_index_name,
          "semantic-config-name": process.env.semantic_config_name,
          "Azure-Storage-Connection-String":
            process.env.azure_storage_connection_string,
          "Azure-Container-Name": process.env.azure_container_name,
        },
      };
      // Necessity APIに直接リクエストを送信
      // Necessity API: ユーザーの要求が検索を必要とするかどうかを判断
      const necessityRequestData = {
        prompt: prompt,
        conversation_id: `conv_${Date.now()}`,
        conversation_history: [],
      };
      const necessityResponse = await fetch("https://prjs-api.azurewebsites.net/necessity", {
        method: "POST",
        headers: {
          accept: "application/json",
          "Content-Type": "application/json",
          "Llm-Api-Key": AZURE_CONFIG.headers["Llm-Api-Key"] as string,
          "Llm-Api-Version": AZURE_CONFIG.headers["Llm-Api-Version"] as string,
          "Llm-Endpoint": AZURE_CONFIG.headers["Llm-Endpoint"] as string,
          "Llm-Model": AZURE_CONFIG.headers["Llm-Model"] as string,
        },
        body: JSON.stringify(necessityRequestData),
      });
      if (!necessityResponse.ok) {
        console.error(`Necessity API error: ${necessityResponse.status}`);
        return {
          error: `Necessity API failed with status ${necessityResponse.status}`,
          success: false,
        };
      }
      const necessityResponseData = await necessityResponse.json();

      // リクエストデータを構築
      const requestData = {
        conversation_id: `conv_${Date.now()}`,
        prompt: prompt,
        filter: ["全集"],
        top: 5,
      };

      // Azure Search APIに直接リクエストを送信
      // Search API: ユーザーの要求に合致する情報を検索
      const response = await fetch(AZURE_CONFIG.url, {
        method: "POST",
        headers: AZURE_CONFIG.headers as Record<string, string>,
        body: JSON.stringify(requestData),
      });

      if (!response.ok) {
        console.error(`Search API error: ${response.status}`);
        return {
          error: `Search API failed with status ${response.status}`,
          success: false,
        };
      }

      const responseData = await response.json();

      // Azure Category APIに直接リクエストを送信
      // Category API: カテゴリー分類を行うエンドポイント
      const categoryRequestData = {
        prompt: prompt,
        conversation_id: `conv_${Date.now()}`,
        search_results: responseData.all_search_results.map((searchResult: any) => ({
          "query": searchResult.query,
          "search_results": searchResult.search_results.map((result: any) => ({
            "filename": result.filename,
            "heading": "string",
            "chunk_id": result.chunk_id,
            "filepath": "string",
            "references": [
              "string"
            ],
            "page_number": result.page_number,
            "parent_id": "string",
            "chunk": result.chunk,
            "@search.score": 0,
            "@search.reranker_score": 0,
            "@search.highlights": {},
            "@search.captions": {},
            "sas": "string"
          }))
        })),
        "conversation_history": []
      };

      const categoryResponse = await fetch("https://prjs-api.azurewebsites.net/category", {
        method: "POST",
        headers: {
          accept: "application/json",
          "Content-Type": "application/json",
          "Llm-Api-Key": AZURE_CONFIG.headers["Llm-Api-Key"] as string,
          "Llm-Api-Version": AZURE_CONFIG.headers["Llm-Api-Version"] as string,
          "Llm-Endpoint": AZURE_CONFIG.headers["Llm-Endpoint"] as string,
          "Llm-Model": AZURE_CONFIG.headers["Llm-Model"] as string,
        },
        body: JSON.stringify(categoryRequestData),
      });

      if (!categoryResponse.ok) {
        console.error(`Category API error: ${categoryResponse.status}`);
        return {
          error: `Category API failed with status ${categoryResponse.status}`,
          success: false,
        };
      }

      const categoryResponseData = await categoryResponse.json();
      if (necessityResponseData.is_necessary) {
      return {
          categoryResponseData: categoryResponseData,
        };
      } else {
        return {
          reason: necessityResponseData.reason,
        };
      }
    } catch (error) {
      console.error("Error in searchTool:", error);
      return {
        error: error instanceof Error ? error.message : "Unknown error",
        success: false,
      };
    }
  },
});

export const tools = {
  searchTool: searchTool,
  categoryTool: categoryTool,
};