"use client";

import {
  Building2,
  Users,
  UserCheck,
  MessageSquare,
  TrendingUp,
  TrendingDown,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { useAuth } from "@/context/AuthContext";
import { useAppState } from "@/context/AppContext";
import { DashboardPageShell } from "@/components/dashboard/page-shell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const monthlyData = [
  { month: "Jan", views: 2400, leads: 120 },
  { month: "Feb", views: 3100, leads: 150 },
  { month: "Mar", views: 2800, leads: 135 },
  { month: "Apr", views: 3500, leads: 180 },
  { month: "May", views: 4200, leads: 210 },
  { month: "Jun", views: 3900, leads: 195 },
];

const COLORS = [
  "hsl(220 60% 20%)",
  "hsl(35 90% 55%)",
  "hsl(152 60% 40%)",
  "hsl(210 80% 55%)",
  "hsl(220 13% 70%)",
];

export default function DashboardPage() {
  const { user } = useAuth();
  const { properties, users, leads } = useAppState();
  const router = useRouter();

  if (user?.role !== "admin") {
    return (
      <DashboardPageShell
        title={`Welcome, ${user?.name?.split(" ")[0] ?? "User"}!`}
        subtitle="This dashboard is available for admin users."
      >
        <div className="rounded-xl border bg-card p-6 text-sm text-muted-foreground">
          You do not have access to admin analytics.
        </div>
      </DashboardPageShell>
    );
  }

  const agentCount = users.filter(
    (u) => u.role.toLowerCase() === "agent",
  ).length;
  const newLeads = leads.filter((l) => l.status === "New").length;

  const cityMap: Record<string, number> = {};
  properties.forEach((p) => {
    cityMap[p.city] = (cityMap[p.city] || 0) + 1;
  });

  const cityData = Object.entries(cityMap)
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 5);

  const statsCards = [
    {
      title: "Total Properties",
      value: properties.length.toString(),
      change: "+12%",
      up: true,
      icon: Building2,
      link: "/dashboard/properties",
    },
    {
      title: "Total Users",
      value: users.length.toString(),
      change: "+8%",
      up: true,
      icon: Users,
      link: "/dashboard/users",
    },
    {
      title: "Active Agents",
      value: agentCount.toString(),
      change: "+3%",
      up: true,
      icon: UserCheck,
      link: "/dashboard/agents",
    },
    {
      title: "New Inquiries",
      value: newLeads.toString(),
      change: newLeads > 3 ? "+5%" : "-2%",
      up: newLeads > 3,
      icon: MessageSquare,
      link: "/dashboard/leads",
    },
  ];

  const recentLeads = leads.slice(0, 4);

  return (
    <DashboardPageShell
      title={`Welcome, ${user?.name?.split(" ")[0] ?? "Admin"}!`}
      subtitle="Welcome back! Here's what's happening."
    >
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {statsCards.map((stat, i) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
          >
            <button
              type="button"
              onClick={() => router.push(stat.link)}
              className="w-full rounded-xl border bg-card p-6 text-left shadow-card transition-shadow hover:shadow-card-hover"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">{stat.title}</p>
                  <p className="mt-1 font-heading text-3xl font-bold text-foreground">
                    {stat.value}
                  </p>
                  <div className="mt-1 flex items-center gap-1 text-sm">
                    {stat.up ? (
                      <TrendingUp className="h-3 w-3 text-success" />
                    ) : (
                      <TrendingDown className="h-3 w-3 text-destructive" />
                    )}
                    <span
                      className={stat.up ? "text-success" : "text-destructive"}
                    >
                      {stat.change}
                    </span>
                  </div>
                </div>
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-secondary/10">
                  <stat.icon className="h-6 w-6 text-secondary" />
                </div>
              </div>
            </button>
          </motion.div>
        ))}
      </div>

      <div className="rounded-xl border bg-card p-5 shadow-card">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="font-heading text-lg font-semibold">
            Revenue By Agent
          </h3>
          <span className="text-xs text-muted-foreground">Current quarter</span>
        </div>
        <div className="h-[280px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={[
                { name: "Sarah", revenue: 46000 },
                { name: "James", revenue: 39000 },
                { name: "Emily", revenue: 28000 },
                { name: "Avery", revenue: 22000 },
              ]}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="var(--color-border)"
              />
              <XAxis
                dataKey="name"
                stroke="var(--color-muted-foreground)"
                fontSize={12}
              />
              <YAxis stroke="var(--color-muted-foreground)" fontSize={12} />
              <Tooltip
                cursor={{
                  fill: "color-mix(in oklab, var(--color-secondary) 12%, transparent)",
                }}
                contentStyle={{
                  backgroundColor: "var(--color-card)",
                  border: "1px solid var(--color-border)",
                  borderRadius: "8px",
                }}
              />
              <Bar
                dataKey="revenue"
                fill="var(--color-secondary)"
                radius={[6, 6, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <section className="rounded-xl border bg-card p-5 shadow-card lg:col-span-2">
          <h3 className="mb-4 font-heading text-lg font-semibold">
            Monthly Performance
          </h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyData}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="var(--color-border)"
                />
                <XAxis
                  dataKey="month"
                  stroke="var(--color-muted-foreground)"
                  fontSize={12}
                />
                <YAxis stroke="var(--color-muted-foreground)" fontSize={12} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "var(--color-card)",
                    border: "1px solid var(--color-border)",
                    borderRadius: "8px",
                  }}
                />
                <Bar
                  dataKey="views"
                  fill="hsl(220 60% 20%)"
                  radius={[4, 4, 0, 0]}
                />
                <Bar
                  dataKey="leads"
                  fill="hsl(35 90% 55%)"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </section>

        <section className="rounded-xl border bg-card p-5 shadow-card">
          <h3 className="mb-4 font-heading text-lg font-semibold">
            Top Cities
          </h3>
          {cityData.length > 0 ? (
            <>
              <div className="h-[200px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={cityData}
                      cx="50%"
                      cy="50%"
                      innerRadius={50}
                      outerRadius={80}
                      paddingAngle={4}
                      dataKey="value"
                    >
                      {cityData.map((_, i) => (
                        <Cell key={i} fill={COLORS[i % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="mt-2 flex flex-wrap justify-center gap-3">
                {cityData.map((city, i) => (
                  <div
                    key={city.name}
                    className="flex items-center gap-1.5 text-xs"
                  >
                    <div
                      className="h-2.5 w-2.5 rounded-full"
                      style={{ backgroundColor: COLORS[i % COLORS.length] }}
                    />
                    <span className="text-muted-foreground">
                      {city.name} ({city.value})
                    </span>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <p className="py-10 text-center text-muted-foreground">No data</p>
          )}
        </section>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <section className="rounded-xl border bg-card p-5 shadow-card">
          <h3 className="mb-4 font-heading text-lg font-semibold">
            Revenue Trend
          </h3>
          <div className="h-[250px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={monthlyData}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="var(--color-border)"
                />
                <XAxis
                  dataKey="month"
                  stroke="var(--color-muted-foreground)"
                  fontSize={12}
                />
                <YAxis stroke="var(--color-muted-foreground)" fontSize={12} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "var(--color-card)",
                    border: "1px solid var(--color-border)",
                    borderRadius: "8px",
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="leads"
                  stroke="hsl(35 90% 55%)"
                  strokeWidth={2}
                  dot={{ r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </section>

        <section className="rounded-xl border bg-card p-5 shadow-card">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="font-heading text-lg font-semibold">
              Recent Inquiries
            </h3>
            <Button
              variant="outline"
              size="sm"
              onClick={() => router.push("/dashboard/leads")}
            >
              View All
            </Button>
          </div>

          <div className="space-y-4">
            {recentLeads.map((inquiry) => (
              <div
                key={inquiry.id}
                className="flex items-center justify-between rounded-lg border p-3"
              >
                <div>
                  <div className="text-sm font-medium">{inquiry.name}</div>
                  <div className="text-xs text-muted-foreground">
                    {inquiry.property}
                  </div>
                </div>
                <div className="text-right">
                  <Badge
                    className={cn(
                      inquiry.status === "New" &&
                        "bg-info text-info-foreground",
                      inquiry.status === "Contacted" &&
                        "bg-warning text-warning-foreground",
                      inquiry.status === "Closed" &&
                        "bg-success text-success-foreground",
                    )}
                  >
                    {inquiry.status}
                  </Badge>
                  <div className="mt-1 text-xs text-muted-foreground">
                    {inquiry.date}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </DashboardPageShell>
  );
}
