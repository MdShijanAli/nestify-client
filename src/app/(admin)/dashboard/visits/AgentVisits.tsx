"use client";

import { useMemo, useState, type ReactNode } from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  CalendarCheck,
  MapPin,
  ExternalLink,
  CalendarDays,
  User,
  Mail,
  Clock,
} from "lucide-react";
import { format, isSameDay, isAfter, startOfDay } from "date-fns";
import { useAppState, type Booking } from "@/context/AppContext";
import { useAuth } from "@/context/AuthContext";
import { cn } from "@/lib/utils";
import { VISIT_TIME_SLOTS, formatSlot } from "@/lib/visitSlots";

type VisitBooking = Booking & { _visit: Date };

export default function AgentVisitsPage() {
  const { bookings, properties } = useAppState();
  const { user } = useAuth();
  const [selected, setSelected] = useState<Date | undefined>(new Date());

  const myPropertyIds = useMemo(
    () =>
      new Set(
        properties.filter((p) => p.agentName === user?.name).map((p) => p.id),
      ),
    [properties, user],
  );

  const scheduled = useMemo<VisitBooking[]>(
    () =>
      bookings
        .filter(
          (booking) =>
            booking.visitDate &&
            booking.status === "Confirmed" &&
            myPropertyIds.has(booking.propertyId),
        )
        .map((booking) => ({
          ...booking,
          _visit: new Date(booking.visitDate!),
        })),
    [bookings, myPropertyIds],
  );

  const today = startOfDay(new Date());
  const upcoming = useMemo(
    () =>
      scheduled
        .filter(
          (booking) =>
            isAfter(booking._visit, today) || isSameDay(booking._visit, today),
        )
        .sort((a, b) => {
          const delta = a._visit.getTime() - b._visit.getTime();
          if (delta !== 0) return delta;
          return (a.visitTime || "").localeCompare(b.visitTime || "");
        }),
    [scheduled, today],
  );

  const todayVisits = scheduled.filter((booking) =>
    isSameDay(booking._visit, today),
  );
  const visitDays = scheduled.map((booking) => booking._visit);
  const onSelectedDay = selected
    ? scheduled
        .filter((booking) => isSameDay(booking._visit, selected))
        .sort((a, b) => (a.visitTime || "").localeCompare(b.visitTime || ""))
    : [];

  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="flex items-center gap-2 font-heading text-2xl font-bold">
          <CalendarCheck className="h-6 w-6 text-primary" /> Customer Visits
        </h1>
        <p className="text-muted-foreground">
          Daily timeline of customer visits to your listings
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <Card>
          <CardContent className="p-5">
            <div className="text-xs text-muted-foreground">Today</div>
            <div className="font-heading text-3xl font-bold text-secondary">
              {todayVisits.length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-5">
            <div className="text-xs text-muted-foreground">Upcoming</div>
            <div className="font-heading text-3xl font-bold text-success">
              {upcoming.length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-5">
            <div className="text-xs text-muted-foreground">Total Scheduled</div>
            <div className="font-heading text-3xl font-bold text-primary">
              {scheduled.length}
            </div>
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
              modifiersClassNames={{
                scheduled: "rounded-md bg-primary/15 font-bold text-primary",
              }}
              className={cn("pointer-events-auto p-0")}
            />
            <div className="mt-3 flex items-center gap-2 text-xs text-muted-foreground">
              <span className="inline-block h-3 w-3 rounded bg-primary/30" />{" "}
              Day with scheduled visit
            </div>
          </CardContent>
        </Card>

        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <Clock className="h-4 w-4" />
                {selected
                  ? `Timeline - ${format(selected, "PPP")}`
                  : "Timeline"}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {selected ? <DayTimeline visits={onSelectedDay} /> : null}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">All Upcoming</CardTitle>
            </CardHeader>
            <CardContent>
              {upcoming.length === 0 ? (
                <div className="rounded-lg border border-dashed p-8 text-center">
                  <p className="text-sm text-muted-foreground">
                    No upcoming customer visits for your listings.
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {upcoming.map((booking) => (
                    <AgentVisitRow key={booking.id} booking={booking} />
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

function DayTimeline({ visits }: { visits: VisitBooking[] }) {
  const bySlot: Record<string, VisitBooking[]> = {};

  visits.forEach((visit) => {
    const slot = visit.visitTime || "—";
    (bySlot[slot] ||= []).push(visit);
  });

  const slots = Array.from(
    new Set([
      ...VISIT_TIME_SLOTS,
      ...Object.keys(bySlot).filter((slot) => slot !== "—"),
    ]),
  ).sort();
  const unscheduled = bySlot["—"] || [];

  return (
    <div className="space-y-1">
      {slots.map((slot) => {
        const items = bySlot[slot] || [];
        const isEmpty = items.length === 0;

        return (
          <div
            key={slot}
            className={cn(
              "grid grid-cols-[80px_1fr] gap-3 rounded-md px-2 py-2 transition-colors",
              isEmpty ? "opacity-50" : "bg-primary/5",
            )}
          >
            <div className="flex items-start gap-1.5 pt-1 font-mono text-sm font-semibold">
              <Clock className="mt-0.5 h-3.5 w-3.5 text-muted-foreground" />
              {formatSlot(slot)}
            </div>
            <div className="space-y-2">
              {isEmpty ? (
                <p className="pt-1 text-xs italic text-muted-foreground">
                  No visit
                </p>
              ) : (
                items.map((visit) => (
                  <SlotCard key={visit.id} booking={visit} />
                ))
              )}
            </div>
          </div>
        );
      })}

      {unscheduled.length > 0 ? (
        <div className="mt-2 grid grid-cols-[80px_1fr] gap-3 rounded-md bg-warning/10 px-2 py-2">
          <div className="pt-1 text-sm font-semibold text-warning-foreground">
            No time
          </div>
          <div className="space-y-2">
            {unscheduled.map((visit) => (
              <SlotCard key={visit.id} booking={visit} />
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
}

function SlotCard({ booking }: { booking: VisitBooking }) {
  return (
    <div className="rounded-md border bg-card p-2.5">
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <p className="truncate text-sm font-semibold">
              {booking.propertyTitle}
            </p>
            <Badge className="bg-primary px-1.5 py-0 text-[10px] text-primary-foreground">
              {booking.propertyId}
            </Badge>
          </div>
          <div className="mt-0.5 flex items-center gap-1 text-xs text-muted-foreground">
            <MapPin className="h-3 w-3" />
            <span className="truncate">{booking.propertyAddress}</span>
          </div>
          <div className="mt-1 flex flex-wrap items-center gap-3 text-xs">
            <span className="inline-flex items-center gap-1">
              <User className="h-3 w-3 text-muted-foreground" />
              {booking.customerName}
            </span>
            <a
              href={`mailto:${booking.customerEmail}`}
              className="inline-flex items-center gap-1 text-primary hover:underline"
            >
              <Mail className="h-3 w-3" />
              {booking.customerEmail}
            </a>
          </div>
        </div>
        <Link href={`/properties/${booking.propertyId}`}>
          <Button size="sm" variant="ghost">
            <ExternalLink className="h-3.5 w-3.5" />
          </Button>
        </Link>
      </div>
    </div>
  );
}

function AgentVisitRow({ booking }: { booking: VisitBooking }) {
  return (
    <div className="flex flex-wrap items-start justify-between gap-3 rounded-lg border p-3">
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <p className="truncate font-medium">{booking.propertyTitle}</p>
          <Badge className="bg-primary px-1.5 py-0 text-[10px] text-primary-foreground">
            {format(booking._visit, "MMM d, yyyy")}
          </Badge>
          {booking.visitTime ? (
            <Badge variant="outline" className="px-1.5 py-0 text-[10px]">
              <Clock className="mr-1 h-2.5 w-2.5" />{" "}
              {formatSlot(booking.visitTime)}
            </Badge>
          ) : null}
        </div>
        <div className="mt-0.5 flex items-center gap-1 text-xs text-muted-foreground">
          <MapPin className="h-3 w-3" />
          <span className="truncate">{booking.propertyAddress}</span>
        </div>
        <div className="mt-1 flex flex-wrap items-center gap-3 text-xs">
          <span className="inline-flex items-center gap-1 text-foreground">
            <User className="h-3 w-3 text-muted-foreground" />
            {booking.customerName}
          </span>
          <a
            href={`mailto:${booking.customerEmail}`}
            className="inline-flex items-center gap-1 text-primary hover:underline"
          >
            <Mail className="h-3 w-3" />
            {booking.customerEmail}
          </a>
        </div>
      </div>
      <Link href={`/properties/${booking.propertyId}`}>
        <Button size="sm" variant="ghost">
          <ExternalLink className="h-3.5 w-3.5" />
        </Button>
      </Link>
    </div>
  );
}
