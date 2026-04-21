"use client";

import { Building2, MessageSquare, Eye, TrendingUp } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/context/AuthContext";
import { useAppState } from "@/context/AppContext";

export default function AgentDashboard() {
  const { user } = useAuth();
  const { properties, leads } = useAppState();

  const myListings =
    properties.filter((p) => p.agentName === user?.name).length || 4;
  const myLeads = leads.filter((l) => l.agent === user?.name).length || 3;

  const stats = [
    {
      label: "My Listings",
      value: myListings,
      icon: Building2,
      color: "text-primary",
    },
    {
      label: "Active Leads",
      value: myLeads,
      icon: MessageSquare,
      color: "text-secondary",
    },
    {
      label: "Property Views",
      value: "1,284",
      icon: Eye,
      color: "text-success",
    },
    {
      label: "Conversion Rate",
      value: "12.5%",
      icon: TrendingUp,
      color: "text-accent",
    },
  ];

  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="font-heading text-2xl font-bold text-foreground">
          Welcome back, {user?.name?.split(" ")[0]}!
        </h1>
        <p className="text-muted-foreground">
          Here&apos;s an overview of your activity
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((s) => (
          <Card key={s.label}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {s.label}
              </CardTitle>
              <s.icon className={`h-5 w-5 ${s.color}`} />
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-foreground">{s.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Recent Leads</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {leads.slice(0, 4).map((lead) => (
                <div
                  key={lead.id}
                  className="flex items-center justify-between rounded-lg border border-border p-3"
                >
                  <div>
                    <p className="text-sm font-medium text-foreground">
                      {lead.name}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {lead.property}
                    </p>
                  </div>
                  <span
                    className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                      lead.status === "New"
                        ? "bg-primary/10 text-primary"
                        : lead.status === "Contacted"
                          ? "bg-secondary/10 text-secondary"
                          : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {lead.status}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>My Top Listings</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {properties.slice(0, 4).map((prop) => (
                <div
                  key={prop.id}
                  className="flex items-center justify-between rounded-lg border border-border p-3"
                >
                  <div>
                    <p className="text-sm font-medium text-foreground">
                      {prop.title}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {prop.city}, {prop.state}
                    </p>
                  </div>
                  <p className="text-sm font-bold text-foreground">
                    ${prop.price.toLocaleString()}
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
