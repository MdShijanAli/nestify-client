import { Button } from "@/components/ui/button";

interface VirtualTourProps {
  images: string[];
  title: string;
}

export function VirtualTour({ images, title }: VirtualTourProps) {
  return (
    <div className="mt-8 rounded-xl border bg-card p-6">
      <h2 className="font-heading text-xl font-semibold">Virtual Tour</h2>
      <p className="mt-2 text-sm text-muted-foreground">
        {images.length} high-quality images available
      </p>
      <Button className="mt-4" variant="outline">
        View Full Gallery
      </Button>
    </div>
  );
}
