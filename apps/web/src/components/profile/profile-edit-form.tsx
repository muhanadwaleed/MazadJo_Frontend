"use client";

import { useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { toast } from "sonner";

import { ApiError, getApiErrorMessage, usersService, type UserProfile } from "@mazad/api";
import { Button, Card, CardContent, CardDescription, CardHeader, CardTitle, Input, Label } from "@mazad/ui";

type ProfileEditFormProps = {
  user: UserProfile;
  onUpdated: (user: UserProfile) => void;
};

export function ProfileEditForm({ user, onUpdated }: ProfileEditFormProps) {
  const locale = useLocale();
  const t = useTranslations("profile");
  const [fullNameEn, setFullNameEn] = useState(user.full_name_en ?? "");
  const [fullNameAr, setFullNameAr] = useState(user.full_name_ar ?? "");
  const [email, setEmail] = useState(user.email ?? "");
  const [saving, setSaving] = useState(false);

  async function handleSave() {
    setSaving(true);
    try {
      const updated = await usersService.updateMe({
        full_name_en: fullNameEn.trim(),
        full_name_ar: fullNameAr.trim(),
        email: email.trim(),
      });
      onUpdated(updated);
      toast.success(t("saveSuccess"));
    } catch (error) {
      toast.error(
        error instanceof ApiError ? getApiErrorMessage(error) : t("saveFailed")
      );
    } finally {
      setSaving(false);
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("editTitle")}</CardTitle>
        <CardDescription>{t("editDescription")}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="profile-name-en">{t("nameEn")}</Label>
          <Input
            id="profile-name-en"
            value={fullNameEn}
            onChange={(e) => setFullNameEn(e.target.value)}
            dir="ltr"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="profile-name-ar">{t("nameAr")}</Label>
          <Input
            id="profile-name-ar"
            value={fullNameAr}
            onChange={(e) => setFullNameAr(e.target.value)}
            dir={locale === "ar" ? "rtl" : "auto"}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="profile-email">{t("email")}</Label>
          <Input
            id="profile-email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            dir="ltr"
          />
        </div>
        <Button disabled={saving} onClick={() => void handleSave()}>
          {saving ? t("saving") : t("saveChanges")}
        </Button>
      </CardContent>
    </Card>
  );
}
