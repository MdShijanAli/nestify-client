"use client";

import { useAuth } from "@/context/AuthContext";
import { AdminLayout } from "@/components/dashboard/admin-layout";
import { AgentLayout } from "@/components/dashboard/agent-layout";
import { CustomerLayout } from "@/components/dashboard/customer-layout";

export function RoleDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user } = useAuth();

  if (user?.role === "admin") {
    return <AdminLayout>{children}</AdminLayout>;
  }

  if (user?.role === "agent") {
    return <AgentLayout>{children}</AgentLayout>;
  }

  return <CustomerLayout>{children}</CustomerLayout>;
}
