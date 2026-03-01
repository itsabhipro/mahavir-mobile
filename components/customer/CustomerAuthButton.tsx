"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { createClient } from "@/utils/supabase/client";

type UserData = {
  name: string;
  avatarUrl: string | null;
} | null;

export default function CustomerAuthButton() {
  const [user, setUser] = useState<UserData>(null);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const supabase = createClient();
        const { data: { user: authUser } } = await supabase.auth.getUser();
        
        if (authUser) {
          const name = 
            authUser.user_metadata?.full_name ||
            authUser.user_metadata?.name ||
            authUser.email?.split('@')[0] ||
            "User";
            
          const avatarUrl = 
            authUser.user_metadata?.avatar_url ||
            authUser.user_metadata?.picture ||
            null;
            
          setUser({ name, avatarUrl });
        } else {
          setUser(null);
        }
      } catch (error) {
        console.error("Error fetching user:", error);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    setUser(null);
    setOpen(false);
    router.refresh();
    router.push("/");
  };

  if (loading) {
    return (
      <div className="inline-flex items-center gap-2 rounded-lg border bg-white px-4 py-2 text-sm font-medium text-slate-700">
        <div className="h-6 w-6 animate-pulse rounded-full bg-slate-200"></div>
        <div className="h-4 w-20 animate-pulse rounded bg-slate-200"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <a
        href="/auth/login"
        className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700"
      >
        Login
      </a>
    );
  }

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-2 rounded-full border bg-white px-2 py-1.5 text-sm font-medium text-slate-800 shadow-sm hover:bg-slate-50"
        aria-expanded={open}
      >
        {/* Avatar */}
        <span className="relative h-8 w-8 overflow-hidden rounded-full bg-slate-200">
          {user.avatarUrl ? (
            <Image
              src={user.avatarUrl}
              alt={user.name}
              fill
              className="object-cover"
              sizes="32px"
            />
          ) : (
            <span className="flex h-full w-full items-center justify-center text-xs font-semibold text-slate-700">
              {user.name.slice(0, 1).toUpperCase()}
            </span>
          )}
        </span>

        {/* Name */}
        <span className="max-w-[120px] truncate text-sm">{user.name}</span>
        
        {/* Chevron */}
        <span className="text-slate-500 text-xs">▾</span>
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-48 rounded-xl border bg-white p-2 shadow-lg">
          <a
            href="/customer/profile"
            className="block rounded-lg px-3 py-2 text-sm text-slate-700 hover:bg-slate-100"
            onClick={() => setOpen(false)}
          >
            Profile
          </a>
          
          <a
            href="/customer/orders"
            className="block rounded-lg px-3 py-2 text-sm text-slate-700 hover:bg-slate-100"
            onClick={() => setOpen(false)}
          >
            My Orders
          </a>
          
          <div className="my-2 h-px bg-slate-100" />
          
          <button
            onClick={handleLogout}
            className="w-full rounded-lg bg-rose-50 px-3 py-2 text-left text-sm font-semibold text-rose-700 hover:bg-rose-100"
          >
            Logout
          </button>
        </div>
      )}
    </div>
  );
}