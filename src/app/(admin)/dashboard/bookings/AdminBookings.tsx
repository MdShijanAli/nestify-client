"use client";

import { BookingsTable } from "@/components/bookings-table";

export default function AdminBookingsPage() {
  return (
    <BookingsTable
      title="All Bookings"
      description="Platform-wide payment transactions and bookings"
    />
  );
}
