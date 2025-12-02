# データ構造の重大な欠陥と修正点

## 🔴 重大な問題（即座に対応が必要）

### 1. **スキーマと型定義の不一致：`scale`フィールド**

**問題点:**
- **データベーススキーマ** (`supabase/schema.sql:21`) のコメントには `"0", "2-10", "10-30", "30-60", "60+"` と記載
- **型定義** (`types/database.ts:81-88`) では日本語の値が定義されている：
  - `'ふたりのみ'`, `'〜10名（家族婚）'`, `'10〜30名（少人数）'`, など
- **実際のデータ**がどちらの形式で保存されているか不明確

**影響:**
- 検索機能が正しく動作しない可能性（`SearchResults.tsx:69`で `query.eq('scale', searchParams.scale)` を使用）
- UIで選択した値とデータベースに保存されている値が一致しない

**修正方法:**
1. データベーススキーマのコメントを実際の使用値（日本語）に更新
2. または、既存データを移行して統一された値を使用
3. チェック制約を追加して、有効な値のみ受け付けるようにする

```sql
-- 推奨: CHECK制約を追加
ALTER TABLE plans 
  DROP CONSTRAINT IF EXISTS check_scale_valid;
  
ALTER TABLE plans 
  ADD CONSTRAINT check_scale_valid 
  CHECK (scale IN (
    'ふたりのみ',
    '〜10名（家族婚）',
    '10〜30名（少人数）',
    '30〜60名（中規模）',
    '60〜100名（大規模）',
    '100名以上（大型）'
  ));
```

---

### 2. **セキュリティ：パスワードの平文保存**

**問題点:**
- `providers`テーブルと`users`テーブルの`password_hash`カラムに**パスワードが平文で保存**されている
- 実際のファイル（`app/provider/signup/page.tsx:50`, `app/signup/page.tsx:44`）でも平文で保存されている

**影響:**
- データベースが漏洩した場合、全ユーザーのパスワードが露出
- GDPR、個人情報保護法などの法的リスク

**修正方法:**
1. **Supabase Auth**を使用して認証を実装（推奨）
2. または、サーバーサイドでbcryptなどを使ってハッシュ化

```typescript
// 現在（危険）
password_hash: formData.password

// 修正後（Supabase Auth使用）
import { createClient } from '@/lib/supabase/client'
const supabase = createClient()
const { data, error } = await supabase.auth.signUp({
  email: formData.email,
  password: formData.password,
})
```

---

### 3. **セキュリティ：RLSポリシーが緩すぎる**

**問題点:**
- 全テーブルで`USING (true)`が使われており、**誰でも全操作可能**
- `providers`テーブル：全員が更新・削除可能
- `plans`テーブル：全員が作成・更新・削除可能
- `users`テーブル：全員が閲覧・更新可能
- `favorites`テーブル：全員が閲覧・追加・削除可能

**影響:**
- 悪意のあるユーザーが他のユーザーのデータを改ざん・削除可能
- 事業者のプランを勝手に編集・削除可能

**修正方法:**
1. Supabase Authを使用して認証を実装
2. RLSポリシーを適切に設定

```sql
-- 例：事業者は自分のプランのみ編集可能
CREATE POLICY "Providers can update their own plans"
  ON plans FOR UPDATE
  USING (
    auth.uid()::text = (
      SELECT id::text FROM providers WHERE id = plans.provider_id
    )
  );
```

---

### 4. **セッション管理が脆弱**

**問題点:**
- `localStorage`を使用したセッション管理（`app/provider/login/page.tsx:59-60`）
- クライアントサイドで簡単に改ざん可能

**影響:**
- 誰でも`localStorage`を書き換えて他人のアカウントにログイン可能
- XSS攻撃に脆弱

**修正方法:**
- Supabase Authを使用してJWTトークンでセッション管理
- HttpOnly Cookieを使用（サーバーサイド）

---

## 🟡 中程度の問題（早期に対応推奨）

### 5. **データ整合性：外部キー制約とRLSの不整合**

**問題点:**
- `favorites`テーブルには外部キー制約があるが、RLSポリシーが緩いため、誰でも他のユーザーのお気に入りを削除できる

**修正方法:**
- RLSポリシーを強化して、自分のお気に入りのみ削除可能にする

---

### 6. **データ検証の不足**

**問題点:**
- `plans`テーブルにCHECK制約がない
- `price`が負の値になる可能性
- `world_view`が空配列でも保存可能（意図的かどうか不明確）

**修正方法:**
```sql
ALTER TABLE plans 
  ADD CONSTRAINT check_price_positive 
  CHECK (price >= 0);
  
ALTER TABLE plans 
  ADD CONSTRAINT check_world_view_not_empty 
  CHECK (array_length(world_view, 1) > 0);
```

---

### 7. **Storageポリシーが緩すぎる**

**問題点:**
- `storage-policies.sql`で、全員がアップロード・削除可能に設定されている

**影響:**
- 誰でも不要なファイルをアップロード可能
- 他の事業者の画像を削除可能

**修正方法:**
- 認証済みユーザーのみアップロード可能にする
- ファイルの所有者のみ削除可能にする

---

## 🟢 軽微な問題（改善推奨）

### 8. **インデックスの最適化**

**現状:**
- 基本的なインデックスは設定されているが、複合インデックスの検討が必要

**推奨:**
```sql
-- 検索でよく使われる組み合わせ
CREATE INDEX IF NOT EXISTS idx_plans_search 
  ON plans(price, scale, location, purpose);
```

---

### 9. **スキーマのコメントと実装の不一致**

**問題点:**
- `schema.sql:21`のコメントが古い形式を示している

**修正方法:**
- コメントを現在の実装に合わせて更新

---

## 📋 修正優先度まとめ

### 最優先（即座に対応）
1. ✅ **パスワードのハッシュ化** - セキュリティ上最優先
2. ✅ **RLSポリシーの強化** - データ保護のため必須
3. ✅ **`scale`フィールドの統一** - 機能が正常に動作しない可能性

### 高優先度（1週間以内）
4. Supabase Authへの移行
5. セッション管理の改善
6. Storageポリシーの強化

### 中優先度（1ヶ月以内）
7. データ検証の追加
8. 外部キー制約とRLSの整合性確認

### 低優先度（機能改善）
9. インデックスの最適化
10. スキーマコメントの更新

---

## 🔧 実装例

### Supabase Authへの移行例

```typescript
// 新規登録
const supabase = createClient()
const { data, error } = await supabase.auth.signUp({
  email: formData.email,
  password: formData.password,
  options: {
    data: {
      name: formData.name,
      role: 'provider' // カスタムメタデータ
    }
  }
})

// ログイン
const { data, error } = await supabase.auth.signInWithPassword({
  email: formData.email,
  password: formData.password
})

// セッション取得
const { data: { session } } = await supabase.auth.getSession()
```

---

## 📚 参考資料

- [Supabase Auth Documentation](https://supabase.com/docs/guides/auth)
- [Row Level Security Policies](https://supabase.com/docs/guides/auth/row-level-security)
- [Storage Policies](https://supabase.com/docs/guides/storage/security/access-control)

