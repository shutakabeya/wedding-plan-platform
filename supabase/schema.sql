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
  world_view TEXT[] NOT NULL DEFAULT '{}', -- 世界観タグ（複数選択可）
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
CREATE INDEX IF NOT EXISTS idx_plans_world_view ON plans USING gin(world_view);
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

-- 既存のトリガーを削除（エラーになる場合は無視してください）
DROP TRIGGER IF EXISTS update_plans_updated_at ON plans;

CREATE TRIGGER update_plans_updated_at
  BEFORE UPDATE ON plans
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Row Level Security (RLS) ポリシー
ALTER TABLE providers ENABLE ROW LEVEL SECURITY;
ALTER TABLE plans ENABLE ROW LEVEL SECURITY;

-- 既存のポリシーを削除（エラーになる場合は無視してください）
DROP POLICY IF EXISTS "Plans are viewable by everyone" ON plans;
DROP POLICY IF EXISTS "Providers can insert their own plans" ON plans;
DROP POLICY IF EXISTS "Providers can update their own plans" ON plans;
DROP POLICY IF EXISTS "Providers can delete their own plans" ON plans;
DROP POLICY IF EXISTS "Providers are viewable by everyone" ON providers;
DROP POLICY IF EXISTS "Anyone can insert providers" ON providers;
DROP POLICY IF EXISTS "Anyone can update providers" ON providers;

-- プランは全員が閲覧可能
CREATE POLICY "Plans are viewable by everyone"
  ON plans FOR SELECT
  USING (true);

-- 事業者は自分のプランのみ作成・更新・削除可能
-- 注意: 簡易実装のため、現在は全員がプランを挿入・更新・削除可能
-- 本番環境では適切な認証（Supabase Auth）を実装し、auth.uid()を使用したポリシーに変更してください
CREATE POLICY "Providers can insert their own plans"
  ON plans FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Providers can update their own plans"
  ON plans FOR UPDATE
  USING (true);

CREATE POLICY "Providers can delete their own plans"
  ON plans FOR DELETE
  USING (true);

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

-- 一般ユーザーテーブル
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  name TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- インデックス作成
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);

-- Row Level Security (RLS) ポリシー
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- 既存のポリシーを削除（エラーになる場合は無視してください）
DROP POLICY IF EXISTS "Users are viewable by everyone" ON users;
DROP POLICY IF EXISTS "Anyone can insert users" ON users;
DROP POLICY IF EXISTS "Anyone can update users" ON users;

-- 一般ユーザー情報のRLSポリシー（簡易実装）
-- 全員がusersテーブルを読み取り可能
CREATE POLICY "Users are viewable by everyone"
  ON users FOR SELECT
  USING (true);

-- 全員がusersテーブルに挿入可能（新規登録用）
CREATE POLICY "Anyone can insert users"
  ON users FOR INSERT
  WITH CHECK (true);

-- 全員がusersテーブルを更新可能（簡易実装）
CREATE POLICY "Anyone can update users"
  ON users FOR UPDATE
  USING (true);

-- お気に入りテーブル
CREATE TABLE IF NOT EXISTS favorites (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  plan_id UUID NOT NULL REFERENCES plans(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, plan_id)
);

-- インデックス作成
CREATE INDEX IF NOT EXISTS idx_favorites_user_id ON favorites(user_id);
CREATE INDEX IF NOT EXISTS idx_favorites_plan_id ON favorites(plan_id);

-- Row Level Security (RLS) ポリシー
ALTER TABLE favorites ENABLE ROW LEVEL SECURITY;

-- 既存のポリシーを削除（エラーになる場合は無視してください）
DROP POLICY IF EXISTS "Favorites are viewable by everyone" ON favorites;
DROP POLICY IF EXISTS "Anyone can insert favorites" ON favorites;
DROP POLICY IF EXISTS "Anyone can delete favorites" ON favorites;

-- お気に入りは全員が閲覧可能（簡易実装）
CREATE POLICY "Favorites are viewable by everyone"
  ON favorites FOR SELECT
  USING (true);

-- 全員がお気に入りを追加可能
CREATE POLICY "Anyone can insert favorites"
  ON favorites FOR INSERT
  WITH CHECK (true);

-- 全員がお気に入りを削除可能
CREATE POLICY "Anyone can delete favorites"
  ON favorites FOR DELETE
  USING (true);

-- 注意: 本番環境では適切な認証・認可を実装してください

-- Storageバケット（plan-images）のRLSポリシー設定
-- 注意: このSQLは、plan-imagesバケットが作成された後に実行してください
-- バケットが存在しない場合は、Supabaseダッシュボードで先に作成してください
-- 注意: storage.objectsはシステムテーブルのため、ALTER TABLEは実行できません
-- RLSは通常、バケット作成時に自動的に有効になっています

-- 既存のポリシーを削除（エラーになる場合は無視してください）
DROP POLICY IF EXISTS "Public Access for plan-images" ON storage.objects;
DROP POLICY IF EXISTS "Anyone can upload to plan-images" ON storage.objects;
DROP POLICY IF EXISTS "Anyone can delete from plan-images" ON storage.objects;

-- 全員がplan-imagesバケットから読み取り可能（公開設定）
-- 注意: ポリシーが既に存在する場合は、上記のDROP POLICYで削除してから実行してください
CREATE POLICY "Public Access for plan-images"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'plan-images');

-- 全員がplan-imagesバケットにアップロード可能（簡易実装）
-- 本番環境では適切な認証を実装し、認証済みユーザーのみアップロード可能にする
CREATE POLICY "Anyone can upload to plan-images"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'plan-images');

-- 全員がplan-imagesバケットのファイルを削除可能（簡易実装）
-- 本番環境では適切な認証を実装し、認証済みユーザーのみ削除可能にする
CREATE POLICY "Anyone can delete from plan-images"
  ON storage.objects FOR DELETE
  USING (bucket_id = 'plan-images');


