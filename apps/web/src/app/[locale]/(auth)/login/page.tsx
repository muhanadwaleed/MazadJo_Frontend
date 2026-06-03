import { Suspense } from "react";
import { getTranslations } from "next-intl/server";

import { AuthPageShell } from "@/components/layout/auth-page-shell";
import { LoginForm } from "@/components/auth/login-form";
import { Skeleton } from "@mazad/ui";

export async function generateMetadata() {
  const t = await getTranslations("auth");
  return { title: t("signInTitle") };
}

export default async function LoginPage() {
  const t = await getTranslations("auth");

  return (
    <AuthPageShell title={t("welcomeBack")} description={t("signInPageDescription")}>
      <Suspense fallback={<Skeleton className="h-64 w-full" />}>
        <LoginForm />
      </Suspense>
    </AuthPageShell>
  );
}
