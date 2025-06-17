import { generateId } from 'ai';
import { existsSync, mkdirSync } from 'fs';
import { writeFile } from 'fs/promises';
import path from 'path';
import { Message } from 'ai';
import { readFile, readdir } from 'fs/promises';

export async function createChat(): Promise<string> {
  const id = generateId(); // generate a unique chat ID
  await writeFile(getChatFile(id), '[]'); // create an empty chat file
  return id;
}

function getChatFile(id: string): string {
  const chatDir = path.join(process.cwd(), '.chats');
  if (!existsSync(chatDir)) mkdirSync(chatDir, { recursive: true });
  return path.join(chatDir, `${id}.json`);
}

export async function loadChat(id: string): Promise<Message[]> {
  return JSON.parse(await readFile(getChatFile(id), 'utf8'));
}

export async function saveChat({
  id,
  messages,
}: {
  id: string;
  messages: Message[];
}): Promise<void> {
  const content = JSON.stringify(messages, null, 2);
  await writeFile(getChatFile(id), content);
  
  // メタデータも更新
  let metadata = await loadChatMetadata(id);
  if (!metadata && messages.length > 0) {
    // 初回保存時にユーザーの最初のメッセージからタイトルを生成
    const firstUserMessage = messages.find(m => m.role === 'user');
    const title = firstUserMessage 
      ? generateTitleFromMessage(firstUserMessage.content)
      : '新しいチャット';
    
    metadata = {
      id,
      title,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    await saveChatMetadata(metadata);
  } else if (metadata) {
    metadata.updatedAt = new Date();
    await saveChatMetadata(metadata);
  }
}

export async function getAllChatIds(): Promise<string[]> {
  const chatDir = path.join(process.cwd(), '.chats');
  if (!existsSync(chatDir)) return []; // チャットディレクトリが存在しない場合は空配列を返す
  
  const files = await readdir(chatDir);
  return files
    .filter(file => file.endsWith('.json')) // .jsonファイルのみをフィルタ
    .map(file => file.replace('.json', '')); // 拡張子を削除してIDを取得
}

// 新增聊天標題相關的類型和函數
export interface ChatMetadata {
  id: string;
  title: string;
  createdAt: Date;
  updatedAt: Date;
}

// メタデータファイルのパスを取得
function getMetadataFile(id: string): string {
  const chatDir = path.join(process.cwd(), '.chats');
  if (!existsSync(chatDir)) mkdirSync(chatDir, { recursive: true });
  return path.join(chatDir, `${id}.meta.json`);
}

// チャットタイトルを生成（最初のメッセージから抽出）
function generateTitleFromMessage(message: string): string {
  const maxLength = 30;
  const cleanMessage = message.trim().replace(/\n/g, ' ');
  return cleanMessage.length > maxLength 
    ? cleanMessage.substring(0, maxLength) + '...'
    : cleanMessage || '新しいチャット';
}

// チャットメタデータを保存
export async function saveChatMetadata(metadata: ChatMetadata): Promise<void> {
  await writeFile(getMetadataFile(metadata.id), JSON.stringify(metadata, null, 2));
}

// チャットメタデータを読み込み
export async function loadChatMetadata(id: string): Promise<ChatMetadata | null> {
  const metadataFile = getMetadataFile(id);
  if (!existsSync(metadataFile)) return null;
  
  try {
    const data = await readFile(metadataFile, 'utf8');
    return JSON.parse(data);
  } catch {
    return null;
  }
}

// チャットタイトルを更新
export async function updateChatTitle(id: string, title: string): Promise<void> {
  let metadata = await loadChatMetadata(id);
  if (!metadata) {
    metadata = {
      id,
      title,
      createdAt: new Date(),
      updatedAt: new Date()
    };
  } else {
    metadata.title = title;
    metadata.updatedAt = new Date();
  }
  await saveChatMetadata(metadata);
}

// 全てのチャットメタデータを取得
export async function getAllChatMetadata(): Promise<ChatMetadata[]> {
  const chatDir = path.join(process.cwd(), '.chats');
  if (!existsSync(chatDir)) return [];
  
  const files = await readdir(chatDir);
  const metadataFiles = files.filter(file => file.endsWith('.meta.json'));
  
  const metadata: ChatMetadata[] = [];
  for (const file of metadataFiles) {
    try {
      const data = await readFile(path.join(chatDir, file), 'utf8');
      metadata.push(JSON.parse(data));
    } catch {
      // メタデータファイルが破損している場合はスキップ
      continue;
    }
  }
  
  return metadata.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
}