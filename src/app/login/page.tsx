import Link from "next/link";
import { login } from "./actions";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; redirect?: string }>;
}) {
  const { error, redirect } = await searchParams;

  return (
    <div className="flex min-h-[80vh] items-center justify-center px-6 py-10">
      <div className="w-full max-w-sm rounded-3xl border border-border bg-background p-8 shadow-sm">
        <h1 className="text-center text-2xl font-black">Iniciá sesión</h1>
        <p className="mt-2 text-center text-sm text-foreground/60">
          Para entrar a tus cursos y ver tu progreso.
        </p>

        {error && (
          <p className="mt-4 rounded-xl bg-accent-light px-4 py-2 text-sm text-accent">
            {error}
          </p>
        )}

        <form action={login} className="mt-6 space-y-4">
          <input type="hidden" name="redirect" value={redirect ?? ""} />
          <div>
            <label className="text-sm font-semibold" htmlFor="email">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              className="mt-1 w-full rounded-xl border border-border bg-cream-dark px-4 py-2 outline-none focus:border-primary"
            />
          </div>
          <div>
            <label className="text-sm font-semibold" htmlFor="password">
              Contraseña
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              className="mt-1 w-full rounded-xl border border-border bg-cream-dark px-4 py-2 outline-none focus:border-primary"
            />
          </div>
          <button
            type="submit"
            className="w-full rounded-full bg-primary py-3 text-sm font-bold text-white hover:bg-primary-dark"
          >
            Entrar
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-foreground/60">
          ¿No tenés cuenta?{" "}
          <Link href="/signup" className="font-semibold text-primary">
            Registrate
          </Link>
        </p>
        <p className="mt-2 text-center text-sm">
          <Link href="/cursos" className="text-foreground/60">
            ← Volver al inicio
          </Link>
        </p>
      </div>
    </div>
  );
}
