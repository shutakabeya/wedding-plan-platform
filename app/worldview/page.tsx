import Link from 'next/link'
import { WORLD_VIEW_OPTIONS } from '@/types/database'

export default function WorldviewPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-50 to-white">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-6xl mx-auto">
          {/* ヘッダー */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              世界観で探す
            </h1>
            <p className="text-xl text-gray-600">
              理想の雰囲気に合わせてプランを選びましょう
            </p>
          </div>

          {/* 世界観カード一覧 */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {WORLD_VIEW_OPTIONS.map((worldview) => (
              <Link
                key={worldview}
                href={`/search?worldview=${encodeURIComponent(worldview)}`}
                className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all hover:scale-105 text-center"
              >
                <div className="text-5xl mb-4">
                  {worldview === 'フラワー' && '🌸'}
                  {worldview === 'バルーン' && '🎈'}
                  {worldview === 'キャンドル' && '🕯️'}
                  {worldview === 'フェアリーライト' && '✨'}
                  {worldview === 'アンティーク' && '🏺'}
                  {worldview === 'ウッド' && '🪵'}
                  {worldview === 'シンプル' && '⚪'}
                  {worldview === 'ロマンチック' && '💕'}
                  {worldview === 'モダン' && '🔷'}
                  {worldview === 'クラシック' && '🎩'}
                  {worldview === '和モダン' && '🏮'}
                  {worldview === '韓国風' && '💝'}
                  {worldview === '海' && '🌊'}
                  {worldview === '森' && '🌲'}
                  {worldview === '街中' && '🏙️'}
                  {worldview === 'スタジオ' && '📸'}
                  {worldview === 'レンガ' && '🧱'}
                  {worldview === '花畑' && '🌺'}
                  {worldview === '夜景' && '🌃'}
                  {worldview === '夕日' && '🌅'}
                  {worldview === '高級ホテル' && '🏨'}
                  {worldview === 'チャペル' && '⛪'}
                  {worldview === '神前式' && '⛩️'}
                  {worldview === 'ガーデン' && '🌳'}
                  {worldview === '洋館' && '🏛️'}
                  {worldview === '古民家' && '🏘️'}
                  {worldview === 'レストラン' && '🍽️'}
                  {worldview === '邸宅' && '🏰'}
                  {worldview === 'リゾート' && '🏖️'}
                  {worldview === 'フォトスタジオ' && '📷'}
                </div>
                <h2 className="text-xl font-bold text-gray-900">
                  {worldview}
                </h2>
              </Link>
            ))}
          </div>

          {/* 戻るリンク */}
          <div className="mt-12 text-center">
            <Link
              href="/"
              className="text-pink-600 hover:text-pink-700 font-semibold"
            >
              ← トップページに戻る
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

