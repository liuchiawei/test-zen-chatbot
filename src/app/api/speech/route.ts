import { experimental_generateSpeech as generateSpeech } from "ai";
import { openai } from "@ai-sdk/openai";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    // リクエストボディからテキストを取得
    const { text } = await req.json();

    if (!text) {
      return NextResponse.json(
        { error: "テキストが提供されていません" },
        { status: 400 }
      );
    }

    const result = await generateSpeech({
      model: openai.speech("tts-1"),
      text: text,
      // providerOptions: { openai: { instructions: "Speak in a slow and steady tone" } },
    });

    // 音声データを返す
    return new Response(Buffer.from(result.audio.uint8Array), {
      headers: {
        "Content-Type": "audio/mpeg",
      },
    });
  } catch (error) {
    console.error("音声生成エラー:", error);
    return NextResponse.json(
      { error: "音声生成に失敗しました" },
      { status: 500 }
    );
  }
}
