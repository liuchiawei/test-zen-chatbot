import { NextRequest, NextResponse } from "next/server";
import { getStorage } from "@/lib/db/config";

// 新しいチャットを作成するPOSTエンドポイント
export async function POST() {
  try {
    const storage = await getStorage();
    const id = await storage.createChat();

    return NextResponse.json({ id }, { status: 201 });
  } catch (error) {
    console.error("チャット作成エラー:", error);
    return NextResponse.json(
      { error: "チャットの作成に失敗しました" },
      { status: 500 }
    );
  }
}
