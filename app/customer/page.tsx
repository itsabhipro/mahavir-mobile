import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";
import CustomerDashboard from "@/components/customer/CustomerDashboard";
import CustomerGuestView from "@/components/customer/CustomerGuestView";

export default async function CustomerPage() {
  const cookieStore = await cookies();
  const supabase = await createClient(cookieStore);
  const { data } = await supabase.auth.getUser();

  const user = data?.user;

  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-50 to-white">
      {user && user.email ? (
        <CustomerDashboard user={user as typeof user & { email: string }} />
      ) : (
        <CustomerGuestView />
      )}
    </div>
  );
}