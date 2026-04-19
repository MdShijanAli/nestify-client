"use client";

import type { ReactNode } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Mail, Download } from "lucide-react";
import type { Booking } from "@/context/AppContext";
import { downloadReceipt } from "@/lib/receipt";

interface Props {
  open: boolean;
  onOpenChange: (o: boolean) => void;
  booking: Booking | null;
}

export function EmailPreviewModal({ open, onOpenChange, booking }: Props) {
  if (!booking) return null;
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Mail className="h-5 w-5 text-primary" /> Confirmation Email Sent
          </DialogTitle>
        </DialogHeader>

        {/* Email envelope preview */}
        <div className="rounded-lg border bg-muted/30">
          <div className="border-b bg-card p-3 text-xs">
            <div>
              <span className="text-muted-foreground">To:</span>{" "}
              <span className="font-medium">{booking.customerEmail}</span>
            </div>
            <div>
              <span className="text-muted-foreground">From:</span>{" "}
              bookings@estatehub.com
            </div>
            <div>
              <span className="text-muted-foreground">Subject:</span>{" "}
              <span className="font-medium">
                Booking Confirmed — {booking.propertyTitle}
              </span>
            </div>
          </div>
          <div className="space-y-3 p-4 text-sm">
            <p>
              Hi <span className="font-semibold">{booking.customerName}</span>,
            </p>
            <p>
              Thanks for your booking! Your payment has been received and your
              booking is now confirmed.
            </p>
            <div className="rounded-md border bg-card p-3 text-xs">
              <Row k="Booking ID" v={booking.id} />
              <Row k="Transaction ID" v={booking.txnId} />
              <Row k="Property" v={booking.propertyTitle} />
              <Row k="Address" v={booking.propertyAddress} />
              <Row k="Amount Paid" v={`$${booking.amount.toLocaleString()}`} />
              <Row k="Method" v={booking.method.toUpperCase()} />
              <Row
                k="Status"
                v={
                  <span className="font-semibold text-success">CONFIRMED</span>
                }
              />
            </div>
            <p className="text-muted-foreground">
              A receipt is attached for your records. Our agent will be in touch
              shortly.
            </p>
            <p>— The EstateHub Team</p>
          </div>
        </div>

        <div className="flex gap-2">
          <Button
            variant="outline"
            className="flex-1"
            onClick={() => downloadReceipt(booking)}
          >
            <Download className="mr-2 h-4 w-4" /> Download Receipt
          </Button>
          <Button className="flex-1" onClick={() => onOpenChange(false)}>
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function Row({ k, v }: { k: string; v: ReactNode }) {
  return (
    <div className="flex justify-between border-b py-1.5 last:border-0">
      <span className="text-muted-foreground">{k}</span>
      <span className="text-right font-medium">{v}</span>
    </div>
  );
}
