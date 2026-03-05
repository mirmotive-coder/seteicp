import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import {
  ArrowRight,
  LogOut,
  Package,
  RefreshCw,
  Store,
  Truck,
} from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { useActor } from "../hooks/useActor";
import type { Order } from "../store/types";
import { useAdminStore } from "../store/useStore";

type OrderStatus = "new" | "preparing" | "ready" | "completed";

const STATUS_COLUMNS: {
  key: OrderStatus;
  label: string;
  color: string;
  bg: string;
}[] = [
  { key: "new", label: "NEW", color: "#60a5fa", bg: "rgba(59,130,246,0.1)" },
  {
    key: "preparing",
    label: "PREPARING",
    color: "#fbbf24",
    bg: "rgba(251,191,36,0.1)",
  },
  {
    key: "ready",
    label: "READY",
    color: "#34d399",
    bg: "rgba(52,211,153,0.1)",
  },
  {
    key: "completed",
    label: "COMPLETED",
    color: "#a0967a",
    bg: "rgba(160,150,122,0.1)",
  },
];

const STATUS_ORDER: OrderStatus[] = ["new", "preparing", "ready", "completed"];

function formatDate(ts: number) {
  return new Date(ts).toLocaleString("lv-LV", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function formatItems(items: Order["items"]): string {
  return items.map((i) => `${i.name} ×${i.quantity}`).join(", ");
}

interface OrderCardProps {
  order: Order;
  cardIndex: number;
  status: OrderStatus;
  onAdvance: (orderNumber: number) => void;
}

function OrderCard({ order, cardIndex, status, onAdvance }: OrderCardProps) {
  const isCompleted = status === "completed";
  const colConfig = STATUS_COLUMNS.find((c) => c.key === status);

  return (
    <motion.div
      data-ocid={`admin.order_card.${cardIndex}`}
      layout
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.2 }}
      className="rounded-xl p-4 mb-3"
      style={{
        background: "#1e1612",
        border: "1px solid #3a2e28",
      }}
    >
      {/* Header row */}
      <div className="flex items-center justify-between mb-3">
        <span
          className="font-display text-base font-bold"
          style={{ color: "#d4af37" }}
        >
          #{order.orderNumber}
        </span>
        <span
          className="text-xs px-2 py-0.5 rounded-full font-medium"
          style={{
            background: colConfig?.bg,
            color: colConfig?.color,
          }}
        >
          {order.deliveryType === "delivery" ? (
            <span className="flex items-center gap-1">
              <Truck size={10} /> Delivery
            </span>
          ) : (
            <span className="flex items-center gap-1">
              <Store size={10} /> Pickup
            </span>
          )}
        </span>
      </div>

      {/* Phone */}
      <p className="text-sm font-medium mb-1" style={{ color: "#f5f5f5" }}>
        {order.phone}
      </p>

      {/* Items summary */}
      <p className="text-xs mb-3 line-clamp-2" style={{ color: "#a0967a" }}>
        {formatItems(order.items)}
      </p>

      {/* Footer */}
      <div className="flex items-center justify-between">
        <div>
          <p
            className="font-display text-sm font-bold"
            style={{ color: "#d4af37" }}
          >
            {order.totalPrice % 1 === 0
              ? order.totalPrice
              : order.totalPrice.toFixed(2)}{" "}
            €
          </p>
          <p className="text-xs" style={{ color: "#7a6e5a" }}>
            {formatDate(order.createdAt)}
          </p>
        </div>
        {!isCompleted && (
          <button
            type="button"
            data-ocid={`admin.order_advance_button.${cardIndex}`}
            onClick={() => onAdvance(order.orderNumber)}
            className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all hover:brightness-110 active:scale-95"
            style={{ background: "#d4af37", color: "#1b1412" }}
            title="Advance to next status"
          >
            <ArrowRight size={12} />
          </button>
        )}
      </div>
    </motion.div>
  );
}

