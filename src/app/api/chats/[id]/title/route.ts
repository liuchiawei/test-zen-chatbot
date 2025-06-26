import { NextRequest, NextResponse } from "next/server";
import { getStorage } from "@/lib/db/config";

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { title }: { title: string } = await request.json();

    const storage = await getStorage();
    await storage.updateChatTitle(id, title);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("タイトル更新エラー:", error);
    return NextResponse.json(
      { error: "タイトルの更新に失敗しました" },
      { status: 500 }
    );
  }
}
