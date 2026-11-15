"use client";

import React, { useEffect, useState } from "react";
import Marquee from "react-fast-marquee";
import Link from "next/link";
import { Chip } from "@heroui/react";
import { IProduct } from "@/types/type";

export default function Marque() {
  const [products, setProducts] = useState<IProduct[]>([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/products`);
        const data = await res.json();

        if (Array.isArray(data)) {
          setProducts(data);
        } else if (data && data.products) {
          setProducts(data.products);
        }
      } catch (error) {
        console.error("Failed to fetch products for marquee:", error);
      }
    };
    fetchProducts();
  }, []);

  return (
    <div className="w-full bg-[#f8fafc] text-slate-800 flex items-center h-11 overflow-hidden border-b border-slate-200 shadow-sm">
      {/* Scrolling Marquee Section */}
      <Marquee
        pauseOnHover={true}
        speed={45}
        gradient={false}
        className="flex items-center h-full overflow-hidden"
      >
        {products.length > 0 ? (
          products.map((item) => {
            const isUp = item.change?.dir === "up";
            const isDown = item.change?.dir === "down";

            return (
              <Link
                key={item.id}
                href={`/product/${item.slug}`}
                className="flex items-center gap-2 mx-3 px-3 py-1 rounded-lg hover:bg-slate-200/60 transition-colors whitespace-nowrap text-xs sm:text-sm"
              >
                {/* Product Icon */}
                <span className="text-base leading-none">
                  {item.categoryIcon}
                </span>

                {/* Product Name */}
                <span className="font-bold text-slate-900">{item.nameBn}</span>

                {/* Today's Price */}
                <span className="font-bold text-slate-700">
                  {item.today} টাকা
                </span>

                {/* Price Change Chip */}
                <Chip
                  size="sm"
                  className={`px-2.5 py-0.5 h-5 rounded-full text-[11px] font-bold flex items-center gap-0.5 ${
                    isUp
                      ? "bg-red-50 text-red-600"
                      : isDown
                        ? "bg-emerald-50 text-emerald-600"
                        : "bg-slate-100 text-slate-600"
                  }`}
                >
                  {isUp && "▲"}
                  {isDown && "▼"}
                  {!isUp && !isDown && "•"}
                  {item.change?.pct}%
                </Chip>
              </Link>
            );
          })
        ) : (
          <span className="text-xs text-slate-400 px-4">
            বাজারের লাইভ দর লোড হচ্ছে...
          </span>
        )}
      </Marquee>
    </div>
  );
}
