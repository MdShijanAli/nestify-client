"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { PropertyCard } from "@/components/property/property-card";
import { Button } from "@/components/ui/button";
import { useAppState } from "@/context/AppContext";

export default function SavedPage() {
  const { properties, favorites } = useAppState();
  const saved = properties.filter((p) => favorites.includes(p.id));

  return (
    <div className="container mx-auto flex flex-1 flex-col px-4 py-12">
      <div className="mb-8 text-center">
        <h1 className="font-heading text-3xl font-bold">Saved Properties</h1>
        <p className="mt-2 text-muted-foreground">
          Listings you have marked with the heart icon.
        </p>
      </div>

      {saved.length === 0 ? (
        <div className="flex flex-1 flex-col items-center justify-center gap-4 py-16 text-center">
          <p className="text-muted-foreground">You have no saved listings yet.</p>
          <Button asChild variant="outline">
            <Link href="/properties">Browse properties</Link>
          </Button>
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {saved.map((property, i) => (
            <motion.div
              key={property.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
            >
              <PropertyCard property={property} />
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
