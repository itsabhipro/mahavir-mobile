'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

type MarriageCardType = 'Normal' | 'VIP' | 'VVIP'

type Row = {
  id: number
  name: string
  card_type: MarriageCardType
  size: string
  gsm: string
  price: number
  available_stock: number
  max_stock: number
  minimum_order_quantity: number
}

export default function CardTypeEditClient({ id }: { id: string }) {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [row, setRow] = useState<Row | null>(null)
  const [msg, setMsg] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false
    async function load() {
      setLoading(true)
      const r = await fetch(`/api/admin/card-types/${id}`, { cache: 'no-store' })
      const json = await r.json()
      if (!cancelled) {
        setRow(json.data ?? null)
        setLoading(false)
      }
    }
    load()
    return () => { cancelled = true }
  }, [id])

  async function save() {
    if (!row) return
    setSaving(true)
    setMsg(null)
    const r = await fetch(`/api/admin/card-types/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(row),
    })
    const json = await r.json()
    setSaving(false)

    if (!r.ok) {
      setMsg(`❌ ${json.error ?? 'Update failed'}`)
      return
    }
    setMsg('✅ Updated successfully')
    router.refresh()
  }

  if (loading) return <div className="text-sm text-gray-600">Loading…</div>
  if (!row) return <div className="text-sm text-red-700">Not found</div>

  return (
    <div className="mx-auto max-w-2xl space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Edit Card Type #{row.id}</h2>
        <a className="text-sm text-gray-700 hover:underline" href="/admin/services/printing-press/card-types">
          ← Back
        </a>
      </div>

      {msg && <div className="rounded-lg bg-gray-50 p-3 text-sm text-gray-800 ring-1 ring-gray-200">{msg}</div>}

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <div>
          <label className="text-sm font-medium text-gray-700">Name</label>
          <input className="mt-1 w-full rounded-lg border px-3 py-2 text-sm"
            value={row.name}
            onChange={(e) => setRow({ ...row, name: e.target.value })}
          />
        </div>

        <div>
          <label className="text-sm font-medium text-gray-700">Type</label>
          <select className="mt-1 w-full rounded-lg border px-3 py-2 text-sm"
            value={row.card_type}
            onChange={(e) => setRow({ ...row, card_type: e.target.value as any })}
          >
            <option value="Normal">Normal</option>
            <option value="VIP">VIP</option>
            <option value="VVIP">VVIP</option>
          </select>
        </div>

        <div>
          <label className="text-sm font-medium text-gray-700">Size</label>
          <input className="mt-1 w-full rounded-lg border px-3 py-2 text-sm"
            value={row.size}
            onChange={(e) => setRow({ ...row, size: e.target.value })}
          />
        </div>

        <div>
          <label className="text-sm font-medium text-gray-700">GSM</label>
          <input className="mt-1 w-full rounded-lg border px-3 py-2 text-sm"
            value={row.gsm}
            onChange={(e) => setRow({ ...row, gsm: e.target.value })}
          />
        </div>

        <div>
          <label className="text-sm font-medium text-gray-700">Price</label>
          <input type="number" className="mt-1 w-full rounded-lg border px-3 py-2 text-sm"
            value={row.price}
            onChange={(e) => setRow({ ...row, price: Number(e.target.value) })}
          />
        </div>

        <div>
          <label className="text-sm font-medium text-gray-700">MOQ</label>
          <input type="number" className="mt-1 w-full rounded-lg border px-3 py-2 text-sm"
            value={row.minimum_order_quantity}
            onChange={(e) => setRow({ ...row, minimum_order_quantity: Number(e.target.value) })}
          />
        </div>

        <div>
          <label className="text-sm font-medium text-gray-700">Available Stock</label>
          <input type="number" className="mt-1 w-full rounded-lg border px-3 py-2 text-sm"
            value={row.available_stock}
            onChange={(e) => setRow({ ...row, available_stock: Number(e.target.value) })}
          />
        </div>

        <div>
          <label className="text-sm font-medium text-gray-700">Max Stock</label>
          <input type="number" className="mt-1 w-full rounded-lg border px-3 py-2 text-sm"
            value={row.max_stock}
            onChange={(e) => setRow({ ...row, max_stock: Number(e.target.value) })}
          />
        </div>
      </div>

      <button
        onClick={save}
        disabled={saving}
        className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700 disabled:opacity-60"
      >
        {saving ? 'Saving…' : 'Save Changes'}
      </button>
    </div>
  )
}