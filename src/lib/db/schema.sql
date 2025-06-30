-- PostgreSQL チャット資料庫架構
-- 聊天會話表
CREATE TABLE chats (
    id VARCHAR(255) PRIMARY KEY,
    title VARCHAR(500) NOT NULL DEFAULT '新しいチャット',
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 更新 updated_at 的觸發器函數
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- 為 chats 表建立觸發器
CREATE TRIGGER update_chats_updated_at 
    BEFORE UPDATE ON chats 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- 建立索引
CREATE INDEX idx_chats_updated_at ON chats (updated_at DESC);

-- 聊天訊息表
CREATE TABLE messages (
    id VARCHAR(255) PRIMARY KEY,
    chat_id VARCHAR(255) NOT NULL,
    role VARCHAR(20) NOT NULL CHECK (role IN ('user', 'assistant', 'system', 'tool')),
    content TEXT NOT NULL,
    parts JSONB,  -- 用於儲存 tool calls 和其他附加數據
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    message_order INT NOT NULL,  -- 訊息在對話中的順序
    FOREIGN KEY (chat_id) REFERENCES chats(id) ON DELETE CASCADE
);

-- 建立索引
CREATE INDEX idx_messages_chat_id ON messages (chat_id);
CREATE INDEX idx_messages_order ON messages (chat_id, message_order);

-- 可選：用戶會話管理表（如果需要多用戶支持）
CREATE TABLE user_sessions (
    session_id VARCHAR(255) PRIMARY KEY,
    user_id VARCHAR(255),
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    last_active TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 為 user_sessions 表建立觸發器
CREATE TRIGGER update_user_sessions_last_active 
    BEFORE UPDATE ON user_sessions 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- 可選：聊天和用戶會話關聯表
CREATE TABLE chat_sessions (
    chat_id VARCHAR(255),
    session_id VARCHAR(255),
    PRIMARY KEY (chat_id, session_id),
    FOREIGN KEY (chat_id) REFERENCES chats(id) ON DELETE CASCADE,
    FOREIGN KEY (session_id) REFERENCES user_sessions(session_id) ON DELETE CASCADE
); 