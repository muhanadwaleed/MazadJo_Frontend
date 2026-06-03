"use client";

import { useCallback, useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { toast } from "sonner";

import {
  ApiError,
  getApiErrorMessage,
  staffUsersService,
  type StaffUser,
  type StaffUserUpdatePayload,
} from "@mazad/api";
import {
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  Input,
  Label,
} from "@mazad/ui";

const selectClassName =
  "flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm";

function ViewRow({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex justify-between gap-4 border-b border-border py-2 text-sm last:border-0">
      <span className="text-muted-foreground">{label}</span>
      <span className="text-right font-medium">{value}</span>
    </div>
  );
}

type StaffUserRecordDialogProps = {
  open: boolean;
  mode: "view" | "edit";
  userId: number | null;
  onOpenChange: (open: boolean) => void;
  onSaved: () => void;
};

export function StaffUserRecordDialog({
  open,
  mode,
  userId,
  onOpenChange,
  onSaved,
}: StaffUserRecordDialogProps) {
  const t = useTranslations("users");
  const tCommon = useTranslations("common");
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [user, setUser] = useState<StaffUser | null>(null);

  const [fullNameEn, setFullNameEn] = useState("");
  const [fullNameAr, setFullNameAr] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [userType, setUserType] = useState("public_user");
  const [isStaff, setIsStaff] = useState(false);
  const [isActive, setIsActive] = useState(true);
  const [isBlocked, setIsBlocked] = useState(false);
  const [isShadowBanned, setIsShadowBanned] = useState(false);

  const boolLabel = (value: boolean) =>
    value ? tCommon("status.yes") : tCommon("status.no");

  const load = useCallback(async () => {
    if (!userId) return;
    setLoading(true);
    try {
      const data = await staffUsersService.get(userId);
      setUser(data);
      setFullNameEn(data.full_name_en ?? "");
      setFullNameAr(data.full_name_ar ?? "");
      setEmail(data.email ?? "");
      setPhone(data.phone_number ?? "");
      setUserType(data.user_type ?? "public_user");
      setIsStaff(data.is_staff);
      setIsActive(data.is_active);
      setIsBlocked(data.is_blocked);
      setIsShadowBanned(data.is_shadow_banned);
    } catch (error) {
      toast.error(
        error instanceof ApiError ? getApiErrorMessage(error) : t("toast.loadUserFailed")
      );
      onOpenChange(false);
    } finally {
      setLoading(false);
    }
  }, [onOpenChange, userId, t]);

  useEffect(() => {
    if (open && userId) void load();
    else if (!open) setUser(null);
  }, [load, open, userId]);

  async function handleSave() {
    if (!userId) return;
    setSaving(true);
    const body: StaffUserUpdatePayload = {
      full_name_en: fullNameEn.trim(),
      full_name_ar: fullNameAr.trim(),
      email: email.trim(),
      phone_number: phone.trim(),
      user_type: userType,
      is_staff: isStaff,
      is_active: isActive,
      is_blocked: isBlocked,
      is_shadow_banned: isShadowBanned,
    };
    try {
      await staffUsersService.update(userId, body);
      toast.success(t("toast.updated"));
      onSaved();
      onOpenChange(false);
    } catch (error) {
      toast.error(
        error instanceof ApiError ? getApiErrorMessage(error) : tCommon("toast.saveFailed")
      );
    } finally {
      setSaving(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>
            {mode === "view" ? t("dialog.viewTitle") : t("dialog.editTitle")}
          </DialogTitle>
          <DialogDescription>
            {user
              ? t("dialog.userMeta", { username: user.username, id: user.id })
              : userId
                ? tCommon("labels.id", { id: userId })
                : ""}
          </DialogDescription>
        </DialogHeader>

        {loading ? (
          <p className="text-sm text-muted-foreground">{tCommon("status.loading")}</p>
        ) : mode === "view" && user ? (
          <div className="space-y-1">
            <ViewRow label={t("dialog.username")} value={user.username} />
            <ViewRow
              label={tCommon("labels.email")}
              value={user.email || tCommon("status.none")}
            />
            <ViewRow
              label={tCommon("labels.phone")}
              value={user.phone_number || tCommon("status.none")}
            />
            <ViewRow
              label={tCommon("labels.nameEn")}
              value={user.full_name_en || tCommon("status.none")}
            />
            <ViewRow
              label={tCommon("labels.nameAr")}
              value={user.full_name_ar || tCommon("status.none")}
            />
            <ViewRow label={t("dialog.userType")} value={user.user_type} />
            <ViewRow label={t("dialog.staff")} value={boolLabel(user.is_staff)} />
            <ViewRow label={tCommon("labels.active")} value={boolLabel(user.is_active)} />
            <ViewRow label={t("dialog.blocked")} value={boolLabel(user.is_blocked)} />
            <ViewRow label={t("dialog.shadowBanned")} value={boolLabel(user.is_shadow_banned)} />
            <ViewRow label={t("dialog.phoneVerified")} value={boolLabel(user.is_phone_verified)} />
            <ViewRow label={t("dialog.emailVerified")} value={boolLabel(user.is_email_verified)} />
            <ViewRow label={t("dialog.joined")} value={new Date(user.date_joined).toLocaleString()} />
          </div>
        ) : user ? (
          <div className="grid gap-3">
            <div className="space-y-2">
              <Label>{tCommon("labels.nameEn")}</Label>
              <Input value={fullNameEn} onChange={(e) => setFullNameEn(e.target.value)} disabled={saving} />
            </div>
            <div className="space-y-2">
              <Label>{tCommon("labels.nameAr")}</Label>
              <Input value={fullNameAr} onChange={(e) => setFullNameAr(e.target.value)} disabled={saving} />
            </div>
            <div className="space-y-2">
              <Label>{tCommon("labels.email")}</Label>
              <Input value={email} onChange={(e) => setEmail(e.target.value)} disabled={saving} />
            </div>
            <div className="space-y-2">
              <Label>{tCommon("labels.phone")}</Label>
              <Input value={phone} onChange={(e) => setPhone(e.target.value)} disabled={saving} />
            </div>
            <div className="space-y-2">
              <Label>{t("dialog.userType")}</Label>
              <select
                className={selectClassName}
                value={userType}
                onChange={(e) => setUserType(e.target.value)}
                disabled={saving}
              >
                <option value="public_user">{t("dialog.types.publicUser")}</option>
                <option value="staff">{t("dialog.types.staff")}</option>
                <option value="admin">{t("dialog.types.admin")}</option>
              </select>
            </div>
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" checked={isStaff} onChange={(e) => setIsStaff(e.target.checked)} disabled={saving} />
              {t("dialog.staffAccess")}
            </label>
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" checked={isActive} onChange={(e) => setIsActive(e.target.checked)} disabled={saving} />
              {tCommon("labels.active")}
            </label>
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" checked={isBlocked} onChange={(e) => setIsBlocked(e.target.checked)} disabled={saving} />
              {t("dialog.blocked")}
            </label>
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={isShadowBanned}
                onChange={(e) => setIsShadowBanned(e.target.checked)}
                disabled={saving}
              />
              {t("dialog.shadowBanned")}
            </label>
          </div>
        ) : null}

        <DialogFooter className="gap-2 sm:gap-0">
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={saving}>
            {tCommon("actions.close")}
          </Button>
          {mode === "edit" ? (
            <Button onClick={() => void handleSave()} disabled={saving || loading}>
              {saving ? tCommon("status.saving") : tCommon("labels.saveChanges")}
            </Button>
          ) : null}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export function StaffUserRowActions({
  userId,
  onView,
  onEdit,
}: {
  userId: number;
  onView: (id: number) => void;
  onEdit: (id: number) => void;
}) {
  const tCommon = useTranslations("common");

  return (
    <div className="flex flex-wrap gap-2">
      <Button size="sm" variant="outline" onClick={() => onView(userId)}>
        {tCommon("actions.view")}
      </Button>
      <Button size="sm" onClick={() => onEdit(userId)}>
        {tCommon("actions.edit")}
      </Button>
    </div>
  );
}
