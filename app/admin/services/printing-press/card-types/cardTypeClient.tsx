'use client'

import { useEffect, useMemo, useState } from 'react'

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

type ApiResp = {
  data: Row[]
  page: number
  pageSize: number
  total: number
  totalPages: number
  error?: string
}

export default function CardTypesIndexClient() {
  const [view, setView] = useState<'card' | 'table'>('card')

  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)

  const [q, setQ] = useState('')
  const [type, setType] = useState<string>('')
  const [size, setSize] = useState('')
  const [gsm, setGsm] = useState('')
  const [sort, setSort] = useState('id_desc')

  const [loading, setLoading] = useState(false)
  const [resp, setResp] = useState<ApiResp | null>(null)

  const queryString = useMemo(() => {
    const params = new URLSearchParams()
    params.set('page', String(page))
    params.set('pageSize', String(pageSize))
    if (q.trim()) params.set('q', q.trim())
    if (type) params.set('type', type)
    if (size.trim()) params.set('size', size.trim())
    if (gsm.trim()) params.set('gsm', gsm.trim())
    if (sort) params.set('sort', sort)
    return params.toString()
  }, [page, pageSize, q, type, size, gsm, sort])

  useEffect(() => {
    let cancelled = false
    async function load() {
      setLoading(true)
      try {
        const r = await fetch(`/api/admin/card-types?${queryString}`, { cache: 'no-store' })
        const json = (await r.json()) as ApiResp
        if (!cancelled) setResp(json)
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    load()
    return () => {
      cancelled = true
    }
  }, [queryString])

  const rows = resp?.data ?? []
  const totalPages = resp?.totalPages ?? 1
  const total = resp?.total ?? 0

  function resetToFirstPage() {
    setPage(1)
  }

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="grid grid-cols-1 gap-3 md:grid-cols-6">
        <input
          value={q}
          onChange={(e) => { setQ(e.target.value); resetToFirstPage() }}
          placeholder="Search name…"
          className="md:col-span-2 rounded-lg border border-gray-300 px-3 py-2 text-sm"
        />

        <select
          value={type}
          onChange={(e) => { setType(e.target.value); resetToFirstPage() }}
          className="rounded-lg border border-gray-300 px-3 py-2 text-sm"
        >
          <option value="">All Types</option>
          <option value="Normal">Normal</option>
          <option value="VIP">VIP</option>
          <option value="VVIP">VVIP</option>
        </select>

        <input
          value={size}
          onChange={(e) => { setSize(e.target.value); resetToFirstPage() }}
          placeholder="Size filter…"
          className="rounded-lg border border-gray-300 px-3 py-2 text-sm"
        />

        <input
          value={gsm}
          onChange={(e) => { setGsm(e.target.value); resetToFirstPage() }}
          placeholder="GSM filter…"
          className="rounded-lg border border-gray-300 px-3 py-2 text-sm"
        />

        <select
          value={sort}
          onChange={(e) => { setSort(e.target.value); resetToFirstPage() }}
          className="rounded-lg border border-gray-300 px-3 py-2 text-sm"
        >
          <option value="id_desc">Newest</option>
          <option value="name_asc">Name ↑</option>
          <option value="name_desc">Name ↓</option>
          <option value="price_asc">Price ↑</option>
          <option value="price_desc">Price ↓</option>
        </select>
      </div>

      {/* View toggle */}
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="inline-flex rounded-lg ring-1 ring-gray-200 overflow-hidden">
          <button
            onClick={() => setView('card')}
            className={`px-3 py-2 text-sm ${view === 'card' ? 'bg-indigo-600 text-white' : 'bg-white text-gray-700 hover:bg-gray-50'}`}
          >
            Card View
          </button>
          <button
            onClick={() => setView('table')}
            className={`px-3 py-2 text-sm ${view === 'table' ? 'bg-indigo-600 text-white' : 'bg-white text-gray-700 hover:bg-gray-50'}`}
          >
            Table View
          </button>
        </div>

        <div className="flex items-center gap-2 text-sm text-gray-600">
          <span>Total: <b className="text-gray-900">{total}</b></span>
          <select
            value={pageSize}
            onChange={(e) => { setPageSize(Number(e.target.value)); setPage(1) }}
            className="rounded-lg border border-gray-300 px-2 py-2 text-sm"
          >
            {[5,10,20,30,50].map(n => <option key={n} value={n}>{n}/page</option>)}
          </select>
        </div>
      </div>

      {/* Body */}
      {loading && (
        <div className="text-sm text-gray-600">Loading…</div>
      )}

      {resp?.error && (
        <div className="rounded-lg bg-red-50 p-3 text-sm text-red-700 ring-1 ring-red-200">
          {resp.error}
        </div>
      )}

      {!loading && !resp?.error && view === 'card' && (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {rows.map((r) => (
            <div key={r.id} className="rounded-xl border border-gray-200 p-4 hover:shadow-sm">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h3 className="font-semibold text-gray-900">{r.name}</h3>
                  <p className="text-sm text-gray-600">{r.card_type} • {r.size} • {r.gsm} GSM</p>
                </div>
                <span className="rounded-full bg-indigo-50 px-2 py-1 text-xs font-semibold text-indigo-700">
                  #{r.id}
                </span>
              </div>

              <div className="mt-3 grid grid-cols-2 gap-2 text-sm">
                <div className="rounded-lg bg-gray-50 p-2">
                  <div className="text-gray-500">Price</div>
                  <div className="font-semibold text-gray-900">{r.price}</div>
                </div>
                <div className="rounded-lg bg-gray-50 p-2">
                  <div className="text-gray-500">MOQ</div>
                  <div className="font-semibold text-gray-900">{r.minimum_order_quantity}</div>
                </div>
                <div className="rounded-lg bg-gray-50 p-2">
                  <div className="text-gray-500">Available</div>
                  <div className="font-semibold text-gray-900">{r.available_stock}</div>
                </div>
                <div className="rounded-lg bg-gray-50 p-2">
                  <div className="text-gray-500">Max</div>
                  <div className="font-semibold text-gray-900">{r.max_stock}</div>
                </div>
              </div>

              <div className="mt-4 flex gap-2">
                <a
                  href={`/admin/services/printing-press/card-types/${r.id}/edit`}
                  className="flex-1 rounded-lg bg-indigo-600 px-3 py-2 text-center text-sm font-semibold text-white hover:bg-indigo-700"
                >
                  Edit
                </a>
                <a
                  href={`/admin/services/printing-press/card-types/${r.id}/delete`}
                  className="flex-1 rounded-lg bg-red-600 px-3 py-2 text-center text-sm font-semibold text-white hover:bg-red-700"
                >
                  Delete
                </a>
              </div>
            </div>
          ))}
        </div>
      )}

      {!loading && !resp?.error && view === 'table' && (
        <div className="overflow-x-auto rounded-xl border border-gray-200">
          <table className="min-w-full text-left text-sm">
            <thead className="bg-gray-50 text-gray-700">
              <tr>
                <th className="px-4 py-3">ID</th>
                <th className="px-4 py-3">Name</th>
                <th className="px-4 py-3">Type</th>
                <th className="px-4 py-3">Size</th>
                <th className="px-4 py-3">GSM</th>
                <th className="px-4 py-3">Price</th>
                <th className="px-4 py-3">Stock</th>
                <th className="px-4 py-3">MOQ</th>
                <th className="px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.id} className="border-t border-gray-200">
                  <td className="px-4 py-3">{r.id}</td>
                  <td className="px-4 py-3 font-medium text-gray-900">{r.name}</td>
                  <td className="px-4 py-3">{r.card_type}</td>
                  <td className="px-4 py-3">{r.size}</td>
                  <td className="px-4 py-3">{r.gsm}</td>
                  <td className="px-4 py-3">{r.price}</td>
                  <td className="px-4 py-3">{r.available_stock}/{r.max_stock}</td>
                  <td className="px-4 py-3">{r.minimum_order_quantity}</td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      <a className="text-indigo-700 hover:underline" href={`/admin/services/printing-press/card-types/${r.id}/edit`}>
                        Edit
                      </a>
                      <a className="text-red-700 hover:underline" href={`/admin/services/printing-press/card-types/${r.id}/delete`}>
                        Delete
                      </a>
                    </div>
                  </td>
                </tr>
              ))}
              {rows.length === 0 && (
                <tr>
                  <td className="px-4 py-6 text-center text-gray-600" colSpan={9}>
                    No results found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Pagination */}
      <div className="flex items-center justify-between">
        <button
          disabled={page <= 1}
          onClick={() => setPage((p) => Math.max(1, p - 1))}
          className="rounded-lg border border-gray-300 px-3 py-2 text-sm disabled:opacity-50"
        >
          Prev
        </button>

        <div className="text-sm text-gray-700">
          Page <b>{page}</b> of <b>{totalPages}</b>
        </div>

        <button
          disabled={page >= totalPages}
          onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
          className="rounded-lg border border-gray-300 px-3 py-2 text-sm disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  )
}