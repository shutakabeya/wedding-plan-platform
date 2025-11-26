// Supabaseデータベース型定義

export interface Provider {
  id: string
  email: string
  password_hash: string
  name: string
  bio: string | null
  sns_links: Record<string, string> | null
  created_at: string
}

export interface Plan {
  id: string
  provider_id: string
  title: string
  price: number
  scale: string
  world_view: string
  location: string
  purpose: string
  date_range: string | null
  images: string[]
  summary_points: string[]
  description: string | null
  created_at: string
  updated_at: string
}

export interface PlanWithProvider extends Plan {
  provider: Provider
}

// 検索パラメータ
export interface SearchParams {
  query?: string
  price?: string // "low" | "mid" | "high"
  scale?: string // "small" | "medium" | "large" | "xl"
  worldview?: string // 世界観タグ（桜/ナチュラル etc）
  location?: string
  purpose?: string
  date?: string
  sort?: 'price_asc' | 'price_desc' | 'created_desc'
}

// プラン登録フォーム
export interface PlanFormData {
  title: string
  price: number
  scale: string
  world_view: string
  location: string
  purpose: string
  date_range: string
  summary_points: string[]
  description: string
  images: File[]
}

// 選択肢の定義
export const SCALE_OPTIONS = [
  { value: 'small', label: '0〜10人' },
  { value: 'medium', label: '10〜30人' },
  { value: 'large', label: '30〜60人' },
  { value: 'xl', label: '60人以上' },
] as const

export const WORLD_VIEW_OPTIONS = [
  '桜',
  'ナチュラル',
  '韓国風',
  '海',
  '森',
  '夜景',
  'スタジオ',
  'シック',
  '和風',
  'モダン',
  'ヴィンテージ',
  'その他',
] as const

export const PURPOSE_OPTIONS = [
  '前撮り',
  'フォト婚',
  '小規模結婚式',
  '会食',
  '映像',
  'ヘアメ',
  'その他',
] as const

export const PREFECTURES = [
  '北海道', '青森', '岩手', '宮城', '秋田', '山形', '福島',
  '茨城', '栃木', '群馬', '埼玉', '千葉', '東京', '神奈川',
  '新潟', '富山', '石川', '福井', '山梨', '長野', '岐阜',
  '静岡', '愛知', '三重', '滋賀', '京都', '大阪', '兵庫',
  '奈良', '和歌山', '鳥取', '島根', '岡山', '広島', '山口',
  '徳島', '香川', '愛媛', '高知', '福岡', '佐賀', '長崎',
  '熊本', '大分', '宮崎', '鹿児島', '沖縄',
] as const

