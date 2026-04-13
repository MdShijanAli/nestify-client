"use client";

import { useAppState } from "@/context/AppContext";
import { DashboardPageShell } from "@/components/dashboard/page-shell";

export default function DashboardMyListingsPage() {
  const { properties } = useAppState();

  return (
    <DashboardPageShell
      title="My Listings"
      subtitle="Properties assigned to your account"
    >
      <div className="space-y-3">
        {properties.slice(0, 6).map((p) => (
          <div
            key={p.id}
            className="flex items-center justify-between rounded-xl border bg-card p-4"
          >
            <div>
              <p className="font-medium text-foreground">{p.title}</p>
              <p className="text-sm text-muted-foreground">
                {p.city}, {p.state}
              </p>
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
