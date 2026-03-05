import { useQuery, useQueryClient } from "@tanstack/react-query";
import { motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { Footer } from "../components/Footer";
import { ProductCard } from "../components/ProductCard";
import { StickyCartBar } from "../components/StickyCartBar";
import { UpsellModal } from "../components/UpsellModal";
import { Skeleton } from "../components/ui/skeleton";
import { useActor } from "../hooks/useActor";
import type { Product, ProductCategory } from "../store/types";
import { seedIfEmpty } from "../utils/seedProducts";

function ProductCardSkeleton() {
  return (
    <div
      className="flex flex-col overflow-hidden rounded-xl"
      style={{ background: "#241b17", border: "1px solid #3a2e28" }}
    >
      <Skeleton
        className="w-full"
        style={{ aspectRatio: "4/3", background: "#2e211a" }}
      />
      <div className="p-5 space-y-3">
        <Skeleton className="h-5 w-3/4" style={{ background: "#2e211a" }} />
        <Skeleton className="h-4 w-1/2" style={{ background: "#2e211a" }} />
        <div className="flex items-center justify-between pt-2">
          <Skeleton className="h-7 w-16" style={{ background: "#2e211a" }} />
          <Skeleton
            className="h-9 w-28 rounded-lg"
            style={{ background: "#2e211a" }}
          />
        </div>
      </div>
    </div>
  );
}

interface MenuSection {
  key: string;
  label: string;
  description: string;
  items: Product[];
}

function buildMenuSections(products: Product[]): MenuSection[] {
  const enabled = products.filter((p) => p.enabled);

  const sets = [...enabled.filter((p) => p.category === "set")].sort(
    (a, b) => a.id - b.id,
  );
  const addons = enabled.filter((p) => p.category === "addon");
  const drinks = enabled.filter((p) => p.category === "drink");

  const sections: MenuSection[] = [];

  if (sets.length > 0) {
    sections.push({
      key: "sushi-komplekti",
      label: "SUSHI KOMPLEKTI",
      description: "Rūpīgi veidoti seti 2–6 personām",
      items: sets,
    });
  }

  if (addons.length > 0) {
    sections.push({
      key: "roli",
      label: "ROLI",
      description: "Papildiniet savu pasūtījumu ar klasiskajiem ruļļiem",
      items: addons,
    });
  }

  if (drinks.length > 0) {
    sections.push({
      key: "dzerieni",
      label: "DZĒRIENI",
      description: "Atspirdzinošie dzērieni jūsu maltītei",
      items: drinks,
    });
  }

  return sections;
}

export function MenuPage() {
  const { actor, isFetching: actorFetching } = useActor();
  const queryClient = useQueryClient();
  const seededRef = useRef(false);
  const [showUpsell, setShowUpsell] = useState(false);

  const { data: products = [], isLoading } = useQuery<Product[]>({
    queryKey: ["products"],
    queryFn: async () => {
      if (!actor) return [];
      const raw = await actor.getProducts();
      return raw.map((p) => ({
        id: Number(p.id),
        name: p.name,
        price: p.price,
        image: p.image,
        pieceCount: p.pieceCount,
        peopleRecommended: p.peopleRecommended,
        description: p.peopleRecommended, // derive description for display
        category: p.category as ProductCategory,
        enabled: p.enabled,
      }));
    },
    enabled: !!actor && !actorFetching,
  });

  // If products storage is empty, seed initial data and reload
  useEffect(() => {
    if (!actor || actorFetching || isLoading || seededRef.current) return;
    if (products.length === 0) {
      seededRef.current = true;
      seedIfEmpty(actor).then((didSeed) => {
        if (didSeed) {
          queryClient.invalidateQueries({ queryKey: ["products"] });
        }
      });
    }
  }, [actor, actorFetching, isLoading, products.length, queryClient]);

  const loading = isLoading || actorFetching;
  const sections = buildMenuSections(products);

  // Track cumulative index for data-ocid markers
  let globalIndex = 0;

  return (
    <div
      className="min-h-screen flex flex-col pt-16"
      style={{ background: "#1b1412" }}
    >
      {/* Page header */}
      <div
        className="py-16 px-4 text-center relative overflow-hidden"
        style={{
          background: "linear-gradient(180deg, #150f0d 0%, #1b1412 100%)",
        }}
      >
        <div
          className="absolute top-0 left-1/2 -translate-x-1/2 w-24 h-px"
          style={{
            background:
              "linear-gradient(90deg, transparent, #d4af37, transparent)",
          }}
        />
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-xs font-semibold tracking-[0.4em] uppercase mb-3"
          style={{ color: "#d4af37" }}
        >
          Mūsu piedāvājums
        </motion.p>
        <motion.h1
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="font-display text-4xl md:text-5xl font-bold"
          style={{ color: "#f5f5f5" }}
        >
          Ēdienkarte
        </motion.h1>
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="mx-auto mt-5 h-px w-24"
          style={{
            background:
              "linear-gradient(90deg, transparent, #d4af37, transparent)",
          }}
        />
      </div>

      {/* Menu sections */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 pb-24">
        {loading ? (
          /* Loading skeletons */
          <section className="mb-20 mt-8" data-ocid="menu.loading_state">
            <div
              className="mb-10 pb-4"
              style={{ borderBottom: "1px solid #3a2e28" }}
            >
              <div className="flex items-center gap-3 mb-2">
                <div
                  className="w-1 h-8 rounded-full"
                  style={{ background: "#3a2e28" }}
                />
                <Skeleton
                  className="h-7 w-32"
                  style={{ background: "#2e211a" }}
                />
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {Array.from({ length: 7 }).map((_, i) => (
                // biome-ignore lint/suspicious/noArrayIndexKey: static skeleton list
                <ProductCardSkeleton key={i} />
              ))}
            </div>
          </section>
        ) : products.length === 0 ? (
          <div
            className="flex flex-col items-center justify-center py-32 text-center"
            data-ocid="menu.empty_state"
          >
            <p className="text-sm" style={{ color: "#7a6e5a" }}>
              Pašlaik ēdienkarte tiek gatavota.
            </p>
          </div>
        ) : (
          sections.map((section) => {
            return (
              <section key={section.key} className="mb-20 mt-8 first:mt-0">
                {/* Section heading */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  className="mb-10 pb-4"
                  style={{ borderBottom: "1px solid #3a2e28" }}
                >
                  <div className="flex items-center gap-3 mb-2">
                    <div
                      className="w-1 h-8 rounded-full"
                      style={{ background: "#d4af37" }}
                    />
                    <h2
                      className="font-display text-2xl md:text-3xl font-bold"
                      style={{ color: "#f5f5f5" }}
                    >
                      {section.label}
                    </h2>
                  </div>
                  <p className="text-sm ml-4" style={{ color: "#a0967a" }}>
                    {section.description}
                  </p>
                </motion.div>

                {/* Product grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {section.items.map((product) => {
                    const cardIndex = globalIndex;
                    globalIndex++;
                    return (
                      <div key={product.id}>
                        <ProductCard
                          product={product}
                          index={cardIndex}
                          onSetAdded={
                            product.category === "set"
                              ? () => setShowUpsell(true)
                              : undefined
                          }
                        />
                      </div>
                    );
                  })}
                </div>
              </section>
            );
          })
        )}
      </main>

      <Footer />
      <StickyCartBar />
      <UpsellModal isOpen={showUpsell} onClose={() => setShowUpsell(false)} />
    </div>
  );
}
