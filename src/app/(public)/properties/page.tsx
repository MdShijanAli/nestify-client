"use client";

import { useState, useMemo, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  SlidersHorizontal,
  Grid3X3,
  List,
  X,
  MapIcon,
  ArrowUpDown,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { PropertyCard } from "@/components/property/property-card";
import { propertyTypes } from "@/data/properties";
import { useAppState } from "@/context/AppContext";
import { SearchAutocomplete } from "@/components/search-autocomplete";
import { PropertyMap } from "@/components/property-map";

const statusOptions = ["For Sale", "For Rent", "Sold"];

export default function PropertiesPage() {
  const { properties } = useAppState();
  const searchParams = useSearchParams();
  const [search, setSearch] = useState(searchParams.get("city") || "");
  const [type, setType] = useState(searchParams.get("type") || "all");
  const [status, setStatus] = useState("all");
  const [priceRange, setPriceRange] = useState([0, 3000000]);
  const [beds, setBeds] = useState("any");
  const [showFilters, setShowFilters] = useState(false);
  const [view, setView] = useState<"grid" | "list" | "map">("grid");
  const [sort, setSort] = useState("featured");
  const [page, setPage] = useState(1);
  const perPage = 9;

  const filtered = useMemo(() => {
    const result = properties.filter((p) => {
      const matchSearch =
        !search ||
        p.city.toLowerCase().includes(search.toLowerCase()) ||
        p.zipCode.includes(search) ||
        p.title.toLowerCase().includes(search.toLowerCase());
      const matchType = type === "all" || p.type === type;
      const matchStatus = status === "all" || p.status === status;
      const matchPrice = p.price >= priceRange[0] && p.price <= priceRange[1];
      const matchBeds = beds === "any" || p.bedrooms >= parseInt(beds);
      return matchSearch && matchType && matchStatus && matchPrice && matchBeds;
    });

    switch (sort) {
      case "price-asc":
        return [...result].sort((a, b) => a.price - b.price);
      case "price-desc":
        return [...result].sort((a, b) => b.price - a.price);
      case "newest":
        return [...result].sort(
          (a, b) =>
            new Date(b.dateListed || "").getTime() -
            new Date(a.dateListed || "").getTime()
        );
      case "beds":
        return [...result].sort((a, b) => b.bedrooms - a.bedrooms);
      case "area":
        return [...result].sort((a, b) => b.area - a.area);
      case "featured":
        return [...result].sort(
          (a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0)
        );
      default:
        return result;
    }
  }, [search, type, status, priceRange, beds, properties, sort]);

  const activeFilters = [
    type !== "all" && type,
    status !== "all" && status,
    beds !== "any" && `${beds}+ beds`,
  ].filter(Boolean);

  const totalPages = Math.max(1, Math.ceil(filtered.length / perPage));
  const paginatedProperties = filtered.slice(
    (page - 1) * perPage,
    page * perPage
  );

  useEffect(() => {
    setPage(1);
  }, [search, type, status, priceRange, beds, sort]);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="border-b bg-card">
        <div className="container mx-auto px-4 py-8">
          <h1 className="font-heading text-3xl font-bold">Properties</h1>
          <p className="mt-1 text-muted-foreground">
            {filtered.length} {filtered.length === 1 ? "property" : "properties"}{" "}
            found
          </p>
          <div className="mt-6 flex flex-col gap-3 md:flex-row md:items-end">
            <div className="flex-1">
              <SearchAutocomplete value={search} onChange={setSearch} />
            </div>
            <Button
              variant="outline"
              onClick={() => setShowFilters(!showFilters)}
              className={showFilters ? "bg-primary text-primary-foreground" : ""}
            >
              <SlidersHorizontal className="mr-2 h-4 w-4" />
              Filters
            </Button>
            <Select value={sort} onValueChange={setSort}>
              <SelectTrigger className="w-[170px]">
                <ArrowUpDown className="mr-2 h-4 w-4" />
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="featured">Featured</SelectItem>
                <SelectItem value="price-asc">Price: Low → High</SelectItem>
                <SelectItem value="price-desc">Price: High → Low</SelectItem>
                <SelectItem value="newest">Newest Listed</SelectItem>
                <SelectItem value="beds">Most Bedrooms</SelectItem>
                <SelectItem value="area">Largest Area</SelectItem>
              </SelectContent>
            </Select>
            <div className="hidden gap-1 md:flex">
              <Button
                variant={view === "grid" ? "default" : "outline"}
                size="icon"
                onClick={() => setView("grid")}
              >
                <Grid3X3 className="h-4 w-4" />
              </Button>
              <Button
                variant={view === "list" ? "default" : "outline"}
                size="icon"
                onClick={() => setView("list")}
              >
                <List className="h-4 w-4" />
              </Button>
              <Button
                variant={view === "map" ? "default" : "outline"}
                size="icon"
                onClick={() => setView("map")}
              >
                <MapIcon className="h-4 w-4" />
              </Button>
            </div>
          </div>
          {activeFilters.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-2">
              {activeFilters.map((f) => (
                <Badge key={f as string} variant="secondary" className="gap-1">
                  {f as string}
                  <X
                    className="h-3 w-3 cursor-pointer"
                    onClick={() => {
                      if (f === type) setType("all");
                      if (f === status) setStatus("all");
                      if ((f as string).includes("beds")) setBeds("any");
                    }}
                  />
                </Badge>
              ))}
              <button
                className="text-sm text-muted-foreground hover:text-foreground"
                onClick={() => {
                  setType("all");
                  setStatus("all");
                  setBeds("any");
                  setPriceRange([0, 3000000]);
                }}
              >
                Clear all
              </button>
            </div>
          )}
        </div>
      </div>

      <AnimatePresence>
        {showFilters && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden border-b bg-card"
          >
            <div className="container mx-auto grid gap-6 px-4 py-6 sm:grid-cols-2 lg:grid-cols-4">
              <div>
                <label className="mb-2 block text-sm font-medium">
                  Property Type
                </label>
                <Select value={type} onValueChange={setType}>
                  <SelectTrigger>
                    <SelectValue placeholder="All Types" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    {propertyTypes.map((t) => (
                      <SelectItem key={t} value={t}>
                        {t}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium">Status</label>
                <Select value={status} onValueChange={setStatus}>
                  <SelectTrigger>
                    <SelectValue placeholder="All" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All</SelectItem>
                    {statusOptions.map((s) => (
                      <SelectItem key={s} value={s}>
                        {s}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium">
                  Min Bedrooms
                </label>
                <Select value={beds} onValueChange={setBeds}>
                  <SelectTrigger>
                    <SelectValue placeholder="Any" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="any">Any</SelectItem>
                    {[1, 2, 3, 4, 5].map((b) => (
                      <SelectItem key={b} value={b.toString()}>
                        {b}+
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium">
                  Price: ${priceRange[0].toLocaleString()} —{" "}
                  ${priceRange[1].toLocaleString()}
                </label>
                <Slider
                  min={0}
                  max={3000000}
                  step={50000}
                  value={priceRange}
                  onValueChange={setPriceRange}
                  className="mt-4"
                />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="container mx-auto px-4 py-8">
        {filtered.length === 0 ? (
          <div className="py-20 text-center">
            <p className="text-lg text-muted-foreground">
              No properties found matching your criteria.
            </p>
            <Button
              variant="outline"
              className="mt-4"
              onClick={() => {
                setSearch("");
                setType("all");
                setStatus("all");
                setBeds("any");
                setPriceRange([0, 3000000]);
              }}
            >
              Reset Filters
            </Button>
          </div>
        ) : view === "map" ? (
          <PropertyMap properties={filtered} className="h-[600px]" />
        ) : (
          <>
            <div
              className={`grid gap-6 ${
                view === "grid"
                  ? "sm:grid-cols-2 lg:grid-cols-3"
                  : "grid-cols-1"
              }`}
            >
              {paginatedProperties.map((property, i) => (
                <motion.div
                  key={property.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.03 }}
                >
                  <PropertyCard property={property} />
                </motion.div>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
                <Button
                  variant="outline"
                  size="icon"
                  disabled={page === 1}
                  onClick={() => {
                    setPage(page - 1);
                    scrollToTop();
                  }}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>

                {Array.from({ length: totalPages }, (_, i) => i + 1)
                  .filter(
                    (p) => p === 1 || p === totalPages || Math.abs(p - page) <= 1
                  )
                  .reduce<(number | "ellipsis")[]>((acc, p, i, arr) => {
                    if (i > 0 && p - (arr[i - 1] as number) > 1)
                      acc.push("ellipsis");
                    acc.push(p);
                    return acc;
                  }, [])
                  .map((item, i) =>
                    item === "ellipsis" ? (
                      <span
                        key={`e-${i}`}
                        className="px-1 text-muted-foreground"
                      >
                        …
                      </span>
                    ) : (
                      <Button
                        key={item}
                        variant={page === item ? "default" : "outline"}
                        size="icon"
                        onClick={() => {
                          setPage(item as number);
                          scrollToTop();
                        }}
                      >
                        {item}
                      </Button>
                    )
                  )}

                <Button
                  variant="outline"
                  size="icon"
                  disabled={page === totalPages}
                  onClick={() => {
                    setPage(page + 1);
                    scrollToTop();
                  }}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>

                <span className="ml-3 text-sm text-muted-foreground">
                  {(page - 1) * perPage + 1}–
                  {Math.min(page * perPage, filtered.length)} of {filtered.length}
                </span>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
