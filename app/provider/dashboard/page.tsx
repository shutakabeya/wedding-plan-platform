'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { Plan } from '@/types/database'

export default function DashboardPage() {
  const router = useRouter()
  const [plans, setPlans] = useState<Plan[]>([])
  const [loading, setLoading] = useState(true)
  const [providerId, setProviderId] = useState<string | null>(null)

  useEffect(() => {
    // 簡易認証チェック
    const id = localStorage.getItem('provider_id')
    if (!id) {
      router.push('/provider/login')
      return
    }
    setProviderId(id)
    fetchPlans(id)
  }, [router])

  const fetchPlans = async (id: string) => {
    try {
      const supabase = createClient()
      const { data, error } = await supabase
        .from('plans')
        .select('*')
        .eq('provider_id', id)
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Error fetching plans:', error)
        return
      }

      setPlans(data || [])
    } catch (err) {
      console.error('Error:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('provider_id')
    localStorage.removeItem('provider_email')
    router.push('/provider/login')
  }

  const handleDeletePlan = async (planId: string) => {
    if (!providerId) return

    // 確認ダイアログ
    if (!confirm('このプランを削除してもよろしいですか？この操作は取り消せません。')) {
      return
    }

    try {
      const supabase = createClient()
      
      // 削除前にプラン情報を取得（画像パスを取得するため）
      const { data: plan, error: fetchError } = await supabase
        .from('plans')
        .select('images')
        .eq('id', planId)
        .eq('provider_id', providerId)
        .single()

      if (fetchError) {
        console.error('Error fetching plan:', fetchError)
        alert('プランの取得に失敗しました: ' + fetchError.message)
        return
      }

      // Storageの画像を削除
      if (plan && plan.images && plan.images.length > 0) {
        for (const imagePath of plan.images) {
          const { error: deleteImageError } = await supabase.storage
            .from('plan-images')
            .remove([imagePath])
          
          if (deleteImageError) {
            console.error('Error deleting image:', deleteImageError)
            // 画像の削除に失敗してもプランの削除は続行
          }
        }
      }
      
      // プランを削除
      const { error } = await supabase
        .from('plans')
        .delete()
        .eq('id', planId)
        .eq('provider_id', providerId)

      if (error) {
        console.error('Error deleting plan:', error)
        alert('プランの削除に失敗しました: ' + error.message)
        return
      }

      // プラン一覧を再取得
      fetchPlans(providerId)
      alert('プランを削除しました')
    } catch (err) {
      console.error('Error:', err)
      alert('プランの削除に失敗しました')
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p>読み込み中...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">ダッシュボード</h1>
          <div className="flex gap-4">
            <Link
              href="/provider/plan/new"
              className="px-6 py-2 bg-pink-500 text-white rounded-lg font-semibold hover:bg-pink-600 transition-colors"
            >
              新規プラン作成
            </Link>
            <button
              onClick={handleLogout}
              className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
            >
              ログアウト
            </button>
          </div>
        </div>

        {plans.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <p className="text-gray-500 text-lg mb-4">まだプランが登録されていません</p>
            <Link
              href="/provider/plan/new"
              className="inline-block px-6 py-3 bg-pink-500 text-white rounded-lg font-semibold hover:bg-pink-600 transition-colors"
            >
              最初のプランを作成する
            </Link>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {plans.map((plan) => (
              <div key={plan.id} className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-2">{plan.title}</h3>
                <p className="text-2xl font-bold text-pink-600 mb-4">
                  ¥{plan.price.toLocaleString()}
                </p>
                <div className="flex flex-wrap gap-2 mb-4">
                  <span className="px-3 py-1 bg-pink-100 text-pink-700 rounded-full text-sm">
                    {plan.world_view}
                  </span>
                  <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">
                    {plan.scale}
                  </span>
                </div>
                <div className="flex gap-2">
                  <Link
                    href={`/plan/${plan.id}?from=provider`}
                    className="flex-1 text-center px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    閲覧
                  </Link>
                  <Link
                    href={`/provider/plan/${plan.id}/edit`}
                    className="flex-1 text-center px-4 py-2 bg-pink-500 text-white rounded-lg hover:bg-pink-600 transition-colors"
                  >
                    編集
                  </Link>
                </div>
                <button
                  onClick={() => handleDeletePlan(plan.id)}
                  className="w-full mt-2 px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors"
                >
                  削除
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

