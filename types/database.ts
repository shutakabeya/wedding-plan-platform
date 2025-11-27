// Supabaseデータベース型定義

export interface Provider {
  id: string
  email: string
  password_hash: string
  name: string
  bio: string | null
  profile_image: string | null
  sns_links: Record<string, string> | null
  created_at: string
}

export interface Plan {
  id: string
  provider_id: string
  title: string
  price: number
  scale: string
  world_view: string[]
  location: string
  purpose: string
  date_range: string | null
  images: string[]
  summary_points: string[]
  description: string | null
  cta_type: 'phone' | 'email' | 'link' | null
  cta_value: string | null
  created_at: string
  updated_at: string
}

export interface PlanWithProvider extends Plan {
  provider: Provider
}

export interface User {
  id: string
  email: string
  password_hash: string
  name: string
  created_at: string
}

export interface Favorite {
  id: string
  user_id: string
  plan_id: string
  created_at: string
}

// 検索パラメータ
export interface SearchParams {
  query?: string
  price?: string // "1"〜"9"（料金レンジID）
  scale?: string // 規模（ふたりのみ / 少人数 など）
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
  world_view: string[]
  location: string
  purpose: string
  date_range: string
  summary_points: string[]
  description: string
  images: File[]
  cta_type: 'phone' | 'email' | 'link' | ''
  cta_value: string
}

// 選択肢の定義
export const SCALE_OPTIONS = [
  { value: 'ふたりのみ', label: 'ふたりのみ' },
  { value: '〜10名（家族婚）', label: '〜10名（家族婚）' },
  { value: '10〜30名（少人数）', label: '10〜30名（少人数）' },
  { value: '30〜60名（中規模）', label: '30〜60名（中規模）' },
  { value: '60〜100名（大規模）', label: '60〜100名（大規模）' },
  { value: '100名以上（大型）', label: '100名以上（大型）' },
] as const

export const WORLD_VIEW_OPTIONS = [
  'フラワー',
  'バルーン',
  'キャンドル',
  'フェアリーライト',
  'アンティーク',
  'ウッド',
  'シンプル',
  'ロマンチック',
  'モダン',
  'クラシック',
  '和モダン',
  '韓国風',
  '海',
  '森',
  '街中',
  'スタジオ',
  'レンガ',
  '花畑',
  '夜景',
  '夕日',
  '高級ホテル',
  'チャペル',
  '神前式',
  'ガーデン',
  '洋館',
  '古民家',
  'レストラン',
  '邸宅',
  'リゾート',
  'フォトスタジオ',
] as const

export const PURPOSE_OPTIONS = [
  '前撮り',
  '後撮り',
  'フォトウェディング',
  '結婚式（挙式）',
  '披露宴',
  '家族婚',
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

// 地方ごとの都道府県（選択UI用）
export const REGION_PREFECTURES = {
  北海道: ['北海道'],
  東北: ['青森', '岩手', '宮城', '秋田', '山形', '福島'],
  関東: ['東京', '神奈川', '千葉', '埼玉', '茨城', '栃木', '群馬'],
  中部: ['愛知', '静岡', '岐阜', '三重', '新潟', '長野', '山梨', '富山', '石川', '福井'],
  関西: ['大阪', '京都', '兵庫', '奈良', '滋賀', '和歌山'],
  中国: ['広島', '岡山', '山口', '鳥取', '島根'],
  四国: ['香川', '愛媛', '徳島', '高知'],
  九州: ['福岡', '佐賀', '長崎', '熊本', '大分', '宮崎', '鹿児島'],
  沖縄: ['沖縄'],
} as const

// 料金レンジ（検索用9段階）
export const PRICE_RANGE_OPTIONS = [
  { value: '1', label: '〜10万円' },
  { value: '2', label: '10〜20万円' },
  { value: '3', label: '20〜40万円' },
  { value: '4', label: '40〜60万円' },
  { value: '5', label: '60〜100万円' },
  { value: '6', label: '100〜150万円' },
  { value: '7', label: '150〜250万円' },
  { value: '8', label: '250〜400万円' },
  { value: '9', label: '400〜600万円以上' },
] as const

