import { X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { toast } from "sonner";
import { useCartStore } from "../store/useStore";

const PLACEHOLDER = "/assets/generated/sushi-roll-placeholder.dim_600x400.jpg";

const UPSELL_ITEMS = [
  {
    productId: 8,
    name: "Spicy Tuna Roll",
    price: 9.0,
    pieceCount: "8 gab",
    image: PLACEHOLDER,
  },
  {
    productId: 9,
    name: "Salmon Roll",
    price: 8.0,
    pieceCount: "8 gab",
    image: PLACEHOLDER,
  },
  {
    productId: 11,
    name: "Pepsi",
    price: 2.5,
    pieceCount: "0.5L",
    image: PLACEHOLDER,
  },
] as const;

interface UpsellModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function UpsellModal({ isOpen, onClose }: UpsellModalProps) {
  const addItem = useCartStore((s) => s.addItem);

  const handleAdd = (item: (typeof UPSELL_ITEMS)[number]) => {
    addItem({
      productId: item.productId,
      name: item.name,
      price: item.price,
      image: item.image,
    });
    toast.success("Pievienots grozam", {
      description: item.name,
      duration: 2000,
    });
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            key="upsell-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50"
            style={{
              background: "rgba(0,0,0,0.7)",
              backdropFilter: "blur(4px)",
            }}
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            key="upsell-modal"
            data-ocid="upsell.modal"
            initial={{ opacity: 0, scale: 0.92, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 20 }}
            transition={{
              duration: 0.25,
              type: "spring",
              stiffness: 280,
              damping: 28,
            }}
            className="fixed inset-0 z-50 flex items-center justify-center px-4 pointer-events-none"
          >
            <div
              className="w-full max-w-md rounded-2xl overflow-hidden pointer-events-auto"
              style={{
                background: "linear-gradient(145deg, #241b17 0%, #2e211a 100%)",
                border: "1px solid rgba(212,175,55,0.3)",
                boxShadow: "0 24px 60px rgba(0,0,0,0.8)",
              }}
            >
              {/* Header */}
              <div
                className="flex items-center justify-between px-6 py-5"
                style={{ borderBottom: "1px solid #3a2e28" }}
              >
                <div>
                  <p
                    className="text-xs font-semibold tracking-[0.3em] uppercase mb-0.5"
                    style={{ color: "#d4af37" }}
                  >
                    Ieteikumi
                  </p>
                  <h2
                    className="font-display text-xl font-bold"
                    style={{ color: "#f5f5f5" }}
                  >
                    Bieži pievieno kopā
                  </h2>
                </div>
                <button
                  type="button"
                  data-ocid="upsell.close_button"
                  onClick={onClose}
                  className="w-8 h-8 flex items-center justify-center rounded-full transition-all hover:bg-[#3a2e28]"
                  style={{ color: "#7a6e5a" }}
                  aria-label="Aizvērt"
                >
                  <X size={16} />
                </button>
              </div>

              {/* Upsell items */}
              <div className="px-6 py-5 space-y-3">
                {UPSELL_ITEMS.map((item, idx) => (
                  <div
                    key={item.productId}
                    data-ocid={`upsell.item.${idx + 1}`}
                    className="flex items-center gap-4 p-3 rounded-xl"
                    style={{
                      background: "rgba(27,20,18,0.6)",
                      border: "1px solid #3a2e28",
                    }}
                  >
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-14 h-14 object-cover rounded-lg flex-shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <p
                        className="font-semibold text-sm truncate"
                        style={{ color: "#f5f5f5" }}
                      >
                        {item.name}
                      </p>
                    </div>
                    <div className="flex items-center gap-3 flex-shrink-0">
                      <span
                        className="font-display font-bold text-base"
                        style={{ color: "#d4af37" }}
                      >
                        {item.price % 1 === 0
                          ? item.price
                          : item.price.toFixed(2)}
                        €
                      </span>
                      <button
                        type="button"
                        data-ocid={`upsell.add_button.${idx + 1}`}
                        onClick={() => handleAdd(item)}
                        className="px-4 py-1.5 rounded-lg text-xs font-bold tracking-wide uppercase transition-all hover:brightness-110 active:scale-95"
                        style={{ background: "#d4af37", color: "#1b1412" }}
                      >
                        Pievienot
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Footer */}
              <div className="px-6 pb-6" style={{ paddingTop: "2px" }}>
                <button
                  type="button"
                  data-ocid="upsell.close_button"
                  onClick={onClose}
                  className="w-full py-3 rounded-xl text-sm font-semibold tracking-wide uppercase transition-all hover:brightness-110 active:scale-95"
                  style={{
                    border: "1px solid rgba(212,175,55,0.35)",
                    color: "#d4af37",
                    background: "rgba(212,175,55,0.06)",
                  }}
                >
                  Turpināt
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
