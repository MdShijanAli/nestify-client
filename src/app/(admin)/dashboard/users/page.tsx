import { DashboardPageShell } from "@/components/dashboard/page-shell";

export default function DashboardUsersPage() {
  return (
    <DashboardPageShell title="Users" subtitle="View and manage platform users">
      <div className="rounded-xl border bg-card p-6 text-muted-foreground">
        User management module is ready for API integration.
      </div>
    </DashboardPageShell>
  );
}
