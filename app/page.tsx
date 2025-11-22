"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";

type Role = "owner" | "member";

export default function DashboardPage() {
  const [role, setRole] = useState<Role | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  // Redirect /modules to homepage
  useEffect(() => {
    if (pathname === "/modules") {
      router.replace("/");
    }
  }, [pathname, router]);

  // Fetch Whop context
  useEffect(() => {
    async function fetchContext() {
      try {
        const res = await fetch("/api/context");
        const data = await res.json();

        if (data.ok && data.context?.user?.role) {
          setRole(data.context.user.role);
        } else {
          setRole("member"); // fallback
        }
      } catch (err) {
        console.error(err);
        setRole("member"); // fallback
      }

      setLoading(false);
    }

    fetchContext();
  }, []);

  if (loading || !role) {
    return (
      <div className="flex min-h-screen items-center justify-center text-white">
        Loading your experience...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0e0e0e] text-white px-8 py-16 flex flex-col items-center">

      {/* Logo */}
      <Image
        src="/logo.png"
        alt="Course Compass Logo"
        width={90}
        height={90}
        className="mb-4"
      />

      <h1 className="text-4xl font-bold mb-2">Course Compass</h1>
      <p className="text-white/60 mb-12 text-center">
        Your centralized hub for building & managing courses.
      </p>

      {/* Button Container */}
      <div className="flex flex-col gap-4 w-full max-w-sm">

        {/* Connect Whop Course */}
        <button
          onClick={() => alert("Whop course connection coming soon!")}
          className="w-full bg-gradient-to-r from-[#ff5a1f] to-[#ff9966] py-3 rounded-xl font-semibold text-center hover:shadow-[0_0_20px_rgba(255,90,31,0.6)] transition-all"
        >
          Connect Whop Course
        </button>

        {/* Start From Scratch */}
        <button
          onClick={() => router.push("/course-customize/new")}
          className="w-full bg-[#1a1a1a] border border-white/10 py-3 rounded-xl font-semibold text-center hover:bg-[#222] transition-all"
        >
          Start From Scratch
        </button>
      </div>

      {/* Empty State */}
      <div className="mt-16 text-center">
        <h2 className="text-2xl font-semibold mb-2">No courses yet.</h2>
        <p className="text-white/50 max-w-md">
          Connect an existing Whop course or create a new one from scratch.
        </p>
      </div>
    </div>
  );
}
