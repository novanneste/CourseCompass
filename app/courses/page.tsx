"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type Course = {
  id: string;
  title: string;
  description: string;
  created_at: string;
};

export default function CoursesPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [role, setRole] = useState<"owner" | "member">("member");

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [message, setMessage] = useState("");

  // Fetch Whop role
  useEffect(() => {
    const loadRole = async () => {
      try {
        const res = await fetch("/api/context");
        const data = await res.json();
        if (data.ok) setRole(data.role);
      } catch (e) {
        console.error(e);
      }
    };
    loadRole();
  }, []);

  // Fetch courses
  const fetchCourses = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/courses");
      const data = await res.json();
      if (data.ok) setCourses(data.courses);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  // Create course
  const createCourse = async () => {
    if (!title || !description) return alert("Fill all fields");

    const res = await fetch("/api/courses", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, description }),
    });

    const data = await res.json();

    if (!data.ok) {
      alert(data.error);
      return;
    }

    setTitle("");
    setDescription("");
    fetchCourses();
  };

  // Connect Whop Course button
  const handleConnectWhop = () => {
    console.log("Connect Whop Course clicked!");
    setMessage("Button clicked! Your Whop courses will appear here soon.");
  };

  return (
    <main className="p-8 max-w-3xl mx-auto">
      <h1 className="text-4xl font-bold mb-6">Your Courses</h1>

      {/* Owner Controls */}
      {role === "owner" && (
        <div className="border p-4 rounded-lg shadow-sm mb-8 space-y-4">
          {/* Create Course */}
          <div>
            <h2 className="text-xl font-semibold mb-3">Create Course</h2>
            <input
              className="border w-full p-2 rounded mb-2"
              placeholder="Course title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
            <textarea
              className="border w-full p-2 rounded mb-2"
              placeholder="Course description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
            <button
              onClick={createCourse}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              Create Course
            </button>
          </div>
        </div>
      )}

      {/* Connect Whop Course — always visible for now */}
      <div className="border p-4 rounded-lg shadow-sm mb-8">
        <h2 className="text-xl font-semibold mb-3">Connect Existing Course</h2>
        <button
          onClick={handleConnectWhop}
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          Connect Whop Course
        </button>
        {message && <p className="mt-2 text-green-600">{message}</p>}
      </div>

      {/* Courses List */}
      {loading ? (
        <p>Loading courses...</p>
      ) : courses.length === 0 ? (
        <p>No courses yet.</p>
      ) : (
        <div className="space-y-4">
          {courses.map((course) => (
            <Link key={course.id} href={`/modules?course=${course.id}`}>
              <div className="border p-4 rounded-lg shadow-sm hover:bg-gray-50 cursor-pointer">
                <h2 className="text-2xl font-semibold">{course.title}</h2>
                <p className="text-gray-600">{course.description}</p>
                <p className="text-gray-400 text-sm">
                  {new Date(course.created_at).toLocaleString()}
                </p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </main>
  );
}
