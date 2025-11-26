import Link from 'next/link'
import LineConsultationButton from '@/components/LineConsultationButton'
import Header from '@/components/Header'

export default function Home() {
  return (
    <div className="min-h-screen bg-linear-to-b from-pink-50 to-white">
      <Header />
      
      <main className="container mx-auto px-4 pt-20 pb-6 md:pt-24 md:pb-16">
        <div className="max-w-4xl mx-auto">
          {/* PC版: タイトルとサブタイトル */}
          <div className="hidden md:block text-center mb-12">
            <h1 className="text-5xl font-bold text-gray-900 mb-4 leading-tight">
              理想の結婚式プランを探そう
            </h1>
            <p className="text-xl text-gray-600">
              あなたにぴったりの結婚式・前撮りプランが見つかります
            </p>
          </div>

          {/* スマホ版: タイトル、検索バー、検索ボタンを中央配置 */}
          <div className="md:hidden flex flex-col items-center pt-24 pb-4">
            {/* タイトル */}
            <div className="text-center mb-6">
              <h1 className="text-xl font-bold text-gray-900 leading-tight">
                理想の結婚式プランを探そう
              </h1>
            </div>

            {/* 自然文検索バーとボタン */}
            <div className="w-full max-w-sm">
              <form action="/search" method="get" className="w-full flex flex-col gap-4">
                <div className="relative">
                  <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                    </svg>
                  </div>
                  <input
                    type="text"
                    name="query"
                    placeholder="「桜っぽい雰囲気」「10人くらいで」「15万円以内」など自由入力"
                    className="w-full pl-11 pr-4 py-3 text-base border-2 border-gray-300 rounded-full focus:outline-none focus:border-pink-500 shadow-lg placeholder:text-gray-300"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full px-6 py-3 text-base bg-pink-500 text-white rounded-full font-semibold hover:bg-pink-600 transition-colors shadow-lg"
                >
                  検索
                </button>
              </form>
            </div>
          </div>

          {/* PC版: 自然文検索バー */}
          <div className="hidden md:block mb-6 md:mb-12 md:max-w-full max-w-sm mx-auto">
            <form action="/search" method="get" className="w-full">
              <div className="flex flex-col gap-3 sm:flex-row sm:gap-4">
                <div className="relative flex-1">
                  <input
                    type="text"
                    name="query"
                    placeholder="「桜っぽい雰囲気」「10人くらいで」「15万円以内」など自由入力"
                    className="w-full pl-6 pr-4 py-4 text-lg border-2 border-gray-300 rounded-full focus:outline-none focus:border-pink-500 shadow-lg placeholder:text-gray-500"
                  />
                </div>
                <button
                  type="submit"
                  className="px-8 py-4 bg-pink-500 text-white rounded-full font-semibold hover:bg-pink-600 transition-colors shadow-lg w-full sm:w-auto"
                >
                  検索
                </button>
              </div>
            </form>
          </div>

          {/* 3つの検索入口ボタン */}
          <div className="grid md:grid-cols-3 gap-4 md:gap-6 mb-12 mt-4 md:mt-0">
            <Link
              href="/search?price=3"
              className="bg-white p-4 md:p-8 rounded-xl md:rounded-2xl shadow-sm md:shadow-lg md:hover:shadow-xl transition-shadow text-center opacity-90 md:opacity-100"
            >
              <div className="text-3xl md:text-4xl mb-2 md:mb-4">💰</div>
              <h2 className="text-lg md:text-2xl font-bold text-gray-900 mb-1 md:mb-2">値段で探す</h2>
              <p className="text-sm md:text-base text-gray-600">
                予算に合わせてプランを検索
              </p>
            </Link>

            <Link
              href="/search?scale=10〜30名（少人数）"
              className="bg-white p-4 md:p-8 rounded-xl md:rounded-2xl shadow-sm md:shadow-lg md:hover:shadow-xl transition-shadow text-center opacity-90 md:opacity-100"
            >
              <div className="text-3xl md:text-4xl mb-2 md:mb-4">👥</div>
              <h2 className="text-lg md:text-2xl font-bold text-gray-900 mb-1 md:mb-2">規模で探す</h2>
              <p className="text-sm md:text-base text-gray-600">
                参加人数に合わせてプランを検索
              </p>
            </Link>

            <Link
              href="/worldview"
              className="bg-white p-4 md:p-8 rounded-xl md:rounded-2xl shadow-sm md:shadow-lg md:hover:shadow-xl transition-shadow text-center opacity-90 md:opacity-100"
            >
              <div className="text-3xl md:text-4xl mb-2 md:mb-4">🌸</div>
              <h2 className="text-lg md:text-2xl font-bold text-gray-900 mb-1 md:mb-2">世界観で探す</h2>
              <p className="text-sm md:text-base text-gray-600">
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
