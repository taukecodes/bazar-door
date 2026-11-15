"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@heroui/react";

export default function HeroSection() {
  const formattedDate = new Date().toLocaleDateString("bn-BD", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
      {/* Hero Banner Section */}
      <section className="w-full bg-[#f8faf9] border border-slate-200/80 rounded-3xl p-6 sm:p-10 lg:px-14 lg:py-12 flex flex-col md:flex-row items-center justify-between gap-8 shadow-xs">
        {/* Left Content */}
        <div className="flex flex-col items-start text-left max-w-xl">
          {/* Date Badge */}
          <div className="inline-flex items-center px-3.5 py-1.5 rounded-full bg-[#e3f5ea] text-[#008f4c] text-xs sm:text-sm font-semibold mb-4">
            {formattedDate}
          </div>

          {/* Main Heading */}
          <h1 className="text-3xl sm:text-4xl lg:text-[42px] font-extrabold text-[#18181b] leading-tight mb-4">
            আজকের বাজারের দাম এক নজরে
          </h1>

          {/* Subtitle / Description */}
          <p className="text-sm sm:text-base text-slate-600 leading-relaxed mb-7">
            চাল, ডাল, তেল, সবজি, মাছ, মাংস, ডিম ও মসলার দাম — বাজারভিত্তিক
            বিস্তারিত, গড়, সর্বনিম্ন-সর্বাধিক এবং দামের পরিবর্তন এক জায়গায়।
          </p>

          {/* CTA Button wrapped in Link */}
          <Link href="#all-products">
            <Button className="h-11 px-6 rounded-xl bg-[#008f4c] hover:bg-[#007a40] text-white text-sm sm:text-base font-semibold shadow-sm transition-all">
              সব পণ্য দেখুন
            </Button>
          </Link>
        </div>

        {/* Right Illustration */}
        <div className="w-full md:w-auto flex justify-center md:justify-end shrink-0">
          <div className="relative w-56 h-52 sm:w-64 sm:h-60 lg:w-72 lg:h-64">
            <Image
              src="/bazar-hero.png"
              alt="সবজির ঝুড়ি"
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              priority
              className="object-contain"
            />
          </div>
        </div>
      </section>
    </div>
  );
}
