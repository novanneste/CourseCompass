"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";

type Module = {
  id: string;
  title: string;
  created_at: string;
};

function ModulesContent() {
  const params = useSearchParams();
  const courseId = params.get("course");

  const [modules, setModules] = useState<Module[]>([]);
  const [loading, setLoading] = useState(true);
  const [role, setRole] = useState<"owner" | "member">("member");
  const [title, setTitle] = useState("");

  const [whopModules, setWhopModules] = useState<any[]>([]);
  const [whopMessage, setWhopMessage] = useState("");

  // Load role
  useEffect(() => {
    const loadRole = async () => {
      const res = await fetch("/api/context");
      const data = await res.json();
      if (data.ok) setRole(data.role);
    };
    loadRole();
  }, []);

  // Fetch modules
  const fetchModules = async () => {
    if (!courseId) return;

    setLoading(true);
    try {
      const res = await fetch(`/api/modules?course=${courseId}`);
      const data = await res.json();
      if (data.ok) setModules(data.modules);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchModules();
  }, [courseId]);

  // Add module
  const createModule = async () => {
    if (!title) return alert("Title required");

    const res = await fetch(`/api/courses/${courseId}/modules`, {
      method: "POST",
      body: JSON.stringify({ title }),
    });

    const data = await res.json();

    if (!data.ok) {
      alert(data.error);
      return;
    }

    setTitle("");
    fetchModules();
  };

  // FETCH WHOP MODULES
  const fetchWhopModules = async () => {
    if (!courseId) return;

    const res = await fetch(`/api/whop-course/${courseId}/modules`);
    const data = await res.json();

    if (!data.ok) {
      setWhopMessage("Could not load Whop modules.");
      return;
    }

    setWhopModules(data.modules);
    setWhopMessage("Whop modules loaded!");
  };

  return (
    <main className="p-8 max-w-3xl mx-auto">
      <h1 className="text-4xl font-bold mb-6">Modules</h1>

      {role === "owner" && (
        <div className="border p-4 rounded-lg shadow-sm mb-8">
          <h2 className="text-xl font-semibold mb-3">Add Module</h2>

          <input
            className="border w-full p-2 rounded mb-2"
            placeholder="Module title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />

          <button
            onClick={createModule}
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
          >
            Add Module
          </button>
        </div>
      )}

      {/* FETCH WHOP MODULES BUTTON */}
      <div className="border p-4 rounded-lg shadow-sm mb-8">
        <h2 className="text-xl font-semibold mb-3">Whop Modules</h2>
        <button
          onClick={fetchWhopModules}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Load Whop Modules
        </button>
        {whopMessage && <p className="mt-2 text-blue-600">{whopMessage}</p>}

        {whopModules.length > 0 && (
          <div className="mt-4 space-y-3">
            {whopModules.map((mod: any) => (
              <div
                key={mod.id}
                className="border p-4 rounded-lg shadow-sm bg-blue-50"
              >
                <h3 className="text-xl font-semibold">{mod.title}</h3>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Normal modules */}
      {loading ? (
        <p>Loading modules...</p>
      ) : modules.length === 0 ? (
        <p>No modules yet.</p>
      ) : (
        <div className="space-y-4">
          {modules.map((m) => (
            <div
              key={m.id}
              className="border p-4 rounded-lg shadow-sm hover:bg-gray-50"
            >
              <h3 className="text-xl font-semibold">{m.title}</h3>
              <p className="text-gray-400 text-sm">
                {new Date(m.created_at).toLocaleString()}
              </p>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}

export default function ModulesPage() {
  return (
    <Suspense fallback={<div className="p-8">Loading modules...</div>}>
      <ModulesContent />
    </Suspense>
  );
}
