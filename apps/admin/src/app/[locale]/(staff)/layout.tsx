import { StaffGuard } from "@mazad/auth";

import { AdminStaffShell } from "@/components/staff-shell";

export default function StaffLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <StaffGuard>
      <AdminStaffShell>{children}</AdminStaffShell>
    </StaffGuard>
  );
}
