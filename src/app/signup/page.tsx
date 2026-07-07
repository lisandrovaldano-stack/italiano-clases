import Link from "next/link";
import { signup } from "./actions";

export default async function SignupPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;

  return (
    <div className="flex min-h-[80vh] items-center justify-center px-6 py-10">
      <div className="w-full max-w-sm rounded-3xl border border-border bg-background p-8 shadow-sm">
        <h1 className="text-center text-2xl font-black">Creá tu cuenta</h1>
        <p className="mt-2 text-center text-sm text-foreground/60">
          Para que María Verónica pueda inscribirte en un curso.
        </p>

        {error && (
          <p className="mt-4 rounded-xl bg-accent-light px-4 py-2 text-sm text-accent">
            {error}
          </p>
        )}

        <form action={signup} className="mt-6 space-y-4">
          <div>
            <label className="text-sm font-semibold" htmlFor="full_name">
              Nombre completo
            </label>
            <input
              id="full_name"
              name="full_name"
              type="text"
              required
              className="mt-1 w-full rounded-xl border border-border bg-cream-dark px-4 py-2 outline-none focus:border-primary"
            />
          </div>
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
              minLength={6}
              required
              className="mt-1 w-full rounded-xl border border-border bg-cream-dark px-4 py-2 outline-none focus:border-primary"
            />
          </div>
          <button
            type="submit"
            className="w-full rounded-full bg-primary py-3 text-sm font-bold text-white hover:bg-primary-dark"
          >
            Crear cuenta
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-foreground/60">
          ¿Ya tenés cuenta?{" "}
          <Link href="/login" className="font-semibold text-primary">
            Iniciá sesión
          </Link>
        </p>
      </div>
    </div>
  );
}
