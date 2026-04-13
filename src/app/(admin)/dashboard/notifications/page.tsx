import { DashboardPageShell } from "@/components/dashboard/page-shell";

export default function DashboardNotificationsPage() {
  return (
    <DashboardPageShell
      title="Notifications"
      subtitle="Manage notification preferences"
    >
      <div className="rounded-xl border bg-card p-6 text-muted-foreground">
        Notification preferences module is ready for API integration.
      </div>
    </DashboardPageShell>
  );
}
