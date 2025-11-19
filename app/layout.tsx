import "./globals.css";
import Image from "next/image";

export const metadata = {
  title: "Course Compass",
  description: "Manage your Whop courses easily",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen text-white">
        <div className="relative flex min-h-screen flex-col bg-[linear-gradient(180deg,#0e0e0e,#121212)]">
          {/* Background Glow */}
          <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top_right,rgba(255,90,31,0.12),transparent_55%),radial-gradient(circle_at_bottom_left,rgba(143,148,251,0.1),transparent_60%)]" />

          {/* Header with Logo */}
          <header className="flex items-center justify-between px-8 py-6">
            <div className="flex items-center gap-3">
              <Image
                src="/logo.png" // or "/logo.svg"
                alt="Course Compass Logo"
                width={40}
                height={40}
                className="rounded-lg"
              />
              <h1 className="text-xl font-semibold tracking-wide">
                Course Compass
              </h1>
            </div>
          </header>

          {/* Main Content */}
          <main className="flex-1">{children}</main>
        </div>
      </body>
    </html>
  );
}
