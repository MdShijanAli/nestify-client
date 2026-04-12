"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useState } from "react";
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
import { motion } from "framer-motion";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useAppState } from "@/context/AppContext";
import { MortgageCalculator } from "@/components/mortgage-calculator";
import { PropertyLocationMap } from "@/components/property-location-map";
import { ImageGallery } from "@/components/image-gallery";
import { VirtualTour } from "@/components/virtual-tour";

export default function PropertyDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const { properties, isFavorite, toggleFavorite } = useAppState();
  const property = properties.find((p) => p.id === id);
  const liked = property ? isFavorite(property.id) : false;

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");

  // Mock agent info
  const agentName = property?.title ? "Alex Johnson" : "";
  const agentPhone = "(555) 123-4567";
  const agentEmail = "alex@nestify.com";

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

  const formatPrice = (price: number, status: string) => {
    return status === "For Rent"
      ? `$${price.toLocaleString()}/mo`
      : `$${price.toLocaleString()}`;
  };

  const handleInquiry = (e: React.FormEvent) => {
    e.preventDefault();

    if (!name || !email) {
      toast.error("Please fill in all required fields");
      return;
    }

    // Simulate sending inquiry
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
          <div className="space-y-6 lg:col-span-2">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <ImageGallery images={property.images} title={property.title} />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="space-y-4"
            >
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2">
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
                          ? "bg-success text-success-foreground border-0"
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
                      {property.city}, {property.state} {property.zipCode}
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

            <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
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
                  value: new Date().toLocaleDateString(),
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

            <div className="rounded-xl border bg-card p-6">
              <h2 className="font-heading text-xl font-semibold">
                Description
              </h2>
              <p className="mt-3 leading-relaxed text-muted-foreground">
                This beautiful {property.type.toLowerCase()} is located in{" "}
                {property.city}, {property.state}. With {property.bedrooms}{" "}
                bedrooms and {property.bathrooms} bathrooms, it spans{" "}
                {property.area.toLocaleString()} square feet of{" "}
                {property.status === "For Rent" ? "rental" : "prime"} space.
                Perfect for{" "}
                {property.status === "For Rent" ? "tenants" : "buyers"} looking
                for quality and comfort.
              </p>
            </div>

            <div className="rounded-xl border bg-card p-6">
              <h2 className="font-heading text-xl font-semibold">Amenities</h2>
              <div className="mt-3 flex flex-wrap gap-2">
                {[
                  "Parking",
                  "Security",
                  "Gym",
                  "Pool",
                  "Garden",
                  "Balcony",
                ].map((a) => (
                  <Badge key={a} variant="outline" className="px-3 py-1.5">
                    {a}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Mortgage Calculator - show for sale properties */}
            {property.status === "For Sale" && property.price > 10000 && (
              <MortgageCalculator propertyPrice={property.price} />
            )}

            {/* Virtual Tour */}
            {property.images.length > 0 && (
              <VirtualTour images={property.images} title={property.title} />
            )}

            {/* Location Map */}
            <PropertyLocationMap
              city={property.city}
              address={`${property.city}, ${property.state} ${property.zipCode}`}
            />

            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Tag className="h-4 w-4" />
              Property ID: {property.id}
            </div>
          </div>

          <div className="space-y-6">
            {/* Agent Card */}
            <div className="rounded-xl border bg-card p-6 shadow-card">
              <h3 className="font-heading text-lg font-semibold">Listed by</h3>
              <div className="mt-4 flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-primary-foreground">
                  <User className="h-6 w-6" />
                </div>
                <div>
                  <div className="font-semibold">{agentName}</div>
                  <div className="text-sm text-muted-foreground">
                    Licensed Agent
                  </div>
                </div>
              </div>
              <div className="mt-4 space-y-2">
                <Button variant="outline" className="w-full justify-start">
                  <Phone className="mr-2 h-4 w-4" />
                  {agentPhone}
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Mail className="mr-2 h-4 w-4" />
                  {agentEmail}
                </Button>
              </div>
            </div>

            {/* Inquiry Form */}
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
                <Button type="submit" className="w-full">
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
