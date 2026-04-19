"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  MessageSquare,
  Clock,
  CheckCircle2,
  MoreHorizontal,
  Mail,
} from "lucide-react";
import { useAppState } from "@/context/AppContext";
import { toast } from "sonner";

const agents = ["Sarah Mitchell", "James Rodriguez", "Emily Chen"];

export default function DashboardLeadsPage() {
  const { leads, updateLeadStatus, assignLeadAgent } = useAppState();

  const newCount = leads.filter((l) => l.status === "New").length;
  const contactedCount = leads.filter((l) => l.status === "Contacted").length;
  const closedCount = leads.filter((l) => l.status === "Closed").length;

  const stats = [
    {
      label: "New Leads",
      value: newCount,
      icon: MessageSquare,
      color: "text-info",
    },
    {
      label: "In Progress",
      value: contactedCount,
      icon: Clock,
      color: "text-warning",
    },
    {
      label: "Closed",
      value: closedCount,
      icon: CheckCircle2,
      color: "text-success",
    },
  ];

  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="font-heading text-2xl font-bold">Leads & Inquiries</h1>
        <p className="text-muted-foreground">{leads.length} total inquiries</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        {stats.map((s) => (
          <Card key={s.label}>
            <CardContent className="flex items-center gap-4 p-6">
              <div
                className={`flex h-12 w-12 items-center justify-center rounded-xl bg-muted ${s.color}`}
              >
                <s.icon className="h-6 w-6" />
              </div>
              <div>
                <p className="font-heading text-2xl font-bold">{s.value}</p>
                <p className="text-sm text-muted-foreground">{s.label}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="overflow-auto rounded-xl border bg-card shadow-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Contact</TableHead>
              <TableHead>Property</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Assigned Agent</TableHead>
              <TableHead>Date</TableHead>
              <TableHead className="w-12"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {leads.map((l) => (
              <TableRow key={l.id}>
                <TableCell>
                  <div className="text-sm font-medium">{l.name}</div>
                  <div className="text-xs text-muted-foreground">{l.email}</div>
                </TableCell>
                <TableCell className="text-sm">{l.property}</TableCell>
                <TableCell>
                  <Select
                    value={l.status}
                    onValueChange={(v) => {
                      updateLeadStatus(
                        l.id,
                        v as "New" | "Contacted" | "Closed",
                      );
                      toast.success(`Status updated to ${v}`);
                    }}
                  >
                    <SelectTrigger className="h-8 w-32">
                      <Badge
                        className={
                          l.status === "New"
                            ? "bg-info text-info-foreground"
                            : l.status === "Contacted"
                              ? "bg-warning text-warning-foreground"
                              : "bg-success text-success-foreground"
                        }
                      >
                        {l.status}
                      </Badge>
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="New">New</SelectItem>
                      <SelectItem value="Contacted">Contacted</SelectItem>
                      <SelectItem value="Closed">Closed</SelectItem>
                    </SelectContent>
                  </Select>
                </TableCell>
                <TableCell>
                  <Select
                    value={l.agent === "Unassigned" ? undefined : l.agent}
                    onValueChange={(v) => {
                      assignLeadAgent(l.id, v);
                      toast.success(`Assigned to ${v}`);
                    }}
                  >
                    <SelectTrigger className="h-8 w-44">
                      <SelectValue placeholder="Assign agent" />
                    </SelectTrigger>
                    <SelectContent>
                      {agents.map((a) => (
                        <SelectItem key={a} value={a}>
                          {a}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </TableCell>
                <TableCell className="text-sm text-muted-foreground">
                  {l.date}
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem
                        onClick={() =>
                          toast.success(`Email sent to ${l.email}`)
                        }
                      >
                        <Mail className="mr-2 h-4 w-4" />
                        Send Email
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
