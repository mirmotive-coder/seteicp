import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { CartItem } from "./types";

// ── Cart store ─────────────────────────────────────────────────
interface CartState {
  items: CartItem[];
  addItem: (item: Omit<CartItem, "quantity">) => void;
  removeItem: (productId: number) => void;
  updateQuantity: (productId: number, quantity: number) => void;
  clearCart: () => void;
  itemCount: () => number;
  totalPrice: () => number;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      addItem: (newItem) =>
        set((state) => {
          const existing = state.items.find(
            (i) => i.productId === newItem.productId,
          );
          if (existing) {
            return {
              items: state.items.map((i) =>
                i.productId === newItem.productId
                  ? { ...i, quantity: i.quantity + 1 }
                  : i,
              ),
            };
          }
          return { items: [...state.items, { ...newItem, quantity: 1 }] };
        }),
      removeItem: (productId) =>
        set((state) => ({
          items: state.items.filter((i) => i.productId !== productId),
        })),
      updateQuantity: (productId, quantity) =>
        set((state) => {
          if (quantity <= 0) {
            return {
              items: state.items.filter((i) => i.productId !== productId),
            };
          }
          return {
            items: state.items.map((i) =>
              i.productId === productId ? { ...i, quantity } : i,
            ),
          };
        }),
      clearCart: () => set({ items: [] }),
      itemCount: () => get().items.reduce((sum, i) => sum + i.quantity, 0),
      totalPrice: () =>
        get().items.reduce((sum, i) => sum + i.price * i.quantity, 0),
    }),
    { name: "sete_cart" },
  ),
);

// ── Admin session (sessionStorage) ────────────────────────────
interface AdminState {
  isAdmin: boolean;
  login: (password: string) => boolean;
  logout: () => void;
}

export const useAdminStore = create<AdminState>()((set) => ({
  isAdmin:
    typeof window !== "undefined"
      ? sessionStorage.getItem("sete_admin") === "true"
      : false,
  login: (password) => {
    if (password === "1234") {
      sessionStorage.setItem("sete_admin", "true");
      set({ isAdmin: true });
      return true;
    }
    return false;
  },
  logout: () => {
    sessionStorage.removeItem("sete_admin");
    set({ isAdmin: false });
  },
}));
