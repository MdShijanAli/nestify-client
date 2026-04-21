"use client";

import { Heart, Search, MessageSquare, Home } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/context/AuthContext";
import { useAppState } from "@/context/AppContext";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { BookingsWidget } from "@/components/BookingsWidget";

export default function CustomerDashboard() {
  const { user } = useAuth();
  const { favorites, properties } = useAppState();

  const savedProperties = properties.filter((p) => favorites.includes(p.id));

  const stats = [
    {
      label: "Saved Properties",
      value: favorites.length,
      icon: Heart,
      color: "text-destructive",
    },
    { label: "Searches Made", value: 14, icon: Search, color: "text-primary" },
    {
      label: "Inquiries Sent",
      value: 3,
      icon: MessageSquare,
      color: "text-secondary",
    },
    {
      label: "Properties Viewed",
      value: 42,
      icon: Home,
      color: "text-accent",
    },
  ];

  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="font-heading text-2xl font-bold text-foreground">
          Welcome, {user?.name?.split(" ")[0]}!
        </h1>
        <p className="text-muted-foreground">Your property search overview</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((s) => (
          <Card key={s.label}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {s.label}
              </CardTitle>
              <s.icon className={`h-5 w-5 ${s.color}`} />
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-foreground">{s.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <BookingsWidget />

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Saved Properties</CardTitle>
          </CardHeader>
          <CardContent>
            {savedProperties.length === 0 ? (
              <div className="py-8 text-center">
                <Heart className="mx-auto mb-2 h-8 w-8 text-muted-foreground" />
                <p className="text-sm text-muted-foreground">
                  No saved properties yet
                </p>
                <Link href="/properties">
                  <Button variant="outline" size="sm" className="mt-3">
                    Browse Properties
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="space-y-3">
                {savedProperties.slice(0, 4).map((p) => (
                  <div
                    key={p.id}
                    className="flex items-center justify-between rounded-lg border border-border p-3"
                  >
                    <div>
                      <p className="text-sm font-medium text-foreground">
                        {p.title}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {p.city}, {p.state}
                      </p>
                    </div>
                    <p className="text-sm font-bold text-foreground">
                      ${p.price.toLocaleString()}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recommended For You</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {properties
                .filter((p) => p.featured)
                .slice(0, 4)
                .map((p) => (
                  <div
                    key={p.id}
                    className="flex items-center justify-between rounded-lg border border-border p-3"
                  >
                    <div>
                      <p className="text-sm font-medium text-foreground">
                        {p.title}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {p.city}, {p.state}
                      </p>
                    </div>
                    <p className="text-sm font-bold text-foreground">
                      ${p.price.toLocaleString()}
                    </p>
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
