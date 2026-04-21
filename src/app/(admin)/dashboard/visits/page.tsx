"use client";

import { useAuth } from "@/context/AuthContext";
import AgentVisitsPage from "./AgentVisits";
import CustomerVisitsPage from "./CustomerVisits";

export default function VisitsPage() {
  const { user } = useAuth();

  return (
    <>
      {user?.role === "agent" ? (
        <AgentVisitsPage />
      ) : user?.role === "customer" ? (
        <CustomerVisitsPage />
      ) : (
        <div className="p-6">
          <h1 className="text-2xl font-bold">Access Denied</h1>
          <p className="text-muted-foreground">
            You do not have permission to view this page.
          </p>
        </div>
      )}
    </>
  );
}
