'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import PlanCardWithFavorite from '@/components/PlanCardWithFavorite'
import { Plan } from '@/types/database'
import Header from '@/components/Header'

export default function FavoritesPage() {
  const router = useRouter()
  const [favorites, setFavorites] = useState<Plan[]>([])
  const [loading, setLoading] = useState(true)
  const [userId, setUserId] = useState<string | null>(null)

  useEffect(() => {
    const id = localStorage.getItem('user_id')
    if (!id) {
      router.push('/login')
      return
    }
    setUserId(id)
    fetchFavorites(id)
  }, [router])

  const fetchFavorites = async (id: string) => {
    try {
      const supabase = createClient()
      
      // お気に入り一覧を取得
      const { data: favoritesData, error: favoritesError } = await supabase
        .from('favorites')
        .select('plan_id')
        .eq('user_id', id)
        .order('created_at', { ascending: false })

      if (favoritesError) {
        console.error('Error fetching favorites:', favoritesError)
        setLoading(false)
        return
      }

      if (!favoritesData || favoritesData.length === 0) {
        setFavorites([])
        setLoading(false)
        return
      }

      // プランIDのリストを取得
      const planIds = favoritesData.map((f: { plan_id: string }) => f.plan_id)

      // プラン情報を取得
      const { data: plansData, error: plansError } = await supabase
        .from('plans')
        .select('*')
        .in('id', planIds)

      if (plansError) {
        console.error('Error fetching plans:', plansError)
        setLoading(false)
        return
      }

      // お気に入り登録順に並び替え
      const sortedPlans = planIds
        .map((id: string) => plansData?.find((p: Plan) => p.id === id))
        .filter((p): p is Plan => p !== undefined)

      setFavorites(sortedPlans)
    } catch (err) {
      console.error('Error:', err)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-6xl mx-auto">
            <div className="text-center py-12">
              <p>読み込み中...</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">お気に入り</h1>

          {favorites.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg mb-4">お気に入りに登録されたプランはありません</p>
              <Link
                href="/search"
                className="text-pink-600 hover:text-pink-700 font-semibold"
              >
                プランを探す
              </Link>
            </div>
          ) : (
            <>
              <p className="text-gray-600 mb-6">
                {favorites.length}件のお気に入りプラン
              </p>
              <div className="grid md:grid-cols-2 gap-6">
                {favorites.map((plan) => (
                  <PlanCardWithFavorite key={plan.id} plan={plan} />
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

