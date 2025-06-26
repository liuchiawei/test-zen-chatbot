import { existsSync } from "fs";
import { readFile, readdir } from "fs/promises";
import path from "path";
import { Message } from "ai";

// 舊檔案系統的邏輯（遷移用）
import * as fileStore from "@/ai/chat-store";

// 新資料庫的邏輯
import * as dbStore from "./chat-store-db";

// 遷移進度追蹤
export interface MigrationProgress {
  totalChats: number;
  processedChats: number;
  errors: string[];
  isComplete: boolean;
}

// ファイルシステムからデータベースへの遷移
export async function migrateFromFileToDatabase(): Promise<MigrationProgress> {
  const progress: MigrationProgress = {
    totalChats: 0,
    processedChats: 0,
    errors: [],
    isComplete: false,
  };

  try {
    // 1. 既存のチャットファイルを取得
    const chatIds = await fileStore.getAllChatIds();
    progress.totalChats = chatIds.length;

    console.log(`遷移開始: ${chatIds.length} チャットを処理します`);

    // 2. 各チャットを個別に遷移
    for (const chatId of chatIds) {
      try {
        // ファイルからメッセージ読み込み
        const messages = await fileStore.loadChat(chatId);

        // メタデータも読み込み
        const metadata = await fileStore.loadChatMetadata(chatId);

        // データベースに新しいチャットを作成（既存のIDを使用）
        await dbStore.createChat(chatId);

        // メッセージを保存
        await dbStore.saveChat({ id: chatId, messages });

        // メタデータが存在する場合はタイトルを更新
        if (metadata) {
          await dbStore.updateChatTitle(chatId, metadata.title);
        }

        progress.processedChats++;
        console.log(
          `遷移完了: ${chatId} (${progress.processedChats}/${progress.totalChats})`
        );
      } catch (error) {
        const errorMessage = `チャット ${chatId} の遷移に失敗: ${error}`;
        progress.errors.push(errorMessage);
        console.error(errorMessage);
      }
    }

    progress.isComplete = true;
    console.log("遷移完了!");
  } catch (error) {
    progress.errors.push(`遷移プロセスエラー: ${error}`);
    console.error("遷移プロセスエラー:", error);
  }

  return progress;
}

// データベースからファイルシステムへのバックアップ（緊急時用）
export async function backupDatabaseToFiles(): Promise<MigrationProgress> {
  const progress: MigrationProgress = {
    totalChats: 0,
    processedChats: 0,
    errors: [],
    isComplete: false,
  };

  try {
    // データベースから全チャットを取得
    const chatIds = await dbStore.getAllChatIds();
    progress.totalChats = chatIds.length;

    console.log(`バックアップ開始: ${chatIds.length} チャットを処理します`);

    for (const chatId of chatIds) {
      try {
        // データベースからメッセージ読み込み
        const messages = await dbStore.loadChat(chatId);

        // メタデータも読み込み
        const metadata = await dbStore.loadChatMetadata(chatId);

        // ファイルに保存
        await fileStore.saveChat({ id: chatId, messages });

        // メタデータが存在する場合は保存
        if (metadata) {
          await fileStore.updateChatTitle(chatId, metadata.title);
        }

        progress.processedChats++;
        console.log(
          `バックアップ完了: ${chatId} (${progress.processedChats}/${progress.totalChats})`
        );
      } catch (error) {
        const errorMessage = `チャット ${chatId} のバックアップに失敗: ${error}`;
        progress.errors.push(errorMessage);
        console.error(errorMessage);
      }
    }

    progress.isComplete = true;
    console.log("バックアップ完了!");
  } catch (error) {
    progress.errors.push(`バックアッププロセスエラー: ${error}`);
    console.error("バックアッププロセスエラー:", error);
  }

  return progress;
}

// 遷移状況確認
export async function verifyMigration(): Promise<{
  fileSystemChats: number;
  databaseChats: number;
  isConsistent: boolean;
  differences: string[];
}> {
  const differences: string[] = [];

  try {
    const fileChats = await fileStore.getAllChatIds();
    const dbChats = await dbStore.getAllChatIds();

    const fileSystemChats = fileChats.length;
    const databaseChats = dbChats.length;

    // チャット数の比較
    if (fileSystemChats !== databaseChats) {
      differences.push(
        `チャット数が一致しません: ファイル=${fileSystemChats}, DB=${databaseChats}`
      );
    }

    // 個別チャットの存在確認
    for (const chatId of fileChats) {
      if (!dbChats.includes(chatId)) {
        differences.push(`チャット ${chatId} がデータベースに存在しません`);
      }
    }

    for (const chatId of dbChats) {
      if (!fileChats.includes(chatId)) {
        differences.push(`チャット ${chatId} がファイルシステムに存在しません`);
      }
    }

    return {
      fileSystemChats,
      databaseChats,
      isConsistent: differences.length === 0,
      differences,
    };
  } catch (error) {
    return {
      fileSystemChats: 0,
      databaseChats: 0,
      isConsistent: false,
      differences: [`検証エラー: ${error}`],
    };
  }
}
