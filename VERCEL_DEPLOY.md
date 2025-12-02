# Vercelデプロイガイド

## 環境変数の設定方法

Vercelにデプロイする際は、以下の環境変数を設定する必要があります。

### 必要な環境変数

以下の2つの環境変数が必須です：

| Key | Value の例 | 説明 |
|-----|-----------|------|
| `NEXT_PUBLIC_SUPABASE_URL` | `https://xxxxxxxxxxxxx.supabase.co` | SupabaseプロジェクトのURL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...` | Supabaseのanon publicキー |

### 環境変数の取得方法

1. [Supabase](https://supabase.com)にログイン
2. プロジェクトを選択
3. 左サイドバーの「Settings」（⚙️アイコン）をクリック
4. 「API」を選択
5. 以下の情報をコピー：
   - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL` の値
   - **anon public** キー → `NEXT_PUBLIC_SUPABASE_ANON_KEY` の値

### Vercelでの環境変数設定手順

#### 方法1: Vercelダッシュボードで設定（推奨）

1. [Vercel Dashboard](https://vercel.com/dashboard)にログイン
2. プロジェクトを選択（または新規プロジェクトを作成）
3. プロジェクトページで「Settings」タブをクリック
4. 左サイドバーから「Environment Variables」を選択
5. 以下の環境変数を追加：

   **環境変数1:**
   - **Name**: `NEXT_PUBLIC_SUPABASE_URL`
   - **Value**: `https://xxxxxxxxxxxxx.supabase.co`（実際のSupabase URL）
   - **Environment**: 
     - ✅ Production（本番環境）
     - ✅ Preview（プレビュー環境）
     - ✅ Development（開発環境）

   **環境変数2:**
   - **Name**: `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - **Value**: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`（実際のanon key）
   - **Environment**: 
     - ✅ Production（本番環境）
     - ✅ Preview（プレビュー環境）
     - ✅ Development（開発環境）

6. 「Save」ボタンをクリック
7. 既にデプロイ済みの場合は、新しいデプロイを実行（または既存のデプロイを「Redeploy」）

#### 方法2: Vercel CLIで設定

```bash
# Vercel CLIをインストール（未インストールの場合）
npm i -g vercel

# プロジェクトにログイン
vercel login

# 環境変数を設定
vercel env add NEXT_PUBLIC_SUPABASE_URL production
vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY production

# プレビュー環境にも追加
vercel env add NEXT_PUBLIC_SUPABASE_URL preview
vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY preview
```

### 環境変数設定の確認

環境変数を設定後、以下の方法で確認できます：

1. **Vercelダッシュボード**: Settings > Environment Variables で一覧を確認
2. **デプロイログ**: デプロイ時に環境変数が読み込まれているか確認
3. **ブラウザコンソール**: 本番環境で `console.log(process.env.NEXT_PUBLIC_SUPABASE_URL)` を実行（サーバーサイドのみ）

### 重要な注意点

1. **環境変数の値に引用符は不要**
   - ✅ 正しい: `https://xxxxxxxxxxxxx.supabase.co`
   - ❌ 間違い: `"https://xxxxxxxxxxxxx.supabase.co"`

2. **環境変数名は正確に**
   - `NEXT_PUBLIC_` プレフィックスが重要（クライアントサイドで使用するため）

3. **デプロイ後の再デプロイ**
   - 環境変数を追加/変更した後は、新しいデプロイが必要です
   - 既存のデプロイを「Redeploy」するか、新しいコミットをプッシュ

4. **セキュリティ**
   - `NEXT_PUBLIC_` で始まる環境変数は、クライアントサイド（ブラウザ）に公開されます
   - これらは公開情報として扱われるため、機密情報を含めないでください
   - Supabaseの`anon key`は公開されても問題ありません（RLSポリシーで保護）

### トラブルシューティング

#### エラー: "Missing Supabase environment variables"

- 環境変数が正しく設定されているか確認
- 環境変数名にスペースやタイプミスがないか確認
- デプロイを再実行してみる

#### 環境変数が反映されない

- 環境変数を設定した後、新しいデプロイを実行
- Vercelダッシュボードの「Deployments」から「Redeploy」を実行

#### 本番環境でのみエラーが出る

- 環境変数の「Environment」設定を確認
- Production環境に環境変数が設定されているか確認

### デプロイ後の確認

1. デプロイが成功したことを確認
2. 本番URLにアクセスしてアプリが正常に動作するか確認
3. ブラウザの開発者ツール（F12）でエラーがないか確認
4. Supabaseのデータベース接続が正常に動作するか確認


