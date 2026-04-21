import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Search } from "lucide-react";

const savedSearches = [
  {
    id: 1,
    query: "3+ bed apartments in Manhattan",
    results: 24,
    lastRun: "2026-04-11",
  },
  {
    id: 2,
    query: "Houses under $500k in Brooklyn",
    results: 12,
    lastRun: "2026-04-09",
  },
  {
    id: 3,
    query: "Commercial spaces downtown",
    results: 8,
    lastRun: "2026-04-07",
  },
];

export default function CustomerSearchesPage() {
  return (
    <div className="space-y-6 p-6">
      <h1 className="font-heading text-2xl font-bold text-foreground">
        My Searches
      </h1>

      <Card>
        <CardHeader>
          <CardTitle>Saved Searches</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {savedSearches.map((search) => (
              <div
                key={search.id}
                className="flex items-center justify-between rounded-lg border border-border p-4"
              >
                <div className="flex items-center gap-3">
                  <Search className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium text-foreground">
                      {search.query}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {search.results} results - Last run {search.lastRun}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
