"use client";

import Link from "next/link";
import { useState } from "react";
import {
  Search,
  Plus,
  MoreHorizontal,
  Edit,
  Trash2,
  Eye,
  Star,
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
import { PropertyFormDialog } from "@/components/property-form-dialog";
import { useAppState } from "@/context/AppContext";
import type { Property } from "@/data/properties";
import { toast } from "sonner";

export default function DashboardPropertiesPage() {
  const {
    properties,
    addProperty,
    updateProperty,
    deleteProperty,
    toggleFeatured,
  } = useAppState();
  const [search, setSearch] = useState("");
  const [formOpen, setFormOpen] = useState(false);
  const [editProperty, setEditProperty] = useState<Property | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const filtered = properties.filter(
    (p) =>
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.city.toLowerCase().includes(search.toLowerCase()),
  );

  const handleAdd = () => {
    setEditProperty(null);
    setFormOpen(true);
  };

  const handleEdit = (property: Property) => {
    setEditProperty(property);
    setFormOpen(true);
  };

  const handleSubmit = (data: Omit<Property, "id" | "dateListed">) => {
    if (editProperty) {
      updateProperty(editProperty.id, data);
      toast.success("Property updated successfully!");
      return;
    }

    addProperty(data);
    toast.success("Property added successfully!");
  };

  const handleDelete = () => {
    if (!deleteId) return;
    deleteProperty(deleteId);
    toast.success("Property deleted successfully!");
    setDeleteId(null);
  };

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-heading text-2xl font-bold">Properties</h1>
          <p className="text-muted-foreground">
            {properties.length} total properties
          </p>
        </div>
        <Button
          className="gradient-accent border-0 text-accent-foreground"
          onClick={handleAdd}
        >
          <Plus className="mr-2 h-4 w-4" />
          Add Property
        </Button>
      </div>

      <div className="relative max-w-sm">
        <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search properties..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-10"
        />
      </div>

      <div className="overflow-auto rounded-xl border bg-card shadow-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Property</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Location</TableHead>
              <TableHead>Agent</TableHead>
              <TableHead className="w-12"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map((p) => (
              <TableRow key={p.id}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <img
                      src={p.images[0]}
                      alt={p.title}
                      className="h-10 w-14 rounded-md object-cover"
                    />
                    <div>
                      <div className="flex items-center gap-1.5 text-sm font-medium">
                        {p.title}
                        {p.featured ? (
                          <Star className="h-3.5 w-3.5 fill-secondary text-secondary" />
                        ) : null}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {p.id}
                      </div>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant="outline">{p.type}</Badge>
                </TableCell>
                <TableCell>
                  <Badge
                    variant={
                      p.status === "For Sale"
                        ? "default"
                        : p.status === "Sold"
                          ? "outline"
                          : "secondary"
                    }
                    className={
                      p.status === "For Sale"
                        ? "bg-success text-success-foreground"
                        : ""
                    }
                  >
                    {p.status}
                  </Badge>
                </TableCell>
                <TableCell className="font-medium">
                  ${p.price.toLocaleString()}
                </TableCell>
                <TableCell className="text-sm text-muted-foreground">
                  {p.city}, {p.state}
                </TableCell>
                <TableCell className="text-sm">{p.agentName ?? "-"}</TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem asChild>
                        <Link href={`/properties/${p.id}`}>
                          <Eye className="mr-2 h-4 w-4" />
                          View
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleEdit(p)}>
                        <Edit className="mr-2 h-4 w-4" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => toggleFeatured(p.id)}>
                        <Star className="mr-2 h-4 w-4" />
                        {p.featured ? "Remove Featured" : "Mark Featured"}
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className="text-destructive"
                        onClick={() => setDeleteId(p.id)}
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <PropertyFormDialog
        open={formOpen}
        onOpenChange={setFormOpen}
        property={editProperty}
        onSubmit={handleSubmit}
      />

      <AlertDialog
        open={!!deleteId}
        onOpenChange={(open) => {
          if (!open) setDeleteId(null);
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Property</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              property listing.
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
