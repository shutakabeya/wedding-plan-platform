# 結婚式プラン送客プラットフォーム（MVP）

Next.js + TypeScript + Supabaseで構築された結婚式・前撮りプラン検索プラットフォームのMVPです。

## 機能

### ユーザー向け機能
- **トップページ**: 自然文検索バーと3つの検索入口ボタン（値段・規模・世界観）
- **検索結果ページ**: フィルタ検索とプランカード一覧表示
- **プラン詳細ページ**: プランの詳細情報、画像、提供者情報の表示
- **LINE相談**: LINE相談ページへの遷移

### 事業者向け機能
- **新規登録・ログイン**: 事業者アカウントの作成と認証
- **ダッシュボード**: 登録プラン一覧の表示
- **プラン作成・編集**: プラン情報の登録と編集

## 技術スタック

- **フレームワーク**: Next.js 14 (App Router)
- **言語**: TypeScript
- **データベース**: Supabase (PostgreSQL)
- **認証**: Supabase Auth（簡易実装）
- **ストレージ**: Supabase Storage（画像アップロード）
- **スタイリング**: Tailwind CSS

## セットアップ

### 1. 依存関係のインストール

```bash
npm install
```

### 2. Supabaseのセットアップ

1. [Supabase](https://supabase.com)でプロジェクトを作成
2. SQL Editorで `supabase/schema.sql` を実行してテーブルを作成
3. Storageで `plan-images` バケットを作成（公開設定）

### 3. 環境変数の設定

`.env.local` ファイルを作成し、以下を設定：

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 4. 開発サーバーの起動

```bash
npm run dev
```

ブラウザで [http://localhost:3000](http://localhost:3000) を開きます。

## プロジェクト構造

```
wedding-plan-platform/
├── app/                    # Next.js App Router
│   ├── page.tsx           # トップページ
│   ├── search/            # 検索結果ページ
│   ├── plan/[id]/         # プラン詳細ページ
│   ├── provider/          # 事業者管理
│   │   ├── login/         # ログイン
│   │   ├── signup/        # 新規登録
│   │   ├── dashboard/     # ダッシュボード
│   │   └── plan/          # プラン管理
│   └── line/              # LINE相談ページ
├── components/             # Reactコンポーネント
│   ├── LineConsultationButton.tsx
│   ├── PlanCard.tsx
│   ├── SearchFilters.tsx
│   ├── SearchResults.tsx
│   └── SortSelector.tsx
├── lib/
│   └── supabase/          # Supabaseクライアント
│       ├── client.ts      # ブラウザ用
│       └── server.ts      # サーバー用
├── types/
│   └── database.ts        # 型定義
└── supabase/
    └── schema.sql         # データベーススキーマ
```

## データベーススキーマ

### providers（事業者）
- id, email, password_hash, name, bio, sns_links, created_at

### plans（プラン）
- id, provider_id, title, price, scale, world_view, location, purpose, date_range, images, summary_points, description, created_at, updated_at

## 注意事項

### MVPの制限事項

1. **認証**: 簡易実装のため、本番環境では適切な認証・認可を実装してください
2. **パスワード**: パスワードのハッシュ化は簡易実装です。本番環境ではbcryptなどを使用してください
3. **セッション管理**: localStorageを使用した簡易実装です。本番環境では適切なセッション管理を実装してください
4. **画像アップロード**: Supabase Storageのバケット設定が必要です

### 本番環境への移行時の推奨事項

- Supabase Authを使用した適切な認証実装
- パスワードのハッシュ化（bcrypt）
- セッション管理の改善（JWT、HttpOnly Cookie）
- エラーハンドリングの強化
- バリデーションの追加
- 画像最適化
- SEO対策

## ライセンス

MIT
