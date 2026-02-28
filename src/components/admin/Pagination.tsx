"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface PaginationProps {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    pageSize: number;
    /** "dark" = admin panel, "light" = storefront. Defaults to "dark". */
    theme?: "dark" | "light";
}

export default function Pagination({
    currentPage,
    totalPages,
    totalItems,
    pageSize,
    theme = "dark",
}: PaginationProps) {
    const router = useRouter();
    const searchParams = useSearchParams();

    const goTo = (page: number) => {
        const params = new URLSearchParams(searchParams.toString());
        params.set("page", String(page));
        router.push(`?${params.toString()}`);
        document
            .getElementById("products")
            ?.scrollIntoView({ behavior: "smooth", block: "start" });
    };

    if (totalPages <= 1) return null;

    // Build visible page numbers: first, last, and currentPage ±2
    const pages: (number | "…")[] = [];
    for (let i = 1; i <= totalPages; i++) {
        if (
            i === 1 ||
            i === totalPages ||
            (i >= currentPage - 2 && i <= currentPage + 2)
        ) {
            pages.push(i);
        } else if (pages[pages.length - 1] !== "…") {
            pages.push("…");
        }
    }

    const start = (currentPage - 1) * pageSize + 1;
    const end = Math.min(currentPage * pageSize, totalItems);
    const isDark = theme === "dark";

    return (
        <div
            className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4"
            dir="rtl"
        >
            {/* Info text */}
            <p className={`text-sm ${isDark ? "text-gray-400" : "text-slate-500"}`}>
                عرض{" "}
                <span
                    className={`font-semibold ${isDark ? "text-white" : "text-brand-navy"}`}
                >
                    {start}–{end}
                </span>{" "}
                من{" "}
                <span
                    className={`font-semibold ${isDark ? "text-white" : "text-brand-navy"}`}
                >
                    {totalItems}
                </span>{" "}
                منتج
            </p>

            {/* Page controls */}
            <div className="flex items-center gap-1">
                {/* Previous */}
                <button
                    onClick={() => goTo(currentPage - 1)}
                    disabled={currentPage === 1}
                    aria-label="الصفحة السابقة"
                    className={`flex items-center justify-center w-9 h-9 rounded-lg border transition-colors disabled:opacity-30 disabled:pointer-events-none ${isDark
                            ? "border-dark-600 text-gray-400 hover:text-white hover:border-primary-500"
                            : "border-slate-200 bg-white text-slate-500 hover:text-brand-navy hover:border-brand-orange shadow-sm"
                        }`}
                >
                    <ChevronRight className="w-4 h-4" />
                </button>

                {/* Page numbers */}
                {pages.map((p, i) =>
                    p === "…" ? (
                        <span
                            key={`ellipsis-${i}`}
                            className={`w-9 h-9 flex items-center justify-center text-sm ${isDark ? "text-gray-500" : "text-slate-400"}`}
                        >
                            …
                        </span>
                    ) : (
                        <button
                            key={p}
                            onClick={() => goTo(p as number)}
                            aria-current={p === currentPage ? "page" : undefined}
                            className={`w-9 h-9 rounded-lg text-sm font-medium transition-colors ${p === currentPage
                                    ? isDark
                                        ? "bg-primary-500 text-white"
                                        : "bg-brand-orange text-white shadow-sm"
                                    : isDark
                                        ? "border border-dark-600 text-gray-400 hover:text-white hover:border-primary-500"
                                        : "border border-slate-200 bg-white text-slate-600 hover:text-brand-navy hover:border-brand-orange shadow-sm"
                                }`}
                        >
                            {p}
                        </button>
                    )
                )}

                {/* Next */}
                <button
                    onClick={() => goTo(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    aria-label="الصفحة التالية"
                    className={`flex items-center justify-center w-9 h-9 rounded-lg border transition-colors disabled:opacity-30 disabled:pointer-events-none ${isDark
                            ? "border-dark-600 text-gray-400 hover:text-white hover:border-primary-500"
                            : "border-slate-200 bg-white text-slate-500 hover:text-brand-navy hover:border-brand-orange shadow-sm"
                        }`}
                >
                    <ChevronLeft className="w-4 h-4" />
                </button>
            </div>
        </div>
    );
}
