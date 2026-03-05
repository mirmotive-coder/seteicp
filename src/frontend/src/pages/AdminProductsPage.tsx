import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import {
  Edit2,
  LogOut,
  Package,
  Plus,
  RefreshCw,
  ShoppingCart,
  Upload,
  X,
} from "lucide-react";
import { motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { Switch } from "../components/ui/switch";
import { useActor } from "../hooks/useActor";
import { useStorageClient } from "../hooks/useStorageClient";
import type { Product, ProductCategory } from "../store/types";
import { useAdminStore } from "../store/useStore";
import { seedIfEmpty } from "../utils/seedProducts";

const CATEGORY_LABELS: Record<ProductCategory, string> = {
  set: "Set",
  addon: "Addon",
  drink: "Drink",
};

const PLACEHOLDER = "/assets/generated/sushi-roll-placeholder.dim_600x400.jpg";

interface ProductFormData {
  name: string;
  price: string;
  description: string; // maps to peopleRecommended in backend
  pieceCount: string;
  category: ProductCategory;
  image: string;
}

const EMPTY_FORM: ProductFormData = {
  name: "",
  price: "",
  description: "",
  pieceCount: "",
  category: "set",
  image: "",
};

function ProductModal({
  product,
  onClose,
  onSave,
  saving,
  uploadImage,
}: {
  product: Product | null;
  onClose: () => void;
  onSave: (data: ProductFormData, id?: number) => Promise<boolean>;
  saving: boolean;
  uploadImage: (
    file: File,
    onProgress?: (pct: number) => void,
  ) => Promise<string>;
}) {
  const [form, setForm] = useState<ProductFormData>(
    product
      ? {
          name: product.name,
          price: String(product.price),
          description: product.peopleRecommended, // backend peopleRecommended is our description
          pieceCount: product.pieceCount,
          category: product.category,
          image: product.image,
        }
      : EMPTY_FORM,
  );
  const [error, setError] = useState("");
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const fileRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Show a local preview immediately while upload happens
    const localPreview = URL.createObjectURL(file);
    setForm((prev) => ({ ...prev, image: localPreview }));

    setUploading(true);
    setUploadProgress(0);
    try {
      const imageUrl = await uploadImage(file, (pct) => setUploadProgress(pct));
      // Replace local preview with the persisted blob storage URL
      setForm((prev) => ({ ...prev, image: imageUrl }));
      URL.revokeObjectURL(localPreview);
    } catch (err) {
      console.error("Image upload failed:", err);
      toast.error("Image upload failed. Please try again.");
      // Revert preview on failure
      setForm((prev) => ({ ...prev, image: product?.image ?? "" }));
      URL.revokeObjectURL(localPreview);
    } finally {
      setUploading(false);
      setUploadProgress(0);
    }
  };

  const handleSave = async () => {
    if (!form.name.trim()) {
      setError("Name is required");
      return;
    }
    const price = Number.parseFloat(form.price);
    if (Number.isNaN(price) || price <= 0) {
      setError("Valid price is required");
      return;
    }
    if (uploading) {
      setError("Please wait for the image upload to finish.");
      return;
    }
    setError("");
    const success = await onSave(form, product?.id);
    if (success) onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0"
        style={{ background: "rgba(0,0,0,0.7)" }}
        onClick={onClose}
        onKeyDown={(e) => e.key === "Escape" && onClose()}
        role="presentation"
      />
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="relative w-full max-w-lg rounded-2xl p-6 z-10 overflow-y-auto max-h-[90vh]"
        style={{ background: "#241b17", border: "1px solid #3a2e28" }}
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold" style={{ color: "#f5f5f5" }}>
            {product ? "Edit Product" : "Add Product"}
          </h2>
          <button type="button" onClick={onClose} style={{ color: "#7a6e5a" }}>
            <X size={20} />
          </button>
        </div>

        <div className="space-y-4">
          {/* Image */}
          <div>
            <p
              className="block text-xs font-semibold mb-2 uppercase tracking-wider"
              style={{ color: "#a0967a" }}
            >
              Product Image
            </p>
            <button
              type="button"
              className="w-full h-40 rounded-xl overflow-hidden relative cursor-pointer group"
              style={{ border: "1px dashed #3a2e28" }}
              onClick={() => !uploading && fileRef.current?.click()}
              aria-label="Upload product image"
              data-ocid="admin.upload_button"
              disabled={uploading}
            >
              <img
                src={form.image || PLACEHOLDER}
                alt="Product preview"
                className="w-full h-full object-cover"
              />
              {uploading ? (
                <div
                  className="absolute inset-0 flex flex-col items-center justify-center gap-2"
                  style={{ background: "rgba(0,0,0,0.65)" }}
                >
                  <RefreshCw
                    size={20}
                    className="animate-spin"
                    style={{ color: "#d4af37" }}
                  />
                  <span
                    className="text-xs font-semibold"
                    style={{ color: "#d4af37" }}
                  >
                    Uploading {uploadProgress}%
                  </span>
                </div>
              ) : (
                <div
                  className="absolute inset-0 flex flex-col items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity"
                  style={{ background: "rgba(0,0,0,0.6)" }}
                >
                  <Upload size={20} style={{ color: "#d4af37" }} />
                  <span className="text-xs" style={{ color: "#d4af37" }}>
                    Upload image
                  </span>
                </div>
              )}
            </button>
            <input
              ref={fileRef}
              id="product-image-upload"
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleImageUpload}
            />
          </div>

          {/* Name */}
          <div>
            <label
              htmlFor="modal-name"
              className="block text-xs font-semibold mb-1.5 uppercase tracking-wider"
              style={{ color: "#a0967a" }}
            >
              Name *
            </label>
            <input
              id="modal-name"
              type="text"
              value={form.name}
              onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
              className="w-full px-3 py-2.5 rounded-lg text-sm outline-none"
              style={{
                background: "#1b1412",
                border: "1px solid #3a2e28",
                color: "#f5f5f5",
              }}
              placeholder="Product name"
            />
          </div>

          {/* Price */}
          <div>
            <label
              htmlFor="modal-price"
              className="block text-xs font-semibold mb-1.5 uppercase tracking-wider"
              style={{ color: "#a0967a" }}
            >
              Price (€) *
            </label>
            <input
              id="modal-price"
              type="number"
              step="0.01"
              value={form.price}
              onChange={(e) =>
                setForm((p) => ({ ...p, price: e.target.value }))
              }
              className="w-full px-3 py-2.5 rounded-lg text-sm outline-none"
              style={{
                background: "#1b1412",
                border: "1px solid #3a2e28",
                color: "#f5f5f5",
              }}
              placeholder="0.00"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Piece count */}
            <div>
              <label
                htmlFor="modal-piececount"
                className="block text-xs font-semibold mb-1.5 uppercase tracking-wider"
                style={{ color: "#a0967a" }}
              >
                Piece Count
              </label>
              <input
                id="modal-piececount"
                type="text"
                value={form.pieceCount}
                onChange={(e) =>
                  setForm((p) => ({ ...p, pieceCount: e.target.value }))
                }
                className="w-full px-3 py-2.5 rounded-lg text-sm outline-none"
                style={{
                  background: "#1b1412",
                  border: "1px solid #3a2e28",
                  color: "#f5f5f5",
                }}
                placeholder="32 gab"
              />
            </div>

            {/* Category */}
            <div>
              <label
                htmlFor="modal-category"
                className="block text-xs font-semibold mb-1.5 uppercase tracking-wider"
                style={{ color: "#a0967a" }}
              >
                Category
              </label>
              <select
                id="modal-category"
                value={form.category}
                onChange={(e) =>
                  setForm((p) => ({
                    ...p,
                    category: e.target.value as ProductCategory,
                  }))
                }
                className="w-full px-3 py-2.5 rounded-lg text-sm outline-none"
                style={{
                  background: "#1b1412",
                  border: "1px solid #3a2e28",
                  color: "#f5f5f5",
                }}
              >
                <option value="set">Set</option>
                <option value="addon">Addon</option>
                <option value="drink">Drink</option>
              </select>
            </div>
          </div>

          {/* Description (maps to peopleRecommended in backend) */}
          <div>
            <label
              htmlFor="modal-description"
              className="block text-xs font-semibold mb-1.5 uppercase tracking-wider"
              style={{ color: "#a0967a" }}
            >
              Apraksts
            </label>
            <input
              id="modal-description"
              type="text"
              value={form.description}
              onChange={(e) =>
                setForm((p) => ({ ...p, description: e.target.value }))
              }
              className="w-full px-3 py-2.5 rounded-lg text-sm outline-none"
              style={{
                background: "#1b1412",
                border: "1px solid #3a2e28",
                color: "#f5f5f5",
              }}
              placeholder="Sushi komplekts"
            />
          </div>

          {error && (
            <p className="text-xs" style={{ color: "#c0392b" }}>
              {error}
            </p>
          )}

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              disabled={saving}
              className="flex-1 py-2.5 rounded-xl text-sm font-medium transition-all hover:bg-[#3a2e28] disabled:opacity-50"
              style={{ border: "1px solid #3a2e28", color: "#a0967a" }}
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSave}
              disabled={saving}
              className="flex-1 py-2.5 rounded-xl text-sm font-bold transition-all hover:brightness-110 disabled:opacity-50 flex items-center justify-center gap-2"
              style={{ background: "#d4af37", color: "#1b1412" }}
            >
              {saving && <RefreshCw size={14} className="animate-spin" />}
              {saving ? "Saving..." : "Save"}
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

