-- 結婚式プラン送客プラットフォーム MVP スキーマ

-- 事業者テーブル
CREATE TABLE IF NOT EXISTS providers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  name TEXT NOT NULL,
  bio TEXT,
  sns_links JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- プランテーブル
CREATE TABLE IF NOT EXISTS plans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  provider_id UUID NOT NULL REFERENCES providers(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  price INTEGER NOT NULL,
  scale TEXT NOT NULL, -- "0", "2-10", "10-30", "30-60", "60+"
  world_view TEXT NOT NULL, -- "桜", "ナチュラル", "韓国風", etc.
  location TEXT NOT NULL, -- 都道府県 or 屋外/スタジオカテゴリ
  purpose TEXT NOT NULL, -- "前撮り", "フォト婚", "小規模結婚式", etc.
  date_range TEXT, -- 希望日または可能期間
  images TEXT[] DEFAULT '{}', -- Supabase storage path
  summary_points TEXT[] DEFAULT '{}',
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- インデックス作成（検索パフォーマンス向上）
CREATE INDEX IF NOT EXISTS idx_plans_provider_id ON plans(provider_id);
CREATE INDEX IF NOT EXISTS idx_plans_price ON plans(price);
CREATE INDEX IF NOT EXISTS idx_plans_scale ON plans(scale);
CREATE INDEX IF NOT EXISTS idx_plans_world_view ON plans(world_view);
CREATE INDEX IF NOT EXISTS idx_plans_location ON plans(location);
CREATE INDEX IF NOT EXISTS idx_plans_purpose ON plans(purpose);
-- 日本語全文検索インデックス（Supabaseでは日本語設定が利用できないためコメントアウト）
-- 検索はILIKEを使用して部分一致検索を実装
-- CREATE INDEX IF NOT EXISTS idx_plans_title ON plans USING gin(to_tsvector('japanese', title));
-- CREATE INDEX IF NOT EXISTS idx_plans_description ON plans USING gin(to_tsvector('japanese', description));

-- updated_at自動更新トリガー
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_plans_updated_at
  BEFORE UPDATE ON plans
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Row Level Security (RLS) ポリシー
ALTER TABLE providers ENABLE ROW LEVEL SECURITY;
ALTER TABLE plans ENABLE ROW LEVEL SECURITY;

-- プランは全員が閲覧可能
CREATE POLICY "Plans are viewable by everyone"
  ON plans FOR SELECT
  USING (true);

-- 事業者は自分のプランのみ作成・更新・削除可能
CREATE POLICY "Providers can insert their own plans"
  ON plans FOR INSERT
  WITH CHECK (auth.uid()::text = provider_id::text);

CREATE POLICY "Providers can update their own plans"
  ON plans FOR UPDATE
  USING (auth.uid()::text = provider_id::text);

CREATE POLICY "Providers can delete their own plans"
  ON plans FOR DELETE
  USING (auth.uid()::text = provider_id::text);

-- 事業者情報のRLSポリシー（簡易実装）
-- 全員がprovidersテーブルを読み取り可能
CREATE POLICY "Providers are viewable by everyone"
  ON providers FOR SELECT
  USING (true);

-- 全員がprovidersテーブルに挿入可能（新規登録用）
CREATE POLICY "Anyone can insert providers"
  ON providers FOR INSERT
  WITH CHECK (true);

-- 全員がprovidersテーブルを更新可能（簡易実装）
CREATE POLICY "Anyone can update providers"
  ON providers FOR UPDATE
  USING (true);

-- 注意: 本番環境では適切な認証・認可を実装してください

