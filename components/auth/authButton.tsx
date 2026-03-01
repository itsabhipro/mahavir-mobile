import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";
import AuthButtonClient from "@/components/auth/authButtonClient";

export default async function AuthButton() {
  const cookieStore = await cookies();
  const supabase = await createClient(cookieStore);
  const { data } = await supabase.auth.getUser(); // server read
  const user = data?.user ?? null;

  // pass minimal safe fields
  const name =
    user?.user_metadata?.full_name ||
    user?.user_metadata?.name ||
    user?.email ||
    "User";

  const avatarUrl =
    user?.user_metadata?.avatar_url ||
    user?.user_metadata?.picture ||
    null;

  return <AuthButtonClient user={user ? { name, avatarUrl } : null} />;
}