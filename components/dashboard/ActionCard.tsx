type ActionCardProps = {
  title: string;
  description: string;
  cta: string;
};

export default function ActionCard({ title, description, cta }: ActionCardProps) {
  return (
    <div className="rounded-2xl border border-[color:var(--panel-border)] bg-[color:var(--panel)] p-4 shadow-sm">
      <h3 className="text-lg font-semibold">{title}</h3>
      <p className="mt-2 text-sm text-[color:var(--muted)]">{description}</p>
      <button className="mt-4 rounded-full bg-[color:var(--accent-1)] px-4 py-2 text-xs font-semibold uppercase tracking-wide text-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
        {cta}
      </button>
    </div>
  );
}
