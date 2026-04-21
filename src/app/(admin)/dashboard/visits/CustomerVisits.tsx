"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  CalendarCheck,
  MapPin,
  ExternalLink,
  CalendarDays,
  CalendarIcon,
  X,
  RefreshCw,
  Clock,
} from "lucide-react";
import { format, isSameDay, isAfter, startOfDay } from "date-fns";
import { useAppState, type Booking } from "@/context/AppContext";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { VISIT_TIME_SLOTS, formatSlot } from "@/lib/visitSlots";

type VisitBooking = Booking & { _visit: Date };

export default function CustomerVisitsPage() {
  const { bookings, cancelBooking, rescheduleVisit } = useAppState();
  const [selected, setSelected] = useState<Date | undefined>(new Date());
  const [cancelTarget, setCancelTarget] = useState<Booking | null>(null);
  const [rescheduleTarget, setRescheduleTarget] = useState<Booking | null>(null);
  const [newDate, setNewDate] = useState<Date | undefined>();
  const [newTime, setNewTime] = useState<string>("10:00");

  const scheduled = useMemo<VisitBooking[]>(
    () =>
      bookings
        .filter((booking) => booking.visitDate && booking.status === "Confirmed")
        .map((booking) => ({ ...booking, _visit: new Date(booking.visitDate!) })),
    [bookings],
  );

  const today = startOfDay(new Date());
  const upcoming = useMemo(
    () =>
      scheduled
        .filter((booking) => isAfter(booking._visit, today) || isSameDay(booking._visit, today))
        .sort((a, b) => a._visit.getTime() - b._visit.getTime()),
    [scheduled, today],
  );
  const past = useMemo(
    () =>
      scheduled
        .filter((booking) => !isSameDay(booking._visit, today) && !isAfter(booking._visit, today))
        .sort((a, b) => b._visit.getTime() - a._visit.getTime()),
    [scheduled, today],
  );

  const visitDays = scheduled.map((booking) => booking._visit);
  const onSelectedDay = selected
    ? scheduled.filter((booking) => isSameDay(booking._visit, selected))
    : [];

  const openReschedule = (booking: Booking) => {
    setRescheduleTarget(booking);
    setNewDate(booking.visitDate ? new Date(booking.visitDate) : new Date());
    setNewTime(booking.visitTime || "10:00");
  };

  const rescheduleTakenSlots = useMemo(() => {
    if (!rescheduleTarget || !newDate) return [];

    return bookings
      .filter(
        (booking) =>
          booking.id !== rescheduleTarget.id &&
          booking.status === "Confirmed" &&
          booking.propertyId === rescheduleTarget.propertyId &&
          booking.visitDate &&
          isSameDay(new Date(booking.visitDate), newDate) &&
          booking.visitTime,
      )
      .map((booking) => booking.visitTime as string);
  }, [bookings, newDate, rescheduleTarget]);

  const confirmReschedule = () => {
    if (!rescheduleTarget || !newDate) return;

    if (rescheduleTakenSlots.includes(newTime)) {
      toast.error("That time slot is already booked. Pick another.");
      return;
    }

    rescheduleVisit(rescheduleTarget.id, newDate.toISOString(), newTime);
    toast.success(
      `Visit rescheduled to ${format(newDate, "PPP")} at ${formatSlot(newTime)}`,
    );
    setRescheduleTarget(null);
    setNewDate(undefined);
  };

  const confirmCancel = () => {
    if (!cancelTarget) return;
    cancelBooking(cancelTarget.id);
    toast.success("Booking cancelled");
    setCancelTarget(null);
  };

  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="flex items-center gap-2 font-heading text-2xl font-bold">
          <CalendarCheck className="h-6 w-6 text-primary" /> Upcoming Visits
        </h1>
        <p className="text-muted-foreground">
          Your scheduled property visits - reschedule or cancel anytime
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <Card>
          <CardContent className="p-5">
            <div className="text-xs text-muted-foreground">Upcoming</div>
            <div className="font-heading text-3xl font-bold text-success">{upcoming.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-5">
            <div className="text-xs text-muted-foreground">Past Visits</div>
            <div className="font-heading text-3xl font-bold text-muted-foreground">{past.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-5">
            <div className="text-xs text-muted-foreground">Total Scheduled</div>
            <div className="font-heading text-3xl font-bold text-primary">{scheduled.length}</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-[auto_1fr]">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <CalendarDays className="h-4 w-4" /> Calendar
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Calendar
              mode="single"
              selected={selected}
              onSelect={setSelected}
              modifiers={{ scheduled: visitDays }}
              modifiersClassNames={{ scheduled: "rounded-md bg-primary/15 font-bold text-primary" }}
              className={cn("pointer-events-auto p-0")}
            />
            <div className="mt-3 flex items-center gap-2 text-xs text-muted-foreground">
              <span className="inline-block h-3 w-3 rounded bg-primary/30" /> Day with scheduled visit
            </div>
          </CardContent>
        </Card>

        <div className="space-y-4">
          {selected ? (
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Visits on {format(selected, "PPP")}</CardTitle>
              </CardHeader>
              <CardContent>
                {onSelectedDay.length === 0 ? (
                  <p className="text-sm text-muted-foreground">No visits scheduled on this day.</p>
                ) : (
                  <div className="space-y-3">
                    {onSelectedDay.map((booking) => (
                      <VisitRow
                        key={booking.id}
                        booking={booking}
                        onReschedule={openReschedule}
                        onCancel={setCancelTarget}
                      />
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          ) : null}

          <Card>
            <CardHeader>
              <CardTitle className="text-base">All Upcoming</CardTitle>
            </CardHeader>
            <CardContent>
              {upcoming.length === 0 ? (
                <div className="rounded-lg border border-dashed p-8 text-center">
                  <p className="text-sm text-muted-foreground">No upcoming visits.</p>
                  <Link href="/properties">
                    <Button size="sm" variant="outline" className="mt-3">
                      Browse Properties
                    </Button>
                  </Link>
                </div>
              ) : (
                <div className="space-y-3">
                  {upcoming.map((booking) => (
                    <VisitRow
                      key={booking.id}
                      booking={booking}
                      onReschedule={openReschedule}
                      onCancel={setCancelTarget}
                    />
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      <Dialog
        open={!!rescheduleTarget}
        onOpenChange={(open) => {
          if (!open) setRescheduleTarget(null);
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reschedule Visit</DialogTitle>
            <DialogDescription>
              {rescheduleTarget?.propertyTitle} - currently{" "}
              {rescheduleTarget?.visitDate
                ? format(new Date(rescheduleTarget.visitDate), "PPP")
                : "-"}
              {rescheduleTarget?.visitTime
                ? ` at ${formatSlot(rescheduleTarget.visitTime)}`
                : ""}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="text-sm font-medium">New date</label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !newDate && "text-muted-foreground",
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {newDate ? format(newDate, "MMM d, yyyy") : "Pick date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={newDate}
                      onSelect={setNewDate}
                      disabled={(date) => date < startOfDay(new Date())}
                      initialFocus
                      className={cn("pointer-events-auto p-3")}
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-medium">New time</label>
                <Select value={newTime} onValueChange={setNewTime}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {VISIT_TIME_SLOTS.map((slot) => {
                      const taken = rescheduleTakenSlots.includes(slot);
                      return (
                        <SelectItem key={slot} value={slot} disabled={taken}>
                          {formatSlot(slot)}
                          {taken ? " - Booked" : ""}
                        </SelectItem>
                      );
                    })}
                  </SelectContent>
                </Select>
                {rescheduleTakenSlots.length > 0 ? (
                  <p className="text-[11px] text-muted-foreground">
                    {rescheduleTakenSlots.length} slot
                    {rescheduleTakenSlots.length > 1 ? "s" : ""} unavailable.
                  </p>
                ) : null}
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setRescheduleTarget(null)}>
              Cancel
            </Button>
            <Button
              onClick={confirmReschedule}
              disabled={!newDate || rescheduleTakenSlots.includes(newTime)}
            >
              <RefreshCw className="mr-1.5 h-4 w-4" /> Confirm Reschedule
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog
        open={!!cancelTarget}
        onOpenChange={(open) => {
          if (!open) setCancelTarget(null);
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Cancel this booking?</AlertDialogTitle>
            <AlertDialogDescription>
              You&apos;re about to cancel your visit to <strong>{cancelTarget?.propertyTitle}</strong> scheduled for{" "}
              {cancelTarget?.visitDate
                ? format(new Date(cancelTarget.visitDate), "PPP")
                : "-"}
              {cancelTarget?.visitTime
                ? ` at ${formatSlot(cancelTarget.visitTime)}`
                : ""}
              . The booking will be marked as cancelled.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Keep Booking</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmCancel}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Yes, Cancel Visit
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

function VisitRow({
  booking,
  onReschedule,
  onCancel,
}: {
  booking: VisitBooking;
  onReschedule: (booking: Booking) => void;
  onCancel: (booking: Booking) => void;
}) {
  return (
    <div className="flex flex-wrap items-start justify-between gap-3 rounded-lg border p-3">
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <p className="truncate font-medium">{booking.propertyTitle}</p>
          <Badge className="bg-primary px-1.5 py-0 text-[10px] text-primary-foreground">
            {format(booking._visit, "MMM d")}
          </Badge>
          {booking.visitTime ? (
            <Badge variant="outline" className="px-1.5 py-0 text-[10px]">
              <Clock className="mr-1 h-2.5 w-2.5" />
              {formatSlot(booking.visitTime)}
            </Badge>
          ) : null}
        </div>

        <div className="mt-0.5 flex items-center gap-1 text-xs text-muted-foreground">
          <MapPin className="h-3 w-3" />
          <span className="truncate">{booking.propertyAddress}</span>
        </div>
        <div className="mt-0.5 text-xs text-muted-foreground">{booking.txnId}</div>
      </div>

      <div className="flex items-center gap-1">
        <Link href={`/properties/${booking.propertyId}`}>
          <Button size="sm" variant="ghost" title="View property">
            <ExternalLink className="h-3.5 w-3.5" />
          </Button>
        </Link>
        <Button size="sm" variant="outline" onClick={() => onReschedule(booking)}>
          <RefreshCw className="mr-1 h-3.5 w-3.5" />
          Reschedule
        </Button>
        <Button
          size="sm"
          variant="ghost"
          className="text-destructive hover:bg-destructive/10 hover:text-destructive"
          onClick={() => onCancel(booking)}
        >
          <X className="mr-1 h-3.5 w-3.5" />
          Cancel
        </Button>
      </div>
    </div>
  );
}
