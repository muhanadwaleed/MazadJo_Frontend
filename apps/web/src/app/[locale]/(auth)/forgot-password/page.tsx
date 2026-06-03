import { getTranslations } from "next-intl/server";

import { AuthPageShell } from "@/components/layout/auth-page-shell";
import { ForgotPasswordForm } from "@/components/auth/forgot-password-form";

export async function generateMetadata() {
  const t = await getTranslations("auth");
  return { title: t("forgotPasswordTitle") };
}

export default async function ForgotPasswordPage() {
  const t = await getTranslations("auth");

  return (
    <AuthPageShell
      title={t("forgotPasswordTitle")}
      description={t("forgotPasswordPageDescription")}
    >
      <ForgotPasswordForm />
    </AuthPageShell>
  );
}
