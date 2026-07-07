import Link from "next/link";
import { getCurrentProfile } from "@/lib/auth";
import { UserMenu } from "@/components/UserMenu";

export async function Header() {
  const { profile } = await getCurrentProfile();

  return (
    <header className="border-b border-border">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link href="/" className="flex items-center gap-2 text-xl font-black text-primary">
          <span>🇮🇹</span>
          Italiano con Verónica
        </Link>

        <nav className="flex items-center gap-2">
          <Link
            href="/"
            className="rounded-full px-4 py-2 text-sm font-semibold hover:bg-cream-dark"
          >
            Inicio
          </Link>
          <Link
            href="/cursos"
            className="rounded-full bg-primary px-4 py-2 text-sm font-semibold text-white hover:bg-primary-dark"
          >
            Cursos
          </Link>
        </nav>

        {profile ? (
          <UserMenu profile={profile} />
        ) : (
          <Link
            href="/login"
            className="rounded-full bg-accent px-5 py-2 text-sm font-semibold text-white hover:opacity-90"
          >
            Ingresar
          </Link>
        )}
      </div>
    </header>
  );
}
