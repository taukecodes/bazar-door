"use client";

import { useState, useEffect } from "react";
import { useSession, authClient } from "@/lib/auth-client";
import { Button } from "@heroui/react";
import toast, { Toaster } from "react-hot-toast";
import Image from "next/image";

export default function ProfilePage() {
  const { data: session, isPending, refetch } = useSession();
  const user = session?.user;

  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user?.name) {
      setName(user.name);
    }
  }, [user]);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await authClient.updateUser(
        {
          name: name,
        },
        {
          onSuccess: () => {
            toast.success("প্রোফাইল আপডেট সফল হয়েছে! ✅");
            refetch();
          },
          onError: (ctx) => {
            toast.error(ctx.error.message || "আপডেট করতে সমস্যা হয়েছে।");
          },
        },
      );
    } catch (err) {
      toast.error("একটি ত্রুটি ঘটেছে।");
    } finally {
      setLoading(false);
    }
  };

  if (isPending) {
    return (
      <div className="min-h-screen bg-[#f8fafc] flex items-center justify-center">
        <p className="text-sm text-slate-500 font-medium">লোড হচ্ছে...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8fafc] py-10 px-4 sm:px-6">
      {/* Toast Container */}
      <Toaster position="top-right" reverseOrder={false} />

      <div className="max-w-3xl mx-auto bg-white rounded-3xl border border-slate-200/80 shadow-[0_4px_20px_rgba(15,23,42,0.03)] p-6 sm:p-8">
        {/* Header Title & Subtitle */}
        <div className="mb-6">
          <h1 className="text-xl font-black text-[#18181b]">আমার প্রোফাইল</h1>
          <p className="text-xs text-slate-500 mt-1">
            আপনার অ্যাকাউন্টের তথ্য এখানে পরিবর্তন করতে পারেন।
          </p>
        </div>

        {/* User Card Box */}
        <div className="flex items-center justify-between p-4 rounded-2xl border border-slate-100 bg-[#f8fafc] mb-6">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-full overflow-hidden shrink-0 border border-slate-200 bg-white">
              <Image
                className="w-full h-full object-cover"
                src={
                  user?.image ||
                  "https://img.heroui.chat/image/avatar?w=400&h=400&u=3"
                }
                alt={user?.name || "User Avatar"}
                height={56}
                width={56}
              />
            </div>
            <div>
              <h3 className="font-bold text-[#18181b]">
                {user?.name || "ব্যবহারকারী"}
              </h3>
              <p className="text-xs text-slate-500">{user?.email}</p>
            </div>
          </div>

          {/* Sign Out Button */}
          <Button
            size="sm"
            // variant="bordered"
            className="font-semibold text-red-600 border-red-200 hover:bg-red-50 bg-white rounded-xl"
            onPress={async () => {
              await authClient.signOut({
                fetchOptions: {
                  onSuccess: () => {
                    window.location.href = "/signin";
                  },
                },
              });
            }}
          >
            সাইন আউট
          </Button>
        </div>

        {/* Information Form */}
        <form onSubmit={handleUpdateProfile} className="space-y-4">
          <h3 className="text-sm font-bold text-[#18181b]">তথ্য</h3>

          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1.5">
              নাম
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-sm text-slate-700 focus:outline-none focus:border-[#008f4c] transition-colors"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1.5">
              ইমেইল (পরিবর্তনযোগ্য নয়)
            </label>
            <input
              type="text"
              readOnly
              value={user?.email || ""}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-sm text-slate-400 cursor-not-allowed focus:outline-none"
            />
          </div>

          {/* Action Button */}
          <div className="pt-4">
            <Button
              type="submit"
              //isLoading={loading}
              className="w-full bg-[#008f4c] hover:bg-[#007a40] text-white font-semibold h-11 rounded-xl shadow-sm text-sm"
            >
              {loading ? "আপডেট হচ্ছে..." : "আপডেট"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
