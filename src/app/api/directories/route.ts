import { NextResponse } from "next/server";

export async function GET(request: Request) {
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
      url: "https://prjs-api.azurewebsites.net/directories",
      headers: {
        accept: "application/json",
        "Content-Type": "application/json",
        "Azure-Storage-Connection-String":
          process.env.azure_storage_connection_string,
        "Azure-Container-Name": process.env.azure_container_name,
      },
    };

    // Azure APIに直接リクエストを送信
    const response = await fetch(AZURE_CONFIG.url, {
      method: "GET",
      headers: AZURE_CONFIG.headers as Record<string, string>,
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
