"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import {
  Images,
  Search,
  CheckCircle,
  Loader2,
  AlertCircle,
  ChevronDown,
  ChevronRight,
  Upload,
  Package,
  Sparkles,
  X,
  Play,
  Pause,
  RotateCcw,
  ImageOff,
  ZoomIn,
} from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────

interface Product {
  id: string;
  name: string;
  sku: string;
  brand: string | null;
  imageUrl: string | null;
}

interface ImageResult {
  title: string;
  thumbnail: string;
  full: string;
  source: string;
}

interface ProductWithImages extends Product {
  images: ImageResult[];
  isSearching: boolean;
  isExpanded: boolean;
  searchDone: boolean;
  searchError: string | null;
  assignedImageUrl: string | null;
  isAssigning: boolean;
}

type FilterMode = "all" | "without-image";

// ── Build a better search query ──────────────────────────────────────────────
function buildSearchQuery(product: Product): string {
  const parts: string[] = [];
  if (product.brand) parts.push(product.brand);
  parts.push(product.name);
  // Add generic context so Google returns product shots not random pages
  parts.push("زيت سيارات");
  return parts.join(" ");
}

// ─── Lightbox Component ───────────────────────────────────────────────────────

interface LightboxProps {
  img: ImageResult;
  productName: string;
  onConfirm: () => void;
  onClose: () => void;
  isAssigning: boolean;
}

