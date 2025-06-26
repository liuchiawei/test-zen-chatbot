import { generateId } from "ai";
import { Message } from "ai";
import { Pool, PoolClient } from "pg";
import { getDatabaseUrl, connectionOptions } from "./connection";

// PostgreSQL 連接池
let pool: Pool | null = null;

// データベース接続を初期化する関数
export async function initializeDatabase() {
  if (!pool) {
    pool = new Pool({
      connectionString: getDatabaseUrl(),
      max: connectionOptions.max,
      min: connectionOptions.min,
      idleTimeoutMillis: connectionOptions.idle,
      connectionTimeoutMillis: connectionOptions.acquire,
      ssl: {
        rejectUnauthorized: false, // Neon での証明書検証
      },
    });

    console.log("PostgreSQL データベース接続プールを初期化しました");

    // 接続テスト
    try {
      const client = await pool.connect();
      console.log("データベース接続テスト成功");
      client.release();
    } catch (error) {
      console.error("データベース接続テスト失敗:", error);
      throw error;
    }
  }
}

// チャットメタデータ型定義
export interface ChatMetadata {
  id: string;
  title: string;
  createdAt: Date;
  updatedAt: Date;
}

// データベース用のメッセージ型定義
export interface DbMessage extends Message {
  messageOrder: number;
}

// 新しいチャットを作成
export async function createChat(customId?: string): Promise<string> {
  await initializeDatabase();
  const id = customId || generateId();

  const client = await pool!.connect();
  try {
    await client.query(
      "INSERT INTO chats (id, title, created_at, updated_at) VALUES ($1, $2, NOW(), NOW())",
      [id, "新しいチャット"]
    );

    console.log(`新しいチャット作成: ${id}`);
    return id;
  } catch (error) {
    console.error("チャット作成エラー:", error);
    throw error;
  } finally {
    client.release();
  }
}

// チャットメッセージを読み込み
export async function loadChat(id: string): Promise<Message[]> {
  await initializeDatabase();

  const client = await pool!.connect();
  try {
    const result = await client.query(
      "SELECT id, role, content, parts FROM messages WHERE chat_id = $1 ORDER BY message_order ASC",
      [id]
    );

    return result.rows.map((row: any) => ({
      id: row.id,
      role: row.role,
      content: row.content,
      parts: row.parts || undefined,
    }));
  } catch (error) {
    console.error("チャット読み込みエラー:", error);
    throw error;
  } finally {
    client.release();
  }
}

// チャットメッセージを保存
export async function saveChat({
  id,
  messages,
}: {
  id: string;
  messages: Message[];
}): Promise<void> {
  await initializeDatabase();

  const client = await pool!.connect();
  try {
    await client.query("BEGIN");

    // 既存のメッセージを削除
    await client.query("DELETE FROM messages WHERE chat_id = $1", [id]);

    // 新しいメッセージを挿入
    for (let i = 0; i < messages.length; i++) {
      const message = messages[i];
      await client.query(
        "INSERT INTO messages (id, chat_id, role, content, parts, message_order, created_at) VALUES ($1, $2, $3, $4, $5, $6, NOW())",
        [
          message.id,
          id,
          message.role,
          message.content,
          message.parts ? JSON.stringify(message.parts) : null,
          i,
        ]
      );
    }

    // チャットのupdated_atを更新
    await client.query("UPDATE chats SET updated_at = NOW() WHERE id = $1", [
      id,
    ]);

    // メタデータの自動生成/更新
    if (messages.length > 0) {
      const firstUserMessage = messages.find((m) => m.role === "user");
      if (firstUserMessage) {
        const title = generateTitleFromMessage(firstUserMessage.content);
        await client.query(
          "UPDATE chats SET title = $1 WHERE id = $2 AND title = $3",
          [title, id, "新しいチャット"]
        );
      }
    }

    await client.query("COMMIT");
    console.log(`チャット保存: ${id}, メッセージ数: ${messages.length}`);
  } catch (error) {
    await client.query("ROLLBACK");
    console.error("チャット保存エラー:", error);
    throw error;
  } finally {
    client.release();
  }
}

// 全てのチャットIDを取得
export async function getAllChatIds(): Promise<string[]> {
  await initializeDatabase();

  const client = await pool!.connect();
  try {
    const result = await client.query(
      "SELECT id FROM chats ORDER BY updated_at DESC"
    );

    return result.rows.map((row: any) => row.id);
  } catch (error) {
    console.error("全チャットID取得エラー:", error);
    throw error;
  } finally {
    client.release();
  }
}

// チャットメタデータを読み込み
export async function loadChatMetadata(
  id: string
): Promise<ChatMetadata | null> {
  await initializeDatabase();

  const client = await pool!.connect();
  try {
    const result = await client.query(
      "SELECT id, title, created_at, updated_at FROM chats WHERE id = $1",
      [id]
    );

    if (result.rows.length === 0) return null;

    const row = result.rows[0];
    return {
      id: row.id,
      title: row.title,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    };
  } catch (error) {
    console.error("チャットメタデータ読み込みエラー:", error);
    throw error;
  } finally {
    client.release();
  }
}

// チャットタイトルを更新
export async function updateChatTitle(
  id: string,
  title: string
): Promise<void> {
  await initializeDatabase();

  const client = await pool!.connect();
  try {
    await client.query(
      "UPDATE chats SET title = $1, updated_at = NOW() WHERE id = $2",
      [title, id]
    );

    console.log(`チャットタイトル更新: ${id} -> ${title}`);
  } catch (error) {
    console.error("チャットタイトル更新エラー:", error);
    throw error;
  } finally {
    client.release();
  }
}

// 全てのチャットメタデータを取得
export async function getAllChatMetadata(): Promise<ChatMetadata[]> {
  await initializeDatabase();

  const client = await pool!.connect();
  try {
    const result = await client.query(
      "SELECT id, title, created_at, updated_at FROM chats ORDER BY updated_at DESC"
    );

    return result.rows.map((row: any) => ({
      id: row.id,
      title: row.title,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    }));
  } catch (error) {
    console.error("全チャットメタデータ取得エラー:", error);
    throw error;
  } finally {
    client.release();
  }
}

// チャットタイトルを生成（最初のメッセージから抽出）
function generateTitleFromMessage(message: string): string {
  const maxLength = 30;
  const cleanMessage = message.trim().replace(/\n/g, " ");
  return cleanMessage.length > maxLength
    ? cleanMessage.substring(0, maxLength) + "..."
    : cleanMessage || "新しいチャット";
}

// チャットを削除
export async function deleteChat(id: string): Promise<void> {
  await initializeDatabase();

  const client = await pool!.connect();
  try {
    await client.query("DELETE FROM chats WHERE id = $1", [id]);
    // messages は外部キー制約により自動削除される

    console.log(`チャット削除: ${id}`);
  } catch (error) {
    console.error("チャット削除エラー:", error);
    throw error;
  } finally {
    client.release();
  }
}

// データベース接続を閉じる（アプリケーション終了時用）
export async function closeDatabase(): Promise<void> {
  if (pool) {
    await pool.end();
    pool = null;
    console.log("データベース接続プールを閉じました");
  }
}
