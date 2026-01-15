import Link from "next/link";

export default function HomePage() {
  return (
    <div className="space-y-10">
      <section className="space-y-4">
        <h1 className="text-4xl font-semibold tracking-tight">
          Make small decisions fast — without overthinking.
        </h1>
        <p className="text-slate-600 max-w-2xl">
          NextMove recommends what to do next based on your time, energy, and task impact — with clear explanations.
        </p>
        <div className="flex gap-3">
          <Link className="rounded-lg bg-slate-900 text-white px-4 py-2" href="/app">
            Open the App
          </Link>
          <Link className="rounded-lg border px-4 py-2" href="/pricing">
            See Pricing
          </Link>
        </div>
      </section>

      <section className="grid md:grid-cols-3 gap-4">
        {[
          ["Instant recommendation", "Pick your best next task in 10 seconds."],
          ["Explainable", "Always see why the app chose it."],
          ["Learns from you", "Mark decisions helpful/not helpful to improve."]
        ].map(([t, d]) => (
          <div key={t} className="rounded-xl border p-5">
            <div className="font-medium">{t}</div>
            <div className="text-sm text-slate-600 mt-1">{d}</div>
          </div>
        ))}
      </section>
    </div>
  );
}
