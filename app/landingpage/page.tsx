import Link from "next/link";

const features = [
  {
    title: "Aurora-ready layout",
    description: "Hero and sections tuned for deep-blue gradients.",
  },
  {
    title: "Split routing",
    description: "Landing and dashboard live on separate app routes.",
  },
  {
    title: "Theme toggles",
    description: "Light and dark mode with custom CSS variables.",
  },
];

const highlights = [
  { label: "Active teams", value: "24" },
  { label: "Design cues", value: "Blue - Black" },
  { label: "Launch window", value: "Q1 2026" },
];

export default function LandingPage() {
  return (
    <div className="flex flex-col gap-12">
      <section className="grid gap-10 rounded-3xl border border-[color:var(--panel-border)] bg-[color:var(--panel)]/80 p-8 shadow-sm backdrop-blur md:grid-cols-[1.1fr_0.9fr]">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[color:var(--muted)]">
            Launch ready
          </p>
          <h2 className="mt-4 text-4xl font-semibold leading-tight">
            Build a landing experience that feels electric.
          </h2>
          <p className="mt-4 text-base text-[color:var(--muted)]">
            Pair a bold deep-blue palette with clear storytelling to separate
            your landing and dashboard flows from day one.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <button className="rounded-full bg-[color:var(--accent-1)] px-5 py-2 text-xs font-semibold uppercase tracking-wide text-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
              Start building
            </button>
            <Link
              className="rounded-full border border-[color:var(--panel-border)] bg-[color:var(--panel)] px-5 py-2 text-xs font-semibold uppercase tracking-wide text-[color:var(--foreground)] transition hover:-translate-y-0.5 hover:shadow-md"
              href="/dashboard"
            >
              View dashboard
            </Link>
          </div>
        </div>
        <div className="grid gap-4">
          {highlights.map((item) => (
            <div
              key={item.label}
              className="rounded-2xl border border-[color:var(--panel-border)] bg-gradient-to-br from-[#1f4bd8]/10 via-transparent to-[#3b82f6]/10 p-4"
            >
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[color:var(--muted)]">
                {item.label}
              </p>
              <p className="mt-3 text-lg font-semibold">{item.value}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="grid gap-6 md:grid-cols-3">
        {features.map((feature) => (
          <div
            key={feature.title}
            className="rounded-2xl border border-[color:var(--panel-border)] bg-[color:var(--panel)] p-5 shadow-sm"
          >
            <h3 className="text-lg font-semibold">{feature.title}</h3>
            <p className="mt-2 text-sm text-[color:var(--muted)]">
              {feature.description}
            </p>
          </div>
        ))}
      </section>

      <section className="rounded-3xl border border-[color:var(--panel-border)] bg-[color:var(--panel)] p-8">
        <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div>
            <h3 className="text-2xl font-semibold">
              Ready to connect the dots?
            </h3>
            <p className="mt-2 text-sm text-[color:var(--muted)]">
              Move from landing page to dashboard without losing momentum.
            </p>
          </div>
          <button className="rounded-full bg-[color:var(--accent-2)] px-6 py-2 text-xs font-semibold uppercase tracking-wide text-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
            Schedule a demo
          </button>
        </div>
      </section>
    </div>
  );
}
