import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import Header from '@/components/Header'

interface ProviderProfilePageProps {
  params: Promise<{ id: string }>
}

export default async function ProviderProfilePage({ params }: ProviderProfilePageProps) {
  const { id } = await params
  const supabase = await createClient()

  // 事業者情報を取得
  const { data: provider, error: providerError } = await supabase
    .from('providers')
    .select('*')
    .eq('id', id)
    .single()

  if (providerError || !provider) {
    notFound()
  }

  // 事業者のプランを取得
  const { data: plans, error: plansError } = await supabase
    .from('plans')
    .select('*')
    .eq('provider_id', id)
    .order('created_at', { ascending: false })

  // プロフィール画像URLを取得
  const profileImageUrl = provider.profile_image
    ? supabase.storage.from('provider-profiles').getPublicUrl(provider.profile_image).data.publicUrl
    : null

  return (
    <div className="min-h-screen bg-gray-50 pt-14 md:pt-20">
      <Header />
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* プロフィールセクション */}
          <div className="bg-white rounded-lg shadow-md p-8 mb-8">
            <div className="flex flex-col md:flex-row gap-6 items-start md:items-center">
              {/* プロフィール画像 */}
              <div className="relative w-32 h-32 md:w-40 md:h-40 rounded-full overflow-hidden bg-gray-200 shrink-0">
                {profileImageUrl ? (
                  <Image
                    src={profileImageUrl}
                    alt={provider.name}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400 text-4xl">
                    {provider.name.charAt(0)}
                  </div>
                )}
              </div>

              {/* 事業者情報 */}
              <div className="flex-1">
                <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
                  {provider.name}
                </h1>
                {provider.bio && (
                  <p className="text-gray-700 leading-relaxed mb-4">{provider.bio}</p>
                )}
              </div>
            </div>
          </div>

          {/* プラン一覧 */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              {provider.name}のプラン
            </h2>

            {plans && plans.length > 0 ? (
              <div className="grid md:grid-cols-2 gap-6">
                {plans.map((plan) => {
                  const planImageUrl = plan.images && plan.images.length > 0
                    ? supabase.storage.from('plan-images').getPublicUrl(plan.images[0]).data.publicUrl
                    : null

                  return (
                    <Link
                      key={plan.id}
                      href={`/plan/${plan.id}`}
                      className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow"
                    >
                      {planImageUrl ? (
                        <div className="relative w-full h-48 bg-gray-200">
                          <Image
                            src={planImageUrl}
                            alt={plan.title}
                            fill
                            className="object-cover"
                          />
                        </div>
                      ) : (
                        <div className="w-full h-48 bg-gray-200 flex items-center justify-center text-gray-400">
                          画像なし
                        </div>
                      )}
                      <div className="p-4">
                        <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2">
                          {plan.title}
                        </h3>
                        <p className="text-2xl font-bold text-pink-600 mb-2">
                          ¥{plan.price.toLocaleString()}
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {Array.isArray(plan.world_view) && plan.world_view.length > 0 ? (
                            plan.world_view.slice(0, 2).map((wv: string) => (
                              <span
                                key={wv}
                                className="px-2 py-1 bg-pink-100 text-pink-700 rounded-full text-xs"
                              >
                                {wv}
                              </span>
                            ))
                          ) : (
                            <span className="px-2 py-1 bg-pink-100 text-pink-700 rounded-full text-xs">
                              {plan.world_view}
                            </span>
                          )}
                          <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs">
                            {plan.scale}
                          </span>
                        </div>
                      </div>
                    </Link>
                  )
                })}
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow-md p-12 text-center">
                <p className="text-gray-500 text-lg">まだプランが登録されていません</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

