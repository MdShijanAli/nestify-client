import { DashboardPageShell } from "@/components/dashboard/page-shell";

export default function DashboardAgentsPage() {
  return (
    <DashboardPageShell
      title="Agents"
      subtitle="Track and manage active agents"
    >
      <div className="rounded-xl border bg-card p-6 text-muted-foreground">
        Agent management module is ready for API integration.
      </div>
    </DashboardPageShell>
  );
}
