import { redirect } from "next/navigation";
import { getCurrentProfile } from "@/lib/auth";
import { TranslatorWidget } from "@/components/TranslatorWidget";

export default async function TraductorPage() {
  const { user, profile } = await getCurrentProfile();
  if (!user || !profile) redirect("/login");

  return (
    <div className="mx-auto max-w-3xl space-y-6 px-6 py-10">
      <div>
        <span className="text-xs font-semibold italic text-primary/70">
          traduttore
        </span>
        <h1 className="text-3xl font-black">Traductor Italiano ↔ Español</h1>
        <p className="mt-1 text-sm text-foreground/60">
          Escribí una palabra o frase para traducirla mientras estudiás.
        </p>
      </div>

      <TranslatorWidget />
    </div>
  );
}
