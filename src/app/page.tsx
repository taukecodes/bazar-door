"use client";

import HeroSection from "@/components/Hero";
import PriceIncreaseSection from "@/components/PriceIncreaseSection";
import PriceDecreaseSection from "@/components/PriceDecreaseSection";
import AllProductsSection from "@/components/AllProductsSection";

export default function HomePage() {
  return (
    <div>
      <HeroSection />
      <PriceIncreaseSection />
      <PriceDecreaseSection />
      <AllProductsSection />
    </div>
  );
}
