'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'

export default function CardTypeDeleteClient({ id }: { id: string }) {
  const router = useRouter()
  const [deleting, setDeleting] = useState(false)
  const [msg, setMsg] = useState<string | null>(null)

  async function doDelete() {
    setDeleting(true)
    setMsg(null)

    const r = await fetch(`/api/admin/card-types/${id}`, { method: 'DELETE' })
    const json = await r.json()

    setDeleting(false)

    if (!r.ok) {
      setMsg(`❌ ${json.error ?? 'Delete failed'}`)
      return
    }

    router.push('/admin/services/printing-press/card-types')
    router.refresh()
  }

  return (
    <div className="mx-auto max-w-xl space-y-4">
      <a className="text-sm text-gray-700 hover:underline" href="/admin/services/printing-press/card-types">
        ← Back
      </a>

      <div className="rounded-xl border border-red-200 bg-red-50 p-4">
        <h2 className="text-lg font-semibold text-red-800">Delete Card Type</h2>
        <p className="mt-1 text-sm text-red-700">
          Are you sure you want to delete card type <b>#{id}</b>? This cannot be undone.
        </p>
      </div>

      {msg && <div className="rounded-lg bg-gray-50 p-3 text-sm text-gray-800 ring-1 ring-gray-200">{msg}</div>}

      <div className="flex gap-2">
        <button
          onClick={() => router.push('/admin/services/printing-press/card-types')}
          className="flex-1 rounded-lg border border-gray-300 px-4 py-2 text-sm"
        >
          Cancel
        </button>

        <button
          onClick={doDelete}
          disabled={deleting}
          className="flex-1 rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700 disabled:opacity-60"
        >
          {deleting ? 'Deleting…' : 'Yes, Delete'}
        </button>
      </div>
    </div>
  )
}