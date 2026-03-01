import CardsClient from './cardClient'

export default function Page() {
  return (
    <main className="min-h-screen bg-gray-50 p-6">
      <div className="mx-auto max-w-7xl space-y-4">
        <h1 className="text-2xl font-semibold text-gray-900">
          Printing Press – Card Types
        </h1>

        <CardsClient />
      </div>
    </main>
  )
}