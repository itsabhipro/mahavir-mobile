import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";
import Link from "next/link";

export default async function CustomerOrdersPage() {
  const cookieStore = await cookies();
  const supabase = await createClient(cookieStore);
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return (
      <div className="rounded-xl border bg-white p-8 text-center">
        <h2 className="text-xl font-bold text-slate-900">Please sign in</h2>
        <p className="mt-2 text-slate-600">You need to be logged in to view your orders.</p>
        <Link href="/auth/login" className="mt-4 inline-block rounded-lg bg-pink-600 px-4 py-2 text-sm font-semibold text-white hover:bg-pink-700">
          Sign In
        </Link>
      </div>
    );
  }

  // Fetch real orders data from database
  const { data: orders, error } = await supabase
    .from('orders')
    .select(`
      id,
      order_number,
      card_type_id,
      quantity,
      unit_price,
      total_amount,
      final_amount,
      status,
      payment_status,
      created_at,
      shipping_full_name,
      marriage_card_type_details (
        name,
        card_type
      )
    `)
    .eq('user_id', user.id)
    .order('created_at', { ascending: false });

  if (error) {
    console.error("Error fetching orders:", error);
  }

  // Fetch statistics from database
  const { data: statsData } = await supabase
    .from('orders')
    .select('status, final_amount')
    .eq('user_id', user.id);

  // Calculate statistics
  const totalOrders = orders?.length || 0;
  const inProgressOrders = orders?.filter(order => 
    ['pending', 'confirmed', 'processing', 'printing', 'ready_for_delivery'].includes(order.status)
  ).length || 0;
  const completedOrders = orders?.filter(order => 
    ['delivered'].includes(order.status)
  ).length || 0;
  const totalAmountSpent = orders?.reduce((sum, order) => 
    sum + (order.final_amount || 0), 0
  ) || 0;

  const statusColor = (status: string) => {
    switch (status) {
      case "pending": return "bg-yellow-100 text-yellow-800";
      case "confirmed": return "bg-blue-100 text-blue-800";
      case "processing": return "bg-indigo-100 text-indigo-800";
      case "printing": return "bg-purple-100 text-purple-800";
      case "ready_for_delivery": return "bg-teal-100 text-teal-800";
      case "shipped": return "bg-cyan-100 text-cyan-800";
      case "delivered": return "bg-green-100 text-green-800";
      case "cancelled": return "bg-red-100 text-red-800";
      case "refunded": return "bg-slate-100 text-slate-800";
      default: return "bg-slate-100 text-slate-800";
    }
  };

  const statusDisplay = (status: string) => {
    switch (status) {
      case "pending": return "Pending";
      case "confirmed": return "Confirmed";
      case "processing": return "Processing";
      case "printing": return "Printing";
      case "ready_for_delivery": return "Ready";
      case "shipped": return "Shipped";
      case "delivered": return "Delivered";
      case "cancelled": return "Cancelled";
      case "refunded": return "Refunded";
      default: return status;
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">My Orders</h1>
          <p className="text-slate-600 mt-2 text-sm sm:text-base">Track and manage all your orders</p>
        </div>
        <Link
          href="/customer/order/new"
          className="w-full sm:w-auto rounded-lg bg-pink-600 px-4 py-2 text-sm font-semibold text-white hover:bg-pink-700 text-center"
        >
          + New Order
        </Link>
      </div>

      {/* Stats */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-xl border bg-white p-6">
          <p className="text-sm text-slate-500">Total Orders</p>
          <p className="text-2xl font-bold">{totalOrders}</p>
        </div>
        <div className="rounded-xl border bg-white p-6">
          <p className="text-sm text-slate-500">In Progress</p>
          <p className="text-2xl font-bold">{inProgressOrders}</p>
        </div>
        <div className="rounded-xl border bg-white p-6">
          <p className="text-sm text-slate-500">Completed</p>
          <p className="text-2xl font-bold">{completedOrders}</p>
        </div>
        <div className="rounded-xl border bg-white p-6">
          <p className="text-sm text-slate-500">Amount Spent</p>
          <p className="text-2xl font-bold">{formatCurrency(totalAmountSpent)}</p>
        </div>
      </div>

      {/* Orders Table */}
      <div className="rounded-xl border bg-white overflow-hidden">
        <div className="overflow-x-auto -mx-4 sm:mx-0">
          <table className="w-full min-w-[640px] sm:min-w-0">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Order ID</th>
                <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Product</th>
                <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Date</th>
                <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Status</th>
                <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Amount</th>
                <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {orders && orders.map((order) => (
                <tr key={order.id} className="hover:bg-slate-50">
                  <td className="px-4 sm:px-6 py-4">
                    <span className="font-medium text-sm sm:text-base">{order.order_number}</span>
                  </td>
                  <td className="px-4 sm:px-6 py-4">
                    <div>
                      <p className="font-medium text-sm sm:text-base">
                        {order.marriage_card_type_details?.[0]?.name || 'Wedding Card'}
                      </p>
                      <p className="text-xs sm:text-sm text-slate-500">
                        {order.marriage_card_type_details?.[0]?.card_type || 'Normal'} Card
                      </p>
                    </div>
                  </td>
                  <td className="px-4 sm:px-6 py-4 text-sm sm:text-base">{formatDate(order.created_at)}</td>
                  <td className="px-4 sm:px-6 py-4">
                    <span className={`inline-flex rounded-full px-3 py-1 text-xs font-medium ${statusColor(order.status)}`}>
                      {statusDisplay(order.status)}
                    </span>
                  </td>
                  <td className="px-4 sm:px-6 py-4 font-medium text-sm sm:text-base">{formatCurrency(order.final_amount || 0)}</td>
                  <td className="px-4 sm:px-6 py-4">
                    <Link
                      href={`/customer/orders/${order.id}`}
                      className="text-pink-600 hover:text-pink-800 text-sm font-medium"
                    >
                      View
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Empty state (if no orders) */}
      {(!orders || orders.length === 0) && (
        <div className="rounded-xl border border-dashed border-slate-300 bg-white p-12 text-center">
          <div className="text-5xl mb-4">📦</div>
          <h3 className="text-lg font-semibold text-slate-900">No orders yet</h3>
          <p className="mt-1 text-slate-600">Start by creating your first order</p>
          <Link
            href="/customer/order/new"
            className="mt-4 inline-block rounded-lg bg-pink-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-pink-700"
          >
            Create First Order
          </Link>
        </div>
      )}
    </div>
  );
}