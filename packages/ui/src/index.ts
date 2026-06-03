export { cn } from "./utils";

/** Design tokens — single source of truth (TS). CSS mirror: `@mazad/ui/styles/tokens.css` */
export {
  tokens,
  colors,
  brandColors,
  spacing,
  layout,
  radius,
  shadows,
  motion,
  typography,
  type BrandColorKey,
  type MazadJoTokens,
} from "./tokens";

export {
  MOTION_SURFACES,
  STATIC_PRIMITIVES,
  isMotionSurface,
  type MotionSurface,
} from "./motion-policy";

export {
  geistMono,
  geistSans,
  mazadArabicBodyClassName,
  mazadBodyClassName,
  mazadFontVariables,
  mazadLatinFontVariables,
  notoArabic,
  primaryButtonClassName,
} from "./fonts";

/** Framer Motion presets — auction/marketing surfaces only */
export {
  motionDuration,
  motionEase,
  fadeIn,
  fadeInUp,
  fadeInDown,
  scaleIn,
  cardHover,
  buttonTap,
  staggerContainer,
  staggerItem,
} from "./motion";

export { BrandMark } from "./layout/brand-mark";
export { Container } from "./layout/container";
export { PageHeader } from "./layout/page-header";
export { AuthShell } from "./layout/auth-shell";
export { SplitAuthShell, type AuthInfoBlock } from "./layout/split-auth-shell";
export { StaffOverview, StaffShell } from "./layout/staff-shell";

/* Static primitives — shared by Web + Admin (CSS transitions only) */
export {
  Avatar,
  AvatarBadge,
  AvatarFallback,
  AvatarGroup,
  AvatarGroupCount,
  AvatarImage,
} from "./components/avatar";
export { Badge, badgeVariants } from "./components/badge";
export { Button, buttonVariants } from "./components/button";
export {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./components/card";
export {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogOverlay,
  DialogPortal,
  DialogTitle,
  DialogTrigger,
} from "./components/dialog";
export {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "./components/dropdown-menu";
export { Input } from "./components/input";
export { Label } from "./components/label";
export { Separator } from "./components/separator";
export {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "./components/sheet";
export { Skeleton } from "./components/skeleton";
export { Toaster } from "./components/sonner";
export { EmptyState } from "./components/empty-state";

/* Auction motion surfaces — web consumer experience */
export {
  HeroSection,
  AuctionCardShell,
  CountdownTimer,
  LiveAuctionIndicator,
  BidActivityFeed,
  BidActivityFeedAnimated,
  type AuctionCardShellProps,
  type BidActivityItem,
} from "./components/auction";
