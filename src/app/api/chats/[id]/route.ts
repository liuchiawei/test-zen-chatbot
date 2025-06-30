import { NextRequest, NextResponse } from "next/server";
import { Message } from "ai";
import { getStorage } from "@/lib/db/config";

// チャットデータを読み込むGETエンドポイント
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const storage = await getStorage();

    const messages: Message[] = await storage.loadChat(id);
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
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { messages }: { messages: Message[] } = await request.json();
    const storage = await getStorage();

    await storage.saveChat({ id, messages });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("チャット更新エラー:", error);
    return NextResponse.json(
      { error: "チャットの更新に失敗しました" },
      { status: 500 }
    );
  }
}
