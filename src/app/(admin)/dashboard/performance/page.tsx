import {
  DashboardPageShell,
  DashboardStatCard,
} from "@/components/dashboard/page-shell";
import { Eye, TrendingUp, HousePlus, MessageSquare } from "lucide-react";

export default function DashboardPerformancePage() {
  const stats = [
    {
      label: "Listing Views",
      value: "12,840",
      icon: Eye,
      color: "text-primary",
    },
    {
      label: "Conversion Rate",
      value: "12.5%",
      icon: TrendingUp,
      color: "text-success",
    },
    {
      label: "New Listings",
      value: 18,
      icon: HousePlus,
      color: "text-secondary",
    },
    {
      label: "Lead Responses",
      value: 92,
      icon: MessageSquare,
      color: "text-accent",
    },
  ];

  return (
    <DashboardPageShell
      title="Performance"
      subtitle="Track growth and conversion metrics"
    >
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((s) => (
          <DashboardStatCard key={s.label} {...s} />
        ))}
      </div>
    </DashboardPageShell>
  );
}
