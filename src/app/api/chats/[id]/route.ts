import { existsSync } from "fs";
import { readFile, writeFile } from "fs/promises";
import path from "path";
import { NextRequest, NextResponse } from "next/server";
import { Message } from "ai";

// チャットファイルのパスを取得する関数
function getChatFile(id: string): string {
  const chatDir = path.join(process.cwd(), ".chats");
  return path.join(chatDir, `${id}.json`);
}

type RouteContext = {
  params: {
    id: string;
  };
};

// チャットデータを読み込むGETエンドポイント
export async function GET(
  request: NextRequest,
  context: RouteContext
): Promise<NextResponse> {
  try {
    const { id } = context.params;
    const chatFile = getChatFile(id);

    if (!existsSync(chatFile)) {
      return NextResponse.json(
        { error: "チャットが見つかりません" },
        { status: 404 }
      );
    }

    const messages: Message[] = JSON.parse(await readFile(chatFile, "utf8"));
    return NextResponse.json({ messages });
  } catch (error) {
    console.error("チャット読み込みエラー:", error);
    return NextResponse.json(
      { error: "チャットの読み込みに失敗しました" },
      { status: 500 }
    );
  }
}

// チャットデータを更新するPUTエンドポイント
export async function PUT(
  request: NextRequest,
  context: RouteContext
): Promise<NextResponse> {
  try {
    const { id } = context.params;
    const { messages }: { messages: Message[] } = await request.json();
    const chatFile = getChatFile(id);

    await writeFile(chatFile, JSON.stringify(messages, null, 2));

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("チャット更新エラー:", error);
    return NextResponse.json(
      { error: "チャットの更新に失敗しました" },
      { status: 500 }
    );
  }
}
