import { createClient } from '@/lib/supabase/server'
import PlanCardWithFavorite from '@/components/PlanCardWithFavorite'
import SortSelector from '@/components/SortSelector'
import { Plan } from '@/types/database'

interface SearchResultsProps {
  searchParams: Record<string, string | undefined>
}

export default async function SearchResults({ searchParams }: SearchResultsProps) {
  const supabase = await createClient()
  let query = supabase.from('plans').select('*')

  // 自然文検索（queryパラメータ）
  // title / description / summary_points に部分一致検索
  // 注意: summary_pointsは配列なので、Supabaseクライアントでは直接検索できないため、
  // 全てのプランを取得してから、title/description/summary_pointsのいずれかにマッチするものをフィルタリング
  const hasQuerySearch = !!searchParams.query
  const searchQuery = hasQuerySearch ? searchParams.query!.toLowerCase() : ''
  // queryパラメータがある場合、フィルタリングは後で行うため、ここでは検索条件を適用しない
  // （他のフィルター条件は適用する）

  // 価格フィルター
  if (searchParams.price) {
    const price = searchParams.price

    // 新9段階レンジ ("1"〜"9")
    if (price === '1') {
      // 〜10万円
      query = query.lte('price', 100000)
    } else if (price === '2') {
      // 10〜20万円
      query = query.gt('price', 100000).lte('price', 200000)
    } else if (price === '3') {
      // 20〜40万円
      query = query.gt('price', 200000).lte('price', 400000)
    } else if (price === '4') {
      // 40〜60万円
      query = query.gt('price', 400000).lte('price', 600000)
    } else if (price === '5') {
      // 60〜100万円
      query = query.gt('price', 600000).lte('price', 1000000)
    } else if (price === '6') {
      // 100〜150万円
      query = query.gt('price', 1000000).lte('price', 1500000)
    } else if (price === '7') {
      // 150〜250万円
      query = query.gt('price', 1500000).lte('price', 2500000)
    } else if (price === '8') {
      // 250〜400万円
      query = query.gt('price', 2500000).lte('price', 4000000)
    } else if (price === '9') {
      // 400〜600万円以上（400万円超〜上限なし扱い）
      query = query.gt('price', 4000000)
    } else if (price === 'low') {
      // 旧: 10万円以下
      query = query.lte('price', 100000)
    } else if (price === 'mid') {
      // 旧: 10〜30万円
      query = query.gt('price', 100000).lte('price', 300000)
    } else if (price === 'high') {
      // 旧: 30万円以上
      query = query.gt('price', 300000)
    }
  }

  // 規模フィルター（small/medium/large/xl）
  if (searchParams.scale) {
    query = query.eq('scale', searchParams.scale)
  }

  // 世界観フィルター（worldviewパラメータ）
  if (searchParams.worldview) {
    // world_view は TEXT[] のため、配列にその値を含むレコードを検索
    query = query.contains('world_view', [searchParams.worldview])
  }
  // 後方互換性のためworld_viewもサポート（同じくcontainsを使用）
  if (searchParams.world_view) {
    query = query.contains('world_view', [searchParams.world_view])
  }

  // その他のフィルター
  if (searchParams.location) {
    query = query.eq('location', searchParams.location)
  }
  if (searchParams.purpose) {
    query = query.eq('purpose', searchParams.purpose)
  }
  if (searchParams.date) {
    query = query.ilike('date_range', `%${searchParams.date}%`)
  }
  // 後方互換性のためdate_rangeもサポート
  if (searchParams.date_range) {
    query = query.ilike('date_range', `%${searchParams.date_range}%`)
  }

  // 並び替え
  const sort = searchParams.sort || 'created_desc'
  if (sort === 'price_asc') {
    query = query.order('price', { ascending: true })
  } else if (sort === 'price_desc') {
    query = query.order('price', { ascending: false })
  } else {
    query = query.order('created_at', { ascending: false })
  }

  const { data: plans, error } = await query

  if (error) {
    return <div className="text-red-500">エラーが発生しました: {error.message}</div>
  }

  // summary_pointsの配列検索（クライアント側でフィルタリング）
  let filteredPlans = plans || []
  if (hasQuerySearch && plans && searchQuery) {
    filteredPlans = plans.filter((plan) => {
      // title, description, summary_pointsのいずれかにマッチするものを検索
      const matchesTitle = plan.title?.toLowerCase().includes(searchQuery) || false
      const matchesDescription = plan.description?.toLowerCase().includes(searchQuery) || false
      const matchesSummaryPoints = plan.summary_points?.some((point) =>
        point.toLowerCase().includes(searchQuery)
      ) || false
      
      return matchesTitle || matchesDescription || matchesSummaryPoints
    })
  }

  if (!filteredPlans || filteredPlans.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 text-lg">該当するプランが見つかりませんでした。</p>
        <p className="text-gray-400 mt-2">検索条件を変更してお試しください。</p>
      </div>
    )
  }

  return (
    <div>
      {/* 並び替えセレクター */}
      <div className="mb-4 flex justify-between items-center">
        <p className="text-gray-600">
          {filteredPlans.length}件のプランが見つかりました
        </p>
        <SortSelector />
      </div>

      {/* プランカード一覧 */}
      <div className="grid md:grid-cols-2 gap-6">
        {filteredPlans.map((plan) => (
          <PlanCardWithFavorite key={plan.id} plan={plan as Plan} />
        ))}
      </div>
    </div>
  )
}

