# トラブルシューティングガイド

## ログイン・新規登録ができない場合

### 1. 環境変数の確認（最重要）

プロジェクトルートに `.env.local` ファイルが存在し、正しく設定されているか確認してください。

`.env.local` ファイルを作成（存在しない場合）：
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

**確認方法：**
1. Supabaseダッシュボードにログイン
2. プロジェクト設定 → API を開く
3. `Project URL` を `NEXT_PUBLIC_SUPABASE_URL` にコピー
4. `anon public` キーを `NEXT_PUBLIC_SUPABASE_ANON_KEY` にコピー

**注意：**
- `.env.local` ファイルは `.gitignore` に含まれているため、Gitにはコミットされません
- 環境変数を変更した後は、**開発サーバーを再起動**してください

### 2. Supabaseテーブルの確認

Supabaseダッシュボードで以下を確認：

1. **Table Editor** を開く
2. `providers` テーブルが存在するか確認
3. `plans` テーブルが存在するか確認

テーブルが存在しない場合：
1. **SQL Editor** を開く
2. `supabase/schema.sql` の内容をコピー＆ペースト
3. **Run** をクリックして実行

### 3. RLS（Row Level Security）ポリシーの確認

`providers` テーブルに対するRLSポリシーが不足している可能性があります。

Supabaseダッシュボードの **SQL Editor** で以下を実行：

```sql
-- providersテーブルのRLSポリシーを追加
-- 全員がprovidersテーブルを読み取り可能（簡易実装）
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
```

### 4. ブラウザのコンソールでエラーを確認

1. ブラウザの開発者ツールを開く（F12）
2. **Console** タブを開く
3. ログイン/新規登録を試す
4. エラーメッセージを確認

よくあるエラー：
- `NEXT_PUBLIC_SUPABASE_URL is not defined` → 環境変数が設定されていない
- `Failed to fetch` → Supabase URLが間違っている、またはネットワークエラー
- `new row violates row-level security policy` → RLSポリシーの問題

### 5. 開発サーバーの再起動

環境変数を変更した後は、必ず開発サーバーを再起動してください：

```bash
# サーバーを停止（Ctrl+C）
# その後、再起動
npm run dev
```

### 6. Supabase Storageバケットの確認

画像アップロード機能を使用する場合：

1. Supabaseダッシュボードの **Storage** を開く
2. `plan-images` バケットが存在するか確認
3. 存在しない場合は作成：
   - **New bucket** をクリック
   - バケット名: `plan-images`
   - **Public bucket**: ON（公開設定）
   - 作成

## 確認チェックリスト

- [ ] `.env.local` ファイルが存在する
- [ ] `NEXT_PUBLIC_SUPABASE_URL` が正しく設定されている
- [ ] `NEXT_PUBLIC_SUPABASE_ANON_KEY` が正しく設定されている
- [ ] 開発サーバーを再起動した
- [ ] `providers` テーブルが存在する
- [ ] `plans` テーブルが存在する
- [ ] RLSポリシーが設定されている
- [ ] ブラウザのコンソールにエラーがない

## それでも解決しない場合

1. Supabaseダッシュボードの **Logs** を確認
2. エラーメッセージの全文を確認
3. `supabase/schema.sql` が正しく実行されているか確認

