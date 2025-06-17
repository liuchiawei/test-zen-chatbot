import { generateId } from "ai";
import { existsSync, mkdirSync } from "fs";
import { writeFile } from "fs/promises";
import path from "path";
import { NextRequest, NextResponse } from "next/server";

// チャットディレクトリのパスを取得する関数
function getChatDir(): string {
  const chatDir = path.join(process.cwd(), ".chats");
  if (!existsSync(chatDir)) mkdirSync(chatDir, { recursive: true });
  return chatDir;
}

// チャットファイルのパスを取得する関数
function getChatFile(id: string): string {
  return path.join(getChatDir(), `${id}.json`);
}

// 新しいチャットを作成するPOSTエンドポイント
export async function POST() {
  try {
    const id = generateId(); // ユニークなチャットIDを生成
    await writeFile(getChatFile(id), "[]"); // 空のチャットファイルを作成

    return NextResponse.json({ id }, { status: 201 });
  } catch (error) {
    console.error("チャット作成エラー:", error);
    return NextResponse.json(
      { error: "チャットの作成に失敗しました" },
      { status: 500 }
    );
  }
}
