import CardTypesIndexClient from './cardTypeClient'

export default function Page() {
  return (
    <main className="min-h-screen bg-gray-50 p-6">
      <div className="mx-auto max-w-6xl">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold text-gray-900">Card Types</h1>
          <a
            href="/admin/services/printing-press/card-types/create"
            className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700"
          >
            + Create
          </a>
        </div>

        <div className="mt-6 rounded-xl bg-white p-4 shadow-sm ring-1 ring-gray-200">
          <CardTypesIndexClient />
        </div>
      </div>
    </main>
  )
}