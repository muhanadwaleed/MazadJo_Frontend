import { PageHeader } from "@mazad/ui";

type StaffPageFrameProps = {
  title: string;
  description?: string;
  eyebrow?: string;
  actions?: React.ReactNode;
  filters?: React.ReactNode;
  children: React.ReactNode;
};

export function StaffPageFrame({
  title,
  description,
  eyebrow,
  actions,
  filters,
  children,
}: StaffPageFrameProps) {
  return (
    <div className="space-y-8">
      <div className="overflow-hidden rounded-2xl border border-mazad-border-subtle bg-card shadow-sm">
        <div className="h-1 bg-gradient-to-r from-mazad-primary via-light-blue to-mazad-accent" />
        <div className="p-6 md:p-8">
          <PageHeader
            title={title}
            description={description}
            eyebrow={eyebrow}
            actions={actions}
          />
        </div>
      </div>
      {filters}
      {children}
    </div>
  );
}
