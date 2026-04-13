"use client";

import Link from "next/link";
import { useAppState } from "@/context/AppContext";
import { PropertyCard } from "@/components/property/property-card";
import { Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { useHydrated } from "@/hooks/use-hydrated";

export default function SavedProperties() {
  const hydrated = useHydrated();
  const { favorites, properties } = useAppState();
  const savedProperties = hydrated
    ? properties.filter((p) => favorites.includes(p.id))
    : [];

  return (
    <div className="min-h-screen bg-background">
      <div className="border-b bg-card">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-destructive/10">
              <Heart className="h-5 w-5 text-destructive" />
            </div>
            <div>
              <h1 className="font-heading text-3xl font-bold">
                Saved Properties
              </h1>
              <p className="text-muted-foreground">
                {savedProperties.length}{" "}
                {savedProperties.length === 1 ? "property" : "properties"} saved
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {!hydrated ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="h-16 w-16 animate-pulse rounded-full bg-muted" />
          </div>
        ) : savedProperties.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center justify-center py-20 text-center"
          >
            <Heart className="h-16 w-16 text-muted-foreground/30" />
            <h2 className="mt-4 font-heading text-xl font-semibold">
              No saved properties yet
            </h2>
            <p className="mt-2 text-muted-foreground">
              Click the heart icon on any property to save it here.
            </p>
            <Link href="/properties">
              <Button className="mt-6">Browse Properties</Button>
            </Link>
          </motion.div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {savedProperties.map((property, i) => (
              <motion.div
                key={property.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
              >
                <PropertyCard property={property} />
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
