-- CTAカラムの追加と確認用SQL

-- 1. カラムが存在するか確認
SELECT column_name, data_type, is_nullable
FROM information_schema.columns 
WHERE table_name = 'plans' 
AND column_name IN ('cta_type', 'cta_value');

-- 2. カラムが存在しない場合は追加
-- 注意: 既に存在する場合はエラーになりますが、問題ありません
ALTER TABLE plans 
ADD COLUMN IF NOT EXISTS cta_type TEXT;

ALTER TABLE plans 
ADD COLUMN IF NOT EXISTS cta_value TEXT;

-- 3. カラムが正しく追加されたか確認
SELECT column_name, data_type, is_nullable
FROM information_schema.columns 
WHERE table_name = 'plans' 
AND column_name IN ('cta_type', 'cta_value');

-- 4. 既存のプランデータを確認（CTAが設定されているか）
SELECT id, title, cta_type, cta_value 
FROM plans 
LIMIT 5;


