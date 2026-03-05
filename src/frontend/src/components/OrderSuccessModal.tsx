import { useNavigate } from "@tanstack/react-router";
import { CheckCircle2 } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useCartStore } from "../store/useStore";

interface OrderSuccessModalProps {
  isOpen: boolean;
  orderNumber: number;
  onClose: () => void;
}

export function OrderSuccessModal({
  isOpen,
  orderNumber,
  onClose,
}: OrderSuccessModalProps) {
  const navigate = useNavigate();
  const clearCart = useCartStore((s) => s.clearCart);

  const handleClose = () => {
    onClose();
    clearCart();
    navigate({ to: "/menu" });
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50"
            style={{
              background: "rgba(0,0,0,0.8)",
              backdropFilter: "blur(4px)",
            }}
          />

          {/* Modal */}
          <motion.div
            data-ocid="success.modal"
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none"
          >
            <div
              className="w-full max-w-md rounded-2xl p-8 pointer-events-auto text-center relative overflow-hidden"
              style={{
                background: "linear-gradient(145deg, #241b17 0%, #2a1f1a 100%)",
                border: "1px solid #3a2e28",
                boxShadow: "0 25px 80px rgba(0,0,0,0.7)",
              }}
            >
              {/* Corner accents */}
              <div
                className="absolute top-0 left-0 w-16 h-16"
                style={{
                  background:
                    "linear-gradient(135deg, rgba(76,175,80,0.12) 0%, transparent 70%)",
                }}
              />
              <div
                className="absolute bottom-0 right-0 w-16 h-16"
                style={{
                  background:
                    "linear-gradient(315deg, rgba(76,175,80,0.12) 0%, transparent 70%)",
                }}
              />

              {/* Success icon */}
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{
                  delay: 0.1,
                  type: "spring",
                  stiffness: 300,
                  damping: 20,
                }}
                className="flex justify-center mb-6"
              >
                <div
                  className="w-20 h-20 rounded-full flex items-center justify-center"
                  style={{
                    background: "rgba(76, 175, 80, 0.12)",
                    border: "2px solid rgba(76, 175, 80, 0.4)",
                  }}
                >
                  <CheckCircle2 size={40} color="#4caf50" />
                </div>
              </motion.div>

              {/* Content */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <h2
                  className="font-display text-2xl font-bold mb-4"
                  style={{ color: "#4caf50" }}
                >
                  Pasūtījums pieņemts
                </h2>

                <p
                  className="text-sm leading-relaxed mb-2"
                  style={{ color: "#a0967a" }}
                >
                  Jūsu pasūtījums{" "}
                  <span className="font-semibold" style={{ color: "#d4af37" }}>
                    Nr. {orderNumber}
                  </span>{" "}
                  ir pieņemts un tiek apstrādāts.
                </p>
                <p
                  className="text-sm leading-relaxed mb-8"
                  style={{ color: "#a0967a" }}
                >
                  Tuvākajā laikā sazināsimies ar Jums.
                </p>

                {/* Decorative divider */}
                <div
                  className="mx-auto w-16 h-px mb-8"
                  style={{
                    background:
                      "linear-gradient(90deg, transparent, #4caf50, transparent)",
                  }}
                />

                {/* Single Labi button */}
                <button
                  type="button"
                  data-ocid="success.close_button"
                  onClick={handleClose}
                  className="w-full py-3 rounded-xl text-sm font-bold tracking-widest uppercase transition-all hover:brightness-110 active:scale-[0.98]"
                  style={{ background: "#d4af37", color: "#1b1412" }}
                >
                  Labi
                </button>
              </motion.div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
