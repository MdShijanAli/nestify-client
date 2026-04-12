"use client";

import Image from "next/image";
import Link from "next/link";
import {
  Bath,
  Bed,
  GitCompareArrows,
  Heart,
  MapPin,
  Maximize,
} from "lucide-react";
import { toast } from "sonner";
import type { Property } from "@/data/properties";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useAppState } from "@/context/AppContext";

interface PropertyCardProps {
  property: Property;
}

export function PropertyCard({ property }: PropertyCardProps) {
  const { isFavorite, toggleFavorite, isInCompare, toggleCompare, compareList } =
    useAppState();
  const liked = isFavorite(property.id);
  const comparing = isInCompare(property.id);

  const formatPrice = (price: number, status: string) => {
    const formatted =
      price >= 1_000_000
        ? `$${(price / 1_000_000).toFixed(1)}M`
        : price >= 1000
          ? `$${(price / 1000).toFixed(0)}K`
          : `$${price.toLocaleString()}`;
    return status === "For Rent" ? `${formatted}/mo` : formatted;
  };

  return (
    <Link href={`/property/${property.id}`} className="group block">
      <div className="overflow-hidden rounded-xl border bg-card shadow-card transition-all duration-300 hover:-translate-y-1 hover:shadow-card-hover">
        <div className="relative aspect-[4/3] overflow-hidden">
          <Image
            src={property.images[0]}
            alt={property.title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-110"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-foreground/40 to-transparent" />

          <div className="absolute top-3 left-3 flex gap-2">
            <Badge
              variant={
                property.status === "For Sale"
                  ? "default"
                  : property.status === "For Rent"
                    ? "secondary"
                    : "outline"
              }
              className={
                property.status === "For Sale"
                  ? "border-0 bg-success text-success-foreground"
                  : ""
              }
            >
              {property.status}
            </Badge>
            {property.featured ? (
              <Badge className="gradient-accent border-0 text-accent-foreground">
                Featured
              </Badge>
            ) : null}
          </div>

          <div className="absolute top-3 right-3 flex flex-col gap-1.5">
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="h-8 w-8 rounded-full bg-card/80 backdrop-blur-sm hover:bg-card"
              onClick={(e) => {
                e.preventDefault();
                toggleFavorite(property.id);
              }}
            >
              <Heart
                className={`h-4 w-4 ${liked ? "fill-destructive text-destructive" : "text-muted-foreground"}`}
              />
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className={`h-8 w-8 rounded-full backdrop-blur-sm ${comparing ? "bg-secondary text-secondary-foreground" : "bg-card/80 text-muted-foreground hover:bg-card"}`}
              onClick={(e) => {
                e.preventDefault();
                if (!comparing && compareList.length >= 4) {
                  toast.error("You can compare up to 4 properties at a time");
                  return;
                }
                toggleCompare(property.id);
                toast.success(
                  comparing ? "Removed from comparison" : "Added to comparison"
                );
              }}
            >
              <GitCompareArrows className="h-4 w-4" />
            </Button>
          </div>

          <div className="absolute bottom-3 left-3">
            <span className="font-heading text-2xl font-bold text-primary-foreground drop-shadow-lg">
              {formatPrice(property.price, property.status)}
            </span>
          </div>
        </div>

        <div className="p-4">
          <h3 className="font-heading line-clamp-1 text-lg font-semibold text-card-foreground">
            {property.title}
          </h3>

          <div className="mt-1 flex items-center gap-1 text-sm text-muted-foreground">
            <MapPin className="h-3.5 w-3.5 shrink-0" />
            <span className="line-clamp-1">
              {property.city}, {property.state} {property.zipCode}
            </span>
          </div>

          <div className="mt-3 flex items-center gap-4 border-t border-border pt-3">
            {property.bedrooms > 0 ? (
              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                <Bed className="h-4 w-4" />
                <span>{property.bedrooms} Beds</span>
              </div>
            ) : null}
            {property.bathrooms > 0 ? (
              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                <Bath className="h-4 w-4" />
                <span>{property.bathrooms} Baths</span>
              </div>
            ) : null}
            <div className="flex items-center gap-1 text-sm text-muted-foreground">
              <Maximize className="h-4 w-4" />
              <span>{property.area.toLocaleString()} sqft</span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
