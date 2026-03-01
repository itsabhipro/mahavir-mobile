import Link from "next/link";

export default function AdminGuestView() {
  return (
    <div className="mx-auto max-w-xl rounded-2xl border bg-white p-8 text-center shadow-sm">
      <div className="mb-4 text-5xl">🔒</div>

      <h1 className="mb-2 text-2xl font-bold text-slate-900">
        Admin access required
      </h1>

      <p className="mb-6 text-slate-600">
        Please log in as an administrator to view dashboard statistics,
        orders, and management tools.
      </p>

      <div className="flex flex-row justify-center gap-3">
       <Link href="/auth/login" className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700">
          Login
        </Link>

        <Link href="/" className="rounded-lg bg-slate-600 px-4 py-2 text-sm font-semibold text-gray-800 hover:bg-slate-700">
          Back to website
        </Link>
      </div>
    <br />
      {/* Icon hints */}
      <div className=" flex flex-row items-center justify-center gap-4 text-slate-500">
        <div>
          📦
          <p className="text-sm">Orders</p>
        </div>
        <div>
          📊
          <p className="text-sm">Reports</p>
        </div>
        <div>
          ⚙️
          <p className="text-sm">Settings</p>
        </div>
      </div>
    </div>
  );
}