"use client";

import { Building2 } from "lucide-react";
import { useAppState } from "@/context/AppContext";
import { DashboardPageShell } from "@/components/dashboard/page-shell";

export default function DashboardPropertiesPage() {
  const { properties } = useAppState();

  return (
    <DashboardPageShell
      title="Properties"
      subtitle="Manage your property inventory"
    >
      <div className="space-y-3">
        {properties.map((p) => (
          <div
            key={p.id}
            className="flex items-center justify-between rounded-xl border bg-card p-4"
          >
            <div className="flex items-center gap-3">
              <Building2 className="h-4 w-4 text-secondary" />
              <div>
                <p className="font-medium text-foreground">{p.title}</p>
                <p className="text-sm text-muted-foreground">
                  {p.city}, {p.state}
                </p>
              </div>
            </div>
            <p className="font-semibold text-foreground">
              ${p.price.toLocaleString()}
            </p>
          </div>
        ))}
      </div>
    </DashboardPageShell>
  );
}
