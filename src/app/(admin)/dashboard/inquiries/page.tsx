import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const inquiries = [
  {
    id: 1,
    property: "Modern Luxury Apartment",
    date: "2026-04-10",
    status: "Replied",
    message: "Is this property still available?",
  },
  {
    id: 2,
    property: "Classic Colonial Home",
    date: "2026-04-08",
    status: "Pending",
    message: "Can I schedule a viewing?",
  },
  {
    id: 3,
    property: "Skyline Penthouse Suite",
    date: "2026-04-05",
    status: "Replied",
    message: "What are the HOA fees?",
  },
];

export default function CustomerInquiriesPage() {
  return (
    <div className="space-y-6 p-6">
      <h1 className="font-heading text-2xl font-bold text-foreground">My Inquiries</h1>

      <Card>
        <CardHeader>
          <CardTitle>Inquiry History</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {inquiries.map((inquiry) => (
              <div key={inquiry.id} className="space-y-2 rounded-lg border border-border p-4">
                <div className="flex items-center justify-between">
                  <p className="font-medium text-foreground">{inquiry.property}</p>
                  <Badge variant={inquiry.status === "Replied" ? "default" : "secondary"}>
                    {inquiry.status}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground">{inquiry.message}</p>
                <p className="text-xs text-muted-foreground">{inquiry.date}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}