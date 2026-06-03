import { StaffHeader } from "@/components/staff-header";

export function StaffTopHeader() {
  return (
    <header className="sticky top-0 z-30 border-b border-separator bg-card/95 shadow-sm backdrop-blur supports-[backdrop-filter]:bg-card/80">
      <StaffHeader />
    </header>
  );
}
