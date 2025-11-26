import { Suspense } from 'react'
import SearchResults from '@/components/SearchResults'
import SearchFilters from '@/components/SearchFilters'

interface SearchPageProps {
  searchParams: Promise<{
    query?: string
    price?: string // "low" | "mid" | "high"
    scale?: string // "small" | "medium" | "large" | "xl"
    worldview?: string
    world_view?: string // 後方互換性のため
    location?: string
    purpose?: string
    date?: string
    date_range?: string // 後方互換性のため
    sort?: string
  }>
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const params = await searchParams

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">検索結果</h1>
        
        <div className="grid lg:grid-cols-4 gap-6">
          {/* フィルターサイドバー */}
          <aside className="lg:col-span-1">
            <SearchFilters initialParams={params} />
          </aside>

          {/* 検索結果 */}
          <div className="lg:col-span-3">
            <Suspense fallback={<div className="text-center py-12">検索中...</div>}>
              <SearchResults searchParams={params} />
            </Suspense>
          </div>
        </div>
      </div>
    </div>
  )
}

