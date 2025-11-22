"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { createClient } from "@supabase/supabase-js";

type Module = {
  id: string;
  title: string;
};

type Theme = {
  primaryColor: string;
  secondaryColor: string;
  backgroundColor: string;
  font: string;
};

type Layout = {
  moduleOrder: string[];
};

type Course = {
  id: string;
  title: string;
  description: string;
  theme?: Theme;
  layout?: Layout;
};

export default function CourseCustomizePage() {
  const router = useRouter();
  const params = useParams();
  const courseId = params.id as string;

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const [course, setCourse] = useState<Course | null>(null);
  const [modules, setModules] = useState<Module[]>([]);
  const [theme, setTheme] = useState<Theme>({
    primaryColor: "#1D4ED8",
    secondaryColor: "#FBBF24",
    backgroundColor: "#ffffff",
    font: "Inter",
  });
  const [layout, setLayout] = useState<Layout>({ moduleOrder: [] });
  const [saving, setSaving] = useState(false);

  // Fetch course and modules
  useEffect(() => {
    const fetchCourse = async () => {
      const { data: c } = await supabase
        .from("courses")
        .select("*")
        .eq("id", courseId)
        .single();
      if (c) {
        setCourse(c);
        if (c.theme) setTheme(c.theme);
        if (c.layout) setLayout(c.layout);
      }

      const { data: mods } = await supabase
        .from("modules")
        .select("*")
        .eq("course_id", courseId)
        .order("created_at", { ascending: true });

      if (mods) {
        setModules(mods);
        if (!layout.moduleOrder.length)
          setLayout({ moduleOrder: mods.map((m) => m.id) });
      }
    };

    fetchCourse();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [courseId]);

  // Move module up/down
  const moveModule = (index: number, direction: "up" | "down") => {
    const newOrder = [...layout.moduleOrder];
    if (direction === "up" && index > 0) {
      [newOrder[index - 1], newOrder[index]] = [newOrder[index], newOrder[index - 1]];
    }
    if (direction === "down" && index < newOrder.length - 1) {
      [newOrder[index], newOrder[index + 1]] = [newOrder[index + 1], newOrder[index]];
    }
    setLayout({ moduleOrder: newOrder });
  };

  // Save customization
  const saveCustomization = async () => {
    setSaving(true);
    const { error } = await supabase
      .from("courses")
      .update({ theme: theme, layout: layout })
      .eq("id", courseId);
    setSaving(false);
    if (error) {
      alert("Failed to save: " + error.message);
      return;
    }
    alert("Customization saved!");
    router.refresh();
  };

  return (
    <main className="p-8 max-w-3xl mx-auto">
      <h1 className="text-4xl font-bold mb-6">{course?.title || "Customize Course"}</h1>

      <section className="border p-4 rounded-lg shadow-sm mb-6 space-y-4">
        <h2 className="text-xl font-semibold">Colors</h2>
        <div className="flex gap-4 items-center">
          <label>
            Primary:
            <input
              type="color"
              value={theme.primaryColor}
              onChange={(e) => setTheme({ ...theme, primaryColor: e.target.value })}
              className="ml-2"
            />
          </label>
          <label>
            Secondary:
            <input
              type="color"
              value={theme.secondaryColor}
              onChange={(e) => setTheme({ ...theme, secondaryColor: e.target.value })}
              className="ml-2"
            />
          </label>
          <label>
            Background:
            <input
              type="color"
              value={theme.backgroundColor}
              onChange={(e) => setTheme({ ...theme, backgroundColor: e.target.value })}
              className="ml-2"
            />
          </label>
        </div>

        <div>
          <h2 className="text-xl font-semibold">Font</h2>
          <select
            value={theme.font}
            onChange={(e) => setTheme({ ...theme, font: e.target.value })}
            className="border p-2 rounded"
          >
            <option value="Inter">Inter</option>
            <option value="Roboto">Roboto</option>
            <option value="Poppins">Poppins</option>
          </select>
        </div>
      </section>

      <section className="border p-4 rounded-lg shadow-sm mb-6">
        <h2 className="text-xl font-semibold mb-2">Module Order</h2>
        <ul className="space-y-2">
          {layout.moduleOrder.map((id, index) => {
            const module = modules.find((m) => m.id === id);
            if (!module) return null;
            return (
              <li
                key={module.id}
                className="border p-3 rounded bg-gray-50 shadow-sm flex justify-between items-center"
              >
                <span>{module.title}</span>
                <div className="flex gap-2">
                  <button
                    onClick={() => moveModule(index, "up")}
                    className="bg-gray-300 px-2 py-1 rounded hover:bg-gray-400"
                  >
                    ↑
                  </button>
                  <button
                    onClick={() => moveModule(index, "down")}
                    className="bg-gray-300 px-2 py-1 rounded hover:bg-gray-400"
                  >
                    ↓
                  </button>
                </div>
              </li>
            );
          })}
        </ul>
      </section>

      <button
        onClick={saveCustomization}
        disabled={saving}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        {saving ? "Saving…" : "Save Customization"}
      </button>
    </main>
  );
}
        