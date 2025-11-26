import Link from 'next/link'
import Image from 'next/image'
import { Plan } from '@/types/database'
import { createClient } from '@/lib/supabase/server'

interface PlanCardProps {
  plan: Plan
}

export default async function PlanCard({ plan }: PlanCardProps) {
  const supabase = await createClient()
  
  // 最初の画像を取得
  const imageUrl = plan.images && plan.images.length > 0
    ? supabase.storage.from('plan-images').getPublicUrl(plan.images[0]).data.publicUrl
    : '/placeholder-wedding.jpg'

  return (
    <Link href={`/plan/${plan.id}`}>
      <div className="bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow overflow-hidden">
        {/* 画像 */}
        <div className="relative w-full h-48 bg-gray-200">
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
        <div className="p-4">
          <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2">
            {plan.title}
          </h3>
          
          <div className="flex items-center gap-2 mb-3">
            <span className="text-2xl font-bold text-pink-600">
              ¥{plan.price.toLocaleString()}
            </span>
            <span className="text-sm text-gray-500">〜</span>
          </div>

          <div className="flex flex-wrap gap-2 mb-3">
            <span className="px-3 py-1 bg-pink-100 text-pink-700 rounded-full text-sm">
              {plan.world_view}
            </span>
            <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">
              {plan.scale}
            </span>
            <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm">
              {plan.purpose}
            </span>
          </div>

          <p className="text-sm text-gray-600 line-clamp-2">
            {plan.description || '詳細はプランページをご覧ください'}
          </p>
        </div>
      </div>
    </Link>
  )
}

