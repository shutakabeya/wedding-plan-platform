import { Suspense } from 'react'
import SearchResults from '@/components/SearchResults'
import SearchFiltersWrapper from '@/components/SearchFiltersWrapper'

interface SearchPageProps {
  searchParams: Promise<{
    query?: string
    price?: string // "1"〜"9"（料金レンジID）
    scale?: string
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
    <div className="min-h-screen bg-gray-50 pt-14 md:pt-20">
      <div className="container mx-auto px-4 py-6 md:py-8">
        <SearchFiltersWrapper initialParams={params}>
          <Suspense fallback={<div className="text-center py-12">検索中...</div>}>
            <SearchResults searchParams={params} />
          </Suspense>
        </SearchFiltersWrapper>
      </div>
    </div>
  )
}

