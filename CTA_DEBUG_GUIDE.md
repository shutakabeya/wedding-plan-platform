# CTA機能のデバッグガイド

## 問題: CTAが動作しない

スキーマをリフレッシュしたのにCTAが動かない場合、以下の原因が考えられます。

## 確認手順

### 1. データベースにカラムが存在するか確認

SupabaseダッシュボードのSQL Editorで以下を実行：

```sql
-- カラムの存在確認
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'plans' 
AND column_name IN ('cta_type', 'cta_value');
```

**期待される結果**: `cta_type`と`cta_value`の2行が表示される

### 2. データが実際に保存されているか確認

```sql
-- プランのCTAデータを確認
SELECT id, title, cta_type, cta_value 
FROM plans 
WHERE cta_type IS NOT NULL 
LIMIT 10;
```

**期待される結果**: CTAを設定したプランのデータが表示される

### 3. ブラウザのコンソールで確認

1. プラン編集ページを開く
2. ブラウザの開発者ツール（F12）を開く
3. コンソールタブを開く
4. プランを読み込んだときに以下のログが表示されるか確認：
   ```
   Loaded CTA data: { cta_type: 'phone', cta_value: '07041552775' }
   ```

5. プランページを開いたときに以下のログが表示されるか確認：
   ```
   Plan CTA data: { cta_type: 'phone', cta_value: '07041552775' }
   ```

### 4. 更新処理が成功しているか確認

1. プラン編集ページでCTAを設定
2. 「変更を保存」をクリック
3. コンソールでエラーが表示されないか確認
4. 成功メッセージが表示されるか確認

### 5. プランページでCTAが表示されるか確認

1. プランページを開く
2. ページ下部の「相談ボタン」セクションを確認
3. 以下のいずれかが表示されるはず：
   - 「電話で相談する」（電話の場合）
   - 「メールで相談する」（メールの場合）
   - 「まずは相談してみる」（リンクの場合）
   - 「LINEで相談する」（CTAが設定されていない場合）

## よくある問題と解決方法

### 問題1: カラムが存在しない

**症状**: SQLでカラムが表示されない

**解決方法**:
```sql
ALTER TABLE plans ADD COLUMN IF NOT EXISTS cta_type TEXT;
ALTER TABLE plans ADD COLUMN IF NOT EXISTS cta_value TEXT;
```

### 問題2: データが保存されていない

**症状**: コンソールに「Loaded CTA data: { cta_type: null, cta_value: null }」と表示される

**原因**: 
- 更新処理が失敗している
- スキーマキャッシュエラーが発生している

**解決方法**:
1. コンソールでエラーメッセージを確認
2. エラーが`PGRST204`の場合は、スキーマキャッシュをリフレッシュ
3. それ以外のエラーの場合は、エラーメッセージに従って対処

### 問題3: データは保存されているが表示されない

**症状**: データベースにはデータがあるが、プランページでCTAボタンが表示されない

**原因**:
- プランページの条件分岐に問題がある
- データの型が正しくない

**解決方法**:
1. ブラウザのコンソールで「Plan CTA data」を確認
2. `cta_type`と`cta_value`が正しく取得されているか確認
3. 値が`null`や空文字列でないか確認

### 問題4: スキーマキャッシュが更新されない

**症状**: `PGRST204`エラーが継続する

**解決方法**:
1. Supabaseダッシュボードでプロジェクトを再起動
2. または、以下のSQLを実行：
   ```sql
   NOTIFY pgrst, 'reload schema';
   ```
3. 開発サーバーを再起動
4. ブラウザのキャッシュをクリア

## デバッグ用SQL

### 特定のプランのCTAデータを確認

```sql
SELECT id, title, cta_type, cta_value 
FROM plans 
WHERE id = 'your-plan-id';
```

### すべてのプランのCTAデータを確認

```sql
SELECT id, title, cta_type, cta_value 
FROM plans 
ORDER BY updated_at DESC;
```

### CTAが設定されていないプランを確認

```sql
SELECT id, title 
FROM plans 
WHERE cta_type IS NULL OR cta_value IS NULL;
```

## 次のステップ

上記の確認手順を実行して、どの段階で問題が発生しているか特定してください。

1. カラムが存在しない → カラムを追加
2. データが保存されない → 更新処理のエラーを確認
3. データが表示されない → プランページのコードを確認
4. スキーマキャッシュエラー → スキーマをリフレッシュ

