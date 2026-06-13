import { Container, PageHero } from "@mazad/ui";

import { ScrollReveal } from "@/components/common/scroll-reveal";

type MarketingPageShellProps = {
  eyebrow?: React.ReactNode;
  title: string;
  description: string;
  actions?: React.ReactNode;
  children: React.ReactNode;
  contained?: boolean;
};

export function MarketingPageShell({
  eyebrow,
  title,
  description,
  actions,
  children,
  contained = true,
}: MarketingPageShellProps) {
  const body = (
    <div className="space-y-10">
      <ScrollReveal variant="fadeInDown">
        <PageHero
          eyebrow={eyebrow}
          title={title}
          description={description}
          actions={actions}
        />
      </ScrollReveal>
      {children}
    </div>
  );

  if (!contained) {
    return <div className="py-2 md:py-4">{body}</div>;
  }

  return <Container className="space-y-10 py-2 md:py-4">{body}</Container>;
}
