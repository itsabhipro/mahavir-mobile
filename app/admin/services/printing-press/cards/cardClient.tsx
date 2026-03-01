'use client'

import { useEffect, useMemo, useState } from 'react'

type CardType = 'Normal' | 'VIP' | 'VVIP'

type CardRow = {
  id: number
  name: string
  card_type: CardType
  size: string
  gsm: string
  price: number
  image_url?: string
}

export default function CardsClient() {
  const [cards, setCards] = useState<CardRow[]>([])
  const [loading, setLoading] = useState(false)

  // filters
  const [search, setSearch] = useState('')
  const [type, setType] = useState('')
  const [minPrice, setMinPrice] = useState('')
  const [maxPrice, setMaxPrice] = useState('')
  const [view, setView] = useState<'grid' | 'list'>('grid')

  const query = useMemo(() => {
    const p = new URLSearchParams()
    if (search) p.set('q', search)
    if (type) p.set('type', type)
    if (minPrice) p.set('min', minPrice)
    if (maxPrice) p.set('max', maxPrice)
    return p.toString()
  }, [search, type, minPrice, maxPrice])

  useEffect(() => {
    async function load() {
      setLoading(true)
      const res = await fetch(`/api/admin/card-types?${query}`, {
        cache: 'no-store',
      })
      const json = await res.json()
      setCards(json.data ?? [])
      setLoading(false)
    }
    load()
  }, [query])

  return (
    <div className="space-y-4">
      {/* 🔍 Search + Filters */}
      <div className="rounded-xl bg-white p-4 shadow-sm ring-1 ring-gray-200">
        <div className="grid grid-cols-1 gap-3 md:grid-cols-6">
          <input
            placeholder="Search card name…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="md:col-span-2 rounded-lg border px-3 py-2 text-sm"
          />

          <select
            value={type}
            onChange={(e) => setType(e.target.value)}
            className="rounded-lg border px-3 py-2 text-sm"
          >
            <option value="">All Types</option>
            <option value="Normal">Normal</option>
            <option value="VIP">VIP</option>
            <option value="VVIP">VVIP</option>
          </select>

          <input
            type="number"
            placeholder="Min ₹"
            value={minPrice}
            onChange={(e) => setMinPrice(e.target.value)}
            className="rounded-lg border px-3 py-2 text-sm"
          />

          <input
            type="number"
            placeholder="Max ₹"
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
            className="rounded-lg border px-3 py-2 text-sm"
          />

          <div className="flex gap-2">
            <button
              onClick={() => setView('grid')}
              className={`flex-1 rounded-lg px-3 py-2 text-sm ${
                view === 'grid'
                  ? 'bg-indigo-600 text-white'
                  : 'border bg-white'
              }`}
            >
              Grid
            </button>
            <button
              onClick={() => setView('list')}
              className={`flex-1 rounded-lg px-3 py-2 text-sm ${
                view === 'list'
                  ? 'bg-indigo-600 text-white'
                  : 'border bg-white'
              }`}
            >
              List
            </button>
          </div>
        </div>
      </div>

      {/* 📦 Cards */}
      {loading && <p className="text-sm text-gray-600">Loading…</p>}

      {!loading && view === 'grid' && (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {cards.map((c) => (
            <div
              key={c.id}
              className="group overflow-hidden rounded-xl border bg-white shadow-sm hover:shadow-md"
            >
              <div className="relative h-48 bg-gray-100">
                {c.image_url ? (
                  <img
                    src={c.image_url}
                    alt={c.name}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center text-sm text-gray-500">
                    No Image
                  </div>
                )}

                <div className="absolute inset-0 hidden items-center justify-center gap-2 bg-black/40 group-hover:flex">
                  <a
                    href={`/admin/services/printing-press/card-types/${c.id}/edit`}
                    className="rounded bg-white px-3 py-1 text-sm font-semibold"
                  >
                    Edit
                  </a>
                  <a
                    href={`/admin/services/printing-press/card-types/${c.id}/delete`}
                    className="rounded bg-red-600 px-3 py-1 text-sm font-semibold text-white"
                  >
                    Delete
                  </a>
                </div>
              </div>

              <div className="p-4 space-y-1">
                <h3 className="font-semibold text-gray-900">{c.name}</h3>
                <p className="text-sm text-gray-600">
                  {c.card_type} • {c.size} • {c.gsm} GSM
                </p>
                <p className="text-lg font-bold text-indigo-600">
                  ₹ {c.price}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}

      {!loading && view === 'list' && (
        <div className="overflow-hidden rounded-xl border bg-white">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-50 text-gray-700">
              <tr>
                <th className="px-4 py-3">Name</th>
                <th>Type</th>
                <th>Size</th>
                <th>GSM</th>
                <th>Price</th>
                <th className="px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {cards.map((c) => (
                <tr key={c.id} className="border-t">
                  <td className="px-4 py-3 font-medium">{c.name}</td>
                  <td>{c.card_type}</td>
                  <td>{c.size}</td>
                  <td>{c.gsm}</td>
                  <td className="font-semibold">₹ {c.price}</td>
                  <td className="px-4 py-3 flex gap-2">
                    <a
                      href={`/admin/services/printing-press/card-types/${c.id}/edit`}
                      className="text-indigo-600"
                    >
                      Edit
                    </a>
                    <a
                      href={`/admin/services/printing-press/card-types/${c.id}/delete`}
                      className="text-red-600"
                    >
                      Delete
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}