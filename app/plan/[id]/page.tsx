import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import LineConsultationButton from '@/components/LineConsultationButton'
import FavoriteButton from '@/components/FavoriteButton'

interface PlanDetailPageProps {
  params: Promise<{ id: string }>
  searchParams: Promise<{ from?: string }>
}

export default async function PlanDetailPage({ params, searchParams }: PlanDetailPageProps) {
  const { id } = await params
  const { from } = await searchParams
  const supabase = await createClient()

  // プラン情報を取得
  const { data: plan, error } = await supabase
    .from('plans')
    .select('*, providers(*)')
    .eq('id', id)
    .single()

  // デバッグ: CTAデータが取得されているか確認
  if (plan) {
    console.log('Plan CTA data:', { cta_type: plan.cta_type, cta_value: plan.cta_value })
  }

  if (error || !plan) {
    notFound()
  }

  // 画像URLを取得
  const imageUrls = plan.images && plan.images.length > 0
    ? plan.images.map((path: string) =>
        supabase.storage.from('plan-images').getPublicUrl(path).data.publicUrl
      )
    : []

  // 戻るボタンのリンクとテキストを決定
  const getBackLink = () => {
    switch (from) {
      case 'provider':
        return { href: '/provider/dashboard', text: '← ダッシュボードに戻る' }
      case 'favorites':
        return { href: '/favorites', text: '← お気に入りに戻る' }
      default:
        return { href: '/search', text: '← 検索結果に戻る' }
    }
  }

  const backLink = getBackLink()

  return (
    <div className="min-h-screen bg-gray-50 pt-14 md:pt-20">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* 戻るボタン */}
          <Link
            href={backLink.href}
            className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6"
          >
            {backLink.text}
          </Link>

          {/* 画像スライダー */}
          <div className="mb-8">
            {imageUrls.length > 0 ? (
              <div className="relative w-full h-96 bg-gray-200 rounded-lg overflow-hidden">
                <Image
                  src={imageUrls[0]}
                  alt={plan.title}
                  fill
                  className="object-cover"
                  priority
                />
              </div>
            ) : (
              <div className="w-full h-96 bg-gray-200 rounded-lg flex items-center justify-center text-gray-400">
                画像なし
              </div>
            )}
          </div>

          {/* プラン情報 */}
          <div className="bg-white rounded-lg shadow-md p-8 mb-8">
            <div className="flex items-start justify-between mb-4">
              <h1 className="text-4xl font-bold text-gray-900">{plan.title}</h1>
              <FavoriteButton planId={plan.id} className="ml-4" />
            </div>

            {/* 価格 */}
            <div className="mb-6">
              <span className="text-4xl font-bold text-pink-600">
                ¥{plan.price.toLocaleString()}
              </span>
              <span className="text-gray-500 ml-2">〜</span>
            </div>

            {/* タグ */}
            <div className="flex flex-wrap gap-2 mb-6">
              {Array.isArray(plan.world_view) && plan.world_view.length > 0 ? (
                plan.world_view.map((wv: string) => (
                  <span
                    key={wv}
                    className="px-4 py-2 bg-pink-100 text-pink-700 rounded-full font-semibold"
                  >
                    {wv}
                  </span>
                ))
              ) : (
                <span className="px-4 py-2 bg-pink-100 text-pink-700 rounded-full font-semibold">
                  {plan.world_view}
                </span>
              )}
              <span className="px-4 py-2 bg-blue-100 text-blue-700 rounded-full font-semibold">
                規模: {plan.scale}
              </span>
              <span className="px-4 py-2 bg-green-100 text-green-700 rounded-full font-semibold">
                {plan.purpose}
              </span>
              <span className="px-4 py-2 bg-purple-100 text-purple-700 rounded-full font-semibold">
                {plan.location}
              </span>
            </div>

            {/* 基本情報 */}
            <div className="grid md:grid-cols-2 gap-4 mb-6">
              <div>
                <h3 className="text-sm font-semibold text-gray-500 mb-1">場所</h3>
                <p className="text-lg">{plan.location}</p>
              </div>
              <div>
                <h3 className="text-sm font-semibold text-gray-500 mb-1">目的</h3>
                <p className="text-lg">{plan.purpose}</p>
              </div>
              <div>
                <h3 className="text-sm font-semibold text-gray-500 mb-1">規模</h3>
                <p className="text-lg">{plan.scale}</p>
              </div>
              {plan.date_range && (
                <div>
                  <h3 className="text-sm font-semibold text-gray-500 mb-1">日程</h3>
                  <p className="text-lg">{plan.date_range}</p>
                </div>
              )}
            </div>

            {/* プラン内容（箇条書き） */}
            {plan.summary_points && plan.summary_points.length > 0 && (
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">プラン内容</h2>
                <ul className="list-disc list-inside space-y-2">
                  {plan.summary_points.map((point: string, index: number) => (
                    <li key={index} className="text-gray-700">
                      {point}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* 詳細説明 */}
            {plan.description && (
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">詳細説明</h2>
                <div className="prose max-w-none">
                  <p className="text-gray-700 whitespace-pre-wrap">{plan.description}</p>
                </div>
              </div>
            )}

            {/* 提供者プロフィール */}
            {plan.providers && (
              <div className="border-t pt-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">提供者情報</h2>
                <Link
                  href={`/provider/${plan.providers.id}`}
                  className="flex flex-col md:flex-row gap-4 items-start md:items-center hover:opacity-80 transition-opacity"
                >
                  {/* プロフィール画像 */}
                  {plan.providers.profile_image ? (
                    <div className="relative w-20 h-20 md:w-24 md:h-24 rounded-full overflow-hidden bg-gray-200 shrink-0">
                      <Image
                        src={supabase.storage.from('provider-profiles').getPublicUrl(plan.providers.profile_image).data.publicUrl}
                        alt={plan.providers.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                  ) : (
                    <div className="w-20 h-20 md:w-24 md:h-24 rounded-full bg-gray-200 flex items-center justify-center text-gray-400 text-2xl shrink-0">
                      {plan.providers.name.charAt(0)}
                    </div>
                  )}
                  {/* 事業者情報 */}
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-gray-900 mb-2 hover:text-pink-600 transition-colors">
                      {plan.providers.name}
                    </h3>
                    {plan.providers.bio && (
                      <p className="text-gray-700 mb-2 line-clamp-2">{plan.providers.bio}</p>
                    )}
                    <span className="text-sm text-pink-600 hover:text-pink-700">
                      プロフィールを見る →
                    </span>
                  </div>
                </Link>
              </div>
            )}
          </div>

          {/* 相談ボタン */}
          <div className="text-center">
            {plan.cta_type && plan.cta_value ? (
              (() => {
                let href = ''
                let icon = null
                let text = ''

                if (plan.cta_type === 'phone') {
                  href = `tel:${plan.cta_value.replace(/[^\d+]/g, '')}`
                  icon = (
                    <svg
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  )
                  text = '電話で相談する'
                } else if (plan.cta_type === 'email') {
                  href = `mailto:${plan.cta_value}`
                  icon = (
                    <svg
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  )
                  text = 'メールで相談する'
                } else if (plan.cta_type === 'link') {
                  href = plan.cta_value.startsWith('http') ? plan.cta_value : `https://${plan.cta_value}`
                  icon = (
                    <svg
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  )
                  text = 'まずは相談してみる'
                }

                return (
                  <a
                    href={href}
                    target={plan.cta_type === 'link' ? '_blank' : undefined}
                    rel={plan.cta_type === 'link' ? 'noopener noreferrer' : undefined}
                    className="inline-flex items-center gap-3 px-8 py-4 bg-pink-500 text-white rounded-full font-semibold hover:bg-pink-600 transition-colors shadow-lg"
                  >
                    {icon}
                    {text}
                  </a>
                )
              })()
            ) : (
              <a
                href="https://lin.ee/rmqEaLy"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-3 px-8 py-4 bg-[#06C755] text-white rounded-full font-semibold hover:bg-[#05B548] transition-colors shadow-lg"
              >
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M19.365 9.863c.349 0 .63.285.63.631 0 .345-.281.63-.63.63H17.61v1.125h1.755c.349 0 .63.283.63.63 0 .344-.281.629-.63.629h-2.386c-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.63-.63h2.386c.349 0 .63.285.63.63 0 .349-.281.63-.63.63H17.61v1.125h1.755zm-3.855 3.016c0 .27-.174.51-.432.596-.064.021-.133.031-.199.031-.211 0-.391-.09-.51-.25l-2.443-3.317v2.94c0 .344-.279.629-.631.629-.346 0-.626-.285-.626-.629V8.108c0-.27.173-.51.43-.595.06-.023.136-.033.194-.033.195 0 .375.104.495.27l2.462 3.33V8.108c0-.345.282-.63.63-.63.345 0 .63.285.63.63v4.771zm-5.741 0c0 .344-.282.629-.631.629-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.63-.63.346 0 .628.285.628.63v4.771zm-2.466.629H4.917c-.345 0-.63-.285-.63-.629V8.108c0-.345.285-.63.63-.63.348 0 .63.285.63.63v4.141h1.756c.348 0 .629.283.629.63 0 .344-.282.629-.629.629M24 10.314C24 4.943 18.615.572 12 .572S0 4.943 0 10.314c0 4.811 4.27 8.842 10.035 9.608.391.082.923.258 1.058.59.12.301.079.766.046 1.08l-.164 1.02c-.045.301-.24 1.186 1.049.645 1.291-.539 6.916-4.078 9.436-6.975C23.176 14.393 24 12.458 24 10.314"
                    fill="currentColor"
                  />
                </svg>
                LINEで相談する
              </a>
            )}
          </div>
        </div>
      </div>

      <LineConsultationButton />
    </div>
  )
}

