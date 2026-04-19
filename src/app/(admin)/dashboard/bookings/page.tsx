"use client";

import { BookingsTable } from "@/components/bookings-table";

export default function DashboardBookingsPage() {
  return (
    <BookingsTable
      title="All Bookings"
      description="Platform-wide payment transactions and bookings"
    />
  );
}
