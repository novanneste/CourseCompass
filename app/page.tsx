export default function HomePage() {
  return (
    <div className="min-h-screen bg-[#0e0e0e] text-white px-8 py-16 flex flex-col items-center justify-center">
      <h1 className="text-4xl font-bold mb-4">Course Compass</h1>
      <p className="text-white/50 mb-8">Manage your Whop courses easily</p>
      <a
        href="/courses"
        className="bg-[#1a1a1a] border border-white/10 py-3 px-6 rounded-xl font-semibold text-center hover:bg-[#222] transition-all"
      >
        View Courses
      </a>
    </div>
  );
}
