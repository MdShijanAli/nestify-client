import { DashboardPageShell } from "@/components/dashboard/page-shell";

const searches = [
  "Apartment in Miami under $500K",
  "House in Austin with 3+ bedrooms",
  "Commercial property in Chicago",
];

export default function DashboardSearchesPage() {
  return (
    <DashboardPageShell
      title="My Searches"
      subtitle="Recent saved search criteria"
    >
      <div className="space-y-3">
        {searches.map((search) => (
          <div
            key={search}
            className="rounded-xl border bg-card p-4 text-foreground"
          >
            {search}
          </div>
        ))}
      </div>
    </DashboardPageShell>
  );
}
