'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { createClient } from '@/lib/supabase/client'

export default function EditProfilePage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [providerId, setProviderId] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    name: '',
    bio: '',
    profileImage: null as File | null,
    currentProfileImage: null as string | null,
  })

  useEffect(() => {
    const id = localStorage.getItem('provider_id')
    if (!id) {
      router.push('/provider/login')
      return
    }
    setProviderId(id)
    fetchProfile(id)
  }, [router])

  const fetchProfile = async (id: string) => {
    try {
      const supabase = createClient()
      const { data, error } = await supabase
        .from('providers')
        .select('*')
        .eq('id', id)
        .single()

      if (error) {
        console.error('Error fetching profile:', error)
        alert('プロフィールの取得に失敗しました')
        return
      }

      if (data) {
        setFormData({
          name: data.name || '',
          bio: data.bio || '',
          profileImage: null,
          currentProfileImage: data.profile_image || null,
        })
      }
    } catch (err) {
      console.error('Error:', err)
      alert('プロフィールの取得に失敗しました')
    } finally {
      setLoading(false)
    }
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFormData({ ...formData, profileImage: e.target.files[0] })
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!providerId) return

    setSaving(true)

    try {
      const supabase = createClient()

      // プロフィール画像をアップロード
      let profileImagePath = formData.currentProfileImage

      if (formData.profileImage) {
        // 古い画像を削除
        if (formData.currentProfileImage) {
          await supabase.storage
            .from('provider-profiles')
            .remove([formData.currentProfileImage])
        }

        // 新しい画像をアップロード
        const fileExt = formData.profileImage.name.split('.').pop()
        const fileName = `${providerId}-${Date.now()}.${fileExt}`
        const { error: uploadError } = await supabase.storage
          .from('provider-profiles')
          .upload(fileName, formData.profileImage, {
            cacheControl: '3600',
            upsert: false,
          })

        if (uploadError) {
          console.error('Error uploading image:', uploadError)
          alert('画像のアップロードに失敗しました')
          setSaving(false)
          return
        }

        profileImagePath = fileName
      }

      // プロフィール情報を更新
      const { error } = await supabase
        .from('providers')
        .update({
          name: formData.name,
          bio: formData.bio || null,
          profile_image: profileImagePath,
        })
        .eq('id', providerId)

      if (error) {
        console.error('Error updating profile:', error)
        alert('プロフィールの更新に失敗しました: ' + error.message)
        return
      }

      alert('プロフィールを更新しました')
      router.push('/provider/dashboard')
    } catch (err) {
      console.error('Error:', err)
      alert('プロフィールの更新に失敗しました')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p>読み込み中...</p>
      </div>
    )
  }

  const supabase = createClient()
  const profileImageUrl = formData.currentProfileImage
    ? supabase.storage.from('provider-profiles').getPublicUrl(formData.currentProfileImage).data.publicUrl
    : null

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">プロフィール設定</h1>

          <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-8">
            {/* プロフィール画像 */}
            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                プロフィール画像
              </label>
              <div className="flex items-center gap-4">
                {profileImageUrl && (
                  <div className="relative w-24 h-24 rounded-full overflow-hidden bg-gray-200">
                    <Image
                      src={profileImageUrl}
                      alt="現在のプロフィール画像"
                      fill
                      className="object-cover"
                    />
                  </div>
                )}
                {!profileImageUrl && (
                  <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center text-gray-400">
                    画像なし
                  </div>
                )}
                <div className="flex-1">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-pink-50 file:text-pink-700 hover:file:bg-pink-100"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    JPG、PNG、GIF形式（最大5MB）
                  </p>
                </div>
              </div>
            </div>

            {/* 事業者名 */}
            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                事業者名 <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-pink-500"
              />
            </div>

            {/* プロフィール */}
            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                プロフィール
              </label>
              <textarea
                value={formData.bio}
                onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                rows={6}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-pink-500"
                placeholder="事業者についての説明を入力してください"
              />
            </div>

            {/* ボタン */}
            <div className="flex gap-4">
              <button
                type="button"
                onClick={() => router.push('/provider/dashboard')}
                className="flex-1 px-6 py-3 bg-gray-200 text-gray-700 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
              >
                キャンセル
              </button>
              <button
                type="submit"
                disabled={saving}
                className="flex-1 px-6 py-3 bg-pink-500 text-white rounded-lg font-semibold hover:bg-pink-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {saving ? '保存中...' : '保存'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}


