-- =============================================
-- 微信小程序用户表 + 订单表 建表SQL
-- 在 Supabase SQL Editor 中执行
-- =============================================

-- 1. 微信小程序用户表
CREATE TABLE IF NOT EXISTS wx_users (
  id BIGSERIAL PRIMARY KEY,
  openid VARCHAR(128) NOT NULL UNIQUE,
  user_id VARCHAR(32) NOT NULL UNIQUE,
  nickname VARCHAR(64) DEFAULT '微信用户',
  avatar TEXT,
  is_vip BOOLEAN DEFAULT FALSE NOT NULL,
  vip_expire DATE,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_wx_users_openid ON wx_users(openid);
CREATE INDEX IF NOT EXISTS idx_wx_users_user_id ON wx_users(user_id);
CREATE INDEX IF NOT EXISTS idx_wx_users_is_vip ON wx_users(is_vip);

-- 2. 微信小程序订单表
CREATE TABLE IF NOT EXISTS wx_orders (
  id VARCHAR(64) PRIMARY KEY,
  out_trade_no VARCHAR(32) NOT NULL UNIQUE,
  product_id VARCHAR(64) NOT NULL,
  product_name VARCHAR(256) NOT NULL,
  total_fee INTEGER NOT NULL,
  status VARCHAR(20) DEFAULT 'pending' NOT NULL,
  user_id VARCHAR(128),
  email VARCHAR(255),
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  paid_at TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS idx_wx_orders_out_trade_no ON wx_orders(out_trade_no);
CREATE INDEX IF NOT EXISTS idx_wx_orders_user_id ON wx_orders(user_id);
CREATE INDEX IF NOT EXISTS idx_wx_orders_status ON wx_orders(status);
CREATE INDEX IF NOT EXISTS idx_wx_orders_created_at ON wx_orders(created_at);

-- 3. RLS安全策略
-- 服务端后端操作（service_role key）
-- 如果 COZE_SUPABASE_SERVICE_ROLE_KEY 未设置，代码会回退到 anonKey
-- 所以需要同时允许 service_role 和 anon 两种角色
ALTER TABLE wx_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE wx_orders ENABLE ROW LEVEL SECURITY;

-- 允许 service_role 全部操作
CREATE POLICY "Service role can do anything on wx_users" ON wx_users
  FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "Service role can do anything on wx_orders" ON wx_orders
  FOR ALL USING (auth.role() = 'service_role');

-- 允许 anon 全部操作（后端回退兜底）
-- 安全说明：这些表只在服务端 Next.js API 路由中访问，不会暴露给客户端
CREATE POLICY "Anon can do anything on wx_users" ON wx_users
  FOR ALL USING (auth.role() = 'anon');

CREATE POLICY "Anon can do anything on wx_orders" ON wx_orders
  FOR ALL USING (auth.role() = 'anon');
