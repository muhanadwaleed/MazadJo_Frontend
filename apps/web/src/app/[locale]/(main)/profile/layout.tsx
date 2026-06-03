import { AuthGuard } from "@/components/auth/auth-guard";
import { Container } from "@mazad/ui";

export default function ProfileLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Container size="wide">
      <AuthGuard>{children}</AuthGuard>
    </Container>
  );
}
