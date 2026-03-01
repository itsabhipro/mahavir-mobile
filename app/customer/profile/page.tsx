import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";
import Link from "next/link";
import Image from "next/image";

export default async function CustomerProfilePage() {
  const cookieStore = await cookies();
  const supabase = await createClient(cookieStore);
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return (
      <div className="rounded-xl border bg-white p-8 text-center">
        <h2 className="text-xl font-bold text-slate-900">Please sign in</h2>
        <p className="mt-2 text-slate-600">You need to be logged in to view your profile.</p>
        <Link href="/auth/login" className="mt-4 inline-block rounded-lg bg-pink-600 px-4 py-2 text-sm font-semibold text-white hover:bg-pink-700">
          Sign In
        </Link>
      </div>
    );
  }

  // Fetch user statistics from database
  const { data: orders } = await supabase
    .from('orders')
    .select('status, final_amount')
    .eq('user_id', user.id);

  const { data: addresses } = await supabase
    .from('user_addresses')
    .select('*')
    .eq('user_id', user.id);

  // Calculate statistics
  const totalOrders = orders?.length || 0;
  const completedOrders = orders?.filter(order => 
    ['delivered'].includes(order.status)
  ).length || 0;
  const totalSpent = orders?.reduce((sum, order) => 
    sum + (order.final_amount || 0), 0
  ) || 0;
  const savedAddresses = addresses?.length || 0;

  // Format joined date
  const joinedDate = user.created_at 
    ? new Date(user.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })
    : 'Recently';

  const userData = {
    name: user.user_metadata?.full_name || user.email?.split('@')[0] || 'Customer',
    email: user.email || 'No email',
    phone: user.user_metadata?.phone || '+91 98765 43210',
    joined: joinedDate,
    avatar: user.user_metadata?.avatar_url || null,
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
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">My Profile</h1>
          <p className="text-slate-600 mt-2 text-sm sm:text-base">Manage your personal information and account settings</p>
        </div>
        <button className="w-full sm:w-auto rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 text-center">
          Edit Profile
        </button>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {/* Profile Card */}
        <div className="rounded-xl border border-slate-200 bg-white p-6 md:col-span-2">
          <div className="flex flex-col items-start gap-6 sm:flex-row">
            <div className="flex-shrink-0">
              <div className="h-32 w-32 overflow-hidden rounded-full border-4 border-white shadow-lg">
                {userData.avatar ? (
                  <Image src={userData.avatar} alt={userData.name} width={128} height={128} className="h-full w-full object-cover" />
                ) : (
                  <div className="flex h-full w-full items-center justify-center bg-gradient-to-r from-pink-400 to-purple-500 text-4xl font-bold text-white">
                    {userData.name.charAt(0).toUpperCase()}
                  </div>
                )}
              </div>
            </div>
            <div className="flex-1">
              <div className="mb-2 flex items-center gap-3">
                <h2 className="text-2xl font-bold text-slate-900">{userData.name}</h2>
                <span className="rounded-full bg-pink-100 px-3 py-1 text-xs font-medium text-pink-800">
                  Customer
                </span>
              </div>
              <p className="text-slate-600">Welcome back! Your account is active and ready to use.</p>
              
              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                <div>
                  <p className="text-sm text-slate-500">Email Address</p>
                  <p className="font-medium text-slate-900">{userData.email}</p>
                </div>
                <div>
                  <p className="text-sm text-slate-500">Phone Number</p>
                  <p className="font-medium text-slate-900">{userData.phone}</p>
                </div>
                <div>
                  <p className="text-sm text-slate-500">Member Since</p>
                  <p className="font-medium text-slate-900">{userData.joined}</p>
                </div>
                <div>
                  <p className="text-sm text-slate-500">Account Status</p>
                  <p className="font-medium text-green-600">Active</p>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8 border-t pt-6">
            <h3 className="mb-4 text-lg font-semibold text-slate-900">Account Settings</h3>
            <div className="grid gap-4 sm:grid-cols-2">
              <button className="rounded-lg border border-slate-300 bg-white px-4 py-3 text-left hover:bg-slate-50">
                <span className="block font-medium text-slate-900">Change Password</span>
                <span className="text-sm text-slate-500">Update your login password</span>
              </button>
              <button className="rounded-lg border border-slate-300 bg-white px-4 py-3 text-left hover:bg-slate-50">
                <span className="block font-medium text-slate-900">Notification Settings</span>
                <span className="text-sm text-slate-500">Manage email and SMS alerts</span>
              </button>
              <button className="rounded-lg border border-slate-300 bg-white px-4 py-3 text-left hover:bg-slate-50">
                <span className="block font-medium text-slate-900">Privacy Settings</span>
                <span className="text-sm text-slate-500">Control your data privacy</span>
              </button>
              <button className="rounded-lg border border-slate-300 bg-white px-4 py-3 text-left hover:bg-slate-50">
                <span className="block font-medium text-slate-900">Linked Accounts</span>
                <span className="text-sm text-slate-500">Connect social accounts</span>
              </button>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <div className="rounded-xl border border-slate-200 bg-white p-6">
            <h3 className="mb-4 text-lg font-semibold text-slate-900">Quick Stats</h3>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-slate-500">Total Orders</p>
                <p className="text-2xl font-bold">{totalOrders}</p>
              </div>
              <div>
                <p className="text-sm text-slate-500">Completed Orders</p>
                <p className="text-2xl font-bold">{completedOrders}</p>
              </div>
              <div>
                <p className="text-sm text-slate-500">Total Spent</p>
                <p className="text-2xl font-bold">{formatCurrency(totalSpent)}</p>
              </div>
              <div>
                <p className="text-sm text-slate-500">Saved Addresses</p>
                <p className="text-2xl font-bold">{savedAddresses}</p>
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-6">
            <h3 className="mb-4 text-lg font-semibold text-slate-900">Account Actions</h3>
            <div className="space-y-3">
              <Link href="/customer/order/new" className="block rounded-lg bg-pink-600 px-4 py-3 text-center font-medium text-white hover:bg-pink-700">
                + Create New Order
              </Link>
              <button className="block w-full rounded-lg border border-slate-300 px-4 py-3 font-medium text-slate-700 hover:bg-slate-50">
                Download Data
              </button>
              <Link href="/auth/logout" className="block w-full rounded-lg border border-red-300 bg-red-50 px-4 py-3 font-medium text-red-700 hover:bg-red-100">
                Logout Account
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}