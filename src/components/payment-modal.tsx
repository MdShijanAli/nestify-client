"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import {
  CreditCard,
  Smartphone,
  Building2,
  CheckCircle2,
  Loader2,
  ShieldCheck,
  Download,
  Mail,
  Receipt,
  CalendarIcon,
} from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { useAppState, type Booking } from "@/context/AppContext";
import { EmailPreviewModal } from "@/components/email-preview-modal";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { formatSlot, VISIT_TIME_SLOTS } from "@/lib/visitSlots";

interface PaymentModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  propertyTitle: string;
  propertyId: string;
  propertyAddress: string;
  amount: number;
  customerName?: string;
  customerEmail?: string;
}

type Stage = "form" | "processing" | "success";

export function PaymentModal({
  open,
  onOpenChange,
  propertyTitle,
  propertyId,
  propertyAddress,
  amount,
  customerName = "",
  customerEmail = "",
}: PaymentModalProps) {
  const { addBooking } = useAppState();
  const [stage, setStage] = useState<Stage>("form");
  const [method, setMethod] = useState("card");
  const [name, setName] = useState(customerName);
  const [email, setEmail] = useState(customerEmail);
  const [phone, setPhone] = useState("");
  const [cardNumber, setCardNumber] = useState("4111 1111 1111 1111");
  const [expiry, setExpiry] = useState("12/28");
  const [cvv, setCvv] = useState("123");
  const [mobileNumber, setMobileNumber] = useState("01711111111");
  const [mobilePin, setMobilePin] = useState("12345");
  const [txnId, setTxnId] = useState("");
  const [booking, setBooking] = useState<Booking | null>(null);
  const [emailOpen, setEmailOpen] = useState(false);
  const [visitDate, setVisitDate] = useState<Date | undefined>(() => {
    const d = new Date();
    d.setDate(d.getDate() + 3);
    return d;
  });
  const [visitTime, setVisitTime] = useState<string>("10:00");

  const handlePay = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email) {
      toast.error("Please fill in your name and email");
      return;
    }
    if (!visitDate) {
      toast.error("Please pick a visit date");
      return;
    }
    if (!visitTime) {
      toast.error("Please pick a visit time");
      return;
    }
    setStage("processing");
    setTimeout(() => {
      const generatedTxn = `SSLCZ_${Date.now()}_${Math.random().toString(36).slice(2, 8).toUpperCase()}`;
      setTxnId(generatedTxn);
      const saved = addBooking({
        txnId: generatedTxn,
        propertyId,
        propertyTitle,
        propertyAddress,
        customerName: name,
        customerEmail: email,
        amount,
        method,
        visitDate: visitDate.toISOString(),
        visitTime,
      });
      setBooking(saved);
      setStage("success");
      toast.success(
        `Visit scheduled for ${format(visitDate, "PPP")} at ${formatSlot(visitTime)}`,
      );
    }, 2200);
  };

  const handleClose = (next: boolean) => {
    if (!next && stage !== "processing") {
      onOpenChange(false);
      setTimeout(() => {
        setStage("form");
        setTxnId("");
      }, 300);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-h-[90vh] max-w-md overflow-y-auto">
        {/* SSLCommerz-style header */}
        <div className="-mx-6 -mt-6 mb-2 rounded-t-lg bg-gradient-to-r from-primary to-secondary px-6 py-4 text-primary-foreground">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-xs opacity-80">Powered by</div>
              <div className="font-heading text-lg font-bold tracking-tight">
                SSLCOMMERZ{" "}
                <span className="rounded bg-warning/90 px-1.5 py-0.5 text-[10px] text-warning-foreground">
                  SANDBOX
                </span>
              </div>
            </div>
            <ShieldCheck className="h-8 w-8 opacity-90" />
          </div>
        </div>

        {stage === "form" && (
          <>
            <DialogHeader>
              <DialogTitle>Complete Your Booking</DialogTitle>
              <DialogDescription>
                {propertyTitle} • Booking fee:{" "}
                <span className="font-semibold text-foreground">${amount}</span>
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={handlePay} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label htmlFor="pm-name">Full Name</Label>
                  <Input
                    id="pm-name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="pm-email">Email</Label>
                  <Input
                    id="pm-email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label>Visit Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        type="button"
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !visitDate && "text-muted-foreground",
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {visitDate
                          ? format(visitDate, "MMM d, yyyy")
                          : "Pick date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={visitDate}
                        onSelect={setVisitDate}
                        disabled={(d) =>
                          d < new Date(new Date().setHours(0, 0, 0, 0))
                        }
                        initialFocus
                        className={cn("p-3 pointer-events-auto")}
                      />
                    </PopoverContent>
                  </Popover>
                </div>
                <div className="space-y-1.5">
                  <Label>Time Slot</Label>
                  <Select value={visitTime} onValueChange={setVisitTime}>
                    <SelectTrigger>
                      <SelectValue placeholder="Pick time" />
                    </SelectTrigger>
                    <SelectContent>
                      {VISIT_TIME_SLOTS.map((s) => (
                        <SelectItem key={s} value={s}>
                          {formatSlot(s)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <p className="text-xs text-muted-foreground -mt-2">
                An agent will meet you at the property at this date & time.
              </p>

              <Tabs value={method} onValueChange={setMethod}>
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="card">
                    <CreditCard className="mr-1 h-3.5 w-3.5" />
                    Card
                  </TabsTrigger>
                  <TabsTrigger value="mobile">
                    <Smartphone className="mr-1 h-3.5 w-3.5" />
                    Mobile
                  </TabsTrigger>
                  <TabsTrigger value="bank">
                    <Building2 className="mr-1 h-3.5 w-3.5" />
                    Bank
                  </TabsTrigger>
                </TabsList>
                <TabsContent value="card" className="mt-3 space-y-3">
                  <div className="space-y-1.5">
                    <Label htmlFor="pm-card">Card Number</Label>
                    <Input
                      id="pm-card"
                      value={cardNumber}
                      onChange={(e) => setCardNumber(e.target.value)}
                      placeholder="4111 1111 1111 1111"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1.5">
                      <Label htmlFor="pm-exp">Expiry</Label>
                      <Input
                        id="pm-exp"
                        value={expiry}
                        onChange={(e) => setExpiry(e.target.value)}
                        placeholder="MM/YY"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="pm-cvv">CVV</Label>
                      <Input
                        id="pm-cvv"
                        value={cvv}
                        onChange={(e) => setCvv(e.target.value)}
                        placeholder="123"
                      />
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Test card: 4111 1111 1111 1111 — any future expiry & CVV.
                  </p>
                </TabsContent>

                <TabsContent value="mobile" className="mt-3 space-y-3">
                  <div className="grid grid-cols-3 gap-2">
                    {["bKash", "Nagad", "Rocket"].map((w) => (
                      <button
                        key={w}
                        type="button"
                        className="rounded-md border bg-card p-2 text-xs font-medium hover:border-primary"
                      >
                        {w}
                      </button>
                    ))}
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="pm-mob">Mobile Number</Label>
                    <Input
                      id="pm-mob"
                      value={mobileNumber}
                      onChange={(e) => setMobileNumber(e.target.value)}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="pm-pin">PIN</Label>
                    <Input
                      id="pm-pin"
                      type="password"
                      value={mobilePin}
                      onChange={(e) => setMobilePin(e.target.value)}
                    />
                  </div>
                </TabsContent>

                <TabsContent value="bank" className="mt-3 space-y-3">
                  <div className="space-y-1.5">
                    <Label htmlFor="pm-phone">Phone for OTP</Label>
                    <Input
                      id="pm-phone"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+1 555 000 0000"
                    />
                  </div>
                  <p className="text-xs text-muted-foreground">
                    You'll be redirected to your bank's secure portal (sandbox
                    simulation).
                  </p>
                </TabsContent>
              </Tabs>

              <div className="flex items-center justify-between rounded-md bg-muted p-3 text-sm">
                <span className="text-muted-foreground">Total Payable</span>
                <span className="font-heading text-xl font-bold text-secondary">
                  ${amount.toLocaleString()}
                </span>
              </div>

              <Button
                type="submit"
                className="w-full gradient-accent text-accent-foreground border-0"
                size="lg"
              >
                Pay ${amount} Securely
              </Button>
            </form>
          </>
        )}

        {stage === "processing" && (
          <div className="flex flex-col items-center justify-center py-10 text-center">
            <Loader2 className="h-12 w-12 animate-spin text-primary" />
            <h3 className="mt-4 font-heading text-lg font-semibold">
              Processing Payment…
            </h3>
            <p className="mt-1 text-sm text-muted-foreground">
              Please don't close this window.
            </p>
            <p className="mt-4 text-xs text-muted-foreground">
              Connecting to SSLCommerz sandbox gateway…
            </p>
          </div>
        )}

        {stage === "success" && (
          <div className="py-2">
            <div className="flex flex-col items-center text-center">
              <div className="rounded-full bg-success/10 p-3">
                <CheckCircle2 className="h-12 w-12 text-success" />
              </div>
              <h3 className="mt-3 font-heading text-xl font-bold">
                Payment Successful!
              </h3>
              <p className="mt-1 text-sm text-muted-foreground">
                Your booking for {propertyTitle} is confirmed.
              </p>
              <div className="mt-2 flex items-center gap-1.5 text-xs text-success">
                <Mail className="h-3.5 w-3.5" /> Confirmation email sent to{" "}
                {email}
              </div>
            </div>

            <div className="mt-5 space-y-2 rounded-lg border bg-muted/40 p-4 text-sm">
              <Row label="Transaction ID" value={txnId} />
              <Row label="Property ID" value={propertyId} />
              <Row label="Amount Paid" value={`$${amount}`} />
              <Row label="Method" value={method.toUpperCase()} />
              <Row
                label="Status"
                value={
                  <span className="font-semibold text-success">VALID</span>
                }
              />
              {visitDate && (
                <Row
                  label="Visit Scheduled"
                  value={
                    <span className="font-semibold text-primary">
                      {format(visitDate, "PPP")} • {formatSlot(visitTime)}
                    </span>
                  }
                />
              )}
            </div>

            <div className="mt-5 grid grid-cols-2 gap-2">
              <Button
                variant="outline"
                onClick={() => booking && setEmailOpen(true)}
              >
                <Mail className="mr-1.5 h-4 w-4" /> View Email
              </Button>
              <Button
                variant="outline"
                onClick={() => booking && downloadReceipt(booking)}
              >
                <Download className="mr-1.5 h-4 w-4" /> Receipt
              </Button>
            </div>
            <Link href="/dashboard/bookings" onClick={() => handleClose(false)}>
              <Button variant="ghost" className="mt-2 w-full text-primary">
                <Receipt className="mr-1.5 h-4 w-4" /> View My Bookings
              </Button>
            </Link>
            <Button className="mt-2 w-full" onClick={() => handleClose(false)}>
              Done
            </Button>
          </div>
        )}
      </DialogContent>
      <EmailPreviewModal
        open={emailOpen}
        onOpenChange={setEmailOpen}
        booking={booking}
      />
    </Dialog>
  );
}

function Row({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex justify-between gap-3">
      <span className="text-muted-foreground">{label}</span>
      <span className="break-all text-right font-medium">{value}</span>
    </div>
  );
}
