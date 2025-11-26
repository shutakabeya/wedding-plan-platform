'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import {
  SCALE_OPTIONS,
  WORLD_VIEW_OPTIONS,
  PURPOSE_OPTIONS,
  PREFECTURES,
} from '@/types/database'
import Link from 'next/link'

export default function EditPlanPage() {
  const router = useRouter()
  const params = useParams()
  const planId = params.id as string
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [providerId, setProviderId] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    title: '',
    price: '',
    scale: '',
    world_view: [] as string[],
    location: '',
    purpose: '',
    date_range: '',
    summary_points: [''],
    description: '',
  })
  const [existingImages, setExistingImages] = useState<string[]>([])
  const [newImages, setNewImages] = useState<File[]>([])

  useEffect(() => {
    const id = localStorage.getItem('provider_id')
    if (!id) {
      router.push('/provider/login')
      return
    }
    setProviderId(id)
    fetchPlan(id)
  }, [router, planId])

  const fetchPlan = async (id: string) => {
    try {
      const supabase = createClient()
      const { data, error } = await supabase
        .from('plans')
        .select('*')
        .eq('id', planId)
        .eq('provider_id', id)
        .single()

      if (error || !data) {
        alert('プランが見つかりません')
        router.push('/provider/dashboard')
        return
      }

      setFormData({
        title: data.title,
        price: data.price.toString(),
        scale: data.scale,
        world_view: Array.isArray(data.world_view) ? data.world_view : [data.world_view].filter(Boolean),
        location: data.location,
        purpose: data.purpose,
        date_range: data.date_range || '',
        summary_points: data.summary_points && data.summary_points.length > 0
          ? data.summary_points
          : [''],
        description: data.description || '',
      })
      setExistingImages(data.images || [])
    } catch (err) {
      console.error('Error:', err)
      alert('プランの取得に失敗しました')
    } finally {
      setLoading(false)
    }
  }

  const handleSummaryPointChange = (index: number, value: string) => {
    const newPoints = [...formData.summary_points]
    newPoints[index] = value
    setFormData({ ...formData, summary_points: newPoints })
  }

  const addSummaryPoint = () => {
    setFormData({
      ...formData,
      summary_points: [...formData.summary_points, ''],
    })
  }

  const removeSummaryPoint = (index: number) => {
    const newPoints = formData.summary_points.filter((_, i) => i !== index)
    setFormData({ ...formData, summary_points: newPoints })
  }

  const toggleWorldView = (value: string) => {
    const current = formData.world_view
    const exists = current.includes(value)
    const next = exists ? current.filter((v) => v !== value) : [...current, value]
    setFormData({ ...formData, world_view: next })
  }

  const handleNewImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setNewImages(Array.from(e.target.files))
    }
  }

  const removeExistingImage = (index: number) => {
    setExistingImages(existingImages.filter((_, i) => i !== index))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!providerId) return

    setSaving(true)

    try {
      const supabase = createClient()

      // 新しい画像をアップロード
      const newImagePaths: string[] = []
      for (const image of newImages) {
        const fileName = `${Date.now()}-${image.name}`
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('plan-images')
          .upload(fileName, image)

        if (uploadError) {
          console.error('Upload error:', uploadError)
          continue
        }

        if (uploadData) {
          newImagePaths.push(uploadData.path)
        }
      }

      // プランを更新
      const { error } = await supabase
        .from('plans')
        .update({
          title: formData.title,
          price: parseInt(formData.price),
          scale: formData.scale,
          world_view: formData.world_view,
          location: formData.location,
          purpose: formData.purpose,
          date_range: formData.date_range || null,
          summary_points: formData.summary_points.filter((p) => p.trim() !== ''),
          description: formData.description || null,
          images: [...existingImages, ...newImagePaths],
        })
        .eq('id', planId)
        .eq('provider_id', providerId)

      if (error) {
        console.error('Error updating plan:', error)
        alert('プランの更新に失敗しました: ' + error.message)
        setSaving(false)
        return
      }

      router.push('/provider/dashboard')
    } catch (err) {
      console.error('Error:', err)
      alert('プランの更新に失敗しました')
      setSaving(false)
    }
  }

  if (loading || !providerId) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p>読み込み中...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <Link
            href="/provider/dashboard"
            className="text-gray-600 hover:text-gray-900"
          >
            ← ダッシュボードに戻る
          </Link>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">プラン編集</h1>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* 既存のフォームフィールド（new/page.tsxと同じ） */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                プラン名 <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-pink-500"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                価格（円） <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                required
                min="0"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-pink-500"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                規模 <span className="text-red-500">*</span>
              </label>
              <select
                value={formData.scale}
                onChange={(e) => setFormData({ ...formData, scale: e.target.value })}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-pink-500"
              >
                <option value="">選択してください</option>
                {SCALE_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                世界観 <span className="text-red-500">*</span>
              </label>
              <p className="text-xs text-gray-500 mb-2">
                複数選択可（当てはまる世界観をすべて選んでください）
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {WORLD_VIEW_OPTIONS.map((option) => {
                  const checked = formData.world_view.includes(option)
                  return (
                    <label
                      key={option}
                      className={`flex items-center gap-2 rounded-lg border px-3 py-2 text-sm cursor-pointer transition-colors ${
                        checked
                          ? 'border-pink-500 bg-pink-50 text-pink-700'
                          : 'border-gray-300 bg-white hover:border-pink-300'
                      }`}
                    >
                      <input
                        type="checkbox"
                        className="h-4 w-4"
                        checked={checked}
                        onChange={() => toggleWorldView(option)}
                      />
                      <span>{option}</span>
                    </label>
                  )
                })}
              </div>
              {formData.world_view.length === 0 && (
                <p className="mt-1 text-xs text-red-500">少なくとも1つは選択してください。</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                場所 <span className="text-red-500">*</span>
              </label>
              <select
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-pink-500"
              >
                <option value="">選択してください</option>
                {PREFECTURES.map((pref) => (
                  <option key={pref} value={pref}>
                    {pref}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                目的 <span className="text-red-500">*</span>
              </label>
              <select
                value={formData.purpose}
                onChange={(e) => setFormData({ ...formData, purpose: e.target.value })}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-pink-500"
              >
                <option value="">選択してください</option>
                {PURPOSE_OPTIONS.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                日程
              </label>
              <input
                type="text"
                value={formData.date_range}
                onChange={(e) => setFormData({ ...formData, date_range: e.target.value })}
                placeholder="例: 2024年4月〜6月"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-pink-500"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                プラン内容（箇条書き）
              </label>
              {formData.summary_points.map((point, index) => (
                <div key={index} className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={point}
                    onChange={(e) => handleSummaryPointChange(index, e.target.value)}
                    placeholder="プラン内容を入力"
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-pink-500"
                  />
                  {formData.summary_points.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeSummaryPoint(index)}
                      className="px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200"
                    >
                      削除
                    </button>
                  )}
                </div>
              ))}
              <button
                type="button"
                onClick={addSummaryPoint}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
              >
                + 項目を追加
              </button>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                詳細説明
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={8}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-pink-500"
              />
            </div>

            {/* 既存画像 */}
            {existingImages.length > 0 && (
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  既存の画像
                </label>
                <div className="grid grid-cols-3 gap-4">
                  {existingImages.map((imagePath, index) => (
                    <div key={index} className="relative">
                      <div className="aspect-square bg-gray-200 rounded-lg flex items-center justify-center">
                        <span className="text-sm text-gray-500">画像 {index + 1}</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeExistingImage(index)}
                        className="absolute top-2 right-2 px-2 py-1 bg-red-500 text-white rounded text-sm hover:bg-red-600"
                      >
                        削除
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 新しい画像アップロード */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                新しい画像を追加（複数選択可）
              </label>
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleNewImageChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-pink-500"
              />
              {newImages.length > 0 && (
                <p className="mt-2 text-sm text-gray-600">
                  {newImages.length}枚の画像が選択されています
                </p>
              )}
            </div>

            <div className="flex gap-4">
              <button
                type="submit"
                disabled={saving}
                className="flex-1 bg-pink-500 text-white py-3 rounded-lg font-semibold hover:bg-pink-600 transition-colors disabled:opacity-50"
              >
                {saving ? '保存中...' : '変更を保存'}
              </button>
              <Link
                href="/provider/dashboard"
                className="flex-1 text-center bg-gray-200 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
              >
                キャンセル
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

