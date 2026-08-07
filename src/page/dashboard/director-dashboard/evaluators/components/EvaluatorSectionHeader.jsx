import { cn } from "@/lib/utils";

const toneStyles = {
  primary: {
    tile: "bg-primary/10 text-primary",
    pill: "bg-primary/10 text-primary border-primary/20",
    dot: "bg-primary",
  },
  amber: {
    tile: "bg-amber-50 text-amber-600",
    pill: "bg-amber-50 text-amber-700 border-amber-200",
    dot: "bg-amber-500",
  },
  red: {
    tile: "bg-red-50 text-red-500",
    pill: "bg-red-50 text-red-600 border-red-200",
    dot: "bg-red-500",
  },
};

const EvaluatorSectionHeader = ({
  icon: Icon,
  title,
  subtitle,
  count = 0,
  countLabel,
  tone = "primary",
}) => {
  const styles = toneStyles[tone] || toneStyles.primary;

  return (
    <div className="flex items-center gap-3.5 mb-6">
      <span
        className={cn(
          "w-11 h-11 rounded-xl flex items-center justify-center text-xl shrink-0",
          styles.tile,
        )}
      >
        <Icon />
      </span>
      <div className="flex-1 min-w-0">
        <h2 className="text-lg font-semibold text-[#333] leading-tight">
          {title}
        </h2>
        <p className="text-sm text-[#666] mt-0.5">{subtitle}</p>
      </div>
      <span
        className={cn(
          "inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full border shrink-0",
          styles.pill,
        )}
      >
        <span className={cn("size-1.5 rounded-full", styles.dot)} />
        {count} {countLabel}
      </span>
    </div>
  );
};

export default EvaluatorSectionHeader;
