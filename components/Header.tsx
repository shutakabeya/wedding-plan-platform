'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

export default function Header() {
  const router = useRouter()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [userEmail, setUserEmail] = useState<string | null>(null)

  useEffect(() => {
    // 認証状態を確認
    const userId = localStorage.getItem('user_id')
    const email = localStorage.getItem('user_email')
    setIsLoggedIn(!!userId)
    setUserEmail(email)
  }, [])

  const handleLogout = () => {
    localStorage.removeItem('user_id')
    localStorage.removeItem('user_email')
    setIsLoggedIn(false)
    setUserEmail(null)
    router.push('/')
  }

  return (
    <>
      {/* PC版: 透明でぼかし効果のあるヘッダー */}
      <header className="hidden md:block fixed top-0 left-0 right-0 z-50 bg-white/30 backdrop-blur-md border-b border-white/20">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            {/* 左: サイドバーボタン */}
            <button
              onClick={() => setSidebarOpen(true)}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              aria-label="メニューを開く"
            >
              <svg
                className="w-6 h-6 text-gray-700"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path d="M4 6h16M4 12h16M4 18h16"></path>
              </svg>
            </button>

            {/* 中央: タイトル */}
            <Link href="/" className="text-2xl font-bold text-gray-900 hover:text-pink-600 transition-colors">
              Bridal
            </Link>

            {/* 右: 新規登録・ログインボタン or ユーザー情報 */}
            <div className="flex items-center gap-3">
              {isLoggedIn ? (
                <>
                  <Link
                    href="/favorites"
                    className="px-4 py-2 text-gray-700 hover:text-gray-900 font-medium transition-colors"
                  >
                    お気に入り
                  </Link>
                  <span className="text-sm text-gray-600">{userEmail}</span>
                  <button
                    onClick={handleLogout}
                    className="px-4 py-2 text-gray-700 hover:text-gray-900 font-medium transition-colors"
                  >
                    ログアウト
                  </button>
                </>
              ) : (
                <>
                  <Link
                    href="/signup"
                    className="px-4 py-2 text-gray-700 hover:text-gray-900 font-medium transition-colors"
                  >
                    新規登録
                  </Link>
                  <Link
                    href="/login"
                    className="px-4 py-2 bg-pink-500 text-white rounded-lg font-semibold hover:bg-pink-600 transition-colors"
                  >
                    ログイン
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* スマホ版: ヘッダーあり（控えめな色） */}
      <header className="md:hidden fixed top-0 left-0 right-0 z-50 bg-linear-to-r from-pink-200 to-pink-300 shadow-sm">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            {/* 左: サイドバーボタン */}
            <button
              onClick={() => setSidebarOpen(true)}
              className="p-2 text-gray-700 hover:bg-pink-200 rounded-lg transition-colors"
              aria-label="メニューを開く"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path d="M4 6h16M4 12h16M4 18h16"></path>
              </svg>
            </button>

            {/* 中央: タイトル */}
            <Link href="/" className="text-lg font-bold text-gray-800 hover:text-pink-700 transition-colors">
              Bridal
            </Link>

            {/* 右: プロフィールマーク or ログアウト */}
            {isLoggedIn ? (
              <button
                onClick={handleLogout}
                className="p-2 text-gray-700 hover:bg-pink-200 rounded-lg transition-colors"
                aria-label="ログアウト"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path>
                </svg>
              </button>
            ) : (
              <Link
                href="/login"
                className="p-2 text-gray-700 hover:bg-pink-200 rounded-lg transition-colors"
                aria-label="ログイン"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                </svg>
              </Link>
            )}
          </div>
        </div>
      </header>

      {/* サイドバー */}
      {sidebarOpen && (
        <>
          {/* オーバーレイ */}
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-40"
            onClick={() => setSidebarOpen(false)}
          ></div>

          {/* サイドバーメニュー */}
          <aside
            className="fixed top-0 left-0 h-full w-64 bg-white shadow-xl z-50 transform transition-transform duration-300 translate-x-0"
          >
            <div className="p-4">
              {/* 閉じるボタン */}
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-gray-900">メニュー</h2>
                <button
                  onClick={() => setSidebarOpen(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  aria-label="メニューを閉じる"
                >
                  <svg
                    className="w-6 h-6 text-gray-700"
                    fill="none"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path d="M6 18L18 6M6 6l12 12"></path>
                  </svg>
                </button>
              </div>

              {/* メニュー項目 */}
              <nav className="space-y-2">
                <Link
                  href="/"
                  className="block px-4 py-3 text-gray-700 hover:bg-pink-50 rounded-lg transition-colors"
                  onClick={() => setSidebarOpen(false)}
                >
                  ホーム
                </Link>
                <Link
                  href="/search"
                  className="block px-4 py-3 text-gray-700 hover:bg-pink-50 rounded-lg transition-colors"
                  onClick={() => setSidebarOpen(false)}
                >
                  検索
                </Link>
                <Link
                  href="/worldview"
                  className="block px-4 py-3 text-gray-700 hover:bg-pink-50 rounded-lg transition-colors"
                  onClick={() => setSidebarOpen(false)}
                >
                  世界観で探す
                </Link>
                <div className="border-t border-gray-200 my-4"></div>
                {isLoggedIn ? (
                  <>
                    <Link
                      href="/favorites"
                      className="block px-4 py-3 text-gray-700 hover:bg-pink-50 rounded-lg transition-colors"
                      onClick={() => setSidebarOpen(false)}
                    >
                      お気に入り
                    </Link>
                    <div className="px-4 py-2 text-sm text-gray-600">
                      {userEmail}
                    </div>
                    <button
                      onClick={() => {
                        handleLogout()
                        setSidebarOpen(false)
                      }}
                      className="w-full text-left px-4 py-3 text-gray-700 hover:bg-pink-50 rounded-lg transition-colors"
                    >
                      ログアウト
                    </button>
                  </>
                ) : (
                  <>
                    <Link
                      href="/login"
                      className="block px-4 py-3 text-gray-700 hover:bg-pink-50 rounded-lg transition-colors"
                      onClick={() => setSidebarOpen(false)}
                    >
                      ログイン
                    </Link>
                    <Link
                      href="/signup"
                      className="block px-4 py-3 text-gray-700 hover:bg-pink-50 rounded-lg transition-colors"
                      onClick={() => setSidebarOpen(false)}
                    >
                      新規登録
                    </Link>
                  </>
                )}
                <div className="border-t border-gray-200 my-4"></div>
                <Link
                  href="/provider/login"
                  className="block px-4 py-3 text-sm text-gray-500 hover:bg-pink-50 rounded-lg transition-colors"
                  onClick={() => setSidebarOpen(false)}
                >
                  事業者ログイン
                </Link>
              </nav>
            </div>
          </aside>
        </>
      )}
    </>
  )
}

