"use client";

import Link from "next/link";
import { Heart } from "lucide-react";
import { useAppState } from "@/context/AppContext";
import { PropertyCard } from "@/components/property/property-card";
import { Button } from "@/components/ui/button";

export default function CustomerSavedPage() {
	const { properties, favorites } = useAppState();
	const saved = properties.filter((property) => favorites.includes(property.id));

	return (
		<div className="space-y-6 p-6">
			<h1 className="font-heading text-2xl font-bold text-foreground">Saved Properties</h1>

			{saved.length === 0 ? (
				<div className="py-16 text-center">
					<Heart className="mx-auto mb-3 h-12 w-12 text-muted-foreground" />
					<p className="mb-4 text-muted-foreground">You haven&apos;t saved any properties yet</p>
					<Link href="/properties">
						<Button>Browse Properties</Button>
					</Link>
				</div>
			) : (
				<div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
					{saved.map((property) => (
						<PropertyCard key={property.id} property={property} />
					))}
				</div>
			)}
		</div>
	);
}
