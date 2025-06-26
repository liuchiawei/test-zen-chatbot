// ストレージタイプの設定
export function useDatabase(): boolean {
  return process.env.USE_DATABASE === "true";
}

// ストレージ層の動的インポート
export async function getStorageAdapter() {
  if (useDatabase()) {
    console.log("データベースストレージを使用します");
    return await import("./chat-store-db");
  } else {
    console.log("ファイルシステムストレージを使用します");
    return await import("@/ai/chat-store");
  }
}

// 統一されたストレージインターフェース
export interface StorageAdapter {
  createChat(): Promise<string>;
  loadChat(id: string): Promise<any[]>;
  saveChat(params: { id: string; messages: any[] }): Promise<void>;
  getAllChatIds(): Promise<string[]>;
  loadChatMetadata(id: string): Promise<any>;
  updateChatTitle(id: string, title: string): Promise<void>;
  getAllChatMetadata(): Promise<any[]>;
}

// ストレージアダプターを取得する関数
export async function getStorage(): Promise<StorageAdapter> {
  const adapter = await getStorageAdapter();
  return adapter as StorageAdapter;
}
