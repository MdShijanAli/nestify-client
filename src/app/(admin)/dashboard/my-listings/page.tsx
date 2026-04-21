"use client";

import { useAppState } from "@/context/AppContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function AgentListingsPage() {
  const { properties } = useAppState();

  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="font-heading text-2xl font-bold text-foreground">
          My Listings
        </h1>
        <p className="text-muted-foreground">
          A quick overview of your current property portfolio.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {properties.slice(0, 6).map((property) => (
          <Card key={property.id}>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">{property.title}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <p className="text-sm text-muted-foreground">
                {property.city}, {property.state}
              </p>
              <div className="flex items-center justify-between gap-3">
                <p className="font-bold text-foreground">
                  ${property.price.toLocaleString()}
                </p>
                <Badge
                  variant={
                    property.status === "For Sale" ? "default" : "secondary"
                  }
                >
                  {property.status}
                </Badge>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
