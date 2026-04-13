"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { RoleDashboardLayout } from "@/components/dashboard/role-dashboard-layout";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const { isAuthenticated, user } = useAuth();

  useEffect(() => {
    if (!isAuthenticated) {
      router.replace("/login");
      return;
    }

    const role = user?.role ?? "customer";

    if (role === "admin" && pathname === "/dashboard/my-listings") {
      router.replace("/dashboard/properties");
      return;
    }

    if (
      role === "customer" &&
      [
        "/dashboard/properties",
        "/dashboard/users",
        "/dashboard/agents",
        "/dashboard/content",
        "/dashboard/reports",
        "/dashboard/performance",
      ].includes(pathname)
    ) {
      router.replace("/dashboard");
      return;
    }
  }, [isAuthenticated, pathname, router, user?.role]);

  if (!isAuthenticated) return null;

  return <RoleDashboardLayout>{children}</RoleDashboardLayout>;
}
