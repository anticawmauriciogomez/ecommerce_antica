
"use client";

import { useState, useMemo } from "react";
import { Search, Plus, Edit, PackageSearch } from "lucide-react";
import Link from "next/link";
import { DeleteButton } from "@/components/ui/DeleteButton";

type Product = {
  id: string;
  name: any;
  price: number;
  available: boolean;
  buyable: boolean;
  categories: {
    name: any;
  } | null;
  created_at: string;
};

interface ProductListProps {
  initialProducts: Product[];
  deleteProductAction: (id: string) => Promise<any>;
  currency: { code: string; symbol: string };
}

export function ProductList({ initialProducts, deleteProductAction, currency }: ProductListProps) {
  const [searchTerm, setSearchTerm] = useState("");

  const normalize = (str: string) => 
    str.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();

  const filteredProducts = useMemo(() => {
    if (!searchTerm.trim()) return initialProducts;

    const normalizedSearch = normalize(searchTerm);

    return initialProducts.filter((product) => {
      // Get names in both languages if available
      const nameEs = typeof product.name === "object" ? product.name?.es || "" : product.name || "";
      const nameEn = typeof product.name === "object" ? product.name?.en || "" : "";
      const categoryEs = typeof product.categories?.name === "object" ? product.categories?.name?.es || "" : product.categories?.name || "";
      const categoryEn = typeof product.categories?.name === "object" ? product.categories?.name?.en || "" : "";

      return (
        normalize(nameEs).includes(normalizedSearch) ||
        normalize(nameEn).includes(normalizedSearch) ||
        normalize(categoryEs).includes(normalizedSearch) ||
        normalize(categoryEn).includes(normalizedSearch)
      );
    });
  }, [initialProducts, searchTerm]);

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="sticky -top-8 md:-top-12 z-20 bg-(--background)/95 backdrop-blur-md pt-8 md:pt-12 pb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-6 border-b border-(--card-border)">
        <div>
          <h1
            className="text-4xl font-normal tracking-tight"
            style={{
              color: "var(--foreground)",
              fontFamily: "var(--font-serif)",
            }}
          >
            Productos & Experiencias
          </h1>
          <div className="flex items-center gap-3 mt-1">
            <div className="h-0.5 w-6 bg-accent-gold/40 rounded-full" />
            <p className="text-[10px] font-bold text-accent-gold/60 uppercase tracking-[2px]">
              Gestión de inventario y catálogo
            </p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
          {/* Search Bar */}
          <div className="relative group">
            <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-accent-gold/40 group-focus-within:text-accent-gold transition-colors">
              <Search size={16} />
            </div>
            <input
              type="text"
              placeholder="Buscar por nombre o categoría..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-12 pr-4 py-2.5 w-full sm:w-[300px] rounded-2xl bg-accent-gold/[0.04] border border-accent-gold/10 text-sm focus:outline-none focus:ring-2 focus:ring-accent-gold/20 focus:border-accent-gold/30 transition-all placeholder:text-accent-gold/30"
            />
          </div>

          <Link
            href="/products/new"
            className="flex items-center justify-center gap-2 rounded-xl px-6 py-2.5 text-sm font-bold text-white shadow-xl shadow-accent-gold/20 transition-all duration-300 hover:scale-[1.02] bg-[#cba87c]"
          >
            <Plus size={18} />
            Añadir
          </Link>
        </div>
      </div>

      {/* Table Section */}
      <div className="overflow-hidden rounded-3xl border border-(--card-border) bg-(--card-bg) shadow-[0_4px_20px_rgba(26,21,18,0.02)]">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-accent-gold/[0.03] text-[10px] font-bold uppercase tracking-widest text-accent-gold/60 border-b border-(--card-border)">
              <tr>
                <th scope="col" className="px-8 py-6">Nombre</th>
                <th scope="col" className="px-8 py-6">Categoría</th>
                <th scope="col" className="px-8 py-6">Precio</th>
                <th scope="col" className="px-8 py-6">Disponible</th>
                <th scope="col" className="px-8 py-6">Comprable</th>
                <th scope="col" className="px-8 py-6 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-(--card-border)">
              {filteredProducts.map((product) => {
                const displayName = typeof product.name === "object"
                  ? product.name?.es || product.name?.en || "Unnamed"
                  : product.name;
                const categoryNameObj = product.categories?.name;
                const displayCategory = typeof categoryNameObj === "object"
                  ? categoryNameObj?.es || categoryNameObj?.en || "General"
                  : categoryNameObj || "General";

                return (
                  <tr
                    key={product.id}
                    className="hover:bg-accent-gold/[0.01] transition-colors group"
                  >
                    <td className="px-8 py-6 font-bold text-(--foreground)">
                      {displayName}
                    </td>
                    <td className="px-8 py-6">
                      <span className="inline-flex items-center rounded-lg bg-accent-gold/[0.05] px-3 py-1.5 text-[9px] font-black uppercase tracking-widest text-accent-gold border border-accent-gold/10">
                        {displayCategory}
                      </span>
                    </td>
                    <td className="px-8 py-6 text-(--foreground) font-semibold italic">
                      {currency.symbol} {product.price} {currency.code}
                    </td>
                    <td className="px-8 py-6">
                      <span
                        className={`inline-flex items-center rounded-lg px-3 py-1.5 text-[9px] font-black uppercase tracking-widest border ${product.available ? "bg-green-500/10 text-green-600 border-green-500/20" : "bg-gray-500/10 text-gray-500 border-gray-500/20 opacity-50"}`}
                      >
                        {product.available ? "Sí" : "No"}
                      </span>
                    </td>
                    <td className="px-8 py-6">
                      <span
                        className={`inline-flex items-center rounded-lg px-3 py-1.5 text-[9px] font-black uppercase tracking-widest border ${product.buyable ? "bg-blue-500/10 text-blue-600 border-blue-500/20" : "bg-gray-500/10 text-gray-500 border-gray-500/20 opacity-50"}`}
                      >
                        {product.buyable ? "Sí" : "No"}
                      </span>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex gap-6 items-center justify-end">
                        <Link
                          href={`/products/${product.id}/edit`}
                          className="text-accent-gold/70 hover:text-accent-gold font-black text-[9px] uppercase tracking-widest flex items-center gap-2 transition-all hover:scale-105"
                        >
                          <Edit className="h-3.5 w-3.5" /> Editar
                        </Link>
                        <DeleteButton
                          id={product.id}
                          deleteAction={deleteProductAction}
                          itemType="producto"
                        />
                      </div>
                    </td>
                  </tr>
                );
              })}

              {filteredProducts.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-8 py-20 text-center">
                    <div className="flex flex-col items-center gap-4 text-accent-gold/40">
                      <PackageSearch size={48} strokeWidth={1} />
                      <p className="italic font-medium text-sm" style={{ fontFamily: "var(--font-serif)" }}>
                        No se encontraron productos que coincidan con "{searchTerm}"
                      </p>
                      <button 
                        onClick={() => setSearchTerm("")}
                        className="text-[10px] font-black uppercase tracking-widest text-accent-gold hover:underline"
                      >
                        Limpiar búsqueda
                      </button>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
