import { cn } from "@/lib/utils";

/**
 * Themed section card used across director-dashboard forms.
 * Matches the app theme: white card, border-border, rounded-[10px],
 * icon chip + title + description in the header.
 */
const SectionCard = ({ icon, title, description, className, children }) => {
  return (
    <div
      className={cn(
        "bg-white border border-border rounded-[10px] overflow-hidden",
        className,
      )}
    >
      <div className="flex items-start gap-3.5 px-5 sm:px-7 py-5 border-b border-border">
        <span className="w-10 h-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center text-xl shrink-0">
          {icon}
        </span>
        <div>
          <h3 className="text-lg font-medium text-[#333] leading-tight">
            {title}
          </h3>
          {description && (
            <p className="text-sm text-[#666] mt-0.5">{description}</p>
          )}
        </div>
      </div>
      {children}
    </div>
  );
};

export default SectionCard;
