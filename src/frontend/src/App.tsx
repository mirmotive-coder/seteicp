import {
  Outlet,
  RouterProvider,
  createRootRoute,
  createRoute,
  createRouter,
  redirect,
} from "@tanstack/react-router";
import { Header } from "./components/Header";
import { Toaster } from "./components/ui/sonner";
import { useProductSeed } from "./hooks/useProductSeed";
import { AdminLoginPage } from "./pages/AdminLoginPage";
import { AdminOrdersPage } from "./pages/AdminOrdersPage";
import { AdminProductsPage } from "./pages/AdminProductsPage";
import { CartPage } from "./pages/CartPage";
import { CheckoutPage } from "./pages/CheckoutPage";
import { HomePage } from "./pages/HomePage";
import { MenuPage } from "./pages/MenuPage";

// ── Seed initializer — runs once when actor is ready ─────────
function SeedInitializer() {
  useProductSeed();
  return null;
}

// ── Customer layout ──────────────────────────────────────────
function CustomerLayout() {
  return (
    <div>
      <Header />
      <Outlet />
    </div>
  );
}

// ── Routes ───────────────────────────────────────────────────
const rootRoute = createRootRoute({
  component: () => (
    <>
      {/* Silently ensures products are seeded on the backend if missing */}
      <SeedInitializer />
      <Outlet />
      <Toaster
        position="bottom-center"
        toastOptions={{
          style: {
            background: "#241b17",
            border: "1px solid #3a2e28",
            color: "#f5f5f5",
          },
        }}
      />
    </>
  ),
});

const customerLayoutRoute = createRoute({
  getParentRoute: () => rootRoute,
  id: "customer-layout",
  component: CustomerLayout,
});

const indexRoute = createRoute({
  getParentRoute: () => customerLayoutRoute,
  path: "/",
  beforeLoad: () => {
    throw redirect({ to: "/home" });
  },
  component: () => null,
});

const homeRoute = createRoute({
  getParentRoute: () => customerLayoutRoute,
  path: "/home",
  component: HomePage,
});

const menuRoute = createRoute({
  getParentRoute: () => customerLayoutRoute,
  path: "/menu",
  component: MenuPage,
});

const cartRoute = createRoute({
  getParentRoute: () => customerLayoutRoute,
  path: "/cart",
  component: CartPage,
});

const checkoutRoute = createRoute({
  getParentRoute: () => customerLayoutRoute,
  path: "/checkout",
  component: CheckoutPage,
});

// Admin routes (no customer layout)
const adminRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/admin",
  component: AdminLoginPage,
});

const adminProductsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/admin/products",
  component: AdminProductsPage,
});

const adminOrdersRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/admin/orders",
  component: AdminOrdersPage,
});

// ── Router ───────────────────────────────────────────────────
const routeTree = rootRoute.addChildren([
  customerLayoutRoute.addChildren([
    indexRoute,
    homeRoute,
    menuRoute,
    cartRoute,
    checkoutRoute,
  ]),
  adminRoute,
  adminProductsRoute,
  adminOrdersRoute,
]);

const router = createRouter({ routeTree });

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

export default function App() {
  return <RouterProvider router={router} />;
}
