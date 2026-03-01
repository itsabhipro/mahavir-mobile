"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { customerNavigation } from "@/config/navigationConfigration";
import CustomerAuthButton from "@/components/customer/CustomerAuthButton";

export default function CustomerNavigation() {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const isActive = (url?: string) => {
    if (!url) return false;
    return pathname === url || pathname.startsWith(url + "/");
  };

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Close menu on route change
  useEffect(() => {
    // Use setTimeout to avoid synchronous state update warning
    const timer = setTimeout(() => {
      setIsMenuOpen(false);
    }, 0);
    return () => clearTimeout(timer);
  }, [pathname]);

  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-white/80 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
        {/* Brand/Logo */}
        <div className="flex items-center gap-2">
          <div className="rounded-full overflow-hidden">
            <Image 
              src="/brand/logo.jpg" 
              alt="Mahavir Mobile & Printing Press" 
              width={36} 
              height={36} 
              className="object-cover"
            />
          </div>
          <div className="hidden lg:block">
            <span className="text-sm font-semibold text-slate-900">
              Mahavir Mobile & Printing Press
            </span>
            <p className="text-xs text-slate-500">Customer Portal</p>
          </div>
          <div className="sm:hidden">
            <span className="text-sm font-semibold text-slate-900">
              Customer Portal
            </span>
          </div>
        </div>

        {/* Desktop Navigation Links */}
        <div className="hidden md:flex items-center gap-1">
          {customerNavigation.map((item) => {
            const active = isActive(item.url);
            
            // Handle logout separately (it's a special case)
            if (item.title === "Logout") {
              return (
                <div key="logout" className="ml-2">
                  <CustomerAuthButton />
                </div>
              );
            }
            
            return (
              <Link
                key={item.url}
                href={item.url || "#"}
                className={`inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                  active
                    ? "bg-pink-50 text-pink-700"
                    : "text-slate-700 hover:bg-slate-100 hover:text-slate-900"
                }`}
              >
                {/* Optional icon rendering */}
                {item.icon && (
                  <span className="text-base">
                    {item.icon === "dashboard" && "📊"}
                    {item.icon === "orders" && "📋"}
                    {item.icon === "address" && "📍"}
                    {item.icon === "profile" && "👤"}
                    {item.icon === "work" && "💼"}
                  </span>
                )}
                <span className="hidden lg:inline">{item.title}</span>
                <span className="lg:hidden">
                  {item.icon === "dashboard" && "📊"}
                  {item.icon === "orders" && "📋"}
                  {item.icon === "address" && "📍"}
                  {item.icon === "profile" && "👤"}
                  {item.icon === "work" && "💼"}
                </span>
              </Link>
            );
          })}
        </div>

        {/* Mobile Menu Button */}
        <div className="flex items-center gap-2 md:hidden">
          <CustomerAuthButton />
          <button
            type="button"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="inline-flex items-center justify-center rounded-lg p-2 text-slate-700 hover:bg-slate-100"
            aria-label="Toggle menu"
          >
            {isMenuOpen ? (
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>

        {/* Desktop User info */}
        <div className="hidden md:flex items-center gap-2">
          <div className="hidden lg:flex flex-col items-end">
            <span className="text-xs text-slate-500">Logged in as</span>
            <span className="text-sm font-medium text-slate-900">
              Customer
            </span>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div ref={menuRef} className="md:hidden border-t bg-white">
          <div className="px-4 py-3 space-y-1">
            {customerNavigation.map((item) => {
              const active = isActive(item.url);
              
              // Skip logout in mobile menu since it's in the auth button
              if (item.title === "Logout") return null;
              
              return (
                <Link
                  key={item.url}
                  href={item.url || "#"}
                  className={`flex items-center gap-3 rounded-lg px-4 py-3 text-base font-medium transition-colors ${
                    active
                      ? "bg-pink-50 text-pink-700"
                      : "text-slate-700 hover:bg-slate-100 hover:text-slate-900"
                  }`}
                >
                  <span className="text-lg">
                    {item.icon === "dashboard" && "📊"}
                    {item.icon === "orders" && "📋"}
                    {item.icon === "address" && "📍"}
                    {item.icon === "profile" && "👤"}
                    {item.icon === "work" && "💼"}
                  </span>
                  <span>{item.title}</span>
                </Link>
              );
            })}
          </div>
        </div>
      )}
    </nav>
  );
}
