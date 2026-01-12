type ActivityItemProps = {
  title: string;
  time: string;
  detail: string;
};

export default function ActivityItem({
  title,
  time,
  detail,
}: ActivityItemProps) {
  return (
    <div className="flex items-start justify-between gap-4 rounded-2xl border border-[color:var(--panel-border)] bg-[color:var(--panel)] p-4 shadow-sm">
      <div>
        <p className="text-sm font-semibold">{title}</p>
        <p className="mt-1 text-xs text-[color:var(--muted)]">{detail}</p>
      </div>
      <span className="text-xs font-semibold text-[color:var(--muted)]">
        {time}
      </span>
    </div>
  );
}
