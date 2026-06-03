"use client";

import { useCallback, useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { toast } from "sonner";

import {
  ApiError,
  getApiErrorMessage,
  staffUsersService,
  type StaffUser,
} from "@mazad/api";
import {
  Badge,
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Input,
  Label,
} from "@mazad/ui";

import {
  StaffUserRecordDialog,
  StaffUserRowActions,
} from "@/components/staff-user-record-dialog";

type UserTab = "public" | "staff";

type DialogState = {
  open: boolean;
  mode: "view" | "edit";
  userId: number | null;
};

function TabBar({
  active,
  onChange,
}: {
  active: UserTab;
  onChange: (tab: UserTab) => void;
}) {
  const t = useTranslations("users");
  const tabs: { id: UserTab; label: string }[] = [
    { id: "public", label: t("tabs.public") },
    { id: "staff", label: t("tabs.staff") },
  ];

  return (
    <div className="flex flex-wrap gap-2 border-b pb-3">
      {tabs.map((tab) => (
        <Button
          key={tab.id}
          size="sm"
          variant={active === tab.id ? "default" : "outline"}
          onClick={() => onChange(tab.id)}
        >
          {tab.label}
        </Button>
      ))}
    </div>
  );
}

function displayName(user: StaffUser) {
  return user.full_name_en || user.full_name_ar || user.username;
}

function UsersTab({ isStaffTab }: { isStaffTab: boolean }) {
  const t = useTranslations("users");
  const tCommon = useTranslations("common");
  const [items, setItems] = useState<StaffUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [dialog, setDialog] = useState<DialogState>({
    open: false,
    mode: "view",
    userId: null,
  });

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const data = await staffUsersService.list({
        is_staff: isStaffTab,
        search: search.trim() || undefined,
        page_size: 50,
      });
      setItems(data.results ?? []);
    } catch (error) {
      toast.error(
        error instanceof ApiError ? getApiErrorMessage(error) : t("toast.loadFailed")
      );
    } finally {
      setLoading(false);
    }
  }, [isStaffTab, search, t]);

  useEffect(() => {
    void load();
  }, [load]);

  function openView(userId: number) {
    setDialog({ open: true, mode: "view", userId });
  }

  function openEdit(userId: number) {
    setDialog({ open: true, mode: "edit", userId });
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-end gap-3">
        <div className="min-w-[220px] flex-1 space-y-2">
          <Label htmlFor={`user-search-${isStaffTab ? "staff" : "public"}`}>
            {tCommon("actions.search")}
          </Label>
          <Input
            id={`user-search-${isStaffTab ? "staff" : "public"}`}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={t("searchPlaceholder")}
          />
        </div>
        <Button type="button" variant="outline" onClick={() => void load()} disabled={loading}>
          {tCommon("actions.search")}
        </Button>
      </div>

      {loading ? (
        <p className="text-sm text-muted-foreground">{t("loadingUsers")}</p>
      ) : items.length === 0 ? (
        <p className="text-sm text-muted-foreground">{t("noUsersFound")}</p>
      ) : (
        <div className="space-y-3">
          {items.map((user) => (
            <Card key={user.id}>
              <CardHeader className="flex flex-row items-start justify-between gap-4">
                <div>
                  <CardTitle className="text-base">{displayName(user)}</CardTitle>
                  <p className="text-sm text-muted-foreground">
                    @{user.username}
                    {user.email ? ` · ${user.email}` : ""}
                    {user.phone_number ? ` · ${user.phone_number}` : ""}
                  </p>
                </div>
                <div className="flex flex-wrap justify-end gap-1">
                  <Badge variant={user.is_active ? "default" : "outline"}>
                    {user.is_active ? tCommon("status.active") : tCommon("status.inactive")}
                  </Badge>
                  {user.is_blocked ? (
                    <Badge variant="destructive">{t("badges.blocked")}</Badge>
                  ) : null}
                  {user.is_staff ? (
                    <Badge variant="outline">{t("badges.staff")}</Badge>
                  ) : null}
                  {user.is_shadow_banned ? (
                    <Badge variant="outline">{t("badges.shadow")}</Badge>
                  ) : null}
                </div>
              </CardHeader>
              <CardContent>
                <StaffUserRowActions userId={user.id} onView={openView} onEdit={openEdit} />
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <StaffUserRecordDialog
        open={dialog.open}
        mode={dialog.mode}
        userId={dialog.userId}
        onOpenChange={(open) => setDialog((prev) => ({ ...prev, open }))}
        onSaved={load}
      />
    </div>
  );
}

export function StaffUsersPanel() {
  const [tab, setTab] = useState<UserTab>("public");

  return (
    <div className="space-y-6">
      <TabBar active={tab} onChange={setTab} />
      {tab === "public" ? <UsersTab key="public" isStaffTab={false} /> : null}
      {tab === "staff" ? <UsersTab key="staff" isStaffTab={true} /> : null}
    </div>
  );
}
