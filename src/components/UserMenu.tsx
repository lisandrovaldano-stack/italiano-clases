"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { signOut } from "@/app/actions";
import type { Profile } from "@/lib/database.types";

export function UserMenu({ profile }: { profile: Profile }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, []);

  const initial = profile.full_name?.[0]?.toUpperCase() ?? "?";

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-2 rounded-full py-1 pl-1 pr-3 hover:bg-cream-dark"
      >
        <span
          className="flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold text-white"
          style={{ backgroundColor: profile.avatar_color }}
        >
          {initial}
        </span>
        <span className="text-sm font-semibold">{profile.full_name}</span>
      </button>

      {open && (
        <div className="absolute right-0 z-50 mt-2 w-48 rounded-xl border border-border bg-background shadow-lg overflow-hidden">
          <Link
            href={profile.role === "teacher" ? "/admin" : "/dashboard"}
            className="block px-4 py-2 text-sm hover:bg-cream-dark"
          >
            {profile.role === "teacher" ? "Panel de profesora" : "Mis cursos"}
          </Link>
          <Link
            href="/dashboard/traductor"
            className="block px-4 py-2 text-sm hover:bg-cream-dark"
          >
            Traductor IT ↔ ES
          </Link>
          <form action={signOut}>
            <button
              type="submit"
              className="w-full px-4 py-2 text-left text-sm text-accent hover:bg-cream-dark"
            >
              Cerrar sesión
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
