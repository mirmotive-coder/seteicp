import { useNavigate } from "@tanstack/react-router";
import { ShoppingBag } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useCartStore } from "../store/useStore";

export function StickyCartBar() {
  const navigate = useNavigate();
  const items = useCartStore((s) => s.items);
  const itemCount = useCartStore((s) => s.itemCount)();
  const totalPrice = useCartStore((s) => s.totalPrice)();

  const priceFormatted =
    totalPrice % 1 === 0 ? `${totalPrice}` : totalPrice.toFixed(2);
  const label = `${itemCount} produkti | ${priceFormatted}€`;

  return (
    <AnimatePresence>
      {items.length > 0 && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          className="fixed bottom-0 left-0 right-0 z-40 pb-safe"
          style={{ paddingBottom: "env(safe-area-inset-bottom, 0px)" }}
        >
          <div
            className="mx-4 mb-4 rounded-xl flex items-center justify-between px-5 py-3 gap-4 shadow-[0_8px_40px_rgba(0,0,0,0.7)]"
            style={{
              background: "linear-gradient(135deg, #241b17 0%, #2e211a 100%)",
              border: "1px solid #d4af37",
            }}
          >
            <div className="flex items-center gap-3">
              <ShoppingBag size={18} style={{ color: "#d4af37" }} />
              <span
                className="text-sm font-medium"
                style={{ color: "#f5f5f5" }}
              >
                {label}
              </span>
            </div>

            <button
              type="button"
              data-ocid="sticky_cart.view_button"
              onClick={() => navigate({ to: "/cart" })}
              className="px-5 py-2 rounded-lg text-xs font-bold tracking-widest uppercase transition-all hover:brightness-110 active:scale-95"
              style={{ background: "#d4af37", color: "#1b1412" }}
            >
              SKATĪT GROZU
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
