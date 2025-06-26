import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    // 環境変数の検証
    if (
      !process.env.azure_storage_connection_string ||
      !process.env.azure_container_name
    ) {
      return NextResponse.json(
        {
          detail: [
            {
              loc: ["env", "azure_storage_connection_string"],
              msg: "azure_storage_connection_string environment variable is required",
              type: "missing",
            },
            {
              loc: ["env", "azure_container_name"],
              msg: "azure_container_name environment variable is required",
              type: "missing",
            },
          ],
        },
        { status: 422 }
      );
    }

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

    // Azure APIに直接リクエストを送信
    const response = await fetch(AZURE_CONFIG.url, {
      method: "POST",
      headers: AZURE_CONFIG.headers as Record<string, string>,
      body: JSON.stringify({
        conversation_id: `conv_${Date.now()}`,
        prompt: "人間革命とは",
        filter: [
          "「本部創友会」記念の集い（1987・４・28） 生涯、正しき信心で幸の人生を.txt",
          "「１・15」記念各部代表者合同研修会（1987・１・15） 新しき人類文明の夜明けを.txt",
          "「３・16」記念各部代表者勤行会（1987・３・14） 〝後悔〟から〝歓喜〟の人生へ.txt",
          "「４・２」記念女子部代表者会議（1987・４・２） 常住の法に生き〝永遠の幸〟を.txt",
        ],
        top: 10,
      }),
    });

    if (!response.ok) {
      console.error(`Azure API error: ${response.status}`);

      if (response.status === 422) {
        return NextResponse.json(
          {
            detail: [
              {
                loc: ["azure-api"],
                msg: "Validation error from Azure API",
                type: "validation_error",
              },
            ],
          },
          { status: 422 }
        );
      }

      return NextResponse.json(
        { error: `Azure API failed with status ${response.status}` },
        { status: response.status }
      );
    }

    // レスポンスデータを取得して返却
    const responseData = await response.json();
    return NextResponse.json(responseData);
  } catch (error) {
    console.error("Error fetching directories:", error);
    return NextResponse.json(
      { error: "Failed to fetch directories" },
      { status: 500 }
    );
  }
}
