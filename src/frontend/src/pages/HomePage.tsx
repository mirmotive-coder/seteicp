import { Link } from "@tanstack/react-router";
import { ArrowRight, ChefHat, Leaf, UtensilsCrossed } from "lucide-react";
import { motion } from "motion/react";
import { Footer } from "../components/Footer";
import { StickyCartBar } from "../components/StickyCartBar";
import { useCartStore } from "../store/useStore";

const features = [
  {
    icon: Leaf,
    title: "Svaigākās sastāvdaļas",
    text: "Ikdienas piegādes no uzticamiem piegādātājiem.",
  },
  {
    icon: ChefHat,
    title: "Meistaru pieredze",
    text: "Sushi šefi ar ilggadēju pieredzi Japānas un Eiropas virtuvē.",
  },
  {
    icon: UtensilsCrossed,
    title: "Ideāli kopā ar draugiem",
    text: "Seti 2–6 personām — vakaram, svinībām vai banketam.",
  },
];

export function HomePage() {
  const addItem = useCartStore((s) => s.addItem);

  const handleOrderSete04 = () => {
    addItem({
      productId: 4,
      name: "Tempura Set",
      price: 45,
      image: "/assets/generated/sushi-roll-placeholder.dim_600x400.jpg",
    });
  };

  return (
    <div
      className="min-h-screen flex flex-col"
      style={{ background: "#1b1412" }}
    >
      {/* ── Hero Section — full-bleed background image ── */}
      <section
        className="relative flex items-center justify-center overflow-hidden"
        style={{
          minHeight: "100svh",
          backgroundImage:
            'url("/assets/generated/sushi-platter-hero.dim_900x700.jpg")',
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        {/* Dark overlay */}
        <div
          className="absolute inset-0"
          style={{ background: "rgba(0,0,0,0.55)", zIndex: 0 }}
        />

        {/* Subtle warm gold radial glow */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse at 50% 60%, rgba(212,175,55,0.07) 0%, transparent 65%)",
            zIndex: 1,
          }}
        />

        {/* Content column */}
        <div className="relative z-10 flex flex-col items-center text-center px-6 sm:px-10 pt-24 pb-16 w-full max-w-2xl mx-auto">
          {/* Top label pill */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0 }}
            className="mb-7"
          >
            <span
              className="inline-block text-xs font-semibold tracking-[0.4em] uppercase px-5 py-2 rounded-full"
              style={{
                color: "#d4af37",
                border: "1px solid rgba(212,175,55,0.45)",
                background: "rgba(0,0,0,0.35)",
                backdropFilter: "blur(8px)",
              }}
            >
              PREMIUM SUSHI · RĪGA
            </span>
          </motion.div>

          {/* Main title */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.15 }}
            className="font-display font-black leading-none mb-5"
            style={{
              fontSize: "clamp(5rem, 20vw, 10rem)",
              color: "#d4af37",
              textShadow:
                "0 0 60px rgba(212,175,55,0.35), 0 4px 30px rgba(0,0,0,0.6)",
              letterSpacing: "0.08em",
            }}
          >
            SETE
          </motion.h1>

          {/* Thin gold horizontal rule */}
          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 0.55, delay: 0.3 }}
            className="mb-6 h-px w-20"
            style={{
              background:
                "linear-gradient(90deg, transparent, #d4af37, transparent)",
            }}
          />

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="text-lg md:text-xl font-light mb-3"
            style={{ color: "#e8d8b4", letterSpacing: "0.22em" }}
          >
            Premium sushi Rīgā
          </motion.p>

          {/* Description */}
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="text-sm md:text-base mb-10 max-w-sm"
            style={{ color: "rgba(245,245,245,0.75)", lineHeight: 1.7 }}
          >
            Svaigi gatavoti sushi komplekti piegādei un līdzņemšanai.
          </motion.p>

          {/* Primary CTA with gold glow */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="mb-12"
          >
            <style>{`
              @keyframes goldPulse {
                0%, 100% { box-shadow: 0 0 20px rgba(212,175,55,0.5), 0 0 40px rgba(212,175,55,0.25); }
                50% { box-shadow: 0 0 30px rgba(212,175,55,0.7), 0 0 60px rgba(212,175,55,0.4), 0 0 80px rgba(212,175,55,0.15); }
              }
              .hero-cta-glow {
                animation: goldPulse 2.8s ease-in-out infinite;
              }
            `}</style>
            <Link
              to="/menu"
              data-ocid="hero.order_now_button"
              className="hero-cta-glow group inline-flex items-center gap-3 px-10 py-4 rounded-full text-sm font-bold tracking-[0.25em] uppercase transition-all hover:brightness-110 active:scale-95"
              style={{
                background: "#d4af37",
                color: "#1b1412",
                boxShadow:
                  "0 0 20px rgba(212,175,55,0.5), 0 0 40px rgba(212,175,55,0.25)",
              }}
            >
              PASŪTĪT TAGAD
              <ArrowRight
                size={15}
                className="transition-transform duration-300 group-hover:translate-x-1"
              />
            </Link>
          </motion.div>

          {/* ── Featured product highlight ── */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, delay: 0.8 }}
            className="w-full flex flex-col items-center"
          >
            {/* Label */}
            <p
              className="text-[10px] font-semibold tracking-[0.4em] uppercase mb-4"
              style={{ color: "#d4af37" }}
            >
              Populārākais komplekts
            </p>

            {/* Glass card */}
            <div
              data-ocid="hero.featured_product_card"
              className="w-full max-w-[280px] rounded-2xl overflow-hidden"
              style={{
                background: "rgba(27,20,18,0.82)",
                border: "1px solid rgba(212,175,55,0.3)",
                backdropFilter: "blur(12px)",
              }}
            >
              {/* Product image */}
              <div className="w-full" style={{ aspectRatio: "16/9" }}>
                <img
                  src="/assets/generated/sushi-roll-placeholder.dim_600x400.jpg"
                  alt="SETE 04 — sushi komplekts"
                  data-ocid="hero.featured_product_image"
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Card body */}
              <div className="px-5 py-4 flex flex-col gap-1">
                {/* Product name */}
                <p
                  className="text-sm font-semibold"
                  style={{ color: "#f5f5f5" }}
                >
                  SETE 04
                </p>

                {/* Piece count */}
                <p
                  className="text-xs"
                  style={{ color: "rgba(212,175,55,0.75)" }}
                >
                  48 gab
                </p>

                {/* Price */}
                <p
                  className="text-xl font-semibold mt-1"
                  style={{ color: "#d4af37" }}
                >
                  45€
                </p>

                {/* CTA button */}
                <button
                  type="button"
                  onClick={handleOrderSete04}
                  data-ocid="hero.featured_product.button"
                  className="mt-3 w-full py-2.5 rounded-full text-xs font-bold tracking-[0.2em] uppercase transition-all hover:brightness-110 active:scale-95"
                  style={{ background: "#d4af37", color: "#1b1412" }}
                >
                  PASŪTĪT
                </button>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Bottom gradient fade into page background */}
        <div
          className="absolute bottom-0 left-0 right-0 h-32 pointer-events-none"
          style={{
            background: "linear-gradient(0deg, #1b1412 0%, transparent 100%)",
            zIndex: 2,
          }}
        />
      </section>

      {/* Feature Section */}
      <section
        className="py-24 px-4 relative"
        style={{
          background: "linear-gradient(180deg, #1b1412 0%, #150f0d 100%)",
        }}
      >
        {/* Gold accent line */}
        <div
          className="absolute top-0 left-1/2 -translate-x-1/2 w-24 h-px"
          style={{
            background:
              "linear-gradient(90deg, transparent, #d4af37, transparent)",
          }}
        />

        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <p
              className="text-xs font-semibold tracking-[0.4em] uppercase mb-3"
              style={{ color: "#d4af37" }}
            >
              Kāpēc SETE
            </p>
            <h2
              className="font-display text-3xl md:text-4xl font-bold"
              style={{ color: "#f5f5f5" }}
            >
              Mūsu filozofija
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
            {features.map((f, i) => {
              const Icon = f.icon;
              return (
                <motion.div
                  key={f.title}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.15, duration: 0.5 }}
                  className="flex flex-col items-center text-center group"
                >
                  {/* Icon container */}
                  <div
                    className="w-16 h-16 rounded-full flex items-center justify-center mb-6 transition-all duration-300 group-hover:shadow-[0_0_20px_rgba(212,175,55,0.3)]"
                    style={{
                      background: "rgba(212,175,55,0.08)",
                      border: "1px solid rgba(212,175,55,0.25)",
                    }}
                  >
                    <Icon size={24} style={{ color: "#d4af37" }} />
                  </div>

                  <h3
                    className="font-display text-xl font-semibold mb-3"
                    style={{ color: "#f5f5f5" }}
                  >
                    {f.title}
                  </h3>

                  {/* Ornamental line */}
                  <div
                    className="w-8 h-px mb-3"
                    style={{ background: "#d4af37" }}
                  />

                  <p
                    className="text-sm leading-relaxed"
                    style={{ color: "#a0967a" }}
                  >
                    {f.text}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="py-20 px-4" style={{ background: "#150f0d" }}>
        <motion.div
          initial={{ opacity: 0, scale: 0.97 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="max-w-2xl mx-auto text-center"
        >
          <div
            className="p-12 rounded-2xl relative overflow-hidden"
            style={{
              background: "linear-gradient(135deg, #241b17 0%, #2e211a 100%)",
              border: "1px solid #3a2e28",
            }}
          >
            {/* Gold corner accents */}
            <div
              className="absolute top-0 left-0 w-20 h-20"
              style={{
                background:
                  "linear-gradient(135deg, rgba(212,175,55,0.15) 0%, transparent 70%)",
              }}
            />
            <div
              className="absolute bottom-0 right-0 w-20 h-20"
              style={{
                background:
                  "linear-gradient(315deg, rgba(212,175,55,0.15) 0%, transparent 70%)",
              }}
            />

            <p
              className="text-xs font-semibold tracking-[0.4em] uppercase mb-4"
              style={{ color: "#d4af37" }}
            >
              Pasūtiet tagad
            </p>
            <h2
              className="font-display text-3xl md:text-4xl font-bold mb-4"
              style={{ color: "#f5f5f5" }}
            >
              Bez reģistrācijas.
              <br />
              <span style={{ color: "#d4af37" }}>Ātri un vienkārši.</span>
            </h2>
            <p className="text-sm mb-8" style={{ color: "#a0967a" }}>
              Izvēlieties savu komplektu un pasūtiet dažu minūšu laikā.
            </p>
            <Link
              to="/menu"
              className="inline-flex items-center gap-2 px-8 py-3 rounded-full text-sm font-bold tracking-widest uppercase transition-all hover:brightness-110 active:scale-95"
              style={{ background: "#d4af37", color: "#1b1412" }}
            >
              Sākt pasūtīšanu
              <ArrowRight size={16} />
            </Link>
          </div>
        </motion.div>
      </section>

      {/* SEO text */}
      <section className="py-6 px-4" style={{ background: "#150f0d" }}>
        <p
          className="text-center text-xs max-w-xl mx-auto"
          style={{ color: "#7a6e5a" }}
          aria-label="SEO: Sushi piegāde Rīgā"
        >
          Sushi piegāde Rīgā – svaigi sushi komplekti no SETE.
        </p>
      </section>

      <Footer />
      <StickyCartBar />
    </div>
  );
}
