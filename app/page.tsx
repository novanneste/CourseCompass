"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type Course = {
  id: string;
  title: string;
  description?: string;
};

export default function HomePage() {
  const router = useRouter();
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchCourses() {
      try {
        const res = await fetch("/api/courses", {
          cache: "no-store",
        });

        if (!res.ok) {
          throw new Error("Failed to fetch courses");
        }

        const data = await res.json();
        setCourses(data.courses || []);
      } catch (err) {
        console.error("Fetch courses error:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchCourses();
  }, []);

  return (
    <div className="min-h-screen bg-[#0e0e0e] text-white px-8 py-16">
      <h1 className="text-4xl font-bold mb-4">Course Compass</h1>
      <p className="text-white/50 mb-8">Manage your courses easily</p>

      <div className="flex gap-4 mb-10">
        <button
          onClick={() => router.push("/courses")}
          className="bg-[#1a1a1a] border border-white/10 py-3 px-6 rounded-xl font-semibold text-white hover:bg-[#222]"
        >
          Your Courses
        </button>

        <button
          onClick={() => router.push("/new-course")}
          className="bg-[#ff5a1f] py-3 px-6 rounded-xl font-semibold text-white hover:bg-[#ff7a3f]"
        >
          Start From Scratch
        </button>

        <button
          onClick={() => router.push("/connect")}
          className="bg-[#1a1a1a] border border-white/10 py-3 px-6 rounded-xl font-semibold text-white hover:bg-[#222]"
        >
          Connect Whop Course
        </button>
      </div>

      <div>
        {loading && <p>Loading courses...</p>}
        {!loading && courses.length === 0 && <p>No courses yet.</p>}
        {!loading && courses.length > 0 && (
          <div className="space-y-4">
            {courses.map((course) => (
              <div
                key={course.id}
                className="bg-[#141414] border border-white/10 rounded-xl p-4"
              >
                <h2 className="text-lg font-semibold">{course.title}</h2>
                {course.description && (
                  <p className="text-white/50 text-sm">
                    {course.description}
                  </p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
