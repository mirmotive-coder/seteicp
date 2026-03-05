/**
 * Seed initial products into the backend if products storage is empty.
 * Called on app startup from MenuPage and AdminProductsPage.
 */

export const INITIAL_PRODUCTS = [
  // Sets
  {
    name: "SETE 01",
    price: 25.0,
    image: "",
    pieceCount: "",
    peopleRecommended: "Sushi komplekts",
    category: "set",
  },
  {
    name: "SETE 02",
    price: 32.0,
    image: "",
    pieceCount: "",
    peopleRecommended: "Sushi komplekts",
    category: "set",
  },
  {
    name: "SETE 04",
    price: 45.0,
    image: "",
    pieceCount: "",
    peopleRecommended: "Sushi komplekts",
    category: "set",
  },
  // Addons
  {
    name: "Spicy Tuna Roll",
    price: 9.0,
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
] as const;

export async function seedIfEmpty(
  actor: Record<string, (...args: unknown[]) => Promise<unknown[]>>,
): Promise<boolean> {
  try {
    const existing = await actor.getAllProducts();
    if (existing && existing.length > 0) return false;

    // Storage is empty — seed all initial products
    for (const p of INITIAL_PRODUCTS) {
      await actor.addProduct(
        p.name,
        p.price,
        p.image,
        p.pieceCount,
        p.peopleRecommended,
        p.category,
      );
    }
    return true;
  } catch (err) {
    console.error("seedIfEmpty failed:", err);
    return false;
  }
}
