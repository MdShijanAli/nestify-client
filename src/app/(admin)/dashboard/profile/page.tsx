"use client";

import { useAuth } from "@/context/AuthContext";
import { DashboardPageShell } from "@/components/dashboard/page-shell";

export default function DashboardProfilePage() {
  const { user } = useAuth();

  return (
    <DashboardPageShell
      title="Profile"
      subtitle="Your account profile information"
    >
      <div className="space-y-3 rounded-xl border bg-card p-6">
        <p className="text-sm text-muted-foreground">Name</p>
        <p className="font-medium text-foreground">{user?.name ?? "N/A"}</p>
        <p className="text-sm text-muted-foreground">Email</p>
        <p className="font-medium text-foreground">{user?.email ?? "N/A"}</p>
        <p className="text-sm text-muted-foreground">Role</p>
        <p className="font-medium capitalize text-foreground">
          {user?.role ?? "customer"}
        </p>
      </div>
    </DashboardPageShell>
  );
}
