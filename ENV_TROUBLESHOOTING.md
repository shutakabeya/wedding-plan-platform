# 環境変数エラーの解決方法

## エラー: "Your project's URL and Key are required to create a Supabase client!"

このエラーは、環境変数が正しく読み込まれていない場合に発生します。

## 解決手順

### 1. `.env.local` ファイルの確認

プロジェクトルート（`wedding-plan-platform`フォルダ）に `.env.local` ファイルが存在し、以下の形式になっているか確認：

```env
NEXT_PUBLIC_SUPABASE_URL=https://uettztvnqzmwitnlmliw.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**重要：**
- ファイル名は `.env.local` であること（`.env` や `.env.local.txt` ではない）
- 値の前後に余分なスペースや引用符がないこと
- 各行の末尾に余分なスペースがないこと

### 2. 開発サーバーの再起動（最重要）

環境変数を変更した後は、**必ず開発サーバーを再起動**してください：

```bash
# 1. 開発サーバーを停止（Ctrl+C）
# 2. 再起動
npm run dev
```

### 3. 環境変数の確認

開発サーバーを起動した後、ブラウザのコンソール（F12）で以下を確認：

```javascript
// ブラウザのコンソールで実行
console.log(process.env.NEXT_PUBLIC_SUPABASE_URL)
console.log(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)
```

**注意：** サーバーサイドの環境変数はブラウザのコンソールでは確認できません。これは正常です。

### 4. ファイルパスの確認

`.env.local` ファイルは、以下の場所に配置されている必要があります：

```
wedding-plan-platform/
├── .env.local          ← ここに配置
├── package.json
├── next.config.ts
└── ...
```

### 5. キャッシュのクリア

それでも解決しない場合、Next.jsのキャッシュをクリア：

```bash
# .nextフォルダを削除
rm -rf .next

# Windowsの場合
rmdir /s .next

# その後、再起動
npm run dev
```

### 6. 環境変数の形式確認

`.env.local` ファイルの形式が正しいか確認：

**正しい形式：**
```env
NEXT_PUBLIC_SUPABASE_URL=https://uettztvnqzmwitnlmliw.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**間違った形式：**
```env
# 引用符で囲まない
NEXT_PUBLIC_SUPABASE_URL="https://..."  ← 間違い

# スペースを入れない
NEXT_PUBLIC_SUPABASE_URL = https://...  ← 間違い

# コメントの形式が間違っている
# NEXT_PUBLIC_SUPABASE_URL=https://...  ← コメントアウトされている
```

## よくある原因

1. **開発サーバーを再起動していない**（最も多い原因）
2. `.env.local` ファイルがプロジェクトルートにない
3. ファイル名が間違っている（`.env` や `.env.local.txt` など）
4. 環境変数の値に余分なスペースや引用符がある
5. `.next` フォルダのキャッシュが古い

## 確認チェックリスト

- [ ] `.env.local` ファイルがプロジェクトルートに存在する
- [ ] ファイル名が正確に `.env.local` である
- [ ] 環境変数の値が正しい（余分なスペースや引用符がない）
- [ ] 開発サーバーを再起動した
- [ ] `.next` フォルダを削除して再起動した（必要に応じて）

