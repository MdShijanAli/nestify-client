"use client";

import {
  Heart,
  Search,
  MessageSquare,
  Home,
  Building2,
  Eye,
  TrendingUp,
  Users,
  UserCheck,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useAppState } from "@/context/AppContext";
import {
  DashboardPageShell,
  DashboardStatCard,
} from "@/components/dashboard/page-shell";

export default function DashboardPage() {
  const { user } = useAuth();
  const { favorites, properties } = useAppState();

  if (user?.role === "admin") {
    const stats = [
      {
        label: "Total Properties",
        value: properties.length,
        icon: Building2,
        color: "text-primary",
      },
      {
        label: "Active Agents",
        value: 12,
        icon: UserCheck,
        color: "text-secondary",
      },
      { label: "Total Users", value: 248, icon: Users, color: "text-success" },
      {
        label: "Monthly Leads",
        value: 86,
        icon: MessageSquare,
        color: "text-accent",
      },
    ];

    return (
      <DashboardPageShell
        title={`Welcome, ${user?.name?.split(" ")[0] ?? "Admin"}!`}
        subtitle="Platform performance overview"
      >
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((s) => (
            <DashboardStatCard key={s.label} {...s} />
          ))}
        </div>
      </DashboardPageShell>
    );
  }

  if (user?.role === "agent") {
    const stats = [
      {
        label: "My Listings",
        value: 4,
        icon: Building2,
        color: "text-primary",
      },
      {
        label: "Active Leads",
        value: 3,
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
      <DashboardPageShell
        title={`Welcome back, ${user?.name?.split(" ")[0] ?? "Agent"}!`}
        subtitle="Your sales activity overview"
      >
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((s) => (
            <DashboardStatCard key={s.label} {...s} />
          ))}
        </div>
      </DashboardPageShell>
    );
  }

  const stats = [
    {
      label: "Saved Properties",
      value: favorites.length,
      icon: Heart,
      color: "text-destructive",
    },
    { label: "Searches Made", value: 14, icon: Search, color: "text-primary" },
    {
      label: "Inquiries Sent",
      value: 3,
      icon: MessageSquare,
      color: "text-secondary",
    },
    { label: "Properties Viewed", value: 42, icon: Home, color: "text-accent" },
  ];

  return (
    <DashboardPageShell
      title={`Welcome, ${user?.name?.split(" ")[0] ?? "Customer"}!`}
      subtitle="Your property search overview"
    >
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((s) => (
          <DashboardStatCard key={s.label} {...s} />
        ))}
      </div>
    </DashboardPageShell>
  );
}
