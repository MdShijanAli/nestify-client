interface PropertyLocationMapProps {
  city: string;
  address: string;
}

export function PropertyLocationMap({
  city,
  address,
}: PropertyLocationMapProps) {
  return (
    <div className="mt-8">
      <h2 className="font-heading text-xl font-semibold">Location</h2>
      <div className="mt-4 rounded-xl border bg-muted h-96 flex items-center justify-center text-muted-foreground">
        <div className="text-center">
          <p className="font-medium">{address}</p>
          <p className="text-sm">{city}</p>
          <p className="text-xs mt-2">Map integration coming soon</p>
        </div>
      </div>
    </div>
  );
}
