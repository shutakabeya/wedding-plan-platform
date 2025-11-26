'use client'

import { useRouter, useSearchParams } from 'next/navigation'

export default function SortSelector() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const handleSortChange = (value: string) => {
    const params = new URLSearchParams(searchParams.toString())
    params.set('sort', value)
    router.push(`/search?${params.toString()}`)
  }

  return (
    <select
      className="px-4 py-2 border rounded"
      defaultValue={searchParams.get('sort') || 'created_desc'}
      onChange={(e) => handleSortChange(e.target.value)}
    >
      <option value="created_desc">新着順</option>
      <option value="price_asc">価格が安い順</option>
      <option value="price_desc">価格が高い順</option>
    </select>
  )
}

