"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";

type Role = "owner" | "member";
type CourseAudience = Role | "all";

type Course = {
  title: string;
  description: string;
  audience: CourseAudience;
};

export default function DashboardPage() {
  const [role, setRole] = useState<Role | null>(null);
  const [courses, setCourses] = useState<Course[]>([]);

  // -------------------------------
  // Fetch real Whop context
  // -------------------------------
  useEffect(() => {
    async function fetchContext() {
      try {
        const res = await fetch("/api/context");
        const data = await res.json();

        if (data.ok && data.context?.user?.role) {
          setRole(data.context.user.role);
        } else {
          setRole("member"); // fallback if no role detected
        }
      } catch (err) {
        console.error(err);
        setRole("member"); // fallback on error
      }
    }

    fetchContext();
  }, []);

  // -------------------------------
  // Filter visible courses by role
  // -------------------------------
  const visibleCourses = useMemo(() => {
    if (!role) return [];
    return courses.filter(
      (course) => course.audience === "all" || course.audience === role
    );
  }, [courses, role]);

  // -------------------------------
  // Add a new course
  // -------------------------------
  const addCourse = () => {
    const title = prompt("Course title");
    if (!title) return;
    const description = prompt("Short description for members");
    if (!description) return;

    const audiencePrompt = prompt(
      'Who should see this course? Type "owner", "member", or "all".',
      "member"
    );

    const sanitizedAudience: CourseAudience =
      audiencePrompt === "owner" || audiencePrompt === "all"
        ? audiencePrompt
        : "member";

    setCourses((prev) => [
      ...prev,
      { title, description, audience: sanitizedAudience },
    ]);
  };

  // -------------------------------
  // Loading state
  // -------------------------------
  if (!role) {
    return (
      <div className="flex min-h-screen items-center justify-center text-white">
        Loading Whop experience...
      </div>
    );
  }

  const roleCopy =
    role === "owner"
      ? {
          greeting: "Welcome back, Creator 👋",
          helper:
            "You’re viewing the Owner dashboard. Manage courses and preview what members see.",
          badge: "Owner Mode",
        }
      : {
          greeting: "Welcome back, Member 👋",
          helper:
            "This is the Member dashboard. Access the courses shared with you here.",
          badge: "Member Mode",
        };

  return (
    <div className="relative min-h-screen bg-[#0e0e0e] text-white px-8 py-12">
      {/* Subtle background glows */}
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top_right,rgba(255,90,31,0.12),transparent_55%),radial-gradient(circle_at_bottom_left,rgba(143,148,251,0.08),transparent_50%)]" />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6 mb-10">
        <div>
          <h1 className="text-3xl font-semibold tracking-wide">
            {roleCopy.greeting}
          </h1>
          <p className="text-white/60 mt-2">{roleCopy.helper}</p>
        </div>

        {role === "owner" && (
          <button
            onClick={addCourse}
            className="bg-gradient-to-r from-[#ff5a1f] to-[#ff9966] hover:shadow-[0_0_20px_rgba(255,90,31,0.6)] px-6 py-2 rounded-xl font-semibold transition-all duration-200"
          >
            + Add Course
          </button>
        )}
      </div>

      {/* Role Badge */}
      <div className="inline-block mb-8">
        <span className="rounded-full border border-[#ff5a1f]/30 bg-[#ff5a1f]/10 px-3 py-1 text-xs font-semibold uppercase tracking-widest text-[#ff9966]">
          {roleCopy.badge}
        </span>
      </div>

      {/* Courses Section */}
      {courses.length === 0 ? (
        <div className="flex flex-col items-center justify-center mt-20 text-center">
          <Image
            src="/logo.png"
            alt="Course Compass"
            width={80}
            height={80}
            className="mb-6 opacity-70"
          />
          <h2 className="text-2xl font-semibold mb-2">
            🚀 No courses yet — start by adding your first one!
          </h2>
          <p className="text-white/60 max-w-md mb-6">
            {role === "owner"
              ? "Launch your first course to build out your member experience."
              : "Your creator hasn’t shared any courses yet. Check back soon!"}
          </p>
          {role === "owner" && (
            <button
              onClick={addCourse}
              className="bg-gradient-to-r from-[#ff5a1f] to-[#ff9966] hover:shadow-[0_0_20px_rgba(255,90,31,0.6)] px-6 py-2 rounded-xl font-semibold transition-all duration-200"
            >
              Create Course
            </button>
          )}
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {visibleCourses.map((course, index) => (
            <div
              key={index}
              className="rounded-2xl bg-[#1a1a1a] p-6 border border-white/10 hover:shadow-[0_0_30px_rgba(255,90,31,0.15)] transition-all duration-200"
            >
              <div className="flex justify-between items-start mb-3">
                <h3 className="text-lg font-semibold">{course.title}</h3>
                <span
                  className={`text-xs uppercase tracking-wider px-3 py-1 rounded-full ${
                    course.audience === "owner"
                      ? "bg-[#ff5a1f]/20 text-[#ff9a73]"
                      : course.audience === "member"
                      ? "bg-[#8f94fb]/20 text-[#c3c7ff]"
                      : "bg-white/10 text-white/80"
                  }`}
                >
                  {course.audience === "all"
                    ? "Everyone"
                    : `${course.audience} only`}
                </span>
              </div>
              <p className="text-white/70 text-sm">{course.description}</p>

              {role === "owner" && (
                <div className="flex gap-3 pt-4">
                  <button className="bg-[#2a2a2a] hover:bg-[#3a3a3a] text-xs font-semibold px-4 py-2 rounded-md text-white/80 hover:text-white transition">
                    Edit
                  </button>
                  <button className="bg-[#ff5a1f]/10 text-[#ff9a73] hover:bg-[#ff5a1f]/20 text-xs font-semibold px-4 py-2 rounded-md transition">
                    Share
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
