"use client";

import { useEffect, useState, useCallback } from "react";

export interface CartItem {
  menuItemId: string;
  name: string;
  priceInCents: number;
  quantity: number;
  notes?: string;
}

export interface Cart {
  restaurantSlug: string;
  tableId?: string;
  items: CartItem[];
}

function getCartKey(restaurantSlug: string): string {
  return `cart_${restaurantSlug}`;
}

export function getCart(restaurantSlug: string): Cart {
  if (typeof window === "undefined") {
    return { restaurantSlug, items: [] };
  }

  try {
    const stored = localStorage.getItem(getCartKey(restaurantSlug));
    if (stored) {
      const cart = JSON.parse(stored) as Cart;
      return cart;
    }
  } catch {
    // Invalid JSON, reset cart
  }

  return { restaurantSlug, items: [] };
}

export function saveCart(cart: Cart): void {
  if (typeof window === "undefined") return;

  try {
    localStorage.setItem(getCartKey(cart.restaurantSlug), JSON.stringify(cart));
  } catch {
    // localStorage full or disabled
  }
}

export function clearCart(restaurantSlug: string): void {
  if (typeof window === "undefined") return;

  try {
    localStorage.removeItem(getCartKey(restaurantSlug));
  } catch {
    // Ignore errors
  }
}

export function useCart(restaurantSlug: string, tableId?: string) {
  const [cart, setCart] = useState<Cart>({ restaurantSlug, items: [] });
  const [isLoaded, setIsLoaded] = useState(false);

  // Load cart from localStorage on mount
  useEffect(() => {
    const storedCart = getCart(restaurantSlug);
    if (tableId) {
      storedCart.tableId = tableId;
    }
    setCart(storedCart);
    setIsLoaded(true);
  }, [restaurantSlug, tableId]);

  // Save cart to localStorage on change
  useEffect(() => {
    if (isLoaded) {
      saveCart(cart);
    }
  }, [cart, isLoaded]);

  const addItem = useCallback(
    (item: Omit<CartItem, "quantity"> & { quantity?: number }) => {
      setCart((prev) => {
        const existingIndex = prev.items.findIndex(
          (i) => i.menuItemId === item.menuItemId
        );

        if (existingIndex >= 0) {
          // Update existing item
          const newItems = [...prev.items];
          newItems[existingIndex] = {
            ...newItems[existingIndex],
            quantity: newItems[existingIndex].quantity + (item.quantity || 1),
          };
          return { ...prev, items: newItems };
        }

        // Add new item
        return {
          ...prev,
          items: [
            ...prev.items,
            {
              menuItemId: item.menuItemId,
              name: item.name,
              priceInCents: item.priceInCents,
              quantity: item.quantity || 1,
              notes: item.notes,
            },
          ],
        };
      });
    },
    []
  );

  const updateQuantity = useCallback(
    (menuItemId: string, quantity: number) => {
      setCart((prev) => {
        if (quantity <= 0) {
          return {
            ...prev,
            items: prev.items.filter((i) => i.menuItemId !== menuItemId),
          };
        }

        return {
          ...prev,
          items: prev.items.map((i) =>
            i.menuItemId === menuItemId ? { ...i, quantity } : i
          ),
        };
      });
    },
    []
  );

  const removeItem = useCallback((menuItemId: string) => {
    setCart((prev) => ({
      ...prev,
      items: prev.items.filter((i) => i.menuItemId !== menuItemId),
    }));
  }, []);

  const clear = useCallback(() => {
    setCart({ restaurantSlug, tableId, items: [] });
    clearCart(restaurantSlug);
  }, [restaurantSlug, tableId]);

  const totalItems = cart.items.reduce((sum, item) => sum + item.quantity, 0);
  const totalInCents = cart.items.reduce(
    (sum, item) => sum + item.priceInCents * item.quantity,
    0
  );

  return {
    cart,
    items: cart.items,
    tableId: cart.tableId,
    addItem,
    updateQuantity,
    removeItem,
    clear,
    totalItems,
    totalInCents,
    isLoaded,
  };
}

// Format price helper
export function formatPrice(cents: number, currency = "EUR"): string {
  return new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency,
  }).format(cents / 100);
}
