import type { BadgeKind, Product } from "@/components/ProductCard";

export interface ProductWithFilter extends Product {
  materialType: "silk" | "cotton" | "modal";
}

export const PRODUCTS: ProductWithFilter[] = [
  {
    name: "Carmin",
    material: "Heavy silk twill · 90×90",
    price: "$240",
    badge: "new" as BadgeKind,
    badgeLabel: "New",
    materialType: "silk",
  },
  {
    name: "Suspiro",
    material: "Cotton voile · 120×120",
    price: "$180",
    badge: "count" as BadgeKind,
    badgeLabel: "42 pieces",
    materialType: "cotton",
  },
  {
    name: "Rosa",
    material: "Modal silk · 90×90",
    price: "$210",
    badge: null,
    materialType: "modal",
  },
  {
    name: "Kahwa",
    material: "Heavy silk twill · 90×90",
    price: "$240",
    badge: "final" as BadgeKind,
    badgeLabel: "Final piece",
    materialType: "silk",
  },
];
