import { getSportIconComponent } from "@/utils/sportIcons";

/**
 * Reusable SportIcon Component.
 * Supports string names (e.g., "HS Basketball", "Tennis", "Softball") or objects,
 * and passes all props (className, style, size, etc.) directly to the SVG icon.
 *
 * @example
 * <SportIcon sport="HS Basketball" className="w-5 h-5 text-primary" />
 * <SportIcon sport={camp.sports_type_name} className="text-amber-500" />
 */
export default function SportIcon({
  sport,
  name,
  sports_type,
  sports_name,
  className = "",
  fallbackIcon,
  ...props
}) {
  const target = sport || name || sports_type || sports_name;
  const IconComponent = getSportIconComponent(target, fallbackIcon);

  return <IconComponent className={className} {...props} />;
}
