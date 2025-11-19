import { forwardRef } from "react";

type CardProps = React.HTMLAttributes<HTMLDivElement> & {
  glow?: boolean;
};

const baseCardStyles =
  "relative overflow-hidden rounded-3xl border border-white/10 bg-[#1a1a1a]/95 p-6 transition-all duration-300 ease-out shadow-[0_24px_65px_rgba(5,6,15,0.55)]";

const hoverStyles =
  "hover:-translate-y-1 hover:shadow-[0_34px_85px_rgba(8,8,18,0.65)]";

const glowStyles =
  "before:absolute before:inset-0 before:-z-10 before:rounded-[inherit] before:opacity-0 before:transition-opacity before:duration-300 before:bg-[radial-gradient(circle_at_top,#ff5a1f33,transparent_65%)] hover:before:opacity-100";

export const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ children, className, glow = true, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={[
          baseCardStyles,
          hoverStyles,
          glow ? glowStyles : "",
          className ?? "",
        ]
          .filter(Boolean)
          .join(" ")}
        {...props}
      >
        <div className="relative z-10 space-y-3 text-white">{children}</div>
      </div>
    );
  }
);

Card.displayName = "Card";

