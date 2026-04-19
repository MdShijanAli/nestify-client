"use client";

import { useState, useEffect } from "react";
import {
  Property,
  PropertyType,
  PropertyStatus,
  propertyTypes,
  statusOptions,
  amenitiesList,
} from "@/data/properties";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";

const DEFAULT_IMAGE =
  "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&q=80";

interface PropertyFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  property?: Property | null;
  onSubmit: (data: Omit<Property, "id" | "dateListed">) => void;
}

const agents = [
  { id: "agent-1", name: "Sarah Mitchell" },
  { id: "agent-2", name: "James Rodriguez" },
  { id: "agent-3", name: "Emily Chen" },
];

export function PropertyFormDialog({
  open,
  onOpenChange,
  property,
  onSubmit,
}: PropertyFormDialogProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [type, setType] = useState<PropertyType>("Apartment");
  const [status, setStatus] = useState<PropertyStatus>("For Sale");
  const [price, setPrice] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [zipCode, setZipCode] = useState("");
  const [address, setAddress] = useState("");
  const [area, setArea] = useState("");
  const [bedrooms, setBedrooms] = useState("");
  const [bathrooms, setBathrooms] = useState("");
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);
  const [featured, setFeatured] = useState(false);
  const [agentId, setAgentId] = useState("agent-1");

  useEffect(() => {
    if (property) {
      setTitle(property.title);
      setDescription(property.description ?? "");
      setType(property.type);
      setStatus(property.status);
      setPrice(property.price.toString());
      setCity(property.city);
      setState(property.state);
      setZipCode(property.zipCode);
      setAddress(property.address ?? "");
      setArea(property.area.toString());
      setBedrooms(property.bedrooms.toString());
      setBathrooms(property.bathrooms.toString());
      setSelectedAmenities(property.amenities ?? []);
      setFeatured(property.featured);
      setAgentId(property.agentId ?? "agent-1");
    } else {
      setTitle("");
      setDescription("");
      setType("Apartment");
      setStatus("For Sale");
      setPrice("");
      setCity("");
      setState("");
      setZipCode("");
      setAddress("");
      setArea("");
      setBedrooms("");
      setBathrooms("");
      setSelectedAmenities([]);
      setFeatured(false);
      setAgentId("agent-1");
    }
  }, [property, open]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const agent = agents.find((a) => a.id === agentId)!;
    onSubmit({
      title,
      description,
      type,
      status,
      price: parseFloat(price) || 0,
      city,
      state,
      zipCode,
      address,
      area: parseFloat(area) || 0,
      bedrooms: parseInt(bedrooms) || 0,
      bathrooms: parseInt(bathrooms) || 0,
      images: property?.images?.length ? property.images : [DEFAULT_IMAGE],
      amenities: selectedAmenities,
      featured,
      agentId: agent.id,
      agentName: agent.name,
      agentPhoto: "",
    });
    onOpenChange(false);
  };

  const toggleAmenity = (amenity: string) => {
    setSelectedAmenities((prev) =>
      prev.includes(amenity)
        ? prev.filter((a) => a !== amenity)
        : [...prev, amenity],
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh]">
        <DialogHeader>
          <DialogTitle className="font-heading text-xl">
            {property ? "Edit Property" : "Add New Property"}
          </DialogTitle>
        </DialogHeader>
        <ScrollArea className="max-h-[70vh] pr-4">
          <form onSubmit={handleSubmit} className="space-y-4 p-1">
            <div>
              <Label>Title</Label>
              <Input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. 3BHK Apartment"
                required
              />
            </div>

            <div>
              <Label>Description</Label>
              <Textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Property description..."
                rows={3}
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Type</Label>
                <Select
                  value={type}
                  onValueChange={(v) => setType(v as PropertyType)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {propertyTypes.map((t) => (
                      <SelectItem key={t} value={t}>
                        {t}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Status</Label>
                <Select
                  value={status}
                  onValueChange={(v) => setStatus(v as PropertyStatus)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {statusOptions.map((s) => (
                      <SelectItem key={s} value={s}>
                        {s}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Price ($)</Label>
                <Input
                  type="number"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  placeholder="850000"
                  required
                />
              </div>
              <div>
                <Label>Area (sqft)</Label>
                <Input
                  type="number"
                  value={area}
                  onChange={(e) => setArea(e.target.value)}
                  placeholder="1800"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <Label>Bedrooms</Label>
                <Input
                  type="number"
                  value={bedrooms}
                  onChange={(e) => setBedrooms(e.target.value)}
                  placeholder="3"
                />
              </div>
              <div>
                <Label>Bathrooms</Label>
                <Input
                  type="number"
                  value={bathrooms}
                  onChange={(e) => setBathrooms(e.target.value)}
                  placeholder="2"
                />
              </div>
              <div>
                <Label>Agent</Label>
                <Select value={agentId} onValueChange={setAgentId}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {agents.map((a) => (
                      <SelectItem key={a.id} value={a.id}>
                        {a.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label>Address</Label>
              <Input
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Street address"
                required
              />
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <Label>City</Label>
                <Input
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="New York"
                  required
                />
              </div>
              <div>
                <Label>State</Label>
                <Input
                  value={state}
                  onChange={(e) => setState(e.target.value)}
                  placeholder="NY"
                  required
                />
              </div>
              <div>
                <Label>Zip Code</Label>
                <Input
                  value={zipCode}
                  onChange={(e) => setZipCode(e.target.value)}
                  placeholder="10001"
                  required
                />
              </div>
            </div>

            <div>
              <Label className="mb-2 block">Amenities</Label>
              <div className="grid grid-cols-3 gap-2">
                {amenitiesList.map((a) => (
                  <div key={a} className="flex items-center gap-2">
                    <Checkbox
                      id={`amenity-${a}`}
                      checked={selectedAmenities.includes(a)}
                      onCheckedChange={() => toggleAmenity(a)}
                    />
                    <label
                      htmlFor={`amenity-${a}`}
                      className="text-sm cursor-pointer"
                    >
                      {a}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Checkbox
                id="featured"
                checked={featured}
                onCheckedChange={(v) => setFeatured(!!v)}
              />
              <label
                htmlFor="featured"
                className="text-sm font-medium cursor-pointer"
              >
                Mark as Featured
              </label>
            </div>

            <div className="flex gap-3 pt-2">
              <Button
                type="submit"
                className="flex-1 gradient-accent text-accent-foreground border-0"
              >
                {property ? "Update Property" : "Add Property"}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
              >
                Cancel
              </Button>
            </div>
          </form>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
