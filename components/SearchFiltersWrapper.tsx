'use client'

import { useState } from 'react'
import SearchFilters from './SearchFilters'

interface SearchFiltersWrapperProps {
  initialParams: Record<string, string | undefined>
  children?: React.ReactNode
}

export default function SearchFiltersWrapper({ initialParams, children }: SearchFiltersWrapperProps) {
  const [isFilterOpen, setIsFilterOpen] = useState(false)

  return (
    <>
      {/* タイトルとトグルボタン */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900">検索結果</h1>
        
        {/* スマホ版: 検索条件を開くボタン */}
        <button
          onClick={() => setIsFilterOpen(!isFilterOpen)}
          className="lg:hidden flex items-center gap-2 text-gray-500 text-sm hover:text-gray-700 transition-colors"
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

