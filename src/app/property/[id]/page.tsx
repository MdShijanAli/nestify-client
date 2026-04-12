import Link from "next/link";
import { Button } from "@/components/ui/button";

type Props = { params: Promise<{ id: string }> };

export default async function PropertyDetailPage({ params }: Props) {
  const { id } = await params;

  return (
    <div className="container mx-auto flex min-h-[60vh] flex-col items-center justify-center gap-4 px-4 py-16 text-center">
      <h1 className="font-heading text-3xl font-bold">Property {id}</h1>
      <p className="max-w-md text-muted-foreground">
        Detail view for this listing will be implemented here.
      </p>
      <Button asChild variant="outline">
        <Link href="/properties">All properties</Link>
      </Button>
    </div>
  );
}
