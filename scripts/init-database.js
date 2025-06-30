#!/usr/bin/env node

const { Pool } = require("pg");
const fs = require("fs");
const path = require("path");

// 從環境變數讀取資料庫連接
const connectionString = process.env.DATABASE_URL || process.env.POSTGRES_URL;

if (!connectionString) {
  console.error("❌ データベース接続URLが設定されていません");
  console.error("環境変数 DATABASE_URL または POSTGRES_URL を設定してください");
  process.exit(1);
}

async function initDatabase() {
  const pool = new Pool({
    connectionString,
    ssl: {
      rejectUnauthorized: false,
    },
  });

  try {
    console.log("🔗 データベースに接続中...");

    // 接続テスト
    const client = await pool.connect();
    console.log("✅ データベース接続成功");

    // スキーマファイルを読み込み
    const schemaPath = path.join(
      __dirname,
      "..",
      "src",
      "lib",
      "db",
      "schema.sql"
    );
    const schema = fs.readFileSync(schemaPath, "utf8");

    console.log("📋 テーブルを作成中...");

    // スキーマを実行
    await client.query(schema);

    console.log("✅ テーブル作成完了");

    // テーブル一覧を確認
    const tables = await client.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      ORDER BY table_name;
    `);

    console.log("📊 作成されたテーブル:");
    tables.rows.forEach((row) => {
      console.log(`  - ${row.table_name}`);
    });

    client.release();
    console.log("🎉 データベース初期化完了");
  } catch (error) {
    console.error("❌ データベース初期化エラー:", error);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

// スクリプト実行
initDatabase();
