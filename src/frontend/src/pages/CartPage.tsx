import { Link, useNavigate } from "@tanstack/react-router";
import {
  ArrowLeft,
  ArrowRight,
  Minus,
  Plus,
  ShoppingBag,
  Trash2,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { Footer } from "../components/Footer";
import { StickyCartBar } from "../components/StickyCartBar";
import { useCartStore } from "../store/useStore";

const PLACEHOLDER = "/assets/generated/sushi-roll-placeholder.dim_600x400.jpg";

export function CartPage() {
  const navigate = useNavigate();
  const items = useCartStore((s) => s.items);
  const removeItem = useCartStore((s) => s.removeItem);
  const updateQuantity = useCartStore((s) => s.updateQuantity);
  const itemCount = useCartStore((s) => s.itemCount)();
  const totalPrice = useCartStore((s) => s.totalPrice)();

  return (
    <div
      className="min-h-screen flex flex-col pt-16"
      style={{ background: "#1b1412" }}
    >
      {/* Page header */}
      <div
        className="py-12 px-4 relative overflow-hidden"
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
        <div className="max-w-4xl mx-auto">
          <motion.h1
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="font-display text-3xl md:text-4xl font-bold"
            style={{ color: "#f5f5f5" }}
          >
            Grozs
          </motion.h1>
        </div>
      </div>

      <main className="flex-1 max-w-4xl mx-auto w-full px-4 sm:px-6 py-8">
        {items.length === 0 ? (
          /* Empty state */
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center justify-center py-24 text-center"
            data-ocid="cart.empty_state"
          >
            <div
              className="w-24 h-24 rounded-full flex items-center justify-center mb-6"
              style={{
                background: "rgba(212,175,55,0.08)",
                border: "1px solid rgba(212,175,55,0.2)",
              }}
            >
              <ShoppingBag size={36} style={{ color: "#d4af37" }} />
            </div>
            <h2
              className="font-display text-2xl font-bold mb-3"
              style={{ color: "#f5f5f5" }}
            >
              Grozs ir tukšs
            </h2>
            <p className="text-sm mb-8" style={{ color: "#a0967a" }}>
              Dodieties uz piedāvājumiem un pievienojiet setus.
            </p>
            <Link
              to="/menu"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-sm font-bold tracking-widest uppercase transition-all hover:brightness-110"
              style={{ background: "#d4af37", color: "#1b1412" }}
            >
              <ArrowLeft size={16} />
              Apskatīt piedāvājumus
            </Link>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart items */}
            <div className="lg:col-span-2 space-y-4">
              <AnimatePresence>
                {items.map((item, i) => (
                  <motion.div
                    key={item.productId}
                    data-ocid={`cart.item.${i + 1}`}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20, height: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className="flex items-center gap-4 p-4 rounded-xl"
                    style={{
                      background: "#241b17",
                      border: "1px solid #3a2e28",
                    }}
                  >
                    {/* Image */}
                    <div className="w-20 h-16 rounded-lg overflow-hidden flex-shrink-0">
                      <img
                        src={item.image || PLACEHOLDER}
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    {/* Name & price */}
                    <div className="flex-1 min-w-0">
                      <p
                        className="font-display font-semibold text-sm truncate"
                        style={{ color: "#f5f5f5" }}
                      >
                        {item.name}
                      </p>
                      <p
                        className="text-sm mt-0.5"
                        style={{ color: "#d4af37" }}
                      >
                        {item.price % 1 === 0
                          ? item.price
                          : item.price.toFixed(2)}{" "}
                        € / gab
                      </p>
                    </div>

                    {/* Quantity controls */}
                    <div
                      className="flex items-center gap-2 rounded-lg px-2 py-1"
                      style={{ border: "1px solid #3a2e28" }}
                    >
                      <button
                        type="button"
                        onClick={() =>
                          updateQuantity(item.productId, item.quantity - 1)
                        }
                        className="w-7 h-7 flex items-center justify-center rounded transition-colors hover:bg-[#3a2e28]"
                        style={{ color: "#a0967a" }}
                        aria-label="Samazināt daudzumu"
                      >
                        <Minus size={14} />
                      </button>
                      <span
                        className="w-6 text-center text-sm font-semibold"
                        style={{ color: "#f5f5f5" }}
                      >
                        {item.quantity}
                      </span>
                      <button
                        type="button"
                        onClick={() =>
                          updateQuantity(item.productId, item.quantity + 1)
                        }
                        className="w-7 h-7 flex items-center justify-center rounded transition-colors hover:bg-[#3a2e28]"
                        style={{ color: "#a0967a" }}
                        aria-label="Palielināt daudzumu"
                      >
                        <Plus size={14} />
                      </button>
                    </div>

                    {/* Line total */}
                    <div className="text-right min-w-[60px]">
                      <p
                        className="font-semibold text-sm"
                        style={{ color: "#f5f5f5" }}
                      >
                        {(item.price * item.quantity) % 1 === 0
                          ? item.price * item.quantity
                          : (item.price * item.quantity).toFixed(2)}{" "}
                        €
                      </p>
                    </div>

                    {/* Remove */}
                    <button
                      type="button"
                      onClick={() => removeItem(item.productId)}
                      className="p-2 rounded-lg transition-colors hover:bg-red-900/20"
                      style={{ color: "#7a6e5a" }}
                      aria-label={`Noņemt ${item.name}`}
                    >
                      <Trash2 size={16} />
                    </button>
                  </motion.div>
                ))}
              </AnimatePresence>

              {/* Back to menu */}
              <div className="pt-2">
                <Link
                  to="/menu"
                  className="inline-flex items-center gap-2 text-sm transition-colors hover:text-[#d4af37]"
                  style={{ color: "#a0967a" }}
                >
                  <ArrowLeft size={15} />
                  Turpināt iepirkties
                </Link>
              </div>
            </div>

            {/* Order summary */}
            <div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="rounded-xl p-6 sticky top-24"
                style={{ background: "#241b17", border: "1px solid #3a2e28" }}
              >
                <h2
                  className="font-display text-xl font-bold mb-6"
                  style={{ color: "#f5f5f5" }}
                >
                  Pasūtījuma kopsavilkums
                </h2>

                <div className="space-y-3 mb-6">
                  {items.map((item) => (
                    <div
                      key={item.productId}
                      className="flex justify-between text-sm"
                    >
                      <span style={{ color: "#a0967a" }}>
                        {item.name} × {item.quantity}
                      </span>
                      <span style={{ color: "#f5f5f5" }}>
                        {(item.price * item.quantity) % 1 === 0
                          ? item.price * item.quantity
                          : (item.price * item.quantity).toFixed(2)}{" "}
                        €
                      </span>
                    </div>
                  ))}
                </div>

                <div
                  className="py-4 mb-6"
                  style={{ borderTop: "1px solid #3a2e28" }}
                >
                  <div className="flex justify-between items-center">
                    <span className="text-sm" style={{ color: "#a0967a" }}>
                      Kopā ({itemCount} prece{itemCount !== 1 ? "s" : ""})
                    </span>
                    <span
                      className="font-display text-2xl font-bold"
                      style={{ color: "#d4af37" }}
                    >
                      {totalPrice % 1 === 0
                        ? totalPrice
                        : totalPrice.toFixed(2)}{" "}
                      €
                    </span>
                  </div>
                  <p className="text-xs mt-1" style={{ color: "#7a6e5a" }}>
                    Bez piegādes maksas
                  </p>
                </div>

                <button
                  type="button"
                  data-ocid="cart.checkout_button"
                  onClick={() => navigate({ to: "/checkout" })}
                  className="w-full flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-bold tracking-widest uppercase transition-all hover:brightness-110 active:scale-[0.98]"
                  style={{ background: "#d4af37", color: "#1b1412" }}
                >
                  Turpināt uz noformēšanu
                  <ArrowRight size={16} />
                </button>
              </motion.div>
            </div>
          </div>
        )}
      </main>

      <Footer />
      <StickyCartBar />
    </div>
  );
}
