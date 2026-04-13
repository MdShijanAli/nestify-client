"use client";

import Link from "next/link";
import { Heart } from "lucide-react";
import { useAppState } from "@/context/AppContext";
import { DashboardPageShell } from "@/components/dashboard/page-shell";
import { Button } from "@/components/ui/button";

export default function DashboardSavedPage() {
  const { favorites, properties } = useAppState();
  const savedProperties = properties.filter((p) => favorites.includes(p.id));

  return (
    <DashboardPageShell
      title="Saved Properties"
      subtitle="Your bookmarked listings"
    >
      {savedProperties.length === 0 ? (
        <div className="rounded-xl border bg-card p-8 text-center">
          <Heart className="mx-auto mb-3 h-8 w-8 text-muted-foreground" />
          <p className="text-sm text-muted-foreground">
            No saved properties yet
          </p>
          <Button asChild variant="outline" className="mt-4">
            <Link href="/properties">Browse Properties</Link>
          </Button>
        </div>
      ) : (
        <div className="space-y-3">
          {savedProperties.map((p) => (
            <div
              key={p.id}
              className="flex items-center justify-between rounded-xl border bg-card p-4"
            >
              <div>
                <p className="font-medium text-foreground">{p.title}</p>
                <p className="text-sm text-muted-foreground">
                  {p.city}, {p.state}
                </p>
              </div>
              <p className="font-semibold text-foreground">
                ${p.price.toLocaleString()}
              </p>
            </div>
          ))}
        </div>
      )}
    </DashboardPageShell>
  );
}