function Lightbox({ img, productName, onConfirm, onClose, isAssigning }: LightboxProps) {
  const [imgLoaded, setImgLoaded] = useState(false);
  const [imgErrored, setImgErrored] = useState(false);

  // Close on Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "rgba(0,0,0,0.85)", backdropFilter: "blur(6px)" }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="bg-dark-800 border border-dark-600 rounded-2xl overflow-hidden max-w-2xl w-full shadow-2xl animate-fade-in">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-dark-600">
          <div>
            <p className="font-bold text-sm">{productName}</p>
            <p className="text-xs text-gray-500 mt-0.5 truncate max-w-sm">{img.source}</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-dark-700 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Image */}
        <div className="relative bg-dark-900 flex items-center justify-center" style={{ minHeight: 360 }}>
          {!imgLoaded && !imgErrored && (
            <div className="absolute inset-0 flex items-center justify-center">
              <Loader2 className="w-8 h-8 animate-spin text-gray-600" />
            </div>
          )}
          {imgErrored ? (
            <div className="flex flex-col items-center gap-3 py-16 text-gray-600">
              <ImageOff className="w-12 h-12" />
              <p className="text-sm">تعذّر تحميل الصورة</p>
            </div>
          ) : (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={img.full}
              alt={img.title}
              className={`max-h-[480px] max-w-full object-contain transition-opacity duration-300 ${imgLoaded ? "opacity-100" : "opacity-0"}`}
              onLoad={() => setImgLoaded(true)}
              onError={() => { setImgErrored(true); setImgLoaded(true); }}
            />
          )}
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-3 px-5 py-4 border-t border-dark-600">
          <button
            onClick={onClose}
            disabled={isAssigning}
            className="btn-secondary text-sm gap-2"
          >
            <X className="w-4 h-4" /> إلغاء
          </button>
          <button
            onClick={onConfirm}
            disabled={isAssigning || imgErrored}
            className="btn-primary text-sm gap-2"
          >
            {isAssigning ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                جاري الرفع...
              </>
            ) : (
              <>
                <Upload className="w-4 h-4" />
                إضافة للمنتج
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function ImageGrabberPage() {
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [displayedProducts, setDisplayedProducts] = useState<ProductWithImages[]>([]);
  const [filterMode, setFilterMode] = useState<FilterMode>("without-image");
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoadingProducts, setIsLoadingProducts] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  // Batch search state
  const [isBatchRunning, setIsBatchRunning] = useState(false);
  const [batchPaused, setBatchPaused] = useState(false);
  const [batchIndex, setBatchIndex] = useState(0);
  const pauseRef = useRef(false);
  const stopRef = useRef(false);

  // Lightbox state
  const [lightbox, setLightbox] = useState<{
    img: ImageResult;
    productId: string;
    productName: string;
  } | null>(null);

  // Stats
  const [assignedCount, setAssignedCount] = useState(0);

  // ── Load products ────────────────────────────────────────────────────────────
  const loadProducts = useCallback(async () => {
    setIsLoadingProducts(true);
    setLoadError(null);
    try {
      const res = await fetch("/api/admin/image-grabber/products");
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "فشل في جلب المنتجات");
      setAllProducts(data.products);
    } catch (err) {
      setLoadError(err instanceof Error ? err.message : "خطأ غير معروف");
    } finally {
      setIsLoadingProducts(false);
    }
  }, []);

  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  // ── Filter & map products ─────────────────────────────────────────────────
  useEffect(() => {
    let filtered =
      filterMode === "without-image"
        ? allProducts.filter((p) => !p.imageUrl)
        : allProducts;

    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.sku.toLowerCase().includes(q) ||
          (p.brand?.toLowerCase().includes(q) ?? false)
      );
    }

    setDisplayedProducts((prev) =>
      filtered.map((p) => {
        const existing = prev.find((ep) => ep.id === p.id);
        if (existing) return existing;
        return {
          ...p,
          images: [],
          isSearching: false,
          isExpanded: false,
          searchDone: false,
          searchError: null,
          assignedImageUrl: p.imageUrl,
          isAssigning: false,
        };
      })
    );
  }, [allProducts, filterMode, searchTerm]);

  // ── Single product search ─────────────────────────────────────────────────
  const searchProductImages = useCallback(
    async (productId: string, customQuery?: string) => {
      const product = displayedProducts.find((p) => p.id === productId);
      if (!product) return;

      setDisplayedProducts((prev) =>
        prev.map((p) =>
          p.id === productId
            ? { ...p, isSearching: true, isExpanded: true, searchError: null, images: [] }
            : p
        )
      );

      try {
        // Use the custom query if provided, otherwise auto-build from product data
        const query = customQuery?.trim() || buildSearchQuery(product);
        const res = await fetch("/api/admin/image-grabber/search", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ query, count: 8 }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error);

        setDisplayedProducts((prev) =>
          prev.map((p) =>
            p.id === productId
              ? { ...p, isSearching: false, searchDone: true, images: data.images }
              : p
          )
        );
      } catch (err) {
        setDisplayedProducts((prev) =>
          prev.map((p) =>
            p.id === productId
              ? {
                  ...p,
                  isSearching: false,
                  searchError: err instanceof Error ? err.message : "خطأ",
                }
              : p
          )
        );
      }
    },
    [displayedProducts]
  );

  // ── Assign image to product ───────────────────────────────────────────────
  const assignImage = useCallback(async (productId: string, imageUrl: string) => {
    setDisplayedProducts((prev) =>
      prev.map((p) => (p.id === productId ? { ...p, isAssigning: true } : p))
    );

    try {
      const res = await fetch("/api/admin/image-grabber/assign", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId, imageUrl }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      setDisplayedProducts((prev) =>
        prev.map((p) =>
          p.id === productId
            ? {
                ...p,
                isAssigning: false,
                assignedImageUrl: data.cloudinaryUrl,
                isExpanded: false,
                images: [],
              }
            : p
        )
      );
      setAssignedCount((c) => c + 1);
      setAllProducts((prev) =>
        prev.map((p) =>
          p.id === productId ? { ...p, imageUrl: data.cloudinaryUrl } : p
        )
      );
      setLightbox(null);
    } catch (err) {
      alert(err instanceof Error ? err.message : "فشل تعيين الصورة");
      setDisplayedProducts((prev) =>
        prev.map((p) => (p.id === productId ? { ...p, isAssigning: false } : p))
      );
    }
  }, []);

  // ── Batch auto-search ─────────────────────────────────────────────────────
  const startBatch = useCallback(async () => {
    const toSearch = displayedProducts.filter(
      (p) => !p.searchDone && !p.assignedImageUrl
    );
    if (toSearch.length === 0) return;

    setIsBatchRunning(true);
    stopRef.current = false;
    pauseRef.current = false;
    setBatchPaused(false);

    for (let i = 0; i < toSearch.length; i++) {
      if (stopRef.current) break;
      while (pauseRef.current) {
        await new Promise((r) => setTimeout(r, 500));
        if (stopRef.current) break;
      }
      if (stopRef.current) break;

      setBatchIndex(i);

      // Run using the improved query builder
      const product = toSearch[i];
      const query = buildSearchQuery(product);

      setDisplayedProducts((prev) =>
        prev.map((p) =>
          p.id === product.id
            ? { ...p, isSearching: true, isExpanded: true, searchError: null, images: [] }
            : p
        )
      );

      try {
        const res = await fetch("/api/admin/image-grabber/search", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ query, count: 8 }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error);
        setDisplayedProducts((prev) =>
          prev.map((p) =>
            p.id === product.id
              ? { ...p, isSearching: false, searchDone: true, images: data.images }
              : p
          )
        );
      } catch (err) {
        setDisplayedProducts((prev) =>
          prev.map((p) =>
            p.id === product.id
              ? {
                  ...p,
                  isSearching: false,
                  searchError: err instanceof Error ? err.message : "خطأ",
                }
              : p
          )
        );
      }

      await new Promise((r) => setTimeout(r, 1200));
    }

    setIsBatchRunning(false);
  }, [displayedProducts]);

  // ── Computed stats ────────────────────────────────────────────────────────
  const withImageCount = allProducts.filter((p) => p.imageUrl).length;
  const withoutImageCount = allProducts.filter((p) => !p.imageUrl).length;
  const searchedCount = displayedProducts.filter((p) => p.searchDone).length;
  const pendingCount = displayedProducts.filter((p) => !p.assignedImageUrl).length;

  // ── Lightbox product being assigned ──────────────────────────────────────
  const lightboxProduct = lightbox
    ? displayedProducts.find((p) => p.id === lightbox.productId)
    : null;

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <>
      {/* ── Lightbox Portal ─────────────────────────────────────────────── */}
      {lightbox && (
        <Lightbox
          img={lightbox.img}
          productName={lightbox.productName}
          isAssigning={lightboxProduct?.isAssigning ?? false}
          onConfirm={() => assignImage(lightbox.productId, lightbox.img.full)}
          onClose={() => setLightbox(null)}
        />
      )}

      <div className="space-y-6">
        {/* ── Header ─────────────────────────────────────────────────────── */}
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <h1 className="text-2xl font-black flex items-center gap-3">
              <Images className="w-6 h-6 text-primary-500" />
              جالب الصور التلقائي
            </h1>
            <p className="text-gray-500 text-sm mt-1">
              ابحث عن صور منتجاتك تلقائياً وارفعها مباشرة على Cloudinary
            </p>
          </div>

          {/* Batch Controls */}
          <div className="flex items-center gap-2">
            {!isBatchRunning ? (
              <button
                onClick={startBatch}
                disabled={isLoadingProducts || displayedProducts.length === 0}
                className="btn-primary gap-2 text-sm"
              >
                <Sparkles className="w-4 h-4" />
                بحث تلقائي للكل
              </button>
            ) : (
              <>
                <button
                  onClick={() => {
                    pauseRef.current = !pauseRef.current;
                    setBatchPaused(pauseRef.current);
                  }}
                  className="btn-secondary gap-2 text-sm"
                >
                  {batchPaused ? (
                    <><Play className="w-4 h-4" /> استمرار</>
                  ) : (
                    <><Pause className="w-4 h-4" /> إيقاف مؤقت</>
                  )}
                </button>
                <button
                  onClick={() => {
                    stopRef.current = true;
                    pauseRef.current = false;
                    setIsBatchRunning(false);
                  }}
                  className="btn-danger gap-2 text-sm"
                >
                  <X className="w-4 h-4" /> إيقاف
                </button>
              </>
            )}
          </div>
        </div>

        {/* ── Stats ────────────────────────────────────────────────────────── */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: "إجمالي المنتجات", value: allProducts.length, color: "blue" },
            { label: "لها صورة", value: withImageCount, color: "green" },
            { label: "بدون صورة", value: withoutImageCount, color: "yellow" },
            { label: "تم تعيين صور", value: assignedCount, color: "orange" },
          ].map((stat) => (
            <div
              key={stat.label}
              className={`bg-${stat.color}-500/10 border border-${stat.color}-500/20 rounded-xl p-4 text-center`}
            >
              <p className={`text-3xl font-black text-${stat.color}-400`}>
                {stat.value}
              </p>
              <p className="text-xs text-gray-500 mt-1">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* ── Batch progress bar ──────────────────────────────────────────── */}
        {isBatchRunning && (
          <div className="card p-4 space-y-2 animate-fade-in">
            <div className="flex items-center justify-between text-sm">
              <span className="font-medium flex items-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin text-primary-500" />
                {batchPaused
                  ? "متوقف مؤقتاً..."
                  : `جاري البحث... ${batchIndex + 1} / ${pendingCount}`}
              </span>
              <span className="text-gray-500 text-xs">{searchedCount} مكتمل</span>
            </div>
            <div className="h-2 bg-dark-700 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-primary-500 to-brand-orange rounded-full transition-all duration-500"
                style={{
                  width: `${(batchIndex / Math.max(pendingCount, 1)) * 100}%`,
                }}
              />
            </div>
          </div>
        )}

        {/* ── Filters & Search ─────────────────────────────────────────────── */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="ابحث عن منتج..."
              className="w-full input pr-10"
            />
          </div>
          <div className="flex rounded-xl overflow-hidden border border-dark-500">
            {(["all", "without-image"] as FilterMode[]).map((mode) => (
              <button
                key={mode}
                onClick={() => setFilterMode(mode)}
                className={`px-4 py-2 text-sm font-medium transition-colors ${
                  filterMode === mode
                    ? "bg-primary-500 text-white"
                    : "text-gray-400 hover:text-white"
                }`}
              >
                {mode === "all" ? "الكل" : "بدون صورة"}
              </button>
            ))}
          </div>
        </div>

        {/* ── Content ──────────────────────────────────────────────────────── */}
        {isLoadingProducts ? (
          <div className="flex items-center justify-center py-24 gap-3 text-gray-500">
            <Loader2 className="w-6 h-6 animate-spin" />
            <span>جاري تحميل المنتجات...</span>
          </div>
        ) : loadError ? (
          <div className="card p-6 text-center text-red-400 space-y-3">
            <AlertCircle className="w-8 h-8 mx-auto" />
            <p>{loadError}</p>
            <button
              onClick={loadProducts}
              className="btn-secondary gap-2 text-sm mx-auto"
            >
              <RotateCcw className="w-4 h-4" /> إعادة المحاولة
            </button>
          </div>
        ) : displayedProducts.length === 0 ? (
          <div className="card p-12 text-center text-gray-500 space-y-3">
            <Package className="w-12 h-12 mx-auto opacity-40" />
            <p className="font-medium">لا توجد منتجات تطابق الفلتر الحالي</p>
          </div>
        ) : (
          <div className="space-y-3">
            {displayedProducts.map((product) => (
              <ProductRow
                key={product.id}
                product={product}
                onSearch={(customQuery) => searchProductImages(product.id, customQuery)}
                onAssign={(img) =>
                  setLightbox({
                    img,
                    productId: product.id,
                    productName: product.name,
                  })
                }
                onToggle={() =>
                  setDisplayedProducts((prev) =>
                    prev.map((p) =>
                      p.id === product.id
                        ? { ...p, isExpanded: !p.isExpanded }
                        : p
                    )
                  )
                }
              />
            ))}
          </div>
        )}
      </div>
    </>
  );
}

