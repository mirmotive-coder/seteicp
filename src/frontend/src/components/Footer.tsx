import { Clock, MapPin } from "lucide-react";

export function Footer() {
  const year = new Date().getFullYear();
  const hostname =
    typeof window !== "undefined" ? window.location.hostname : "sete.lv";

  return (
    <footer
      className="mt-auto py-16 px-4"
      style={{ borderTop: "1px solid #3a2e28", background: "#150f0d" }}
    >
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
          {/* Brand */}
          <div>
            <h3
              className="font-display text-3xl font-bold tracking-[0.2em] mb-3"
              style={{ color: "#d4af37" }}
            >
              SETE
            </h3>
            <p className="text-sm" style={{ color: "#7a6e5a" }}>
              Premium sushi Rīgā
            </p>
          </div>

          {/* Hours */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Clock size={16} style={{ color: "#d4af37" }} />
              <span
                className="text-xs font-semibold tracking-widest uppercase"
                style={{ color: "#d4af37" }}
              >
                Darba laiks
              </span>
            </div>
            <p className="text-sm mb-1" style={{ color: "#a0967a" }}>
              Pirmdiena – Svētdiena
            </p>
            <p className="text-sm font-semibold" style={{ color: "#f5f5f5" }}>
              11:00 – 22:00
            </p>
          </div>

          {/* Address */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <MapPin size={16} style={{ color: "#d4af37" }} />
              <span
                className="text-xs font-semibold tracking-widest uppercase"
                style={{ color: "#d4af37" }}
              >
                Adrese
              </span>
            </div>
            <p className="text-sm" style={{ color: "#a0967a" }}>
              Blaumaņa iela 34-2
            </p>
            <p className="text-sm" style={{ color: "#a0967a" }}>
              Rīga, Latvija
            </p>
          </div>
        </div>

        {/* Bottom bar */}
        <div
          className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-3"
          style={{ borderTop: "1px solid #3a2e28" }}
        >
          <p className="text-xs" style={{ color: "#7a6e5a" }}>
            © {year} SETE Sushi. Visas tiesības aizsargātas.
          </p>
          <p className="text-xs" style={{ color: "#7a6e5a" }}>
            Izveidots ar ❤️ izmantojot{" "}
            <a
              href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(hostname)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="transition-colors hover:text-[#d4af37]"
              style={{ color: "#a0967a" }}
            >
              caffeine.ai
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
