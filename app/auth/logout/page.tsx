"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";

export default function LogoutPage() {
  const router = useRouter();

  useEffect(() => {
    const logout = async () => {
      const supabase = createClient();
      await supabase.auth.signOut();
      
      // Wait a moment for session to clear, then redirect
      setTimeout(() => {
        router.push("/");
        router.refresh();
      }, 500);
    };

    logout();
  }, [router]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-blue-50 to-white">
      <div className="w-full max-w-md rounded-2xl border bg-white p-8 text-center shadow-lg">
        <div className="mb-6">
          <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-blue-100">
            <span className="text-2xl">👋</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900">Logging you out...</h1>
          <p className="mt-2 text-slate-600">
            You are being signed out of your account. Please wait a moment.
          </p>
        </div>
        <div className="h-2 w-full overflow-hidden rounded-full bg-slate-200">
          <div className="h-full w-3/4 animate-pulse rounded-full bg-blue-500"></div>
        </div>
        <p className="mt-6 text-sm text-slate-500">
          You will be redirected to the home page shortly.
        </p>
      </div>
    </div>
  );
}