"use client";

import { IProduct } from "@/types/type";
import { Chip } from "@heroui/react";
import { TrendingUp } from "lucide-react";
import { useEffect, useState } from "react";
import ProductCard from "@/components/ProductCard";

export default function PriceIncreaseSection() {
  const [topIncreasedProducts, setTopIncreasedProducts] = useState<IProduct[]>(
    [],
  );
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/products`);
        const data: IProduct[] = await res.json();

        const filteredData = data
          .filter((item) => item.change?.dir === "up")
          .sort((a, b) => b.change.pct - a.change.pct)
          .slice(0, 6);

        setTopIncreasedProducts(filteredData);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  return (
    <section className="w-full py-12 bg-[#f8fafc]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 mb-7">
          <div className="flex flex-col items-start gap-2">
            {/* Top Red Badge matching Figma */}
            <Chip
              size="sm"
              className="px-3 py-1 h-auto rounded-full bg-[#fff1f2] text-[#e11d48] font-bold text-xs flex items-center gap-1.5 border border-[#ffe4e6]"
            >
              <TrendingUp size={14} className="shrink-0" />
              <span>মূল্য বৃদ্ধি</span>
            </Chip>

            {/* Main Title with Red Arrow */}
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 flex items-center gap-2">
              <span>আজ দাম বেড়েছে</span>
              <span className="text-[#e11d48] text-xl sm:text-2xl">▲</span>
            </h2>

            {/* Subtitle */}
            <p className="text-xs sm:text-sm text-slate-500 font-medium">
              আজ যেসব পণ্যের দাম সর্বোচ্চ বৃদ্ধি পেয়েছে (শীर्ष ৬টি পণ্য)
            </p>
          </div>

          {/* Right Sort Info Text */}
          <span className="text-xs text-slate-400 font-medium">
            সর্বোচ্চ থেকে ক্রমানুসারে সাজানো
          </span>
        </div>

        {/* Loading Skeleton / Product Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, idx) => (
              <div
                key={idx}
                className="h-64 rounded-3xl bg-slate-200/60 animate-pulse"
              />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {topIncreasedProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
