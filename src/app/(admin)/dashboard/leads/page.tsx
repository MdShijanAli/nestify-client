"use client";

import { useAuth } from "@/context/AuthContext";
import { DashboardPageShell } from "@/components/dashboard/page-shell";

const sampleLeads = [
  {
    id: "1",
    name: "Alex Morgan",
    property: "Modern Loft in Downtown",
    status: "New",
  },
  {
    id: "2",
    name: "Taylor Smith",
    property: "Waterfront Condo",
    status: "Contacted",
  },
  {
    id: "3",
    name: "Jordan Lee",
    property: "Suburban Family Home",
    status: "Qualified",
  },
];

export default function DashboardLeadsPage() {
  const { user } = useAuth();

  return (
    <DashboardPageShell
      title={user?.role === "agent" ? "My Leads" : "Leads"}
      subtitle="Pipeline overview"
    >
      <div className="space-y-3">
        {sampleLeads.map((lead) => (
          <div
            key={lead.id}
            className="flex items-center justify-between rounded-xl border bg-card p-4"
          >
            <div>
              <p className="font-medium text-foreground">{lead.name}</p>
              <p className="text-sm text-muted-foreground">{lead.property}</p>
            </div>
            <span className="rounded-full bg-primary/10 px-2.5 py-1 text-xs font-medium text-primary">
              {lead.status}
            </span>
          </div>
        ))}
      </div>
    </DashboardPageShell>
  );
}
