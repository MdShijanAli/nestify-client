"use client";

import Link from "next/link";
import { useAppState } from "@/context/AppContext";
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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal, CheckCircle, Ban, Building2, Eye } from "lucide-react";
import { toast } from "sonner";

export default function DashboardAgentsPage() {
  const { users, properties, updateUserStatus } = useAppState();
  const agents = users.filter((u) => u.role === "Agent");

  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="font-heading text-2xl font-bold">Agent Management</h1>
        <p className="text-muted-foreground">
          {agents.length} registered agents
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <Card>
          <CardContent className="p-6 text-center">
            <p className="font-heading text-3xl font-bold">
              {agents.filter((a) => a.status === "Active").length}
            </p>
            <p className="text-sm text-muted-foreground">Active Agents</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 text-center">
            <p className="font-heading text-3xl font-bold">
              {agents.filter((a) => a.status === "Pending").length}
            </p>
            <p className="text-sm text-muted-foreground">Pending Approval</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 text-center">
            <p className="font-heading text-3xl font-bold">
              {properties.length}
            </p>
            <p className="text-sm text-muted-foreground">Total Listings</p>
          </CardContent>
        </Card>
      </div>

      <div className="overflow-auto rounded-xl border bg-card shadow-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Agent</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Listings</TableHead>
              <TableHead>Joined</TableHead>
              <TableHead className="w-12"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {agents.map((agent) => {
              const agentListings = properties.filter(
                (p) => p.agentName === agent.name,
              ).length;

              return (
                <TableRow key={agent.id}>
                  <TableCell className="font-medium">{agent.name}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {agent.email}
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className={
                        agent.status === "Active"
                          ? "border-success text-success"
                          : agent.status === "Pending"
                            ? "border-warning text-warning"
                            : "border-destructive text-destructive"
                      }
                    >
                      {agent.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1 text-sm">
                      <Building2 className="h-3.5 w-3.5 text-muted-foreground" />
                      {agentListings}
                    </div>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {agent.joined}
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem asChild>
                          <Link href="/dashboard/properties">
                            <Eye className="mr-2 h-4 w-4" />
                            View Listings
                          </Link>
                        </DropdownMenuItem>

                        {agent.status === "Pending" ? (
                          <DropdownMenuItem
                            onClick={() => {
                              updateUserStatus(agent.id, "Active");
                              toast.success("Agent approved!");
                            }}
                          >
                            <CheckCircle className="mr-2 h-4 w-4" />
                            Approve
                          </DropdownMenuItem>
                        ) : null}

                        {agent.status === "Active" ? (
                          <DropdownMenuItem
                            onClick={() => {
                              updateUserStatus(agent.id, "Suspended");
                              toast.success("Agent suspended");
                            }}
                          >
                            <Ban className="mr-2 h-4 w-4" />
                            Suspend
                          </DropdownMenuItem>
                        ) : null}

                        {agent.status === "Suspended" ? (
                          <DropdownMenuItem
                            onClick={() => {
                              updateUserStatus(agent.id, "Active");
                              toast.success("Agent reactivated!");
                            }}
                          >
                            <CheckCircle className="mr-2 h-4 w-4" />
                            Reactivate
                          </DropdownMenuItem>
                        ) : null}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
