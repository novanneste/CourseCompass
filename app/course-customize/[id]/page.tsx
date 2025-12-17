"use client";

import { useParams, useRouter } from "next/navigation";
import { useState } from "react";

type ContentItem = {
  id: string;
  title: string;
  type: "file";
  fileName: string;
};

type Milestone = {
  id: string;
  title: string;
  description: string;
  contents: ContentItem[];
};

export default function CourseCompassPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();

  const [milestones, setMilestones] = useState<Milestone[]>([]);
  const [newMilestoneTitle, setNewMilestoneTitle] = useState("");
  const [newMilestoneDescription, setNewMilestoneDescription] = useState("");

  function addMilestone() {
    if (!newMilestoneTitle.trim()) return;

    setMilestones((prev) => [
      ...prev,
      {
        id: crypto.randomUUID(),
        title: newMilestoneTitle,
        description: newMilestoneDescription,
        contents: [],
      },
    ]);

    setNewMilestoneTitle("");
    setNewMilestoneDescription("");
  }

  function addFileContent(milestoneId: string, file: File) {
    setMilestones((prev) =>
      prev.map((m) =>
        m.id === milestoneId
          ? {
              ...m,
              contents: [
                ...m.contents,
                {
                  id: crypto.randomUUID(),
                  title: file.name,
                  type: "file",
                  fileName: file.name,
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
      <div className="mb-8 space-y-3">
        <input
          value={newMilestoneTitle}
          onChange={(e) => setNewMilestoneTitle(e.target.value)}
          placeholder="Milestone title (e.g. Getting Started)"
          className="w-full bg-black border border-white/10 rounded-lg px-4 py-3"
        />

        <textarea
          value={newMilestoneDescription}
          onChange={(e) =>
            setNewMilestoneDescription(e.target.value)
          }
          placeholder="Milestone description"
          className="w-full bg-black border border-white/10 rounded-lg px-4 py-3"
        />

        <button
          onClick={addMilestone}
          className="bg-gradient-to-r from-[#ff5a1f] to-[#ff9966] rounded-lg px-6 py-2 font-semibold"
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
            <h2 className="text-lg font-semibold">
              {milestone.title}
            </h2>

            <p className="text-white/50 text-sm mb-4">
              {milestone.description}
            </p>

            {/* Add Content */}
            <div className="mb-4">
              <label className="block text-sm text-white/60 mb-2">
                Add File Content
              </label>

              <input
                type="file"
                onChange={(e) => {
                  if (e.target.files?.[0]) {
                    addFileContent(
                      milestone.id,
                      e.target.files[0]
                    );
                  }
                }}
              />
            </div>

            {/* Content List */}
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
                    📁 {content.fileName}
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

