import { Suspense } from "react";
import { getTranslations } from "next-intl/server";

import { routes } from "@/config/routes";
import { LoginForm } from "@/components/auth/login-form";
import { WebSplitAuthShell } from "@/components/layout/web-split-auth-shell";
import { Skeleton } from "@mazad/ui";

export async function generateMetadata() {
  const t = await getTranslations("auth");
  return { title: t("signInTitle") };
}

export default async function LoginPage() {
  const t = await getTranslations("auth");

  return (
    <WebSplitAuthShell
      title={t("welcomeBack")}
      description={t("signInPageDescription")}
      footerHref={routes.register}
      footerLabel={t("createAccount")}
    >
      <Suspense fallback={<Skeleton className="h-64 w-full rounded-xl" />}>
        <LoginForm />
      </Suspense>
    </WebSplitAuthShell>
  );
}
