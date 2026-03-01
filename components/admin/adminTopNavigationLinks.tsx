"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import React, { useEffect, useMemo, useRef, useState } from "react";
import type { NavItem } from "@/types/navigation";
import { shopkeeperNavigation } from "@/config/navigationConfigration";

function isActivePath(pathname: string, url?: string) {
  if (!url) return false;
  return pathname === url || pathname.startsWith(url + "/");
}

function hasActiveDescendant(item: NavItem, pathname: string): boolean {
  if (isActivePath(pathname, item.url)) return true;
  return (item.children ?? []).some((c) => hasActiveDescendant(c, pathname));
}

// Utility: find first-level active section (optional auto-open)
function findActiveRootTitle(items: NavItem[], pathname: string): string | null {
  for (const it of items) {
    if (hasActiveDescendant(it, pathname)) return it.title;
  }
  return null;
}

export default function AdminTopNav() {
  const pathname = usePathname(); // client hook [1](https://nextjs.org/docs/app/api-reference/functions/use-pathname)
  const wrapperRef = useRef<HTMLDivElement | null>(null);

  // open dropdown titles by nesting level, e.g. ["Services", "Printing Press"]
  const activeRoot = useMemo(() => findActiveRootTitle(shopkeeperNavigation, pathname), [pathname]);
  const [openPath, setOpenPath] = useState<string[]>(() => activeRoot ? [activeRoot] : []);

  // close on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (!wrapperRef.current) return;
      if (!wrapperRef.current.contains(e.target as Node)) setOpenPath([]);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);


  const toggleLevel = (level: number, title: string) => {
    setOpenPath((prev) => {
      const next = prev.slice(0, level);
      if (prev[level] === title) return next;     // close
      next[level] = title;                         // open
      return next;
    });
  };

  return (
    <div
      ref={wrapperRef}
      className="sticky top-0 z-50 w-full backdrop-blur"
    >
      <div className="mx-auto flex max-w-7xl items-center gap-3 px-4 py-2">
        {/* Brand */}
        <div className="flex items-center gap-2 pr-3 border-r">
          <div className="rounded-full overflow-hidden">
                <Image src="/brand/logo.jpg" alt="Logo" width={32} height={32} />  
          </div>
          <span className="text-sm font-semibold text-slate-900">Admin Panel</span>
        </div>

        {/* Menu */}
        <div className="flex flex-1 flex-wrap items-center gap-1">
          {shopkeeperNavigation.map((item) => (
            <NavDivItem
              key={item.url ?? item.title}
              item={item}
              pathname={pathname}
              level={0}
              openPath={openPath}
              toggleLevel={toggleLevel}
            />
          ))}
        </div>

        {/* Right actions (optional) */}
        <div className="flex items-center gap-2">
          <Link
            href="/admin/settings"
            className="rounded-full bg-slate-900 px-3 py-1.5 text-xs font-medium text-white hover:bg-slate-800"
          >
            Settings
          </Link>
        </div>
      </div>
    </div>
  );
}

function NavDivItem({
  item,
  pathname,
  level,
  openPath,
  toggleLevel,
}: {
  item: NavItem;
  pathname: string;
  level: number;
  openPath: string[];
  toggleLevel: (level: number, title: string) => void;
}) {
  const hasChildren = (item.children?.length ?? 0) > 0;
  const active = hasActiveDescendant(item, pathname);
  const open = openPath[level] === item.title;

  const baseLink =
    "inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm transition-colors";
  const inactive = "text-slate-700 hover:bg-slate-100 hover:text-slate-900";
  const activeCls = "bg-indigo-50 text-indigo-700 font-semibold";

  // Leaf link
  if (!hasChildren) {
    return (
      <Link
        href={item.url ?? "#"}
        className={`${baseLink} ${active ? activeCls : inactive}`}
      >
        {item.title}
      </Link>
    );
  }

  // Group dropdown trigger + panel
  return (
    <div className="relative">
      <button
        type="button"
        aria-expanded={open}
        onClick={() => toggleLevel(level, item.title)}
        className={`${baseLink} ${active ? activeCls : inactive}`}
      >
        <span>{item.title}</span>
        <span className="text-xs opacity-70">{open ? "▴" : "▾"}</span>
      </button>

      {open && (
        <div className="absolute left-0 mt-2 min-w-[260px] rounded-xl border bg-white p-2 shadow-lg">
          {(item.children ?? []).map((child) => (
            <div key={child.url ?? child.title} className="w-full">
              <NavDropdownRow
                item={child}
                pathname={pathname}
                level={level + 1}
                openPath={openPath}
                toggleLevel={toggleLevel}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function NavDropdownRow({
  item,
  pathname,
  level,
  openPath,
  toggleLevel,
}: {
  item: NavItem;
  pathname: string;
  level: number;
  openPath: string[];
  toggleLevel: (level: number, title: string) => void;
}) {
  const hasChildren = (item.children?.length ?? 0) > 0;
  const active = hasActiveDescendant(item, pathname);
  const open = openPath[level] === item.title;

  const rowBase =
    "flex w-full items-center justify-between rounded-lg px-3 py-2 text-sm transition-colors";
  const rowInactive = "text-slate-700 hover:bg-slate-100";
  const rowActive = "bg-indigo-50 text-indigo-700 font-semibold";

  if (!hasChildren) {
    return (
      <Link
        href={item.url ?? "#"}
        className={`${rowBase} ${active ? rowActive : rowInactive}`}
      >
        {item.title}
      </Link>
    );
  }

  return (
    <div className="relative">
      <button
        type="button"
        aria-expanded={open}
        onClick={() => toggleLevel(level, item.title)}
        className={`${rowBase} ${active ? rowActive : rowInactive}`}
      >
        <span>{item.title}</span>
        <span className="text-xs opacity-70">{open ? "▸" : "▸"}</span>
      </button>

      {/* nested fly-out (right side) */}
      {open && (
        <div className="absolute left-full top-0 ml-2 min-w-[260px] rounded-xl border bg-white p-2 shadow-lg">
          {(item.children ?? []).map((child) => (
            <NavDropdownRow
              key={child.url ?? child.title}
              item={child}
              pathname={pathname}
              level={level + 1}
              openPath={openPath}
              toggleLevel={toggleLevel}
            />
          ))}
        </div>
      )}
    </div>
  );
}