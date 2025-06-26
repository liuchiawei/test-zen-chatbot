# データベース遷移ガイド

このガイドでは、チャットデータをファイルシステムからデータベースに遷移する手順を説明します。

## 🗂️ 現在のファイルシステム構造

現在、チャットデータは以下の形式で保存されています：
- **チャットファイル**: `.chats/{chat-id}.json` - メッセージデータ
- **メタデータファイル**: `.chats/{chat-id}.meta.json` - タイトル、作成日時など

## 🗄️ 新しいデータベース構造

データベースには以下のテーブルが作成されます：

### `chats` テーブル
- `id` (VARCHAR 255, PRIMARY KEY) - チャットID
- `title` (VARCHAR 500) - チャットタイトル  
- `created_at` (TIMESTAMP) - 作成日時
- `updated_at` (TIMESTAMP) - 更新日時

### `messages` テーブル
- `id` (VARCHAR 255, PRIMARY KEY) - メッセージID
- `chat_id` (VARCHAR 255, FOREIGN KEY) - 所属チャットID
- `role` (ENUM) - 'user', 'assistant', 'system', 'tool'
- `content` (TEXT) - メッセージ内容
- `parts` (JSON) - ツール呼び出しなどの追加データ
- `message_order` (INT) - チャット内での順序
- `created_at` (TIMESTAMP) - 作成日時

## 🚀 遷移手順

### 1. データベースの準備

まず、データベースサーバーを準備し、接続情報を取得してください。

### 2. 環境変数の設定

`database.env.example` ファイルを参考に、環境変数を設定：

\`\`\`env
DB_HOST=your-database-host
DB_PORT=3306
DB_NAME=zen_chatbot
DB_USER=your-username
DB_PASSWORD=your-password
DB_SSL=true  # 本番環境では推奨
USE_DATABASE=false  # 遷移完了まではfalse
\`\`\`

### 3. データベーススキーマの作成

\`src/lib/db/schema.sql\` のSQLを実行してテーブルを作成してください。

### 4. データベースライブラリの実装

現在、データベース接続部分は準備段階です。以下のいずれかのライブラリを選択して実装してください：

#### Option A: MySQL2 (推奨)
\`\`\`bash
pnpm add mysql2
\`\`\`

#### Option B: Prisma ORM
\`\`\`bash
pnpm add prisma @prisma/client
\`\`\`

#### Option C: TypeORM
\`\`\`bash
pnpm add typeorm mysql2
\`\`\`

### 5. 遷移の実行

遷移API を使用してデータを移行：

\`\`\`bash
# 遷移状況確認
curl http://localhost:3000/api/migrate

# 遷移実行
curl -X POST http://localhost:3000/api/migrate \\
  -H "Content-Type: application/json" \\
  -d '{"action": "migrate"}'

# 遷移確認
curl -X POST http://localhost:3000/api/migrate \\
  -H "Content-Type: application/json" \\
  -d '{"action": "verify"}'
\`\`\`

### 6. 本番切り替え

遷移が成功したら、環境変数を更新：

\`\`\`env
USE_DATABASE=true
\`\`\`

## 🔧 実装が必要な箇所

現在、以下のファイルで実装が必要です：

1. **\`src/lib/db/chat-store-db.ts\`** - データベースクエリの実装
2. **\`src/lib/db/connection.ts\`** - 実際のデータベース接続
3. **\`src/lib/db/migration.ts\`** - createChat関数のID指定対応

## 🛡️ 安全対策

- 遷移前にファイルシステムのバックアップを作成
- 小規模なテストデータで事前テスト
- 遷移中は一時的にアプリケーションを停止
- ロールバック計画を準備

## 🔄 ロールバック手順

問題が発生した場合：

\`\`\`bash
# データベースからファイルシステムへバックアップ
curl -X POST http://localhost:3000/api/migrate \\
  -H "Content-Type: application/json" \\
  -d '{"action": "backup"}'

# 環境変数を戻す
USE_DATABASE=false
\`\`\`

## 📊 モニタリング

遷移後は以下を監視：
- API応答時間
- データベース接続数
- エラーログ
- データ整合性

---

**注意**: 実際のデータベース接続情報を取得してから、実装を完了してください。 