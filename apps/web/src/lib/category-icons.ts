import {
  Building,
  Car,
  Folder,
  Laptop,
  Palette,
  Shirt,
  type LucideIcon,
} from "lucide-react";

export function getCategoryIcon(name: string): LucideIcon {
  const n = name.toLowerCase();
  if (n.includes("car") || n.includes("vehicle") || n.includes("سيار")) return Car;
  if (n.includes("real") || n.includes("property") || n.includes("building") || n.includes("عقار"))
    return Building;
  if (
    n.includes("electron") ||
    n.includes("device") ||
    n.includes("كمبيوتر") ||
    n.includes("أجهز")
  )
    return Laptop;
  if (n.includes("art") || n.includes("collect") || n.includes("فخر") || n.includes("تحف"))
    return Palette;
  if (n.includes("cloth") || n.includes("fashion") || n.includes("ملاب")) return Shirt;
  return Folder;
}

export const categoryIconAccents = [
  "bg-mazad-primary/10 text-mazad-primary group-hover:bg-mazad-primary group-hover:text-white",
  "bg-light-blue/20 text-mazad-primary group-hover:bg-mazad-primary group-hover:text-white",
  "bg-mazad-accent/10 text-mazad-accent group-hover:bg-mazad-accent group-hover:text-white",
  "bg-navy/8 text-navy group-hover:bg-navy group-hover:text-white",
] as const;
