import { ReactNode } from "react";

type HeaderProps = {
  title: string;
  subtitle?: string;
  action?: ReactNode;
};

export function Header({ title, subtitle, action }: HeaderProps) {
  return (
    <header className="sticky top-0 z-30 border-b border-white/5 bg-[#151515]/80 backdrop-blur-xl">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-4 px-6 py-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-3">
            <span className="h-2.5 w-16 rounded-full bg-gradient-to-r from-[#ff5a1f] to-[#8f94fb] shadow-whop-glow" />
            <span className="text-xs uppercase tracking-[0.45em] text-white/50">
              Whop Product
            </span>
          </div>
          <h1 className="text-3xl font-bold tracking-wide text-white md:text-4xl">
            {title}
          </h1>
          {subtitle && (
            <p className="max-w-lg text-sm text-white/60">{subtitle}</p>
          )}
        </div>
        {action && (
          <div className="flex shrink-0 items-center justify-end">{action}</div>
        )}
      </div>
    </header>
  );
}

