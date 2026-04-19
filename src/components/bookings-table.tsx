"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import {
  CalendarIcon,
  Download,
  Filter,
  X,
  Receipt,
  DollarSign,
  CalendarCheck,
} from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { useAppState, type Booking } from "@/context/AppContext";
import { downloadReceipt } from "@/lib/receipt";

interface BookingsTableProps {
  agentFilter?: string;
  title: string;
  description?: string;
}

type EnrichedBooking = Booking & { agentName: string };

export function BookingsTable({
  agentFilter,
  title,
  description,
}: BookingsTableProps) {
  const { bookings, properties } = useAppState();

  const agents = useMemo(
    () =>
      Array.from(
        new Set(
          properties
            .map((p) => p.agentName)
            .filter((name): name is string => Boolean(name)),
        ),
      ).sort(),
    [properties],
  );

  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<string>("all");
  const [agent, setAgent] = useState<string>("all");
  const [from, setFrom] = useState<Date | undefined>();
  const [to, setTo] = useState<Date | undefined>();

  const enriched = useMemo<EnrichedBooking[]>(
    () =>
      bookings.map((b) => {
        const prop = properties.find((p) => p.id === b.propertyId);
        return { ...b, agentName: prop?.agentName ?? "-" };
      }),
    [bookings, properties],
  );

  const filtered = useMemo(() => {
    return enriched.filter((b) => {
      if (agentFilter && b.agentName !== agentFilter) return false;
      if (status !== "all" && b.status !== status) return false;
      if (agent !== "all" && b.agentName !== agent) return false;

      if (from) {
        const fromStart = new Date(from);
        fromStart.setHours(0, 0, 0, 0);
        if (new Date(b.date) < fromStart) return false;
      }

      if (to) {
        const toEnd = new Date(to);
        toEnd.setHours(23, 59, 59, 999);
        if (new Date(b.date) > toEnd) return false;
      }

      if (search) {
        const q = search.toLowerCase();
        if (
          !b.txnId.toLowerCase().includes(q) &&
          !b.customerName.toLowerCase().includes(q) &&
          !b.customerEmail.toLowerCase().includes(q) &&
          !b.propertyTitle.toLowerCase().includes(q) &&
          !b.id.toLowerCase().includes(q)
        ) {
          return false;
        }
      }

      return true;
    });
  }, [enriched, agentFilter, status, agent, from, to, search]);

  const totals = useMemo(() => {
    const confirmed = filtered.filter((b) => b.status === "Confirmed");
    return {
      count: filtered.length,
      revenue: confirmed.reduce((sum, b) => sum + b.amount, 0),
      confirmed: confirmed.length,
    };
  }, [filtered]);

  const reset = () => {
    setSearch("");
    setStatus("all");
    setAgent("all");
    setFrom(undefined);
    setTo(undefined);
  };

  const hasFilters =
    search || status !== "all" || agent !== "all" || from || to;

  return (
    <div className="container mx-auto space-y-6 p-6">
      <div>
        <h1 className="font-heading text-3xl font-bold">{title}</h1>
        {description ? (
          <p className="mt-1 text-sm text-muted-foreground">{description}</p>
        ) : null}
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard icon={Receipt} label="Bookings" value={totals.count} />
        <StatCard
          icon={CalendarCheck}
          label="Confirmed"
          value={totals.confirmed}
          accent="text-success"
        />
        <StatCard
          icon={DollarSign}
          label="Revenue"
          value={`$${totals.revenue.toLocaleString()}`}
          accent="text-secondary"
        />
      </div>

      <Card className="p-4">
        <div className="flex flex-wrap items-end gap-3">
          <div className="min-w-[200px] flex-1">
            <label className="text-xs font-medium text-muted-foreground">
              Search
            </label>
            <Input
              placeholder="Txn ID, name, email, property..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div>
            <label className="text-xs font-medium text-muted-foreground">
              Status
            </label>
            <Select value={status} onValueChange={setStatus}>
              <SelectTrigger className="w-[150px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="Confirmed">Confirmed</SelectItem>
                <SelectItem value="Cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {!agentFilter ? (
            <div>
              <label className="text-xs font-medium text-muted-foreground">
                Agent
              </label>
              <Select value={agent} onValueChange={setAgent}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Agents</SelectItem>
                  {agents.map((a) => (
                    <SelectItem key={a} value={a}>
                      {a}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          ) : null}

          <DatePopover label="From" value={from} onChange={setFrom} />
          <DatePopover label="To" value={to} onChange={setTo} />

          {hasFilters ? (
            <Button variant="ghost" size="sm" onClick={reset}>
              <X className="mr-1 h-4 w-4" /> Clear
            </Button>
          ) : null}
        </div>
      </Card>

      <Card>
        {filtered.length === 0 ? (
          <div className="p-12 text-center">
            <Filter className="mx-auto h-10 w-10 text-muted-foreground" />
            <p className="mt-3 text-sm text-muted-foreground">
              No bookings match your filters.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Txn / Booking</TableHead>
                  <TableHead>Property</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Agent</TableHead>
                  <TableHead>Booked</TableHead>
                  <TableHead>Visit Date</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((b) => (
                  <TableRow key={b.id}>
                    <TableCell>
                      <div className="font-mono text-xs">{b.txnId}</div>
                      <div className="text-xs text-muted-foreground">
                        {b.id}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Link
                        href={`/properties/${b.propertyId}`}
                        className="font-medium hover:text-primary"
                      >
                        {b.propertyTitle}
                      </Link>
                      <div className="text-xs text-muted-foreground">
                        {b.propertyId}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="font-medium">{b.customerName}</div>
                      <div className="text-xs text-muted-foreground">
                        {b.customerEmail}
                      </div>
                    </TableCell>
                    <TableCell className="text-sm">{b.agentName}</TableCell>
                    <TableCell className="whitespace-nowrap text-sm">
                      {format(new Date(b.date), "MMM d, yyyy")}
                    </TableCell>
                    <TableCell className="whitespace-nowrap text-sm">
                      {b.visitDate ? (
                        <span className="inline-flex items-center gap-1 rounded-md bg-primary/10 px-2 py-0.5 font-medium text-primary">
                          <CalendarIcon className="h-3 w-3" />
                          {format(new Date(b.visitDate), "MMM d, yyyy")}
                          {b.visitTime ? ` · ${b.visitTime}` : ""}
                        </span>
                      ) : (
                        <span className="text-muted-foreground">-</span>
                      )}
                    </TableCell>
                    <TableCell className="text-right font-semibold">
                      ${b.amount.toLocaleString()}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          b.status === "Confirmed" ? "default" : "destructive"
                        }
                        className={
                          b.status === "Confirmed"
                            ? "bg-success text-success-foreground"
                            : ""
                        }
                      >
                        {b.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => downloadReceipt(b)}
                      >
                        <Download className="h-3.5 w-3.5" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </Card>
    </div>
  );
}

function StatCard({
  icon: Icon,
  label,
  value,
  accent = "text-foreground",
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: React.ReactNode;
  accent?: string;
}) {
  return (
    <Card className="p-4">
      <div className="flex items-center justify-between">
        <div>
          <div className="text-xs text-muted-foreground">{label}</div>
          <div className={cn("mt-1 font-heading text-2xl font-bold", accent)}>
            {value}
          </div>
        </div>
        <Icon className={cn("h-8 w-8 opacity-30", accent)} />
      </div>
    </Card>
  );
}

function DatePopover({
  label,
  value,
  onChange,
}: {
  label: string;
  value?: Date;
  onChange: (d?: Date) => void;
}) {
  return (
    <div>
      <label className="block text-xs font-medium text-muted-foreground">
        {label}
      </label>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className={cn(
              "w-[150px] justify-start text-left font-normal",
              !value && "text-muted-foreground",
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {value ? format(value, "MMM d, yyyy") : <span>Pick</span>}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="single"
            selected={value}
            onSelect={onChange}
            initialFocus
            className={cn("pointer-events-auto p-3")}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}
