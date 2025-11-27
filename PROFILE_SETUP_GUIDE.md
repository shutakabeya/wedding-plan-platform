# 事業者プロフィール機能のセットアップガイド

このガイドでは、事業者のプロフィール画像機能を有効にするために、Supabaseで行う必要がある手動作業を説明します。

## 目次
1. [データベーススキーマの更新](#1-データベーススキーマの更新)
2. [ストレージバケットの作成](#2-ストレージバケットの作成)
3. [ストレージポリシーの設定](#3-ストレージポリシーの設定)

---

## 1. データベーススキーマの更新

`providers`テーブルに`profile_image`カラムを追加する必要があります。

### 手順

1. **Supabaseダッシュボードにログイン**
   - https://app.supabase.com にアクセス
   - プロジェクトを選択

2. **SQL Editorを開く**
   - 左側のメニューから「SQL Editor」をクリック

3. **以下のSQLを実行**
   ```sql
   -- providersテーブルにprofile_imageカラムを追加
   ALTER TABLE providers 
   ADD COLUMN IF NOT EXISTS profile_image TEXT;
   ```

4. **実行確認**
   - 「Run」ボタンをクリック
   - エラーが表示されなければ成功です

5. **確認方法**
   - 左側のメニューから「Table Editor」をクリック
   - `providers`テーブルを選択
   - カラム一覧に`profile_image`が表示されていることを確認

---

## 2. ストレージバケットの作成

プロフィール画像を保存するためのストレージバケット`provider-profiles`を作成します。

### 手順

1. **Storageページを開く**
   - 左側のメニューから「Storage」をクリック

2. **新しいバケットを作成**
   - 「New bucket」ボタンをクリック

3. **バケット設定**
   - **Name**: `provider-profiles`（正確にこの名前を入力）
   - **Public bucket**: ✅ **チェックを入れる**（公開バケットにする）
   - 「Create bucket」ボタンをクリック

4. **確認**
   - バケット一覧に`provider-profiles`が表示されていることを確認

### 注意事項
- バケット名は正確に`provider-profiles`である必要があります（大文字小文字も含めて）
- 公開バケットにすることで、プロフィール画像が誰でも閲覧可能になります

---

## 3. ストレージポリシーの設定

作成したバケットに対して、適切なアクセス権限を設定します。

### 手順

1. **SQL Editorを開く**
   - 左側のメニューから「SQL Editor」をクリック

2. **以下のSQLを実行**
   ```sql
   -- Storageバケット（provider-profiles）のRLSポリシー設定
   -- このSQLは、provider-profilesバケットが作成された後に実行してください

   -- 既存のポリシーを削除（エラーになる場合は無視してください）
   DROP POLICY IF EXISTS "Public Access for provider-profiles" ON storage.objects;
   DROP POLICY IF EXISTS "Anyone can upload to provider-profiles" ON storage.objects;
   DROP POLICY IF EXISTS "Anyone can delete from provider-profiles" ON storage.objects;

   -- 全員がprovider-profilesバケットから読み取り可能（公開設定）
   CREATE POLICY "Public Access for provider-profiles"
     ON storage.objects FOR SELECT
     USING (bucket_id = 'provider-profiles');

   -- 全員がprovider-profilesバケットにアップロード可能（簡易実装）
   -- 本番環境では適切な認証を実装し、認証済みユーザーのみアップロード可能にする
   CREATE POLICY "Anyone can upload to provider-profiles"
     ON storage.objects FOR INSERT
     WITH CHECK (bucket_id = 'provider-profiles');

   -- 全員がprovider-profilesバケットのファイルを削除可能（簡易実装）
   -- 本番環境では適切な認証を実装し、認証済みユーザーのみ削除可能にする
   CREATE POLICY "Anyone can delete from provider-profiles"
     ON storage.objects FOR DELETE
     USING (bucket_id = 'provider-profiles');
   ```

3. **実行確認**
   - 「Run」ボタンをクリック
   - エラーが表示されなければ成功です

4. **確認方法**
   - 左側のメニューから「Storage」→「Policies」をクリック
   - `provider-profiles`バケットのポリシー一覧に3つのポリシーが表示されていることを確認
     - Public Access for provider-profiles
     - Anyone can upload to provider-profiles
     - Anyone can delete from provider-profiles

---

## 実行順序

以下の順序で実行してください：

1. ✅ **データベーススキーマの更新**（手順1）
2. ✅ **ストレージバケットの作成**（手順2）
3. ✅ **ストレージポリシーの設定**（手順3）

---

## トラブルシューティング

### エラー: "column already exists"
- `profile_image`カラムが既に存在している場合に表示されます
- 問題ありません。次のステップに進んでください

### エラー: "bucket already exists"
- `provider-profiles`バケットが既に存在している場合に表示されます
- 既存のバケットを使用して、次のステップに進んでください

### エラー: "policy already exists"
- ポリシーが既に存在している場合に表示されます
- `DROP POLICY IF EXISTS`が実行されているので、問題ありません
- 再度`CREATE POLICY`を実行してください

### プロフィール画像が表示されない
1. バケットが公開設定になっているか確認
2. ストレージポリシーが正しく設定されているか確認
3. ブラウザの開発者ツールでエラーを確認

---

## 本番環境での注意事項

現在の設定は簡易実装のため、誰でも画像のアップロード・削除が可能です。
本番環境では、以下の改善を推奨します：

1. **認証済みユーザーのみアップロード可能にする**
   - ストレージポリシーで`auth.uid()`を使用して認証チェックを追加

2. **自分の画像のみ削除可能にする**
   - ファイル名にユーザーIDを含める
   - ポリシーでファイル名のパターンマッチングを行う

3. **画像サイズの制限**
   - フロントエンドでファイルサイズをチェック
   - 必要に応じて画像リサイズ機能を追加

---

## 完了後の確認

すべての手順を完了したら、以下を確認してください：

1. ✅ `providers`テーブルに`profile_image`カラムが存在する
2. ✅ `provider-profiles`バケットが作成されている
3. ✅ バケットが公開設定になっている
4. ✅ ストレージポリシーが3つ設定されている

これで、事業者がプロフィール画像をアップロードできるようになります！