export function AdminProductsPage() {
  const navigate = useNavigate();
  const isAdmin = useAdminStore((s) => s.isAdmin);
  const logout = useAdminStore((s) => s.logout);
  const { actor } = useActor();
  const { uploadImage } = useStorageClient();
  const queryClient = useQueryClient();

  const [editProduct, setEditProduct] = useState<Product | null | undefined>(
    undefined,
  );
  const [savingProduct, setSavingProduct] = useState(false);
  const seededRef = useRef(false);

  const { data: products = [], isLoading } = useQuery<Product[]>({
    queryKey: ["admin-products"],
    queryFn: async () => {
      if (!actor) return [];
      const raw = await actor.getAllProducts();
      return raw.map((p) => ({
        id: Number(p.id),
        name: p.name,
        price: Number(p.price),
        image: p.image,
        pieceCount: p.pieceCount,
        peopleRecommended: p.peopleRecommended,
        description: p.peopleRecommended, // derive description from peopleRecommended
        category: p.category as ProductCategory,
        enabled: p.enabled,
      }));
    },
    enabled: !!actor && isAdmin,
  });

  // Seed initial products if storage is empty
  useEffect(() => {
    if (!actor || !isAdmin || isLoading || seededRef.current) return;
    if (products.length === 0) {
      seededRef.current = true;
      seedIfEmpty(actor).then((didSeed) => {
        if (didSeed) {
          queryClient.invalidateQueries({ queryKey: ["admin-products"] });
          queryClient.invalidateQueries({ queryKey: ["products"] });
        }
      });
    }
  }, [actor, isAdmin, isLoading, products.length, queryClient]);

  const toggleMutation = useMutation({
    mutationFn: async (productId: number) => {
      if (!actor) throw new Error("No actor");
      await actor.toggleProductEnabled(BigInt(productId));
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-products"] });
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
    onError: () => {
      toast.error("Failed to update product");
    },
  });

  if (!isAdmin) {
    navigate({ to: "/admin" });
    return null;
  }

  const handleSave = async (
    data: ProductFormData,
    id?: number,
  ): Promise<boolean> => {
    if (!actor) {
      toast.error("Savienojums nav gatavs. Mēģiniet vēlreiz.");
      return false;
    }
    const price = Number.parseFloat(data.price);
    setSavingProduct(true);
    try {
      if (id !== undefined) {
        // updateProduct(id, name, price, image, pieceCount, peopleRecommended, category)
        await actor.updateProduct(
          BigInt(id),
          data.name,
          price,
          data.image,
          data.pieceCount,
          data.description, // description maps to peopleRecommended in backend
          data.category,
        );
        toast.success("Product updated");
      } else {
        // addProduct(name, price, image, pieceCount, peopleRecommended, category)
        await actor.addProduct(
          data.name,
          price,
          data.image,
          data.pieceCount,
          data.description, // description maps to peopleRecommended in backend
          data.category,
        );
        toast.success("Product added");
      }
      await queryClient.invalidateQueries({ queryKey: ["admin-products"] });
      await queryClient.invalidateQueries({ queryKey: ["products"] });
      return true;
    } catch (err) {
      console.error("Failed to save product:", err);
      toast.error("Failed to save product");
      return false;
    } finally {
      setSavingProduct(false);
    }
  };

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
            onClick={() => navigate({ to: "/admin/orders" })}
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm transition-all hover:bg-[#3a2e28]"
            style={{ color: "#a0967a" }}
          >
            <ShoppingCart size={16} />
            Orders
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

      <main className="p-6 max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold" style={{ color: "#f5f5f5" }}>
              Products
            </h1>
            <p className="text-sm mt-1" style={{ color: "#7a6e5a" }}>
              {isLoading ? "Loading..." : `${products.length} products total`}
            </p>
          </div>
          <button
            type="button"
            data-ocid="admin.add_product_button"
            onClick={() => setEditProduct(null)}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold transition-all hover:brightness-110"
            style={{ background: "#d4af37", color: "#1b1412" }}
          >
            <Plus size={16} />
            Add Product
          </button>
        </div>

        {/* Loading state */}
        {isLoading && (
          <div
            className="flex items-center justify-center py-20"
            data-ocid="admin.products_loading_state"
          >
            <RefreshCw
              size={28}
              className="animate-spin"
              style={{ color: "#3a2e28" }}
            />
          </div>
        )}

        {/* Products table */}
        {!isLoading && products.length > 0 && (
          <div
            className="rounded-xl overflow-hidden"
            style={{ border: "1px solid #3a2e28" }}
          >
            <table className="w-full">
              <thead>
                <tr
                  style={{
                    background: "#241b17",
                    borderBottom: "1px solid #3a2e28",
                  }}
                >
                  <th
                    className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider"
                    style={{ color: "#a0967a" }}
                  >
                    Product
                  </th>
                  <th
                    className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider hidden sm:table-cell"
                    style={{ color: "#a0967a" }}
                  >
                    Category
                  </th>
                  <th
                    className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider hidden sm:table-cell"
                    style={{ color: "#a0967a" }}
                  >
                    Price
                  </th>
                  <th
                    className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider hidden md:table-cell"
                    style={{ color: "#a0967a" }}
                  >
                    Pieces
                  </th>
                  <th
                    className="text-center px-4 py-3 text-xs font-semibold uppercase tracking-wider"
                    style={{ color: "#a0967a" }}
                  >
                    Enabled
                  </th>
                  <th
                    className="text-right px-4 py-3 text-xs font-semibold uppercase tracking-wider"
                    style={{ color: "#a0967a" }}
                  >
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {products.map((product, i) => (
                  <tr
                    key={product.id}
                    style={{
                      borderBottom:
                        i < products.length - 1 ? "1px solid #3a2e28" : "none",
                      background: "#1b1412",
                    }}
                  >
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-8 rounded overflow-hidden flex-shrink-0">
                          <img
                            src={product.image || PLACEHOLDER}
                            alt={product.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div>
                          <p
                            className="text-sm font-medium"
                            style={{ color: "#f5f5f5" }}
                          >
                            {product.name}
                          </p>
                          <p
                            className="text-xs sm:hidden"
                            style={{ color: "#a0967a" }}
                          >
                            {CATEGORY_LABELS[product.category]} ·{" "}
                            {product.price % 1 === 0
                              ? product.price
                              : product.price.toFixed(2)}{" "}
                            €
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 hidden sm:table-cell">
                      <span
                        className="inline-block px-2 py-0.5 rounded text-xs font-medium"
                        style={{
                          background: "rgba(212,175,55,0.12)",
                          color: "#d4af37",
                        }}
                      >
                        {CATEGORY_LABELS[product.category]}
                      </span>
                    </td>
                    <td className="px-4 py-3 hidden sm:table-cell">
                      <span className="text-sm" style={{ color: "#f5f5f5" }}>
                        {product.price % 1 === 0
                          ? product.price
                          : product.price.toFixed(2)}{" "}
                        €
                      </span>
                    </td>
                    <td className="px-4 py-3 hidden md:table-cell">
                      <span className="text-sm" style={{ color: "#a0967a" }}>
                        {product.pieceCount}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <Switch
                        data-ocid={`admin.product_toggle.${i + 1}`}
                        checked={product.enabled}
                        disabled={toggleMutation.isPending}
                        onCheckedChange={() =>
                          toggleMutation.mutate(product.id)
                        }
                      />
                    </td>
                    <td className="px-4 py-3 text-right">
                      <button
                        type="button"
                        data-ocid={`admin.product_edit_button.${i + 1}`}
                        onClick={() => setEditProduct(product)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all hover:bg-[#3a2e28]"
                        style={{ color: "#a0967a" }}
                      >
                        <Edit2 size={13} />
                        Edit
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {!isLoading && products.length === 0 && (
          <div
            className="flex flex-col items-center justify-center py-20 text-center"
            data-ocid="admin.products_empty_state"
          >
            <Package size={40} style={{ color: "#3a2e28" }} />
            <p className="mt-4 text-sm" style={{ color: "#7a6e5a" }}>
              No products yet
            </p>
          </div>
        )}
      </main>

      {/* Product modal */}
      {editProduct !== undefined && (
        <ProductModal
          product={editProduct}
          onClose={() => setEditProduct(undefined)}
          onSave={handleSave}
          saving={savingProduct}
          uploadImage={uploadImage}
        />
      )}
    </div>
  );
}
