"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { Icon } from "leaflet";
import type { Property } from "@/data/properties";
import { Badge } from "@/components/ui/badge";
import { Bed, Bath, Maximize } from "lucide-react";
import "leaflet/dist/leaflet.css";

const MapContainer = dynamic(
  () => import("react-leaflet").then((mod) => mod.MapContainer),
  { ssr: false },
);
const TileLayer = dynamic(
  () => import("react-leaflet").then((mod) => mod.TileLayer),
  { ssr: false },
);
const Marker = dynamic(
  () => import("react-leaflet").then((mod) => mod.Marker),
  { ssr: false },
);
const Popup = dynamic(() => import("react-leaflet").then((mod) => mod.Popup), {
  ssr: false,
});

// Fix leaflet default marker icon
const defaultIcon = new Icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

// Approximate coordinates for demo cities
const cityCoords: Record<string, [number, number]> = {
  "New York": [40.7484, -73.9857],
  Greenwich: [41.0267, -73.6287],
  "San Francisco": [37.7937, -122.3965],
  Miami: [25.7617, -80.1918],
  Boston: [42.3554, -71.0655],
  Aspen: [39.1911, -106.8175],
};

interface PropertyMapProps {
  properties: Property[];
  className?: string;
}

export function PropertyMap({ properties, className = "" }: PropertyMapProps) {
  const center: [number, number] = [39.5, -98.35]; // Center of USA

  const getCoords = (p: Property): [number, number] | null => {
    return cityCoords[p.city] || null;
  };

  const formatPrice = (price: number, status: string) => {
    const formatted =
      price >= 1000000
        ? `$${(price / 1000000).toFixed(1)}M`
        : price >= 1000
          ? `$${(price / 1000).toFixed(0)}K`
          : `$${price.toLocaleString()}`;
    return status === "For Rent" ? `${formatted}/mo` : formatted;
  };

  return (
    <div
      className={`overflow-hidden rounded-xl border shadow-card ${className}`}
    >
      <MapContainer
        center={center}
        zoom={4}
        style={{ height: "100%", width: "100%", minHeight: "500px" }}
        scrollWheelZoom={true}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {properties.map((p) => {
          const coords = getCoords(p);
          if (!coords) return null;
          return (
            <Marker key={p.id} position={coords} icon={defaultIcon}>
              <Popup>
                <div className="min-w-[220px] font-body">
                  <img
                    src={p.images[0]}
                    alt={p.title}
                    className="mb-2 h-28 w-full rounded-md object-cover"
                  />
                  <div className="flex items-center gap-1.5 mb-1">
                    <Badge variant="outline" className="text-xs px-1.5 py-0">
                      {p.type}
                    </Badge>
                    <Badge
                      className={`text-xs px-1.5 py-0 ${p.status === "For Sale" ? "bg-green-600" : "bg-amber-500"}`}
                    >
                      {p.status}
                    </Badge>
                  </div>
                  <h3 className="font-semibold text-sm leading-tight">
                    {p.title}
                  </h3>
                  <p className="text-xs text-gray-500 mt-0.5">
                    {p.city}, {p.state}
                  </p>
                  <p
                    className="font-bold text-base mt-1"
                    style={{ color: "hsl(35, 90%, 45%)" }}
                  >
                    {formatPrice(p.price, p.status)}
                  </p>
                  <div className="flex items-center gap-3 mt-1.5 text-xs text-gray-500">
                    {p.bedrooms > 0 && (
                      <span className="flex items-center gap-0.5">
                        <Bed className="h-3 w-3" />
                        {p.bedrooms}
                      </span>
                    )}
                    {p.bathrooms > 0 && (
                      <span className="flex items-center gap-0.5">
                        <Bath className="h-3 w-3" />
                        {p.bathrooms}
                      </span>
                    )}
                    <span className="flex items-center gap-0.5">
                      <Maximize className="h-3 w-3" />
                      {p.area.toLocaleString()}
                    </span>
                  </div>
                  <Link
                    href={`/property/${p.id}`}
                    className="mt-2 block text-center rounded bg-gray-900 px-3 py-1.5 text-xs font-medium text-white hover:bg-gray-800"
                  >
                    View Details
                  </Link>
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
    </div>
  );
}
