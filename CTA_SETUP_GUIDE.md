# CTA機能のセットアップガイド

このガイドでは、プランのCTA（Call To Action）機能を有効にするために、Supabaseで行う必要がある手動作業を説明します。

## エラーが発生した場合の対処法

### エラー: "Could not find the 'cta_type' column of 'plans' in the schema cache"

このエラーは、データベースにカラムが追加されていないか、Supabaseのスキーマキャッシュが更新されていない場合に発生します。

## 解決手順

### 1. データベースにカラムが存在するか確認

Supabaseダッシュボードで以下を実行してください：

1. **SQL Editorを開く**
   - 左側のメニューから「SQL Editor」をクリック

2. **以下のSQLを実行してカラムの存在を確認**
   ```sql
   SELECT column_name, data_type 
   FROM information_schema.columns 
   WHERE table_name = 'plans' 
   AND column_name IN ('cta_type', 'cta_value');
   ```

3. **結果を確認**
   - `cta_type`と`cta_value`の2行が表示されれば、カラムは存在しています
   - 何も表示されない場合は、カラムが追加されていません

### 2. カラムが存在しない場合

以下のSQLを実行してカラムを追加してください：

```sql
-- cta_typeカラムを追加
ALTER TABLE plans 
ADD COLUMN IF NOT EXISTS cta_type TEXT;

-- cta_valueカラムを追加
ALTER TABLE plans 
ADD COLUMN IF NOT EXISTS cta_value TEXT;
```

### 3. カラムが存在する場合（スキーマキャッシュの問題）

Supabaseのスキーマキャッシュを更新するために、以下を試してください：

1. **開発サーバーを再起動**
   ```bash
   # 開発サーバーを停止（Ctrl+C）
   # 再度起動
   npm run dev
   ```

2. **ブラウザのキャッシュをクリア**
   - ブラウザの開発者ツールを開く（F12）
   - ネットワークタブで「Disable cache」にチェック
   - ページをリロード（Ctrl+Shift+R または Cmd+Shift+R）

3. **Supabaseダッシュボードで確認**
   - Table Editorで`plans`テーブルを開く
   - `cta_type`と`cta_value`カラムが表示されているか確認

### 4. それでも解決しない場合

以下のSQLを実行して、カラムを一度削除してから再作成してください：

```sql
-- 既存のカラムを削除（データは失われます）
ALTER TABLE plans DROP COLUMN IF EXISTS cta_type;
ALTER TABLE plans DROP COLUMN IF EXISTS cta_value;

-- カラムを再作成
ALTER TABLE plans 
ADD COLUMN cta_type TEXT;

ALTER TABLE plans 
ADD COLUMN cta_value TEXT;
```

## 動作確認

1. **プラン作成ページで確認**
   - `/provider/plan/new`にアクセス
   - 「相談ボタン設定」セクションが表示されることを確認
   - 電話・メール・リンクを選択できることを確認

2. **プラン編集ページで確認**
   - 既存のプランを編集
   - CTA設定が保存・読み込まれることを確認

3. **プランページで確認**
   - プランページにアクセス
   - 「まずは相談してみる」ボタンが正しく動作することを確認

## トラブルシューティング

### エラー: "Error updating plan: {}"

このエラーは、エラーオブジェクトが空の場合に発生します。改善されたエラーハンドリングにより、より詳細なエラーメッセージが表示されるようになりました。

### カラムが表示されない

- SupabaseダッシュボードのTable Editorで確認
- SQL Editorで`SELECT * FROM plans LIMIT 1;`を実行して、カラムが存在するか確認

### データが保存されない

- ブラウザの開発者ツールのコンソールでエラーを確認
- ネットワークタブでAPIリクエストのレスポンスを確認

## 完了後の確認

すべての手順を完了したら、以下を確認してください：

1. ✅ `plans`テーブルに`cta_type`カラムが存在する
2. ✅ `plans`テーブルに`cta_value`カラムが存在する
3. ✅ プラン作成・編集ページでCTA設定ができる
4. ✅ プランページでCTAボタンが正しく動作する


