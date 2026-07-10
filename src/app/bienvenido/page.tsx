import Link from "next/link";
import { getCurrentProfile } from "@/lib/auth";

export default async function BienvenidoPage() {
  const { profile } = await getCurrentProfile();

  return (
    <div className="flex min-h-[80vh] items-center justify-center px-6 py-10">
      <div className="w-full max-w-md rounded-3xl border border-border bg-background p-8 text-center shadow-sm">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary-light text-3xl">
          ✅
        </div>
        <span className="text-xs font-semibold italic text-primary/70">grazie</span>
        <h1 className="mt-1 text-2xl font-black">Grazie di esserti registrato!</h1>
        <p className="mt-3 text-sm text-foreground/70">
          {profile
            ? `Tu cuenta, ${profile.full_name}, ya está confirmada.`
            : "Tu cuenta ya está confirmada."}{" "}
          Ahora podés acceder a tus cursos y seguir tu progreso. ✨
        </p>
        <Link
          href={profile?.role === "teacher" ? "/admin" : "/dashboard"}
          className="mt-6 inline-block rounded-full bg-primary px-6 py-3 text-sm font-bold text-white hover:bg-primary-dark"
        >
          {profile?.role === "teacher" ? "Ir a mi panel" : "Ir a mis cursos"}
        </Link>
      </div>
    </div>
  );
}
