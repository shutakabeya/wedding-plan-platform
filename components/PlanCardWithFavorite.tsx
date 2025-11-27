'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Plan } from '@/types/database'
import { createClient } from '@/lib/supabase/client'
import FavoriteButton from './FavoriteButton'

interface PlanCardWithFavoriteProps {
  plan: Plan
  from?: string
}

export default function PlanCardWithFavorite({ plan, from }: PlanCardWithFavoriteProps) {
  const [imageUrl, setImageUrl] = useState<string>('/placeholder-wedding.jpg')

  useEffect(() => {
    const supabase = createClient()
    if (plan.images && plan.images.length > 0) {
      const url = supabase.storage.from('plan-images').getPublicUrl(plan.images[0]).data.publicUrl
      setImageUrl(url)
    }
  }, [plan.images])

  return (
    <div className="relative bg-white rounded-lg shadow-sm md:shadow-md md:hover:shadow-xl hover:shadow transition-shadow overflow-hidden">
      {/* お気に入りボタン（右上） */}
      <div className="absolute top-2 right-2 z-10">
        <FavoriteButton planId={plan.id} />
      </div>

      <Link href={`/plan/${plan.id}${from ? `?from=${from}` : ''}`}>
        {/* 画像 */}
        <div className="relative w-full h-32 md:h-48 bg-gray-200">
          {plan.images && plan.images.length > 0 ? (
            <Image
              src={imageUrl}
              alt={plan.title}
              fill
              className="object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400">
              画像なし
            </div>
          )}
        </div>

        {/* コンテンツ */}
        <div className="p-3 md:p-4">
          <h3 className="text-base md:text-xl font-bold text-gray-900 mb-1 md:mb-2 line-clamp-2">
            {plan.title}
          </h3>
          
          <div className="flex items-center gap-2 mb-2 md:mb-3">
            <span className="text-lg md:text-2xl font-bold text-pink-600">
              ¥{plan.price.toLocaleString()}
            </span>
            <span className="text-xs md:text-sm text-gray-500">〜</span>
          </div>

          <div className="flex flex-wrap gap-1.5 md:gap-2 mb-2 md:mb-3">
            {Array.isArray(plan.world_view) && plan.world_view.length > 0 && (
              plan.world_view.slice(0, 2).map((wv) => (
                <span
                  key={wv}
                  className="px-2 py-0.5 md:px-3 md:py-1 bg-pink-100 text-pink-700 rounded-full text-xs md:text-sm"
                >
                  {wv}
                </span>
              ))
            )}
            <span className="px-2 py-0.5 md:px-3 md:py-1 bg-blue-100 text-blue-700 rounded-full text-xs md:text-sm">
              {plan.scale}
            </span>
            <span className="px-2 py-0.5 md:px-3 md:py-1 bg-green-100 text-green-700 rounded-full text-xs md:text-sm">
              {plan.purpose}
            </span>
          </div>

          <p className="text-xs md:text-sm text-gray-600 line-clamp-2 opacity-80 md:opacity-100">
            {plan.description || '詳細はプランページをご覧ください'}
          </p>
        </div>
      </Link>
    </div>
  )
}

