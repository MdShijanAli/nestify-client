"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  Building2,
  Home as HomeIcon,
  Landmark,
  Search,
  Shield,
  TreePine,
  TrendingUp,
  Users,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PropertyCard } from "@/components/property/property-card";
import { propertyTypes } from "@/data/properties";
import { useAppState } from "@/context/AppContext";

const stats = [
  { icon: Building2, value: "2,500+", label: "Properties Listed" },
  { icon: Users, value: "1,200+", label: "Happy Clients" },
  { icon: TrendingUp, value: "$850M", label: "Property Sold" },
  { icon: Shield, value: "15+", label: "Years Experience" },
];

const typeIcons: Record<string, typeof Building2> = {
  Apartment: Building2,
  House: HomeIcon,
  Commercial: Landmark,
  Land: TreePine,
};

export function HomePage() {
  const router = useRouter();
  const { properties } = useAppState();
  const [searchCity, setSearchCity] = useState("");
  const [searchType, setSearchType] = useState("");
  const featured = properties.filter((p) => p.featured);

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (searchCity) params.set("city", searchCity);
    if (searchType) params.set("type", searchType);
    const q = params.toString();
    router.push(q ? `/properties?${q}` : "/properties");
  };

  return (
    <div>
      <section className="relative flex min-h-[85vh] items-center justify-center overflow-hidden">
        <Image
          src="/hero-bg.jpg"
          alt="Luxury home"
          fill
          priority
          className="object-cover"
          sizes="100vw"
        />
        <div className="gradient-hero absolute inset-0" />
        <div className="relative z-10 container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="font-heading text-4xl font-bold text-primary-foreground md:text-6xl lg:text-7xl">
              Find Your Dream
              <span className="text-secondary block">Property</span>
            </h1>
            <p className="mx-auto mt-4 max-w-2xl text-lg text-primary-foreground/80">
              Discover thousands of properties across the United States.
              Whether you&apos;re buying, selling, or renting — we&apos;ve got
              you covered.
            </p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="mx-auto mt-10 max-w-3xl"
          >
            <div className="flex flex-col gap-3 rounded-2xl border border-border/50 bg-card/95 p-4 shadow-elevated backdrop-blur-sm sm:flex-row sm:items-center">
              <Input
                placeholder="Enter city or zip code..."
                value={searchCity}
                onChange={(e) => setSearchCity(e.target.value)}
                className="flex-1 border-0 bg-muted text-foreground"
              />
              <Select
                value={searchType || undefined}
                onValueChange={setSearchType}
              >
                <SelectTrigger className="w-full border-0 bg-muted sm:w-44">
                  <SelectValue placeholder="Property Type" />
                </SelectTrigger>
                <SelectContent>
                  {propertyTypes.map((t) => (
                    <SelectItem key={t} value={t}>
                      {t}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button
                size="lg"
                className="gradient-accent border-0 text-accent-foreground shadow-accent-glow"
                onClick={handleSearch}
              >
                <Search className="mr-2 h-4 w-4" />
                Search
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="border-b border-border bg-card">
        <div className="container mx-auto grid grid-cols-2 gap-6 px-4 py-12 md:grid-cols-4">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="text-center"
            >
              <stat.icon className="text-secondary mx-auto mb-2 h-8 w-8" />
              <div className="font-heading text-3xl font-bold text-foreground">
                {stat.value}
              </div>
              <div className="text-sm text-muted-foreground">{stat.label}</div>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="container mx-auto px-4 py-16">
        <div className="text-center">
          <h2 className="font-heading text-3xl font-bold">
            Browse by Property Type
          </h2>
          <p className="mt-2 text-muted-foreground">
            Explore our wide range of property categories
          </p>
        </div>
        <div className="mt-8 grid grid-cols-2 gap-4 md:grid-cols-4">
          {Object.entries(typeIcons).map(([type, Icon], i) => (
            <motion.button
              key={type}
              type="button"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              onClick={() =>
                router.push(`/properties?type=${encodeURIComponent(type)}`)
              }
              className="group rounded-xl border border-border bg-card p-6 text-center shadow-card transition-all hover:-translate-y-1 hover:shadow-card-hover"
            >
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-xl bg-secondary/10 transition-colors group-hover:bg-secondary group-hover:text-secondary-foreground">
                <Icon className="h-7 w-7" />
              </div>
              <h3 className="font-heading mt-3 text-lg font-semibold">{type}</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                {properties.filter((p) => p.type === type).length} listings
              </p>
            </motion.button>
          ))}
        </div>
      </section>

      <section className="bg-muted/50 py-16">
        <div className="container mx-auto px-4">
          <div className="flex items-end justify-between gap-4">
            <div>
              <h2 className="font-heading text-3xl font-bold">
                Featured Properties
              </h2>
              <p className="mt-2 text-muted-foreground">
                Hand-picked properties just for you
              </p>
            </div>
            <Button
              variant="outline"
              onClick={() => router.push("/properties")}
            >
              View All
            </Button>
          </div>
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {featured.map((property, i) => (
              <motion.div
                key={property.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <PropertyCard property={property} />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="container mx-auto px-4 py-16 text-center">
        <div className="gradient-accent shadow-accent-glow mx-auto max-w-2xl rounded-2xl p-10 text-accent-foreground">
          <h2 className="font-heading text-3xl font-bold">
            Ready to List Your Property?
          </h2>
          <p className="mt-3 opacity-90">
            Join thousands of agents and property managers who trust Nestify.
          </p>
          <Button
            size="lg"
            variant="outline"
            className="mt-6 border-accent-foreground/30 text-accent-foreground hover:bg-accent-foreground/10"
            onClick={() => router.push("/contact")}
          >
            Get Started Today
          </Button>
        </div>
      </section>
    </div>
  );
}
