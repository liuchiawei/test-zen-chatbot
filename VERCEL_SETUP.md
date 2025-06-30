# 🚀 Vercel 部署設定ガイド

## 📋 必要な環境変数

Vercel で正常に動作させるため、以下の環境変数を設定してください：

### 🗄️ データベース設定（推奨）

Vercel の **Environment Variables** セクションで以下を設定：

```
DATABASE_URL=postgres://neondb_owner:npg_LBk46OQFVexE@ep-green-hat-a4b5r74t-pooler.us-east-1.aws.neon.tech/neondb?sslmode=require

POSTGRES_URL=postgres://neondb_owner:npg_LBk46OQFVexE@ep-green-hat-a4b5r74t-pooler.us-east-1.aws.neon.tech/neondb?sslmode=require

POSTGRES_PRISMA_URL=postgres://neondb_owner:npg_LBk46OQFVexE@ep-green-hat-a4b5r74t-pooler.us-east-1.aws.neon.tech/neondb?connect_timeout=15&sslmode=require
```

### 🎯 Azure OpenAI 設定

```
AZURE_DEPLOYMENT_NAME=your-deployment-name
AZURE_RESOURCE_NAME=your-resource-name
AZURE_API_KEY=your-api-key
AZURE_API_VERSION=2024-02-15-preview
```

### ⚙️ ストレージ設定

```
USE_DATABASE=true
```

## 🔧 Vercel での設定手順

### 1. Vercel ダッシュボードにアクセス

1. [vercel.com](https://vercel.com) にログイン
2. プロジェクトを選択
3. **Settings** タブをクリック

### 2. 環境変数を設定

1. **Environment Variables** セクションに移動
2. 上記の環境変数を一つずつ追加
3. **Environment** は **Production**, **Preview**, **Development** 全てを選択

### 3. 再デプロイ

1. **Deployments** タブに移動
2. 最新のデプロイメントで **...** → **Redeploy** をクリック

## 🛡️ 自動フォールバック機能

環境変数が設定されていない場合、アプリケーションは自動的にファイルシステムストレージにフォールバックします。

### エラーが発生する場合

以下の環境変数でファイルシステムを強制使用：

```
USE_DATABASE=false
```

## 📊 デバッグ方法

### 1. Vercel ログを確認

```bash
vercel logs <deployment-url>
```

### 2. 環境変数を確認

Vercel Functions で環境変数が正しく読み込まれているかチェック。

### 3. 段階的テスト

1. **ローカル**: `.env.local` で設定確認
2. **Preview**: Git ブランチでプレビューデプロイ
3. **Production**: メインブランチで本番デプロイ

## ⚡ 最適化のヒント

### 1. データベース接続の最適化

```
# Vercel Functions 用の設定
POSTGRES_URL_NON_POOLING=postgres://...  # プーリング無し
```

### 2. 地域設定

Vercel の **Functions** 設定で、データベースと同じ地域（us-east-1）を選択。

### 3. 接続プールサイズ

```
# 小さなプールサイズでVercel Functions に最適化
DB_POOL_MAX=5
```

## 🔄 トラブルシューティング

### よくあるエラー

1. **"Application error"** → 環境変数未設定
2. **"Database connection failed"** → 接続文字列エラー
3. **"Server-side exception"** → Azure API キー未設定

### 解決手順

1. 環境変数を再確認
2. Vercel でリデプロイ
3. ログでエラー詳細を確認
4. 必要に応じて `USE_DATABASE=false` でファイルシステムを使用

---

**✅ 完了！** これらの設定により、Vercel で安定したデプロイが可能になります。 