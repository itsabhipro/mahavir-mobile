import Link from "next/link";

interface User {
  email: string;
}

export default function CustomerDashboard({ user }: { user: User }) {
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Welcome */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900">
          Welcome back, {user.email} 👋
        </h1>
        <p className="text-slate-600 mt-2">
          Manage your orders, addresses, and wedding card designs.
        </p>
      </div>

      {/* Stats */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 mb-8">
        <div className="rounded-xl border bg-gradient-to-r from-pink-50 to-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500">Active Orders</p>
              <p className="text-2xl font-bold">3</p>
            </div>
            <div className="text-3xl">📦</div>
          </div>
        </div>
        
        <div className="rounded-xl border bg-gradient-to-r from-blue-50 to-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500">Completed Cards</p>
              <p className="text-2xl font-bold">12</p>
            </div>
            <div className="text-3xl">✅</div>
          </div>
        </div>
        
        <div className="rounded-xl border bg-gradient-to-r from-green-50 to-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500">Saved Addresses</p>
              <p className="text-2xl font-bold">2</p>
            </div>
            <div className="text-3xl">🏠</div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mb-8">
        <h2 className="mb-4 text-xl font-semibold text-slate-800">Quick Actions</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <Link 
            href="/customer/order/new" 
            className="flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-pink-300 bg-white p-6 text-center hover:border-pink-500 hover:bg-pink-50"
          >
            <div className="mb-3 text-4xl">🎨</div>
            <h3 className="font-semibold text-slate-800">Design New Card</h3>
            <p className="mt-1 text-sm text-slate-500">Create custom wedding card</p>
          </Link>

          <Link 
            href="/customer/orders" 
            className="flex flex-col items-center justify-center rounded-xl border bg-white p-6 text-center hover:bg-slate-50"
          >
            <div className="mb-3 text-4xl">📋</div>
            <h3 className="font-semibold text-slate-800">My Orders</h3>
            <p className="mt-1 text-sm text-slate-500">Track all your orders</p>
          </Link>

          <Link 
            href="/customer/addresses" 
            className="flex flex-col items-center justify-center rounded-xl border bg-white p-6 text-center hover:bg-slate-50"
          >
            <div className="mb-3 text-4xl">📍</div>
            <h3 className="font-semibold text-slate-800">Addresses</h3>
            <p className="mt-1 text-sm text-slate-500">Manage delivery addresses</p>
          </Link>
        </div>
      </div>

      {/* Recent Orders Preview */}
      <div className="rounded-xl border bg-white p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-slate-800">Recent Orders</h2>
          <Link href="/customer/orders" className="text-sm text-pink-600 hover:text-pink-800">
            View All →
          </Link>
        </div>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between rounded-lg border border-slate-200 p-4">
            <div>
              <p className="font-medium">Wedding Card - Premium</p>
              <p className="text-sm text-slate-500">Order #ORD-00123 • 2 days ago</p>
            </div>
            <span className="rounded-full bg-yellow-100 px-3 py-1 text-xs font-medium text-yellow-800">
              In Progress
            </span>
          </div>
          
          <div className="flex items-center justify-between rounded-lg border border-slate-200 p-4">
            <div>
              <p className="font-medium">Anniversary Card</p>
              <p className="text-sm text-slate-500">Order #ORD-00122 • 1 week ago</p>
            </div>
            <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-800">
              Delivered
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}