"use client";

import { useState, type ComponentType, type ReactNode } from "react";
import Link from "next/link";
import { useAppState, type Booking } from "@/context/AppContext";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import {
  Download,
  Mail,
  MapPin,
  Calendar,
  CreditCard,
  XCircle,
  Receipt,
  Eye,
} from "lucide-react";
import { downloadReceipt } from "@/lib/receipt";
import { EmailPreviewModal } from "@/components/email-preview-modal";
import { toast } from "sonner";

export default function CustomerBookingsPage() {
  const { bookings, cancelBooking } = useAppState();
  const [previewBooking, setPreviewBooking] = useState<Booking | null>(null);

  const totalSpent = bookings
    .filter((booking) => booking.status === "Confirmed")
    .reduce((sum, booking) => sum + booking.amount, 0);

  return (
    <div className="container mx-auto p-6">
      <div className="mb-6 flex items-end justify-between">
        <div>
          <h1 className="font-heading text-3xl font-bold">My Bookings</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Transaction history and downloadable receipts
          </p>
        </div>
        <div className="hidden gap-3 sm:flex">
          <Stat label="Total Bookings" value={bookings.length} />
          <Stat label="Total Spent" value={`$${totalSpent.toLocaleString()}`} />
        </div>
      </div>

      {bookings.length === 0 ? (
        <Card className="p-12 text-center">
          <Receipt className="mx-auto h-12 w-12 text-muted-foreground" />
          <h3 className="mt-4 font-heading text-lg font-semibold">No bookings yet</h3>
          <p className="mt-1 text-sm text-muted-foreground">
            Browse properties and book one to see your transactions here.
          </p>
          <Link href="/properties">
            <Button className="mt-4">Browse Properties</Button>
          </Link>
        </Card>
      ) : (
        <div className="space-y-4">
          {bookings.map((booking) => (
            <Card key={booking.id} className="overflow-hidden">
              <div className="flex min-w-0 flex-col gap-4 p-5 md:flex-row md:items-center md:justify-between">
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <Link
                      href={`/properties/${booking.propertyId}`}
                      className="font-heading text-lg font-semibold hover:text-primary"
                    >
                      {booking.propertyTitle}
                    </Link>
                    <Badge
                      variant={
                        booking.status === "Confirmed" ? "default" : "destructive"
                      }
                      className={
                        booking.status === "Confirmed"
                          ? "bg-success text-success-foreground"
                          : ""
                      }
                    >
                      {booking.status}
                    </Badge>
                  </div>
                  <div className="mt-1 flex items-center gap-1 text-sm text-muted-foreground">
                    <MapPin className="h-3.5 w-3.5" /> {booking.propertyAddress}
                  </div>
                  <div className="mt-3 grid grid-cols-2 gap-x-4 gap-y-1 text-xs sm:grid-cols-4">
                    <Meta icon={Receipt} label="Txn" value={booking.txnId} />
                    <Meta
                      icon={Calendar}
                      label="Date"
                      value={new Date(booking.date).toLocaleDateString()}
                    />
                    <Meta
                      icon={CreditCard}
                      label="Method"
                      value={booking.method.toUpperCase()}
                    />
                    <Meta icon={Mail} label="Email" value={booking.customerEmail} />
                  </div>
                </div>

                <div className="flex flex-col items-end gap-3 md:items-end">
                  <div className="text-right">
                    <div className="text-xs text-muted-foreground">Amount</div>
                    <div className="font-heading text-2xl font-bold text-secondary">
                      ${booking.amount.toLocaleString()}
                    </div>
                  </div>
                  <div className="flex flex-wrap justify-end gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setPreviewBooking(booking)}
                    >
                      <Eye className="mr-1.5 h-3.5 w-3.5" /> Email
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => downloadReceipt(booking)}
                    >
                      <Download className="mr-1.5 h-3.5 w-3.5" /> Receipt
                    </Button>
                    {booking.status === "Confirmed" ? (
                      <Button
                        size="sm"
                        variant="ghost"
                        className="text-destructive hover:text-destructive"
                        onClick={() => {
                          cancelBooking(booking.id);
                          toast.success("Booking cancelled");
                        }}
                      >
                        <XCircle className="mr-1.5 h-3.5 w-3.5" /> Cancel
                      </Button>
                    ) : null}
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      <EmailPreviewModal
        open={!!previewBooking}
        onOpenChange={(open) => {
          if (!open) setPreviewBooking(null);
        }}
        booking={previewBooking}
      />
    </div>
  );
}

function Stat({ label, value }: { label: string; value: ReactNode }) {
  return (
    <Card className="px-4 py-2">
      <div className="text-xs text-muted-foreground">{label}</div>
      <div className="font-heading text-lg font-bold">{value}</div>
    </Card>
  );
}

function Meta({
  icon: Icon,
  label,
  value,
}: {
  icon: ComponentType<{ className?: string }>;
  label: string;
  value: string;
}) {
  return (
    <div className="flex min-w-0 items-center gap-1.5 text-muted-foreground">
      <Icon className="h-3.5 w-3.5 shrink-0" />
      <span className="shrink-0">{label}:</span>
      <span className="truncate font-medium text-foreground">{value}</span>
    </div>
  );
}
