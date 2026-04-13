"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  X,
  Bed,
  Bath,
  Maximize,
  MapPin,
  Calendar,
  ArrowLeft,
  CheckCircle2,
  Minus,
} from "lucide-react";
import type { ElementType, ReactNode } from "react";
import { useAppState } from "@/context/AppContext";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

type ComparedProperty = {
  id: string;
  title: string;
  image: string;
  city: string;
  state: string;
  price: number;
  status: string;
  type: string;
  bedrooms: number;
  bathrooms: number;
  area: number;
  amenities: string[];
  dateListed?: string;
  agentName?: string;
};

type RowConfig = {
  label: string;
  icon?: ElementType;
  render: (p: ComparedProperty) => ReactNode;
};

export default function ComparePropertiesPage() {
  const { properties, compareList, toggleCompare } = useAppState();

  const compared: ComparedProperty[] = properties
    .filter((p) => compareList.includes(p.id))
    .map((p) => {
      const maybe = p as {
        amenities?: string[];
        dateListed?: string;
        agentName?: string;
      };

      return {
        id: p.id,
        title: p.title,
        image: p.images[0] ?? "",
        city: p.city,
        state: p.state,
        price: p.price,
        status: p.status,
        type: p.type,
        bedrooms: p.bedrooms,
        bathrooms: p.bathrooms,
        area: p.area,
        amenities: Array.isArray(maybe.amenities) ? maybe.amenities : [],
        dateListed: maybe.dateListed,
        agentName: maybe.agentName,
      };
    });

  const formatPrice = (price: number, status: string) => {
    const formatted =
      price >= 1_000_000
        ? `$${(price / 1_000_000).toFixed(1)}M`
        : price >= 1000
          ? `$${(price / 1000).toFixed(0)}K`
          : `$${price.toLocaleString()}`;
    return status === "For Rent" ? `${formatted}/mo` : formatted;
  };

  const clearCompare = () => {
    compared.forEach((p) => toggleCompare(p.id));
  };

  if (compared.length === 0) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-20 text-center">
          <h1 className="font-heading text-3xl font-bold">
            Compare Properties
          </h1>
          <p className="mt-3 text-muted-foreground">
            No properties selected for comparison.
          </p>
          <Link href="/properties">
            <Button className="mt-6">Browse Properties</Button>
          </Link>
        </div>
      </div>
    );
  }

  const allAmenities = [
    ...new Set(compared.flatMap((p) => p.amenities)),
  ].sort();

  const rows: RowConfig[] = [
    {
      label: "Price",
      render: (p) => (
        <span className="text-xl font-bold text-secondary">
          {formatPrice(p.price, p.status)}
        </span>
      ),
    },
    {
      label: "Status",
      render: (p) => (
        <Badge
          variant={p.status === "For Sale" ? "default" : "secondary"}
          className={
            p.status === "For Sale" ? "bg-success text-success-foreground" : ""
          }
        >
          {p.status}
        </Badge>
      ),
    },
    { label: "Type", render: (p) => <Badge variant="outline">{p.type}</Badge> },
    {
      label: "Location",
      icon: MapPin,
      render: (p) => (
        <span>
          {p.city}, {p.state}
        </span>
      ),
    },
    {
      label: "Bedrooms",
      icon: Bed,
      render: (p) => <span className="font-semibold">{p.bedrooms}</span>,
    },
    {
      label: "Bathrooms",
      icon: Bath,
      render: (p) => <span className="font-semibold">{p.bathrooms}</span>,
    },
    {
      label: "Area",
      icon: Maximize,
      render: (p) => (
        <span className="font-semibold">{p.area.toLocaleString()} sqft</span>
      ),
    },
    {
      label: "Price/sqft",
      render: (p) => (
        <span className="font-semibold">
          ${p.area > 0 ? (p.price / p.area).toFixed(0) : "0"}
        </span>
      ),
    },
    {
      label: "Listed",
      icon: Calendar,
      render: (p) => (
        <span>
          {p.dateListed ? new Date(p.dateListed).toLocaleDateString() : "N/A"}
        </span>
      ),
    },
    {
      label: "Agent",
      render: (p) => <span>{p.agentName ?? "Nestify Agent"}</span>,
    },
  ];

  const lowestPrice = Math.min(...compared.map((p) => p.price));
  const mostBeds = Math.max(...compared.map((p) => p.bedrooms));
  const mostBaths = Math.max(...compared.map((p) => p.bathrooms));
  const largestArea = Math.max(...compared.map((p) => p.area));
  const lowestPriceSqft = Math.min(
    ...compared.map((p) =>
      p.area > 0 ? p.price / p.area : Number.POSITIVE_INFINITY,
    ),
  );

  const getHighlight = (label: string, p: ComparedProperty) => {
    if (compared.length < 2) return false;
    if (label === "Price" && p.price === lowestPrice) return true;
    if (label === "Bedrooms" && p.bedrooms === mostBeds) return true;
    if (label === "Bathrooms" && p.bathrooms === mostBaths) return true;
    if (label === "Area" && p.area === largestArea) return true;
    if (
      label === "Price/sqft" &&
      Math.abs(
        (p.area > 0 ? p.price / p.area : Number.POSITIVE_INFINITY) -
          lowestPriceSqft,
      ) < 1
    ) {
      return true;
    }
    return false;
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="border-b bg-card">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <Link
                href="/properties"
                className="mb-2 flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
              >
                <ArrowLeft className="h-4 w-4" /> Back to Properties
              </Link>
              <h1 className="font-heading text-3xl font-bold">
                Compare Properties
              </h1>
              <p className="mt-1 text-muted-foreground">
                Comparing {compared.length} properties side by side
              </p>
            </div>
            <Button variant="outline" onClick={clearCompare}>
              Clear All
            </Button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="overflow-x-auto">
          <motion.table
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full min-w-[700px] border-collapse"
          >
            <thead>
              <tr>
                <th className="sticky left-0 z-10 w-40 bg-background p-3 text-left text-sm font-medium text-muted-foreground">
                  Property
                </th>
                {compared.map((p) => (
                  <th key={p.id} className="min-w-[220px] p-3">
                    <div className="relative">
                      <button
                        onClick={() => toggleCompare(p.id)}
                        className="absolute -right-1 -top-1 z-10 rounded-full bg-destructive p-1 text-destructive-foreground shadow-md hover:bg-destructive/90"
                      >
                        <X className="h-3 w-3" />
                      </button>
                      <Link href={`/properties/${p.id}`} className="block">
                        <img
                          src={p.image}
                          alt={p.title}
                          className="aspect-video w-full rounded-xl object-cover shadow-card"
                        />
                        <h3 className="mt-3 line-clamp-1 font-heading text-base font-semibold text-foreground transition-colors hover:text-secondary">
                          {p.title}
                        </h3>
                      </Link>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>

            <tbody>
              {rows.map((row, i) => (
                <tr
                  key={row.label}
                  className={i % 2 === 0 ? "bg-muted/30" : ""}
                >
                  <td className="sticky left-0 z-10 bg-inherit p-3">
                    <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                      {row.icon ? <row.icon className="h-4 w-4" /> : null}
                      {row.label}
                    </div>
                  </td>
                  {compared.map((p) => (
                    <td
                      key={p.id}
                      className={`p-3 text-center text-sm ${getHighlight(row.label, p) ? "bg-success/10 font-semibold" : ""}`}
                    >
                      {row.render(p)}
                      {getHighlight(row.label, p) ? (
                        <CheckCircle2 className="ml-1 inline h-3.5 w-3.5 text-success" />
                      ) : null}
                    </td>
                  ))}
                </tr>
              ))}

              <tr>
                <td colSpan={compared.length + 1} className="px-3 pt-6 pb-2">
                  <h3 className="font-heading text-base font-semibold">
                    Amenities
                  </h3>
                </td>
              </tr>
              {allAmenities.map((amenity, i) => (
                <tr key={amenity} className={i % 2 === 0 ? "bg-muted/30" : ""}>
                  <td className="sticky left-0 z-10 bg-inherit p-3 text-sm text-muted-foreground">
                    {amenity}
                  </td>
                  {compared.map((p) => (
                    <td key={p.id} className="p-3 text-center">
                      {p.amenities.includes(amenity) ? (
                        <CheckCircle2 className="mx-auto h-5 w-5 text-success" />
                      ) : (
                        <Minus className="mx-auto h-5 w-5 text-muted-foreground/30" />
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </motion.table>
        </div>

        <div
          className="mt-8 grid gap-4"
          style={{
            gridTemplateColumns: `160px repeat(${compared.length}, minmax(220px, 1fr))`,
          }}
        >
          <div />
          {compared.map((p) => (
            <Link key={p.id} href={`/properties/${p.id}`} className="block">
              <Button className="w-full border-0 gradient-accent text-accent-foreground">
                View Details
              </Button>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
