'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'

interface FavoriteButtonProps {
  planId: string
  className?: string
}

export default function FavoriteButton({ planId, className = '' }: FavoriteButtonProps) {
  const [isFavorite, setIsFavorite] = useState(false)
  const [loading, setLoading] = useState(false)
  const [userId, setUserId] = useState<string | null>(null)

  useEffect(() => {
    // ユーザーIDを取得
    const id = localStorage.getItem('user_id')
    setUserId(id)
    
    if (id) {
      checkFavoriteStatus(id)
    }
  }, [planId])

  const checkFavoriteStatus = async (id: string) => {
    try {
      const supabase = createClient()
      const { data, error } = await supabase
        .from('favorites')
        .select('id')
        .eq('user_id', id)
        .eq('plan_id', planId)
        .single()

      if (error && error.code !== 'PGRST116') { // PGRST116は「行が見つからない」エラー
        console.error('Error checking favorite:', error)
        return
      }

      setIsFavorite(!!data)
    } catch (err) {
      console.error('Error:', err)
    }
  }

  const handleToggleFavorite = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    if (!userId) {
      alert('お気に入り機能を利用するにはログインが必要です')
      window.location.href = '/login'
      return
    }

    setLoading(true)

    try {
      const supabase = createClient()

      if (isFavorite) {
        // お気に入りを削除
        const { error } = await supabase
          .from('favorites')
          .delete()
          .eq('user_id', userId)
          .eq('plan_id', planId)

        if (error) {
          console.error('Error removing favorite:', error)
          alert('お気に入りの削除に失敗しました')
        } else {
          setIsFavorite(false)
        }
      } else {
        // お気に入りを追加
        const { error } = await supabase
          .from('favorites')
          .insert({
            user_id: userId,
            plan_id: planId,
          })

        if (error) {
          console.error('Error adding favorite:', error)
          if (error.code === '23505') {
            // 既に存在する場合（重複エラー）
            setIsFavorite(true)
          } else {
            alert('お気に入りの追加に失敗しました')
          }
        } else {
          setIsFavorite(true)
        }
      }
    } catch (err) {
      console.error('Error:', err)
      alert('エラーが発生しました')
    } finally {
      setLoading(false)
    }
  }

  if (!userId) {
    return null // ログインしていない場合は表示しない
  }

  return (
    <button
      onClick={handleToggleFavorite}
      disabled={loading}
      className={`p-2 rounded-full transition-colors ${
        isFavorite
          ? 'bg-pink-500 text-white hover:bg-pink-600'
          : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
      } disabled:opacity-50 ${className}`}
      aria-label={isFavorite ? 'お気に入りから削除' : 'お気に入りに追加'}
    >
      <svg
        className="w-5 h-5"
        fill={isFavorite ? 'currentColor' : 'none'}
        stroke="currentColor"
        strokeWidth="2"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
        />
      </svg>
    </button>
  )
}


