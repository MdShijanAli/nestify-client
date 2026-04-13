import { DashboardPageShell } from "@/components/dashboard/page-shell";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function DashboardChangePasswordPage() {
  return (
    <DashboardPageShell
      title="Change Password"
      subtitle="Update your account password"
    >
      <form className="max-w-md space-y-3 rounded-xl border bg-card p-6">
        <Input type="password" placeholder="Current Password" />
        <Input type="password" placeholder="New Password" />
        <Input type="password" placeholder="Confirm New Password" />
        <Button type="submit" className="w-full">
          Update Password
        </Button>
      </form>
    </DashboardPageShell>
  );
}
