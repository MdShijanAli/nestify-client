import { DashboardPageShell } from "@/components/dashboard/page-shell";

export default function DashboardContentPage() {
  return (
    <DashboardPageShell
      title="Content"
      subtitle="Manage home page and CMS blocks"
    >
      <div className="rounded-xl border bg-card p-6 text-muted-foreground">
        Content management module is ready for API integration.
      </div>
    </DashboardPageShell>
  );
}
