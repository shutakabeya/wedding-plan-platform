'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const supabase = createClient()
      
      // 簡易認証（MVPではSupabase Authを使用せず、直接DBを確認）
      // 注意: 本番環境では適切な認証を実装してください
      const { data, error: authError } = await supabase
        .from('users')
        .select('id, email, password_hash')
        .eq('email', email)
        .single()

      if (authError) {
        console.error('Login error:', authError)
        if (authError.message?.includes('JWT') || authError.message?.includes('Invalid API key')) {
          setError('Supabaseの設定を確認してください。環境変数が正しく設定されているか確認してください。')
        } else {
          setError('ログインに失敗しました: ' + authError.message)
        }
        setLoading(false)
        return
      }

      if (!data) {
        setError('メールアドレスまたはパスワードが正しくありません')
        setLoading(false)
        return
      }

      // パスワード検証（簡易実装）
      // 注意: 本番環境ではbcryptなどでハッシュ化されたパスワードを検証してください
      // ここでは簡易的にpassword_hashと比較（実際にはハッシュ化が必要）
      if (data.password_hash !== password) {
        setError('メールアドレスまたはパスワードが正しくありません')
        setLoading(false)
        return
      }

      // セッション管理（簡易実装）
      // 本番環境では適切なセッション管理を実装してください
      localStorage.setItem('user_id', data.id)
      localStorage.setItem('user_email', data.email)

      router.push('/')
    } catch (err) {
      console.error('Login error:', err)
      setError('ログインに失敗しました。ブラウザのコンソールでエラー詳細を確認してください。')
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-6 text-center">
            ログイン
          </h1>

          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
                {error}
              </div>
            )}

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                メールアドレス
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-pink-500"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                パスワード
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-pink-500"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-pink-500 text-white py-3 rounded-lg font-semibold hover:bg-pink-600 transition-colors disabled:opacity-50"
            >
              {loading ? 'ログイン中...' : 'ログイン'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <Link
              href="/signup"
              className="text-pink-600 hover:text-pink-700 font-semibold"
            >
              新規登録はこちら
            </Link>
          </div>

          <div className="mt-6 pt-6 border-t border-gray-200">
            <p className="text-sm text-gray-600 text-center mb-3">事業者の方はこちら</p>
            <Link
              href="/provider/login"
              className="block w-full px-4 py-2 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-colors text-center"
            >
              事業者ログイン
            </Link>
          </div>

          <div className="mt-4 text-center">
            <Link
              href="/"
              className="text-gray-600 hover:text-gray-900"
            >
              ← トップページに戻る
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

