import Link from 'next/link'
import Header from '@/components/Header'

export default function ProviderLandingPage() {
  return (
    <div className="min-h-screen bg-linear-to-b from-pink-50 to-white">
      <Header />
      
      <main className="pt-20 md:pt-24">
        {/* ヒーローセクション */}
        <section className="container mx-auto px-4 py-16 md:py-24">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
              Bridal for Vendors
            </h1>
            <p className="text-2xl md:text-3xl font-semibold text-pink-600 mb-4">
              理想のカップルと出会える場所
            </p>
            <p className="text-lg md:text-xl text-gray-600 mb-8 leading-relaxed max-w-3xl mx-auto">
              結婚式市場には、見込み客との出会いを難しくする課題が山積しています。
              カップルは平均で200時間以上を費やして業者を調べて比較し、情報が不透明なため23％も予算を超過してしまうことがあるといわれています。
              さらに87％のカップルが計画中に高いストレスを感じ、73％が初期予算を15％以上も上回ってしまいます。
            </p>
            <p className="text-base md:text-lg text-gray-700 mb-8 leading-relaxed max-w-3xl mx-auto">
              価格や内容を公開しない業者が多いことから、ユーザーは適切な比較ができず、業者側も本気度の低い問い合わせに時間を取られているのが現状です。
            </p>
            <p className="text-base md:text-lg text-gray-700 mb-10 leading-relaxed max-w-3xl mx-auto">
              <span className="font-semibold">Bridal</span>は、カップルが求める「世界観・会場タイプ・人数・予算」を軸にプランを探せる新しい検索プラットフォームです。
              世界観や料金、規模などを明確に登録できることで、あなたの強みが伝わりやすくなり、条件に合ったカップルからの問い合わせを得られます。
            </p>
            <Link
              href="/"
              className="inline-block px-8 py-4 bg-pink-500 text-white text-lg font-semibold rounded-full hover:bg-pink-600 transition-colors shadow-lg hover:shadow-xl"
            >
              トップページでプラットフォームを確認
            </Link>
          </div>
        </section>

        {/* なぜ今、Bridalに参加すべきなのか */}
        <section className="bg-white py-16 md:py-24">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 text-center mb-12 md:mb-16">
                なぜ今、Bridalに参加すべきなのか
              </h2>
              
              {/* 結婚式業界の課題 */}
              <div className="mb-16">
                <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-8 text-center">
                  結婚式業界の課題
                </h3>
                
                <div className="grid md:grid-cols-3 gap-6 md:gap-8">
                  {/* 課題1 */}
                  <div className="bg-linear-to-br from-red-50 to-pink-50 p-6 md:p-8 rounded-2xl shadow-lg border border-red-100">
                    <div className="text-4xl mb-4">💰</div>
                    <h4 className="text-xl font-bold text-gray-900 mb-4">
                      価格の不透明さがストレスとオーバーコストを生む
                    </h4>
                    <p className="text-gray-700 leading-relaxed">
                      2,500組以上を調査した研究によると、隠れた料金や比較ツールの不足によりカップルは平均で23％オーバー支出しており、87％が高いストレスを感じています。
                      多くの業者が料金を公開しないことが、こうした問題の一因になっています。
                    </p>
                  </div>

                  {/* 課題2 */}
                  <div className="bg-linear-to-br from-orange-50 to-yellow-50 p-6 md:p-8 rounded-2xl shadow-lg border border-orange-100">
                    <div className="text-4xl mb-4">⏰</div>
                    <h4 className="text-xl font-bold text-gray-900 mb-4">
                      見込み度の低いリードに時間を費やしている
                    </h4>
                    <p className="text-gray-700 leading-relaxed">
                      料金を表示しないと、予算に合わないカップルからの問い合わせが増え、本当に合う顧客と出会う機会を逃しがちです。
                      価格を表示している店舗は25％以上問い合わせ率が向上し、より強力なリードを得られることがデータで示されています。
                    </p>
                  </div>

                  {/* 課題3 */}
                  <div className="bg-linear-to-br from-blue-50 to-indigo-50 p-6 md:p-8 rounded-2xl shadow-lg border border-blue-100">
                    <div className="text-4xl mb-4">🔍</div>
                    <h4 className="text-xl font-bold text-gray-900 mb-4">
                      本気度の高い顧客を選びたいが、比較ツールが不足
                    </h4>
                    <p className="text-gray-700 leading-relaxed">
                      調査では68％の業者が「透明な価格設定は自社のビジネスに役立つ」と回答し、78％が「比較ツールはカップルの意思決定を助ける」と考えています。
                      しかし現状では、そのようなツールが少ないため、双方が満足する出会いが難しい状況です。
                    </p>
                  </div>
                </div>
              </div>

              {/* Bridalが解決すること */}
              <div>
                <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-8 text-center">
                  Bridalが解決すること
                </h3>
                
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                  {/* 解決策1 */}
                  <div className="bg-white p-6 md:p-8 rounded-2xl shadow-lg border-2 border-pink-200 hover:border-pink-400 transition-colors">
                    <div className="text-4xl mb-4">✨</div>
                    <h4 className="text-xl font-bold text-gray-900 mb-4">
                      透明で簡潔なプロフィール
                    </h4>
                    <p className="text-gray-700 leading-relaxed">
                      プランの名前、料金帯、提供エリア、対応人数、会場タイプ、世界観タグ、日程などをテンプレートに沿って入力するだけで、統一感のあるプロフィールページが完成します。
                      カップルは世界観・価格帯・規模などで検索できるため、あなたのプランを条件に合ったカップルに届けられます。
                    </p>
                  </div>

                  {/* 解決策2 */}
                  <div className="bg-white p-6 md:p-8 rounded-2xl shadow-lg border-2 border-pink-200 hover:border-pink-400 transition-colors">
                    <div className="text-4xl mb-4">🎯</div>
                    <h4 className="text-xl font-bold text-gray-900 mb-4">
                      質の高い問い合わせ
                    </h4>
                    <p className="text-gray-700 leading-relaxed">
                      Bridalはカップルの検索時に予算や規模を明示させる設計なので、価格帯のミスマッチを減らし、本気度の高い顧客だけが問い合わせてきます。
                      価格を明示することで問い合わせ率が向上し、高品質なリードが増えることはデータでも示されています。
                    </p>
                  </div>

                  {/* 解決策3 */}
                  <div className="bg-white p-6 md:p-8 rounded-2xl shadow-lg border-2 border-pink-200 hover:border-pink-400 transition-colors">
                    <div className="text-4xl mb-4">📊</div>
                    <h4 className="text-xl font-bold text-gray-900 mb-4">
                      比較・検索機能を重視
                    </h4>
                    <p className="text-gray-700 leading-relaxed">
                      78％のカップルが価格を最重要視し、世界観や人数、会場タイプも重視します。
                      Bridalの検索エンジンはこれらの軸で細かく絞り込み、複数プランを並べて比較できるように設計されています。
                    </p>
                  </div>

                  {/* 解決策4 */}
                  <div className="bg-white p-6 md:p-8 rounded-2xl shadow-lg border-2 border-pink-200 hover:border-pink-400 transition-colors">
                    <div className="text-4xl mb-4">🔐</div>
                    <h4 className="text-xl font-bold text-gray-900 mb-4">
                      安心の登録・管理
                    </h4>
                    <p className="text-gray-700 leading-relaxed">
                      Supabaseを利用したアカウント管理により、メールとパスワードだけで簡単に登録できます。
                      複数プランの登録や編集もダッシュボードから簡単に行えます。
                      掲載は無料で、成約時のみ成功報酬が発生するモデルも利用できます。
                    </p>
                  </div>

                  {/* 解決策5 */}
                  <div className="bg-white p-6 md:p-8 rounded-2xl shadow-lg border-2 border-pink-200 hover:border-pink-400 transition-colors">
                    <div className="text-4xl mb-4">📈</div>
                    <h4 className="text-xl font-bold text-gray-900 mb-4">
                      ビジネスに役立つデータ
                    </h4>
                    <p className="text-gray-700 leading-relaxed">
                      ダッシュボードでは閲覧数や問い合わせ数、人気タグなどを確認できます。
                      需要動向を把握し、プランや料金の改善につなげられます。
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Bridalの使い方 */}
        <section className="bg-linear-to-b from-pink-50 to-white py-16 md:py-24">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 text-center mb-12 md:mb-16">
                Bridalの使い方（事業者向け）
              </h2>
              
              <div className="space-y-8 md:space-y-12">
                {/* ステップ1 */}
                <div className="flex flex-col md:flex-row gap-6 items-start md:items-center bg-white p-6 md:p-8 rounded-2xl shadow-lg">
                  <div className="shrink-0 w-16 h-16 bg-pink-500 text-white rounded-full flex items-center justify-center text-2xl font-bold">
                    1
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-3">
                      無料登録
                    </h3>
                    <p className="text-gray-700 leading-relaxed">
                      メールアドレスとパスワードでサインアップし、プロフィールを作成します。
                    </p>
                  </div>
                </div>

                {/* ステップ2 */}
                <div className="flex flex-col md:flex-row gap-6 items-start md:items-center bg-white p-6 md:p-8 rounded-2xl shadow-lg">
                  <div className="shrink-0 w-16 h-16 bg-pink-500 text-white rounded-full flex items-center justify-center text-2xl font-bold">
                    2
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-3">
                      プラン情報の入力
                    </h3>
                    <p className="text-gray-700 leading-relaxed">
                      料金帯、人数、会場タイプ、世界観タグなどを選択し、写真をアップロードします。
                      透明な価格と情報は、カップルの信頼を獲得する上で重要です。
                    </p>
                  </div>
                </div>

                {/* ステップ3 */}
                <div className="flex flex-col md:flex-row gap-6 items-start md:items-center bg-white p-6 md:p-8 rounded-2xl shadow-lg">
                  <div className="shrink-0 w-16 h-16 bg-pink-500 text-white rounded-full flex items-center justify-center text-2xl font-bold">
                    3
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-3">
                      公開・掲載開始
                    </h3>
                    <p className="text-gray-700 leading-relaxed">
                      すぐに検索結果に表示され、理想のカップルからの問い合わせが届きます。
                      問い合わせは指定のメールやLINEで受け取ることができ、やり取りはあなた自身が自由に行えます。
                    </p>
                  </div>
                </div>

                {/* ステップ4 */}
                <div className="flex flex-col md:flex-row gap-6 items-start md:items-center bg-white p-6 md:p-8 rounded-2xl shadow-lg">
                  <div className="shrink-0 w-16 h-16 bg-pink-500 text-white rounded-full flex items-center justify-center text-2xl font-bold">
                    4
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-3">
                      改善とアップデート
                    </h3>
                    <p className="text-gray-700 leading-relaxed">
                      ダッシュボードで統計データを確認し、写真や説明文、料金などを調整してさらに魅力的なページに更新できます。
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* よくある質問 */}
        <section className="bg-white py-16 md:py-24">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 text-center mb-12 md:mb-16">
                よくある質問
              </h2>
              
              <div className="space-y-6">
                {/* FAQ1 */}
                <div className="bg-gray-50 p-6 md:p-8 rounded-2xl border border-gray-200">
                  <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-4">
                    Q. 料金を公開するメリットはありますか？
                  </h3>
                  <p className="text-gray-700 leading-relaxed">
                    はい。研究では、価格を公開している店舗は問い合わせ率が25％向上し、カップルは予算が近い業者に自信を持って連絡できるようになります。
                    また、調査では業者の68％が透明な価格設定がビジネスに有益だと回答しています。
                  </p>
                </div>

                {/* FAQ2 */}
                <div className="bg-gray-50 p-6 md:p-8 rounded-2xl border border-gray-200">
                  <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-4">
                    Q. 小規模事業者や個人クリエイターでも掲載できますか？
                  </h3>
                  <p className="text-gray-700 leading-relaxed">
                    もちろんです。世界観や人数、地域を明確にできるプランであれば、規模の大小に関わらず掲載できます。
                    プロフィール作成はテンプレート形式で簡単に行えます。
                  </p>
                </div>

                {/* FAQ3 */}
                <div className="bg-gray-50 p-6 md:p-8 rounded-2xl border border-gray-200">
                  <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-4">
                    Q. 成約手数料以外に費用はかかりますか？
                  </h3>
                  <p className="text-gray-700 leading-relaxed">
                    Bridalは基本掲載無料です。将来的には有料プランや広告枠を提供予定ですが、MVPフェーズでは登録費用や掲載費用はありません。
                    成約した場合のみ、あらかじめ合意した成功報酬が発生します。
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 最終CTAセクション */}
        <section className="bg-linear-to-r from-pink-500 to-rose-500 py-16 md:py-24">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-3xl md:text-5xl font-bold text-white mb-6 leading-tight">
                いま始めましょう
              </h2>
              <p className="text-lg md:text-xl text-pink-50 mb-8 leading-relaxed max-w-3xl mx-auto">
                結婚式業界は、価格の不透明さと情報格差がカップルに負担を与え、業者にも負の影響を及ぼしています。
                Bridalは、世界観・人数・会場タイプ・価格を基準にした検索体験を提供し、双方にとって最適な出会いを実現することを目指しています。
                今すぐ無料で登録し、理想のカップルと出会える準備を始めましょう。
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <Link
                  href="/"
                  className="px-8 py-4 bg-white text-pink-600 text-lg font-semibold rounded-full hover:bg-gray-100 transition-colors shadow-lg hover:shadow-xl"
                >
                  トップページでプラットフォームを確認
                </Link>
                <Link
                  href="/provider/signup"
                  className="px-8 py-4 bg-transparent border-2 border-white text-white text-lg font-semibold rounded-full hover:bg-white hover:text-pink-600 transition-colors"
                >
                  無料掲載を始める
                </Link>
              </div>
              <p className="text-base md:text-lg text-pink-100 mt-8">
                あなたのプランにぴったりのカップルが待っています。まずは簡単な登録から始めて、Bridalでビジネスの新しい可能性を見つけましょう。
              </p>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}

