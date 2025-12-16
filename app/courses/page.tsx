"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type Course = {
  id: string;
  title: string;
  description?: string;
};

export default function CoursesPage() {
  const router = useRouter();
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch all courses
  useEffect(() => {
    async function fetchCourses() {
      try {
        const res = await fetch("/api/courses");
        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.error || "Failed to fetch courses");
        }

        setCourses(data.courses || []);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchCourses();
  }, []);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center text-white">
        Loading courses...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0e0e0e] text-white px-8 py-16 flex flex-col items-center">
      <h1 className="text-4xl font-bold mb-4">Your Courses</h1>

      {/* Create new course button */}
      <button
        onClick={() => router.push("/new-course")}
        className="mb-8 w-full max-w-sm bg-[#1a1a1a] border border-white/10 py-3 rounded-xl font-semibold text-center hover:bg-[#222] transition-all"
      >
        Start From Scratch
      </button>

      {/* Error */}
      {error && (
        <p className="text-red-400 mb-4">{error}</p>
      )}

      {/* Courses list */}
      {courses.length === 0 ? (
        <p className="text-white/50">No courses yet. Start by creating one!</p>
      ) : (
        <div className="flex flex-col gap-4 w-full max-w-md">
          {courses.map((course) => (
            <div
              key={course.id}
              className="bg-[#141414] border border-white/10 rounded-xl p-4 hover:border-orange-500 transition cursor-pointer"
              onClick={() => router.push(`/course-customize/${course.id}`)}
            >
              <h2 className="font-semibold text-lg">{course.title}</h2>
              {course.description && (
                <p className="text-white/50 text-sm mt-1">{course.description}</p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
