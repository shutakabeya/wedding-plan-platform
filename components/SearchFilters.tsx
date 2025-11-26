'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { SCALE_OPTIONS, WORLD_VIEW_OPTIONS, PURPOSE_OPTIONS, PREFECTURES } from '@/types/database'

interface SearchFiltersProps {
  initialParams: Record<string, string | undefined>
}

export default function SearchFilters({ initialParams }: SearchFiltersProps) {
  const router = useRouter()
  const searchParams = useSearchParams()

  const updateFilter = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString())
    if (value) {
      params.set(key, value)
    } else {
      params.delete(key)
    }
    router.push(`/search?${params.toString()}`)
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-bold mb-4">検索条件</h2>

      {/* 価格範囲 */}
      <div className="mb-6">
        <label className="block text-sm font-semibold mb-2">価格範囲</label>
        <select
          className="w-full px-3 py-2 border rounded"
          value={initialParams.price || ''}
          onChange={(e) => updateFilter('price', e.target.value)}
        >
          <option value="">すべて</option>
          <option value="low">10万円以下</option>
          <option value="mid">10万円〜30万円</option>
          <option value="high">30万円以上</option>
        </select>
      </div>

      {/* 規模 */}
      <div className="mb-6">
        <label className="block text-sm font-semibold mb-2">規模</label>
        <select
          className="w-full px-3 py-2 border rounded"
          value={initialParams.scale || ''}
          onChange={(e) => updateFilter('scale', e.target.value)}
        >
          <option value="">すべて</option>
          {SCALE_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      {/* 世界観 */}
      <div className="mb-6">
        <label className="block text-sm font-semibold mb-2">世界観</label>
        <select
          className="w-full px-3 py-2 border rounded"
          value={initialParams.world_view || ''}
          onChange={(e) => updateFilter('world_view', e.target.value)}
        >
          <option value="">すべて</option>
          {WORLD_VIEW_OPTIONS.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      </div>

      {/* 場所 */}
      <div className="mb-6">
        <label className="block text-sm font-semibold mb-2">場所</label>
        <select
          className="w-full px-3 py-2 border rounded"
          value={initialParams.location || ''}
          onChange={(e) => updateFilter('location', e.target.value)}
        >
          <option value="">すべて</option>
          {PREFECTURES.map((pref) => (
            <option key={pref} value={pref}>
              {pref}
            </option>
          ))}
        </select>
      </div>

      {/* 目的 */}
      <div className="mb-6">
        <label className="block text-sm font-semibold mb-2">目的</label>
        <select
          className="w-full px-3 py-2 border rounded"
          value={initialParams.purpose || ''}
          onChange={(e) => updateFilter('purpose', e.target.value)}
        >
          <option value="">すべて</option>
          {PURPOSE_OPTIONS.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      </div>

      {/* リセットボタン */}
      <button
        onClick={() => router.push('/search')}
        className="w-full px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition-colors"
      >
        条件をリセット
      </button>
    </div>
  )
}

