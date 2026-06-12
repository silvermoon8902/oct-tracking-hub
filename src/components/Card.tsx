import { ReactNode } from "react";

type CardProps = {
  title?: string;
  subtitle?: string;
  action?: ReactNode;
  className?: string;
  bodyClassName?: string;
  children: ReactNode;
};

export default function Card({
  title,
  subtitle,
  action,
  className = "",
  bodyClassName = "",
  children,
}: CardProps) {
  return (
    <section
      className={`rounded-xl border border-border bg-surface shadow-sm ${className}`}
    >
      {(title || action) && (
        <div className="flex items-start justify-between gap-3 border-b border-border px-5 py-4">
          <div>
            {title && (
              <h3 className="text-sm font-semibold text-foreground">{title}</h3>
            )}
            {subtitle && <p className="mt-0.5 text-xs text-muted">{subtitle}</p>}
          </div>
          {action && <div className="shrink-0">{action}</div>}
        </div>
      )}
      <div className={`px-5 py-4 ${bodyClassName}`}>{children}</div>
    </section>
  );
}
