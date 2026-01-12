import type { ReactNode } from "react";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import DashboardNav from "@/components/dashboard/DashboardNav";
import ChatWidget from "@/components/dashboard/ChatWidget";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col bg-[color:var(--background)] text-[color:var(--foreground)]">
      <DashboardHeader />

      <div className="mx-auto flex w-full max-w-6xl flex-1 gap-6 px-6 py-8">
        <DashboardNav />

        <main className="flex-1">{children}</main>
      </div>

      <ChatWidget />
    </div>
  );
}
