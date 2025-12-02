# CTAスキーマキャッシュエラーの修正方法

## エラー内容
```
PGRST204: Could not find the 'cta_type' column of 'plans' in the schema cache
```

このエラーは、SupabaseのPostgREST（API層）のスキーマキャッシュが更新されていない場合に発生します。

## 解決手順

### ステップ1: データベースにカラムが存在するか確認

SupabaseダッシュボードのSQL Editorで以下を実行：

```sql
-- カラムの存在確認
SELECT column_name, data_type, is_nullable
FROM information_schema.columns 
WHERE table_name = 'plans' 
AND column_name IN ('cta_type', 'cta_value');
```

**期待される結果**: `cta_type`と`cta_value`の2行が表示される

### ステップ2: カラムが存在しない場合

以下のSQLを実行してカラムを追加：

```sql
-- cta_typeカラムを追加
ALTER TABLE plans 
ADD COLUMN IF NOT EXISTS cta_type TEXT;

-- cta_valueカラムを追加
ALTER TABLE plans 
ADD COLUMN IF NOT EXISTS cta_value TEXT;
```

### ステップ3: スキーマキャッシュをリフレッシュ

SupabaseのPostgRESTスキーマキャッシュを更新する方法：

#### 方法1: Supabaseダッシュボードから（推奨）

1. Supabaseダッシュボードにログイン
2. プロジェクトを選択
3. 左側のメニューから「Settings」（⚙️アイコン）をクリック
4. 「API」を選択
5. 「Restart project」または「Reload schema」ボタンを探す（プロジェクトによって異なる）
6. または、プロジェクトを一度停止して再起動

#### 方法2: SQLでスキーマをリフレッシュ

以下のSQLを実行して、スキーマを明示的にリロード：

```sql
-- スキーマをリフレッシュ（PostgreSQLの通知を使用）
NOTIFY pgrst, 'reload schema';
```

#### 方法3: プロジェクトの再起動

1. Supabaseダッシュボードでプロジェクトを開く
2. 「Settings」→「General」
3. 「Restart project」をクリック（利用可能な場合）

### ステップ4: 開発サーバーを再起動

```bash
# 開発サーバーを停止（Ctrl+C）
npm run dev
```

### ステップ5: ブラウザのキャッシュをクリア

1. ブラウザの開発者ツールを開く（F12）
2. ネットワークタブで「Disable cache」にチェック
3. ページをハードリロード（Ctrl+Shift+R または Cmd+Shift+R）

## それでも解決しない場合

### 一時的な回避策

カラムが存在するが、スキーマキャッシュが更新されない場合、一時的に以下の方法で回避できます：

1. **カラムを一度削除して再作成**
   ```sql
   -- 既存のカラムを削除
   ALTER TABLE plans DROP COLUMN IF EXISTS cta_type;
   ALTER TABLE plans DROP COLUMN IF EXISTS cta_value;
   
   -- カラムを再作成
   ALTER TABLE plans ADD COLUMN cta_type TEXT;
   ALTER TABLE plans ADD COLUMN cta_value TEXT;
   ```

2. **Supabaseサポートに問い合わせ**
   - Supabaseダッシュボードの「Support」から問い合わせ
   - エラーメッセージとスキーマ情報を共有

## 確認方法

修正後、以下で確認：

1. **SQL Editorで確認**
   ```sql
   SELECT cta_type, cta_value FROM plans LIMIT 1;
   ```
   エラーが発生しなければ、カラムは存在しています。

2. **Table Editorで確認**
   - Supabaseダッシュボードの「Table Editor」
   - `plans`テーブルを開く
   - `cta_type`と`cta_value`カラムが表示されることを確認

3. **アプリケーションで確認**
   - プラン編集ページでCTAを設定
   - エラーが発生しないことを確認


