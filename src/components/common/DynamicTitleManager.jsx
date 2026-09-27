import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { getTitleForPathname } from "@/utils/routeTitles";

/**
 * Global component that listens to route changes and automatically updates document.title.
 */
export default function DynamicTitleManager() {
  const { pathname } = useLocation();

  useEffect(() => {
    const title = getTitleForPathname(pathname);
    document.title = title;
  }, [pathname]);

  return null;
}
