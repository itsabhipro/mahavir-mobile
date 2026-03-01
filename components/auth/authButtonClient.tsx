"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";

type UserUI = {
  name: string;
  avatarUrl: string | null;
};

export default function AuthButtonClient({ user }: { user: UserUI | null }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement | null>(null);
  const router = useRouter();

  // close dropdown on outside click
  useEffect(() => {
    const onDown = (e: MouseEvent) => {
      if (!ref.current) return;
      if (!ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
  }, []);

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    setOpen(false);
    router.refresh(); // refresh server components to reflect logout
  };

  if (!user) {
    return (
      <Link
        href="/auth/login"
        className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700"
      >
        Login
      </Link>
    );
  }

  return (
    <div ref={ref} className="relative">
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
        <span className="max-w-[140px] truncate">{user.name}</span>

        {/* Chevron */}
        <span className="text-slate-500">▾</span>
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-56 rounded-xl border bg-white p-2 shadow-lg">
          <Link
            className="block rounded-lg px-3 py-2 text-sm text-slate-700 hover:bg-slate-100"
            href="/profile"
            onClick={() => setOpen(false)}
          >
            Profile
          </Link>

          <Link
            className="block rounded-lg px-3 py-2 text-sm text-slate-700 hover:bg-slate-100"
            href="/settings"
            onClick={() => setOpen(false)}
          >
            Settings
          </Link>

          <Link
            className="block rounded-lg px-3 py-2 text-sm text-slate-700 hover:bg-slate-100"
            href="/admin/dashboard"
            onClick={() => setOpen(false)}
          >
            Admin Dashboard
          </Link>

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