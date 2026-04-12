import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function PropertiesPage() {
  return (
    <div className="container mx-auto flex min-h-[60vh] flex-col items-center justify-center gap-4 px-4 py-16 text-center">
      <h1 className="font-heading text-3xl font-bold">Properties</h1>
      <p className="max-w-md text-muted-foreground">
        Listing search and filters will live here. Use the home search or
        navigation to reach this page with query parameters.
      </p>
      <Button asChild variant="outline">
        <Link href="/">Back to home</Link>
      </Button>
    </div>
  );
}
