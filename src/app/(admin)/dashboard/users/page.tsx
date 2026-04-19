"use client";

import { useState } from "react";
import {
  Search,
  MoreHorizontal,
  Shield,
  Ban,
  KeyRound,
  Trash2,
  CheckCircle,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
import { useAppState } from "@/context/AppContext";
import { toast } from "sonner";

export default function DashboardUsersPage() {
  const { users, updateUserRole, updateUserStatus, deleteUser } = useAppState();
  const [search, setSearch] = useState("");
  const [deleteId, setDeleteId] = useState<number | null>(null);

  const filtered = users.filter(
    (u) =>
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase()),
  );

  const handleDelete = () => {
    if (deleteId === null) return;
    deleteUser(deleteId);
    toast.success("User deleted successfully!");
    setDeleteId(null);
  };

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-heading text-2xl font-bold">Users</h1>
          <p className="text-muted-foreground">{users.length} total users</p>
        </div>
      </div>

      <div className="relative max-w-sm">
        <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search users..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-10"
        />
      </div>

      <div className="overflow-auto rounded-xl border bg-card shadow-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Joined</TableHead>
              <TableHead className="w-12"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map((u) => (
              <TableRow key={u.id}>
                <TableCell className="font-medium">{u.name}</TableCell>
                <TableCell className="text-sm text-muted-foreground">
                  {u.email}
                </TableCell>
                <TableCell>
                  <Badge
                    variant={
                      u.role === "Agent"
                        ? "default"
                        : u.role === "Admin"
                          ? "destructive"
                          : "outline"
                    }
                  >
                    {u.role}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge
                    variant="outline"
                    className={
                      u.status === "Active"
                        ? "border-success text-success"
                        : u.status === "Pending"
                          ? "border-warning text-warning"
                          : "border-destructive text-destructive"
                    }
                  >
                    {u.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-sm text-muted-foreground">
                  {u.joined}
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuSub>
                        <DropdownMenuSubTrigger>
                          <Shield className="mr-2 h-4 w-4" />
                          Change Role
                        </DropdownMenuSubTrigger>
                        <DropdownMenuSubContent>
                          {(["User", "Agent", "Admin"] as const).map((role) => (
                            <DropdownMenuItem
                              key={role}
                              onClick={() => {
                                updateUserRole(u.id, role);
                                toast.success(`Role changed to ${role}`);
                              }}
                            >
                              {role} {u.role === role ? "✓" : ""}
                            </DropdownMenuItem>
                          ))}
                        </DropdownMenuSubContent>
                      </DropdownMenuSub>

                      {u.status === "Pending" ? (
                        <DropdownMenuItem
                          onClick={() => {
                            updateUserStatus(u.id, "Active");
                            toast.success("User approved!");
                          }}
                        >
                          <CheckCircle className="mr-2 h-4 w-4" />
                          Approve
                        </DropdownMenuItem>
                      ) : null}

                      {u.status === "Active" ? (
                        <DropdownMenuItem
                          onClick={() => {
                            updateUserStatus(u.id, "Suspended");
                            toast.success("User suspended");
                          }}
                        >
                          <Ban className="mr-2 h-4 w-4" />
                          Suspend
                        </DropdownMenuItem>
                      ) : null}

                      {u.status === "Suspended" ? (
                        <DropdownMenuItem
                          onClick={() => {
                            updateUserStatus(u.id, "Active");
                            toast.success("User reactivated!");
                          }}
                        >
                          <CheckCircle className="mr-2 h-4 w-4" />
                          Reactivate
                        </DropdownMenuItem>
                      ) : null}

                      <DropdownMenuItem
                        onClick={() =>
                          toast.success("Password reset link sent!")
                        }
                      >
                        <KeyRound className="mr-2 h-4 w-4" />
                        Reset Password
                      </DropdownMenuItem>

                      <DropdownMenuItem
                        className="text-destructive"
                        onClick={() => setDeleteId(u.id)}
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete User
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <AlertDialog
        open={deleteId !== null}
        onOpenChange={(open) => {
          if (!open) setDeleteId(null);
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete User</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
