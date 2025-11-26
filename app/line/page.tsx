import Link from 'next/link'

export default function LinePage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-50 to-white">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-2xl mx-auto text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-6">LINE相談について</h1>
          
          <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
            <p className="text-lg text-gray-700 mb-6">
              ご質問やご相談がございましたら、お気軽にLINEでお問い合わせください。
            </p>
            <p className="text-gray-600 mb-8">
              プランに関する詳細なご質問、カスタマイズのご相談など、お客様のご要望にお応えします。
            </p>

            {/* LINE QRコードまたはリンク */}
            <div className="mb-8">
              <p className="text-sm text-gray-500 mb-4">
                以下のQRコードを読み取るか、ボタンをクリックしてLINEでお友達追加してください。
              </p>
              {/* TODO: 実際のLINE QRコード画像またはリンクを追加 */}
              <div className="bg-gray-200 w-64 h-64 mx-auto rounded-lg flex items-center justify-center mb-4">
                <p className="text-gray-400">LINE QRコード</p>
              </div>
              <a
                href="https://line.me/R/ti/p/@your-line-id"
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
                LINEでお友達追加
              </a>
            </div>
          </div>

          <Link
            href="/"
            className="text-pink-600 hover:text-pink-700 font-semibold"
          >
            ← トップページに戻る
          </Link>
        </div>
      </div>
    </div>
  )
}

