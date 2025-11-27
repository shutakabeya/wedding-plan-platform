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
    cta_type: '' as 'phone' | 'email' | 'link' | '',
    cta_value: '',
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
      // 明示的にcta_typeとcta_valueを指定して取得
      const { data, error } = await supabase
        .from('plans')
        .select('*, cta_type, cta_value')
        .eq('id', planId)
        .eq('provider_id', id)
        .single()

      if (error || !data) {
        console.error('Error fetching plan:', error)
        alert('プランが見つかりません')
        router.push('/provider/dashboard')
        return
      }

      // デバッグ: 取得したデータ全体を確認
      console.log('Fetched plan data:', data)
      console.log('CTA fields in data:', { 
        has_cta_type: 'cta_type' in data, 
        has_cta_value: 'cta_value' in data,
        cta_type: data.cta_type,
        cta_value: data.cta_value
      })

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
        cta_type: (data.cta_type as 'phone' | 'email' | 'link' | '') || '',
        cta_value: data.cta_value || '',
      })
      
      // デバッグ: CTAデータが読み込まれているか確認
      console.log('Loaded CTA data:', { cta_type: data.cta_type, cta_value: data.cta_value })
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
        // ファイル名から日本語文字や特殊文字を削除し、安全な文字のみを使用
        const safeFileName = image.name
          .replace(/[^\w.-]/g, '_') // 英数字、アンダースコア、ピリオド、ハイフン以外をアンダースコアに置換
          .replace(/_{2,}/g, '_') // 連続するアンダースコアを1つに
          .replace(/^_+|_+$/g, '') // 先頭と末尾のアンダースコアを削除
        const fileName = `${Date.now()}-${safeFileName}`
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
      const baseUpdateData: any = {
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
      }

      // CTA設定を追加
      const updateDataWithCTA = {
        ...baseUpdateData,
        cta_type: formData.cta_type && formData.cta_value ? formData.cta_type : null,
        cta_value: formData.cta_type && formData.cta_value ? formData.cta_value : null,
      }

      // まずCTAを含めて更新を試行
      let { error } = await supabase
        .from('plans')
        .update(updateDataWithCTA)
        .eq('id', planId)
        .eq('provider_id', providerId)

      // スキーマキャッシュエラー（PGRST204）の場合は、CTAを除外して再試行
      if (error && error.code === 'PGRST204') {
        console.warn('CTAカラムがスキーマキャッシュに見つかりません。CTAを除外して更新します。')
        console.warn('スキーマキャッシュをリフレッシュしてください。詳細はFIX_CTA_SCHEMA_CACHE.mdを参照してください。')
        
        // CTAを除外して再試行
        const { error: retryError } = await supabase
          .from('plans')
          .update(baseUpdateData)
          .eq('id', planId)
          .eq('provider_id', providerId)

        if (retryError) {
          console.error('Error updating plan (without CTA):', retryError)
          alert('プランの更新に失敗しました（CTA設定は保存されませんでした）: ' + (retryError.message || JSON.stringify(retryError)))
          setSaving(false)
          return
        } else {
          alert('プランは更新されましたが、CTA設定は保存されませんでした。\nスキーマキャッシュをリフレッシュしてから再度お試しください。')
        }
      } else if (error) {
        console.error('Error updating plan:', error)
        console.error('Error details:', JSON.stringify(error, null, 2))
        console.error('Update data:', JSON.stringify(updateDataWithCTA, null, 2))
        alert('プランの更新に失敗しました: ' + (error.message || JSON.stringify(error)))
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
            className="text-gray-700 hover:text-gray-900"
          >
            ← ダッシュボードに戻る
          </Link>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">プラン編集</h1>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* 既存のフォームフィールド（new/page.tsxと同じ） */}
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
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
              <label className="block text-sm font-semibold text-gray-900 mb-2">
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
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                規模 <span className="text-red-500">*</span>
              </label>
              <select
                value={formData.scale}
                onChange={(e) => setFormData({ ...formData, scale: e.target.value })}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-pink-500 text-gray-900 bg-white"
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
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                世界観 <span className="text-red-500">*</span>
              </label>
              <p className="text-xs text-gray-700 mb-2">
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
                          : 'border-gray-300 bg-white text-gray-900 hover:border-pink-300'
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
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                場所 <span className="text-red-500">*</span>
              </label>
              <select
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-pink-500 text-gray-900 bg-white"
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
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                目的 <span className="text-red-500">*</span>
              </label>
              <select
                value={formData.purpose}
                onChange={(e) => setFormData({ ...formData, purpose: e.target.value })}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-pink-500 text-gray-900 bg-white"
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
              <label className="block text-sm font-semibold text-gray-900 mb-2">
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
              <label className="block text-sm font-semibold text-gray-900 mb-2">
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
              <label className="block text-sm font-semibold text-gray-900 mb-2">
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
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  既存の画像
                </label>
                <div className="grid grid-cols-3 gap-4">
                  {existingImages.map((imagePath, index) => (
                    <div key={index} className="relative">
                      <div className="aspect-square bg-gray-200 rounded-lg flex items-center justify-center">
                        <span className="text-sm text-gray-700">画像 {index + 1}</span>
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
              <label className="block text-sm font-semibold text-gray-900 mb-2">
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
                <p className="mt-2 text-sm text-gray-700">
                  {newImages.length}枚の画像が選択されています
                </p>
              )}
            </div>

            {/* 相談ボタン設定 */}
            <div className="border-t pt-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">相談ボタン設定</h3>
              <p className="text-sm text-gray-600 mb-4">
                プランページに表示される「まずは相談してみる」ボタンの動作を設定します
              </p>
              
              {/* CTAタイプ選択 */}
              <div className="mb-4">
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  相談方法
                </label>
                <div className="space-y-2">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="cta_type"
                      value="phone"
                      checked={formData.cta_type === 'phone'}
                      onChange={(e) => setFormData({ ...formData, cta_type: e.target.value as 'phone', cta_value: '' })}
                      className="h-4 w-4"
                    />
                    <span>電話</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="cta_type"
                      value="email"
                      checked={formData.cta_type === 'email'}
                      onChange={(e) => setFormData({ ...formData, cta_type: e.target.value as 'email', cta_value: '' })}
                      className="h-4 w-4"
                    />
                    <span>メール</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="cta_type"
                      value="link"
                      checked={formData.cta_type === 'link'}
                      onChange={(e) => setFormData({ ...formData, cta_type: e.target.value as 'link', cta_value: '' })}
                      className="h-4 w-4"
                    />
                    <span>リンク（URL）</span>
                  </label>
                </div>
              </div>

              {/* CTA値入力 */}
              {formData.cta_type && (
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    {formData.cta_type === 'phone' && '電話番号'}
                    {formData.cta_type === 'email' && 'メールアドレス'}
                    {formData.cta_type === 'link' && 'URL'}
                  </label>
                  <input
                    type={formData.cta_type === 'email' ? 'email' : 'text'}
                    value={formData.cta_value}
                    onChange={(e) => setFormData({ ...formData, cta_value: e.target.value })}
                    placeholder={
                      formData.cta_type === 'phone' ? '例: 090-1234-5678'
                      : formData.cta_type === 'email' ? '例: contact@example.com'
                      : '例: https://example.com/contact'
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-pink-500"
                  />
                </div>
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

