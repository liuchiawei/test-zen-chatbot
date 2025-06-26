// PostgreSQL データベース接続設定

export interface DatabaseConfig {
  host: string;
  port: number;
  database: string;
  username: string;
  password: string;
  ssl?: boolean;
}

// 環境変数からデータベース設定を取得
export function getDatabaseConfig(): DatabaseConfig {
  return {
    host: process.env.POSTGRES_HOST || process.env.PGHOST || "localhost",
    port: parseInt(process.env.POSTGRES_PORT || process.env.PGPORT || "5432"),
    database:
      process.env.POSTGRES_DATABASE || process.env.PGDATABASE || "neondb",
    username: process.env.POSTGRES_USER || process.env.PGUSER || "postgres",
    password: process.env.POSTGRES_PASSWORD || process.env.PGPASSWORD || "",
    ssl: true, // Neon requires SSL
  };
}

// PostgreSQL 接続URL取得 (優先順位付き)
export function getDatabaseUrl(): string {
  // 優先順位: DATABASE_URL > POSTGRES_URL > POSTGRES_PRISMA_URL > 構築
  return (
    process.env.DATABASE_URL ||
    process.env.POSTGRES_URL ||
    process.env.POSTGRES_PRISMA_URL ||
    buildConnectionUrl()
  );
}

// データベース接続URL構築 (PostgreSQL)
export function buildConnectionUrl(): string {
  const config = getDatabaseConfig();
  const sslParam = config.ssl ? "?sslmode=require" : "";
  return `postgresql://${config.username}:${config.password}@${config.host}:${config.port}/${config.database}${sslParam}`;
}

// PostgreSQL プール設定
export const connectionOptions = {
  max: 10, // プール内の最大接続数
  min: 1, // プール内の最小接続数
  idle: 10000, // アイドル接続タイムアウト (ms)
  acquire: 60000, // 接続取得タイムアウト (ms)
  evict: 1000, // 接続検証間隔 (ms)
};
