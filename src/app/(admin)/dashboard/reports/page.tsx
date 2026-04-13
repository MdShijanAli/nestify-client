import { DashboardPageShell } from "@/components/dashboard/page-shell";

export default function DashboardReportsPage() {
  return (
    <DashboardPageShell
      title="Reports"
      subtitle="Performance and sales reports"
    >
      <div className="rounded-xl border bg-card p-6 text-muted-foreground">
        Reporting module is ready for API integration.
      </div>
    </DashboardPageShell>
  );
}
