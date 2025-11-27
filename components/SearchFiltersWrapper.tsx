'use client'

import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import SearchFilters from './SearchFilters'
import {
  PRICE_RANGE_OPTIONS,
  SCALE_OPTIONS,
  WORLD_VIEW_OPTIONS,
  PURPOSE_OPTIONS,
} from '@/types/database'

interface SearchFiltersWrapperProps {
  initialParams: Record<string, string | undefined>
  children?: React.ReactNode
}

export default function SearchFiltersWrapper({ initialParams, children }: SearchFiltersWrapperProps) {
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  const router = useRouter()
  const searchParams = useSearchParams()

  // 適用されている検索条件を取得
  const activeFilters: Array<{ key: string; label: string }> = []

  // 自然文検索
  if (initialParams.query) {
    activeFilters.push({ key: 'query', label: `検索: ${initialParams.query}` })
  }

  // 料金
  if (initialParams.price) {
    const priceOption = PRICE_RANGE_OPTIONS.find(opt => opt.value === initialParams.price)
    if (priceOption) {
      activeFilters.push({ key: 'price', label: `料金: ${priceOption.label}` })
    }
  }

  // 規模
  if (initialParams.scale) {
    const scaleOption = SCALE_OPTIONS.find(opt => opt.value === initialParams.scale)
    if (scaleOption) {
      activeFilters.push({ key: 'scale', label: `規模: ${scaleOption.label}` })
    }
  }

  // 世界観
  const worldview = initialParams.worldview || initialParams.world_view
  if (worldview) {
    activeFilters.push({ key: 'worldview', label: `世界観: ${worldview}` })
  }

  // 場所
  if (initialParams.location) {
    activeFilters.push({ key: 'location', label: `場所: ${initialParams.location}` })
  }

  // 目的
  if (initialParams.purpose) {
    activeFilters.push({ key: 'purpose', label: `目的: ${initialParams.purpose}` })
  }

  // 日程
  const date = initialParams.date || initialParams.date_range
  if (date) {
    activeFilters.push({ key: 'date', label: `日程: ${date}` })
  }

  // 検索条件を削除
  const removeFilter = (keyToRemove: string) => {
    const params = new URLSearchParams(searchParams.toString())
    
    // worldviewとworld_viewの両方を削除
    if (keyToRemove === 'worldview') {
      params.delete('worldview')
      params.delete('world_view')
    } else if (keyToRemove === 'date') {
      // dateとdate_rangeの両方を削除
      params.delete('date')
      params.delete('date_range')
    } else {
      params.delete(keyToRemove)
    }
    
    router.push(`/search?${params.toString()}`)
  }

  return (
    <>
      {/* タイトルとトグルボタン */}
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900">検索結果</h1>
        
        {/* スマホ版: 検索条件を開くボタン */}
        <button
          onClick={() => setIsFilterOpen(!isFilterOpen)}
          className="lg:hidden flex items-center gap-2 text-gray-700 text-sm hover:text-gray-900 transition-colors"
        >
          <span>{isFilterOpen ? '検索条件を閉じる' : '検索条件を開く'}</span>
          <svg
            className={`w-4 h-4 transform transition-transform ${isFilterOpen ? 'rotate-180' : ''}`}
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path d="M19 9l-7 7-7-7"></path>
          </svg>
        </button>
      </div>

      {/* 適用中の検索条件タグ */}
      {activeFilters.length > 0 && (
        <div className="mb-6 flex flex-wrap gap-2">
          {activeFilters.map((filter) => (
            <span
              key={filter.key}
              className="inline-flex items-center gap-2 px-3 py-1 bg-pink-100 text-pink-800 rounded-full text-sm"
            >
              <span>{filter.label}</span>
              <button
                onClick={() => removeFilter(filter.key)}
                className="hover:bg-pink-200 rounded-full p-0.5 transition-colors"
                aria-label={`${filter.label}を削除`}
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path d="M6 18L18 6M6 6l12 12"></path>
                </svg>
              </button>
            </span>
          ))}
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-4">
        {/* フィルターサイドバー */}
        <aside className={`lg:col-span-1 ${isFilterOpen ? 'block' : 'hidden lg:block'}`}>
          <SearchFilters initialParams={initialParams} />
        </aside>

        {/* 検索結果エリア */}
        <div className="lg:col-span-3">
          {children}
        </div>
      </div>
    </>
  )
}

