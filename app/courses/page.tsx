"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type Course = {
  id: string;
  title: string;
  description: string;
  created_at: string;
};

type Module = {
  id: string;
  title: string;
};

export default function CoursesPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [role, setRole] = useState<"owner" | "member">("member");

  // Whop connection
  const [showModal, setShowModal] = useState(false);
  const [whopCourses, setWhopCourses] = useState<any[]>([]);
  const [syncing, setSyncing] = useState(false);

  // Start from scratch
  const [creating, setCreating] = useState(false);
  const [newCourseTitle, setNewCourseTitle] = useState("");
  const [newCourseDescription, setNewCourseDescription] = useState("");
  const [modules, setModules] = useState<Module[]>([]);

  // Load role
  useEffect(() => {
    const loadRole = async () => {
      const res = await fetch("/api/context");
      const data = await res.json();
      if (data.ok) setRole(data.role);
    };
    loadRole();
  }, []);

  // Load existing courses
  const fetchCourses = async () => {
    setLoading(true);
    const res = await fetch("/api/courses");
    const data = await res.json();
    if (data.ok) setCourses(data.courses);
    setLoading(false);
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  // Open whop modal
  const openConnectModal = async () => {
    setShowModal(true);
    const res = await fetch("/api/whop-course/courses");
    const data = await res.json();
    if (data.ok) setWhopCourses(data.courses);
  };

  const syncCourse = async (id: string) => {
    setSyncing(true);
    const res = await fetch("/api/whop-sync", {
      method: "POST",
      body: JSON.stringify({ whopCourseId: id }),
    });
    const data = await res.json();
    setSyncing(false);

    if (!data.ok) return alert(data.error);

    setShowModal(false);
    fetchCourses();
  };

  // Start-from-scratch logic
  const addModule = () => {
    setModules([
      ...modules,
      { id: Date.now().toString(), title: "" }
    ]);
  };

  const updateModuleTitle = (id: string, title: string) => {
    setModules(modules.map(m => m.id === id ? { ...m, title } : m));
  };

  const removeModule = (id: string) => {
    setModules(modules.filter(m => m.id !== id));
  };

  const saveNewCourse = async () => {
    if (!newCourseTitle) return alert("Enter course title");
    if (modules.length === 0) return alert("Add at least one module");

    const res = await fetch("/api/courses", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: newCourseTitle,
        description: newCourseDescription,
      }),
    });

    const data = await res.json();
    if (!data.ok) return alert(data.error);

    const courseId = data.course.id;

    for (const m of modules) {
      await fetch(`/api/courses/${courseId}/modules`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: m.title }),
      });
    }

    setCreating(false);
    setNewCourseTitle("");
    setNewCourseDescription("");
    setModules([]);

    fetchCourses();
  };

  return (
    <main className="p-8 max-w-3xl mx-auto">
      <h1 className="text-4xl font-bold mb-6">Your Courses</h1>

      {/* Only owners can create */}
      {role === "owner" && (
        <div className="p-4 border rounded mb-6">
          <h2 className="text-xl font-semibold">Create Course</h2>

          {!creating && (
            <div className="space-y-2 mt-2">
              <button
                onClick={() => setCreating(true)}
                className="bg-yellow-600 text-white px-4 py-2 rounded"
              >
                Start from Scratch
              </button>
            </div>
          )}

          {creating && (
            <div className="mt-4 space-y-3 border p-3 bg-gray-50 rounded">
              <input
                className="border p-2 w-full rounded"
                placeholder="Course Title"
                value={newCourseTitle}
                onChange={(e) => setNewCourseTitle(e.target.value)}
              />

              <textarea
                className="border p-2 w-full rounded"
                placeholder="Course Description"
                value={newCourseDescription}
                onChange={(e) => setNewCourseDescription(e.target.value)}
              />

              <div>
                <h3 className="font-semibold">Modules</h3>

                {modules.map((m) => (
                  <div key={m.id} className="flex items-center space-x-2 mt-2">
                    <input
                      className="border p-2 rounded w-full"
                      placeholder="Module Title"
                      value={m.title}
                      onChange={(e) => updateModuleTitle(m.id, e.target.value)}
                    />

                    <button
                      onClick={() => removeModule(m.id)}
                      className="bg-red-600 text-white px-2 py-1 rounded"
                    >
                      Remove
                    </button>
                  </div>
                ))}

                <button
                  onClick={addModule}
                  className="mt-2 bg-blue-600 text-white px-3 py-1 rounded"
                >
                  Add Module
                </button>
              </div>

              <div className="space-x-2 mt-3">
                <button
                  onClick={saveNewCourse}
                  className="bg-green-600 text-white px-4 py-2 rounded"
                >
                  Save Course
                </button>

                <button
                  onClick={() => setCreating(false)}
                  className="bg-gray-300 px-4 py-2 rounded"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}

          <div className="mt-4">
            <button
              onClick={openConnectModal}
              className="bg-green-600 text-white px-4 py-2 rounded"
            >
              Connect Whop Course
            </button>
          </div>
        </div>
      )}

      {/* Courses list */}
      <hr className="my-4" />

      {loading ? (
        <p>Loading...</p>
      ) : courses.length === 0 ? (
        <p>No courses yet.</p>
      ) : (
        <div className="space-y-4">
          {courses.map((course) => (
            <Link key={course.id} href={`/modules?course=${course.id}`}>
              <div className="border p-4 rounded hover:bg-gray-50 cursor-pointer">
                <h2 className="text-xl font-semibold">{course.title}</h2>
                <p className="text-gray-600">{course.description}</p>
                <p className="text-sm text-gray-400">
                  {new Date(course.created_at).toLocaleString()}
                </p>
              </div>
            </Link>
          ))}
        </div>
      )}

      {/* Whop modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
          <div className="bg-white p-6 rounded max-w-md w-full">
            <h2 className="text-2xl font-bold mb-3">Select Whop Course</h2>

            {whopCourses.length === 0 ? (
              <p>No courses found.</p>
            ) : (
              <div className="space-y-3">
                {whopCourses.map((c) => (
                  <div key={c.id} className="border p-3 rounded flex justify-between">
                    <div>
                      <p className="font-semibold">{c.title}</p>
                      <p className="text-sm text-gray-600">{c.description}</p>
                    </div>

                    <button
                      disabled={syncing}
                      onClick={() => syncCourse(c.id)}
                      className="bg-blue-600 text-white px-3 py-1 rounded"
                    >
                      {syncing ? "Syncing…" : "Sync"}
                    </button>
                  </div>
                ))}
              </div>
            )}

            <button
              onClick={() => setShowModal(false)}
              className="mt-4 w-full bg-gray-300 py-2 rounded"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </main>
  );
}
