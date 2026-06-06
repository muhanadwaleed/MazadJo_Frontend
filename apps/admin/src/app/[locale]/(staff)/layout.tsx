import { AdminStaffGuard } from "@/components/admin-staff-guard";
import { AdminStaffShell } from "@/components/staff-shell";

export default function StaffLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AdminStaffGuard>
      <AdminStaffShell>{children}</AdminStaffShell>
    </AdminStaffGuard>
  );
}