export function AdminOrdersPage() {
  const navigate = useNavigate();
  const isAdmin = useAdminStore((s) => s.isAdmin);
  const logout = useAdminStore((s) => s.logout);
  const { actor } = useActor();

  const [statusMap, setStatusMap] = useState<Record<number, OrderStatus>>({});

  const {
    data: orders = [],
    isLoading,
    refetch,
  } = useQuery<Order[]>({
    queryKey: ["admin-orders"],
    queryFn: async () => {
      if (!actor) return [];
      const raw = await actor.getOrders();
      // Map backend Order (BigInt fields) to frontend Order type
      return raw
        .map(
          (o: {
            orderNumber: bigint | number;
            items: Array<{
              productId: bigint | number;
              name: string;
              price: number;
              quantity: bigint | number;
            }>;
            totalPrice: number;
            phone: string;
            customerName: string;
            address: string;
            deliveryType: string;
            deliveryTime: string;
            createdAt: bigint | number;
          }) => ({
            orderNumber: Number(o.orderNumber),
            items: o.items.map((i) => ({
              productId: Number(i.productId),
              name: i.name,
              price: Number(i.price),
              quantity: Number(i.quantity),
            })),
            totalPrice: o.totalPrice,
            phone: o.phone,
            customerName: o.customerName,
            address: o.address,
            deliveryType: o.deliveryType as "delivery" | "pickup",
            deliveryTime: o.deliveryTime,
            createdAt: Number(o.createdAt) / 1_000_000, // nanoseconds to ms
          }),
        )
        .sort((a: Order, b: Order) => b.createdAt - a.createdAt);
    },
    enabled: !!actor && isAdmin,
    refetchInterval: 30_000,
  });

  const handleAdvance = (orderNumber: number) => {
    setStatusMap((prev) => {
      const current = prev[orderNumber] ?? "new";
      const currentIdx = STATUS_ORDER.indexOf(current);
      const nextStatus =
        STATUS_ORDER[Math.min(currentIdx + 1, STATUS_ORDER.length - 1)];
      return { ...prev, [orderNumber]: nextStatus };
    });
  };

  const getOrderStatus = (orderNumber: number): OrderStatus =>
    statusMap[orderNumber] ?? "new";

  if (!isAdmin) {
    navigate({ to: "/admin" });
    return null;
  }

  // Build columns
  const columns = STATUS_COLUMNS.map((col) => ({
    ...col,
    orders: orders.filter((o) => getOrderStatus(o.orderNumber) === col.key),
  }));

  return (
    <div className="min-h-screen" style={{ background: "#1b1412" }}>
      {/* Admin header */}
      <header
        className="px-6 py-4 flex items-center justify-between"
        style={{ borderBottom: "1px solid #3a2e28", background: "#150f0d" }}
      >
        <div className="flex items-center gap-6">
          <span
            className="font-display text-2xl font-bold"
            style={{ color: "#d4af37" }}
          >
            SETE
          </span>
          <span
            className="text-xs font-semibold tracking-widest uppercase"
            style={{ color: "#7a6e5a" }}
          >
            Admin
          </span>
        </div>
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => navigate({ to: "/admin/products" })}
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm transition-all hover:bg-[#3a2e28]"
            style={{ color: "#a0967a" }}
          >
            <Package size={16} />
            Products
          </button>
          <button
            type="button"
            onClick={() => navigate({ to: "/home" })}
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm transition-all hover:bg-[#3a2e28]"
            style={{ color: "#a0967a" }}
          >
            View site
          </button>
          <button
            type="button"
            onClick={() => {
              logout();
              navigate({ to: "/admin" });
            }}
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm transition-all hover:bg-[#3a2e28]"
            style={{ color: "#a0967a" }}
          >
            <LogOut size={15} />
            Logout
          </button>
        </div>
      </header>

      <main className="p-6">
        {/* Page title + refresh */}
        <div className="mb-8 flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-bold" style={{ color: "#f5f5f5" }}>
              Orders
            </h1>
            <p className="text-sm mt-1" style={{ color: "#7a6e5a" }}>
              {isLoading
                ? "Loading..."
                : `${orders.length} total order${orders.length !== 1 ? "s" : ""}`}
            </p>
          </div>
          <button
            type="button"
            data-ocid="admin.orders_refresh_button"
            onClick={() => refetch()}
            disabled={isLoading}
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm transition-all hover:bg-[#3a2e28] disabled:opacity-50"
            style={{ color: "#a0967a" }}
          >
            <RefreshCw size={14} className={isLoading ? "animate-spin" : ""} />
            Refresh
          </button>
        </div>

        {/* Loading state */}
        {isLoading ? (
          <div
            className="flex flex-col items-center justify-center py-24 text-center"
            data-ocid="admin.orders_loading_state"
          >
            <RefreshCw
              size={32}
              className="animate-spin"
              style={{ color: "#3a2e28" }}
            />
            <p className="mt-4 text-sm" style={{ color: "#7a6e5a" }}>
              Loading orders...
            </p>
          </div>
        ) : orders.length === 0 ? (
          <div
            className="flex flex-col items-center justify-center py-24 text-center"
            data-ocid="admin.orders_empty_state"
          >
            <Package size={40} style={{ color: "#3a2e28" }} />
            <p className="mt-4 text-sm" style={{ color: "#7a6e5a" }}>
              No orders yet
            </p>
          </div>
        ) : (
          /* Kanban board */
          <div
            data-ocid="admin.orders_board"
            className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4"
          >
            {columns.map((col, colIdx) => (
              <div
                key={col.key}
                data-ocid={`admin.orders_column.${colIdx + 1}`}
                className="rounded-xl p-4 min-h-[200px]"
                style={{
                  background: "#150f0d",
                  border: "1px solid #3a2e28",
                }}
              >
                {/* Column header */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <div
                      className="w-2 h-2 rounded-full"
                      style={{ background: col.color }}
                    />
                    <h3
                      className="text-xs font-bold tracking-widest uppercase"
                      style={{ color: col.color }}
                    >
                      {col.label}
                    </h3>
                  </div>
                  <span
                    className="text-xs px-2 py-0.5 rounded-full font-semibold"
                    style={{ background: col.bg, color: col.color }}
                  >
                    {col.orders.length}
                  </span>
                </div>

                {/* Order cards */}
                <div>
                  {col.orders.length === 0 ? (
                    <div
                      className="flex items-center justify-center py-10 rounded-lg"
                      style={{
                        border: "1px dashed #3a2e28",
                      }}
                    >
                      <p className="text-xs" style={{ color: "#3a2e28" }}>
                        Empty
                      </p>
                    </div>
                  ) : (
                    col.orders.map((order, cardIdx) => {
                      // Compute global card index for deterministic marker
                      const globalCardIdx =
                        columns
                          .slice(0, colIdx)
                          .reduce((sum, c) => sum + c.orders.length, 0) +
                        cardIdx +
                        1;
                      return (
                        <OrderCard
                          key={order.orderNumber}
                          order={order}
                          cardIndex={globalCardIdx}
                          status={col.key}
                          onAdvance={handleAdvance}
                        />
                      );
                    })
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
