"use client";

import { useAuth } from "@/context/AuthContext";
import AdminBookingsPage from "./AdminBookings";
import CustomerBookingsPage from "./CustomerBookings";

export default function BookingsPage() {
  const { user } = useAuth();

  return (
    <>
      {user?.role === "admin" ? (
        <AdminBookingsPage />
      ) : (
        <CustomerBookingsPage />
      )}
    </>
  );
}
