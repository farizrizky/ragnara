import ActionCard from "@/components/dashboard/ActionCard";
import ActivityItem from "@/components/dashboard/ActivityItem";
import StatCard from "@/components/dashboard/StatCard";

const stats = [
  { label: "Active Campaigns", value: "12", trend: "+18%" },
  { label: "New Leads", value: "248", trend: "+6%" },
  { label: "Revenue Runway", value: "$84.2k", trend: "+9%" },
];

const actions = [
  {
    title: "Launch Aurora",
    description:
      "Kick off the next campaign wave with a deep-blue visual kit and auto-tagging.",
    cta: "Create campaign",
  },
  {
    title: "Sync Client Pulse",
    description:
      "Refresh client dashboards and highlight urgent risks before the weekly sync.",
    cta: "Start sync",
  },
];

const activity = [
  {
    title: "Nova Labs approved sprint scope.",
    detail: "Team bandwidth increased by 12% after onboarding.",
    time: "2h ago",
  },
  {
    title: "Amplitude report exported.",
    detail: "Realtime insights shared with product and growth.",
    time: "5h ago",
  },
  {
    title: "Dark theme rollout ready.",
    detail: "Shipping for dashboard and landing flows.",
    time: "1d ago",
  },
];

export default function DashboardPage() {
  return (
    <div className="flex flex-col gap-6">
      <section className="rounded-3xl border border-[color:var(--panel-border)] bg-gradient-to-br from-[#1f4bd8]/10 via-transparent to-[#3b82f6]/10 p-6">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[color:var(--muted)]">
          Studio status
        </p>
        <h2 className="mt-3 text-2xl font-semibold">
          Momentum is strong across the board.
        </h2>
        <p className="mt-2 max-w-2xl text-sm text-[color:var(--muted)]">
          Keep the focus on high-impact launches and keep the pipeline moving
          while the new visual system goes live.
        </p>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        {stats.map((stat) => (
          <StatCard key={stat.label} {...stat} />
        ))}
      </section>

      <section className="grid gap-4 md:grid-cols-2">
        {actions.map((action) => (
          <ActionCard key={action.title} {...action} />
        ))}
      </section>

      <section className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">Latest activity</h3>
          <button className="text-xs font-semibold uppercase tracking-wide text-[color:var(--muted)]">
            View all
          </button>
        </div>
        <div className="grid gap-3">
          {activity.map((item) => (
            <ActivityItem key={item.title} {...item} />
          ))}
        </div>
      </section>
    </div>
  );
}
