import { useNavigate } from "@tanstack/react-router";
import { AlertCircle, Eye, EyeOff, Lock } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { useAdminStore } from "../store/useStore";

export function AdminLoginPage() {
  const navigate = useNavigate();
  const login = useAdminStore((s) => s.login);
  const isAdmin = useAdminStore((s) => s.isAdmin);

  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  // If already logged in, redirect
  if (isAdmin) {
    navigate({ to: "/admin/products" });
    return null;
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const success = login(password);
    if (success) {
      navigate({ to: "/admin/products" });
    } else {
      setError("Nepareiza parole");
      setPassword("");
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4"
      style={{ background: "#1b1412" }}
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-sm"
      >
        {/* Logo */}
        <div className="text-center mb-10">
          <h1
            className="font-display text-4xl font-bold tracking-[0.25em] mb-2"
            style={{ color: "#d4af37" }}
          >
            SETE
          </h1>
          <p className="text-sm" style={{ color: "#7a6e5a" }}>
            Admin Panel
          </p>
        </div>

        <div
          className="rounded-2xl p-8"
          style={{ background: "#241b17", border: "1px solid #3a2e28" }}
        >
          <div className="flex justify-center mb-6">
            <div
              className="w-14 h-14 rounded-full flex items-center justify-center"
              style={{
                background: "rgba(212,175,55,0.1)",
                border: "1px solid rgba(212,175,55,0.25)",
              }}
            >
              <Lock size={22} style={{ color: "#d4af37" }} />
            </div>
          </div>

          <h2
            className="text-center text-xl font-semibold mb-6"
            style={{ color: "#f5f5f5" }}
          >
            Admin Login
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label
                htmlFor="admin-password"
                className="block text-xs font-semibold mb-2 tracking-wider uppercase"
                style={{ color: "#a0967a" }}
              >
                Password
              </label>
              <div className="relative">
                <input
                  id="admin-password"
                  type={showPassword ? "text" : "password"}
                  data-ocid="admin.login_input"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setError("");
                  }}
                  placeholder="Enter password"
                  autoComplete="current-password"
                  className="w-full px-4 py-3 pr-11 rounded-xl text-sm outline-none transition-all"
                  style={{
                    background: "#1b1412",
                    border: error ? "1.5px solid #c0392b" : "1px solid #3a2e28",
                    color: "#f5f5f5",
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1 transition-colors hover:text-[#d4af37]"
                  style={{ color: "#7a6e5a" }}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {error && (
                <div className="mt-2 flex items-center gap-1.5">
                  <AlertCircle size={13} style={{ color: "#c0392b" }} />
                  <p className="text-xs" style={{ color: "#c0392b" }}>
                    {error}
                  </p>
                </div>
              )}
            </div>

            <button
              type="submit"
              data-ocid="admin.login_button"
              className="w-full py-3 rounded-xl text-sm font-bold tracking-wider uppercase transition-all hover:brightness-110 active:scale-[0.98]"
              style={{
                background: "#d4af37",
                color: "#1b1412",
                marginTop: "1.5rem",
              }}
            >
              Login
            </button>
          </form>
        </div>
      </motion.div>
    </div>
  );
}
