import CreateCardTypeForm from './cardCreateTypeForm'

export default function Page() {
  return (
    <main className="min-h-screen bg-gray-50 py-10">
      <div className="mx-auto w-[90%] px-4">
        <h1 className="text-2xl font-semibold text-gray-900">Create Card Type</h1>
        <p className="mt-1 text-sm text-gray-600">
          Upload a card image to Supabase Storage and store the link in the database.
        </p>

        <div className="mt-6 rounded-xl bg-white p-6 shadow-sm ring-1 ring-gray-200">
          <CreateCardTypeForm />
        </div>
      </div>
    </main>
  )
}