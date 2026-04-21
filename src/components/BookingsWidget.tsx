"use client";

import type { ComponentType, ReactNode } from "react";
import { useMemo } from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DollarSign,
  Receipt,
  CalendarCheck,
  ArrowRight,
  MapPin,
} from "lucide-react";
import { useAppState } from "@/context/AppContext";
import { format } from "date-fns";

export function BookingsWidget() {
  const { bookings } = useAppState();

  const stats = useMemo(() => {
    const confirmed = bookings.filter((b) => b.status === "Confirmed");
    const totalSpent = confirmed.reduce((s, b) => s + b.amount, 0);
    // Real upcoming visits = scheduled visit dates >= today
    const today = Date.now() - 86400000;
    const upcoming = confirmed.filter(
      (b) => b.visitDate && new Date(b.visitDate).getTime() >= today,
    ).length;
    const recent = [...bookings]
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 4);
    return { totalSpent, upcoming, count: bookings.length, recent };
  }, [bookings]);

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center gap-2">
          <Receipt className="h-5 w-5 text-primary" /> Bookings Overview
        </CardTitle>
        <div className="flex items-center gap-1">
          <Link href="/dashboard/visits">
            <Button variant="ghost" size="sm" className="text-primary">
              <CalendarCheck className="mr-1 h-3.5 w-3.5" /> Visits
            </Button>
          </Link>
          <Link href="/dashboard/bookings">
            <Button variant="ghost" size="sm" className="text-primary">
              All <ArrowRight className="ml-1 h-3.5 w-3.5" />
            </Button>
          </Link>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-3 gap-3">
          <Mini
            icon={DollarSign}
            label="Total Spent"
            value={`$${stats.totalSpent.toLocaleString()}`}
            accent="text-secondary"
          />
          <Mini
            icon={CalendarCheck}
            label="Upcoming Visits"
            value={stats.upcoming}
            accent="text-success"
          />
          <Mini
            icon={Receipt}
            label="Total Bookings"
            value={stats.count}
            accent="text-primary"
          />
        </div>

        <div>
          <h4 className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Recent Transactions
          </h4>
          {stats.recent.length === 0 ? (
            <div className="rounded-lg border border-dashed p-6 text-center">
              <p className="text-sm text-muted-foreground">No bookings yet.</p>
              <Link href="/properties">
                <Button size="sm" variant="outline" className="mt-2">
                  Browse Properties
                </Button>
              </Link>
            </div>
          ) : (
            <div className="space-y-2">
              {stats.recent.map((b) => (
                <div
                  key={b.id}
                  className="flex items-center justify-between rounded-lg border p-3"
                >
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <p className="truncate text-sm font-medium">
                        {b.propertyTitle}
                      </p>
                      <Badge
                        variant={
                          b.status === "Confirmed" ? "default" : "destructive"
                        }
                        className={
                          b.status === "Confirmed"
                            ? "bg-success text-success-foreground text-[10px] px-1.5 py-0"
                            : "text-[10px] px-1.5 py-0"
                        }
                      >
                        {b.status}
                      </Badge>
                    </div>
                    <div className="mt-0.5 flex items-center gap-1 text-xs text-muted-foreground">
                      <MapPin className="h-3 w-3" />
                      <span className="truncate">{b.propertyAddress}</span>
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {format(new Date(b.date), "MMM d, yyyy")} • {b.txnId}
                    </div>
                  </div>
                  <div className="ml-3 text-right">
                    <div className="font-heading text-base font-bold text-secondary">
                      ${b.amount.toLocaleString()}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

function Mini({
  icon: Icon,
  label,
  value,
  accent,
}: {
  icon: ComponentType<{ className?: string }>;
  label: string;
  value: ReactNode;
  accent: string;
}) {
  return (
    <div className="rounded-lg border bg-card p-3">
      <Icon className={`h-4 w-4 ${accent}`} />
      <div className="mt-1 text-xs text-muted-foreground">{label}</div>
      <div className={`font-heading text-lg font-bold ${accent}`}>{value}</div>
    </div>
  );
}
