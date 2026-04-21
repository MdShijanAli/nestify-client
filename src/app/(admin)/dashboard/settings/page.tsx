"use client";

import { useAuth } from "@/context/AuthContext";
import AgentSettingsPage from "./AgentSettings";
import AdminSettingsPage from "./AdminSettings";

export default function SettingsPage() {
  const { user } = useAuth();
  return (
    <>
      {user?.role === "admin" ? <AdminSettingsPage /> : <AgentSettingsPage />}
    </>
  );
}
