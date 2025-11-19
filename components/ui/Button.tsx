import { forwardRef } from "react";

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  glow?: boolean;
};

const baseStyles =
  "group relative inline-flex items-center justify-center gap-2 rounded-xl px-5 py-2.5 text-sm font-semibold uppercase tracking-[0.18em] transition-all duration-300 ease-out focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#ff5a1f]/70";

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, children, glow = true, ...props }, ref) => {
    const composedClassName = [
      baseStyles,
      glow ? "hover:-translate-y-[2px]" : "bg-white/10 hover:bg-white/15",
      className ?? "",
    ]
      .filter(Boolean)
      .join(" ");

    return (
      <button ref={ref} className={composedClassName} {...props}>
        {glow ? (
          <>
            <span className="absolute inset-0 rounded-xl bg-gradient-to-r from-[#ff7038]/60 via-[#ff5a1f]/75 to-[#ff844e]/60 opacity-0 blur-lg transition-opacity duration-300 ease-out group-hover:opacity-100" />
            <span className="absolute inset-[1px] rounded-[0.9rem] bg-gradient-to-r from-[#ff5a1f] via-[#ff7038] to-[#ff8c59]" />
            <span className="relative inline-flex items-center justify-center text-white drop-shadow-[0_4px_18px_rgba(255,90,31,0.35)]">
              {children}
            </span>
          </>
        ) : (
          <span className="relative inline-flex items-center text-white">
            {children}
          </span>
        )}
      </button>
    );
  }
);

Button.displayName = "Button";

