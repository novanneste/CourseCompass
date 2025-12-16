"use client";

import { useParams, useRouter } from "next/navigation";
import { useState } from "react";

type ContentItem = {
  id: string;
  title: string;
};

type Milestone = {
  id: string;
  title: string;
  contents: ContentItem[];
};

export default function CourseCompassPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();

  const [milestones, setMilestones] = useState<Milestone[]>([]);
  const [newMilestoneTitle, setNewMilestoneTitle] = useState("");

  function addMilestone() {
    if (!newMilestoneTitle.trim()) return;

    setMilestones([
      ...milestones,
      {
        id: crypto.randomUUID(),
        title: newMilestoneTitle,
        contents: [],
      },
    ]);

    setNewMilestoneTitle("");
  }

  function addContent(milestoneId: string) {
    setMilestones((prev) =>
      prev.map((m) =>
        m.id === milestoneId
          ? {
              ...m,
              contents: [
                ...m.contents,
                {
                  id: crypto.randomUUID(),
                  title: `New Content ${m.contents.length + 1}`,
                },
              ],
            }
          : m
      )
    );
  }

  return (
    <div className="min-h-screen bg-[#0e0e0e] text-white px-8 py-10">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">Course Compass</h1>
          <p className="text-white/50 text-sm">
            Build and organize your course
          </p>
        </div>

        <button
          onClick={() => router.push("/")}
          className="border border-white/10 rounded-lg px-4 py-2 hover:bg-white/5"
        >
          Back to Dashboard
        </button>
      </div>

      {/* Add Milestone */}
      <div className="mb-6 flex gap-3">
        <input
          value={newMilestoneTitle}
          onChange={(e) => setNewMilestoneTitle(e.target.value)}
          placeholder="Milestone title (e.g. Getting Started)"
          className="flex-1 bg-black border border-white/10 rounded-lg px-4 py-3"
        />

        <button
          onClick={addMilestone}
          className="bg-gradient-to-r from-[#ff5a1f] to-[#ff9966] rounded-lg px-6 font-semibold"
        >
          Add Milestone
        </button>
      </div>

      {/* Milestones */}
      <div className="space-y-6">
        {milestones.length === 0 && (
          <p className="text-white/40">
            No milestones yet. Add your first one above.
          </p>
        )}

        {milestones.map((milestone) => (
          <div
            key={milestone.id}
            className="bg-[#141414] border border-white/10 rounded-xl p-6"
          >
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold">{milestone.title}</h2>

              <button
                onClick={() => addContent(milestone.id)}
                className="text-sm border border-white/10 rounded-lg px-3 py-1 hover:bg-white/5"
              >
                + Add Content
              </button>
            </div>

            {milestone.contents.length === 0 ? (
              <p className="text-white/40 text-sm">
                No content yet.
              </p>
            ) : (
              <ul className="space-y-2">
                {milestone.contents.map((content) => (
                  <li
                    key={content.id}
                    className="bg-black border border-white/10 rounded-lg px-4 py-2 text-sm"
                  >
                    {content.title}
                  </li>
                ))}
              </ul>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
