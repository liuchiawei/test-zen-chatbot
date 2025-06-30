import { NextRequest, NextResponse } from "next/server";
import {
  migrateFromFileToDatabase,
  backupDatabaseToFiles,
  verifyMigration,
} from "@/lib/db/migration";

// 遷移を実行するPOSTエンドポイント
export async function POST(request: NextRequest) {
  try {
    const { action } = await request.json();

    switch (action) {
      case "migrate":
        console.log("ファイルシステムからデータベースへの遷移を開始...");
        const migrationResult = await migrateFromFileToDatabase();
        return NextResponse.json(migrationResult);

      case "backup":
        console.log(
          "データベースからファイルシステムへのバックアップを開始..."
        );
        const backupResult = await backupDatabaseToFiles();
        return NextResponse.json(backupResult);

      case "verify":
        console.log("遷移状況の確認を開始...");
        const verificationResult = await verifyMigration();
        return NextResponse.json(verificationResult);

      default:
        return NextResponse.json(
          {
            error:
              '無効なアクション。"migrate", "backup", "verify" のいずれかを指定してください。',
          },
          { status: 400 }
        );
    }
  } catch (error) {
    console.error("遷移エラー:", error);
    return NextResponse.json(
      { error: "遷移プロセスでエラーが発生しました。", details: error },
      { status: 500 }
    );
  }
}

// 遷移状況を取得するGETエンドポイント
export async function GET() {
  try {
    const verificationResult = await verifyMigration();

    return NextResponse.json({
      status: "success",
      data: verificationResult,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("遷移状況確認エラー:", error);
    return NextResponse.json(
      { error: "遷移状況の確認でエラーが発生しました。", details: error },
      { status: 500 }
    );
  }
}
