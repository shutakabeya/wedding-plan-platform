import Link from 'next/link'
import LineConsultationButton from '@/components/LineConsultationButton'

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-50 to-white">
      <main className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          {/* ヘッダー */}
          <div className="text-center mb-12">
            <h1 className="text-5xl font-bold text-gray-900 mb-4">
              理想の結婚式プランを探そう
            </h1>
            <p className="text-xl text-gray-600">
              あなたにぴったりの結婚式・前撮りプランが見つかります
            </p>
          </div>

          {/* 自然文検索バー */}
          <div className="mb-12">
            <form action="/search" method="get" className="w-full">
              <div className="flex gap-4">
                <input
                  type="text"
                  name="query"
                  placeholder="「桜っぽい雰囲気」「10人くらいで」「15万円以内」など自由入力"
                  className="flex-1 px-6 py-4 text-lg border-2 border-gray-300 rounded-full focus:outline-none focus:border-pink-500 shadow-lg"
                />
                <button
                  type="submit"
                  className="px-8 py-4 bg-pink-500 text-white rounded-full font-semibold hover:bg-pink-600 transition-colors shadow-lg"
                >
                  検索
                </button>
              </div>
            </form>
          </div>

          {/* 3つの検索入口ボタン */}
          <div className="grid md:grid-cols-3 gap-6 mb-12">
            <Link
              href="/search?price=low"
              className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow text-center"
            >
              <div className="text-4xl mb-4">💰</div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">値段で探す</h2>
              <p className="text-gray-600">
                予算に合わせてプランを検索
              </p>
            </Link>

            <Link
              href="/search?scale=small"
              className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow text-center"
            >
              <div className="text-4xl mb-4">👥</div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">規模で探す</h2>
              <p className="text-gray-600">
                参加人数に合わせてプランを検索
              </p>
            </Link>

            <Link
              href="/worldview"
              className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow text-center"
            >
              <div className="text-4xl mb-4">🌸</div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">世界観で探す</h2>
              <p className="text-gray-600">
                理想の雰囲気でプランを検索
              </p>
            </Link>
          </div>

          {/* 人気のプラン（オプション） */}
          <div className="text-center">
            <p className="text-gray-500">
              まずは検索してみましょう。あなたにぴったりのプランが見つかります。
            </p>
          </div>
        </div>
      </main>

      {/* LINE相談ボタン（右下固定） */}
      <LineConsultationButton />
    </div>
  )
}
