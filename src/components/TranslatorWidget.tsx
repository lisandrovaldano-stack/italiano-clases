"use client";

import { useState } from "react";

type Direction = "it-es" | "es-it";

export function TranslatorWidget() {
  const [direction, setDirection] = useState<Direction>("it-es");
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const langPair = direction === "it-es" ? "it|es" : "es|it";

  async function translate() {
    const text = input.trim();
    if (!text) return;

    setLoading(true);
    setError("");
    setOutput("");

    try {
      const res = await fetch(
        `https://api.mymemory.translated.net/get?q=${encodeURIComponent(
          text
        )}&langpair=${langPair}`
      );
      const data = await res.json();
      const translated = data?.responseData?.translatedText;

      if (!translated) {
        setError("No se pudo traducir. Probá de nuevo en un momento.");
      } else {
        setOutput(translated);
      }
    } catch {
      setError("No se pudo conectar con el traductor. Probá de nuevo.");
    } finally {
      setLoading(false);
    }
  }

  function swap() {
    setDirection((d) => (d === "it-es" ? "es-it" : "it-es"));
    setInput(output);
    setOutput(input);
  }

  return (
    <div className="rounded-3xl border border-border p-6">
      <div className="mb-4 flex items-center justify-center gap-3">
        <span
          className={`rounded-full px-4 py-1.5 text-sm font-semibold ${
            direction === "it-es" ? "bg-primary text-white" : "bg-cream-dark"
          }`}
        >
          Italiano
        </span>
        <button
          onClick={swap}
          type="button"
          aria-label="Invertir idiomas"
          className="rounded-full border border-border p-2 hover:bg-cream-dark"
        >
          ⇄
        </button>
        <span
          className={`rounded-full px-4 py-1.5 text-sm font-semibold ${
            direction === "es-it" ? "bg-primary text-white" : "bg-cream-dark"
          }`}
        >
          Español
        </span>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="text-sm font-semibold">
            {direction === "it-es" ? "Italiano" : "Español"}
          </label>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            rows={6}
            placeholder="Escribí el texto acá..."
            className="mt-1 w-full rounded-xl border border-border bg-cream-dark px-4 py-2 outline-none focus:border-primary"
          />
        </div>
        <div>
          <label className="text-sm font-semibold">
            {direction === "it-es" ? "Español" : "Italiano"}
          </label>
          <div className="mt-1 min-h-[9.5rem] w-full rounded-xl border border-border bg-cream-dark px-4 py-2 whitespace-pre-wrap">
            {output}
          </div>
        </div>
      </div>

      {error && <p className="mt-3 text-sm text-accent">{error}</p>}

      <button
        onClick={translate}
        disabled={loading || !input.trim()}
        type="button"
        className="mt-4 rounded-full bg-primary px-6 py-2.5 text-sm font-bold text-white hover:bg-primary-dark disabled:opacity-50"
      >
        {loading ? "Traduciendo..." : "Traducir"}
      </button>
    </div>
  );
}
