import { ShoppingBag } from "lucide-react";
import { motion } from "motion/react";
import { toast } from "sonner";
import type { Product } from "../store/types";
import { useCartStore } from "../store/useStore";

interface ProductCardProps {
  product: Product;
  index: number;
  onSetAdded?: () => void;
}

const PLACEHOLDER = "/assets/generated/sushi-roll-placeholder.dim_600x400.jpg";

export function ProductCard({ product, index, onSetAdded }: ProductCardProps) {
  const addItem = useCartStore((s) => s.addItem);

  const handleAddToCart = () => {
    addItem({
      productId: product.id,
      name: product.name,
      price: product.price,
      image: product.image || PLACEHOLDER,
    });
    toast.success("Pievienots grozam", {
      description: product.name,
      duration: 2000,
    });
    if (product.category === "set") {
      onSetAdded?.();
    }
  };

  return (
    <motion.div
      data-ocid={`menu.product_card.${index + 1}`}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay: index * 0.06 }}
      className="group flex flex-col overflow-hidden rounded-xl"
      style={{
        background: "#241b17",
        border: "1px solid #3a2e28",
        transition: "border-color 0.3s, box-shadow 0.3s",
      }}
      whileHover={{
        borderColor: "rgba(212, 175, 55, 0.4)",
        boxShadow: "0 8px 40px rgba(0,0,0,0.6)",
        transition: { duration: 0.2 },
      }}
    >
      {/* Image */}
      <div className="relative overflow-hidden" style={{ aspectRatio: "4/3" }}>
        <img
          src={product.image || PLACEHOLDER}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />
        {/* Category badge */}
        <div
          className="absolute top-3 right-3 px-2 py-0.5 rounded text-xs font-semibold tracking-wider uppercase"
          style={{
            background: "rgba(27,20,18,0.85)",
            color: "#d4af37",
            backdropFilter: "blur(4px)",
          }}
        >
          {product.category === "set"
            ? "Komplekts"
            : product.category === "addon"
              ? "Pielikums"
              : "Dzēriens"}
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-col flex-1 p-5">
        <h3
          className="font-display text-lg font-semibold mb-1 leading-snug"
          style={{ color: "#f5f5f5" }}
        >
          {product.name}
        </h3>

        <div className="flex flex-col gap-0.5 mb-4">
          {/* Description line: show description (derived from peopleRecommended) */}
          {(product.description || product.peopleRecommended) && (
            <span className="text-sm" style={{ color: "#a0967a" }}>
              {product.description || product.peopleRecommended}
            </span>
          )}
          {/* Piece count: show if not empty */}
          {product.pieceCount && (
            <span className="text-xs" style={{ color: "#7a6e5a" }}>
              {product.pieceCount}
            </span>
          )}
        </div>

        <div className="mt-auto flex items-center justify-between gap-3">
          <span
            className="font-display text-2xl font-bold"
            style={{ color: "#d4af37" }}
          >
            {product.price % 1 === 0 ? product.price : product.price.toFixed(2)}{" "}
            €
          </span>

          <button
            type="button"
            data-ocid="product.add_to_cart_button"
            onClick={handleAddToCart}
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold tracking-wide transition-all hover:brightness-110 active:scale-95"
            style={{ background: "#d4af37", color: "#1b1412" }}
          >
            <ShoppingBag size={15} />
            <span>Pievienot grozam</span>
          </button>
        </div>
      </div>
    </motion.div>
  );
}
