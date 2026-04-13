"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import {
  ArrowLeft,
  MapPin,
  Bed,
  Bath,
  Maximize,
  Heart,
  Share2,
  Calendar,
  Tag,
  User,
  Mail,
  Phone,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useAppState } from "@/context/AppContext";
import { MortgageCalculator } from "@/components/mortgage-calculator";
import { PropertyLocationMap } from "@/components/property-location-map";
import { ImageGallery } from "@/components/image-gallery";
import { VirtualTour } from "@/components/virtual-tour";
import { motion } from "framer-motion";
import { useState } from "react";
import { toast } from "sonner";

export default function PropertyDetailPage() {
  const params = useParams();
  const idParam = params.id;
  const id = Array.isArray(idParam) ? idParam[0] : idParam;

  const { properties, isFavorite, toggleFavorite } = useAppState();
  const property = properties.find((p) => p.id === id);
  const liked = id ? isFavorite(id) : false;

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");

  if (!property) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="text-center">
          <h1 className="font-heading text-2xl font-bold">
            Property Not Found
          </h1>
          <Link href="/properties">
            <Button className="mt-4">Back to Properties</Button>
          </Link>
        </div>
      </div>
    );
  }

  const safeAddress =
    (property as { address?: string }).address ?? "Address unavailable";
  const safeDescription =
    (property as { description?: string }).description ??
    "Property description is not available yet.";
  const safeAgentName =
    (property as { agentName?: string }).agentName ?? "Nestify Agent";
  const safeDateListed = (property as { dateListed?: string }).dateListed;
  const safeAmenities = Array.isArray(
    (property as { amenities?: string[] }).amenities,
  )
    ? ((property as { amenities?: string[] }).amenities ?? [])
    : [];

  const formatPrice = (price: number, status: string) => {
    return status === "For Rent"
      ? `$${price.toLocaleString()}/mo`
      : `$${price.toLocaleString()}`;
  };

  const handleInquiry = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Inquiry sent! The agent will contact you shortly.");
    setName("");
    setEmail("");
    setPhone("");
    setMessage("");
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="border-b bg-card">
        <div className="container mx-auto flex items-center gap-2 px-4 py-4">
          <Link
            href="/properties"
            className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Properties
          </Link>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <ImageGallery images={property.images} title={property.title} />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="mt-6"
            >
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <Badge
                      variant={
                        property.status === "For Sale" ? "default" : "secondary"
                      }
                      className={
                        property.status === "For Sale"
                          ? "bg-success text-success-foreground"
                          : ""
                      }
                    >
                      {property.status}
                    </Badge>
                    <Badge variant="outline">{property.type}</Badge>
                  </div>
                  <h1 className="mt-2 font-heading text-3xl font-bold">
                    {property.title}
                  </h1>
                  <div className="mt-1 flex items-center gap-1 text-muted-foreground">
                    <MapPin className="h-4 w-4" />
                    <span>
                      {safeAddress}, {property.city}, {property.state}{" "}
                      {property.zipCode}
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-heading text-3xl font-bold text-secondary">
                    {formatPrice(property.price, property.status)}
                  </div>
                  <div className="mt-2 flex gap-2">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => toggleFavorite(property.id)}
                    >
                      <Heart
                        className={`h-4 w-4 ${
                          liked ? "fill-destructive text-destructive" : ""
                        }`}
                      />
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => {
                        navigator.clipboard.writeText(window.location.href);
                        toast.success("Link copied!");
                      }}
                    >
                      <Share2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </motion.div>

            <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
              {[
                { icon: Bed, label: "Bedrooms", value: property.bedrooms },
                { icon: Bath, label: "Bathrooms", value: property.bathrooms },
                {
                  icon: Maximize,
                  label: "Area",
                  value: `${property.area.toLocaleString()} sqft`,
                },
                {
                  icon: Calendar,
                  label: "Listed",
                  value: safeDateListed
                    ? new Date(safeDateListed).toLocaleDateString()
                    : "N/A",
                },
              ].map((stat) => (
                <div
                  key={stat.label}
                  className="rounded-xl border bg-card p-4 text-center shadow-card"
                >
                  <stat.icon className="mx-auto h-5 w-5 text-secondary" />
                  <div className="mt-1 text-lg font-bold">{stat.value}</div>
                  <div className="text-xs text-muted-foreground">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-8">
              <h2 className="font-heading text-xl font-semibold">
                Description
              </h2>
              <p className="mt-3 leading-relaxed text-muted-foreground">
                {safeDescription}
              </p>
            </div>

            <div className="mt-8">
              <h2 className="font-heading text-xl font-semibold">Amenities</h2>
              <div className="mt-3 flex flex-wrap gap-2">
                {safeAmenities.map((a) => (
                  <Badge key={a} variant="outline" className="px-3 py-1.5">
                    {a}
                  </Badge>
                ))}
                {safeAmenities.length === 0 ? (
                  <span className="text-sm text-muted-foreground">
                    No amenities listed
                  </span>
                ) : null}
              </div>
            </div>

            {/* Mortgage Calculator - show for sale properties */}
            {property.status === "For Sale" && property.price > 10000 && (
              <div className="mt-8">
                <MortgageCalculator propertyPrice={property.price} />
              </div>
            )}

            {/* Virtual Tour */}
            {property.images.length > 1 && (
              <VirtualTour images={property.images} title={property.title} />
            )}

            {/* Location Map */}
            <PropertyLocationMap city={property.city} address={safeAddress} />

            <div className="mt-8 flex items-center gap-2 text-sm text-muted-foreground">
              <Tag className="h-4 w-4" />
              Property ID: {property.id}
            </div>
          </div>

          <div className="space-y-6">
            <div className="rounded-xl border bg-card p-6 shadow-card">
              <h3 className="font-heading text-lg font-semibold">Listed by</h3>
              <div className="mt-4 flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-primary-foreground">
                  <User className="h-6 w-6" />
                </div>
                <div>
                  <div className="font-semibold">{safeAgentName}</div>
                  <div className="text-sm text-muted-foreground">
                    Licensed Agent
                  </div>
                </div>
              </div>
              <div className="mt-4 space-y-2">
                <Button variant="outline" className="w-full justify-start">
                  <Phone className="mr-2 h-4 w-4" />
                  (555) 123-4567
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Mail className="mr-2 h-4 w-4" />
                  Email Agent
                </Button>
              </div>
            </div>

            <div className="rounded-xl border bg-card p-6 shadow-card">
              <h3 className="font-heading text-lg font-semibold">
                Send Inquiry
              </h3>
              <form onSubmit={handleInquiry} className="mt-4 space-y-3">
                <Input
                  placeholder="Your Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
                <Input
                  type="email"
                  placeholder="Your Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
                <Input
                  type="tel"
                  placeholder="Phone Number"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
                <Textarea
                  placeholder="I'm interested in this property..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  rows={4}
                />
                <Button
                  type="submit"
                  className="w-full gradient-accent text-accent-foreground border-0"
                >
                  Send Message
                </Button>
              </form>
            </div>

            <Button
              variant="outline"
              className="w-full"
              size="lg"
              onClick={() => toast.success("Visit scheduling coming soon!")}
            >
              <Calendar className="mr-2 h-4 w-4" />
              Schedule a Visit
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
