"use client";

import { createContext, useContext, useEffect, useState } from "react";

export interface CartItem {
  productId: string | number;
  name: string;
  name_ar?: string | null;
  material: string;
  price: string;
  quantity: number;
}

interface CartContextType {
  items: CartItem[];
  totalCount: number;
  addItem: (item: Omit<CartItem, "quantity"> & { quantity?: number }) => void;
  removeItem: (productId: string | number) => void;
  updateQuantity: (productId: string | number, qty: number) => void;
  clearCart: () => void;
}

const CartContext = createContext<CartContextType | null>(null);

const STORAGE_KEY = "belta-cart";

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setItems(JSON.parse(raw));
    } catch {
      // ignore
    }
  }, []);

  // Persist to localStorage on every change
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {
      // ignore
    }
  }, [items]);

  const addItem = (incoming: Omit<CartItem, "quantity"> & { quantity?: number }) => {
    const qty = incoming.quantity ?? 1;
    setItems((prev) => {
      const existing = prev.find((i) => i.productId === incoming.productId);
      if (existing) {
        return prev.map((i) =>
          i.productId === incoming.productId
            ? { ...i, quantity: i.quantity + qty }
            : i
        );
      }
      return [...prev, { ...incoming, quantity: qty }];
    });
  };

  const removeItem = (productId: string | number) =>
    setItems((prev) => prev.filter((i) => i.productId !== productId));

  const updateQuantity = (productId: string | number, qty: number) => {
    if (qty <= 0) {
      removeItem(productId);
      return;
    }
    setItems((prev) =>
      prev.map((i) => (i.productId === productId ? { ...i, quantity: qty } : i))
    );
  };

  const clearCart = () => setItems([]);

  const totalCount = items.reduce((sum, i) => sum + i.quantity, 0);

  return (
    <CartContext.Provider value={{ items, totalCount, addItem, removeItem, updateQuantity, clearCart }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used inside CartProvider");
  return ctx;
}
