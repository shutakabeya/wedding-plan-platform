-- Storageバケット（plan-images）のRLSポリシー設定
-- このSQLは、plan-imagesバケットが作成された後に実行してください

-- storage.objectsテーブルに対してRLSを有効化（既に有効な場合はエラーになりますが問題ありません）
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

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

