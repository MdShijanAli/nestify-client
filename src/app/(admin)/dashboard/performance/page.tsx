import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

const metrics = [
  { label: "Listings Sold", current: 8, target: 15 },
  { label: "Leads Converted", current: 12, target: 20 },
  { label: "Revenue Target", current: 650000, target: 1000000 },
  { label: "Client Satisfaction", current: 92, target: 100 },
];

export default function AgentPerformancePage() {
  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="font-heading text-2xl font-bold text-foreground">
          Performance
        </h1>
        <p className="text-muted-foreground">
          Track progress toward your monthly goals.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {metrics.map((metric) => {
          const pct = Math.round((metric.current / metric.target) * 100);

          return (
            <Card key={metric.label}>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {metric.label}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="font-bold text-foreground">
                    {metric.target > 1000
                      ? `$${metric.current.toLocaleString()}`
                      : metric.current}
                  </span>
                  <span className="text-muted-foreground">
                    /{" "}
                    {metric.target > 1000
                      ? `$${metric.target.toLocaleString()}`
                      : metric.target}
                  </span>
                </div>
                <Progress value={pct} className="h-2" />
                <p className="text-xs text-muted-foreground">
                  {pct}% of target
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
