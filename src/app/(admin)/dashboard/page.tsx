"use client";

import { useAuth } from "@/context/AuthContext";
import AdminDashboard from "./(dashboards)/AdminDashboard";
import AgentDashboard from "./(dashboards)/AgentDashboard";
import CustomerDashboard from "./(dashboards)/CustomerDashboard";

export default function DashboardPage() {
  const { user } = useAuth();
  console.log("Authenticated user:", user);
  return (
    <>
      {user?.role === "admin" ? (
        <AdminDashboard />
      ) : user?.role === "agent" ? (
        <AgentDashboard />
      ) : user?.role === "customer" ? (
        <CustomerDashboard />
      ) : (
        <p>Unauthorized</p>
      )}
    </>
  );
}
