import Link from "next/link";

interface User {
  email: string;
}

export default function AdminDashboard({ user }: { user: User }) {
  return (
    <div className="space-y-8">
      {/* Welcome */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900">
          Welcome back 👋
        </h1>
        <p className="text-slate-600">
          {user.email}
        </p>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard title="Today Orders" value="12" icon="📦" />
        <StatCard title="Pending Orders" value="5" icon="⏳" />
        <StatCard title="Completed" value="87" icon="✅" />
        <StatCard title="Revenue" value="₹45,200" icon="💰" />
      </div>

      {/* Quick links */}
      <div>
        <h2 className="mb-3 text-lg font-semibold">Quick Actions</h2>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
         <Link href="/admin/orders" className="flex flex-col items-center justify-center rounded-lg border bg-white p-4 text-sm font-medium text-slate-700 hover:bg-slate-50">
            🧾 Orders
          </Link>

          <Link href="/admin/services" className="flex flex-col items-center justify-center rounded-lg border bg-white p-4 text-sm font-medium text-slate-700 hover:bg-slate-50">
            🛠 Services
          </Link>

          <Link href="/admin/customers" className="flex flex-col items-center justify-center rounded-lg border bg-white p-4 text-sm font-medium text-slate-700 hover:bg-slate-50">
            👥 Customers
          </Link>

          <Link href="/admin/reports" className="flex flex-col items-center justify-center rounded-lg border bg-white p-4 text-sm font-medium text-slate-700 hover:bg-slate-50">
            📈 Reports
          </Link>
        </div>
      </div>

      {/* Orders preview */}
      <div>
        <h2 className="mb-3 text-lg font-semibold">Recent Orders</h2>
        <div className="rounded-xl border bg-white p-4">
          <p className="text-sm text-slate-500">
            (Here you can later map real order data)
          </p>
        </div>
      </div>
    </div>
  );
}

function StatCard({
  title,
  value,
  icon,
}: {
  title: string;
  value: string;
  icon: string;
}) {
  return (
    <div className="rounded-xl border bg-white p-4 shadow-sm">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-slate-500">{title}</p>
          <p className="text-xl font-bold">{value}</p>
        </div>
        <div className="text-3xl">{icon}</div>
      </div>
    </div>
  );
}