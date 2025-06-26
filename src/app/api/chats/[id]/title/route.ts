import { NextRequest, NextResponse } from "next/server";
import { updateChatTitle } from "@/ai/chat-store";

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { title }: { title: string } = await request.json();

    await updateChatTitle(id, title);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("タイトル更新エラー:", error);
    return NextResponse.json(
      { error: "タイトルの更新に失敗しました" },
      { status: 500 }
    );
  }
}
