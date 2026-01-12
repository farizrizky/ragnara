type StatCardProps = {
  label: string;
  value: string;
  trend: string;
};

export default function StatCard({ label, value, trend }: StatCardProps) {
  return (
    <div className="rounded-2xl border border-[color:var(--panel-border)] bg-[color:var(--panel)] p-4 shadow-sm">
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[color:var(--muted)]">
        {label}
      </p>
      <div className="mt-4 flex items-end justify-between gap-4">
        <span className="text-2xl font-semibold">{value}</span>
        <span className="rounded-full bg-[#1f4bd8]/10 px-2.5 py-1 text-xs font-semibold text-[#1f4bd8]">
          {trend}
        </span>
      </div>
    </div>
  );
}