// ─── ProductRow Component ─────────────────────────────────────────────────────

interface ProductRowProps {
  product: ProductWithImages;
  onSearch: (customQuery?: string) => void;
  onAssign: (img: ImageResult) => void;
  onToggle: () => void;
}

function ProductRow({ product, onSearch, onAssign, onToggle }: ProductRowProps) {
  // Pre-fill with product name so the user can directly edit it
  const [customQuery, setCustomQuery] = useState(product.name);

  const handleSearch = () => {
    onSearch(customQuery.trim() || undefined);
  };

  return (
    <div className="card overflow-hidden">
      {/* Row Header */}
      <div className="flex items-center gap-4 p-4">
        {/* Thumbnail or placeholder */}
        <div className="w-14 h-14 rounded-xl overflow-hidden bg-dark-700 flex-shrink-0 flex items-center justify-center border border-dark-500">
          {product.assignedImageUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={product.assignedImageUrl}
              alt={product.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <ImageOff className="w-6 h-6 text-dark-400" />
          )}
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <p className="font-bold truncate">{product.name}</p>
          <p className="text-xs text-gray-500 mt-0.5">
            SKU: {product.sku}
            {product.brand && ` · ${product.brand}`}
          </p>
        </div>

        {/* Status badge */}
        {product.assignedImageUrl ? (
          <span className="flex items-center gap-1.5 text-xs text-green-400 bg-green-500/10 border border-green-500/20 px-3 py-1.5 rounded-lg font-medium flex-shrink-0">
            <CheckCircle className="w-3.5 h-3.5" />
            لها صورة
          </span>
        ) : product.searchError ? (
          <span className="flex items-center gap-1.5 text-xs text-red-400 bg-red-500/10 border border-red-500/20 px-3 py-1.5 rounded-lg font-medium flex-shrink-0">
            <AlertCircle className="w-3.5 h-3.5" />
            خطأ في البحث
          </span>
        ) : null}

        {/* Actions */}
        <div className="flex items-center gap-2 flex-shrink-0">
          {!product.assignedImageUrl && (
            <div className="flex items-center gap-1.5">
              {/* Custom query input */}
              <input
                type="text"
                value={customQuery}
                onChange={(e) => setCustomQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !product.isSearching) handleSearch();
                }}
                placeholder="اكتب اسم المنتج للبحث..."
                disabled={product.isSearching || product.isAssigning}
                className="text-xs bg-white border border-dark-500 focus:border-primary-500 rounded-lg px-3 py-1.5 text-gray-900 placeholder:text-gray-400 outline-none transition-colors w-52 disabled:opacity-50"
                title="عدّل الاسم ثم اضغط بحث أو Enter"
              />
              <button
                onClick={handleSearch}
                disabled={product.isSearching || product.isAssigning}
                className="btn-secondary gap-1.5 text-xs py-1.5 px-3 flex-shrink-0"
              >
                {product.isSearching ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    جاري البحث
                  </>
                ) : (
                  <>
                    <Search className="w-3.5 h-3.5" />
                    {product.searchDone ? "إعادة البحث" : "بحث"}
                  </>
                )}
              </button>
            </div>
          )}  

          {product.searchDone && product.images.length > 0 && (
            <button
              onClick={onToggle}
              className="p-2 text-gray-400 hover:text-white transition-colors"
            >
              {product.isExpanded ? (
                <ChevronDown className="w-4 h-4" />
              ) : (
                <ChevronRight className="w-4 h-4" />
              )}
            </button>
          )}
        </div>
      </div>

      {/* Image Results */}
      {product.isExpanded && product.searchDone && (
        <div className="border-t border-dark-600 p-4 animate-fade-in">
          {product.images.length === 0 ? (
            <p className="text-center text-gray-500 text-sm py-4">
              لم يتم العثور على صور — جرب إعادة البحث
            </p>
          ) : (
            <>
              <p className="text-xs text-gray-500 mb-3 flex items-center gap-1.5">
                <ZoomIn className="w-3.5 h-3.5" />
                اضغط على الصورة لمعاينتها قبل الإضافة
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-8 gap-3">
                {product.images.map((img, i) => (
                  <ImageCard
                    key={i}
                    img={img}
                    isAssigning={product.isAssigning}
                    onPreview={() => onAssign(img)}
                  />
                ))}
              </div>
            </>
          )}
        </div>
      )}

      {/* Assigning overlay */}
      {product.isAssigning && (
        <div className="border-t border-dark-600 p-3 flex items-center gap-3 animate-fade-in bg-primary-500/5">
          <Loader2 className="w-4 h-4 animate-spin text-primary-500" />
          <div>
            <p className="text-sm font-medium">جاري الرفع على Cloudinary...</p>
            <p className="text-xs text-gray-500">سيتم حفظ الصورة للمنتج تلقائياً</p>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── ImageCard Component ──────────────────────────────────────────────────────

function ImageCard({
  img,
  isAssigning,
  onPreview,
}: {
  img: ImageResult;
  isAssigning: boolean;
  onPreview: () => void;
}) {
  const [loaded, setLoaded] = useState(false);
  const [errored, setErrored] = useState(false);

  return (
    <button
      onClick={onPreview}
      disabled={isAssigning}
      className="group relative rounded-xl overflow-hidden bg-dark-700 aspect-square border border-dark-500 hover:border-primary-500 transition-all duration-200 hover:shadow-lg hover:shadow-primary-500/20 focus:outline-none focus:border-primary-500 disabled:opacity-50"
      title="اضغط لمعاينة الصورة"
    >
      {!loaded && !errored && (
        <div className="absolute inset-0 flex items-center justify-center">
          <Loader2 className="w-4 h-4 animate-spin text-gray-600" />
        </div>
      )}
      {errored ? (
        <div className="absolute inset-0 flex items-center justify-center">
          <ImageOff className="w-5 h-5 text-gray-600" />
        </div>
      ) : (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={img.thumbnail}
          alt={img.title}
          className={`w-full h-full object-cover transition-all duration-200 group-hover:scale-105 ${loaded ? "opacity-100" : "opacity-0"}`}
          onLoad={() => setLoaded(true)}
          onError={() => { setErrored(true); setLoaded(true); }}
        />
      )}
      {/* Hover overlay — shows zoom icon */}
      <div className="absolute inset-0 bg-dark-900/0 group-hover:bg-dark-900/50 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
        <div className="bg-white/90 text-dark-900 text-[10px] font-bold px-2 py-1 rounded-lg flex items-center gap-1">
          <ZoomIn className="w-3 h-3" />
          معاينة
        </div>
      </div>
    </button>
  );
}
