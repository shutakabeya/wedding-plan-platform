import Link from 'next/link'
import Header from '@/components/Header'
import LineConsultationButton from '@/components/LineConsultationButton'

export default function CouplesLandingPage() {
  return (
    <div className="min-h-screen bg-linear-to-b from-pink-50 to-white">
      <Header />
      
      <main className="pt-20 md:pt-24">
        {/* ヒーローセクション */}
        <section className="container mx-auto px-4 py-16 md:py-24">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
              あなたの理想の「世界観」から選べる。
            </h1>
            <p className="text-2xl md:text-3xl font-semibold text-pink-600 mb-8">
              結婚式・前撮りプラン検索の新基準。
            </p>
            <p className="text-lg md:text-xl text-gray-600 mb-10 leading-relaxed max-w-3xl mx-auto">
              フラワー・バルーン・海・和モダン…世界観や価格・規模・場所から簡単に検索。ストレスのない準備をサポートします。
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link
                href="/search"
                className="px-8 py-4 bg-pink-500 text-white text-lg font-semibold rounded-full hover:bg-pink-600 transition-colors shadow-lg hover:shadow-xl"
              >
                今すぐプランを探す（無料）
              </Link>
              <Link
                href="/line"
                className="px-8 py-4 bg-white border-2 border-pink-500 text-pink-600 text-lg font-semibold rounded-full hover:bg-pink-50 transition-colors"
              >
                LINEで気軽に相談
              </Link>
            </div>
          </div>
        </section>

        {/* カップルが抱える問題 */}
        <section className="bg-white py-16 md:py-24">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 text-center mb-12 md:mb-16">
                結婚式準備で直面する課題
              </h2>
              
              <div className="grid md:grid-cols-2 gap-6 md:gap-8">
                {/* 課題1 */}
                <div className="bg-linear-to-br from-red-50 to-pink-50 p-6 md:p-8 rounded-2xl shadow-lg border border-red-100">
                  <div className="text-4xl mb-4">💰</div>
                  <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-4">
                    隠れたコストによる予算オーバー
                  </h3>
                  <p className="text-gray-700 leading-relaxed">
                    調査では、平均23％（約8,400ドル）の予算超過が発生しており、準備には200時間以上かかり、73％のカップルが初期予算を15％以上オーバーしています。
                  </p>
                </div>

                {/* 課題2 */}
                <div className="bg-linear-to-br from-orange-50 to-yellow-50 p-6 md:p-8 rounded-2xl shadow-lg border border-orange-100">
                  <div className="text-4xl mb-4">😰</div>
                  <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-4">
                    高いストレスレベルとコミュニケーションの問題
                  </h3>
                  <p className="text-gray-700 leading-relaxed">
                    87〜89％がプラン探しで高いストレスを感じ、45％のカップルが喧嘩の増加、32％が仕事の生産性低下、28％が睡眠の質の低下を経験しています。
                  </p>
                </div>

                {/* 課題3 */}
                <div className="bg-linear-to-br from-blue-50 to-indigo-50 p-6 md:p-8 rounded-2xl shadow-lg border border-blue-100">
                  <div className="text-4xl mb-4">📉</div>
                  <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-4">
                    経済的な不安とインフレの影響
                  </h3>
                  <p className="text-gray-700 leading-relaxed">
                    景気やインフレの影響で63％が予算設計に苦労し、53％が平均7,347ドル以上をオーバーするなど、予算面の不安が大きい状況です。
                  </p>
                </div>

                {/* 課題4 */}
                <div className="bg-linear-to-br from-purple-50 to-pink-50 p-6 md:p-8 rounded-2xl shadow-lg border border-purple-100">
                  <div className="text-4xl mb-4">🔍</div>
                  <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-4">
                    情報の散在と比較の難しさ
                  </h3>
                  <p className="text-gray-700 leading-relaxed">
                    既存サイトでは雰囲気や規模、価格の比較が難しく、返答が遅いなどのコミュニケーション課題を抱えています。
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Bridalが提供する価値 */}
        <section className="bg-linear-to-b from-pink-50 to-white py-16 md:py-24">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 text-center mb-12 md:mb-16">
                Bridalが提供する価値
              </h2>
              
              <div className="grid md:grid-cols-2 gap-6 md:gap-8">
                {/* 価値1 */}
                <div className="bg-white p-6 md:p-8 rounded-2xl shadow-lg border-2 border-pink-200 hover:border-pink-400 transition-colors">
                  <div className="text-4xl mb-4">🌸</div>
                  <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-4">
                    世界観から検索できるUI
                  </h3>
                  <p className="text-gray-700 leading-relaxed">
                    フラワー、バルーン、海、和モダンなど、雰囲気や装飾を基準にプランを探せます。64％のカップルが写真や雰囲気を最も重視しているため、視覚的な世界観検索は大きな価値になります。
                  </p>
                </div>

                {/* 価値2 */}
                <div className="bg-white p-6 md:p-8 rounded-2xl shadow-lg border-2 border-pink-200 hover:border-pink-400 transition-colors">
                  <div className="text-4xl mb-4">💵</div>
                  <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-4">
                    価格と規模・場所を明確に表示
                  </h3>
                  <p className="text-gray-700 leading-relaxed">
                    予算や参加人数・地域で簡単に絞り込み可能。約80％のカップルが価格を最重要視し、料金を明示することでミスマッチが減り、問い合わせの質が向上します。
                  </p>
                </div>

                {/* 価値3 */}
                <div className="bg-white p-6 md:p-8 rounded-2xl shadow-lg border-2 border-pink-200 hover:border-pink-400 transition-colors">
                  <div className="text-4xl mb-4">📋</div>
                  <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-4">
                    カード型表示で簡単比較
                  </h3>
                  <p className="text-gray-700 leading-relaxed">
                    写真、料金、プラン内容をカード形式でまとめ、複数の候補を横並びで比較できます。忙しいカップルでも手間なく検討可能です。
                  </p>
                </div>

                {/* 価値4 */}
                <div className="bg-white p-6 md:p-8 rounded-2xl shadow-lg border-2 border-pink-200 hover:border-pink-400 transition-colors">
                  <div className="text-4xl mb-4">💬</div>
                  <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-4">
                    スムーズな問い合わせとサポート
                  </h3>
                  <p className="text-gray-700 leading-relaxed">
                    気になるプランはワンクリックで相談・予約へ。返信の遅さに悩まされないようにサポート体制を整え、必要ならLINE相談も可能です。
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 利用のステップ */}
        <section className="bg-white py-16 md:py-24">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 text-center mb-12 md:mb-16">
                利用のステップ
              </h2>
              
              <div className="space-y-8 md:space-y-12">
                {/* ステップ1 */}
                <div className="flex flex-col md:flex-row gap-6 items-start md:items-center bg-gray-50 p-6 md:p-8 rounded-2xl shadow-lg">
                  <div className="shrink-0 w-16 h-16 bg-pink-500 text-white rounded-full flex items-center justify-center text-2xl font-bold">
                    1
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-3">
                      世界観・条件から検索
                    </h3>
                    <p className="text-gray-700 leading-relaxed">
                      世界観、価格、規模、場所、目的（挙式、前撮りなど）を選んで理想のプランを一覧表示します。
                    </p>
                  </div>
                </div>

                {/* ステップ2 */}
                <div className="flex flex-col md:flex-row gap-6 items-start md:items-center bg-gray-50 p-6 md:p-8 rounded-2xl shadow-lg">
                  <div className="shrink-0 w-16 h-16 bg-pink-500 text-white rounded-full flex items-center justify-center text-2xl font-bold">
                    2
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-3">
                      プランを比較
                    </h3>
                    <p className="text-gray-700 leading-relaxed">
                      写真や詳細を見比べて、お気に入りに保存します。
                    </p>
                  </div>
                </div>

                {/* ステップ3 */}
                <div className="flex flex-col md:flex-row gap-6 items-start md:items-center bg-gray-50 p-6 md:p-8 rounded-2xl shadow-lg">
                  <div className="shrink-0 w-16 h-16 bg-pink-500 text-white rounded-full flex items-center justify-center text-2xl font-bold">
                    3
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-3">
                      気軽に相談
                    </h3>
                    <p className="text-gray-700 leading-relaxed">
                      LINEまたはフォームで事業者に希望を伝え、見学やヒアリングを調整します。
                    </p>
                  </div>
                </div>

                {/* ステップ4 */}
                <div className="flex flex-col md:flex-row gap-6 items-start md:items-center bg-gray-50 p-6 md:p-8 rounded-2xl shadow-lg">
                  <div className="shrink-0 w-16 h-16 bg-pink-500 text-white rounded-full flex items-center justify-center text-2xl font-bold">
                    4
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-3">
                      当日を楽しむ
                    </h3>
                    <p className="text-gray-700 leading-relaxed">
                      納得して選んだプランで忘れられない日を迎えます。
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* よくある質問 */}
        <section className="bg-linear-to-b from-pink-50 to-white py-16 md:py-24">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 text-center mb-12 md:mb-16">
                よくある質問
              </h2>
              
              <div className="space-y-6">
                {/* FAQ1 */}
                <div className="bg-white p-6 md:p-8 rounded-2xl border border-gray-200 shadow-lg">
                  <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-4">
                    Q. Bridalの利用は無料ですか？
                  </h3>
                  <p className="text-gray-700 leading-relaxed">
                    検索・比較・相談など基本機能はすべて無料です。必要に応じて有料オプションも案内します。
                  </p>
                </div>

                {/* FAQ2 */}
                <div className="bg-white p-6 md:p-8 rounded-2xl border border-gray-200 shadow-lg">
                  <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-4">
                    Q. 料金表示は正確ですか？追加料金はありませんか？
                  </h3>
                  <p className="text-gray-700 leading-relaxed">
                    事業者が設定した料金を掲載し、プランの範囲や追加費用も事前に確認できます。透明性を担保したプランのみ掲載しています。
                  </p>
                </div>

                {/* FAQ3 */}
                <div className="bg-white p-6 md:p-8 rounded-2xl border border-gray-200 shadow-lg">
                  <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-4">
                    Q. まだ具体的な希望がない場合は？
                  </h3>
                  <p className="text-gray-700 leading-relaxed">
                    世界観や大まかな予算だけでも検索でき、専門スタッフへの相談も可能です。
                  </p>
                </div>

                {/* FAQ4 */}
                <div className="bg-white p-6 md:p-8 rounded-2xl border border-gray-200 shadow-lg">
                  <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-4">
                    Q. 写真が少なくても比較できますか？
                  </h3>
                  <p className="text-gray-700 leading-relaxed">
                    プランごとに複数枚の写真を掲載しており、雰囲気やこだわりが伝わるように工夫しています。
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 行動促進（CTAセクション） */}
        <section className="bg-linear-to-r from-pink-500 to-rose-500 py-16 md:py-24">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-3xl md:text-5xl font-bold text-white mb-6 leading-tight">
                理想の結婚式を、今すぐ探してみませんか？
              </h2>
              <p className="text-lg md:text-xl text-pink-50 mb-10 leading-relaxed max-w-3xl mx-auto">
                あなたの世界観や希望条件に合うプランがきっと見つかります。
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <Link
                  href="/search"
                  className="px-8 py-4 bg-white text-pink-600 text-lg font-semibold rounded-full hover:bg-gray-100 transition-colors shadow-lg hover:shadow-xl"
                >
                  Bridalでプランを検索する
                </Link>
                <Link
                  href="/line"
                  className="px-8 py-4 bg-transparent border-2 border-white text-white text-lg font-semibold rounded-full hover:bg-white hover:text-pink-600 transition-colors"
                >
                  LINEで相談する
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* LINE相談ボタン（右下固定） */}
      <LineConsultationButton />
    </div>
  )
}

