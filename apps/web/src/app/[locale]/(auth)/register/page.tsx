import { getTranslations } from "next-intl/server";

import { AuthPageShell } from "@/components/layout/auth-page-shell";
import { RegisterForm } from "@/components/auth/register-form";

export async function generateMetadata() {
  const t = await getTranslations("auth");
  return { title: t("registerTitle") };
}

export default async function RegisterPage() {
  const t = await getTranslations("auth");

  return (
    <AuthPageShell title={t("registerTitle")} description={t("registerPageDescription")}>
      <RegisterForm />
    </AuthPageShell>
  );
}
