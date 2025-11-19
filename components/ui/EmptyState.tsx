import { ReactNode } from "react";

type EmptyStateProps = {
  title: string;
  description: string;
  icon?: ReactNode;
  action?: ReactNode;
};

export function EmptyState({
  title,
  description,
  icon,
  action,
}: EmptyStateProps) {
  return (
    <div className="relative mx-auto max-w-2xl animate-fadeIn overflow-hidden rounded-3xl bg-[#1a1a1a]/60 p-[1px] shadow-[0_28px_80px_rgba(6,6,18,0.65)]">
      <div className="absolute inset-0 -z-10 bg-gradient-to-r from-[#ff5a1f] via-[#ff7843] to-[#8f94fb] opacity-60 blur-2xl" />
      <div className="relative rounded-[calc(1.5rem-1px)] bg-[#101010]/95 px-10 py-12 text-center shadow-[inset_0_0_45px_rgba(255,90,31,0.08)]">
        <div className="mx-auto flex w-fit flex-col items-center gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#ff5a1f]/15 text-3xl shadow-whop-glow">
            {icon ?? "🚀"}
          </div>
          <div className="space-y-3">
            <h2 className="text-2xl font-semibold text-white">{title}</h2>
            <p className="text-sm text-white/65">{description}</p>
          </div>
        </div>
        {action && <div className="mt-8 flex justify-center">{action}</div>}
      </div>
    </div>
  );
}

