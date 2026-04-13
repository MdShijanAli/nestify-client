import { DashboardPageShell } from "@/components/dashboard/page-shell";

const inquiries = [
  { id: "1", property: "Modern Loft in Downtown", status: "New" },
  { id: "2", property: "Waterfront Condo", status: "Contacted" },
  { id: "3", property: "Suburban Family Home", status: "Qualified" },
];

export default function DashboardInquiriesPage() {
  return (
    <DashboardPageShell
      title="My Inquiries"
      subtitle="Track your sent inquiries"
    >
      <div className="space-y-3">
        {inquiries.map((inquiry) => (
          <div
            key={inquiry.id}
            className="flex items-center justify-between rounded-xl border bg-card p-4"
          >
            <p className="font-medium text-foreground">{inquiry.property}</p>
            <span className="rounded-full bg-primary/10 px-2.5 py-1 text-xs font-medium text-primary">
              {inquiry.status}
            </span>
          </div>
        ))}
      </div>
    </DashboardPageShell>
  );
}
