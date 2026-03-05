import { Link, useNavigate } from "@tanstack/react-router";
import { Menu, ShoppingBag, X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { useCartStore } from "../store/useStore";

export function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const items = useCartStore((s) => s.items);
  const itemCount = useCartStore((s) => s.itemCount)();
  const navigate = useNavigate();

  return (
    <header
      className="fixed top-0 left-0 right-0 z-50"
      style={{
        background:
          "linear-gradient(180deg, rgba(27,20,18,0.98) 0%, rgba(27,20,18,0.92) 100%)",
        backdropFilter: "blur(12px)",
        borderBottom: "1px solid #3a2e28",
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link
            to="/home"
            className="font-display text-3xl font-bold tracking-[0.2em] transition-opacity hover:opacity-80"
            style={{ color: "#d4af37", letterSpacing: "0.25em" }}
          >
            SETE
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-8">
            <Link
              to="/menu"
              data-ocid="nav.menu_link"
              className="text-sm font-medium tracking-widest uppercase transition-colors hover:text-[#d4af37]"
              style={{ color: "#a0967a", letterSpacing: "0.12em" }}
            >
              Ēdienkarte
            </Link>
          </nav>

          {/* Cart icon */}
          <div className="flex items-center gap-4">
            <button
              type="button"
              data-ocid="nav.cart_link"
              onClick={() => navigate({ to: "/cart" })}
              className="relative p-2 transition-colors hover:text-[#d4af37]"
              style={{ color: "#a0967a" }}
              aria-label={`Grozs — ${itemCount} prece(s)`}
            >
              <ShoppingBag size={22} />
              {items.length > 0 && (
                <motion.span
                  key={itemCount}
                  initial={{ scale: 0.5, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="absolute -top-1 -right-1 w-5 h-5 rounded-full text-xs font-bold flex items-center justify-center"
                  style={{ background: "#d4af37", color: "#1b1412" }}
                >
                  {itemCount > 9 ? "9+" : itemCount}
                </motion.span>
              )}
            </button>

            {/* Mobile menu toggle */}
            <button
              type="button"
              className="md:hidden p-2 transition-colors hover:text-[#d4af37]"
              style={{ color: "#a0967a" }}
              onClick={() => setMobileOpen((v) => !v)}
              aria-label="Izvēlne"
            >
              {mobileOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile nav */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden overflow-hidden"
            style={{ borderTop: "1px solid #3a2e28", background: "#1b1412" }}
          >
            <nav className="flex flex-col px-6 py-4 gap-4">
              <Link
                to="/menu"
                data-ocid="nav.menu_link"
                className="text-sm font-medium tracking-widest uppercase py-2 transition-colors hover:text-[#d4af37]"
                style={{ color: "#a0967a" }}
                onClick={() => setMobileOpen(false)}
              >
                Ēdienkarte
              </Link>
              <Link
                to="/cart"
                data-ocid="nav.cart_link"
                className="text-sm font-medium tracking-widest uppercase py-2 transition-colors hover:text-[#d4af37]"
                style={{ color: "#a0967a" }}
                onClick={() => setMobileOpen(false)}
              >
                Grozs {itemCount > 0 && `(${itemCount})`}
              </Link>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
