"use client";

import dynamic from "next/dynamic";
import { Icon } from "leaflet";
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

const cityCoords: Record<string, [number, number]> = {
  Austin: [30.2672, -97.7431],
  Plano: [33.0198, -96.6989],
  Denver: [39.7392, -104.9903],
  Scottsdale: [33.4942, -111.9261],
  Portland: [45.5152, -122.6784],
  Seattle: [47.6062, -122.3321],
  Chicago: [41.8781, -87.6298],
  "New York": [40.7484, -73.9857],
  Greenwich: [41.0267, -73.6287],
  "San Francisco": [37.7937, -122.3965],
  Miami: [25.7617, -80.1918],
  Boston: [42.3554, -71.0655],
  Aspen: [39.1911, -106.8175],
};

interface PropertyLocationMapProps {
  city: string;
  address: string;
}

export function PropertyLocationMap({
  city,
  address,
}: PropertyLocationMapProps) {
  const coords = cityCoords[city];

  if (!coords) {
    return (
      <div className="mt-8">
        <h2 className="mb-3 font-heading text-xl font-semibold">Location</h2>
        <div className="flex h-[300px] items-center justify-center rounded-xl border bg-muted text-muted-foreground">
          <div className="text-center">
            <p className="font-medium">{address}</p>
            <p className="text-sm">{city}</p>
            <p className="mt-2 text-xs">Map unavailable for this city</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mt-8">
      <h2 className="mb-3 font-heading text-xl font-semibold">Location</h2>
      <div
        className="overflow-hidden rounded-xl border shadow-card"
        style={{ height: 300 }}
      >
        <MapContainer
          center={coords}
          zoom={14}
          style={{ height: "100%", width: "100%" }}
          scrollWheelZoom={false}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <Marker position={coords} icon={defaultIcon}>
            <Popup>
              <span className="text-sm">
                {address}, {city}
              </span>
            </Popup>
          </Marker>
        </MapContainer>
      </div>
    </div>
  );
}
