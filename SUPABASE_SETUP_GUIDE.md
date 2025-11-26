# Supabase設定完全ガイド

## 📋 目次

1. [Supabaseプロジェクトの作成](#1-supabaseプロジェクトの作成)
2. [環境変数の設定](#2-環境変数の設定)
3. [データベーススキーマの適用](#3-データベーススキーマの適用)
4. [Storageバケットの作成](#4-storageバケットの作成)
5. [RLSポリシーの確認](#5-rlsポリシーの確認)
6. [動作確認](#6-動作確認)

---

## 1. Supabaseプロジェクトの作成

### ステップ1: Supabaseアカウントの作成

1. [Supabase](https://supabase.com)にアクセス
2. 「Start your project」をクリック
3. GitHubアカウントでログイン（推奨）またはメールアドレスで登録

### ステップ2: 新しいプロジェクトを作成

1. ダッシュボードで「New Project」をクリック
2. 以下の情報を入力：
   - **Organization**: 既存の組織を選択、または新規作成
   - **Project Name**: `wedding-plan-platform`（任意の名前）
   - **Database Password**: 強力なパスワードを設定（**必ずメモしておく**）
   - **Region**: `Northeast Asia (Tokyo)` を推奨（日本からのアクセスが速い）
3. 「Create new project」をクリック
4. プロジェクトの作成完了まで2-3分待機

---

## 2. 環境変数の設定

### ステップ1: API認証情報の取得

1. Supabaseダッシュボードでプロジェクトを開く
2. 左サイドバーの「Settings」（⚙️アイコン）をクリック
3. 「API」を選択
4. 以下の情報をコピー：
   - **Project URL**: `https://xxxxxxxxxxxxx.supabase.co`
   - **anon public** キー: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`

### ステップ2: `.env.local` ファイルの作成

プロジェクトルート（`wedding-plan-platform`フォルダ）に `.env.local` ファイルを作成：

```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxxxxxxxxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**重要：**
- `.env.local` ファイルは `.gitignore` に含まれているため、GitHubにはアップロードされません
- 環境変数を変更した後は、**必ず開発サーバーを再起動**してください

### ステップ3: 環境変数の確認

開発サーバーを起動して、環境変数が正しく読み込まれているか確認：

```bash
npm run dev
```

ブラウザのコンソール（F12）でエラーが出ないことを確認してください。

---

## 3. データベーススキーマの適用

### ステップ1: SQL Editorを開く

1. Supabaseダッシュボードで「SQL Editor」をクリック
2. 「New query」をクリック

### ステップ2: スキーマを実行

1. プロジェクト内の `supabase/schema.sql` ファイルを開く
2. ファイルの内容をすべてコピー
3. SupabaseのSQL Editorに貼り付け
4. 「Run」ボタンをクリック（または `Ctrl+Enter`）

### ステップ3: テーブルの確認

1. 左サイドバーの「Table Editor」をクリック
2. 以下のテーブルが作成されているか確認：
   - ✅ `providers` テーブル
   - ✅ `plans` テーブル

---

## 4. Storageバケットの作成

### ステップ1: Storageを開く

1. Supabaseダッシュボードで「Storage」をクリック
2. 「New bucket」をクリック

### ステップ2: バケットを作成

以下の設定でバケットを作成：

- **Name**: `plan-images`
- **Public bucket**: **ON**（公開設定にチェック）
- 「Create bucket」をクリック

### ステップ3: バケットポリシーの設定（オプション）

画像のアップロードを許可するため、必要に応じてポリシーを設定：

1. `plan-images` バケットをクリック
2. 「Policies」タブを開く
3. 必要に応じてポリシーを追加

---

## 5. RLSポリシーの確認

### 現在のRLSポリシー

`supabase/schema.sql` を実行すると、以下のRLSポリシーが自動的に設定されます：

#### `providers` テーブル
- ✅ 全員が読み取り可能
- ✅ 全員が挿入可能（新規登録用）
- ✅ 全員が更新可能

#### `plans` テーブル
- ✅ 全員が読み取り可能
- ⚠️ 挿入・更新・削除は `auth.uid()` と `provider_id` が一致する場合のみ（現在は簡易実装のため動作しない可能性あり）

### RLSポリシーの確認方法

1. Supabaseダッシュボードで「Table Editor」を開く
2. テーブルを選択
3. 「Policies」タブでポリシーを確認

---

## 6. 動作確認

### ステップ1: 開発サーバーの起動

```bash
npm run dev
```

### ステップ2: 新規登録のテスト

1. ブラウザで `http://localhost:3000/provider/signup` を開く
2. 以下の情報を入力：
   - メールアドレス
   - パスワード（6文字以上）
   - 事業者名
3. 「登録」をクリック
4. エラーが出ないことを確認

### ステップ3: ログインのテスト

1. `http://localhost:3000/provider/login` を開く
2. 登録したメールアドレスとパスワードでログイン
3. ダッシュボードに遷移することを確認

### ステップ4: プラン作成のテスト

1. ダッシュボードで「新規プラン作成」をクリック
2. プラン情報を入力
3. 画像をアップロード（オプション）
4. 「プランを作成」をクリック
5. プランが作成されることを確認

---

## 🔧 トラブルシューティング

### エラー: `NEXT_PUBLIC_SUPABASE_URL is not defined`

**原因**: 環境変数が設定されていない

**解決方法**:
1. `.env.local` ファイルがプロジェクトルートに存在するか確認
2. 環境変数の値が正しいか確認
3. 開発サーバーを再起動

### エラー: `Failed to fetch` または `Invalid API key`

**原因**: Supabase URLまたはAPIキーが間違っている

**解決方法**:
1. SupabaseダッシュボードでAPI認証情報を再確認
2. `.env.local` の値を更新
3. 開発サーバーを再起動

### エラー: `new row violates row-level security policy`

**原因**: RLSポリシーが正しく設定されていない

**解決方法**:
1. SupabaseダッシュボードでRLSポリシーを確認
2. `supabase/schema.sql` を再実行
3. テーブルの「Policies」タブでポリシーを確認

### エラー: `relation "providers" does not exist`

**原因**: データベーススキーマが適用されていない

**解決方法**:
1. `supabase/schema.sql` をSupabaseのSQL Editorで実行
2. テーブルが作成されているか確認

### 画像がアップロードできない

**原因**: Storageバケットが作成されていない、または公開設定になっていない

**解決方法**:
1. `plan-images` バケットが存在するか確認
2. バケットが「Public」設定になっているか確認
3. 必要に応じてバケットを再作成

---

## 📝 チェックリスト

セットアップが完了したら、以下を確認してください：

- [ ] Supabaseプロジェクトが作成されている
- [ ] `.env.local` ファイルが作成されている
- [ ] `NEXT_PUBLIC_SUPABASE_URL` が正しく設定されている
- [ ] `NEXT_PUBLIC_SUPABASE_ANON_KEY` が正しく設定されている
- [ ] `providers` テーブルが存在する
- [ ] `plans` テーブルが存在する
- [ ] `plan-images` Storageバケットが作成されている
- [ ] RLSポリシーが設定されている
- [ ] 新規登録が動作する
- [ ] ログインが動作する
- [ ] プラン作成が動作する

---

## 🔒 セキュリティに関する注意事項

### 現在の実装（MVP）

- ⚠️ パスワードは平文で保存されています（本番環境では使用しないでください）
- ⚠️ 認証は簡易実装です（localStorageを使用）
- ⚠️ RLSポリシーは緩い設定です

### 本番環境への移行時

1. **Supabase Authを使用**: 適切な認証システムを実装
2. **パスワードのハッシュ化**: bcryptなどを使用
3. **セッション管理**: HttpOnly Cookieを使用
4. **RLSポリシーの強化**: 適切な権限管理を実装
5. **環境変数の保護**: 本番環境では適切に管理

---

## 📚 参考リンク

- [Supabase公式ドキュメント](https://supabase.com/docs)
- [Next.js環境変数](https://nextjs.org/docs/basic-features/environment-variables)
- [Supabase Storage](https://supabase.com/docs/guides/storage)

