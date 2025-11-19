// app/page.tsx
"use client"; // ← MUST be first line

import { useEffect, useState } from "react";

interface Module {
  id: number;
  name: string;
  description: string;
}

export default function HomePage() {
  const [modules, setModules] = useState<Module[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchModules() {
      try {
        const res = await fetch("/module");
        const data = await res.json();
        setModules(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    fetchModules();
  }, []);

  if (loading) return <p>Loading modules...</p>;

  return (
    <div className="p-8 max-w-3xl mx-auto">
      <h1 className="text-4xl font-bold mb-6">Modules</h1>
      <ul className="space-y-4">
        {modules.map((module) => (
          <li key={module.id} className="border p-4 rounded shadow-sm">
            <h2 className="text-2xl font-semibold">{module.name}</h2>
            <p className="text-gray-600">{module.description}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}

