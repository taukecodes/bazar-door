"use client";

import React, { useEffect, useState } from "react";
import { Avatar, Button, Dropdown } from "@heroui/react";
import Link from "next/link";
import Image from "next/image";
import { useSession, authClient } from "@/lib/auth-client";
import { ICategory } from "@/types/type";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const pathname = usePathname();
  const [categories, setCategories] = useState<ICategory[]>([]);
  const { data } = useSession();

  const formattedDate = new Date().toLocaleDateString("bn-BD", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/categories`,
        );
        const data = await res.json();

        if (Array.isArray(data)) {
          setCategories(data);
        } else if (data && data.categories) {
          setCategories(data.categories);
        }
      } catch (error) {
        console.error("Failed to fetch categories:", error);
      }
    };
    fetchCategories();
  }, []);

  const handleSignOut = async () => {
    await authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          window.location.href = "/signin";
        },
      },
    });
  };

  return (
    <header className="w-full bg-white border-b border-slate-200/80 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Top Row: Brand & Auth Buttons */}
        <div className="flex items-center justify-between py-3.5">
          {/* Left: Logo & Date */}
          <div className="flex flex-col gap-1">
            <Link href="/" className="flex items-center gap-2.5 w-fit">
              <div className="w-10 h-10 rounded-xl bg-[#008f4c] flex items-center justify-center text-white shadow-sm overflow-hidden p-1.5">
                <Image
                  src="/logo-icon.png"
                  alt="Bazar Dor Logo"
                  width={32}
                  height={32}
                  className="object-contain"
                />
              </div>
              <div>
                <span className="text-xl sm:text-2xl font-extrabold text-[#18181b] block leading-tight">
                  বাজার দর
                </span>
                <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
                  <span role="img" aria-label="calendar">
                    📅
                  </span>
                  <span>{formattedDate}</span>
                </div>
              </div>
            </Link>
          </div>

          {/* Right: Sign In & Sign Up Actions */}
          <div className="flex items-center gap-2 sm:gap-3">
            {data?.user?.name ? (
              <Dropdown>
                <Button
                  isIconOnly
                  aria-label="Menu"
                  variant="secondary"
                  className="w-auto h-auto rounded-full p-1 pr-3 bg-slate-50 border border-slate-200 flex items-center gap-2"
                >
                  <Avatar className="w-8 h-8">
                    <Avatar.Image
                      alt={data?.user?.name}
                      src={
                        data?.user?.image ||
                        "https://img.heroui.chat/image/avatar?w=400&h=400&u=3"
                      }
                    />
                    <Avatar.Fallback>
                      {data?.user?.name?.slice(0, 2).toUpperCase() || "BD"}
                    </Avatar.Fallback>
                  </Avatar>
                  <span className="text-sm font-semibold text-slate-800 hidden sm:inline">
                    {data?.user?.name}
                  </span>
                </Button>
                <Dropdown.Popover>
                  <Dropdown.Menu
                    onAction={(key) => console.log(`Selected: ${key}`)}
                    className="w-60 p-2"
                  >
                    <Dropdown.Item
                      id="user-info"
                      textValue="User Info"
                      className="border-b border-slate-100 pb-2 mb-1 cursor-default"
                    >
                      <div>
                        <p className="font-bold text-sm text-slate-900">
                          {data?.user?.name}
                        </p>
                        <p className="text-xs text-slate-500">
                          {data?.user?.email}
                        </p>
                      </div>
                    </Dropdown.Item>
                    <Dropdown.Item id="profile" textValue="আমার প্রোফাইল">
                      <Link href="/profile" className="w-full block py-1">
                        👤 আমার প্রোফাইল
                      </Link>
                    </Dropdown.Item>
                    <Dropdown.Item id="logout" textValue="সাইন আউট">
                      <button
                        onClick={handleSignOut}
                        className="w-full text-left text-red-600 py-1 font-medium"
                      >
                        🚪 সাইন আউট
                      </button>
                    </Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown.Popover>
              </Dropdown>
            ) : (
              <div className="flex items-center gap-2">
                <Button
                  type="button"
                  variant="ghost"
                  className="h-9 px-3 rounded-xl text-xs sm:text-sm font-semibold"
                >
                  <Link href="/signin">সাইন ইন</Link>
                </Button>

                <Button
                  type="button"
                  variant="primary"
                  className="h-9 sm:h-10 px-4 sm:px-5 rounded-xl bg-[#008f4c] text-white text-xs sm:text-sm font-semibold"
                >
                  <Link href="/signup">সাইন আপ</Link>
                </Button>
              </div>
            )}
          </div>
        </div>

        {/* Bottom Row: Dynamic Categories Navigation */}
        <nav
          aria-label="Category Navigation"
          className="flex items-center gap-5 sm:gap-8 py-2.5 overflow-x-auto no-scrollbar border-t border-slate-100"
        >
          {categories && categories.length > 0 ? (
            categories.map((cat) => {
              const isActive =
                pathname === `/${cat.slug}` ||
                pathname === `/category/${cat.slug}`;

              return (
                <Link
                  key={cat.id}
                  href={`/category/${cat.slug}`}
                  className={`flex items-center gap-1.5 text-xs sm:text-sm font-medium transition-colors whitespace-nowrap ${
                    isActive
                      ? "text-[#008f4c] font-semibold"
                      : "text-slate-700 hover:text-[#008f4c]"
                  }`}
                >
                  <span className="text-base leading-none">{cat.icon}</span>
                  <span>{cat.nameBn}</span>
                </Link>
              );
            })
          ) : (
            <span className="text-xs text-slate-400 py-1.5">লোড হচ্ছে...</span>
          )}
        </nav>
      </div>
    </header>
  );
}
