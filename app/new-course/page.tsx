"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type OnboardingStep = 1 | 2;

export default function NewCoursePage() {
  const router = useRouter();

  const [step, setStep] = useState<OnboardingStep>(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Step 1
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  // Step 2
  const [objective, setObjective] = useState("");
  const [audience, setAudience] = useState("");

  async function createCourse() {
    if (!title.trim()) {
      setError("Course title is required");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/courses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          description,
          objective,
          audience,
        }),
      });

      const text = await res.text();
      if (!text) throw new Error("Empty response from server");

      const data = JSON.parse(text);

      if (!res.ok) {
        throw new Error(data.error || "Failed to create course");
      }

      router.push(`/course-customize/${data.id}`);
    } catch (err: any) {
      setError(err.message);
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#0e0e0e] text-white flex items-center justify-center px-6">
      <div className="w-full max-w-xl bg-[#141414] border border-white/10 rounded-2xl p-8">

        <h1 className="text-3xl font-bold mb-2">Start From Scratch</h1>
        <p className="text-white/60 mb-6">
          Let’s set up the foundation for your course.
        </p>

        {error && (
          <div className="mb-4 rounded-lg bg-red-500/10 border border-red-500/30 p-3 text-red-400 text-sm">
            {error}
          </div>
        )}

        {/* STEP 1 */}
        {step === 1 && (
          <>
            <div className="mb-4">
              <label className="block text-sm mb-1">Course Title</label>
              <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Master React from Zero"
                className="w-full bg-black border border-white/10 rounded-lg px-4 py-3"
              />
            </div>

            <div className="mb-6">
              <label className="block text-sm mb-1">
                Short Description (optional)
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
                className="w-full bg-black border border-white/10 rounded-lg px-4 py-3"
              />
            </div>

            <button
              onClick={() => setStep(2)}
              className="w-full bg-gradient-to-r from-[#ff5a1f] to-[#ff9966] py-3 rounded-lg font-semibold"
            >
              Continue
            </button>
          </>
        )}

        {/* STEP 2 */}
        {step === 2 && (
          <>
            <div className="mb-4">
              <label className="block text-sm mb-1">
                Learning Objective
              </label>
              <input
                value={objective}
                onChange={(e) => setObjective(e.target.value)}
                placeholder="What will students be able to do?"
                className="w-full bg-black border border-white/10 rounded-lg px-4 py-3"
              />
            </div>

            <div className="mb-6">
              <label className="block text-sm mb-1">
                Target Audience
              </label>
              <input
                value={audience}
                onChange={(e) => setAudience(e.target.value)}
                placeholder="Who is this course for?"
                className="w-full bg-black border border-white/10 rounded-lg px-4 py-3"
              />
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setStep(1)}
                className="flex-1 border border-white/10 rounded-lg py-3"
              >
                Back
              </button>

              <button
                onClick={createCourse}
                disabled={loading}
                className="flex-1 bg-gradient-to-r from-[#ff5a1f] to-[#ff9966] rounded-lg py-3 font-semibold disabled:opacity-60"
              >
                {loading ? "Creating..." : "Create Course"}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
