import React from "react";
import Link from "next/link";
import { Card, Chip } from "@heroui/react";
import {
  Home,
  ChevronRight,
  MapPin,
  TrendingDown,
  TrendingUp,
  Calculator,
  CheckCircle2,
  Info,
} from "lucide-react";
import { IProduct } from "@/types/type";

const ProductDetailsPage = async ({
  params,
}: {
  params: Promise<{ slug: string }>;
}) => {
  const { slug } = await params;
  let product: IProduct | null = null;

  try {
    // সরাসরি সব প্রোডাক্ট ফেচ করে স্লাগ বা আইডি দিয়ে খুঁজে নেওয়া
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/products`, {
      cache: "no-store",
    });
    if (res.ok) {
      const products: IProduct[] = await res.json();
      product =
        products.find(
          (item) => item.slug === slug || String(item.id) === slug,
        ) || null;
    }
  } catch (error) {
    console.error("Error fetching product details:", error);
  }

  if (!product) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-20 text-center space-y-4">
        <span className="text-6xl block">🛒</span>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900">
          পণ্যের তথ্য খুঁজে পাওয়া যায়নি
        </h1>
        <p className="text-sm text-slate-500 max-w-md mx-auto">
          আপনি যে পণ্যের তথ্য খুঁজছেন সেটি সঠিক নয় অথবা সিস্টেম থেকে সরিয়ে
          নেওয়া হয়েছে।
        </p>
        <div className="pt-2">
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-6 py-3 bg-[#008f4c] hover:bg-[#007a41] text-white font-bold rounded-xl text-sm shadow-md transition-colors"
          >
            <Home className="w-5 h-5" />
            <span>হোম পেজে ফিরে যান</span>
          </Link>
        </div>
      </div>
    );
  }

  const markets = [...(product.markets || [])].sort((a, b) => a.min - b.min);
  const minMarket = markets[0];
  const maxMarket = markets[markets.length - 1];

  const avgPrice =
    markets.length > 0
      ? Math.round(
          markets.reduce((sum, m) => sum + (m.min + m.max) / 2, 0) /
            markets.length,
        )
      : product.today;

  return (
    <main className="min-h-screen w-full py-6 sm:py-10 bg-[#f8fafc]">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 space-y-6">
        {/* ব্রেডক্রাম্ব */}
        <div className="flex items-center gap-2 text-xs sm:text-sm font-medium text-slate-500">
          <Link
            href="/"
            className="flex items-center gap-1 hover:text-[#008f4c] transition-colors"
          >
            <Home size={14} />
            <span>হোম</span>
          </Link>
          <ChevronRight size={14} />
          <Link
            href={`/category/${product.category}`}
            className="flex items-center gap-1 hover:text-[#008f4c] transition-colors"
          >
            <span>{product.categoryIcon}</span>
            <span>{product.categoryNameBn}</span>
          </Link>
          <ChevronRight size={14} />
          <span className="font-bold text-slate-900">{product.nameBn}</span>
        </div>

        {/* মেইন প্রোডাক্ট হেডার কার্ড */}
        <Card className="bg-white rounded-3xl border border-slate-200/80 p-5 sm:p-7 shadow-2xs space-y-6">
          <Card.Content className="p-0 flex flex-col md:flex-row md:items-center justify-between gap-5">
            <div className="flex items-center gap-4 sm:gap-5">
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-[#f1f5f9] border border-slate-200/60 flex items-center justify-center text-3xl sm:text-4xl shrink-0">
                {product.image}
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center gap-2">
                  <Chip
                    size="sm"
                    className="px-2.5 py-0.5 h-auto rounded-full bg-emerald-50 text-[#008f4c] font-bold text-xs"
                  >
                    {product.categoryNameBn}
                  </Chip>
                  <Chip
                    size="sm"
                    className="px-2.5 py-0.5 h-auto rounded-full bg-slate-100 text-slate-600 font-semibold text-xs"
                  >
                    প্রতি {product.unit}
                  </Chip>
                </div>
                <Card.Title className="text-2xl sm:text-3xl font-extrabold text-slate-900">
                  {product.nameBn}
                </Card.Title>
                <Card.Description className="text-xs sm:text-sm text-slate-500 font-medium">
                  সারাদেশের খুচরা বাজারে {product.nameBn}-এর বর্তমান বাজার দর ও
                  তুলনামূলক বিশ্লেষণ।
                </Card.Description>
              </div>
            </div>

            {/* আজকের দর বক্স */}
            <div className="bg-[#f8fafc] border border-slate-200/80 rounded-2xl px-5 py-3.5 flex flex-col md:items-end shrink-0">
              <span className="text-[11px] font-medium text-slate-400">
                আজকের বাজার দর
              </span>
              <div className="flex items-baseline gap-1.5 mt-0.5">
                <span className="text-2xl sm:text-3xl font-black text-slate-900">
                  {product.today.toLocaleString("bn-BD")} টাকা
                </span>
                <span className="text-xs font-medium text-slate-400">
                  / {product.unit}
                </span>
              </div>

              <Chip
                size="sm"
                className={`mt-2 px-2.5 py-0.5 h-auto rounded-full text-xs font-bold ${
                  product.change.dir === "up"
                    ? "bg-rose-50 text-rose-600"
                    : product.change.dir === "down"
                      ? "bg-emerald-50 text-[#008f4c]"
                      : "bg-slate-100 text-slate-600"
                }`}
              >
                {product.change.dir === "up"
                  ? "▲"
                  : product.change.dir === "down"
                    ? "▼"
                    : "—"}{" "}
                {Math.abs(product.change.pct).toLocaleString("bn-BD")}%
              </Chip>
            </div>
          </Card.Content>

          {/* ৪টি তথ্য পরিসংখ্যান */}
          <Card.Footer className="p-0 pt-5 border-t border-slate-100 grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-[#008f4c] flex items-center justify-center">
                <MapPin size={18} />
              </div>
              <div>
                <p className="text-[11px] text-slate-400">যাচাইকৃত বাজার</p>
                <p className="text-xs sm:text-sm font-bold text-slate-800">
                  {markets.length.toLocaleString("bn-BD")}টি বাজার
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-extrabold text-xs">
                গতকাল
              </div>
              <div>
                <p className="text-[11px] text-slate-400">গতকালের দর</p>
                <p className="text-xs sm:text-sm font-bold text-slate-800">
                  {product.yesterday.toLocaleString("bn-BD")} টাকা
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-extrabold text-xs">
                সপ্তাহ
              </div>
              <div>
                <p className="text-[11px] text-slate-400">গত সপ্তাহের দর</p>
                <p className="text-xs sm:text-sm font-bold text-slate-800">
                  {product.lastWeek.toLocaleString("bn-BD")} টাকা
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-600 flex items-center justify-center font-extrabold text-xs">
                মাস
              </div>
              <div>
                <p className="text-[11px] text-slate-400">গত মাসের দর</p>
                <p className="text-xs sm:text-sm font-bold text-slate-800">
                  {product.lastMonth.toLocaleString("bn-BD")} টাকা
                </p>
              </div>
            </div>
          </Card.Footer>
        </Card>

        {/* সর্বনিম্ন, সর্বোচ্চ ও গড় দামের ৩টি কার্ড */}
        {markets.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <Card className="bg-[#f0fdf4] border border-emerald-200/80 rounded-3xl p-5 space-y-2 shadow-none">
              <Card.Header className="p-0 flex items-center justify-between">
                <Card.Title className="text-xs sm:text-sm font-bold text-emerald-900">
                  সর্বনিম্ন বাজার দর
                </Card.Title>
                <div className="w-8 h-8 rounded-lg bg-emerald-100 text-[#008f4c] flex items-center justify-center">
                  <TrendingDown size={16} />
                </div>
              </Card.Header>
              <Card.Content className="p-0 text-2xl sm:text-3xl font-black text-emerald-800">
                {minMarket.min.toLocaleString("bn-BD")} টাকা
              </Card.Content>
              <Card.Footer className="p-0 text-xs font-semibold text-[#008f4c]">
                বাজার: {minMarket.market} ({minMarket.division})
              </Card.Footer>
            </Card>

            <Card className="bg-[#fff1f2] border border-rose-200/80 rounded-3xl p-5 space-y-2 shadow-none">
              <Card.Header className="p-0 flex items-center justify-between">
                <Card.Title className="text-xs sm:text-sm font-bold text-rose-900">
                  সর্বোচ্চ বাজার দর
                </Card.Title>
                <div className="w-8 h-8 rounded-lg bg-rose-100 text-rose-700 flex items-center justify-center">
                  <TrendingUp size={16} />
                </div>
              </Card.Header>
              <Card.Content className="p-0 text-2xl sm:text-3xl font-black text-rose-900">
                {maxMarket.max.toLocaleString("bn-BD")} টাকা
              </Card.Content>
              <Card.Footer className="p-0 text-xs font-semibold text-rose-700">
                বাজার: {maxMarket.market} ({maxMarket.division})
              </Card.Footer>
            </Card>

            <Card className="bg-[#eff6ff] border border-blue-200/80 rounded-3xl p-5 space-y-2 shadow-none">
              <Card.Header className="p-0 flex items-center justify-between">
                <Card.Title className="text-xs sm:text-sm font-bold text-blue-900">
                  গড় বাজার দর
                </Card.Title>
                <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center">
                  <Calculator size={16} />
                </div>
              </Card.Header>
              <Card.Content className="p-0 text-2xl sm:text-3xl font-black text-blue-900">
                {avgPrice.toLocaleString("bn-BD")} টাকা
              </Card.Content>
              <Card.Footer className="p-0 text-xs font-semibold text-blue-600">
                সারাদেশের বাজারগুলোর গড় হিসাব
              </Card.Footer>
            </Card>
          </div>
        )}

        {/* বাজারভিত্তিক আজকের দর টেবিল কার্ড */}
        <Card className="bg-white rounded-3xl border border-slate-200/80 p-5 sm:p-7 shadow-2xs space-y-5">
          <Card.Header className="p-0 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <Card.Title className="text-lg sm:text-xl font-extrabold text-slate-900">
                বাজারভিত্তিক আজকের দর
              </Card.Title>
              <Card.Description className="text-xs text-slate-500 font-medium">
                দেশের বিভিন্ন অঞ্চলের পাইকারি ও খুচরা বাজারের সর্বনিম্ন ও
                সর্বোচ্চ দামের তালিকা
              </Card.Description>
            </div>
            <Chip
              size="sm"
              className="px-3 py-1.5 h-auto rounded-full bg-emerald-50 border border-emerald-200 text-[#008f4c] text-xs font-bold flex items-center gap-1.5"
            >
              <CheckCircle2 size={14} />
              <span>নিয়মিত আপডেটকৃত ডেটা</span>
            </Chip>
          </Card.Header>

          <Card.Content className="p-0 overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-y border-slate-100 text-xs font-bold text-slate-400">
                  <th className="py-3 px-4">বাজারের নাম</th>
                  <th className="py-3 px-4">বিভাগ</th>
                  <th className="py-3 px-4 text-right">সর্বনিম্ন (টাকা)</th>
                  <th className="py-3 px-4 text-right">সর্বোচ্চ (টাকা)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs sm:text-sm">
                {markets.map((mkt, idx) => (
                  <tr key={idx} className={idx === 0 ? "bg-emerald-50/40" : ""}>
                    <td className="py-4 px-4 font-bold text-slate-900">
                      <div className="flex items-center gap-2">
                        <span>{mkt.market}</span>
                        {idx === 0 && (
                          <Chip
                            size="sm"
                            className="px-2 py-0.5 h-auto rounded-md bg-emerald-100 text-[#008f4c] text-[10px] font-extrabold"
                          >
                            কম দাম
                          </Chip>
                        )}
                      </div>
                    </td>
                    <td className="py-4 px-4 text-slate-500 font-medium">
                      <Chip
                        size="sm"
                        className="px-2.5 py-1 h-auto rounded-lg bg-slate-100 text-slate-700 font-semibold text-xs"
                      >
                        {mkt.division}
                      </Chip>
                    </td>
                    <td className="py-4 px-4 text-right font-extrabold text-sm sm:text-base text-[#008f4c]">
                      {mkt.min.toLocaleString("bn-BD")} টাকা
                    </td>
                    <td className="py-4 px-4 text-right font-extrabold text-sm sm:text-base text-rose-600">
                      {mkt.max.toLocaleString("bn-BD")} টাকা
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Card.Content>

          <Card.Footer className="p-0 pt-3 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-[11px] text-slate-400">
            <span>* বাজারভেদে পণ্যের মান ও দাম কিছুটা তারতম্য হতে পারে।</span>
            <span>মুদ্রা: BDT (বাংলাদেশি টাকা)</span>
          </Card.Footer>
        </Card>

        {/* গুরুত্বপূর্ণ তথ্য ও নীতিমালা কার্ড */}
        <Card className="bg-[#fffbeb] border border-amber-200 rounded-2xl p-4 sm:p-5 shadow-none">
          <Card.Content className="p-0 flex items-start gap-3">
            <Info size={18} className="text-amber-600 shrink-0 mt-0.5" />
            <div className="space-y-1 text-xs sm:text-sm">
              <Card.Title className="font-extrabold text-amber-950 text-xs sm:text-sm">
                বাজার দর মনিটরিং ও সতর্কতা:
              </Card.Title>
              <Card.Description className="text-amber-900 font-medium">
                উক্ত বাজার দরগুলো পাইকারি ও খুচরা বাজারের সার্বিক জরিপের ওপর
                ভিত্তি করে নির্ধারিত। বাজার ভেদে দামের ভিন্নতা থাকতে পারে।
              </Card.Description>
              <p className="text-[11px] text-amber-700">
                * এটি সরকারি বাজার দর তথ্য সেবা। কোনো পণ্য ক্রয়ের পূর্বে
                স্থানীয় বাজারের সাথে যাচাই করে নেওয়ার অনুরোধ করা হলো।
              </p>
            </div>
          </Card.Content>
        </Card>
      </div>
    </main>
  );
};

export default ProductDetailsPage;
