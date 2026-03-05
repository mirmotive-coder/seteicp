/**
 * useProductSeed
 *
 * Ensures the backend has initial seed products loaded.
 *
 * The backend's Motoko actor seeds products on first install via `if (not seeded)`.
 * However, if the canister was upgraded after `seeded` became `true` but before
 * `products` was declared `stable var`, the products array ends up empty while
 * `seeded` remains `true` — so the Motoko seed block never re-runs.
 *
 * This hook detects that broken state on the frontend: if `getAllProducts()`
 * returns an empty array, it calls `actor.addProduct()` for each seed product
 * to restore the catalogue.
 */

import { useQueryClient } from "@tanstack/react-query";
import { useEffect, useRef } from "react";
import { useActor } from "./useActor";

interface SeedProduct {
  name: string;
  price: number;
  image: string;
  pieceCount: string;
  peopleRecommended: string;
  category: string;
}

const SEED_PRODUCTS: SeedProduct[] = [
  // Sets
  {
    name: "SETE 01",
    price: 25,
    image: "",
    pieceCount: "",
    peopleRecommended: "Sushi komplekts",
    category: "set",
  },
  {
    name: "SETE 02",
    price: 32,
    image: "",
    pieceCount: "",
    peopleRecommended: "Sushi komplekts",
    category: "set",
  },
  {
    name: "SETE 04",
    price: 45,
    image: "",
    pieceCount: "",
    peopleRecommended: "Sushi komplekts",
    category: "set",
  },
  // Addons
  {
    name: "Spicy Tuna Roll",
    price: 9,
    image: "",
    pieceCount: "8 gab",
    peopleRecommended: "Sushi rullītis",
    category: "addon",
  },
  // Drinks
  {
    name: "Pepsi",
    price: 2.5,
    image: "",
    pieceCount: "0.5L",
    peopleRecommended: "Dzēriens",
    category: "drink",
  },
];

/**
 * Call this hook once at app level (e.g. inside main.tsx wrapper or App.tsx).
 * It silently seeds the backend if products are missing; does nothing otherwise.
 */
export function useProductSeed() {
  const { actor, isFetching } = useActor();
  const queryClient = useQueryClient();
  const seededRef = useRef(false);

  useEffect(() => {
    // Only run once, only when actor is ready
    if (seededRef.current || !actor || isFetching) return;

    let cancelled = false;

    const checkAndSeed = async () => {
      try {
        // Use getAllProducts so we see disabled products too
        const existing = await actor.getAllProducts();
        if (cancelled) return;

        // Products exist — nothing to do
        if (existing && existing.length > 0) {
          seededRef.current = true;
          return;
        }

        // Products array is empty — seed sequentially to avoid rate-limit
        console.info(
          "[useProductSeed] No products found — seeding initial catalogue…",
        );
        for (const p of SEED_PRODUCTS) {
          if (cancelled) return;
          await actor.addProduct(
            p.name,
            p.price,
            p.image,
            p.pieceCount,
            p.peopleRecommended,
            p.category,
          );
        }
        console.info("[useProductSeed] Seeding complete.");

        seededRef.current = true;

        // Invalidate product queries so Menu + Admin pages re-fetch
        await queryClient.invalidateQueries({ queryKey: ["products"] });
        await queryClient.invalidateQueries({ queryKey: ["admin-products"] });
      } catch (err) {
        // Non-fatal: the menu will just show an empty state
        console.warn("[useProductSeed] Could not seed products:", err);
      }
    };

    checkAndSeed();

    return () => {
      cancelled = true;
    };
  }, [actor, isFetching, queryClient]);
}
