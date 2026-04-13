import { DashboardPageShell } from "@/components/dashboard/page-shell";

export default function DashboardSettingsPage() {
  return (
    <DashboardPageShell
      title="Settings"
      subtitle="Update your dashboard preferences"
    >
      <div className="rounded-xl border bg-card p-6 text-muted-foreground">
        Settings module is ready for API integration.
      </div>
    </DashboardPageShell>
  );
}
