import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";
import AdminGuestView from "@/components/admin/adminGuestView";
import AdminDashboard from "@/components/admin/adminDashboard";

export default async function AdminPage() {
  const cookieStore = await cookies();
  const supabase = await createClient(cookieStore);
  const { data } = await supabase.auth.getUser();

  const user = data?.user;

  return (
    <div className="p-6">
      {user && user.email ? (
        <AdminDashboard user={user as typeof user & { email: string }} />
      ) : (
        <AdminGuestView />
      )}
    </div>
  );
}