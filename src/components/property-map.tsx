import { MapPin } from "lucide-react";

interface PropertyMapProps {
  properties: any[];
  className?: string;
}

export function PropertyMap({ properties, className }: PropertyMapProps) {
  return (
    <div className={`rounded-xl border bg-muted ${className}`}>
      <div className="flex h-full items-center justify-center">
        <div className="text-center">
          <MapPin className="mx-auto h-8 w-8 text-muted-foreground" />
          <p className="mt-2 text-muted-foreground">
            Map view integration coming soon
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            Showing {properties.length} properties
          </p>
        </div>
      </div>
    </div>
  );
}
