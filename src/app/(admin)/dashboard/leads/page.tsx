"use client";

import { useAppState } from "@/context/AppContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function AgentLeadsPage() {
  const { leads } = useAppState();

  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="font-heading text-2xl font-bold text-foreground">My Leads</h1>
        <p className="text-muted-foreground">Track and manage your lead pipeline.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Lead Pipeline</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {leads.map((lead) => (
              <div
                key={lead.id}
                className="flex items-center justify-between rounded-lg border border-border p-4"
              >
                <div>
                  <p className="font-medium text-foreground">{lead.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {lead.email} · {lead.property}
                  </p>
                </div>
                <div className="text-right">
                  <span
                    className={`rounded-full px-2.5 py-1 text-xs font-medium ${
                      lead.status === "New"
                        ? "bg-primary/10 text-primary"
                        : lead.status === "Contacted"
                          ? "bg-secondary/10 text-secondary"
                          : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {lead.status}
                  </span>
                  <p className="mt-1 text-xs text-muted-foreground">{lead.date}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}