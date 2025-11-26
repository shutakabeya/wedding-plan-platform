# セットアップガイド

## 1. Supabaseプロジェクトの作成

1. [Supabase](https://supabase.com)にアクセスしてアカウントを作成
2. 新しいプロジェクトを作成
3. プロジェクトのURLとAnon Keyをメモ

## 2. データベーススキーマの適用

1. Supabaseダッシュボードの「SQL Editor」を開く
2. `supabase/schema.sql` の内容をコピーして実行
3. テーブルが正常に作成されたことを確認

## 3. Storageバケットの作成

1. Supabaseダッシュボードの「Storage」を開く
2. 「New bucket」をクリック
3. バケット名: `plan-images`
4. Public bucket: **ON**（公開設定）
5. 作成

## 4. 環境変数の設定

プロジェクトルートに `.env.local` ファイルを作成：

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

## 5. 開発サーバーの起動

```bash
npm install
npm run dev
```

ブラウザで [http://localhost:3000](http://localhost:3000) を開きます。

## 6. テスト用データの作成（オプション）

事業者アカウントを作成して、テスト用のプランを登録してください。

1. `/provider/signup` で事業者アカウントを作成
2. `/provider/dashboard` でプランを作成
3. トップページで検索して動作確認

## トラブルシューティング

### 画像が表示されない
- Supabase Storageのバケットが公開設定になっているか確認
- `next.config.ts` の画像設定を確認

### 認証エラー
- 環境変数が正しく設定されているか確認
- SupabaseのRLSポリシーを確認

### データベースエラー
- SQLスキーマが正しく適用されているか確認
- Supabaseのログを確認

