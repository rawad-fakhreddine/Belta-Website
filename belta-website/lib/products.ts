import type { BadgeKind, Product } from "@/components/ProductCard";

export interface ProductWithFilter extends Product {
  materialType: "silk" | "cotton" | "modal";
}

export const PRODUCTS: ProductWithFilter[] = [
  {
    id: 1,
    name: "Carmin",
    material: "Heavy silk twill · 90×90",
    price: "$240",
    badge: "new" as BadgeKind,
    badgeLabel: "New",
    materialType: "silk",
  },
  {
    id: 2,
    name: "Suspiro",
    material: "Cotton voile · 120×120",
    price: "$180",
    badge: "count" as BadgeKind,
    badgeLabel: "42 pieces",
    materialType: "cotton",
  },
  {
    id: 3,
    name: "Rosa",
    material: "Modal silk · 90×90",
    price: "$210",
    badge: null,
    materialType: "modal",
  },
  {
    id: 4,
    name: "Kahwa",
    material: "Heavy silk twill · 90×90",
    price: "$240",
    badge: "final" as BadgeKind,
    badgeLabel: "Final piece",
    materialType: "silk",
  },
  {
    id: 5,
    name: "Yasmine",
    material: "Silk chiffon · 90×90",
    price: "$195",
    badge: "new" as BadgeKind,
    badgeLabel: "New",
    materialType: "silk",
  },
  {
    id: 6,
    name: "Nour",
    material: "Modal blend · 120×120",
    price: "$160",
    badge: null,
    materialType: "modal",
  },
  {
    id: 7,
    name: "Leil",
    material: "Cotton muslin · 100×100",
    price: "$145",
    badge: "count" as BadgeKind,
    badgeLabel: "18 pieces",
    materialType: "cotton",
  },
  {
    id: 8,
    name: "Dahlia",
    material: "Heavy silk twill · 90×90",
    price: "$250",
    badge: null,
    materialType: "silk",
  },
];
