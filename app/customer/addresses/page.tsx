import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";
import Link from "next/link";

type UserAddress = {
  id: number;
  user_id: string;
  full_name: string;
  mobile_number: string;
  address_line1: string;
  address_line2: string | null;
  city: string;
  state: string;
  pincode: string;
  country: string;
  is_default: boolean;
  created_at: string;
  updated_at: string;
};

export default async function CustomerAddressesPage() {
  const cookieStore = await cookies();
  const supabase = await createClient(cookieStore);
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return (
      <div className="rounded-xl border bg-white p-8 text-center">
        <h2 className="text-xl font-bold text-slate-900">Please sign in</h2>
        <p className="mt-2 text-slate-600">You need to be logged in to manage addresses.</p>
        <Link href="/auth/login" className="mt-4 inline-block rounded-lg bg-pink-600 px-4 py-2 text-sm font-semibold text-white hover:bg-pink-700">
          Sign In
        </Link>
      </div>
    );
  }

  // Fetch real addresses data from database
  const { data: addresses, error } = await supabase
    .from('user_addresses')
    .select('*')
    .eq('user_id', user.id)
    .order('is_default', { ascending: false })
    .order('created_at', { ascending: false });

  if (error) {
    console.error("Error fetching addresses:", error);
  }

  const formatAddress = (address: UserAddress) => {
    const parts = [
      address.address_line1,
      address.address_line2,
      `${address.city}, ${address.state} ${address.pincode}`,
      address.country && address.country !== 'India' ? address.country : ''
    ].filter(Boolean);
    return parts.join(', ');
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">My Addresses</h1>
          <p className="text-slate-600 mt-2 text-sm sm:text-base">Manage your delivery addresses</p>
        </div>
        <button className="w-full sm:w-auto rounded-lg bg-pink-600 px-4 py-2 text-sm font-semibold text-white hover:bg-pink-700 text-center">
          + Add New Address
        </button>
      </div>

      {/* Address Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {addresses && addresses.map((addr) => (
          <div key={addr.id} className={`rounded-xl border p-6 ${addr.is_default ? 'border-pink-300 bg-pink-50' : 'border-slate-200 bg-white'}`}>
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-lg font-semibold text-slate-900">{addr.full_name}</h3>
                  {addr.is_default && (
                    <span className="rounded-full bg-pink-100 px-3 py-1 text-xs font-medium text-pink-800">
                      Default
                    </span>
                  )}
                </div>
                <p className="mt-3 text-sm text-slate-700">{formatAddress(addr)}</p>
                <p className="mt-2 text-sm text-slate-600">Phone: {addr.mobile_number}</p>
              </div>
              <div className="flex gap-2">
                <button className="text-pink-600 hover:text-pink-800 text-sm font-medium">
                  Edit
                </button>
                {!addr.is_default && (
                  <button className="text-slate-500 hover:text-slate-700 text-sm font-medium">
                    Delete
                  </button>
                )}
              </div>
            </div>
            <div className="mt-6 flex gap-2">
              {!addr.is_default && (
                <button className="flex-1 rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-medium hover:bg-slate-50">
                  Set as Default
                </button>
              )}
              <button className="flex-1 rounded-lg bg-slate-900 px-3 py-2 text-sm font-medium text-white hover:bg-slate-800">
                Use for Delivery
              </button>
            </div>
          </div>
        ))}

        {/* Add New Address Card */}
        <div className="rounded-xl border-2 border-dashed border-slate-300 bg-white p-6 text-center hover:border-slate-400 hover:bg-slate-50">
          <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-full bg-slate-100">
            <span className="text-2xl">➕</span>
          </div>
          <h3 className="text-lg font-semibold text-slate-900">Add New Address</h3>
          <p className="mt-1 text-sm text-slate-600">Save a new delivery address</p>
          <button className="mt-4 w-full rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800">
            + Add Address
          </button>
        </div>
      </div>

      {/* Empty state (if no addresses) */}
      {(!addresses || addresses.length === 0) && (
        <div className="rounded-xl border border-dashed border-slate-300 bg-white p-12 text-center">
          <div className="text-5xl mb-4">📍</div>
          <h3 className="text-lg font-semibold text-slate-900">No addresses saved yet</h3>
          <p className="mt-1 text-slate-600">Add your first delivery address</p>
          <button className="mt-4 inline-block rounded-lg bg-pink-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-pink-700">
            + Add First Address
          </button>
        </div>
      )}

      {/* Address Form (Hidden by default, would be toggled) */}
      <div className="rounded-xl border border-slate-200 bg-white p-6">
        <h3 className="mb-4 text-xl font-semibold text-slate-900">Add New Address</h3>
        <form className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">Address Name</label>
              <input type="text" placeholder="e.g., Home, Work" className="w-full rounded-lg border px-3 py-2 text-sm outline-none" />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">Phone Number</label>
              <input type="tel" placeholder="+91 98765 43210" className="w-full rounded-lg border px-3 py-2 text-sm outline-none" />
            </div>
            <div className="md:col-span-2">
              <label className="mb-1 block text-sm font-medium text-slate-700">Full Address</label>
              <textarea rows={3} placeholder="House number, street, city, state, PIN" className="w-full rounded-lg border px-3 py-2 text-sm outline-none"></textarea>
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">City</label>
              <input type="text" placeholder="New Delhi" className="w-full rounded-lg border px-3 py-2 text-sm outline-none" />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">PIN Code</label>
              <input type="text" placeholder="110001" className="w-full rounded-lg border px-3 py-2 text-sm outline-none" />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <input type="checkbox" id="default" className="h-4 w-4 rounded" />
            <label htmlFor="default" className="text-sm text-slate-700">Set as default address</label>
          </div>
          <div className="flex gap-3">
            <button type="submit" className="rounded-lg bg-pink-600 px-6 py-2 text-sm font-semibold text-white hover:bg-pink-700">
              Save Address
            </button>
            <button type="button" className="rounded-lg border px-6 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50">
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}