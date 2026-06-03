import { StaffTopHeader } from "@/components/staff-top-header";

export default function LoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="mazad-page flex min-h-screen flex-col">
      <StaffTopHeader />
      <div className="flex min-h-0 flex-1 flex-col">{children}</div>
    </div>
  );
}
