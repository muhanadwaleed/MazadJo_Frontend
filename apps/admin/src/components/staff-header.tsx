"use client";

import { Container } from "@mazad/ui";

import { StaffLocaleSwitcher } from "@/components/staff-locale-switcher";
import { StaffProfileMenu } from "@/components/staff-profile-menu";

export function StaffHeader() {
  return (
    <Container className="flex h-14 items-center justify-end gap-3">
      <StaffLocaleSwitcher />
      <StaffProfileMenu />
    </Container>
  );
}
